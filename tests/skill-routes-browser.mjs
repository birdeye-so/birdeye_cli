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
