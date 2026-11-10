import { z } from "zod";
import { address, timestamp } from "./schemas.js";
import { planCase, dataRows } from "./workflows.js";
import { previewCase } from "./workflow-preview.js";
import { runCase, type Progress } from "./analysis.js";
import { decimal, type Data } from "./shared.js";
import type { Runner, Result } from "./runner.js";
import { securityEvidenceSections } from "./security-signals.js";

export const demoIds = [
  "terminal",
  "dex-inspector",
  "wallet-intelligence",
  "security-signals",
  "telegram-brief",
] as const;
export const demoInputSchema = z
  .object({
    id: z.enum(demoIds),
    address: z.preprocess(
      (value) =>
        typeof value === "string" ? value.trim() || undefined : value,
      address.optional(),
    ),
    limit: z.number().int().min(1).max(5).default(3),
    from: timestamp.optional(),
    to: timestamp.optional(),
    minLiquidity: z.number().finite().min(0).default(100000),
    maxTop10Pct: z.number().finite().min(0).max(100).default(50),
  })
  .strict()
  .refine(
    (p) =>
      (p.from === undefined) === (p.to === undefined) &&
      (p.from === undefined || p.from < p.to!),
    "Provide an ordered from/to pair, or neither",
  );
export type DemoInput = z.infer<typeof demoInputSchema>;
export const demoCatalog = [
  {
    id: "terminal",
    title: "Research terminal",
    audience: "Trading desks and token researchers",
    subject: "none",
    purpose:
      "Turn a trending page into a bounded watchlist with market and security evidence.",
    decision: "Choose which tokens deserve a deeper investigation.",
    output:
      "Token watchlist with price, liquidity, 24h volume and observed controls.",
    kind: "market-opportunities",
    limitation:
      "One discovery page and at most five enriched tokens. Manual snapshots; no streaming or trade execution.",
  },
  {
    id: "dex-inspector",
    title: "DEX token inspector",
    audience: "DEX interfaces and token detail pages",
    subject: "token",
    purpose:
      "Inspect a token and its pools before moving to a separate quote or execution system.",
    decision:
      "Compare reported liquidity and inspect the pool selected by the workflow.",
    output: "Token context, one page of pools and security observations.",
    kind: "token-research",
    limitation:
      "Pool liquidity is not executable depth, a swap quote, slippage simulation or route recommendation.",
  },
  {
    id: "wallet-intelligence",
    title: "Wallet intelligence",
    audience: "Trading platforms and portfolio dashboards",
    subject: "none",
    purpose:
      "Discover wallets trading smart-money-list tokens, then select a wallet to inspect its 7d/30d PnL and holdings.",
    decision:
      "Build an evidence-linked wallet shortlist before investigating performance and concentration.",
    output:
      "Smart-money tokens → deduplicated trader wallets → selected-wallet PnL and holdings.",
    kind: "skill-smart-wallets",
    limitation:
      "Discovery finds traders of smart-money-list tokens, not verified smart wallets. Provider order is not a performance ranking. Token-level PnL is not wallet-wide PnL; overlapping periods are never summed.",
  },
  {
    id: "security-signals",
    title: "Security signals",
    audience: "Token review desks and alerting products",
    subject: "token",
    purpose:
      "Review market activity, ownership concentration, token controls and holder wallets alongside configured risk checks.",
    decision: "Queue threshold breaches or missing evidence for manual review.",
    output:
      "Three configured checks, 38 supporting metrics and authority observations, plus a holder-wallet evidence table.",
    kind: "skill-contract-dd",
    limitation:
      "A snapshot of configured rules, not a safety verdict, contract audit or continuous monitor. Top-10 token accounts are not top-10 wallets.",
  },
  {
    id: "telegram-brief",
    title: "Telegram research brief",
    audience: "Community research bots and support channels",
    subject: "token",
    purpose:
      "Create a concise token briefing from a Token DD workflow for a messaging integration.",
    decision:
      "Answer a token lookup with timestamped evidence and explicit missing data.",
    output:
      "Plain-text message preview and export, backed by the full saved report.",
    kind: "skill-token-dd",
    limitation:
      "This demo generates the message locally. Telegram delivery, bot credentials, command routing and scheduling belong to your integration.",
  },
] as const;
function recipe(input: DemoInput) {
  const common = {
    ...(input.address ? { address: input.address } : {}),
    ...(input.from ? { from: input.from, to: input.to } : {}),
  };
  switch (input.id) {
    case "terminal":
      return {
        kind: "market-opportunities",
        limit: input.limit,
        scanLimit: 20,
        interval: "24h",
        ...common,
      };
    case "dex-inspector":
      return { kind: "token-research", depth: "full", ...common };
    case "wallet-intelligence":
      return input.address
        ? {
            kind: "skill-wallet-analysis",
            intervals: ["7d", "30d"],
            skipFirstFunded: true,
            skipTransactions: true,
            ...common,
          }
        : {
            kind: "skill-smart-wallets",
            skillDepth: "fast",
            limit: input.limit,
            scanLimit: 20,
            ...common,
          };
    case "security-signals":
      return { kind: "skill-contract-dd", skipKline: true, ...common };
    case "telegram-brief":
      return { kind: "skill-token-dd", ...common };
  }
}
export function planDemo(raw: unknown, preview = false) {
  const input = demoInputSchema.parse(raw),
    definition = demoCatalog.find((d) => d.id === input.id)!;
  const plan = preview ? previewCase(recipe(input)) : planCase(recipe(input));
  return {
    ...plan,
    demo: {
      ...definition,
      title:
        input.id === "wallet-intelligence"
          ? `${definition.title} · ${input.address ? input.address.slice(0, 6) + "…" + input.address.slice(-4) : "discover"}`
          : definition.title,
    },
    demoInput: { ...input, from: plan.input.from, to: plan.input.to },
  };
}
const columns = (fields: Record<string, string>) =>
  Object.entries(fields).map(([key, label]) => ({ key, label }));
const provenance = {
  sourceId: "Source request",
  asOf: "Observed / retrieved at",
};
const marketFields = {
  address: "Token",
  symbol: "Symbol",
  priceUsd: "Price · USD",
  liquidityUsd: "Liquidity · USD",
  volume24hUsd: "24h volume · USD",
  ...provenance,
};
function validAmount(value: unknown, max?: number) {
  const n = decimal(value);
  return n && n.gte(0) && (max === undefined || n.lte(max)) ? n : null;
}
/** Only observed evidence is projected. Missing values never become a successful check. */
export function demoReport(input: DemoInput, result: Result) {
  const definition = demoCatalog.find((d) => d.id === input.id)!;
  const sources: Result[] = result.data.sources || [],
    metrics: Data[] = result.data.metrics || [];
  const byOp = (operation: string) =>
    sources.filter((s) => s.meta.operation === operation);
  const rowsFor = (operation: string) => {
    const ids = new Set(byOp(operation).map((s) => s.meta.requestId));
    return metrics.filter((m) => ids.has(m.sourceId));
  };
  const markets = rowsFor("token.overview");
  const sections: {
    title: string;
    columns: { key: string; label: string }[];
    rows: Data[];
  }[] = [];
  if (
    markets.length ||
    definition.subject === "token" ||
    input.id === "terminal"
  )
    sections.push({
      title: "Market snapshot",
      columns: columns(marketFields),
      rows: markets,
    });
  if (input.id === "dex-inspector")
    sections.push({
      title: "Pools · fetched page",
      columns: columns({
        address: "Pool / pair",
        name: "Name",
        liquidity: "Liquidity · USD",
        volume24h: "24h volume · USD",
        ...provenance,
      }),
      rows: byOp("token.markets").flatMap((s) =>
        dataRows(s.data).map((r) => ({
          address: r.address ?? null,
          name: r.name ?? null,
          liquidity: r.liquidity ?? null,
          volume24h: r.volume24h ?? null,
          sourceId: s.meta.requestId,
          asOf: s.meta.retrievedAt,
        })),
      ),
    });
  if (input.id === "wallet-intelligence" && !input.address) {
    const tokens = rowsFor("market.smart-money");
    const wallets = new Map<string, Data>();
    for (const trader of rowsFor("token.top-traders")) {
      const parsed = address.safeParse(trader.wallet);
      if (!parsed.success) continue;
      if (!wallets.has(parsed.data)) {
        if (wallets.size >= input.limit) continue;
        wallets.set(parsed.data, {
          address: parsed.data,
          tokens: [],
          observations: [],
          sourceId: trader.sourceId,
          asOf: trader.asOf,
        });
      }
      const candidate = wallets.get(parsed.data)!;
      if (trader.token && !candidate.tokens.includes(trader.token))
        candidate.tokens.push(trader.token);
      candidate.observations.push({
        ...trader,
        symbol: tokens.find((t) => t.address === trader.token)?.symbol ?? null,
      });
    }
    sections.push({
      title: "Smart-money tokens · fetched page",
      columns: columns({
        address: "Token",
        symbol: "Symbol",
        smartTraders: "Smart traders",
        ...provenance,
      }),
      rows: tokens,
    });
    sections.push({
      title: "Discovered wallets · provider order",
      columns: columns({
        address: "Wallet",
        tokens: "Observed tokens",
        ...provenance,
      }),
      rows: [...wallets.values()],
    });
  }
  if (input.id === "wallet-intelligence" && input.address) {
    sections.push({
      title: "PnL windows · do not sum",
      columns: columns({
        duration: "Window",
        realizedPnlUsd: "Realized PnL · USD",
        unrealizedPnlUsd: "Unrealized PnL · USD",
        totalPnlUsd: "Total PnL · USD",
        pnlMethod: "Method",
        ...provenance,
      }),
      rows: rowsFor("portfolio.pnl-summary"),
    });
    sections.push({
      title: "Holdings · priced page only",
      columns: columns({
        address: "Token",
        symbol: "Symbol",
        valueUsd: "Value · USD",
        observedWeightPct: "Page weight · %",
        ...provenance,
      }),
      rows: rowsFor("portfolio.holdings"),
    });
  }
  if (
    input.id === "terminal" ||
    input.id === "dex-inspector" ||
    input.id === "telegram-brief"
  )
    sections.push({
      title: "Observed token controls",
      columns: columns({
        address: "Token",
        freezeable: "Freezeable",
        mutableMetadata: "Mutable metadata",
        top10HolderPct: "Top 10 accounts · %",
        ...provenance,
      }),
      rows: rowsFor("token.security"),
    });
  const checks: Data[] = [];
  if (input.id === "security-signals") {
    const market = markets[0],
      security = rowsFor("token.security")[0];
    const liquidity = validAmount(market?.liquidityUsd),
      share = validAmount(security?.top10HolderPct, 100);
    checks.push({
      rule: "Liquidity below threshold",
      threshold: input.minLiquidity,
      unit: "USD",
      observed: liquidity?.toString() ?? null,
      state: !liquidity
        ? "unknown"
        : liquidity.lt(input.minLiquidity)
          ? "attention"
          : "within-threshold",
      sourceId: market?.sourceId ?? null,
      asOf: market?.asOf ?? null,
    });
    checks.push({
      rule: "Top-10 token-account concentration",
      threshold: input.maxTop10Pct,
      unit: "% of supply",
      observed: share?.toString() ?? null,
      state: !share
        ? "unknown"
        : share.gt(input.maxTop10Pct)
          ? "attention"
          : "within-threshold",
      sourceId: security?.sourceId ?? null,
      asOf: security?.asOf ?? null,
    });
    checks.push({
      rule: "Freezeable control observed",
      threshold: true,
      unit: "boolean",
      observed:
        typeof security?.freezeable === "boolean" ? security.freezeable : null,
      state:
        typeof security?.freezeable !== "boolean"
          ? "unknown"
          : security.freezeable
            ? "attention"
            : "not-observed",
      sourceId: security?.sourceId ?? null,
      asOf: security?.asOf ?? null,
    });
    sections.push({
      title: "Configured rule checks",
      columns: columns({
        rule: "Rule",
        state: "State",
        observed: "Observed",
        threshold: "Threshold",
        unit: "Unit",
        ...provenance,
      }),
      rows: checks,
    });
    sections.push(...securityEvidenceSections(sources));
  }
  const textValue = (v: unknown) =>
    v === null || v === undefined
      ? "Unavailable"
      : String(v)
          .replace(/[\r\n\u0000-\u001f]/g, " ")
          .slice(0, 120);
  const market = markets[0],
    security = rowsFor("token.security")[0];
  const message =
    input.id === "telegram-brief"
      ? [
          "Birdeye token research · snapshot",
          `Token: ${input.address}`,
          `Retrieved: ${result.meta.retrievedAt}`,
          `Price USD: ${textValue(market?.priceUsd)}`,
          `Liquidity USD: ${textValue(market?.liquidityUsd)}`,
          `24h volume USD: ${textValue(market?.volume24hUsd)}`,
          `Freezeable: ${textValue(security?.freezeable)}`,
          `Top-10 token accounts %: ${textValue(security?.top10HolderPct)}`,
          `Coverage: ${result.meta.coverage}`,
          `Missing checks: ${(result.data.missing || []).length}`,
          `Estimated CU: ${result.meta.cu.estimated ?? "unknown"}`,
          `Run: ${result.meta.runId}`,
          `Sources: ${sources.map((s) => s.meta.requestId).join(", ") || "none"}`,
          "Research evidence only; missing observations are not passed checks. No buy/sell recommendation.",
        ].join("\n")
      : undefined;
  return {
    version: 1,
    id: input.id,
    title: definition.title,
    purpose: definition.purpose,
    limitation: definition.limitation,
    input,
    retrievedAt: result.meta.retrievedAt,
    coverage: result.meta.coverage,
    sections,
    ...(input.id === "wallet-intelligence"
      ? { walletStage: input.address ? "analysis" : "discovery" }
      : {}),
    ...(checks.length
      ? {
          signalState: checks.some((c) => c.state === "attention")
            ? "attention"
            : checks.some((c) => c.state === "unknown")
              ? "unknown"
              : "no-configured-rule-triggered",
        }
      : {}),
    ...(message ? { message, delivery: "preview-only" } : {}),
  };
}
export async function runDemo(
  runner: Runner,
  run: string,
  raw: unknown,
  signal?: AbortSignal,
  progress?: Progress,
  evidence: (result: Result) => void = () => {},
) {
  const plan = planDemo(raw);
  const decorate = (result: Result) => {
    result.data.demo = demoReport(plan.demoInput, result);
    return result;
  };
  return decorate(
    await runCase(runner, run, plan.input, signal, progress, (r) =>
      evidence(decorate(r)),
    ),
  );
}
