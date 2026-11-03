import React, {useEffect, useId, useRef, useState} from "react";
import {AddressText} from "./address-text";
import {TokenDdScore} from "./token-dd-score";
import {TokenDataReport} from "./token-data-report";
import {DemoIcon} from "./demo-icon";
import {money, percent} from "./demo-data";
import {numeric, sourceRows, sourceFor, usableSources, timeSeries, trendingRows, pnlWindows, type Data, type Point} from "./skill-visual-data";

const fmt = (v: unknown, digits = 1) => numeric(v)?.toLocaleString(undefined, {maximumFractionDigits: digits}) ?? "N/A";
const usd = (v: unknown) => numeric(v) === null ? "N/A" : money(v, true);
const pct = (v: unknown) => numeric(v) === null ? "N/A" : percent(v);
const ratioPct = (v: unknown) => numeric(v) === null ? "N/A" : pct(Number(v)*100);
const human = (v?: string) => v ? v.replaceAll("_", " ").replace(/^./, c => c.toUpperCase()) : "Unavailable";
const signTone = (v: unknown) => numeric(v) === null || Number(v) === 0 ? "" : Number(v) > 0 ? "sv-positive" : "sv-negative";
const scoreTone = (v: unknown) => numeric(v) === null ? "" : Number(v) >= 75 ? "sv-positive" : Number(v) >= 50 ? "sv-caution" : "sv-negative";
const titles: Record<string,string> = {"skill-trending-list":"Trending tokens", "skill-smart-wallets":"Smart wallet discovery", "skill-token-dd":"Token research", "skill-contract-dd":"Contract due diligence", "skill-rugcheck-audit":"Risk & liquidity audit", "skill-kline-pattern":"Price action", "skill-wallet-score":"Wallet alpha", "skill-wallet-style":"Wallet trading style", "skill-wallet-analysis":"Wallet performance", "skill-smart-money-profile":"Smart money profile", "skill-smart-money-leaderboard":"Wallet comparison"};

function Empty({children = "No observations available in this snapshot."}: {children?: React.ReactNode}) {return <p className="sv-empty">{children}</p>;}
function Facts({items}: {items: [string, React.ReactNode][]}) {return <dl className="sv-facts">{items.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;}
function Meter({value, max=100, label, signed=false}: {value: unknown; max?: number; label: string; signed?: boolean}) {
  const n = numeric(value), width=n===null || max<=0 ? 0 : Math.min(100,Math.abs(n)/max*100);
  return <div className={`sv-meter ${signed ? "sv-signed" : ""} ${signed ? signTone(n) : ""}`} role="img" aria-label={`${label}: ${fmt(n)}${max===100&&!signed ? " out of 100" : ""}`}>
    {n!==null && <span style={{width:`${signed ? width/2 : width}%`,left:signed ? `${n<0?50-width/2:50}%` : 0}}/>}
  </div>;
}
function Evidence({finding}: {finding: Data}) {return <details className="sv-evidence"><summary>Method & evidence{finding.missing?.length ? ` · ${finding.missing.length} gaps` : ""}</summary><p>{finding.basis}</p>{!!finding.missing?.length&&<ul>{finding.missing.map((m:string,i:number)=><li key={i}>{m}</li>)}</ul>}<pre><AddressText text={JSON.stringify(finding,null,2)}/></pre></details>;}

export function SeriesChart({points, title, note, valueFormat=usd}: {points:Point[];title:string;note:string;valueFormat?:(n:unknown)=>string}) {
  const [index,setIndex]=useState<number|null>(null), id=useId();
  const chart=useRef<SVGSVGElement>(null),[width,setWidth]=useState(720);
  useEffect(()=>{
    const element=chart.current;
    if(!element)return;
    const observer=new ResizeObserver(entries=>setWidth(Math.max(280,entries[0].contentRect.width)));
    observer.observe(element);
    return ()=>observer.disconnect();
  },[points.length]);
  if(points.length<2)return <section className="sv-chart"><h4>{title}</h4><Empty>At least two observations are needed to draw this chart.</Empty><p className="sv-note">{note}</p></section>;
  const low=Math.min(...points.map(p=>p.value)),high=Math.max(...points.map(p=>p.value));
  const spread=high-low || Math.max(Math.abs(high)*.05,1), floor=low-spread*.12, ceiling=high+spread*.12;
  const start=points[0].time,end=points.at(-1)!.time;
  const x=(t:number)=>76+(t-start)/(end-start||1)*(width-96), y=(v:number)=>180-(v-floor)/(ceiling-floor)*150;
  const active=points[Math.min(index??points.length-1,points.length-1)];
  const date=(t:number)=>new Date(t*1000).toLocaleString(undefined,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});
  return <section className="sv-chart">
    <div className="sv-section-heading"><h4>{title}</h4><span>{points.length} observations</span></div>
    <div className="sv-chart-readout" id={id}><strong>{valueFormat(active.value)}</strong><span>{date(active.time)}</span></div>
    <svg ref={chart} viewBox={`0 0 ${width} 220`} role="img" aria-label={`${title}, ${points.length} observations from ${date(start)} to ${date(end)}; minimum ${valueFormat(low)}, maximum ${valueFormat(high)}`} onPointerMove={e=>{
      const box=e.currentTarget.getBoundingClientRect(), t=start+Math.max(0,Math.min(1,((e.clientX-box.left)/box.width*width-76)/(width-96)))*(end-start);
      setIndex(points.reduce((best,p,i)=>Math.abs(p.time-t)<Math.abs(points[best].time-t)?i:best,0));
    }}>
      {[low,(low+high)/2,high].filter((v,i,a)=>a.indexOf(v)===i).map(v=><g key={v}><line x1="76" x2={width-20} y1={y(v)} y2={y(v)} className="sv-gridline"/><text x="66" y={y(v)+4} textAnchor="end">{valueFormat(v)}</text></g>)}
      <polyline points={points.map(p=>`${x(p.time)},${y(p.value)}`).join(" ")} fill="none" className="sv-series-line"/>
      <line x1={x(active.time)} x2={x(active.time)} y1="20" y2="185" className="sv-crosshair"/>
      <circle cx={x(active.time)} cy={y(active.value)} r="4" className="sv-series-point"/>
      <text x="76" y="210">{new Date(start*1000).toLocaleDateString()}</text><text x={width-20} y="210" textAnchor="end">{new Date(end*1000).toLocaleDateString()}</text>
    </svg>
    <label className="sv-chart-scrubber">Inspect observation<input type="range" min="0" max={points.length-1} value={index??points.length-1} onChange={e=>setIndex(Number(e.target.value))} aria-label={`Inspect ${title} observation`} aria-describedby={id} aria-valuetext={`${date(active.time)}, ${valueFormat(active.value)}`}/></label>
    <p className="sv-note">{note}</p>
  </section>;
}

function Kline({finding:f,sources}: {finding:Data;sources:Data[]}) {
  const source=sources.find(s=>f.sourceIds?.includes(s.meta?.requestId)&&s.meta?.operation==="market.ohlcv"&&!s.meta?.isError);
  const points=timeSeries(source,"price");
  return <section className="sv-finding" aria-label="Candlestick pattern">
    <div className="sv-assessment"><div><h4>Observed pattern</h4><h3>{human(f.pattern)}</h3><p className="sv-note">{f.closedCandles??0} closed candles · {f.gapCount??"N/A"} gaps · {source?.meta?.params?.type??"Interval unavailable"}</p></div><div className={`sv-score ${scoreTone(f.score)}`}><strong>{fmt(f.score)}</strong><span>/ 100<br/>Pattern score</span></div></div>
    <SeriesChart points={points} title="Closing price" note="Valid closed candles only. Lines connect observations across any gaps; extrema are not forecasts."/>
    <Facts items={[["Trend",human(f.trend)],["Slope",ratioPct(f.slope)],["Volatility",ratioPct(f.volatility)],["Drawdown",ratioPct(f.drawdown)],["Observed support",usd(f.observedSupport)],["Observed resistance",usd(f.observedResistance)],["Volume ratio",numeric(f.volumeRatio)===null?"N/A":`${fmt(f.volumeRatio)}×`],["Recovery from low",ratioPct(f.recoveryFromLow)]]}/>
    {!!f.adjustments?.length&&<details className="sv-evidence"><summary>Score adjustments</summary><div className="sv-bars">{f.adjustments.map((a:Data,i:number)=><div key={i}><span>{human(a.reason)}</span><Meter value={a.delta} max={30} signed label={a.reason}/><strong className={signTone(a.delta)}>{a.delta>0?"+":""}{fmt(a.delta)} pts</strong></div>)}</div></details>}
    <Evidence finding={f}/>
  </section>;
}

function Alpha({finding:f}: {finding:Data}) {return <section className="sv-finding" aria-label="Wallet alpha assessment">
  <div className="sv-assessment"><div><h4>Alpha assessment</h4><p className="sv-note">30d / 90d evidence · {f.positionsObserved??"N/A"} positions observed</p></div><div className={`sv-score ${scoreTone(f.alphaScore)}`}><strong>{fmt(f.alphaScore)}</strong><span>/ 100<br/>Alpha score</span></div></div>
  <h4>Score breakdown</h4><div className="sv-bars">{["profitability","consistency","quality","activity"].map(key=><div key={key}><span>{human(key)}<small>{numeric(f.weights?.[key])===null?"Weight unavailable":`${fmt(f.weights[key]*100)}% weight`}</small></span><Meter value={f.components?.[key]} label={human(key)}/><strong>{fmt(f.components?.[key])}</strong></div>)}</div>
  {!!f.gates?.length&&<p className="sv-callout">{f.gates.join(" · ")}</p>}<p className="sv-note">Research heuristic from fetched positions; not a copy-trading return forecast.</p><Evidence finding={f}/>
  </section>;}

function Style({finding:f}: {finding:Data}) {
  const daily=numeric(f.tradesPerDay),frequency=daily===null?-1:daily<1?0:daily<10?1:daily<=50?2:3;
  return <section className="sv-finding" aria-label="Trading style">
    <div className="sv-section-heading"><h4>Trading profile</h4><span>{f.positionsObserved??"N/A"} positions observed</span></div><h3 className="sv-pattern-title">{f.style??"Style unavailable"}</h3>
    <div className="sv-frequency" role="img" aria-label={`Frequency: ${["Rare","Regular","Frequent","Machine"][frequency]??"Unavailable"}; ${fmt(daily)} trades per day`}>{[["Rare","< 1 / day"],["Regular","1–<10 / day"],["Frequent","10–50 / day"],["Machine","> 50 / day"]].map(([name,hint],i)=><div key={name} className={i===frequency?"selected":""}><strong>{name}</strong><small>{hint}</small>{i===frequency&&<span>Observed</span>}</div>)}</div>
    <Facts items={[["Trades per day",fmt(daily)],["Realized ROI",<span className={signTone(f.realizedRoi)}>{ratioPct(f.realizedRoi)}</span>],["Win rate from counts",ratioPct(f.winRateFromCounts)],["Positions losing > 50%",ratioPct(f.lossShare)]]}/><Evidence finding={f}/>
  </section>;
}

function Security({finding:f,sources}: {finding:Data;sources:Data[]}) {
  const share=numeric(f.top10AccountShare), sec=sourceFor(sources,"token.security")?.data;
  const checks:[string,unknown][]=[["Freezeable",f.freezeable],["Mintable",f.mintable],["Mutable metadata",sec?.mutableMetadata]];
  return <section className="sv-finding" aria-label="Security observations"><div className="sv-section-heading"><h4>Contract controls</h4><span>{checks.filter(([,v])=>typeof v==="boolean").length} / {checks.length} available</span></div>
    <div className="sv-control-grid">{checks.map(([name,value])=><div key={name} className={value===true?"sv-control-attention":""}><DemoIcon id="security-signals" size={22}/><span>{name}</span><strong>{value===true?"Enabled":value===false?"Disabled":"Unknown"}</strong></div>)}</div>
    <div className="sv-section-heading"><h4>Ownership concentration</h4><strong>{share!==null&&share>=0&&share<=1?pct(share*100):"N/A"}</strong></div><Meter value={share!==null&&share>=0&&share<=1?share*100:null} label="Top 10 token-account supply share"/><p className="sv-note">Top-10 token-account share. Unknown controls are not passed checks.</p>
    <p className="sv-callout">Honeypot simulation and LP-lock verification are unavailable in this workflow. No composite safety verdict.</p><Evidence finding={f}/>
  </section>;
}

function Liquidity({finding:f,sources}: {finding:Data;sources:Data[]}) {const source=sources.find(s=>f.sourceIds?.includes(s.meta?.requestId)&&!s.meta?.isError);return <section className="sv-finding"><div className="sv-section-heading"><h4>Liquidity movement</h4><strong className={signTone(f.liquidityChangePct)}>{pct(f.liquidityChangePct)}</strong></div><SeriesChart points={timeSeries(source,"liquidity")} title="Liquidity history" note="First-to-last fetched snapshots. A value change does not establish an LP withdrawal."/><Evidence finding={f}/></section>;}

function WalletComparison({finding:f}: {finding:Data}) {
  const [sort,setSort]=useState("rankingScore");
  const rows=[...(f.rows??[])].sort((a,b)=>numeric(a[sort])===null?numeric(b[sort])===null?0:1:numeric(b[sort])===null?-1:Number(b[sort])-Number(a[sort]));
  return <section className="sv-finding"><div className="sv-section-heading"><h4>Wallet leaderboard</h4><label>Sort wallets<select value={sort} onChange={e=>setSort(e.target.value)}><option value="rankingScore">Comparison score</option><option value="pnl30">Realized PnL · 30d</option><option value="wr30">Win rate · 30d</option></select></label></div>
    <p className="sv-note">Relative to supplied wallets with complete inputs. Missing inputs remain unranked.</p>
    {rows.length?<div className="sv-leaderboard">{rows.map((r:Data)=><article key={r.wallet}><span className="sv-rank">{r.rank??"—"}</span><div><AddressText text={r.wallet} compact kind="wallet" chain="solana"/><Meter value={r.rankingScore} label="Wallet comparison score"/><p className="sv-note"><span className={signTone(r.pnl30)}>{usd(r.pnl30)}</span> realized · {ratioPct(r.wr30)} wins</p></div><strong>{fmt(r.rankingScore)}<small>/ 100</small></strong></article>)}</div>:<Empty/>}<Evidence finding={f}/>
  </section>;
}

function Discovery({finding:f,sources}: {finding:Data;sources:Data[]}) {
  const [selected,setSelected]=useState<string|null>(null),wallets:Data[]=f.wallets??[],active=wallets.find(w=>w.wallet===selected)??wallets[0];
  const tokenCount=new Set(wallets.flatMap(w=>w.tokens??[])).size;
  return <section className="sv-finding"><h4>Discovery path</h4><div className="sv-discovery-path">{[["Tokens in shortlist",tokenCount],["Observed wallets",f.observedWallets],["Shortlisted",wallets.length]].map(([name,value])=><div key={String(name)}><strong>{fmt(value,0)}</strong><span>{name}</span></div>)}</div>
    {wallets.length?<><div className="sv-section-heading"><h4>Wallet shortlist</h4><span>Provider order</span></div><div className="sv-wallet-picker" role="group" aria-label="Wallet shortlist">{wallets.map((w,i)=><div className="sv-wallet-option" key={w.wallet}><button type="button" aria-pressed={active?.wallet===w.wallet} onClick={()=>setSelected(w.wallet)}><DemoIcon id="wallet-intelligence"/><span>Wallet {i+1}</span><strong>{w.tokens.length}<small>tokens</small></strong></button><AddressText text={w.wallet} kind="wallet" compact chain="solana"/></div>)}</div><section className="sv-selected-wallet" aria-label="Selected discovered wallet"><AddressText text={active.wallet} kind="wallet" compact chain="solana"/><div className="sv-token-links">{active.tokens.map((t:string)=><AddressText key={t} text={t} kind="token" compact chain="solana"/>)}</div><WalletPerformance sources={sources.filter(s=>s.meta?.params?.wallet===active.wallet)} compact/></section></>:<Empty>No wallets were shortlisted in this snapshot.</Empty>}<Evidence finding={f}/>
  </section>;
}

function Trending({sources}: {sources:Data[]}) {
  const rows=trendingRows(sources),[query,setQuery]=useState(""),[sort,setSort]=useState("rank"),[selected,setSelected]=useState<string|null>(null);
  const filtered=rows.filter(r=>`${r.symbol} ${r.address??""}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==="rank"?a.rank-b.rank:numeric((a as Data)[sort])===null?numeric((b as Data)[sort])===null?0:1:numeric((b as Data)[sort])===null?-1:Number((b as Data)[sort])-Number((a as Data)[sort]));
  const active=filtered.find(r=>r.address===selected)??filtered[0],max=Math.max(0,...rows.map(r=>r.liquidity??0));
  return <section className="sv-finding"><div className="sv-section-heading"><h4>Market watchlist</h4><span>{rows.length} tokens · fetched page</span></div>
    <div className="sv-toolbar"><label>Filter tokens<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Symbol or token address"/></label><label>Sort tokens<select value={sort} onChange={e=>setSort(e.target.value)}><option value="rank">Provider rank</option><option value="liquidity">Liquidity</option><option value="volume">Volume · 24h</option></select></label></div>
    <div className="sv-watchlist">{filtered.length?filtered.map((r,i)=><div className="sv-watchlist-row" key={`${r.address}-${r.rank}`}><button className="sv-watchlist-select" type="button" aria-pressed={active===r} onClick={()=>setSelected(r.address)}><span className="sv-rank">{r.rank}</span><span className="sv-token-avatar" aria-hidden="true">{String(r.symbol).slice(0,2).toUpperCase()}</span><span className="sv-token-name"><strong>{r.symbol}</strong><small>{usd(r.price)}</small></span><span className="sv-watchlist-bar"><Meter value={r.liquidity} max={max} label={`${r.symbol} liquidity`}/><small>{usd(r.liquidity)} liquidity</small></span><span className={signTone(r.change)}>{pct(r.change)}<small>24h change</small></span></button><div className="sv-row-address"><AddressText text={r.address} kind="token" compact chain="solana"/></div></div>):<Empty>{rows.length?"No tokens match this filter.":"No tokens returned in this snapshot."}</Empty>}</div>
    {active&&<section className="sv-selected-token" aria-label="Selected token"><div className="sv-section-heading"><h4>{active.symbol}</h4>{active.address&&<AddressText text={active.address} kind="token" compact chain="solana"/>}</div><Facts items={[["Price",usd(active.price)],["Liquidity",usd(active.liquidity)],["Volume · 24h",usd(active.volume)],["Market cap",usd(active.marketCap)]]}/></section>}
  </section>;
}

function WalletPerformance({sources,compact=false}: {sources:Data[];compact?:boolean}) {
  const rowId=useId();
  const windows=pnlWindows(sources),[selected,setSelected]=useState<string|null>(null);
  const current=windows.find(w=>w.id===selected)??windows.find(w=>w.period==="30d")??windows[0];
  const [measure,setMeasure]=useState<"realized"|"unrealized">("realized");
  const max=Math.max(0,...windows.map(w=>Math.abs(w[measure]??0)));
  if(!windows.length)return <><section className="sv-finding"><h4>Wallet performance</h4><Empty>No wallet-wide PnL was fetched. Token-level trader PnL is not a wallet total.</Empty></section>{!compact&&<Portfolio sources={sources}/>}</>;
  return <section className="sv-finding" aria-label="Wallet performance">
    <div className="sv-section-heading"><h4>PnL by period</h4><span>USD · {current.method??"Method unavailable"}</span></div>
    <div className="sv-segmented" role="group" aria-label="PnL measure">{(["realized","unrealized"] as const).map(m=><button type="button" key={m} aria-pressed={measure===m} onClick={()=>setMeasure(m)}>{human(m)}</button>)}</div>
    <div className="sv-bars sv-period-bars">{windows.map((w,index)=><button type="button" key={w.id} aria-pressed={current.id===w.id} onClick={()=>setSelected(w.id)} aria-label={`Inspect ${w.period} PnL`} aria-describedby={`${rowId}-${index}`}><span>{w.period}<small>{`${w.method??"Method unavailable"} · ${w.scope?.replaceAll("_"," ")??"Scope unavailable"}`}</small></span><Meter value={w[measure]} max={max} signed label={`${w.period} ${measure} PnL in USD`}/><strong className={signTone(w[measure])}>{usd(w[measure])}</strong><span className="sv-sr-only" id={`${rowId}-${index}`}>{human(measure)} PnL: {usd(w[measure])}; {w.method??"Method unavailable"}; {w.scope?.replaceAll("_"," ")??"Scope unavailable"}.</span></button>)}</div>
    <Facts items={[[`Realized · ${current.period}`,<span className={signTone(current.realized)}>{usd(current.realized)}</span>],[`Unrealized · ${current.period}`,<span className={signTone(current.unrealized)}>{usd(current.unrealized)}</span>],["Win rate from counts",pct(current.winRate)],["Trades",fmt(current.trades,0)]]}/>
    <p className="sv-note">Periods can overlap and are not added together. Selected scope: {current.scope?.replaceAll("_"," ")??"unavailable"}.</p>
    {!compact&&<Portfolio sources={sources} wallet={current.wallet}/>}
  </section>;
}

function Portfolio({sources,wallet}: {sources:Data[];wallet?:string}) {
  const relevant=sources.filter(s=>!wallet||s.meta?.params?.wallet===wallet);
  const holdings:Data[]=sourceRows(sourceFor(relevant,"portfolio.holdings")).map(r=>({...r,observedValue:numeric(r.valueUsd??r.value)})).sort((a,b)=>(b.observedValue??-1)-(a.observedValue??-1));
  const maximum=Math.max(0,...holdings.map(r=>r.observedValue??0));
  const worth=sourceFor(relevant,"portfolio.net-worth-history");
  const positions=sourceRows(sourceFor(relevant,"portfolio.pnl-details"));
  return <>
    {worth&&<SeriesChart points={timeSeries(worth,"worth")} title="Net-worth history" note="Observed balance values include cash flows. Change in net worth is not trading ROI."/>}
    {!!holdings.length&&<section className="sv-portfolio"><div className="sv-section-heading"><h4>Holdings composition</h4><span>Largest 6 · fetched page</span></div><div className="sv-bars">{holdings.slice(0,6).map((r,i)=><div key={`${r.address}-${i}`}><span>{r.symbol??"Token"}{r.address&&<small><AddressText text={r.address} compact kind="token" chain="solana"/></small>}</span><Meter value={r.observedValue} max={maximum} label={`${r.symbol??"Token"} holding value USD`}/><strong>{usd(r.valueUsd??r.value)}</strong></div>)}</div><p className="sv-note">Priced assets on the fetched page only; missing prices are unavailable.</p></section>}
    {!!positions.length&&<details className="sv-evidence"><summary>Per-token positions · {positions.length}</summary><div className="table-wrap"><table><thead><tr><th>Token</th><th>Realized · USD</th><th>Unrealized · USD</th></tr></thead><tbody>{positions.map((r,i)=><tr key={i}><th>{r.address?<AddressText text={r.address} compact kind="token" chain="solana"/>:r.symbol??"Token"}</th><td className={signTone(r.pnl?.realized_profit_usd)}>{usd(r.pnl?.realized_profit_usd)}</td><td className={signTone(r.pnl?.unrealized_usd)}>{usd(r.pnl?.unrealized_usd)}</td></tr>)}</tbody></table></div></details>}
  </>;
}

function MarketContext({sources}: {sources:Data[]}) {
  const overview=sourceFor(sources,"token.overview")?.data;
  const flow=sourceRows(sourceFor(sources,"token.money-flow"));
  const cohorts=sourceFor(sources,"token.holder-profile")?.data?.tags;
  return <>
    {overview&&<Facts items={[["Price",usd(overview.price)],["Liquidity",usd(overview.liquidity)],["Volume · 24h",usd(overview.v24hUSD)],["Holders",fmt(overview.holder,0)]]}/>}
    {!!flow.length&&<section className="sv-finding"><div className="sv-section-heading"><h4>Money flow</h4><span>Provider value units</span></div><div className="sv-flow-legend"><span>Buy</span><span>Sell</span></div>{flow.map((r,i)=>{
      const buy=numeric(r.total_value_buy),sell=numeric(r.total_value_sell),total=buy!==null&&sell!==null?buy+sell:null;
      return <div className="sv-flow-row" key={i}><div><strong>{human(r.tag??"Unlabeled cohort")}</strong><span>{r.frame??"Window unavailable"}</span></div>{total!==null&&total>0&&buy!>=0&&sell!>=0?<div className="sv-flow-track" role="img" aria-label={`${r.tag??"Cohort"} buys ${fmt(buy)}, sells ${fmt(sell)}`}><span style={{width:`${buy!/total*100}%`}}/><span style={{width:`${sell!/total*100}%`}}/></div>:<p className="sv-note">{total===0?"No reported buy or sell value.":"Flow split unavailable."}</p>}<div className="sv-note"><span>Buy {fmt(buy)}</span><span>Sell {fmt(sell)}</span></div></div>;
    })}<p className="sv-note">Each row keeps its own cohort and time window; overlapping groups are not summed.</p></section>}
    {Array.isArray(cohorts)&&cohorts.length>0&&<details className="sv-evidence"><summary>Holder groups · {cohorts.length}</summary><div className="sv-bars">{cohorts.map((r:Data,i:number)=><div key={i}><span>{human(r.tag)}</span><Meter value={r.percent_of_supply} label={`${r.tag} supply percent`}/><strong>{pct(r.percent_of_supply)}</strong></div>)}</div><p className="sv-note">Labels may overlap. Shares are not added together.</p></details>}
  </>;
}

export function SkillDashboard({analysis,sources=[],kind,onRescore}: {analysis:Data;sources?:Data[];kind?:string;onRescore?:(changes:Data)=>Promise<void>}) {
  const findings:Data[]=analysis.findings??[],clean=usableSources(sources);
  const dd=findings.find(f=>f.kind==="token-dd-score");
  if(dd)return <TokenDdScore report={dd} sources={clean} onRescore={onRescore}/>;
  const dataReport=findings.find(f=>f.kind==="token-data");
  if(dataReport)return <TokenDataReport report={dataReport}/>;
  const wallet=kind?.includes("wallet")||kind?.includes("smart-money"),address=clean.find(s=>wallet?s.meta?.params?.wallet:s.meta?.params?.address)?.meta?.params;
  return <section className="skill-visuals" aria-label="Skill findings">
    <header className="sv-report-header"><div className="sv-report-title"><DemoIcon id={wallet?"wallet-intelligence":["skill-trending-list","skill-kline-pattern"].includes(kind??"")?"terminal":"security-signals"} size={26}/><div><h3>{titles[kind??""]??"Research findings"}</h3>{(address?.wallet??address?.address)&&<AddressText text={address.wallet??address.address} compact kind={wallet?"wallet":"token"} chain="solana"/>}</div></div><span>{clean.length} evidence sources</span></header>
    {kind==="skill-trending-list"&&<Trending sources={clean}/>}
    {findings.map((f,i)=>f.kind==="kline"?<Kline key={i} finding={f} sources={clean}/>:f.kind==="wallet-alpha"?<Alpha key={i} finding={f}/>:f.kind==="wallet-style"?<Style key={i} finding={f}/>:f.kind==="security-evidence"?<Security key={i} finding={f} sources={clean}/>:f.kind==="liquidity-change"?<Liquidity key={i} finding={f} sources={clean}/>:f.kind==="wallet-leaderboard"?<WalletComparison key={i} finding={f}/>:f.kind==="wallet-discovery"?<Discovery key={i} finding={f} sources={clean}/>:<Evidence key={i} finding={f}/>)}
    {["skill-wallet-score","skill-wallet-style","skill-wallet-analysis","skill-smart-money-profile"].includes(kind??"")&&<WalletPerformance sources={clean}/>}
    {["skill-token-dd","skill-contract-dd","skill-rugcheck-audit"].includes(kind??"")&&<MarketContext sources={clean}/>}
    {!findings.length&&!["skill-trending-list","skill-wallet-score","skill-wallet-style","skill-wallet-analysis","skill-smart-money-profile"].includes(kind??"")&&<Empty/>}
  </section>;
}
