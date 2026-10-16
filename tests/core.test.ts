import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Ledger } from "../src/ledger.js";
import { Runner } from "../src/runner.js";
import { prepare } from "../src/catalog.js";
import { parseData, AppError } from "../src/shared.js";
import { project } from "../src/output.js";
import { runCase, metricsFor } from "../src/analysis.js";
import { runChat, completion } from "../src/ai.js";
import {
  readConfig,
  saveConfig,
  safeConfig,
  validateProviderUrl,
} from "../src/config.js";

const address = "So11111111111111111111111111111111111111112";
const ok = (data: unknown) => Response.json({ success: true, data });
const withDb = () => new Ledger(":memory:");
test("validates Solana bytes, unsupported chains, parameters and pagination before billing", () => {
  assert.throws(() => prepare("token.price", { address: "SOL" }));
  assert.throws(() => prepare("token.price", { address: "z".repeat(44) }));
  assert.throws(() => prepare("token.price", { address }, "ethereum"));
  assert.throws(() =>
    prepare("token.holders", { address, limit: 100, offset: 9950 }),
  );
  assert.throws(() =>
    prepare("market.ohlcv", { address, time_from: 20, time_to: 10 }),
  );
  assert.throws(() =>
    prepare("market.trending", { url: "https://evil.example" }),
  );
  assert.equal(prepare("token.price", { address }).entry.cost, 3);
});
test("preserves unsafe integers and high precision decimals without changing null or zero", () => {
  const d = parseData(
    '{"integer":123456789012345678901,"fraction":0.123456789012345678901,"price":1.25,"zero":0,"nil":null}',
  );
  assert.equal(d.integer, "123456789012345678901");
  assert.equal(d.fraction, "0.123456789012345678901");
  assert.equal(d.price, 1.25);
  assert.equal(d.zero, 0);
  assert.equal(d.nil, null);
});
test("sends headers and accounts successful requests once", async () => {
  const ledger = withDb();
  const run = ledger.createRun(3);
  let calls = 0;
  const runner = new Runner(ledger, "test-secret", {
    fetch: async (url, init) => {
      calls++;
      assert.equal(new URL(String(url)).searchParams.get("address"), address);
      assert.equal(
        (init?.headers as Record<string, string>)["X-API-KEY"],
        "test-secret",
      );
      return ok({ value: 1.25 });
    },
  });
  const result = await runner.execute("token.price", { address }, { run });
  assert.equal(result.data.value, 1.25);
  assert.equal(result.meta.cu.estimated, 3);
  assert.equal(result.meta.cu.reported, null);
  await assert.rejects(runner.execute("token.price", { address }, { run }), {
    code: "CU_BUDGET_EXCEEDED",
  });
  assert.equal(calls, 1);
  ledger.close();
});
test("retry consumes a separate reservation; uncertain billing is never zeroed", async () => {
  const ledger = withDb();
  const run = ledger.createRun(6);
  let calls = 0;
  const runner = new Runner(ledger, "key", {
    fetch: async () =>
      ++calls === 1 ? new Response("", { status: 503 }) : ok({ value: 0 }),
  });
  const r = await runner.execute("token.price", { address }, { run });
  assert.equal(r.data.value, 0);
  assert.deepEqual(
    {
      estimate: r.meta.cu.estimated,
      budget: r.meta.cu.budgetUsed,
      uncertain: r.meta.cu.uncertainAttempts,
      attempts: r.meta.cu.attempts,
    },
    { estimate: 3, budget: 6, uncertain: 1, attempts: 2 },
  );
  ledger.close();
});
test("retry blocked by budget performs no second network call", async () => {
  const ledger = withDb();
  const run = ledger.createRun(3);
  let calls = 0;
  const runner = new Runner(ledger, "key", {
    fetch: async () => {
      calls++;
      return new Response("", { status: 429 });
    },
  });
  await assert.rejects(runner.execute("token.price", { address }, { run }), {
    code: "CU_BUDGET_EXCEEDED",
  });
  assert.equal(calls, 1);
  assert.equal(ledger.summary(run).uncertainAttempts, 1);
  ledger.close();
});
test("cancel before dispatch is free; cancel after dispatch retains uncertain CU", async () => {
  const ledger = withDb();
  const run = ledger.createRun(10);
  const early = new AbortController();
  early.abort();
  const runner = new Runner(ledger, "key", {
    fetch: async (_url, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener(
          "abort",
          () => reject(new DOMException("Aborted", "AbortError")),
          { once: true },
        );
      }),
  });
  await assert.rejects(
    runner.execute("token.price", { address }, { run, signal: early.signal }),
  );
  assert.equal(ledger.summary(run).budgetUsed, 0);
  const late = new AbortController();
  const promise = runner.execute(
    "token.price",
    { address },
    { run, signal: late.signal },
  );
  late.abort();
  await assert.rejects(promise);
  assert.equal(ledger.summary(run).budgetUsed, 3);
  assert.equal(ledger.summary(run).uncertainAttempts, 1);
  ledger.close();
});
test("two database connections share atomic workflow budget, including pending attempts after restart", () => {
  const dir = mkdtempSync(join(tmpdir(), "birdeye-ledger-"));
  const path = join(dir, "usage.sqlite");
  const first = new Ledger(path);
  const second = new Ledger(path);
  try {
    const workflow = first.createWorkflow("shared", 5);
    const one = first.createRun(5, workflow.id);
    const two = second.createRun(5, workflow.id);
    const id = first.reserve(one, "token.price", 3, "fake");
    assert.throws(() => second.reserve(two, "token.price", 3, "fake"), {
      code: "CU_BUDGET_EXCEEDED",
    });
    first.finish(id, "completed", 3);
    first.finish(id, "completed", 3);
    assert.equal(second.summary(undefined, workflow.id).estimated, 3);
  } finally {
    first.close();
    second.close();
    rmSync(dir, { recursive: true });
  }
});
test("HTTP 401 does not retry or include upstream response secrets", async () => {
  const ledger = withDb(),
    run = ledger.createRun(100);
  let calls = 0;
  const runner = new Runner(ledger, "secret", {
    fetch: async () => {
      calls++;
      return new Response("secret", { status: 401 });
    },
  });
  await assert.rejects(
    runner.execute("token.price", { address }, { run }),
    (e: unknown) =>
      e instanceof AppError &&
      e.code === "AUTH_INVALID" &&
      !e.message.includes("secret"),
  );
  assert.equal(calls, 1);
  ledger.close();
});
test("credits snapshot has account scope and its own 1 CU entry", async () => {
  const ledger = withDb(),
    run = ledger.createRun(5);
  const r = new Runner(ledger, "key", {
    fetch: async () => ok({ usage: { total: 100000 }, remaining: null }),
  });
  await r.execute("usage.credits", {}, { run });
  assert.equal(ledger.summary(run).estimated, 1);
  assert.equal(
    ledger.db.prepare("SELECT count(*) AS n FROM snapshots").get()?.n,
    1,
  );
  ledger.close();
});
test("short projection retains warnings, coverage, false/null and all OHLCV rows", () => {
  const meta = {
    operation: "token.security",
    warnings: ["missing data"],
    coverage: "partial",
    cu: { estimated: 25 },
  };
  const r = {
    schemaVersion: 1,
    data: { freezeable: false, ownerAddress: null, logoURI: "image" },
    meta,
  };
  const s = project(r, true);
  assert.equal(s.data.freezeable, false);
  assert.equal(s.data.ownerAddress, null);
  assert.deepEqual(s.meta, meta);
  assert.equal("logoURI" in s.data, false);
  const candles = project(
    {
      schemaVersion: 1,
      data: {
        items: [
          { c: 0, unix_time: 1 },
          { c: null, unix_time: 2 },
        ],
      },
      meta: { ...meta, operation: "market.ohlcv" },
    },
    true,
  );
  assert.equal(candles.data.rows.length, 2);
  assert.deepEqual(candles.data.rows, [
    [0, 1],
    [null, 2],
  ]);
});
test("token research costs 70 CU and computes ratio/security share with provenance", async () => {
  const ledger = withDb(),
    run = ledger.createRun(70);
  const r = new Runner(ledger, "key", {
    fetch: async (url) => {
      const path = new URL(String(url)).pathname;
      return ok(
        path.endsWith("token_overview")
          ? { address, price: 1, liquidity: 100, v24hUSD: 200 }
          : path.endsWith("token_security")
            ? { top10HolderPercent: 0.25, freezeable: false }
            : { items: [] },
      );
    },
  });
  const result = await runCase(r, run, { kind: "token-research", address });
  assert.equal(result.meta.cu.estimated, 70);
  assert.equal(result.data.metrics[0].volumeLiquidityRatio, "2.000000");
  assert.equal(result.data.metrics[1].top10HolderPct, "25");
  assert.ok(result.data.metrics[0].sourceId);
  ledger.close();
});
test("partial workflow keeps successful datasets and a budget warning", async () => {
  const ledger = withDb(),
    run = ledger.createRun(15);
  const r = new Runner(ledger, "key", {
    fetch: async () => ok({ address, price: 1 }),
  });
  const result = await runCase(r, run, { kind: "token-research", address });
  assert.equal(result.meta.coverage, "partial");
  assert.equal(result.data.sources.length, 1);
  assert.equal(result.meta.cu.estimated, 15);
  assert.equal(result.meta.warnings.length, 2);
  ledger.close();
});
test("wallet weights explicitly use the observed priced page, not upstream account total", () => {
  const rows = metricsFor([
    {
      schemaVersion: 1,
      data: {
        total_value: 1000,
        items: [
          { address, value: "1.1" },
          { address, value: "3.3" },
          { address, value: null },
        ],
      },
      meta: {
        operation: "portfolio.holdings",
        params: { wallet: address },
        requestId: "id",
        chain: "solana",
        retrievedAt: "time",
      },
    },
  ]);
  assert.equal(rows[0].observedWeightPct, "25.000000");
  assert.equal(rows[1].observedWeightPct, "75.000000");
  assert.equal(rows[2].observedWeightPct, null);
  assert.equal(rows[0].coverage, "page");
});
test("configuration redacts credentials and rejects remote HTTP", () => {
  const dir = mkdtempSync(join(tmpdir(), "birdeye-config-"));
  try {
    const config = saveConfig(
      {
        birdeyeApiKey: "private-secret",
        ai: {
          defaultProfile: "research",
          profiles: {
            research: {
              provider: "openai-compatible",
              baseUrl: "http://127.0.0.1:9000/v1",
              model: "local",
              apiKeyEnv: "TEST_AI_KEY",
              apiKey: "ai-secret",
            },
          },
        },
      },
      dir,
    );
    assert.ok(!JSON.stringify(safeConfig(config)).includes("private-secret"));
    assert.ok(!JSON.stringify(safeConfig(config)).includes("ai-secret"));
    assert.equal(readConfig(dir).ai.profiles.research.model, "local");
    assert.throws(() => validateProviderUrl("http://remote.example/v1"));
  } finally {
    rmSync(dir, { recursive: true });
  }
});
test("AI tool loop uses shared runner, deduplicates identical calls, tracks AI separately", async () => {
  const ledger = withDb(),
    run = ledger.createRun(20);
  let requests = 0,
    calls = 0;
  const runner = new Runner(ledger, "key", {
    fetch: async () => {
      requests++;
      return ok({ address, liquidity: 10, v24hUSD: 20 });
    },
  });
  const profile = {
    provider: "openai-compatible" as const,
    baseUrl: "https://example.test/v1",
    model: "test",
    apiKeyEnv: "BIRDEYE_TEST_AI_KEY",
    apiKey: "key",
  };
  const fetchAI: typeof fetch = async () => {
    calls++;
    return Response.json({
      choices: [
        {
          message:
            calls === 1
              ? {
                  role: "assistant",
                  tool_calls: [1, 2].map((n) => ({
                    id: String(n),
                    type: "function",
                    function: {
                      name: "token_overview",
                      arguments: JSON.stringify({ address }),
                    },
                  })),
                }
              : {
                  role: "assistant",
                  content: "Liquidity and volume are available.",
                },
        },
      ],
      usage: { prompt_tokens: 10, completion_tokens: 5 },
    });
  };
  const result = await runChat(runner, run, profile, "Research this token", {
    fetch: fetchAI,
    short: true,
  });
  assert.equal(requests, 1);
  assert.equal(result.meta.cu.estimated, 15);
  assert.equal(result.meta.ai.inputTokens, 20);
  assert.equal(result.meta.ai.outputTokens, 10);
  assert.equal(result.data.sources.length, 1);
  ledger.close();
});
test("provider error redacts response body and marks usage unknown", async () => {
  const usage = { inputTokens: 0, outputTokens: 0, calls: 0, unknownCalls: 0 };
  await assert.rejects(
    completion(
      {
        provider: "openai-compatible",
        baseUrl: "https://example.test/v1",
        model: "x",
        apiKeyEnv: "BIRDEYE_TEST_AI_KEY",
        apiKey: "secret",
      },
      [],
      {
        usage,
        fetch: async () => new Response("leaked secret", { status: 500 }),
      },
    ),
    (e: unknown) => e instanceof AppError && !e.message.includes("secret"),
  );
  assert.equal(usage.unknownCalls, 1);
});
