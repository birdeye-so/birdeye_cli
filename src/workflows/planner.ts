import { prepare, PRICING_VERSION, type Operation } from "../catalog.js";
import { AppError, errorData, type Data } from "../shared.js";
import { caseSchema, type CaseInput } from "./schema.js";
import { getWorkflow } from "./registry.js";
import type { Step, Selection } from "./types.js";
export type CasePlan = { kind: string; input: CaseInput; steps: Step[]; estimatedCu: number; maxRequests: number; pricingVersion: string; notes: string[] };

export function planCase(input: unknown, at = Math.floor(Date.now() / 1000)): CasePlan {
  const a = caseSchema.parse(input);
  const definition = getWorkflow(a.kind);
  if (a.wallets) a.wallets = [...new Set(a.wallets)];
  a.limit ??= definition.defaultLimit ?? 3;
  a.to ??= at;
  a.from ??= a.to - (definition.window === "duration" ? ({"24h": 1, "7d": 7, "30d": 30, "90d": 90}[a.duration]) : definition.window === "windowDays" ? a.windowDays : 1) * 86400;
  if (a.from < 1) throw new AppError("INVALID_INPUT", "Observation window precedes Unix epoch");
  if (a.baselineTime !== undefined && a.baselineTime >= a.to) throw new AppError("INVALID_INPUT", "baselineTime must precede observation time");
  const steps: Step[] = [];
  const notes = ["Estimates exclude retries; each extra page is another request. Dynamic branches are bounded by limit. Runs never place orders."];
  const add = (id: string, operation: Operation, params: Data, subjects?: Selection, subjectKey = "address") => {
    if (steps.some(step => step.id === id)) throw new AppError("INVALID_INPUT", `Duplicate workflow step: ${id}`);
    if (subjects && (!Number.isInteger(subjects.take) || subjects.take < 1 || subjects.from.some(source => !steps.some(step => step.id === source)))) {
      throw new AppError("INVALID_INPUT", `Step ${id}: selection must use earlier steps and a positive bounded count.`);
    }
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
      if (definition.maxCandleIntervals && operation === "market.ohlcv") {
        const seconds: Record<string, number> = {"1m":60,"5m":300,"15m":900,"30m":1800,"1H":3600,"4H":14400,"1D":86400};
        const size = seconds[normalized.type];
        if (size && (normalized.time_to - normalized.time_from) / size > definition.maxCandleIntervals)
          throw new AppError("INVALID_INPUT", "Candle window exceeds 5000 intervals; shorten the window or choose a coarser resolution.");
      }
    } catch (error) {
      throw new AppError("INVALID_INPUT", `Step ${id}: ${errorData(error).message}`);
    }
    if (subjects) delete normalized[subjectKey];
    steps.push({id, operation, params: normalized, cost, ...(subjects ? {subjects, subjectKey} : {})});
  };
  notes.push(...(definition.planNotes ?? []));
  definition.plan({input: a, add, notes});
  for (const id of Object.keys(a.stepOverrides)) {
    if (!steps.some(step => step.id === id)) throw new AppError("INVALID_INPUT", `Unknown step ${id} for this workflow and depth. Reset the step overrides.`);
  }
  if (Object.keys(a.stepOverrides).length) notes.push("Step parameters were customized. Metrics and source scopes reflect each request; different windows and filters are not directly comparable.");
  definition.finalize?.(a, steps);
  const maxRequests = steps.reduce((n, s) => n + (s.subjects?.take ?? 1), 0);
  const estimatedCu = steps.reduce((n, s) => n + s.cost * (s.subjects?.take ?? 1), 0);
  return {kind: a.kind, input: a, steps, estimatedCu, maxRequests, pricingVersion: PRICING_VERSION, notes};
}

