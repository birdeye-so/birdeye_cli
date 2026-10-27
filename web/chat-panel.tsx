import {browserStorage} from "./storage-gate";
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
    <div className="chat-context">
      {workflow && <p><strong>{workflow.title}</strong>{workflow.address && <> · <AddressText text={workflow.address} compact /></>}{!workflow.ready&&<span className="badge">Inputs incomplete</span>}</p>}
      <label className="check"><input type="checkbox" checked={live} disabled={busy} onChange={e=>setLive(e.target.checked)} />Allow new Birdeye requests</label>
      <span className="field-hint">{live?(browserStorage?"Birdeye CU and AI tokens billed by your providers":"MCP cost unknown · AI tokens billed separately"):"Saved data only · 0 new CU"}</span>
      <details className="source"><summary>Context{sources.length?` · ${sources.length} datasets`:""}</summary>
        {saved&&<p><AddressText text={saved.title}/></p>}
        {dates.length>0&&<p>{new Date(dates[0]).toLocaleString()}{dates.at(-1)!==dates[0]?` – ${new Date(dates.at(-1)).toLocaleString()}`:""}</p>}
        <p>{knowledge?`${knowledge.documents} documents · ${knowledge.sourceCommit.slice(0,8)}`:"Loading documentation…"}</p>
      </details>
    </div>
    <div className="chat-transcript" ref={log} role="log" aria-label="Conversation" aria-live="polite">
      {messages.length ? messages.map(m=><article className="chat-turn" key={m.id}>
        <div className="chat-question"><strong>You</strong><p><AddressText text={m.question || ""} /></p></div>
        <div className="chat-answer"><strong>AI</strong><MarkdownText text={m.answer || (m.status === "running" ? "Researching…" : "No answer was completed. Inspect the run details below.")} />
          {!!m.docSources?.length && <details><summary>Documentation consulted · {m.docSources.length}</summary><ul>{m.docSources.map((d:Data)=><li key={d.id}>{typeof d.source === "string" && d.source.startsWith("https://docs.birdeye.so/") ? <a href={d.source} target="_blank" rel="noreferrer">{d.title}</a> : <span>{d.title}</span>} <code>{d.id}</code></li>)}</ul></details>}
        </div>
      </article>) : null}
    </div>
    <label htmlFor="question">Message</label>
    <textarea id="question" value={question} onChange={e=>change(e.target.value)} placeholder="Ask about a token, wallet or saved result…" rows={3} required disabled={busy} />
  </section>;
}
