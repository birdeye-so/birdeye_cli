import { findWorkflow } from "./registry.js";
import { address } from "../schemas.js";
import { prepare } from "../catalog.js";
import { Runner, type Result } from "../runner.js";
import { decimal, errorData, object, type Data } from "../shared.js";
import type { CasePlan } from "./planner.js";
import type { Step } from "./types.js";

export function dataRows(data: any): Data[] {
  if (Array.isArray(data)) return data;
  for (const key of ["items", "tokens", "holders", "buyers"])
    if (Array.isArray(data?.[key])) return data[key];
  return [];
}
export type Execution = {
  sources: Result[];
  warnings: string[];
  missing: Data[];
  outcomes: Data[];
  selections: Data[];
};
export async function executePlan(
  runner: Runner,
  run: string,
  plan: CasePlan,
  signal?: AbortSignal,
  progress: (stage: string, message: string) => void = () => {},
  snapshot: (state: Execution) => void = () => {},
) {
  const state: Execution = {
    sources: [],
    warnings: [],
    missing: [],
    outcomes: [],
    selections: [],
  };
  const byStep = new Map<string, Result[]>();
  const cache = new Map<string, Result>();
  const selected = new Map<string, string[]>();
  const blocked = new Set<string>();
  let halted = false;
  const missing = (step: Step, subject: string | undefined, reason: string) =>
    state.missing.push({
      step: step.id,
      operation: step.operation,
      subject,
      reason,
    });
  for (const step of plan.steps) {
    signal?.throwIfAborted();
    if (halted) {
      missing(
        step,
        undefined,
        "Run stopped after a budget, authentication or request-limit failure",
      );
      continue;
    }
    let subjects: (string | undefined)[] = [undefined];
    if (step.subjects) {
      const selector = step.subjects;
      const key = JSON.stringify(selector);
      if (!selected.has(key)) {
        let rows = selector.from.flatMap((id) =>
          (byStep.get(id) || []).flatMap((r) => dataRows(r.data)),
        );
        const before = rows.length;
        if (
          selector.kind === "token" &&
          !selector.from.includes("holdings") &&
          plan.input.minLiquidity !== undefined
        )
          rows = rows.filter(
            (r) => decimal(r.liquidity)?.gte(plan.input.minLiquidity!) === true,
          );
        rows =
          findWorkflow(plan.kind)?.filterSubjects?.(rows, plan.input) ?? rows;
        if (selector.sort)
          rows.sort((a, b) => {
            const av = decimal(a.volume24hUSD);
            const bv = decimal(b.volume24hUSD);
            return av && bv ? (bv.comparedTo(av) ?? 0) : av ? -1 : bv ? 1 : 0;
          });
        const ids: string[] = [];
        for (const row of rows) {
          const id =
            selector.kind === "wallet"
              ? (row.wallet_address ??
                row.owner ??
                row.wallet ??
                row.account ??
                row.address)
              : (row.address ?? row.token ?? row.wallet_address ?? row.owner);
          if (row.network && row.network !== "solana") continue;
          if (address.safeParse(id).success && !ids.includes(id)) ids.push(id);
        }
        selected.set(key, ids.slice(0, selector.take));
        state.selections.push({
          from: selector.from,
          subjectKind: selector.kind,
          observedRows: before,
          eligibleUniqueSubjects: ids.length,
          selected: ids.slice(0, selector.take),
          selectionBasis: selector.sort
            ? "local volume24hUSD ranking within fetched pages; missing 24h volume last"
            : "provider order within fetched pages",
          minLiquidity: plan.input.minLiquidity ?? null,
        });
      }
      subjects = selected.get(key)!;
      if (!subjects.length) {
        missing(
          step,
          undefined,
          "No eligible subjects in the fetched source pages",
        );
        continue;
      }
    }
    for (const subject of subjects) {
      const params = subject
        ? { ...step.params, [step.subjectKey!]: subject }
        : step.params;
      const identity = params.address ?? params.token_address ?? params.wallet;
      if (identity && blocked.has(identity)) {
        missing(
          step,
          identity,
          "Subject stopped by policy or missing required identity/security evidence",
        );
        continue;
      }
      if (halted) {
        missing(step, identity, "Run budget or authentication limit reached");
        continue;
      }
      progress(
        "fetching",
        `${step.operation}${identity ? ` · ${identity}` : ""}`,
      );
      try {
        const prepared = prepare(step.operation, params);
        const key = JSON.stringify([step.operation, prepared.params]);
        let result = cache.get(key);
        if (!result) {
          result = await runner.execute(step.operation, prepared.params, {
            run,
            signal,
          });
          cache.set(key, result);
          state.sources.push(result);
        }
        byStep.set(step.id, [...(byStep.get(step.id) || []), result]);
        const d = object(result.data);
        if (result.meta.coverage === "empty")
          missing(step, identity, "Empty upstream dataset");
        const reasons: string[] = [];
        let insufficient = false;
        if (step.operation === "token.overview") {
          if (d.address && d.address !== identity) {
            reasons.push("Returned contract does not match requested contract");
            insufficient = true;
          }
          if (plan.input.minLiquidity !== undefined) {
            const value = decimal(d.liquidity);
            if (!value) {
              reasons.push("Liquidity missing for required policy check");
              insufficient = true;
            } else if (value.lt(plan.input.minLiquidity))
              reasons.push("Liquidity below requested minimum");
          }
        }
        if (step.operation === "token.security") {
          if (plan.input.excludeFreezeable) {
            if (d.freezeable === true)
              reasons.push("Freezeable token excluded by requested policy");
            else if (d.freezeable !== false) {
              reasons.push("Freezeability unknown for required policy check");
              insufficient = true;
            }
          }
          if (plan.input.maxTop10Pct !== undefined) {
            const value = decimal(d.top10HolderPercent);
            if (!value) {
              reasons.push(
                "Top-10 token-account supply share missing for required policy check",
              );
              insufficient = true;
            } else if (value.times(100).gt(plan.input.maxTop10Pct))
              reasons.push(
                "Top-10 token-account supply share exceeds requested maximum",
              );
          }
        }
        if (
          result.meta.coverage === "empty" &&
          ["token.security", "token.overview"].includes(step.operation)
        ) {
          reasons.push("Required token evidence is empty");
          insufficient = true;
        }
        if (reasons.length) {
          blocked.add(identity);
          state.outcomes.push({
            address: identity,
            status: insufficient ? "insufficient-data" : "exclude-by-policy",
            reasons,
            sourceId: result.meta.requestId,
          });
        }
        snapshot(state);
      } catch (error) {
        if (signal?.aborted) throw error;
        const e = errorData(error);
        if (e.code === "RUN_STORAGE_FAILED") throw error;
        state.warnings.push(`${step.operation}: ${e.message}`);
        missing(step, identity, e.code);
        Object.assign(state.missing[state.missing.length - 1], {
          message: e.message,
          details: e.details,
        });
        if (
          ["token.security", "token.overview"].includes(step.operation) &&
          identity
        )
          blocked.add(identity);
        if (
          [
            "CU_BUDGET_EXCEEDED",
            "REQUEST_LIMIT",
            "AUTH_MISSING",
            "AUTH_INVALID",
            "ACCESS_DENIED",
          ].includes(e.code)
        ) {
          halted = true;
          state.warnings.push(
            "Remaining steps stopped; successful evidence and uncertain CU are retained.",
          );
        }
        snapshot(state);
      }
    }
  }
  return state;
}
