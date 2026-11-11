// Run after `npm run build`. Drives the browser-storage app; no provider requests.
import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import { startBrowserInterface } from "../dist/interface/browser-server.js";
import { readCatalog } from "../apps/skills-api/dist/catalog.js";

const token = "So11111111111111111111111111111111111111112";
const preview = await startBrowserInterface("127.0.0.1:0");
let browser;
try {
  browser = await chromium.launch({
    executablePath:
      process.env.CHROME_PATH ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const open = async (id, title) => {
    await page.goto(`${preview.listenUrl}/${id}`);
    await page
      .getByRole("button", { name: "Use temporary session", exact: true })
      .click();
    await page.getByRole("heading", { name: title, exact: true }).waitFor();
  };
  const estimate = page.locator(".workflow-estimate [role=status]");
  const settled = async () => {
    await page.waitForFunction(
      () =>
        !/Checking/.test(
          document.querySelector(".workflow-estimate [role=status]")
            ?.textContent ?? "Checking",
        ),
    );
    return estimate.innerText();
  };
  const cli = page.locator(".workflow-overview > details").first();

  await open("skill-top-trader-analysis", "Top Trader Analysis");
  assert.equal(
    await page.getByRole("button", { name: /Run research/ }).isDisabled(),
    true,
  );
  assert.match(
    await settled(),
    /address/i,
    "A missing address must say why Run is disabled",
  );

  const address = page.getByLabel("Token address");
  await page.getByLabel("CU limit").fill("1");
  await settled();
  assert.equal(
    await page.getByText(/exceeds this run/).count(),
    0,
    "No budget warning before an address is entered",
  );
  await page.getByLabel("CU limit").fill("");
  await address.fill(token);
  assert.match(await settled(), /CU before retries/);
  const { x } = await cli.boundingBox();
  await address.fill("abc");
  const alert = page.locator(".workflow-overview [role=alert]");
  await alert.waitFor();
  const message = await alert.innerText();
  assert.match(message, /^Use a Solana address, not a token symbol\./);
  assert.doesNotMatch(message, /"code"|\[\s*\{|reset the edited step/);
  assert.equal(
    (await cli.boundingBox()).x,
    x,
    "An input error must not push the CLI command sideways",
  );

  await open("skill-token-stats", "Token Stats");
  await page.getByLabel("Token address").fill(token);
  if (!(await page.locator(".skill-rail").evaluate((rail) => rail.open)))
    await page.locator(".skill-toggle").click();
  await page.locator('[data-category="all"]').click();
  await page.getByRole("button", { name: "Top Holder Analysis" }).click();
  assert.equal(
    await page.getByLabel("Token address").inputValue(),
    token,
    "Token skills share the token address",
  );
  await page.getByRole("button", { name: "Wallet Score", exact: true }).click();
  await page
    .getByRole("heading", { name: "Wallet Score", exact: true })
    .waitFor();
  assert.equal(
    await page.getByLabel("Wallet address").inputValue(),
    "",
    "A token address must not carry into a wallet skill",
  );
  const wallet = "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM";
  await page.getByLabel("Wallet address").fill(wallet);
  await page.getByRole("button", { name: "Price Surge Screen" }).click();
  await page.getByRole("button", { name: "Wallet Style", exact: true }).click();
  await page
    .getByRole("heading", { name: "Wallet Style", exact: true })
    .waitFor();
  assert.equal(
    await page.getByLabel("Wallet address").inputValue(),
    wallet,
    "A skill without an address must not clear the wallet address",
  );
  await page.goBack();
  await page.goBack();
  await page.goBack();
  await page.getByRole("heading", { name: "Top Holder Analysis" }).waitFor();
  assert.equal(
    await page.getByLabel("Token address").inputValue(),
    token,
    "Back to a token skill restores its token address",
  );

  await open("skill-price-surge", "Price Surge Screen");
  assert.deepEqual(
    await page
      .getByLabel("Chain")
      .locator("option")
      .evaluateAll((options) => options.map((o) => o.value)),
    ["solana", "bsc", "base", "ethereum", "robinhood"],
  );
  await page.getByLabel("Chain").selectOption("base");
  await page.getByLabel("Surge interval").selectOption("4h");
  await page.getByLabel("Minimum market cap · USD").fill("1500.5");
  assert.ok(
    await page
      .getByLabel("Minimum market cap · USD")
      .evaluate((input) => input.validity.valid),
    "USD amounts accept decimals",
  );
  await page.getByLabel("Minimum market cap · USD").fill("100000");
  await page.getByLabel("Maximum market cap · USD").fill("5000000");
  assert.match(await settled(), /CU before retries/);
  await cli.locator("summary").click();
  assert.match(
    await cli.innerText(),
    /--chain base --interval 4h .*--min-market-cap 100000 --max-market-cap 5000000/s,
    "Top-level Price Surge inputs must reach the plan",
  );

  // Backspace must empty a number field, and retyping must not keep a stale 0 or default digit.
  for (const skill of (await readCatalog()).skills) {
    await open(skill.id, skill.title);
    const fields = page.locator(
      '.research-composer form input[type="number"]:visible',
    );
    for (let i = 0; i < (await fields.count()); i++) {
      const field = fields.nth(i);
      const name = `${skill.title} · ${await field.evaluate((e) => e.labels[0]?.firstChild?.textContent)}`;
      const start = await field.inputValue();
      await field.click();
      await page.keyboard.press("End");
      for (let k = 0; k <= start.length; k++)
        await page.keyboard.press("Backspace");
      assert.equal(await field.inputValue(), "", name);
      await page.keyboard.type("20");
      assert.equal(await field.inputValue(), "20", name);
    }
  }
  await open("skill-smart-money-leaderboard", "Smart Money Leaderboard");
  assert.doesNotMatch(
    await settled(),
    /an address/,
    "The hint must fit a Wallet addresses field",
  );
  await open("skill-launchpad-trending", "Token Launchpad Trending");
  await page.getByLabel("Minimum liquidity · USD").fill("0.5");
  assert.ok(
    await page
      .getByLabel("Minimum liquidity · USD")
      .evaluate((input) => input.validity.valid),
    "USD amounts accept decimals",
  );
  await page
    .getByRole("navigation", { name: "Workspace" })
    .getByRole("button", { name: "Settings", exact: true })
    .click();
  await page.getByLabel("Base URL").fill("http://example.com/v1");
  await page.getByLabel("Model ID").fill("fixture");
  await page.getByRole("button", { name: /Save connections/ }).click();
  await page.getByText("Remote AI providers require HTTPS").waitFor();
  await page.goBack();
  await page
    .getByRole("heading", { name: "Token Launchpad Trending", exact: true })
    .waitFor();
  assert.equal(
    await page.getByText("Remote AI providers require HTTPS").count(),
    0,
    "Back must clear the previous tab's error",
  );

  // An emptied field falls back to the default instead of blocking the estimate.
  await open("skill-top-holder-analysis", "Top Holder Analysis");
  await page.getByLabel("Token address").fill(token);
  await page.getByLabel("Top holder wallets").fill("");
  assert.match(await settled(), /CU before retries/);

  assert.deepEqual(errors, []);
  console.log(
    "Research form: missing-address hint, readable validation, stable layout and token/wallet address separation Price Surge inputs and clearable number fields passed.",
  );
} finally {
  await browser?.close();
  await preview.close?.();
}
