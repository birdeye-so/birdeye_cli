import { z } from "zod";
import { randomUUID } from "node:crypto";
import { catalog, prepare, PRICING_VERSION, type Entry } from "./catalog.js";
import { address, timestamp } from "./schemas.js";
import {
  planCase,
  executePlan,
  workflowCatalog,
  type Step,
  type CasePlan,
  type Execution,
} from "./workflows.js";
import { runCase, analysisResult, type Progress } from "./analysis.js";
import { KnowledgeBase } from "./knowledge.js";
import type { Ledger } from "./ledger.js";
import type { Runner, Result } from "./runner.js";
import { AppError, now, type Data } from "./shared.js";
import type { WorkflowSource } from "./workflow-sources.js";

const placeholder = "So11111111111111111111111111111111111111112";
const stepSchema = z
  .object({
    id: z.string().regex(/^[a-zA-Z][\w-]{0,63}$/),
    operation: z.string().min(1).max(100),
    purpose: z.string().max(1000).optional(),
    params: z.record(z.string(), z.unknown()).default({}),
    subjects: z
      .object({
        from: z.array(z.string()).min(1).max(10),
        kind: z.enum(["token", "wallet", "pair"]),
        take: z.number().int().min(1).max(5).default(3),
      })
      .strict()
      .optional(),
    subjectKey: z.enum(["address", "token_address", "wallet"]).optional(),
  })
  .strict();
const manifestSchema = z
  .object({
    version: z.literal(1),
    title: z.string().min(1).max(200),
    purpose: z.string().min(1).max(2000),
    chain: z.literal("solana").default("solana"),
    steps: z.array(stepSchema).min(1).max(20),
  })
  .strict();
export const importRuntimeSchema = z
  .object({
    address: address.optional(),
    from: timestamp.optional(),
    to: timestamp.optional(),
    limit: z.number().int().min(1).max(5).optional(),
    stepOverrides: z
      .record(z.string(), z.record(z.string(), z.unknown()))
      .default({}),
  })
  .strict()
  .refine(
    (p) =>
      (p.from === undefined) === (p.to === undefined) &&
      (p.from === undefined || p.from < p.to!),
    "Provide an ordered from/to pair, or neither",
  );
type Manifest = z.infer<typeof manifestSchema>;
type Definition = { recipe: Data } | { manifest: Manifest };
type Mapping = {
  command: string;
  operation?: string;
  status: "adapted" | "candidate" | "unsupported";
  note: string;
};
export type ImportedWorkflow = {
  id: string;
  title: string;
  purpose: string;
  adapter: string;
  createdAt: string;
  source: WorkflowSource;
  definition: Definition | null;
  notes: string[];
  mapping: Mapping[];
};
export function migrateWorkflow(source: WorkflowSource): ImportedWorkflow {
  const record: ImportedWorkflow = {
    id: randomUUID(),
    title: source.name.replace(/\.(md|json)$/i, ""),
    purpose: "Imported research workflow",
    adapter: "markdown",
    createdAt: now(),
    source,
    definition: null,
    notes: [],
    mapping: [],
  };
  if (
    source.content.trimStart().startsWith("{") ||
    source.name.endsWith(".json")
  ) {
    const manifest = manifestSchema.parse(JSON.parse(source.content));
    record.title = manifest.title;
    record.purpose = manifest.purpose;
    record.adapter = "birdeye-json";
    record.definition = { manifest };
    planImported(record, {}, true);
    return record;
  }
  record.title =
    source.content.match(/^#\s+(.+)$/m)?.[1].slice(0, 200) || record.title;
  const native = source.name.match(
    /^(trending-list|token-dd|contract-dd|kline-pattern|wallet-score|wallet-style)-workflow\.md$/,
  )?.[1];
  if (native && /^#\s+Workflow:/m.test(source.content)) {
    const kind = `skill-${native}`,
      recipe = workflowCatalog().find((r) => r.kind === kind)!;
    record.adapter = "birdeye-data-skills";
    record.purpose = recipe.purpose;
    record.definition = { recipe: { kind } };
    record.notes = [
      "Uses this CLI's reviewed Birdeye Data Skills recipe. Solana only; source prose/options are not compiled. Scores and missing evidence follow the registered recipe, not an assertion of identical source results.",
    ];
    record.mapping = planImported(record, {}, true).steps.map((s) => ({
      command: `Registered recipe step: ${s.id}`,
      operation: s.operation,
      status: "adapted",
      note: "See the registered step parameters and source migration audit for scope differences.",
    }));
    return record;
  }
  record.notes = [
    "No reviewed named adapter for this document. Supply a version 1 Birdeye workflow JSON manifest to make it executable.",
  ];
  return record;
}
function substitute(value: unknown, input: Data): unknown {
  if (typeof value === "string" && value.includes("{{")) {
    const key = value.match(/^\{\{(address|from|to)\}\}$/)?.[1];
    if (!key)
      throw new AppError(
        "IMPORT_BINDING",
        "Bindings must be exactly {{address}}, {{from}} or {{to}}.",
      );
    if (input[key] === undefined)
      throw new AppError("IMPORT_INPUT", `Provide workflow ${key}.`);
    return input[key];
  }
  if (Array.isArray(value)) return value.map((v) => substitute(v, input));
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, substitute(v, input)]),
    );
  return value;
}
export function planImported(
  record: ImportedWorkflow,
  runtime: unknown = {},
  preview = false,
  at = Math.floor(Date.now() / 1000),
): CasePlan & { needsAddress: boolean; usesAddressInput: boolean } {
  if (!record.definition)
    throw new AppError(
      "IMPORT_REVIEW_REQUIRED",
      "This source has endpoint candidates only. Import a reviewed workflow JSON to execute it.",
    );
  const input = importRuntimeSchema.parse(runtime);
  if ("recipe" in record.definition) {
    const recipe = record.definition.recipe;
    const subject =
      workflowCatalog().find((r) => r.kind === recipe.kind)?.subject || "";
    const needsAddress =
      ["token", "wallet"].includes(subject) && !input.address;
    if (needsAddress && !preview)
      throw new AppError(
        "IMPORT_INPUT",
        "Provide a Solana token/wallet address.",
      );
    const overrides: Data = { ...recipe.stepOverrides };
    for (const [id, params] of Object.entries(input.stepOverrides))
      overrides[id] = { ...overrides[id], ...params };
    const plan = planCase(
      {
        ...recipe,
        ...input,
        stepOverrides: overrides,
        ...(needsAddress ? { address: placeholder } : {}),
      },
      at,
    );
    return { ...plan, needsAddress, usesAddressInput: subject !== "none" };
  }
  const manifest = manifestSchema.parse(record.definition.manifest);
  const usesAddressInput = manifest.steps.some((s) =>
    JSON.stringify({ ...s.params, ...input.stepOverrides[s.id] }).includes(
      "{{address}}",
    ),
  );
  const needsAddress = usesAddressInput && !input.address;
  if (needsAddress && !preview)
    throw new AppError(
      "IMPORT_INPUT",
      "Provide a Solana token/wallet address.",
    );
  const bindings = {
    address: needsAddress ? placeholder : input.address,
    from: input.from ?? at - 86400,
    to: input.to ?? at,
  };
  const seen = new Set<string>();
  const steps: Step[] = manifest.steps.map((step) => {
    if (seen.has(step.id))
      throw new AppError("IMPORT_DEPENDENCY", `Duplicate step ${step.id}.`);
    if (step.subjects?.from.some((id) => !seen.has(id)))
      throw new AppError(
        "IMPORT_DEPENDENCY",
        `Step ${step.id} must depend on an earlier step.`,
      );
    if (step.subjectKey && !step.subjects)
      throw new AppError(
        "IMPORT_DEPENDENCY",
        "subjectKey requires a subjects selector.",
      );
    const params = substitute(
      { ...step.params, ...input.stepOverrides[step.id] },
      bindings,
    ) as Data;
    const subjectKey = step.subjectKey || "address";
    if (step.subjects && Object.hasOwn(params, subjectKey))
      throw new AppError(
        "IMPORT_BINDING",
        `Step ${step.id}: remove ${subjectKey}; it comes from selected subjects.`,
      );
    const prepared = prepare(
      step.operation,
      { ...params, ...(step.subjects ? { [subjectKey]: placeholder } : {}) },
      manifest.chain,
    );
    seen.add(step.id);
    if (step.subjects) delete prepared.params[subjectKey];
    return {
      id: step.id,
      operation: prepared.operation,
      params: prepared.params,
      cost: prepared.entry.cost,
      ...(step.subjects
        ? {
            subjects: {
              ...step.subjects,
              take: Math.min(step.subjects.take, input.limit ?? 5),
            },
            subjectKey,
          }
        : {}),
    };
  });
  for (const key of Object.keys(input.stepOverrides))
    if (!seen.has(key))
      throw new AppError("IMPORT_INPUT", `Unknown step override ${key}.`);
  const maxRequests = steps.reduce((n, s) => n + (s.subjects?.take ?? 1), 0);
  // The shared executor only reads these policy/window fields for custom plans.
  const executionInput = planCase({
    kind: "market-shortlist",
    from: bindings.from,
    to: bindings.to,
  }).input;
  return {
    kind: `import:${record.id}`,
    input: executionInput,
    steps,
    maxRequests,
    estimatedCu: steps.reduce(
      (n, s) => n + s.cost * (s.subjects?.take ?? 1),
      0,
    ),
    pricingVersion: PRICING_VERSION,
    notes: [
      "One page per step; bounded subjects in provider order. Estimates exclude retries. No source code or trading actions execute.",
    ],
    needsAddress,
    usesAddressInput,
  };
}
export class WorkflowImports {
  constructor(private ledger: Ledger) {
    ledger.db.exec(
      "CREATE TABLE IF NOT EXISTS workflow_imports (id TEXT PRIMARY KEY, source_hash TEXT NOT NULL, origin TEXT NOT NULL, payload TEXT NOT NULL, UNIQUE(source_hash,origin))",
    );
  }
  save(record: ImportedWorkflow) {
    const existing = this.ledger.db
      .prepare(
        "SELECT id FROM workflow_imports WHERE source_hash=? AND origin=?",
      )
      .get(record.source.sha256, record.source.origin);
    if (existing) return this.get(String(existing.id));
    this.ledger.db
      .prepare("INSERT INTO workflow_imports VALUES(?,?,?,?)")
      .run(
        record.id,
        record.source.sha256,
        record.source.origin,
        JSON.stringify(record),
      );
    return record;
  }
  import(sources: WorkflowSource[]) {
    const records = sources.map(migrateWorkflow); // validate the complete batch before writing
    this.ledger.db.exec("BEGIN IMMEDIATE");
    try {
      const saved = records.map((r) => this.save(r));
      this.ledger.db.exec("COMMIT");
      return saved;
    } catch (error) {
      this.ledger.db.exec("ROLLBACK");
      throw error;
    }
  }
  get(id: string): ImportedWorkflow {
    const row = this.ledger.db
      .prepare("SELECT payload FROM workflow_imports WHERE id=?")
      .get(id);
    if (!row)
      throw new AppError("IMPORT_NOT_FOUND", "Imported workflow not found.");
    return JSON.parse(String(row.payload));
  }
  list() {
    return this.ledger.db
      .prepare("SELECT payload FROM workflow_imports ORDER BY rowid DESC")
      .all()
      .map((row) => {
        const r: ImportedWorkflow = JSON.parse(String(row.payload));
        return {
          id: r.id,
          title: r.title,
          purpose: r.purpose,
          adapter: r.adapter,
          createdAt: r.createdAt,
          executable: !!r.definition,
          origin: r.source.origin,
          sha256: r.source.sha256,
        };
      });
  }
  preview(id: string, runtime: unknown = {}) {
    const r = this.get(id),
      plan = r.definition ? planImported(r, runtime, true) : null;
    const kb = new KnowledgeBase(this.ledger);
    const describe = (operation: string) => {
      const entry: Entry = catalog[operation as keyof typeof catalog];
      const match = this.ledger.db
        .prepare(
          "SELECT id FROM knowledge_documents WHERE instr(body, ?) > 0 LIMIT 1",
        )
        .get(`${entry.method || "GET"} ${entry.path}\n`);
      return {
        operation,
        path: entry.path,
        method: entry.method || "GET",
        description: entry.description,
        docs: match
          ? `https://data.birdeye.so/docs/${String(match.id)
              .replace(/^docs\//, "")
              .replace(/\.md$/, "")}`
          : "https://data.birdeye.so/docs",
        docsSnapshot: kb.info.sourceCommit,
      };
    };
    const runtimeInput = importRuntimeSchema.parse(runtime);
    return {
      ...r,
      source: { ...r.source, content: undefined },
      mapping: r.mapping.map((m) => ({
        ...m,
        ...(m.operation ? describe(m.operation) : {}),
      })),
      plan: plan
        ? {
            ...plan,
            steps: plan.steps.map((s) => {
              const custom =
                "manifest" in r.definition!
                  ? r.definition.manifest.steps.find((x) => x.id === s.id)
                  : undefined;
              const raw = {
                ...custom?.params,
                ...runtimeInput.stepOverrides[s.id],
              };
              const lockedParams = [
                "address",
                "wallet",
                "token_address",
              ].filter(
                (k) =>
                  !custom ||
                  raw[k] === "{{address}}" ||
                  (s.subjects && k === s.subjectKey),
              );
              const subjectParameters = Object.fromEntries(
                Object.entries(s.params)
                  .filter(([k]) =>
                    ["address", "wallet", "token_address"].includes(k),
                  )
                  .map(([k, v]) => [
                    k,
                    plan.needsAddress && lockedParams.includes(k)
                      ? "Provide workflow address"
                      : v,
                  ]),
              );
              return {
                ...s,
                ...describe(s.operation),
                inputSchema: z.toJSONSchema(catalog[s.operation].schema),
                purpose: custom?.purpose,
                lockedParams,
                subjectParameters,
              };
            }),
          }
        : null,
    };
  }
}
export async function runImported(
  runner: Runner,
  run: string,
  record: ImportedWorkflow,
  runtime: unknown = {},
  signal?: AbortSignal,
  progress: Progress = () => {},
  evidence: (r: Result) => void = () => {},
) {
  const plan = planImported(record, runtime);
  const decorate = (result: Result) => {
    result.data.importedWorkflow = {
      id: record.id,
      title: record.title,
      adapter: record.adapter,
      origin: record.source.origin,
      sha256: record.source.sha256,
      mapping: record.mapping,
    };
    result.data.scopeNotes = [
      ...(result.data.scopeNotes || []),
      ...record.notes,
    ];
    if (record.notes.length) {
      result.meta.coverage = "partial";
      result.data.status = "partial";
      result.meta.warnings = [...result.meta.warnings, ...record.notes];
    }
    return result;
  };
  if ("recipe" in record.definition!)
    return decorate(
      await runCase(runner, run, plan.input, signal, progress, (r) =>
        evidence(decorate(r)),
      ),
    );
  const resultFor = (state: Execution) => {
    const result = analysisResult(
      run,
      runner,
      plan.kind,
      state.sources,
      state.warnings,
    );
    Object.assign(result.data, {
      plan,
      selections: state.selections,
      outcomes: state.outcomes,
      missing: state.missing,
      scopeNotes: plan.notes,
      status: state.missing.length ? "partial" : result.meta.coverage,
    });
    result.meta.coverage = result.data.status;
    return decorate(result);
  };
  return resultFor(
    await executePlan(runner, run, plan, signal, progress, (s) =>
      evidence(resultFor(s)),
    ),
  );
}
