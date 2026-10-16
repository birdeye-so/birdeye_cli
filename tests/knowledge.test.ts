import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {Ledger} from "../src/ledger.js";
import {KnowledgeBase} from "../src/knowledge.js";
import {Runner} from "../src/runner.js";
import {runChat} from "../src/ai.js";
import type {Profile} from "../src/config.js";
import type {Data} from "../src/shared.js";
const address="So11111111111111111111111111111111111111112";
const profile:Profile={provider:"openai-compatible",apiFormat:"responses",baseUrl:"https://provider.test/v1",model:"fixture",apiKey:"fixture",apiKeyEnv:"BIRDEYE_TEST_UNUSED_KEY"};
const call=(id:string,name:string,args:Data)=>({type:"function_call",call_id:id,name,arguments:JSON.stringify(args)});
const response=(output:Data[])=>Response.json({status:"completed",output,usage:{input_tokens:10,output_tokens:5}});
test("whole documentation snapshot indexes resolved OpenAPI and reviewed skills with bounded citations",()=>{
  const ledger=new Ledger(":memory:");
  try {
    const kb=new KnowledgeBase(ledger);
    const manifest=JSON.parse(readFileSync("knowledge/birdeye/manifest.json","utf8"));
    assert.equal(kb.info.documents,manifest.entries.length);assert.equal(manifest.operationPages,113);
    assert.ok(manifest.documentationPages>=425);
    assert.ok(manifest.entries.every((e:Data)=>e.id.endsWith(".md")&&!e.id.includes(".pem")&&!e.id.includes(".login")));
    const matches=kb.search("top_traders",5);assert.ok(matches.length>0);
    const doc=kb.read(String(matches[0].id));assert.ok(doc.hash);assert.ok(doc.text.length<=10000);
    const contract=manifest.entries.find((e:Data)=>e.id.includes("get-defi-v2-tokens-top-traders"));
    assert.ok(contract);assert.match(readFileSync("knowledge/birdeye/"+contract.id,"utf8"),/Resolved API contract/);
    assert.match(readFileSync("knowledge/birdeye/"+contract.id,"utf8"),/time_frame/);
    assert.throws(()=>kb.read("../../config.sqlite"),/document ID/);
    assert.throws(()=>kb.search("x",10));assert.doesNotThrow(()=>kb.search('" OR * --'));
    assert.equal(ledger.summary().attempts,0);
    const count=ledger.db.prepare("SELECT count(*) AS n FROM knowledge_chunks").get()!.n;
    new KnowledgeBase(ledger);
    assert.equal(ledger.db.prepare("SELECT count(*) AS n FROM knowledge_chunks").get()!.n,count,"Same snapshot does not duplicate chunks");
  }finally{ledger.close();}
});
test("saved-only harness reads docs/data and rejects provider-requested paid tools at the host boundary",async()=>{
  const ledger=new Ledger(":memory:");let dataCalls=0,aiCalls=0;
  try {
    const runner=new Runner(ledger,"fixture",{fetch:async()=>{dataCalls++;return Response.json({success:true,data:{address,price:12,liquidity:50}});}});
    const originalId=ledger.createRun(),source=await runner.execute("token.overview",{address},{run:originalId});
    const run=ledger.createRun(0),kb=new KnowledgeBase(ledger);
    const result=await runChat(runner,run,profile,"Analyze saved data and suggest a workflow",{dataPolicy:"saved-only",savedRunId:originalId,savedSources:[source],knowledge:kb,
      fetch:async(_url,init)=>{
        aiCalls++;const body=JSON.parse(String(init?.body));
        const names=body.tools.map((t:Data)=>t.name);
        assert.ok(names.includes("search_birdeye_docs"));assert.ok(!names.includes("token_overview"));assert.ok(!names.includes("run_workflow"));
        if(aiCalls===1)return response([call("saved","read_saved_data",{}),call("docs","search_birdeye_docs",{query:"top_traders",limit:2}),call("denied","token_overview",{address}),call("denied-workflow","run_workflow",{kind:"token-research",address})]);
        const outputs=body.input.filter((m:Data)=>m.type==="function_call_output");
        if(aiCalls===2){
          assert.equal(JSON.parse(outputs.find((o:Data)=>o.call_id==="denied").output).error.code,"LIVE_DATA_DISABLED");
          assert.equal(JSON.parse(outputs.find((o:Data)=>o.call_id==="denied-workflow").output).error.code,"LIVE_DATA_DISABLED");
          const saved=JSON.parse(outputs.find((o:Data)=>o.call_id==="saved").output);assert.equal(saved.sources[0].data.price,12);
          const docs=JSON.parse(outputs.find((o:Data)=>o.call_id==="docs").output);
          return response([call("read","read_birdeye_doc",{id:docs[0].id})]);
        }
        return response([{type:"message",role:"assistant",content:[{type:"output_text",text:"Historical observation; proposed next steps require fresh data."}]}]);
      }});
    assert.equal(dataCalls,1);assert.equal(ledger.summary(run).attempts,0);assert.equal(result.meta.ai.calls,3);
    assert.equal(result.meta.reusedFromRunId,originalId);assert.ok(result.data.docSources.length>0);
    assert.equal(result.data.sources[0].meta.retrievedAt,source.meta.retrievedAt);
  }finally{ledger.close();}
});
