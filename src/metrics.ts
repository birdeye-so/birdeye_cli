import { decimal, object, type Data } from "./shared.js";
import type { Result } from "./runner.js";
import { dataRows } from "./workflows.js";

/** Derived values stay in host arithmetic; cohort and PnL definitions stay with their sources. */
export function workflowMetrics(source: Result): Data[] {
  const d = object(source.data), p = source.meta.params || {}, operation = source.meta.operation;
  const base = { sourceId: source.meta.requestId, operation, address: p.address ?? p.token_address ?? p.wallet ?? null, asOf: d.meta?.time ?? source.meta.retrievedAt, chain: source.meta.chain };
  if (operation === "market.token-list") return dataRows(source.data).map((row, i) => ({...base, address: row.address, symbol: row.symbol ?? row.symbols ?? null, pageRank: Number(p.offset ?? 0) + i + 1, priceUsd: row.price ?? null, liquidityUsd: row.liquidity ?? null, marketCapUsd: row.market_cap ?? null, volume24hUsd: row.volume_24h_usd ?? null, holderCount: row.holder ?? null, rankingBasis: `${p.sort_by} ${p.sort_type}; fetched page only`}));
  if (operation === "market.smart-money") return dataRows(source.data).map((row, i) => ({...base, address: row.token ?? row.address, symbol: row.symbol ?? null, pageRank: Number(p.offset ?? 0) + i + 1, priceUsd: row.price ?? null, liquidityUsd: row.liquidity ?? null, marketCapUsd: row.market_cap ?? null, smartTraders: row.smart_traders_no ?? null, netFlowUsd: row.net_flow ?? null, volumeUsd: row.volume_usd ?? null, window: p.interval}));
  if (operation === "token.top-traders") return dataRows(source.data).map(row => ({...base, wallet: row.owner ?? row.wallet_address ?? row.wallet ?? row.address ?? null, token: p.address, window: p.time_frame, tradeCount: row.trade ?? null, volumeUsd: row.volumeUsd ?? null, tokenRealizedPnlUsd: row.realizedPnl ?? null, tokenUnrealizedPnlUsd: row.unrealizedPnl ?? null, basis: "Trader observed for this token and window; PnL covers this token only, not the whole wallet"}));
  if (operation === "token.money-flow") return dataRows(source.data).map(row => {
    const buy = decimal(row.total_value_buy), sell = decimal(row.total_value_sell);
    return {...base, address: row.token_address, cohort: row.tag, window: row.frame, windowStart: row.unix_time, lastTrade: row.last_unix_time, buyValue: buy?.toString() ?? null, sellValue: sell?.toString() ?? null, netValue: buy && sell ? buy.minus(sell).toString() : null, valueBasis: "same provider value unit and frame; cohort-specific, not all-market flow", uniqueTraders: row.uniq_trader ?? null};
  });
  if (operation === "token.holder-profile") return (Array.isArray(d.tags) ? d.tags : []).map((row: Data) => ({...base, cohort: row.tag, holderCount: row.holder_count ?? null, percentOfSupply: row.percent_of_supply ?? null, amount: row.hold_amount ?? null, buyVolumeUsd: row.buy_volume_usd ?? null, sellVolumeUsd: row.sell_volume_usd ?? null, pnlUsd: row.pnl ?? null, window: "1h volumes; snapshot holdings", cohortBasis: "Birdeye labels overlap; shares must not be summed"}));
  if (operation === "token.holder-distribution") return [{...base, addressType: p.address_type, mode: p.mode, ...object(d.summary), distributionBasis: "requested segment / total token supply"}];
  if (operation === "token.first-buyers") return [{...base, pageSummary: d.page_summary, buyerBasis: "fetched page; position status relative to holding after first buy"}];
  if (operation === "portfolio.pnl-summary" || operation === "portfolio.pnl-details") {
    const summary = object(d.summary), pnl = object(summary.pnl), counts = object(summary.counts);
    return [{...base, wallet: p.wallet, duration: p.duration, positionScope: p.position_scope, pnlMethod: p.pnl_method, tokenFilter: p.token_addresses ?? null, realizedPnlUsd: pnl.realized_profit_usd ?? null, unrealizedPnlUsd: pnl.unrealized_usd ?? null, totalPnlUsd: pnl.total_usd ?? null, winRate: counts.win_rate ?? null, wins: counts.total_win ?? null, losses: counts.total_loss ?? null, trades: counts.total_trade ?? null, winRateBasis: "provider rate for fully realized tokens; not copy-trade ROI"}];
  }
  if (operation === "market.chain-metrics") return dataRows(source.data).map(row => ({...base, asOf: row.unix_time, window: "1D", volumeUsd: row.volume_usd ?? null, tradeCount: row.trade_count ?? null, activeTradingTokens: row.active_trading_tokens ?? null, stablecoinMarketCapUsd: row.stable_coin_market_cap ?? null, basis: "volume/activity within bucket; stablecoin market cap at bucket end"}));
  if (operation === "market.ohlcv") {
    const candles = dataRows(source.data).filter(r => Number.isFinite(Number(r.unix_time))).sort((a,b) => Number(a.unix_time)-Number(b.unix_time));
    const closed = candles.filter(r => p.type === "1H" ? Number(r.unix_time) + 3600 <= Math.min(p.time_to, Date.now()/1000) : false);
    const first = closed[0], last = closed.at(-1), start = decimal(first?.o), end = decimal(last?.c);
    return [{...base, candleInterval: p.type, from: p.time_from, to: p.time_to, observedCandles: candles.length, closedHourlyCandles: p.type === "1H" ? closed.length : null, observedReturnPct: start?.gt(0) && end ? end.div(start).minus(1).times(100).toFixed(6) : null, returnBasis: "first open to last close of fetched closed 1H candles; missing candles remain unverified"}];
  }
  return [];
}
