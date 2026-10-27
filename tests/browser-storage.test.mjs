import test from "node:test";
import assert from "node:assert/strict";
import {build} from "esbuild";
import {mkdtemp,readdir,rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {resolve} from "node:path";
import {spawn} from "node:child_process";
import {Ledger} from "../dist/ledger.js";
await build({entryPoints:["web/browser/ledger.ts"],outfile:".test-dist/browser-ledger.mjs",bundle:true,platform:"node",format:"esm",packages:"external"});
const {BrowserLedger}=await import("../.test-dist/browser-ledger.mjs");
test("browser ledger enforces budgets and preserves SQLite accounting semantics",()=>{
 const state={config:{},runs:[],attempts:[],ledgerRuns:[]};
 const browser=new BrowserLedger(state),sqlite=new Ledger(":memory:");
 try{
   for(const ledger of [browser,sqlite]){
     const run=ledger.createRun(50,undefined,3);
     const done=ledger.reserve(run,"fixture",20,"opaque");ledger.finish(done,"completed",20);
     const failed=ledger.reserve(run,"fixture",10,"opaque");ledger.finish(failed,"uncertain");
     const stopped=ledger.reserve(run,"fixture",20,"opaque");ledger.finish(stopped,"not-sent");
     assert.throws(()=>ledger.reserve(run,"fixture",21,"opaque"),/budget|available/i);
     ledger.reserve(run,"fixture",20,"opaque");
     assert.throws(()=>ledger.reserve(run,"fixture",0,"opaque"),/limit/i);
     const zero=ledger.createRun(0);assert.throws(()=>ledger.reserve(zero,"unknown",null,"opaque"),/budget|zero/i);
   }
   assert.deepEqual(browser.summary(),sqlite.summary());
   assert.deepEqual(new BrowserLedger(structuredClone(state)).summary(),browser.summary());
 }finally{sqlite.close();}
});
test("browser CLI preview serves static assets without creating SQLite or exposing API routes",async()=>{
 const directory=await mkdtemp(resolve(tmpdir(),"birdeye-browser-cli-"));
 const child=spawn(process.execPath,["dist/index.js","--format","interface","--storage","browser","--bind","127.0.0.1:0"],{env:{...process.env,BIRDEYE_CONFIG_DIR:directory},stdio:["ignore","pipe","pipe"]});
 const stopped=new Promise(resolve=>child.once("exit",resolve));
 try{
   const url=await new Promise((done,fail)=>{
     const timeout=setTimeout(()=>{child.kill();fail(new Error("Preview startup timeout"));},10000);
     let stdout="",stderr="";
     child.stderr.on("data",s=>{stderr+=s;});
     child.stdout.on("data",s=>{stdout+=s;const match=stdout.match(/http:\/\/127\.0\.0\.1:\d+/);if(match){clearTimeout(timeout);done(match[0]);}});
     child.once("error",e=>{clearTimeout(timeout);fail(e);});
     child.once("exit",()=>{clearTimeout(timeout);fail(new Error(stderr||"Preview stopped"));});
   });
   assert.equal((await fetch(url)).status,200);
   assert.equal((await fetch(url+"/main.js")).status,200);
   assert.equal((await fetch(url+"/api/status")).status,404);
   assert.equal((await fetch(url+"/api/settings",{method:"POST",body:"private"})).status,404);
   assert.deepEqual(await readdir(directory),[]);
 }finally{child.kill("SIGTERM");await stopped;await rm(directory,{recursive:true,force:true});}
});
