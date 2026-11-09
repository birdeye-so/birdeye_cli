import {Runner} from "../../src/runner";
import {workflowCatalog, planCase} from "../../src/workflows";
import {previewCase} from "../../src/workflow-preview";
import {runCase} from "../../src/analysis";
import {runChat,checkToolCalling,toolCheckSignature} from "../../src/ai";
import {demoCatalog,planDemo,runDemo} from "../../src/demos";
import {capabilities} from "../../src/catalog";
import {rescoreDd} from "../../src/token-dd-runtime";
import {profileSchema,validateProviderUrl} from "../../src/provider";
import {AppError,errorData,now,type Data} from "../../src/shared";
import {BrowserLedger} from "./ledger";
import {BrowserVault,type Workspace} from "./vault";
import {clearCredentialIds} from "./config";

// AI hosts the serving origin relays because their CORS preflight fails; empty on static hosts.
let relayList:string[]=[];
const relayReady=fetch("relay-hosts.json",{credentials:"omit"}).then(r=>r.ok?r.json():null).then(j=>{relayList=Array.isArray(j?.hosts)?j.hosts.filter((h:unknown)=>typeof h==="string"):[];}).catch(()=>{});
export const relayHosts=()=>relayList;
const corsHelp="Check the URL and that the provider allows browser requests (CORS) from this site; if it does not, the site operator can enable the AI relay for it.";
async function providerFetch(resource:RequestInfo|URL,init?:RequestInit) {
  await relayReady;
  const url=new URL(resource instanceof Request?resource.url:String(resource));
  const target=url.protocol==="https:" && relayList.includes(url.host) ? `relay/${url.host}${url.pathname}` : resource;
  return fetch(target,{...init,credentials:"omit",referrerPolicy:"no-referrer",redirect:"error"});
}
type Stream = {onmessage: ((event:{data:string})=>void)|null; onerror:(()=>void)|null; close:()=>void};
export class BrowserRuntime {
  private ledger:BrowserLedger;
  private config:Data;
  private controller:AbortController|null=null;
  private activeId:string|null=null;
  private listeners=new Map<string,Set<Stream>>();
  private stopped=false;
  private toolChecks=new Map<string,{supported:boolean;message?:string}>();
  private task:Promise<void>|null=null;
  constructor(private state:Workspace,private vault:BrowserVault|null) {
    this.ledger=new BrowserLedger(state);
    this.config=structuredClone(state.config);
    for(const run of state.runs)if(run.status==="running"){
      run.status="interrupted";run.error={message:"The browser closed before this run finished. Charges for pending requests may be uncertain."};
    }
  }
  get persistent() {return !!this.vault;}
  private async persist() {if(this.stopped)throw new Error("Workspace is locked.");if(this.vault)await this.vault.save(this.state);}
  async close() {
    this.controller?.abort();
    try {await this.task;await this.persist();}
    finally {this.stopped=true;this.vault?.close();this.config={};this.state.config={};this.listeners.clear();clearCredentialIds();}
  }
  private get(id:string) {
    const run=this.state.runs.find(r=>r.id===id);
    if(!run)throw new AppError("RUN_NOT_FOUND","Saved run not found.");
    return {...run,cu:this.ledger.summary(id),saved:!!this.vault && !run.storageError};
  }
  private emit(id:string,type:string,data:Data) {
    for(const stream of this.listeners.get(id)??[])stream.onmessage?.({data:JSON.stringify({type,data})});
  }
  events(id:string):Stream {
    const stream:Stream={onmessage:null,onerror:null,close:()=>this.listeners.get(id)?.delete(stream)};
    if(!this.listeners.has(id))this.listeners.set(id,new Set());
    this.listeners.get(id)!.add(stream);
    queueMicrotask(()=>{const run=this.get(id);if(run.status!=="running")stream.onmessage?.({data:JSON.stringify({type:"done",data:run})});});
    return stream;
  }
  private safeConfig() {
    return {birdeyeConfigured:!!this.config.birdeyeApiKey,birdeyeSource:"browser",ai:{
      defaultProfile:this.config.ai.defaultProfile,
      profiles:Object.fromEntries(Object.entries(this.config.ai.profiles as Record<string,Data>).map(([name,{apiKey,...profile}])=>[name,{...profile,configured:!!apiKey}]))
    }};
  }
  private relayHost() {const profile=this.config.ai.profiles[this.config.ai.defaultProfile];const host=profile?new URL(profile.baseUrl).host:"";return relayList.includes(host)?host:null;}
  private toolCheck() {const profile=this.config.ai.profiles[this.config.ai.defaultProfile];return profile?this.toolChecks.get(toolCheckSignature(profile))??null:null;}
  private history() {return {items:this.state.runs.slice().reverse().map(r=>this.get(r.id)),nextCursor:null};}
  private thread(id?:string) {
    const items:Data[]=[],visited=new Set<string>();
    while(id && !visited.has(id) && items.length<20){
      visited.add(id);
      const run=this.state.runs.find(r=>r.id===id);if(!run)break;
      items.unshift(run);id=run.input?.parentId;
    }
    return items;
  }
  async request(path:string,input?:any):Promise<any> {
    if(this.stopped)throw new Error("Workspace is locked.");
    const route=path.split("?")[0];
    if(route==="/status")return {
      config:this.safeConfig(),configStorage:{path:this.vault?"Encrypted browser storage (IndexedDB)":"Browser memory · this tab only",persisted:!!this.vault},
      activeAiProfile:this.config.ai.defaultProfile,aiToolCheck:this.toolCheck(),aiRelayHost:this.relayHost(),capabilities:capabilities(),cases:workflowCatalog(),maxCu:null,short:true,
      active:!!this.activeId,activeRunId:this.activeId,usage:this.ledger.summary(),runs:this.history().items,historyNextCursor:null,initialId:null,
    };
    if(route==="/ai/check"){
      const profile=this.config.ai.profiles[this.config.ai.defaultProfile];
      if(!profile?.apiKey)throw new Error("Configure an AI endpoint, model and key first.");
      const result=await checkToolCalling(profile,{fetch:async(resource,init)=>{
        try {return await providerFetch(resource,init);}
        catch {throw new AppError("BROWSER_NETWORK_ERROR","Could not reach the AI provider. "+corsHelp);}
      }});
      this.toolChecks.set(toolCheckSignature(profile),result);return result;
    }
    if(route==="/connect")return {ok:true};
    if(route==="/initial")return {id:null};
    if(route==="/history")return this.history();
    if(route==="/knowledge")return {documents:0,sourceCommit:"browser",note:"Browser mode uses skill definitions and selected evidence; the local documentation index is not included."};
    if(route==="/plan")return previewCase(input);
    if(route==="/estimate")return planCase(input);
    if(route==="/demos")return {items:demoCatalog};
    if(route==="/demos/plan")return planDemo(input,true);
    if(route==="/settings"){
      if(this.activeId)throw new Error("Wait until the current run finishes.");
      const updated=structuredClone(this.config);
      if(input.birdeyeApiKey){if(typeof input.birdeyeApiKey!=="string"||input.birdeyeApiKey.length>4096)throw new Error("Invalid Birdeye key.");updated.birdeyeApiKey=input.birdeyeApiKey;}
      if(input.profile) {
        const profile=profileSchema.parse(input.profile);
        validateProviderUrl(profile.baseUrl);
        const name=input.profileName||"research",prior=updated.ai.profiles[name];
        profile.apiKey ||= prior && new URL(prior.baseUrl).origin===new URL(profile.baseUrl).origin ? prior.apiKey : undefined;
        updated.ai.profiles[name]=profile;updated.ai.defaultProfile=name;
      }
      if(input.persist && this.vault){
        const previous=this.state.config;this.state.config=updated;
        try{await this.persist();}catch(error){this.state.config=previous;throw error;}
      }
      this.config=updated;return this.safeConfig();
    }
    if(route==="/history/delete"){
      if(this.activeId)throw new Error("Stop the active run before deleting history.");
      if(input?.all!==true && typeof input?.id!=="string")throw new Error("Choose a saved run to delete.");
      this.state.runs=input.all?[]:this.state.runs.filter(r=>r.id!==input.id);
      await this.persist();return {ok:true};
    }
    if(route==="/rescore"){
      if(this.activeId)throw new Error("Wait until the current run finishes.");
      const {runId,...overrides}=input;
      const saved=rescoreDd(this.get(runId).result,overrides,this.ledger,{
        save:(value:Data)=>{this.state.runs.push({...value,savedAt:now()});},
        get:(id:string)=>this.get(id),
      });
      await this.persist();return saved;
    }
    if(route==="/runs")return this.start(input);
    const match=/^\/runs\/([^/]+)(?:\/(stop|thread))?$/.exec(route);
    if(match){
      if(match[2]==="stop"){if(this.activeId===match[1])this.controller?.abort();return {ok:true};}
      if(match[2]==="thread")return {messages:this.thread(match[1]).filter(r=>r.input.mode==="chat").map(r=>({id:r.id,question:r.input.question,answer:r.result?.data.answer,status:r.status,createdAt:r.createdAt,docSources:r.result?.data.docSources||[]})),truncated:false};
      return this.get(match[1]);
    }
    throw new Error("This operation is unavailable in browser mode.");
  }
  private async start(raw:Data) {
    if(this.activeId)throw new Error("A run is already active.");
    const input=structuredClone(raw),profile=this.config.ai.profiles[this.config.ai.defaultProfile];
    if(!["case","chat","demo","operation"].includes(input.mode))throw new Error("Unsupported run mode.");
    if(input.mode==="chat" && (!profile?.apiKey||typeof input.question!=="string"||!input.question.trim()||input.question.length>10000))throw new Error("Configure an AI endpoint, model and key, then enter a question.");
    if(input.mode!=="chat"||input.dataPolicy!=="saved-only")if(!this.config.birdeyeApiKey)throw new Error("Configure your Birdeye API key in Settings.");
    const demoPlan=input.mode==="demo"?planDemo(input.demo):null;
    const plan=demoPlan ?? (input.mode==="case"?planCase(input.case):null);
    if(input.mode==="case")input.case=plan!.input;
    if(input.mode==="demo")input.demo=demoPlan!.demoInput;
    if(input.mode==="chat"&&input.case)input.case=planCase(input.case).input;
    if(input.dataPolicy==="saved-only")input.maxCu=0;
    const id=this.ledger.createRun(input.maxCu??null,undefined,Math.max(20,(plan?.maxRequests??10)*2));
    const run:Data={id,title:demoPlan?.demo.title || input.question || workflowCatalog().find(c=>c.kind===input.case?.kind)?.title || input.query?.operation || "Research",input,status:"running",createdAt:now(),ai:{inputTokens:0,outputTokens:0,calls:0,unknownCalls:0},events:[]};
    this.state.runs.push(run);
    // Reserve the tab before awaiting persistence, preventing duplicate starts.
    this.activeId=id;this.controller=new AbortController();
    try {await this.persist();}catch(error){this.activeId=null;run.status="failed";throw error;}
    const signal=this.controller.signal;
    const progress=(stage:string,message:string)=>{
      const data={stage,message,cu:this.ledger.summary(id)};run.events.push({type:"progress",data});this.emit(id,"progress",data);
    };
    const allowedAi=profile?new URL(profile.baseUrl):null;
    const directFetch:typeof fetch=async(resource,init)=>{
      signal.throwIfAborted();
      const url=new URL(resource instanceof Request?resource.url:String(resource));
      const birdeye=url.origin==="https://public-api.birdeye.so";
      const ai=allowedAi && url.origin===allowedAi.origin && url.pathname.startsWith(allowedAi.pathname.replace(/\/+$/,"")+"/");
      if(!birdeye&&!ai)throw new Error("Provider URL is not allowed.");
      // Persist pending CU before sending a paid request. Failure stops dispatch.
      try {await this.persist();signal.throwIfAborted();}
      catch(error) {
        const pending=this.ledger.attempts(id).filter(a=>a.status==="pending").at(-1);
        if(pending)this.ledger.finish(pending.id,"not-sent");
        if(signal.aborted)throw error;
        throw new AppError("BROWSER_STORAGE_ERROR","Browser storage failed before sending the request. Free space or export your results before continuing.");
      }
      try {return await providerFetch(resource,init);}
      catch(error) {if(signal.aborted)throw error;throw new AppError("BROWSER_NETWORK_ERROR","Could not reach the provider. Check your connection. "+corsHelp);}
    };
    const runner=new Runner(this.ledger,this.config.birdeyeApiKey||"",{fetch:directFetch,retries:0});
    const evidence=(result:Data)=>{run.result=result;};
    this.task=(async()=>{
      try {
        if(input.mode==="demo")run.result=await runDemo(runner,id,input.demo,signal,progress,evidence);
        else if(input.mode==="case")run.result=await runCase(runner,id,input.case,signal,progress,evidence);
        else if(input.mode==="operation")run.result=await runner.execute(input.query.operation,input.query.params,{run:id,signal});
        else {
          const parent=input.parentId?this.get(input.parentId):undefined;
          run.result=await runChat(runner,id,profile,input.question,{
            signal,short:input.short,fetch:directFetch,usage:run.ai,progress,evidence,
            dataPolicy:input.dataPolicy||"live",
            workflow:input.workflowKind?{kind:input.workflowKind,input:input.case}:undefined,
            savedRunId:parent?.id,savedSources:parent?.result?(parent.result.meta.operation==="analysis"?parent.result.data.sources||[]:[parent.result]):[],
            history:this.thread(input.parentId).slice(-3).filter(r=>r.result).flatMap(r=>[{role:"user",content:r.input.question||r.title},{role:"assistant",content:JSON.stringify({answer:r.result.data.answer,metrics:r.result.data.metrics}).slice(0,18000)}]),
          });
        }
        run.status=run.result.meta.coverage==="partial"?"partial":"completed";
      }catch(error){run.status=signal.aborted?"cancelled":"failed";run.error=errorData(error);}
      finally {
        run.savedAt=now();
        try{await this.persist();}catch{run.storageError="Could not save this result. Export it before closing the tab.";}
        this.activeId=null;this.controller=null;
        this.emit(id,"done",this.get(id));
      }
    })();
    return {id};
  }
}
let runtime:BrowserRuntime|null=null;
export function setRuntime(value:BrowserRuntime|null) {runtime=value;}
export function getRuntime() {if(!runtime)throw new Error("Unlock the browser workspace first.");return runtime;}
