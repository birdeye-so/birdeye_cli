import {z} from "zod";
import {randomUUID} from "node:crypto";
import {catalog,prepare,PRICING_VERSION,type Entry} from "./catalog.js";
import {address,timestamp} from "./schemas.js";
import {planCase,executePlan,workflowCatalog,type Step,type CasePlan,type Execution} from "./workflows.js";
import {runCase,analysisResult,type Progress} from "./analysis.js";
import {KnowledgeBase} from "./knowledge.js";
import type {Ledger} from "./ledger.js";
import type {Runner,Result} from "./runner.js";
import {AppError,now,type Data} from "./shared.js";
import type {WorkflowSource} from "./workflow-sources.js";

const placeholder="So11111111111111111111111111111111111111112";
const stepSchema=z.object({id:z.string().regex(/^[a-zA-Z][\w-]{0,63}$/),operation:z.string().min(1).max(100),purpose:z.string().max(1000).optional(),params:z.record(z.string(),z.unknown()).default({}),subjects:z.object({from:z.array(z.string()).min(1).max(10),kind:z.enum(["token","wallet","pair"]),take:z.number().int().min(1).max(5).default(3)}).strict().optional(),subjectKey:z.enum(["address","token_address","wallet"]).optional()}).strict();
const manifestSchema=z.object({version:z.literal(1),title:z.string().min(1).max(200),purpose:z.string().min(1).max(2000),chain:z.literal("solana").default("solana"),steps:z.array(stepSchema).min(1).max(20)}).strict();
export const importRuntimeSchema=z.object({address:address.optional(),from:timestamp.optional(),to:timestamp.optional(),limit:z.number().int().min(1).max(5).optional(),stepOverrides:z.record(z.string(),z.record(z.string(),z.unknown())).default({})}).strict().refine(p=>(p.from===undefined)===(p.to===undefined) && (p.from===undefined || p.from<p.to!),"Provide an ordered from/to pair, or neither");
type Manifest=z.infer<typeof manifestSchema>;
type Definition={recipe:Data}|{manifest:Manifest};
type Mapping={command:string;operation?:string;status:"adapted"|"candidate"|"unsupported";note:string};
export type ImportedWorkflow={id:string;title:string;purpose:string;adapter:string;createdAt:string;source:WorkflowSource;definition:Definition|null;notes:string[];mapping:Mapping[]};
const gaps:Record<string,string>={
  "token-research":"Pool/cohort overview is included; source trending check, tagged holder positions and trader lists are not all reproduced.",
  "token-due-diligence":"Uses Birdeye overview/security/pools/cohort profile; source holder and tagged-trader lists are not reproduced.",
  "project-deep-report":"Default chart is 1H/1 day, not source 4h/3 days. No equivalent 15-point score, social verification or trending check.",
  "wallet-analysis":"Enriches at most 3 holdings with overview/security. GMGN followed-wallet feed and full research of every holding are omitted.",
  "smart-money-profile":"Uses 7d/30d PnL and bounded trades; no complete lot matching or copy-trade ROI. Without a wallet, Birdeye ranking chooses candidates.",
  "risk-warning":"Snapshot/cohort timeline only; no continuous monitoring, GMGN rug score or withdrawal inference without matching evidence.",
  "early-project-screening":"Default adaptation starts with newly-created, ungraduated tokens. Near/completed alternatives and GMGN presets/rug/insider filters are not automatically translated.",
  "daily-brief":"Uses 1h/24h rather than source 1h/6h; smart-money token list is not a global trade feed, and new launches are not near/completed launches.",
  "market-opportunities":"Scans one page then enriches up to 5 candidates. GMGN safety/social filters and trading actions are omitted.",
};
const commands:Record<string,string>={"token info":"token.overview","token security":"token.security","token pool":"token.markets","token holders":"token.holders","token traders":"token.top-traders","token search":"token.search","market trending":"market.trending","market kline":"market.ohlcv","market trenches":"market.meme-list","portfolio holdings":"portfolio.holdings","portfolio stats":"portfolio.pnl-summary","portfolio profits":"portfolio.pnl-details","portfolio activity":"portfolio.trades","track smartmoney":"market.smart-money"};
function mapCommands(text:string):Mapping[] {
  const lines=text.replace(/\\\r?\n\s*/g," ").split("\n");
  const found:Mapping[]=[];
  for(const line of lines) {
    const matches=line.matchAll(/\bgmgn-cli\s+([\w-]+)\s+([\w-]+)([^\n`]*)/g);
    for(const m of matches) {
      const command=m[0].slice(0,1200),key=`${m[1]} ${m[2]}`;
      let operation=commands[key];let note="Intent match only. Source flags, filters, pipes, scores and control flow are not automatically preserved.";
      if(key==="token holders" && /--tag\s/.test(command)) {operation="token.holder-positions";note="Provider cohort definitions differ; positions sort by amount, not GMGN PnL/buy volume. Review labels before adding this step.";}
      if(key==="token traders" && /--tag\s+["']?renowned\b/.test(command)) {operation="";note="Birdeye top-traders does not support the KOL tag; holder positions cannot substitute for KOL trading performance.";}
      if(/--chain\s+["']?(?:eth|ethereum|bsc|base)\b/i.test(command)) {operation="";note="This CLI only executes Solana; the source chain is not migrated.";}
      if(key==="market trending" && /--interval\s+["']?(?:1m|5m|6h)\b/.test(command))note+=" This source interval is not supported by the registered trending endpoint.";
      if(!operation && note.startsWith("Intent"))note="No registered operation with equivalent intent. This source command will not execute.";
      found.push({command,...(operation?{operation}:{}),status:operation?"candidate":"unsupported",note});
      if(found.length>120)throw new AppError("IMPORT_SIZE","More than 120 source commands; split the workflow document.");
    }
  }
  return found;
}
export function migrateWorkflow(source:WorkflowSource):ImportedWorkflow {
  const record:ImportedWorkflow={id:randomUUID(),title:source.name.replace(/\.(md|json)$/i,""),purpose:"Imported research workflow",adapter:"markdown",createdAt:now(),source,definition:null,notes:[],mapping:[]};
  if(source.content.trimStart().startsWith("{") || source.name.endsWith(".json")) {
    const manifest=manifestSchema.parse(JSON.parse(source.content));
    record.title=manifest.title;record.purpose=manifest.purpose;record.adapter="birdeye-json";record.definition={manifest};
    planImported(record,{},true);return record;
  }
  record.title=source.content.match(/^#\s+(.+)$/m)?.[1].slice(0,200) || record.title;
  const native=source.name.match(/^(trending-list|token-dd|contract-dd|kline-pattern|wallet-score|wallet-style)-workflow\.md$/)?.[1];
  if(native && /^#\s+Workflow:/m.test(source.content)) {
    const kind=`skill-${native}`,recipe=workflowCatalog().find(r=>r.kind===kind)!;
    record.adapter="birdeye-data-skills";record.purpose=recipe.purpose;record.definition={recipe:{kind}};
    record.notes=["Uses this CLI's reviewed Birdeye Data Skills recipe. Solana only; source prose/options are not compiled. Scores and missing evidence follow the registered recipe, not an assertion of identical source results."];
    record.mapping=planImported(record,{},true).steps.map(s=>({command:`Registered recipe step: ${s.id}`,operation:s.operation,status:"adapted",note:"See the registered step parameters and source migration audit for scope differences."}));
    return record;
  }
  record.mapping=mapCommands(source.content);
  const kind=source.name.match(/^workflow-(.+)\.md$/)?.[1];
  if(kind && Object.hasOwn(gaps,kind) && record.mapping.length) {
    record.adapter="gmgn";
    const recipe:Data={kind,depth:"full",limit:kind==="daily-brief"?2:kind==="market-opportunities"?5:3};
    if(kind==="early-project-screening")recipe.stepOverrides={candidates:{graduated:false}};
    if(kind==="market-opportunities") {recipe.interval="1h";recipe.stepOverrides={trending:{sort_by:"volumeUSD",sort_type:"desc"}};}
    record.definition={recipe};
    record.purpose=`Adapt ${kind.replaceAll("-"," ")} to registered Birdeye research steps.`;
    record.notes=[gaps[kind],"This is a bounded recipe adaptation, not a compiler for source prose, branches, flags or shell commands. Source thresholds, recommendation scores and execution instructions are not carried over."];
    const plan=planImported(record,{},true),used=new Set(plan.steps.map(s=>s.operation));
    record.mapping=record.mapping.map(m=>({...m,status:m.operation && used.has(m.operation as Step["operation"])?"adapted":m.status}));
    if(record.mapping.some(m=>m.status!=="adapted"))record.notes.push("Some source commands have no corresponding executable step. Candidate endpoints below are suggestions, not executed steps.");
  } else {
    record.notes=["No reviewed named adapter for this document. Endpoint candidates are for review only. Supply a version 1 Birdeye workflow JSON manifest to make a new sequence executable."];
  }
  return record;
}
function substitute(value:unknown,input:Data):unknown {
  if(typeof value==="string" && value.includes("{{")) {
    const key=value.match(/^\{\{(address|from|to)\}\}$/)?.[1];
    if(!key)throw new AppError("IMPORT_BINDING","Bindings must be exactly {{address}}, {{from}} or {{to}}.");
    if(input[key]===undefined)throw new AppError("IMPORT_INPUT",`Provide workflow ${key}.`);
    return input[key];
  }
  if(Array.isArray(value))return value.map(v=>substitute(v,input));
  if(value && typeof value==="object")return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,substitute(v,input)]));
  return value;
}
export function planImported(record:ImportedWorkflow,runtime:unknown={},preview=false,at=Math.floor(Date.now()/1000)):CasePlan & {needsAddress:boolean;usesAddressInput:boolean} {
  if(!record.definition)throw new AppError("IMPORT_REVIEW_REQUIRED","This source has endpoint candidates only. Import a reviewed workflow JSON to execute it.");
  const input=importRuntimeSchema.parse(runtime);
  if("recipe" in record.definition) {
    const recipe=record.definition.recipe;
    const subject=workflowCatalog().find(r=>r.kind===recipe.kind)?.subject || "";
    const needsAddress=["token","wallet"].includes(subject) && !input.address;
    if(needsAddress && !preview)throw new AppError("IMPORT_INPUT","Provide a Solana token/wallet address.");
    const overrides:Data={...recipe.stepOverrides};
    for(const [id,params] of Object.entries(input.stepOverrides))overrides[id]={...overrides[id],...params};
    const plan=planCase({...recipe,...input,stepOverrides:overrides,...(needsAddress?{address:placeholder}:{})},at);
    return {...plan,needsAddress,usesAddressInput:subject!=="none"};
  }
  const manifest=manifestSchema.parse(record.definition.manifest);
  const usesAddressInput=manifest.steps.some(s=>JSON.stringify({...s.params,...input.stepOverrides[s.id]}).includes("{{address}}"));
  const needsAddress=usesAddressInput && !input.address;
  if(needsAddress && !preview)throw new AppError("IMPORT_INPUT","Provide a Solana token/wallet address.");
  const bindings={address:needsAddress?placeholder:input.address,from:input.from??at-86400,to:input.to??at};
  const seen=new Set<string>();
  const steps:Step[]=manifest.steps.map(step=>{
    if(seen.has(step.id))throw new AppError("IMPORT_DEPENDENCY",`Duplicate step ${step.id}.`);
    if(step.subjects?.from.some(id=>!seen.has(id)))throw new AppError("IMPORT_DEPENDENCY",`Step ${step.id} must depend on an earlier step.`);
    if(step.subjectKey && !step.subjects)throw new AppError("IMPORT_DEPENDENCY","subjectKey requires a subjects selector.");
    const params=substitute({...step.params,...input.stepOverrides[step.id]},bindings) as Data;
    const subjectKey=step.subjectKey || "address";
    if(step.subjects && Object.hasOwn(params,subjectKey))throw new AppError("IMPORT_BINDING",`Step ${step.id}: remove ${subjectKey}; it comes from selected subjects.`);
    const prepared=prepare(step.operation,{...params,...(step.subjects?{[subjectKey]:placeholder}:{})},manifest.chain);
    seen.add(step.id);
    if(step.subjects)delete prepared.params[subjectKey];
    return {id:step.id,operation:prepared.operation,params:prepared.params,cost:prepared.entry.cost,...(step.subjects?{subjects:{...step.subjects,take:Math.min(step.subjects.take,input.limit??5)},subjectKey}:{})};
  });
  for(const key of Object.keys(input.stepOverrides))if(!seen.has(key))throw new AppError("IMPORT_INPUT",`Unknown step override ${key}.`);
  const maxRequests=steps.reduce((n,s)=>n+(s.subjects?.take??1),0);
  // The shared executor only reads these policy/window fields for custom plans.
  const executionInput=planCase({kind:"market-shortlist",from:bindings.from,to:bindings.to}).input;
  return {kind:`import:${record.id}`,input:executionInput,steps,maxRequests,estimatedCu:steps.reduce((n,s)=>n+s.cost*(s.subjects?.take??1),0),pricingVersion:PRICING_VERSION,notes:["One page per step; bounded subjects in provider order. Estimates exclude retries. No source code or trading actions execute."],needsAddress,usesAddressInput};
}
export class WorkflowImports {
  constructor(private ledger:Ledger) {ledger.db.exec("CREATE TABLE IF NOT EXISTS workflow_imports (id TEXT PRIMARY KEY, source_hash TEXT NOT NULL, origin TEXT NOT NULL, payload TEXT NOT NULL, UNIQUE(source_hash,origin))");}
  save(record:ImportedWorkflow) {
    const existing=this.ledger.db.prepare("SELECT id FROM workflow_imports WHERE source_hash=? AND origin=?").get(record.source.sha256,record.source.origin);
    if(existing)return this.get(String(existing.id));
    this.ledger.db.prepare("INSERT INTO workflow_imports VALUES(?,?,?,?)").run(record.id,record.source.sha256,record.source.origin,JSON.stringify(record));return record;
  }
  import(sources:WorkflowSource[]) {
    const records=sources.map(migrateWorkflow); // validate the complete batch before writing
    this.ledger.db.exec("BEGIN IMMEDIATE");
    try {const saved=records.map(r=>this.save(r));this.ledger.db.exec("COMMIT");return saved;}
    catch(error){this.ledger.db.exec("ROLLBACK");throw error;}
  }
  get(id:string):ImportedWorkflow {const row=this.ledger.db.prepare("SELECT payload FROM workflow_imports WHERE id=?").get(id);if(!row)throw new AppError("IMPORT_NOT_FOUND","Imported workflow not found.");return JSON.parse(String(row.payload));}
  list() {return this.ledger.db.prepare("SELECT payload FROM workflow_imports ORDER BY rowid DESC").all().map(row=>{const r:ImportedWorkflow=JSON.parse(String(row.payload));return {id:r.id,title:r.title,purpose:r.purpose,adapter:r.adapter,createdAt:r.createdAt,executable:!!r.definition,origin:r.source.origin,sha256:r.source.sha256};});}
  preview(id:string,runtime:unknown={}) {
    const r=this.get(id),plan=r.definition?planImported(r,runtime,true):null;
    const kb=new KnowledgeBase(this.ledger);
    const describe=(operation:string)=>{
      const entry:Entry=catalog[operation as keyof typeof catalog];
      const match=this.ledger.db.prepare("SELECT id FROM knowledge_documents WHERE instr(body, ?) > 0 LIMIT 1").get(`${entry.method||"GET"} ${entry.path}\n`);
      return {operation,path:entry.path,method:entry.method||"GET",description:entry.description,docs:match?`https://data.birdeye.so/docs/${String(match.id).replace(/^docs\//,"").replace(/\.md$/,"")}`:"https://data.birdeye.so/docs",docsSnapshot:kb.info.sourceCommit};
    };
    const runtimeInput=importRuntimeSchema.parse(runtime);
    return {...r,source:{...r.source,content:undefined},mapping:r.mapping.map(m=>({...m,...(m.operation?describe(m.operation):{})})),plan:plan?{...plan,steps:plan.steps.map(s=>{
      const custom="manifest" in r.definition! ? r.definition.manifest.steps.find(x=>x.id===s.id) : undefined;
      const raw={...custom?.params,...runtimeInput.stepOverrides[s.id]};
      const lockedParams=["address","wallet","token_address"].filter(k=>!custom || raw[k]==="{{address}}" || (s.subjects && k===s.subjectKey));
      const subjectParameters=Object.fromEntries(Object.entries(s.params).filter(([k])=>["address","wallet","token_address"].includes(k)).map(([k,v])=>[k,plan.needsAddress && lockedParams.includes(k)?"Provide workflow address":v]));
      return {...s,...describe(s.operation),inputSchema:z.toJSONSchema(catalog[s.operation].schema),purpose:custom?.purpose,lockedParams,subjectParameters};
    })}:null};
  }
}
export async function runImported(runner:Runner,run:string,record:ImportedWorkflow,runtime:unknown={},signal?:AbortSignal,progress:Progress=()=>{},evidence:(r:Result)=>void=()=>{}) {
  const plan=planImported(record,runtime);
  const decorate=(result:Result)=>{
    result.data.importedWorkflow={id:record.id,title:record.title,adapter:record.adapter,origin:record.source.origin,sha256:record.source.sha256,mapping:record.mapping};
    result.data.scopeNotes=[...(result.data.scopeNotes||[]),...record.notes];
    if(record.notes.length) {result.meta.coverage="partial";result.data.status="partial";result.meta.warnings=[...result.meta.warnings,...record.notes];}
    return result;
  };
  if("recipe" in record.definition!)return decorate(await runCase(runner,run,plan.input,signal,progress,r=>evidence(decorate(r))));
  const resultFor=(state:Execution)=>{
    const result=analysisResult(run,runner,plan.kind,state.sources,state.warnings);
    Object.assign(result.data,{plan,selections:state.selections,outcomes:state.outcomes,missing:state.missing,scopeNotes:plan.notes,status:state.missing.length?"partial":result.meta.coverage});
    result.meta.coverage=result.data.status;return decorate(result);
  };
  return resultFor(await executePlan(runner,run,plan,signal,progress,s=>evidence(resultFor(s))));
}
