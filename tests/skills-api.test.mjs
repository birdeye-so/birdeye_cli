import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';

async function bundle(entry, outfile) {
  await build({entryPoints: [entry], outfile, bundle: true, platform: 'node', format: 'esm', logLevel: 'silent'});
  return import(pathToFileURL(outfile).href);
}

test('skill API filters catalog, persists independent counters, and rejects invalid writes', async () => {
  const directory = await mkdtemp(resolve(tmpdir(), 'skill-api-'));
  const previousDb = process.env.SKILL_STATS_DB_PATH;
  const previousCatalog = process.env.SKILL_CATALOG_PATH;
  process.env.SKILL_STATS_DB_PATH = resolve(directory, 'stats.sqlite');
  process.env.SKILL_CATALOG_PATH = resolve('apps/skills-api/catalog.json');
  try {
    const {listSkills: GET, recordSkillAction} = await bundle('apps/skills-api/src/api.ts', resolve(directory, 'api.mjs'));
    const view = {POST: request => recordSkillAction(request, 'view')};
    const download = {POST: request => recordSkillAction(request, 'download')};
    const stat = {POST: request => recordSkillAction(request)};
    const get = (query = '') => GET(new Request(`http://localhost/api/skills${query}`));
    const post = (route, body) => route.POST(new Request('http://localhost/api/skills/stat', {
      method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify(body),
    }));
    const first = await get();
    assert.match(first.headers.get('cache-control'), /no-store/);
    const initial = (await first.json()).data.list;
    assert.ok(initial.length > 0);
    assert.ok(initial.every(skill => skill.view_count === 0 && skill.download_count === 0));
    const id = initial[0].skill_id;
    const filtered = (await (await get('?category=token')).json()).data.list;
    assert.deepEqual(filtered.map(skill => skill.id), initial.filter(skill => skill.category === 'token').map(skill => skill.id));
    assert.equal((await get('?category=unknown')).status, 400);
    assert.deepEqual((await (await get('?category=guides')).json()).data.list, []);
    assert.deepEqual(await (await post(view, {skill_id: id})).json(), {code: 0, reason: '', message: 'success', data: null});
    assert.equal((await post(download, {skill_id: id})).status, 200);
    assert.equal((await post(stat, {skill_id: id, action: 'view'})).status, 200);
    for (const body of [null, {}, {skill_id: id, action: 'delete'}, {skill_id: 10001, action: 'view'}, {skill_id: id, action: 'view', view_count: 99}]) {
      assert.equal((await post(stat, body)).status, 400);
    }
    assert.equal((await post(view, {skill_id: id, action: 'download'})).status, 400);
    assert.equal((await post(stat, {skill_id: 'missing', action: 'view'})).status, 404);
    assert.equal((await stat.POST(new Request('http://localhost', {method: 'POST', headers: {'content-type': 'application/json'}, body: '{'}))).status, 400);
    assert.equal((await stat.POST(new Request('http://localhost', {method: 'POST', body: '{}'}))).status, 415);
    const final = (await (await get()).json()).data.list;
    assert.equal(final.find(skill => skill.skill_id === id).view_count, 2);
    assert.equal(final.find(skill => skill.skill_id === id).download_count, 1);
    assert.ok(final.filter(skill => skill.skill_id !== id).every(skill => skill.view_count === 0 && skill.download_count === 0));
    process.env.SKILL_STATS_DB_PATH = directory; // Opening a directory must fail, never report success.
    assert.equal((await post(view, {skill_id: id})).status, 503);
    assert.equal((await get()).status, 503);
  } finally {
    for (const [key, value] of Object.entries({SKILL_STATS_DB_PATH: previousDb, SKILL_CATALOG_PATH: previousCatalog})) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
    await rm(directory, {recursive: true, force: true});
  }
});

test('SQLite increments are atomic across competing processes and survive reopening', async () => {
  const directory = await mkdtemp(resolve(tmpdir(), 'skill-concurrency-'));
  try {
    const modulePath = resolve(directory, 'store.mjs');
    const {openSkillStats} = await bundle('apps/skills-api/src/store.ts', modulePath);
    const dbPath = resolve(directory, 'stats.sqlite');
    const worker = resolve(directory, 'worker.mjs');
    await writeFile(worker, `import {openSkillStats} from './store.mjs';
      const store = openSkillStats(process.argv[2]);
      try { for (let i = 0; i < 200; i++) {
        store.increment('birdeye-token', 'view');
        store.increment('birdeye-token', 'download');
        store.increment('birdeye-market', 'view');
      }} finally {store.close();}`);
    await Promise.all(Array.from({length: 6}, () => new Promise((done, fail) => {
      const child = spawn(process.execPath, [worker, dbPath], {stdio: ['ignore', 'ignore', 'pipe']});
      let error = '';
      child.stderr.on('data', chunk => {error += chunk;});
      child.on('error', fail);
      child.on('exit', code => code === 0 ? done() : fail(new Error(error)));
    })));
    const store = openSkillStats(dbPath);
    try {
      assert.deepEqual(store.list().map(row => ({...row})).sort((a, b) => a.skill_id.localeCompare(b.skill_id)), [
        {skill_id: 'birdeye-market', view_count: 1200, download_count: 0},
        {skill_id: 'birdeye-token', view_count: 1200, download_count: 1200},
      ]);
    } finally {store.close();}
  } finally {await rm(directory, {recursive: true, force: true});}
});

test('standalone HTTP server exposes routes, CORS preflight, and bounded request bodies', async () => {
  const directory = await mkdtemp(resolve(tmpdir(), 'skill-http-'));
  const previousCatalog = process.env.SKILL_CATALOG_PATH;
  const previousDb = process.env.SKILL_STATS_DB_PATH;
  process.env.SKILL_CATALOG_PATH = resolve('apps/skills-api/catalog.json');
  process.env.SKILL_STATS_DB_PATH = resolve(directory, 'stats.sqlite');
  let server;
  try {
    const {createSkillServer} = await bundle('apps/skills-api/src/server.ts', resolve(directory, 'server.mjs'));
    server = createSkillServer({corsOrigins: ['https://consumer.example']});
    await new Promise((done, fail) => {server.once('error', fail); server.listen(0, '127.0.0.1', done);});
    const base = `http://127.0.0.1:${server.address().port}`;
    const health = await fetch(`${base}/healthz`);
    assert.deepEqual(await health.json(), {status: 'ok'});
    const preflight = await fetch(`${base}/api/skills/view`, {method: 'OPTIONS', headers: {Origin: 'https://consumer.example', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type'}});
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get('access-control-allow-origin'), 'https://consumer.example');
    assert.match(preflight.headers.get('access-control-allow-methods'), /POST/);
    assert.equal(preflight.headers.get('access-control-allow-headers'), 'Content-Type');
    assert.equal((await fetch(`${base}/api/skills`, {headers: {Origin: 'https://blocked.example'}})).status, 403);
    assert.equal((await fetch(`${base}/unknown`)).status, 404);
    const wrongMethod = await fetch(`${base}/api/skills/view`);
    assert.equal(wrongMethod.status, 405);
    assert.equal(wrongMethod.headers.get('allow'), 'POST, OPTIONS');
    const post = (path, body) => fetch(`${base}${path}`, {method: 'POST', headers: {'Content-Type': 'application/json', Origin: 'https://consumer.example'}, body: JSON.stringify(body)});
    for (const path of ['/api/skills/view', '/api/skills/download', '/api/skills/stat']) {
      const response = await post(path, {skill_id: 'birdeye-token', ...(path.endsWith('/stat') ? {action: 'view'} : {})});
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('access-control-allow-origin'), 'https://consumer.example');
    }
    assert.equal((await post('/api/skills/view', {skill_id: 'x'.repeat(9000)})).status, 413);
    const response = await fetch(`${base}/api/skills?category=token`);
    const skill = (await response.json()).data.list.find(item => item.skill_id === 'birdeye-token');
    assert.equal(skill.view_count, 2);
    assert.equal(skill.download_count, 1);
  } finally {
    if (server?.listening) await new Promise(done => {server.close(done); server.closeAllConnections();});
    if (previousCatalog === undefined) delete process.env.SKILL_CATALOG_PATH; else process.env.SKILL_CATALOG_PATH = previousCatalog;
    if (previousDb === undefined) delete process.env.SKILL_STATS_DB_PATH; else process.env.SKILL_STATS_DB_PATH = previousDb;
    await rm(directory, {recursive: true, force: true});
  }
});
