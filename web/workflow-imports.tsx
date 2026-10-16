import React,{useEffect,useState} from "react";
import {AddressText} from "./address-text";
type Data=Record<string,any>;
const editable=(step:Data)=>Object.fromEntries(Object.entries(step.params).filter(([key])=>!step.lockedParams.includes(key)));
export function WorkflowImportsPanel({api,busy,budget,setBudget,run}:{api:(path:string,input?:unknown)=>Promise<Data>;busy:boolean;budget:number;setBudget:(n:number)=>void;run:(id:string,params:Data)=>Promise<void>}) {
  const [items,setItems]=useState<Data[]>([]),[selected,setSelected]=useState(""),[record,setRecord]=useState<Data|null>(null);
  const [sourceType,setSourceType]=useState("github"),[url,setUrl]=useState("https://github.com/GMGNAI/gmgn-skills/tree/main/docs"),[name,setName]=useState("workflow.md"),[content,setContent]=useState("");
  const [address,setAddress]=useState(""),[parameters,setParameters]=useState('{"limit":3}'),[edits,setEdits]=useState<Record<string,string>>({});
  const [working,setWorking]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState(""),[planned,setPlanned]=useState<Data|null>(null);
  const disabled=working||busy;
  async function list(){const value=await api("/workflow-imports");setItems(value.items);return value.items;}
  useEffect(()=>{void list().catch(e=>setError(e.message));},[]);
  async function choose(id:string) {setWorking(true);setError("");setPlanned(null);setRecord(null);setSelected(id);setEdits({});setAddress("");setParameters('{"limit":3}');try{setRecord(await api(`/workflow-imports/${id}`));}catch(e:any){setError(e.message);}finally{setWorking(false);}}
  function inputs(){const input=JSON.parse(parameters);if(!input||typeof input!=="object"||Array.isArray(input))throw new Error("Runtime parameters must be a JSON object.");return {...input,...(address.trim()?{address:address.trim()}:{}),stepOverrides:{...input.stepOverrides,...Object.fromEntries(Object.entries(edits).map(([id,text])=>[id,JSON.parse(text)]))}};}
  async function importSource(e:React.FormEvent) {e.preventDefault();setWorking(true);setError("");setNotice("");try{const value=await api("/workflow-imports",sourceType==="github"?{url}:{name,content});await list();setNotice(`Imported ${value.items.length} document(s). Import and planning use 0 Birdeye CU.`);if(value.items[0])await choose(value.items[0].id);}catch(e:any){setError(e.message);}finally{setWorking(false);}}
  async function plan(){setWorking(true);setError("");try{const input=inputs(),value=await api(`/workflow-imports/${selected}/plan`,input);setRecord(value);setPlanned(value.plan?.needsAddress?null:input);}catch(e:any){setError(e.message);setPlanned(null);}finally{setWorking(false);}}
  return <div className="workflow-imports">
    <div className="page-heading"><h1>Import workflows</h1><p>Map source research workflows to documented Birdeye APIs. Review changes in scope before running.</p></div>
    {error&&<p className="notice error" role="alert">{error}</p>}{notice&&<p className="notice" role="status">{notice}</p>}
    <form onSubmit={importSource} className="import-source">
      <label>Source<select value={sourceType} disabled={disabled} onChange={e=>setSourceType(e.target.value)}><option value="github">GitHub repository or Markdown file</option><option value="text">Upload or paste Markdown / workflow JSON</option></select></label>
      {sourceType==="github"?<label>GitHub URL<input type="url" required value={url} disabled={disabled} onChange={e=>setUrl(e.target.value)} /></label>:<>
        <label>Upload file<input type="file" accept=".md,.mdx,.json" disabled={disabled} onChange={async e=>{const file=e.target.files?.[0];if(!file)return;if(file.size>256000){setError("File exceeds 256 KB.");return;}setName(file.name);setContent(await file.text());}} /></label>
        <label>Source filename<input required value={name} disabled={disabled} onChange={e=>setName(e.target.value)} /></label>
        <label>Markdown or Birdeye workflow JSON<textarea required rows={8} value={content} disabled={disabled} onChange={e=>setContent(e.target.value)} /></label>
      </>}
      <button type="submit" className="primary" disabled={disabled}>{working?"Working…":"Import source"}</button>
      <p className="field-hint">Known GMGN documents become adapted recipes. Other Markdown yields endpoint candidates; JSON defines new executable steps. Source code is never executed.</p>
    </form>
    <label>Saved imports<select value={selected} disabled={disabled} onChange={e=>void choose(e.target.value)}><option value="" disabled>Choose an imported workflow</option>{items.map(item=><option key={item.id} value={item.id}>{item.title}{item.executable?"":" · needs mapping"}</option>)}</select></label>
    {!items.length&&<p className="field-hint">No imported workflows yet. Import a source to inspect its mapping.</p>}
    {record&&<section className="import-review" aria-label="Workflow migration review">
      <h2>{record.title}</h2><p>{record.purpose}</p><p className="field-hint">Adapter: {record.adapter} · Solana · imported {new Date(record.createdAt).toLocaleString()}</p>
      <details className="source"><summary>Source provenance</summary><p>{record.source.origin}</p><code>SHA-256: {record.source.sha256}</code></details>
      {record.notes.length>0&&<div className="warnings"><h3>Migration differences</h3><ul>{record.notes.map((note:string,i:number)=><li key={i}>{note}</li>)}</ul></div>}
      {record.mapping.length>0&&<details className="source" open><summary>Source commands → Birdeye mapping</summary>{record.mapping.map((m:Data,i:number)=><div className="import-mapping" key={i}><code>{m.command}</code><p><strong>{m.status}</strong>{m.operation?` · ${m.operation} · ${m.method} ${m.path}`:""}</p><p className="field-hint">{m.note}</p>{m.docs&&<a href={m.docs} target="_blank" rel="noopener noreferrer">Endpoint documentation</a>}</div>)}</details>}
      {record.plan?<>
        <div className="form-grid"><label>Token / wallet address<input value={address} disabled={disabled||!record.plan.usesAddressInput} placeholder={record.plan.usesAddressInput?"Required when the workflow uses an address":"Uses fixed addresses or earlier step results"} onChange={e=>{setAddress(e.target.value);setPlanned(null);}} /></label><label>CU limit<input type="number" min={0} max={100000} value={budget} disabled={disabled} onChange={e=>setBudget(Number(e.target.value))} /></label></div>
        {!record.plan.usesAddressInput&&<p className="field-hint">This workflow does not use a shared address input. Review or edit fixed addresses in the step parameters below.</p>}
        <label>Runtime parameters (JSON)<textarea rows={3} value={parameters} disabled={disabled} onChange={e=>{setParameters(e.target.value);setPlanned(null);}} /></label>
        <p className="field-hint">Optional from/to Unix timestamps, limit (1–5), and stepOverrides. Default observation window for custom steps is the last 24 hours.</p>
        <h3>Executable steps</h3>
        {record.plan.steps.map((step:Data)=><details className="source" key={step.id}><summary>{step.id} · {step.operation} · {step.cost} CU/request{step.subjects?` × up to ${step.subjects.take}`:""}</summary><p>{step.purpose||step.description}</p><code>{step.method} {step.path}</code><p><a href={step.docs} target="_blank" rel="noopener noreferrer">Birdeye docs</a></p>{Object.entries(step.subjectParameters).map(([key,value])=><p key={key}>{key}: <AddressText text={String(value)} /> · {step.lockedParams.includes(key)?"workflow input":"fixed step parameter"}</p>)}{step.subjects&&<p className="field-hint">{step.subjects.kind} subjects from {step.subjects.from.join(", ")} in provider order.</p>}<label>Step parameters (JSON)<textarea rows={5} disabled={disabled} value={edits[step.id]??JSON.stringify(editable(step),null,2)} onChange={e=>{setEdits({...edits,[step.id]:e.target.value});setPlanned(null);}} /></label><details><summary>Accepted API parameters</summary><pre>{JSON.stringify(step.inputSchema,null,2)}</pre></details></details>)}
        <p><strong>{record.plan.estimatedCu} estimated CU</strong> before retries · at most {record.plan.maxRequests} requests</p>
        {record.plan.needsAddress&&<p className="field-hint">Enter an address and preview to prepare executable input.</p>}
        <div className="form-actions"><button type="button" className="secondary" disabled={disabled} onClick={()=>void plan()}>Preview mapping & CU</button><button type="button" className="primary" disabled={disabled||!planned} onClick={async()=>{setWorking(true);setError("");try{await run(selected,planned!);}catch(e:any){setError(e.message);}finally{setWorking(false);}}}>Run imported workflow</button></div>
        <p className="field-hint">Run calls Birdeye within the CU limit and saves results to History. No AI provider is required.</p>
      </>:<p className="notice">Review-only source. Use its endpoint candidates to author a Birdeye workflow JSON; no API calls can run from this document.</p>}
    </section>}
  </div>;
}
