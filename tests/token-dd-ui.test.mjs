import test from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { planCase } from "../.test-dist/src/workflows.js";
import { tokenDdScore } from "../.test-dist/src/token-dd-score.js";
await build({
  entryPoints: ["web/token-dd-score.tsx", "web/skill-settings.tsx"],
  outdir: ".test-dist/dd-ui",
  bundle: true,
  packages: "external",
  platform: "node",
  format: "esm",
  jsx: "automatic",
  outExtension: { ".js": ".mjs" },
});
const { TokenDdScore } = await import("../.test-dist/dd-ui/token-dd-score.mjs");
const { SkillSettings } =
  await import("../.test-dist/dd-ui/skill-settings.mjs");
const address = "So11111111111111111111111111111111111111112";
test("DD UI presents missing evidence without fake zero scores and exposes free re-score", () => {
  const report = tokenDdScore(
    planCase({ kind: "skill-token-dd-score", address }).input,
    [],
  );
  const html = renderToStaticMarkup(
    React.createElement(TokenDdScore, { report, onRescore: async () => {} }),
  );
  assert.match(html, /UNAVAILABLE/);
  assert.match(html, /Re-score saved evidence · 0 CU/);
  assert.match(html, /Coverage &amp; assumptions/);
  assert.match(html, /Liquidity window/);
  assert.match(html, /Holder concentration/);
  assert.doesNotMatch(html, /NaN|undefined|\[object Object\]/);
  assert.match(html, /https:\/\/birdeye.so\/solana\/token\//);
});
test("standard settings remove paid advanced knobs; advanced has bound candle controls", () => {
  const render = (ddMode) =>
    renderToStaticMarkup(
      React.createElement(SkillSettings, {
        kind: "skill-token-dd-score",
        value: { ddMode },
        change: () => {},
      }),
    );
  const advanced = render("advanced"),
    standard = render("standard");
  assert.match(advanced, /Liquidity candle resolution/);
  assert.match(advanced, /max="100"/);
  assert.doesNotMatch(standard, /Liquidity candle resolution/);
  assert.match(standard, /Evidence depth/);
});
