import test, { after } from "node:test";
import assert from "node:assert/strict";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { Ledger } from "../src/ledger.js";
import { Runner } from "../src/runner.js";
import { startInterface, parseBind } from "../src/interface/server.js";
import { inProcessFetch } from "./http-helper.js";

// Persistence tests must never read, migrate or write the developer's config.
const configDir = mkdtempSync(join(tmpdir(), "birdeye-interface-config-"));
process.env.BIRDEYE_CONFIG_DIR = configDir;
after(() => rmSync(configDir, {recursive: true, force: true}));

const address = "So11111111111111111111111111111111111111112";
test("loopback browsers reconnect automatically; cross-origin, missing browser headers and require-code cannot bypass authentication", async () => {
  const ledger=new Ledger(":memory:");
  try {
    for(const requireCode of [false,true]) {
      const app=await startInterface({ledger,listen:false,bind:"127.0.0.1:8787",requireCode,config:{ai:{defaultProfile:"research",profiles:{}}}});
      const fetch=inProcessFetch(app.handler,app.url);
      try {
        const denied: Record<string,string>[] = [{},{Origin:app.url},{Origin:"https://evil.test","Sec-Fetch-Site":"cross-site"}];
        for(const extra of denied) {
          const response=await fetch(app.url+"/api/connect",{method:"POST",headers:{"Content-Type":"application/json",...extra},body:JSON.stringify({local:true})});
          assert.ok([401,403].includes(response.status));
        }
        const response=await fetch(app.url+"/api/connect",{method:"POST",headers:{"Content-Type":"application/json",Origin:app.url,"Sec-Fetch-Site":"same-origin"},body:JSON.stringify({local:true})});
        assert.equal(response.status,requireCode?401:200);
        if(!requireCode){
          const cookie=response.headers.get("set-cookie")!.split(";")[0];
          assert.equal((await fetch(app.url+"/api/status",{headers:{Cookie:cookie}})).status,200);
          assert.equal((await fetch(app.url+"/api/status")).status,401,"local mode still requires a session for API access");
        }
      } finally {await app.close();}
    }
  } finally {ledger.close();}
});
test("localhost can open an interface bound to 127.0.0.1", async () => {
  // tsc does not copy static assets into the compiled test tree.
  const webDir = new URL("../src/web/", import.meta.url);
  mkdirSync(webDir, { recursive: true });
  copyFileSync("web/index.html", new URL("index.html", webDir));
  const ledger = new Ledger(":memory:");
  const app = await startInterface({ ledger, bind: "127.0.0.1:8787", listen: false });
  const localUrl = "http://localhost:8787";
  const fetch = inProcessFetch(app.handler, localUrl);
  try {
    const page = await fetch(localUrl);
    assert.equal(page.status, 200, await page.clone().text());
    assert.match(page.headers.get("content-type") || "", /text\/html/);
    const login = await fetch(localUrl + "/api/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: localUrl },
      body: JSON.stringify({ code: app.connectCode }),
    });
    assert.equal(login.status, 200);
  } finally {
    await app.close();
    ledger.close();
  }
});
test("loopback aliases keep Host, port, Origin and authentication checks", async () => {
  const ledger = new Ledger(":memory:");
  try {
    for (const bind of ["127.0.0.1:8787", "localhost:8787", "[::1]:8787"]) {
      const app = await startInterface({ ledger, bind, listen: false });
      try {
        for (const host of ["localhost:8787", "127.0.0.1:8787", "[::1]:8787"]) {
          const url = `http://${host}`;
          const fetch = inProcessFetch(app.handler, url);
          const allowedHeaders: Record<string, string>[] = [{}, { Origin: url }];
          for (const headers of allowedHeaders) {
            assert.equal((await fetch(url + "/api/status", { headers })).status, 401);
          }
          const deniedHeaders: Record<string, string>[] = [
            { Origin: "http://evil.test:8787" },
            { Origin: "null" },
            { Origin: `https://${host}` },
            { Origin: "http://localhost:9999" },
            { Origin: host.startsWith("localhost") ? "http://127.0.0.1:8787" : "http://localhost:8787" },
            { "Sec-Fetch-Site": "cross-site" },
          ];
          for (const headers of deniedHeaders) {
            assert.equal((await fetch(url + "/api/status", { headers })).status, 403);
          }
        }
        for (const host of ["evil.test:8787", "localhost.evil.test:8787", "localhost:8788", "127.0.0.2:8787"]) {
          const url = `http://${host}`;
          assert.equal((await inProcessFetch(app.handler, url)(url)).status, 403);
        }
      } finally {
        await app.close();
      }
    }
    const app = await startInterface({
      ledger, bind: "127.0.0.1:8787", publicUrl: "http://localhost:9898", listen: false,
    });
    try {
      assert.equal((await inProcessFetch(app.handler, app.url)(app.url + "/api/status")).status, 401);
      for (const url of ["http://127.0.0.1:8787", "http://localhost:8787", "http://127.0.0.1:9898"]) {
        assert.equal((await inProcessFetch(app.handler, url)(url)).status, 403);
      }
    } finally {
      await app.close();
    }
  } finally {
    ledger.close();
  }
});
test("interface estimates workflows for free and launches new wallet analysis with shared CU", async () => {
  const ledger = new Ledger(":memory:"); let calls = 0;
  const app = await startInterface({ledger, bind: "127.0.0.1:8787", listen: false, config: {birdeyeApiKey: "fixture", ai: {defaultProfile: "research", profiles: {}}}, runnerFactory: () => new Runner(ledger, "fixture", {fetch: async u => {
    calls++; const path = new URL(String(u)).pathname;
    return Response.json({success: true, data: path.endsWith("summary") ? {summary: {pnl: {total_usd: 12}}} : {items: [{address, value: 10}]}});
  }})});
  const fetch = inProcessFetch(app.handler, app.url);
  try {
    const login = await fetch(app.url+"/api/connect", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({code: app.connectCode})});
    const headers = {"Content-Type": "application/json", Cookie: login.headers.get("set-cookie")!.split(";")[0]};
    const estimate = await (await fetch(app.url+"/api/estimate", {method: "POST", headers, body: JSON.stringify({kind: "wallet-analysis", address})})).json();
    assert.equal(estimate.estimatedCu, 50); assert.equal(calls, 0); assert.equal(ledger.summary().attempts, 0);
    const bad = await fetch(app.url+"/api/estimate", {method: "POST", headers, body: JSON.stringify({kind: "wallet-analysis"})});
    assert.equal(bad.status, 400);
    const created = await (await fetch(app.url+"/api/runs", {method: "POST", headers, body: JSON.stringify({mode: "case", case: {kind: "wallet-analysis", address}, maxCu: 50})})).json();
    await fetch(`${app.url}/api/runs/${created.id}/events`, {headers});
    const done = await (await fetch(`${app.url}/api/runs/${created.id}`, {headers})).json();
    assert.equal(done.status, "completed"); assert.equal(calls, 3); assert.equal(done.cu.estimated, 50);
  } finally {await app.close(); ledger.close();}
});
test("bind parser and remote TLS enforcement", async () => {
  assert.deepEqual(parseBind("[::1]:8787"), { host: "::1", port: 8787 });
  assert.throws(() => parseBind("0.0.0.0"));
  assert.throws(() => parseBind("localhost:99999"));
  const ledger = new Ledger(":memory:");
  await assert.rejects(startInterface({ ledger, bind: "0.0.0.0:0" }), {
    code: "TLS_REQUIRED",
  });
  ledger.close();
});

test("interface previews and executes edited steps while rejecting invalid edits before CU", async () => {
  const ledger = new Ledger(":memory:");
  const requests: URL[] = [];
  const app = await startInterface({
    ledger, bind: "127.0.0.1:8787", listen: false,
    config: {birdeyeApiKey: "fixture", ai: {defaultProfile: "research", profiles: {}}},
    runnerFactory: () => new Runner(ledger, "fixture", {fetch: async u => {
      const url = new URL(String(u)); requests.push(url);
      return Response.json({success: true, data: url.pathname.endsWith("token_overview") ? {address, price: 1} : {items: [{owner: address}]}});
    }}),
  });
  const fetch = inProcessFetch(app.handler, app.url);
  try {
    assert.equal((await fetch(app.url + "/api/plan", {method: "POST", headers: {"Content-Type": "application/json"}, body: "{}"})).status, 401);
    const login = await fetch(app.url + "/api/connect", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({code: app.connectCode})});
    const headers = {"Content-Type": "application/json", Cookie: login.headers.get("set-cookie")!.split(";")[0]};
    const post = (path: string, value: unknown) => fetch(app.url + path, {method: "POST", headers, body: JSON.stringify(value)});
    const template = await (await post("/api/plan", {kind: "token-research"})).json();
    assert.equal(template.needsAddress, true);
    assert.equal(template.input.address, undefined);
    assert.equal((await post("/api/runs", {mode: "case", case: template.input})).status, 400);
    const edited = {kind: "token-research", address, stepOverrides: {holders: {limit: 3, mode: "token_account"}}};
    const plan = await (await post("/api/plan", edited)).json();
    const estimate = await (await post("/api/estimate", plan.input)).json();
    assert.equal(plan.needsAddress, false);
    assert.equal(plan.estimatedCu, estimate.estimatedCu);
    assert.equal(plan.steps.find((s: any) => s.id === "holders").params.limit, 3);
    for (const path of ["/api/plan", "/api/estimate", "/api/runs"]) {
      const bad = {...edited, stepOverrides: {holders: {limit: 1000}}};
      const response = await post(path, path === "/api/runs" ? {mode: "case", case: bad} : bad);
      assert.equal(response.status, 400);
      assert.match((await response.json()).error.message, /Step holders/);
    }
    assert.equal(ledger.summary().attempts, 0);
    assert.equal(requests.length, 0);
    const created = await (await post("/api/runs", {mode: "case", case: plan.input, maxCu: 70})).json();
    await fetch(`${app.url}/api/runs/${created.id}/events`, {headers});
    const result = await (await fetch(`${app.url}/api/runs/${created.id}`, {headers})).json();
    assert.equal(result.status, "completed");
    const holderRequest = requests.find(url => url.pathname.endsWith("holder"))!;
    assert.equal(holderRequest.searchParams.get("limit"), "3");
    assert.equal(holderRequest.searchParams.get("mode"), "token_account");
    assert.equal(result.cu.estimated, plan.estimatedCu);
    assert.equal(result.result.data.plan.input.stepOverrides.holders.limit, 3);
  } finally {await app.close(); ledger.close();}
});

test("cancelled interface run retains paid evidence and exposes active run ID", async () => {
  const ledger = new Ledger(":memory:");
  let started!: () => void;
  const securityStarted = new Promise<void>((resolve) => {
    started = resolve;
  });
  const app = await startInterface({
    ledger,
    bind: "127.0.0.1:8787",
    listen: false,
    config: {
      birdeyeApiKey: "key",
      ai: { defaultProfile: "research", profiles: {} },
    },
    runnerFactory: () =>
      new Runner(ledger, "key", {
        fetch: async (url, init) => {
          if (new URL(String(url)).pathname.endsWith("token_overview"))
            return Response.json({
              success: true,
              data: { address, price: 1 },
            });
          started();
          return new Promise((_resolve, reject) =>
            init?.signal?.addEventListener("abort", () =>
              reject(new DOMException("Aborted", "AbortError")),
            ),
          );
        },
      }),
  });
  const fetch = inProcessFetch(app.handler, app.url);
  try {
    const login = await fetch(app.url + "/api/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: app.connectCode }),
    });
    const headers = {
      "Content-Type": "application/json",
      Cookie: login.headers.get("set-cookie")!.split(";")[0],
    };
    const created = await (
      await fetch(app.url + "/api/runs", {
        method: "POST",
        headers,
        body: JSON.stringify({
          mode: "case",
          case: { kind: "token-research", address },
        }),
      })
    ).json();
    await securityStarted;
    const active = await (
      await fetch(app.url + "/api/status", { headers })
    ).json();
    assert.equal(active.activeRunId, created.id);
    await fetch(`${app.url}/api/runs/${created.id}/stop`, {
      method: "POST",
      headers,
      body: "{}",
    });
    await fetch(`${app.url}/api/runs/${created.id}/events`, { headers });
    const done = await (
      await fetch(`${app.url}/api/runs/${created.id}`, { headers })
    ).json();
    assert.equal(done.status, "cancelled");
    assert.equal(done.result.data.sources.length, 1);
    assert.equal(done.result.meta.coverage, "partial");
    assert.equal(done.cu.estimated, 15);
    assert.equal(done.cu.budgetUsed, 40);
  } finally {
    await app.close();
    ledger.close();
  }
});

test("settings edit the selected AI profile and preserve its existing key", async () => {
  const ledger = new Ledger(":memory:");
  const app = await startInterface({
    ledger,
    bind: "127.0.0.1:8787",
    listen: false,
    aiProfile: "custom",
    config: {
      ai: {
        defaultProfile: "research",
        profiles: {
          custom: {
            provider: "openai-compatible",
            baseUrl: "https://example.test/v1",
            model: "old",
            apiKeyEnv: "BIRDEYE_TEST_KEY",
            apiKey: "private-secret",
          },
        },
      },
    },
  });
  const fetch = inProcessFetch(app.handler, app.url);
  try {
    const login = await fetch(app.url + "/api/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: app.connectCode }),
    });
    const headers = {
      "Content-Type": "application/json",
      Cookie: login.headers.get("set-cookie")!.split(";")[0],
    };
    const initial = await (
      await fetch(app.url + "/api/status", { headers })
    ).json();
    assert.equal(initial.activeAiProfile, "custom");
    assert.equal(initial.config.ai.profiles.custom.apiFormat, "chat-completions");
    const saved = await (
      await fetch(app.url + "/api/settings", {
        method: "POST",
        headers,
        body: JSON.stringify({
          profileName: "custom",
          profile: {
            provider: "openai-compatible",
            baseUrl: "https://example.test/v1",
            model: "new",
            apiFormat: "responses",
            apiKeyEnv: "BIRDEYE_TEST_KEY",
          },
        }),
      })
    ).json();
    assert.equal(saved.ai.profiles.custom.model, "new");
    assert.equal(saved.ai.profiles.custom.apiFormat, "responses");
    assert.equal(saved.ai.profiles.custom.configured, true);
    assert.equal(JSON.stringify(saved).includes("private-secret"), false);
  } finally {
    await app.close();
    ledger.close();
  }
});
test("authenticated interface, origin checks, initial-run idempotency and cost accounting", async () => {
  const ledger = new Ledger(":memory:");
  let calls = 0;
  const app = await startInterface({
    ledger,
    bind: "127.0.0.1:8787",
    listen: false,
    config: {
      birdeyeApiKey: "private-key",
      ai: { defaultProfile: "research", profiles: {} },
    },
    initial: { operation: "token.price", params: { address } },
    runnerFactory: () =>
      new Runner(ledger, "private-key", {
        fetch: async () => {
          calls++;
          return Response.json({ success: true, data: { value: 1.25 } });
        },
      }),
  });
  const fetch = inProcessFetch(app.handler, app.url);
  try {
    assert.equal((await fetch(app.url + "/api/status")).status, 401);
    assert.equal(
      (
        await fetch(app.url + "/api/connect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: "https://evil.test",
          },
          body: JSON.stringify({ code: app.connectCode }),
        })
      ).status,
      403,
    );
    const login = await fetch(app.url + "/api/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: app.url },
      body: JSON.stringify({ code: app.connectCode }),
    });
    assert.equal(login.status, 200);
    const cookie = login.headers.get("set-cookie")!.split(";")[0];
    const headers = {
      Cookie: cookie,
      "Content-Type": "application/json",
      Origin: app.url,
    };
    const status = await (
      await fetch(app.url + "/api/status", { headers })
    ).text();
    assert.ok(!status.includes("private-key"));
    const initial = await (
      await fetch(app.url + "/api/initial", {
        method: "POST",
        headers,
        body: "{}",
      })
    ).json();
    const second = await (
      await fetch(app.url + "/api/initial", {
        method: "POST",
        headers,
        body: "{}",
      })
    ).json();
    assert.equal(initial.id, second.id);
    const events = await (
      await fetch(`${app.url}/api/runs/${initial.id}/events`, { headers })
    ).text();
    assert.ok(events.includes('"done"'));
    const result = await (
      await fetch(`${app.url}/api/runs/${initial.id}`, { headers })
    ).json();
    assert.equal(result.status, "completed");
    assert.equal(result.cu.estimated, 3);
    assert.equal(calls, 1);
    await fetch(`${app.url}/api/runs/${initial.id}/events`, { headers });
    assert.equal(calls, 1);
    assert.equal(
      (
        await fetch(app.url + "/api/settings", {
          method: "POST",
          headers: { ...headers, Origin: "https://evil.test" },
          body: "{}",
        })
      ).status,
      403,
    );
    const reused = await fetch(app.url + "/api/connect", {
      method: "POST",
      headers,
      body: JSON.stringify({ code: app.connectCode }),
    });
    assert.equal(reused.status, 401);
  } finally {
    await app.close();
    ledger.close();
  }
});
