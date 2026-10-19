import {AddressText} from "./address-text";
import React from "react";
type Data = Record<string, any>;
export function SkillSettings({kind, value, change, limit, setLimit, scanLimit, setScanLimit, interval, setInterval, duration, setDuration}: {
  kind:string;value:Data;change:(value:Data)=>void;limit:number;setLimit:(v:number)=>void;scanLimit:number;setScanLimit:(v:number)=>void;interval:string;setInterval:(v:string)=>void;duration:string;setDuration:(v:string)=>void;
}) {
  const patch=(key:string,v:unknown)=>change(key === "listSource" ? {...value,[key]:v,platform:undefined,sortBy:"volume"} : {...value,[key]:v});
  const select=(key:string,label:string,choices:string[],fallback:string)=><label key={key}>{label}<select value={value[key]??fallback} onChange={e=>patch(key,e.target.value)}>{choices.map(v=><option key={v}>{v}</option>)}</select></label>;
  const check=(key:string,label:string)=><label className="check" key={key}><input type="checkbox" checked={value[key]??false} onChange={e=>patch(key,e.target.checked)} />{label}</label>;
  const wallet=kind.includes("wallet")||kind==="skill-smart-money-profile"||kind==="skill-smart-money-leaderboard";
  return <div className="skill-settings">
    <div className="form-grid workflow-options">
      {kind==="skill-trending-list"&&<>
        {select("listSource","Discovery source",["v3-list","trending"],"v3-list")}
        {select("sortBy","Rank tokens by",value.listSource==="trending"?["volume","liquidity","rank"]:["volume","liquidity","market_cap","holder","trade_count"],"volume")}
        <label>Activity window<select value={interval} onChange={e=>setInterval(e.target.value)}>{["1h","4h","24h"].map(v=><option key={v}>{v}</option>)}</select></label>
        {value.listSource!=="trending"&&<label>Platform name (optional)<input value={value.platform??""} placeholder="pump.fun" onChange={e=>patch("platform",e.target.value||undefined)} /></label>}
      </>}
      {["skill-trending-list","skill-smart-wallets"].includes(kind)&&<label>Discovery rows<input type="number" min="1" max={kind==="skill-smart-wallets"?20:50} value={scanLimit} onChange={e=>setScanLimit(Number(e.target.value))} />{kind==="skill-smart-wallets"&&<small className="field-hint">Smart-money API allows at most 20 tokens per page.</small>}</label>}
      {kind==="skill-smart-wallets"&&<>
        {select("skillDepth","Wallet research depth",["fast","standard","deep"],"fast")}
        <label>Maximum tokens / wallets<input type="number" min="1" max="5" value={limit} onChange={e=>setLimit(Number(e.target.value))} /></label>
      </>}
      {["skill-kline-pattern","skill-contract-dd"].includes(kind)&&select("resolution","Candle resolution",["1m","5m","15m","30m","1H","4H","1D"],"15m")}
      {["skill-kline-pattern","skill-contract-dd","skill-rugcheck-audit","skill-token-dd"].includes(kind)&&<label>Observation window · days<input type="number" min="1" max="30" value={value.windowDays??7} onChange={e=>patch("windowDays",Number(e.target.value))} /></label>}
      {wallet&&kind!=="skill-smart-wallets"&&select("pnlMethod","PnL accounting",["wac","net_cash"],"wac")}
      {kind==="skill-wallet-style"&&<label>Style period<select value={duration} onChange={e=>setDuration(e.target.value)}><option>7d</option><option>30d</option></select></label>}
      {kind==="skill-wallet-analysis"&&<label>PnL periods<input value={(value.intervals??["24h","7d","30d","90d","all"]).join(",")} onChange={e=>patch("intervals",e.target.value.split(",").map(s=>s.trim()))} /><small className="field-hint">Comma-separated: 24h, 7d, 30d, 90d, all. Each period is a request.</small></label>}
    </div>
    <div className="skill-toggles">
      {kind==="skill-token-dd"&&["list","advanced_security","risk_history"].map((v,i)=><label className="check" key={v}><input type="checkbox" checked={(value.include??[]).includes(v)} onChange={e=>patch("include",e.target.checked?[...(value.include??[]),v]:(value.include??[]).filter((item:string)=>item!==v))} />{["Add holder list","Add labeled holder groups","Add historical liquidity"][i]}</label>)}
      {kind==="skill-contract-dd"&&check("skipKline","Skip price candles")}
      {["skill-wallet-score","skill-wallet-style","skill-wallet-analysis","skill-smart-money-profile"].includes(kind)&&check("skipFirstFunded","Skip first funding lookup")}
      {["skill-wallet-style","skill-wallet-analysis","skill-smart-money-profile"].includes(kind)&&check("skipTransactions","Skip transaction / trade page")}
      {["skill-wallet-score","skill-wallet-analysis","skill-smart-money-profile"].includes(kind)&&check("skipPortfolio","Skip holdings")}
      {kind==="skill-wallet-score"&&check("skipPositions","Skip positions (alpha score unavailable)")}
    </div>
  </div>;
}

export function SkillFindings({analysis}:{analysis:Data}) {
  const names:Record<string,string>={kline:"Candlestick pattern","wallet-alpha":"Wallet alpha","wallet-style":"Wallet style","wallet-leaderboard":"Wallet comparison","wallet-discovery":"Wallet shortlist","security-evidence":"Security evidence","liquidity-change":"Liquidity history"};
  return <section className="skill-findings" aria-label="Skill findings">
    <h3>Skill findings</h3>
    {analysis.findings.map((f:Data,i:number)=><div className="skill-finding" key={i}>
      <h4>{names[f.kind]??f.kind}</h4>
      {f.kind==="wallet-discovery"&&<><p>{f.wallets.length} shortlisted · {f.observedWallets} unique wallets observed</p><div className="table-wrap"><table><thead><tr><th>Wallet</th><th>Tokens observed</th></tr></thead><tbody>{f.wallets.map((w:Data)=><tr key={w.wallet}><td title={w.wallet}><AddressText text={w.wallet} compact kind="wallet" chain={w.chain} /></td><td>{w.tokens.length}</td></tr>)}</tbody></table></div></>}
      {f.kind==="security-evidence"&&<dl className="finding-components">{[["Freezeable",f.freezeable],["Mintable",f.mintable],["Top 10 account share",f.top10AccountShare==null?null:`${Number(f.top10AccountShare)*100}%`]].map(([label,value])=><div key={String(label)}><dt>{label}</dt><dd>{value==null?"Unknown":typeof value==="boolean"?(value?"Yes":"No"):value}</dd></div>)}</dl>}
      <p>{f.pattern?.replaceAll("_"," ")??f.style??(f.kind==="security-evidence"?"Evidence checklist; no safety verdict":null)}{f.score!=null?` · ${f.score}/100`:""}{f.kind==="wallet-alpha"?(f.alphaScore!=null?`${f.alphaScore}/100` : "Score unavailable"):""}{f.liquidityChangePct!=null?`${f.liquidityChangePct}% across ${f.snapshots} snapshots`:""}</p>
      {f.components&&<dl className="finding-components">{Object.entries(f.components).map(([k,v])=><div key={k}><dt>{k}</dt><dd>{String(v)}</dd></div>)}</dl>}
      {f.rows&&<div className="table-wrap"><table><thead><tr><th>Rank</th><th>Wallet</th><th>Comparison score</th><th>30d realized · USD</th><th>30d wins · %</th></tr></thead><tbody>{f.rows.map((r:Data)=><tr key={r.wallet}><td>{r.rank??"Unranked"}</td><td title={r.wallet}><AddressText text={r.wallet} compact kind="wallet" chain={r.chain} /></td><td>{r.rankingScore??"Unavailable"}</td><td>{r.pnl30??"Unavailable"}</td><td>{r.wr30==null?"Unavailable":(r.wr30*100).toFixed(1)}</td></tr>)}</tbody></table></div>}
      {f.missing?.length>0&&<ul className="field-hint">{f.missing.map((m:string)=><li key={m}>{m}</li>)}</ul>}

      <details className="source"><summary>Details</summary><p>{f.basis}</p><pre><AddressText text={JSON.stringify(f,null,2)} /></pre></details>
    </div>)}
  </section>;
}
