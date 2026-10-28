import {readFile, readdir, mkdir, writeFile, realpath} from 'node:fs/promises';
import {resolve, relative, dirname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {z} from 'zod';
import {loadSkillRuntime, publicSkill, skillSupportMarkdown, sharedSkillLimitations} from './skill-runtime.mjs';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const slug = z.string().regex(/^[a-z0-9][a-z0-9-]*$/);
const manifestSchema = z.object({category: slug, resources: z.record(z.string(), z.string()).default({}), legacy: z.boolean().default(false), generated: z.boolean().default(false)}).strict();
function field(text, name) {
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  const value = frontmatter?.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.replace(/^['"]|['"]$/g, '');
  if (!value) throw new Error(`Missing skill frontmatter field: ${name}`);
  return value;
}
function contained(parent, path) {
  const suffix = relative(parent, path);
  return suffix && suffix !== '..' && !suffix.startsWith(`..${sep}`) && !suffix.startsWith(sep);
}
export async function skillPackages() {
  const entries = await readdir(resolve(root, 'skills'), {withFileTypes: true});
  const packages = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory()) continue;
    const directory = resolve(root, 'skills', entry.name);
    const raw = await readFile(resolve(directory, 'SKILL.md'), 'utf8');
    const id = slug.parse(field(raw, 'name'));
    if (id !== entry.name) throw new Error(`Skill name must match directory: ${entry.name}`);
    const manifest = manifestSchema.parse(JSON.parse(await readFile(resolve(directory, 'skill.json'), 'utf8')));
    packages.push({id, title: id, description: field(raw, 'description'), category: manifest.category,
      source: `skills/${id}/SKILL.md`, directory, resources: manifest.resources, legacy: manifest.legacy, generated: manifest.generated});
  }
  return packages;
}
export async function syncSkillPackages({check = false} = {}) {
  const {workflowCatalog} = await loadSkillRuntime();
  const definitions = workflowCatalog().filter(item => item.family !== "legacy");
  for (const definition of definitions) {
    const skill = publicSkill(definition, {includeSupport: false});
    const directory = resolve(root, 'skills', skill.id);
    const references = definition.source.startsWith('skills/') || definition.kind === 'skill-price-surge' ? {'references/details.md': definition.source} : {};
    let instructions = `---\nname: ${skill.id}\ndescription: ${JSON.stringify(skill.description)}\n---\n\n<!-- Generated from src/workflows/${skill.id}/definition.ts; run npm run skills:sync. -->\n\n# ${skill.title}\n\nRequires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.\n\n## When to use\n\n${skill.description}\n\n## Input\n\n${skill.usage.input}\n\n## Use\n\n${skill.usage.instructions}\n\nPreview without API calls:\n\n\`\`\`bash\n${skill.usage.preview_command}\n\`\`\`\n\nRun after confirming the input and budget:\n\n\`\`\`bash\n${skill.usage.run_command} --max-cu <CU_BUDGET>\n\`\`\`\n\nUse \`birdeye-cli ${skill.id === "skill-price-surge" ? "price-surge" : `case ${skill.id}`} --help\` for optional flags. Run from any directory.\n\n## Result\n\n${skill.usage.result}\n\nReport sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.\n`;
    instructions += `\n${skillSupportMarkdown(definition)}\n`;
    if (Object.keys(references).length) instructions += skill.id === 'skill-price-surge' ? '\nRead [the detailed reference](references/details.md) for filters, risk interpretation, missing data, installation or the aggregate HTTP API.\n' : '\nRead [the detailed reference](references/details.md) when interpreting formulas, selecting evidence modes, or re-scoring saved evidence.\n';
    const manifest = JSON.stringify({category: skill.category, generated: true, resources: references}, null, 2) + '\n';
    for (const [name, content] of [['SKILL.md', instructions], ['skill.json', manifest]]) {
      const path = resolve(directory, name);
      let previous;
      try {previous = await readFile(path, 'utf8');} catch {}
      if (previous === content) continue;
      if (check) throw new Error(`Stale generated skill: ${skill.id}/${name}; run npm run skills:sync`);
      // Never overwrite a separately authored package with a colliding ID.
      if (name === 'SKILL.md' && previous && !previous.includes('<!-- Generated from src/workflows/')) throw new Error(`Skill ID collides with a maintained package: ${skill.id}`);
      await mkdir(directory, {recursive: true});
      await writeFile(path, content);
    }
  }
  const supportPath = resolve(root, 'docs/workflows/skill-support.md');
  const cell = text => text.replaceAll('|', '\\|');
  const support = `# Skill chain support and limitations\n\n<!-- Generated from workflow definitions by npm run skills:sync. -->\n\nThis table describes the skills implemented by this CLI, not every network supported by Birdeye. Checked against the execution definitions and request catalog on 2026-10-28. The catalog contains ${definitions.length} current skills; four older instruction packages remain for compatibility.\n\n${sharedSkillLimitations}\n\n## Current skills\n\n| Skill | Supported chains in this CLI | Limitations |\n| --- | --- | --- |\n${definitions.map(item => `| [${item.title}](../../skills/${item.kind}/SKILL.md) (\`${item.kind}\`) | ${item.supportedChains.map(chain => `\`${chain}\``).join(', ')} | ${item.limitations.map(cell).join('<br><br>')} |`).join('\n')}\n\n## Compatibility packages\n\nThese maintained instruction packages are outside the current public catalog. Their full research procedures remain Solana-only. Individual raw operation exceptions do not extend an entire package's chain support.\n\n| Package | Supported chain | Limits and current alternative |\n| --- | --- | --- |\n| [birdeye-token](../../skills/birdeye-token/SKILL.md) | \`solana\` | Snapshot token/holder/security research; no code audit, independent honeypot simulation, LP-lock verification or team/social verification. Choose Token DD, Contract DD, RugCheck Audit or Kline Pattern for a focused current skill. |\n| [birdeye-market](../../skills/birdeye-market/SKILL.md) | \`solana\` | Bounded market samples, not full-market coverage or a live monitor. Use Trending List or Smart Wallets; Price Surge is a separate skill with the multi-chain scope listed above. |\n| [birdeye-portfolio](../../skills/birdeye-portfolio/SKILL.md) | \`solana\` | Holdings/PnL/trade pages can be incomplete; observed weights are page-relative. Holdings, net-worth changes and first funding do not establish PnL, copy ROI or wallet age. Use the current wallet skills above. |\n| [token-duediligence](../../skills/token-duediligence/SKILL.md) | \`solana\` | Compatibility entrypoint for Token DD Score; identical mode, coverage, provisional liquidity-CU and re-score limits to \`skill-token-dd-score\`. |\n\nOlder \`case\` recipes remain callable on Solana for compatibility; they are not separately installable current skills. In particular, \`token-research\` is a legacy case ID, not an installable skill directory.\n\n## Endpoint support versus skill support\n\n\`birdeye-cli cases --short\` reports each current skill's \`supportedChains\` and \`limitations\`. \`birdeye-cli capabilities --short\` reports the implemented \`chains\` for each raw operation; its singular \`chain\` is the default. \`birdeye-cli chains\` summarizes implemented chains and scope. \`chains --refresh\` queries Birdeye's wider network list and does not enable new CLI support. Imported workflows and existing demo recipes remain Solana-only.\n\nThe raw \`market.token-list\`, \`token.security\` and \`token.top-traders\` operations support the five Price Surge chains. Other raw operations remain Solana-only. For EVM calls use a 20-byte \`0x\` contract address; Solana addresses must decode to 32 bytes. A supported chain does not guarantee that every upstream field is populated.\n\n[Token List V3](https://data.birdeye.so/docs/data-api/tokenmarket-list/get-defi-v3-token-list) documents additional networks outside this implementation, but not Arbitrum. [Holder Profile](https://data.birdeye.so/docs/data-api/holder/get-token-v1-holder-profile) documents Robinhood as well as Solana; this CLI's holder-profile operation and Price Surge holder-health step remain Solana-only. [Top Traders](https://data.birdeye.so/docs/data-api/wallet-networth-pnl/get-defi-v2-tokens-top-traders) has Solana-specific tag/holder options. [Security](https://data.birdeye.so/docs/data-api/security/get-defi-token-security) returns chain-dependent fields. Upstream declarations were rechecked on 2026-10-28; no live paid endpoint validation is implied.\n\nSee [Price Surge setup and API](price-surge.md), [installation](../INSTALLATION.md) and [usage](../USAGE.md) for commands and configuration.\n`;
  let previousSupport;
  try {previousSupport = await readFile(supportPath, 'utf8');} catch {}
  if (previousSupport !== support) {
    if (check) throw new Error('Stale skill support matrix; run npm run skills:sync');
    await writeFile(supportPath, support);
  }
  for (const skill of await skillPackages()) {
    for (const [target, source] of Object.entries(skill.resources)) {
      const destination = resolve(skill.directory, target);
      const origin = await realpath(resolve(root, source));
      if (!target.startsWith('references/') || !contained(skill.directory, destination) || !contained(root, origin)) {
        throw new Error(`Resource escapes its package/repository: ${skill.id}/${target}`);
      }
      const expected = `<!-- Generated from ${source}; edit the source and run npm run skills:sync. -->\n\n` + await readFile(origin, 'utf8');
      let current;
      try {current = await readFile(destination, 'utf8');} catch {}
      if (current === expected) continue;
      if (check) throw new Error(`Stale skill resource: ${skill.id}/${target}; run npm run skills:sync`);
      await mkdir(dirname(destination), {recursive: true});
      await writeFile(destination, expected);
    }
    await validateSkillLinks(skill.directory);
  }
}
export async function validateSkillLinks(directory) {
  directory = await realpath(directory);
  async function visit(folder) {
    for (const entry of await readdir(folder, {withFileTypes: true})) {
      const path = resolve(folder, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Skill packages must contain files, not symlinks: ${path}`);
      if (entry.isDirectory()) {await visit(path); continue;}
      if (!entry.name.endsWith('.md')) continue;
      const text = await readFile(path, 'utf8');
      for (const match of text.matchAll(/\]\(([^\s)]+)(?:\s+[^)]*)?\)/g)) {
        const link = match[1];
        if (/^(?:https?:|mailto:|#)/.test(link)) continue;
        const destination = resolve(dirname(path), decodeURIComponent(link.split('#')[0]));
        if (!contained(directory, destination)) throw new Error(`Skill link leaves package: ${path} -> ${link}`);
        const actual = await realpath(destination);
        if (!contained(directory, actual)) throw new Error(`Skill link resolves outside package: ${path} -> ${link}`);
      }
    }
  }
  await visit(directory);
}
