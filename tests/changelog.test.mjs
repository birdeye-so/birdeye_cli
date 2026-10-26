import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const script = resolve('scripts/check-changelog.mjs');
function fixture() {
  const dir = mkdtempSync(join(tmpdir(), 'birdeye-changelog-'));
  const write = (path, body) => writeFileSync(join(dir, path), body);
  mkdirSync(join(dir, 'src'));
  write('package.json', JSON.stringify({ version: '0.4.1', license: 'MIT' }));
  write('package-lock.json', JSON.stringify({ version: '0.4.1', packages: { '': { version: '0.4.1' } } }));
  write('src/index.ts', '.version("0.4.1")');
  write('LICENSE', 'MIT fixture');
  write('CHANGELOG.md', '# Changelog\n\n## [Unreleased]\n\n### Fixed\n\n- Fix an observable issue.\n');
  const run = (args = [], extraEnv = {}) => spawnSync(process.execPath, [script, ...args], {
    cwd: dir, encoding: 'utf8', env: { ...process.env, GITHUB_REF_TYPE: '', ...extraEnv },
  });
  const git = (...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' }).trim();
  return { dir, write, run, git, close: () => rmSync(dir, { recursive: true, force: true }) };
}

test('changelog rejects version drift and requires dated release notes for tags', () => {
  const f = fixture();
  try {
    assert.equal(f.run().status, 0);
    assert.equal(f.run(['--release']).status, 1, 'Unreleased work is not a release');
    f.write('CHANGELOG.md', '# Changelog\n\n## [Unreleased]\n\n## [0.4.1] - 2026-10-23\n\n### Fixed\n\n- Fix an observable issue.\n');
    assert.equal(f.run(['--release']).status, 0);
    assert.equal(f.run(['--release'], { GITHUB_REF_TYPE: 'tag', GITHUB_REF_NAME: 'v0.4.0' }).status, 1);
    assert.equal(f.run(['--release'], { GITHUB_REF_TYPE: 'tag', GITHUB_REF_NAME: 'v0.4.1' }).status, 0);
    f.write('src/index.ts', '.version("0.4.0")');
    assert.equal(f.run().status, 1, 'CLI must report the installed package version');
  } finally { f.close(); }
});

test('changelog requires an edit in the committed update, including docs-only changes', () => {
  const f = fixture();
  try {
    f.git('init', '--quiet');
    f.git('config', 'user.name', 'Test');
    f.git('config', 'user.email', 'test@example.invalid');
    f.git('config', 'commit.gpgsign', 'false');
    f.git('add', '.');
    f.git('commit', '--quiet', '-m', 'baseline');
    const base = f.git('rev-parse', 'HEAD');
    f.write('README.md', '# Updated instructions\n');
    f.git('add', '.');
    f.git('commit', '--quiet', '-m', 'docs without changelog');
    assert.equal(f.run(['--base', base]).status, 1);
    f.write('CHANGELOG.md', '# Changelog\n\n## [Unreleased]\n\n### Changed\n\n- Clarify installation instructions.\n');
    f.git('add', '.');
    f.git('commit', '--quiet', '-m', 'record user-visible change');
    assert.equal(f.run(['--base', base]).status, 0);
    assert.equal(f.run(['--base', 'missing-ref']).status, 1, 'An invalid base must not bypass enforcement');
  } finally { f.close(); }
});
