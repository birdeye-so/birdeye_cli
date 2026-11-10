import test from "node:test";
import assert from "node:assert/strict";
import { Ledger } from "../src/ledger.js";
import { Runner } from "../src/runner.js";
import { RunStore } from "../src/run-store.js";
import {
  ResearchService,
  prepareResearchRequest,
} from "../src/internal-api/service.js";
import { startInternalApi } from "../src/internal-api/server.js";
import { startInterface } from "../src/interface/server.js";
import { inProcessFetch } from "./http-helper.js";
import { credentialId } from "../src/config.js";

const address = "So11111111111111111111111111111111111111112";
const headers = {
  "Content-Type": "application/json",
  "X-API-KEY": "fixture-client-key",
};
function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
const fixture: typeof fetch = async (value) => {
  const path = new URL(String(value)).pathname;
  if (path.endsWith("money-flow")) return Response.json([]);
  return Response.json({
    success: true,
    data: path.endsWith("token_overview")
      ? {
          address,
          liquidity: 10000,
          marketCap: 100000,
          holder: 1000,
          priceChange24hPercent: 3,
        }
      : path.endsWith("token_security")
        ? { isHoneypot: true, creatorPercentage: 0.01 }
        : path.endsWith("distribution")
          ? { summary: {}, holders: [] }
          : path.endsWith("holder-profile")
            ? { token: {}, holder_summary: {}, tags: [] }
            : { items: [] },
  });
};
async function appFor(
  upstream: typeof fetch = fixture,
  maxCu?: number,
  listen = false,
) {
  const ledger = new Ledger(":memory:");
  const service = new ResearchService({
    ledger,
    maxCu,
    runnerFactory: (apiKey) =>
      new Runner(ledger, apiKey, { fetch: upstream, retries: 0 }),
  });
  const app = await startInternalApi({ service, port: 0, listen });
  const request = listen ? fetch : inProcessFetch(app.handler, app.url);
  return {
    ...app,
    ledger,
    service,
    request,
    post: (path: string, data: unknown) =>
      request(app.url + path, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      }),
    close: async () => {
      await app.close();
      ledger.close();
    },
  };
}

test("Token DD preflight maps bounded snake_case inputs and validates chain before execution", () => {
  const standard = prepareResearchRequest("token-dd", {
    address,
    mode: "standard",
  });
  assert.equal(standard.plan.estimatedCu, 51);
  assert.equal(standard.plan.maxRequests, 2);
  const advanced = prepareResearchRequest("token-dd", {
    address,
    top_n: 10,
    liq_resolution: "1h",
    liq_candles: 24,
  });
  assert.equal(advanced.plan.estimatedCu, 181);
  assert.equal(advanced.plan.maxRequests, 7);
  assert.equal(advanced.workflow.input.ddMode, "advanced");
  assert.equal(
    advanced.workflow.steps.find((step) => step.id === "distribution")!.params
      .top_n,
    10,
  );
  assert.equal(
    advanced.workflow.steps.find((step) => step.id === "liquidity")!.params
      .count,
    24,
  );
  for (const invalid of [
    {},
    { address: "bad" },
    { address, chain: "base" },
    { address, top_n: 51 },
    { address, liq_candles: 101 },
    { address, mode: "fast" },
    { address, ddMode: "standard" },
    { address, estimate_cu: "true" },
  ])
    assert.throws(() => prepareResearchRequest("token-dd", invalid));
});

test("API estimates need no key and allocate no ledger run; live requests require the caller's key", async () => {
  const ledger = new Ledger(":memory:"),
    service = new ResearchService({ ledger });
  const app = await startInternalApi({ service, listen: false });
  const request = inProcessFetch(app.handler, app.url);
  const headers = { "Content-Type": "application/json" };
  try {
    for (const path of ["/price-surge", "/token-dd"]) {
      const params = path === "/token-dd" ? { address, mode: "standard" } : {};
      const estimate = await request(app.url + path, {
        method: "POST",
        headers,
        body: JSON.stringify({ ...params, estimate_cu: true }),
      });
      assert.equal(estimate.status, 200);
      assert.equal(
        (await estimate.json()).estimatedCu,
        path === "/token-dd" ? 51 : 50,
      );
      const live = await request(app.url + path, {
        method: "POST",
        headers,
        body: JSON.stringify(params),
      });
      assert.equal(live.status, 401);
      assert.equal((await live.json()).error.code, "AUTH_MISSING");
    }
    assert.equal(
      ledger.db.prepare("SELECT count(*) AS n FROM runs").get()!.n,
      0,
    );
  } finally {
    await app.close();
    ledger.close();
  }
});

test("standalone HTTP service validates caller key/body/routes and exposes no interface or settings", async () => {
  let calls = 0;
  const app = await appFor(
    async (...args) => {
      calls++;
      return fixture(...args);
    },
    undefined,
    true,
  );
  try {
    assert.equal((await app.request(app.url + "/health")).status, 200);
    const unauthorized: Record<string, string>[] = [
      {},
      { Authorization: "Bearer legacy-token" },
      { Cookie: "birdeye_session=anything" },
      { "X-API-KEY": "" },
      { "X-API-KEY": "two keys" },
      { "X-API-KEY": "x".repeat(4097) },
    ];
    for (const extra of unauthorized)
      assert.equal(
        (
          await app.request(app.url + "/price-surge", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...extra },
            body: "{}",
          })
        ).status,
        401,
      );
    for (const path of [
      "/",
      "/main.js",
      "/api/status",
      "/api/connect",
      "/api/settings",
      "/api/runs",
    ])
      assert.equal(
        (await app.request(app.url + path, { headers })).status,
        404,
      );
    const get = await app.request(app.url + "/price-surge", { headers });
    assert.equal(get.status, 405);
    assert.equal(get.headers.get("allow"), "POST");
    assert.equal(
      (
        await app.request(app.url + "/price-surge", {
          method: "POST",
          headers: { ...headers, Origin: "http://example.com" },
          body: "{}",
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await app.request(app.url + "/price-surge", {
          method: "POST",
          headers: { ...headers, "Content-Type": "text/plain" },
          body: "{}",
        })
      ).status,
      415,
    );
    assert.equal(
      (
        await app.request(app.url + "/price-surge", {
          method: "POST",
          headers,
          body: "{",
        })
      ).status,
      400,
    );
    assert.equal((await app.post("/price-surge?limit=2", {})).status, 400);
    assert.equal(
      (await app.post("/price-surge", { padding: "x".repeat(65536) })).status,
      413,
    );
    assert.equal(
      (await app.post("/token-dd", { address, chain: "base" })).status,
      400,
    );
    assert.equal(calls, 0);
  } finally {
    await app.close();
  }
});

test("Token DD returns scored evidence and durable history for both modes", async () => {
  const calls: URL[] = [];
  const app = await appFor(async (value, init) => {
    calls.push(new URL(String(value)));
    assert.equal(new Headers(init?.headers).get("x-chain"), "solana");
    return fixture(value, init);
  });
  try {
    for (const mode of ["standard", "advanced"]) {
      calls.length = 0;
      const response = await app.post("/token-dd", {
        address,
        mode,
        max_cu: 181,
        top_n: 10,
        liq_candles: 24,
      });
      assert.equal(response.status, 200);
      const result = await response.json();
      assert.equal(result.data.kind, "skill-token-dd-score");
      assert.equal(calls.length, mode === "standard" ? 2 : 7);
      assert.equal(result.data.sources.length, calls.length);
      assert.equal(result.data.skillAnalysis.findings[0].score.final, 0);
      assert.equal(result.data.skillAnalysis.findings[0].score.rating, "F");
      assert.equal(result.meta.cu.estimated, mode === "standard" ? 51 : 181);
      assert.equal(result.meta.coverage, "partial"); // Missing sample fields remain unknown.
      const saved = new RunStore(app.ledger).get(result.meta.runId);
      assert.equal(saved.input.case.ddMode, mode);
      assert.deepEqual(saved.result, result);
    }
  } finally {
    await app.close();
  }
});

test("each caller's key reaches every upstream step without entering results or saved history", async () => {
  const seen: string[] = [];
  const app = await appFor(async (value, init) => {
    const key = new Headers(init?.headers).get("x-api-key")!;
    seen.push(key);
    assert.equal(new Headers(init?.headers).has("authorization"), false);
    assert.equal(String(value).includes(key), false);
    assert.equal(String(init?.body ?? "").includes(key), false);
    return fixture(value, init);
  });
  try {
    for (const [path, input, key, count] of [
      [
        "/token-dd",
        { address, mode: "advanced" },
        "client-A-private-birdeye-key",
        7,
      ],
      ["/price-surge", {}, "client-B-private-birdeye-key", 1],
      [
        "/token-dd",
        { address, mode: "standard" },
        "client-C-private-birdeye-key",
        2,
      ],
    ] as const) {
      seen.length = 0;
      const response = await app.request(app.url + path, {
        method: "POST",
        headers: { ...headers, "X-API-KEY": key },
        body: JSON.stringify(input),
      });
      assert.equal(response.status, 200);
      const result = await response.json();
      assert.deepEqual(seen, Array(count).fill(key));
      const attempts = app.ledger.attempts(result.meta.runId);
      assert.ok(
        attempts.every((attempt) => attempt.credential === credentialId(key)),
      );
      for (const payload of [
        result,
        new RunStore(app.ledger).get(result.meta.runId),
        attempts,
      ])
        assert.equal(JSON.stringify(payload).includes(key), false);
    }
    const previousCalls = seen.length;
    const noKey = await app.request(app.url + "/token-dd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });
    assert.equal(noKey.status, 401); // A later request cannot reuse the last caller's key.
    assert.equal(seen.length, previousCalls);
    assert.equal(
      (
        await app.post("/token-dd", {
          address,
          api_key: "body-key-must-not-be-saved",
        })
      ).status,
      400,
    );
  } finally {
    await app.close();
  }
});

test("retries keep the caller key; upstream authentication failures never substitute another key", async () => {
  const ledger = new Ledger(":memory:");
  const seen: string[] = [];
  let retry = true;
  const service = new ResearchService({
    ledger,
    runnerFactory: (apiKey) =>
      new Runner(ledger, apiKey, {
        retries: 1,
        fetch: async (value, init) => {
          seen.push(new Headers(init?.headers).get("x-api-key")!);
          if (apiKey === "rejected-client-key")
            return Response.json(
              { error: `Invalid ${apiKey}` },
              { status: 401 },
            );
          if (retry) {
            retry = false;
            return Response.json({}, { status: 429 });
          }
          return fixture(value, init);
        },
      }),
  });
  try {
    const success = await service.run(
      "price-surge",
      { max_cu: 100 },
      { apiKey: "retry-client-key" },
    );
    assert.deepEqual(seen, ["retry-client-key", "retry-client-key"]);
    assert.ok("meta" in success);
    assert.equal(success.meta.cu.attempts, 2);
    const failure = await service.run(
      "token-dd",
      { address },
      { apiKey: "rejected-client-key" },
    );
    assert.ok("meta" in failure);
    assert.equal(failure.meta.coverage, "partial");
    assert.equal(failure.meta.cu.attempts, 1);
    assert.equal(seen.at(-1), "rejected-client-key");
    assert.equal(
      JSON.stringify(new RunStore(ledger).get(failure.meta.runId)).includes(
        "rejected-client-key",
      ),
      false,
    );
    await assert.rejects(service.run("price-surge", {}), {
      code: "AUTH_MISSING",
    });
    assert.equal(seen.length, 3);
  } finally {
    await service.close();
    ledger.close();
  }
});

test("server CU ceiling cannot be removed by a request and lower client caps retain partial evidence", async () => {
  let calls = 0;
  const app = await appFor(async (...args) => {
    calls++;
    return fixture(...args);
  }, 21);
  try {
    for (const max_cu of [undefined, null, 181, 0]) {
      calls = 0;
      const result = await (
        await app.post("/token-dd", { address, mode: "standard", max_cu })
      ).json();
      assert.equal(calls, max_cu === 0 ? 0 : 1);
      assert.equal(result.data.sources.length, calls);
      assert.equal(result.meta.cu.budgetUsed, calls * 21);
      assert.equal(result.meta.coverage, "partial");
      assert.ok(
        result.data.missing.some(
          (item: { reason: string }) => item.reason === "CU_BUDGET_EXCEEDED",
        ),
      );
    }
  } finally {
    await app.close();
  }
});

test("one live run per service, free estimates while busy, shutdown cancels and preserves a checkpoint", async () => {
  const entered = deferred();
  let calls = 0;
  const app = await appFor(async (value, init) => {
    calls++;
    if (calls === 1) return fixture(value, init);
    entered.resolve();
    return new Promise((_resolve, reject) =>
      init!.signal!.addEventListener(
        "abort",
        () => reject(init!.signal!.reason),
        { once: true },
      ),
    );
  });
  try {
    const pending = app.post("/token-dd", { address });
    await entered.promise;
    assert.equal((await app.post("/price-surge", {})).status, 409);
    assert.equal(
      (await app.post("/price-surge", { estimate_cu: true })).status,
      200,
    );
    await app.service.close();
    const cancelled = await pending;
    assert.equal(cancelled.status, 503);
    const out = await cancelled.json();
    assert.equal(out.error.code, "CANCELLED");
    assert.equal(out.result.data.sources.length, 1);
    assert.equal(out.result.meta.cu.uncertainAttempts, 1);
    assert.equal(new RunStore(app.ledger).get(out.run_id).status, "cancelled");
    assert.equal(calls, 2);
    assert.equal(
      (await app.post("/price-surge", { estimate_cu: true })).status,
      503,
    );
  } finally {
    await app.close();
  }
});

test("HTTP disconnect aborts upstream work and releases the live slot", async () => {
  const entered = deferred(),
    aborted = deferred();
  const app = await appFor(
    async (_value, init) => {
      entered.resolve();
      return new Promise((_resolve, reject) =>
        init!.signal!.addEventListener(
          "abort",
          () => {
            aborted.resolve();
            reject(init!.signal!.reason);
          },
          { once: true },
        ),
      );
    },
    undefined,
    true,
  );
  try {
    const controller = new AbortController();
    const request = fetch(app.url + "/token-dd", {
      method: "POST",
      headers,
      body: JSON.stringify({ address }),
      signal: controller.signal,
    });
    const rejected = assert.rejects(request, { name: "AbortError" });
    await entered.promise;
    controller.abort();
    await rejected;
    await aborted.promise;
    // close() drains the cancelled promise before inspecting its persisted state.
    await app.service.close();
    const item = new RunStore(app.ledger).list().items[0];
    assert.equal(item.status, "cancelled");
    assert.equal(app.ledger.summary().attempts, 1);
  } finally {
    await app.close();
  }
});

test("storage failure occurs before paid requests and releases the execution slot", async () => {
  let calls = 0;
  const app = await appFor(async (...args) => {
    calls++;
    return fixture(...args);
  });
  try {
    app.ledger.db.exec("DROP TABLE saved_runs");
    assert.equal((await app.post("/price-surge", {})).status, 500);
    new RunStore(app.ledger);
    assert.equal((await app.post("/price-surge", { max_cu: 50 })).status, 200);
    assert.equal(calls, 1);
  } finally {
    await app.close();
  }
});

test("main web interface no longer serves aggregate API routes", async () => {
  const ledger = new Ledger(":memory:");
  const app = await startInterface({
    ledger,
    listen: false,
    config: { ai: { defaultProfile: "research", profiles: {} } },
  });
  try {
    const request = inProcessFetch(app.handler, app.url);
    for (const path of ["/price-surge", "/token-dd"]) {
      const response = await request(app.url + path, {
        method: "POST",
        headers,
        body: "{}",
      });
      assert.equal(response.status, 404);
      assert.match((await response.json()).error.message, /birdeye-api/);
    }
    assert.equal(ledger.summary().attempts, 0);
  } finally {
    await app.close();
    ledger.close();
  }
});
