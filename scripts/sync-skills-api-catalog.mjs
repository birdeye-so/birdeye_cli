import { writeFile, rename } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createResourceCatalog, root } from './lib/catalog.mjs';
import { syncSkillPackages } from './lib/skill-packages.mjs';

await syncSkillPackages();
const {categories, skills} = await createResourceCatalog();
const destination = resolve(root, 'apps/skills-api/catalog.json');
const temporary = `${destination}.${process.pid}.tmp`;
await writeFile(temporary, JSON.stringify({schemaVersion: 3, categories, skills: skills.map(({source, ...skill}) => skill)}, null, 2) + '\n');
await rename(temporary, destination);
console.log(`Agent catalog: ${skills.length} skills with usage instructions`);
