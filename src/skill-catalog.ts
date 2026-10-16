import { z } from "zod";
import type { Entry } from "./catalog.js";
import { address, timestamp, amount, direction, page, validPage } from "./schemas.js";
const list = z.array(z.record(z.string(), z.unknown()));
export const skillCatalog = {
  "market.token-list": {
    path: "/defi/v3/token/list", cost: 50, paginated: true,
    description: "Token discovery ranked by market data, with optional platform filter",
    schema: z.object({sort_by: z.enum(["liquidity", "market_cap", "fdv", "holder", "volume_1h_usd", "volume_4h_usd", "volume_24h_usd", "trade_1h_count", "trade_4h_count", "trade_24h_count"]).default("volume_24h_usd"), sort_type: direction.default("desc"), platform_name: z.string().min(1).max(100).optional(), min_liquidity: amount.optional(), min_volume_1h_usd: amount.optional(), min_volume_4h_usd: amount.optional(), min_volume_24h_usd: amount.optional(), ...page(100, 20)}).strict().refine(validPage),
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
    schema: z.object({wallet: address, time: z.string().regex(/^\d+$/), type: z.enum(["1h", "1d"]).default("1d"), count: z.number().int().min(1).max(90).default(30), direction: z.enum(["back", "forward"]).default("back"), sort_type: direction.default("desc")}).strict(),
    dataSchema: z.object({history: list}).passthrough(),
  },
  "portfolio.transactions": {
    path: "/v1/wallet/tx_list", cost: 50, paginated: true, rowsKey: "solana",
    description: "One page of wallet transactions, including non-trade activity",
    schema: z.object({wallet: address, limit: z.number().int().min(1).max(100).default(100), before: z.string().min(1).max(128).optional(), ui_amount_mode: z.enum(["raw", "scaled"]).default("raw")}).strict(),
    dataSchema: z.object({solana: list}).passthrough(),
  },
} satisfies Record<string, Entry>;
