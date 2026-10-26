import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync, spawn } from 'node:child_process';
import { isPrivatePath } from './public-files.mjs';

const root = process.cwd();
const address = 'So11111111111111111111111111111111111111112';
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const work = mkdtempSync(join(tmpdir(), 'birdeye-package-'));
const prefix = join(work, 'prefix');
const env = { ...process.env, BIRDEYE_CONFIG_DIR: join(work, 'config') };
delete env.BIRDEYE_API_KEY;
delete env.BIRDEYE_AI_API_KEY;
delete env.NODE_PATH;
let server;
let closed;
const run = (command, args, cwd = work) => execFileSync(command, args, {
  cwd, env, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', timeout: 120_000, maxBuffer: 16 * 1024 * 1024,
});
try {
  mkdirSync(prefix);
  // Build is the npm script's preceding step; pack exactly that output.
  const [archive] = JSON.parse(run('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', work], root));
  const files = new Set(archive.files.map(file => file.path));
  for (const required of ['dist/index.js', 'dist/web/main.js', 'dist/web/index.html',
    'skills/token-duediligence/token-dd-score.mjs', 'knowledge/birdeye/manifest.json',
    'README.md', 'README.vi.md', 'CHANGELOG.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md',
    'docs/INSTALLATION.md', 'docs/USAGE.md']) {
    assert.ok(files.has(required), `Missing package asset: ${required}`);
  }
  for (const path of files) {
    assert.ok(!isPrivatePath(path), `Private file must not be packaged: ${path}`);
    assert.ok(!/(^|\/)(\.env(?:\..*)?|\.DS_Store|internaldocs|node_modules|\.git)(\/|$)|\.(swp|sqlite(?:-wal|-shm)?|pem|key)$/.test(path), `Unexpected package file: ${path}`);
  }
  run('npm', ['install', '--global', '--prefix', prefix, '--omit=dev', '--ignore-scripts', '--no-audit', '--no-fund', join(work, archive.filename)]);
  const cli = join(prefix, 'bin', 'birdeye-cli');
  const score = join(prefix, 'bin', 'token-dd-score');
  assert.ok(existsSync(cli) && existsSync(score), 'npm must create both executable links');
  assert.equal(run(cli, ['--version']).trim(), pkg.version);
  assert.match(run(cli, ['--help']), /Usage: birdeye-cli/);
  assert.match(run(score, ['--help']), /Usage: token-dd-score/);
  assert.equal(JSON.parse(run(cli, ['config', 'show', '--short'])).birdeyeConfigured, false);
  const estimate = JSON.parse(run(cli, ['token', 'price', address, '--estimate-cu']));
  assert.equal(estimate.estimatedCu, 3);
  assert.match(run(cli, ['knowledge', 'search', 'token', '--short']), /source/);
  assert.ok(JSON.parse(run(score, [address, '--estimate-cu', '--format', 'json'])));

  server = spawn(cli, ['--format', 'interface', '--bind', '127.0.0.1:0'], { cwd: work, env, stdio: ['ignore', 'pipe', 'pipe'] });
  closed = new Promise(resolve => server.once('close', resolve));
  const url = await new Promise((resolveUrl, reject) => {
    let output = '';
    const timer = setTimeout(() => reject(new Error('Installed UI did not start within 15s')), 15_000);
    server.once('error', error => { clearTimeout(timer); reject(error); });
    server.once('exit', code => { clearTimeout(timer); reject(new Error(`Installed UI exited (${code})`)); });
    server.stderr.on('data', () => {}); // Consume warnings without logging connection credentials.
    server.stdout.on('data', chunk => {
      output += chunk;
      const match = output.match(/Birdeye interface: (http:\/\/127\.0\.0\.1:\d+)/);
      if (match) { clearTimeout(timer); resolveUrl(match[1]); }
    });
  });
  const get = path => fetch(`${url}${path}`, { signal: AbortSignal.timeout(5000) });
  const page = await get('/');
  assert.equal(page.status, 200);
  assert.match(await page.text(), /main\.js/);
  const asset = await get('/main.js');
  assert.equal(asset.status, 200);
  assert.ok((await asset.text()).length > 1000, 'Built web bundle must be present');
  assert.equal((await get('/api/status')).status, 401);
  const login = await fetch(`${url}/api/connect`, {
    method: 'POST', signal: AbortSignal.timeout(5000),
    headers: { 'Content-Type': 'application/json', Origin: url, 'Sec-Fetch-Site': 'same-origin' },
    body: JSON.stringify({ local: true }),
  });
  assert.equal(login.status, 200);
  const status = await fetch(`${url}/api/status`, {
    signal: AbortSignal.timeout(5000), headers: { Cookie: login.headers.get('set-cookie').split(';')[0] },
  });
  assert.equal(status.status, 200);
  console.log(`Package smoke passed: ${archive.filename}, ${files.size} files, ${archive.size} bytes; installed CLI, offline data and HTTP UI verified.`);
} finally {
  if (server && server.exitCode === null && server.signalCode === null) {
    server.kill('SIGTERM');
    const force = setTimeout(() => server.kill('SIGKILL'), 5000);
    await closed;
    clearTimeout(force);
  }
  rmSync(work, { recursive: true, force: true });
}
