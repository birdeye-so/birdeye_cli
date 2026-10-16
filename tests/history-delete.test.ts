import test from "node:test";
import assert from "node:assert/strict";
import {mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {Ledger} from "../src/ledger.js";
import {RunStore,type StoredRun} from "../src/run-store.js";
import {Runner} from "../src/runner.js";
import {startInterface} from "../src/interface/server.js";
import {inProcessFetch} from "./http-helper.js";
const config={ai:{defaultProfile:"research",profiles:{}}};
async function client(app:Awaited<ReturnType<typeof startInterface>>) {
  const fetch=inProcessFetch(app.handler,app.url);
  const login=await fetch(app.url+"/api/connect",{method:"POST",headers:{"Content-Type":"application/json",Origin:app.url,"Sec-Fetch-Site":"same-origin"},body:JSON.stringify({local:true})});
  const headers={"Content-Type":"application/json",Cookie:login.headers.get("set-cookie")!.split(";")[0]};
  return (path:string,input?:unknown)=>fetch(app.url+path,{headers,...(input===undefined?{}:{method:"POST",body:JSON.stringify(input)})});
}
function snapshot(ledger:Ledger,parentId?:string):StoredRun {
  return {id:ledger.createRun(),title:"Saved chat",status:"completed",createdAt:new Date().toISOString(),input:{mode:"chat",question:"Fixture question",...(parentId?{parentId}:{})},ai:{}};
}
test("deleting saved history persists across restart, truncates missing ancestry, and preserves CU",async()=>{
  const dir=mkdtempSync(join(tmpdir(),"birdeye-delete-"));let ledger=new Ledger(join(dir,"usage.sqlite"));
  const store=new RunStore(ledger),parent=snapshot(ledger),child=snapshot(ledger,parent.id);
  store.save(parent);store.save(child);ledger.reserve(parent.id,"token.price",5,"fixture");
  const usage=ledger.summary();
  let app=await startInterface({ledger,config,dir,listen:false,initialRunId:parent.id});
  try {
    let request=await client(app);
    const unauth=await inProcessFetch(app.handler,app.url)(app.url+"/api/history/delete",{method:"POST",body:JSON.stringify({all:true})});
    assert.equal(unauth.status,401);
    assert.equal((await request("/api/history/delete",{})).status,400,"Empty input cannot imply delete all");
    assert.equal((await request("/api/history/delete",{id:parent.id,all:true})).status,400);
    assert.deepEqual(await(await request("/api/history/delete",{id:parent.id})).json(),{deleted:1});
    assert.equal((await request(`/api/runs/${parent.id}`)).status,404);
    assert.deepEqual(await(await request("/api/initial",{})).json(),{id:null});
    const thread=await(await request(`/api/runs/${child.id}/thread`)).json();
    assert.equal(thread.messages.length,1);assert.equal(thread.truncated,true);
    assert.deepEqual(ledger.summary(),usage);
    assert.throws(()=>store.save(parent),/Could not save/,"Late checkpoints cannot resurrect deleted history");
    await app.close();ledger.close();ledger=new Ledger(join(dir,"usage.sqlite"));
    app=await startInterface({ledger,config,dir,listen:false});request=await client(app);
    assert.equal((await request(`/api/runs/${parent.id}`)).status,404);
    assert.equal((await(await request("/api/history")).json()).items[0].id,child.id);
    assert.deepEqual(ledger.summary(),usage);
  }finally{await app.close();ledger.close();rmSync(dir,{recursive:true,force:true});}
});
test("clear history removes older pages atomically and permits new runs",()=>{
  const ledger=new Ledger(":memory:"),store=new RunStore(ledger);let last:StoredRun;
  try {
    for(let i=0;i<105;i++){last=snapshot(ledger);store.save(last);}
    ledger.db.exec("CREATE TRIGGER block_delete BEFORE DELETE ON saved_runs BEGIN SELECT RAISE(FAIL,'fixture full disk'); END;");
    assert.throws(()=>store.remove(),/Could not delete/);
    assert.equal(ledger.db.prepare("SELECT count(*) AS n FROM saved_runs").get()!.n,105);
    assert.equal(ledger.db.prepare("SELECT count(*) AS n FROM deleted_saved_runs").get()!.n,0);
    ledger.db.exec("DROP TRIGGER block_delete");
    assert.equal(store.remove(),105);assert.deepEqual(store.list(),{items:[],nextCursor:null});
    assert.throws(()=>store.save(last!),/Could not save/);
    const fresh=snapshot(ledger);store.save(fresh);assert.equal(store.get(fresh.id).id,fresh.id);
    assert.equal(ledger.db.prepare("SELECT count(*) AS n FROM runs").get()!.n,106);
  }finally{ledger.close();}
});
test("deletion blocks active runs and evicts completed results from the live map",async()=>{
  const ledger=new Ledger(":memory:");let release!:()=>void;
  const gate=new Promise<void>(resolve=>{release=resolve;});
  const app=await startInterface({ledger,config,listen:false,runnerFactory:()=>new Runner(ledger,"fixture",{fetch:async()=>{await gate;return Response.json({success:true,data:{value:1}});}})});
  try {
    const request=await client(app);
    const {id}=await(await request("/api/runs",{mode:"operation",query:{operation:"token.price",params:{address:"So11111111111111111111111111111111111111112"}}})).json();
    assert.equal((await request("/api/history/delete",{all:true})).status,409);
    assert.equal((await request("/api/history/delete",{id})).status,409);
    release();await request(`/api/runs/${id}/events`);
    const usage=ledger.summary();
    assert.deepEqual(await(await request("/api/history/delete",{all:true})).json(),{deleted:1});
    assert.equal((await request(`/api/runs/${id}`)).status,404);
    assert.equal((await(await request("/api/status")).json()).runs.length,0);
    assert.deepEqual(ledger.summary(),usage);
  }finally{release();await app.close();ledger.close();}
});
