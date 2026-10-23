import test from "node:test";
import assert from "node:assert/strict";
import {mkdtempSync, rmSync, writeFileSync} from "node:fs";
import {pathToFileURL} from "node:url";
import {tmpdir} from "node:os";
import {join, resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {Ledger} from "../src/ledger.js";
import {RunStore} from "../src/run-store.js";
import {Runner} from "../src/runner.js";
import {startInterface} from "../src/interface/server.js";
import {inProcessFetch} from "./http-helper.js";
const address="So11111111111111111111111111111111111111112";
const config={birdeyeApiKey:"fixture-key",ai:{defaultProfile:"research",profiles:{}}};
async function client(app:Awaited<ReturnType<typeof startInterface>>) {
  const fetch=inProcessFetch(app.handler,app.url);
  const login=await fetch(app.url+"/api/connect",{method:"POST",headers:{"Content-Type":"application/json",Origin:app.url,"Sec-Fetch-Site":"same-origin"},body:JSON.stringify({local:true})});
  const headers={"Content-Type":"application/json",Cookie:login.headers.get("set-cookie")!.split(";")[0]};
  return (path:string,input?:unknown)=>fetch(app.url+path,{headers,...(input===undefined?{}:{method:"POST",body:JSON.stringify(input)})});
}
test("UI results survive a real SQLite reopen; UI and CLI reuse data without more CU or API calls",async()=>{
  const dir=mkdtempSync(join(tmpdir(),"birdeye-history-"));
  let ledger=new Ledger(join(dir,"usage.sqlite")), calls=0;
  const factory=()=>new Runner(ledger,"fixture-key",{fetch:async()=>{calls++;return Response.json({success:true,data:{address,value:123,largeInteger:"9007199254740999"}});}});
  let app=await startInterface({ledger,config,dir,listen:false,runnerFactory:factory});
  try {
    let request=await client(app);
    const {id}=await (await request("/api/runs",{mode:"operation",query:{operation:"token.price",params:{address}}})).json();
    await request(`/api/runs/${id}/events`);
    const original=await (await request(`/api/runs/${id}`)).json(), before=ledger.summary();
    assert.equal(original.saved,true);assert.equal(calls,1);
    await app.close();ledger.close();ledger=new Ledger(join(dir,"usage.sqlite"));
    app=await startInterface({ledger,config:{ai:config.ai},dir,listen:false,runnerFactory:()=>{throw new Error("Reuse must not construct a Runner");}});
    request=await client(app);
    const restored=await (await request(`/api/runs/${id}`)).json();
    assert.equal(restored.fromStorage,true);assert.deepEqual(restored.result,original.result);
    assert.deepEqual(restored.input,original.input);assert.deepEqual(ledger.summary(),before);
    assert.equal((await (await request("/api/status")).json()).runs[0].id,id);
    const cli=spawnSync(process.execPath,[resolve(".test-dist/src/index.js"),"history","show",id,"--config-dir",dir],{encoding:"utf8",env:{...process.env,BIRDEYE_API_KEY:""}});
    assert.equal(cli.status,0,cli.stderr);
    const reused=JSON.parse(cli.stdout);assert.deepEqual(reused.result,original.result);assert.equal(reused.reuse.additionalCu,0);
    assert.deepEqual(ledger.summary(),before);assert.equal(calls,1);
  } finally {await app.close();ledger.close();rmSync(dir,{recursive:true,force:true});}
});
test("history cursor pagination retains all snapshots and marks detached checkpoints incomplete",()=>{
  const ledger=new Ledger(":memory:"), store=new RunStore(ledger);
  try {
    const ids=[];
    for(let i=0;i<105;i++){const id=ledger.createRun();ids.push(id);store.save({id,title:`run ${i}`,status:"completed",createdAt:new Date().toISOString(),input:{mode:"case"},ai:{}});}
    const first=store.list();assert.equal(first.items.length,50);
    const id=ledger.createRun();ledger.reserve(id,"token.price",5,"fixture-credential");
    store.save({id,title:"checkpoint",status:"running",createdAt:new Date().toISOString(),input:{mode:"operation"},ai:{}});
    const second=store.list(50,first.nextCursor!),third=store.list(50,second.nextCursor!);
    assert.equal(third.nextCursor,null);assert.equal(new Set([...first.items,...second.items,...third.items].map(r=>r.id)).size,105);
    assert.equal(store.get(id).status,"incomplete");assert.equal(store.get(id).cu.uncertainAttempts,1);
    assert.throws(()=>store.list(1000));assert.throws(()=>store.get("missing"),/not found/);
  }finally{ledger.close();}
});
test("checkpoint write failures halt paid work and keep unsaved evidence exportable",async()=>{
  const ledger=new Ledger(":memory:");let calls=0;
  const app=await startInterface({ledger,config,listen:false,runnerFactory:()=>new Runner(ledger,"fixture-key",{fetch:async()=>{calls++;return Response.json({success:true,data:{address,price:1}});}})});
  try {
    ledger.db.exec("CREATE TRIGGER fail_saved_update BEFORE UPDATE ON saved_runs BEGIN SELECT RAISE(FAIL, 'fixture disk full'); END;");
    const request=await client(app);
    const {id}=await (await request("/api/runs",{mode:"case",case:{kind:"token-research",address}})).json();
    await request(`/api/runs/${id}/events`);
    const run=await (await request(`/api/runs/${id}`)).json();
    assert.equal(calls,1);assert.equal(run.saved,false);assert.match(run.storageError,/SQLite/);
    assert.equal(run.result.data.sources.length,1);assert.equal(run.status,"failed");
  }finally{await app.close();ledger.close();}
});
test("CLI archives complete datasets even when the printed output is short",()=>{
  const dir=mkdtempSync(join(tmpdir(),"birdeye-cli-history-"));
  try {
    const preload=join(dir,"fixture.mjs");
    writeFileSync(preload,`globalThis.fetch=async()=>Response.json({success:true,data:{address:${JSON.stringify(address)},price:42,description:"complete stored dataset"}});`);
    const run=spawnSync(process.execPath,["--import",pathToFileURL(preload).href,resolve(".test-dist/src/index.js"),"token","overview",address,"--short","--config-dir",dir],{encoding:"utf8",env:{...process.env,BIRDEYE_API_KEY:"fixture-only"}});
    assert.equal(run.status,0,run.stderr);assert.ok(!run.stdout.includes("complete stored dataset"));
    const ledger=new Ledger(join(dir,"usage.sqlite"));
    try {const store=new RunStore(ledger);const saved=store.get(store.list().items[0].id);assert.equal(saved.result!.data.description,"complete stored dataset");assert.equal(saved.cu.estimated,18);}finally{ledger.close();}
  }finally{rmSync(dir,{recursive:true,force:true});}
});
test("chat conversations persist across restart and continue without a Birdeye key in saved-only mode",async()=>{
  const dir=mkdtempSync(join(tmpdir(),"birdeye-chat-history-"));let ledger=new Ledger(join(dir,"usage.sqlite")),dataCalls=0,aiCalls=0;
  const chatConfig={ai:{defaultProfile:"research",profiles:{research:{provider:"openai-compatible" as const,apiFormat:"responses" as const,baseUrl:"https://provider.test/v1",model:"fixture",apiKey:"fixture-ai",apiKeyEnv:"BIRDEYE_TEST_UNUSED_KEY"}}}};
  const create=()=>startInterface({ledger,dir,config:chatConfig,listen:false,runnerFactory:()=>new Runner(ledger,"",{fetch:async()=>{dataCalls++;throw new Error("No data requests allowed");}}),aiFetch:async(_url,init)=>{
    aiCalls++;const body=JSON.parse(String(init?.body));
    if(aiCalls===2){assert.match(JSON.stringify(body.input),/First question/);assert.match(JSON.stringify(body.input),/Answer 1/);}
    return Response.json({status:"completed",output:[{type:"message",role:"assistant",content:[{type:"output_text",text:`Answer ${aiCalls}`}]}],usage:{input_tokens:10,output_tokens:5}});
  }});
  let app=await create();
  try {
    let request=await client(app);
    const first=await(await request("/api/runs",{mode:"chat",question:"First question",dataPolicy:"saved-only",maxCu:0})).json();
    await request(`/api/runs/${first.id}/events`);
    await app.close();ledger.close();ledger=new Ledger(join(dir,"usage.sqlite"));app=await create();request=await client(app);
    const second=await(await request("/api/runs",{mode:"chat",question:"Follow up",parentId:first.id,dataPolicy:"saved-only",maxCu:0})).json();
    await request(`/api/runs/${second.id}/events`);
    const thread=await(await request(`/api/runs/${second.id}/thread`)).json();
    assert.deepEqual(thread.messages.map((m:{answer:string})=>m.answer),["Answer 1","Answer 2"]);
    assert.equal(dataCalls,0);assert.equal(ledger.summary().attempts,0);assert.equal(aiCalls,2);
    const result=await(await request(`/api/runs/${second.id}`)).json();assert.equal(result.ai.calls,1);assert.equal(result.saved,true);
  }finally{await app.close();ledger.close();rmSync(dir,{recursive:true,force:true});}
});
test("HTTP chat honors explicit saved-only even with a positive budget and provider-requested paid tools",async()=>{
  const ledger=new Ledger(":memory:");let dataCalls=0,aiCalls=0;
  const chatConfig={...config,ai:{defaultProfile:"research",profiles:{research:{provider:"openai-compatible" as const,apiFormat:"responses" as const,baseUrl:"https://provider.test/v1",model:"fixture",apiKey:"fixture-ai",apiKeyEnv:"BIRDEYE_TEST_UNUSED_KEY"}}}};
  const app=await startInterface({ledger,config:chatConfig,listen:false,runnerFactory:()=>new Runner(ledger,"fixture-key",{fetch:async()=>{dataCalls++;throw new Error("No paid request allowed");}}),aiFetch:async(_url,init)=>{
    aiCalls++;const body=JSON.parse(String(init?.body));
    if(aiCalls===1)return Response.json({status:"completed",output:[
      {type:"function_call",call_id:"price",name:"token_price",arguments:JSON.stringify({address})},
      {type:"function_call",call_id:"workflow",name:"run_workflow",arguments:JSON.stringify({kind:"token-research",address})},
      {type:"function_call",call_id:"selected-workflow",name:"run_selected_workflow",arguments:"{}"},
    ]});
    const outputs=body.input.filter((m:{type:string})=>m.type==="function_call_output");
    assert.equal(outputs.length,3);
    for(const output of outputs)assert.equal(JSON.parse(output.output).error.code,"LIVE_DATA_DISABLED");
    return Response.json({status:"completed",output:[{type:"message",role:"assistant",content:[{type:"output_text",text:"Enable live requests to fetch new data."}]}]});
  }});
  try {
    const request=await client(app);
    const {id}=await(await request("/api/runs",{mode:"chat",question:"Research this token",dataPolicy:"saved-only",maxCu:100})).json();
    await request(`/api/runs/${id}/events`);
    const saved=await(await request(`/api/runs/${id}`)).json();
    assert.equal(aiCalls,2);assert.equal(dataCalls,0);assert.equal(saved.input.dataPolicy,"saved-only");assert.equal(saved.input.maxCu,0);
    assert.equal(saved.cu.attempts,0);assert.equal(saved.result.meta.dataPolicy,"saved-only");
  }finally{await app.close();ledger.close();}
});
