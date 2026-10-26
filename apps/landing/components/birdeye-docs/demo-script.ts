import type { Workflow } from './catalog';
import snapshots from '../../public/demo-snapshots.json';

type Json = null | boolean | number | string | Json[] | {[key: string]: Json};
type Source = {data: Record<string, any>; meta: {operation: string; params: Record<string, any>; retrievedAt: string}};
export type DemoScript = {
  id: string; title: string; address: string; capturedAt: string; description: string;
  durationMs: number; estimatedCu: number; commands: {preview: string; run: string};
  chapters: {title: string; caption: string}[]; reports: Json; sourceCount: number;
  steps: string[]; highlights: {label: string; value: string; note: string}[];
  columns: string[]; rows: string[][]; detailTitle: string; checks: {label: string; value: string}[]; takeaway: string;
};
const num = (value: unknown): number | null => value !== null && value !== '' && (typeof value === 'number' || typeof value === 'string') && Number.isFinite(Number(value)) ? Number(value) : null;
const money = (value: unknown, compact = true) => {
  const n = num(value); if (n === null) return 'Unavailable';
  return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', notation: compact ? 'compact' : 'standard', maximumFractionDigits: Math.abs(n) < 1 && n !== 0 ? 6 : 2}).format(n);
};
const percent = (value: unknown, ratio = false) => {const n = num(value); return n === null ? 'Unknown' : `${(n * (ratio ? 100 : 1)).toFixed(2)}%`;};
const count = (value: unknown) => {const n = num(value); return n === null ? 'Unavailable' : n.toLocaleString('en-US');};
const boolean = (value: unknown) => value === true ? 'Yes' : value === false ? 'No' : 'Unknown';

export function buildDemoScripts(_workflows: Workflow[]): DemoScript[] {
  return snapshots.captures.map(capture => {
    // One captured workflow per story: displayed budget and results share a run.
    const report = capture.reports[0];
    const sources = report.result.data.sources as unknown as Source[];
    const find = (operation: string) => sources.find(s => s.meta.operation === operation)?.data || {};
    const token = capture.id === 'token-research';
    const overview = find('token.overview'), security = find('token.security'), holdings = find('portfolio.holdings');
    const pnl = sources.find(s => s.meta.operation === 'portfolio.pnl-summary' && s.meta.params.duration === '30d')?.data.summary || {};
    const estimatedCu = report.plan.estimatedCu;
    const input = report.plan.input;
    const command = `birdeye-cli case ${report.workflow} --address ${capture.address} --from ${input.from} --to ${input.to}` + (token ? ' --depth full' : ' --intervals 24h,7d,30d,90d,all');
    const steps = token ? ['Market overview', 'Security & authorities', 'Top holders', 'Pools & markets', 'Pair details', 'Holder cohorts', 'Price candles', 'Trading activity'] : ['PnL · 24h', 'PnL · 7d', 'PnL · 30d', 'PnL · 90d', 'PnL · all time', 'Position performance', 'Wallet holdings', 'First funding', 'Recent transactions'];
    return {
      id: capture.id, title: capture.title, address: capture.address, capturedAt: report.result.meta.retrievedAt,
      description: token ? 'Understand PUMP’s market activity and the checks still worth investigating.' : 'See what this wallet holds and separate realized returns from open-position gains.',
      durationMs: 48000, estimatedCu, commands: {preview: command + ' --estimate-cu', run: command + ` --max-cu ${estimatedCu}`},
      sourceCount: sources.length, reports: [report] as unknown as Json, steps,
      chapters: [
        {title: 'Choose a workflow', caption: token ? 'Choose Token Research and paste the PUMP token address on Solana.' : 'Choose Wallet Analysis and paste the wallet address on Solana.'},
        {title: 'Preview the budget', caption: `Preview the ${steps.length} planned data requests and the ${estimatedCu} CU catalog estimate before running.`},
        {title: 'Run the research', caption: 'Follow the requests as evidence comes together. This animation replays a recorded CLI run.'},
        {title: 'Read the results', caption: token ? 'Start with price, liquidity, trading volume and holder count from the captured market overview.' : 'Portfolio value is a balance. Realized and unrealized PnL explain different parts of the 30-day result.'},
        {title: 'Explore the evidence', caption: token ? 'Compare the leading pools in the fetched page, then review concentration and missing security checks.' : 'Inspect the largest positions in the fetched page, then compare realized PnL across separate windows.'},
        {title: 'Revisit the result', caption: 'The CLI can save research to History for later review. This walkthrough replays its bundled snapshot; download the full evidence below.'},
      ],
      highlights: token ? [
        {label: 'PUMP price', value: money(overview.price, false), note: `${percent(overview.priceChange24hPercent)} over 24h`},
        {label: 'Liquidity', value: money(overview.liquidity), note: 'Current market snapshot'},
        {label: '24h volume', value: money(overview.v24hUSD), note: 'Trading activity in USD'},
        {label: 'Holders', value: count(overview.holder), note: `${money(overview.marketCap)} market cap`},
      ] : [
        {label: 'Portfolio value', value: money(holdings.total_value), note: 'Current holdings snapshot'},
        {label: 'Realized PnL · 30d', value: money(pnl.pnl?.realized_profit_usd, false), note: 'Profit / loss already realized'},
        {label: 'Unrealized PnL · 30d', value: money(pnl.pnl?.unrealized_usd, false), note: 'Open-position profit / loss'},
        {label: 'Trades · 30d', value: count(pnl.counts?.total_trade), note: `${count(pnl.counts?.total_buy)} buys · ${count(pnl.counts?.total_sell)} sells`},
      ],
      detailTitle: token ? 'Leading pools in the fetched page' : 'Largest positions in the fetched page',
      columns: token ? ['Pool / venue', 'Liquidity', '24h volume'] : ['Asset', 'Value', 'Portfolio share'],
      rows: token ? (find('token.markets').items || []).slice(0, 3).map((item: any) => [`${item.name} · ${item.source}`, money(item.liquidity), money(item.volume24h)]) : (holdings.items || []).slice(0, 3).map((item: any) => [String(item.symbol || item.address), money(item.value), num(holdings.total_value) && num(item.value) !== null ? percent(Number(item.value) / Number(holdings.total_value), true) : 'Unavailable']),
      checks: token ? [
        {label: 'Top 10 token accounts · supply share', value: percent(security.top10HolderPercent, true)},
        {label: 'Freezeable', value: boolean(security.freezeable)},
        {label: 'Mutable metadata', value: boolean(security.mutableMetadata)},
      ] : ['7d', '30d', '90d'].map(duration => ({label: `Realized PnL · ${duration}`, value: money(sources.find(s => s.meta.operation === 'portfolio.pnl-summary' && s.meta.params.duration === duration)?.data.summary?.pnl?.realized_profit_usd, false)})),
      takeaway: token ? 'Concentrated ownership deserves a closer look. Missing security evidence remains unknown.' : 'Read each PnL window separately. Overlapping periods cannot be added together, and holdings are not returns.',
    };
  });
}
