import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { tokenDdScore, drawdownGate, ddNumber } from "../src/token-dd-score.js";
import { planCase } from "../src/workflows.js";
import { Ledger } from "../src/ledger.js";
import { RunStore } from "../src/run-store.js";
import { Runner, type Result } from "../src/runner.js";
import { runCase } from "../src/analysis.js";
import { rescoreDd, loadDdEvidence } from "../src/token-dd-rescore.js";
import { project } from "../src/output.js";
const address = "So11111111111111111111111111111111111111112",
  at = 1791504000;
const input = (extra: Record<string, unknown> = {}) =>
  planCase(
    {
      kind: "skill-token-dd-score",
      address,
      to: at,
      from: at - 86400,
      ...extra,
    },
    at,
  ).input;
const src = (
  operation: string,
  data: any,
  params: Record<string, unknown> = {},
): Result => ({
  schemaVersion: 1,
  data,
  meta: {
    operation,
    chain: "solana",
    requestId: operation,
    params: { address, ...params },
  },
});
const near = (actual: number | null, expected: number) => {
  assert.ok(actual !== null);
  assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} vs ${expected}`);
};

test("DD plans exactly two / seven requests and 51 / provisional 181 CU", () => {
  const standard = planCase({
    kind: "skill-token-dd-score",
    address,
    ddMode: "standard",
  });
  const advanced = planCase({ kind: "skill-token-dd-score", address });
  assert.equal(standard.maxRequests, 2);
  assert.equal(standard.estimatedCu, 51);
  assert.equal(advanced.maxRequests, 7);
  assert.equal(advanced.estimatedCu, 181);
  assert.deepEqual(advanced.steps[0].params.frames, [
    "1m",
    "5m",
    "15m",
    "30m",
    "1h",
    "2h",
    "4h",
    "24h",
  ]);
  assert.equal(advanced.steps[0].params.includes, "money_flow");
  assert.equal(advanced.steps.at(-1)!.params.count, 96);
  assert.throws(() => input({ topN: 51 }));
});
test("DD creator example, ratios normalize once; explicit null differs from absence", () => {
  const evidence = src("token.security", {
    ownerAddress: null,
    freezeAuthority: "live",
    mutableMetadata: true,
    creatorPercentage: 0.12,
    top10HolderPercent: 0.964,
  });
  const report = tokenDdScore(input({ ddMode: "standard" }), [evidence]);
  near(
    report.pillars.security.signals.creator_dump.score,
    100 * (1 - 0.28 ** 2 * (3 - 2 * 0.28) * (0.6 + (0.4 * 2) / 3)),
  );
  near(report.holder_concentration.top10, 96.4);
  assert.equal(report.pillars.security.signals.mint_authority.score, 100);
  assert.equal(report.pillars.security.signals.not_lst.score, null);
  const missing = tokenDdScore(input(), [src("token.security", {})]);
  assert.equal(missing.pillars.security.score, null);
  assert.equal(missing.score.final, null);
  assert.equal(missing.score.rating, null);
  assert.equal(ddNumber(null), null);
  assert.equal(ddNumber(""), null);
  assert.equal(ddNumber(false), null);
});
test("honeypot hard block wins even with no other evidence", () => {
  const r = tokenDdScore(input(), [
    src("token.security", { isHoneypot: true }),
  ]);
  assert.equal(r.score.final, 0);
  assert.equal(r.score.rating, "F");
  assert.deepEqual(r.hard_blocks, ["isHoneypot"]);
});
test("holder pillar reproduces the supplied 34.9 example with native percent units", () => {
  const holders = [75, 12, 8.43, 0.2, 0.2, 0.2, 0.1, 0.1, 0.1, 0.07].map(
    (percent_of_supply) => ({ percent_of_supply }),
  );
  const sources = [
    src("token.overview", { holder: 29724 }),
    src(
      "token.holder-distribution",
      { holders },
      { mode: "top", address_type: "wallet", offset: 0, include_list: true },
    ),
    src("token.holder-profile", {
      tags: [
        { tag: "dev", percent_of_supply: 0 },
        { tag: "sniper", percent_of_supply: 0, holder_count: 17 },
        { tag: "bundler", percent_of_supply: 0.3 },
      ],
    }),
  ];
  const report = tokenDdScore(input(), sources);
  assert.ok(Math.abs(report.pillars.holders.score! - 34.9) < 0.1);
  near(report.pillars.holders.signals.sniper_density.score, 10.4);
  assert.equal(report.pillars.holders.coverage, 1);
});
test("distribution uses 0–100 scale and rejects non-top/offset pages", () => {
  const pcts = [75, 12, 8.43, 0.2, 0.2, 0.2, 0.1, 0.1, 0.1, 0.07];
  const params = {
    mode: "top",
    address_type: "wallet",
    offset: 0,
    include_list: true,
  };
  const d = src(
    "token.holder-distribution",
    { holders: pcts.map((percent_of_supply) => ({ percent_of_supply })) },
    params,
  );
  const r = tokenDdScore(input(), [d]);
  near(r.holder_concentration.top1, 75);
  near(r.holder_concentration.top3, 95.43);
  near(r.holder_concentration.top10, 96.4);
  assert.equal(
    tokenDdScore(input(), [
      { ...d, meta: { ...d.meta, params: { ...d.meta.params, offset: 10 } } },
    ]).holder_concentration.top10,
    null,
  );
  assert.equal(
    tokenDdScore(input(), [
      { ...d, data: { holders: d.data.holders.slice(0, 9) } },
    ]).holder_concentration.top10,
    null,
  );
});
test("drawdown gate uses worst term, corrects inconsistent example table and never penalizes depth", () => {
  near(drawdownGate(45, 30).gate, 0.95);
  near(drawdownGate(0, 70).gate, 0.85);
  near(drawdownGate(null, null).gate, 1);
  near(drawdownGate(50, 50).gate, 0.9028);
  const r = tokenDdScore(input({ ddMode: "standard" }), [
    src("token.overview", { liquidity: 100, marketCap: 100000 }),
  ]);
  assert.equal(r.gate_detail.gate, 1);
  assert.equal(r.pillars.liquidity.signals.depth.score, 0);
  assert.equal(r.score.weights_used.smart_money, undefined);
});
test("activity percentage fields stay percentages, missing inner inputs are renormalized", () => {
  const r = tokenDdScore(input(), [
    src("token.overview", { priceChange24hPercent: 35 }),
  ]);
  near(r.pillars.activity.signals.momentum.score, 50 + 50 * Math.tanh(1));
  assert.deepEqual(r.meta.frames_used, ["24h"]);
  assert.equal(r.pillars.activity.signals.drawdown.score, null);
});
test("liquidity candles are sorted/deduplicated, stats use observed samples; minimum stability sample applies", () => {
  const candles = Array.from({ length: 8 }, (_, i) => ({
    unix_time: at - (8 - i) * 900,
    close_liquidity_usd: 100 - i * 5,
    close_exit_liquidity_usd: 50 - i,
    total_pairs: 3,
  })).reverse();
  const r = tokenDdScore(input(), [
    src(
      "token.liquidity-ohlc",
      {
        items: [
          ...candles,
          candles[0],
          { unix_time: at + 900, close_liquidity_usd: 10000 },
        ],
      },
      { time: at, resolution: "15m" },
    ),
  ]);
  assert.equal(r.liquidity_stats.window.candles, 8);
  assert.equal(r.liquidity_stats.window.span_hours, 2);
  assert.equal(r.liquidity_stats.liquidity?.first, 100);
  assert.equal(r.liquidity_stats.liquidity?.current, 65);
  assert.ok(r.pillars.liquidity.signals.stability.score !== null);
  const short = tokenDdScore(input({ liqCandles: 7 }), [
    src(
      "token.liquidity-ohlc",
      { items: candles },
      { time: at, resolution: "15m" },
    ),
  ]);
  assert.equal(short.pillars.liquidity.signals.stability.score, null);
});
test("smart flow requires explicit tags; missing cohorts are not assigned zero", () => {
  const o = src("token.overview", {
    v24hUSD: 1000,
    moneyFlow: [{ frame: "24h", netUsd: 100 }],
  });
  assert.equal(tokenDdScore(input(), [o]).pillars.smart_money.score, null);
  const flow = src("token.money-flow", [
    { tag: "whales", frame: "24h", total_value_buy: 150, total_value_sell: 50 },
  ]);
  const r = tokenDdScore(input(), [o, flow]);
  assert.equal(r.pillars.smart_money.signals.whale.score, 100);
  assert.equal(r.pillars.smart_money.signals.sm_presence.score, null);
  assert.equal(
    tokenDdScore(input({ ddMode: "standard" }), [o, flow]).pillars.smart_money
      .score,
    null,
  );
});
test("raw API execution and SQLite re-score use one scorer, preserve evidence and charge zero new CU", async () => {
  const dir = mkdtempSync(join(tmpdir(), "dd-score-"));
  const ledger = new Ledger(join(dir, "usage.sqlite")),
    archive = new RunStore(ledger);
  let requests = 0;
  try {
    const runner = new Runner(ledger, "fixture", {
      fetch: async (url) => {
        requests++;
        return Response.json({
          success: true,
          data: String(url).includes("token_overview")
            ? {
                liquidity: 10000,
                marketCap: 100000,
                holder: 1000,
                priceChange24hPercent: 3,
              }
            : {
                ownerAddress: null,
                freezeAuthority: null,
                mutableMetadata: false,
                creatorPercentage: 0.01,
              },
        });
      },
    });
    const id = ledger.createRun(51),
      result = await runCase(runner, id, input({ ddMode: "standard" }));
    const report = result.data.skillAnalysis.findings[0];
    assert.equal(requests, 2);
    assert.equal(report.meta.cu_estimated_total, 51);
    assert.equal(report.meta.cu_breakdown.base, 51);
    assert.equal(report.meta.cu_billed_total, null);
    const full = JSON.stringify(result);
    const rescored = rescoreDd(result, {}, ledger, archive);
    assert.equal(requests, 2);
    assert.equal(rescored.cu.attempts, 0);
    assert.equal(rescored.cu.estimated, 0);
    near(
      rescored.result!.data.skillAnalysis.findings[0].score.final,
      report.score.final,
    );
    assert.equal(
      rescored.result!.data.skillAnalysis.findings[0].meta.cu_estimated_total,
      0,
    );
    assert.equal(JSON.stringify(result), full);
    assert.equal(
      JSON.stringify(rescored.result!.data.sources),
      JSON.stringify(result.data.sources),
    );
    assert.equal(archive.get(rescored.id).result!.meta.rescore.sourceRunId, id);
    writeFileSync(join(dir, "export.json"), full);
    assert.equal(
      JSON.stringify(loadDdEvidence(join(dir, "export.json"), archive)),
      full,
    );
    assert.equal(
      JSON.stringify(
        loadDdEvidence(
          `base64:${Buffer.from(full).toString("base64")}`,
          archive,
        ),
      ),
      full,
    );
    assert.throws(() => rescoreDd(project(result, true), {}, ledger, archive), {
      code: "RESCORE_INVALID",
    });
    assert.throws(
      () => rescoreDd(result, { liqResolution: "1D" }, ledger, archive),
      { code: "RESCORE_INVALID" },
    );
  } finally {
    ledger.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
