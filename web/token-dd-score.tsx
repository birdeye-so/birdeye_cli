import React,{useState} from "react";
import {AddressText} from "./address-text";
type Data=Record<string,any>;
const number=(v:unknown,digits=1)=>typeof v==="number"&&Number.isFinite(v)?v.toLocaleString(undefined,{maximumFractionDigits:digits}):"N/A";
const names:Record<string,string>={security:"Security",holders:"Holders",activity:"Activity",liquidity:"Liquidity",smart_money:"Smart money"};
export function TokenDdScore({report,onRescore}:{report:Data;onRescore?:(changes:Data)=>Promise<void>}) {
  const [mode,setMode]=useState(report.mode),[topN,setTopN]=useState(report.meta.settings?.topN??50),[count,setCount]=useState(report.meta.settings?.liqCandles??96),[busy,setBusy]=useState(false),[error,setError]=useState("");
  async function rescore(e:React.FormEvent) {e.preventDefault();setBusy(true);setError("");try{await onRescore?.({ddMode:mode,topN,liqCandles:count});}catch(e){setError(e instanceof Error?e.message:"Could not re-score saved evidence.");}finally{setBusy(false);}}
  return <section className="dd-score" aria-label="Token due-diligence score">
    <div className="dd-score-heading">
      <div><span className="eyebrow">Token due diligence · {report.mode}</span><h3>{report.score.rating??"N/A"} · {number(report.score.final)}<small> / 100</small></h3><p>{report.score.verdict} · Research risk label</p><AddressText text={report.address} kind="token" chain="solana" compact /></div>
      <dl><div><dt>Base score</dt><dd>{number(report.score.base)}</dd></div><div><dt>Drawdown gate</dt><dd>× {number(report.gate_detail.gate,3)}</dd></div><div><dt>Estimated CU</dt><dd>{number(report.meta.cu_estimated_total,0)}</dd></div></dl>
    </div>
    {report.hard_blocks.length>0&&<p className="notice error" role="alert">Honeypot flag present: final score forced to 0 / F.</p>}
    <p className="field-hint">Compare coverage before comparing scores. Missing checks stay N/A; a high score does not verify safety.</p>
    <div className="dd-pillars">{Object.entries(report.pillars).map(([key,p]:[string,any])=><details key={key} className="dd-pillar"><summary><span>{names[key]}</span><strong>{number(p.score)}</strong><span className="field-hint">{number(p.coverage*100,0)}% coverage</span></summary>
      {p.score!=null&&<meter min="0" max="100" value={p.score} aria-label={`${names[key]} score`}>{number(p.score)}</meter>}
      <p>Weight {number((report.score.weights_used[key]??0)*100)}% · {number(report.score.pillar_points[key])} points</p>
      <div className="table-wrap"><table><thead><tr><th>Signal</th><th>Score</th><th>Weight</th><th>Rule</th></tr></thead><tbody>{Object.entries(p.signals??{}).map(([name,s]:[string,any])=><tr key={name}><th scope="row">{name.replaceAll("_"," ")}</th><td>{number(s.score)}</td><td>{number(s.weight*100,0)}%</td><td>{s.rule}<details><summary>Inputs</summary><pre>{JSON.stringify(s.input,null,2)}</pre></details></td></tr>)}</tbody></table></div>
    </details>)}</div>
    <h4>Liquidity window</h4><p className="field-hint">{report.liquidity_stats.window.candles} observed candles · {report.liquidity_stats.window.resolution} · {number(report.liquidity_stats.window.span_hours)} hours including gaps</p>
    <div className="table-wrap"><table><thead><tr><th>Series</th><th>Current · USD</th><th>Minimum · USD</th><th>Median · USD</th><th>From peak</th><th>Trend</th></tr></thead><tbody>{[["Liquidity",report.liquidity_stats.liquidity],["Exit liquidity",report.liquidity_stats.exit_liquidity]].map(([name,s])=><tr key={name}><th scope="row">{name}</th><td>{number(s?.current)}</td><td>{number(s?.min)}</td><td>{number(s?.median)}</td><td>{number(s?.drawdown_from_peak_pct)}{s?.drawdown_from_peak_pct!=null?"%":""}</td><td>{number(s?.trend_pct)}{s?.trend_pct!=null?"%":""}</td></tr>)}</tbody></table></div>
    <p className="field-hint">Gate driver: {report.gate_detail.binding.replaceAll("_"," ")} · maximum total discount 15%.</p>
    <h4>Holder concentration</h4><dl className="finding-components">{["top1","top3","top5","top10"].map(key=><div key={key}><dt>{key}</dt><dd>{number(report.holder_concentration[key])}{report.holder_concentration[key]!=null?"%":""}</dd></div>)}</dl>
    {!!report.holder_cohorts?.length&&<details><summary>Labeled holder groups</summary><div className="table-wrap"><table><thead><tr><th>Group</th><th>Wallets</th><th>Supply</th><th>PnL</th></tr></thead><tbody>{report.holder_cohorts.map((c:Data)=><tr key={c.tag}><th scope="row">{c.tag}</th><td>{number(c.holder_count,0)}</td><td>{number(c.percent_of_supply)}%</td><td>{typeof c.pnl==="object"?JSON.stringify(c.pnl):number(c.pnl)}</td></tr>)}</tbody></table></div></details>}
    <details><summary>Coverage & assumptions · {report.missing.length} unavailable checks</summary><ul>{[...report.caveats,...report.missing,report.meta.cu_note].filter(Boolean).map((v:string,i:number)=><li key={i}>{v}</li>)}</ul></details>
    {onRescore&&<form className="dd-rescore" onSubmit={rescore}><h4>Re-score saved evidence · 0 CU</h4><p className="field-hint">Use the same observations. Larger windows cannot recover data that was not fetched.</p><div className="form-grid">
      <label>Mode<select value={mode} onChange={e=>setMode(e.target.value)}><option>standard</option><option>advanced</option></select></label>
      <label>Top holder rows<input type="number" min="10" max="50" required value={topN} onChange={e=>setTopN(Number(e.target.value))}/></label>
      <label>Latest liquidity candles<input type="number" min="1" max="100" required value={count} onChange={e=>setCount(Number(e.target.value))}/></label>
    </div><button type="submit" className="secondary" disabled={busy}>{busy?"Re-scoring…":"Re-score · 0 CU"}</button>{error&&<p role="alert" className="notice error">{error}</p>}</form>}
  </section>;
}
