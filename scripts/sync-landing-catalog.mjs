import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile, rename, mkdir } from 'node:fs/promises';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { z } from 'zod';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const destination = resolve(root, 'apps/landing/public/catalog.json');
const slug = z.string().regex(/^[a-z0-9][a-z0-9-]*$/);
const configSchema = z.object({
  schemaVersion: z.literal(1),
  documents: z.array(z.string().regex(/^docs\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.md$/)).default([]),
  site: z.object({name: z.string().min(1), headline: z.string().min(1), description: z.string().min(1)}),
  categories: z.array(z.object({id: slug, title: z.string().min(1), description: z.string()})).min(1),
  skills: z.array(z.object({id: slug, category: slug, file: z.string().min(1)})),
  workflows: z.object({source: z.literal('src/workflows.ts'), overrides: z.record(z.string(), z.object({title: z.string().optional(), category: slug.optional(), featured: z.boolean().optional(), source: z.string().optional()}))}),
});
export async function sourceFiles(directory) {
  const entries = await readdir(directory, {withFileTypes: true});
  const nested = await Promise.all(entries.map(entry => entry.isDirectory() ? sourceFiles(resolve(directory, entry.name)) : [resolve(directory, entry.name)]));
  return nested.flat().filter(file => /\.(md|ts|json)$/.test(file));
}
export async function sourceFingerprint() {
  const files = [resolve(root, 'apps/landing/catalog.config.json'), resolve(root, 'package.json'), ...(await sourceFiles(resolve(root, 'src'))), ...(await sourceFiles(resolve(root, 'skills'))), ...(await sourceFiles(resolve(root, 'docs')))];
  const hash = createHash('sha256');
  for (const file of files.sort()) {hash.update(file); hash.update(await readFile(file));}
  return hash.digest('hex');
}
function stripFrontmatter(text) {return text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim();}
function field(text, name) {return text.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.replace(/^['"]|['"]$/g, '');}
export async function createCatalog() {
  const config = configSchema.parse(JSON.parse(await readFile(resolve(root, 'apps/landing/catalog.config.json'), 'utf8')));
  const categoryIds = new Set(config.categories.map(category => category.id));
  if (categoryIds.size !== config.categories.length) throw new Error('Duplicate category IDs');
  const bundle = await build({stdin: {contents: 'export {workflowCatalog, planCase} from "./src/workflows.ts";', resolveDir: root}, bundle: true, write: false, platform: 'node', format: 'esm', logLevel: 'silent'});
  const {workflowCatalog, planCase} = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
  const rawWorkflows = workflowCatalog();
  for (const id of Object.keys(config.workflows.overrides)) if (!rawWorkflows.some(item => item.kind === id)) throw new Error(`Unknown workflow override: ${id}`);
  const workflows = rawWorkflows.map(item => {
    const input = {kind: item.kind};
    const exampleAddress = 'So11111111111111111111111111111111111111112';
    if (item.subject === 'token' || item.subject === 'wallet') input.address = exampleAddress;
    if (item.subject === 'wallets') input.wallets = [exampleAddress];
    const plan = planCase(input, 1800000000);
    const category = item.group === 'legacy' ? (item.subject === 'token' ? 'token' : ['wallet', 'wallets'].includes(item.subject) || item.kind === 'smart-money-profile' ? 'wallet' : 'discover') : item.group;
    return {id: item.kind, title: item.title, category, description: item.description, purpose: item.purpose, produces: item.produces, subject: item.subject, featured: false,
      command: `birdeye-cli case ${item.kind}${input.address ? ' --address <SOLANA_ADDRESS>' : input.wallets ? ' --wallets <WALLET_1,WALLET_2>' : ''} --estimate-cu --short`,
      estimatedCu: plan.estimatedCu, maxRequests: plan.maxRequests, notes: plan.notes,
      steps: plan.steps.map(step => ({id: step.id, operation: step.operation, cost: step.cost})),
      source: `docs/workflows/workflow-${item.kind}.md`, ...config.workflows.overrides[item.kind]};
  });
  const allDocs = [...await sourceFiles(resolve(root, 'skills')), ...await sourceFiles(resolve(root, 'docs/workflows')), ...config.documents.map(file => resolve(root, file))].filter(file => file.endsWith('.md'));
  const documents = Object.fromEntries(await Promise.all(allDocs.map(async file => [relative(root, file).split('\\').join('/'), stripFrontmatter(await readFile(file, 'utf8'))])));
  const skills = await Promise.all(config.skills.map(async item => {
    if (!Object.hasOwn(documents, item.file)) throw new Error(`Skill must reference an existing Markdown file under skills/ or docs/workflows/: ${item.file}`);
    const raw = await readFile(resolve(root, item.file), 'utf8');
    return {id: item.id, title: field(raw, 'name') || item.id, category: item.category, description: field(raw, 'description') || '', source: item.file};
  }));
  if (new Set(skills.map(item => item.id)).size !== skills.length) throw new Error('Duplicate skill IDs');
  for (const item of [...skills, ...workflows]) if (!categoryIds.has(item.category)) throw new Error(`Unknown category: ${item.category}`);
  for (const workflow of workflows) {
    if (config.workflows.overrides[workflow.id]?.source && !documents[workflow.source]) throw new Error(`Unknown workflow document: ${workflow.source}`);
    if (!documents[workflow.source]) workflow.source = workflow.id.startsWith('skill-') ? 'docs/workflows/birdeye-data-skills.md' : 'docs/workflows/README.md';
  }
  const {version} = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  const data = {schemaVersion: 1, site: config.site, cliVersion: version, categories: config.categories, skills, workflows, documents};
  const revision = createHash('sha256').update(JSON.stringify(data)).digest('hex').slice(0,16);
  return {...data, revision, updatedAt: new Date().toISOString()};
}
export async function syncCatalog() {
  const catalog = await createCatalog();
  try {if (JSON.parse(await readFile(destination, 'utf8')).revision === catalog.revision) return false;} catch {}
  await mkdir(dirname(destination), {recursive: true});
  const temporary = `${destination}.${process.pid}.tmp`;
  await writeFile(temporary, JSON.stringify(catalog, null, 2) + '\n');
  await rename(temporary, destination);
  console.log(`Landing catalog: ${catalog.skills.length} skills, ${catalog.workflows.length} workflows (${catalog.revision})`);
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
