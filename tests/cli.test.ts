import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { saveConfig } from "../src/config.js";

const cli = fileURLToPath(new URL("../src/index.js", import.meta.url));
test("CLI AI init selects Responses for new profiles and preserves legacy format", () => {
  const dir = mkdtempSync(join(tmpdir(), "birdeye-ai-cli-"));
  const call = (args: string[]) => JSON.parse(execFileSync(process.execPath,
    [cli, "config", "ai", "init", "--base-url", "https://provider.test/v1", "--model", "fixture", ...args, "--config-dir", dir, "--short"],
    {encoding: "utf8", stdio: ["ignore", "pipe", "pipe"]}));
  try {
    assert.equal(call([]).profiles.research.apiFormat, "responses");
    assert.equal(call(["--api-format", "chat-completions"]).profiles.research.apiFormat, "chat-completions");
    assert.equal(call([]).profiles.research.apiFormat, "chat-completions");
    saveConfig({ai: {profiles: {research: {baseUrl: "https://provider.test/v1", model: "old"}}}}, dir);
    assert.equal(call([]).profiles.research.apiFormat, "chat-completions");
    assert.equal(call(["--api-format", "responses"]).profiles.research.apiFormat, "responses");
  } finally { rmSync(dir, {recursive: true}); }
});
test("CLI preflight needs no API key and produces one JSON line", () => {
  const result = execFileSync(
    process.execPath,
    [
      cli,
      "token",
      "overview",
      "So11111111111111111111111111111111111111112",
      "--estimate-cu",
      "--short",
    ],
    {
      encoding: "utf8",
      env: { ...process.env, BIRDEYE_API_KEY: "" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  assert.equal(result.trim().split("\n").length, 1);
  assert.equal(JSON.parse(result).estimatedCu, 18);
});
test("CLI workflow and config commands honor trailing config-dir", () => {
  const dir = mkdtempSync(join(tmpdir(), "birdeye-cli-"));
  const call = (args: string[]) =>
    JSON.parse(
      execFileSync(
        process.execPath,
        [cli, ...args, "--config-dir", dir, "--short"],
        { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
      ),
    );
  try {
    const w = call([
      "workflow",
      "create",
      "--label",
      "cli-test",
      "--max-cu",
      "20",
    ]);
    const read = call(["workflow", "show", w.id]);
    assert.equal(read.label, "cli-test");
    assert.equal(call(["config", "show"]).ai.defaultProfile, "research");
  } finally {
    rmSync(dir, { recursive: true });
  }
});
test("CLI invalid addresses fail before network or credentials lookup", () => {
  const out = spawnSync(
    process.execPath,
    [cli, "token", "price", "SOL", "--short"],
    { encoding: "utf8" },
  );
  assert.equal(out.status, 2);
  assert.equal(out.stdout, "");
  assert.ok(out.stderr.includes("INVALID_INPUT"));
});

test("new CLI command schemas parse booleans, CSV lists and POST preflight without a key", () => {
  const call = (args: string[]) => JSON.parse(execFileSync(process.execPath, [cli, ...args, "--estimate-cu", "--short"], {encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], env: {...process.env, BIRDEYE_API_KEY: ""}}));
  const address = "So11111111111111111111111111111111111111112";
  const holders = call(["token", "holder-positions", address, "--labels", "dev,kol", "--include-zero-balance", "false"]);
  assert.deepEqual(holders.params.labels, ["dev", "kol"]); assert.equal(holders.params.include_zero_balance, false);
  const flow = call(["token", "money-flow", address, "--frames", "1h,24h", "--wallet-tags", "smart_money"]);
  assert.equal(flow.estimatedCu, 10); assert.deepEqual(flow.params.frames, ["1h", "24h"]);
  const details = call(["portfolio", "pnl-details", address, "--duration", "7d", "--pnl-method", "wac"]);
  assert.equal(details.params.wallet, address); assert.equal(details.estimatedCu, 30);
  const plan = call(["case", "early-project-screening", "--stage", "near-graduation", "--min-progress", "80", "--limit", "2"]);
  assert.equal(plan.estimatedCu, 186); assert.equal(plan.steps[0].params.min_progress_percent, 80);
});

test("invalid workflow subjects and boolean flags fail preflight with exit 2", () => {
  for (const args of [["case", "wallet-analysis"], ["token", "holder-profile", "So11111111111111111111111111111111111111112", "--include-zero-balance", "maybe"]]) {
    const out = spawnSync(process.execPath, [cli, ...args, "--estimate-cu", "--short"], {encoding: "utf8"});
    assert.equal(out.status, 2); assert.equal(out.stdout, "");
  }
});
