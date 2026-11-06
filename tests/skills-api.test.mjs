import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtemp, rm, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import { createResourceCatalog } from '../scripts/lib/catalog.mjs';
import {loadSkillRuntime} from '../scripts/lib/skill-runtime.mjs';
import {skillDetails} from '../scripts/lib/skill-details.mjs';
import {readSkillContent, validateSkillContent} from '../scripts/lib/skill-content.mjs';
import { DatabaseSync } from 'node:sqlite';

test('bundled API catalog exposes current skills with complete detail content', async () => {
  const current = await createResourceCatalog();
  const bundled = JSON.parse(await readFile('apps/skills-api/catalog.json', 'utf8'));
  assert.deepEqual(bundled.categories, current.categories);
  assert.equal(bundled.schemaVersion, 4);
  assert.equal(await readFile('apps/skills-api/src/skill-identity.ts', 'utf8'), '// Generated from src/skill-identity.ts by skills-api:sync. Do not edit.\n' + await readFile('src/skill-identity.ts', 'utf8'));
  assert.deepEqual(bundled.skills.map(({detail, ...skill}) => skill), current.skills.map(({source, ...skill}) => skill));
  assert.equal(bundled.skills.length, 20);
  assert.ok(!('workflows' in bundled));
  assert.ok(bundled.skills.every(skill => skill.usage.run_command && !('steps' in skill) && !('related_skill_ids' in skill)));
  const runtime = await loadSkillRuntime();
  const definitions = new Map(runtime.workflowCatalog().map(item => [item.kind, item]));
  const content = readSkillContent();
  assert.deepEqual(Object.keys(content).sort(), bundled.skills.map(skill => skill.id).sort());
  validateSkillContent(runtime.workflowCatalog().filter(item => item.family !== 'legacy'));
  assert.throws(() => validateSkillContent(runtime.workflowCatalog().filter(item => item.family !== 'legacy').map(item => ({...item, supportedChains: ['unsupported']}))), /do not match implemented chains/);
  for (const skill of bundled.skills) {
    assert.equal(skill.description, content[skill.id].description);
    for (const useCase of content[skill.id].use_cases) assert.ok(skill.usage.instructions.includes(useCase));
    const markdown = await readFile(`skills/${skill.id}/SKILL.md`, 'utf8');
    assert.ok(markdown.includes(content[skill.id].description));
    for (const limit of content[skill.id].limitations) assert.ok(markdown.includes(limit));
  }
  for (const {id, detail} of bundled.skills) {
    assert.deepEqual(detail, JSON.parse(JSON.stringify(skillDetails(definitions.get(id), runtime))), `Stale detail: ${id}`);
    assert.ok(detail.core_capabilities.length > 0, id);
    assert.equal(detail.just_say_to_your_agent.length, 3, id);
    assert.ok(detail.cli_parameters.length > 0, id);
    assert.equal(new Set(detail.cli_parameters.map(row => row.param)).size, detail.cli_parameters.length, id);
    for (const row of detail.cli_parameters) {
      assert.equal(typeof row.required, 'boolean');
      assert.ok(row.values && Object.hasOwn(row, 'default'));
    }
    assert.equal(detail.sample_output.kind, 'estimate');
    assert.match(detail.sample_output.command, /--estimate-cu/);
    assert.ok(detail.sample_output.output.estimatedCu > 0, id);
    for (const key of ['use_cases', 'core_capabilities', 'just_say_to_your_agent', 'supported_chains', 'limitations'])
      assert.deepEqual(detail[key], content[id][key], `${id}/${key}`);
    assert.deepEqual(detail.sample_output.example, content[id].sample_output);
    assert.equal(detail.sample_output.example.kind, 'illustrative');
  }
  const params = id => new Map(bundled.skills.find(skill => skill.id === id).detail.cli_parameters.map(row => [row.param, row]));
  assert.equal(params('skill-token-dd-score').get('--dd-mode').default, 'advanced');
  assert.equal(params('skill-token-dd-score').get('--top-n').default, 50);
  assert.equal(params('skill-token-stats').has('--from'), false);
  assert.equal(params('skill-token-security').has('--step-overrides'), false);
  assert.equal(params('skill-wallet-style').get('--duration').values, '7d | 30d');
  assert.equal(params('skill-smart-money-leaderboard').get('--wallets').required, true);
  assert.equal(params('skill-price-surge').get('--limit').default, 10);
  assert.equal(params('skill-price-surge').get('--mode').default, 'standard');
});

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
    const get = (query = '') => GET(new Request(`http://localhost/agent/api/skills${query}`));
    const post = (route, body) => route.POST(new Request('http://localhost/agent/api/skills/stat', {
      method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify(body),
    }));
    const first = await get();
    assert.match(first.headers.get('cache-control'), /no-store/);
    const initial = (await first.json()).data.list;
    assert.ok(initial.length > 0);
    assert.ok(initial.every(skill => skill.view_count === 0 && skill.download_count === 0));
    const id = initial[0].skill_id;
    const filtered = (await (await get('?category=token')).json()).data.list;
    assert.deepEqual(filtered, initial.filter(skill => skill.category === 'token'));
    assert.equal((await get('?category=unknown')).status, 400);
    assert.deepEqual((await (await get('?category=guides')).json()).data.list, []);
    const viewed = await (await post(view, {skill_id: id})).json();
    assert.equal(viewed.code, 0);
    assert.equal(viewed.data.skill_id, id);
    assert.equal(viewed.data.view_count, 1);
    assert.equal(viewed.data.download_count, 0);
    assert.ok(viewed.data.core_capabilities.length);
    assert.deepEqual(viewed.data, {...initial.find(skill => skill.skill_id === id), view_count: 1});
    assert.ok(initial.every(skill => !('detail' in skill) && skill.core_capabilities.length && skill.just_say_to_your_agent.length && skill.cli_parameters.length && skill.sample_output.kind === 'estimate'));
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
    await writeFile(resolve(directory, 'index.html'), '<!doctype html><div id="root"></div>');
    await writeFile(resolve(directory, 'main.js'), '/* demo asset */');
    server = createSkillServer({corsOrigins: ['https://consumer.example'], demoDirectory: directory});
    await new Promise((done, fail) => {server.once('error', fail); server.listen(0, '127.0.0.1', done);});
    const base = `http://127.0.0.1:${server.address().port}`;
    const health = await fetch(`${base}/agent/health`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), {status: 'ok'});
    for (const path of ['/api/skills', '/healthz', '/agent/healthz', '/agent/api/workflows']) {
      assert.equal((await fetch(`${base}${path}`)).status, 404);
    }
    const categoriesResponse = await fetch(`${base}/agent/api/categories`, {headers: {Origin: 'https://consumer.example'}});
    assert.equal(categoriesResponse.status, 200);
    assert.equal(categoriesResponse.headers.get('access-control-allow-origin'), 'https://consumer.example');
    const categories = (await categoriesResponse.json()).data.list;
    const allSkills = (await (await fetch(`${base}/agent/api/skills`)).json()).data.list;
    assert.ok(categories.length > 0);
    assert.deepEqual(categories.map(c => c.id).sort(), [...new Set(allSkills.map(s => s.category))].sort());
    for (const category of categories) {
      const filtered = (await (await fetch(`${base}/agent/api/skills?category=${category.id}`)).json()).data.list;
      assert.equal(category.skill_count, filtered.length);
      assert.ok(category.title && category.description && category.skill_count > 0);
    }
    for (const skill of allSkills) {
      assert.equal(skill.demo_path, `/${skill.skill_id}`);
      const demo = await fetch(`${base}${skill.demo_path}`);
      assert.equal(demo.status, 200);
      assert.match(demo.headers.get('content-type'), /text\/html/);
      assert.match(await demo.text(), /id="root"/);
      const icon = new URL(skill.icon_url);
      assert.equal(icon.origin, 'https://api.iconify.design');
      assert.match(icon.pathname, /^\/lucide\/[a-z0-9-]+\.svg$/);
      assert.equal(icon.searchParams.get('color'), '#00ffa3');
    }
    assert.equal(new Set(allSkills.map(s => s.icon_url)).size, allSkills.length, 'Every current skill has a distinct icon');
    for (const path of ['/agent/api/categories']) {
      assert.equal((await fetch(base + path, {method: 'OPTIONS'})).status, 204);
      assert.equal((await fetch(base + path, {method: 'POST'})).status, 405);
    }
    assert.equal((await fetch(`${base}/skill-token-dd`)).status, 404);
    assert.equal((await fetch(`${base}/daily-brief`)).status, 404);
    assert.equal((await fetch(`${base}/skill-token-dd-score/extra`)).status, 404);
    assert.equal((await fetch(`${base}/skill-token-dd-score`, {method: 'POST'})).status, 405);
    const head = await fetch(`${base}/skill-token-dd-score`, {method: 'HEAD'});
    assert.equal(head.status, 200);
    assert.equal(await head.text(), '');
    const asset = await fetch(`${base}/main.js`);
    assert.equal(asset.status, 200);
    assert.match(asset.headers.get('content-type'), /javascript/);
    assert.equal((await fetch(`${base}/main.css`)).status, 503);
    const preflight = await fetch(`${base}/agent/api/skills/view`, {method: 'OPTIONS', headers: {Origin: 'https://consumer.example', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type'}});
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get('access-control-allow-origin'), 'https://consumer.example');
    assert.match(preflight.headers.get('access-control-allow-methods'), /POST/);
    assert.equal(preflight.headers.get('access-control-allow-headers'), 'Content-Type');
    assert.equal((await fetch(`${base}/agent/api/skills`, {headers: {Origin: 'https://blocked.example'}})).status, 403);
    assert.equal((await fetch(`${base}/unknown`)).status, 404);
    const wrongMethod = await fetch(`${base}/agent/api/skills/view`);
    assert.equal(wrongMethod.status, 405);
    assert.equal(wrongMethod.headers.get('allow'), 'POST, OPTIONS');
    const post = (path, body) => fetch(`${base}${path}`, {method: 'POST', headers: {'Content-Type': 'application/json', Origin: 'https://consumer.example'}, body: JSON.stringify(body)});
    for (const path of ['/agent/api/skills/view', '/agent/api/skills/download', '/agent/api/skills/stat']) {
      const response = await post(path, {skill_id: 'skill-token-dd-score', ...(path.endsWith('/stat') ? {action: 'view'} : {})});
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('access-control-allow-origin'), 'https://consumer.example');
    }
    assert.equal((await post('/agent/api/skills/view', {skill_id: 'x'.repeat(9000)})).status, 413);
    const response = await fetch(`${base}/agent/api/skills?category=token`);
    const skill = (await response.json()).data.list.find(item => item.skill_id === 'skill-token-dd-score');
    assert.equal(skill.view_count, 2);
    assert.equal(skill.download_count, 1);
    assert.equal((await post('/agent/api/skills/view', {workflow_id: 'skill-token-dd-score'})).status, 400);
    assert.equal((await post('/agent/api/skills/view', {skill_id: 'birdeye-token'})).status, 404);
    assert.equal((await post('/agent/api/skills/view', {skill_id: 'skill-token-dd-score'})).status, 200);
    assert.match(skill.usage.install_command, /--skill skill-token-dd-score /);
    const catalog = JSON.parse(await readFile('apps/skills-api/catalog.json', 'utf8'));
    for (const expected of catalog.skills) {
      const response = await post('/agent/api/skills/view', {skill_id: expected.id});
      assert.equal(response.status, 200);
      assert.match(response.headers.get('cache-control'), /no-store/);
      const {data} = await response.json();
      for (const [key, value] of Object.entries(expected.detail)) assert.deepEqual(data[key], value);
      assert.equal(data.skill_id, expected.id);
      assert.deepEqual(data.usage, expected.usage);
      assert.equal(data.demo_path, `/${expected.id}`);
      assert.equal((await fetch(new URL(data.demo_path, base))).status, 200);
      const listed = (await (await fetch(base + '/agent/api/skills')).json()).data.list;
      assert.deepEqual(listed.find(skill => skill.skill_id === expected.id), data, `List must include the complete view data for ${expected.id}`);
      assert.deepEqual((await (await fetch(base + '/agent/api/skills')).json()).data.list, listed, 'Repeated GET must not change counters');
    }
    const downloaded = await (await post('/agent/api/skills/download', {skill_id: skill.skill_id})).json();
    assert.equal(downloaded.code, 0);
    assert.equal(downloaded.data.skill_id, skill.skill_id);
    assert.equal(downloaded.data.demo_path, `/${skill.skill_id}`);
    assert.deepEqual(downloaded.data.usage, skill.usage);
    assert.equal('sample_output' in downloaded.data, false);
    assert.deepEqual(await (await post('/agent/api/skills/stat', {skill_id: skill.skill_id, action: 'view'})).json(),
      {code: 0, reason: '', message: 'success', data: null});
  } finally {
    if (server?.listening) await new Promise(done => {server.close(done); server.closeAllConnections();});
    if (previousCatalog === undefined) delete process.env.SKILL_CATALOG_PATH; else process.env.SKILL_CATALOG_PATH = previousCatalog;
    if (previousDb === undefined) delete process.env.SKILL_STATS_DB_PATH; else process.env.SKILL_STATS_DB_PATH = previousDb;
    await rm(directory, {recursive: true, force: true});
  }
});


test('deployed counters remain intact and a local typed-counter migration is applied once', async () => {
  const directory = await mkdtemp(resolve(tmpdir(), 'skills-upgrade-'));
  try {
    const {openSkillStats} = await bundle('apps/skills-api/src/store.ts', resolve(directory, 'store.mjs'));
    for (const typed of [false, true]) {
      const path = resolve(directory, `${typed}.sqlite`);
      const db = new DatabaseSync(path);
      db.exec(`CREATE TABLE skill_stats (skill_id TEXT PRIMARY KEY, view_count INTEGER NOT NULL, download_count INTEGER NOT NULL) STRICT;
        INSERT INTO skill_stats VALUES ('skill-token-dd-score', 1, 1), ('retired-id', 7, 3);`);
      if (typed) db.exec(`CREATE TABLE resource_stats (resource_type TEXT, resource_id TEXT, view_count INTEGER, download_count INTEGER);
        INSERT INTO resource_stats VALUES ('workflow', 'skill-token-dd-score', 4, 2), ('skill', 'skill-token-dd-score', 1, 1);`);
      db.close();
      for (let i = 0; i < 3; i++) {
        const store = openSkillStats(path);
        try {
          assert.deepEqual({...store.list().find(row => row.skill_id === 'skill-token-dd-score')}, {skill_id: 'skill-token-dd-score', view_count: (typed ? 5 : 1) + i, download_count: typed ? 3 : 1});
          assert.equal(store.list().find(row => row.skill_id === 'retired-id').view_count, 7);
          store.increment('skill-token-dd-score', 'view');
        } finally {store.close();}
      }
    }
  } finally {await rm(directory, {recursive: true, force: true});}
});

test('API and both demo hosts share canonical identities for all current skills and aliases', async () => {
  const directory = await mkdtemp(resolve(tmpdir(), 'skill-identities-'));
  const previousDb = process.env.SKILL_STATS_DB_PATH;
  const previousCatalog = process.env.SKILL_CATALOG_PATH;
  process.env.SKILL_STATS_DB_PATH = resolve(directory, 'stats.sqlite');
  process.env.SKILL_CATALOG_PATH = resolve('apps/skills-api/catalog.json');
  let server, preview;
  try {
    const {createSkillServer} = await bundle('apps/skills-api/src/server.ts', resolve(directory, 'server.mjs'));
    const {startBrowserInterface} = await import('../dist/interface/browser-server.js');
    await writeFile(resolve(directory, 'index.html'), '<!doctype html><div id="root"></div>');
    server = createSkillServer({demoDirectory: directory, demoHost: 'https://support-api.owland.xyz/'});
    await new Promise(done => server.listen(0, '127.0.0.1', done));
    const origin = `http://127.0.0.1:${server.address().port}`;
    preview = await startBrowserInterface('127.0.0.1:0');
    const catalog = JSON.parse(await readFile('apps/skills-api/catalog.json', 'utf8'));
    const post = (action, id) => fetch(`${origin}/agent/api/skills/${action}`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({skill_id: id})});
    for (const skill of catalog.skills) {
      const aliases = [skill.id.slice(6), ...(skill.id === 'skill-price-surge' ? ['price-surge-screen', 'skill-price-surge-screen', 'prige-surge', 'skill-prige-surge', 'prige-surge-screen', 'skill-prige-surge-screen'] : [])];
      for (const id of [...aliases, skill.id]) {
        for (const action of ['view', 'download']) {
          const response = await post(action, id);
          assert.equal(response.status, 200, `${action}: ${id}`);
          const {data} = await response.json();
          assert.equal(data.skill_id, skill.id);
          assert.equal(data.id, skill.id);
          assert.equal(data.demo_path, `/${skill.id}`);
          assert.equal(data.demo_url, `https://support-api.owland.xyz/${skill.id}`);
          assert.deepEqual(data.aliases, aliases);
          assert.equal(data.usage.install_command, skill.usage.install_command);
        }
        for (const host of [origin, preview.listenUrl]) {
          const response = await fetch(`${host}/${id}?from=api`, {redirect: 'manual'});
          assert.equal(response.status, id === skill.id ? 200 : 302, `${host}/${id}`);
          if (id !== skill.id) assert.equal(response.headers.get('location'), `/${skill.id}?from=api`);
        }
      }
      const list = (await (await fetch(origin + '/agent/api/skills')).json()).data.list;
      assert.equal(list.length, 20);
      const counted = list.find(item => item.skill_id === skill.id);
      assert.equal(counted.id, skill.id);
      assert.equal(counted.demo_path, `/${skill.id}`);
      assert.equal(counted.demo_url, `https://support-api.owland.xyz/${skill.id}`);
      assert.equal(counted.view_count, aliases.length + 1);
      assert.equal(counted.download_count, aliases.length + 1);
      assert.deepEqual(counted.aliases, aliases);
    }
    for (const action of ['view', 'download']) assert.equal((await post(action, 'skill-not-real')).status, 404);
    const stat = await fetch(origin + '/agent/api/skills/stat', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({skill_id: 'skill-prige-surge', action: 'view'})});
    assert.equal(stat.status, 200);
    const list = (await (await fetch(origin + '/agent/api/skills')).json()).data.list;
    assert.equal(list.find(item => item.skill_id === 'skill-price-surge').view_count, 9);
  } finally {
    if (server?.listening) await new Promise(done => {server.close(done); server.closeAllConnections();});
    await preview?.close();
    if (previousCatalog === undefined) delete process.env.SKILL_CATALOG_PATH; else process.env.SKILL_CATALOG_PATH = previousCatalog;
    if (previousDb === undefined) delete process.env.SKILL_STATS_DB_PATH; else process.env.SKILL_STATS_DB_PATH = previousDb;
    await rm(directory, {recursive: true, force: true});
  }
});

test('demo host configuration normalizes origins, overrides environment and ignores request headers', async () => {
  const directory = await mkdtemp(resolve(tmpdir(), 'demo-host-'));
  const previous = Object.fromEntries(['SKILL_DEMO_HOST', 'SKILL_CATALOG_PATH', 'SKILL_STATS_DB_PATH'].map(key => [key, process.env[key]]));
  process.env.SKILL_CATALOG_PATH = resolve('apps/skills-api/catalog.json');
  process.env.SKILL_STATS_DB_PATH = resolve(directory, 'stats.sqlite');
  try {
    const {createSkillServer} = await bundle('apps/skills-api/src/server.ts', resolve(directory, 'server.mjs'));
    for (const invalid of ['', 'example.com', 'ftp://example.com', 'https://user:pass@example.com', 'https://example.com/demo', 'https://example.com/?query=1', 'https://example.com/#demo'])
      assert.throws(() => createSkillServer({demoHost: invalid}), /demo-host must be an HTTP\(S\) origin/);
    process.env.SKILL_DEMO_HOST = 'https://from-env.example/';
    for (const [options, expected] of [[{}, 'https://from-env.example'], [{demoHost: 'https://override.example:8443/'}, 'https://override.example:8443'], [{demoHost: 'http://localhost:8787'}, 'http://localhost:8787']]) {
      const server = createSkillServer(options);
      await new Promise(done => server.listen(0, '127.0.0.1', done));
      try {
        const response = await fetch(`http://127.0.0.1:${server.address().port}/agent/api/skills`, {headers: {Host: 'untrusted.example', 'X-Forwarded-Host': 'untrusted.example', 'X-Forwarded-Proto': 'http'}});
        const list = (await response.json()).data.list;
        assert.equal(list.length, 20);
        for (const skill of list) assert.equal(skill.demo_url, expected + skill.demo_path);
      } finally {await new Promise(done => {server.close(done); server.closeAllConnections();});}
    }
    delete process.env.SKILL_DEMO_HOST;
    const server = createSkillServer();
    await new Promise(done => server.listen(0, '127.0.0.1', done));
    try {
      const origin = `http://127.0.0.1:${server.address().port}`;
      const list = (await (await fetch(origin + '/agent/api/skills', {headers: {Host: 'untrusted.example'}})).json()).data.list;
      for (const skill of list) assert.equal(skill.demo_url, origin + skill.demo_path);
    } finally {await new Promise(done => {server.close(done); server.closeAllConnections();});}
  } finally {
    for (const [key, value] of Object.entries(previous)) {if (value === undefined) delete process.env[key]; else process.env[key] = value;}
    await rm(directory, {recursive: true, force: true});
  }
});

for (const portSource of ['argument', 'environment']) test(`Skills API executable accepts ${portSource} port and --demo-host`, async () => {
  const {createServer} = await import('node:net');
  const probe = createServer();
  await new Promise(done => probe.listen(0, '127.0.0.1', done));
  const port = probe.address().port;
  await new Promise(done => probe.close(done));
  const directory = await mkdtemp(resolve(tmpdir(), 'demo-host-cli-'));
  const child = spawn(process.execPath, ['apps/skills-api/dist/index.js', '--demo-host', 'https://support-api.owland.xyz/', ...(portSource === 'argument' ? ['--port', String(port)] : [])], {
    env: {...process.env, SKILL_API_HOST: '127.0.0.1', SKILL_API_PORT: portSource === 'argument' ? 'invalid-overridden-value' : String(port), SKILL_CATALOG_PATH: resolve('apps/skills-api/catalog.json'), SKILL_STATS_DB_PATH: resolve(directory, 'stats.sqlite'), SKILL_DEMO_HOST: 'https://overridden.example'},
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const stopped = new Promise(done => child.once('close', done));
  try {
    await new Promise((done, fail) => {
      let output = '';
      const timer = setTimeout(() => fail(new Error('Skills API startup timeout')), 10000);
      child.stdout.on('data', chunk => {output += chunk; if (output.includes('Skills API listening')) {clearTimeout(timer); done();}});
      child.once('error', error => {clearTimeout(timer); fail(error);});
      child.once('exit', code => {clearTimeout(timer); fail(new Error(`Skills API exited: ${code}`));});
    });
    const origin = `http://127.0.0.1:${port}`;
    const list = (await (await fetch(origin + '/agent/api/skills')).json()).data.list;
    assert.ok(list.every(skill => skill.demo_url === 'https://support-api.owland.xyz' + skill.demo_path));
    for (const action of ['view', 'download']) {
      const response = await fetch(`${origin}/agent/api/skills/${action}`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({skill_id: 'skill-prige-surge-screen'})});
      assert.equal(response.status, 200);
      const {data} = await response.json();
      assert.equal(data.skill_id, 'skill-price-surge');
      assert.equal(data.demo_url, 'https://support-api.owland.xyz/skill-price-surge');
    }
  } finally {child.kill('SIGTERM'); await stopped; await rm(directory, {recursive: true, force: true});}
});
