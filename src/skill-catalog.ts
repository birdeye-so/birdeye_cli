import { z } from "zod";
import type { Entry } from "./catalog.js";
import { address, timestamp, amount, direction, page, validPage } from "./schemas.js";
import {surgeChains, tokenListSchema} from "./price-surge/schema.js";
const list = z.array(z.record(z.string(), z.unknown()));
export const skillCatalog = {
  "token.liquidity-ohlc": {
    path: "/defi/v3/liquidity/ohlc/token", cost: 30, provisional: true,
    description: "Liquidity and exit-liquidity candles; provisional 30 CU from DD specification",
    warnings: ["OHLC CU is provisional: the DD specification states 30 CU, while provider pricing documentation still describes resolution-dependent pricing. This estimate is not a verified upper bound or confirmed bill."],
    schema: z.object({address, resolution: z.enum(["1m","5m","15m","30m","1h","4h","1D"]).default("15m"), time: timestamp, direction: z.literal("back").default("back"), count: z.number().int().min(1).max(100).default(96)}).strict(),
    dataSchema: z.object({items: list}).passthrough(),
  },
  "market.token-list": {
    path: "/defi/v3/token/list", cost: 50, paginated: true,
    chains: surgeChains,
    description: "Token discovery ranked by market data, with optional platform filter",
    schema: tokenListSchema,
    dataSchema: z.object({items: list}).passthrough(),
  },
  "token.liquidity-history": {
    path: "/defi/v3/liquidity/history/token", cost: 600, provisional: true,
    costFor: p => ({"1m": 20, "4h": 50, "1D": 200}[p.resolution as "1m" | "4h" | "1D"] * 3),
    description: "Historical liquidity snapshots; reserve maximum lookback multiplier for chosen resolution",
    warnings: ["CU reserves 3× resolution base (maximum documented lookback multiplier); count is capped at 100. These are liquidity snapshots, not price proxies or proof of withdrawals."],
    schema: z.object({address, resolution: z.enum(["1m", "4h", "1D"]).default("4h"), time: timestamp, direction: z.enum(["back", "forward"]).default("back"), count: z.number().int().min(1).max(100).default(6)}).strict(),
    dataSchema: z.object({items: list}).passthrough(),
  },
  "portfolio.first-funded": {
    path: "/wallet/v2/tx/first-funded", method: "POST", cost: 40,
    description: "First funding transaction for one wallet (not proof of wallet creation time)",
    schema: z.object({wallet: address}).strict(),
    requestBody: p => ({wallets: [p.wallet]}),
    dataSchema: z.record(z.string(), z.unknown()),
  },
  "portfolio.net-worth-history": {
    path: "/wallet/v2/net-worth", cost: 50,
    description: "Wallet net-worth snapshots; deposits and withdrawals affect this series",
    schema: z.object({wallet: address, time: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, "Use YYYY-MM-DD HH:mm:ss in UTC").refine(value => z.iso.datetime().safeParse(value.replace(" ", "T") + "Z").success, "Use a valid UTC date and time"), type: z.enum(["1h", "1d"]).default("1d"), count: z.number().int().min(1).max(90).default(30), direction: z.enum(["back", "forward"]).default("back"), sort_type: direction.default("desc")}).strict(),
    dataSchema: z.object({history: list}).passthrough(),
  },
  "portfolio.transactions": {
    path: "/v1/wallet/tx_list", cost: 50, paginated: true, rowsKey: "solana",
    description: "One page of wallet transactions, including non-trade activity",
    schema: z.object({wallet: address, limit: z.number().int().min(1).max(100).default(100), before: z.string().min(1).max(128).optional(), ui_amount_mode: z.enum(["raw", "scaled"]).default("raw")}).strict(),
    dataSchema: z.object({solana: list}).passthrough(),
  },
} satisfies Record<string, Entry>;
