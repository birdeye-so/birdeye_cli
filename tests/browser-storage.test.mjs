import {request as httpRequest} from "node:http";
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
test("browser CLI public preview serves static assets without creating SQLite or exposing API routes",async()=>{
 const directory=await mkdtemp(resolve(tmpdir(),"birdeye-browser-cli-"));
 const child=spawn(process.execPath,["dist/index.js","--format","interface","--storage","browser","--bind","127.0.0.1:0","--public-url","https://demo.example"],{env:{...process.env,BIRDEYE_CONFIG_DIR:directory},stdio:["ignore","pipe","pipe"]});
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
   assert.equal((await fetch(url,{headers:{Host:"demo.example",Origin:"https://demo.example"}})).status,200);
   assert.equal((await fetch(url+"/main.js")).status,200);
   assert.equal((await fetch(url+"/api/status")).status,404);
   assert.equal((await fetch(url+"/api/settings",{method:"POST",body:"private"})).status,404);
   assert.deepEqual(await readdir(directory),[]);
 }finally{child.kill("SIGTERM");await stopped;await rm(directory,{recursive:true,force:true});}
});

test("browser public URL supports a loopback HTTPS proxy without trusting arbitrary forwarding headers",async()=>{
 const {startBrowserInterface}=await import("../dist/interface/browser-server.js");
 for(const value of ["invalid","http://demo.example","https://u:p@demo.example","https://demo.example/path","https://demo.example?x=1","https://demo.example/#fragment"])
   await assert.rejects(startBrowserInterface("127.0.0.1:0",value),/HTTPS/);
 await assert.rejects(startBrowserInterface("0.0.0.0:8787","https://demo.example"),/localhost/);
 const app=await startBrowserInterface("127.0.0.1:0","https://demo.example");
 const proxy=(path="/",headers={},method="GET")=>new Promise((resolve,reject)=>{
   const request=httpRequest(app.listenUrl+path,{headers,method},response=>{
     response.resume();response.on("end",()=>resolve({status:response.statusCode,headers:new Headers(response.headers)}));
   });request.on("error",reject);request.end();
 });
 try{
   assert.equal(app.url,"https://demo.example");
   for(const path of ["/","/main.js","/main.css", "/skill-price-surge"]){
     const response=await proxy(path,{Host:"demo.example",Origin:"https://demo.example"});
     assert.equal(response.status,200);
     assert.equal(response.headers.get("x-frame-options"),"DENY");
   }
   assert.equal((await fetch(app.listenUrl)).status,200);
   assert.equal((await proxy("/",{Host:"evil.example","X-Forwarded-Host":"demo.example"})).status,403);
   assert.equal((await proxy("/",{Host:"demo.example:444"})).status,403);
   assert.equal((await proxy("/",{Host:"demo.example",Origin:"https://evil.example"})).status,403);
   assert.equal((await proxy("/api/settings",{Host:"demo.example"},"POST")).status,404);
 }finally{await app.close();}
});


test("browser preview opens current skill links and canonicalizes aliases without exposing unknown routes",async()=>{
 const {startBrowserInterface}=await import("../dist/interface/browser-server.js");
 const {workflowCatalog}=await import("../dist/workflows/registry.js");
 const app=await startBrowserInterface("127.0.0.1:0");
 try{
   for(const skill of workflowCatalog().filter(item=>item.family==="data-skills")){
     const response=await fetch(app.listenUrl+"/"+skill.kind);
     assert.equal(response.status,200,skill.kind);
     assert.match(response.headers.get("content-type"),/text\/html/);
     assert.match(await response.text(),/id="root"/);
   }
   for(const path of ["/price-surge", "/price-surge-screen", "/prige-surge-screen", "/skill-price-surge/"]){
     const response=await fetch(app.listenUrl+path+"?from=demo",{redirect:"manual"});
     assert.equal(response.status,302,path);
     assert.equal(response.headers.get("location"),"/skill-price-surge?from=demo");
   }
   for(const path of ["/unknown-skill","/skill-token-dd","/api/status","/skill-price-surge/extra"])
     assert.equal((await fetch(app.listenUrl+path)).status,404,path);
   assert.equal((await fetch(app.listenUrl+"/skill-price-surge",{method:"POST"})).status,404);
 }finally{await app.close();}
});

test("browser preview reports an occupied port with actionable CLI output",async()=>{
 const {startBrowserInterface}=await import("../dist/interface/browser-server.js");
 const app=await startBrowserInterface("127.0.0.1:0");
 const bind=new URL(app.listenUrl).host;
 try{
   await assert.rejects(startBrowserInterface(bind),{code:"ADDRESS_IN_USE",message:new RegExp(`already in use.*--bind`,"i")});
   const child=spawn(process.execPath,["dist/index.js","--format","interface","--storage","browser","--bind",bind],{stdio:["ignore","pipe","pipe"]});
   let output="";
   child.stdout.on("data",chunk=>{output+=chunk;});
   child.stderr.on("data",chunk=>{output+=chunk;});
   const code=await new Promise((resolve,reject)=>{child.once("error",reject);child.once("close",resolve);});
   assert.equal(code,1);
   const result=JSON.parse(output.split("\n").find(line=>line.startsWith('{"error":')));
   assert.equal(result.error.code,"ADDRESS_IN_USE");
   assert.ok(result.error.message.includes(bind));
   assert.match(result.error.message,/--bind/);
 }finally{await app.close();}
});
