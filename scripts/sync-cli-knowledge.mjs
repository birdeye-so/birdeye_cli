import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const target = join(project, 'knowledge/birdeye');
const manifestFile = join(target, 'manifest.json');
const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
const digest = body => createHash('sha256').update(body).digest('hex');

// This subtree is generated. Private research copies must never survive an update.
rmSync(join(target, 'cli'), { recursive: true, force: true });
manifest.entries = manifest.entries.filter(entry => !entry.id.startsWith('cli/'));
function add(path) {
  const body = readFileSync(join(project, path), 'utf8');
  const id = `cli/${path}`;
  const title = (body.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1]
    || body.match(/^# (.+)$/m)?.[1] || path.split('/').at(-1)).replace(/["']$/g, '');
  mkdirSync(dirname(join(target, id)), { recursive: true });
  writeFileSync(join(target, id), body);
  manifest.entries.push({ id, title, source: `cli:${path}`, sha256: digest(body), sourceSha256: digest(body) });
}
function directory(path) {
  for (const entry of readdirSync(join(project, path), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    if (entry.name.startsWith('.')) continue;
    const child = `${path}/${entry.name}`;
    if (entry.isDirectory()) directory(child);
    else if (entry.isFile() && entry.name.endsWith('.md')) add(child);
  }
}
for (const path of ['README.md', 'README.vi.md', 'docs/INSTALLATION.md', 'docs/USAGE.md']) add(path);
for (const path of ['docs/workflows', 'skills']) directory(path);
// Preserve provider provenance and timestamp; this operation only updates CLI docs.
writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Synced ${manifest.entries.filter(entry => entry.id.startsWith('cli/')).length} public CLI documents; provider snapshot unchanged.`);
