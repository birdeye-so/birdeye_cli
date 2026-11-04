import { readFile, writeFile, rename } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createResourceCatalog, root } from './lib/catalog.mjs';
import { syncSkillPackages } from './lib/skill-packages.mjs';
import {loadSkillRuntime} from './lib/skill-runtime.mjs';
import {skillDetails} from './lib/skill-details.mjs';

await syncSkillPackages();
const {categories, skills} = await createResourceCatalog();
const runtime = await loadSkillRuntime();
const definitions = new Map(runtime.workflowCatalog().map(item => [item.kind, item]));
const destination = resolve(root, 'apps/skills-api/catalog.json');
const temporary = `${destination}.${process.pid}.tmp`;
await writeFile(temporary, JSON.stringify({schemaVersion: 4, categories, skills: skills.map(({source, ...skill}) => ({...skill, detail: skillDetails(definitions.get(skill.id), runtime)}))}, null, 2) + '\n');
await rename(temporary, destination);
await writeFile(resolve(root, 'apps/skills-api/src/skill-identity.ts'),
  '// Generated from src/skill-identity.ts by skills-api:sync. Do not edit.\n' + await readFile(resolve(root, 'src/skill-identity.ts'), 'utf8'));
console.log(`Agent catalog: ${skills.length} skills with usage instructions`);
