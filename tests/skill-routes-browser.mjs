import assert from "node:assert/strict";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { createSkillServer } from "../apps/skills-api/dist/server.js";
import { skillAliases } from "../dist/skill-identity.js";
import { startBrowserInterface } from "../dist/interface/browser-server.js";
import { readCatalog } from "../apps/skills-api/dist/catalog.js";

const server = createSkillServer({
  demoDirectory: resolve("apps/skills-api/public"),
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));
// Native validation blocks Run with only a browser tooltip, so every default must be in range.
const invalidNumbers = (page) =>
  page
    .locator('input[type="number"]')
    .evaluateAll((inputs) =>
      inputs
        .filter((input) => !input.validity.valid)
        .map(
          (input) =>
            `${input.labels[0]?.textContent}: ${input.validationMessage}`,
        ),
    );
const preview = await startBrowserInterface("127.0.0.1:0");
let browser;
try {
  browser = await chromium.launch({
    executablePath:
      process.env.CHROME_PATH ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  const catalog = await readCatalog();
  for (const origin of [
    `http://127.0.0.1:${server.address().port}`,
    preview.listenUrl,
  ]) {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 950 } });
      const errors = [],
        external = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("request", (request) => {
        if (!request.url().startsWith(origin)) external.push(request.url());
      });
      await page.goto(`${origin}/skill-price-surge?from=demo#skills`);
      await page
        .getByRole("button", { name: "Use temporary session", exact: true })
        .click();
      await page
        .getByRole("heading", { name: "Price Surge Screen", exact: true })
        .waitFor();
      await page.evaluate(() => {
        window.navigationMarker = "same workspace";
      });
      if (
        !(await page.locator(".skill-rail").evaluate((element) => element.open))
      )
        await page.locator(".skill-toggle").click();
      for (const skill of catalog.skills) {
        await page.locator('[data-category="all"]').click();
        const before = {
          path: new URL(page.url()).pathname,
          length: await page.evaluate(() => history.length),
        };
        await page
          .getByRole("button", { name: skill.title, exact: true })
          .click();
        await page
          .getByRole("heading", { name: skill.title, exact: true })
          .waitFor();
        assert.equal(
          new URL(page.url()).pathname,
          `/${skill.id}`,
          "Choosing a skill must update its URL",
        );
        assert.equal(new URL(page.url()).search, "?from=demo");
        assert.equal(new URL(page.url()).hash, "#skills");
        assert.equal(
          await page.evaluate(() => history.length),
          before.length + (before.path === `/${skill.id}` ? 0 : 1),
        );
        assert.equal(
          await page.evaluate(() => window.navigationMarker),
          "same workspace",
          "Selection must not reload the workspace",
        );
        assert.deepEqual(await invalidNumbers(page), [], skill.title);
      }
      const last = catalog.skills.at(-1),
        previous = catalog.skills.at(-2);
      await page.goBack();
      await page
        .getByRole("heading", { name: previous.title, exact: true })
        .waitFor();
      assert.equal(
        await page.locator(".skill-card.selected").getAttribute("aria-label"),
        previous.title,
      );
      await page.goForward();
      await page
        .getByRole("heading", { name: last.title, exact: true })
        .waitFor();
      const otherCategory = catalog.skills.find(
        (skill) => skill.category !== last.category,
      );
      await page.locator(`[data-category="${otherCategory.category}"]`).click();
      await page
        .getByRole("heading", { name: otherCategory.title, exact: true })
        .waitFor();
      assert.equal(
        new URL(page.url()).pathname,
        `/${otherCategory.id}`,
        "Category auto-selection must update the URL",
      );
      await page.goBack();
      await page
        .getByRole("heading", { name: last.title, exact: true })
        .waitFor();
      assert.equal(
        await page.locator(".skill-card.selected").getAttribute("aria-label"),
        last.title,
        "Back must reveal the skill across category filters",
      );
      await page.goForward();
      await page
        .getByRole("heading", { name: otherCategory.title, exact: true })
        .waitFor();
      await page.reload();
      await page
        .getByRole("button", { name: "Use temporary session", exact: true })
        .click();
      await page
        .getByRole("heading", { name: otherCategory.title, exact: true })
        .waitFor();
      for (const skill of catalog.skills) {
        const response = await page.goto(`${origin}/${skill.id}`);
        assert.equal(response.status(), 200);
        await page
          .getByRole("button", { name: "Use temporary session", exact: true })
          .click();
        await page
          .getByRole("heading", { name: skill.title, exact: true })
          .waitFor();
        assert.equal(
          await page.locator(".skill-card.selected").getAttribute("aria-label"),
          skill.title,
        );
        assert.equal(await page.locator(".history-item").count(), 0);
        assert.deepEqual(await invalidNumbers(page), [], skill.title);
        await page.reload();
        await page
          .getByRole("button", { name: "Use temporary session", exact: true })
          .click();
        await page
          .getByRole("heading", { name: skill.title, exact: true })
          .waitFor();
      }
      {
        for (const path of [
          ...skillAliases("skill-price-surge").map((id) => `/${id}`),
          "/skill-price-surge/",
        ]) {
          const response = await page.goto(origin + path + "?from=demo");
          assert.equal(response.status(), 200, path);
          assert.equal(new URL(page.url()).pathname, "/skill-price-surge");
          assert.equal(new URL(page.url()).search, "?from=demo");
          await page
            .getByRole("button", { name: "Use temporary session", exact: true })
            .click();
          await page
            .getByRole("heading", { name: "Price Surge Screen", exact: true })
            .waitFor();
          assert.equal(
            await page
              .locator(".skill-card.selected")
              .getAttribute("aria-label"),
            "Price Surge Screen",
          );
        }
      }
      if (origin === preview.listenUrl) {
        await page.goto(origin + "/");
        await page
          .getByRole("button", { name: "Use temporary session", exact: true })
          .click();
        await page
          .getByRole("heading", { name: "Token Trending", exact: true })
          .waitFor();
        if (
          !(await page
            .locator(".skill-rail")
            .evaluate((element) => element.open))
        )
          await page.locator(".skill-toggle").click();
        await page
          .getByRole("button", { name: "Price Surge Screen", exact: true })
          .click();
        assert.equal(new URL(page.url()).pathname, "/skill-price-surge");
        await page.goBack();
        await page
          .getByRole("heading", { name: "Token Trending", exact: true })
          .waitFor();
        await page.goForward();
        await page
          .getByRole("heading", { name: "Price Surge Screen", exact: true })
          .waitFor();
      }
      if (width === 1440) {
        const nav = page.getByRole("navigation", { name: "Workspace" });
        const showing = (tab) =>
          page.waitForFunction(
            (name) =>
              document.querySelector(
                'nav[aria-label="Workspace"] [aria-current="page"]',
              )?.textContent === name,
            tab,
            { timeout: 5000 },
          );
        await page.goto(`${origin}/skill-top-trader-analysis?from=demo`);
        await page
          .getByRole("button", { name: "Use temporary session", exact: true })
          .click();
        await page
          .getByRole("heading", { name: "Top Trader Analysis", exact: true })
          .waitFor();
        assert.match(await page.title(), /^Top Trader Analysis · /);
        await page.getByLabel("Maximum page rows").fill("7");
        for (const [tab, view] of [
          ["Demos", "demos"],
          ["Usage & credits", "usage"],
          ["Settings", "settings"],
        ]) {
          await nav.getByRole("button", { name: tab, exact: true }).click();
          await showing(tab);
          const url = new URL(page.url());
          assert.equal(url.pathname, "/skill-top-trader-analysis");
          assert.equal(url.searchParams.get("view"), view, tab);
          assert.equal(url.searchParams.get("from"), "demo");
          assert.match(await page.title(), new RegExp(`^${tab} · `));
        }
        await page.goBack();
        await showing("Usage & credits");
        await page.goBack();
        await page.goBack();
        await showing("Research");
        assert.equal(new URL(page.url()).search, "?from=demo");
        assert.equal(
          await page.getByLabel("Maximum page rows").inputValue(),
          "7",
          "Back to Research must keep the form",
        );
        await page.goto(`${origin}/skill-top-trader-analysis?view=usage`);
        await page
          .getByRole("button", { name: "Use temporary session", exact: true })
          .click();
        await showing("Usage & credits");
        assert.match(await page.title(), /^Usage & credits · /);
      }
      assert.deepEqual(errors, []);
      assert.deepEqual(
        external,
        [],
        "Opening demo links must not call external providers",
      );
      console.log(
        `${origin === preview.listenUrl ? "Browser preview" : "Skills API"} ${width}px: all ${catalog.skills.length} skill links and UI selections stay in sync, including Back/Forward, categories and reload; no external requests`,
      );
      await page.close();
    }
  }
} finally {
  await browser?.close();
  await preview.close();
  await new Promise((done) => {
    server.close(done);
    server.closeAllConnections();
  });
}
