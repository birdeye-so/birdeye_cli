import test from "node:test";
import assert from "node:assert/strict";
import {mkdtempSync,rmSync,writeFileSync,mkdirSync} from "node:fs";
import {tmpdir} from "node:os";
import {join,resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {Ledger} from "../src/ledger.js";
import {Runner} from "../src/runner.js";
import {RunStore} from "../src/run-store.js";
import {WorkflowImports,migrateWorkflow,planImported,runImported} from "../src/workflow-import.js";
import {sourceDocument,loadWorkflowSources,githubDocuments} from "../src/workflow-sources.js";
import {startInterface} from "../src/interface/server.js";
import {inProcessFetch} from "./http-helper.js";
const token="So11111111111111111111111111111111111111112",other="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const manifest={version:1,title:"Token evidence",purpose:"Inspect token identity and security",steps:[{id:"overview",operation:"token.overview",params:{address:"{{address}}"}},{id:"security",operation:"token.security",params:{address:"{{address}}"}}]};
const source=(value:unknown)=>sourceDocument("evidence.workflow.json","fixture:json",JSON.stringify(value));
test("custom manifests plan offline, validate all steps, and reject code, unsupported chains and dependency cycles",()=>{
  const record=migrateWorkflow(source(manifest));
  assert.equal(planImported(record,{},true).estimatedCu,48);assert.equal(planImported(record,{},true).needsAddress,true);
  assert.throws(()=>planImported(record),/Provide a Solana/);
  for(const bad of [{...manifest,chain:"base"},{...manifest,script:"rm -rf /"},{...manifest,steps:[{id:"x",operation:"__proto__"}]},{...manifest,steps:[{id:"x",operation:"token.price",params:{address:"{{process.env.KEY}}"}}]},{...manifest,steps:[{id:"x",operation:"token.price",subjects:{from:["x"],kind:"token",take:2}}]}])assert.throws(()=>migrateWorkflow(source(bad)));
  assert.throws(()=>planImported(record,{address:token,stepOverrides:{missing:{}}}),/Unknown step/);
  assert.throws(()=>planImported(record,{address:token,from:20,to:10}));
});
test("all nine GMGN adapters are explicit partial adaptations; source flags, pipes, KOL traders and chains stay visible",()=>{
  for(const kind of ["token-research","token-due-diligence","project-deep-report","wallet-analysis","smart-money-profile","risk-warning","early-project-screening","daily-brief","market-opportunities"]) {
    const record=migrateWorkflow(sourceDocument(`workflow-${kind}.md`,`fixture:${kind}`,"# Source workflow\n```bash\ngmgn-cli token info --chain sol --address <token> \\\n --raw | jq '.data'\ngmgn-cli token traders --tag renowned\ngmgn-cli token info --chain base\ngmgn-cli swap buy --amount 1\n```"));
    assert.equal(record.adapter,"gmgn");assert.ok(record.notes.length>=2);
    assert.ok(record.mapping[0].command.includes("jq"));
    assert.equal(record.mapping[1].status,"unsupported");assert.equal(record.mapping[2].status,"unsupported");assert.equal(record.mapping[3].status,"unsupported");
    assert.ok(planImported(record,{},true).steps.length>0);
    if(kind==="early-project-screening")assert.equal(planImported(record).steps[0].params.graduated,false);
  }
  const unknown=migrateWorkflow(sourceDocument("SKILL.md","fixture:other","# Custom\ngmgn-cli token holders --tag smart_degen"));
  assert.equal(unknown.definition,null);assert.equal(unknown.mapping[0].operation,"token.holder-positions");
  assert.throws(()=>planImported(unknown),/reviewed workflow JSON/);
});
test("imported definitions survive SQLite restart, deduplicate source content and expose exact endpoint docs",()=>{
  const dir=mkdtempSync(join(tmpdir(),"birdeye-import-"));let ledger=new Ledger(join(dir,"usage.sqlite"));
  try {
    let store=new WorkflowImports(ledger);const [record]=store.import([source(manifest)]);
    assert.equal(store.import([source(manifest)])[0].id,record.id);assert.equal(store.list().length,1);
    assert.throws(()=>store.import([source({...manifest,title:"new"}),source({...manifest,chain:"base"})]));assert.equal(store.list().length,1);
    ledger.close();ledger=new Ledger(join(dir,"usage.sqlite"));store=new WorkflowImports(ledger);
    const preview=store.preview(record.id,{address:token});
    assert.equal(preview.plan!.needsAddress,false);assert.equal(preview.plan!.steps[0].path,"/defi/token_overview");
    assert.match(preview.plan!.steps[0].docs,/data\.birdeye\.so\/docs\/data-api\/stats\/get-defi-token-overview$/);
    assert.equal(ledger.summary().attempts,0);
  }finally{ledger.close();rmSync(dir,{recursive:true,force:true});}
});
test("preview distinguishes editable fixed addresses from shared bindings and reflects effective overrides",()=>{
  const ledger=new Ledger(":memory:");
  try {
    const store=new WorkflowImports(ledger);
    const [fixed]=store.import([source({...manifest,steps:[{id:"overview",operation:"token.overview",params:{address:token}}]})]);
    const preview=store.preview(fixed.id,{address:other}).plan!;
    assert.equal(preview.usesAddressInput,false);
    assert.equal(preview.steps[0].subjectParameters.address,token);
    assert.ok(!preview.steps[0].lockedParams.includes("address"));
    assert.equal(store.preview(fixed.id,{stepOverrides:{overview:{address:other}}}).plan!.steps[0].params.address,other);
    const [bound]=store.import([source(manifest)]);
    const missing=store.preview(bound.id).plan!;
    assert.equal(missing.usesAddressInput,true);assert.equal(missing.needsAddress,true);
    assert.ok(missing.steps[0].lockedParams.includes("address"));
    assert.equal(missing.steps[0].subjectParameters.address,"Provide workflow address");
    const overridden=store.preview(bound.id,{stepOverrides:{overview:{address:token},security:{address:other}}}).plan!;
    assert.equal(overridden.usesAddressInput,false);assert.equal(overridden.needsAddress,false);
    assert.equal(overridden.steps[1].subjectParameters.address,other);
  }finally{ledger.close();}
});
test("editing a recipe parameter preserves other source adaptation defaults",()=>{
  for(const kind of ["early-project-screening","market-opportunities"]) {
    const record=migrateWorkflow(sourceDocument(`workflow-${kind}.md`,`fixture:${kind}`,"# Workflow\ngmgn-cli token info"));
    const id=kind==="early-project-screening"?"candidates":"trending";
    const step=planImported(record,{stepOverrides:{[id]:{limit:10}}}).steps.find(s=>s.id===id)!;
    assert.equal(step.params.limit,10);
    if(id==="candidates")assert.equal(step.params.graduated,false);
    else {assert.equal(step.params.sort_by,"volumeUSD");assert.equal(step.params.sort_type,"desc");}
  }
});
test("Birdeye Data Skills workflow documents use the reviewed native recipes",async()=>{
  const sources=await loadWorkflowSources(resolve("birdeye-data-skills/docs"));
  assert.equal(sources.length,6);
  for(const doc of sources) {const record=migrateWorkflow(doc);assert.equal(record.adapter,"birdeye-data-skills");assert.ok(planImported(record,{},true).steps.length>0);}
});
test("custom workflow execution uses bounded deduplicated dependencies, accounting and partial evidence on budget failure",async()=>{
  const ledger=new Ledger(":memory:");let calls=0;
  try {
    const record=migrateWorkflow(source({...manifest,steps:[{id:"trending",operation:"market.trending",params:{limit:3}},{id:"overview",operation:"token.overview",subjects:{from:["trending"],kind:"token",take:2}}]}));
    const runner=new Runner(ledger,"fixture",{retries:0,fetch:async(url)=>{calls++;return Response.json({success:true,data:new URL(String(url)).pathname==="/defi/token_trending"?{tokens:[{address:token},{address:token},{address:other}]}:{address:new URL(String(url)).searchParams.get("address"),price:1}});}});
    const result=await runImported(runner,ledger.createRun(61),record);
    assert.equal(calls,3);assert.equal(result.data.sources.length,3);assert.equal(result.meta.cu.estimated,61);
    const partial=await runImported(runner,ledger.createRun(25),record);
    assert.equal(calls,4);assert.equal(partial.meta.coverage,"partial");assert.equal(partial.data.sources.length,1);
    assert.equal(partial.data.missing.length,2);
  }finally{ledger.close();}
});
test("local imports scan workflow files only and CLI import/plan never spends CU",async()=>{
  const dir=mkdtempSync(join(tmpdir(),"birdeye-import-local-"));
  try {
    const folder=join(dir,"sources");mkdirSync(folder);writeFileSync(join(folder,"a.workflow.json"),JSON.stringify(manifest));writeFileSync(join(folder,"secret.pem"),"not a document");
    const docs=await loadWorkflowSources(folder);assert.equal(docs.length,1);
    const cli=spawnSync(process.execPath,[resolve(".test-dist/src/index.js"),"workflow","import",folder,"--config-dir",join(dir,"config")],{encoding:"utf8"});
    assert.equal(cli.status,0,cli.stderr);const [record]=JSON.parse(cli.stdout);assert.equal(record.plan.estimatedCu,48);
    const ledger=new Ledger(join(dir,"config/usage.sqlite"));assert.equal(ledger.summary().attempts,0);ledger.close();
    await assert.rejects(loadWorkflowSources(join(folder,"secret.pem")),/Markdown or workflow JSON/);
  }finally{rmSync(dir,{recursive:true,force:true});}
});
test("GitHub source loading is bounded, follows no redirects and never fetches arbitrary hosts",async()=>{
  const calls:string[]=[];
  const fetcher:typeof fetch=async(url,init)=>{
    calls.push(String(url));assert.equal(init?.redirect,"error");
    if(String(url).includes("git/trees"))return Response.json({tree:[{type:"blob",mode:"100644",path:"docs/workflow-token-research.md"},{type:"blob",mode:"100644",path:"script.sh"}]});
    return new Response("# Token research\ngmgn-cli token info --address <token>");
  };
  const docs=await githubDocuments("https://github.com/GMGNAI/gmgn-skills/tree/main/docs",fetcher);assert.equal(docs.length,1);assert.equal(calls.length,2);
  await assert.rejects(githubDocuments("http://localhost/private",fetcher));
  await assert.rejects(githubDocuments("https://evil.test/file.md",fetcher));assert.equal(calls.length,2);
  await assert.rejects(githubDocuments("https://github.com/o/r/blob/main/main.js",fetcher),/Markdown or workflow JSON/);
  await assert.rejects(githubDocuments("https://github.com/o/r/blob/main/workflow.md",async()=>{throw new TypeError("fetch failed");}),/network|upload|paste/i);
});
test("GMGN imports recover from GitHub discovery 403/429 using the nine known raw documents",async()=>{
  for(const status of [403,429])for(const suffix of ["","/tree/main/docs"]) {
    const calls:string[]=[];
    const docs=await githubDocuments(`https://github.com/GMGNAI/gmgn-skills${suffix}`,async(url,init)=>{
      calls.push(String(url));assert.equal(init?.redirect,"error");assert.equal(new Headers(init?.headers).has("Authorization"),false);
      return new URL(String(url)).hostname==="api.github.com"?Response.json({message:"API rate limit exceeded"},{status,headers:{"x-ratelimit-remaining":"0"}}):new Response("# Token research\ngmgn-cli token info");
    });
    assert.equal(docs.length,9);assert.equal(calls.filter(u=>new URL(u).hostname==="api.github.com").length,1);
    assert.equal(new Set(docs.map(d=>d.name)).size,9);
    assert.ok(docs.every(d=>d.origin.includes("/blob/main/docs/workflow-")));
    assert.ok(docs.every(d=>migrateWorkflow(d).adapter==="gmgn"));
  }
});
test("GMGN fallback preserves the requested ref and never hides raw-file errors or applies to another source",async()=>{
  const calls:string[]=[];
  const fetcher:typeof fetch=async(url)=>{
    calls.push(String(url));
    return new URL(String(url)).hostname==="api.github.com"?new Response(null,{status:403}):new Response("# Workflow\ngmgn-cli token info");
  };
  const docs=await githubDocuments("https://github.com/GMGNAI/gmgn-skills/tree/main/docs",fetcher,"pinned-sha");
  assert.ok(docs.every(d=>d.origin.includes("/blob/pinned-sha/")));
  for(const source of ["https://github.com/other/repo/tree/main/docs","https://github.com/GMGNAI/gmgn-skills/tree/main/skills"]) {
    calls.length=0;await assert.rejects(githubDocuments(source,fetcher),/api\.github\.com.*403/);assert.equal(calls.length,1);
  }
  calls.length=0;
  await assert.rejects(githubDocuments("https://github.com/GMGNAI/gmgn-skills/tree/main/docs",async(url)=>{
    calls.push(String(url));return new Response(null,{status:403});
  }),/raw\.githubusercontent\.com.*403/);
  assert.equal(calls.length,2);
  await assert.rejects(githubDocuments("https://github.com/GMGNAI/gmgn-skills/tree/missing/docs",async()=>new Response(null,{status:404})),/404/);
});
test("HTTP import, preview and execution persist to History without requiring an AI provider",async()=>{
  const ledger=new Ledger(":memory:");let calls=0;
  const app=await startInterface({ledger,config:{birdeyeApiKey:"fixture",ai:{defaultProfile:"research",profiles:{}}},listen:false,importFetch:async(url)=>new URL(String(url)).hostname==="api.github.com"?new Response(null,{status:403}):new Response("# GMGN workflow\ngmgn-cli token info"),runnerFactory:()=>new Runner(ledger,"fixture",{fetch:async()=>{calls++;return Response.json({success:true,data:{address:token,price:1,freezeable:false}});}})});
  try {
    const fetch=inProcessFetch(app.handler,app.url),login=await fetch(app.url+"/api/connect",{method:"POST",headers:{"Content-Type":"application/json",Origin:app.url,"Sec-Fetch-Site":"same-origin"},body:JSON.stringify({local:true})});
    const headers={"Content-Type":"application/json",Cookie:login.headers.get("set-cookie")!.split(";")[0]};
    const request=(path:string,input?:unknown)=>fetch(app.url+path,{headers,...(input===undefined?{}:{method:"POST",body:JSON.stringify(input)})});
    const gmgn=await request("/api/workflow-imports",{url:"https://github.com/GMGNAI/gmgn-skills/tree/main/docs"});
    assert.equal(gmgn.status,200);assert.equal((await gmgn.json()).items.length,9);assert.equal(ledger.summary().attempts,0);
    const imported=await(await request("/api/workflow-imports",{name:"custom.workflow.json",content:JSON.stringify(manifest)})).json(),id=imported.items[0].id;
    const preview=await(await request(`/api/workflow-imports/${id}/plan`,{address:token})).json();assert.equal(preview.plan.estimatedCu,48);assert.equal(calls,0);
    const started=await(await request("/api/runs",{mode:"imported",importId:id,importParams:{address:token},maxCu:48})).json();
    await request(`/api/runs/${started.id}/events`);
    const saved=new RunStore(ledger).get(started.id);assert.equal(calls,2);assert.equal(saved.input.mode,"imported");assert.equal(saved.result!.data.importedWorkflow.id,id);assert.equal(saved.cu.estimated,48);
  }finally{await app.close();ledger.close();}
});
