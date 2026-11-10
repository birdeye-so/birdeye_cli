// Local fixtures only: no Birdeye/AI requests and no HTTP listener.
import { chromium } from "playwright-core";
import { build } from "esbuild";
import { readFile, mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
const address = "So11111111111111111111111111111111111111112";
const output = await build({
  stdin: {
    contents: `
import React from 'react';
import {createRoot} from 'react-dom/client';
import {AddressText,AddressCopyProvider,AddressCopyNotice} from './web/address-text';
import {DemoView} from './web/demo-views';
import {walletDiscoveryReport} from './tests/fixtures/demo-reports.mjs';
createRoot(document.getElementById('root')).render(<AddressCopyProvider><main className="console-app content"><h1>Address actions · synthetic fixture</h1><p id="token"><AddressText text="${address}" kind="token"/></p><p id="wallet"><AddressText text="${address}" kind="wallet" compact/></p><p id="unknown"><AddressText text="${address}"/></p><DemoView id="wallet-intelligence" report={walletDiscoveryReport} onSelectWallet={a=>{window.selectedWallet=a}}/><AddressCopyNotice/></main></AddressCopyProvider>);`,
    resolveDir: process.cwd(),
    loader: "tsx",
  },
  bundle: true,
  write: false,
  format: "iife",
  jsx: "automatic",
});
const css = await readFile("web/style.css", "utf8");
const html = `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style><div id="root"></div><script>${output.outputFiles[0].text}</script>`;
let browser;
try {
  browser = await chromium.launch({
    executablePath:
      process.env.CHROME_PATH ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  await context.route("**/*", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: route.request().url().startsWith("http://address-ui.test/")
        ? html
        : "<p>Intercepted Birdeye navigation</p>",
    }),
  );
  const page = await context.newPage(),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    window.copiedAddresses = [];
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: async (value) => window.copiedAddresses.push(value) },
      configurable: true,
    });
  });
  await page.goto("http://address-ui.test/");
  await page.locator("#token button").click();
  assert.deepEqual(await page.evaluate(() => window.copiedAddresses), [
    address,
  ]);
  await page.locator("#wallet button").focus();
  await page.keyboard.press("Enter");
  assert.deepEqual(await page.evaluate(() => window.copiedAddresses), [
    address,
    address,
  ]);
  for (const kind of ["token", "wallet"]) {
    const link = page.locator(`#${kind} a`);
    await link.focus();
    const popupPromise = page.waitForEvent("popup");
    await page.keyboard.press("Enter");
    const popup = await popupPromise;
    await popup.waitForLoadState();
    assert.equal(
      popup.url(),
      `https://birdeye.so/solana/${kind === "token" ? "token" : "wallet-analyzer"}/${address}`,
    );
    await popup.close();
  }
  assert.equal(
    await page.evaluate(() => window.copiedAddresses.length),
    2,
    "Explore must not copy",
  );
  assert.equal(await page.locator("#unknown a").count(), 0);
  assert.equal(
    (await page
      .locator('.demo-wallet-discovery a[href*="/wallet-analyzer/"]')
      .count()) > 0,
    true,
  );
  await page
    .getByRole("button", { name: `Select wallet ${address}`, exact: true })
    .click();
  assert.equal(await page.evaluate(() => window.selectedWallet), address);
  await mkdir(".impeccable/review", { recursive: true });
  for (const theme of ["dark", "light"]) {
    await page
      .locator("main")
      .evaluate(
        (el, theme) => el.classList.toggle("light", theme === "light"),
        theme,
      );
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 950 });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      await page.screenshot({
        path: `.impeccable/review/address-links-${theme}-${width}.png`,
        fullPage: true,
      });
    }
  }
  assert.deepEqual(errors, []);
  console.log(
    "Copy, keyboard navigation, token/wallet links and responsive fixtures passed; 0 external requests.",
  );
} finally {
  await browser?.close();
}
