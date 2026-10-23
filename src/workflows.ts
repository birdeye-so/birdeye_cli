import { z } from "zod";
import { address, amount, timestamp, duration } from "./schemas.js";
import { catalog, prepare, type Operation, PRICING_VERSION } from "./catalog.js";
import { Runner, type Result } from "./runner.js";
import { AppError, decimal, errorData, object, type Data } from "./shared.js";
import { workflowGuides } from "./workflow-guides.js";
import { skillKinds, skillInfo, isSkill, addSkillSteps } from "./skill-recipes.js";

export const legacyCaseKinds = ["token-research", "token-due-diligence", "project-deep-report", "wallet-analysis", "smart-money-profile", "risk-warning", "early-project-screening", "daily-brief", "market-opportunities", "market-shortlist", "wallet-exposure"] as const;
export const caseKinds = [...legacyCaseKinds, ...skillKinds] as const;
const tokenKinds: string[] = ["token-research", "token-due-diligence", "project-deep-report", "risk-warning", ...skillKinds.filter(k => skillInfo[k].subject === "token")];
const walletKinds: string[] = ["wallet-analysis", "wallet-exposure", ...skillKinds.filter(k => skillInfo[k].subject === "wallet")];
export const caseSchema = z.object({
  kind: z.enum(caseKinds), address: address.optional(),
  limit: z.number().int().min(1).max(5).optional(),
  scanLimit: z.number().int().min(1).max(50).default(50),
  interval: z.enum(["1h", "4h", "24h"]).default("24h"),
  depth: z.enum(["core", "full"]).default("core"),
  duration: duration.exclude(["all"]).default("30d"),
  pnlMethod: z.enum(["wac", "net_cash"]).default("wac"),
  from: timestamp.optional(), to: timestamp.optional(),
  stage: z.enum(["newly-listed", "newly-created", "near-graduation", "graduated"]).default("newly-created"),
  source: z.enum(["all", "pump_dot_fun", "moonshot", "raydium_launchlab", "meteora_dynamic_bonding_curve"]).default("all"),
  minProgress: z.number().gt(0).lt(100).optional(),
  minLiquidity: amount.optional(), maxTop10Pct: amount.max(100).optional(),
  excludeFreezeable: z.boolean().default(false),
  baselineLiquidity: z.number().positive().optional(), baselineTime: timestamp.optional(),
  stepOverrides: z.record(z.string().min(1).max(64), z.record(z.string(), z.unknown())).default({}),
  wallets: z.array(address).min(1).max(10).optional(),
  intervals: z.array(duration).min(1).max(5).refine(values => new Set(values).size === values.length, "Intervals must be unique").default(["24h", "7d", "30d", "90d", "all"]),
  skillDepth: z.enum(["fast", "standard", "deep"]).default("fast"),
  ddMode: z.enum(["standard", "advanced"]).default("advanced"),
  topN: z.number().int().min(10).max(50).default(50),
  liqResolution: z.enum(["1m","5m","15m","30m","1h","4h","1D"]).default("15m"),
  liqCandles: z.number().int().min(1).max(100).default(96),
  listSource: z.enum(["v3-list", "trending"]).default("v3-list"),
  sortBy: z.enum(["volume", "liquidity", "market_cap", "holder", "trade_count", "rank"]).default("volume"),
  platform: z.string().min(1).max(100).optional(),
  resolution: z.enum(["1m", "5m", "15m", "30m", "1H", "4H", "1D"]).default("15m"),
  windowDays: z.number().int().min(1).max(30).default(7),
  include: z.array(z.enum(["list", "advanced_security", "risk_history"])).default([]),
  skipKline: z.boolean().default(false), skipPortfolio: z.boolean().default(false),
  skipFirstFunded: z.boolean().default(false), skipTransactions: z.boolean().default(false), skipPositions: z.boolean().default(false),
}).strict().superRefine((p, ctx) => {
  const issue = (message: string) => ctx.addIssue({code: "custom", message});
  if (p.kind === "skill-smart-money-leaderboard" && !p.wallets?.length) issue("Provide 1–10 wallet addresses");
  if (p.wallets && p.kind !== "skill-smart-money-leaderboard") issue("wallets is only supported for skill-smart-money-leaderboard");
  if (p.kind === "skill-wallet-style" && !["7d", "30d"].includes(p.duration)) issue("Wallet Style uses 7d or 30d");
  if (p.kind === "skill-wallet-score" && p.duration !== "30d") issue("Wallet Score alpha requires a 30d position scope");
  if (isSkill(p.kind) && (p.excludeFreezeable || p.minLiquidity !== undefined || p.maxTop10Pct !== undefined)) issue("Reference skill recipes use per-step API filters; legacy screening policies do not apply");
  if (p.kind === "skill-trending-list" && p.listSource === "trending" && (p.platform || !["volume", "liquidity", "rank"].includes(p.sortBy))) issue("Native trending supports volume, liquidity or rank; platform requires v3-list");
  if (p.kind === "skill-trending-list" && p.listSource === "v3-list" && p.sortBy === "rank") issue("rank requires the native trending source");
  if ((tokenKinds.includes(p.kind) || walletKinds.includes(p.kind)) && !p.address) issue("This workflow requires a Solana address");
  if ((p.from === undefined) !== (p.to === undefined)) issue("Provide both from and to, or neither");
  if (p.from !== undefined && p.to !== undefined && p.from >= p.to) issue("from must precede to");
  if (p.kind === "early-project-screening" && p.stage === "near-graduation" && p.minProgress === undefined) issue("near-graduation requires an explicit minProgress threshold");
  if (p.kind === "early-project-screening" && p.stage === "newly-listed" && p.source !== "all") issue("newly-listed does not support a venue filter; use newly-created with source instead");
  if ((p.baselineLiquidity === undefined) !== (p.baselineTime === undefined)) issue("Provide both baselineLiquidity and baselineTime");
  const hasTokenPolicy = p.excludeFreezeable || p.minLiquidity !== undefined || p.maxTop10Pct !== undefined;
  if (hasTokenPolicy && (["wallet-exposure", "smart-money-profile"].includes(p.kind) || (p.kind === "wallet-analysis" && p.depth !== "full"))) issue("Token screening criteria require a token workflow or wallet-analysis with full depth");
  if (p.baselineLiquidity !== undefined && p.kind !== "risk-warning") issue("A liquidity baseline is only supported for risk-warning");
  if (p.address && ![...tokenKinds, ...walletKinds, "smart-money-profile", "daily-brief"].includes(p.kind)) issue("This discovery workflow does not take an address");
});
export type CaseInput = z.infer<typeof caseSchema>;
type Selection = { from: string[]; take: number; kind: "token" | "wallet" | "pair"; sort?: boolean };
export type Step = { id: string; operation: Operation; params: Data; cost: number; subjects?: Selection; subjectKey?: string };
export type CasePlan = { kind: string; input: CaseInput; steps: Step[]; estimatedCu: number; maxRequests: number; pricingVersion: string; notes: string[] };

export function planCase(input: unknown, at = Math.floor(Date.now() / 1000)): CasePlan {
  const a = caseSchema.parse(input);
  if (a.wallets) a.wallets = [...new Set(a.wallets)];
  a.limit ??= a.kind === "market-shortlist" ? 5 : a.kind === "daily-brief" ? 2 : 3;
  const wallet = ["wallet-analysis", "smart-money-profile"].includes(a.kind);
  a.to ??= at;
  a.from ??= a.to - (isSkill(a.kind) ? (skillInfo[a.kind].subject === "wallet" ? ({"24h": 1, "7d": 7, "30d": 30, "90d": 90}[a.duration]) : a.windowDays) : wallet ? ({"24h": 1, "7d": 7, "30d": 30, "90d": 90}[a.duration]) : 1) * 86400;
  if (a.from < 1) throw new AppError("INVALID_INPUT", "Observation window precedes Unix epoch");
  if (a.baselineTime !== undefined && a.baselineTime >= a.to) throw new AppError("INVALID_INPUT", "baselineTime must precede observation time");
  const steps: Step[] = [];
  const notes = ["Estimates exclude retries; each extra page is another request. Dynamic branches are bounded by limit. Runs never place orders."];
  const add = (id: string, operation: Operation, params: Data, subjects?: Selection, subjectKey = "address") => {
    const overrides = a.stepOverrides[id] ?? {};
    for (const key of Object.keys(overrides)) {
      if (["address", "token_address", "wallet"].includes(key))
        throw new AppError("INVALID_INPUT", `Step ${id}: ${key} comes from the workflow subject or an earlier step. Change the workflow address instead.`);
    }
    // Validate even dependent parameters during preflight with a valid placeholder address.
    let normalized: Data;
    let cost: number;
    try {
      const prepared = prepare(operation, {...params, ...overrides, ...(subjects ? {[subjectKey]: "So11111111111111111111111111111111111111112"} : {})});
      normalized = prepared.params;
      cost = prepared.entry.cost;
      if (isSkill(a.kind) && operation === "market.ohlcv") {
        const seconds: Record<string, number> = {"1m":60,"5m":300,"15m":900,"30m":1800,"1H":3600,"4H":14400,"1D":86400};
        const size = seconds[normalized.type];
        if (size && (normalized.time_to - normalized.time_from) / size > 5000)
          throw new AppError("INVALID_INPUT", "Candle window exceeds 5000 intervals; shorten the window or choose a coarser resolution.");
      }
    } catch (error) {
      throw new AppError("INVALID_INPUT", `Step ${id}: ${errorData(error).message}`);
    }
    if (subjects) delete normalized[subjectKey];
    steps.push({id, operation, params: normalized, cost, ...(subjects ? {subjects, subjectKey} : {})});
  };
  const token = {address: a.address};
  const full = a.depth === "full";
  const scope = (from: string[], kind: Selection["kind"] = "token", take = a.limit!, sort = false): Selection => ({from, kind, take, sort});
  const enrich = (subjects: Selection, profile = false) => {
    add("security", "token.security", {}, subjects);
    add("overview", "token.overview", {}, subjects);
    if (profile) add("profiles", "token.holder-profile", {}, subjects, "token_address");
  };
  const pools = () => {
    add("markets", "token.markets", {...token, limit: 10});
    add("pair", "market.pair-overview", {}, scope(["markets"], "pair", 1));
    add("profile", "token.holder-profile", {token_address: a.address});
  };
  if (isSkill(a.kind)) addSkillSteps(a, add, notes);
  else if (tokenKinds.includes(a.kind)) {
    if (a.kind === "risk-warning") {
      add("security", "token.security", token); add("overview", "token.overview", token);
    } else {
      add("overview", "token.overview", token); add("security", "token.security", token);
    }
    if (a.kind !== "token-due-diligence") add("holders", "token.holders", {...token, mode: "wallet", limit: 10});
    if (a.kind === "project-deep-report" || (full && a.kind !== "risk-warning")) pools();
    if (a.kind === "project-deep-report") {
      add("candles", "market.ohlcv", {...token, time_from: a.from, time_to: a.to, type: "1H"});
      add("activity", "token.trade-data", token);
      notes.push("On-chain report only: team, funding, roadmap and social sentiment are not verified.");
    }
    if (a.kind === "risk-warning") {
      notes.push("Snapshot review, not continuous monitoring. A USD liquidity change is not evidence of a pool withdrawal.");
      if (full) {
        add("profile", "token.holder-profile", {token_address: a.address});
        add("positions", "token.holder-positions", {token_address: a.address, labels: ["dev", "bundler", "insider", "sniper"], include_zero_balance: true});
        add("timeline", "token.tags-tracker", {token_address: a.address, time_from: a.from, time_to: a.to});
        add("timeline-wallets", "token.tags-tracker-details", {token_address: a.address, time_from: a.from, time_to: a.to});
      }
    }
  } else if (a.kind === "wallet-exposure") {
    add("holdings", "portfolio.holdings", {wallet: a.address, limit: 100});
  } else if (a.kind === "wallet-analysis" || a.kind === "smart-money-profile") {
    let subjects: Selection | undefined;
    if (!a.address) {
      add("wallets", "market.trader-ranking", {type: "30d", sort_by: "realized_pnl", limit: a.limit});
      subjects = scope(["wallets"], "wallet");
    }
    const walletParams = a.address ? {wallet: a.address} : {};
    const pnl = {...walletParams, duration: a.duration, pnl_method: a.pnlMethod, position_scope: "duration_only"};
    add("holdings", "portfolio.holdings", {...walletParams, limit: 100}, subjects, "wallet");
    if (a.kind === "smart-money-profile") {
      add("pnl7", "portfolio.pnl-summary", {...pnl, duration: "7d"}, subjects, "wallet");
      add("pnl30", "portfolio.pnl-summary", {...pnl, duration: "30d"}, subjects, "wallet");
      notes.push("PnL comparison windows may overlap; read each source's duration and accounting method. Copy-trade ROI is unavailable without execution assumptions and complete trade history.");
    } else add("pnl", "portfolio.pnl-summary", pnl, subjects, "wallet");
    add("trades", "portfolio.trades", {...(a.address ? {address: a.address} : {}), after_time: a.from, before_time: a.to, limit: 100}, subjects);
    if (full) add("pnl-details", "portfolio.pnl-details", {...pnl, limit: 100}, subjects, "wallet");
    if (full && a.kind === "wallet-analysis") enrich(scope(["holdings"]));
  } else if (a.kind === "early-project-screening") {
    if (a.stage === "newly-listed") add("candidates", "market.new-listings", {time_to: a.to, limit: Math.min(a.scanLimit, 20)});
    else add("candidates", "market.meme-list", {
      source: a.source, limit: a.scanLimit, min_liquidity: a.minLiquidity,
      ...(a.stage === "graduated" ? {graduated: true, min_graduated_time: a.from, max_graduated_time: a.to, sort_by: "graduated_time"}
        : a.stage === "near-graduation" ? {graduated: false, min_progress_percent: a.minProgress, min_creation_time: a.from, max_creation_time: a.to, sort_by: "progress_percent"}
          : {min_creation_time: a.from, max_creation_time: a.to, sort_by: "creation_time"}),
    });
    enrich(scope(["candidates"]), true);
  } else {
    add("trending", "market.trending", {interval: a.kind === "daily-brief" ? "1h" : a.interval, limit: a.kind === "market-shortlist" ? a.limit : a.scanLimit});
    if (a.kind === "daily-brief") {
      add("daily", "market.trending", {interval: "24h", limit: a.scanLimit});
      if (full) {
        add("chain", "market.chain-metrics", {time: a.to, count: 2});
        add("smart-tokens", "market.smart-money", {interval: "1d", limit: 20});
        add("launches", "market.meme-list", {min_creation_time: a.from, max_creation_time: a.to, limit: 20});
      }
      if (a.address) add("holdings", "portfolio.holdings", {wallet: a.address, limit: 100});
      notes.push("Trending windows are rolling samples, not historical rank changes or whole-market breadth.");
    }
    enrich(scope(a.kind === "daily-brief" ? ["trending", "daily"] : ["trending"], "token", a.limit, a.kind !== "market-shortlist"));
    if (full && a.kind === "market-opportunities") {
      const selected = scope(["trending"], "token", a.limit, true);
      add("flow", "token.money-flow", {frames: ["24h"]}, selected, "token_address");
      add("profiles", "token.holder-profile", {}, selected, "token_address");
    }
  }
  for (const id of Object.keys(a.stepOverrides)) {
    if (!steps.some(step => step.id === id)) throw new AppError("INVALID_INPUT", `Unknown step ${id} for this workflow and depth. Reset the step overrides.`);
  }
  if (Object.keys(a.stepOverrides).length) notes.push("Step parameters were customized. Metrics and source scopes reflect each request; different windows and filters are not directly comparable.");
  if(a.kind==="skill-token-dd-score") {
    const liquidity=steps.find(s=>s.id==="liquidity"),distribution=steps.find(s=>s.id==="distribution");
    if(liquidity){a.liqCandles=liquidity.params.count;a.liqResolution=liquidity.params.resolution;}
    if(distribution?.params.top_n!==undefined) {
      if(distribution.params.top_n<10||distribution.params.top_n>50)throw new AppError("INVALID_INPUT","Token DD Score supports top_n 10–50 within one holder page.");
      a.topN=distribution.params.top_n;
    }
  }
  const maxRequests = steps.reduce((n, s) => n + (s.subjects?.take ?? 1), 0);
  const estimatedCu = steps.reduce((n, s) => n + s.cost * (s.subjects?.take ?? 1), 0);
  return {kind: a.kind, input: a, steps, estimatedCu, maxRequests, pricingVersion: PRICING_VERSION, notes};
}

export const workflowCatalog = () => caseKinds.map(kind => ({
  ...workflowGuides[kind],
  ...(isSkill(kind) ? {...skillInfo[kind], family: "data-skills"} : {title: kind.split("-").map(s => s[0].toUpperCase() + s.slice(1)).join(" "), group: "legacy", family: "legacy"}),
  kind, subject: kind === "skill-smart-money-leaderboard" ? "wallets" : tokenKinds.includes(kind) ? "token" : walletKinds.includes(kind) ? "wallet" : kind === "smart-money-profile" ? "optional-wallet" : kind === "daily-brief" ? "optional-wallet" : "none",
  description: isSkill(kind) ? skillInfo[kind].purpose : ({"token-research": "Overview, security and top holders", "token-due-diligence": "Quick identity and security checklist", "project-deep-report": "On-chain report with pools, cohorts and candles", "wallet-analysis": "Holdings, PnL and recent trades", "smart-money-profile": "7d/30d wallet performance and activity", "risk-warning": "Security and ownership review", "early-project-screening": "Launchpad discovery and candidate screening", "daily-brief": "Rolling market summary and watchlist", "market-opportunities": "Scan up to 50 tokens, then enrich a shortlist", "market-shortlist": "Enrich the first few trending tokens", "wallet-exposure": "Portfolio weights within the fetched page"})[kind],
}));

export function dataRows(data: any): Data[] {
  if (Array.isArray(data)) return data;
  for (const key of ["items", "tokens", "holders", "buyers"]) if (Array.isArray(data?.[key])) return data[key];
  return [];
}
export type Execution = { sources: Result[]; warnings: string[]; missing: Data[]; outcomes: Data[]; selections: Data[] };
export async function executePlan(runner: Runner, run: string, plan: CasePlan, signal?: AbortSignal, progress: (stage: string, message: string) => void = () => {}, snapshot: (state: Execution) => void = () => {}) {
  const state: Execution = {sources: [], warnings: [], missing: [], outcomes: [], selections: []};
  const byStep = new Map<string, Result[]>();
  const cache = new Map<string, Result>();
  const selected = new Map<string, string[]>();
  const blocked = new Set<string>();
  let halted = false;
  const missing = (step: Step, subject: string | undefined, reason: string) => state.missing.push({step: step.id, operation: step.operation, subject, reason});
  for (const step of plan.steps) {
    signal?.throwIfAborted();
    if (halted) { missing(step, undefined, "Run stopped after a budget, authentication or request-limit failure"); continue; }
    let subjects: (string | undefined)[] = [undefined];
    if (step.subjects) {
      const selector = step.subjects;
      const key = JSON.stringify(selector);
      if (!selected.has(key)) {
        let rows = selector.from.flatMap(id => (byStep.get(id) || []).flatMap(r => dataRows(r.data)));
        const before = rows.length;
        if (selector.kind === "token" && !selector.from.includes("holdings") && plan.input.minLiquidity !== undefined) rows = rows.filter(r => decimal(r.liquidity)?.gte(plan.input.minLiquidity!) === true);
        if (plan.kind === "early-project-screening" && plan.input.stage === "newly-listed") {
          rows = rows.filter(r => {
            const time = typeof r.liquidityAddedAt === "number" ? r.liquidityAddedAt : Date.parse(r.liquidityAddedAt) / 1000;
            return Number.isFinite(time) && time >= plan.input.from! && time <= plan.input.to!;
          });
        }
        if (selector.sort) rows.sort((a, b) => {
          const av = decimal(a.volume24hUSD);
          const bv = decimal(b.volume24hUSD);
          return av && bv ? (bv.comparedTo(av) ?? 0) : av ? -1 : bv ? 1 : 0;
        });
        const ids: string[] = [];
        for (const row of rows) {
          const id = selector.kind === "wallet" ? row.wallet_address ?? row.owner ?? row.wallet ?? row.account ?? row.address : row.address ?? row.token ?? row.wallet_address ?? row.owner;
          if (row.network && row.network !== "solana") continue;
          if (address.safeParse(id).success && !ids.includes(id)) ids.push(id);
        }
        selected.set(key, ids.slice(0, selector.take));
        state.selections.push({from: selector.from, subjectKind: selector.kind, observedRows: before, eligibleUniqueSubjects: ids.length, selected: ids.slice(0, selector.take), selectionBasis: selector.sort ? "local volume24hUSD ranking within fetched pages; missing 24h volume last" : "provider order within fetched pages", minLiquidity: plan.input.minLiquidity ?? null});
      }
      subjects = selected.get(key)!;
      if (!subjects.length) { missing(step, undefined, "No eligible subjects in the fetched source pages"); continue; }
    }
    for (const subject of subjects) {
      const params = subject ? {...step.params, [step.subjectKey!]: subject} : step.params;
      const identity = params.address ?? params.token_address ?? params.wallet;
      if (identity && blocked.has(identity)) { missing(step, identity, "Subject stopped by policy or missing required identity/security evidence"); continue; }
      if (halted) { missing(step, identity, "Run budget or authentication limit reached"); continue; }
      progress("fetching", `${step.operation}${identity ? ` · ${identity}` : ""}`);
      try {
        const prepared = prepare(step.operation, params);
        const key = JSON.stringify([step.operation, prepared.params]);
        let result = cache.get(key);
        if (!result) {
          result = await runner.execute(step.operation, prepared.params, {run, signal});
          cache.set(key, result); state.sources.push(result);
        }
        byStep.set(step.id, [...(byStep.get(step.id) || []), result]);
        const d = object(result.data);
        if (result.meta.coverage === "empty") missing(step, identity, "Empty upstream dataset");
        const reasons: string[] = [];
        let insufficient = false;
        if (step.operation === "token.overview") {
          if (d.address && d.address !== identity) { reasons.push("Returned contract does not match requested contract"); insufficient = true; }
          if (plan.input.minLiquidity !== undefined) {
            const value = decimal(d.liquidity);
            if (!value) { reasons.push("Liquidity missing for required policy check"); insufficient = true; }
            else if (value.lt(plan.input.minLiquidity)) reasons.push("Liquidity below requested minimum");
          }
        }
        if (step.operation === "token.security") {
          if (plan.input.excludeFreezeable) {
            if (d.freezeable === true) reasons.push("Freezeable token excluded by requested policy");
            else if (d.freezeable !== false) { reasons.push("Freezeability unknown for required policy check"); insufficient = true; }
          }
          if (plan.input.maxTop10Pct !== undefined) {
            const value = decimal(d.top10HolderPercent);
            if (!value) { reasons.push("Top-10 token-account supply share missing for required policy check"); insufficient = true; }
            else if (value.times(100).gt(plan.input.maxTop10Pct)) reasons.push("Top-10 token-account supply share exceeds requested maximum");
          }
        }
        if (result.meta.coverage === "empty" && ["token.security", "token.overview"].includes(step.operation)) { reasons.push("Required token evidence is empty"); insufficient = true; }
        if (reasons.length) {
          blocked.add(identity);
          state.outcomes.push({address: identity, status: insufficient ? "insufficient-data" : "exclude-by-policy", reasons, sourceId: result.meta.requestId});
        }
        snapshot(state);
      } catch (error) {
        if (signal?.aborted) throw error;
        const e = errorData(error);
        if (e.code === "RUN_STORAGE_FAILED") throw error;
        state.warnings.push(`${step.operation}: ${e.message}`); missing(step, identity, e.code);
        Object.assign(state.missing[state.missing.length - 1], {message: e.message, details: e.details});
        if (["token.security", "token.overview"].includes(step.operation) && identity) blocked.add(identity);
        if (["CU_BUDGET_EXCEEDED", "REQUEST_LIMIT", "AUTH_MISSING", "AUTH_INVALID", "ACCESS_DENIED"].includes(e.code)) {
          halted = true; state.warnings.push("Remaining steps stopped; successful evidence and uncertain CU are retained.");
        }
        snapshot(state);
      }
    }
  }
  return state;
}
