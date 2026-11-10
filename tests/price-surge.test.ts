import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { Ledger } from "../src/ledger.js";
import { Runner } from "../src/runner.js";
import { prepare } from "../src/catalog.js";
import { planPriceSurge, runPriceSurge } from "../src/price-surge/api.js";
import { surgeIntervals } from "../src/price-surge/schema.js";
import { planCase } from "../src/workflows.js";
import { runCase } from "../src/analysis.js";
import { startInternalApi } from "../src/internal-api/server.js";
import { ResearchService } from "../src/internal-api/service.js";
import { RunStore } from "../src/run-store.js";
import { inProcessFetch } from "./http-helper.js";
import { project, render } from "../src/output.js";
import { caseCliArgs } from "../src/cli-preview.js";
import type { Data } from "../src/shared.js";

const addresses = [
  "So11111111111111111111111111111111111111112",
  "11111111111111111111111111111111",
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
];
const clean = (address = addresses[0], overrides: Data = {}) => ({
  address,
  symbol: "SURGE",
  price: 1,
  market_cap: 1000000,
  fdv: 1000000,
  liquidity: 20000,
  holder: 100,
  volume_1h_usd: 6000,
  price_change_1h_percent: 70,
  trade_1h_count: 30,
  buy_24h: 30,
  sell_24h: 25,
  trade_24h_count: 55,
  unique_wallet_24h: 10,
  ...overrides,
});
async function screen(
  params: Data = {},
  items: Data[] = [clean()],
  hydrate: (url: URL) => Data | Response = () => ({}),
  budget?: number,
  retries = 0,
) {
  const ledger = new Ledger(":memory:"),
    calls: { url: URL; headers: Headers }[] = [];
  const raw = {
    success: true,
    data: { items, hasNext: true },
    extra: "retain upstream envelope",
  };
  const runner = new Runner(ledger, "fixture", {
    retries,
    fetch: async (value, init) => {
      const url = new URL(String(value));
      calls.push({ url, headers: new Headers(init?.headers) });
      if (url.pathname === "/defi/v3/token/list") return Response.json(raw);
      const data = hydrate(url);
      return data instanceof Response
        ? data
        : Response.json({ success: true, data });
    },
  });
  try {
    return {
      out: await runPriceSurge(
        runner,
        ledger.createRun(budget, undefined, 700),
        params,
      ),
      calls,
      raw,
    };
  } finally {
    ledger.close();
  }
}

test("all surge windows map server filters and sorts to the documented list contract", () => {
  for (const interval of surgeIntervals) {
    const plan = planPriceSurge({
      interval,
      min_market_cap: 50000,
      max_market_cap: 5000000,
      min_trade_count: 20,
      min_holders: 5,
      platform: "pump.fun",
      offset: 2,
    });
    const p = plan.steps[0].params;
    assert.equal(p.sort_by, `price_change_${interval}_percent`);
    assert.equal(p[`min_price_change_${interval}_percent`], 50);
    assert.equal(p[`min_volume_${interval}_usd`], 5000);
    assert.equal(p[`min_trade_${interval}_count`], 20);
    assert.equal(p.min_holder, 5);
    assert.equal(p.platform_name, "pump.fun");
    assert.equal(p.offset, 2);
    assert.equal(p.min_market_cap, 50000);
    assert.equal(p.max_market_cap, 5000000);
    assert.equal(plan.maxRequests, 1);
    assert.equal(plan.estimatedCu, 50);
    for (const [sort, expected] of [
      ["volume", `volume_${interval}_usd`],
      ["trade_count", `trade_${interval}_count`],
      ["holder", "holder"],
    ])
      assert.equal(
        planPriceSurge({ interval, sort_by: sort }).steps[0].params.sort_by,
        expected,
      );
  }
});

test("preflight rejects invalid parameters and preserves conservative bounded estimates", () => {
  for (const input of [
    { chain: "arbitrum" },
    { chain: "polygon" },
    { min_market_cap: 2, max_market_cap: 1 },
    { max_liquidity: 2 },
    { limit: 101 },
    { offset: 10000 },
    { top: -1 },
    { min_price_change: Infinity },
    { with_security: true },
    { no_auto_filter: "false" },
    { typo: 1 },
  ])
    assert.throws(() => planPriceSurge(input));
  assert.equal(planPriceSurge({ mode: "advanced" }).estimatedCu, 650);
  assert.equal(
    planPriceSurge({ mode: "advanced", with_security: true, top: 3 })
      .estimatedCu,
    320,
  );
  assert.equal(
    planPriceSurge({
      mode: "advanced",
      with_security: true,
      top: 100,
      limit: 2,
    }).estimatedCu,
    230,
  );
  assert.equal(planPriceSurge({ mode: "advanced", top: 0 }).estimatedCu, 50);
  assert.equal(
    planPriceSurge({ mode: "advanced", no_holder_health: true }).estimatedCu,
    350,
  );
  assert.equal(
    planPriceSurge({ mode: "advanced", chain: "robinhood" }).estimatedCu,
    350,
  );
  assert.equal(
    planPriceSurge({ mode: "advanced", interval: "1m" }).steps.find(
      (s) => s.id === "top_traders",
    )!.params.time_frame,
    "30m",
  );
  assert.equal(planCase({ kind: "skill-price-surge" }).estimatedCu, 50);
  assert.throws(() =>
    planCase({
      kind: "skill-price-surge",
      stepOverrides: { tokens: { limit: 100 } },
    }),
  );
  assert.throws(() =>
    prepare("token.price", { address: addresses[0] }, "base"),
  );
  assert.throws(() =>
    prepare("token.security", { address: addresses[0] }, "base"),
  );
});

test("standard uses one request, returns the full feed and leaves advanced fields null", async () => {
  const { out, calls, raw } = await screen({}, [clean()]);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].headers.get("x-chain"), "solana");
  assert.equal(out.data.kind, "price-surge-v1");
  assert.deepEqual(out.data.raw_response, raw);
  assert.equal(out.data.n_hydrated, 0);
  assert.equal(out.data.n_rows, 1);
  assert.equal(out.meta.cu.estimated, 50);
  for (const field of [
    "security",
    "dev_hold_pct",
    "top10_holder_pct",
    "holder_tags",
    "profitable_wallet_ratio",
    "kol_buyer_count",
  ])
    assert.equal(out.data.rows[0][field], null);
  assert.equal(out.data.rows[0].liq_mcap_ratio, 0.02);
  assert.deepEqual(out.data.cu_breakdown, ["token_list_v3=50"]);
  assert.equal(project(out, true).data.raw_response, undefined);
  assert.match(render(out, "table"), /Auto-filtered/);
});

test("first-pass rules retain every exclusion reason and no-auto-filter reverses exclusion", async () => {
  const row = clean(addresses[0], {
    market_cap: 2000000,
    liquidity: 0,
    holder: 0,
    sell_24h: 0,
    trade_24h_count: 2000,
    unique_wallet_24h: 1,
  });
  const expected = [
    "stale_market_cap",
    "no_liquidity",
    "zero_holders_with_trades",
    "thin_liquidity",
    "honeypot_proxy",
    "wash_trade_proxy",
  ];
  const { out } = await screen({}, [row]);
  assert.equal(out.data.n_excluded, 1);
  assert.equal(out.data.n_rows, 0);
  assert.deepEqual(out.data.dropped[0].flags, expected);
  const kept = await screen({ no_auto_filter: true }, [row]);
  assert.equal(kept.out.data.n_rows, 1);
  assert.equal(kept.out.data.n_excluded, 0);
  assert.deepEqual(kept.out.data.rows[0].risk_flags, expected);
  assert.equal(kept.out.data.rows[0].excluded, false);
  const unknown = await screen({}, [
    {
      address: addresses[0],
      liquidity: null,
      market_cap: null,
      holder: null,
      buy_24h: 30,
    },
  ]);
  assert.deepEqual(unknown.out.data.rows[0].risk_flags, []);
  assert.ok(unknown.out.data.rows[0].missing_fields.length > 0);
  const negative = await screen({}, [clean(addresses[0], { liquidity: -1 })]);
  assert.ok(negative.out.data.dropped[0].flags.includes("no_liquidity"));
  const boundary = await screen({}, [
    clean(addresses[0], {
      market_cap: 1010000,
      fdv: 1000000,
      liquidity: 5050,
      trade_24h_count: 1500,
      unique_wallet_24h: 10,
      buy_24h: 19,
      sell_24h: 0,
    }),
  ]);
  assert.deepEqual(
    boundary.out.data.rows[0].risk_flags,
    [],
    "equal thresholds are allowed",
  );
});

test("advanced hydrates only first-pass survivors, caps work, and normalizes each source", async () => {
  const { out, calls } = await screen(
    { mode: "advanced", top: 1, with_security: true },
    [
      clean(addresses[0], { liquidity: 0 }),
      clean(addresses[1]),
      clean(addresses[2]),
    ],
    (url) => {
      assert.equal(
        url.searchParams.get("address") ??
          url.searchParams.get("token_address"),
        addresses[1],
      );
      if (url.pathname.endsWith("token_security"))
        return {
          creatorPercentage: 0.124,
          top10HolderPercent: 0.487,
          freezeable: false,
          mintable: false,
          mutableMetadata: false,
          lpLocked: true,
          transferFeeEnable: false,
        };
      if (url.pathname.endsWith("top_traders"))
        return {
          items: [
            { owner: "a", totalPnl: 1, tags: ["kol"], tradeBuy: 2 },
            { owner: "a", totalPnl: 1, tags: ["kol"], tradeBuy: 2 },
            { owner: "b", totalPnl: -1 },
            { owner: "c" },
          ],
        };
      return {
        token: { top10_holder: { percent_of_supply: 99 } },
        holder_summary: {},
        tags: [{ tag: "bundler", holder_count: 29, percent_of_supply: 8.6 }],
      };
    },
  );
  assert.equal(calls.length, 4);
  assert.equal(out.meta.cu.estimated, 140);
  assert.equal(out.data.n_hydrated, 1);
  assert.equal(out.data.rows[0].dev_hold_pct, 12.4);
  assert.equal(out.data.rows[0].top10_holder_pct, 48.7);
  assert.equal(out.data.rows[0].kol_buyer_count, 1);
  assert.equal(out.data.rows[0].profitable_wallet_ratio, 50);
  assert.equal(out.data.rows[0].holder_tags.bundler.percent_of_supply, 8.6);
  assert.equal(out.data.rows[0].hydration_status, "complete");
  assert.equal(out.data.rows[1].security, null);
  assert.equal(out.data.rows[1].hydration_status, "not_selected");
  assert.match(out.data.hydration_note, /bounded/);
  assert.deepEqual(out.data.rows[0].risk_flags, ["high_dev_hold"]);
  assert.equal(out.data.sources.length, 4);
  assert.ok(out.data.sources.every((s: Data) => s.rawResponse));
});

test("advanced exclusions, flag-only thresholds and explicit risk caps are independent", async () => {
  const { out } = await screen(
    {
      mode: "advanced",
      with_security: true,
      max_dev_hold_pct: 15,
      max_top10_pct: 60,
      min_kol_buyers: 1,
    },
    [clean()],
    (url) => {
      if (url.pathname.endsWith("token_security"))
        return {
          isHoneypot: "1",
          creatorPercentage: 0.2,
          top10HolderPercent: 0.7,
          lpLocked: false,
          freezeable: true,
          transferFeeEnable: true,
          transferFeeData: { transferFeeBasisPoints: 9000 },
        };
      if (url.pathname.endsWith("top_traders"))
        return {
          items: [{ owner: "seller", tags: ["kol"], tradeBuy: 0, totalPnl: 1 }],
        };
      return { token: {}, holder_summary: {}, tags: [] };
    },
  );
  assert.equal(out.data.n_excluded, 1);
  for (const reason of [
    "honeypot",
    "honeypot_tax",
    "high_transfer_tax",
    "rug_pull_risk",
    "dev_hold_over_limit",
    "top10_over_limit",
    "low_kol_buyers",
  ])
    assert.ok(out.data.dropped[0].flags.includes(reason), reason);
  const flagged = await screen(
    { mode: "advanced", with_security: true, no_holder_health: true },
    [clean()],
    (url) =>
      url.pathname.endsWith("token_security")
        ? {
            creatorPercentage: 0.1,
            top10HolderPercent: 0.5,
            transferFeeData: { transferFeeBasisPoints: 1000 },
          }
        : { items: [] },
  );
  assert.equal(flagged.out.data.n_rows, 1);
  assert.equal(flagged.out.data.rows[0].excluded, false);
  assert.deepEqual(flagged.out.data.rows[0].risk_flags, [
    "high_transfer_tax",
    "high_dev_hold",
    "top10_concentration",
  ]);
});

test("missing KOL and security evidence cannot trigger caps or imply safety", async () => {
  const { out } = await screen(
    {
      mode: "advanced",
      max_dev_hold_pct: 0,
      max_top10_pct: 0,
      min_kol_buyers: 1,
    },
    [clean()],
    (url) =>
      url.pathname.endsWith("top_traders")
        ? { items: [{ owner: "a", tradeBuy: 5, tags: ["smart_trader"] }] }
        : {
            token: { top10_holder: { percent_of_supply: 90 } },
            holder_summary: {},
            tags: [{ tag: "kol", holder_count: 10, percent_of_supply: 90 }],
          },
  );
  assert.equal(out.data.n_rows, 1);
  assert.equal(out.data.rows[0].kol_buyer_count, null);
  assert.equal(out.data.rows[0].top10_holder_pct, null);
  assert.ok(
    out.data.scopeNotes.some((n: string) => n.includes("cannot be evaluated")),
  );
  const unknown = await screen(
    { mode: "advanced", with_security: true, no_holder_health: true },
    [clean()],
    (url) =>
      url.pathname.endsWith("token_security")
        ? {
            freezeAuthority: null,
            ownerAddress: null,
            lockInfo: null,
            sellTax: "90",
            transferFeeData: {
              newerTransferFee: { transferFeeBasisPoints: 9500 },
            },
          }
        : { items: [] },
  );
  for (const key of [
    "mint_renounced",
    "freeze_renounced",
    "lp_locked",
    "transfer_fee_pct",
  ])
    assert.equal(unknown.out.data.rows[0].security[key], null);
  assert.deepEqual(unknown.out.data.rows[0].risk_flags, []);
});

test("EVM requests use EVM addresses and skip Solana-only fields and holder calls", async () => {
  for (const chain of ["base", "bsc", "ethereum", "robinhood"]) {
    const { out, calls } = await screen(
      { chain, mode: "advanced", with_security: true },
      [clean("0x0000000000000000000000000000000000000001")],
      (url) =>
        url.pathname.endsWith("token_security")
          ? { isHoneypot: "0", isMintable: "0", isOpenSource: "1" }
          : { items: [] },
    );
    assert.equal(calls.length, 3);
    assert.ok(calls.every((c) => c.headers.get("x-chain") === chain));
    assert.equal(out.meta.cu.estimated, 110);
    assert.equal(out.data.rows[0].security.mint_renounced, true);
    assert.equal(out.data.rows[0].holder_tags, null);
    assert.equal(calls[2].url.searchParams.has("ui_amount_mode"), false);
    assert.equal(calls[2].url.searchParams.has("get_holders_networth"), false);
  }
});

test("budget and authentication failures stop paid work and preserve partial evidence", async () => {
  const limited = await screen(
    { mode: "advanced", with_security: true },
    [clean()],
    () => ({ isHoneypot: false }),
    80,
  );
  assert.equal(limited.calls.length, 2);
  assert.equal(limited.out.meta.coverage, "partial");
  assert.equal(limited.out.meta.cu.budgetUsed, 80);
  assert.equal(limited.out.data.n_rows, 1);
  assert.equal(limited.out.data.rows[0].hydration_status, "partial");
  assert.equal(limited.out.data.sources.length, 2);
  const blocked = await screen({}, [clean()], undefined, 49);
  assert.equal(blocked.calls.length, 0);
  assert.equal(blocked.out.meta.coverage, "partial");
  assert.equal(blocked.out.data.raw_response, null);
  const denied = await screen(
    { mode: "advanced", with_security: true, top: 2 },
    [clean(), clean(addresses[1])],
    () => new Response("denied", { status: 403 }),
  );
  assert.equal(denied.calls.length, 2);
  assert.equal(denied.out.meta.coverage, "partial");
  assert.equal(denied.out.meta.cu.uncertainAttempts, 1);
});

test("documented EVM LP positions distinguish unlocked, fully locked and incomplete evidence", async () => {
  for (const [holders, expected] of [
    [[{ address: "0x1", balance: "5", percent: ".1", is_locked: 0 }], false],
    [
      [
        { address: "0x1", percent: ".4", is_locked: 1 },
        { address: "0x2", percent: ".6", is_locked: true },
      ],
      true,
    ],
    [[{ address: "0x1", percent: ".4", is_locked: 1 }], null],
    [
      [
        { address: "0x1", percent: ".6", is_locked: 1 },
        { address: "0x1", percent: ".6", is_locked: 1 },
      ],
      null,
    ],
  ] as const) {
    const { out } = await screen(
      {
        chain: "base",
        mode: "advanced",
        with_security: true,
        no_auto_filter: true,
      },
      [clean("0x0000000000000000000000000000000000000001")],
      (url) =>
        url.pathname.endsWith("token_security")
          ? { lpHolders: holders, isMintable: "1" }
          : { items: [] },
    );
    assert.equal(out.data.rows[0].security.lp_locked, expected);
    assert.equal(
      out.data.rows[0].risk_flags.includes("rug_pull_risk"),
      expected === false,
    );
  }
});

test("retry reservations appear in the breakdown; empty lists never hydrate", async () => {
  let attempts = 0;
  const { out } = await screen(
    { mode: "advanced", no_holder_health: true },
    [clean()],
    () =>
      ++attempts === 1
        ? new Response("retry", { status: 500 })
        : { items: [{ owner: "a", totalPnl: 2 }] },
    undefined,
    1,
  );
  assert.equal(out.meta.cu.budgetUsed, 110);
  assert.deepEqual(out.data.cu_breakdown, [
    "token_list_v3=50",
    "top_traders=30x2",
  ]);
  const empty = await screen({ mode: "advanced", with_security: true }, []);
  assert.equal(empty.calls.length, 1);
  assert.equal(empty.out.data.n_rows, 0);
  assert.equal(empty.out.data.n_hydrated, 0);
  assert.equal(empty.out.meta.coverage, "complete-for-requested-scope");
});

test("malformed or unavailable feeds are partial, and cancellation prevents further calls", async () => {
  for (const data of [null, { unexpected: [] }]) {
    const ledger = new Ledger(":memory:");
    try {
      const runner = new Runner(ledger, "fixture", {
        retries: 0,
        fetch: async () => Response.json({ success: true, data }),
      });
      const out = await runPriceSurge(runner, ledger.createRun(100), {});
      assert.equal(out.meta.coverage, "partial");
      assert.ok(out.data.missing.length);
      assert.equal(out.data.n_rows, 0);
    } finally {
      ledger.close();
    }
  }
  const ledger = new Ledger(":memory:"),
    abort = new AbortController();
  let calls = 0;
  try {
    const runner = new Runner(ledger, "fixture", {
      fetch: async () => {
        calls++;
        abort.abort();
        return Response.json({ success: true, data: { items: [clean()] } });
      },
    });
    await assert.rejects(
      runPriceSurge(
        runner,
        ledger.createRun(300),
        { mode: "advanced" },
        abort.signal,
      ),
    );
    assert.equal(calls, 1);
  } finally {
    ledger.close();
  }
});

test("single HTTP endpoint authenticates, plans free, returns full results, and persists history", async () => {
  const ledger = new Ledger(":memory:");
  let calls = 0;
  const service = new ResearchService({
    ledger,
    runnerFactory: (apiKey) =>
      new Runner(ledger, apiKey, {
        fetch: async () => {
          calls++;
          return Response.json({ success: true, data: { items: [clean()] } });
        },
      }),
  });
  const app = await startInternalApi({ service, listen: false });
  const request = inProcessFetch(app.handler, app.url);
  try {
    assert.equal(
      (
        await request(app.url + "/price-surge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        })
      ).status,
      401,
    );
    const headers = {
      "Content-Type": "application/json",
      "X-API-KEY": "fixture",
    };
    const post = (data: unknown) =>
      request(app.url + "/price-surge", {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
    const preview = await post({
      estimate_cu: true,
      mode: "advanced",
      with_security: true,
      top: 3,
    });
    assert.equal(preview.status, 200);
    assert.equal((await preview.json()).estimatedCu, 320);
    assert.equal(calls, 0);
    for (const bad of [
      null,
      [],
      { top: -1 },
      { estimate_cu: "true" },
      { unknown: 4 },
    ])
      assert.equal((await post(bad)).status, 400);
    assert.equal(calls, 0);
    const response = await post({ max_cu: 50 });
    assert.equal(response.status, 200);
    const out = await response.json();
    assert.equal(out.data.kind, "price-surge-v1");
    assert.equal(out.data.n_rows, 1);
    assert.equal(calls, 1);
    const saved = new RunStore(ledger).get(out.meta.runId);
    assert.equal(saved.result!.data.raw_response.success, true);
    const partial = await (await post({ max_cu: 0 })).json();
    assert.equal(partial.meta.coverage, "partial");
    assert.equal(calls, 1);
  } finally {
    await app.close();
    ledger.close();
  }
});

test("CLI and case alias preview the same service without credentials or persistent writes", () => {
  const dir = mkdtempSync(join(tmpdir(), "surge-cli-"));
  const exec = (args: string[]) =>
    spawnSync(
      process.execPath,
      ["dist/index.js", ...args, "--estimate-cu", "--config-dir", dir],
      { encoding: "utf8", env: { ...process.env, BIRDEYE_API_KEY: "" } },
    );
  try {
    const main = exec([
      "price-surge",
      "--chain",
      "base",
      "--mode",
      "advanced",
      "--with-security",
      "--top",
      "3",
      "--no-auto-filter",
      "--format",
      "ui",
    ]);
    assert.equal(main.status, 0, main.stderr);
    const plan = JSON.parse(main.stdout);
    assert.equal(plan.estimatedCu, 230);
    assert.equal(plan.params.no_auto_filter, true);
    assert.equal(plan.params.chain, "base");
    const alias = exec([
      "case",
      "skill-price-surge",
      "--price-surge",
      JSON.stringify(plan.params),
    ]);
    assert.equal(alias.status, 0, alias.stderr);
    assert.deepEqual(JSON.parse(alias.stdout), plan);
    const invalid = exec(["price-surge", "--chain", "arbitrum"]);
    assert.notEqual(invalid.status, 0);
    assert.match(invalid.stdout + invalid.stderr, /Arbitrum/);
    const args = caseCliArgs(
      {
        kind: "skill-price-surge",
        priceSurge: { chain: "base", apiKey: "secret", no_auto_filter: true },
      },
      null,
    );
    assert.ok(!args.includes("secret"));
    assert.ok(args.includes("--no-auto-filter"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
