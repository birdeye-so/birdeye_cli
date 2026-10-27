import {build} from 'esbuild';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
export const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export async function loadSkillRuntime() {
  const bundle = await build({stdin: {contents: 'export {workflowCatalog, planCase} from "./src/workflows.ts";', resolveDir: root}, bundle: true, write: false, platform: 'node', format: 'esm', logLevel: 'silent'});
  return import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
}
export function publicSkill(item) {
  const input = {token: 'A Solana token address.', wallet: 'A Solana wallet address.', wallets: 'One to ten Solana wallet addresses, separated by commas.', 'optional-wallet': 'Optionally supply a Solana wallet address.', none: 'No address is required. Choose filters appropriate to the research question.'}[item.subject];
  const subject = ['token', 'wallet'].includes(item.subject) ? ' --address <SOLANA_ADDRESS>' : item.subject === 'wallets' ? ' --wallets <WALLET_1,WALLET_2>' : '';
  const mode = item.kind === "skill-token-dd-score" ? " --dd-mode advanced" : "";
  const run = `birdeye-cli case ${item.kind}${subject}${mode} --short`;
  return {id: item.kind, title: item.title, category: item.category, description: item.purpose,
    usage: {input, instructions: 'Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.' + (item.kind === "skill-token-dd-score" ? " Token DD combines Standard and Advanced in one skill. Use --dd-mode standard for two API calls, or --dd-mode advanced (default) for seven calls and deeper holder, liquidity and smart-money evidence. Preview the selected mode before running." : ""),
      preview_command: `${run} --estimate-cu`, run_command: run, result: item.produces,
      install_command: `npx skills add https://github.com/birdeye-so/birdeye_cli/tree/main/skills --skill ${item.kind} --global`}};
}
