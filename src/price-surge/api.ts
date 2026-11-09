import {prepare, PRICING_VERSION, type Operation} from "../catalog.js";
import {AppError, decimal, errorData, now, object, type Data} from "../shared.js";
import type {Runner, Result} from "../runner.js";
import type {Step} from "../workflows/types.js";
import {priceSurgeSchema, type PriceSurgeParams} from "./schema.js";

export function parsePriceSurge(input: unknown): PriceSurgeParams {
  if (object(input).chain === "arbitrum")
    throw new AppError("UNSUPPORTED_CHAIN", "Arbitrum is not supported by the documented Token List V3 endpoint. Choose solana, bsc, base, ethereum or robinhood.");
  const parsed = priceSurgeSchema.safeParse(input);
  if (!parsed.success) throw new AppError("INVALID_INPUT", parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; "));
  return parsed.data;
}

export function planPriceSurge(input: unknown = {}) {
  const params = parsePriceSurge(input), p = params;
  const listParams = {
    sort_by: p.sort_by === "price_change" ? `price_change_${p.interval}_percent` : p.sort_by === "volume" ? `volume_${p.interval}_usd` : p.sort_by === "trade_count" ? `trade_${p.interval}_count` : p.sort_by,
    sort_type: p.sort_type, min_market_cap: p.min_market_cap, max_market_cap: p.max_market_cap,
    min_liquidity: p.min_liquidity, max_liquidity: p.max_liquidity, min_holder: p.min_holders,
    [`min_price_change_${p.interval}_percent`]: p.min_price_change,
    [`min_volume_${p.interval}_usd`]: p.min_volume, [`min_trade_${p.interval}_count`]: p.min_trade_count,
    platform_name: p.platform, limit: p.limit, offset: p.offset,
  };
  const steps: Step[] = [];
  const top = Math.min(p.top, p.limit);
  const add = (id: string, operation: Operation, values: Data, subjectKey?: string) => {
    const placeholder = p.chain === "solana" ? "So11111111111111111111111111111111111111112" : "0x0000000000000000000000000000000000000001";
    const prepared = prepare(operation, {...values, ...(subjectKey ? {[subjectKey]: placeholder} : {})}, p.chain);
    if (subjectKey) delete prepared.params[subjectKey];
    steps.push({id, operation, params: prepared.params, cost: prepared.entry.cost,
      ...(subjectKey ? {subjectKey, subjects: {from: ["tokens"], take: top, kind: "token" as const}} : {})});
  };
  add("tokens", "market.token-list", listParams);
  // Trader endpoints have no 1m/5m window. Expose the 30m fallback explicitly.
  const traderWindow = ["1m", "5m"].includes(p.interval) ? "30m" : p.interval;
  if (p.mode === "advanced" && top > 0) {
    if (p.with_security) add("security", "token.security", {}, "address");
    add("top_traders", "token.top-traders", {time_frame: traderWindow, sort_by: "volume", sort_type: "desc", limit: 10, offset: 0}, "address");
    if (p.chain === "solana" && !p.no_holder_health) add("holder_profile", "token.holder-profile", {interval: "1h"}, "token_address");
  }
  const notes = [
    "One token-list page; exclusions are not backfilled. Hydration covers at most min(top, limit) first-pass survivors in provider order.",
    "CU estimates exclude retries and are not confirmed billing. Proxies are screening signals, not proof of a rug or wash trading.",
    "Unknown fields never become zero or a passed security check. Unhydrated rows have no advanced risk assessment.",
  ];
  if (p.mode === "advanced") {
    notes.push(`Top traders: one page of 10 wallets, sorted by volume, window ${traderWindow}; profitability and KOL counts cover that sample only.`);
    if (p.chain !== "solana" || p.no_holder_health) notes.push("Holder health skipped; this screen requests holder profiles only on Solana when enabled.");
    else notes.push("Holder-profile volume uses 1h independently of the surge interval; cohort supply shares may overlap.");
  }
  if (!p.with_security && (p.max_dev_hold_pct !== undefined || p.max_top10_pct !== undefined))
    notes.push("Developer/top-10 caps cannot be evaluated without advanced mode and with_security; these fields remain null.");
  if (p.mode === "standard" && p.min_kol_buyers !== undefined) notes.push("KOL cap is not evaluated in standard mode.");
  return {kind: "skill-price-surge" as const, params, steps, notes, pricingVersion: PRICING_VERSION,
    estimatedCu: steps.reduce((sum, s) => sum + s.cost * (s.subjects?.take ?? 1), 0),
    maxRequests: steps.reduce((sum, s) => sum + (s.subjects?.take ?? 1), 0)};
}

const number = (v: unknown): number | null => { const n = decimal(v)?.toNumber(); return n !== undefined && Number.isFinite(n) ? n : null; };
const nonnegative = (v: unknown) => { const n = number(v); return n !== null && n >= 0 ? n : null; };
const count = (v: unknown) => { const n = nonnegative(v); return n !== null && Number.isSafeInteger(n) ? n : null; };
const pct = (v: unknown) => { const n = nonnegative(v); return n !== null && n <= 100 ? n : null; };
const share = (v: unknown) => { const n = decimal(v); return n?.gte(0) && n.lte(1) ? n.times(100).toNumber() : null; };
const ratio = (a: unknown, b: unknown) => { const x = decimal(a), y = decimal(b); return x?.gte(0) && y?.gt(0) ? x.div(y).toNumber() : null; };
const bool = (v: unknown): boolean | null => v === true || v === 1 || v === "1" || v === "true" ? true : v === false || v === 0 || v === "0" || v === "false" ? false : null;
const inverse = (v: boolean | null) => v === null ? null : !v;
const text = (v: unknown) => typeof v === "string" && v.trim() ? v : null;

export type SurgeRow = Data & {address: string; risk_flags: string[]; exclusion_reasons: string[]; excluded: boolean; missing_fields: string[]};
function flag(row: SurgeRow, reason: string, exclude = true) {
  if (!row.risk_flags.includes(reason)) row.risk_flags.push(reason);
  if (exclude && !row.exclusion_reasons.includes(reason)) row.exclusion_reasons.push(reason);
}
function listRow(data: Data, p: PriceSurgeParams): SurgeRow {
  const row: SurgeRow = {
    rank: 0, address: text(data.address) ?? "", symbol: text(data.symbol), name: text(data.name), logo_uri: text(data.logo_uri), chain: p.chain,
    price: nonnegative(data.price), market_cap: nonnegative(data.market_cap), fdv: nonnegative(data.fdv), liquidity: number(data.liquidity), holder: count(data.holder),
    volume_interval: nonnegative(data[`volume_${p.interval}_usd`]), price_change_interval_pct: number(data[`price_change_${p.interval}_percent`]), trade_interval_count: count(data[`trade_${p.interval}_count`]),
    liq_mcap_ratio: ratio(data.liquidity, data.market_cap), trades_per_wallet_24h: ratio(data.trade_24h_count, data.unique_wallet_24h),
    dev_hold_pct: null, top10_holder_pct: null, kol_buyer_count: null, profitable_wallet_ratio: null, security: null, holder_tags: null,
    risk_flags: [], exclusion_reasons: [], excluded: false, missing_fields: [], hydration_status: "not_requested",
  };
  if (row.market_cap !== null && row.fdv !== null && decimal(row.market_cap)!.gt(decimal(row.fdv)!.times(1.01))) flag(row, "stale_market_cap");
  if (row.liquidity !== null && row.liquidity <= 0) flag(row, "no_liquidity");
  if (row.holder === 0 && row.trade_interval_count !== null && row.trade_interval_count > 0) flag(row, "zero_holders_with_trades");
  if (row.liq_mcap_ratio !== null && row.liq_mcap_ratio < p.max_liq_mcap_ratio) flag(row, "thin_liquidity");
  const buys = count(data.buy_24h), sells = count(data.sell_24h), trades = count(data.trade_24h_count), wallets = count(data.unique_wallet_24h);
  if (buys !== null && buys >= 20 && sells === 0) flag(row, "honeypot_proxy");
  if ((row.trades_per_wallet_24h !== null && row.trades_per_wallet_24h > p.max_trades_per_wallet) || (wallets === 0 && trades !== null && trades > 0)) flag(row, "wash_trade_proxy");
  row.missing_fields = ["market_cap", "fdv", "liquidity", "holder", "trade_interval_count", "liq_mcap_ratio", "trades_per_wallet_24h"].filter(key => row[key] === null);
  if (buys === null || sells === null) row.missing_fields.push("buy_sell_24h");
  return row;
}

function lpLocked(data: Data): boolean | null {
  const explicit = bool(data.lpLocked) ?? bool(object(data.lockInfo).isLocked);
  if (explicit !== null) return explicit;
  const holders: Data[] = Array.isArray(data.lpHolders) ? data.lpHolders.map(object) : [];
  // An observed unlocked position disproves a fully locked LP. A partial list
  // of locked positions cannot prove the remainder is locked.
  if (holders.some(h => bool(h.is_locked) === false && ((nonnegative(h.balance) ?? 0) > 0 || (share(h.percent) ?? 0) > 0))) return false;
  const ids = holders.map(h => text(h.address)?.toLowerCase());
  if (!holders.length || ids.some(id => !id) || new Set(ids).size !== holders.length || holders.some(h => bool(h.is_locked) !== true)) return null;
  const shares = holders.map(h => share(h.percent));
  if (shares.some(value => value === null)) return null;
  const total = shares.reduce<number>((sum, value) => sum + value!, 0);
  return total >= 100 && total <= 101 ? true : null;
}

function security(row: SurgeRow, data: Data) {
  const enabled = bool(data.transferFeeEnable), fee = object(data.transferFeeData);
  // Only a current, explicitly denominated fee is usable. Opaque schedules and
  // buyTax/sellTax strings have no guaranteed units and remain unknown.
  const basisPoints = nonnegative(fee.transferFeeBasisPoints ?? object(fee.currentTransferFee).transferFeeBasisPoints);
  const transferFee = enabled === false ? 0 : basisPoints !== null && basisPoints <= 10000 ? basisPoints / 100 : null;
  const mutable = bool(data.mutableMetadata), open = bool(data.isOpenSource);
  row.security = {
    honeypot: bool(data.isHoneypot),
    mint_renounced: inverse(bool(data.mintable ?? data.isMintable)) ?? (text(data.mintAuthority) ? false : null),
    freeze_renounced: inverse(bool(data.freezeable)) ?? (text(data.freezeAuthority) ? false : null),
    open_source_status: mutable === false ? "immutable" : mutable === true ? "mutable" : open === true ? "verified" : open === false ? "unverified" : null,
    lp_locked: lpLocked(data), transfer_fee_pct: transferFee,
  };
  row.dev_hold_pct = share(data.creatorPercentage);
  row.top10_holder_pct = share(data.top10HolderPercent);
  const s = row.security;
  if (s.honeypot === true) flag(row, "honeypot");
  if (transferFee !== null && transferFee >= 90) flag(row, "honeypot_tax");
  if (transferFee !== null && transferFee >= 10) flag(row, "high_transfer_tax", false);
  if (s.lp_locked === false && (s.mint_renounced === false || s.freeze_renounced === false || mutable === true)) flag(row, "rug_pull_risk");
  if (row.dev_hold_pct !== null && row.dev_hold_pct >= 10) flag(row, "high_dev_hold", false);
  if (row.top10_holder_pct !== null && row.top10_holder_pct >= 50) flag(row, "top10_concentration", false);
  for (const [key, value] of Object.entries(s)) if (value === null) row.missing_fields.push(`security.${key}`);
}

function traders(row: SurgeRow, data: Data) {
  const wallets = new Map<string, Data>();
  for (const raw of Array.isArray(data.items) ? data.items : []) {
    const item = object(raw), owner = text(item.owner);
    if (owner && !wallets.has(owner)) wallets.set(owner, item);
  }
  const sampled = [...wallets.values()];
  const pnls = sampled.map(w => number(w.totalPnl) ?? (number(w.realizedPnl) !== null && number(w.unrealizedPnl) !== null ? number(w.realizedPnl)! + number(w.unrealizedPnl)! : null)).filter((v): v is number => v !== null);
  row.profitable_wallet_ratio = pnls.length ? pnls.filter(n => n > 0).length / pnls.length * 100 : null;
  const kols = sampled.filter(w => Array.isArray(w.tags) && w.tags.some((tag: unknown) => {
    const name = typeof tag === "string" ? tag : object(tag).name ?? object(tag).tag;
    return typeof name === "string" && ["kol", "key_opinion_leader", "influencer"].includes(name.toLowerCase());
  }));
  row.kol_buyer_count = kols.length && kols.every(w => count(w.tradeBuy) !== null) ? kols.filter(w => count(w.tradeBuy)! > 0).length : null;
  row.trader_sample = {wallets: sampled.length, wallets_with_pnl: pnls.length, time_frame: data.time_frame ?? null, basis: "totalPnl > 0 among unique sampled wallets with known PnL"};
  if (row.kol_buyer_count === null) row.missing_fields.push("kol_buyer_count");
  if (row.profitable_wallet_ratio === null) row.missing_fields.push("profitable_wallet_ratio");
}

function profile(row: SurgeRow, data: Data) {
  row.holder_tags = Object.fromEntries((Array.isArray(data.tags) ? data.tags : []).flatMap((raw: unknown) => {
    const tag = object(raw), name = text(tag.tag);
    return name ? [[name, {holder_count: count(tag.holder_count), percent_of_supply: pct(tag.percent_of_supply)}]] : [];
  }));
}

function caps(row: SurgeRow, p: PriceSurgeParams) {
  if (p.max_dev_hold_pct !== undefined && row.dev_hold_pct !== null && row.dev_hold_pct > p.max_dev_hold_pct) flag(row, "dev_hold_over_limit");
  if (p.max_top10_pct !== undefined && row.top10_holder_pct !== null && row.top10_holder_pct > p.max_top10_pct) flag(row, "top10_over_limit");
  if (p.min_kol_buyers !== undefined && row.kol_buyer_count !== null && row.kol_buyer_count < p.min_kol_buyers) flag(row, "low_kol_buyers");
  row.excluded = !p.no_auto_filter && row.exclusion_reasons.length > 0;
}

/** Internal orchestration API shared by HTTP, CLI and the installed skill. */
export async function runPriceSurge(runner: Runner, run: string, input: unknown = {}, signal?: AbortSignal,
  progress: (stage: string, message: string) => void = () => {}, evidence: (result: Result) => void = () => {}): Promise<Result> {
  const plan = planPriceSurge(input), p = plan.params;
  const sources: Result[] = [], missing: Data[] = [], rows: SurgeRow[] = [];
  const hydrated = new Set<string>();
  const previousAttempts = new Set(runner.ledger.attempts(run).map(a => a.id));
  let rawResponse: unknown = null, halted = false;
  const result = (): Result => {
    const attempts = runner.ledger.attempts(run).filter(a => !previousAttempts.has(a.id) && a.status !== "not-sent");
    const kept = rows.filter(row => !row.excluded).map((row, index) => ({...row, rank: index + 1}));
    const dropped = rows.filter(row => row.excluded).map(row => ({symbol: row.symbol, address: row.address, reason: row.exclusion_reasons.join(", "), flags: [...row.risk_flags]}));
    const eligible = rows.filter(row => !row.excluded || hydrated.has(row.address)).length;
    const screen = {
      kind: "price-surge-v1", params: p, source: "birdeye", source_label: "Birdeye /defi/v3/token/list",
      mcap_range: `$${p.min_market_cap ?? 0} – ${p.max_market_cap === undefined ? "unbounded" : `$${p.max_market_cap}`}`,
      sort_note: `${p.sort_by} ${p.sort_type}; interval ${p.interval}; provider order within one page`,
      n_scanned: rows.length, n_rows: kept.length, n_excluded: dropped.length, n_hydrated: hydrated.size,
      hydration_note: p.mode === "standard" ? "Standard mode: no hydration." : halted ? "Hydration incomplete after a budget, authentication or request limit failure." : p.top === 0 ? "Hydration disabled by top=0." : eligible > Math.min(p.top, p.limit) ? `Hydration bounded to ${Math.min(p.top, p.limit)} first-pass survivors; remaining rows have no advanced assessment.` : missing.length ? "Some hydration evidence is unavailable; inspect missing and per-row hydration_status." : null,
      rows: kept, dropped, raw_response: rawResponse,
      cu_breakdown: plan.steps.flatMap(s => {
        const count = attempts.filter(a => a.operation === s.operation).length;
        return count ? [`${s.id === "tokens" ? "token_list_v3" : s.id}=${s.cost}${s.id === "tokens" && count === 1 ? "" : `x${count}`}`] : [];
      }),
    };
    return {schemaVersion: 1, data: {...screen, sources: [...sources], missing: [...missing], scopeNotes: plan.notes,
      plan: {...plan, input: {kind: plan.kind, priceSurge: p}}, status: missing.length ? "partial" : "complete-for-requested-scope",
      skillAnalysis: {formulaVersion: "price-surge-v1", findings: [{kind: "price-surge-v1", rows: kept, dropped, interval: p.interval, chain: p.chain}]},
    }, meta: {operation: "analysis", chain: p.chain, runId: run, retrievedAt: now(), coverage: missing.length ? "partial" : "complete-for-requested-scope",
      pricingVersion: plan.pricingVersion, cu: runner.ledger.summary(run), warnings: [...plan.notes, ...missing.map(m => `${m.operation}: ${m.reason}`)]}};
  };
  const fetchStep = async (step: Step, row?: SurgeRow): Promise<Result | undefined> => {
    signal?.throwIfAborted();
    if (halted) {
      missing.push({step: step.id, operation: step.operation, address: row?.address, reason: "Run stopped; request not sent"});
      return;
    }
    const params = {...step.params, ...(row ? {[step.subjectKey!]: row.address} : {})};
    progress("fetching", `${step.operation}${row ? ` · ${row.address}` : ""}`);
    try {
      const source = await runner.execute(step.operation, params, {run, chain: p.chain, signal, captureRawResponse: true});
      sources.push(source);
      if (source.meta.coverage === "empty" && row) {
        missing.push({step: step.id, operation: step.operation, address: row.address, reason: "Empty upstream evidence"});
        return;
      }
      return source;
    } catch (error) {
      if (signal?.aborted) throw error;
      const e = errorData(error);
      if (e.code === "RUN_STORAGE_FAILED") throw error;
      missing.push({step: step.id, operation: step.operation, address: row?.address, reason: e.message, code: e.code});
      halted ||= ["AUTH_MISSING", "AUTH_INVALID", "ACCESS_DENIED", "CU_BUDGET_EXCEEDED", "REQUEST_LIMIT"].includes(e.code);
    }
  };
  const feed = await fetchStep(plan.steps[0]);
  if (!feed) { const out = result(); evidence(out); return out; }
  rawResponse = feed.rawResponse;
  if (feed.data === null) missing.push({step: "tokens", operation: "market.token-list", reason: "Token-list data is unavailable"});
  for (const raw of Array.isArray(feed.data?.items) ? feed.data.items.slice(0, p.limit) : []) {
    const row = listRow(object(raw), p); caps(row, p); rows.push(row);
  }
  evidence(result());
  const candidates = rows.filter(row => !row.excluded);
  const selected = candidates.slice(0, Math.min(p.top, p.limit));
  if (p.mode === "advanced") {
    for (const row of candidates) row.hydration_status = "not_selected";
    for (const row of selected) {
      let completed = 0;
      for (const step of plan.steps.slice(1)) {
        const source = await fetchStep(step, row);
        if (source) {
          completed++; hydrated.add(row.address);
          if (step.id === "security") security(row, object(source.data));
          if (step.id === "top_traders") { traders(row, object(source.data)); row.trader_sample.time_frame = step.params.time_frame; }
          if (step.id === "holder_profile") profile(row, object(source.data));
        }
        caps(row, p);
        row.hydration_status = completed === plan.steps.length - 1 ? "complete" : "partial";
        evidence(result());
      }
    }
  }
  const out = result(); evidence(out); return out;
}
