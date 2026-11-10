import React, { useState } from "react";
import { AddressText, AddressChainProvider } from "./address-text";
import { SecurityEvidence } from "./security-evidence";
import { DemoIcon } from "./demo-icon";
import {
  amount,
  money,
  percent,
  tone,
  ratio,
  largest,
  sorted,
  sectionRows,
  observedAt,
  type DemoRow as Row,
} from "./demo-data";

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="demo-empty" role="status">
      <p>{children}</p>
    </div>
  );
}
function Value({
  value,
  format = "money",
  compact = false,
}: {
  value: unknown;
  format?: "money" | "percent" | "signed";
  compact?: boolean;
}) {
  return (
    <span
      className={`demo-number ${amount(value) === null ? "unavailable" : ""} ${format === "signed" ? tone(value) : ""}`}
      title={value == null ? "Unavailable" : String(value)}
    >
      {format === "money"
        ? money(value, compact)
        : percent(value, format === "signed")}
    </span>
  );
}
function Identity({
  row,
  label,
  kind = "token",
}: {
  row?: Row;
  label?: string;
  kind?: "token" | "wallet" | "pool";
}) {
  return (
    <div className="demo-identity">
      <span className="demo-token-mark" aria-hidden="true">
        {kind === "wallet" ? (
          <DemoIcon id="wallet-intelligence" size={18} />
        ) : (
          String(row?.symbol || row?.name || "?")
            .slice(0, 2)
            .toUpperCase()
        )}
      </span>
      <div>
        <strong>{row?.symbol || row?.name || label || "Token"}</strong>
        <div className="field-hint">
          {row?.address ? (
            <AddressText
              text={row.address}
              compact
              kind={kind === "pool" ? undefined : kind}
              chain={row.chain}
            />
          ) : (
            "Address unavailable"
          )}
        </div>
      </div>
    </div>
  );
}
function Source({ row }: { row?: Row }) {
  return (
    <details className="demo-provenance">
      <summary>Source</summary>
      <p>Request: {row?.sourceId || "Unavailable"}</p>
      <p>{observedAt(row?.asOf)}</p>
      {row?.address && (
        <p>
          <AddressText text={row.address} />
        </p>
      )}
    </details>
  );
}
function MarketStats({ row }: { row?: Row }) {
  return (
    <dl className="demo-stats">
      <div>
        <dt>Price · USD</dt>
        <dd>
          <Value value={row?.priceUsd} />
        </dd>
      </div>
      <div>
        <dt>Change · 24h</dt>
        <dd>
          <Value value={row?.priceChange24hPct} format="signed" />
        </dd>
      </div>
      <div>
        <dt>Liquidity · USD</dt>
        <dd>
          <Value value={row?.liquidityUsd} compact />
        </dd>
      </div>
      <div>
        <dt>Volume · 24h USD</dt>
        <dd>
          <Value value={row?.volume24hUsd} compact />
        </dd>
      </div>
    </dl>
  );
}
function Controls({ row }: { row?: Row }) {
  return (
    <div className="demo-controls">
      <h3>Token controls</h3>
      <dl className="demo-facts">
        <div>
          <dt>Freezeable</dt>
          <dd>
            {typeof row?.freezeable !== "boolean"
              ? "Unknown"
              : row.freezeable
                ? "Observed"
                : "Not observed"}
          </dd>
        </div>
        <div>
          <dt>Mutable metadata</dt>
          <dd>
            {typeof row?.mutableMetadata !== "boolean"
              ? "Unknown"
              : row.mutableMetadata
                ? "Yes"
                : "No"}
          </dd>
        </div>
        <div>
          <dt>Top-10 token accounts</dt>
          <dd>
            <Value value={row?.top10HolderPct} format="percent" />
          </dd>
        </div>
      </dl>
      <Source row={row} />
    </div>
  );
}

function Terminal({ report }: { report?: Row }) {
  const rows = sectionRows(report, "Market snapshot"),
    controls = sectionRows(report, "Observed token");
  const [query, setQuery] = useState(""),
    [sort, setSort] = useState("volume24hUsd"),
    [selected, setSelected] = useState<string>();
  const visible = sorted(
    rows.filter((r) =>
      `${r.symbol || ""} ${r.address || ""}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    ),
    sort,
  );
  const current = visible.find((r) => r.address === selected) || visible[0];
  return (
    <div className="demo-terminal">
      <div className="demo-toolbar">
        <div>
          <h3>
            Market watchlist <span className="demo-count">{rows.length}</span>
          </h3>
        </div>
        <label>
          Filter tokens
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Symbol or address"
          />
        </label>
        <label>
          Sort tokens
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="volume24hUsd">24h volume</option>
            <option value="liquidityUsd">Liquidity</option>
            <option value="priceChange24hPct">24h change</option>
          </select>
        </label>
      </div>
      <div className="demo-split">
        <div className="demo-panel">
          <div className="table-wrap">
            <table className="demo-market-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Price · USD</th>
                  <th>24h change</th>
                  <th>24h vol · USD</th>
                  <th>Liquidity · USD</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r, i) => (
                  <tr
                    key={`${r.address}-${i}`}
                    className={current === r ? "selected" : ""}
                  >
                    <th scope="row">
                      <button
                        className="demo-token-select"
                        aria-pressed={current === r}
                        onClick={() => setSelected(r.address)}
                      >
                        {r.symbol || "Unnamed token"}
                      </button>
                      <div>
                        {r.address ? (
                          <AddressText
                            text={r.address}
                            compact
                            kind="token"
                            chain={r.chain}
                          />
                        ) : (
                          "No address"
                        )}
                      </div>
                    </th>
                    <td data-label="Price · USD">
                      <Value value={r.priceUsd} />
                    </td>
                    <td data-label="24h change">
                      <Value value={r.priceChange24hPct} format="signed" />
                    </td>
                    <td data-label="24h volume">
                      <Value value={r.volume24hUsd} compact />
                    </td>
                    <td data-label="Liquidity">
                      <Value value={r.liquidityUsd} compact />
                      <div className="demo-track" aria-hidden="true">
                        <span
                          style={{
                            width: `${ratio(r.liquidityUsd, largest(rows, "liquidityUsd"))}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!visible.length && (
            <Empty>
              {rows.length
                ? "No tokens match this filter."
                : "No token data. Run a snapshot."}
            </Empty>
          )}
          <details className="demo-comparison">
            <summary>Liquidity comparison</summary>
            {visible.map((r, i) => (
              <div className="demo-bar-row" key={i}>
                <span>{r.symbol || "Token"}</span>
                <div className="demo-track">
                  <span
                    style={{
                      width: `${ratio(r.liquidityUsd, largest(rows, "liquidityUsd"))}%`,
                    }}
                  />
                </div>
                <Value value={r.liquidityUsd} compact />
              </div>
            ))}
          </details>
        </div>
        <aside className="demo-inspector" aria-label="Selected token">
          <div className="demo-selected-summary">
            <div className="demo-toolbar">
              <Identity row={current} label="Select a token" />
              <Source row={current} />
            </div>
            <MarketStats row={current} />
          </div>
          <Controls
            row={controls.find((r) => r.address === current?.address)}
          />
        </aside>
      </div>
    </div>
  );
}
function Dex({ report }: { report?: Row }) {
  const market = sectionRows(report, "Market snapshot")[0],
    pools = sorted(sectionRows(report, "Pools"), "liquidity"),
    security = sectionRows(report, "Observed token")[0];
  const [selection, setSelection] = useState<string>();
  const pool = pools.find((r) => r.address === selection) || pools[0];
  return (
    <div className="demo-dex">
      <div className="demo-toolbar">
        <Identity row={market} />
      </div>
      <MarketStats row={market} />
      <div className="demo-split">
        <section className="demo-panel">
          <div className="demo-toolbar">
            <h3>
              Liquidity by pool{" "}
              <span className="demo-count">{pools.length}</span>
            </h3>
            <span className="field-hint">Fetched page</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Pool / pair</th>
                  <th>Liquidity · USD</th>
                  <th>Volume · 24h USD</th>
                </tr>
              </thead>
              <tbody>
                {pools.map((r, i) => (
                  <tr key={i} className={r === pool ? "selected" : ""}>
                    <th scope="row">
                      <button
                        className="demo-token-select"
                        aria-pressed={r === pool}
                        onClick={() => setSelection(r.address)}
                      >
                        {r.name || "Unnamed pool"}
                        <small>
                          {r.address
                            ? `${r.address.slice(0, 6)}…${r.address.slice(-4)}`
                            : "Address unavailable"}
                        </small>
                      </button>
                    </th>
                    <td data-label="Liquidity">
                      <Value value={r.liquidity} compact />
                      <div className="demo-track">
                        <span
                          style={{
                            width: `${ratio(r.liquidity, largest(pools, "liquidity"))}%`,
                          }}
                        />
                      </div>
                    </td>
                    <td data-label="24h volume">
                      <Value value={r.volume24h} compact />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!pools.length && <Empty>No pool data.</Empty>}
        </section>
        <aside className="demo-inspector">
          <h3>Selected pool</h3>
          <Identity row={pool} label="No pool selected" kind="pool" />
          <dl className="demo-facts">
            <div>
              <dt>Reported liquidity</dt>
              <dd>
                <Value value={pool?.liquidity} />
              </dd>
            </div>
            <div>
              <dt>24h volume</dt>
              <dd>
                <Value value={pool?.volume24h} />
              </dd>
            </div>
          </dl>
          <Source row={pool} />
          <details className="demo-provenance">
            <summary>Details</summary>
            <p>Reported liquidity is not executable depth or a swap quote.</p>
          </details>
          <Controls row={security} />
        </aside>
      </div>
    </div>
  );
}
function WalletDiscovery({
  report,
  onSelect,
  selected,
  busy,
}: {
  report?: Row;
  onSelect?: (address: string) => void;
  selected?: string;
  busy?: boolean;
}) {
  const wallets = sectionRows(report, "Discovered wallets"),
    tokens = sectionRows(report, "Smart-money tokens");
  const [query, setQuery] = useState("");
  const visible = wallets.filter((r) =>
    r.address.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="demo-wallet-discovery">
      <div className="demo-toolbar">
        <div>
          <h3>
            Discover smart wallets{" "}
            <span className="demo-count">{wallets.length}</span>
          </h3>
        </div>
        <span className="field-hint">
          Provider order · profitability unverified
        </span>
      </div>
      <details className="demo-provenance">
        <summary>Discovery details</summary>
        <p>
          Traders of smart-money-list tokens; profitability is unverified.
          Select a wallet to analyze its PnL.
        </p>
      </details>
      <section className="demo-panel">
        <div className="demo-toolbar">
          <span className="field-hint">
            Select a wallet to inspect PnL & holdings
          </span>
          <label>
            Filter wallets
            <input
              type="search"
              placeholder="Wallet address"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
        <div className="table-wrap">
          <table className="demo-wallet-table">
            <thead>
              <tr>
                <th>Wallet</th>
                <th>Observed tokens</th>
                <th>Discovery evidence</th>
                <th>Research</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr
                  key={r.address}
                  className={selected === r.address ? "selected" : ""}
                >
                  <th scope="row">
                    <Identity row={r} label="Wallet" kind="wallet" />
                  </th>
                  <td data-label="Observed tokens">{r.tokens.length}</td>
                  <td>
                    <details className="demo-provenance">
                      <summary>Token-level observations</summary>
                      <p>Do not sum these observations into wallet-wide PnL.</p>
                      {r.observations.map((o: Row, i: number) => (
                        <div className="demo-wallet-observation" key={i}>
                          <strong>{o.symbol || "Token"}</strong>
                          <p>
                            <AddressText
                              text={o.token || "Token unavailable"}
                              compact
                              kind="token"
                              chain={o.chain}
                            />
                          </p>
                          <dl className="demo-facts">
                            <div>
                              <dt>Window</dt>
                              <dd>{o.window || "Unavailable"}</dd>
                            </div>
                            <div>
                              <dt>Token volume · USD</dt>
                              <dd>
                                <Value value={o.volumeUsd} />
                              </dd>
                            </div>
                            <div>
                              <dt>Token realized PnL · USD</dt>
                              <dd>
                                <Value value={o.tokenRealizedPnlUsd} />
                              </dd>
                            </div>
                          </dl>
                          <Source row={o} />
                        </div>
                      ))}
                    </details>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="secondary"
                      aria-label={`Select wallet ${r.address}`}
                      aria-pressed={selected === r.address}
                      disabled={busy || !onSelect}
                      onClick={() => onSelect?.(r.address)}
                    >
                      {selected === r.address ? "Selected" : "Select wallet"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!visible.length && (
          <Empty>
            {wallets.length
              ? "No wallets match this filter."
              : report
                ? "No eligible wallets returned."
                : "No wallets yet. No wallet address is needed."}
          </Empty>
        )}
      </section>
      <details className="demo-discovery-sources">
        <summary>
          Smart-money token source page · {tokens.length} tokens
        </summary>
        <p className="field-hint">
          Only the first bounded tokens are used for trader lookups. This is the
          full fetched discovery page.
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Smart traders</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((r, i) => (
                <tr key={i}>
                  <td>
                    <Identity row={r} />
                  </td>
                  <td>{r.smartTraders ?? "Unavailable"}</td>
                  <td>
                    <Source row={r} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
function Wallet({ report }: { report?: Row }) {
  const windows = sectionRows(report, "PnL windows"),
    holdings = sorted(sectionRows(report, "Holdings"), "valueUsd");
  const [window, setWindow] = useState("7d");
  const pnl = windows.find((r) => r.duration === window);
  const values = [
    { label: "Realized", value: pnl?.realizedPnlUsd },
    { label: "Unrealized", value: pnl?.unrealizedPnlUsd },
  ];
  const scale = largest(values, "value");
  return (
    <div className="demo-wallet">
      <div className="demo-toolbar">
        <div>
          <h3>Wallet performance</h3>
          <p className="field-hint">
            {report?.input?.address ? (
              <AddressText
                text={report.input.address}
                compact
                kind="wallet"
                chain={report.input.chain}
              />
            ) : (
              "Connect a wallet snapshot to inspect performance"
            )}
          </p>
        </div>
        <div className="demo-segments" role="group" aria-label="PnL period">
          {["7d", "30d"].map((w) => (
            <button
              key={w}
              aria-pressed={window === w}
              onClick={() => setWindow(w)}
            >
              {w === "7d" ? "7 days" : "30 days"}
            </button>
          ))}
        </div>
      </div>
      <div className="demo-split">
        <section className="demo-panel">
          <h3>PnL breakdown · {window}</h3>
          <dl className="demo-stats">
            <div>
              <dt>Total PnL · USD</dt>
              <dd className={tone(pnl?.totalPnlUsd)}>
                <Value value={pnl?.totalPnlUsd} />
              </dd>
            </div>
            <div>
              <dt>Realized · USD</dt>
              <dd className={tone(pnl?.realizedPnlUsd)}>
                <Value value={pnl?.realizedPnlUsd} />
              </dd>
            </div>
            <div>
              <dt>Unrealized · USD</dt>
              <dd className={tone(pnl?.unrealizedPnlUsd)}>
                <Value value={pnl?.unrealizedPnlUsd} />
              </dd>
            </div>
          </dl>
          <div
            className="demo-pnl-chart"
            role="img"
            aria-label={`${window} PnL: realized ${money(pnl?.realizedPnlUsd)}, unrealized ${money(pnl?.unrealizedPnlUsd)}. Bars share a scale centered at zero.`}
          >
            <div className="demo-pnl-axis">
              <span>Loss</span>
              <span>0</span>
              <span>Profit</span>
            </div>
            {values.map((v) => (
              <div className="demo-pnl-row" key={v.label}>
                <span>{v.label}</span>
                <div className="demo-diverging">
                  <span
                    className={tone(v.value)}
                    style={{
                      width: `${ratio(amount(v.value)?.abs().toString(), scale) / 2}%`,
                      left: `${amount(v.value)?.lt(0) ? 50 - ratio(amount(v.value)?.abs().toString(), scale) / 2 : 50}%`,
                    }}
                  />
                </div>
                <Value value={v.value} />
              </div>
            ))}
          </div>
          <Source row={pnl} />
          {pnl?.pnlMethod && (
            <p className="field-hint">Method: {pnl.pnlMethod}</p>
          )}
        </section>
        <section className="demo-panel">
          <h3>Holdings allocation</h3>
          <p className="field-hint">Priced holdings on the fetched page only</p>
          <div className="demo-allocation">
            {holdings.map((r, i) => (
              <div className="demo-allocation-row" key={i}>
                <Identity row={r} />
                <Value value={r.observedWeightPct} format="percent" />
                <div className="demo-track">
                  <span
                    style={{ width: `${ratio(r.observedWeightPct, 100)}%` }}
                  />
                </div>
                <Value value={r.valueUsd} compact />
              </div>
            ))}
          </div>
          {!holdings.length && (
            <Empty>No priced holdings returned for this wallet.</Empty>
          )}
        </section>
      </div>
      <details className="demo-panel demo-position-details">
        <summary>Position details · fetched holdings</summary>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Value · USD</th>
                <th>Priced page weight</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((r, i) => (
                <tr key={i}>
                  <td>
                    <Identity row={r} />
                  </td>
                  <td>
                    <Value value={r.valueUsd} />
                  </td>
                  <td>
                    <Value value={r.observedWeightPct} format="percent" />
                  </td>
                  <td>
                    <Source row={r} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
const stateLabels: Record<string, string> = {
  attention: "Attention",
  unknown: "Unknown",
  "within-threshold": "Within threshold",
  "not-observed": "Not observed",
};
function Security({ report }: { report?: Row }) {
  const rows = sectionRows(report, "Configured rule"),
    market = sectionRows(report, "Market snapshot")[0];
  const [filter, setFilter] = useState("all");
  const rules = rows.length
    ? rows
    : [
        { rule: "Liquidity below threshold", state: "unknown", unit: "USD" },
        {
          rule: "Top-10 token-account concentration",
          state: "unknown",
          unit: "% of supply",
        },
        {
          rule: "Freezeable control observed",
          state: "unknown",
          unit: "boolean",
        },
      ];
  const priority: Record<string, number> = {
    attention: 0,
    unknown: 1,
    "within-threshold": 2,
    "not-observed": 2,
  };
  const visible = rules
    .filter((r) => filter === "all" || r.state === filter)
    .sort((a, b) => (priority[a.state] ?? 3) - (priority[b.state] ?? 3));
  return (
    <div className="demo-security">
      <div className="demo-toolbar">
        <Identity row={market} />
        <span
          className={`demo-state ${report?.signalState === "attention" ? "attention" : "unknown"}`}
        >
          {!report
            ? "Awaiting evidence"
            : report.signalState === "attention"
              ? "Manual review required"
              : report.signalState !== "no-configured-rule-triggered"
                ? "Evidence incomplete"
                : "No configured rule triggered"}
        </span>
      </div>
      <MarketStats row={market} />
      <div className="demo-toolbar">
        <div>
          <h3>Configured rule checks</h3>
          <p className="field-hint">
            {rows.filter((r) => r.state === "attention").length} attention ·{" "}
            {rows.length ? rows.filter((r) => r.state === "unknown").length : 3}{" "}
            unknown · not a safety verdict
          </p>
        </div>
        <label>
          Filter checks
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All checks</option>
            <option value="attention">Needs attention</option>
            <option value="unknown">Unknown evidence</option>
          </select>
        </label>
      </div>
      <div className="demo-rule-grid">
        {visible.map((r) => {
          const binary = r.unit === "boolean",
            max =
              r.unit === "% of supply"
                ? 100
                : largest([{ v: r.observed }, { v: r.threshold }], "v");
          return (
            <section className="demo-rule" data-state={r.state} key={r.rule}>
              <div className="demo-rule-heading">
                <h4>{r.rule}</h4>
                <p className="field-hint">
                  {binary
                    ? "Triggers when freezeability is observed."
                    : amount(r.threshold)
                      ? `Triggers ${r.unit === "USD" ? "below" : "above"} ${r.unit === "USD" ? money(r.threshold) : percent(r.threshold)}.`
                      : "Run a snapshot to evaluate your configured thresholds."}
                </p>
              </div>
              <div className="demo-rule-reading">
                <span className="demo-rule-value">
                  {binary
                    ? r.observed === true
                      ? "Yes"
                      : r.observed === false
                        ? "No"
                        : "Unavailable"
                    : r.unit === "USD"
                      ? money(r.observed, true)
                      : percent(r.observed)}
                </span>
                {!binary && (
                  <div className="demo-rule-meter" aria-hidden="true">
                    <div className="demo-track">
                      <span
                        className={r.state}
                        style={{ width: `${ratio(r.observed, max)}%` }}
                      />
                    </div>
                    {amount(r.threshold) && (
                      <span
                        className="demo-threshold"
                        style={{ left: `${ratio(r.threshold, max)}%` }}
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="demo-rule-status">
                <span className={`demo-state ${r.state}`}>
                  {stateLabels[r.state] || "Unknown"}
                </span>
                <Source row={r} />
              </div>
            </section>
          );
        })}
      </div>
      {!visible.length && <Empty>No matching checks.</Empty>}
      <details className="demo-rule-notes demo-provenance">
        <summary>Rule details</summary>
        <p>
          Top-10 concentration refers to token accounts, not unique wallets.
          Missing observations stay unknown. These checks do not establish
          contract safety.
        </p>
      </details>
      <SecurityEvidence report={report} />
    </div>
  );
}
function Telegram({
  report,
  onExport,
}: {
  report?: Row;
  onExport?: () => void;
}) {
  const market = sectionRows(report, "Market snapshot")[0];
  const [raw, setRaw] = useState(false);
  return (
    <div className="demo-messaging">
      <section className="demo-chat" aria-label="Telegram message preview">
        <header>
          <span className="demo-bot-mark" aria-hidden="true">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="m3 10 18-7-6 18-4-7-8-4Z M11 14l10-11" />
            </svg>
          </span>
          <div>
            <h3>Birdeye Research</h3>
            <span className="field-hint">Message preview</span>
          </div>
        </header>
        <div className="demo-chat-messages">
          <div className="demo-chat-command">
            <code>/research</code>
            <div>
              {report?.input?.address ? (
                <AddressText
                  text={report.input.address}
                  compact
                  kind="token"
                  chain={report.input.chain}
                />
              ) : (
                "&lt;token address&gt;"
              )}
            </div>
          </div>
          <article className="demo-chat-bubble">
            <Identity row={market} />
            <MarketStats row={market} />
            <Controls row={sectionRows(report, "Observed token")[0]} />
            <div className="demo-chat-coverage">
              <span className="badge">
                {report?.coverage || "Awaiting snapshot"}
              </span>
              <p className="field-hint">
                {report
                  ? observedAt(report.retrievedAt)
                  : "Run a token snapshot to generate this briefing."}
              </p>
            </div>
          </article>
        </div>
        <footer>Preview only · no Telegram message sent</footer>
      </section>
      <section className="demo-message-tools">
        <DemoIcon id="telegram-brief" size={24} />
        <h3>Message file</h3>
        <dl className="demo-facts">
          <div>
            <dt>Format</dt>
            <dd>Plain text · .txt</dd>
          </div>
          <div>
            <dt>Message length</dt>
            <dd>
              {report?.message
                ? `${report.message.length} characters`
                : "Unavailable"}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          className="primary"
          disabled={!report?.message || !onExport}
          onClick={onExport}
        >
          Export message
        </button>
        <button
          type="button"
          className="quiet"
          aria-expanded={raw}
          onClick={() => setRaw(!raw)}
        >
          {raw ? "Hide plain text" : "Inspect plain text"}
        </button>
        {raw && (
          <pre>
            <AddressText
              text={report?.message || "No message generated yet."}
            />
          </pre>
        )}
      </section>
    </div>
  );
}
export function DemoView({
  id,
  report,
  onExportMessage,
  onSelectWallet,
  selectedWallet,
  busy,
}: {
  id: string;
  report?: Row;
  onExportMessage?: () => void;
  onSelectWallet?: (address: string) => void;
  selectedWallet?: string;
  busy?: boolean;
}) {
  return (
    <AddressChainProvider chain={report?.chain ?? report?.input?.chain}>
      <div className="demo-product" data-demo-view={id}>
        {id === "terminal" ? (
          <Terminal report={report} />
        ) : id === "dex-inspector" ? (
          <Dex report={report} />
        ) : id === "wallet-intelligence" ? (
          report?.walletStage === "analysis" || report?.input?.address ? (
            <Wallet report={report} />
          ) : (
            <WalletDiscovery
              report={report}
              onSelect={onSelectWallet}
              selected={selectedWallet}
              busy={busy}
            />
          )
        ) : id === "security-signals" ? (
          <Security report={report} />
        ) : (
          <Telegram report={report} onExport={onExportMessage} />
        )}
      </div>
    </AddressChainProvider>
  );
}
