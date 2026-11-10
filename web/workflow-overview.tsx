import { createApiClient } from "./api";
const api = createApiClient();
import { AddressText } from "./address-text";
import { operationSubject } from "./birdeye-address";
import React, { useEffect, useRef, useState } from "react";
import { CliPreview } from "./cli-preview";
import { caseCliArgs } from "../src/cli-preview";

type Data = Record<string, any>;
export type PreparedCase = { key: string; input: Data };
type Props = {
  input: Data;
  inputKey: string;
  budget: number | null;
  onPrepared: (value: PreparedCase | null) => void;
};

const fieldLabels: Record<string, string> = {
  resolution: "Liquidity resolution",
  limit: "Rows per request",
  offset: "Rows to skip",
  sort_by: "Sort field",
  sort_type: "Sort order",
  time_from: "Start time · Unix seconds",
  time_to: "End time · Unix seconds",
  after_time: "After time · Unix seconds",
  before_time: "Before time · Unix seconds",
  type: "Interval / period",
  interval: "Trending window",
  duration: "PnL period",
  position_scope: "Position scope",
  pnl_method: "PnL accounting method",
  mode: "Holder grouping",
  labels: "Holder labels",
  tags: "Wallet tags",
  frames: "Flow time frames",
  token_addresses: "Token filter",
  include_zero_balance: "Include exited positions",
  top_10_holder: "Include top 10 holders",
  time_frame: "Time bucket",
  tx_type: "Trade type",
  ui_amount_mode: "Amount format",
  source: "Launch venue",
  graduated: "Graduated",
  min_liquidity: "Minimum liquidity · USD",
  min_progress_percent: "Minimum progress · %",
  min_creation_time: "Created after · Unix seconds",
  max_creation_time: "Created before · Unix seconds",
  min_graduated_time: "Graduated after · Unix seconds",
  max_graduated_time: "Graduated before · Unix seconds",
  time: "Bucket time · Unix seconds",
  count: "Bucket count",
};
const textValue = (value: unknown) =>
  value === undefined
    ? ""
    : Array.isArray(value)
      ? value.join(", ")
      : String(value);

function Field({
  step,
  name,
  schema,
  value,
  change,
}: {
  step: string;
  name: string;
  schema: Data;
  value: string;
  change: (value: string) => void;
}) {
  const id = `step-${step}-${name}`;
  const choices =
    schema.enum ?? (schema.const !== undefined ? [schema.const] : undefined);
  const numeric = ["number", "integer"].includes(schema.type);
  return (
    <div className="step-field">
      <label htmlFor={id}>
        {fieldLabels[name] ?? name.replaceAll("_", " ")}
      </label>
      {choices || schema.type === "boolean" ? (
        <select id={id} value={value} onChange={(e) => change(e.target.value)}>
          <option value="">Use recipe default</option>
          {(choices ?? [true, false]).map((v: unknown) => (
            <option key={String(v)} value={String(v)}>
              {String(v)}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={numeric ? "number" : "text"}
          value={value}
          step={schema.type === "integer" ? "1" : "any"}
          min={schema.minimum}
          max={schema.maximum}
          placeholder="Use recipe default"
          spellCheck={false}
          onChange={(e) => change(e.target.value)}
          aria-describedby={`${id}-hint`}
        />
      )}
      <small id={`${id}-hint`} className="field-hint">
        {schema.type === "array"
          ? `Comma-separated values${schema.items?.enum ? `: ${schema.items.enum.join(", ")}` : ""}.`
          : numeric
            ? `${schema.type === "integer" ? "Whole number" : "Number"}${schema.minimum !== undefined ? ` ≥ ${schema.minimum}` : ""}${schema.maximum !== undefined ? ` ≤ ${schema.maximum}` : ""}.`
            : (schema.description ?? "Blank uses the recipe default.")}
      </small>
    </div>
  );
}

export function WorkflowOverview({
  input,
  inputKey,
  budget,
  onPrepared,
}: Props) {
  const [plan, setPlan] = useState<Data | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>(
    {},
  );
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const baseline = useRef<Data | null>(null);
  const window = useRef<Data | null>(null);
  const signature = JSON.stringify(drafts);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    onPrepared(null);
    setChecking(true);
    setError("");
    const timer = setTimeout(async () => {
      try {
        const stepOverrides: Data = {};
        for (const [id, fields] of Object.entries(drafts)) {
          const step = baseline.current?.steps.find((s: Data) => s.id === id);
          const params: Data = {};
          for (const [name, raw] of Object.entries(fields)) {
            if (raw.trim() === "") continue;
            const schema = step?.inputSchema.properties[name];
            if (!schema)
              throw new Error(
                `Unknown parameter ${name} in step ${id}. Reset this step.`,
              );
            const numeric = ["integer", "number"].includes(schema.type);
            const value = numeric
              ? Number(raw)
              : schema.type === "boolean"
                ? raw === "true"
                : schema.type === "array"
                  ? raw
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  : raw;
            if (numeric && !Number.isFinite(value))
              throw new Error(`Step ${id}: ${name} must be a finite number.`);
            params[name] = value;
          }
          if (Object.keys(params).length) stepOverrides[id] = params;
        }
        const result = await api(
          "/plan",
          { ...input, ...window.current, stepOverrides },
          controller.signal,
        );
        if (cancelled) return;
        baseline.current ??= result;
        window.current ??= { from: result.input.from, to: result.input.to };
        setPlan(result);
        onPrepared(
          result.needsAddress ? null : { key: inputKey, input: result.input },
        );
      } catch (e: any) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setChecking(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timer);
    };
  }, [signature, refresh, inputKey, onPrepared]);

  function edit(step: string, name: string, value: string) {
    onPrepared(null);
    setChecking(true);
    setDrafts((previous) => ({
      ...previous,
      [step]: { ...previous[step], [name]: value },
    }));
  }
  function reset(step?: string) {
    onPrepared(null);
    setChecking(true);
    setDrafts((previous) => {
      if (!step) return {};
      const next = { ...previous };
      delete next[step];
      return next;
    });
  }
  const customized = Object.keys(drafts).length > 0;
  return (
    <section className="workflow-overview" aria-label="Skill parameters">
      {customized && (
        <div className="section-title">
          <button type="button" className="quiet" onClick={() => reset()}>
            Reset all steps
          </button>
        </div>
      )}
      {error && (
        <p role="alert" className="notice error">
          {error} Fix the parameter or reset the edited step.
        </p>
      )}
      {!plan && checking && (
        <p role="status" className="overview-help">
          Loading workflow steps…
        </p>
      )}
      <CliPreview
        collapsed
        args={
          plan &&
          !checking &&
          !error &&
          !plan.needsAddress &&
          (budget === null || (Number.isSafeInteger(budget) && budget >= 0))
            ? caseCliArgs(plan.input, budget)
            : null
        }
        status={
          checking
            ? "Updating command…"
            : error
              ? "Fix the parameters to preview the command."
              : undefined
        }
      />
      {plan && (
        <details className="workflow-details">
          <summary>
            API steps · {plan.steps.length}
            {customized ? " · Customized" : ""}
          </summary>
          <ol className="workflow-steps">
            {plan.steps.map((step: Data, index: number) => {
              const original =
                baseline.current?.steps.find((s: Data) => s.id === step.id) ??
                step;
              const fields = Object.entries(
                step.inputSchema.properties as Record<string, Data>,
              ).filter(([name]) => !step.lockedParams.includes(name));
              return (
                <li key={step.id} className="workflow-step">
                  <div className="step-heading">
                    <h4>
                      <span className="step-number">{index + 1}.</span>{" "}
                      {step.title ?? step.operation}
                      {step.params.duration && (
                        <span className="step-window">
                          {" "}
                          · {step.params.duration}
                        </span>
                      )}
                      {step.params.interval && (
                        <span className="step-window">
                          {" "}
                          · {step.params.interval}
                        </span>
                      )}
                    </h4>
                    <span className="step-cost">
                      {step.cuPerRequest} CU / request
                      {step.maxRequests > 1
                        ? ` × up to ${step.maxRequests}`
                        : ""}
                    </span>
                  </div>
                  <p className="step-purpose">{step.purpose}</p>
                  <dl className="step-facts">
                    <div>
                      <dt>Information</dt>
                      <dd>{step.collects}</dd>
                    </div>
                    <div>
                      <dt>API</dt>
                      <dd>
                        <code>
                          {step.method} {step.path}
                        </code>
                      </dd>
                    </div>
                    <div>
                      <dt>Subject</dt>
                      <dd>
                        <AddressText
                          kind={operationSubject(step.operation)}
                          chain={step.params.chain}
                          text={
                            step.subjects
                              ? `Up to ${step.subjects.take} ${step.subjects.kind}(s) from ${step.subjects.from
                                  .map((id: string) => {
                                    const i = plan.steps.findIndex(
                                      (s: Data) => s.id === id,
                                    );
                                    return `step ${i + 1} (${plan.steps[i]?.title ?? id})`;
                                  })
                                  .join(
                                    " + ",
                                  )}. ${step.subjects.sort ? "Ranked locally by 24h USD volume." : "Uses provider order."}`
                              : step.lockedParams.length
                                ? `Workflow subject: ${
                                    step.lockedParams
                                      .map((name: string) => step.params[name])
                                      .filter(Boolean)
                                      .join(", ") ||
                                    "enter the address or wallet list above"
                                  }.`
                                : "Market discovery; no address required."
                          }
                        />
                      </dd>
                    </div>
                  </dl>
                  {fields.length ? (
                    <details className="step-parameters">
                      <summary>
                        Adjust parameters{" "}
                        <span>
                          {drafts[step.id]
                            ? "Customized"
                            : `${fields.length} available`}
                        </span>
                      </summary>
                      <div className="step-fields">
                        {fields.map(([name, schema]) => (
                          <Field
                            key={name}
                            step={step.id}
                            name={name}
                            schema={schema}
                            value={
                              drafts[step.id]?.[name] ??
                              textValue(original.params[name])
                            }
                            change={(value) => edit(step.id, name, value)}
                          />
                        ))}
                      </div>
                      {step.subjects && (
                        <p className="field-hint">
                          Parameters apply to every selected subject in this
                          step.{" "}
                          {step.subjects.kind === "pair"
                            ? "This recipe selects at most one pair from Trading pools."
                            : "The workflow candidate limit controls the number of subjects."}
                        </p>
                      )}
                      {step.warnings.map((warning: string) => (
                        <p className="field-hint" key={warning}>
                          {warning}
                        </p>
                      ))}
                      {drafts[step.id] && (
                        <button
                          type="button"
                          className="quiet"
                          onClick={() => reset(step.id)}
                        >
                          Reset this step
                        </button>
                      )}
                    </details>
                  ) : (
                    <p className="field-hint">
                      This API only takes the workflow address. No additional
                      parameters.
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </details>
      )}
      <div className="workflow-estimate">
        <button
          type="button"
          className="quiet"
          disabled={checking}
          onClick={() => {
            onPrepared(null);
            setChecking(true);
            setRefresh((n) => n + 1);
          }}
        >
          Estimate CU
        </button>
        <span role="status" className="estimate-status">
          {checking
            ? "Checking parameters and CU…"
            : error
              ? "Fix the parameters to estimate and run."
              : plan
                ? `${plan.estimatedCu} CU before retries · at most ${plan.maxRequests} requests`
                : "Estimate is free."}
        </span>
      </div>
      {plan &&
        !checking &&
        !error &&
        budget !== null &&
        plan.estimatedCu > budget && (
          <p className="notice">
            The planned work exceeds this run’s budget. Reduce the scope or
            expect a partial report.
          </p>
        )}
      {plan && (
        <details className="workflow-scope">
          <summary>Scope and cost notes</summary>
          <ul>
            {plan.notes.map((note: string) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
