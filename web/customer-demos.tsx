import React,{useEffect,useRef,useState} from "react";
import {AddressText} from "./address-text";
import {DemoView} from "./demo-views";
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
  const previewButton=useRef<HTMLButtonElement>(null);
  currentKey.current=inputKey;
  useEffect(()=>()=>{currentKey.current="unmounted";},[]);
  const ready=plan?.inputKey===inputKey;
  useEffect(()=>{let cancelled=false;void api("/demos").then(r=>{if(!cancelled)setItems(r.items);}).catch(e=>{if(!cancelled)setError(e.message);});return()=>{cancelled=true;};},[]);
  useEffect(()=>{if(run?.input?.mode==="demo"){setInput({...run.input.demo,from:undefined,to:undefined});setPlan(null);setError("");}},[run?.id]);
  const definition=items.find(d=>d.id===input.id),disabled=busy||working;
  const walletDemo=input.id==="wallet-intelligence",walletDiscovery=walletDemo&&!input.address;
  const relevant=run?.input?.mode==="demo" && run.input.demo?.id===input.id && !(walletDiscovery && run.input.demo.address)?run:null;
  const report=relevant?.result?.data?.demo;
  function edit(values:Data){setInput(previous=>({...previous,...values,from:undefined,to:undefined}));setPlan(null);setError("");}
  function selectWallet(address:string){edit({address});previewButton.current?.focus();}
  async function preview(e:React.FormEvent){e.preventDefault();const key=inputKey;setWorking(true);setError("");setPlan(null);try{const value=await api("/demos/plan",input);if(currentKey.current===key)setPlan({...value,inputKey:key});}catch(e:any){if(currentKey.current===key)setError(e.message);}finally{if(currentKey.current===key)setWorking(false);}}
  return <div className="customer-demos">
    <div className="page-heading"><h1>Customer demos</h1><p>Explore market, portfolio and risk data in working product views. Snapshots are saved locally.</p></div>
    {error&&<p className="notice error" role="alert">{error}</p>}
    <nav className="demo-navigation" aria-label="Product use case">{items.map(d=><button key={d.id} type="button" disabled={disabled} aria-pressed={input.id===d.id} onClick={()=>{setInput({id:d.id,limit:3,minLiquidity:100000,maxTop10Pct:50});setPlan(null);setError("");}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={demoIcons[d.id]}/></svg>{d.title}</button>)}</nav>
    {!items.length&&!error&&<p role="status">Loading demo workflows…</p>}
    {definition&&<>
      <section className="demo-purpose"><h2>{definition.title}</h2><p>{definition.purpose}</p><details><summary>Use case and data coverage</summary><dl><dt>For</dt><dd>{definition.audience}</dd><dt>Use the result to</dt><dd>{definition.decision}</dd><dt>What you get</dt><dd>{definition.output}</dd></dl><p className="field-hint">{definition.limitation}</p></details></section>
      {walletDemo&&<div className="demo-wallet-steps"><button className="secondary" type="button" disabled={disabled} aria-pressed={walletDiscovery} onClick={()=>edit({address:undefined})}>1. Discover smart wallets</button><span className={!walletDiscovery?"active":""}>2. Analyze selected wallet</span><p className="field-hint">Discovery and wallet analysis are separate saved runs. Reopen the discovery run in History to select another wallet.</p></div>}
      <form className="demo-run-form" onSubmit={preview}>
        {walletDemo&&input.address&&<div className="demo-selected-wallet" role="status"><strong>Selected wallet</strong><p><AddressText text={input.address}/></p><p className="field-hint">Preview the analysis cost below, then run to fetch this wallet’s 7d/30d PnL and holdings.</p></div>}
        {definition.subject!=="none"&&<label>{definition.subject==="wallet"?"Wallet address":"Token address"}<input value={input.address||""} disabled={disabled} onChange={e=>edit({address:e.target.value.trim()})} spellCheck={false} placeholder="Paste a Solana address" /></label>}
        <div className="form-grid">
          {(input.id==="terminal"||walletDiscovery)&&<label>{walletDiscovery?"Maximum tokens / wallets":"Maximum tokens"}<input type="number" min={1} max={5} value={input.limit} disabled={disabled} onChange={e=>edit({limit:Number(e.target.value)})} /></label>}
          {input.id==="security-signals"&&<><label>Minimum liquidity · USD<input type="number" min={0} value={input.minLiquidity} disabled={disabled} onChange={e=>edit({minLiquidity:Number(e.target.value)})} /></label><label>Maximum top-10 accounts · %<input type="number" min={0} max={100} step="any" value={input.maxTop10Pct} disabled={disabled} onChange={e=>edit({maxTop10Pct:Number(e.target.value)})} /></label></>}
          <label>CU limit per run<input type="number" min={0} max={100000} value={budget} disabled={disabled} onChange={e=>setBudget(Number(e.target.value))} /></label>
        </div>
        <div className="form-actions"><button ref={previewButton} className="secondary" disabled={disabled}>{working?"Preparing…":"Preview APIs & CU"}</button><button type="button" className="primary" disabled={disabled||!ready||plan?.needsAddress||!Number.isInteger(budget)||budget<(plan?.estimatedCu??Infinity)} onClick={async()=>{if(!ready||currentKey.current!==plan?.inputKey)return;setWorking(true);setError("");try{await start(plan!.demoInput);}catch(e:any){setError(e.message);}finally{setWorking(false);}}}>Run live snapshot</button></div>
        {ready&&<p className="demo-plan-cost"><strong>{plan!.estimatedCu} estimated CU</strong> · at most {plan!.maxRequests} requests before retries{plan!.needsAddress?" · address required":""}</p>}
        <p className="field-hint">Preview: 0 CU. Run: a new API snapshot. CU estimates exclude retries and are not confirmed billing.</p>
      </form>

    </>}
    {!report&&definition&&<DemoView key={input.id} id={input.id} />}
    {relevant&&<section className="demo-result" aria-label="Demo result">
      <div className="section-title"><h2>{relevant.title} · result</h2><span className="badge">{relevant.status}</span></div>
      <p className="field-hint">Result from {new Date(relevant.createdAt).toLocaleString()}{relevant.input.demo.address?<> · <AddressText text={relevant.input.demo.address} /></>:null}. Editing the form does not change this snapshot.</p>
      <div className="run-usage"><span>{relevant.cu?.estimated??"Unknown"} estimated CU</span><span>{relevant.cu?.attempts??0} API attempts</span><span>{relevant.cu?.uncertainAttempts??0} uncertain attempts</span></div>
      {relevant.status==="running"&&<div className="form-actions"><p role="status">{progress||"Fetching evidence…"}</p><button type="button" className="secondary" onClick={()=>void api(`/runs/${relevant.id}/stop`,{}).catch(e=>setError(e.message))}>Stop run</button></div>}
      {relevant.error&&<p className="notice error" role="alert">{relevant.error.message}</p>}
      {relevant.storageError&&<p className="notice error" role="alert">{relevant.storageError}</p>}
      {relevant.saved&&<p className="notice">{relevant.fromStorage?"Reused saved result":"Saved to SQLite"}. Reopening and exporting use 0 additional CU. Costs above belong to this run.</p>}
      {report&&<>
        <p>Coverage: <strong>{report.coverage}</strong>{report.signalState?<> · Rule outcome: <strong>{report.signalState}</strong></>:null}</p>
        <p className="field-hint">{report.limitation}</p>
        <DemoView key={relevant.id} id={input.id} report={report} onExportMessage={()=>download(report.message,`birdeye-brief-${relevant.id}.txt`,"text/plain")} onSelectWallet={selectWallet} selectedWallet={input.address} busy={disabled} />
        {(relevant.result.data.missing||[]).length>0&&<div className="warnings"><h3>Missing evidence</h3><ul>{relevant.result.data.missing.map((m:Data,i:number)=><li key={i}>{m.step||m.operation}: {m.reason||m.message}</li>)}</ul></div>}
        <details className="source"><summary>Saved input, full sources and calculation notes</summary><pre><AddressText text={JSON.stringify({input:relevant.input,result:relevant.result},null,2)} /></pre></details>
        <button type="button" className="secondary" onClick={()=>download(relevant.result,`birdeye-demo-${relevant.id}.json`)}>Export evidence JSON</button>
      </>}
    </section>}
    {definition&&<>
      {plan&&ready&&<section className="demo-plan" aria-label="Demo API plan"><p><strong>{plan.estimatedCu} estimated CU</strong> before retries · at most {plan.maxRequests} requests · {plan.kind}</p>
        {plan.needsAddress&&<p className="notice">Enter a {definition.subject} address and preview again before running.</p>}
        {budget<plan.estimatedCu&&<p className="notice">The planned scope exceeds your CU limit. Increase the budget or reduce the number of tokens.</p>}
        <details className="source"><summary>API steps and purpose · {plan.steps.length}</summary><ol>{plan.steps.map((s:Data)=><li key={s.id}><strong>{s.title||s.id}</strong><p>{s.purpose||s.description}</p><code>{s.method} {s.path}</code><p className="field-hint">{s.cuPerRequest} CU/request{s.subjects?` · up to ${s.subjects.take} subjects from ${s.subjects.from.join(", ")}`:""}</p><pre><AddressText text={JSON.stringify(s.params,null,2)} /></pre></li>)}</ol></details>
        <details className="source"><summary>Use this demo from your application</summary><p>Invoke the CLI and read JSON from stdout. Keep credentials on the machine running the CLI; a new invocation makes new API requests.</p><pre>{`birdeye-cli demo ${input.id}${plan.demoInput.address?` --address ${plan.demoInput.address}`:""}${input.id==="terminal"||walletDiscovery?` --limit ${plan.demoInput.limit}`:""}${input.id==="security-signals"?` --min-liquidity ${plan.demoInput.minLiquidity} --max-top10-pct ${plan.demoInput.maxTop10Pct}`:""} --max-cu ${budget}`}</pre><p className="field-hint">Data lives in data.demo; full evidence remains in data.sources. History export reuses an existing snapshot without requests.</p></details>
      </section>}
    </>}
  </div>;
}
