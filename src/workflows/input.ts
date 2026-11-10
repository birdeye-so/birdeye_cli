import { z } from "zod";
import {
  address,
  amount,
  timestamp,
  duration,
  flowFrames,
} from "../schemas.js";
import { priceSurgeSchema } from "../price-surge/schema.js";

export const workflowInputSchema = z
  .object({
    priceSurge: priceSurgeSchema.optional(),
    launchSort: z
      .enum([
        "volume_24h_usd",
        "liquidity",
        "market_cap",
        "creation_time",
        "graduated_time",
        "progress_percent",
      ])
      .default("volume_24h_usd"),
    statsFrames: z
      .array(z.enum(flowFrames))
      .min(1)
      .max(8)
      .refine(
        (v) => new Set(v).size === v.length,
        "Stats frames must be unique",
      )
      .default(["1h", "24h"]),
    traderWindow: z
      .enum([
        "30m",
        "1h",
        "2h",
        "4h",
        "6h",
        "8h",
        "12h",
        "24h",
        "2d",
        "3d",
        "7d",
        "14d",
        "30d",
        "60d",
        "90d",
        "all_time",
      ])
      .default("24h"),
    traderSort: z
      .enum([
        "volume_usd",
        "trade",
        "total_pnl",
        "realized_pnl",
        "unrealized_pnl",
        "hold_volume",
      ])
      .default("volume_usd"),
    trackerFrame: z
      .enum(["1m", "5m", "15m", "30m", "1h", "4h", "1D"])
      .default("1h"),
    includeExited: z.boolean().default(false),
    signalThresholdUsd: amount.default(0),
    kind: z.string(),
    address: address.optional(),
    limit: z.number().int().min(1).max(5).optional(),
    scanLimit: z.number().int().min(1).max(50).default(50),
    interval: z.enum(["1h", "4h", "24h"]).default("24h"),
    depth: z.enum(["core", "full"]).default("core"),
    duration: duration.exclude(["all"]).default("30d"),
    pnlMethod: z.enum(["wac", "net_cash"]).default("wac"),
    from: timestamp.optional(),
    to: timestamp.optional(),
    stage: z
      .enum(["newly-listed", "newly-created", "near-graduation", "graduated"])
      .default("newly-created"),
    source: z
      .enum([
        "all",
        "pump_dot_fun",
        "moonshot",
        "raydium_launchlab",
        "meteora_dynamic_bonding_curve",
      ])
      .default("all"),
    minProgress: z.number().gt(0).lt(100).optional(),
    minLiquidity: amount.optional(),
    maxTop10Pct: amount.max(100).optional(),
    excludeFreezeable: z.boolean().default(false),
    baselineLiquidity: z.number().positive().optional(),
    baselineTime: timestamp.optional(),
    stepOverrides: z
      .record(z.string().min(1).max(64), z.record(z.string(), z.unknown()))
      .default({}),
    wallets: z.array(address).min(1).max(10).optional(),
    intervals: z
      .array(duration)
      .min(1)
      .max(5)
      .refine(
        (values) => new Set(values).size === values.length,
        "Intervals must be unique",
      )
      .default(["24h", "7d", "30d", "90d", "all"]),
    skillDepth: z.enum(["fast", "standard", "deep"]).default("fast"),
    ddMode: z.enum(["standard", "advanced"]).default("advanced"),
    topN: z.number().int().min(10).max(50).default(50),
    liqResolution: z
      .enum(["1m", "5m", "15m", "30m", "1h", "4h", "1D"])
      .default("15m"),
    liqCandles: z.number().int().min(1).max(100).default(96),
    listSource: z.enum(["v3-list", "trending"]).default("v3-list"),
    sortBy: z
      .enum([
        "volume",
        "liquidity",
        "market_cap",
        "holder",
        "trade_count",
        "rank",
      ])
      .default("volume"),
    platform: z.string().min(1).max(100).optional(),
    resolution: z
      .enum(["1m", "5m", "15m", "30m", "1H", "4H", "1D"])
      .default("15m"),
    windowDays: z.number().int().min(1).max(30).default(7),
    include: z
      .array(z.enum(["list", "advanced_security", "risk_history"]))
      .default([]),
    skipKline: z.boolean().default(false),
    skipPortfolio: z.boolean().default(false),
    skipFirstFunded: z.boolean().default(false),
    skipTransactions: z.boolean().default(false),
    skipPositions: z.boolean().default(false),
  })
  .strict();
export type WorkflowInput = z.infer<typeof workflowInputSchema>;
