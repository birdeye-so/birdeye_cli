import { BigNumber } from "bignumber.js";
import { caseSchema, planCase, executePlan, type CaseInput, type Execution } from "./workflows.js";
import { workflowMetrics } from "./metrics.js";
import { skillAnalysis } from "./skill-metrics.js";
import { attachDdCu } from "./token-dd-rescore.js";
export { caseSchema, type CaseInput };
import { Runner, type Result } from "./runner.js";
import { object, decimal, errorData, now, type Data } from "./shared.js";

export type Progress = (stage: string, message: string) => void;
export function metricsFor(sources: Result[]) {
  const rows: Data[] = [];
  for (const source of sources) {
    rows.push(...workflowMetrics(source));
    const d = object(source.data);
    const op = source.meta.operation;
    const base = {
      sourceId: source.meta.requestId,
      asOf: d.current_timestamp ?? d.updateHumanTime ?? source.meta.retrievedAt,
      chain: source.meta.chain,
    };
    if (op === "token.overview") {
      const liquidity = decimal(d.liquidity),
        volume = decimal(d.v24hUSD);
      rows.push({
        ...base,
        address: d.address || source.meta.params.address,
        symbol: d.symbol ?? null,
        priceUsd: d.price ?? null,
        liquidityUsd: d.liquidity ?? null,
        volume24hUsd: d.v24hUSD ?? null,
        priceChange24hPct: d.priceChange24hPercent ?? null,
        volumeLiquidityRatio:
          liquidity?.gt(0) && volume ? volume.div(liquidity).toFixed(6) : null,
        ratioBasis: "24h volume / point-in-time liquidity",
      });
    }
    if (op === "portfolio.holdings") {
      const items: Data[] = Array.isArray(d.items) ? d.items : [];
      const total = items.reduce<BigNumber>(
        (sum, row) => sum.plus(decimal(row.valueUsd ?? row.value) ?? 0),
        new BigNumber(0),
      );
      for (const item of items) {
        const value = decimal(item.valueUsd ?? item.value);
        rows.push({
          ...base,
          address: item.address,
          symbol: item.symbol ?? null,
          valueUsd: value?.toString() ?? null,
          observedWeightPct:
            value && total.gt(0)
              ? value.div(total).times(100).toFixed(6)
              : null,
          weightBasis: "priced assets on the fetched page only",
          coverage: "page",
        });
      }
    }
    if (op === "token.security") {
      const share = decimal(d.top10HolderPercent);
      rows.push({
        ...base,
        address: source.meta.params.address,
        freezeable: d.freezeable ?? null,
        mutableMetadata: d.mutableMetadata ?? null,
        top10HolderPct: share ? share.times(100).toString() : null,
        securityCoverage: "upstream observations; not a safety verdict",
      });
    }
    if (op === "token.price")
      rows.push({
        ...base,
        address: source.meta.params.address,
        priceUsd: d.value ?? null,
        priceChange24hPct: d.priceChange24h ?? null,
      });
  }
  return rows;
}
export function analysisResult(
  run: string,
  runner: Runner,
  kind: string,
  sources: Result[],
  warnings: string[],
  answer?: string,
): Result {
  const partial =
    warnings.length > 0 || sources.some((s) => s.meta.coverage === "empty");
  return {
    schemaVersion: 1,
    data: { kind, answer, metrics: metricsFor(sources), sources },
    meta: {
      runId: run,
      operation: "analysis",
      chain: "solana",
      retrievedAt: now(),
      formulaVersion: 1,
      coverage: partial ? "partial" : "complete-for-requested-scope",
      cu: runner.ledger.summary(run),
      warnings: [...warnings, ...sources.flatMap((s) => s.meta.warnings ?? [])],
    },
  };
}
export async function runCase(
  runner: Runner,
  run: string,
  input: unknown,
  signal?: AbortSignal,
  progress: Progress = () => {},
  evidence: (result: Result) => void = () => {},
): Promise<Result> {
  const plan = planCase(input);
  function resultFor(state: Execution) {
    const result = analysisResult(run, runner, plan.kind, state.sources, state.warnings);
    result.data.plan = {kind: plan.kind, input: plan.input, steps: plan.steps, estimatedCu: plan.estimatedCu, maxRequests: plan.maxRequests, pricingVersion: plan.pricingVersion};
    result.data.selections = state.selections;
    result.data.outcomes = state.outcomes;
    result.data.missing = state.missing;
    result.data.scopeNotes = plan.notes;
    result.data.status = state.missing.length || state.warnings.length || state.sources.some(s => s.meta.coverage === "empty") ? "partial" : "complete-for-requested-scope";
    if (plan.kind.startsWith("skill-")) {
      result.data.skillAnalysis = skillAnalysis(plan.input, state.sources);
      attachDdCu(result,runner.ledger,run);
      const missing = result.data.skillAnalysis.findings.flatMap((f: Data) => f.missing ?? []);
      if (missing.length) {
        result.data.status = "partial";
        result.data.missing = [...result.data.missing, ...missing.map((reason: string) => ({step: "analysis", reason}))];
      }
    }
    result.meta.coverage = result.data.status;
    if (plan.kind === "smart-money-profile") result.data.copyTradeRoi = null;
    if (plan.kind === "risk-warning" && plan.input.baselineLiquidity !== undefined) {
      const observation = state.sources.find(s => s.meta.operation === "token.overview");
      const value = decimal(observation?.data?.liquidity);
      result.data.metrics.push({
        sourceId: observation?.meta.requestId ?? null, address: plan.input.address,
        liquidityChangePct: value ? value.div(plan.input.baselineLiquidity).minus(1).times(100).toFixed(6) : null,
        baselineLiquidity: plan.input.baselineLiquidity, baselineTime: plan.input.baselineTime,
        basis: "user-supplied token liquidity baseline; USD change does not prove withdrawal",
      });
    }
    return result;
  }
  const state = await executePlan(runner, run, plan, signal, progress, state => evidence(resultFor(state)));
  progress("calculating", "Calculating metrics from retrieved data");
  return resultFor(state);
}
