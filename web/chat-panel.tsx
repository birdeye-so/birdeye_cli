import React, {useEffect,useRef} from "react";
import {AddressText} from "./address-text";
import {MarkdownText} from "./markdown-text";
type Data=Record<string,any>;
export function ChatPanel({messages,question,change,live,setLive,busy,saved,knowledge,workflow}: {
  messages:Data[];question:string;change:(value:string)=>void;live:boolean;setLive:(value:boolean)=>void;
  busy:boolean;saved?:Data|null;knowledge:Data|null;
  workflow?: {title:string;address?:string;ready:boolean};
}) {
  const log=useRef<HTMLDivElement>(null);
  const sources = saved?.result ? (saved.result.meta.operation === "analysis" ? saved.result.data.sources || [] : [saved.result]) : [];
  const dates = sources.map((s:Data)=>s.meta.retrievedAt).filter(Boolean).sort();
  useEffect(()=>{if(log.current)log.current.scrollTop=log.current.scrollHeight;},[messages]);
  return <section className="chat-panel" aria-label="AI research chat">
    <h2>Research with AI</h2>
    <p className="field-hint">{knowledge ? `${knowledge.documents} local documents · snapshot ${knowledge.sourceCommit.slice(0,8)}` : "Loading local documentation…"}. AI can run existing workflows, call data tools and analyze the evidence.</p>
    <div className="chat-context">
      {workflow && <p><strong>Workflow: {workflow.title}</strong>{workflow.address && <> · <AddressText text={workflow.address} /></>}<br />{workflow.ready ? "AI has the selected inputs and API-step settings." : "AI can help complete the required inputs before running this workflow."}</p>}
      <strong>{sources.length ? "Saved data attached" : saved ? "Saved conversation attached" : "Documentation context"}</strong>
      <p>{saved ? <><AddressText text={saved.title} />{dates.length ? <> · source data collected {new Date(dates[0]).toLocaleString()}{dates.at(-1)!==dates[0] ? ` – ${new Date(dates.at(-1)).toLocaleString()}` : ""}</> : " · no API datasets attached"}</> : "Run a workflow or open History to attach previously collected datasets."}</p>
      <label className="check"><input type="checkbox" checked={live} disabled={busy} onChange={e=>setLive(e.target.checked)} />Allow new Birdeye requests</label>
      <p className="field-hint">{live ? "AI can call tools and run workflows for your research. Catalog calls use the CU limit below; MCP costs are unknown. AI provider tokens also apply." : "Uses saved data and docs only: 0 new Birdeye CU. AI provider tokens still apply."}</p>
    </div>
    <div className="chat-transcript" ref={log} role="log" aria-label="Conversation" aria-live="polite">
      {messages.length ? messages.map(m=><article className="chat-turn" key={m.id}>
        <div className="chat-question"><strong>You</strong><p><AddressText text={m.question || ""} /></p></div>
        <div className="chat-answer"><strong>AI</strong><MarkdownText text={m.answer || (m.status === "running" ? "Researching…" : "No answer was completed. Inspect the run details below.")} />
          {!!m.docSources?.length && <details><summary>Documentation consulted · {m.docSources.length}</summary><ul>{m.docSources.map((d:Data)=><li key={d.id}>{typeof d.source === "string" && d.source.startsWith("https://docs.birdeye.so/") ? <a href={d.source} target="_blank" rel="noreferrer">{d.title}</a> : <span>{d.title}</span>} <code>{d.id}</code></li>)}</ul></details>}
        </div>
      </article>) : <p className="chat-empty">Ask about a saved result, compare available evidence, or design a workflow using Birdeye APIs.</p>}
    </div>
    <label htmlFor="question">Your research question</label>
    <textarea id="question" value={question} onChange={e=>change(e.target.value)} placeholder="Research the selected workflow, reuse available evidence and fetch any missing data…" rows={3} required disabled={busy} />
  </section>;
}
