// Run after npm run build. Uses synthetic API responses; no network requests.
import { chromium } from "playwright-core";
import { build } from "esbuild";
import { readFile, mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
import { dataReports } from "./fixtures/token-data-reports.mjs";
const bundle = await build({
  stdin: {
    contents: `
import React,{useState} from 'react'; import {createRoot} from 'react-dom/client';
import {SkillSettings,SkillFindings} from './web/skill-settings';
const reports=${JSON.stringify(dataReports)};
function App(){const [kind,setKind]=useState('skill-kol-signal'),[value,change]=useState({depth:'full'}),[limit,setLimit]=useState(3),[scanLimit,setScanLimit]=useState(10); return <div className="console-app dark"><main style={{maxWidth:1000,margin:'auto',padding:20}}><label>Skill<select aria-label="Skill" value={kind} onChange={e=>{setKind(e.target.value);change({depth:'full'});}}>{Object.keys(reports).map(k=><option key={k}>{k}</option>)}</select></label><SkillSettings kind={kind} value={value} change={change} limit={limit} setLimit={setLimit} scanLimit={scanLimit} setScanLimit={setScanLimit} interval="24h" setInterval={()=>{}} duration="30d" setDuration={()=>{}}/><SkillFindings {...reports[kind]}/></main></div>};createRoot(document.getElementById('root')).render(<App/>);`,
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
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Token data skill fixtures</title><style>${css}</style><div id="root"></div><script>${bundle.outputFiles[0].text.replaceAll("</script", "<\\/script")}</script></html>`;
await mkdir(".impeccable/review", { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
try {
  const page = await browser.newPage(),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/*", (route) =>
    route.fulfill({ contentType: "text/html", body: html }),
  );
  await page.goto("http://skills.test");
  for (const kind of Object.keys(dataReports)) {
    await page.getByLabel("Skill", { exact: true }).selectOption(kind);
    for (const [size, width, height] of [
      ["desktop", 1440, 1000],
      ["mobile", 390, 844],
    ]) {
      await page.setViewportSize({ width, height });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${kind} ${size} overflow`,
      );
      assert.doesNotMatch(
        await page.locator(".skill-visuals").innerText(),
        /NaN|undefined|\[object Object\]/,
      );
      await page.screenshot({
        path: `.impeccable/review/${kind}-${size}.png`,
        fullPage: true,
      });
    }
  }
  await page
    .getByLabel("Skill", { exact: true })
    .selectOption("skill-kol-signal");
  await page
    .getByRole("combobox", { name: /^Activity bucket/ })
    .selectOption("4h");
  assert.equal(
    await page.getByRole("combobox", { name: /^Activity bucket/ }).inputValue(),
    "4h",
  );
  await page.getByLabel("Net-flow threshold").fill("1000");
  assert.equal(
    await page.getByLabel("Net-flow threshold").inputValue(),
    "1000",
  );
  await page
    .getByText("Source coverage and pagination", { exact: true })
    .click();
  assert.match(
    await page.locator(".sv-evidence pre").innerText(),
    /"hasMore": true/,
  );
  await page
    .locator(".console-app")
    .evaluate((el) => el.classList.replace("dark", "light"));
  await page.screenshot({
    path: ".impeccable/review/skill-kol-signal-light-mobile.png",
    fullPage: true,
  });
  assert.deepEqual(errors, []);
  console.log(
    "8 data skills: desktop/mobile tables, settings, coverage and light theme passed. No live API calls.",
  );
} finally {
  await browser.close();
}
