import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Ledger } from "../src/ledger.js";
import { Runner, type Result } from "../src/runner.js";
import { planCase, workflowCatalog } from "../src/workflows.js";
import { runCase } from "../src/analysis.js";
import { skillKinds, skillInfo } from "../src/skill-recipes.js";
import { prepare } from "../src/catalog.js";
import { analyzeCandles, walletAlpha, walletStyle, rankWallets } from "../src/skill-metrics.js";
import { previewCase } from "../src/workflow-preview.js";
const token="So11111111111111111111111111111111111111112", wallet="11111111111111111111111111111112", second="11111111111111111111111111111113", at=1791504000;
const summary=(r=3000)=>({unique_tokens:10,pnl:{realized_profit_usd:r,unrealized_usd:0},cashflow_usd:{total_invested:10000,total_sold:13000},counts:{total_trade:100,total_win:7,total_loss:3}});
const positions=Array.from({length:10},(_,i)=>({address:token,pnl:{realized_profit_usd:300,unrealized_usd:0,total_percent:.3,realized_profit_percent:.3},counts:{total_buy:5,total_sell:5},cashflow_usd:{total_invested:1000}}));
const candles=Array.from({length:30},(_,i)=>({unix_time:at-(30-i)*3600,o:100+i,c:100+i,h:101+i,l:99+i,v:100}));
const contracts=JSON.parse(readFileSync("tests/fixtures/skill-request-contracts.json","utf8")).paths;
function assertContract(url:URL,init?:RequestInit){
  const contract=contracts[url.pathname]?.[init?.method||"GET"];
  assert.ok(contract,`No official request contract for ${url.pathname}`);
  const check=(values:Record<string,any>,rules:Record<string,any>,required:string[])=>{
    for(const name of required)assert.ok(Object.hasOwn(values,name),`Missing required ${name} at ${url.pathname}`);
    for(const [name,value] of Object.entries(values)){
      const rule=rules[name];assert.ok(rule,`Undocumented parameter ${name} at ${url.pathname}`);
      if(rule.enum)assert.ok(rule.enum.includes(value)||rule.enum.includes(value==="true"?true:value==="false"?false:value),`Invalid ${name} enum at ${url.pathname}`);
      if(rule.minimum!==undefined)assert.ok(Number(value)>=rule.minimum,`${name} below minimum`);
      if(rule.maximum!==undefined)assert.ok(Number(value)<=rule.maximum,`${name} above maximum`);
      if(rule.maxItems!==undefined)assert.ok(value.length<=rule.maxItems);
    }
  };
  check(Object.fromEntries(url.searchParams),contract.query,contract.requiredQuery);
  if(init?.method==="POST")check(JSON.parse(String(init.body)),contract.body,contract.requiredBody);
}
function result(operation:string,params:Record<string,unknown>,data:any):Result{return {schemaVersion:1,data,meta:{operation,params,chain:"solana",requestId:operation+JSON.stringify(params),retrievedAt:new Date(at*1000).toISOString(),coverage:"complete-for-requested-scope",warnings:[],cu:{}}};}
function fixture(url:URL,init?:RequestInit){
  assertContract(url,init);
  const path=url.pathname;
  if(path==="/defi/v3/token/money-flow")return Response.json([{token_address:token,frame:"24h",total_value_buy:2,total_value_sell:1}]);
  let data:any;
  // The reference client's _be() explicitly supports this unwrapped response.
  if(path==="/smart-money/v1/token/list")return Response.json([{token}]);
  else if(path.endsWith("token_overview"))data={address:token,liquidity:1000};
  else if(path.endsWith("token_security"))data={freezeable:false,mintable:false,top10HolderPercent:.1};
  else if(path.endsWith("pnl/summary"))data={summary:summary(url.searchParams.get("duration")==="90d"?9000:3000)};
  else if(path.endsWith("pnl/details")){assert.equal(init?.method,"POST");data={summary:summary(),tokens:positions};}
  else if(path.endsWith("tx/first-funded")){assert.equal(init?.method,"POST");assert.deepEqual(JSON.parse(String(init?.body)),{wallets:[wallet]});data={[wallet]:{block_unix_time:at-86400}};}
  else if(path.endsWith("current-net-worth"))data={items:[{address:token,value:100}]};
  else if(path.endsWith("/net-worth"))data={history:[{timestamp:at,net_worth:1000}]};
  else if(path.endsWith("/tx_list"))data={solana:[{txHash:"fixture"}]};
  else if(path.endsWith("top_traders"))data={items:[{address:token,owner:wallet}]};
  else if(path.endsWith("holder-profile"))data={token:{},holder_summary:{},tags:[{tag:"dev",percent_of_supply:1}]};
  else if(path.endsWith("distribution"))data={summary:{},holders:[{address:wallet}]};
  else if(path.endsWith("ohlcv"))data={items:candles};
  else if(path.endsWith("liquidity/history/token"))data={items:[{unix_time:at-3600,liquidity_usd:"1000"},{unix_time:at,liquidity_usd:"900"}]};
  else if(path.endsWith("liquidity/ohlc/token"))data={items:[{unix_time:at-900,close_liquidity_usd:1000,close_exit_liquidity_usd:500,total_pairs:2}]};
  else if(path==="/defi/v3/token/list")data={items:[{address:token,price:1,volume_24h_usd:1000}]};
  else if(path==="/defi/v3/token/holder"||path.endsWith("seek_by_time"))data={items:[{address:token}]};
  else throw new Error(`Unhandled fixture ${path}`);
  return Response.json({success:true,data});
}

test("all 12 skill recipes execute planned documented requests with bounded CU",async()=>{
  assert.equal(workflowCatalog().filter(c=>c.family==="data-skills").length,12);
  for(const kind of skillKinds){
    const info=skillInfo[kind];
    const input={kind,...(info.subject==="token"?{address:token}:info.subject==="wallet"?{address:wallet}:info.subject==="wallets"?{wallets:[wallet]}:{}),from:at-86400*7,to:at,resolution:"1H",skillDepth:"deep",include:["list","advanced_security","risk_history"]};
    const plan=planCase(input,at),ledger=new Ledger(":memory:");
    const seen:string[]=[];
    try{
      const runner=new Runner(ledger,"fixture",{fetch:async(u,init)=>{const url=new URL(String(u));seen.push(url.pathname);return fixture(url,init);}});
      const out=await runCase(runner,ledger.createRun(plan.estimatedCu,undefined,100),plan.input);
      assert.ok(out.data.sources.length>0,`${kind}: ${JSON.stringify(out.data.missing)}`);
      assert.ok(out.data.missing.every((m:any)=>m.step==="analysis"),`${kind}: ${JSON.stringify(out.data.missing)}`);
      assert.equal(out.meta.cu.estimated,seen.length?out.meta.cu.budgetUsed:0);
      assert.ok(out.meta.cu.estimated<=plan.estimatedCu,kind);
      assert.ok(seen.length<=plan.maxRequests,kind);
      assert.ok(out.data.skillAnalysis.referenceCommit||out.data.skillAnalysis.formulaVersion);
      if(kind==="skill-smart-wallets")assert.equal(out.data.sources.find((s:any)=>s.meta.operation==="portfolio.pnl-summary").meta.params.wallet,wallet,"Select owner wallet, not the token address");
      if(kind==="skill-wallet-score")assert.ok(out.data.skillAnalysis.findings[0].alphaScore>0);
      if(kind==="skill-smart-money-leaderboard")assert.equal(out.data.skillAnalysis.findings[0].rows[0].rank,1,"Documented summary.unique_tokens permits ranking");
      if(kind==="skill-rugcheck-audit")assert.equal(out.data.skillAnalysis.findings.find((f:any)=>f.kind==="liquidity-change").liquidityChangePct,"-10");
    }finally{ledger.close();}
  }
});

test("liquidity resolution edits change preview, run reservations and budget enforcement",async()=>{
  for(const [resolution,cost] of [["1m",60],["4h",150],["1D",600]] as const){
    assert.equal(prepare("token.liquidity-history",{address:token,resolution,time:at}).entry.cost,cost);
    const preview=previewCase({kind:"skill-rugcheck-audit",address:token,stepOverrides:{liquidity:{resolution}}});
    assert.equal(preview.steps.find(s=>s.id==="liquidity")?.cuPerRequest,cost);
  }
  const ledger=new Ledger(":memory:");let calls=0;
  try{
    const runner=new Runner(ledger,"fixture",{fetch:async(u,init)=>{calls++;return fixture(new URL(String(u)),init);}});
    await assert.rejects(runner.execute("token.liquidity-history",{address:token,time:at,resolution:"1D"},{run:ledger.createRun(599)}),{code:"CU_BUDGET_EXCEEDED"});
    assert.equal(calls,0);
  }finally{ledger.close();}
});

test("leaderboard subjects deduplicate, placeholders cannot run and skip switches remove paid steps",()=>{
  const plan=planCase({kind:"skill-smart-money-leaderboard",wallets:[wallet,wallet,second]});
  assert.equal(plan.maxRequests,6);assert.equal(plan.estimatedCu,140);
  const preview=previewCase({kind:"skill-smart-money-leaderboard"});
  assert.equal(preview.needsAddress,true);assert.equal(preview.input.wallets,undefined);
  assert.throws(()=>planCase(preview.input));
  assert.equal(planCase({kind:"skill-contract-dd",address:token,skipKline:true}).estimatedCu,78);
  assert.equal(planCase({kind:"skill-wallet-analysis",address:wallet,intervals:["7d"],skipPortfolio:true,skipFirstFunded:true,skipTransactions:true}).estimatedCu,50);
  assert.throws(()=>planCase({kind:"skill-trending-list",listSource:"trending",platform:"pump.fun"}));
  assert.throws(()=>planCase({kind:"skill-wallet-score",address:wallet,duration:"7d"}));
});

test("kline classifies closed candles, exposes evidence and refuses insufficient data",()=>{
  const source=result("market.ohlcv",{type:"1H",time_from:at-86400*2,time_to:at},{items:candles});
  const finding=analyzeCandles(source);
  assert.equal(finding.pattern,"uptrend_channel");assert.ok(finding.score!==null&&finding.score>50);
  const withOpen=analyzeCandles({...source,data:{items:[...candles,{unix_time:at-60,o:1,c:1,h:1,l:1,v:1000}]}});
  assert.equal(withOpen.score,finding.score);
  assert.equal(analyzeCandles({...source,data:{items:candles.slice(0,7)}}).score,null);
});

test("wallet alpha preserves missing values and rejects incompatible accounting or windows",()=>{
  const p={wallet,duration:"30d",pnl_method:"wac",position_scope:"duration_only"};
  const main=result("portfolio.pnl-summary",p,{summary:summary()}),history=result("portfolio.pnl-summary",{...p,duration:"90d"},{summary:summary(9000)}),detail=result("portfolio.pnl-details",p,{tokens:positions});
  const score=walletAlpha(main,history,detail);
  assert.ok(score.alphaScore!==null&&score.alphaScore>50);
  assert.equal(walletAlpha({...main,data:{summary:{}}},history,detail).alphaScore,null);
  assert.equal(walletAlpha(main,{...history,meta:{...history.meta,params:{...history.meta.params,pnl_method:"net_cash"}}},detail).alphaScore,null);
  assert.equal(walletAlpha(main,history,{...detail,meta:{...detail.meta,params:{...p,duration:"7d"}}}).alphaScore,null);
  const loss=walletAlpha({...main,data:{summary:summary(-500)}},history,detail);
  assert.ok(loss.alphaScore!==null&&loss.alphaScore<=39);
  const style=walletStyle(main,detail);assert.equal(style.style,"Regular · Net profit");
});

test("ranking rewards higher PnL, handles ties and leaves unknown wallets unranked",()=>{
  const data=[{wallet:"a",pnl30:100,wr30:.6,wr7:.6,unique:10},{wallet:"b",pnl30:200,wr30:.6,wr7:.6,unique:10},{wallet:"c",pnl30:null,wr30:.6,wr7:.6,unique:10}];
  const out=rankWallets(data);assert.equal(out[0].wallet,"b");assert.equal(out[2].rank,null);
  const tie=rankWallets([data[0],{...data[1],pnl30:100}]);assert.equal(tie[0].rankingScore,tie[1].rankingScore);
});

test("Smart Wallets accepts all reference envelopes and continues into token traders", async () => {
  for(const envelope of [[{token}], {data:[{token}]}, {success:1,data:[{token}]}, {success:true,data:[{token}]}]) {
    const ledger=new Ledger(":memory:");
    try {
      const runner=new Runner(ledger,"fixture",{fetch:async (u,init)=>{
        const url=new URL(String(u));
        if(url.pathname==="/smart-money/v1/token/list") {
          assert.equal(url.searchParams.get("interval"),"1d");
          assert.ok(Number(url.searchParams.get("limit"))<=20);
          return Response.json(envelope);
        }
        assert.equal(url.pathname,"/defi/v2/tokens/top_traders");
        assert.equal(url.searchParams.get("address"),token);
        return fixture(url,init);
      }});
      const out=await runCase(runner,ledger.createRun(95),{kind:"skill-smart-wallets"});
      assert.equal(out.data.sources.length,2);
      assert.deepEqual(out.data.missing,[]);
      assert.equal(out.meta.cu.estimated,50);
      assert.equal(out.meta.cu.uncertainAttempts,0);
      assert.equal(out.data.skillAnalysis.findings[0].wallets[0].wallet,wallet);
    } finally {ledger.close();}
  }
});

test("compatibility never converts an API error, malformed payload or explicit failure into a successful dataset", async () => {
  for(const body of [{success:false,data:[]},{success:0,data:[]},{error:"private-upstream-message",data:[]},{data:{message:"wrong shape"}},{message:"unknown envelope"},"not JSON"]){
    const ledger=new Ledger(":memory:");let requests=0;
    try{
      const runner=new Runner(ledger,"fixture",{fetch:async()=>{requests++;return typeof body==="string"?new Response(body):Response.json(body);}});
      const run=ledger.createRun(60);
      await assert.rejects(runner.execute("market.smart-money",{},{run}),(e:any)=>e.code==="API_RESPONSE_INVALID"&&!e.message.includes("private-upstream-message"));
      assert.equal(requests,1,"Invalid JSON/envelopes must not trigger paid retries");
      assert.equal(ledger.summary(run).budgetUsed,20);
      assert.equal(ledger.summary(run).uncertainAttempts,1);
    }finally{ledger.close();}
  }
});
