import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { request as httpRequest } from "node:http";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { startInterface } from "../dist/interface/server.js";
import { Ledger } from "../dist/ledger.js";
import { build } from "esbuild";
import { pathToFileURL } from "node:url";

test("malformed preview URLs return 400 and leave the process serving requests", async () => {
  const child = spawn(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `import {startBrowserInterface} from './dist/interface/browser-server.js'; const app=await startBrowserInterface('127.0.0.1:0'); console.log(app.listenUrl);`,
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  const stopped = once(child, "exit");
  try {
    const [output] = await once(child.stdout, "data");
    const origin = output.toString().trim();
    const url = new URL(origin);
    const status = await new Promise((resolve, reject) => {
      const req = httpRequest(
        { hostname: url.hostname, port: url.port, path: "//[", method: "GET" },
        (res) => {
          res.resume();
          resolve(res.statusCode);
        },
      );
      req.on("error", reject);
      req.end();
    });
    assert.equal(status, 400);
    assert.equal((await fetch(origin)).status, 200);
  } finally {
    if (child.exitCode === null) child.kill();
    await stopped;
  }
});

test("Settings cannot select arbitrary environment secrets or move them to another origin, including after restart", async () => {
  const dir = await mkdtemp(join(tmpdir(), "birdeye-profile-policy-"));
  const savedEnv = process.env.BIRDEYE_AUDIT_SENTINEL;
  process.env.BIRDEYE_AUDIT_SENTINEL = "dummy-security-test-value";
  const initial = {
    ai: {
      defaultProfile: "research",
      profiles: {
        research: {
          provider: "openai-compatible",
          baseUrl: "https://trusted.invalid/v1",
          model: "fixture",
          apiKeyEnv: "BIRDEYE_AUDIT_SENTINEL",
        },
      },
    },
  };
  const requests = [];
  async function instance(config) {
    const ledger = new Ledger(":memory:");
    const app = await startInterface({
      ledger,
      dir,
      bind: "127.0.0.1:0",
      requireCode: true,
      ...(config ? { config } : {}),
      aiFetch: async (url, init) => {
        requests.push({
          url: String(url),
          auth: new Headers(init.headers).get("authorization"),
        });
        return Response.json({
          choices: [{ message: { role: "assistant", content: "fixture" } }],
          usage: { prompt_tokens: 1, completion_tokens: 1 },
        });
      },
    });
    const login = await fetch(app.url + "/api/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: app.connectCode }),
    });
    const headers = {
      "Content-Type": "application/json",
      Cookie: login.headers.get("set-cookie").split(";")[0],
    };
    const post = (path, body) =>
      fetch(app.url + path, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
    const chat = async () => {
      const r = await post("/api/runs", {
        mode: "chat",
        question: "hello",
        dataPolicy: "saved-only",
      });
      const { id } = await r.json();
      assert.ok(id);
      await fetch(app.url + `/api/runs/${id}/events`, { headers }).then((r) =>
        r.text(),
      );
    };
    return {
      post,
      chat,
      close: async () => {
        await app.close();
        ledger.close();
      },
    };
  }
  let app;
  try {
    app = await instance(initial);
    await app.chat();
    assert.equal(requests.at(-1).auth, "Bearer dummy-security-test-value");
    const profile = {
      ...initial.ai.profiles.research,
      baseUrl: "https://collector.invalid/v1",
    };
    assert.equal(
      (await app.post("/api/settings", { profile, persist: true })).status,
      200,
    );
    requests.length = 0;
    await app.chat();
    assert.equal(
      requests.length,
      0,
      "Environment key must not follow a provider change",
    );
    assert.equal(
      (
        await app.post("/api/settings", {
          profileName: "new",
          profile,
          persist: true,
        })
      ).status,
      200,
    );
    await app.chat();
    assert.equal(
      requests.length,
      0,
      "New profiles cannot read server environment",
    );
    await app.close();
    app = await instance();
    await app.chat();
    assert.equal(
      requests.length,
      0,
      "Persisted profiles cannot re-enable environment access on restart",
    );
    assert.equal(
      (
        await app.post("/api/settings", {
          profileName: "new",
          profile: { ...profile, apiKey: "caller-provided-key" },
          persist: false,
        })
      ).status,
      200,
    );
    await app.chat();
    assert.equal(requests.at(-1).auth, "Bearer caller-provided-key");
  } finally {
    await app?.close();
    if (savedEnv === undefined) delete process.env.BIRDEYE_AUDIT_SENTINEL;
    else process.env.BIRDEYE_AUDIT_SENTINEL = savedEnv;
    await rm(dir, { recursive: true, force: true });
  }
});

test("Settings cannot aim AI requests at loopback or private networks unless the owner configured that origin", async () => {
  const dir = await mkdtemp(join(tmpdir(), "birdeye-provider-ssrf-")),
    ledger = new Ledger(":memory:");
  const local = {
    provider: "openai-compatible",
    baseUrl: "http://127.0.0.1:11434/v1",
    model: "owner",
    apiKeyEnv: "",
  };
  const app = await startInterface({
    ledger,
    dir,
    bind: "127.0.0.1:0",
    requireCode: true,
    config: { ai: { defaultProfile: "local", profiles: { local } } },
  });
  try {
    const login = await fetch(app.url + "/api/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: app.connectCode }),
    });
    const headers = {
      "Content-Type": "application/json",
      Cookie: login.headers.get("set-cookie").split(";")[0],
    };
    const save = async (baseUrl, profileName = "research") => {
      const r = await fetch(app.url + "/api/settings", {
        method: "POST",
        headers,
        body: JSON.stringify({
          persist: false,
          profileName,
          profile: { ...local, baseUrl, model: "m", apiKey: "k" },
        }),
      });
      return r.ok ? "saved" : (await r.json()).error.code;
    };
    for (const target of [
      "http://127.0.0.1:8080/v1",
      "http://localhost:3000/v1",
      "https://localhost/v1",
      "https://10.0.0.5/v1",
      "https://192.168.1.1/v1",
      "https://169.254.169.254/latest",
      "https://[::1]/v1",
      "https://[fd00::1]/v1",
      "https://[::ffff:127.0.0.1]/v1",
      "https://2130706433/v1",
    ])
      assert.equal(await save(target), "INVALID_PROVIDER_URL", target);
    assert.equal(
      await save("http://127.0.0.1:11434/v1", "local"),
      "saved",
      "The owner-configured local origin stays editable",
    );
    assert.equal(
      await save("https://provider.test/v1"),
      "saved",
      "Public providers are allowed",
    );
  } finally {
    await app.close();
    ledger.close();
    await rm(dir, { recursive: true, force: true });
  }
});

test("public stat requests deduplicate clients, ignore forged proxy headers and rate limit writes", async () => {
  const dir = await mkdtemp(join(tmpdir(), "birdeye-stat-policy-"));
  const previous = process.env.SKILL_STATS_DB_PATH;
  const previousCatalog = process.env.SKILL_CATALOG_PATH;
  process.env.SKILL_CATALOG_PATH = resolve("apps/skills-api/catalog.json");
  process.env.SKILL_STATS_DB_PATH = join(dir, "stats.sqlite");
  let server;
  try {
    const module = join(dir, "server.mjs");
    await build({
      entryPoints: ["apps/skills-api/src/server.ts"],
      outfile: module,
      bundle: true,
      platform: "node",
      format: "esm",
      logLevel: "silent",
    });
    const { createSkillServer } = await import(pathToFileURL(module).href);
    server = createSkillServer();
    await new Promise((r) => server.listen(0, "127.0.0.1", r));
    const origin = `http://127.0.0.1:${server.address().port}`;
    const body = JSON.stringify({
      skill_id: "skill-wallet-analysis",
      action: "download",
    });
    const counts = async () => {
      const r = await fetch(origin + "/agent/api/skills");
      return (await r.json()).data.list.find(
        (s) => s.id === "skill-wallet-analysis",
      ).download_count;
    };
    const before = await counts();
    let limited = false;
    for (let i = 0; i < 65; i++) {
      const r = await fetch(origin + "/agent/api/skills/stat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": `192.0.2.${i + 1}`,
        },
        body,
      });
      if (r.status === 429) {
        limited = true;
        assert.ok(Number(r.headers.get("retry-after")) > 0);
      } else assert.equal(r.status, 200);
      await r.arrayBuffer();
    }
    assert.equal(
      (await counts()) - before,
      1,
      "One client must not inflate counts by replaying requests or spoofing proxy headers",
    );
    assert.equal(limited, true, "Unbounded POST requests must be throttled");
  } finally {
    if (server)
      await new Promise((r) => {
        server.close(r);
        server.closeAllConnections();
      });
    if (previousCatalog === undefined) delete process.env.SKILL_CATALOG_PATH;
    else process.env.SKILL_CATALOG_PATH = previousCatalog;
    if (previous === undefined) delete process.env.SKILL_STATS_DB_PATH;
    else process.env.SKILL_STATS_DB_PATH = previous;
    await rm(dir, { recursive: true, force: true });
  }
});

test("stat deduplication survives reopening, separates actions and expires after 24 hours", async () => {
  const dir = await mkdtemp(join(tmpdir(), "birdeye-dedup-"));
  try {
    const module = join(dir, "store.mjs");
    await build({
      entryPoints: ["apps/skills-api/src/store.ts"],
      outfile: module,
      bundle: true,
      platform: "node",
      format: "esm",
      logLevel: "silent",
    });
    const { openSkillStats } = await import(pathToFileURL(module).href);
    const path = join(dir, "stats.sqlite");
    const now = 1_800_000_000_000;
    let store = openSkillStats(path);
    try {
      assert.equal(
        store.increment("skill-wallet-analysis", "view", "192.0.2.1", now)
          .view_count,
        1,
      );
    } finally {
      store.close();
    }
    store = openSkillStats(path);
    try {
      assert.equal(
        store.increment("skill-wallet-analysis", "view", "192.0.2.1", now + 1)
          .view_count,
        1,
      );
      assert.equal(
        store.increment(
          "skill-wallet-analysis",
          "download",
          "192.0.2.1",
          now + 1,
        ).download_count,
        1,
      );
      assert.equal(
        store.increment("skill-wallet-analysis", "view", "192.0.2.2", now + 1)
          .view_count,
        2,
      );
      assert.equal(
        store.increment(
          "skill-wallet-analysis",
          "view",
          "192.0.2.1",
          now + 86_400_000,
        ).view_count,
        3,
      );
    } finally {
      store.close();
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("proxy trust walks from the peer and rate-limiter state is bounded and expires", async () => {
  const dir = await mkdtemp(join(tmpdir(), "birdeye-client-policy-"));
  try {
    const module = join(dir, "policy.mjs");
    await build({
      entryPoints: ["apps/skills-api/src/client-policy.ts"],
      outfile: module,
      bundle: true,
      platform: "node",
      format: "esm",
      logLevel: "silent",
    });
    const { clientIdentity, proxyAddresses, WriteLimiter } = await import(
      pathToFileURL(module).href
    );
    const req = {
      socket: { remoteAddress: "::ffff:127.0.0.1" },
      headers: { "x-forwarded-for": "192.0.2.99, 192.0.2.1" },
    };
    assert.equal(clientIdentity(req, new Set()), "127.0.0.1");
    assert.equal(
      clientIdentity(req, proxyAddresses(["127.0.0.1"])),
      "192.0.2.1",
    );
    assert.throws(() => proxyAddresses(["*"]));
    const limiter = new WriteLimiter(2, 1000, 2);
    assert.equal(limiter.take("one", 0), 0);
    assert.equal(limiter.take("one", 0), 0);
    assert.equal(limiter.take("one", 0), 1);
    assert.equal(limiter.take("two", 0), 0);
    assert.equal(limiter.take("three", 0), 1);
    assert.equal(limiter.take("three", 1000), 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("documentation sanitization replaces credential literals and rejects private keys", async () => {
  const { credentialFindings, redactCredentialExamples } =
    await import("../scripts/lib/credential-scan.mjs");
  const value = "ab".repeat(16),
    example = `X-API-KEY: ${value}\napiKey = "${value}"`;
  assert.equal(credentialFindings(example).length, 2);
  assert.equal(redactCredentialExamples(example).includes(value), false);
  assert.equal(credentialFindings(redactCredentialExamples(example)).length, 0);
  assert.throws(
    () =>
      redactCredentialExamples(["-----BEGIN", "PRIVATE KEY-----"].join(" ")),
    /import rejected/,
  );
  assert.equal(
    credentialFindings(
      'token_address: "So11111111111111111111111111111111111111112"',
    ).length,
    0,
  );
});
