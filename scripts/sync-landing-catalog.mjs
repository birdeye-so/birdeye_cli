import { createHash } from 'node:crypto';
import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { z } from 'zod';
import { root, sourceFiles, createResourceCatalog } from './lib/catalog.mjs';
import { syncSkillPackages } from './lib/skill-packages.mjs';
export { root, sourceFiles };
export const destination = resolve(root, 'apps/landing/public/catalog.json');
const configSchema = z.object({
  schemaVersion: z.literal(1),
  site: z.object({name: z.string().min(1), headline: z.string().min(1), description: z.string().min(1)}),
  skills: z.object({overrides: z.record(z.string(), z.object({featured: z.boolean().optional()}).strict())}).strict(),
}).strict();
export async function sourceFingerprint() {
  const files = [resolve(root, 'apps/landing/catalog.config.json'), resolve(root, 'package.json'), ...(await sourceFiles(resolve(root, 'catalog'))), ...(await sourceFiles(resolve(root, 'src'))), ...(await sourceFiles(resolve(root, 'skills'))), ...(await sourceFiles(resolve(root, 'docs')))];
  const hash = createHash('sha256');
  for (const file of files.sort()) {hash.update(file); hash.update(await readFile(file));}
  return hash.digest('hex');
}
export async function createCatalog() {
  const config = configSchema.parse(JSON.parse(await readFile(resolve(root, 'apps/landing/catalog.config.json'), 'utf8')));
  const resources = await createResourceCatalog();
  for (const id of Object.keys(config.skills.overrides)) if (!resources.skills.some(item => item.id === id)) throw new Error(`Unknown skill override: ${id}`);
  const data = {...resources, site: config.site, skills: resources.skills.map(item => ({...item, featured: false, ...config.skills.overrides[item.id]}))};
  const revision = createHash('sha256').update(JSON.stringify(data)).digest('hex').slice(0,16);
  return {...data, revision, updatedAt: new Date().toISOString()};
}
export async function syncCatalog() {
  await syncSkillPackages();
  const catalog = await createCatalog();
  try {if (JSON.parse(await readFile(destination, 'utf8')).revision === catalog.revision) return false;} catch {}
  await mkdir(dirname(destination), {recursive: true});
  const temporary = `${destination}.${process.pid}.tmp`;
  await writeFile(temporary, JSON.stringify(catalog, null, 2) + '\n');
  await rename(temporary, destination);
  console.log(`Landing catalog: ${catalog.skills.length} skills (${catalog.revision})`);
  return true;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await syncCatalog();
  if (process.argv.includes('--watch')) {
    let previous = await sourceFingerprint();
    let busy = false;
    setInterval(async () => {
      if (busy) return;
      busy = true;
      try {
        const current = await sourceFingerprint();
        if (current !== previous) {await syncCatalog(); previous = current;}
      } catch (error) {console.error('Catalog update failed; keeping the last valid catalog:', error.message);}
      finally {busy = false;}
    }, 1000);
  }
}
