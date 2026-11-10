import test from "node:test";
import assert from "node:assert/strict";
import { Ledger } from "../src/ledger.js";
import { Runner, type Result } from "../src/runner.js";
import { runCase } from "../src/analysis.js";
import { planCase } from "../src/workflows.js";
import { tokenDataAnalysis } from "../src/token-data-metrics.js";
import { previewCase } from "../src/workflow-preview.js";
import {
  dataSkillIds,
  tokenDataFixture,
  token,
  wallet,
  pool,
  at,
} from "./fixtures/token-data.js";

function inputFor(kind: string, extra = {}) {
  return {
    kind,
    ...(kind === "skill-launchpad-trending" ? {} : { address: token }),
    ...(["skill-token-stats", "skill-top-trader-analysis"].includes(kind)
      ? {}
      : { from: at - 86400, to: at }),
    ...extra,
  };
}
async function execute(kind: string, extra = {}, budget?: number) {
  const plan = planCase(inputFor(kind, extra), at),
    ledger = new Ledger(":memory:"),
    seen: URL[] = [];
  try {
    const runner = new Runner(ledger, "fixture", {
      fetch: async (u) => {
        const url = new URL(String(u));
        seen.push(url);
        return tokenDataFixture(url);
      },
    });
    const result = await runCase(
      runner,
      ledger.createRun(budget ?? plan.estimatedCu),
      plan.input,
    );
    return {
      plan,
      result,
      seen,
      report: result.data.skillAnalysis.findings[0],
    };
  } finally {
    ledger.close();
  }
}
const dataTable = (r: any, prefix: string) =>
  r.tables.find((t: any) => t.title.startsWith(prefix));

test("eight data skills run both depths with bounded evidence and reproducible plans", async () => {
  for (const kind of dataSkillIds)
    for (const depth of ["core", "full"]) {
      const { plan, result, seen, report } = await execute(kind, { depth });
      assert.ok(seen.length > 0 && seen.length <= plan.maxRequests, kind);
      assert.ok(result.meta.cu.budgetUsed <= plan.estimatedCu, kind);
      assert.ok(
        result.data.missing.every((m: any) => m.step === "analysis"),
        `${kind}: ${JSON.stringify(result.data.missing)}`,
      );
      assert.equal(report.skill, kind);
      assert.equal(report.kind, "token-data");
      assert.equal(report.sourceIds.length, seen.length);
      assert.equal(planCase(plan.input, at).estimatedCu, plan.estimatedCu);
    }
});

test("launch stages preserve event fields and bound enrichment", async () => {
  const { seen, report } = await execute("skill-launchpad-trending", {
    stage: "near-graduation",
    minProgress: 80,
    source: "pump_dot_fun",
    depth: "full",
    limit: 1,
  });
  assert.equal(seen[0].searchParams.get("min_progress_percent"), "80");
  assert.equal(seen[0].searchParams.get("graduated"), "false");
  assert.equal(seen[0].searchParams.get("sort_by"), "volume_24h_usd");
  assert.equal(seen.length, 2);
  assert.equal(
    dataTable(report, "Launch candidates").rows[0].source,
    "pump_dot_fun",
  );
  assert.equal(dataTable(report, "Launch candidates").rows[0].progressPct, 85);
  const listed = await execute("skill-launchpad-trending", {
    stage: "newly-listed",
    depth: "full",
  });
  assert.equal(listed.report.summary.observedCandidates, 1);
  assert.equal(
    listed.seen.length,
    2,
    "Unknown and out-of-window listing times must not trigger enrichment",
  );
  const graduated = planCase(
    inputFor("skill-launchpad-trending", { stage: "graduated" }),
    at,
  ).steps[0].params;
  assert.equal(graduated.min_graduated_time, at - 86400);
  assert.equal(graduated.min_creation_time, undefined);
});

test("security keeps unknown honeypot/lock checks and distinguishes fractions from holder percentages", async () => {
  const { report, result } = await execute("skill-token-security");
  const checks = Object.fromEntries(
    report.tables[0].rows.map((r: any) => [r.check, r.value]),
  );
  assert.equal(checks["Mint authority active"], false);
  assert.equal(checks["Transfer fee · %"], 0);
  assert.equal(checks["Creator supply · %"], 2);
  assert.equal(checks["Top-10 token accounts · %"], 30);
  assert.equal(checks["Reported honeypot"], null);
  assert.equal(checks["Reported LP locked"], null);
  assert.equal(result.meta.coverage, "partial");
  const missing = tokenDataAnalysis(
    planCase(inputFor("skill-token-security"), at).input,
    [],
  )!.findings[0];
  assert.equal(missing.summary.checksObserved, 0);
});

test("stats and trader reports use rolling windows and documented field names", async () => {
  const stats = await execute("skill-token-stats", { statsFrames: ["1h"] });
  assert.equal(stats.plan.estimatedCu, 30); // overview 18 + current trade-data 12
  assert.equal(stats.seen[1].searchParams.get("frames"), "1h");
  assert.equal(dataTable(stats.report, "Rolling").rows[0].trades, 0);
  assert.equal(dataTable(stats.report, "Rolling").rows[0].volumeUsd, 0);
  const trader = await execute("skill-top-trader-analysis", {
    traderWindow: "7d",
    traderSort: "realized_pnl",
  });
  assert.equal(trader.seen[0].searchParams.get("limit"), "10");
  assert.equal(trader.seen[0].searchParams.get("time_frame"), "7d");
  assert.equal(trader.report.tables[0].rows[0].realizedPnlUsd, -4);
  assert.equal(trader.report.tables[0].rows[0].unrealizedPnlUsd, null);
  for (const kind of ["skill-token-stats", "skill-top-trader-analysis"])
    assert.throws(() =>
      planCase(inputFor(kind, { from: at - 3600, to: at }), at),
    );
});

test("wallet concentration requires ten distinct wallet rows; segment totals are separate", async () => {
  const { report, result, plan } = await execute("skill-top-holder-analysis");
  assert.equal(report.summary.top10SupplyPct, 20);
  assert.equal(report.summary.segmentSupplyPct, 90);
  assert.equal(report.tables[0].rows[0].holding, "100000000000000000001");
  const source = structuredClone(result.data.sources[0]) as Result;
  source.data.holders = source.data.holders.slice(0, 9);
  assert.equal(
    tokenDataAnalysis(plan.input, [source])!.findings[0].summary.top10SupplyPct,
    null,
  );
  source.data.holders.push(source.data.holders[0]);
  assert.equal(
    tokenDataAnalysis(plan.input, [source])!.findings[0].summary.top10SupplyPct,
    null,
  );
});

test("pool shares use fetched liquidity and pair addresses; history stays token-level", async () => {
  const { report, seen, plan } = await execute("skill-lp-analysis", {
    depth: "full",
    limit: 1,
  });
  assert.equal(plan.estimatedCu, 190); // markets 25 + pair 15 + 4h history 150
  assert.equal(seen[1].searchParams.get("address"), pool);
  assert.equal(seen[2].searchParams.get("address"), token);
  assert.equal(report.summary.providerTotalPools, 4);
  assert.equal(report.tables[0].rows[0].pageSharePct, 80);
  assert.equal(report.summary.tokenLiquidityChangePct, -50);
  const stopped = await execute("skill-lp-analysis", { depth: "full" }, 25);
  assert.equal(stopped.seen.length, 1);
  assert.equal(stopped.result.meta.coverage, "partial");
});

test("smart holders exclude exited positions while separating lifetime from timeline activity", async () => {
  const current = await execute("skill-smart-money-holders", { depth: "full" });
  assert.equal(current.seen[1].searchParams.get("labels"), "smart_trader");
  assert.equal(
    current.seen[1].searchParams.get("include_zero_balance"),
    "false",
  );
  assert.equal(current.report.summary.observedPositions, 1);
  assert.equal(current.report.summary.cohortSupplyPct, 12);
  assert.equal(current.report.tables[0].rows[0].lifetimeBuyUsd, 100);
  assert.equal(current.report.summary.netFlowUsd, 50);
  const exited = await execute("skill-smart-money-holders", {
    includeExited: true,
  });
  assert.equal(exited.report.summary.observedPositions, 2);
});

test("KOL signals disclose pagination, deduplicate observed wallets and preserve absent cohorts", async () => {
  const { report, result, plan, seen } = await execute("skill-kol-signal", {
    depth: "full",
    signalThresholdUsd: 60,
  });
  assert.equal(seen[0].searchParams.get("tags"), "kol");
  assert.equal(seen[0].searchParams.get("include_tag_combinations"), "false");
  assert.equal(report.summary.netFlowUsd, 50);
  assert.equal(report.summary.observedSignal, "balanced");
  assert.equal(report.summary.observedUniqueWallets, 1);
  assert.equal(report.summary.timelineHasMore, true);
  assert.equal(result.meta.coverage, "partial");
  assert.equal(dataTable(report, "Sampled").rows[0].wallet, wallet);
  const source = structuredClone(result.data.sources[0]) as Result;
  source.data = { groups: { tags: { smart_trader: [] } } };
  const absent = tokenDataAnalysis(plan.input, [source])!.findings[0];
  assert.equal(absent.summary.observedSignal, "unknown");
  assert.equal(absent.summary.buyUsd, null);
  assert.ok(absent.missing.length > 0);
});

test("purpose-specific source parameters cannot be overridden into a different cohort or basis", () => {
  assert.throws(() =>
    planCase(
      inputFor("skill-kol-signal", {
        stepOverrides: { timeline: { tags: ["smart_trader"] } },
      }),
      at,
    ),
  );
  const preview = previewCase({ kind: "skill-kol-signal" });
  assert.ok(preview.steps[0].lockedParams.includes("tags"));
  assert.deepEqual(preview.steps[0].params.tags, ["kol"]);
  assert.equal(preview.steps[0].params.token_address, undefined);
});
