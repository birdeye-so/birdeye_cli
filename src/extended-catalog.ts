import { z } from "zod";
import type { Entry } from "./catalog.js";
import { address, timestamp, amount, direction, holderTags, trackerTags, flowFrames, pnlFields, page, validPage } from "./schemas.js";
import {tokenAddress as multiChainAddress} from "./schemas.js";
import {surgeChains} from "./price-surge/schema.js";

const record = z.record(z.string(), z.unknown());
const list = z.array(record);
const envelopeList = (key = "items") => z.object({ [key]: list }).passthrough();
const token = z.object({ address }).strict();
const tokenAddress = { token_address: address };
const uiMode = z.enum(["raw", "scaled"]).default("raw");
const tracked = {
  ...tokenAddress, time_from: timestamp, time_to: timestamp,
  time_frame: z.enum(["1s", "5s", "15s", "30s", "1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "1D", "1W", "1M"]).default("1h"),
  tags: z.array(z.enum(trackerTags)).min(1).max(4).default(["dev", "sniper", "smart_trader", "kol"]),
  top_10_holder: z.boolean().default(false),
};
const validRange = (p: {time_from: number; time_to: number; time_frame: string}) => {
  const days = p.time_frame.endsWith("s") ? 30 : p.time_frame.endsWith("m") ? 60 : p.time_frame.endsWith("h") ? 90 : 365;
  return p.time_to > p.time_from && p.time_to - p.time_from <= days * 86400;
};
const cohortWarning = "Birdeye labels are provider-specific and may overlap; never sum cohort shares without deduplicating wallets.";
const pnlWarning = "PnL depends on duration, position_scope and pnl_method; protocol backfill may be incomplete. Win rate covers fully realized tokens.";

export const extendedCatalog = {
  "token.search": {
    path: "/defi/v3/search", cost: 3, paginated: true,
    description: "Find token candidates by name/symbol; confirm the contract before research",
    schema: z.object({ keyword: z.string().trim().min(1).max(200), chain: z.literal("solana").default("solana"), target: z.literal("token").default("token"), search_mode: z.enum(["exact", "fuzzy"]).default("exact"), search_by: z.enum(["combination", "address", "name", "symbol"]).default("symbol"), sort_by: z.enum(["liquidity", "volume_24h_usd", "marketcap"]).default("volume_24h_usd"), sort_type: direction.default("desc"), ...page(20) }).strict().refine(validPage, "offset + limit must be <= 10000"),
    dataSchema: envelopeList(),
  },
  "token.markets": {
    path: "/defi/v2/markets", cost: 25, paginated: true,
    description: "One page of pools for a token; liquidity is not an executable quote",
    schema: z.object({ address, sort_by: z.enum(["liquidity", "volume24h"]).default("liquidity"), sort_type: direction.default("desc"), ...page(20, 10) }).strict().refine(validPage), dataSchema: envelopeList(),
  },
  "market.pair-overview": {
    path: "/defi/v3/pair/overview/single", cost: 15,
    description: "Pair-level price, liquidity and activity; requires a pair address",
    schema: z.object({ address, ui_amount_mode: uiMode }).strict(), dataSchema: record,
  },
  "token.trade-data": {
    path: "/defi/v3/token/trade-data/single", cost: 12,
    description: "Token buy/sell activity and unique-wallet metrics for selected frames",
    schema: z.object({ address, frames: z.array(z.enum([...flowFrames, "6h", "12h"])).min(1).max(10).default(["1h", "24h"]), ui_amount_mode: uiMode }).strict(), dataSchema: record,
  },
  "token.holder-profile": {
    path: "/token/v1/holder-profile", cost: 30,
    description: "Labeled holder cohorts and supply shares; volume window is 1h",
    schema: z.object({ ...tokenAddress, interval: z.literal("1h").default("1h"), ui_amount_mode: uiMode, include_zero_balance: z.boolean().default(false) }).strict(),
    dataSchema: z.object({ token: record, holder_summary: record, tags: list }).passthrough(), warnings: [cohortWarning],
  },
  "token.holder-positions": {
    path: "/token/v1/holder-positions", cost: 30, paginated: true, rowsKey: "$",
    description: "One page of exact wallet positions for explicit holder labels",
    schema: z.object({ ...tokenAddress, labels: z.array(z.enum(holderTags)).min(1).max(6), sort_by: z.literal("amount").default("amount"), order_type: direction.default("desc"), ui_amount_mode: uiMode, include_zero_balance: z.boolean().default(false), ...page(50, 10) }).strict().refine(validPage), dataSchema: list, warnings: [cohortWarning],
  },
  "token.holder-distribution": {
    path: "/holder/v1/distribution", cost: 30, paginated: true, rowsKey: "holders",
    description: "Supply distribution by top holders or supply-share range",
    schema: z.object({ ...tokenAddress, address_type: z.enum(["wallet", "token_account"]).default("wallet"), mode: z.enum(["top", "percent"]).default("top"), top_n: z.number().int().min(1).max(10000).optional(), min_percent: amount.max(100).optional(), max_percent: amount.max(100).optional(), include_list: z.boolean().default(true), ...page(50, 10) }).strict().refine(validPage).refine(p => p.mode === "top" ? p.min_percent === undefined && p.max_percent === undefined : p.top_n === undefined && p.min_percent !== undefined && p.max_percent !== undefined && p.min_percent <= p.max_percent, "Use top_n only in top mode; percent mode requires ordered min/max_percent"),
    dataSchema: z.object({ summary: record, holders: list.optional() }).passthrough(),
  },
  "token.first-buyers": {
    path: "/token/v1/first-buyers", cost: 25, paginated: true, rowsKey: "buyers",
    description: "One page of the first 1000 buyers; status is relative to first-buy holdings",
    schema: z.object({ ...tokenAddress, ...page(100, 70) }).strict().refine(p => p.offset + p.limit <= 1000, "offset + limit must be <= 1000"),
    dataSchema: z.object({ buyers: list, page_summary: record }).passthrough(), warnings: ["Buyer status summary covers this page only, not all holders."],
  },
  "token.tags-tracker": {
    path: "/token/v1/wallet-tags-tracker", cost: 30, paginated: true,
    description: "Token cohort timeline; only tag_combinations are disjoint",
    schema: z.object({ ...tracked, include_tag_combinations: z.boolean().default(true) }).strict().refine(validRange, "Invalid or excessive tracker range"),
    dataSchema: z.object({ groups: record }).passthrough(), warnings: [cohortWarning, "Tracker excludes some high-cost tokens, including wSOL, USDC, USDT and BONK. Empty activity buckets are omitted."],
  },
  "token.tags-tracker-details": {
    path: "/token/v1/wallet-tags-tracker/details", cost: 30, paginated: true,
    description: "Wallet-level evidence for cohort timeline buckets",
    schema: z.object({ ...tracked, wallets: z.array(address).min(1).max(50).optional(), min_volume_usd: amount.default(0), limit_wallet: z.number().int().min(1).max(50).default(10), limit_bucket: z.number().int().min(1).max(300).default(100) }).strict().refine(validRange, "Invalid or excessive tracker range"), dataSchema: envelopeList(), warnings: [cohortWarning],
  },
  "token.money-flow": {
    path: "/defi/v3/token/money-flow", method: "POST", bareArray: true, cost: 10,
    description: "Buy/sell flow for smart_money, kol, whales or specified wallets; all means supported tags",
    schema: z.object({ ...tokenAddress, wallet_tags: z.array(z.enum(["all", "smart_money", "kol", "whales"])).min(1).max(4).default(["smart_money"]), frames: z.array(z.enum(flowFrames)).min(1).max(8).default(["24h"]), wallets: z.array(address).min(1).max(50).optional() }).strict().refine(p => !p.wallet_tags.includes("all") || p.wallet_tags.length === 1, "Use all alone to avoid overlapping cohort totals"), dataSchema: list,
  },
  "market.smart-money": {
    path: "/smart-money/v1/token/list", cost: 20, paginated: true, rowsKey: "$", bareArray: true, dataWithoutSuccess: true,
    description: "Tokens ranked by smart-money activity; not a wallet leaderboard",
    schema: z.object({ interval: z.enum(["1d", "7d", "30d"]).default("1d"), trader_style: z.enum(["all", "risk_averse", "risk_balancers", "trenchers"]).default("all"), sort_by: z.enum(["net_flow", "smart_traders_no", "market_cap"]).default("smart_traders_no"), sort_type: direction.default("desc"), ...page(20) }).strict().refine(validPage), dataSchema: list,
  },
  "market.new-listings": {
    path: "/defi/v2/tokens/new_listing", cost: 20, paginated: true,
    description: "New listings, not necessarily new mints; paginate explicitly with time_to",
    schema: z.object({ time_to: timestamp.optional(), limit: z.number().int().min(1).max(20).default(20), meme_platform_enabled: z.boolean().default(true) }).strict(), dataSchema: envelopeList(),
  },
  "market.meme-list": {
    path: "/defi/v3/token/meme/list", cost: 30, paginated: true,
    description: "Launchpad tokens filtered by creation time, graduation and progress",
    schema: z.object({ source: z.enum(["all", "pump_dot_fun", "moonshot", "raydium_launchlab", "meteora_dynamic_bonding_curve"]).default("all"), sort_by: z.enum(["progress_percent", "graduated_time", "creation_time", "liquidity", "market_cap", "recent_listing_time", "volume_24h_usd"]).default("creation_time"), sort_type: direction.default("desc"), graduated: z.boolean().optional(), min_progress_percent: z.number().gt(0).max(100).optional(), max_progress_percent: z.number().gt(0).lt(100).optional(), min_creation_time: timestamp.optional(), max_creation_time: timestamp.optional(), min_graduated_time: timestamp.optional(), max_graduated_time: timestamp.optional(), min_liquidity: amount.optional(), min_volume_24h_usd: amount.optional(), ...page(100, 20) }).strict().refine(validPage).refine(p => (p.min_creation_time === undefined || p.max_creation_time === undefined || p.min_creation_time <= p.max_creation_time) && (p.min_graduated_time === undefined || p.max_graduated_time === undefined || p.min_graduated_time <= p.max_graduated_time) && (p.min_progress_percent === undefined || p.max_progress_percent === undefined || p.min_progress_percent <= p.max_progress_percent), "Minimum filters must not exceed maximum filters"), dataSchema: envelopeList(),
  },
  "token.meme-detail": {
    path: "/defi/v3/token/meme/detail/single", cost: 15, description: "Launch metadata for one meme token; venue coverage varies", schema: token, dataSchema: record,
  },
  "market.chain-metrics": {
    path: "/market/v1/blockchain-metrics", cost: 40, paginated: true,
    description: "Daily chain aggregates and end-of-bucket stablecoin market cap",
    schema: z.object({ time_frame: z.literal("1D").default("1D"), time: timestamp.optional(), direction: z.enum(["backward", "forward"]).default("backward"), count: z.number().int().min(1).max(10).default(2) }).strict(), dataSchema: envelopeList(),
  },
  "portfolio.pnl-summary": {
    path: "/wallet/v2/pnl/summary", cost: 20, description: "Wallet realized/unrealized PnL with explicit accounting and duration",
    schema: z.object(pnlFields).strict(), dataSchema: z.object({ summary: record }).passthrough(), warnings: [pnlWarning],
  },
  "portfolio.pnl-details": {
    path: "/wallet/v2/pnl/details", method: "POST", cost: 30, paginated: true, rowsKey: "tokens",
    description: "One page of per-token PnL and a summary scoped by request filters",
    schema: z.object({ ...pnlFields, token_addresses: z.array(address).min(1).max(100).optional(), sort_by: z.literal("last_trade").default("last_trade"), sort_type: direction.default("desc"), ...page(100, 20) }).strict().refine(validPage), dataSchema: z.object({ summary: record, tokens: list }).passthrough(), warnings: [pnlWarning],
  },
  "portfolio.trades": {
    path: "/trader/txs/seek_by_time", cost: 10, paginated: true,
    description: "One page of wallet trades before or after one time cursor; not transfer history",
    schema: z.object({ address, after_time: timestamp.optional(), before_time: timestamp.optional(), tx_type: z.enum(["swap", "add", "remove", "all"]).default("swap"), ui_amount_mode: uiMode, ...page(100) }).strict().refine(validPage).refine(p => (p.after_time !== undefined) !== (p.before_time !== undefined), "Provide exactly one of before_time or after_time"), dataSchema: envelopeList(),
  },
  "market.trader-ranking": {
    path: "/trader/gainers-losers", cost: 25, paginated: true,
    description: "Discover wallets by realized PnL or provider trader score, not wealth",
    schema: z.object({ type: z.enum(["yesterday", "today", "1W", "30d", "90d"]).default("30d"), sort_by: z.enum(["PnL", "realized_pnl", "unrealized_pnl", "trader_score"]).default("realized_pnl"), min_trade: z.number().int().min(0).optional(), min_realized_pnl: z.number().min(1000).optional(), ...page(100, 5) }).strict().refine(validPage), dataSchema: envelopeList(),
  },
  "token.top-traders": {
    path: "/defi/v2/tokens/top_traders", cost: 30, paginated: true,
    chains: surgeChains,
    description: "Token traders with optional wallet tags; highest volume does not imply highest skill",
    schema: z.object({ address: multiChainAddress, time_frame: z.enum(["30m", "1h", "2h", "4h", "6h", "8h", "12h", "24h", "2d", "3d", "7d", "14d", "30d", "60d", "90d", "all_time"]).default("24h"), sort_by: z.enum(["volume", "trade", "total_pnl", "unrealized_pnl", "realized_pnl", "volume_usd", "hold_volume"]).default("realized_pnl"), sort_type: direction.default("desc"), wallet_tags: z.array(z.enum(["dev", "bundler", "sniper", "insider", "smart_trader"])).min(1).max(5).optional(), ui_amount_mode: uiMode, get_holders_networth: z.boolean().default(false), ...page(10) }).strict().refine(validPage), dataSchema: envelopeList(),
  },
} satisfies Record<string, Entry>;
