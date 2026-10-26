import React, {useId, useState} from "react";
import {AddressText} from "./address-text";

type Data = Record<string, any>;
const valid = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const number = (v: unknown, digits = 1) => valid(v) ? v.toLocaleString(undefined, {maximumFractionDigits: digits}) : "N/A";
const money = (v: unknown) => valid(v) ? new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", notation: v >= 10000 ? "compact" : "standard", maximumFractionDigits: v < 1 ? 6 : 2}).format(v) : "N/A";
const pct = (v: unknown) => valid(v) ? `${number(v)}%` : "N/A";
const names: Record<string, string> = {security: "Security", holders: "Holders", activity: "Activity", liquidity: "Liquidity", smart_money: "Smart money"};
const labels: Record<string, string> = {sm_quality: "Smart-money quality", sm_flow: "Smart-money flow", sm_presence: "Smart-money presence", mint_authority: "Mint authority", freeze_authority: "Freeze authority", metadata: "Metadata controls", lp_lock: "LP lock", creator_dump: "Creator holdings", not_freezable: "Token controls", not_lst: "LST verification", not_fake: "Mint verification", conc_top1: "Largest holder", conc_top3: "Top 3 holders", conc_top10: "Top 10 holders", holder_base: "Holder base", cohort_risk: "Labeled holder risk", sniper_density: "Sniper concentration"};
const label = (s: string) => labels[s] ?? s.replaceAll("_", " ").replace(/^./, c => c.toUpperCase());
const tone = (score: unknown) => !valid(score) ? "unknown" : score >= 80 ? "positive" : score >= 55 ? "caution" : "negative";
const clamp = (value: number) => Math.max(0, Math.min(100, value));

function Bar({value, name, neutral = false}: {value: unknown; name: string; neutral?: boolean}) {
  return <div className={`dd-bar ${neutral ? "dd-neutral" : `dd-${tone(value)}`}`} role="img" aria-label={`${name}: ${pct(value)}`}>
    {valid(value) && <span style={{width: `${clamp(value)}%`}} />}
  </div>;
}

export function TokenDdScore({report, sources = [], onRescore}: {report: Data; sources?: Data[]; onRescore?: (changes: Data) => Promise<void>}) {
  const [mode, setMode] = useState(report.mode), [topN, setTopN] = useState(report.meta.settings?.topN ?? 50), [count, setCount] = useState(report.meta.settings?.liqCandles ?? 96);
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [selected, setSelected] = useState<string | null>(null);
  const descriptionId = useId();
  const [showAllAttention, setShowAllAttention] = useState(false);
  const advanced = report.mode === "advanced";
  const pillars = Object.entries(report.pillars) as [string, Data][];
  const signals: (Data & {key: string; name: string; score: number | null})[] = pillars.flatMap(([key, p]) => Object.entries(p.signals ?? {}).map(([name, s]) => ({...(s as Data), key, name, score: (s as Data).score})));
  const available = signals.filter((s): s is typeof s & {score: number} => valid(s.score));
  const attention = available.filter(s => s.score < 55).sort((a, b) => a.score - b.score);
  const overview = sources.find(s => s.meta?.operation === "token.overview" && s.meta?.params?.address === report.address && !s.meta?.isError)?.data;
  async function rescore(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try { await onRescore?.({ddMode: mode, topN, liqCandles: count}); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not re-score saved evidence."); }
    finally { setBusy(false); }
  }
  return <section className="dd-score" aria-label="Token due-diligence score">
    <header className="dd-report-header">
      <div><h3>{overview?.symbol ? `${overview.symbol} · Due diligence` : "Token due diligence"}</h3><AddressText text={report.address} kind="token" chain="solana" compact /></div>
      <div className="dd-report-meta"><span className="dd-mode-badge">{advanced ? "Advanced" : "Standard"}</span><span>Solana</span><span>{number(report.meta.cu_estimated_total, 0)} estimated CU</span></div>
    </header>
    {report.hard_blocks.length > 0 && <p className="notice error" role="alert">Honeypot flag present: final score forced to 0 / F.</p>}
    <div className="dd-assessment">
      <div className={`dd-verdict dd-${tone(report.score.final)}`}>
        <h4>Risk assessment</h4>
        <div className="dd-score-value"><strong>{number(report.score.final)}</strong><span>/ 100</span><b>{report.score.rating ?? "—"}</b></div>
        <p className="dd-verdict-label">{report.score.verdict}</p>
        <div className="dd-score-scale" aria-hidden="true">{valid(report.score.final) && <i style={{left: `${clamp(report.score.final)}%`}} />}</div>
        <div className="dd-scale-labels"><span>Higher risk</span><span>Lower risk</span></div>
        <div className="dd-coverage"><strong>{available.length}<span> / {signals.length} checks available</span></strong><Bar value={signals.length ? available.length / signals.length * 100 : null} name="Available checks" neutral /></div>
        <p className="dd-caption">Research risk label. Compare coverage before comparing scores; a high score does not verify safety.</p>
      </div>
      <div className="dd-pillar-comparison">
        <div className="dd-section-heading"><h4>Score breakdown</h4><span>Score / 100</span></div>
        {pillars.map(([key, p]) => <button type="button" key={key} className={`dd-pillar-row ${selected === key ? "selected" : ""}`} aria-pressed={selected === key} aria-label={`Inspect ${names[key]} signals`} aria-describedby={`${descriptionId}-${key}`} onClick={() => setSelected(selected === key ? null : key)}>
          <span className="dd-sr-only" id={`${descriptionId}-${key}`}>{valid(p.score) ? `${number(p.score)} out of 100` : "Score unavailable"}; {number(p.coverage * 100, 0)}% coverage.</span><span className="dd-pillar-name">{names[key]}<small>{!advanced && key === "smart_money" ? "Advanced only" : `${number(p.coverage * 100, 0)}% coverage`}</small></span>
          <Bar value={p.score} name={names[key]} />
          <strong className={`dd-${tone(p.score)}`}>{number(p.score)}</strong>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 4 4 4-4 4" /></svg>
        </button>)}
      </div>
    </div>
    {overview && <dl className="dd-market-strip">{[["Price", money(overview.price)], ["Market cap", money(overview.marketCap)], ["Liquidity", money(overview.liquidity)], ["Volume · 24h", money(overview.v24hUSD)], ["Holders", number(overview.holder, 0)]].map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl>}
    {attention.length > 0 && <div className="dd-attention"><h4>Needs attention <span>{attention.length}</span></h4><div>{(showAllAttention ? attention : attention.slice(0, 3)).map(s => <button type="button" key={`${s.key}.${s.name}`} onClick={() => setSelected(s.key)}>{label(s.name)}<strong>{number(s.score)}<small> / 100</small></strong></button>)}</div>{attention.length > 3 && <button type="button" className="dd-attention-toggle" aria-expanded={showAllAttention} onClick={() => setShowAllAttention(!showAllAttention)}>{showAllAttention ? "Show fewer checks" : `View all ${attention.length} checks`}</button>}</div>}
    {selected && <section className="dd-signal-panel" aria-label={`${names[selected]} evidence`}>
      <div className="dd-section-heading"><h4>{names[selected]} · signal evidence</h4><button type="button" className="quiet" onClick={() => setSelected(null)}>Close details</button></div>
      <p className="dd-caption">{pct(report.score.weights_used[selected] == null ? null : report.score.weights_used[selected] * 100)} effective weight · {number(report.score.pillar_points[selected])} base points</p>
      <div className="table-wrap"><table><thead><tr><th>Signal</th><th>Score</th><th>Weight</th><th>Evidence</th></tr></thead><tbody>{Object.entries(report.pillars[selected].signals ?? {}).map(([name, s]: [string, any]) => <tr key={name}><th scope="row">{label(name)}</th><td className={`dd-${tone(s.score)}`}>{number(s.score)}</td><td>{pct(s.weight * 100)}</td><td><details><summary>Inputs & rule</summary><p>{s.rule}</p><pre>{JSON.stringify(s.input, null, 2) ?? "N/A"}</pre></details></td></tr>)}</tbody></table></div>
    </section>}
    <div className={`dd-data-grid ${advanced ? "" : "dd-standard-data"}`}>
      <section className="dd-holder-section" aria-label="Holder concentration">
        <div className="dd-section-heading"><h4>Holder concentration</h4><span>% of supply</span></div>
        {(advanced ? ["top1", "top3", "top5", "top10"] : ["top10"]).map(key => <div className="dd-holder-row" key={key}><span>{key === "top1" ? "Largest holder" : `Top ${key.slice(3)} holders`}</span><strong>{pct(report.holder_concentration[key])}</strong><Bar value={report.holder_concentration[key]} name={key} neutral /></div>)}
        <p className="dd-caption">{advanced ? `${number(report.holder_concentration.rows, 0)} observed wallet rows · cumulative shares` : "Top-10 account share from token security. Wallet distribution is available in Advanced."}</p>
      </section>
      <section className="dd-liquidity-section" aria-label="Liquidity window">
        <div className="dd-section-heading"><h4>Liquidity window</h4><span>{advanced ? `${report.liquidity_stats.window.candles} candles · ${report.liquidity_stats.window.resolution}` : "Advanced only"}</span></div>
        {!advanced ? <p className="dd-caption dd-empty">Choose Advanced for liquidity ranges, exit depth and drawdown checks.</p> : <>
          {[["Liquidity", report.liquidity_stats.liquidity], ["Exit liquidity", report.liquidity_stats.exit_liquidity]].map(([name, s]) => <div className="dd-liquidity-row" key={name}>
            <div><span>{name}</span><strong>{money(s?.current)}</strong></div>
            {s && valid(s.min) && valid(s.max) && valid(s.current) ? <><div className="dd-range" role="img" aria-label={`${name}: minimum ${money(s.min)}, current ${money(s.current)}, maximum ${money(s.max)}`}><i style={{left: `${s.max === s.min ? 50 : clamp((s.current - s.min) / (s.max - s.min) * 100)}%`}} /></div><div className="dd-range-labels"><span>Min {money(s.min)}</span><span>Max {money(s.max)}</span></div><p className="dd-caption">{pct(s.drawdown_from_peak_pct)} below peak · {pct(s.trend_pct)} trend</p></> : <p className="dd-caption">No liquidity candles available.</p>}
          </div>)}
          <details className="dd-inline-details"><summary>Window statistics</summary><p className="dd-caption">{number(report.liquidity_stats.window.span_hours)} hours including gaps. Gate driver: {report.gate_detail.binding.replaceAll("_", " ")}; maximum total discount 15%.</p><dl className="dd-stat-list">{[["Liquidity median", report.liquidity_stats.liquidity?.median], ["Exit liquidity median", report.liquidity_stats.exit_liquidity?.median]].map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{money(value)}</dd></div>)}</dl></details>
        </>}
      </section>
    </div>
    {advanced && !!report.holder_cohorts?.length && <details className="dd-disclosure"><summary>Labeled holder groups <span>{report.holder_cohorts.length} groups</span></summary><div className="table-wrap"><table><thead><tr><th>Group</th><th>Wallets</th><th>Supply</th><th>PnL</th></tr></thead><tbody>{report.holder_cohorts.map((c: Data) => <tr key={c.tag}><th scope="row">{label(c.tag)}</th><td>{number(c.holder_count, 0)}</td><td>{pct(c.percent_of_supply)}</td><td>{c.pnl != null && typeof c.pnl === "object" ? <details><summary>Breakdown</summary><pre>{JSON.stringify(c.pnl, null, 2)}</pre></details> : money(c.pnl)}</td></tr>)}</tbody></table></div></details>}
    <details className="dd-disclosure"><summary>Coverage & assumptions <span>{report.missing.length} unavailable checks</span></summary><dl className="dd-stat-list"><div><dt>Base score</dt><dd>{number(report.score.base)}</dd></div><div><dt>Drawdown gate</dt><dd>× {number(report.gate_detail.gate, 3)}</dd></div></dl><ul>{[...report.caveats, ...report.missing, report.meta.cu_note].filter(Boolean).map((v: string, i: number) => <li key={i}>{v}</li>)}</ul></details>
    {onRescore && <details className="dd-disclosure"><summary>Re-score saved evidence · 0 CU</summary><form className="dd-rescore" onSubmit={rescore}>
      <p className="dd-caption">Use the same observations. Larger windows or Advanced mode cannot recover data that was not fetched.</p>
      <div className="form-grid"><label>Mode<select value={mode} onChange={e => setMode(e.target.value)} disabled={busy}><option value="standard">Standard</option><option value="advanced">Advanced</option></select></label>{mode === "advanced" && <><label>Top holder rows<input type="number" min="10" max="50" required value={topN} disabled={busy} onChange={e => setTopN(Number(e.target.value))} /></label><label>Latest liquidity candles<input type="number" min="1" max="100" required value={count} disabled={busy} onChange={e => setCount(Number(e.target.value))} /></label></>}</div>
      <button type="submit" className="secondary" disabled={busy}>{busy ? "Re-scoring…" : "Re-score · 0 CU"}</button>{error && <p role="alert" className="notice error">{error}</p>}
    </form></details>}
  </section>;
}
