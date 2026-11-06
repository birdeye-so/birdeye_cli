import {build} from 'esbuild';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {skillContent} from './skill-content.mjs';
export const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export async function loadSkillRuntime() {
  const bundle = await build({stdin: {contents: `export {workflowCatalog, planCase} from "./src/workflows.ts";
    export {workflowInputSchema} from "./src/workflows/input.ts";
    export {priceSurgeSchema} from "./src/price-surge/schema.ts";
    export {planPriceSurge} from "./src/price-surge/api.ts";`, resolveDir: root}, bundle: true, write: false, platform: 'node', format: 'esm', logLevel: 'silent'});
  return import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
}
export const sharedSkillLimitations = "Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.";
export function skillSupportMarkdown(item) {
  if (!item.supportedChains?.length || !item.limitations?.length) throw new Error(`Missing chain support or limitations: ${item.kind}`);
  const content = skillContent(item.kind);
  return `## Supported chains and limitations\n\nSupported chains in this CLI: ${content.supported_chains.map(chain => `\`${chain}\``).join(', ')}. Broader upstream API support does not enable additional chains for this skill.\n\n${content.limitations.map(note => `- ${note}`).join('\n')}\n\n### Execution notes\n\n${item.limitations.map(note => `- ${note}`).join('\n')}\n\n${sharedSkillLimitations}`;
}
export function publicSkill(item, {includeSupport = true} = {}) {
  const skill = basePublicSkill(item);
  const content = skillContent(item.kind);
  skill.description = content.description;
  skill.usage.instructions += `\n\nUse cases:\n${content.use_cases.map(example => `- ${example}`).join('\n')}`;
  if (includeSupport) {
    skill.usage.input += ` Supported chains in this CLI: ${item.supportedChains.join(', ')}.`;
    skill.usage.instructions += `\n\n${skillSupportMarkdown(item)}`;
  }
  return skill;
}
function basePublicSkill(item) {
  if (item.kind === "skill-price-surge") {
    const run = "birdeye-cli price-surge --chain solana --interval 1h --min-market-cap 50000 --max-market-cap 5000000 --short";
    return {id: item.kind, title: item.title, category: item.category, description: item.purpose,
      usage: {input: "Chain, surge interval and market-cap band. Standard is the default; choose advanced, top and optional security to bound enrichment.",
        instructions: "Install birdeye-cli and configure the Birdeye API key locally. Preview the user's filters and CU budget, then run the same command with --max-cu. Standard costs 50 CU. Advanced hydrates at most --top survivors; --with-security adds security, while --no-holder-health skips Solana holder cohorts. --no-auto-filter retains every row with its flags. Top-10 and developer caps require security evidence. Unknown KOL tags are not zero buyers. Use --help for the full filter list; read the detailed reference for interpretation and the /price-surge API contract. HTTP automation uses the separate birdeye-api process: send the user's Birdeye key in X-API-KEY for each live request. The wrapper never uses a server key; estimates need no key. Terminal usage needs no background server.",
        preview_command: `${run} --estimate-cu`, run_command: run, result: item.produces,
        install_command: `npx skills add https://github.com/birdeye-so/birdeye_cli/tree/main/skills --skill ${item.kind} --global`}};
  }
  const input = item.guide?.input ?? {token: 'A Solana token address.', wallet: 'A Solana wallet address.', wallets: 'One to ten Solana wallet addresses, separated by commas.', 'optional-wallet': 'Optionally supply a Solana wallet address.', none: 'No address is required. Choose filters appropriate to the research question.'}[item.subject];
  const subject = ['token', 'wallet'].includes(item.subject) ? ' --address <SOLANA_ADDRESS>' : item.subject === 'wallets' ? ' --wallets <WALLET_1,WALLET_2>' : '';
  const mode = item.kind === "skill-token-dd-score" ? " --dd-mode advanced" : "";
  const run = `birdeye-cli case ${item.kind}${subject}${mode}${item.guide?.exampleFlags ? ` ${item.guide.exampleFlags}` : ""} --short`;
  return {id: item.kind, title: item.title, category: item.category, description: item.purpose,
    usage: {input, instructions: 'Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.' + (item.guide ? ` ${item.guide.instructions}` : '') + (item.kind === "skill-token-dd-score" ? " Token Due-Diligence Score combines Standard and Advanced in one skill. Use --dd-mode standard for two API calls, or --dd-mode advanced (default) for seven calls and deeper holder, liquidity and smart-money evidence. Preview the selected mode before running. HTTP automation can call POST /token-dd on the separate birdeye-api service, sending the user's Birdeye key in X-API-KEY for each live request. The wrapper never uses a server key; estimates need no key. The endpoint is Solana-only and uses snake_case inputs." : ""),
      preview_command: `${run} --estimate-cu`, run_command: run, result: item.produces,
      install_command: `npx skills add https://github.com/birdeye-so/birdeye_cli/tree/main/skills --skill ${item.kind} --global`}};
}
