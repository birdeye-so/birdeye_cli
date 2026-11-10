import { z } from "zod";
import { runCase } from "../analysis.js";
import { Ledger } from "../ledger.js";
import { planPriceSurge } from "../price-surge/api.js";
import { RunStore, type StoredRun } from "../run-store.js";
import { Runner, type Result } from "../runner.js";
import { address } from "../schemas.js";
import { AppError, errorData, now } from "../shared.js";
import { planCase } from "../workflows.js";
import { workflowInputSchema } from "../workflows/input.js";
import { attachDdCu } from "../token-dd-runtime.js";

export type ResearchEndpoint = "price-surge" | "token-dd";
const controlsSchema = z.object({
  estimate_cu: z.boolean().default(false),
  max_cu: z
    .number()
    .int()
    .min(0)
    .max(Number.MAX_SAFE_INTEGER)
    .nullable()
    .optional(),
});
const tokenDdSchema = z
  .object({
    chain: z.literal("solana").default("solana"),
    address,
    mode: workflowInputSchema.shape.ddMode,
    top_n: workflowInputSchema.shape.topN,
    liq_resolution: workflowInputSchema.shape.liqResolution,
    liq_candles: workflowInputSchema.shape.liqCandles,
  })
  .strict();

// Transport-independent preflight: no credentials, storage writes or paid calls.
export function prepareResearchRequest(
  endpoint: ResearchEndpoint,
  input: unknown,
) {
  const { estimate_cu, max_cu, ...params } = z
    .record(z.string(), z.unknown())
    .parse(input);
  const controls = controlsSchema.parse({ estimate_cu, max_cu });
  if (endpoint === "price-surge") {
    const plan = planPriceSurge(params);
    return {
      controls,
      plan,
      workflow: planCase({ kind: plan.kind, priceSurge: plan.params }),
    };
  }
  if (endpoint !== "token-dd")
    throw new AppError("INVALID_INPUT", "Unknown research endpoint.");
  const dd = tokenDdSchema.parse(params);
  const plan = planCase({
    kind: "skill-token-dd-score",
    address: dd.address,
    ddMode: dd.mode,
    topN: dd.top_n,
    liqResolution: dd.liq_resolution,
    liqCandles: dd.liq_candles,
  });
  return { controls, plan, workflow: plan };
}

export class ResearchRunError extends AppError {
  constructor(
    error: unknown,
    public runId: string,
    public result?: Result,
  ) {
    const data = errorData(error);
    super(data.code, data.message, data.retryable);
  }
}

export type ResearchServiceOptions = {
  ledger: Ledger;
  /** Per-request ceiling. A caller may lower it, but cannot remove it. */
  maxCu?: number;
  runnerFactory?: (apiKey: string) => Runner;
};

export type ResearchRequestContext = { apiKey?: string; signal?: AbortSignal };

// Owns execution and persistence, without importing the CLI or web interface.
export class ResearchService {
  private archive: RunStore;
  private active?: { controller: AbortController; task: Promise<Result> };
  private closing = false;

  constructor(private options: ResearchServiceOptions) {
    controlsSchema.parse({ max_cu: options.maxCu });
    this.archive = new RunStore(options.ledger);
  }

  get isClosing() {
    return this.closing;
  }

  async run(
    endpoint: ResearchEndpoint,
    input: unknown,
    context: ResearchRequestContext = {},
  ) {
    const prepared = prepareResearchRequest(endpoint, input);
    if (this.closing)
      throw new AppError(
        "SERVICE_CLOSING",
        "The research service is shutting down.",
      );
    if (prepared.controls.estimate_cu) return prepared.plan;
    const { apiKey, signal } = context;
    if (!apiKey)
      throw new AppError(
        "AUTH_MISSING",
        "Send your Birdeye API key in the X-API-KEY header for each live request.",
      );
    if (typeof apiKey !== "string" || !/^[\x21-\x7e]{1,4096}$/.test(apiKey))
      throw new AppError(
        "AUTH_INVALID",
        "X-API-KEY must contain a single nonempty key without whitespace, up to 4096 characters.",
      );
    if (this.active)
      throw new AppError(
        "RUN_BUSY",
        "A research run is already active. Wait for completion.",
      );
    signal?.throwIfAborted();
    const controller = new AbortController();
    const combined = signal
      ? AbortSignal.any([controller.signal, signal])
      : controller.signal;
    // Schedule execution after installing the active slot, including synchronous failures.
    const task = Promise.resolve().then(() =>
      this.execute(prepared, apiKey, combined),
    );
    this.active = { controller, task };
    try {
      return await task;
    } finally {
      this.active = undefined;
    }
  }

  private async execute(
    prepared: ReturnType<typeof prepareResearchRequest>,
    apiKey: string,
    signal: AbortSignal,
  ): Promise<Result> {
    signal.throwIfAborted();
    const { ledger, maxCu: ceiling } = this.options;
    const requested = prepared.controls.max_cu;
    const maxCu =
      ceiling === undefined
        ? (requested ?? null)
        : Math.min(ceiling, requested ?? ceiling);
    const plan = prepared.workflow;
    // A fresh runner holds only this caller's key. Credentials never enter saved inputs.
    const runner =
      this.options.runnerFactory?.(apiKey) ?? new Runner(ledger, apiKey);
    const id = ledger.createRun(
      maxCu,
      undefined,
      Math.max(20, plan.maxRequests * 2),
    );
    const saved: StoredRun = {
      id,
      title:
        plan.kind === "skill-price-surge"
          ? "Price Surge"
          : "Token Due-Diligence Score",
      status: "running",
      createdAt: now(),
      input: { mode: "case", case: plan.input, maxCu },
      ai: {},
    };
    this.archive.save(saved); // Fail before paid calls if durable storage is unavailable.
    try {
      saved.result = await runCase(
        runner,
        id,
        plan.input,
        signal,
        undefined,
        (result) => {
          saved.result = result;
          this.archive.save(saved);
        },
      );
      signal.throwIfAborted();
      saved.status =
        saved.result.meta.coverage === "partial" ? "partial" : "completed";
      this.archive.save(saved);
      return saved.result;
    } catch (error) {
      saved.error = errorData(error);
      saved.status = signal.aborted ? "cancelled" : "failed";
      if (saved.result) {
        saved.result.meta.coverage = "partial";
        saved.result.data.status = "partial";
        saved.result.meta.cu = ledger.summary(id);
        attachDdCu(saved.result, ledger, id);
        saved.result.meta.warnings = [
          ...(saved.result.meta.warnings ?? []),
          errorData(error).message,
        ];
      }
      try {
        this.archive.save(saved);
      } catch (storageError) {
        error = storageError;
      }
      throw new ResearchRunError(error, id, saved.result);
    }
  }

  async close() {
    this.closing = true;
    this.active?.controller.abort();
    await this.active?.task.catch(() => {});
  }
}
