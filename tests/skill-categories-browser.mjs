import assert from "node:assert/strict";
import { build } from "esbuild";
import { resolve } from "node:path";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";
import { startBrowserInterface } from "../dist/interface/browser-server.js";
await build({
  entryPoints: ["apps/skills-api/src/server.ts"],
  outfile: ".test-dist/category-api.mjs",
  bundle: true,
  platform: "node",
  format: "esm",
});
process.env.SKILL_CATALOG_PATH = resolve("apps/skills-api/catalog.json");
process.env.SKILL_STATS_DB_PATH = ":memory:";
const { createSkillServer } = await import("../.test-dist/category-api.mjs");
const api = createSkillServer({ demoDirectory: resolve("dist/browser") }),
  app = await startBrowserInterface("127.0.0.1:0");
await new Promise((done) => api.listen(0, "127.0.0.1", done));
const apiOrigin = `http://127.0.0.1:${api.address().port}`;
let browser;
try {
  const categories = (
    await (await fetch(apiOrigin + "/agent/api/categories")).json()
  ).data.list;
  const skills = (await (await fetch(apiOrigin + "/agent/api/skills")).json())
    .data.list;
  browser = await chromium.launch({
    executablePath:
      process.env.CHROME_PATH ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  await mkdir(".impeccable/review", { recursive: true });
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 950 } }),
      errors = [],
      unexpected = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => {
      if (
        !r.url().startsWith(app.url + "/") ||
        new URL(r.url()).pathname.startsWith("/api")
      )
        unexpected.push(r.url());
    });
    await page.goto(app.url);
    await page
      .getByRole("button", { name: "Use temporary session", exact: true })
      .click();
    await page
      .getByRole("heading", { name: "Token Trending", exact: true })
      .waitFor();
    assert.equal(
      await page.locator(".console-groups button").count(),
      categories.length + 1,
    );
    const rail = page.locator(".skill-rail");
    const openRail = async () => {
      if (!(await rail.evaluate((el) => el.open)))
        await rail.locator("summary").click();
    };
    for (const category of categories) {
      const filter = page.locator(`[data-category="${category.id}"]`);
      assert.equal(
        (await filter.innerText()).replace(/\s+/g, ""),
        (category.title + category.skill_count).replace(/\s+/g, ""),
      );
      await filter.click();
      await openRail();
      const filtered = (
        await (
          await fetch(apiOrigin + "/agent/api/skills?category=" + category.id)
        ).json()
      ).data.list;
      assert.equal(filtered.length, category.skill_count);
      const titles = await page
        .locator(".skill-card")
        .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("aria-label")));
      assert.deepEqual(
        titles,
        filtered.map((s) => s.title),
      );
      assert.equal(await filter.getAttribute("aria-pressed"), "true");
      const selectedTitle = await page
        .locator(".skill-card.selected")
        .getAttribute("aria-label");
      assert.ok(filtered.some((s) => s.title === selectedTitle));
    }
    await page.locator('[data-category="all"]').click();
    await openRail();
    assert.equal(await page.locator(".skill-card").count(), skills.length);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.screenshot({
      path: `.impeccable/review/skill-categories-${width}.png`,
    });
    assert.deepEqual(errors, []);
    assert.deepEqual(unexpected, []);
    await page.close();
    const linked = await browser.newPage({ viewport: { width, height: 950 } });
    const wallet = skills.find((skill) => skill.category === "wallet");
    await linked.goto(apiOrigin + "/" + wallet.id);
    await linked
      .getByRole("button", { name: "Use temporary session", exact: true })
      .click();
    await linked
      .getByRole("heading", { name: wallet.title, exact: true })
      .waitFor();
    assert.equal(
      await linked
        .locator('[data-category="wallet"]')
        .getAttribute("aria-pressed"),
      "true",
    );
    assert.equal(
      await linked.locator(".skill-card.selected").getAttribute("aria-label"),
      wallet.title,
    );
    await linked.close();
  }
  console.log(
    "Demo filters match live local agent API category labels, counts and skill membership on desktop/mobile; no browser API requests.",
  );
} finally {
  await browser?.close();
  await app.close();
  await new Promise((done) => {
    api.close(done);
    api.closeAllConnections();
  });
}
