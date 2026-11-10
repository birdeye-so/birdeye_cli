import {build} from 'esbuild';
import {Ledger} from '../../dist/ledger.js';
import {Runner} from '../../dist/runner.js';
import {runCase} from '../../dist/analysis.js';
import {planCase} from '../../dist/workflows.js';
await build({entryPoints:['tests/fixtures/token-data.ts'],outfile:'.test-dist/token-data-fixture.mjs',format:'esm',platform:'node'});
const {dataSkillIds, tokenDataFixture, token, at} = await import('../../.test-dist/token-data-fixture.mjs');
export const dataReports = {};
for (const kind of dataSkillIds) {
  const plan = planCase({kind, depth:'full', ...(kind === 'skill-launchpad-trending' ? {} : {address:token}), ...(['skill-token-stats','skill-top-trader-analysis'].includes(kind) ? {} : {from:at-86400,to:at})}, at);
  const ledger = new Ledger(':memory:');
  try {
    const runner = new Runner(ledger, 'fixture', {fetch:async url=>tokenDataFixture(new URL(String(url)))});
    const result = await runCase(runner, ledger.createRun(plan.estimatedCu), plan.input);
    dataReports[kind] = {kind, analysis:result.data.skillAnalysis, sources:result.data.sources};
  } finally {ledger.close();}
}
