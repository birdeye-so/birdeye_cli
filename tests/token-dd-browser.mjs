// UI verification uses synthetic data by default; DD_REPORT_PATH can supply a saved live run.
// This script makes no API calls and never needs an API key.
import { chromium } from "playwright-core";
import { build } from "esbuild";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { planCase } from "../dist/workflows.js";
import { tokenDdScore } from "../dist/token-dd-score.js";
const address = "pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn";
const at = Math.floor(Date.now() / 1000);
const source = (operation, data, params = {}) => ({
  data,
  meta: {
    operation,
    chain: "solana",
    requestId: operation,
    params: { address, ...params },
  },
});
const synthetic = [
  source("token.overview", {
    symbol: "SAMPLE",
    price: 0.0021,
    marketCap: 2100000000,
    liquidity: 18000000,
    v24hUSD: 65000000,
    holder: 32000,
    priceChange24hPercent: 4,
    buy24h: 2200,
    sell24h: 1800,
    uniqueWallet24h: 1100,
  }),
  source("token.security", {
    ownerAddress: null,
    freezeAuthority: null,
    mutableMetadata: true,
    creatorPercentage: 0.01,
    top10HolderPercent: 0.63,
    lpLocked: true,
  }),
  source(
    "token.holder-distribution",
    {
      holders: Array.from({ length: 50 }, (_, i) => ({
        address: `sample-wallet-${i}`,
        percent_of_supply: i === 0 ? 45 : i < 10 ? 2 : 0.2,
      })),
    },
    { mode: "top", address_type: "wallet", offset: 0, include_list: true },
  ),
  source("token.holder-profile", {
    tags: [
      { tag: "dev", holder_count: 1, percent_of_supply: 1 },
      { tag: "sniper", holder_count: 17, percent_of_supply: 3 },
      { tag: "bundler", holder_count: 6, percent_of_supply: 2 },
    ],
  }),
  source(
    "token.liquidity-ohlc",
    {
      items: Array.from({ length: 96 }, (_, i) => ({
        unix_time: at - (96 - i) * 900,
        close_liquidity_usd: 20000000 - i * 25000,
        close_exit_liquidity_usd: 9000000 - i * 10000,
      })),
    },
    { time: at, resolution: "15m" },
  ),
];
const saved = process.env.DD_REPORT_PATH
  ? JSON.parse(await readFile(process.env.DD_REPORT_PATH, "utf8"))
  : null;
const sources = saved?.data?.sources ?? synthetic;
const reports = Object.fromEntries(
  ["standard", "advanced"].map((ddMode) => {
    const input = planCase({
      kind: "skill-token-dd-score",
      address,
      ddMode,
      from: at - 86400,
      to: at,
    }).input;
    const report = tokenDdScore(input, sources);
    report.meta.cu_estimated_total = ddMode === "standard" ? 51 : 181;
    return [ddMode, report];
  }),
);
const empty = tokenDdScore(
  planCase({ kind: "skill-token-dd-score", address }).input,
  [],
);
const built = await build({
  stdin: {
    contents: `
import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {TokenDdScore} from './web/token-dd-score';
import {SkillSettings} from './web/skill-settings';
import {AddressCopyProvider,AddressCopyNotice} from './web/address-text';
const reports=${JSON.stringify(reports)}, sources=${JSON.stringify(sources)}, empty=${JSON.stringify(empty)};
function App(){const [settings,setSettings]=useState({ddMode:'advanced'}),[theme,setTheme]=useState('dark'),[isEmpty,setEmpty]=useState(false);return <AddressCopyProvider><div className={'console-app '+theme}><header className="console-header"><strong>Birdeye · Token research</strong><span>${saved ? "Saved live evidence" : "Synthetic UI fixture"} · no API calls</span><label>Theme<select aria-label="Theme" value={theme} onChange={e=>setTheme(e.target.value)}><option>dark</option><option>light</option></select></label><label><input type="checkbox" checked={isEmpty} onChange={e=>setEmpty(e.target.checked)}/>Empty evidence</label></header><main style={{maxWidth:1000,margin:'0 auto',padding:24}}><SkillSettings kind="skill-token-dd-score" value={settings} change={setSettings}/><TokenDdScore key={settings.ddMode+isEmpty} report={isEmpty?empty:reports[settings.ddMode]} sources={isEmpty?[]:sources} onRescore={async changes=>{window.rescoreChanges=changes; if(window.failRescore)throw new Error('Saved evidence could not be read. Try again.');}}/></main><AddressCopyNotice/></div></AddressCopyProvider>}
createRoot(document.getElementById('root')).render(<App/>);`,
    resolveDir: process.cwd(),
    loader: "tsx",
  },
  bundle: true,
  write: false,
  format: "iife",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
});
const css = await readFile("web/style.css", "utf8");
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Token diligence preview</title><style>${css}</style><div id="root"></div><script>${built.outputFiles[0].text.replaceAll("</script", "<\\/script")}</script></html>`;
await mkdir(".impeccable/review", { recursive: true });
await writeFile(".impeccable/review/token-dd-preview.html", html);
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
try {
  const page = await browser.newPage({
      viewport: { width: 1440, height: 1100 },
    }),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/*", (route) =>
    route.fulfill({ contentType: "text/html", body: html }),
  );
  await page.goto("http://dd-ui.test/");
  for (const mode of ["standard", "advanced"]) {
    await page.getByRole("radio", { name: new RegExp(mode, "i") }).check();
    await page
      .getByRole("button", { name: "Inspect Security signals" })
      .click();
    assert.match(
      await page
        .getByRole("button", { name: "Inspect Security signals" })
        .getAttribute("aria-describedby"),
      /security$/,
    );
    const expand = page.getByRole("button", { name: /View all .* checks/ });
    if (await expand.count()) {
      await expand.click();
      assert.equal(
        await page.locator(".dd-attention > div > button").count(),
        Object.values(reports[mode].pillars)
          .flatMap((p) => Object.values(p.signals))
          .filter((s) => typeof s.score === "number" && s.score < 55).length,
      );
      await page.getByRole("button", { name: "Show fewer checks" }).click();
    }
    await page.getByRole("region", { name: "Security evidence" }).waitFor();
    await page.getByRole("button", { name: "Close details" }).click();
    assert.equal(
      await page.getByRole("region", { name: "Security evidence" }).count(),
      0,
    );
    for (const theme of ["dark", "light"]) {
      await page.getByLabel("Theme", { exact: true }).selectOption(theme);
      for (const [size, width, height] of [
        ["desktop", 1440, 1100],
        ["mobile", 390, 844],
      ]) {
        await page.setViewportSize({ width, height });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          `${mode} ${theme} ${size} overflow`,
        );
        assert.doesNotMatch(
          await page.locator(".dd-score").innerText(),
          /NaN|undefined|\[object Object\]/,
        );
        await page.screenshot({
          path: `.impeccable/review/dd-${mode}-${theme}-${size}.png`,
          fullPage: true,
        });
      }
    }
  }
  await page
    .locator(".dd-disclosure > summary")
    .filter({ hasText: "Re-score saved evidence" })
    .click();
  await page.getByLabel("Top holder rows", { exact: true }).last().fill("20");
  await page
    .getByRole("button", { name: "Re-score · 0 CU", exact: true })
    .click();
  assert.equal(await page.evaluate(() => window.rescoreChanges.topN), 20);
  await page.evaluate(() => {
    window.failRescore = true;
  });
  await page
    .getByRole("button", { name: "Re-score · 0 CU", exact: true })
    .click();
  await page
    .getByRole("alert")
    .filter({ hasText: "Saved evidence could not be read" })
    .waitFor();
  await page.getByLabel("Empty evidence").check();
  assert.match(await page.locator(".dd-score").innerText(), /UNAVAILABLE/);
  assert.equal(await page.locator(".dd-pillar-row .dd-bar > span").count(), 0);
  await page.getByRole("button", { name: "Inspect Holders signals" }).click();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
    "Mobile evidence overflow",
  );
  assert.deepEqual(errors, []);
  console.log(
    "DD UI passed: both modes, desktop/mobile, dark/light, signal drilldown, empty evidence, re-score and error state. No API calls.",
  );
} finally {
  await browser.close();
}
