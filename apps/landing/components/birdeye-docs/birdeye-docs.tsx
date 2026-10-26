'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronRight, Code2, Copy, FileText, Monitor, Layers, Search, ShieldCheck, Terminal, Wallet, Waves, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Catalog, Resource, Workflow } from './catalog';
import { useCatalog } from './use-catalog';
import { DemoPlayer } from './demo-player';
import { buildDemoScripts } from './demo-script';
import s from './birdeye-docs.module.css';

type Props = {initialCatalog?: Catalog; catalogUrl?: string | null; refreshInterval?: number; embedded?: boolean};
const icons = {discover: Waves, token: ShieldCheck, wallet: Wallet, guides: BookOpen};
function CopyButton({value, label = 'Copy command'}: {value: string; label?: string}) {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    try {await navigator.clipboard.writeText(value); setState('copied');}
    catch {setState('error');}
    clearTimeout(timer.current); timer.current = setTimeout(() => setState('idle'), 2500);
  }
  return <span className={s.copyWrap}><button type="button" className={s.copy} onClick={copy} aria-label={label} title={label}>{state === 'copied' ? <Check size={16}/> : <Copy size={16}/>}</button><span role="status" className={state === 'idle' ? s.srOnly : s.copyStatus}>{state === 'copied' ? 'Copied' : state === 'error' ? 'Select and copy the text manually.' : ''}</span></span>;
}
function Command({value}: {value: string}) {return <div className={s.command}><pre><code>{value}</code></pre><CopyButton value={value}/></div>;}
function Brand() {return <span className={s.brand}><span className={s.brandMark}><Waves size={23} strokeWidth={2.2}/></span>birdeye<span className={s.brandSuffix}>/ CLI</span></span>;}
function goTo(id: string) {window.location.hash = id;}
function CategoryIcon({category, size = 20}: {category: string; size?: number}) {const Icon = icons[category as keyof typeof icons] || Layers; return <Icon size={size} aria-hidden="true"/>;}

export function BirdeyeDocs({initialCatalog, catalogUrl = '/api/catalog', refreshInterval = 5000, embedded = false}: Props) {
  const {catalog, status, refresh} = useCatalog(initialCatalog, catalogUrl ?? undefined, refreshInterval);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [kind, setKind] = useState('all');
  const [selection, setSelection] = useState('');
  const [demo, setDemo] = useState('skill-trending-list');
  const search = useRef<HTMLInputElement>(null);
  const reader = useRef<HTMLElement>(null);
  useEffect(() => {
    const fromHash = () => {try {const hash = decodeURIComponent(window.location.hash.slice(1)); setSelection(/^(workflow|skill|document)\//.test(hash) ? hash : '');} catch {setSelection('');}};
    fromHash(); window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);
  useEffect(() => {if (selection) reader.current?.focus({preventScroll: true});}, [selection]);
  if (!catalog) return <div className={s.root}><div className={s.unavailable}><Brand/><h1>{status === 'error' ? 'Documentation is temporarily unavailable.' : 'Loading documentation…'}</h1><p>{status === 'error' ? 'The catalog could not be loaded. Please try again.' : 'Loading skills, workflows and guides.'}</p>{status === 'error' && <button className={s.primary} onClick={() => void refresh()}>Try again</button>}</div></div>;
  const resources: Resource[] = [...catalog.workflows.map(item => ({...item, kind: 'workflow' as const})), ...catalog.skills.map(item => ({...item, kind: 'skill' as const}))];
  const filtered = resources.filter(item => (category === 'all' || item.category === category) && (kind === 'all' || item.kind === kind) && `${item.title} ${item.description} ${item.id}`.toLowerCase().includes(query.toLowerCase().trim()));
  const selected = resources.find(item => `${item.kind}/${item.id}` === selection);
  const documentPath = selection.startsWith('document/') ? selection.slice(9) : '';
  const document = documentPath ? catalog.documents[documentPath] : undefined;
  const activeDemo = catalog.workflows.find(item => item.id === demo) || catalog.workflows[0];
  const documents = catalog.documents;
  function choose(item: Resource) {goTo(`${item.kind}/${item.id}`); window.document.getElementById('library')?.scrollIntoView({block: 'start'});}
  function clearFilters() {setQuery(''); setCategory('all'); setKind('all');}
  function markdown(content: string, source: string) {
    return <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
      a: ({href, children}) => {
        if (!href) return <span>{children}</span>;
        if (/^https?:\/\//.test(href)) return <a href={href} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={12}/></a>;
        const resolved = new URL(href, `https://docs.local/${source}`).pathname.slice(1);
        if (documents[resolved]) return <a href={`#document/${encodeURIComponent(resolved)}`}>{children}</a>;
        return <span title={`Source reference: ${href}`}>{children} <code className={s.sourceRef}>{href}</code></span>;
      },
      img: ({alt}) => <span>{alt}</span>,
    }}>{content}</ReactMarkdown>;
  }
  return <div className={`${s.root} ${embedded ? s.embedded : ''}`}>
    <a className={s.skip} href="#library">Skip to documentation</a>
    {!embedded && <header className={s.header}><a href="#" aria-label="Birdeye CLI home"><Brand/></a><nav aria-label="Main navigation"><a href="#demo">Demo</a><a href="#library">Documentation</a><a href="#quickstart">Install with npm</a><a className={s.headerAction} href="#quickstart">Get started <ArrowUpRight size={15}/></a></nav></header>}
    <main>
      {!embedded && <>
        <section className={s.hero} aria-labelledby="hero-title">
          <div className={s.heroCopy}><h1 id="hero-title">{catalog.site.headline.split('\n').map((line, index) => <span key={index}>{line}</span>)}</h1><p>{catalog.site.description}</p><div className={s.heroActions}><a className={s.primary} href="#library">Explore the workflows <ArrowRight size={17}/></a><a className={s.secondary} href="#demo"><Monitor size={17}/> Watch the demo</a></div><div className={s.heroFoot}><span className={s.dot}/> Built for Solana <span className={s.separator}>/</span> CLI + AI agents <span className={s.separator}>/</span> v{catalog.cliVersion}</div></div>
          <div className={s.terminal}>
            <div className={s.terminalTop}><span><Terminal size={15}/> birdeye-cli</span><span className={s.previewLabel}>Command preview</span></div>
            <div className={s.demoTabs} aria-label="Command examples">{[['skill-trending-list','Discover'],['token-research','Research'],['skill-wallet-analysis','Wallets']].filter(([id]) => catalog.workflows.some(item => item.id === id)).map(([id,label]) => <button key={id} onClick={() => setDemo(id)} aria-pressed={demo === id}>{label}</button>)}</div>
            {activeDemo && <div className={s.terminalBody}><div className={s.terminalPrompt}><span aria-hidden="true">$</span><code>{activeDemo.command}</code><CopyButton value={activeDemo.command}/></div><div className={s.terminalDivider}/><div className={s.planLabel}><span>Research plan</span><span>PREVIEW · NO API CALLS</span></div><ol className={s.plan}>{activeDemo.steps.slice(0,4).map(step => <li key={step.id}><Check size={14}/><code>{step.operation}</code><span>{step.cost} CU</span></li>)}</ol>{activeDemo.steps.length > 4 && <p className={s.moreSteps}>+ {activeDemo.steps.length - 4} more steps</p>}<div className={s.terminalSummary}><span>Estimated budget <strong>{activeDemo.estimatedCu} CU</strong></span><span>{activeDemo.maxRequests} requests max, before retries</span></div><button className={s.terminalLink} onClick={() => choose({...activeDemo, kind: 'workflow'})}>Read this workflow <ArrowUpRight size={15}/></button></div>}
          </div>
        </section>
        <div className={s.proofStrip}><span><Code2 size={18}/> Structured JSON output</span><span><Layers size={18}/> Composable workflows</span><span><ShieldCheck size={18}/> Estimate CU before you run</span><a href="#library">Read the docs <ArrowDown size={16}/></a></div>
      </>}
      {!embedded && <DemoPlayer scripts={buildDemoScripts(catalog.workflows)}/>}
      <section id="library" className={s.library} aria-labelledby="library-title">
        <div className={s.libraryHeading}><div><h2 id="library-title">The research toolkit.</h2><p>Find a starting point. Understand every step.</p></div><div className={s.syncStatus} role="status"><span className={status === 'error' ? s.errorDot : s.dot}/>{status === 'error' ? 'Showing saved content · reconnecting' : catalogUrl ? 'Auto-updating docs' : 'Documentation snapshot'}{status === 'error' && <button onClick={() => void refresh()}>Retry</button>}</div></div>
        <div className={s.libraryLayout}>
          <aside className={s.sidebar}><label className={s.search}><Search size={17}/><input ref={search} value={query} onChange={event => {setQuery(event.target.value); if (selection) goTo('library');}} placeholder="Search the toolkit…" aria-label="Search skills and workflows"/>{query && <button aria-label="Clear search" onClick={() => setQuery('')}><X size={14}/></button>}</label><a className={s.installLink} href="#document/docs%2FINSTALLATION.md"><Terminal size={17}/> Install with npm <ArrowUpRight size={14}/></a><div className={s.sidebarLabel}>Browse by category</div><nav aria-label="Documentation categories"><button aria-pressed={category === 'all'} onClick={() => {setCategory('all'); goTo('library');}}><Layers size={17}/> All resources <span>{resources.length}</span></button>{catalog.categories.filter(item => resources.some(resource => resource.category === item.id)).map(item => <button key={item.id} aria-pressed={category === item.id} onClick={() => {setCategory(item.id); goTo('library');}}><CategoryIcon category={item.id} size={17}/>{item.title}<span>{resources.filter(resource => resource.category === item.id).length}</span></button>)}</nav><div className={s.sidebarNote}><BookOpen size={20}/><strong>Made for people.<br/>Ready for agents.</strong><p>Read the workflow or use a skill to give your AI agent the same playbook.</p><button onClick={() => {clearFilters(); setKind('skill'); goTo('library');}}>Browse agent skills <ArrowRight size={14}/></button></div><div className={s.snapshot}>Catalog {catalog.revision.slice(0,8)}<br/>Updated {catalog.updatedAt.slice(0,10)}</div></aside>
          <div className={s.results}>
            {selected ? <article ref={reader} tabIndex={-1} className={s.reader} aria-label={selected.title}>
              <button className={s.back} onClick={() => goTo('library')}><ArrowLeft size={16}/> Back to resources</button>
              <div className={s.detailMeta}><CategoryIcon category={selected.category}/><span>{catalog.categories.find(item => item.id === selected.category)?.title}</span><span>{selected.kind === 'skill' ? 'Agent skill' : 'Workflow'}</span></div>
              <h3>{selected.title}</h3><p className={s.detailDescription}>{selected.description}</p>
              {selected.kind === 'workflow' ? <WorkflowDetail workflow={selected}/> : <div className={s.skillIntro}><FileText size={18}/><span>Agent instructions · <code>{selected.source}</code></span></div>}
              <details className={s.fullGuide} open={selected.kind === 'skill'} key={selection}><summary>{selected.kind === 'skill' ? 'Skill instructions' : 'Full reference guide'}<ChevronRight size={16}/></summary><div className={s.prose}>{markdown(catalog.documents[selected.source] || 'No additional guide is available for this resource yet.', selected.source)}</div></details>
              <div className={s.source}>Source: <code>{selected.source}</code></div>
            </article> : document ? <article ref={reader} tabIndex={-1} className={s.reader} aria-label="Reference guide"><button className={s.back} onClick={() => window.history.back()}><ArrowLeft size={16}/> Back</button><div className={s.prose}>{markdown(document, documentPath)}</div><div className={s.source}>Source: <code>{documentPath}</code></div></article> : selection ? <div className={s.empty}><FileText size={32}/><h3>This resource is no longer in the catalog.</h3><button className={s.secondary} onClick={() => goTo('library')}>Browse resources</button></div> : <>
              <div className={s.resultsBar}><div className={s.filters} aria-label="Resource type">{[['all','All resources'],['workflow','Workflows'],['skill','Agent skills']].map(([id,label]) => <button key={id} aria-pressed={kind === id} onClick={() => setKind(id)}>{label}</button>)}</div><span aria-live="polite">{filtered.length} resources</span></div>
              {filtered.length ? <div className={s.resourceList}>{filtered.map(item => <a className={s.resource} key={`${item.kind}/${item.id}`} href={`#${item.kind}/${item.id}`} onClick={() => window.document.getElementById('library')?.scrollIntoView({block: 'start'})}><span className={s.resourceIcon}><CategoryIcon category={item.category}/></span><div className={s.resourceMain}><div className={s.resourceTitle}><h3>{item.title}</h3>{item.kind === 'workflow' && item.featured && <span className={s.featured}>Start here</span>}</div><p>{item.description}</p><div className={s.resourceMeta}><span>{item.kind === 'workflow' ? `${item.steps.length} steps` : 'Agent skill'}</span><span>{catalog.categories.find(category => category.id === item.category)?.title}</span></div></div><div className={s.resourceEnd}>{item.kind === 'workflow' ? <><strong>{item.estimatedCu} <span>CU</span></strong><small>estimated</small></> : <FileText size={18}/>}<ArrowUpRight size={18}/></div></a>)}</div> : <div className={s.empty}><Search size={30}/><h3>No matching resources</h3><p>Try a token, wallet or market topic, or clear your filters.</p><button className={s.secondary} onClick={clearFilters}>Clear filters</button></div>}
              <p className={s.costNote}>CU estimates use default inputs, exclude retries and may include provisional pricing. Open a workflow for scope and limitations.</p>
            </>}
          </div>
        </div>
      </section>
      {!embedded && <section id="quickstart" className={s.quickstart} aria-labelledby="quickstart-title">
        <div><h2 id="quickstart-title">Install with npm.<br/>Run birdeye-cli.</h2><p>Install the package once, then research from any directory. Start with a cost estimate before fetching live data.</p><a href="#document/docs%2FINSTALLATION.md" onClick={() => window.document.getElementById('library')?.scrollIntoView({block: 'start'})} className={s.textLink}>Full installation guide <ArrowRight size={16}/></a></div>
        <div className={s.install}>
          <h3>Install the CLI globally</h3><p>Requires Node.js 22.16+ and npm. Download the <code>.tgz</code> package provided by your team, then run:</p>
          <Command value={`npm install --global ./birdeye-cli-${catalog.cliVersion}.tgz\nbirdeye-cli --version\nbirdeye-cli --help`}/>
          <p>The package is not on the npm registry yet. Use the local file path above; <code>npm install -g birdeye-cli</code> is not available.</p>
          <h3>Connect and preview a workflow</h3>
          <Command value={'birdeye-cli config init\nbirdeye-cli doctor --short\nbirdeye-cli case skill-trending-list --estimate-cu --short'}/>
          <p>Enter your API key in the secure prompt. Estimates do not call Birdeye. Remove <code>--estimate-cu</code> to fetch live data using your API plan.</p>
          <h3>Open the local interface</h3>
          <Command value={'birdeye-cli --format interface --bind 127.0.0.1:8787'}/>
          <p>Open <code>http://127.0.0.1:8787</code>. Keep the terminal running; press Ctrl+C to stop.</p>
          <details><summary>Build and install from a source checkout</summary><Command value={`npm ci\nnpm run build\nnpm pack\nnpm install --global ./birdeye-cli-${catalog.cliVersion}.tgz\nbirdeye-cli --help`}/><p>Run in the Birdeye CLI source checkout. Use the package filename printed by <code>npm pack</code>.</p></details>
        </div>
      </section>}
    </main>
    <footer className={s.footer}><Brand/><span>Research with evidence. Keep the context.</span><a href="#library">Documentation <ArrowUpRight size={14}/></a></footer>
  </div>;
}
function WorkflowDetail({workflow}: {workflow: Workflow}) {
  return <><h4>Preview this workflow</h4><Command value={workflow.command}/><p className={s.commandHint}>Replace address placeholders with your Solana address. This command estimates costs without making API requests.</p><div className={s.detailStats}><span><strong>{workflow.estimatedCu} CU</strong> estimated, before retries</span><span><strong>{workflow.maxRequests}</strong> maximum requests</span><span><strong>{workflow.subject === 'none' ? 'Market' : workflow.subject.replaceAll('-', ' ')}</strong> input</span></div><h4>What you get</h4><p>{workflow.produces}</p><h4>The workflow, step by step</h4><ol className={s.steps}>{workflow.steps.map((step,index) => <li key={step.id}><span className={s.stepNumber}>{index+1}</span><div><strong>{step.id.replaceAll('-', ' ')}</strong><code>{step.operation}</code></div><span>{step.cost} CU / request</span></li>)}</ol><details className={s.notes}><summary>Scope & limitations</summary><ul>{workflow.notes.map((note,index) => <li key={index}>{note}</li>)}</ul></details></>;
}
