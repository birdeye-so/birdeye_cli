import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright-core';
import {setTimeout as delay} from 'node:timers/promises';
const prefix = process.env.NEXT_PUBLIC_BASE_PATH || '';
const origin = 'http://127.0.0.1:3119';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3119'], {cwd:'apps/landing', env:process.env, stdio:['ignore','pipe','pipe']});
let logs = ''; server.stdout.on('data', c => logs += c); server.stderr.on('data', c => logs += c);
let browser;
try {
  for (let i=0; i<60; i++) {if(server.exitCode !== null) throw Error(logs); try {await fetch(origin + prefix); break;} catch {} await delay(200);}
  const response = await fetch(origin + (prefix || '/'));
  assert.equal(response.status, 200, `Landing must be served at ${prefix || '/'}`);
  browser = await chromium.launch({executablePath:process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
  const page = await browser.newPage();
  const failures = [], requests = [], errors = [];
  page.on('response', r => {if(r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);});
  page.on('request', r => requests.push(r.url()));
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(origin + (prefix || '/'));
  await page.getByRole('heading',{name:'See the research unfold.'}).waitFor();
  await page.waitForResponse(r => r.url() === origin + prefix + '/api/catalog');
  assert.ok(requests.some(url => url.includes(prefix + '/_next/') && url.includes('.css')), 'CSS must use the configured base path');
  assert.equal(await page.getByRole('link',{name:'Download HTML'}).getAttribute('href'), prefix + '/demo.html');
  for (const route of ['/api/catalog','/demo.html','/embed']) assert.equal((await fetch(origin + prefix + route)).status,200,route);
  assert.deepEqual(failures, []); assert.deepEqual(errors, []);
  console.log(`Base path ${prefix || '/'} passed: page, CSS/JS, catalog polling, demo download, embed.`);
} finally {await browser?.close(); server.kill('SIGTERM');}
