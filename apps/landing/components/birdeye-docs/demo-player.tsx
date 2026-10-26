'use client';
import { useEffect, useRef, useState } from 'react';
import { Check, ChevronRight, Code2, Download, FileJson, Monitor, Pause, Play, RotateCcw, Terminal, ArrowRight, History } from 'lucide-react';
import { type DemoScript } from './demo-script';
import s from './demo-player.module.css';
const time = (ms: number) => `${Math.floor(ms / 60000)}:${Math.floor(ms / 1000 % 60).toString().padStart(2, '0')}`;
const CHAPTER_MS = 8000;

export function DemoPlayer({scripts, standalone = false, htmlUrl = '/demo.html'}: {scripts: DemoScript[]; standalone?: boolean; htmlUrl?: string}) {
  const [selected, setSelected] = useState(scripts[0]?.id || '');
  const script = scripts.find(item => item.id === selected) || scripts[0];
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [view, setView] = useState<'ui' | 'cli'>('ui');
  const container = useRef<HTMLElement>(null);
  const duration = script?.durationMs || 48000;
  const chapter = Math.min(5, Math.floor(elapsed / CHAPTER_MS));
  const section = script?.chapters[chapter];
  const progress = Math.min(1, (elapsed % CHAPTER_MS) / CHAPTER_MS);
  useEffect(() => {
    if (!playing) return;
    let previous = performance.now();
    const timer = setInterval(() => {
      const now = performance.now(); const delta = (now - previous) * speed; previous = now;
      setElapsed(value => Math.min(duration, value + delta));
    }, 100);
    return () => clearInterval(timer);
  }, [playing, duration, speed]);
  useEffect(() => {if (elapsed >= duration) setPlaying(false);}, [elapsed, duration]);
  useEffect(() => {
    const hide = () => {if (document.hidden) setPlaying(false);};
    document.addEventListener('visibilitychange', hide);
    const observer = new IntersectionObserver(([entry]) => {if (!entry.isIntersecting) setPlaying(false);});
    if (container.current) observer.observe(container.current);
    return () => {document.removeEventListener('visibilitychange', hide); observer.disconnect();};
  }, []);
  useEffect(() => {
    const active = container.current?.querySelector<HTMLElement>('[aria-current="step"]');
    const rail = active?.parentElement;
    if (active && rail) {
      const itemRect = active.getBoundingClientRect(), railRect = rail.getBoundingClientRect();
      rail.scrollTop += itemRect.top - railRect.top - 24;
      rail.scrollLeft += itemRect.left - railRect.left - 12;
    }
  }, [chapter]);
  if (!script || !section) return null;
  function play() {if (elapsed >= duration) setElapsed(0); setPlaying(value => !value);}
  function next() {setElapsed((chapter + 1) * CHAPTER_MS); setPlaying(true);}
  function select(id: string) {setSelected(id); setElapsed(0); setPlaying(false);}
  function downloadData() {
    const url = URL.createObjectURL(new Blob([JSON.stringify({schemaVersion: 2, illustrative: false, ...script}, null, 2)], {type: 'application/json'}));
    const link = document.createElement('a'); link.href = url; link.download = `birdeye-demo-${script.id}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <section ref={container} id="demo" className={s.demo} aria-labelledby="demo-title" data-playing={playing}>
    <div className={s.heading}><div><h2 id="demo-title">See the research unfold.</h2><p>From an address to an informed view, with real Birdeye data.</p></div><span className={s.duration}><Play size={14}/> {time(duration)} interactive walkthrough</span></div>
    <div className={s.scenarios} aria-label="Demo scenarios">{scripts.map(item => <button key={item.id} aria-pressed={script.id === item.id} onClick={() => select(item.id)}>{item.title}<ChevronRight size={14}/></button>)}</div>
    <div className={s.player}>
      <div className={s.topbar}><span><Terminal size={17}/> Birdeye CLI <span className={s.fixture}>Real API snapshot</span></span><div aria-label="Demo display"><button aria-pressed={view === 'ui'} onClick={() => setView('ui')}><Monitor size={15}/> UI preview</button><button aria-pressed={view === 'cli'} onClick={() => setView('cli')}><Code2 size={15}/> CLI transcript</button></div></div>
      <div className={s.stage}>
        <aside className={s.chapters} aria-label="Demo chapters">{script.chapters.map((item,index) => <button key={`${index}-${item.title}`} aria-current={chapter === index ? 'step' : undefined} onClick={() => {setElapsed(index * CHAPTER_MS); setPlaying(false);}}><span className={s.step}>{index < chapter ? <Check size={13}/> : index+1}</span><span>{item.title}</span></button>)}</aside>
        <div className={s.screen}>
          <div className={s.workspace}>
            <div className={s.workspaceHeader}><h3>{chapter < 3 ? script.title : chapter === 4 ? 'A closer look' : chapter === 5 ? 'Research you can revisit' : 'Your research, at a glance'}</h3><span className={s.state}>{['Set up', 'Budget preview', 'Recorded run', 'Results', 'Evidence', 'History preview'][chapter]}</span></div>
            {view === 'cli' ? <div className={s.transcript} aria-label="CLI demo transcript">
              <span className={s.prompt}>$ {script.commands.preview}</span>
              {chapter >= 1 && <p>{script.sourceCount} planned requests · {script.estimatedCu} CU estimated · no API calls for preview</p>}
              {chapter >= 2 && <><span className={s.prompt}>$ {script.commands.run}</span><p>Recorded API data. Commands are not executed during playback.</p><ul className={s.fetchList}>{script.steps.slice(0, chapter > 2 ? script.steps.length : Math.max(1, Math.ceil(progress * script.steps.length))).map(step => <li key={step}><Check size={14}/>{step}</li>)}</ul></>}
              {chapter >= 3 && <dl className={s.checks}>{script.highlights.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>}
              {chapter >= 4 && <p>{script.takeaway}</p>}
              {chapter === 5 && <p>Review the saved snapshot or export the full evidence.</p>}
            </div> : <div key={`${script.id}-${chapter}`} className={s.scene}>
              {chapter === 0 && <>
                <p className={s.description}>{script.description}</p>
                <div className={s.setup}><label>Workflow<span>{script.title}<Check size={16}/></span></label><label>Network<span>Solana</span></label></div>
                <div className={s.addressInput}><span>{script.id === 'token-research' ? 'Token address' : 'Wallet address'}</span><code>{elapsed > 0 ? script.address.slice(0, Math.min(script.address.length, Math.floor(progress * script.address.length * 2.2))) : script.address}<span className={s.cursor} aria-hidden="true"/></code></div>
                <button className={s.nextAction} onClick={next}><span>Preview budget</span><ArrowRight size={16}/></button>
                <p className={s.hint}>Start with one address. Choose the workflow for your research question.</p>
              </>}
              {chapter === 1 && <>
                <p className={s.description}>Review the plan before spending API credits.</p>
                <div className={s.planTotal}><strong>{script.estimatedCu} CU</strong><span>{script.sourceCount} planned requests<br/>Catalog estimate · actual billing may differ</span></div>
                <ul className={s.planList}>{script.steps.map(step => <li key={step}><Check size={14}/>{step}</li>)}</ul>
                <button className={s.nextAction} onClick={next}><span>Run research</span><ArrowRight size={16}/></button>
              </>}
              {chapter === 2 && <>
                <p className={s.description}>Replaying the evidence collection from the recorded run.</p>
                <ul className={s.fetchList}>{script.steps.map((step, i) => {const done = i < Math.floor(progress * script.steps.length); const active = i === Math.floor(progress * script.steps.length); return <li key={step} data-status={done ? 'done' : active ? 'active' : 'pending'}>{done ? <Check size={16}/> : active ? <span className={s.loader}/> : <span className={s.pendingDot}/>}<span>{step}</span><small>{done ? 'Received' : active ? 'Reading snapshot…' : 'Queued'}</small></li>;})}</ul>
                <p className={s.hint}>Playback uses captured responses. No live API requests.</p>
              </>}
              {chapter === 3 && <>
                <p className={s.description}>{script.description}</p>
                <dl className={s.highlights}>{script.highlights.map((item,i) => <div key={item.label} style={{opacity: progress > 0 && progress < i * .15 ? 0 : 1}}><dt>{item.label}</dt><dd>{item.value}</dd><p>{item.note}</p></div>)}</dl>
                <button className={s.nextAction} onClick={next}><span>{script.id === 'token-research' ? 'Inspect pools & security' : 'Inspect holdings & performance'}</span><ArrowRight size={16}/></button>
              </>}
              {chapter === 4 && <>
                <div className={s.tableWrap}><table><caption>{script.detailTitle}</caption><thead><tr>{script.columns.map(c => <th key={c}>{c}</th>)}</tr></thead><tbody>{script.rows.map((row,i) => <tr key={i} style={{opacity: progress > 0 && progress < i * .12 ? 0 : 1}}>{row.map((cell,j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>
                <dl className={s.checks}>{script.checks.map(check => <div key={check.label}><dt>{check.label}</dt><dd>{check.value}</dd></div>)}</dl>
                <p className={s.outcome}>{script.takeaway}</p>
              </>}
              {chapter === 5 && <>
                <p className={s.description}>The CLI keeps research in History so you can return to the evidence.</p>
                <div className={s.historyItem}><History size={24}/><div><strong>{script.title}</strong><code>{script.address}</code><p>{script.sourceCount} source responses · {script.capturedAt.slice(0,10)}</p></div><Check size={18}/></div>
                <dl className={s.checks}>{script.highlights.slice(0,2).map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
                <p className={s.outcome}>{script.takeaway}</p>
                <button className={s.exportAction} onClick={downloadData}><Download size={16}/> Export full evidence</button>
                <p className={s.hint}>This demo replays a snapshot; it does not create a new History entry.</p>
              </>}
            </div>}
            <p className={s.snapshotNote}>Real snapshot · {script.capturedAt.replace('T', ' ').replace(/\.\d+Z$/, ' UTC')} · Solana</p>
          </div>
        </div>
      </div>
      <div className={s.caption} aria-live="polite" aria-atomic="true"><strong>{chapter + 1} / {script.chapters.length}</strong><span>{section.caption}</span></div>
      <div className={s.controls}><button className={s.play} onClick={play} aria-label={playing ? 'Pause demo' : elapsed >= duration ? 'Replay demo' : 'Play demo'}>{playing ? <Pause size={17}/> : <Play size={17}/>}</button><button onClick={() => {setElapsed(0); setPlaying(false);}} aria-label="Restart demo"><RotateCcw size={16}/></button><span className={s.time}>{time(elapsed)} / {time(duration)}</span><input type="range" min={0} max={duration} step={100} value={Math.round(elapsed)} onChange={event => {setElapsed(Number(event.target.value)); setPlaying(false);}} aria-label="Demo timeline" aria-valuetext={`${time(elapsed)} — ${section.title}`}/><label className={s.speed}><span className={s.srOnly}>Playback speed</span><select value={speed} onChange={event => setSpeed(Number(event.target.value))}><option value={1}>1×</option><option value={1.5}>1.5×</option><option value={2}>2×</option></select></label></div>
    </div>
    <div className={s.bottom}><p>Guided playback using real captured results. Selected highlights are shown; full evidence is available to download.</p><div><button onClick={downloadData}><FileJson size={15}/> Download full JSON</button>{!standalone && <a href={htmlUrl} download><Download size={15}/> Download HTML</a>}</div></div>
  </section>;
}
