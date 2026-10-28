import test from "node:test";
import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {mkdtempSync, rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {caseCliArgs, demoCliArgs, importedCliArgs, shellCommand} from "../src/cli-preview.js";
import {planCase, workflowCatalog} from "../src/workflows.js";
import {demoCatalog, planDemo} from "../src/demos.js";
import {Ledger} from "../src/ledger.js";
import {WorkflowImports} from "../src/workflow-import.js";
import {sourceDocument} from "../src/workflow-sources.js";

const address = "So11111111111111111111111111111111111111112";
test("unlimited CLI previews omit max-cu while explicit zero and large limits survive", () => {
  for (const budget of [null, 0, 100001]) {
    const commands = [caseCliArgs({kind:"market-shortlist"}, budget), demoCliArgs({id:"terminal"}, budget), importedCliArgs("fixture", {}, budget)];
    for (const args of commands) {
      const index = args.indexOf("--max-cu");
      if (budget === null) assert.equal(index, -1);
      else assert.equal(args[index + 1], String(budget));
    }
  }
});
const cli = fileURLToPath(new URL("../src/index.js", import.meta.url));
const window = {from: 1770000000, to: 1770086400};
const estimate = (args: string[]) => JSON.parse(execFileSync(process.execPath,
  [cli, ...args, "--estimate-cu", "--short"],
  {encoding: "utf8", env: {...process.env, BIRDEYE_API_KEY: ""}, stdio: ["ignore", "pipe", "pipe"]}));

test("every skill/workflow CLI preview reproduces the planned input and requests without a key", () => {
  for (const recipe of workflowCatalog()) {
    const input = {kind: recipe.kind, ...window,
      ...(["token", "wallet"].includes(recipe.subject) ? {address} : {}),
      ...(recipe.subject === "wallets" ? {wallets: [address]} : {})};
    const plan = planCase(input);
    const actual = estimate(caseCliArgs(plan.input, 432));
    if (recipe.kind === "skill-price-surge") assert.deepEqual(actual.params, plan.input.priceSurge, recipe.kind);
    else assert.deepEqual(actual.input, plan.input, recipe.kind);
    assert.deepEqual(actual.steps, JSON.parse(JSON.stringify(plan.steps)), recipe.kind);
    assert.equal(actual.estimatedCu, plan.estimatedCu, recipe.kind);
  }
});

test("custom API parameters, booleans, arrays and zero thresholds survive CLI execution", () => {
  for (const input of [
    {kind: "token-research", address, minLiquidity: 0, maxTop10Pct: 0, excludeFreezeable: true, stepOverrides: {holders: {limit: 3, mode: "token_account"}}},
    {kind: "skill-wallet-analysis", address, intervals: ["7d", "30d"], skipPortfolio: true, skipFirstFunded: true, skipTransactions: true},
    {kind: "skill-token-dd", address, include: ["list", "advanced_security", "risk_history"]},
    {kind: "skill-trending-list", platform: "a'b $(printf injected) `printf injected`", scanLimit: 7},
  ]) {
    const plan = planCase({...input, ...window});
    const actual = estimate(caseCliArgs(plan.input, 0));
    assert.deepEqual(actual.input, plan.input);
    assert.deepEqual(actual.steps, plan.steps);
  }
});

test("all demo commands preserve the observation window and security thresholds", () => {
  for (const demo of demoCatalog) {
    for (const selected of demo.id === "wallet-intelligence" ? [undefined, address] : [demo.subject === "token" ? address : undefined]) {
      const plan = planDemo({id: demo.id, address: selected, limit: 2, minLiquidity: 0, maxTop10Pct: 0, ...window});
      const actual = estimate(demoCliArgs(plan.demoInput, 250));
      assert.deepEqual(actual.input, plan.input);
      assert.deepEqual(actual.steps.map((s: {params: unknown}) => s.params), plan.steps.map(s => s.params));
      if (demo.id === "security-signals") assert.deepEqual(actual.demoInput, plan.demoInput);
    }
  }
});

test("command quoting survives bash/zsh syntax without evaluating user input or exposing incidental secrets", () => {
  const args = caseCliArgs({kind: "skill-trending-list", platform: "' $(printf injected) `printf injected`\nnext; & | < > ", apiKey: "secret", stepOverrides: {list: {label: "O'Reilly"}}}, 0);
  const command = shellCommand(args);
  const decoded = execFileSync("/bin/sh", ["-c", `set -- ${command}; printf '%s\\0' "$@"`], {encoding: "utf8"}).split("\0").slice(0, -1);
  assert.deepEqual(decoded, ["birdeye-cli", ...args]);
  assert.ok(!command.includes("secret"));
  assert.match(command, /--max-cu 0/);
});

test("invalid step override JSON fails before credentials or data requests", () => {
  assert.throws(() => estimate(["case", "token-research", "--address", address, "--step-overrides", "[]"]));
  assert.throws(() => estimate(["case", "token-research", "--address", address, "--step-overrides", "{broken"]));
});

test("imported CLI preview uses the saved workflow and exact runtime overrides", () => {
  const dir = mkdtempSync(join(tmpdir(), "birdeye-cli-preview-"));
  const ledger = new Ledger(join(dir, "usage.sqlite"));
  try {
    const store = new WorkflowImports(ledger);
    const [record] = store.import([sourceDocument("holders.workflow.json", "fixture:cli", JSON.stringify({version: 1, title: "Holders", purpose: "Inspect holders", steps: [{id: "holders", operation: "token.holders", params: {address: "{{address}}", limit: 10}}]}))]);
    const runtime = {address, ...window, stepOverrides: {holders: {limit: 3}}};
    const expected = store.preview(record.id, runtime).plan!;
    const actual = estimate([...importedCliArgs(record.id, runtime, 90), "--config-dir", dir]);
    assert.deepEqual(actual.plan.input, expected.input);
    assert.deepEqual(actual.plan.steps, JSON.parse(JSON.stringify(expected.steps)));
    assert.equal(ledger.summary().attempts, 0);
  } finally {ledger.close();rmSync(dir, {recursive: true, force: true});}
});
