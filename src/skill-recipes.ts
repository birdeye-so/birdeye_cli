import type { Operation } from "./catalog.js";
import type { Step, CaseInput } from "./workflows.js";
import type { Data } from "./shared.js";

export const skillKinds = ["skill-token-dd-score", "skill-trending-list", "skill-smart-wallets", "skill-token-dd", "skill-contract-dd", "skill-rugcheck-audit", "skill-kline-pattern", "skill-wallet-score", "skill-wallet-style", "skill-wallet-analysis", "skill-smart-money-profile", "skill-smart-money-leaderboard"] as const;
export const skillInfo: Record<(typeof skillKinds)[number], {title: string; group: string; subject: string; purpose: string; produces: string}> = {
  "skill-token-dd-score": {title: "Token DD Score · Advanced", group: "token", subject: "token", purpose: "Explain token due-diligence risk through security, holders, activity, liquidity and smart-money evidence.", produces: "Five scored pillars, coverage, drawdown gate and an auditable risk rating. Standard uses two calls; advanced uses seven. Saved evidence can be re-scored locally at zero CU."},
  "skill-trending-list": {title: "Trending List", group: "discover", subject: "none", purpose: "Discover tokens by activity, liquidity or market size, optionally within a launch platform.", produces: "A ranked token page. Choose V3 token list or native trending; sorting options follow the selected API."},
  "skill-smart-wallets": {title: "Smart Wallets", group: "discover", subject: "none", purpose: "Discover wallets trading tokens in Birdeye's smart-money list, then inspect a bounded wallet shortlist.", produces: "Token → top traders → deduplicated wallets. Standard adds PnL; deep adds holdings and per-token PnL. No overlapping token-level PnL is summed."},
  "skill-token-dd": {title: "Token DD", group: "token", subject: "token", purpose: "Check market activity, security and smart-money context before taking a token further in research.", produces: "Security observations, activity and labeled money flow. Optional holder list, holder groups and historical liquidity add evidence. No automatic buy recommendation."},
  "skill-contract-dd": {title: "Contract DD", group: "token", subject: "token", purpose: "Review contract controls, ownership concentration and price behavior together.", produces: "Security checklist, holder distribution and optional candlestick analysis. Unknown controls stay unknown; price action cannot establish contract safety."},
  "skill-rugcheck-audit": {title: "RugCheck Audit", group: "token", subject: "token", purpose: "Review contract, holder and actual liquidity-history evidence for potential risk.", produces: "Birdeye observations, holder groups and historical liquidity snapshots. This is not a RugCheck.org integration; unavailable honeypot/LP-lock checks are explicit."},
  "skill-kline-pattern": {title: "Kline Pattern", group: "token", subject: "token", purpose: "Classify observed candle behavior using the reference skill's trend, slope, volatility, drawdown, volume and recovery rules.", produces: "Pattern, heuristic score and supporting measurements from closed candles. Thin or invalid data produces an unavailable result."},
  "skill-wallet-score": {title: "Wallet Score", group: "wallet", subject: "wallet", purpose: "Assess a wallet's profitability, consistency, position quality and activity from matching PnL windows.", produces: "A versioned alpha heuristic with component breakdown and missing-data checks. Scores use fetched positions and are not a copy-trading return forecast."},
  "skill-wallet-style": {title: "Wallet Style", group: "wallet", subject: "wallet", purpose: "Describe how often a wallet trades and how profitable those trades were over a fixed period.", produces: "Frequency × PnL classification with sample size and per-token loss share. Transaction and first-funding evidence are optional."},
  "skill-wallet-analysis": {title: "Wallet Analysis", group: "wallet", subject: "wallet", purpose: "Compare wallet PnL across several periods and inspect holdings, positions and recent activity.", produces: "Selected PnL windows, per-token PnL, optional holdings, transactions and first funding. Overlapping periods are not added together."},
  "skill-smart-money-profile": {title: "Smart Money Profile", group: "wallet", subject: "wallet", purpose: "Combine short and monthly performance with position, trade and net-worth history for one wallet.", produces: "7d/30d PnL, position details, holdings, swaps and net-worth snapshots. Balance changes include cash flows and are not trading ROI."},
  "skill-smart-money-leaderboard": {title: "Smart Money Leaderboard", group: "wallet", subject: "wallets", purpose: "Compare an explicit list of wallets using consistent PnL windows and accounting.", produces: "7d/30d performance and per-token evidence per wallet, ranked with higher PnL scoring higher. Missing metrics remain unranked."},
};
export const isSkill = (kind: string): kind is (typeof skillKinds)[number] => Object.hasOwn(skillInfo, kind);
type Add = (id: string, operation: Operation, params: Data, subjects?: Step["subjects"], subjectKey?: string) => void;
export function addSkillSteps(a: CaseInput, add: Add, notes: string[]) {
  const kind = a.kind.replace(/^skill-/, "");
  const token = {address: a.address};
  const candles = () => add("candles", "market.ohlcv", {...token, type: a.resolution, time_from: a.from, time_to: a.to});
  const security = () => {add("overview", "token.overview", token); add("security", "token.security", token);};
  const holders = () => add("holders", "token.holders", {...token, mode: "wallet", limit: 20});
  const profile = () => add("profile", "token.holder-profile", {token_address: a.address});
  const liquidity = () => add("liquidity", "token.liquidity-history", {...token, resolution: "4h", time: a.to, count: Math.min(100, Math.ceil((a.to! - a.from!) / 14400))});
  const summary = (id: string, wallet: string | undefined, duration: string, subjects?: Step["subjects"]) => add(id, "portfolio.pnl-summary", {...(wallet ? {wallet} : {}), duration, pnl_method: a.pnlMethod, position_scope: "duration_only"}, subjects, "wallet");
  const details = (id: string, wallet: string | undefined, subjects?: Step["subjects"]) => add(id, "portfolio.pnl-details", {...(wallet ? {wallet} : {}), duration: a.duration, pnl_method: a.pnlMethod, position_scope: "duration_only", limit: 100}, subjects, "wallet");
  const holdings = (id: string, wallet: string | undefined, subjects?: Step["subjects"]) => add(id, "portfolio.holdings", {...(wallet ? {wallet} : {}), limit: 100}, subjects, "wallet");
  const funded = () => {if (!a.skipFirstFunded) add("first-funded", "portfolio.first-funded", {wallet: a.address});};
  const transactions = () => {if (!a.skipTransactions) add("transactions", "portfolio.transactions", {wallet: a.address, limit: 100});};
  notes.push(`${kind === "token-dd-score" ? "Reconstructed from the supplied Token DD Score specification." : "Adapted from TheNang2710/birdeye-data-skills."} Only documented Birdeye endpoints are used; CU follows this CLI's catalog. Pagination is bounded to one page per step. Scores are research heuristics, not trading instructions.`);
  if (kind === "token-dd-score") {
    add("overview", "token.overview", {...token, includes: "money_flow", frames: ["1m","5m","15m","30m","1h","2h","4h","24h"]});
    add("security", "token.security", token);
    if (a.ddMode === "advanced") {
      add("distribution", "token.holder-distribution", {token_address:a.address, mode:"top", address_type:"wallet", top_n:a.topN, include_list:true, limit:a.topN, offset:0});
      profile();
      add("holders", "token.holders", {...token, mode:"wallet", get_holder_infos:true, limit:100});
      add("flow", "token.money-flow", {token_address:a.address, frames:["5m","1h","4h","24h"], wallet_tags:["smart_money","whales","kol"]});
      add("liquidity", "token.liquidity-ohlc", {...token, resolution:a.liqResolution, count:a.liqCandles, time:a.to});
    }
    notes.push("Reconstructed from the supplied Token DD Score specification, not original Python source. Default weights only; undefined pace, LST and canonical-mint checks are not invented. Scores across modes or different coverage are not comparable. OHLC pricing is provisional.");
  } else if (kind === "trending-list") {
    if (a.listSource === "trending") add("trending", "market.trending", {interval: a.interval, sort_by: a.sortBy === "volume" ? "volumeUSD" : a.sortBy, sort_type: a.sortBy === "rank" ? "asc" : "desc", limit: a.scanLimit});
    else add("tokens", "market.token-list", {sort_by: a.sortBy === "volume" ? `volume_${a.interval}_usd` : a.sortBy === "trade_count" ? `trade_${a.interval}_count` : a.sortBy, limit: a.scanLimit, ...(a.platform ? {platform_name: a.platform} : {})});
  } else if (kind === "smart-wallets") {
    add("smart-tokens", "market.smart-money", {interval: "1d", limit: Math.min(20, a.scanLimit)});
    add("traders", "token.top-traders", {time_frame: "30d", limit: 10}, {from: ["smart-tokens"], kind: "token", take: a.limit!});
    const selected: Step["subjects"] = {from: ["traders"], kind: "wallet", take: a.limit!};
    if (a.skillDepth !== "fast") summary("pnl", undefined, "30d", selected);
    if (a.skillDepth === "deep") {holdings("holdings", undefined, selected); details("pnl-details", undefined, selected);}
    notes.push("Wallets are deduplicated in provider order across selected token pages. Per-token top-trader totals are not a wallet-wide win rate or PnL.");
  } else if (kind === "token-dd") {
    security();
    add("flow", "token.money-flow", {token_address: a.address, frames: ["24h"], wallet_tags: ["smart_money"]});
    if (a.include.includes("list")) holders();
    if (a.include.includes("advanced_security")) profile();
    if (a.include.includes("risk_history")) liquidity();
    notes.push("The reference SEC/SMKT/ACT/VOL composite is not emitted: money-flow scopes and missing security observations cannot establish a comparable safety score.");
  } else if (kind === "contract-dd") {
    security();
    add("distribution", "token.holder-distribution", {token_address: a.address, mode: "top", top_n: 10, address_type: "wallet"});
    if (!a.skipKline) candles();
    notes.push("No Safe tier or composite safety score is produced: absent mint, honeypot or LP-lock evidence must not be treated as a passed check.");
  } else if (kind === "rugcheck-audit") {
    security(); holders(); profile(); liquidity();
    notes.push("Liquidity history uses measured liquidity_usd snapshots. Price falls are never substituted for liquidity withdrawal; no undocumented risk-history endpoints are probed.");
  } else if (kind === "kline-pattern") candles();
  else if (kind === "smart-money-leaderboard") {
    a.wallets!.forEach((wallet, i) => {summary(`wallet-${i+1}-7d`, wallet, "7d"); summary(`wallet-${i+1}-30d`, wallet, "30d"); details(`wallet-${i+1}-positions`, wallet);});
  } else {
    if (kind === "wallet-analysis") a.intervals.forEach(duration => summary(`pnl-${duration}`, a.address, duration));
    else if (kind === "smart-money-profile") {summary("pnl7", a.address, "7d"); summary("pnl30", a.address, "30d");}
    else if (kind === "wallet-score") {summary("pnl30", a.address, "30d"); summary("pnl90", a.address, "90d"); summary("pnl24", a.address, "24h");}
    else summary("pnl", a.address, a.duration);
    if (!a.skipPositions) details("pnl-details", a.address);
    if (!a.skipPortfolio && kind !== "wallet-style") holdings("holdings", a.address);
    funded();
    if (kind === "wallet-analysis" || kind === "wallet-style") transactions();
    if (kind === "smart-money-profile") {
      if (!a.skipTransactions) add("trades", "portfolio.trades", {address: a.address, after_time: a.from, before_time: a.to, limit: 100});
      add("net-worth-history", "portfolio.net-worth-history", {wallet: a.address, time: String(a.to), count: 30});
    }
    if (kind === "wallet-score") notes.push("Alpha uses fixed 30d/90d windows and a 30d position page. Editing these scopes makes the alpha comparison unavailable. First funding measures provenance, not proven wallet age.");
  }
}
