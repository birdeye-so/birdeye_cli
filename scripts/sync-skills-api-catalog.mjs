import { writeFile, rename } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createCatalog, root } from './sync-landing-catalog.mjs';

const catalog = await createCatalog();
const skills = catalog.workflows.map(({id, title, category, description, source}) => ({id, title, category, description, source}));
const destination = resolve(root, 'apps/skills-api/catalog.json');
const temporary = `${destination}.${process.pid}.tmp`;
await writeFile(temporary, JSON.stringify({categories: catalog.categories, skills}, null, 2) + '\n');
await rename(temporary, destination);
console.log(`Skills API catalog: ${skills.length} workflows`);
