import {z} from "zod";
import {amount, direction, page, timestamp, validPage} from "../schemas.js";

export const surgeIntervals = ["1m", "5m", "30m", "1h", "2h", "4h", "8h", "24h", "7d", "30d"] as const;
// Arbitrum is in the product brief, but is absent from Token List V3's contract.
export const surgeChains = ["solana", "bsc", "base", "ethereum", "robinhood"] as const;
const count = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER);
export const priceSurgeSchema = z.object({
  chain: z.enum(surgeChains).default("solana"),
  interval: z.enum(surgeIntervals).default("1h"),
  mode: z.enum(["standard", "advanced"]).default("standard"),
  min_price_change: z.number().finite().default(50),
  min_market_cap: amount.optional(), max_market_cap: amount.optional(),
  min_liquidity: amount.default(10000), max_liquidity: amount.optional(),
  min_volume: amount.default(5000), min_trade_count: count.optional(), min_holders: count.optional(),
  platform: z.string().trim().min(1).max(100).optional(),
  sort_by: z.enum(["price_change", "volume", "market_cap", "liquidity", "trade_count", "holder"]).default("price_change"),
  sort_type: direction.default("desc"), ...page(100, 10),
  top: z.number().int().min(0).max(100).default(10),
  with_security: z.boolean().default(false), no_auto_filter: z.boolean().default(false),
  no_holder_health: z.boolean().default(false),
  max_liq_mcap_ratio: amount.default(0.005), max_trades_per_wallet: amount.default(150),
  max_dev_hold_pct: amount.max(100).optional(), max_top10_pct: amount.max(100).optional(),
  min_kol_buyers: count.optional(),
}).strict().superRefine((p, ctx) => {
  if (!validPage(p)) ctx.addIssue({code: "custom", message: "offset + limit must be <= 10000"});
  for (const field of ["market_cap", "liquidity"] as const) {
    const min = p[`min_${field}`], max = p[`max_${field}`];
    if (min !== undefined && max !== undefined && min > max)
      ctx.addIssue({code: "custom", path: [`max_${field}`], message: "Maximum must be at least the minimum"});
  }
  if (p.mode === "standard" && p.with_security)
    ctx.addIssue({code: "custom", path: ["with_security"], message: "Security hydration requires mode advanced"});
});
export type PriceSurgeParams = z.infer<typeof priceSurgeSchema>;

const windowFilters = Object.fromEntries(surgeIntervals.flatMap(frame => [
  [`min_volume_${frame}_usd`, amount.optional()],
  [`min_volume_${frame}_change_percent`, z.number().finite().optional()],
  [`min_price_change_${frame}_percent`, z.number().finite().optional()],
  [`min_trade_${frame}_count`, count.optional()],
]));
const sortFields = ["liquidity", "market_cap", "fdv", "holder", "recent_listing_time", "last_trade_unix_time", "global_fees_paid",
  ...surgeIntervals.flatMap(frame => [`volume_${frame}_usd`, `volume_${frame}_change_percent`, `price_change_${frame}_percent`, `trade_${frame}_count`])];
export const tokenListSchema = z.object({
  sort_by: z.enum(sortFields as [string, ...string[]]).default("volume_24h_usd"), sort_type: direction.default("desc"),
  platform_name: z.string().trim().min(1).max(100).optional(),
  min_liquidity: amount.optional(), max_liquidity: amount.optional(),
  min_market_cap: amount.optional(), max_market_cap: amount.optional(), min_fdv: amount.optional(), max_fdv: amount.optional(),
  min_recent_listing_time: timestamp.optional(), max_recent_listing_time: timestamp.optional(),
  min_last_trade_unix_time: timestamp.optional(), max_last_trade_unix_time: timestamp.optional(),
  min_holder: count.optional(), min_global_fees_paid: amount.optional(),
  ...windowFilters, ...page(100, 20), ui_amount_mode: z.enum(["raw", "scaled"]).optional(),
}).strict().refine(validPage, "offset + limit must be <= 10000").superRefine((p, ctx) => {
  for (const field of ["liquidity", "market_cap", "fdv", "recent_listing_time", "last_trade_unix_time"] as const) {
    const min = p[`min_${field}`], max = p[`max_${field}`];
    if (min !== undefined && max !== undefined && min > max)
      ctx.addIssue({code: "custom", path: [`max_${field}`], message: "Maximum must be at least the minimum"});
  }
});
