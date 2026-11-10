import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { build } from "esbuild";
const bundle = await build({
  entryPoints: ["apps/landing/components/birdeye-docs/demo-script.ts"],
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
});
const { buildDemoScripts } = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString("base64")}`
);
const snapshot = JSON.parse(
  await readFile("apps/landing/public/demo-snapshots.json", "utf8"),
);
const scripts = buildDemoScripts();
test("guided stories retain a real run and its matching budget", () => {
  assert.equal(scripts.length, 2);
  for (const [index, script] of scripts.entries()) {
    const report = snapshot.captures[index].reports[0];
    assert.deepEqual(script.reports, [report]);
    assert.equal(script.estimatedCu, report.plan.estimatedCu);
    assert.equal(script.sourceCount, report.result.data.sources.length);
    assert.equal(script.chapters.length, 6);
    assert.equal(script.durationMs, 48000);
    assert.equal(script.highlights.length, 4);
    assert.ok(script.rows.length <= 3);
    assert.ok(script.commands.run.includes(snapshot.captures[index].address));
    assert.ok(!script.commands.run.includes("--short"));
  }
});
test("highlights preserve financial meaning, units, and unknown controls", () => {
  const token = scripts[0],
    wallet = scripts[1];
  assert.equal(token.highlights[0].value, "$0.004174");
  assert.equal(token.checks[0].value, "60.35%");
  assert.equal(token.checks[1].value, "Unknown");
  assert.equal(token.checks[2].value, "Unknown");
  assert.equal(wallet.highlights[1].value, "-$12,296.06");
  assert.equal(wallet.highlights[2].value, "$508,553.51");
  assert.equal(wallet.rows[0][0], "PUMP");
  assert.equal(wallet.rows[0][2], "77.82%");
  assert.equal(wallet.checks[0].value, "$0.00");
});
test("offline export matches the guided stories", async () => {
  const exported = JSON.parse(
    await readFile("apps/landing/public/demo-script.json", "utf8"),
  );
  assert.equal(exported.illustrative, false);
  assert.deepEqual(exported.scripts, scripts);
});
