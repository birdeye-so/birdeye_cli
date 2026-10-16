import type { Operation } from "./catalog.js";
import type { caseKinds } from "./workflows.js";
import { skillInfo } from "./skill-recipes.js";

type Guide = { purpose: string; produces: string };
export const workflowGuides: Record<(typeof caseKinds)[number], Guide> = {
  ...skillInfo,
  "token-research": {
    purpose: "Understand a token before deciding whether to investigate further. Check its market activity, security observations and holder concentration together.",
    produces: "Price, liquidity, activity and holder evidence; full depth adds pools and labeled holder groups.",
  },
  "token-due-diligence": {
    purpose: "Check a token's identity and the security fields that could rule it out of your research shortlist.",
    produces: "An identity and security checklist with missing checks made explicit. This is not a safety verdict.",
  },
  "project-deep-report": {
    purpose: "Build an on-chain evidence report about a token's market, ownership and price behavior.",
    produces: "Token and pool snapshots, holder groups, price candles and trading activity. Team, funding and social claims are outside this report.",
  },
  "wallet-analysis": {
    purpose: "Understand what a wallet holds, how its positions performed and what it traded in the chosen period.",
    produces: "Observed holdings, PnL and a page of trades. Full depth adds per-token PnL and token screening.",
  },
  "smart-money-profile": {
    purpose: "Research a supplied wallet or discover traders by realized PnL, then compare performance across time windows.",
    produces: "Holdings, two PnL snapshots and recent trades per wallet. Provider performance is not a copy-trading return estimate.",
  },
  "risk-warning": {
    purpose: "Review security and ownership observations that need attention before continuing token research.",
    produces: "A point-in-time risk checklist; full depth adds labeled positions and trading timelines. This is not a continuous alert service.",
  },
  "early-project-screening": {
    purpose: "Find tokens at a chosen launch stage and screen a bounded shortlist for liquidity, security and holder-group evidence.",
    produces: "Launch candidates, selection reasons and per-token checks. Newly listed and newly created describe different events.",
  },
  "daily-brief": {
    purpose: "Prepare a market briefing from short and daily trending windows, then inspect a few selected tokens.",
    produces: "Trending samples and token checks; full depth adds chain activity, smart-money tokens and launches. An optional wallet adds holdings.",
  },
  "market-opportunities": {
    purpose: "Scan trending tokens and prioritize a small research shortlist by observed 24h USD volume.",
    produces: "Deduplicated candidates with liquidity and security checks; full depth adds labeled money flow and holder groups. No trades are executed.",
  },
  "market-shortlist": {
    purpose: "Quickly inspect the first few tokens in the provider's trending order.",
    produces: "A small trending list enriched with security and market snapshots. This recipe keeps provider order.",
  },
  "wallet-exposure": {
    purpose: "See how a wallet's observed asset value is distributed across the holdings page you fetch.",
    produces: "Asset values and relative weights for that page. Balances do not measure investment returns.",
  },
};

type StepGuide = { title: string; purpose: string; collects: string };
export const stepGuides: Partial<Record<Operation, StepGuide>> = {
  "token.top-traders": {title: "Token traders", purpose: "Find wallets trading each selected token, then deduplicate a wallet shortlist.", collects: "One page of traders for each token and time window. Token-scoped PnL is not wallet-wide PnL."},
  "token.holder-distribution": {title: "Holder distribution", purpose: "Inspect concentration in a defined holder segment.", collects: "Distribution summary and optional holder rows for the requested top-N or percentage range."},
  "market.token-list": {title: "Token discovery", purpose: "Rank a token sample by the selected market metric and platform.", collects: "One page of token price, market cap, liquidity, activity and holder data."},
  "token.liquidity-history": {title: "Historical liquidity", purpose: "Measure liquidity changes from actual liquidity snapshots.", collects: "Timestamped liquidity_usd levels; no price-based liquidity proxy. Each response contains up to 100 snapshots."},
  "portfolio.first-funded": {title: "First funding", purpose: "Inspect wallet funding provenance.", collects: "First recorded funding transaction and timestamp. This is not necessarily wallet creation time."},
  "portfolio.transactions": {title: "Transaction page", purpose: "Inspect recent wallet activity alongside PnL evidence.", collects: "One page of Solana transactions, including non-trade events. A page is not a complete trade history."},
  "portfolio.net-worth-history": {title: "Net-worth history", purpose: "Observe wallet value changes across daily snapshots.", collects: "Net-worth levels affected by trades, prices, deposits and withdrawals; not a PnL curve."},
  "token.overview": { title: "Market snapshot", purpose: "Confirm token identity and assess market size and liquidity before further checks.", collects: "Price, liquidity, 24h volume and price change." },
  "token.security": { title: "Security checks", purpose: "Inspect token controls and concentration; apply your screening criteria before dependent work.", collects: "Freezeability, mutable metadata and top-10 token-account share, when available." },
  "token.holders": { title: "Top holders", purpose: "Inspect the largest observed holders and the concentration within the fetched page.", collects: "One page of balances by wallet or token account, according to the selected mode." },
  "token.markets": { title: "Trading pools", purpose: "Find the token's pools and choose the first eligible pair for a closer look.", collects: "One page of pools ranked by the requested liquidity or volume field." },
  "market.pair-overview": { title: "Selected pool", purpose: "Inspect trading conditions at the selected pool rather than only at token level.", collects: "Pair price, liquidity and trading activity. This is not an executable quote." },
  "token.holder-profile": { title: "Holder groups", purpose: "Identify labeled holder cohorts that may warrant further ownership research.", collects: "Holdings, supply shares and activity for Birdeye-labeled cohorts. Groups can overlap." },
  "market.ohlcv": { title: "Price history", purpose: "Inspect price and volume behavior over the selected observation window.", collects: "OHLCV candles. The derived return currently uses closed 1H candles only; other intervals retain raw data." },
  "token.trade-data": { title: "Trading activity", purpose: "Add buy and sell activity to the market snapshot.", collects: "Provider trading-volume and activity windows for this token." },
  "token.holder-positions": { title: "Labeled positions", purpose: "Inspect positions held by selected groups, including exited positions if requested.", collects: "A page of labeled holders, balances and position observations." },
  "token.tags-tracker": { title: "Group activity timeline", purpose: "Observe how labeled groups traded during the chosen period.", collects: "Time buckets for supported tags. Labels and coverage follow Birdeye definitions." },
  "token.tags-tracker-details": { title: "Wallet activity details", purpose: "Inspect the wallets behind the group activity timeline.", collects: "A page of wallet activity for the selected tags and time range." },
  "portfolio.holdings": { title: "Current holdings", purpose: "Measure observed asset exposure and, where relevant, supply token candidates to later steps.", collects: "One page of assets and values. Portfolio weights cover this page only." },
  "portfolio.pnl-summary": { title: "PnL summary", purpose: "Measure realized and unrealized performance using the selected period and accounting method.", collects: "PnL, trade counts and provider win rate for the requested position scope." },
  "portfolio.pnl-details": { title: "PnL by token", purpose: "Identify which observed token positions contributed to performance.", collects: "A page of per-token PnL and a summary scoped by the request filters." },
  "portfolio.trades": { title: "Recent trades", purpose: "Inspect trading behavior within the requested time window.", collects: "One page of swaps or selected trade types. This is not complete transfer history." },
  "market.trader-ranking": { title: "Discover traders", purpose: "Select wallets by the requested performance ranking for subsequent analysis.", collects: "A page of trader wallets ranked by PnL or provider score, not wallet wealth." },
  "market.new-listings": { title: "New listings", purpose: "Find recently listed tokens; retain those inside the workflow observation window.", collects: "A page of listing events. Listing time does not establish token creation time." },
  "market.meme-list": { title: "Launch candidates", purpose: "Discover tokens using launch venue, stage and time filters.", collects: "A page of launch tokens, liquidity and available progress or graduation fields." },
  "market.trending": { title: "Trending candidates", purpose: "Find an initial market sample to rank and screen in later steps.", collects: "One page of provider trending tokens for the selected rolling window." },
  "market.chain-metrics": { title: "Chain activity", purpose: "Add chain-wide activity context to the market briefing.", collects: "Daily activity buckets, trading volume and stablecoin market-cap observations." },
  "market.smart-money": { title: "Smart-money token list", purpose: "See tokens present in Birdeye's smart-money activity list.", collects: "One page of tokens for the requested provider interval." },
  "token.money-flow": { title: "Labeled money flow", purpose: "Compare buying and selling by cohort within matching time frames.", collects: "Buy/sell values and trader counts. Derived net flow retains provider units; overlapping cohorts are kept separate." },
};
