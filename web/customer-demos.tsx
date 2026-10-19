import React,{useEffect,useRef,useState} from "react";
import {AddressText} from "./address-text";
import {DemoView} from "./demo-views";
import {CliPreview} from "./cli-preview";
import {demoCliArgs} from "../src/cli-preview";
type Data=Record<string,any>;
function download(value:unknown,name:string,type="application/json") {
  const url=URL.createObjectURL(new Blob([typeof value==="string"?value:JSON.stringify(value,null,2)],{type}));
  const a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
const demoIcons:Record<string,string>={terminal:"M3 4h18v16H3z M3 9h18 M9 9v11", "dex-inspector":"M4 8h15m-4-4 4 4-4 4 M20 16H5m4-4-4 4 4 4", "wallet-intelligence":"M3 6h18v14H3z M3 6l14-3v3 M16 11h5v5h-5z", "security-signals":"m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z M12 8v5 M12 16v1", "telegram-brief":"m3 10 18-7-6 18-4-7-8-4Z M11 14l10-11"};
export function CustomerDemos({api,busy,budget,setBudget,run,progress,start}:{api:(path:string,input?:unknown)=>Promise<Data>;busy:boolean;budget:number;setBudget:(n:number)=>void;run:Data|null;progress:string;start:(input:Data)=>Promise<void>}) {
  const [items,setItems]=useState<Data[]>([]),[input,setInput]=useState<Data>({id:"terminal",limit:3,minLiquidity:100000,maxTop10Pct:50}),[plan,setPlan]=useState<Data|null>(null);
  const [working,setWorking]=useState(false),[error,setError]=useState("");
  const inputKey=JSON.stringify(input),currentKey=useRef(inputKey);
  const runButton=useRef<HTMLButtonElement>(null),submission=useRef(0),pending=useRef(false);
  currentKey.current=inputKey;
  useEffect(()=>()=>{currentKey.current="unmounted";submission.current++;},[]);
  const ready=plan?.inputKey===inputKey;
  useEffect(()=>{let cancelled=false;void api("/demos").then(r=>{if(!cancelled)setItems(r.items);}).catch(e=>{if(!cancelled)setError(e.message);});return()=>{cancelled=true;};},[]);
  useEffect(()=>{submission.current++;pending.current=false;setWorking(false);if(run?.input?.mode==="demo"){setInput({...run.input.demo,from:undefined,to:undefined});setPlan(null);setError("");}},[run?.id]);
  const definition=items.find(d=>d.id===input.id),disabled=busy||working;
  const walletDemo=input.id==="wallet-intelligence",walletDiscovery=walletDemo&&!input.address;
  const relevant=run?.input?.mode==="demo" && run.input.demo?.id===input.id && !(walletDiscovery && run.input.demo.address)?run:null;
  const report=relevant?.result?.data?.demo;
  function edit(values:Data){setInput(previous=>({...previous,...values,from:undefined,to:undefined}));setPlan(null);setError("");}
  function selectWallet(address:string){edit({address});runButton.current?.focus();}
  async function createDraft(e:React.FormEvent) {
    e.preventDefault();
    if(busy||pending.current)return;
    if(!Number.isInteger(budget)||budget<0||budget>100000){setError("CU limit must be an integer from 0 to 100000.");return;}
    const key=inputKey,id=++submission.current;
    pending.current=true;setWorking(true);setError("");setPlan(null);
    try {
      const value=await api("/demos/plan",input);
      if(submission.current!==id||currentKey.current!==key)return;
      setPlan({...value,inputKey:key});
      if(value.needsAddress){setError("Enter a token or wallet address.");return;}
      if(!Number.isFinite(value.estimatedCu)||value.estimatedCu>budget){setError(`Draft needs ${value.estimatedCu} estimated CU; your limit is ${budget}.`);return;}
      await start(value.demoInput);
    } catch(e:any) {if(submission.current===id&&currentKey.current===key)setError(e.message);}
    finally {if(submission.current===id){pending.current=false;setWorking(false);}}
  }
  return <div className="customer-demos">
    <div className="page-heading"><h1>Demos</h1></div>
    {error&&<p className="notice error" role="alert">{error}</p>}
    <nav className="demo-navigation" aria-label="Product use case">{items.map(d=><button key={d.id} type="button" disabled={disabled} aria-pressed={input.id===d.id} onClick={()=>{setInput({id:d.id,limit:3,minLiquidity:100000,maxTop10Pct:50});setPlan(null);setError("");}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={demoIcons[d.id]}/></svg>{d.title}</button>)}</nav>
    {!items.length&&!error&&<p role="status">Loading demo workflows…</p>}
    {definition&&<>
      <section className="demo-purpose"><details><summary>Details</summary><p>{definition.purpose}</p><dl><dt>For</dt><dd>{definition.audience}</dd><dt>Use the result to</dt><dd>{definition.decision}</dd><dt>What you get</dt><dd>{definition.output}</dd></dl><p className="field-hint">{definition.limitation}</p></details></section>
      {walletDemo&&<div className="demo-wallet-steps"><button className="secondary" type="button" disabled={disabled} aria-pressed={walletDiscovery} onClick={()=>edit({address:undefined})}>1. Discover smart wallets</button><span className={!walletDiscovery?"active":""}>2. Analyze selected wallet</span></div>}
      <form className="demo-run-form" onSubmit={createDraft}>
        {walletDemo&&input.address&&<div className="demo-selected-wallet" role="status"><strong>Selected wallet</strong><p><AddressText text={input.address} kind="wallet" chain={input.chain}/></p></div>}
        {definition.subject!=="none"&&<label>{definition.subject==="wallet"?"Wallet address":"Token address"}<input required value={input.address||""} disabled={disabled} onChange={e=>edit({address:e.target.value.trim()})} spellCheck={false} placeholder="Paste a Solana address" /></label>}
        <div className="form-grid">
          {(input.id==="terminal"||walletDiscovery)&&<label>{walletDiscovery?"Maximum tokens / wallets":"Maximum tokens"}<input type="number" min={1} max={5} value={input.limit} disabled={disabled} onChange={e=>edit({limit:Number(e.target.value)})} /></label>}
          {input.id==="security-signals"&&<><label>Minimum liquidity · USD<input type="number" min={0} value={input.minLiquidity} disabled={disabled} onChange={e=>edit({minLiquidity:Number(e.target.value)})} /></label><label>Maximum top-10 accounts · %<input type="number" min={0} max={100} step="any" value={input.maxTop10Pct} disabled={disabled} onChange={e=>edit({maxTop10Pct:Number(e.target.value)})} /></label></>}
          <label>CU limit per run<input type="number" min={0} max={100000} value={budget} disabled={disabled} onChange={e=>setBudget(Number(e.target.value))} /></label>
        </div>
        <div className="form-actions"><button ref={runButton} type="submit" className="primary" disabled={disabled}>{working||busy?"Running…":"Create draft"}</button></div>
        {ready&&<p className="demo-plan-cost"><strong>{plan!.estimatedCu} estimated CU</strong> · at most {plan!.maxRequests} requests before retries{plan!.needsAddress?" · address required":""}</p>}

      </form>

    </>}
    {definition&&<CliPreview args={(!definition.subject || definition.subject==="none" || input.address) && Number.isInteger(budget) && budget>=0 && budget<=100000 ? demoCliArgs(ready?plan!.demoInput:input,budget) : null} />}
    {!report&&definition&&<p className="demo-empty">Create a draft to view results.</p>}
    {relevant&&<section className="demo-result" aria-label="Demo result">
      <div className="section-title"><h2>{relevant.title} · result</h2><span className="badge">{relevant.status}</span></div>
      <p className="field-hint">Result from {new Date(relevant.createdAt).toLocaleString()}{relevant.input.demo.address?<> · <AddressText text={relevant.input.demo.address} kind={relevant.input.demo.id==="wallet-intelligence"?"wallet":"token"} chain={relevant.input.demo.chain} /></>:null}</p>
      <div className="run-usage"><span>{relevant.cu?.estimated??"Unknown"} estimated CU</span><span>{relevant.cu?.attempts??0} API attempts</span>{!!relevant.cu?.uncertainAttempts&&<span>{relevant.cu.uncertainAttempts} uncertain</span>}</div>
      {relevant.status==="running"&&<div className="form-actions"><p role="status">{progress||"Fetching evidence…"}</p><button type="button" className="secondary" onClick={()=>void api(`/runs/${relevant.id}/stop`,{}).catch(e=>setError(e.message))}>Stop run</button></div>}
      {relevant.error&&<p className="notice error" role="alert">{relevant.error.message}</p>}
      {relevant.storageError&&<p className="notice error" role="alert">{relevant.storageError}</p>}

      {report&&<>
        <span className="badge">{report.coverage}</span>
        <DemoView key={relevant.id} id={input.id} report={report} onExportMessage={()=>download(report.message,`birdeye-brief-${relevant.id}.txt`,"text/plain")} onSelectWallet={selectWallet} selectedWallet={input.address} busy={disabled} />
        {(relevant.result.data.missing||[]).length>0&&<details className="source"><summary>Missing evidence · {relevant.result.data.missing.length}</summary><ul>{relevant.result.data.missing.map((m:Data,i:number)=><li key={i}>{m.step||m.operation}: {m.reason||m.message}</li>)}</ul></details>}
        <details className="source"><summary>Sources & details</summary><p>{report.limitation}</p><pre><AddressText text={JSON.stringify({input:relevant.input,result:relevant.result},null,2)} /></pre></details>
        <button type="button" className="secondary" onClick={()=>download(relevant.result,`birdeye-demo-${relevant.id}.json`)}>Export evidence JSON</button>
      </>}
    </section>}
    {definition&&<>
      {plan&&ready&&<section className="demo-plan" aria-label="Demo API plan">
        <details className="source"><summary>API steps and purpose · {plan.steps.length}</summary><ol>{plan.steps.map((s:Data)=><li key={s.id}><strong>{s.title||s.id}</strong><p>{s.purpose||s.description}</p><code>{s.method} {s.path}</code><p className="field-hint">{s.cuPerRequest} CU/request{s.subjects?` · up to ${s.subjects.take} subjects from ${s.subjects.from.join(", ")}`:""}</p><pre><AddressText text={JSON.stringify(s.params,null,2)} /></pre></li>)}</ol></details>
      </section>}
    </>}
  </div>;
}
