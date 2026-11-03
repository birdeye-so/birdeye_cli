import React, {useState} from "react";
import {AddressText} from "./address-text";
import {amount, money, percent, sorted, ratio} from "./demo-data";
import {numeric, type Data} from "./skill-visual-data";

const titles: Record<string, string> = {
  "skill-launchpad-trending": "Launchpad watchlist", "skill-token-security": "Token security",
  "skill-token-stats": "Token activity", "skill-top-holder-analysis": "Holder concentration",
  "skill-top-trader-analysis": "Trader watchlist", "skill-lp-analysis": "Pool liquidity",
  "skill-smart-money-holders": "Smart Money holders", "skill-kol-signal": "KOL flow",
};
const usd = (v: unknown) => numeric(v) === null ? "Unavailable" : money(v, true);
const pct = (v: unknown) => numeric(v) === null ? "Unavailable" : percent(v);
const count = (v: unknown) => amount(v)?.toFormat() ?? "Unavailable";
const text = (v: unknown) => v == null ? "Unavailable" : typeof v === "object" ? JSON.stringify(v) : String(v);
const shortAddress = (v: unknown) => typeof v === "string" ? `${v.slice(0, 5)}…${v.slice(-4)}` : "Unknown address";
const tone = (v: unknown) => numeric(v) === null || Number(v) === 0 ? "" : Number(v) > 0 ? "sv-positive" : "sv-negative";
const date = (v: unknown) => {
  const n = numeric(v), d = n === null ? null : new Date(n * 1000);
  return d && Number.isFinite(d.getTime()) ? d.toLocaleString("en-GB", {month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",timeZone:"UTC"}) + " UTC" : "Time unavailable";
};
const rows = (report: Data, prefix: string): Data[] => report.tables?.find((t: Data) => t.title.startsWith(prefix))?.rows ?? [];
function Empty({children = "No observations in this snapshot."}: {children?: React.ReactNode}) {return <p className="td-empty">{children}</p>;}
function Facts({items}: {items: [string, React.ReactNode][]}) {return <dl className="td-facts">{items.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;}
function Bar({value,max=100,label}: {value: unknown;max?: unknown;label: string}) {
  return <div className="td-bar" role="img" aria-label={`${label}: ${text(value)}`}><span style={{width:`${ratio(value,max)}%`}}/></div>;
}
function Address({value,pool=false}: {value: unknown;pool?:boolean}) {
  return typeof value === "string" && value ? pool ? <code className="td-pool-address" title={value}>{value}</code> : <AddressText text={value} compact kind="wallet" chain="solana"/> : <span>Unknown address</span>;
}
function Token({row}: {row: Data}) {return <span className="td-token"><strong>{row.symbol || "Token"}</strong>{row.address && <AddressText text={row.address} compact kind="token" chain="solana"/>}</span>;}
function FlowSplit({buy,sell}: {buy:unknown;sell:unknown}) {
  const b=numeric(buy), s=numeric(sell), valid=b!==null&&s!==null&&b>=0&&s>=0;
  return <div className="td-flow"><div className="td-flow-labels"><span>Buy <strong>{usd(buy)}</strong></span><span>Sell <strong>{usd(sell)}</strong></span></div>
    {valid && b+s>0 ? <div className="td-flow-track" role="img" aria-label={`Buy ${usd(b)}; sell ${usd(s)}`}><span style={{width:`${b/(b+s)*100}%`}}/><span style={{width:`${s/(b+s)*100}%`}}/></div> : <p className="sv-note">{valid ? "No observed buy or sell volume." : "Buy/sell split unavailable."}</p>}
  </div>;
}
function More({total,shown,onClick}: {total:number;shown:number;onClick:()=>void}) {return total>shown ? <button type="button" className="td-more" onClick={onClick}>Show more · {total-shown} remaining</button> : null;}

function Launchpad({report}: {report:Data}) {
  const all=rows(report,"Launch candidates"),[query,setQuery]=useState(""),[sort,setSort]=useState("volume24hUsd"),[shown,setShown]=useState(5);
  const filtered=sorted(all.filter(r=>`${r.symbol} ${r.address} ${r.source}`.toLowerCase().includes(query.toLowerCase())),sort);
  return <section className="td-body" aria-label="Find a token to research"><h4>Find a token to research</h4>
    <div className="td-toolbar"><label>Find token<input value={query} onChange={e=>{setQuery(e.target.value);setShown(5);}} placeholder="Symbol or address"/></label><label>Compare by<select value={sort} onChange={e=>setSort(e.target.value)}><option value="volume24hUsd">24h volume</option><option value="liquidityUsd">Liquidity</option><option value="progressPct">Launch progress</option></select></label></div>
    <p className="sv-note">{filtered.length} candidates · {text(report.summary?.requestedStage).replaceAll("-"," ")}</p>
    <div className="td-launch-list">{filtered.slice(0,shown).map((r,i)=><article key={`${r.address}-${i}`} className="td-launch-row"><Token row={r}/><div><span>Liquidity</span><strong>{usd(r.liquidityUsd)}</strong></div><div><span>Volume · 24h</span><strong>{usd(r.volume24hUsd)}</strong></div><div className="td-launch-progress"><span>{r.graduated===true ? "Graduated" : "Launch progress"}</span><strong>{pct(r.progressPct)}</strong><Bar value={r.progressPct} label="Launch progress percent"/></div></article>)}</div>
    {!filtered.length&&<Empty>{all.length?"No matching tokens. Try another symbol or address.":"No launch candidates returned."}</Empty>}<More total={filtered.length} shown={shown} onClick={()=>setShown(n=>n+10)}/>
  </section>;
}

function Security({report}: {report:Data}) {
  const checks=rows(report,"Security observations"),[filter,setFilter]=useState("all");
  const definitions=[['Mint authority active','Mint authority'],['Freeze authority active','Freeze authority'],['Mutable metadata','Metadata edits'],['Non-transferable','Transfer restriction']];
  const controls: Data[]=definitions.map(([key,label])=>({label,...checks.find(r=>r.check===key)}));
  const visible=controls.filter(r=>filter==='all'||(filter==='active'?r.value===true:r.value==null));
  const find=(key:string)=>checks.find(r=>r.check===key)?.value;
  return <section className="td-body" aria-label="Review token controls"><h4>Review token controls</h4>
    <div className="sv-segmented" role="group" aria-label="Filter controls">{[['all','All controls'],['active','Active'],['unknown','Unknown']].map(([key,label])=><button key={key} type="button" aria-pressed={filter===key} onClick={()=>setFilter(key)}>{label}</button>)}</div>
    <dl className="td-controls">{visible.map(r=><div key={r.label}><dt>{r.label}</dt><dd className={r.value===true?'sv-caution':''}>{r.value===true?'Active':r.value===false?'Inactive':'Unknown'}</dd></div>)}</dl>
    {!visible.length&&<Empty>No controls match this filter.</Empty>}
    <Facts items={[["Transfer fee",pct(find('Transfer fee · %'))],["Creator supply",pct(find('Creator supply · %'))],["Top-10 accounts",pct(find('Top-10 token accounts · %'))]]}/>
    <p className="sv-note">{find('Reported honeypot')==null?'Honeypot unknown':`Reported honeypot: ${find('Reported honeypot')?'Yes':'No'}`} · {find('Reported LP locked')==null?'LP lock unknown':`Reported LP lock: ${find('Reported LP locked')?'Yes':'No'}`} · Provider observations</p>
  </section>;
}

function Stats({report}: {report:Data}) {
  const data=rows(report,"Rolling activity"),[frame,setFrame]=useState("24h"),current=data.find(r=>r.frame===frame)??data[0],s=report.summary??{};
  return <section className="td-body" aria-label="Compare trading activity"><h4>Compare trading activity</h4>
    <Facts items={[["Price",usd(s.priceUsd)],["Liquidity",usd(s.liquidityUsd)],["Market cap",usd(s.marketCapUsd)]]}/>
    {data.length ? <><div className="sv-segmented" role="group" aria-label="Activity window">{data.map(r=><button key={r.frame} type="button" aria-pressed={current===r} onClick={()=>setFrame(r.frame)}>{r.frame}</button>)}</div>
      <Facts items={[[`Price change · ${current.frame}`,<span className={tone(current.priceChangePct)}>{pct(current.priceChangePct)}</span>],["Volume",usd(current.volumeUsd)],["Trades",count(current.trades)],["Active wallets",count(current.activeWallets)]]}/><FlowSplit buy={current.buyUsd} sell={current.sellUsd}/></> : <Empty>No rolling activity windows available.</Empty>}
    <p className="sv-note">Rolling windows overlap; compare them separately.</p>
  </section>;
}

function HolderList({report,smart=false}: {report:Data;smart?:boolean}) {
  const data=rows(report,smart?'Smart-trader positions':'Holder wallets'),s=report.summary??{};
  const [selected,setSelected]=useState(0),[shown,setShown]=useState(5),active=data[selected]??data[0];
  return <section className="td-body" aria-label={smart?'See who still holds':'Check holder concentration'}><h4>{smart?'See who still holds':'Check holder concentration'}</h4>
    <Facts items={smart ? [["Cohort holders",count(s.cohortHolders)],["Cohort supply",pct(s.cohortSupplyPct)],["Positions sampled",count(s.observedPositions)]] : [["Largest wallet",pct(s.top1SupplyPct)],["Top 10 wallets",pct(s.top10SupplyPct)],["Wallets sampled",count(s.observedWallets)]]}/>
    <p className="sv-note">{smart ? s.includeExited?'Includes exited positions · lifetime activity is separate':'Current positions · lifetime activity is separate' : 'Supply share · fetched wallet page'}</p>
    <div className="td-workspace"><div className="td-ranked-list">{data.slice(0,shown).map((r,i)=><button type="button" key={`${r.wallet}-${i}`} className="td-rank-row" aria-pressed={active===r} onClick={()=>setSelected(i)} aria-label={`Inspect holder ${i+1}`}><span className="td-rank">{r.rank??i+1}</span><span>{shortAddress(r.wallet)}<Bar value={r.supplyPct} label="Supply share percent"/></span><strong>{pct(r.supplyPct)}</strong></button>)}{!data.length&&<Empty>No holder positions returned.</Empty>}<More total={data.length} shown={shown} onClick={()=>setShown(n=>n+10)}/></div>
      {active&&<aside className="td-inspector" aria-label="Selected holder"><h5>Selected holder</h5><Address value={active.wallet}/><Facts items={[["Supply share",pct(active.supplyPct)],["Tokens held",count(smart?active.holdingTokens:active.holding)],...(smart?[["Position PnL",usd(active.positionPnlUsd)],["Lifetime buy",usd(active.lifetimeBuyUsd)],["Lifetime sell",usd(active.lifetimeSellUsd)]] as [string,React.ReactNode][]:[])]}/></aside>}
    </div>
  </section>;
}

function Traders({report}: {report:Data}) {
  const all=rows(report,'Top traders'),[sort,setSort]=useState('realizedPnlUsd'),[selected,setSelected]=useState<string|null>(null),[shown,setShown]=useState(5),data=sorted(all,sort),active=data.find(r=>r.wallet===selected)??data[0];
  const labels: Record<string,string>={realizedPnlUsd:'Realized PnL',volumeUsd:'Volume',holdingUsd:'Current holding'};
  const max=Math.max(0,...data.map(r=>Math.abs(numeric(r[sort])??0)));
  return <section className="td-body" aria-label="Find traders to research"><div className="td-section-heading"><h4>Find traders to research</h4><label>Rank traders<select value={sort} onChange={e=>setSort(e.target.value)}>{Object.entries(labels).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label></div>
    <p className="sv-note">{text(report.summary?.window)} · This token only · {data.length} sampled traders</p>
    <div className="td-workspace"><div className="td-ranked-list">{data.slice(0,shown).map((r,i)=><button type="button" className="td-rank-row" key={`${r.wallet}-${i}`} aria-pressed={active===r} aria-label={`Inspect trader ${i+1}`} onClick={()=>setSelected(r.wallet)}><span className="td-rank">{i+1}</span><span>{shortAddress(r.wallet)}<Bar value={numeric(r[sort])===null?null:Math.abs(Number(r[sort]))} max={max} label={`${labels[sort]} magnitude`}/></span><strong className={sort==='realizedPnlUsd'?tone(r[sort]):''}>{usd(r[sort])}</strong></button>)}{!data.length&&<Empty>No traders returned.</Empty>}<More total={data.length} shown={shown} onClick={()=>setShown(n=>n+10)}/></div>
      {active&&<aside className="td-inspector" aria-label="Selected trader"><h5>Selected trader</h5><Address value={active.wallet}/><Facts items={[["Realized PnL",<span className={tone(active.realizedPnlUsd)}>{usd(active.realizedPnlUsd)}</span>],["Unrealized PnL",usd(active.unrealizedPnlUsd)],["Current holding",usd(active.holdingUsd)]]}/><FlowSplit buy={active.buyUsd} sell={active.sellUsd}/></aside>}
    </div>
  </section>;
}

/** Each bar is one observed bucket. Missing values leave gaps; no inferred observations. */
function Timeline({data,liquidity=false}: {data:Data[];liquidity?:boolean}) {
  const points=data.filter(r=>numeric(r.time)!==null),[selected,setSelected]=useState<number|null>(null),index=Math.min(selected??points.length-1,points.length-1),active=points[index];
  const fields=liquidity?['liquidityUsd']:['buyUsd','sellUsd'];
  const max=Math.max(0,...points.flatMap(r=>fields.map(f=>numeric(r[f])??0)));
  const start=numeric(points[0]?.time)??0,end=numeric(points.at(-1)?.time)??start;
  const x=(time:number)=>20+(end===start ? .5 : (time-start)/(end-start))*600;
  const barWidth=Math.min(18,Math.max(1,500/Math.max(points.length,1)));
  return <section className="td-timeline" aria-label={liquidity?'Token liquidity history':'Cohort activity timeline'}><div className="td-section-heading"><h4>{liquidity?'Token liquidity history':'When did activity change?'}</h4><span>{points.length} observations</span></div>
    {active ? <><svg viewBox="0 0 640 135" role="img" aria-label={liquidity?'Observed token liquidity in USD':'Buy and sell volume in USD by observed bucket'}><line x1="20" x2="620" y1="130" y2="130" className="td-axis"/>{points.map((r,i)=><g key={`${r.time}-${i}`} opacity={i===index?1:.65}>{fields.map((field,j)=>{const n=numeric(r[field]);if(n===null||n<0)return null;const height=max>0?n/max*105:0;return <rect key={field} x={x(Number(r.time))+(liquidity?-barWidth/2:j===0?-barWidth:1)} y={130-height} width={barWidth} height={height} className={liquidity?'td-liquidity-bar':j===0?'td-buy-bar':'td-sell-bar'}/>;})}</g>)}</svg><div className="td-time-range"><time>{date(start)}</time><time>{date(end)}</time></div>
      <label className="td-scrubber">Inspect {liquidity?'snapshot':'bucket'}<input type="range" min={0} max={points.length-1} value={index} aria-label={liquidity?'Inspect liquidity snapshot':'Inspect activity bucket'} aria-valuetext={date(active.time)} onChange={e=>setSelected(Number(e.target.value))}/></label>
      <div className="td-observation" aria-live="polite"><time>{date(active.time)}</time>{liquidity?<strong>{usd(active.liquidityUsd)}</strong>:<><span>Buy <strong>{usd(active.buyUsd)}</strong></span><span>Sell <strong>{usd(active.sellUsd)}</strong></span></>}</div></> : <Empty>No history available in this snapshot.</Empty>}
  </section>;
}

function Pools({report}: {report:Data}) {
  const pools=sorted(rows(report,'Pool liquidity'),'liquidityUsd'),snapshots=rows(report,'Selected pair'),s=report.summary??{},[selected,setSelected]=useState<string|null>(null),[shown,setShown]=useState(5),active=pools.find(r=>r.address===selected)??pools[0],snapshot=snapshots.find(r=>r.address===active?.address);
  return <section className="td-body" aria-label="Find where liquidity sits"><h4>Find where liquidity sits</h4><Facts items={[["Liquidity sampled",usd(s.observedLiquidityUsd)],["Pools sampled",count(s.observedPools)],["Pools reported",count(s.providerTotalPools)]]}/><p className="sv-note">Fetched-page share · not executable depth</p>
    <div className="td-workspace"><div className="td-ranked-list">{pools.slice(0,shown).map((r,i)=><button type="button" className="td-rank-row" key={`${r.address}-${i}`} aria-pressed={r===active} aria-label={`Inspect pool ${i+1}`} onClick={()=>setSelected(r.address)}><span className="td-rank">{i+1}</span><span>{r.dex||'Pool'}<Bar value={r.pageSharePct} label="Fetched-page liquidity share percent"/></span><span><strong>{usd(r.liquidityUsd)}</strong><small>{pct(r.pageSharePct)}</small></span></button>)}{!pools.length&&<Empty>No pool liquidity returned.</Empty>}<More total={pools.length} shown={shown} onClick={()=>setShown(n=>n+10)}/></div>
      {active&&<aside className="td-inspector" aria-label="Selected pool"><h5>{active.dex||'Selected pool'}</h5><Address value={active.address} pool/><Facts items={[["Liquidity",usd(active.liquidityUsd)],["Volume · 24h",usd(snapshot?.volume24hUsd)],["Trades · 24h",count(snapshot?.trades24h)]]}/>{!snapshot&&<p className="sv-note">Detailed snapshot not fetched for this pool.</p>}</aside>}
    </div>
    {report.tables?.some((t:Data)=>t.title.startsWith('Token aggregate'))&&<><Timeline data={rows(report,'Token aggregate')} liquidity/><p className="sv-note">Token-wide history · {pct(s.tokenLiquidityChangePct)} change · not proof of LP withdrawal</p></>}
  </section>;
}

function CohortFlow({report}: {report:Data}) {
  const s=report.summary??{},buckets=rows(report,'Observed cohort'),walletRows=rows(report,'Sampled wallet'),[shown,setShown]=useState(5);
  const labels:Record<string,string>={'buy-dominant':'Buying leads','sell-dominant':'Selling leads',balanced:'Balanced flow','no-observed-activity':'No observed activity',unknown:'Flow unavailable'};
  const signal=labels[s.observedSignal]??'Flow unavailable';
  return <section className="td-body" aria-label="Compare cohort buying and selling"><div className="td-section-heading"><h4>{signal}</h4><span>{s.cohort==='kol'?'KOL':'Smart traders'} · {text(s.bucketFrame)} buckets</span></div>
    <Facts items={[["Net observed flow",<span className={tone(s.netFlowUsd)}>{usd(s.netFlowUsd)}</span>],["Wallets sampled",count(s.observedUniqueWallets)]]}/><FlowSplit buy={s.buyUsd} sell={s.sellUsd}/>
    <p className="sv-note">{date(s.from)} — {date(s.to)} · Returned buckets only{s.timelineHasMore===true?' · More history available':''}</p>
    <Timeline data={buckets}/>
    {!!walletRows.length&&<details className="td-disclosure"><summary>Inspect sampled wallet activity · {walletRows.length} observations</summary><div className="td-wallet-activity">{walletRows.slice(0,shown).map((r,i)=><div key={`${r.wallet}-${r.time}-${i}`}><Address value={r.wallet}/><span>{date(r.time)}</span><span>Buy {usd(r.buyUsd)}</span><span>Sell {usd(r.sellUsd)}</span></div>)}</div><More total={walletRows.length} shown={shown} onClick={()=>setShown(n=>n+10)}/></details>}
  </section>;
}

function Evidence({report}: {report:Data}) {
  return <details className="td-disclosure td-evidence"><summary>All data & methodology</summary>
    {(report.tables??[]).map((table:Data,i:number)=><section key={i}><h4>{table.title}</h4>{table.rows?.length?<div className="table-wrap" role="region" tabIndex={0} aria-label={table.title}><table><thead><tr>{table.columns.map((c:Data)=><th scope="col" key={c.key}>{c.label}</th>)}</tr></thead><tbody>{table.rows.map((r:Data,index:number)=><tr key={index}>{table.columns.map((c:Data)=><td key={c.key} title={text(r[c.key])}>{c.key==='wallet'?<Address value={r[c.key]}/>:c.key==='address'&&report.skill!=='skill-lp-analysis'&&r[c.key]?<AddressText text={r[c.key]} compact kind="token" chain="solana"/>:text(r[c.key])}</td>)}</tr>)}</tbody></table></div>:<Empty/>}</section>)}
    <details className="td-disclosure"><summary>Source coverage and pagination</summary><pre>{JSON.stringify({summary:report.summary,pagination:report.pagination,sourceIds:report.sourceIds,tables:report.tables},null,2)}</pre></details>
  </details>;
}

export function TokenDataReport({report}: {report:Data}) {
  const skill=report.skill,s=report.summary??{},missing:string[]=report.missing??[],pages:Data[]=report.pagination??[];
  const [smartView,setSmartView]=useState("holders");
  return <section className="skill-visuals token-data-report" aria-label="Skill findings">
    <header className="sv-report-header"><h3>{titles[skill]??'Research snapshot'}</h3><span>{report.sourceIds?.length??0} {report.sourceIds?.length===1?"source":"sources"}{missing.length?' · Partial evidence':''}</span></header>
    {missing.length>0&&<details className="td-disclosure td-coverage"><summary>Incomplete evidence · {missing.length} {missing.length===1?'gap':'gaps'}</summary><ul>{missing.map((reason,i)=><li key={i}>{reason}</li>)}</ul></details>}
    {skill==='skill-launchpad-trending'&&<Launchpad report={report}/>}
    {skill==='skill-token-security'&&<Security report={report}/>}
    {skill==='skill-token-stats'&&<Stats report={report}/>}
    {skill==='skill-top-holder-analysis'&&<HolderList report={report}/>}
    {skill==='skill-top-trader-analysis'&&<Traders report={report}/>}
    {skill==='skill-lp-analysis'&&<Pools report={report}/>}
    {skill==='skill-smart-money-holders'&&<><div className="sv-segmented" role="group" aria-label="Smart Money view">{[['holders','Current holders'],['activity','Buying & selling']].map(([key,label])=><button type="button" key={key} aria-pressed={smartView===key} onClick={()=>setSmartView(key)}>{label}</button>)}</div>{smartView==='holders'&&<HolderList report={report} smart/>}{smartView==='activity'&&s.observedSignal===undefined&&<Empty>Activity not fetched. Use full depth to include buying and selling.</Empty>}</>}
    {(skill==='skill-kol-signal'||(skill==='skill-smart-money-holders'&&smartView==='activity'&&s.observedSignal!==undefined))&&<CohortFlow report={report}/>}
    {pages.some(p=>p.hasMore===true)&&!missing.length&&<p className="sv-note">More data exists beyond the fetched page.</p>}
    <Evidence report={report}/>
  </section>;
}
