import type { Result } from "./runner.js";
import {securityControls} from "./security-controls.js";
import type { CaseInput } from "./workflows.js";
import { tokenDdScore } from "./token-dd-score.js";
import {tokenDataAnalysis} from "./token-data-metrics.js";
import { decimal, type Data } from "./shared.js";

const number = (v: unknown): number | null => { const d = decimal(v); const n = d?.toNumber(); return n !== undefined && Number.isFinite(n) ? n : null; };
const clamp = (n: number, max = 100) => Math.max(0, Math.min(max, n));
const round = (n: number) => Math.round(n * 100) / 100;
const avg = (a: number[]) => a.reduce((s,v) => s+v, 0) / a.length;
const rows = (s?: Result): Data[] => Array.isArray(s?.data) ? s.data : s?.data?.tokens ?? s?.data?.items ?? s?.data?.history ?? [];
const compatible = (a: Result, b: Result) => a.meta.params.wallet === b.meta.params.wallet && a.meta.params.pnl_method === b.meta.params.pnl_method && a.meta.params.position_scope === b.meta.params.position_scope;

export function analyzeCandles(source: Result) {
  const p = source.meta.params;
  const seconds: Record<string, number> = {"1m":60,"5m":300,"15m":900,"30m":1800,"1H":3600,"4H":14400,"1D":86400};
  const size = seconds[p.type];
  const unavailable = (reason: string) => ({kind: "kline", score: null, pattern: null, missing: [reason], sourceIds: [source.meta.requestId]});
  if (!size) return unavailable("This pattern calculation supports 1m, 5m, 15m, 30m, 1H, 4H and 1D candles.");
  const map = new Map<number, {t:number; c:number; h:number; l:number; v:number}>();
  let invalid = 0;
  for (const r of rows(source)) {
    const t = number(r.unix_time ?? r.t), c = number(r.c), h = number(r.h), l = number(r.l), v = number(r.v);
    if (t === null || c === null || h === null || l === null || v === null || c <= 0 || l <= 0 || h < Math.max(l,c) || c < l || v < 0) {invalid++; continue;}
    if (t >= p.time_from && t + size <= Math.min(p.time_to, Date.now()/1000)) map.set(t, {t,c,h,l,v});
  }
  const candles = [...map.values()].sort((a,b) => a.t-b.t), n = candles.length;
  if (n < 8) return unavailable(`Need at least 8 valid closed candles; got ${n}.`);
  const closes = candles.map(c => c.c), highs = candles.map(c=>c.h), lows = candles.map(c=>c.l);
  const ratio = avg(closes.slice(-9)) / avg(closes.slice(-21));
  const trend = n < 9 ? "flat" : ratio > 1.003 ? "up" : ratio < .997 ? "down" : "flat";
  const slope = n >= 24 ? avg(closes.slice(-5))/avg(closes.slice(-24,-19))-1 : closes[n-1]/closes[0]-1;
  const volatility = avg(candles.slice(-14).map(c=>(c.h-c.l)/c.c));
  const resistance = Math.max(...highs), support = Math.min(...lows);
  const drawdown = (resistance-closes[n-1])/resistance, recovery = (closes[n-1]-support)/support;
  const volumeBase = n >= 22 ? avg(candles.slice(-21,-1).map(c=>c.v)) : 0;
  const vr = volumeBase > 0 ? candles[n-1].v/volumeBase : null;
  let pattern = "sideways_consolidation", delta = 0;
  if (slope>.30 && trend==="up") {pattern="vertical_run_up"; delta=25-(drawdown>.20?10:0);}
  else if (trend==="up" && slope>=.005 && slope<=.30 && drawdown<.25) {pattern="uptrend_channel"; delta=20+((vr??0)>1.2?5:0);}
  else if (trend==="down" && slope<-.10 && drawdown>.20) {pattern="breakdown";delta=-25;}
  else if (drawdown>.25 && recovery>.15 && trend!=="down") {pattern="bounce_off_lows";delta=15+((vr??0)>1.3?5:0);}
  else if (recovery>.5 && drawdown<.15 && trend!=="up" && (vr??0)>1.5) {pattern="distribution_at_highs";delta=-20;}
  else if (trend==="down" && slope>=-.30 && slope<-.005) {pattern="slow_bleed";delta=-15;}
  else if (drawdown>.4 && recovery<.10 && trend==="flat") {pattern="basing_at_lows";delta=10;}
  else if (volatility>.12 && trend==="flat") {pattern="wide_chop";delta=-5;}
  else if (trend==="up" && slope>=0 && slope<=.01 && volatility<.05) {pattern="bullish_consolidation";delta=12;}
  else if (trend==="down" && slope>=-.01 && slope<=0 && volatility<.05) {pattern="bearish_consolidation";delta=-12;}
  const adjustments = [{reason: pattern, delta}];
  for (const [hit, reason, delta] of [[drawdown>.5,"drawdown > 50%",-10],[recovery>1,"recovery from low > 100%",-5],[volatility>.2,"volatility > 20%",-5],[vr!==null&&vr<.5,"volume ratio < 0.5",-5]] as const) if (hit) adjustments.push({reason,delta});
  return {kind:"kline", formulaVersion:"reference-kline-closed-v1", pattern, score:clamp(50+adjustments.reduce((s,a)=>s+a.delta,0)),
    trend, slope, volatility, drawdown, volumeRatio:vr, recoveryFromLow:recovery, observedSupport:support, observedResistance:resistance,
    closedCandles:n, invalidCandles:invalid, gapCount:candles.slice(1).filter((c,i)=>c.t-candles[i].t!==size).length,
    adjustments, missing:[], sourceIds:[source.meta.requestId], basis:"Reference source first-match rules; valid closed candles only. Support/resistance are observed extrema, not forecasts. Missing volume baseline receives no volume adjustment."};
}

function summaryValues(s?: Result) {
  const d=s?.data?.summary??{}, p=d.pnl??{}, c=d.counts??{}, f=d.cashflow_usd??{};
  const win=number(c.total_win), loss=number(c.total_loss);
  return {r:number(p.realized_profit_usd),u:number(p.unrealized_usd),invested:number(f.total_invested),sold:number(f.total_sold),trades:number(c.total_trade),unique:number(d.unique_tokens),wr:win!==null&&loss!==null&&win+loss>0?win/(win+loss):null};
}
export function walletAlpha(summary: Result | undefined, history: Result | undefined, detail: Result | undefined) {
  const missing: string[]=[];
  const a=summaryValues(summary), h=summaryValues(history), positions=rows(detail);
  if (!summary || !history || !detail) missing.push("Need 30d summary, 90d summary and 30d per-token positions.");
  if (summary && history && detail && (!compatible(summary,history)||!compatible(summary,detail)||summary.meta.params.duration!=="30d"||history.meta.params.duration!=="90d"||detail.meta.params.duration!=="30d"||summary.meta.params.position_scope!=="duration_only")) missing.push("Alpha requires matching wallet, method and duration-only 30d/90d scopes.");
  if (Object.values(a).some(v=>v===null)||h.r===null||!positions.length||!(a.invested!>0)||a.trades!<0) missing.push("PnL summary or position inputs are missing; unknown values are not zero-filled.");
  const usable=positions.every(p=>[p.pnl?.realized_profit_usd,p.pnl?.unrealized_usd,p.pnl?.total_percent,p.counts?.total_buy,p.counts?.total_sell,p.cashflow_usd?.total_invested].every(v=>number(v)!==null));
  if (!usable) missing.push("Position-level PnL, buy/sell counts and invested values are required.");
  const sourceIds=[summary,history,detail].filter(Boolean).map(s=>s!.meta.requestId);
  if (missing.length) return {kind:"wallet-alpha",alphaScore:null,missing,sourceIds};
  const r=a.r!,u=a.u!,invested=a.invested!,trades=a.trades!,wr=a.wr!,r90=h.r!;
  const positive=positions.map(p=>Math.max(0,number(p.pnl.realized_profit_usd)!));
  const positiveTotal=positive.reduce((s,v)=>s+v,0), concentration=positiveTotal>0?Math.max(...positive)/positiveTotal:1;
  const closed=positions.filter(p=>number(p.counts.total_buy)!>0&&number(p.counts.total_sell)!>0).length;
  const profitable=positions.filter(p=>number(p.pnl.realized_profit_usd)!>0).length;
  const diversification=100*(1-concentration);
  const profitability=clamp(Math.max(clamp((Math.min(r,r+u)/Math.max(invested,1)+.05)/.35*100),r>0?clamp(Math.log10(Math.max(r,1)/100)*20):0)*(u<0&&r>0?Math.max(0,1-Math.abs(u)/r):1));
  const prev=r90-r;
  let trend=50;
  if (Math.abs(r)>100||Math.abs(prev)>100) {
    if(r>0&&prev>0) {const ratio=(r/30)/(prev/60);trend=70+30*Math.min(ratio,1/ratio);}
    else if(r>0&&Math.abs(prev)<=100) trend=85;
    else if(r>0) trend=35;
    else trend=prev>0?15:0;
  }
  const confidence=clamp(Math.log1p(trades)/Math.log1p(300)*100);
  const distribution=closed?clamp(.6*clamp(profitable/closed/.6*100)+.4*diversification):0;
  const consistency=.2*clamp(wr/.6*100)+.4*trend+.25*distribution+.15*confidence;
  let weighted=0,weight=0;
  for(const p of positions) {const pr=number(p.pnl.realized_profit_usd)!,pu=number(p.pnl.unrealized_usd)!,pct=number(p.pnl.total_percent)!;
    const w=Math.max(number(p.cashflow_usd.total_invested)!,1e-9);const score=pr>0?(pu<0?clamp(pr/Math.abs(pu)*100):100):clamp(50*(1-Math.abs(Math.min(pct,0))),50);weighted+=score*w;weight+=w;}
  const realizedPositive=Math.max(r,0),unrealizedPositive=Math.max(u,0);
  const realization=realizedPositive+unrealizedPositive>0?100*realizedPositive/(realizedPositive+unrealizedPositive):0;
  const quality=.35*realization+.35*diversification+.3*weighted/weight;
  const activity=(.6*clamp(Math.log10(Math.max(invested,a.sold!,1)/1000)*20)+.4*confidence)*(trades>300?Math.max(Math.sqrt(300/trades),.7):1);
  let alpha=.35*profitability+.35*consistency+.2*quality+.1*activity;
  const gates:string[]=[];
  if(r<=0){alpha=Math.min(alpha,39);gates.push("30d realized <= 0: cap 39");}
  if(r90<=0){alpha=Math.min(alpha,49);gates.push("90d realized <= 0: cap 49");}
  if(r>0&&prev < -100){alpha=Math.min(alpha,69);gates.push("previous 60d loss: cap 69");}
  return {kind:"wallet-alpha",formulaVersion:"reference-alpha-v3.2-strict-v1",alphaScore:round(clamp(alpha)),components:{profitability:round(profitability),consistency:round(consistency),quality:round(quality),activity:round(activity)},weights:{profitability:.35,consistency:.35,quality:.2,activity:.1},gates,missing,sourceIds,positionsObserved:positions.length,basis:"Source v3.2 weights with strict required inputs and fixed 30d/90d scopes. Position metrics cover the fetched page; not a backtest or copy-trade ROI."};
}

export function walletStyle(summary: Result | undefined, detail: Result | undefined) {
  const v=summaryValues(summary), d=summary?.meta.params.duration, days=d==="7d"?7:d==="30d"?30:0;
  const positions=rows(detail), missing:string[]=[];
  if(!summary||!detail||!compatible(summary,detail)||summary.meta.params.duration!==detail.meta.params.duration||!days) missing.push("Need matching 7d or 30d summary and position scopes.");
  if(v.trades===null||v.r===null||v.invested===null||v.invested<=0||v.wr===null||!positions.length||positions.some(p=>number(p.pnl?.realized_profit_percent)===null)) missing.push("Trade counts, realized PnL, invested value, win/loss counts and position ratios are required.");
  if(missing.length) return {kind:"wallet-style",style:null,missing};
  const daily=v.trades!/days,roi=v.r!/v.invested!,lossShare=positions.filter(p=>number(p.pnl.realized_profit_percent)!<-.5).length/positions.length;
  const frequency=daily<1?"Rare":daily<10?"Regular":daily<=50?"Frequent":"Machine";
  const pnl=roi>.5&&positions.length>=5&&(v.wr!>=.5||lossShare<.15)?"Strong profit":roi>.1?"Net profit":lossShare>=.4&&v.r!<0?"Heavy loss":Math.abs(roi)<=.1?"Break-even":v.r!<0?"Net loss":"Break-even";
  return {kind:"wallet-style",formulaVersion:"reference-style-corrected-v1",style:`${frequency} · ${pnl}`,tradesPerDay:daily,realizedRoi:roi,winRateFromCounts:v.wr,lossShare,positionsObserved:positions.length,missing,sourceIds:[summary!.meta.requestId,detail!.meta.requestId],basis:"Reference frequency × PnL rules; corrected loss threshold to -50%, documented ratio units. Position loss share is page-scoped; no inferred hold time."};
}

export function rankWallets(items: Data[]): Data[] {
  const eligible=items.filter(r=>[r.pnl30,r.wr30,r.wr7,r.unique].every(v=>typeof v==="number"&&Number.isFinite(v)));
  const minmax=(v:number,values:number[])=>Math.max(...values)===Math.min(...values)?.5:(v-Math.min(...values))/(Math.max(...values)-Math.min(...values));
  const ranked=eligible.map((r): Data=>{
    const less=eligible.filter(p=>p.pnl30<r.pnl30).length,equal=eligible.filter(p=>p.pnl30===r.pnl30).length;
    const percentile=(less+(equal+1)/2)/eligible.length;
    const improvement=(x:Data)=>Math.max(-.5,Math.min(.5,x.wr7-x.wr30));
    return {...r,rankingScore:round(100*(.4*r.wr30+.4*percentile+.1*minmax(r.unique,eligible.map(p=>p.unique))+.1*minmax(improvement(r),eligible.map(improvement)))),pnlPercentile:percentile};
  }).sort((a,b)=>b.rankingScore-a.rankingScore||a.wallet.localeCompare(b.wallet));
  return [...ranked.map((r,i)=>({...r,rank:i+1})),...items.filter(r=>!eligible.includes(r)).map(r=>({...r,rank:null,rankingScore:null,missing:["Incomplete comparison inputs"]}))];
}

export function skillAnalysis(input: CaseInput, sources: Result[]) {
  const tokenData = tokenDataAnalysis(input, sources);
  if (tokenData) return tokenData;
  if(input.kind === "skill-token-dd-score") return {reference:"skills/token-duediligence/doc.md",formulaVersion:"token-dd-reconstructed-v1",findings:[tokenDdScore(input,sources)]};
  const find=(op:string,wallet?:string,duration?:string)=>sources.find(s=>s.meta.operation===op&&(!wallet||s.meta.params.wallet===wallet)&&(!duration||s.meta.params.duration===duration));
  const findings:Data[]=[];
  if(input.kind==="skill-smart-wallets") {
    const wallets=new Map<string,Data>();
    for(const source of sources.filter(s=>s.meta.operation==="token.top-traders")) for(const row of rows(source)) {
      const id=row.owner??row.wallet_address??row.wallet??row.account??row.address;
      if(typeof id!=="string" || !id) continue;
      if(!wallets.has(id)) wallets.set(id,{wallet:id,tokens:[],sourceIds:[]});
      const found=wallets.get(id)!;
      if(!found.tokens.includes(source.meta.params.address)) found.tokens.push(source.meta.params.address);
      if(!found.sourceIds.includes(source.meta.requestId)) found.sourceIds.push(source.meta.requestId);
    }
    findings.push({kind:"wallet-discovery",wallets:[...wallets.values()].slice(0,input.limit),observedWallets:wallets.size,missing:[],basis:"Deduplicated in provider order across fetched token-trader pages. Token-level PnL is not summed. Fast mode does not fetch wallet-wide PnL."});
  }
  if(["skill-kline-pattern","skill-contract-dd"].includes(input.kind)) {
    const candles=find("market.ohlcv");
    if(candles) findings.push(analyzeCandles(candles));
  }
  if(input.kind==="skill-wallet-score") findings.push(walletAlpha(find("portfolio.pnl-summary",input.address,"30d"),find("portfolio.pnl-summary",input.address,"90d"),find("portfolio.pnl-details",input.address)));
  if(input.kind==="skill-wallet-style") findings.push(walletStyle(find("portfolio.pnl-summary",input.address,input.duration),find("portfolio.pnl-details",input.address)));
  if(input.kind==="skill-smart-money-leaderboard") {
    const ranked=rankWallets(input.wallets!.map(wallet=>{
      const s7=find("portfolio.pnl-summary",wallet,"7d"),s30=find("portfolio.pnl-summary",wallet,"30d"),v7=summaryValues(s7),v30=summaryValues(s30);
      const matched=s7&&s30&&compatible(s7,s30)&&s30.meta.params.position_scope==="duration_only";
      return {wallet,pnl30:matched?v30.r:null,wr30:matched?v30.wr:null,wr7:matched?v7.wr:null,unique:matched?v30.unique:null,sourceIds:[s7,s30].filter(Boolean).map(s=>s!.meta.requestId)};
    }));
    findings.push({kind:"wallet-leaderboard",formulaVersion:"reference-ranking-corrected-v1",rows:ranked,missing:ranked.filter(r=>r.rank===null).map(r=>`Incomplete comparison: ${r.wallet}`),basis:"Higher PnL yields higher percentile; ties share average rank. Relative ranking among fully observed supplied wallets, not an absolute alpha score."});
  }
  if(["skill-token-dd","skill-contract-dd","skill-rugcheck-audit"].includes(input.kind)) {
    const sec=find("token.security"), controls=securityControls(sec);
    findings.push({kind:"security-evidence",compositeSafetyScore:null,freezeable:controls.freeze.value,mintable:controls.mint.value,mintBasis:controls.mint.basis,freezeBasis:controls.freeze.basis,top10AccountShare:sec?.data?.top10HolderPercent??null,sourceIds:sec?[sec.meta.requestId]:[],missing:[...(controls.mint.value===null?["Mint authority unavailable"]:[]),...(controls.freeze.value===null?["Freeze authority unavailable"]:[]),"Honeypot simulation and LP-lock verification are not provided by these steps."],basis:"Solana null authority means inactive; missing or malformed authority remains unknown. Explicit booleans take precedence. No reference Safe label or inferred rug verdict."});
  }
  const liq=find("token.liquidity-history");
  if(liq){const data=rows(liq).map(r=>({t:number(r.unix_time),v:decimal(r.liquidity_usd)})).filter(r=>r.t!==null&&r.v!==null).sort((a,b)=>a.t!-b.t!);const first=data[0]?.v,last=data.at(-1)?.v;
    findings.push({kind:"liquidity-change",liquidityChangePct:data.length>=2&&first?.gt(0)&&last?last.div(first).minus(1).times(100).toString():null,snapshots:data.length,sourceIds:[liq.meta.requestId],missing:data.length<2?["Need at least two liquidity snapshots"]:[],basis:"First-to-last fetched liquidity snapshots; value changes do not establish an LP withdrawal."});}
  return {reference:"https://github.com/TheNang2710/birdeye-data-skills",referenceCommit:"5dd7833a161e76ef2a3da74233af548a2eccb4d5",findings};
}
