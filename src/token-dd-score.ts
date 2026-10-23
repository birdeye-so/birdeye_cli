import type { Result } from "./runner.js";
import type { CaseInput } from "./workflows.js";
import type { Data } from "./shared.js";

type N = number | null;
type Signal = {score:N; weight:number; input:unknown; rule:string};
export const DD_VERSION = "token-dd-reconstructed-v1";
export const ddNumber = (v: unknown): N => {
  if (typeof v !== "number" && !(typeof v === "string" && v.trim())) return null;
  const n = Number(v); return Number.isFinite(n) ? n : null;
};
const num = ddNumber;
const nonnegative = (v:unknown):N => {const n=num(v); return n!==null&&n>=0?n:null;};
const percent = (v:unknown):N => {const n=nonnegative(v);return n!==null&&n<=100?n:null;};
const fractionPct = (v:unknown):N => {const n=nonnegative(v);return n!==null&&n<=1?n*100:null;};
const clamp = (n:number) => Math.max(0,Math.min(1,n));
export const smooth = (v:N,lo:number,hi:number):N => {if(v===null)return null;const t=clamp((v-lo)/(hi-lo));return t*t*(3-2*t);};
const log = (v:N,lo:number,hi:number):N => v===null?null:smooth(Math.log10(Math.max(v,Number.MIN_VALUE)),Math.log10(lo),Math.log10(hi));
const scale = (n:N):N => n===null?null:n*100;
const inverse = (n:N):N => n===null?null:100*(1-n);
const divide = (a:N,b:N):N => a===null||b===null||b<=0?null:a/b;
const mean = (pairs:[N,number][]):N => {
  const a=pairs.filter((p):p is [number,number]=>p[0]!==null&&Number.isFinite(p[0]));
  const w=a.reduce((s,p)=>s+p[1],0);return w?a.reduce((s,p)=>s+p[0]*p[1],0)/w:null;
};
const blend = (...values:N[]) => mean(values.map(v=>[v,1]));
const signal = (weight:number,score:N,input:unknown,rule:string):Signal => ({weight,score,input,rule});
function pillar(signals:Record<string,Signal>) {
  const all=Object.values(signals), available=all.filter(s=>s.score!==null);
  return {score:mean(all.map(s=>[s.score,s.weight])),coverage:available.reduce((s,v)=>s+v.weight,0)/all.reduce((s,v)=>s+v.weight,0),signals};
}
const list = (v:unknown):Data[] => Array.isArray(v)?v.filter(r=>r&&typeof r==="object"&&!Array.isArray(r)):[];
const rows = (v:Data) => list(Array.isArray(v)?v:v?.items??v?.holders);
const authority = (d:Data,key:string):boolean|null => !Object.hasOwn(d,key)?null:d[key]===null?false:typeof d[key]==="string"&&d[key].length>0?true:null;
const bool = (v:unknown):boolean|null => typeof v==="boolean"?v:null;
const boolScore = (v:boolean|null):N => v===null?null:v?100:0;

export function liquidityStats(values:number[]) {
  if(!values.length)return null;
  const first=values[0],current=values.at(-1)!,min=Math.min(...values),max=Math.max(...values),sorted=[...values].sort((a,b)=>a-b);
  const avg=values.reduce((a,b)=>a+b,0)/values.length,std=Math.sqrt(values.reduce((a,b)=>a+(b-avg)**2,0)/values.length);
  return {current,first,min,max,median:(sorted[Math.floor((values.length-1)/2)]+sorted[Math.ceil((values.length-1)/2)])/2,mean:avg,std,
    std_pct_of_mean:scale(divide(std,avg)),drawdown_pct:scale(divide(max-min,max)),drawdown_from_peak_pct:scale(divide(max-current,max)),trend_pct:scale(divide(current-first,first)),candles:values.length};
}
export function drawdownGate(liquidity:N,exit:N) {
  const lp=.10*(smooth(liquidity,20,70)??0),ep=.15*(smooth(exit,20,70)??0);
  return {gate:1-Math.max(lp,ep),liquidity_drawdown_pct:liquidity,exit_drawdown_pct:exit,liquidity_penalty:lp,exit_penalty:ep,
    binding:lp===0&&ep===0?"none":ep>=lp?"exit_drawdown":"liquidity_drawdown",holder_change_penalty:null};
}

/** Pure deterministic scorer. Only matching successful source evidence is consumed. */
export function tokenDdScore(input:CaseInput,sources:Result[]) {
  const advanced=input.ddMode==="advanced";
  const matching=sources.filter(s=>s.meta.chain==="solana"&&(s.meta.params?.address??s.meta.params?.token_address)===input.address&&!s.meta.isError);
  const source=(op:string)=>matching.find(s=>s.meta.operation===op);
  const overview=source("token.overview")?.data??{},security=source("token.security")?.data??{};
  const dist=advanced?source("token.holder-distribution"):undefined;
  const profile=advanced?source("token.holder-profile"):undefined;
  const ohlc=advanced?source("token.liquidity-ohlc"):undefined;
  const caveats=["Reconstructed formula v1; research risk labels, not trading instructions.","Different modes and coverage are not comparable.","Overview and security are retrieval-time snapshots. A historical OHLC anchor does not turn this into a historical backtest.","LST and canonical-mint lists were not supplied; not_lst and not_fake remain N/A."];
  const mint=authority(security,"ownerAddress"),freeze=authority(security,"freezeAuthority"),mutable=bool(security.mutableMetadata),creator=fractionPct(security.creatorPercentage);
  const power=mint===null||freeze===null||mutable===null?null:.6+.4*(Number(mint)+Number(freeze)+Number(mutable))/3;
  const hold=smooth(creator,5,30);
  const hardBlock=security.isHoneypot===true;
  const sec=pillar({
    mint_authority:signal(.20,mint===null?null:mint?0:100,security.ownerAddress??null,"Explicit null authority = renounced; absent = unknown"),
    freeze_authority:signal(.18,freeze===null?null:freeze?0:100,security.freezeAuthority??null,"Explicit null = 100, live = 0"),
    metadata:signal(.08,mutable===null?null:mutable?40:100,mutable,"Immutable 100; mutable 40"),
    lp_lock:signal(.14,boolScore(bool(security.lpLocked)),security.lpLocked??null,"Explicit locked true = 100, false = 0"),
    creator_dump:signal(.20,hold===null||power===null?null:100*(1-hold*power),{creator_pct:creator,hold,power},"100 × (1 − smooth(holding%,5,30) × authority power)"),
    not_freezable:signal(.05,mint===null||freeze===null?null:!mint&&!freeze?100:0,{mint,freeze},"Mint and freeze both renounced"),
    not_lst:signal(.03,null,null,"No canonical LST list supplied"),not_fake:signal(.02,null,null,"No canonical mint mapping supplied"),
  });
  if(hardBlock)sec.score=0;
  const distValid=dist?.meta.params.mode==="top"&&dist.meta.params.address_type==="wallet"&&dist.meta.params.offset===0&&dist.meta.params.include_list===true;
  const supplied=distValid?rows(dist!.data):[];
  const pcts=supplied.map(r=>percent(r.percent_of_supply));
  const ids=supplied.map(r=>r.address??r.wallet).filter((v):v is string=>typeof v==="string");
  const completeRows=pcts.every(p=>p!==null)&&new Set(ids).size===ids.length&&(pcts as number[]).reduce((a,b)=>a+b,0)<=100.000001;
  const sorted=completeRows?(pcts as number[]).sort((a,b)=>b-a).slice(0,input.topN):[];
  const top=(n:number):N=>sorted.length>=n?sorted.slice(0,n).reduce((a,b)=>a+b,0):null;
  const top1=advanced?top(1):null,top3=advanced?top(3):null,top5=advanced?top(5):null,top10=advanced?top(10):fractionPct(security.top10HolderPercent);
  if(advanced&&sorted.length<input.topN)caveats.push(`Only ${sorted.length} valid holder rows available for topN=${input.topN}; re-score cannot fetch a wider list.`);
  const tags=list(profile?.data?.tags);
  const cohort=(tag:string)=>tags.find(t=>t.tag===tag);
  const cp=(tag:string)=>percent(cohort(tag)?.percent_of_supply),cc=(tag:string)=>nonnegative(cohort(tag)?.holder_count);
  const riskShares=[cp("dev"),cp("sniper"),cp("bundler")];
  const risk=riskShares.every(v=>v!==null)?(riskShares as number[]).reduce((a,b)=>a+b,0):null;
  if(profile)caveats.push("Cohort risk sums dev/sniper/bundler labels as a heuristic; overlapping labels are not unique supply. Holder-profile buy/sell volume covers 1h.");
  const holders=pillar({
    conc_top1:signal(.23,inverse(smooth(top1,10,95)),top1,"Inverse smooth 10–95%"),
    conc_top3:signal(.15,inverse(smooth(top3,20,98)),top3,"Inverse smooth 20–98%"),
    conc_top10:signal(.17,inverse(smooth(top10,20,100)),top10,"Inverse smooth 20–100%"),
    holder_base:signal(.20,scale(log(nonnegative(overview.holder),10**1.7,10**3.7)),overview.holder??null,"Log10 holder count 1.7–3.7"),
    cohort_risk:signal(.10,inverse(smooth(risk,5,35)),risk,"Inverse smooth dev+sniper+bundler 5–35%"),
    sniper_density:signal(.15,inverse(smooth(cc("sniper"),5,20)),cc("sniper"),"Inverse smooth 5–20 wallets"),
  });
  const frames=["1m","5m","15m","30m","1h","2h","4h","24h"];
  const get=(key:string)=>num(overview[key]);
  const vol=(frame:string)=>nonnegative(overview[`v${frame}USD`]);
  const pc=(frame:string)=>get(`priceChange${frame}Percent`);
  const flowRows=advanced?rows(source("token.money-flow")?.data??{}):[];
  const overviewFlow=list(overview.moneyFlow);
  const net=(r:Data|undefined):N=>{
    if(!r)return null;
    const direct=num(r.netUsd??r.net_usd);if(direct!==null)return direct;
    const buy=nonnegative(r.total_value_buy??r.totalValueBuy??r.volumeBuyUsd),sell=nonnegative(r.total_value_sell??r.totalValueSell??r.volumeSellUsd);
    return buy!==null&&sell!==null?buy-sell:null;
  };
  const general=overviewFlow.find(r=>r.frame==="24h"&&(r.tag===undefined||r.tag==="all"));
  const buy24=nonnegative(overview.vBuy24hUSD),sell24=nonnegative(overview.vSell24hUSD);
  const net24=net(general)??(buy24!==null&&sell24!==null?buy24-sell24:null);
  const volume=vol("24h"),liq=nonnegative(overview.liquidity),mcap=nonnegative(overview.marketCap);
  const engagementInputs={trades:nonnegative(overview.trade24h),turnover_liquidity:divide(volume,liq),turnover_mcap:divide(volume,mcap),wallets:nonnegative(overview.uniqueWallet24h)};
  const engagement=scale(blend(log(engagementInputs.trades,20,15000),smooth(engagementInputs.turnover_liquidity,.01,3),smooth(engagementInputs.turnover_mcap,.00751,1.6202),smooth(engagementInputs.wallets,3,353)));
  const flowFrames:[string,number][]=[["5m",.15],["1h",.25],["4h",.25],["24h",.35]];
  const buyFrames=flowFrames.map(([frame,w])=>{
    const b=nonnegative(overview[`vBuy${frame}USD`]),s=nonnegative(overview[`vSell${frame}USD`]);
    const ratio=b===null||s===null?null:divide(b,b+s);
    return {frame,weight:w,ratio,score:ratio===null?null:100*clamp((ratio-.43)/.24)};
  });
  const pressure=mean(buyFrames.map(f=>[f.score,f.weight])),tilt=scale(smooth(divide(net24,volume),-.10,.15));
  const buyPressure=pressure===null?null:tilt===null?pressure:.9*pressure+.1*tilt;
  const momentumFrames=([["15m",.1],["1h",.2],["4h",.3],["24h",.4]] as [string,number][]).map(([frame,w])=>{
    const values=[pc(frame),get(`v${frame}ChangePercent`),get(`uniqueWallet${frame}ChangePercent`),get(`liquidity${frame}ChangePercent`)];
    const scales=[35,90,60,40],weights=[.30,.35,.25,.10];
    return {frame,weight:w,inputs:values,tone:mean(values.map((v,i)=>[v===null?null:Math.tanh(v/scales[i]),weights[i]]))};
  });
  const momentum=mean(momentumFrames.map(f=>[f.tone,f.weight]));
  const drawdowns=([["24h","1h"],["24h","4h"],["4h","1h"]]).map(([l,s])=>pc(l)===null||pc(s)===null?null:smooth(Math.max(0,pc(l)!-pc(s)!),12,65));
  drawdowns.push(pc("1h")===null?null:smooth(-pc("1h")!,15,60));
  const validDrawdowns=drawdowns.filter((v):v is number=>v!==null);
  const activity=pillar({engagement:signal(.40,engagement,engagementInputs,"Mean available smooth ramps"),
    buy_pressure:signal(.10,buyPressure,{frames:buyFrames,net24,tilt},"Weighted linear buy pressure + optional 10% money-flow tilt"),
    momentum:signal(.30,momentum===null?null:50+50*momentum,momentumFrames,"Weighted tanh changes; re-normalize missing inputs"),
    drawdown:signal(.20,validDrawdowns.length?100*(1-Math.max(...validDrawdowns)):null,{nested_risks:drawdowns},"Worst nested give-back or 1h sell-off")});
  const resolution=ohlc?.meta.params.resolution??input.liqResolution;
  const seconds:Record<string,number>={"1m":60,"5m":300,"15m":900,"30m":1800,"1h":3600,"4h":14400,"1D":86400};
  const candleMap=new Map<number,Data>();
  for(const c of rows(ohlc?.data??{})) {const t=nonnegative(c.unix_time);if(t!==null&&t<=(ohlc?.meta.params.time??input.to??Infinity))candleMap.set(t,c);}
  const candles=[...candleMap.entries()].sort((a,b)=>a[0]-b[0]).slice(-input.liqCandles);
  const series=(key:string)=>liquidityStats(candles.map(([,c])=>nonnegative(c[key])).filter((v):v is number=>v!==null));
  const ls=series("close_liquidity_usd"),es=series("close_exit_liquidity_usd");
  const nowLiq=ls?.current??liq,exit=es?.current??null;
  const exitFloor=es?scale(divide(es.min,es.max)):null;
  const stability=mean([[ls&&ls.candles>=8?inverse(smooth(ls.drawdown_pct,10,60)):null,.35],[es&&es.candles>=8?inverse(smooth(es.drawdown_pct,10,60)):null,.40],[es&&es.candles>=8?scale(smooth(exitFloor,20,90)):null,.25]]);
  const pairs=candles.map(([,c])=>nonnegative(c.total_pairs)).filter((v):v is number=>v!==null);
  const liquidity=pillar({
    depth:signal(.30,mean([[scale(log(nowLiq,1500,800000)),.45],[scale(log(exit,1000,400000)),.55]]),{liquidity:nowLiq,exit},"Weighted log ramps; missing series excluded"),
    stability:signal(.25,stability,{liquidity_drawdown:ls?.drawdown_pct??null,exit_drawdown:es?.drawdown_pct??null,exit_floor:exitFloor},"At least 8 samples per series; exit floor = min / max × 100 (reconstruction assumption)"),
    valuation:signal(.20,mean([[inverse(log(divide(mcap,nowLiq),20,500)),.45],[inverse(log(divide(mcap,exit),40,1000)),.55]]),{mcap,liquidity:nowLiq,exit},"Inverse log market-cap/depth ratios"),
    trend:signal(.15,ls&&ls.candles>=2&&ls.trend_pct!==null?100*(.5+.5*Math.tanh(ls.trend_pct/30)):null,ls?.trend_pct??null,"50 + 50 tanh(relative change / .30)"),
    pairs:signal(.10,pairs.length?scale(smooth(Math.max(...pairs),1,5)):null,pairs.length?Math.max(...pairs):null,"Smooth maximum pair count 1–5"),
  });
  const gate=drawdownGate(ls&&ls.candles>=2?ls.drawdown_from_peak_pct:null,es&&es.candles>=2?es.drawdown_from_peak_pct:null);
  const tagged=(tag:string,frame:string)=>flowRows.find(r=>r.tag===tag&&r.frame===frame)??overviewFlow.find(r=>r.tag===tag&&r.frame===frame);
  const flowEvidence:Data={};
  const cohortFlow=(tag:string,lo:number,hi:number):N=>{
    if(!advanced)return null;
    const observed=flowFrames.map(([frame,w])=>({frame,weight:w,net:net(tagged(tag,frame)),pct:divide(net(tagged(tag,frame)),vol(frame))}));
    const usable=observed.filter(r=>r.pct!==null);
    const avg=mean(usable.map(r=>[scale(smooth(r.pct,lo,hi)),r.weight]));
    if(avg===null){flowEvidence[tag]={frames:observed,score:null};return null;}
    const agree=usable.filter(r=>Math.sign(r.net!)===Math.sign(avg-50)).reduce((s,r)=>s+r.weight,0)/usable.reduce((s,r)=>s+r.weight,0);
    const score=50+(avg-50)*(.75+.25*agree);flowEvidence[tag]={frames:observed,mean:avg,agreement:agree,score};return score;
  };
  const smart=cohort("smart_trader");
  const tx=tagged("smart_money","24h");
  const ratio=(b:unknown,s:unknown):N=>{const bn=nonnegative(b),sn=nonnegative(s);return bn===null||sn===null?null:divide(bn,bn+sn);};
  const buyRatio=advanced?ratio(tx?.total_tx_buy??tx?.totalTxBuy,tx?.total_tx_sell??tx?.totalTxSell):null;
  const holdRatio=ratio(smart?.buy_volume_usd,smart?.sell_volume_usd);
  const flow=cohortFlow("smart_money",-.05,.12),whaleFlow=cohortFlow("whales",-.08,.08),kolFlow=cohortFlow("kol",-.05,.06);
  const smartMoney=pillar({
    sm_presence:signal(.25,blend(scale(smooth(cc("smart_trader"),0,25)),scale(smooth(cp("smart_trader"),0,8))),smart??null,"Equal mean count 0–25 and share 0–8%"),
    sm_flow:signal(.30,mean([[flow,.55],[buyRatio===null?null:100*clamp((buyRatio-.4)/.35),.45]]),{flow,buyRatio},"55% multi-frame flow + 45% 24h buy transaction ratio"),
    sm_quality:signal(.20,mean([[scale(smooth(cp("smart_trader"),0,10)),.55],[holdRatio===null?null:100*clamp((holdRatio-.45)/.30),.45]]),{share:cp("smart_trader"),holdRatio},"Supply share and cohort buy/sell volume ratio"),
    whale:signal(.15,blend(scale(smooth(cc("whales"),0,20)),scale(smooth(cp("whales"),0,12)),whaleFlow),flowEvidence.whales??null,"Mean available whale count, share, flow"),
    kol:signal(.10,blend(scale(smooth(cc("kol"),0,40)),scale(smooth(cp("kol"),0,8)),kolFlow),flowEvidence.kol??null,"Mean available KOL count, share, flow"),
  });
  const pillars={security:sec,holders,activity,liquidity,smart_money:smartMoney};
  const declared:Record<string,number>={security:.17,holders:.28,activity:.20,liquidity:.25,smart_money:.10};
  const included=Object.entries(pillars).filter(([k,p])=>p.score!==null&&(advanced||k!=="smart_money"));
  const total=included.reduce((s,[k])=>s+declared[k],0);
  const weights=Object.fromEntries(included.map(([k])=>[k,declared[k]/total]));
  const points=Object.fromEntries(included.map(([k,p])=>[k,weights[k]*p.score!]));
  const base=included.length?Object.values(points).reduce((a,b)=>a+b,0):null;
  const final=hardBlock?0:base===null?null:base*gate.gate;
  const bands:[number,string,string][]=[[95,"A+","HOT"],[85,"A","STRONG"],[80,"B+","OK"],[70,"B","FAIR"],[65,"C+","WATCH"],[55,"C","CAUTION"],[40,"D","RISKY"],[20,"E","HIGH RISK"],[0,"F","CRITICAL"]];
  const band=final===null?null:bands.find(([min])=>final>=min)!;
  const missing=Object.entries(pillars).flatMap(([k,p])=>Object.entries(p.signals).filter(([,s])=>s.score===null).map(([name])=>`${k}.${name}: N/A`));
  const usedFrames=frames.filter(f=>[vol(f),pc(f),get(`uniqueWallet${f}`),get(`buy${f}`),get(`sell${f}`)].some(v=>v!==null));
  if(!usedFrames.length)missing.push("pipeline_gap: token_overview returned no usable frame data");
  if(!advanced)caveats.push("coverage_caveat: standard omits smart money, distribution, cohorts and liquidity candles; gate is neutral.");
  return {kind:"token-dd-score",formulaVersion:DD_VERSION,address:input.address,mode:input.ddMode,
    score:{final,base,rating:band?.[1]??null,verdict:band?.[2]??"UNAVAILABLE",weights_used:weights,pillar_points:points},pillars,gate_detail:gate,hard_blocks:hardBlock?["isHoneypot"]:[],
    holder_concentration:{top1,top3,top5,top10,rows:sorted.length},holder_cohorts:tags,top_holders:advanced?rows(source("token.holders")?.data??{}):[],flow_evidence:flowEvidence,
    liquidity_stats:{window:{resolution,candles:candles.length,span_hours:candles.length?(candles.at(-1)![0]-candles[0][0]+seconds[resolution])/3600:0,source:ohlc?.meta.requestId??null},liquidity:ls,exit_liquidity:es},
    meta:{frames_used:usedFrames,settings:{topN:input.topN,liqCandles:input.liqCandles,liqResolution:input.liqResolution},weights_declared:declared,weights_shift:{security:-.06,holders:.03,liquidity:.03},coverage_caveat:missing.length>0,chain:"solana"},
    sourceIds:matching.map(s=>s.meta.requestId),missing,caveats,basis:"Supplied DD specification reconstructed in Node.js; default preset only. See skills/token-duediligence/doc.md for assumptions."};
}
