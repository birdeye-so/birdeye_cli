import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import { mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
const output = resolve("test-results/landing-demo");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1150 },
  });
  const errors = [];
  const networkRequests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route(/^https?:/, (route) => {
    networkRequests.push(route.request().url());
    return route.abort();
  });
  await page.goto(pathToFileURL(resolve("apps/landing/public/demo.html")).href);
  const demo = page.locator("#demo");
  assert.equal(
    await demo.getByRole("complementary").getByRole("button").count(),
    6,
  );
  assert.equal(await demo.getByRole("searchbox").count(), 0);
  await demo.getByRole("button", { name: "Play demo", exact: true }).click();
  await page.waitForFunction(
    () => Number(document.querySelector("input[type=range]").value) > 500,
  );
  await demo.getByRole("button", { name: "Pause demo", exact: true }).click();
  const paused = await demo.getByRole("slider").inputValue();
  await page.waitForTimeout(200);
  assert.equal(await demo.getByRole("slider").inputValue(), paused);
  await demo.getByRole("button", { name: /Preview the budget/ }).click();
  await demo.getByText("253 CU", { exact: true }).waitFor();
  await demo.getByRole("button", { name: /Run the research/ }).click();
  await demo.getByRole("button", { name: "Play demo", exact: true }).click();
  await page.waitForFunction(
    () => document.querySelectorAll("[data-status=done]").length >= 1,
  );
  await demo.getByRole("button", { name: "Pause demo", exact: true }).click();
  await demo.screenshot({ path: resolve(output, "run-desktop.png") });
  await demo.getByRole("button", { name: /Read the results/ }).click();
  await demo.getByText("$0.004174", { exact: true }).waitFor();
  await demo.screenshot({ path: resolve(output, "token-desktop.png") });
  await demo.getByRole("button", { name: /Explore the evidence/ }).click();
  await demo.getByText("60.35%", { exact: true }).waitFor();
  assert.equal(await demo.locator("tbody tr").count(), 3);
  await demo
    .getByRole("button", { name: "Wallet analysis", exact: true })
    .click();
  assert.equal(await demo.getByRole("slider").inputValue(), "0");
  await demo.getByRole("button", { name: /Read the results/ }).click();
  await demo.getByText("-$12,296.06", { exact: true }).waitFor();
  await demo.screenshot({ path: resolve(output, "wallet-desktop.png") });
  await page.setViewportSize({ width: 390, height: 844 });
  await demo.screenshot({ path: resolve(output, "wallet-mobile.png") });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await demo.getByRole("button", { name: /Explore the evidence/ }).click();
  await demo.getByText("77.82%", { exact: true }).waitFor();
  await demo.screenshot({ path: resolve(output, "evidence-mobile.png") });
  await demo.getByRole("button", { name: /Revisit the result/ }).click();
  const downloaded = page.waitForEvent("download");
  await demo.getByRole("button", { name: "Export full evidence" }).click();
  await (await downloaded).saveAs(resolve(output, "wallet.json"));
  const data = JSON.parse(
    await readFile(resolve(output, "wallet.json"), "utf8"),
  );
  assert.equal(data.illustrative, false);
  assert.equal(data.reports[0].result.data.sources.length, 9);
  await demo
    .getByRole("button", { name: "CLI transcript", exact: true })
    .click();
  assert.match(
    await demo.getByLabel("CLI demo transcript").textContent(),
    /Realized PnL/,
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(
    networkRequests,
    [],
    "The bundled demo must not even attempt network requests; viewers need no API key or CLI server.",
  );
  console.log(
    "Guided demo passed: six scenes, animated collection, selected real highlights, evidence, export, playback, desktop/mobile.",
  );
} finally {
  await browser.close();
}
