import test from "node:test";
import assert from "node:assert/strict";
import {Ledger} from "../src/ledger.js";
import {Runner, type Result} from "../src/runner.js";
import {runCase} from "../src/analysis.js";
import {planCase} from "../src/workflows.js";
import {prepare} from "../src/catalog.js";
import {skillAnalysis} from "../src/skill-metrics.js";
import {tokenDataAnalysis} from "../src/token-data-metrics.js";

const wallet = "So11111111111111111111111111111111111111112";
const at = 1793681140;

for (const kind of ["skill-smart-money-profile", "smart-money-profile", "wallet-analysis"]) {
  test(`${kind} sends one trade cursor and a formatted net-worth time`, async () => {
    const plan = planCase({kind, address: wallet, from: at - 86400, to: at}, at);
    const ledger = new Ledger(":memory:");
    const seen: string[] = [];
    try {
      const runner = new Runner(ledger, "fixture", {fetch: async u => {
        const url = new URL(String(u)), p = url.searchParams;
        seen.push(url.pathname);
        if (url.pathname.endsWith("seek_by_time")) {
          if (Number(p.has("after_time")) + Number(p.has("before_time")) !== 1) {
            return Response.json({message: "one of either before_time or after_time"}, {status: 422});
          }
        }
        if (url.pathname === "/wallet/v2/net-worth" && p.get("time") !== "2026-11-03 04:45:40") {
          return Response.json({message: "time must be in format YYYY-MM-DD HH:mm:ss"}, {status: 400});
        }
        return Response.json({success: true, data: {items: [{address: wallet}], summary: {unique_tokens: 1}, tokens: [{address: wallet}], history: [{timestamp: at, net_worth: 100}]}});
      }});
      const out = await runCase(runner, ledger.createRun(plan.estimatedCu), plan.input);
      assert.ok(seen.includes("/trader/txs/seek_by_time"));
      if (kind === "skill-smart-money-profile") assert.ok(seen.includes("/wallet/v2/net-worth"));
      assert.deepEqual(out.data.missing.filter((m: any) => m.step !== "analysis"), []);
      assert.equal(out.data.sources.length, plan.steps.length);
    } finally {ledger.close();}
  });
}

test("trade schema accepts either cursor and rejects both or neither", () => {
  for (const cursor of [{after_time: at}, {before_time: at}]) {
    assert.doesNotThrow(() => prepare("portfolio.trades", {address: wallet, ...cursor}));
  }
  for (const cursor of [{}, {after_time: at - 86400, before_time: at}]) {
    assert.throws(() => prepare("portfolio.trades", {address: wallet, ...cursor}));
  }
});

test("trade cursor overrides switch direction and invalid combinations fail before billing", async () => {
  const ledger = new Ledger(":memory:");
  let calls = 0;
  try {
    const runner = new Runner(ledger, "fixture", {fetch: async () => {calls++; return Response.json({success: true, data: {items: []}});}});
    for (const kind of ["skill-smart-money-profile", "smart-money-profile", "wallet-analysis"]) {
      const input = {kind, address: wallet, from: at - 86400, to: at};
      assert.equal(planCase(input, at).steps.find(s => s.id === "trades")!.params.before_time, at);
      const step = planCase({...input, stepOverrides: {trades: {after_time: at - 3600}}}, at).steps.find(s => s.id === "trades")!;
      assert.equal(step.params.after_time, at - 3600);
      assert.equal(step.params.before_time, undefined);
      await assert.rejects(runCase(runner, ledger.createRun(1000), {...input, stepOverrides: {trades: {after_time: at - 3600, before_time: at}}}), {code: "INVALID_INPUT"});
    }
    assert.equal(calls, 0);
    assert.equal(ledger.summary().attempts, 0);
  } finally {ledger.close();}
});

test("net-worth schema accepts provider datetime format and rejects Unix times", () => {
  assert.doesNotThrow(() => prepare("portfolio.net-worth-history", {wallet, time: "2026-11-03 04:45:40"}));
  for (const time of [at, String(at), "2026-11-03T04:45:40Z", "2026-02-30 04:45:40", "2026-11-03 24:00:00"]) {
    assert.throws(() => prepare("portfolio.net-worth-history", {wallet, time}));
  }
});

for (const [label, data, mint, freeze] of [
  ["PUMP null authorities", {ownerAddress: null, freezeAuthority: null, freezeable: null}, false, false],
  ["missing authorities", {}, null, null],
  ["active Solana authorities without mintable", {ownerAddress: wallet, freezeAuthority: wallet}, true, true],
  ["explicit disabled flags", {mintable: false, freezeable: false}, false, false],
  ["null flags without authorities", {mintable: null, freezeable: null}, null, null],
  ["malformed flags", {mintable: "false", freezeable: 0}, null, null],
  ["explicit flags take precedence", {mintable: true, freezeable: true, ownerAddress: null, freezeAuthority: null}, true, true],
  ["malformed authorities", {ownerAddress: "not-an-address", freezeAuthority: ""}, null, null],
  ["freeze sentinel", {isMintable: true, freezeAuthority: "11111111111111111111111111111111"}, true, false],
] as const) {
  test(`security skills agree on ${label}`, () => {
    const sources: Result[] = [{schemaVersion: 1, data, meta: {operation: "token.security", chain: "solana", requestId: "security", retrievedAt: "2026-11-03T04:45:40Z"}}];
    const report = tokenDataAnalysis(planCase({kind: "skill-token-security", address: wallet}, at).input, sources)!.findings[0];
    for (const [check, expected] of [["Mint authority active", mint], ["Freeze authority active", freeze]]) {
      const row = report.tables[0].rows.find((r: any) => r.check === check)!;
      assert.equal(row.value, expected, String(check));
      assert.equal(row.status, expected === null ? "unknown" : "observed");
      assert.equal(row.sourceId, "security");
    }
    for (const kind of ["skill-token-dd", "skill-contract-dd", "skill-rugcheck-audit"]) {
      const finding: any = skillAnalysis(planCase({kind, address: wallet}, at).input, sources)!.findings.find((f: any) => f.kind === "security-evidence")!;
      assert.equal(finding.mintable, mint, `${kind}: mint`);
      assert.equal(finding.freezeable, freeze, `${kind}: freeze`);
      assert.deepEqual(finding.sourceIds, ["security"]);
    }
  });
}

test("Solana authority mapping is not applied to EVM or unknown chains", () => {
  for (const chain of ["base", undefined]) {
    const sources: Result[] = [{schemaVersion: 1, data: {ownerAddress: null, freezeAuthority: null}, meta: {operation: "token.security", chain}}];
    const report = tokenDataAnalysis(planCase({kind: "skill-token-security", address: wallet}, at).input, sources)!.findings[0];
    assert.ok(report.tables[0].rows.slice(0, 2).every((r: any) => r.value === null && r.status === "unknown"));
  }
});
