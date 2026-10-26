import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';

const { values } = parseArgs({ options: {
  base: { type: 'string' }, release: { type: 'boolean', default: false },
} });
try {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
  const cli = readFileSync('src/index.ts', 'utf8').match(/\.version\("([^"]+)"\)/)?.[1];
  assert.equal(lock.version, pkg.version, 'Lockfile version differs from package.json');
  assert.equal(lock.packages[''].version, pkg.version, 'Root lockfile package version differs');
  assert.equal(cli, pkg.version, 'Update src/index.ts CLI version alongside package.json');
  const changelog = readFileSync('CHANGELOG.md', 'utf8');
  const sections = [...changelog.matchAll(/^## (.+)\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)];
  const unreleased = sections.filter(section => section[1] === '[Unreleased]');
  assert.equal(unreleased.length, 1, 'Keep exactly one ## [Unreleased] section');
  const releases = sections.filter(section => /^\[\d+\.\d+\.\d+\] - \d{4}-\d{2}-\d{2}$/.test(section[1]));
  assert.equal(new Set(releases.map(section => section[1].split(' ')[0])).size, releases.length, 'Duplicate release version');
  const current = releases.find(section => section[1].startsWith(`[${pkg.version}] - `));
  const hasEntry = body => /^### (Added|Changed|Deprecated|Removed|Fixed|Security)\r?\n[\s\S]*?^- \S/m.test(body);
  assert.ok(hasEntry(unreleased[0][2]) || (current && hasEntry(current[2])), 'Add categorized changelog entries for the current work/version');
  for (const release of releases) {
    const date = release[1].split(' - ')[1];
    const parsed = new Date(`${date}T00:00:00Z`);
    assert.ok(Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date, 'Invalid release date');
    assert.ok(hasEntry(release[2]), 'Each release needs categorized entries');
  }
  if (values.release) {
    assert.ok(current, `Add ## [${pkg.version}] - YYYY-MM-DD before releasing`);
    assert.ok(!/^- \S/m.test(unreleased[0][2]), 'Move Unreleased entries into the release section');
    assert.ok(existsSync('LICENSE') && pkg.license, 'A release needs a LICENSE and package license metadata');
    if (process.env.GITHUB_REF_TYPE === 'tag') {
      assert.equal(process.env.GITHUB_REF_NAME, `v${pkg.version}`, 'Tag and package version differ');
    }
  }
  if (values.base && !/^0+$/.test(values.base)) {
    // Only committed paths, as checked out by CI. Never interpolate a ref into a shell.
    execFileSync('git', ['rev-parse', '--verify', '--end-of-options', `${values.base}^{commit}`], { stdio: 'pipe' });
    const changed = execFileSync('git', ['diff', '--name-only', '-z', values.base, 'HEAD', '--'], { encoding: 'utf8' }).split('\0').filter(Boolean);
    if (changed.some(path => path !== 'CHANGELOG.md')) {
      assert.ok(changed.includes('CHANGELOG.md'), 'Every update must edit CHANGELOG.md in the same PR/push');
    }
  }
  console.log(`Changelog and versions OK (${pkg.version}${values.release ? ', release' : ''}).`);
} catch (error) {
  console.error(`Changelog check failed: ${error.message}`);
  process.exitCode = 1;
}
