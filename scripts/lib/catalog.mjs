import {readFile, readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {z} from 'zod';
import {root, skillPackages, syncSkillPackages} from './skill-packages.mjs';
import {loadSkillRuntime, publicSkill} from './skill-runtime.mjs';
export {root};
const slug = z.string().regex(/^[a-z0-9][a-z0-9-]*$/);
const configSchema = z.object({schemaVersion: z.literal(1), categories: z.array(z.object({id: slug, title: z.string(), description: z.string()})).min(1), documents: z.array(z.string().regex(/^docs\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.md$/))}).strict();
export async function sourceFiles(directory) {
  const entries = await readdir(directory, {withFileTypes: true});
  const nested = await Promise.all(entries.map(entry => entry.isDirectory() ? sourceFiles(resolve(directory, entry.name)) : [resolve(directory, entry.name)]));
  return nested.flat().filter(file => /\.(md|ts|json)$/.test(file));
}
export async function createResourceCatalog() {
  const config = configSchema.parse(JSON.parse(await readFile(resolve(root, 'catalog/resources.json'), 'utf8')));
  const categoryIds = new Set(config.categories.map(item => item.id));
  if (categoryIds.size !== config.categories.length) throw new Error('Duplicate category IDs');
  await syncSkillPackages({check: true});
  const packages = new Map((await skillPackages()).map(item => [item.id, item]));
  const {workflowCatalog} = await loadSkillRuntime();
  const skills = workflowCatalog().filter(item => item.family !== "legacy").map(definition => {
    const skill = publicSkill(definition);
    const packaged = packages.get(skill.id);
    if (!packaged || packaged.legacy) throw new Error(`Missing skill package: ${skill.id}`);
    if (!categoryIds.has(skill.category)) throw new Error(`Unknown category: ${skill.category}`);
    return {...skill, source: packaged.source};
  });
  const files = [...skills.map(item => item.source), ...config.documents];
  const documents = Object.fromEntries(await Promise.all(files.map(async file => [file, (await readFile(resolve(root, file), 'utf8')).replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim()])));
  const {version: cliVersion} = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  return {schemaVersion: 3, cliVersion, categories: config.categories, skills, documents};
}
