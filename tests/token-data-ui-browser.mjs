// UI-only verification. Synthetic fixtures plus optional previously captured snapshots; no API calls.
import { chromium } from "playwright-core";
import { build } from "esbuild";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { dataReports } from "./fixtures/token-data-reports.mjs";
const root = "test-results/token-data-ui";
await mkdir(root, { recursive: true });
const fixtures = structuredClone(dataReports);
fixtures["skill-lp-analysis"].analysis.findings[0].tables
  .find((t) => t.title.startsWith("Selected pair"))
  .rows.splice(1);
const traders =
  fixtures["skill-top-trader-analysis"].analysis.findings[0].tables[0].rows;
traders.push({
  ...traders[0],
  wallet: "11111111111111111111111111111113",
  realizedPnlUsd: 25,
  volumeUsd: 50,
});
const launches =
  fixtures["skill-launchpad-trending"].analysis.findings[0].tables[0].rows;
launches.push({
  ...launches[0],
  address: "11111111111111111111111111111113",
  symbol: "SECOND",
  liquidityUsd: 9000,
  volume24hUsd: 500,
});
const sets = { Synthetic: fixtures };
if (process.env.BIRDEYE_UI_SNAPSHOT_DIR) {
  sets.Captured = {};
  for (const kind of Object.keys(fixtures)) {
    const r = JSON.parse(
      await readFile(
        `${process.env.BIRDEYE_UI_SNAPSHOT_DIR}/${kind}.json`,
        "utf8",
      ),
    );
    sets.Captured[kind] = {
      kind,
      analysis: r.data.skillAnalysis,
      sources: r.data.sources,
    };
  }
}
const bundle = await build({
  stdin: {
    contents: `
import React,{useState} from 'react';import {createRoot} from 'react-dom/client';
import {SkillDashboard} from './web/skill-visuals';import {AddressCopyProvider,AddressCopyNotice} from './web/address-text';
const sets=${JSON.stringify(sets)};
function App(){const [kind,setKind]=useState('skill-kol-signal'),[theme,setTheme]=useState('dark'),[sample,setSample]=useState('Synthetic'),[empty,setEmpty]=useState(false);
const props=structuredClone(sets[sample][kind]);if(empty){const r=props.analysis.findings[0];r.summary={};r.tables=[];r.pagination=[];r.sourceIds=[];r.missing=['No source data available'];props.sources=[];}
return <AddressCopyProvider><div className={'console-app '+theme}><header className="console-header"><strong>Birdeye · Skill previews</strong><span>{sample==='Synthetic'?'Synthetic fixtures':'Recorded API snapshot'} · No live requests</span><label>Skill<select aria-label="Preview skill" value={kind} onChange={e=>setKind(e.target.value)}>{Object.keys(sets.Synthetic).map(k=><option key={k}>{k}</option>)}</select></label><label>Theme<select aria-label="Theme" value={theme} onChange={e=>setTheme(e.target.value)}><option>dark</option><option>light</option></select></label><label>Data<select aria-label="Preview data" value={sample} onChange={e=>setSample(e.target.value)}>{Object.keys(sets).map(k=><option key={k}>{k}</option>)}</select></label><label><input type="checkbox" checked={empty} onChange={e=>setEmpty(e.target.checked)}/>Empty snapshot</label></header><main style={{maxWidth:1000,margin:'auto',padding:24}}><SkillDashboard key={kind+empty+sample} {...props}/></main><AddressCopyNotice/></div></AddressCopyProvider>};createRoot(document.getElementById('root')).render(<App/>);`,
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
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Birdeye · Token skill previews</title><style>${css}</style><div id="root"></div><script>${bundle.outputFiles[0].text.replaceAll("</script", "<\\/script")}</script></html>`;
await writeFile(`${root}/preview.html`, html);
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
try {
  const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    }),
    errors = [],
    external = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/*", (route) => {
    if (new URL(route.request().url()).hostname !== "skills.test")
      external.push(route.request().url());
    return route.fulfill({ contentType: "text/html", body: html });
  });
  await page.addInitScript(() => {
    window.copied = [];
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: async (value) => window.copied.push(value) },
      configurable: true,
    });
  });
  await page.goto("http://skills.test");
  const choose = (kind) => page.getByLabel("Preview skill").selectOption(kind);
  await choose("skill-token-stats");
  await page.getByRole("button", { name: "1h", exact: true }).click();
  assert.match(await page.locator(".td-body").innerText(), /-2.00%/);
  assert.match(
    await page.locator(".td-body").innerText(),
    /No observed buy or sell volume/,
  );
  await choose("skill-token-security");
  await page.getByRole("button", { name: "Active", exact: true }).click();
  await page.getByText("No controls match this filter.").waitFor();
  await page.getByRole("button", { name: "All controls", exact: true }).click();
  assert.equal(
    await page
      .locator(".td-controls")
      .getByText("Inactive", { exact: true })
      .count(),
    4,
  );
  await page.getByText("All data & methodology", { exact: true }).click();
  await page
    .getByRole("region", { name: "Security observations", exact: true })
    .waitFor();
  await choose("skill-top-holder-analysis");
  assert.equal(
    await page.getByRole("button", { name: /Inspect holder/ }).count(),
    5,
  );
  await page.getByRole("button", { name: "Show more · 5 remaining" }).click();
  assert.equal(
    await page.getByRole("button", { name: /Inspect holder/ }).count(),
    10,
  );
  await page
    .getByRole("button", { name: "Inspect holder 2", exact: true })
    .click();
  assert.equal(
    await page
      .getByRole("button", { name: "Inspect holder 2", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  assert.match(
    await page
      .getByRole("complementary", { name: "Selected holder" })
      .innerText(),
    /100,000,000,000,000,000,001/,
  );
  await choose("skill-top-trader-analysis");
  assert.match(
    await page
      .getByRole("complementary", { name: "Selected trader" })
      .innerText(),
    /\$25.00/,
  );
  await page.getByLabel("Rank traders").selectOption("volumeUsd");
  await page
    .getByRole("button", { name: "Inspect trader 1", exact: true })
    .click();
  assert.match(
    await page
      .getByRole("complementary", { name: "Selected trader" })
      .innerText(),
    /−\$4.00/,
  );
  const copy = page
    .getByRole("complementary", { name: "Selected trader" })
    .locator(".copy-address");
  await copy.click();
  assert.equal(
    await page.evaluate(() => window.copied.at(-1)),
    await copy.getAttribute("data-address"),
  );
  await page.waitForFunction(
    () =>
      !document.querySelector(".copy-notice")?.classList.contains("visible"),
  );
  await choose("skill-launchpad-trending");
  await page.getByLabel("Compare by").selectOption("liquidityUsd");
  assert.match(
    await page.locator(".td-launch-row").first().innerText(),
    /SECOND/,
  );
  await page.getByLabel("Find token").fill("unmatched");
  await page
    .getByText("No matching tokens. Try another symbol or address.")
    .waitFor();
  await choose("skill-lp-analysis");
  await page
    .getByRole("button", { name: "Inspect pool 2", exact: true })
    .click();
  assert.match(
    await page
      .getByRole("complementary", { name: "Selected pool" })
      .innerText(),
    /Detailed snapshot not fetched/,
  );
  assert.equal(
    await page
      .getByRole("complementary", { name: "Selected pool" })
      .locator('a[href*="/token/"]')
      .count(),
    0,
  );
  await choose("skill-kol-signal");
  const slider = page.getByRole("slider", { name: "Inspect activity bucket" });
  await slider.focus();
  await page.keyboard.press("Home");
  assert.match(await page.locator(".td-observation").innerText(), /\$100.00/);
  await page.keyboard.press("End");
  assert.match(await page.locator(".td-observation").innerText(), /\$0.00/);
  await choose("skill-smart-money-holders");
  await page
    .getByRole("button", { name: "Buying & selling", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Compare cohort buying and selling" })
    .waitFor();
  assert.equal(
    await page.getByRole("region", { name: "See who still holds" }).count(),
    0,
  );
  await page
    .getByRole("button", { name: "Current holders", exact: true })
    .click();
  await page.getByRole("region", { name: "See who still holds" }).waitFor();
  const measures = [];
  for (const sample of Object.keys(sets)) {
    await page.getByLabel("Preview data").selectOption(sample);
    for (const kind of Object.keys(fixtures)) {
      await choose(kind);
      for (const [theme, width, height] of [
        ["dark", 1440, 1000],
        ["light", 390, 844],
      ]) {
        await page.getByLabel("Theme", { exact: true }).selectOption(theme);
        await page.setViewportSize({ width, height });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          `${sample}/${kind}/${width}: overflow`,
        );
        const visible = await page.locator(".token-data-report").innerText();
        assert.doesNotMatch(visible, /NaN|undefined|\[object Object\]/);
        assert.equal(await page.locator("button button, button a").count(), 0);
        assert.equal(
          await page.locator(".td-evidence").getAttribute("open"),
          null,
        );
        const target = page.locator(".token-data-report");
        measures.push({
          sample,
          kind,
          theme,
          width,
          words: visible.split(/\s+/).length,
          height: (await target.boundingBox()).height,
        });
        await target.screenshot({
          path: `${root}/${sample}-${kind}-${width}.png`,
        });
      }
      await page.getByLabel("Empty snapshot").check();
      assert.doesNotMatch(
        await page.locator(".token-data-report").innerText(),
        /\$0.00|>Safe<|NaN/,
      );
      await page.getByLabel("Empty snapshot").uncheck();
    }
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(external, []);
  await writeFile(
    `${root}/measurements.json`,
    JSON.stringify(measures, null, 2),
  );
  console.log(
    "Eight token-data UIs passed: period/control filters, sorting/search, selection, exact balances, copy, chart keyboard input, evidence disclosure, missing data, dark desktop/light mobile and no external requests.",
  );
} finally {
  await browser.close();
}
