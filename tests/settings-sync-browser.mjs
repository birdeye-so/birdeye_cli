// Keys saved in one tab must be usable in every open tab without a reload. Synthetic key; no provider requests.
import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Ledger } from "../dist/ledger.js";
import { startInterface } from "../dist/interface/server.js";
delete process.env.BIRDEYE_API_KEY;
const dir = await mkdtemp(join(tmpdir(), "birdeye-settings-"));
const app = await startInterface({
  ledger: new Ledger(":memory:"),
  bind: "127.0.0.1:0",
  dir,
});
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
try {
  const context = await browser.newContext(),
    other = await context.newPage(),
    page = await context.newPage(),
    errors = [];
  for (const p of [other, page])
    p.on("pageerror", (e) => errors.push(e.message));
  const bar = (p) => p.locator(".connection-bar");
  for (const p of [other, page]) {
    await p.goto(app.loginUrl);
    await bar(p).getByText("key required").waitFor();
  }
  await page
    .getByRole("button", { name: "Settings", exact: true })
    .first()
    .click();
  await page.locator("#bkey").fill("synthetic-birdeye-key");
  await page
    .getByRole("button", { name: "Save connections", exact: true })
    .click();
  assert.match(
    await page
      .getByRole("status")
      .filter({ hasText: "Connections saved" })
      .innerText(),
    /active now/,
  );
  await bar(page).getByText("key configured").waitFor();
  // Returning to a tab refreshes server state; unsaved Settings edits survive the refresh.
  await page.getByLabel("Model ID").fill("unsaved-model");
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await other.evaluate(() =>
    document.dispatchEvent(new Event("visibilitychange")),
  );
  await bar(other).getByText("key configured").waitFor({ timeout: 5000 });
  // Background tabs throttle the plan preview timer, so wait for the button instead of sampling it.
  await other
    .locator("button:enabled", { hasText: "Run research" })
    .waitFor({ timeout: 10000 });
  assert.equal(await page.getByLabel("Model ID").inputValue(), "unsaved-model");
  assert.deepEqual(errors, []);
  console.log(
    "Settings sync: saved keys reach other open tabs on focus without reload; unsaved edits kept.",
  );
} finally {
  await browser.close();
  await app.close();
  await rm(dir, { recursive: true, force: true });
}
