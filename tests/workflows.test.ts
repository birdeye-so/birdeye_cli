import test from "node:test";
import assert from "node:assert/strict";
import { Ledger } from "../src/ledger.js";
import { Runner } from "../src/runner.js";
import { prepare, capabilities } from "../src/catalog.js";
import { planCase, caseKinds, legacyCaseKinds } from "../src/workflows.js";
import { runCase, metricsFor } from "../src/analysis.js";
import { project } from "../src/output.js";
import { runChat } from "../src/ai.js";
import { previewCase } from "../src/workflow-preview.js";

const token = "So11111111111111111111111111111111111111112";
const second = "11111111111111111111111111111112";
const third = "11111111111111111111111111111113";
const at = 1791504000;
const ok = (data: unknown) => Response.json({ success: true, data });
const summary = {
  counts: { total_win: 2, total_loss: 1, win_rate: 2 / 3, total_trade: 8 },
  pnl: {
    realized_profit_usd: "12.50",
    unrealized_usd: "-2",
    total_usd: "10.50",
  },
};

test("workflow previews describe every step without turning missing subjects into runnable input", () => {
  for (const kind of caseKinds) {
    for (const depth of ["core", "full"]) {
      const preview = previewCase({ kind, depth });
      assert.ok(preview.purpose && preview.produces);
      assert.equal(
        preview.estimatedCu,
        preview.steps.reduce((sum, step) => sum + step.estimatedCu, 0),
      );
      for (const step of preview.steps) {
        assert.ok(
          step.title && step.purpose && step.collects,
          `${kind}/${step.id}`,
        );
        assert.ok(step.path.startsWith("/"));
        assert.ok(step.inputSchema.properties);
        for (const name of step.lockedParams.filter((name) =>
          ["address", "token_address", "wallet", "wallets"].includes(name),
        ))
          assert.equal(step.params[name], undefined);
      }
      if (preview.needsAddress) {
        assert.equal(preview.input.address, undefined);
        assert.throws(
          () => planCase(preview.input),
          /requires a Solana address|wallet addresses/,
        );
      }
    }
  }
  assert.throws(() =>
    previewCase({ kind: "token-research", address: "bad-address" }),
  );
});

test("step overrides validate before any API call and preserve workflow subject bindings", async () => {
  const ledger = new Ledger(":memory:");
  let calls = 0;
  const runner = new Runner(ledger, "fixture", {
    fetch: async () => {
      calls++;
      return ok({});
    },
  });
  try {
    const invalid = [
      { holders: { limit: 101 } },
      { holders: { offset: 9999, limit: 10 } },
      { holders: { mode: "unknown" } },
      { holders: { arbitrary: 1 } },
      { holders: { address: second } },
      { overview: { wallet: second } },
      { nonexistent: { limit: 10 } },
      { pair: { ui_amount_mode: "scaled" } },
    ];
    for (const stepOverrides of invalid) {
      await assert.rejects(
        runCase(runner, ledger.createRun(100), {
          kind: "token-research",
          address: token,
          stepOverrides,
        }),
        { code: "INVALID_INPUT" },
      );
    }
    assert.throws(
      () =>
        planCase({
          kind: "project-deep-report",
          address: token,
          stepOverrides: { candles: { time_from: at, time_to: at - 1 } },
        }),
      /Step candles/,
    );
    assert.throws(
      () =>
        planCase({
          kind: "market-opportunities",
          depth: "full",
          stepOverrides: { profiles: { token_address: second } },
        }),
      /comes from the workflow subject/,
    );
    assert.equal(calls, 0);
    assert.equal(ledger.summary().attempts, 0);
  } finally {
    ledger.close();
  }
});

test("custom step parameters reach GET and POST requests, evidence and PnL metrics", async () => {
  const ledger = new Ledger(":memory:");
  const sent: { path: string; params: Record<string, any> }[] = [];
  const runner = new Runner(ledger, "fixture", {
    fetch: async (u, init) => {
      const url = new URL(String(u));
      sent.push({
        path: url.pathname,
        params:
          init?.method === "POST"
            ? JSON.parse(String(init.body))
            : Object.fromEntries(url.searchParams),
      });
      return fixture(url, init);
    },
  });
  try {
    const input = {
      kind: "wallet-analysis",
      address: token,
      depth: "full",
      limit: 1,
      from: at - 86400,
      to: at,
      stepOverrides: {
        holdings: { limit: 2, offset: 10 },
        pnl: { duration: "7d", pnl_method: "net_cash" },
        "pnl-details": {
          token_addresses: [token],
          limit: 2,
          pnl_method: "net_cash",
        },
        trades: { tx_type: "all", after_time: at - 3600 },
      },
    };
    const plan = planCase(input);
    const run = ledger.createRun(plan.estimatedCu);
    const result = await runCase(runner, run, plan.input);
    assert.equal(
      sent.find((s) => s.path.endsWith("current-net-worth"))?.params.offset,
      "10",
    );
    assert.equal(
      sent.find((s) => s.path.endsWith("pnl/summary"))?.params.duration,
      "7d",
    );
    assert.deepEqual(
      sent.find((s) => s.path.endsWith("pnl/details"))?.params.token_addresses,
      [token],
    );
    assert.equal(
      sent.find((s) => s.path.endsWith("seek_by_time"))?.params.after_time,
      String(at - 3600),
    );
    assert.equal(
      result.data.metrics.find(
        (m: any) => m.operation === "portfolio.pnl-summary",
      ).pnlMethod,
      "net_cash",
    );
    assert.deepEqual(result.data.plan.input.stepOverrides, input.stepOverrides);
    assert.equal(
      result.data.plan.steps.find((s: any) => s.id === "pnl").params.duration,
      "7d",
    );
    assert.equal(result.meta.cu.estimated, plan.estimatedCu);
    const defaults = planCase({ ...input, stepOverrides: {} });
    assert.equal(
      defaults.steps.find((s) => s.id === "holdings")?.params.limit,
      100,
    );
  } finally {
    ledger.close();
  }
});

test("dependent step edits apply to selected subjects and keep CU budget enforcement", async () => {
  const ledger = new Ledger(":memory:");
  const bodies: any[] = [];
  const runner = new Runner(ledger, "fixture", {
    fetch: async (u, init) => {
      const url = new URL(String(u));
      if (url.pathname.endsWith("money-flow"))
        bodies.push(JSON.parse(String(init?.body)));
      return fixture(url, init);
    },
  });
  try {
    const input = {
      kind: "market-opportunities",
      depth: "full",
      limit: 2,
      stepOverrides: { flow: { frames: ["1h", "24h"], wallet_tags: ["kol"] } },
    };
    const plan = planCase(input);
    await runCase(runner, ledger.createRun(plan.estimatedCu), input);
    assert.deepEqual(
      bodies.map((body) => body.token_address),
      [token, second],
    );
    assert.ok(
      bodies.every(
        (body) =>
          body.frames.join() === "1h,24h" && body.wallet_tags.join() === "kol",
      ),
    );
    const limited = await runCase(runner, ledger.createRun(25), input);
    assert.equal(limited.meta.cu.estimated, 25);
    assert.equal(limited.data.status, "partial");
    assert.equal(bodies.length, 2);
  } finally {
    ledger.close();
  }
});

function fixture(url: URL, init?: RequestInit): Response {
  const address = url.searchParams.get("address") || token;
  switch (url.pathname) {
    case "/defi/token_overview":
      return ok({ address, price: 2, liquidity: 10000, v24hUSD: 5000 });
    case "/defi/token_security":
      return ok({
        freezeable: false,
        top10HolderPercent: 0.2,
        nonTransferable: false,
      });
    case "/defi/v3/token/holder":
      return ok({ items: [{ owner: second, ui_amount: 12 }] });
    case "/defi/v2/markets":
      return ok({ items: [{ address: second, liquidity: 2000 }] });
    case "/defi/v3/pair/overview/single":
      return ok({ address, liquidity: 2000 });
    case "/token/v1/holder-profile":
      return ok({
        token: {},
        holder_summary: {},
        tags: [{ tag: "dev", percent_of_supply: 1 }],
      });
    case "/token/v1/holder-positions":
      return ok([
        { wallet_address: second, labels: ["dev"], percent_of_supply: 1 },
      ]);
    case "/token/v1/wallet-tags-tracker":
      return ok({
        groups: { tags: { dev: [] } },
        has_more: true,
        next_time_from: at,
      });
    case "/token/v1/wallet-tags-tracker/details":
      return ok({
        items: [{ unix_time: at - 3600, wallets: [] }],
        has_more: false,
      });
    case "/defi/v3/ohlcv":
      return ok({
        items: [
          { unix_time: at - 7200, o: 1, c: 2 },
          { unix_time: at - 3600, o: 2, c: 3 },
        ],
      });
    case "/defi/v3/token/trade-data/single":
      return ok({ address, volume_buy_24h_usd: 200 });
    case "/wallet/v2/current-net-worth":
      return ok({
        items: [
          { address: token, value: 100 },
          { address: second, value: 200 },
          { address: third, value: 50 },
        ],
      });
    case "/wallet/v2/pnl/summary":
      return ok({ summary });
    case "/wallet/v2/pnl/details":
      assert.equal(init?.method, "POST");
      return ok({ summary, tokens: [{ address: token, pnl: summary.pnl }] });
    case "/trader/txs/seek_by_time":
      return ok({
        items: [{ tx_hash: "fixture", side: "buy" }],
        has_next: true,
      });
    case "/trader/gainers-losers":
      return ok({
        items: [token, second, third].map((address) => ({
          address,
          network: "solana",
        })),
      });
    case "/defi/v3/token/meme/list":
      return ok({
        items: [token, second, third].map((address) => ({
          address,
          liquidity: 10000,
          meme_info: { creation_time: at - 3600 },
        })),
      });
    case "/defi/v2/tokens/new_listing":
      return ok({
        items: [
          { address: token, liquidityAddedAt: at - 3600, liquidity: 10000 },
        ],
      });
    case "/defi/token_trending":
      return ok({
        tokens: [token, second, third].map((address, i) => ({
          address,
          volume24hUSD: 100 - i,
          liquidity: 10000,
        })),
      });
    case "/market/v1/blockchain-metrics":
      return ok({ items: [{ unix_time: at - 86400, volume_usd: 1000 }] });
    case "/smart-money/v1/token/list":
      return ok([{ token, net_flow: 12, smart_traders_no: 2 }]);
    case "/defi/v3/token/money-flow":
      return Response.json([
        {
          token_address: token,
          frame: "24h",
          tag: "smart_money",
          total_value_buy: "0.123456789012345678901",
          total_value_sell: "0.023456789012345678901",
        },
      ]);
    default:
      throw new Error(`Unexpected fixture request: ${url.pathname}`);
  }
}

test("new schemas enforce endpoint-specific tags, pagination and accounting before billing", () => {
  assert.equal(capabilities().length, 36);
  assert.throws(() =>
    prepare("token.money-flow", {
      token_address: token,
      wallet_tags: ["smart_trader"],
    }),
  );
  assert.throws(() =>
    prepare("token.tags-tracker", {
      token_address: token,
      time_from: at - 86400,
      time_to: at,
      tags: ["bundler"],
    }),
  );
  assert.throws(() =>
    prepare("token.holder-positions", {
      token_address: token,
      labels: ["kol"],
      limit: 50,
      offset: 9980,
    }),
  );
  assert.throws(() =>
    prepare("token.first-buyers", {
      token_address: token,
      limit: 100,
      offset: 950,
    }),
  );
  assert.throws(() =>
    prepare("token.holder-distribution", {
      token_address: token,
      mode: "percent",
      min_percent: 1,
      max_percent: 5,
      top_n: 10,
    }),
  );
  assert.throws(() =>
    prepare("portfolio.pnl-summary", { wallet: token, pnl_method: "netcash" }),
  );
  assert.throws(() =>
    prepare("portfolio.pnl-summary", { wallet: token }, "base"),
  );
  assert.throws(() =>
    prepare("market.meme-list", {
      min_creation_time: at,
      max_creation_time: at - 1,
    }),
  );
  assert.throws(() => planCase({ kind: "token-research" }));
  assert.throws(() =>
    planCase({ kind: "early-project-screening", stage: "near-graduation" }),
  );
  assert.throws(() =>
    planCase({ kind: "risk-warning", address: token, baselineLiquidity: 10 }),
  );
  assert.throws(() =>
    planCase({
      kind: "wallet-exposure",
      address: token,
      excludeFreezeable: true,
    }),
  );
});

test("GET arrays and false booleans preserve API wire semantics", async () => {
  const ledger = new Ledger(":memory:");
  try {
    const runner = new Runner(ledger, "key", {
      fetch: async (u, init) => {
        const url = new URL(String(u));
        assert.equal(init?.method, "GET");
        assert.equal(init?.body, undefined);
        assert.equal(url.searchParams.get("labels"), "dev,kol");
        assert.equal(url.searchParams.get("include_zero_balance"), "false");
        return ok([{ wallet_address: token }]);
      },
    });
    const r = await runner.execute(
      "token.holder-positions",
      {
        token_address: token,
        labels: ["dev", "kol"],
        include_zero_balance: false,
      },
      { run: ledger.createRun(30) },
    );
    assert.equal(r.meta.pagination.returned, 1);
  } finally {
    ledger.close();
  }
});

test("POST body, bare arrays, decimal arithmetic and CU budget share the same runner", async () => {
  const ledger = new Ledger(":memory:");
  let calls = 0;
  try {
    const runner = new Runner(ledger, "key", {
      fetch: async (u, init) => {
        calls++;
        const url = new URL(String(u));
        assert.equal(url.search, "");
        assert.equal(init?.method, "POST");
        const body = JSON.parse(String(init?.body));
        assert.deepEqual(body.frames, ["24h"]);
        return fixture(url, init);
      },
    });
    const run = ledger.createRun(10);
    const r = await runner.execute(
      "token.money-flow",
      { token_address: token },
      { run },
    );
    assert.equal(metricsFor([r])[0].netValue, "0.1");
    assert.equal(r.meta.cu.estimated, 10);
    await assert.rejects(
      runner.execute("token.money-flow", { token_address: token }, { run }),
      { code: "CU_BUDGET_EXCEEDED" },
    );
    assert.equal(calls, 1);
  } finally {
    ledger.close();
  }
});

test("PnL details sends the explicit accounting method in POST, retains scope and page cursors", async () => {
  const ledger = new Ledger(":memory:");
  try {
    const runner = new Runner(ledger, "key", {
      fetch: async (_u, init) => {
        assert.equal(init?.method, "POST");
        const b = JSON.parse(String(init?.body));
        assert.equal(b.pnl_method, "wac");
        assert.equal(b.position_scope, "duration_only");
        assert.deepEqual(b.token_addresses, [token]);
        return ok({ summary, tokens: [{ address: token }], has_more: true });
      },
    });
    const r = await runner.execute(
      "portfolio.pnl-details",
      { wallet: token, token_addresses: [token], duration: "7d" },
      { run: ledger.createRun(30) },
    );
    assert.equal(r.meta.pagination.returned, 1);
    assert.equal(r.meta.pagination.hasMore, true);
    const m = metricsFor([r])[0];
    assert.equal(m.realizedPnlUsd, "12.50");
    assert.equal(m.duration, "7d");
    assert.equal(m.pnlMethod, "wac");
  } finally {
    ledger.close();
  }
});

test("invalid upstream response stays uncertain rather than generating metrics", async () => {
  const ledger = new Ledger(":memory:");
  try {
    const runner = new Runner(ledger, "key", {
      fetch: async () => ok({ summary: "not-an-object" }),
    });
    const run = ledger.createRun(20);
    await assert.rejects(
      runner.execute("portfolio.pnl-summary", { wallet: token }, { run }),
      { code: "API_RESPONSE_INVALID" },
    );
    assert.equal(ledger.summary(run).budgetUsed, 20);
    assert.equal(ledger.summary(run).uncertainAttempts, 1);
  } finally {
    ledger.close();
  }
});

test("recipe plans have reviewed costs, bounded candidate counts and no network dependency", () => {
  const cases: [string, number, Record<string, unknown>?][] = [
    ["token-research", 78],
    ["token-research", 148, { depth: "full" }],
    ["token-due-diligence", 48],
    ["token-due-diligence", 118, { depth: "full" }],
    ["project-deep-report", 260],
    ["wallet-analysis", 50],
    ["wallet-analysis", 224, { depth: "full" }],
    ["smart-money-profile", 70],
    ["risk-warning", 78],
    ["risk-warning", 198, { depth: "full" }],
    ["wallet-exposure", 20],
  ];
  for (const [kind, expected, extra] of cases)
    assert.equal(
      planCase({ kind, address: token, ...extra }, at).estimatedCu,
      expected,
      kind,
    );
  assert.equal(planCase({ kind: "smart-money-profile" }, at).estimatedCu, 235);
  assert.equal(
    planCase({ kind: "early-project-screening" }, at).estimatedCu,
    264,
  );
  assert.equal(planCase({ kind: "daily-brief" }, at).estimatedCu, 146);
  assert.equal(
    planCase({ kind: "daily-brief", depth: "full" }, at).estimatedCu,
    236,
  );
  assert.equal(
    planCase({ kind: "market-opportunities", depth: "full" }, at).estimatedCu,
    289,
  );
  assert.equal(planCase({ kind: "market-shortlist" }, at).estimatedCu, 265);
});

test("all nine recipes and legacy cases execute fixture APIs under their planned CU bounds", async () => {
  for (const depth of ["core", "full"])
    for (const kind of legacyCaseKinds) {
      const needsAddress = [
        "token-research",
        "token-due-diligence",
        "project-deep-report",
        "wallet-analysis",
        "risk-warning",
        "wallet-exposure",
        "skill-token-dd",
      ].includes(kind);
      const input = {
        kind,
        depth,
        ...(needsAddress ? { address: token } : {}),
        ...(kind === "wallet-analysis" && depth === "full"
          ? { minLiquidity: 100 }
          : {}),
        from: at - 86400,
        to: at,
      };
      const plan = planCase(input, at),
        ledger = new Ledger(":memory:");
      try {
        const runner = new Runner(ledger, "key", {
          fetch: async (u, init) => fixture(new URL(String(u)), init),
        });
        const result = await runCase(
          runner,
          ledger.createRun(plan.estimatedCu, undefined, 40),
          input,
        );
        assert.equal(
          result.meta.coverage,
          kind === "skill-token-dd"
            ? "partial"
            : "complete-for-requested-scope",
          `${kind}: ${JSON.stringify(result.data.missing)}`,
        );
        if (kind === "skill-token-dd")
          assert.ok(
            result.data.missing.every((item: any) => item.step === "analysis"),
          );
        assert.ok(result.meta.cu.estimated <= plan.estimatedCu, kind);
        assert.ok(result.data.sources.length > 0, kind);
      } finally {
        ledger.close();
      }
    }
});

test("listing discovery keeps event semantics and filters unknown or out-of-window listing times", async () => {
  const ledger = new Ledger(":memory:");
  try {
    const runner = new Runner(ledger, "key", {
      fetch: async (u, init) => {
        const url = new URL(String(u));
        if (url.pathname === "/defi/v2/tokens/new_listing")
          return ok({
            items: [
              {
                address: token,
                liquidityAddedAt: new Date((at - 60) * 1000).toISOString(),
              },
              { address: second, liquidityAddedAt: at - 90000 },
              { address: third },
            ],
          });
        return fixture(url, init);
      },
    });
    const r = await runCase(runner, ledger.createRun(215), {
      kind: "early-project-screening",
      stage: "newly-listed",
      from: at - 86400,
      to: at,
    });
    assert.deepEqual(r.data.selections[0].selected, [token]);
    assert.equal(r.meta.cu.estimated, 98);
  } finally {
    ledger.close();
  }
});

test("cohort shares stay separate and liquidity baseline computes zero without claiming withdrawal", async () => {
  const ledger = new Ledger(":memory:");
  try {
    const runner = new Runner(ledger, "key", {
      fetch: async (u, init) => fixture(new URL(String(u)), init),
    });
    const r = await runCase(runner, ledger.createRun(78), {
      kind: "risk-warning",
      address: token,
      baselineLiquidity: 10000,
      baselineTime: at - 100,
      from: at - 86400,
      to: at,
    });
    assert.equal(r.data.metrics.at(-1).liquidityChangePct, "0.000000");
    const rows = metricsFor([
      {
        schemaVersion: 1,
        meta: {
          operation: "token.holder-profile",
          params: { token_address: token },
        },
        data: {
          tags: [
            { tag: "dev", percent_of_supply: 70 },
            { tag: "sniper", percent_of_supply: 70 },
          ],
        },
      },
    ]);
    assert.equal(rows.length, 2);
    assert.equal(rows[0].percentOfSupply, 70);
    assert.equal(rows[1].percentOfSupply, 70);
  } finally {
    ledger.close();
  }
});

test("market scan deduplicates candidates, selects by local volume and gates further enrichment", async () => {
  const ledger = new Ledger(":memory:");
  const seen: string[] = [];
  try {
    const runner = new Runner(ledger, "key", {
      fetch: async (u, init) => {
        const url = new URL(String(u));
        seen.push(`${url.pathname}:${url.searchParams.get("address")}`);
        if (url.pathname === "/defi/token_trending") {
          assert.equal(url.searchParams.get("limit"), "50");
          return ok({
            tokens: [
              { address: token, volume24hUSD: 1, liquidity: 10000 },
              { address: second, volume24hUSD: 100, liquidity: 10000 },
              { address: second, volume24hUSD: 100, liquidity: 10000 },
              { address: third, volume24hUSD: 90, liquidity: 0 },
            ],
          });
        }
        if (
          url.pathname === "/defi/token_security" &&
          url.searchParams.get("address") === second
        )
          return ok({ freezeable: true });
        return fixture(url, init);
      },
    });
    const r = await runCase(runner, ledger.createRun(200), {
      kind: "market-opportunities",
      limit: 2,
      minLiquidity: 100,
      excludeFreezeable: true,
    });
    assert.deepEqual(r.data.selections[0].selected, [second, token]);
    assert.equal(seen.includes(`/defi/token_overview:${second}`), false);
    assert.equal(r.data.outcomes[0].status, "exclude-by-policy");
    assert.equal(r.meta.cu.estimated, 103); // discovery 25 + two security 60 + one overview 18
    assert.equal(r.data.missing.length, 1);
  } finally {
    ledger.close();
  }
});

test("unknown required security fields stop dependent checks without a safe verdict", async () => {
  const ledger = new Ledger(":memory:");
  let calls = 0;
  try {
    const runner = new Runner(ledger, "key", {
      fetch: async () => {
        calls++;
        return ok({ freezeable: null });
      },
    });
    const r = await runCase(runner, ledger.createRun(200), {
      kind: "risk-warning",
      address: token,
      excludeFreezeable: true,
    });
    assert.equal(calls, 1);
    assert.equal(r.data.outcomes[0].status, "insufficient-data");
    assert.equal(r.meta.cu.estimated, 30);
  } finally {
    ledger.close();
  }
});

test("budget stops dispatch and retains paid evidence plus missing steps", async () => {
  const ledger = new Ledger(":memory:");
  let calls = 0;
  try {
    const runner = new Runner(ledger, "key", {
      fetch: async (u, init) => {
        calls++;
        return fixture(new URL(String(u)), init);
      },
    });
    const r = await runCase(runner, ledger.createRun(78), {
      kind: "project-deep-report",
      address: token,
    });
    assert.equal(calls, 3);
    assert.equal(r.data.sources.length, 3);
    assert.equal(r.meta.cu.estimated, 78);
    assert.equal(r.meta.coverage, "partial");
    assert.ok(r.data.missing.length >= 5);
  } finally {
    ledger.close();
  }
});

test("empty discovery is partial, and 403 does not cascade across candidates", async () => {
  for (const empty of [true, false]) {
    const ledger = new Ledger(":memory:");
    let calls = 0;
    try {
      const runner = new Runner(ledger, "key", {
        fetch: async () => {
          calls++;
          return empty
            ? ok({ tokens: [] })
            : new Response("private provider details", { status: 403 });
        },
      });
      const r = await runCase(runner, ledger.createRun(250), {
        kind: "market-opportunities",
      });
      assert.equal(calls, 1);
      assert.equal(r.meta.coverage, "partial");
      assert.ok(r.data.missing.length >= 2);
      assert.equal(
        JSON.stringify(r).includes("private provider details"),
        false,
      );
    } finally {
      ledger.close();
    }
  }
});

test("short workflow output preserves security observations and makes truncated evidence explicit", async () => {
  const ledger = new Ledger(":memory:");
  try {
    const runner = new Runner(ledger, "key", {
      fetch: async (u, init) => {
        const url = new URL(String(u));
        if (url.pathname === "/defi/v3/token/holder")
          return ok({
            items: Array.from({ length: 10 }, () => ({
              owner: second,
              amount: "999999999999999999999",
            })),
          });
        return fixture(url, init);
      },
    });
    const result = await runCase(runner, ledger.createRun(78), {
      kind: "token-research",
      address: token,
    });
    const short = project(result, true);
    assert.equal(short.data.sources[1].data.nonTransferable, false);
    assert.equal(short.data.sources[2].data.items.length, 5);
    assert.deepEqual(short.data.sources[2].outputTruncation.truncatedPaths, [
      "data.items",
    ]);
    assert.equal(result.data.sources[2].data.items.length, 10);
  } finally {
    ledger.close();
  }
});

test("AI workflow tools estimate for free and execute under the shared CU budget", async () => {
  const ledger = new Ledger(":memory:");
  let aiCalls = 0,
    apiCalls = 0;
  try {
    const runner = new Runner(ledger, "key", {
      fetch: async (u, init) => {
        apiCalls++;
        return fixture(new URL(String(u)), init);
      },
    });
    const args = JSON.stringify({
      kind: "token-due-diligence",
      address: token,
    });
    const result = await runChat(
      runner,
      ledger.createRun(48),
      {
        provider: "openai-compatible",
        baseUrl: "https://provider.test/v1",
        model: "fixture",
        apiKeyEnv: "BIRDEYE_TEST_ONLY_UNUSED",
        apiKey: "fixture",
      },
      "Check the token",
      {
        fetch: async (_u, init) => {
          const body = JSON.parse(String(init?.body));
          assert.ok(
            body.tools.some((t: any) => t.function.name === "run_workflow"),
          );
          aiCalls++;
          return Response.json({
            choices: [
              {
                message:
                  aiCalls === 1
                    ? {
                        role: "assistant",
                        tool_calls: [
                          {
                            id: "estimate",
                            type: "function",
                            function: {
                              name: "estimate_workflow",
                              arguments: args,
                            },
                          },
                          {
                            id: "run",
                            type: "function",
                            function: { name: "run_workflow", arguments: args },
                          },
                        ],
                      }
                    : { role: "assistant", content: "Reviewed observations." },
              },
            ],
            usage: { prompt_tokens: 10, completion_tokens: 5 },
          });
        },
      },
    );
    assert.equal(apiCalls, 2);
    assert.equal(result.meta.cu.estimated, 48);
    assert.equal(result.meta.ai.calls, 2);
  } finally {
    ledger.close();
  }
});
