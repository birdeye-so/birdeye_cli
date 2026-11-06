import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync, readFileSync, statSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { configPath, readConfig, saveConfig, safeConfig, aiKey, dataKey } from "../src/config.js";
import { Ledger } from "../src/ledger.js";
import { startInterface } from "../src/interface/server.js";
import { inProcessFetch } from "./http-helper.js";

const cli = fileURLToPath(new URL("../src/index.js", import.meta.url));
const fixture = () => ({birdeyeApiKey: "fixture-birdeye-secret", ai: {defaultProfile: "research", profiles: {
  research: {provider: "openai-compatible" as const, apiFormat: "responses" as const, baseUrl: "https://provider.test/v1", model: "fixture", apiKeyEnv: "BIRDEYE_FIXTURE_AI_KEY", apiKey: "fixture-ai-secret"},
}}});

test("SQLite saves private configuration, survives another process, and imports legacy JSON only once", () => {
  const dir = mkdtempSync(join(tmpdir(), "birdeye-config-store-"));
  try {
    assert.equal(readConfig(dir).ai.defaultProfile, "research");
    assert.equal(existsSync(configPath(dir)), false);
    const legacy = JSON.stringify(fixture());
    writeFileSync(join(dir, "config.json"), legacy, {mode: 0o600});
    assert.deepEqual(readConfig(dir), fixture());
    assert.equal(readFileSync(configPath(dir)).subarray(0, 15).toString(), "SQLite format 3");
    assert.equal(statSync(configPath(dir)).mode & 0o777, 0o600);
    assert.equal(readFileSync(join(dir, "config.json"), "utf8"), legacy);
    const next = fixture();
    next.ai.profiles.research.model = "updated";
    saveConfig(next, dir);
    assert.equal(readConfig(dir).ai.profiles.research.model, "updated");
    // SQLite remains authoritative even if the old JSON is edited or invalid.
    writeFileSync(join(dir, "config.json"), "invalid old backup");
    const child = JSON.parse(execFileSync(process.execPath, [cli, "config", "show", "--config-dir", dir, "--short"], {
      encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], env: {...process.env, BIRDEYE_API_KEY: "", BIRDEYE_FIXTURE_AI_KEY: ""},
    }));
    assert.equal(child.birdeyeConfigured, true);
    assert.equal(child.ai.profiles.research.model, "updated");
    assert.equal(child.ai.profiles.research.configured, true);
    assert.equal(child.ai.profiles.research.apiFormat, "responses");
    assert.ok(!JSON.stringify(child).includes("secret"));
    const bad = {...next, ai: {...next.ai, profiles: {research: {...next.ai.profiles.research, baseUrl: "http://remote.test/v1"}}}};
    assert.throws(() => saveConfig(bad, dir));
    assert.deepEqual(readConfig(dir), next);
  } finally { rmSync(dir, {recursive: true, force: true}); }
});

test("invalid legacy data, corrupt SQLite and future versions fail without exposing or replacing secrets", () => {
  const dir = mkdtempSync(join(tmpdir(), "birdeye-config-invalid-"));
  try {
    writeFileSync(join(dir, "config.json"), '{"secret":"private-secret"}');
    assert.throws(() => readConfig(dir), (e: any) => e.code === "CONFIG_INVALID" && !e.message.includes("private-secret"));
    rmSync(configPath(dir));
    writeFileSync(configPath(dir), "private-secret invalid database");
    assert.throws(() => readConfig(dir), (e: any) => e.code === "CONFIG_STORAGE_ERROR" && !e.message.includes("private-secret"));
    assert.equal(readFileSync(configPath(dir), "utf8"), "private-secret invalid database");
    rmSync(configPath(dir));
    saveConfig(fixture(), dir);
    const db = new DatabaseSync(configPath(dir));
    db.exec("UPDATE configuration SET version=999");
    db.close();
    assert.throws(() => readConfig(dir), (e: any) => e.code === "CONFIG_VERSION_UNSUPPORTED");
    assert.throws(() => saveConfig(fixture(), dir), (e: any) => e.code === "CONFIG_VERSION_UNSUPPORTED");
  } finally { rmSync(dir, {recursive: true, force: true}); }
});

test("CLI AI edits preserve saved keys, support hidden-key environment import, and drop keys on origin change", () => {
  const dir = mkdtempSync(join(tmpdir(), "birdeye-config-cli-"));
  const call = (extra: string[], origin = "https://provider.test/v1") => execFileSync(process.execPath,
    [cli, "config", "ai", "init", "--model", "new", "--base-url", origin, "--config-dir", dir, "--short", ...extra],
    {encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], env: {...process.env, BIRDEYE_FIXTURE_AI_KEY: "replacement-key"}});
  try {
    saveConfig(fixture(), dir);
    assert.ok(!call(["--api-format", "chat-completions"]).includes("secret"));
    assert.equal(readConfig(dir).ai.profiles.research.apiKey, "fixture-ai-secret");
    assert.equal(readConfig(dir).ai.profiles.research.apiKeyEnv, "BIRDEYE_FIXTURE_AI_KEY");
    assert.ok(!call(["--save-key"]).includes("replacement-key"));
    assert.equal(readConfig(dir).ai.profiles.research.apiKey, "replacement-key");
    call([], "https://other.test/v1");
    assert.equal(readConfig(dir).ai.profiles.research.apiKey, undefined);
    assert.equal(readConfig(dir).birdeyeApiKey, "fixture-birdeye-secret");
  } finally { rmSync(dir, {recursive: true, force: true}); }
});

test("environment credentials override SQLite without overwriting saved keys", () => {
  const previousData = process.env.BIRDEYE_API_KEY, previousAI = process.env.BIRDEYE_FIXTURE_AI_KEY;
  const config = fixture();
  try {
    process.env.BIRDEYE_API_KEY = "environment-data";
    process.env.BIRDEYE_FIXTURE_AI_KEY = "environment-ai";
    assert.equal(dataKey(config), "environment-data");
    assert.equal(aiKey(config.ai.profiles.research), "environment-ai");
    assert.equal(config.birdeyeApiKey, "fixture-birdeye-secret");
    assert.equal(config.ai.profiles.research.apiKey, "fixture-ai-secret");
    assert.ok(!JSON.stringify(safeConfig(config)).includes("environment-ai"));
  } finally {
    if (previousData === undefined) delete process.env.BIRDEYE_API_KEY; else process.env.BIRDEYE_API_KEY = previousData;
    if (previousAI === undefined) delete process.env.BIRDEYE_FIXTURE_AI_KEY; else process.env.BIRDEYE_FIXTURE_AI_KEY = previousAI;
  }
});

test("UI settings persist by default across restarts; session edits and failed writes preserve disk configuration", async () => {
  const dir = mkdtempSync(join(tmpdir(), "birdeye-config-restart-"));
  const ledger = new Ledger(":memory:");
  let app: Awaited<ReturnType<typeof startInterface>> | undefined;
  const connect = async (location = dir) => {
    app = await startInterface({ledger, dir: location, listen: false, bind: "127.0.0.1:8787"});
    const fetch = inProcessFetch(app.handler, app.url);
    const login = await fetch(app.url + "/api/connect", {method: "POST", headers: {"Content-Type": "application/json", Origin: app.url, "Sec-Fetch-Site": "same-origin"}, body: JSON.stringify({local: true})});
    assert.equal(login.status, 200, "Browser reconnects after restart without entering a code");
    const headers = {"Content-Type": "application/json", Cookie: login.headers.get("set-cookie")!.split(";")[0]};
    return (path: string, input?: unknown) => fetch(app!.url + path, {headers, ...(input === undefined ? {} : {method: "POST", body: JSON.stringify(input)})});
  };
  try {
    let request = await connect();
    const config = fixture();
    const saved = await request("/api/settings", {birdeyeApiKey: config.birdeyeApiKey, profile: config.ai.profiles.research});
    assert.equal(saved.status, 200);
    assert.ok(!(await saved.text()).includes("secret"));
    await app!.close();
    request = await connect();
    const reloaded = (await (await request("/api/status")).json()).config;
    assert.equal(reloaded.birdeyeConfigured, true);
    assert.equal(reloaded.ai.profiles.research.configured, true);
    assert.equal(reloaded.ai.profiles.research.apiFormat, "responses");
    assert.deepEqual(readConfig(dir), {...config, ai: {...config.ai, profiles: {research: {...config.ai.profiles.research, apiKeyEnv: ""}}}});
    const {apiKey: _, ...profile} = config.ai.profiles.research;
    await request("/api/settings", {profile: {...profile, model: "persisted-edit"}});
    assert.equal(readConfig(dir).ai.profiles.research.apiKey, "fixture-ai-secret");
    await request("/api/settings", {persist: false, birdeyeApiKey: "session-key", profile: {...profile, model: "session-only"}});
    assert.equal((await (await request("/api/status")).json()).config.ai.profiles.research.model, "session-only");
    await app!.close();
    request = await connect();
    assert.equal((await (await request("/api/status")).json()).config.ai.profiles.research.model, "persisted-edit");
    assert.equal(readConfig(dir).birdeyeApiKey, "fixture-birdeye-secret");
    await app!.close();
    const blocked = join(dir, "blocked");
    request = await connect(blocked);
    mkdirSync(join(blocked, "config.sqlite"), {recursive: true});
    assert.notEqual((await request("/api/settings", {birdeyeApiKey: "should-not-save"})).status, 200);
    assert.equal((await (await request("/api/status")).json()).config.birdeyeConfigured, Boolean(process.env.BIRDEYE_API_KEY));
  } finally {
    await app?.close();
    ledger.close();
    rmSync(dir, {recursive: true, force: true});
  }
});
