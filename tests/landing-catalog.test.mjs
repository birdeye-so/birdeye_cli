import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createCatalog, destination } from '../scripts/sync-landing-catalog.mjs';

test('landing exposes one skill list with descriptions and usage instructions', async () => {
  const catalog = await createCatalog();
  assert.equal(catalog.schemaVersion, 3);
  assert.equal(catalog.skills.length, 23);
  assert.ok(!('workflows' in catalog));
  for (const skill of catalog.skills) {
    assert.ok(catalog.categories.some(item => item.id === skill.category));
    assert.ok(catalog.documents[skill.source]);
    assert.ok(skill.description && skill.usage.instructions && skill.usage.result);
    assert.match(skill.usage.preview_command, /--estimate-cu$/);
    assert.ok(!('steps' in skill));
  }
  assert.match(catalog.skills.find(item => item.id === 'token-research').usage.run_command, /--address <SOLANA_ADDRESS>/);
  assert.match(catalog.skills.find(item => item.id === 'skill-smart-money-leaderboard').usage.run_command, /--wallets/);
  assert.match(catalog.documents['docs/INSTALLATION.md'], /npm install --global/);
});

test('catalog revision is deterministic and the checked-in snapshot matches source', async () => {
  const current = await createCatalog();
  const next = await createCatalog();
  assert.equal(current.revision, next.revision);
  const snapshot = JSON.parse(await readFile(destination, 'utf8'));
  assert.equal(snapshot.revision, current.revision, 'Run npm run landing:sync after updating skills/workflows');
  assert.ok(!Object.values(current.documents).some(text => text.startsWith('---\nname:')));
});

test('source watcher regenerates JSON and preserves the last valid snapshot on invalid edits', async () => {
  const {mkdtemp, cp, mkdir, symlink, writeFile, rm} = await import('node:fs/promises');
  const {tmpdir} = await import('node:os');
  const {resolve} = await import('node:path');
  const {spawn} = await import('node:child_process');
  const {setTimeout: delay} = await import('node:timers/promises');
  const fixture = await mkdtemp(resolve(tmpdir(), 'landing-watch-'));
  let child;
  try {
    for (const directory of ['src', 'skills', 'docs', 'catalog']) await cp(directory, resolve(fixture, directory), {recursive: true});
    await mkdir(resolve(fixture, 'scripts'), {recursive: true});
    await mkdir(resolve(fixture, 'apps/landing'), {recursive: true});
    await cp('scripts/lib', resolve(fixture, 'scripts/lib'), {recursive: true});
    await cp('scripts/sync-landing-catalog.mjs', resolve(fixture, 'scripts/sync-landing-catalog.mjs'));
    await cp('package.json', resolve(fixture, 'package.json'));
    await cp('apps/landing/catalog.config.json', resolve(fixture, 'apps/landing/catalog.config.json'));
    await symlink(resolve('node_modules'), resolve(fixture, 'node_modules'), 'dir');
    const output = resolve(fixture, 'apps/landing/public/catalog.json');
    let log = '';
    child = spawn(process.execPath, ['scripts/sync-landing-catalog.mjs', '--watch'], {cwd: fixture, stdio: ['ignore', 'pipe', 'pipe']});
    child.stdout.on('data', data => {log += data;});
    child.stderr.on('data', data => {log += data;});
    async function until(check) {
      for (let i = 0; i < 40; i++) {try {if (await check()) return;} catch {} await delay(200);}
      assert.fail(`Watcher did not update: ${log}`);
    }
    await until(async () => JSON.parse(await readFile(output, 'utf8')).revision);
    // Allow the watcher to establish its initial fingerprint before editing.
    await delay(300);
    const source = resolve(fixture, 'src/workflows/token-research/definition.ts');
    await writeFile(source, (await readFile(source, 'utf8')).replace('Token Research', 'Token Research updated'));
    await until(async () => JSON.parse(await readFile(output, 'utf8')).skills.find(item => item.id === 'token-research').title === 'Token Research updated');
    const before = await readFile(output, 'utf8');
    await writeFile(resolve(fixture, 'apps/landing/catalog.config.json'), '{broken');
    await until(async () => log.includes('keeping the last valid catalog'));
    assert.equal(await readFile(output, 'utf8'), before);
  } finally {
    if (child && child.exitCode === null) {child.kill('SIGTERM'); await new Promise(resolve => child.once('exit', resolve));}
    await rm(fixture, {recursive: true, force: true});
  }
});
