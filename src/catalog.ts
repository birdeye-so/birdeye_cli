import { z } from "zod";
import { AppError, type Data } from "./shared.js";
import { address, evmAddress, tokenAddress } from "./schemas.js";
import { surgeChains } from "./price-surge/schema.js";
import { extendedCatalog } from "./extended-catalog.js";
import { skillCatalog } from "./skill-catalog.js";

const positive = (max: number, fallback: number) =>
  z.coerce.number().int().min(1).max(max).default(fallback);
const offset = z.coerce.number().int().min(0).max(10000).default(0);
const token = z.object({ address }).strict();
// Snapshot plus the two endpoint-page CU corrections documented in workflow-import-mapping.md.
export const PRICING_VERSION = "bds-2026-10-28-token-data-v1";
export type Entry = {
  chains?: readonly string[];
  method?: "GET" | "POST";
  bareArray?: boolean;
  dataWithoutSuccess?: boolean;
  rowsKey?: string;
  dataSchema?: z.ZodType;
  warnings?: string[];
  path: string;
  cost: number;
  costFor?: (params: Data) => number;
  requestBody?: (params: Data) => Data;
  schema: z.ZodType;
  paginated?: boolean;
  description: string;
  provisional?: boolean;
};
export const catalog = {
  ...extendedCatalog,
  ...skillCatalog,
  "token.price": {
    path: "/defi/price",
    cost: 3,
    schema: token,
    description: "Latest token price in USD",
  },
  "token.overview": {
    path: "/defi/token_overview",
    cost: 18,
    costFor: (p: Data) => (p.includes === "money_flow" ? 21 : 18),
    schema: z
      .object({
        address,
        includes: z.literal("money_flow").optional(),
        frames: z
          .array(z.enum(["1m", "5m", "15m", "30m", "1h", "2h", "4h", "24h"]))
          .min(1)
          .max(8)
          .optional(),
      })
      .strict(),
    description: "Token price, liquidity and 24h activity",
  },
  "token.security": {
    path: "/defi/token_security",
    cost: 30,
    chains: surgeChains,
    schema: z.object({ address: tokenAddress }).strict(),
    dataSchema: z.record(z.string(), z.unknown()),
    description: "Upstream security observations",
  },
  "token.holders": {
    path: "/defi/v3/token/holder",
    cost: 30,
    schema: z
      .object({
        address,
        limit: positive(100, 10),
        offset,
        mode: z.enum(["wallet", "token_account"]).default("wallet"),
        get_holder_infos: z.boolean().optional(),
      })
      .strict()
      .refine(
        (p) => p.offset + p.limit <= 10000,
        "offset + limit must be <= 10000",
      ),
    paginated: true,
    description: "One page of token holders",
  },
  "market.trending": {
    path: "/defi/token_trending",
    cost: 25,
    schema: z
      .object({
        limit: positive(50, 20),
        offset,
        interval: z.enum(["1h", "4h", "24h"]).default("24h"),
        sort_by: z.enum(["rank", "volumeUSD", "liquidity"]).default("rank"),
        sort_type: z.enum(["asc", "desc"]).default("asc"),
      })
      .strict(),
    paginated: true,
    description: "One page of trending tokens",
  },
  "market.ohlcv": {
    path: "/defi/v3/ohlcv",
    cost: 100,
    schema: z
      .object({
        address,
        type: z
          .enum([
            "1s",
            "15s",
            "30s",
            "1m",
            "3m",
            "5m",
            "15m",
            "30m",
            "1H",
            "2H",
            "4H",
            "6H",
            "8H",
            "12H",
            "1D",
            "3D",
            "1W",
            "1M",
          ])
          .default("1H"),
        time_from: z.coerce.number().int().min(0).max(10_000_000_000),
        time_to: z.coerce.number().int().min(0).max(10_000_000_000),
      })
      .strict()
      .refine((p) => p.time_from < p.time_to, "time_from must precede time_to"),
    description: "OHLCV V3 range; reserve maximum documented tier (100 CU)",
    provisional: true,
  },
  "portfolio.holdings": {
    path: "/wallet/v2/current-net-worth",
    cost: 20,
    schema: z
      .object({
        wallet: address,
        limit: positive(100, 20),
        offset,
        sort_type: z.enum(["asc", "desc"]).default("desc"),
      })
      .strict(),
    paginated: true,
    description:
      "One page of Solana wallet assets (low liquidity excluded upstream)",
  },
  "usage.credits": {
    path: "/utils/v1/credits",
    cost: 1,
    schema: z.object({}).strict(),
    description: "Account-wide credit usage snapshot",
  },
  "chains.refresh": {
    path: "/defi/networks",
    cost: 1,
    schema: z.object({}).strict(),
    description: "Upstream supported networks; CLI MVP supports Solana",
  },
} satisfies Record<string, Entry>;
export type Operation = keyof typeof catalog;
export function prepare(
  operation: string,
  params: unknown = {},
  chain = "solana",
) {
  if (!Object.hasOwn(catalog, operation))
    throw new AppError("UNKNOWN_OPERATION", `Unknown operation: ${operation}`);
  const entry: Entry = catalog[operation as Operation];
  if (!(entry.chains ?? ["solana"]).includes(chain))
    throw new AppError(
      "UNSUPPORTED_CHAIN",
      `${operation} supports ${(entry.chains ?? ["solana"]).join(", ")}.${operation === "market.token-list" && chain === "arbitrum" ? " Arbitrum is not documented for Token List V3." : ""}`,
    );
  const result = entry.schema.safeParse(params);
  if (!result.success)
    throw new AppError(
      "INVALID_INPUT",
      result.error.issues
        .map((i) => `${i.path.join(".") || "input"}: ${i.message}`)
        .join("; "),
    );
  const values = result.data as Data;
  if (
    entry.chains &&
    values.address &&
    !(chain === "solana" ? address : evmAddress).safeParse(values.address)
      .success
  )
    throw new AppError("INVALID_INPUT", `Invalid token address for ${chain}.`);
  if (operation === "token.top-traders" && chain !== "solana") {
    if (
      values.wallet_tags ||
      values.get_holders_networth ||
      values.sort_by === "hold_volume" ||
      values.time_frame === "all_time"
    )
      throw new AppError(
        "INVALID_INPUT",
        "Holder metrics, wallet tags and all_time top traders require Solana.",
      );
    delete values.ui_amount_mode;
    delete values.get_holders_networth;
  }
  return {
    operation: operation as Operation,
    entry: entry.costFor
      ? { ...entry, cost: entry.costFor(result.data as Data) }
      : entry,
    params: result.data as Data,
    chain,
  };
}
export function capabilities() {
  return Object.entries(catalog).map(([operation, e]) => ({
    operation,
    chain: "solana",
    chains: (e as Entry).chains ?? ["solana"],
    method: (e as Entry).method || "GET",
    path: e.path,
    estimatedCu: e.cost,
    pricingStatus: "provisional" in e ? "provisional" : "verified",
    pricingVersion: PRICING_VERSION,
    description: e.description,
    inputSchema: z.toJSONSchema(e.schema),
  }));
}
