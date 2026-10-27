import test from "node:test";
import assert from "node:assert/strict";
import {mkdtempSync,rmSync,writeFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {join,resolve} from "node:path";
import {tmpdir} from "node:os";
import {Ledger} from "../src/ledger.js";
import {RunStore} from "../src/run-store.js";
import {Runner} from "../src/runner.js";
import {startInterface} from "../src/interface/server.js";
import {inProcessFetch} from "./http-helper.js";
const address="So11111111111111111111111111111111111111112";

test("authenticated HTTP re-score and Node entrypoint reuse SQLite evidence after restart without API credentials",async()=>{
  const dir=mkdtempSync(join(tmpdir(),"birdeye-dd-http-"));
  let ledger=new Ledger(join(dir,"usage.sqlite")),calls=0;
  let app=await startInterface({ledger,dir,listen:false,config:{birdeyeApiKey:"fixture",ai:{defaultProfile:"research",profiles:{}}},runnerFactory:()=>new Runner(ledger,"fixture",{fetch:async u=>{calls++;return Response.json({success:true,data:String(u).includes("token_overview")?{liquidity:10000,marketCap:100000,trade24h:100,holder:200}: {ownerAddress:null,freezeAuthority:null,mutableMetadata:false,creatorPercentage:.12}});}})});
  async function client(){const fetch=inProcessFetch(app.handler,app.url);const login=await fetch(app.url+"/api/connect",{method:"POST",headers:{"Content-Type":"application/json",Origin:app.url,"Sec-Fetch-Site":"same-origin"},body:JSON.stringify({local:true})});
    const headers={"Content-Type":"application/json",Cookie:login.headers.get("set-cookie")!.split(";")[0]};
    return (path:string,input?:unknown)=>fetch(app.url+path,{headers,...(input===undefined?{}:{method:"POST",body:JSON.stringify(input)})});}
  try {
    let request=await client();const start=await(await request("/api/runs",{mode:"case",case:{kind:"skill-token-dd-score",address,ddMode:"standard"}})).json();
    await request(`/api/runs/${start.id}/events`);assert.equal(calls,2);
    await app.close();ledger.close();ledger=new Ledger(join(dir,"usage.sqlite"));
    app=await startInterface({ledger,dir,listen:false,config:{ai:{defaultProfile:"research",profiles:{}}},runnerFactory:()=>{throw new Error("Rescore constructed a paid runner");}});
    const unauth=await inProcessFetch(app.handler,app.url)(app.url+"/api/rescore",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:start.id})});assert.equal(unauth.status,401);
    request=await client();
    const response=await request("/api/rescore",{runId:start.id,ddMode:"advanced",liqCandles:32});assert.equal(response.status,200);
    const {id}=await response.json();const saved=new RunStore(ledger).get(id);assert.equal(saved.cu.attempts,0);assert.equal(saved.cu.estimated,0);assert.equal(calls,2);
    assert.equal(saved.result!.data.skillAnalysis.findings[0].pillars.smart_money.score,null);
    assert.equal((await request("/api/rescore",{runId:start.id,liqResolution:"1D"})).status,400);
    const entry=resolve("bin/token-dd-score.mjs");
    const cli=spawnSync(process.execPath,[entry,"--rescore",id,"--config-dir",dir,"--mode","standard","--format","raw-json"],{encoding:"utf8",env:{...process.env,BIRDEYE_API_KEY:""}});
    assert.equal(cli.status,0,cli.stderr);const result=JSON.parse(cli.stdout);assert.equal(result.meta.cu.attempts,0);assert.equal(result.data.skillAnalysis.findings[0].meta.cu_estimated_total,0);
    const file=join(dir,"evidence.json");writeFileSync(file,cli.stdout);
    const plain=spawnSync(process.execPath,[entry,"--rescore",file,"--config-dir",dir,"--format","telegram"],{encoding:"utf8",env:{...process.env,BIRDEYE_API_KEY:""}});
    assert.equal(plain.status,0,plain.stderr);assert.match(plain.stdout,/⚡ 0 estimated CU/);assert.match(plain.stdout,/0-CU re-score/);
    assert.equal(ledger.summary().attempts,2);
  } finally {await app.close();ledger.close();rmSync(dir,{recursive:true,force:true});}
});

test("Node entrypoint preflights offline, rejects unavailable presets and pace",()=>{
  const entry=resolve("bin/token-dd-score.mjs");
  const estimate=spawnSync(process.execPath,[entry,address,"--estimate-cu","--format","json"],{encoding:"utf8",env:{...process.env,BIRDEYE_API_KEY:""}});
  assert.equal(estimate.status,0,estimate.stderr);assert.equal(JSON.parse(estimate.stdout).estimatedCu,181);
  for(const flag of [["--pace"],["--weights-preset","strict-liquidity"]])assert.notEqual(spawnSync(process.execPath,[entry,address,...flag],{encoding:"utf8"}).status,0);
});
