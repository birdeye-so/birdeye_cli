import {z} from 'zod';

// Only expose flags used by each skill. Values and defaults come from runtime schemas.
const fields = {
  'skill-launchpad-trending': ['source', 'stage', 'minProgress', 'scanLimit', 'launchSort', 'minLiquidity', 'depth', 'limit', 'from', 'to'],
  'skill-token-security': [],
  'skill-token-stats': ['statsFrames'],
  'skill-top-holder-analysis': ['topN', 'depth'],
  'skill-top-trader-analysis': ['traderWindow', 'traderSort', 'scanLimit'],
  'skill-lp-analysis': ['scanLimit', 'limit', 'depth', 'from', 'to'],
  'skill-smart-money-holders': ['scanLimit', 'includeExited', 'depth', 'from', 'to', 'trackerFrame'],
  'skill-kol-signal': ['from', 'to', 'trackerFrame', 'signalThresholdUsd', 'depth', 'scanLimit'],
  'skill-token-dd-score': ['ddMode', 'topN', 'liqResolution', 'liqCandles', 'windowDays', 'from', 'to'],
  'skill-trending-list': ['listSource', 'sortBy', 'platform', 'interval', 'scanLimit'],
  'skill-smart-wallets': ['skillDepth', 'scanLimit', 'limit', 'duration', 'pnlMethod'],
  'skill-contract-dd': ['skipKline', 'resolution', 'windowDays', 'from', 'to'],
  'skill-rugcheck-audit': ['windowDays', 'from', 'to'],
  'skill-kline-pattern': ['resolution', 'windowDays', 'from', 'to'],
  'skill-wallet-score': ['duration', 'pnlMethod', 'skipPositions', 'skipPortfolio', 'skipFirstFunded'],
  'skill-wallet-style': ['duration', 'pnlMethod', 'skipPositions', 'skipTransactions', 'skipFirstFunded'],
  'skill-wallet-analysis': ['intervals', 'duration', 'pnlMethod', 'skipPositions', 'skipPortfolio', 'skipTransactions', 'skipFirstFunded'],
  'skill-smart-money-profile': ['duration', 'pnlMethod', 'from', 'to', 'skipPositions', 'skipPortfolio', 'skipTransactions', 'skipFirstFunded'],
  'skill-smart-money-leaderboard': ['duration', 'pnlMethod'],
};
const flag = key => '--' + key.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`).replaceAll('_', '-');
const row = (param, required, values, defaultValue) => ({param, required, values, default: defaultValue});
function values(schema) {
  if (schema.enum) return schema.enum.join(' | ');
  if (schema.type === 'array') return `Comma-separated ${values(schema.items)} (${schema.minItems ?? 0}–${schema.maxItems ?? 'unbounded'} items)`;
  if (schema.type === 'boolean') return 'Flag';
  if (schema.type === 'object') return 'JSON object';
  if (schema.type === 'number' || schema.type === 'integer') return [schema.type,
    schema.minimum !== undefined ? `>= ${schema.minimum}` : '', schema.exclusiveMinimum !== undefined ? `> ${schema.exclusiveMinimum}` : '',
    schema.maximum !== undefined ? `<= ${schema.maximum}` : '', schema.exclusiveMaximum !== undefined ? `< ${schema.exclusiveMaximum}` : '',
  ].filter(Boolean).join(', ');
  return 'Text';
}
const sampleAddress = 'So11111111111111111111111111111111111111112';
const sampleTime = 1793577600; // 2026-11-02T00:00:00Z; stable, reproducible previews.

export function skillDetails(definition, runtime) {
  const surge = definition.kind === 'skill-price-surge';
  const schema = z.toJSONSchema(surge ? runtime.priceSurgeSchema : runtime.workflowInputSchema, {unrepresentable: 'any'}).properties;
  const input = {kind: definition.kind};
  if (['token', 'wallet'].includes(definition.subject)) input.address = sampleAddress;
  if (definition.subject === 'wallets') input.wallets = [sampleAddress];
  const plan = surge ? runtime.planPriceSurge({}) : runtime.planCase(input, sampleTime);
  let command = surge ? 'birdeye-cli price-surge' : `birdeye-cli case ${definition.kind}`;
  if (input.address) command += ` --address ${input.address}`;
  if (input.wallets) command += ` --wallets ${input.wallets.join(',')}`;
  if (plan.input?.from !== undefined) command += ` --from ${plan.input.from} --to ${plan.input.to}`;
  command += ' --estimate-cu --format json';

  const keys = surge ? Object.keys(schema) : fields[definition.kind];
  if (!keys) throw new Error(`Missing CLI detail fields for ${definition.kind}`);
  const params = [];
  if (input.address) params.push(row('--address', true, `Solana ${definition.subject} address${definition.kind === 'skill-token-dd-score' ? '; optional with --rescore' : ''}`, null));
  if (input.wallets) params.push(row('--wallets', true, '1–10 comma-separated Solana wallet addresses', null));
  for (const key of keys) {
    if (!schema[key]) throw new Error(`Unknown CLI field ${definition.kind}/${key}`);
    let allowed = values(schema[key]);
    if (key === 'duration' && definition.kind === 'skill-wallet-score') allowed = '30d';
    if (key === 'duration' && definition.kind === 'skill-wallet-style') allowed = '7d | 30d';
    if (key === 'from') allowed = 'Unix seconds; provide together with --to';
    if (key === 'to') allowed = 'Unix seconds; provide together with --from';
    if (key === 'minProgress') allowed += '; required when --stage near-graduation';
    if (key === 'scanLimit' && definition.kind === 'skill-top-trader-analysis') allowed += '; effective page capped at 10';
    if (key === 'scanLimit' && definition.kind === 'skill-lp-analysis') allowed += '; effective page capped at 20';
    if (key === 'with_security') allowed += '; requires --mode advanced';
    if (key === 'max_liq_mcap_ratio') allowed += '; minimum liquidity / market cap despite legacy flag name';
    let defaultValue = schema[key].default ?? null;
    if (key === 'limit' && !surge) defaultValue = plan.input.limit;
    if (key === 'to') defaultValue = 'Current time';
    if (key === 'from') defaultValue = `--to minus ${(plan.input.to - plan.input.from) / 86400} days by default`;
    params.push(row(flag(key), false, allowed, defaultValue));
  }
  if (!surge && !definition.fixedSources) params.push(row('--step-overrides', false, 'JSON object keyed by step ID; parameters validated by each endpoint', {}));
  if (definition.kind === 'skill-token-dd-score') params.push(row('--rescore', false, 'Saved run ID, full JSON path or base64:JSON; zero API calls; cannot combine with --estimate-cu', null));
  if (!surge) params.push(row('--chain', false, definition.supportedChains.join(' | '), 'solana'));
  params.push(row('--format', false, 'json | table | interface | plain | ui', 'json'),
    row('--short', false, 'Flag', false), row('--estimate-cu', false, 'Flag; preview without API calls', false),
    row('--max-cu', false, 'Nonnegative integer CU budget', null));
  const subject = definition.subject === 'wallets' ? ' Use wallets <WALLET_1,WALLET_2>.'
    : input.address ? ` Use ${definition.subject} <SOLANA_ADDRESS>.` : '';
  return {
    core_capabilities: [definition.purpose, definition.produces],
    just_say_to_your_agent: (definition.guide?.useCases ?? [definition.purpose]).map(prompt => `Use ${definition.title} (${definition.kind}) to help me: ${prompt}${subject} Preview CU before running.`),
    cli_parameters: params,
    sample_output: {format: 'json', kind: 'estimate', description: 'Offline cost-preview output with illustrative inputs and a fixed observation time. No live market data or API calls.', command, output: plan},
  };
}
