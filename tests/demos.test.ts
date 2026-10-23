import test from "node:test";
import assert from "node:assert/strict";
import {mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join,resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {demoCatalog,demoInputSchema,planDemo,runDemo} from "../src/demos.js";
import {Ledger} from "../src/ledger.js";
import {Runner} from "../src/runner.js";
import {RunStore} from "../src/run-store.js";
import {startInterface} from "../src/interface/server.js";
import {inProcessFetch} from "./http-helper.js";
const token="So11111111111111111111111111111111111111112";
function fixture(security:Record<string,unknown>={freezeable:false,top10HolderPercent:0.2},liquidity:unknown=200000):typeof fetch {
  return async(url)=>{
    const path=new URL(String(url)).pathname;
    if(path==="/smart-money/v1/token/list")return Response.json([{token,symbol:"FIXTURE",smart_traders_no:3}]);
    const data=path.endsWith("token_overview")?{address:token,symbol:"FIXTURE",price:1.25,liquidity,v24hUSD:500000}:
      path.endsWith("token_security")?security:
      path.endsWith("token_trending")?{tokens:[{address:token,volume24hUSD:500000}]}:
      path.endsWith("holder-profile")?{token:{},holder_summary:{},tags:[]}:
      path.endsWith("distribution")?{summary:{wallet_count:1,total_holding:"120000.25",percent_of_supply:12},holders:[{wallet:token,holding:"120000.25",percent_of_supply:12}]}:
      path.endsWith("money-flow")?[{token_address:token,tag:"smart_money",frame:"24h",total_value_buy:10,total_value_sell:5}]:
      path.endsWith("pnl/summary")?{summary:{pnl:{realized_profit_usd:100,unrealized_usd:20,total_usd:120},counts:{total_win:1,total_loss:1,win_rate:50}}}:
      path.endsWith("pnl/details")?{summary:{},tokens:[]}:
      {items:[{address:token,name:"Fixture pool",liquidity:20000,volume24h:5000,valueUsd:300,symbol:"FIXTURE"}]};
    return Response.json({success:true,data});
  };
}
test("all customer demos preview without keys and freeze the window used by execution",()=>{
  const costs:Record<string,number>={terminal:169,"dex-inspector":143,"wallet-intelligence":110,"security-signals":78,"telegram-brief":58};
  for(const demo of demoCatalog){
    const preview=planDemo({id:demo.id},true);
    assert.equal(preview.estimatedCu,costs[demo.id]);
    assert.equal("needsAddress" in preview && preview.needsAddress,demo.subject!=="none");
    const plan=planDemo({...preview.demoInput,...(demo.subject!=="none"?{address:token}:{})});
    assert.equal(plan.input.from,preview.input.from);assert.equal(plan.input.to,preview.input.to);
    assert.ok(plan.steps.every(s=>s.cost>0));
  }
  assert.throws(()=>planDemo({id:"security-signals"}),/requires a Solana address/);
  assert.throws(()=>demoInputSchema.parse({id:"security-signals",address:token,maxTop10Pct:101}));
  assert.throws(()=>demoInputSchema.parse({id:"terminal",limit:6}));
  assert.throws(()=>demoInputSchema.parse({id:"terminal",from:20,to:10}));
  assert.throws(()=>planDemo({id:"terminal",address:token}));
});
test("all demo products run real recipes with fixture transport and evidence-linked output",async()=>{
  const ledger=new Ledger(":memory:");
  try {
    const runner=new Runner(ledger,"fixture",{fetch:fixture(),retries:0});
    for(const demo of demoCatalog) {
      const input={id:demo.id,...(demo.subject!=="none"?{address:token}:{})};
      const plan=planDemo(input),run=ledger.createRun(plan.estimatedCu);
      const result=await runDemo(runner,run,input);
      assert.equal(result.data.demo.id,demo.id);assert.ok(result.data.sources.length>0);
      assert.ok(result.data.demo.sections.length>0);assert.equal(result.meta.cu.uncertainAttempts,0);
      if(demo.id==="dex-inspector")assert.equal(result.data.demo.sections.find((s:any)=>s.title.startsWith("Pools")).rows[0].liquidity,20000);
      if(demo.id==="wallet-intelligence") {assert.equal(result.data.demo.walletStage,"discovery");assert.equal(result.data.demo.sections[1].rows[0].address,token);assert.ok(result.data.sources.every((s:any)=>!s.meta.operation.startsWith("portfolio.")));}
      if(demo.id==="telegram-brief") {assert.equal(result.data.demo.delivery,"preview-only");assert.match(result.data.demo.message,/Run:/);assert.ok(result.data.demo.message.length<4096);assert.match(result.data.demo.message,/Price USD: 1.25/);}
    }
  }finally{ledger.close();}
});
test("security signals distinguish missing, malformed, zero and breached observations",async()=>{
  const ledger=new Ledger(":memory:");
  try {
    for(const [security,liquidity,expected] of [
      [{freezeable:false,top10HolderPercent:0.2},200000,"no-configured-rule-triggered"],
      [{freezeable:false,top10HolderPercent:0},0,"attention"],
      [{freezeable:true,top10HolderPercent:0.2},200000,"attention"],
      [{freezeable:false,top10HolderPercent:0.9},200000,"attention"],
      [{},null,"unknown"],
      [{freezeable:"false",top10HolderPercent:200},"unknown","unknown"],
    ] as const) {
      const runner=new Runner(ledger,"fixture",{fetch:fixture(security,liquidity),retries:0});
      const result=await runDemo(runner,ledger.createRun(78),{id:"security-signals",address:token});
      assert.equal(result.data.demo.signalState,expected);
      assert.equal(result.data.demo.sections[1].rows.length,3);
      assert.ok(result.data.demo.sections[1].rows.every((r:any)=>r.sourceId));
      assert.equal(result.data.demo.sections.length,7);
      assert.equal(result.meta.cu.attempts,Object.keys(security).length?3:2,"Empty required security evidence stops the dependent holder step");
      assert.equal(result.meta.cu.estimated,Object.keys(security).length?78:48);
      const holders=result.data.demo.sections.find((s:any)=>s.title.startsWith("Holder wallets")).rows;
      assert.equal(holders.length,Object.keys(security).length?1:0);
      if(holders.length) {assert.equal(holders[0].address,token);assert.equal(holders[0].amount,"120000.25");assert.equal(holders[0].supplySharePct,"12");assert.ok(holders[0].sourceId);}
      assert.equal(result.data.demo.sections.find((s:any)=>s.title==="Market depth & activity").rows.find((r:any)=>r.key==="volumeToLiquidity").value,typeof liquidity==="number"&&liquidity>0?"2.5":null);
    }
    const runner=new Runner(ledger,"fixture",{fetch:fixture(),retries:0});
    const result=await runDemo(runner,ledger.createRun(0),{id:"security-signals",address:token});
    assert.equal(result.data.demo.signalState,"unknown");assert.equal(result.meta.cu.attempts,0);assert.equal(result.meta.coverage,"partial");
  }finally{ledger.close();}
});
test("demo CLI listing and preflight are offline and require no configured credentials",()=>{
  const dir=mkdtempSync(join(tmpdir(),"birdeye-demo-cli-"));
  try {
    for(const args of [["demos","--short"],["demo","terminal","--limit","2","--estimate-cu","--short"],["demo","wallet-intelligence","--limit","2","--estimate-cu","--short"],["demo","wallet-intelligence","--address","","--limit","2","--estimate-cu","--short"]]) {
      const result=spawnSync(process.execPath,[resolve(".test-dist/src/index.js"),...args,"--config-dir",dir],{encoding:"utf8"});
      assert.equal(result.status,0,result.stderr);const value=JSON.parse(result.stdout);
      if(args[0]==="demos")assert.equal(value.length,5);else assert.equal(value.estimatedCu,args[1]==="wallet-intelligence"?80:121);
    }
  }finally{rmSync(dir,{recursive:true,force:true});}
});
test("HTTP demo execution persists a reusable product report across SQLite restart",async()=>{
  const dir=mkdtempSync(join(tmpdir(),"birdeye-demo-http-"));let ledger=new Ledger(join(dir,"usage.sqlite"));
  const app=await startInterface({ledger,config:{birdeyeApiKey:"fixture",ai:{defaultProfile:"research",profiles:{}}},listen:false,runnerFactory:()=>new Runner(ledger,"fixture",{fetch:fixture(),retries:0})});
  try {
    const fetch=inProcessFetch(app.handler,app.url);
    const login=await fetch(app.url+"/api/connect",{method:"POST",headers:{"Content-Type":"application/json",Origin:app.url,"Sec-Fetch-Site":"same-origin"},body:JSON.stringify({local:true})});
    const headers={"Content-Type":"application/json",Cookie:login.headers.get("set-cookie")!.split(";")[0]};
    const request=(path:string,input?:unknown)=>fetch(app.url+path,{headers,...(input===undefined?{}:{method:"POST",body:JSON.stringify(input)})});
    assert.equal((await(await request("/api/demos")).json()).items.length,5);
    const plan=await(await request("/api/demos/plan",{id:"telegram-brief",address:token})).json();assert.equal(ledger.summary().attempts,0);
    const response=await request("/api/runs",{mode:"demo",demo:plan.demoInput,maxCu:58});assert.equal(response.status,202);
    const {id}=await response.json();await request(`/api/runs/${id}/events`);
    const saved=new RunStore(ledger).get(id);assert.equal(saved.input.mode,"demo");assert.equal(saved.cu.estimated,58);
    assert.equal(saved.result!.data.demo.delivery,"preview-only");const before=ledger.summary().attempts;
    await request(`/api/runs/${id}`);assert.equal(ledger.summary().attempts,before);
    await app.close();ledger.close();ledger=new Ledger(join(dir,"usage.sqlite"));
    assert.equal(new RunStore(ledger).get(id).result!.data.demo.message,saved.result!.data.demo.message);
  }finally{await app.close();ledger.close();rmSync(dir,{recursive:true,force:true});}
});

test("wallet demo discovers bounded deduplicated candidates, then analyzes only the chosen wallet",async()=>{
  const second="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",wallet="11111111111111111111111111111111";
  const ledger=new Ledger(":memory:"),calls:URL[]=[],subjects:(string|null)[]=[];
  const transport:typeof fetch=async(url,init)=>{
    const u=new URL(String(url));calls.push(u);
    const body=typeof init?.body==="string"?JSON.parse(init.body):{};subjects.push(u.searchParams.get("wallet")??body.wallet??null);
    if(u.pathname==="/smart-money/v1/token/list")return Response.json([{token,symbol:"A"},{token:second,symbol:"B"}]);
    if(u.pathname.endsWith("top_traders"))return Response.json({success:true,data:{items:[
      {owner:"invalid",realizedPnl:99999},{owner:wallet,realizedPnl:10},{owner:wallet,realizedPnl:10},{owner:second,realizedPnl:20},{owner:token,realizedPnl:30}
    ]}});
    return fixture()(url,init);
  };
  try {
    const runner=new Runner(ledger,"fixture",{fetch:transport,retries:0});
    const plan=planDemo({id:"wallet-intelligence",limit:2},true);
    assert.equal(plan.estimatedCu,80);assert.equal(plan.maxRequests,3);assert.equal("needsAddress" in plan&&plan.needsAddress,false);
    const discovery=await runDemo(runner,ledger.createRun(80),plan.demoInput);
    const rows=discovery.data.demo.sections.find((s:any)=>s.title.startsWith("Discovered wallets")).rows;
    assert.deepEqual(rows.map((r:any)=>r.address),[wallet,second]);
    assert.deepEqual(rows[0].tokens,[token,second]);
    assert.equal(rows[0].realizedPnlUsd,undefined,"Do not aggregate token PnL into a wallet metric");
    assert.ok(rows[0].observations.every((o:any)=>o.sourceId&&o.asOf&&o.tokenRealizedPnlUsd===10));
    assert.equal(calls.length,3);assert.equal(ledger.summary().estimated,80);
    const count=calls.length;
    const analysisPlan=planDemo({id:"wallet-intelligence",address:rows[0].address},true);
    assert.equal(calls.length,count,"Planning the selected wallet is free");assert.equal(analysisPlan.estimatedCu,90);
    const analysis=await runDemo(runner,ledger.createRun(90),analysisPlan.demoInput);
    assert.equal(analysis.data.demo.walletStage,"analysis");
    assert.deepEqual(analysis.data.demo.sections[0].rows.map((r:any)=>r.duration),["7d","30d"]);
    assert.ok(subjects.slice(count).every(subject=>subject===wallet));
    assert.ok(calls.slice(count).every(u=>!u.pathname.includes("smart-money")&&!u.pathname.includes("top_traders")));
    const store=new RunStore(ledger);
    store.save({id:discovery.meta.runId,title:"Discovery",status:"complete",createdAt:discovery.meta.retrievedAt,input:{mode:"demo",demo:plan.demoInput},result:discovery,ai:{}});
    assert.deepEqual(store.get(discovery.meta.runId).result!.data.demo.sections[1].rows,rows);
    assert.equal(calls.length,count+4,"History read and wallet choice must not refetch discovery");
  } finally {ledger.close();}
});
test("empty or budget-blocked wallet discovery returns no invented candidates",async()=>{
  const ledger=new Ledger(":memory:");
  try{
    const runner=new Runner(ledger,"fixture",{fetch:async()=>Response.json([]),retries:0});
    for(const budget of [0,110]) {
      const result=await runDemo(runner,ledger.createRun(budget),{id:"wallet-intelligence"});
      assert.equal(result.data.demo.walletStage,"discovery");
      assert.deepEqual(result.data.demo.sections[1].rows,[]);
      assert.ok(result.meta.cu.attempts<=1);
    }
  }finally{ledger.close();}
});

test("HTTP wallet discovery previews and runs with omitted or blank wallet input",async()=>{
  const ledger=new Ledger(":memory:"),paths:string[]=[];
  const transport:typeof fetch=async(url,init)=>{paths.push(new URL(String(url)).pathname);return fixture()(url,init);};
  const app=await startInterface({ledger,config:{birdeyeApiKey:"fixture",ai:{defaultProfile:"research",profiles:{}}},listen:false,runnerFactory:()=>new Runner(ledger,"fixture",{fetch:transport,retries:0})});
  try {
    const fetch=inProcessFetch(app.handler,app.url);
    const login=await fetch(app.url+"/api/connect",{method:"POST",headers:{"Content-Type":"application/json",Origin:app.url,"Sec-Fetch-Site":"same-origin"},body:JSON.stringify({local:true})});
    const headers={"Content-Type":"application/json",Cookie:login.headers.get("set-cookie")!.split(";")[0]};
    const request=(path:string,input:unknown)=>fetch(app.url+path,{method:"POST",headers,body:JSON.stringify(input)});
    for(const input of [{id:"wallet-intelligence"},{id:"wallet-intelligence",address:""},{id:"wallet-intelligence",address:"   "}]) {
      const before=ledger.summary().attempts;
      const response=await request("/api/demos/plan",input);
      assert.equal(response.status,200,`Blank/omitted wallet must allow discovery preview: ${JSON.stringify(input)}`);
      const plan=await response.json();
      assert.equal(plan.kind,"skill-smart-wallets");assert.equal(plan.needsAddress,false);assert.equal(plan.demoInput.address,undefined);
      assert.equal(ledger.summary().attempts,before,"Preview must not call Birdeye");
      // Exercise the raw form payload too: POST /runs validates it independently of /plan.
      const run=await request("/api/runs",{mode:"demo",demo:input,maxCu:110});
      assert.equal(run.status,202,`Discovery must start without a wallet: ${JSON.stringify(input)}`);
      const {id}=await run.json();await fetch(app.url+`/api/runs/${id}/events`,{headers});
      const saved=new RunStore(ledger).get(id);
      assert.equal(saved.result!.data.demo.walletStage,"discovery");
      assert.equal(saved.result!.data.demo.sections[1].rows.length,1);
      assert.equal(saved.cu.estimated,50);
    }
    assert.ok(paths.every(path=>path==="/smart-money/v1/token/list"||path==="/defi/v2/tokens/top_traders"));
    const before=ledger.summary().attempts;
    for(const demo of [{id:"wallet-intelligence",address:"not-a-wallet"},{id:"dex-inspector",address:""}]){
      const response=await request("/api/runs",{mode:"demo",demo,maxCu:200});
      assert.equal(response.status,400,"Invalid addresses and required token subjects must still be rejected");
    }
    assert.equal(ledger.summary().attempts,before);
  }finally{await app.close();ledger.close();}
});
