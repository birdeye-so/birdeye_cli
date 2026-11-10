import test from "node:test";
import assert from "node:assert/strict";
import { tokenDdScore, drawdownGate } from "../src/token-dd-score.js";
import { planCase } from "../src/workflows.js";
import type { Result } from "../src/runner.js";

// Scoring regression vectors; private source documents are not required or distributed.
// Golden values are calculated separately from the production scorer.
const address = "So11111111111111111111111111111111111111112";
const input = planCase({
  kind: "skill-token-dd-score",
  address,
  ddMode: "advanced",
}).input;
const source = (operation: string, data: unknown): Result => ({
  schemaVersion: 1,
  data,
  meta: {
    operation,
    chain: "solana",
    requestId: operation,
    params: { address },
  },
});
function near(actual: number | null, expected: number) {
  assert.ok(
    actual !== null && Math.abs(actual - expected) < 1e-8,
    `${actual} != ${expected}`,
  );
}

test("PDF pp6–8: midpoint activity inputs produce 60 with all four signals present", () => {
  const overview: Record<string, unknown> = {
    trade24h: Math.sqrt(20 * 15000),
    v24hUSD: 1000,
    liquidity: 1000 / 1.505,
    marketCap: 1000 / 0.813855,
    uniqueWallet24h: 178,
    moneyFlow: [{ frame: "24h", netUsd: 25 }],
  };
  for (const frame of ["5m", "1h", "4h", "24h"]) {
    overview[`vBuy${frame}USD`] = 550;
    overview[`vSell${frame}USD`] = 450;
  }
  for (const frame of ["15m", "1h", "4h", "24h"]) {
    for (const key of [
      `priceChange${frame}Percent`,
      `v${frame}ChangePercent`,
      `uniqueWallet${frame}ChangePercent`,
      `liquidity${frame}ChangePercent`,
    ])
      overview[key] = 0;
  }
  const r = tokenDdScore(input, [source("token.overview", overview)]);
  for (const key of ["engagement", "buy_pressure", "momentum"])
    near(r.pillars.activity.signals[key].score, 50);
  near(r.pillars.activity.signals.drawdown.score, 100);
  near(r.pillars.activity.score, 60);
  near(r.pillars.activity.coverage, 1);
});

test("PDF pp8–10: liquidity golden vector, conditional on v1 exit_floor interpretation", () => {
  const items = Array.from({ length: 8 }, (_, i) => ({
    unix_time: 1000 + i * 900,
    close_liquidity_usd: 100000 - (45000 * i) / 7,
    close_exit_liquidity_usd: 100000 - (30000 * i) / 7,
    total_pairs: 3,
  }));
  const r = tokenDdScore(input, [
    source("token.overview", { marketCap: 1000000 }),
    source("token.liquidity-ohlc", { items }),
  ]);
  const expected = {
    depth: 71.17817892972782,
    stability: 53.523731778425656,
    valuation: 100,
    trend: 4.74258731775668,
    pairs: 50,
  };
  for (const [key, value] of Object.entries(expected))
    near(r.pillars.liquidity.signals[key].score, value);
  near(r.pillars.liquidity.score, 60.44577472118826);
  near(r.gate_detail.gate, 0.95);
});

test("PDF pp12–14: tagged-flow upper anchors and cohort inputs produce Smart Money 86.622", () => {
  const overview: Record<string, number> = {};
  const flow = [];
  for (const frame of ["5m", "1h", "4h", "24h"]) {
    overview[`v${frame}USD`] = 1000;
    for (const [tag, netUsd] of [
      ["smart_money", 120],
      ["whales", 80],
      ["kol", 60],
    ] as const) {
      flow.push({ frame, tag, netUsd, totalTxBuy: 75, totalTxSell: 25 });
    }
  }
  const tags = [
    {
      tag: "smart_trader",
      holder_count: 25,
      percent_of_supply: 4,
      buy_volume_usd: 75,
      sell_volume_usd: 25,
    },
    { tag: "whales", holder_count: 20, percent_of_supply: 12 },
    { tag: "kol", holder_count: 40, percent_of_supply: 8 },
  ];
  const r = tokenDdScore(input, [
    source("token.overview", overview),
    source("token.money-flow", flow),
    source("token.holder-profile", { tags }),
  ]);
  const expected = {
    sm_presence: 75,
    sm_flow: 100,
    sm_quality: 64.36,
    whale: 100,
    kol: 100,
  };
  for (const [key, value] of Object.entries(expected))
    near(r.pillars.smart_money.signals[key].score, value);
  // .25*75 + .30*100 + .20*64.36 + .15*100 + .10*100 = 86.622.
  near(r.pillars.smart_money.score, 86.622);
  near(r.pillars.smart_money.coverage, 1);
});

test("PDF p10 gate equations disagree with both interior rows of the example table", () => {
  near(drawdownGate(35, 35).gate, 0.9676); // PDF table says .979.
  near(drawdownGate(50, 50).gate, 0.9028); // PDF table says .940.
  near(drawdownGate(45, 30).gate, 0.95); // PDF worked example agrees.
});

test("PDF pp1,14: absent signals and pillars lose weights; coverage does not discount scores", () => {
  const r = tokenDdScore(input, [
    source("token.security", { ownerAddress: null }),
    source("token.overview", { holder: 0 }),
  ]);
  near(r.pillars.security.score, 100);
  near(r.pillars.security.coverage, 2 / 9);
  near(r.pillars.holders.score, 0);
  near(r.pillars.holders.coverage, 0.2);
  near(r.score.weights_used.security, 17 / 45);
  near(r.score.weights_used.holders, 28 / 45);
  near(r.score.final, 37.77777777777778);
  const sparse = tokenDdScore(input, [
    source("token.security", { ownerAddress: null }),
  ]);
  near(sparse.score.final, 100);
  assert.equal(sparse.score.rating, "A+");
});

test("all seven null API payloads produce UNAVAILABLE; missing authority is not renounced", () => {
  const operations = [
    "token.overview",
    "token.security",
    "token.holder-distribution",
    "token.holder-profile",
    "token.holders",
    "token.money-flow",
    "token.liquidity-ohlc",
  ];
  for (const sources of [
    [],
    operations.map((op) => source(op, null)),
    operations.map((op) => source(op, {})),
  ]) {
    const r = tokenDdScore(input, sources);
    assert.equal(r.score.final, null);
    assert.equal(r.score.verdict, "UNAVAILABLE");
    assert.equal(r.pillars.security.signals.mint_authority.score, null);
    near(r.gate_detail.gate, 1);
  }
});
