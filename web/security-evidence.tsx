import React from "react";
import {AddressText} from "./address-text";
import {amount,money,percent,ratio,sectionRows,observedAt,type DemoRow as Row} from "./demo-data";

function EvidenceValue({row}:{row:Row}) {
  if(row.value==null)return <>Unavailable</>;
  if(row.unit==="boolean")return <>{row.value===true?"Yes":row.value===false?"No":"Unavailable"}</>;
  if(row.unit==="address")return <AddressText text={String(row.value)} compact/>;
  const n=amount(row.value);
  if(!n)return <>Unavailable</>;
  return <span className="demo-number" title={String(row.value)}>{row.unit==="USD"?money(row.value,true):row.unit.startsWith("%")?percent(row.value):row.unit==="count"?n.toFormat(0):`${!n.isZero()&&n.abs().lt(0.01)?n.toPrecision(3):n.toFormat(2)}${row.unit==="×"?"×":""}`}</span>;
}
function Evidence({row}:{row:Row}) {
  return <details className="demo-provenance"><summary>Evidence</summary><p>{row.basis}</p><p>Request: {row.sourceId||"Unavailable"}</p><p>{observedAt(row.asOf)}</p>{row.value!=null&&<p>Reported value: {String(row.value)}{row.unit==="tokens"?" tokens":""}</p>}</details>;
}
function Metrics({title,note,rows}:{title:string;note:string;rows:Row[]}) {
  return <section className="security-evidence-group"><h3>{title}</h3><p className="field-hint">{note}</p>{rows.length?<dl className="security-metrics">{rows.map(r=><div key={r.key}><dt>{r.label}{r.unit==="tokens"&&<small> · tokens</small>}</dt><dd><EvidenceValue row={r}/></dd><dd className="security-metric-source">{r.unit==="% of supply"&&amount(r.value)&&<div className="demo-track" aria-hidden="true"><span style={{width:`${ratio(r.value,100)}%`}}/></div>}<Evidence row={r}/></dd></div>)}</dl>:<p className="demo-empty">No supporting evidence in this snapshot. Run a new snapshot to populate these metrics.</p>}</section>;
}
export function SecurityEvidence({report}:{report?:Row}) {
  const market=sectionRows(report,"Market depth & activity"),ownership=sectionRows(report,"Ownership concentration"),controls=sectionRows(report,"Token control observations"),authorities=sectionRows(report,"Authority addresses"),holders=sectionRows(report,"Holder wallets");
  const observations=[...market,...ownership,...controls,...authorities],available=observations.filter(r=>r.value!=null).length;
  return <div className="security-evidence">
    <div className="demo-toolbar"><div><h3>Supporting evidence</h3><p className="field-hint">Market activity, ownership and controls from the same snapshot.</p></div><span className="badge">{observations.length?`${available} / ${observations.length} observations available`:"Awaiting supporting evidence"}</span></div>
    <div className="security-evidence-grid">
      <Metrics title="Market depth & activity" note="24h trade counts and volumes; ratios use reported liquidity and market cap." rows={market}/>
      <Metrics title="Ownership concentration" note="Provider-reported shares of total supply. Groups may overlap; do not sum them." rows={ownership}/>
      <Metrics title="Token control observations" note="Yes / No are observations, not additional pass/fail rules. Canonical and imitation flags are provider heuristics." rows={controls}/>
      <Metrics title="Authority addresses" note="Missing addresses do not prove that authority was revoked." rows={authorities}/>
    </div>
    <section className="security-holder-section"><div className="demo-toolbar"><div><h3>Holder wallets · fetched page</h3><p className="field-hint">{holders.length} rows · grouped by owner wallet · provider order · top 10 wallets</p></div></div><p className="field-hint">Holdings and supply shares are reported by the distribution API. This page is not the full holder population; supply shares are not inferred from balances.</p>
      {holders.length?<div className="table-wrap"><table><thead><tr><th>Position</th><th>Wallet</th><th>Holding · tokens</th><th>Supply share</th><th>Evidence</th></tr></thead><tbody>{holders.map((r,i)=><tr key={`${r.address}-${i}`}><td>{r.position}</td><th scope="row">{r.address?<AddressText text={r.address} compact/>:"Unavailable"}</th><td><EvidenceValue row={{value:r.amount,unit:"tokens"}}/></td><td><EvidenceValue row={{value:r.supplySharePct,unit:"% of supply"}}/><div className="demo-track" aria-hidden="true"><span style={{width:`${ratio(r.supplySharePct,100)}%`}}/></div></td><td><Evidence row={r}/></td></tr>)}</tbody></table></div>:<p className="demo-empty">No holder-wallet evidence available in this snapshot.</p>}
    </section>
  </div>;
}
