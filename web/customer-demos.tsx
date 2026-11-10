import React, { useEffect, useRef, useState } from "react";
import { AddressText } from "./address-text";
import { DemoView } from "./demo-views";
import { CliPreview } from "./cli-preview";
import { demoCliArgs } from "../src/cli-preview";
import { DemoIcon, demoLabels } from "./demo-icon";
type Data = Record<string, any>;
function download(value: unknown, name: string, type = "application/json") {
  const url = URL.createObjectURL(
    new Blob(
      [typeof value === "string" ? value : JSON.stringify(value, null, 2)],
      { type },
    ),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function CustomerDemos({
  api,
  busy,
  budget,
  setBudget,
  run,
  progress,
  start,
}: {
  api: (path: string, input?: unknown) => Promise<Data>;
  busy: boolean;
  budget: number | null;
  setBudget: (n: number | null) => void;
  run: Data | null;
  progress: string;
  start: (input: Data) => Promise<void>;
}) {
  const [items, setItems] = useState<Data[]>([]),
    [input, setInput] = useState<Data>({
      id: "terminal",
      limit: 3,
      minLiquidity: 100000,
      maxTop10Pct: 50,
    }),
    [plan, setPlan] = useState<Data | null>(null);
  const [working, setWorking] = useState(false),
    [error, setError] = useState("");
  const inputKey = JSON.stringify(input),
    currentKey = useRef(inputKey);
  const runButton = useRef<HTMLButtonElement>(null),
    submission = useRef(0),
    pending = useRef(false);
  currentKey.current = inputKey;
  useEffect(
    () => () => {
      currentKey.current = "unmounted";
      submission.current++;
    },
    [],
  );
  const ready = plan?.inputKey === inputKey;
  useEffect(() => {
    let cancelled = false;
    void api("/demos")
      .then((r) => {
        if (!cancelled) setItems(r.items);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    submission.current++;
    pending.current = false;
    setWorking(false);
    if (run?.input?.mode === "demo") {
      setInput({ ...run.input.demo, from: undefined, to: undefined });
      setPlan(null);
      setError("");
    }
  }, [run?.id]);
  const definition = items.find((d) => d.id === input.id),
    disabled = busy || working;
  const walletDemo = input.id === "wallet-intelligence",
    walletDiscovery = walletDemo && !input.address;
  const relevant =
    run?.input?.mode === "demo" &&
    run.input.demo?.id === input.id &&
    !(walletDiscovery && run.input.demo.address)
      ? run
      : null;
  const report = relevant?.result?.data?.demo;
  function edit(values: Data) {
    setInput((previous) => ({
      ...previous,
      ...values,
      from: undefined,
      to: undefined,
    }));
    setPlan(null);
    setError("");
  }
  function selectWallet(address: string) {
    edit({ address });
    runButton.current?.focus();
  }
  async function createDraft(e: React.FormEvent) {
    e.preventDefault();
    if (busy || pending.current) return;
    if (budget !== null && (!Number.isSafeInteger(budget) || budget < 0)) {
      setError(
        "Enter a non-negative whole CU limit, or leave it blank for unlimited.",
      );
      return;
    }
    const key = inputKey,
      id = ++submission.current;
    pending.current = true;
    setWorking(true);
    setError("");
    setPlan(null);
    try {
      const value = await api("/demos/plan", input);
      if (submission.current !== id || currentKey.current !== key) return;
      setPlan({ ...value, inputKey: key });
      if (value.needsAddress) {
        setError("Enter a token or wallet address.");
        return;
      }
      if (
        !Number.isFinite(value.estimatedCu) ||
        (budget !== null && value.estimatedCu > budget)
      ) {
        setError(
          `Draft needs ${value.estimatedCu} estimated CU; your limit is ${budget}.`,
        );
        return;
      }
      await start(value.demoInput);
    } catch (e: any) {
      if (submission.current === id && currentKey.current === key)
        setError(e.message);
    } finally {
      if (submission.current === id) {
        pending.current = false;
        setWorking(false);
      }
    }
  }
  return (
    <div className="customer-demos">
      <div className="demo-page-title">
        <h1>Demos</h1>
        <span className="field-hint">Solana</span>
      </div>
      <nav className="demo-navigation" aria-label="Product use case">
        {items.map((d) => (
          <button
            key={d.id}
            type="button"
            disabled={disabled}
            aria-label={d.title}
            aria-pressed={input.id === d.id}
            onClick={() => {
              setInput({
                id: d.id,
                limit: 3,
                minLiquidity: 100000,
                maxTop10Pct: 50,
              });
              setPlan(null);
              setError("");
            }}
          >
            <DemoIcon id={d.id} />
            <span>{demoLabels[d.id] || d.title}</span>
          </button>
        ))}
      </nav>
      {error && (
        <p className="notice error" role="alert">
          {error}
        </p>
      )}
      {!items.length && !error && <p role="status">Loading demo workflows…</p>}
      {definition && (
        <>
          <div className="demo-workspace-heading">
            <h2>{definition.title}</h2>
            <details className="demo-about">
              <summary>About</summary>
              <div>
                <p>{definition.purpose}</p>
                <p className="field-hint">{definition.limitation}</p>
              </div>
            </details>
          </div>
          {walletDemo && (
            <div
              className="demo-wallet-steps"
              role="group"
              aria-label="Wallet research stage"
            >
              <button
                className="secondary"
                type="button"
                disabled={disabled}
                aria-pressed={walletDiscovery}
                onClick={() => edit({ address: undefined })}
              >
                Discover smart wallets
              </button>
              <span className={!walletDiscovery ? "active" : ""}>
                Analyze wallet
              </span>
            </div>
          )}
          <form className="demo-run-form" onSubmit={createDraft}>
            <div className="demo-query-row">
              {walletDemo && input.address && (
                <div className="demo-selected-wallet" role="status">
                  <span className="field-hint">Selected wallet</span>
                  <AddressText
                    text={input.address}
                    kind="wallet"
                    chain={input.chain}
                  />
                </div>
              )}
              {definition.subject !== "none" && (
                <label className="demo-subject">
                  {definition.subject === "wallet"
                    ? "Wallet address"
                    : "Token address"}
                  <input
                    required
                    value={input.address || ""}
                    disabled={disabled}
                    onChange={(e) => edit({ address: e.target.value.trim() })}
                    spellCheck={false}
                    placeholder="Paste a Solana address"
                  />
                </label>
              )}
              {(input.id === "terminal" || walletDiscovery) && (
                <label className="demo-limit">
                  {walletDiscovery
                    ? "Maximum tokens / wallets"
                    : "Maximum tokens"}
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={input.limit}
                    disabled={disabled}
                    onChange={(e) => edit({ limit: Number(e.target.value) })}
                  />
                </label>
              )}
              <label className="demo-budget">
                CU limit per run
                <input
                  type="number"
                  min={0}
                  placeholder="Unlimited"
                  value={budget ?? ""}
                  disabled={disabled}
                  onChange={(e) =>
                    setBudget(
                      e.target.value === "" ? null : Number(e.target.value),
                    )
                  }
                />
              </label>
              <button
                ref={runButton}
                type="submit"
                className="primary"
                disabled={disabled}
              >
                {working || busy ? "Running…" : "Create draft"}
              </button>
            </div>
            {input.id === "security-signals" && (
              <details className="demo-query-settings">
                <summary>
                  Rule thresholds{" "}
                  <span>
                    {Number(input.minLiquidity ?? 100000).toLocaleString()} USD
                    · {input.maxTop10Pct ?? 50}%
                  </span>
                </summary>
                <div className="form-grid">
                  <label>
                    Minimum liquidity · USD
                    <input
                      type="number"
                      min={0}
                      value={input.minLiquidity}
                      disabled={disabled}
                      onChange={(e) =>
                        edit({ minLiquidity: Number(e.target.value) })
                      }
                    />
                  </label>
                  <label>
                    Maximum top-10 accounts · %
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step="any"
                      value={input.maxTop10Pct}
                      disabled={disabled}
                      onChange={(e) =>
                        edit({ maxTop10Pct: Number(e.target.value) })
                      }
                    />
                  </label>
                </div>
              </details>
            )}
            {ready && (
              <p className="demo-plan-cost">
                {plan!.estimatedCu} estimated CU · up to {plan!.maxRequests}{" "}
                requests before retries
              </p>
            )}
          </form>
          <div className="demo-command-row">
            <CliPreview
              args={
                (definition.subject === "none" || input.address) &&
                (budget === null ||
                  (Number.isSafeInteger(budget) && budget >= 0))
                  ? demoCliArgs(ready ? plan!.demoInput : input, budget)
                  : null
              }
            />
          </div>
        </>
      )}
      {!report && definition && !relevant && (
        <div className="demo-empty demo-start">
          <DemoIcon id={input.id} size={28} />
          <h3>
            {definition.subject === "none"
              ? "Ready to explore"
              : "Start with a token"}
          </h3>
          <p>
            {definition.subject === "none"
              ? "Create a draft to view results."
              : "Paste an address and create a draft to view results."}
          </p>
        </div>
      )}
      {relevant && (
        <section className="demo-result" aria-label="Demo result">
          <div className="demo-result-bar">
            <div className="demo-result-meta">
              <span className={`demo-run-state ${relevant.status}`}>
                <span aria-hidden="true" />
                {relevant.status}
              </span>
              <time dateTime={relevant.createdAt}>
                {new Date(relevant.createdAt).toLocaleString()}
              </time>
              {relevant.input.demo.address && (
                <AddressText
                  text={relevant.input.demo.address}
                  compact
                  kind={
                    relevant.input.demo.id === "wallet-intelligence"
                      ? "wallet"
                      : "token"
                  }
                  chain={relevant.input.demo.chain}
                />
              )}
            </div>
            <div className="demo-result-actions">
              <span>{relevant.cu?.estimated ?? "Unknown"} CU est.</span>
              {report && (
                <button
                  type="button"
                  className="quiet"
                  onClick={() =>
                    download(
                      relevant.result,
                      `birdeye-demo-${relevant.id}.json`,
                    )
                  }
                >
                  Export JSON
                </button>
              )}
            </div>
          </div>
          {relevant.status === "running" && (
            <div className="demo-progress" role="status">
              <p>{progress || "Fetching evidence…"}</p>
              <button
                type="button"
                className="secondary"
                onClick={() =>
                  void api(`/runs/${relevant.id}/stop`, {}).catch((e) =>
                    setError(e.message),
                  )
                }
              >
                Stop run
              </button>
            </div>
          )}
          {relevant.error && (
            <p className="notice error" role="alert">
              {relevant.error.message}
            </p>
          )}
          {relevant.storageError && (
            <p className="notice error" role="alert">
              {relevant.storageError}
            </p>
          )}
          {!report && relevant.status !== "running" && !relevant.error && (
            <p className="demo-empty">
              No evidence returned. Adjust the inputs and create a new draft.
            </p>
          )}
          {report && (
            <>
              {report.coverage === "partial" && (
                <p className="demo-coverage-note">
                  Partial evidence
                  <span>Some observations are unavailable.</span>
                </p>
              )}
              <DemoView
                key={relevant.id}
                id={input.id}
                report={report}
                onExportMessage={() =>
                  download(
                    report.message,
                    `birdeye-brief-${relevant.id}.txt`,
                    "text/plain",
                  )
                }
                onSelectWallet={selectWallet}
                selectedWallet={input.address}
                busy={disabled}
              />
              <div className="demo-result-details">
                {(relevant.result.data.missing || []).length > 0 && (
                  <details className="source">
                    <summary>
                      Missing evidence · {relevant.result.data.missing.length}
                    </summary>
                    <ul>
                      {relevant.result.data.missing.map(
                        (m: Data, i: number) => (
                          <li key={i}>
                            {m.step || m.operation}: {m.reason || m.message}
                          </li>
                        ),
                      )}
                    </ul>
                  </details>
                )}
                <details className="source">
                  <summary>Sources & details</summary>
                  <p>{report.limitation}</p>
                  <p className="field-hint">
                    {relevant.cu?.attempts ?? 0} API attempts ·{" "}
                    {relevant.cu?.uncertainAttempts ?? 0} uncertain
                  </p>
                  <pre>
                    <AddressText
                      text={JSON.stringify(
                        { input: relevant.input, result: relevant.result },
                        null,
                        2,
                      )}
                    />
                  </pre>
                </details>
              </div>
            </>
          )}
        </section>
      )}
      {plan && ready && (
        <details className="source demo-plan" aria-label="Demo API plan">
          <summary>API steps · {plan.steps.length}</summary>
          <ol>
            {plan.steps.map((s: Data) => (
              <li key={s.id}>
                <strong>{s.title || s.id}</strong>
                <p>{s.purpose || s.description}</p>
                <code>
                  {s.method} {s.path}
                </code>
                <p className="field-hint">
                  {s.cuPerRequest} CU/request
                  {s.subjects
                    ? ` · up to ${s.subjects.take} subjects from ${s.subjects.from.join(", ")}`
                    : ""}
                </p>
                <pre>
                  <AddressText text={JSON.stringify(s.params, null, 2)} />
                </pre>
              </li>
            ))}
          </ol>
        </details>
      )}
    </div>
  );
}
