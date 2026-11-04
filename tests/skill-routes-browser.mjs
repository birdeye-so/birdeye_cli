import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {chromium} from 'playwright-core';
import {createSkillServer} from '../apps/skills-api/dist/server.js';
import {startBrowserInterface} from '../dist/interface/browser-server.js';
import {readCatalog} from '../apps/skills-api/dist/catalog.js';

const server = createSkillServer({demoDirectory: resolve('apps/skills-api/public')});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const preview = await startBrowserInterface('127.0.0.1:0');
let browser;
try {
  browser = await chromium.launch({executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true});
  const catalog = await readCatalog();
  for (const origin of [`http://127.0.0.1:${server.address().port}`, preview.listenUrl]) {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({viewport: {width, height: 950}});
      const errors = [], external = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => {if (!request.url().startsWith(origin)) external.push(request.url());});
      for (const skill of catalog.skills) {
        const response = await page.goto(`${origin}/${skill.id}`);
        assert.equal(response.status(), 200);
        await page.getByRole('button', {name: 'Use temporary session', exact: true}).click();
        await page.getByRole('heading', {name: skill.title, exact: true}).waitFor();
        assert.equal(await page.locator('.skill-card.selected').getAttribute('aria-label'), skill.title);
        assert.equal(await page.locator('.history-item').count(), 0);
        await page.reload();
        await page.getByRole('button', {name: 'Use temporary session', exact: true}).click();
        await page.getByRole('heading', {name: skill.title, exact: true}).waitFor();
      }
      if (origin === preview.listenUrl) {
        for (const path of ['/prige-surge-screen', '/price-surge-screen', '/price-surge', '/skill-price-surge/']) {
          const response = await page.goto(origin + path + '?from=demo');
          assert.equal(response.status(), 200, path);
          assert.equal(new URL(page.url()).pathname, '/skill-price-surge');
          assert.equal(new URL(page.url()).search, '?from=demo');
          await page.getByRole('button', {name: 'Use temporary session', exact: true}).click();
          await page.getByRole('heading', {name: 'Price Surge Screen', exact: true}).waitFor();
          assert.equal(await page.locator('.skill-card.selected').getAttribute('aria-label'), 'Price Surge Screen');
        }
      }
      assert.deepEqual(errors, []);
      assert.deepEqual(external, [], 'Opening demo links must not call external providers');
      console.log(`${origin === preview.listenUrl ? 'Browser preview' : 'Skills API'} ${width}px: all ${catalog.skills.length} skill links select correctly, including reload; no external requests`);
      await page.close();
    }
  }
} finally {
  await browser?.close();
  await preview.close();
  await new Promise(done => {server.close(done); server.closeAllConnections();});
}
