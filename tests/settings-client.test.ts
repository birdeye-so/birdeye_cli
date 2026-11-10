import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApiClient } from "../web/api.js";
import { Ledger } from "../src/ledger.js";
import { readConfig } from "../src/config.js";
import { startInterface } from "../src/interface/server.js";
import { inProcessFetch } from "./http-helper.js";

test("the login link signs the client in; after a restart only the new link's code reconnects an open settings form", async () => {
  const dir = mkdtempSync(join(tmpdir(), "birdeye-settings-client-")),
    ledger = new Ledger(":memory:");
  let app = await startInterface({ dir, ledger, listen: false }),
    cookie = "",
    writes = 0;
  const cleaned: string[] = [];
  const location = {
    hash: new URL(app.loginUrl).hash,
    pathname: "/",
    search: "",
  };
  Object.assign(globalThis, {
    location,
    history: {
      replaceState: (_: unknown, __: string, url: string) => cleaned.push(url),
    },
  });
  const api = createApiClient(async (input, init = {}) => {
    const headers = new Headers(init.headers);
    headers.set("Cookie", cookie);
    if (init.method === "POST") {
      headers.set("Origin", app.url);
      headers.set("Sec-Fetch-Site", "same-origin");
    }
    const response = await inProcessFetch(app.handler, app.url)(
      app.url + input,
      { ...init, headers },
    );
    if (response.headers.has("set-cookie"))
      cookie = response.headers.get("set-cookie")!.split(";")[0];
    if (input === "/api/settings" && response.ok) writes++;
    return response;
  });
  try {
    await api("/status");
    assert.deepEqual(
      cleaned,
      ["/"],
      "The code leaves the address bar once signed in",
    );
    await app.close();
    app = await startInterface({ dir, ledger, listen: false });
    await assert.rejects(api("/settings", { birdeyeApiKey: "stale-code" }), {
      status: 401,
      code: "CONNECT_REQUIRED",
    });
    assert.equal(writes, 0, "The previous server's code cannot sign in");
    location.hash = new URL(app.loginUrl).hash;
    await api("/settings", {
      persist: true,
      birdeyeApiKey: "fixture-key",
      profile: {
        provider: "openai-compatible",
        baseUrl: "https://provider.test/v1",
        model: "fixture",
        apiFormat: "responses",
        apiKey: "fixture-ai-key",
      },
    });
    assert.equal(writes, 1);
    assert.equal(readConfig(dir).birdeyeApiKey, "fixture-key");
    assert.equal(readConfig(dir).ai.profiles.research.apiKey, "fixture-ai-key");
    await app.close();
    app = await startInterface({ dir, ledger, listen: false });
    location.hash = new URL(app.loginUrl).hash;
    const status = await api("/status");
    assert.equal(status.config.ai.profiles.research.model, "fixture");
    assert.equal(status.config.birdeyeConfigured, true);
  } finally {
    Reflect.deleteProperty(globalThis, "location");
    Reflect.deleteProperty(globalThis, "history");
    await app.close();
    ledger.close();
    rmSync(dir, { recursive: true, force: true });
  }
});

test("expired sessions cannot bypass a server that requires a connection code", async () => {
  const dir = mkdtempSync(join(tmpdir(), "birdeye-settings-code-")),
    ledger = new Ledger(":memory:");
  const app = await startInterface({
    dir,
    ledger,
    listen: false,
    requireCode: true,
  });
  let attempts = 0;
  const api = createApiClient(async (input, init = {}) => {
    attempts++;
    return inProcessFetch(app.handler, app.url)(app.url + input, {
      ...init,
      headers: {
        ...init.headers,
        Origin: app.url,
        "Sec-Fetch-Site": "same-origin",
        Cookie: "birdeye_session=expired",
      },
    });
  });
  try {
    await assert.rejects(api("/settings", { birdeyeApiKey: "must-not-save" }), {
      status: 401,
      code: "CONNECT_REQUIRED",
    });
    assert.equal(
      attempts,
      2,
      "One rejected save and one local reconnect attempt; no retry loop",
    );
    assert.equal(readConfig(dir).birdeyeApiKey, undefined);
  } finally {
    await app.close();
    ledger.close();
    rmSync(dir, { recursive: true, force: true });
  }
});

test("settings failures other than an expired connection are never retried", async () => {
  for (const status of [400, 401, 403, 500]) {
    let calls = 0;
    const api = createApiClient(async () => {
      calls++;
      return Response.json(
        { error: { code: "FIXTURE_ERROR", message: "Save failed" } },
        { status },
      );
    });
    await assert.rejects(api("/settings", { birdeyeApiKey: "fixture" }), {
      status,
      code: "FIXTURE_ERROR",
    });
    assert.equal(calls, 1);
  }
  let calls = 0;
  const api = createApiClient(async () => {
    calls++;
    throw new Error("Network interrupted");
  });
  await assert.rejects(api("/settings", {}), /Network interrupted/);
  assert.equal(calls, 1);
});
