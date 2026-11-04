import {skillCategories,skillsInCategory} from "./skill-categories";
import {skillForPath} from "../src/skill-routes";
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { BigNumber } from "bignumber.js";
import { WorkflowOverview, type PreparedCase } from "./workflow-overview";
import { SkillSettings, SkillFindings } from "./skill-settings";
import { SkillList, RunHistory, plainResult } from "./skill-console";
import { SkillIcon } from "./skill-icon";
import {AddressText, AddressCopyProvider, AddressCopyNotice} from "./address-text";
import {ChatPanel} from "./chat-panel";
import {MarkdownText} from "./markdown-text";
import {StorageGate,browserStorage} from "./storage-gate";
import {createApiClient,createRunEvents} from "./api";
import {CustomerDemos} from "./customer-demos";
import "./style.css";

import {metricAddressKind, operationSubject} from "./birdeye-address";

type Data = Record<string, any>;
type View = "research" | "usage" | "settings" | "demos";
const api = createApiClient();
function Icon({ name, size = 19 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    chart: (
      <>
        <path d="M4 4v16h17M8 15v-4m5 4V7m5 8v-6" />
      </>
    ),
    settings: (
      <>
        <path d="M4 7h16M4 17h16" />
        <circle cx="9" cy="7" r="2.5" />
        <circle cx="15" cy="17" r="2.5" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </>
    ),
    key: (
      <>
        <circle cx="8" cy="9" r="4" />
        <path d="m11 12 8 8m-3-3 3-3m-6 0 3-3" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4" />
      </>
    ),
    stop: <rect x="6" y="6" width="12" height="12" rx="1" />,
    plus: <path d="M12 5v14M5 12h14" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.search}
    </svg>
  );
}
const titleFor: Record<string, string> = {
  "skill-trending-list": "Trending List", "skill-smart-wallets": "Smart Wallets",
  "skill-token-dd": "Token DD", "skill-contract-dd": "Contract DD", "skill-rugcheck-audit": "RugCheck Audit", "skill-kline-pattern": "Kline Pattern",
  "skill-wallet-score": "Wallet Score", "skill-wallet-style": "Wallet Style", "skill-wallet-analysis": "Wallet Analysis", "skill-smart-money-profile": "Smart Money Profile", "skill-smart-money-leaderboard": "Smart Money Leaderboard",
  "token-research": "Token research",
  "market-shortlist": "Market shortlist",
  "wallet-exposure": "Wallet exposure",
  "token-due-diligence": "Token due diligence",
  "project-deep-report": "Project deep report",
  "wallet-analysis": "Wallet analysis",
  "smart-money-profile": "Smart money profile",
  "risk-warning": "Risk warning",
  "early-project-screening": "Early project screening",
  "daily-brief": "Daily brief",
  "market-opportunities": "Market opportunities",
};
const labels: Record<string, string> = {
  symbol: "Asset",
  address: "Address",
  priceUsd: "Price · USD",
  liquidityUsd: "Liquidity · USD",
  volume24hUsd: "24h volume · USD",
  priceChange24hPct: "24h change · %",
  volumeLiquidityRatio: "Volume / liquidity",
  valueUsd: "Value · USD",
  observedWeightPct: "Page weight · %",
  freezeable: "Freezeable",
  mutableMetadata: "Mutable metadata",
  top10HolderPct: "Top 10 · %",
  wallet: "Wallet",
  cohort: "Cohort",
  window: "Window",
  duration: "Duration",
  percentOfSupply: "Supply share · %",
  realizedPnlUsd: "Realized PnL · USD",
  unrealizedPnlUsd: "Unrealized PnL · USD",
  totalPnlUsd: "Total PnL · USD",
  winRate: "Win rate · provider value",
  netValue: "Net flow · provider unit",
  buyValue: "Buy flow",
  sellValue: "Sell flow",
  liquidityChangePct: "Liquidity change · %",
  observedReturnPct: "Observed candle return · %",
  volumeUsd: "Volume · USD",
  tradeCount: "Trades",
  activeTradingTokens: "Active tokens",
  pnlMethod: "PnL method",
  marketCapUsd: "Market cap · USD",
  holderCount: "Holders",
  pageRank: "Page rank",
  smartTraders: "Smart traders",
  netFlowUsd: "Net flow · USD",
  token: "Token",
  tokenRealizedPnlUsd: "Token realized PnL · USD",
  tokenUnrealizedPnlUsd: "Token unrealized PnL · USD",
};
const display = (value: any) =>
  value === null || value === undefined
    ? "Unavailable"
    : typeof value === "boolean"
      ? value
        ? "Yes"
        : "No"
      : String(value);
function exportFile(value: unknown, name: string, type = "application/json") {
  const url = URL.createObjectURL(
    new Blob(
      [typeof value === "string" ? value : JSON.stringify(value, null, 2)],
      { type },
    ),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Metrics({ rows, sources }: { rows: Data[]; sources: Data[] }) {
  const [sort, setSort] = useState<string>("");
  const grouped: Record<string, Data[]> = {};
  for (const row of rows) (grouped[row.operation || "token observations"] ??= []).push(row);
  if (Object.keys(grouped).length > 1) return <div className="metric-groups">{Object.entries(grouped).map(([operation, data]) => <section key={operation}><h3>{operation}</h3><Metrics rows={data!} sources={sources} /></section>)}</div>;
  const all = [...new Set(rows.flatMap((r) => Object.keys(r)))].filter(
    (k) => k in labels,
  );
  const keys = all.includes("symbol") ? ["symbol", ...all.filter((k) => k !== "symbol")] : all;
  const sorted = [...rows].sort((a, b) => {
    if (!sort) return 0;
    if (a[sort] === null || a[sort] === undefined)
      return b[sort] === null || b[sort] === undefined ? 0 : 1;
    if (b[sort] === null || b[sort] === undefined) return -1;
    const left = new BigNumber(a[sort]),
      right = new BigNumber(b[sort]);
    return left.isFinite() && right.isFinite()
      ? left.comparedTo(right)!
      : String(a[sort]).localeCompare(String(b[sort]));
  });
  const csv = () => {
    const quote = (v: any) =>
      `"${(/^[=+\-@]/.test(String(v)) ? "'" : "") + String(v ?? "").replaceAll('"', '""')}"`;
    exportFile(
      [
        keys.join(","),
        ...rows.map((row) => keys.map((k) => quote(row[k])).join(",")),
      ].join("\n"),
      "birdeye-metrics.csv",
      "text/csv",
    );
  };
  if (!rows.length)
    return (
      <p className="muted">
        No computed metrics for this query. Inspect the source dataset below.
      </p>
    );
  return (
    <>
      <div className="section-title">
        <h3>
          Metrics <span className="count">{rows.length}</span>
        </h3>
        <button className="quiet" onClick={csv}>
          <Icon name="download" size={16} /> CSV
        </button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {keys.map((k) => (
                <th key={k} aria-sort={sort === k ? "ascending" : "none"}>
                  <button onClick={() => setSort(k)}>
                    {labels[k] || k}
                    {sort === k ? " ↑" : ""}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={i}>
                {keys.map((k) => (
                  <td
                    key={k}
                    className={k === "address" ? "address" : ""}
                    title={display(row[k])}
                  >
                    <AddressText text={display(row[k])} compact chain={row.chain ?? sources.find(s => s.meta.requestId === row.sourceId)?.meta.chain} kind={metricAddressKind(k, row.operation ?? sources.find(s => s.meta.requestId === row.sourceId)?.meta.operation)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="footnote">
        Ratios and weights are computed locally. Page weights cover priced
        assets on the fetched page only. Exact values are preserved in exports.
      </p>
    </>
  );
}
function App() {
  const [status, setStatus] = useState<Data | null>(null),
    [locked, setLocked] = useState(false),
    [code, setCode] = useState(""),
    [view, setView] = useState<View>("research");
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [run, setRun] = useState<Data | null>(null),
    [progress, setProgress] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null),
    [activeCu, setActiveCu] = useState(0);
  const [mode, setMode] = useState<"case" | "chat">("case"),
    [kind, setKind] = useState("skill-trending-list"),
    [address, setAddress] = useState(""),
    [question, setQuestion] = useState(""),
    [budget, setBudget] = useState<number | null>(null),
    [short, setShort] = useState(true);
  const [depth, setDepth] = useState("core"),
    [candidateLimit, setCandidateLimit] = useState(3),
    [scanLimit, setScanLimit] = useState(20),
    [interval, setInterval] = useState("24h"),
    [duration, setDuration] = useState("30d"),
    [launchStage, setLaunchStage] = useState("newly-created"),
    [launchSource, setLaunchSource] = useState("all"),
    [minProgress, setMinProgress] = useState(""),
    [minLiquidity, setMinLiquidity] = useState(""),
    [maxTop10Pct, setMaxTop10Pct] = useState(""),
    [excludeFreezeable, setExcludeFreezeable] = useState(false),
    [preparedCase, setPreparedCase] = useState<PreparedCase | null>(null);
  const [skillGroup, setSkillGroup] = useState("all"), [skillOptions, setSkillOptions] = useState<Data>({}), [walletsText, setWalletsText] = useState("");
  const [resultFormat, setResultFormat] = useState("ui");
  const [demoViewVersion,setDemoViewVersion]=useState(0);
  const [theme, setTheme] = useState("dark");
  const [historyLoading, setHistoryLoading] = useState(false);
  const [chatMessages,setChatMessages] = useState<Data[]>([]), [liveData,setLiveData] = useState(true), [knowledgeInfo,setKnowledgeInfo] = useState<Data|null>(null);
  const viewedRun=useRef<string|null>(null);
  useEffect(()=>{if(mode!=="chat"||knowledgeInfo)return;let cancelled=false;void api("/knowledge").then(value=>{if(!cancelled)setKnowledgeInfo(value);}).catch(e=>{if(!cancelled)setError(e.message);});return()=>{cancelled=true;};},[mode,knowledgeInfo]);
  async function loadThread(id:string) {const thread=await api(`/runs/${id}/thread`);if(viewedRun.current===id)setChatMessages(thread.messages);}

  async function loadHistory() {
    if (!status?.historyNextCursor || historyLoading) return;
    setHistoryLoading(true);
    try {
      const page = await api(`/history?before=${status.historyNextCursor}`);
      setStatus(previous => previous ? {...previous, runs:[...previous.runs, ...page.items.filter((r:Data)=>!previous.runs.some((p:Data)=>p.id===r.id))], historyNextCursor:page.nextCursor} : previous);
    } catch(e:any) {setError(e.message);} finally {setHistoryLoading(false);}
  }
  async function removeHistory(id?:string) {
    await api("/history/delete",id ? {id} : {all:true});
    setStatus(previous=>previous ? {...previous,runs:id ? previous.runs.filter((r:Data)=>r.id!==id) : [],historyNextCursor:null} : previous);
    if(!id || viewedRun.current===id) {
      viewedRun.current=null;setRun(null);setChatMessages([]);setQuestion("");setLiveData(true);
    } else if(run?.input?.mode==="chat") {
      await loadThread(run.id);
    }
    await refresh();
  }
  function chooseWorkflow(next: string, updateUrl = true) {
    if (updateUrl) {
      const url = new URL(window.location.href);
      if (url.pathname !== `/${next}`) {
        url.pathname = `/${next}`;
        window.history.pushState(null, "", url);
      }
    }
    setKind(next); setSkillOptions({}); setDuration("30d"); setScanLimit(next.startsWith("skill-") ? 20 : 50); setRun(null); viewedRun.current=null; setChatMessages([]); setLiveData(true); setResultFormat("ui"); setView("research"); setMode("case");
  }
  const selectedCase = status?.cases?.find((c:Data) => c.kind === kind);
  const referenceSkill = kind.startsWith("skill-");
  const walletCase = selectedCase?.subject === "wallet" || ["wallet-exposure", "wallet-analysis", "smart-money-profile", "daily-brief"].includes(kind);
  const optionalAddress = ["smart-money-profile", "daily-brief"].includes(kind);
  const noAddress = ["none", "wallets"].includes(selectedCase?.subject) || ["market-shortlist", "market-opportunities", "early-project-screening"].includes(kind);
  const tokenPolicy = !referenceSkill && !["wallet-exposure", "smart-money-profile"].includes(kind) && (kind !== "wallet-analysis" || depth === "full");
  const discovery = ["market-opportunities", "early-project-screening", "daily-brief"].includes(kind);
  const caseInput = () => referenceSkill ? {
    kind, ...(!noAddress && address.trim() ? {address: address.trim()} : {}),
    ...(selectedCase?.subject === "wallets" && walletsText.trim() ? {wallets: walletsText.split(/[\s,]+/).filter(Boolean)} : {}),
    limit: candidateLimit, scanLimit, interval, duration, ...skillOptions,
  } : ({
    kind, ...(!noAddress && address.trim() ? {address: address.trim()} : {}),
    depth, limit: candidateLimit, scanLimit, interval, duration,
    ...(kind === "early-project-screening" ? {stage: launchStage, source: launchSource, ...(minProgress !== "" ? {minProgress: Number(minProgress)} : {})} : {}),
    ...(tokenPolicy && minLiquidity !== "" ? {minLiquidity: Number(minLiquidity)} : {}),
    ...(tokenPolicy && maxTop10Pct !== "" ? {maxTop10Pct: Number(maxTop10Pct)} : {}),
    excludeFreezeable: tokenPolicy && excludeFreezeable,
  });
  const workflowInput = caseInput();
  const workflowKey = JSON.stringify(workflowInput);
  const caseReady = preparedCase?.key === workflowKey;
  const chatWorkflowInput = run ? run.input?.case : caseReady ? preparedCase?.input : undefined;
  const chatWorkflowKind = chatWorkflowInput?.kind || (run ? run.input?.workflowKind : kind);
  const chatWorkflow = status?.cases?.find((c: Data) => c.kind === chatWorkflowKind);
  const [settings, setSettings] = useState({
      birdeyeApiKey: "",
      baseUrl: "",
      apiFormat: "responses",
      model: "",
      apiKey: "",
      persist: true,
    }),
    [saved, setSaved] = useState("");
  const stream = useRef<ReturnType<typeof createRunEvents> | null>(null),
    initialized = useRef(false);
  async function refresh() {
    try {
      const s: Data = await api("/status");
      setStatus(s);
      setLocked(false);
      setBusy(s.active);
      setActiveId(s.activeRunId);
      return s;
    } catch (e: any) {
      if (e.status === 401) setLocked(true);
      else setError(e.message);
      return null;
    }
  }
  async function watch(id: string) {
    viewedRun.current=id;
    const r = await api(`/runs/${id}`);
    if(viewedRun.current!==id)return;
    if(r.input?.mode === "chat") {setMode("chat");setLiveData(r.input.dataPolicy !== "saved-only");await loadThread(id);} else setChatMessages([]);
    if(viewedRun.current!==id)return;
    setRun(r);
    if(r.input?.mode === "demo")setDemoViewVersion(v=>v+1);
    setView(r.input?.mode === "demo" ? "demos" : "research");
    if (r.status !== "running") return;
    stream.current?.close();
    setActiveId(id);
    setBusy(true);
    const events = createRunEvents(id);
    stream.current = events;
    events.onmessage = (event) => {
      const e = JSON.parse(event.data);
      if (e.type === "progress") {
        setProgress(e.data.message);
        setActiveCu(e.data.cu?.budgetUsed || 0);
        setRun((previous) =>
          previous?.id === id ? { ...previous, cu: e.data.cu } : previous,
        );
      }
      if (e.type === "done") {
        setRun((previous) => (previous?.id === id ? e.data : previous));
        setBusy(false);
        setActiveId(null);
        events.close();
        void refresh();
        if(viewedRun.current===id && e.data.input?.mode === "chat") void loadThread(id).catch(e=>setError(e.message));
      }
    };
    events.onerror = () => {
      setProgress("Connection interrupted. Reconnecting to the same run…");
    };
  }
  useEffect(() => {
    void refresh()
      .then(async (s) => {
        if (!s || initialized.current) return;
        initialized.current = true;
        setBudget(s.maxCu);
        setShort(s.short);
        if (s.activeRunId) {
          await watch(s.activeRunId);
          return;
        }
        const linkedSkill = skillForPath<Data & {kind: string; family: string}>(window.location.pathname, s.cases);
        if (linkedSkill) {
          setSkillGroup(linkedSkill.category);
          chooseWorkflow(linkedSkill.kind, false);
          return;
        }
        const initial = await api("/initial", {});
        if (initial.id) await watch(initial.id);
      })
      .catch((e) => setError(e.message));
    return () => stream.current?.close();
  }, []);
  useEffect(() => {
    if (!status?.cases) return;
    const restoreSkill = () => {
      const linkedSkill = skillForPath<Data & {kind: string; family: string}>(window.location.pathname, status.cases);
      if (linkedSkill) {
        setSkillGroup(linkedSkill.category);
        chooseWorkflow(linkedSkill.kind, false);
      } else if (["/", "/index.html"].includes(window.location.pathname)) {
        setSkillGroup("all");
        chooseWorkflow("skill-trending-list", false);
      }
    };
    window.addEventListener("popstate", restoreSkill);
    return () => window.removeEventListener("popstate", restoreSkill);
  }, [status?.cases]);
  useEffect(() => {
    if (!status) return;
    const p = status.config.ai.profiles[status.activeAiProfile];
    setSettings((old) => ({
      ...old,
      baseUrl: p?.baseUrl || "",
      apiFormat: p ? (p.apiFormat || "chat-completions") : "responses",
      model: p?.model || "",
    }));
  }, [status?.config, status?.activeAiProfile]);
  async function connect(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError("");
      await api("/connect", { code });
      setCode("");
      const s = await refresh();
      if (s) {
        setBudget(s.maxCu);
        setShort(s.short);
        if (s.activeRunId) {
          await watch(s.activeRunId);
          return;
        }
        const initial = await api("/initial", {});
        if (initial.id) await watch(initial.id);
      }
    } catch (e: any) {
      setError(e.message);
    }
  }
  async function start(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "case" && !caseReady) return;
    setError("");
    setBusy(true);
    setProgress("Preparing your research…");
    try {
      const data =
        mode === "case"
          ? {
              mode,
              case: preparedCase!.input,
              maxCu: budget,
              short,
            }
          : { mode, question, parentId: run?.id, case: chatWorkflowInput, workflowKind: chatWorkflowKind, maxCu: liveData ? budget : 0, short, dataPolicy:liveData ? "live" : "saved-only" };
      const r = await api("/runs", data);
      await watch(r.id);
      if(mode==="chat")setQuestion("");
      await refresh();
    } catch (e: any) {
      setError(e.message);
      setBusy(false);
    }
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaved("");
    try {
      const existing = status?.config.ai.profiles[status.activeAiProfile];
      const payload: Data = {
        persist: settings.persist,
        profileName: status?.activeAiProfile || "research",
      };
      if (settings.birdeyeApiKey)
        payload.birdeyeApiKey = settings.birdeyeApiKey;
      if (settings.baseUrl || settings.model)
        payload.profile = {
          provider: "openai-compatible",
          baseUrl: settings.baseUrl,
          apiFormat: settings.apiFormat,
          model: settings.model,
          apiKeyEnv: existing?.apiKeyEnv || "BIRDEYE_AI_API_KEY",
          ...(settings.apiKey ? { apiKey: settings.apiKey } : {}),
        };
      await api("/settings", payload);
      setSettings(old=>({...old,birdeyeApiKey:"",apiKey:""}));
      setSettings((s) => ({ ...s, birdeyeApiKey: "", apiKey: "" }));
      setSaved(settings.persist && (!browserStorage || status?.configStorage?.persisted) ? "Connections saved. Available after unlocking or restarting." : "Connections applied to this session only.");
      setError("");
      await refresh();
    } catch (e: any) {
      setError(e.message);
    }
  }
  const notice = error ? (
    <div className="notice error" role="alert">
      <span>{error}</span>
      <button
        className="icon-button"
        aria-label="Dismiss error"
        onClick={() => setError("")}
      >
        <Icon name="close" size={16} />
      </button>
    </div>
  ) : null;
  if (locked)
    return (
      <main className="connect-page">
        <div className="connect-panel">
          <Brand />
          <h1>Connect your workspace</h1>
          <p>
            Enter the connection code from the server terminal. The same code
            can connect multiple browsers until the server restarts. Connected
            users share this workspace, settings and API usage.
          </p>
          <form onSubmit={connect}>
            <label htmlFor="connection-code">Connection code</label>
            <input
              id="connection-code"
              type="password"
              autoComplete="off"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              autoFocus
            />
            <button className="primary">
              Connect <Icon name="arrow" />
            </button>
          </form>
          {notice}
          <p className="footnote">
            Using SSH? Forward this port to the server’s loopback address.
          </p>
        </div>
      </main>
    );
  if (!status)
    return (
      <main className="connect-page">
        <p role="status">Opening your workspace…</p>
        {notice}
      </main>
    );
  const publicSkills = skillsInCategory(status.cases as Data[]);
  const categoryFilters = [{id:"all",title:"All skills",skill_count:publicSkills.length}, ...skillCategories(publicSkills)];
  const config = status.config,
    aiConfigured = !!config.ai.profiles[status.activeAiProfile]?.configured;
  const result = run?.result,
    metrics = result?.data?.metrics || [],
    sources = result?.data?.sources || (result ? [result] : []);
  return (
    <div className={`app-shell console-app ${theme}`}>
      <header className="console-header">
        <Brand />
        <nav aria-label="Workspace">{(["research", "demos", "usage", "settings"] as View[]).map(v => <button key={v} aria-current={view === v ? "page" : undefined} className={view === v ? "nav-item selected" : "nav-item"} onClick={() => {setView(v); setError("");}}>{v === "research" ? "Research" : v === "demos" ? "Demos" : v === "usage" ? "Usage & credits" : "Settings"}</button>)}</nav>
        <span className="network">Solana</span>
        <button className="quiet" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? "Light theme" : "Dark theme"}</button>
      </header>
      <div className="connection-bar">
        <span><span className={`status-dot ${config.birdeyeConfigured ? "" : "off"}`} /> Birdeye: {config.birdeyeConfigured ? "key configured" : "key required"}</span>
        <span>AI: {aiConfigured ? status.config.ai.profiles[status.activeAiProfile]?.model : "not configured"}</span>
      </div>
      {view === "research" && <div className="console-groups" role="group" aria-label="Skill group">{categoryFilters.map(category => <button key={category.id} data-category={category.id} aria-pressed={skillGroup === category.id} className={skillGroup === category.id ? "case-choice active" : "case-choice"} onClick={() => {
        setSkillGroup(category.id);
        const matching = skillsInCategory(publicSkills, category.id);
        if (!matching.some(skill => skill.kind === kind) && matching[0]) chooseWorkflow(matching[0].kind);
      }}>{category.title}<span aria-hidden="true">{category.skill_count}</span></button>)}</div>}
      <div className={`console-layout ${view === "research" ? "" : "utility-layout"}`}>
      {view === "research" && <SkillList cases={status.cases} group={skillGroup} selected={kind} choose={chooseWorkflow} />}
      <div className="main-shell">
        <main className="content">
          {notice}
          {view === "demos" ? <CustomerDemos key={demoViewVersion} api={api} busy={busy} budget={budget} setBudget={setBudget} run={run} progress={progress} start={async(demo)=>{const value=await api("/runs",{mode:"demo",demo,maxCu:budget,short});await watch(value.id);await refresh();}} /> : view === "settings" ? (
            <>
              <div className="page-heading">
                <h1>Connections</h1>
              </div>
              <details className="source"><summary>Storage details</summary><code>{status.configStorage?.path}</code><p>{browserStorage ? "Saved keys are encrypted with your workspace password. Blank key fields keep current keys. Your AI endpoint must allow CORS from this website." : "Environment variables override saved credentials. Blank key fields keep saved keys."}</p></details>
              <form className="settings-form" onSubmit={save}>
                <section>
                  <div className="section-title">
                    <h2>Birdeye Data API</h2>
                    <span
                      className={`badge ${config.birdeyeConfigured ? "good" : ""}`}
                    >
                      {config.birdeyeConfigured
                        ? "Configured"
                        : "Not configured"}
                    </span>
                  </div>
                  <label htmlFor="bkey">API key</label>
                  <input
                    id="bkey"
                    type="password"
                    value={settings.birdeyeApiKey}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        birdeyeApiKey: e.target.value,
                      })
                    }
                    placeholder={
                      config.birdeyeConfigured
                        ? "Leave blank to keep the current key"
                        : "Enter your Birdeye key"
                    }
                    autoComplete="off"
                  />
                </section>
                <section>
                  <div className="section-title">
                    <h2>AI provider</h2>
                    <span className={`badge ${aiConfigured ? "good" : ""}`}>
                      {aiConfigured ? "Configured" : "Optional"}
                    </span>
                  </div>
                  <label htmlFor="baseurl">Base URL</label>
                  <input
                    id="baseurl"
                    type="url"
                    value={settings.baseUrl}
                    onChange={(e) =>
                      setSettings({ ...settings, baseUrl: e.target.value })
                    }
                    placeholder="https://your-provider.example/v1"
                  />
                  <label htmlFor="api-format">API format</label>
                  <select id="api-format" value={settings.apiFormat}
                    onChange={(e) => setSettings({ ...settings, apiFormat: e.target.value })}>
                    <option value="responses">OpenAI Responses</option>
                    <option value="chat-completions">Chat Completions</option>
                  </select>
                  <p className="muted">Base URL ends at /v1.</p>
                  <div className="form-grid">
                    <div>
                      <label htmlFor="model">Model ID</label>
                      <input
                        id="model"
                        value={settings.model}
                        onChange={(e) =>
                          setSettings({ ...settings, model: e.target.value })
                        }
                        placeholder="Your provider’s model ID"
                      />
                    </div>
                    <div>
                      <label htmlFor="akey">AI API key</label>
                      <input
                        id="akey"
                        type="password"
                        value={settings.apiKey}
                        onChange={(e) =>
                          setSettings({ ...settings, apiKey: e.target.value })
                        }
                        placeholder={browserStorage ? "Enter your AI provider key" : "Or use BIRDEYE_AI_API_KEY"}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </section>
                <label className="check">
                  <input
                    type="checkbox"
                    checked={settings.persist}
                    onChange={(e) =>
                      setSettings({ ...settings, persist: e.target.checked })
                    }
                  />
                  {browserStorage ? "Save keys in encrypted browser workspace" : "Save on this machine"}
                </label>
                <p className="muted">{browserStorage ? "Temporary workspace: keys stay in memory regardless of this option. Unchecked: keep these keys only until you lock or reload; existing saved keys remain." : "Unchecked: session only; existing saved settings remain."}</p>
                <div className="form-actions">
                  <button className="primary" disabled={busy}>
                    Save connections
                  </button>
                  {saved && (
                    <span role="status" className="success-text">
                      {saved}
                    </span>
                  )}
                </div>
              </form>
            </>
          ) : view === "usage" ? (
            <>
              <div className="page-heading">
                <h1>Usage & credits</h1>
              </div>
              <div className="usage-summary">
                <UsageStat
                  label="Estimated CU"
                  value={status.usage.estimated}
                />
                <UsageStat
                  label="Budget reserved / used"
                  value={status.usage.budgetUsed}
                />
                <UsageStat label="API attempts" value={status.usage.attempts} />
                <UsageStat
                  label="Uncertain attempts"
                  value={status.usage.uncertainAttempts}
                />
              </div>
              <section className="usage-detail">
                <h2>Account credits</h2>
                <p>
                  Account-wide, including other apps and keys.
                </p>
                <button
                  className="secondary"
                  disabled={busy || !config.birdeyeConfigured}
                  onClick={async () => {
                    try {
                      const r = await api("/runs", {
                        mode: "operation",
                        query: { operation: "usage.credits", params: {} },
                        maxCu: budget,
                      });
                      await watch(r.id);
                      await refresh();
                    } catch (e: any) {
                      setError(e.message);
                    }
                  }}
                >
                  Refresh credits{" "}
                  <span className="cost-chip">1 CU estimate</span>
                </button>
              </section>
              <p className="footnote">
                Pricing catalog: {status.usage.pricingVersion}. Pending,
                cancelled or failed requests may have been billed. Their
                reservations remain in the ledger.
              </p>
            </>
          ) : (
            <>
              {!config.birdeyeConfigured && (
                <div className="setup-note">
                  <Icon name="key" />
                  <div>
                    <strong>Birdeye API key required</strong>
                  </div>
                  <button
                    className="secondary"
                    onClick={() => setView("settings")}
                  >
                    Set up <Icon name="arrow" size={16} />
                  </button>
                </div>
              )}
              <div className="research-composer">
                <div className="composer-heading">
                  <div className="selected-skill-heading"><SkillIcon kind={kind} size={22}/><h1>{selectedCase?.title || titleFor[kind]}</h1></div>
                <div
                  className="composer-tabs"
                  role="group"
                  aria-label="Research mode"
                >
                  <button
                    aria-pressed={mode === "case"}
                    className={mode === "case" ? "active" : ""}
                    onClick={() => setMode("case")}
                  >
                    Case studies
                  </button>
                  <button
                    aria-pressed={mode === "chat"}
                    className={mode === "chat" ? "active" : ""}
                    onClick={() => setMode("chat")}
                  >
                    Ask AI
                  </button>
                </div>
                </div>
                <form onSubmit={start}>
                  {mode === "case" ? (
                    <>
                      {!noAddress && <>
                        <label htmlFor="address">{walletCase ? "Wallet address" : "Token address"}{optionalAddress ? " (optional)" : ""}</label>
                        <input id="address" className="address-input" value={address} onChange={e => setAddress(e.target.value)} placeholder={optionalAddress ? "Leave blank to discover candidates" : "Paste a Solana address"} required={!optionalAddress} spellCheck={false} />
                      </>}
                      {selectedCase?.subject === "wallets" && <label>Wallet addresses<textarea value={walletsText} onChange={e=>setWalletsText(e.target.value)} placeholder="One Solana wallet per line, or comma-separated" required rows={3} /><small className="field-hint">1–10 unique wallets. Each wallet adds its own API steps and CU.</small></label>}
                      {referenceSkill ? <SkillSettings kind={kind} value={skillOptions} change={setSkillOptions} limit={candidateLimit} setLimit={setCandidateLimit} scanLimit={scanLimit} setScanLimit={setScanLimit} interval={interval} setInterval={setInterval} duration={duration} setDuration={setDuration} /> : <div className="form-grid workflow-options">
                        {!["project-deep-report", "early-project-screening", "wallet-exposure", "market-shortlist"].includes(kind) && <label>Depth<select value={depth} onChange={e => setDepth(e.target.value)}><option value="core">Core</option><option value="full">Full evidence</option></select></label>}
                        {(discovery || kind === "market-shortlist" || kind === "wallet-analysis" && depth === "full" || kind === "smart-money-profile" && !address.trim()) && <label>Maximum candidates<input type="number" min="1" max="5" value={candidateLimit} onChange={e => setCandidateLimit(Number(e.target.value))} /></label>}
                        {discovery && <label>Discovery page size<input type="number" min="1" max="50" value={scanLimit} onChange={e => setScanLimit(Number(e.target.value))} /></label>}
                        {["market-opportunities", "market-shortlist"].includes(kind) && <label>Trending window<select value={interval} onChange={e => setInterval(e.target.value)}><option>1h</option><option>4h</option><option>24h</option></select></label>}
                        {["wallet-analysis", "smart-money-profile"].includes(kind) && <label>Wallet trade window<select value={duration} onChange={e => setDuration(e.target.value)}>{["24h", "7d", "30d", "90d"].map(v => <option key={v}>{v}</option>)}</select></label>}
                        {kind === "early-project-screening" && <>
                          <label>Launch stage<select value={launchStage} onChange={e => setLaunchStage(e.target.value)}>{["newly-listed", "newly-created", "near-graduation", "graduated"].map(v => <option key={v}>{v}</option>)}</select></label>
                          <label>Launch venue<select value={launchSource} onChange={e => setLaunchSource(e.target.value)}>{["all", "pump_dot_fun", "moonshot", "raydium_launchlab", "meteora_dynamic_bonding_curve"].map(v => <option key={v}>{v}</option>)}</select></label>
                          {launchStage === "near-graduation" && <label>Minimum progress · %<input type="number" min="0.01" max="99.99" step="any" value={minProgress} onChange={e => setMinProgress(e.target.value)} required /></label>}
                        </>}
                      </div>}
                      {tokenPolicy && <details className="source">
                        <summary>Optional screening criteria</summary>
                        <div className="form-grid">
                          <label>Minimum liquidity · USD<input type="number" min="0" step="any" value={minLiquidity} onChange={e => setMinLiquidity(e.target.value)} placeholder="No threshold" /></label>
                          <label>Maximum top-10 account share · %<input type="number" min="0" max="100" step="any" value={maxTop10Pct} onChange={e => setMaxTop10Pct(e.target.value)} placeholder="No threshold" /></label>
                        </div>
                        <label className="check"><input type="checkbox" checked={excludeFreezeable} onChange={e => setExcludeFreezeable(e.target.checked)} />Exclude freezeable tokens; stop when the field is unknown</label>
                      </details>}
                      <WorkflowOverview key={workflowKey} input={workflowInput} inputKey={workflowKey} budget={budget} onPrepared={setPreparedCase} />

                    </>
                  ) : (
                    <>
                      <ChatPanel messages={chatMessages} question={question} change={setQuestion} live={liveData} setLive={setLiveData} busy={busy} saved={run} knowledge={knowledgeInfo} workflow={chatWorkflow ? {title: chatWorkflow.title, address: chatWorkflowInput?.address, ready: !!chatWorkflowInput} : undefined} />
                      {!aiConfigured && (
                        <p className="composer-hint">
                          Add your AI provider in{" "}
                          <button
                            type="button"
                            className="text-link"
                            onClick={() => setView("settings")}
                          >
                            Settings
                          </button>{" "}
                          to ask questions.
                        </p>
                      )}
                    </>
                  )}
                  <div className="composer-footer">
                    <div className="run-options">
                      <label className="budget-label" htmlFor="budget">
                        CU limit
                        <input
                          id="budget"
                          type="number"
                          min="0"
                          placeholder="Unlimited"
                          value={mode === "chat" && !liveData ? 0 : budget ?? ""}
                          disabled={mode === "chat" && !liveData}
                          onChange={(e) => setBudget(e.target.value === "" ? null : Number(e.target.value))}
                        />
                      </label>
                      <label className="check compact">
                        <input
                          type="checkbox"
                          checked={short}
                          onChange={(e) => setShort(e.target.checked)}
                        />
                        Short output
                      </label>
                    </div>
                    {busy ? (
                      <button
                        type="button"
                        className="secondary"
                        onClick={() =>
                          activeId &&
                          void api(`/runs/${activeId}/stop`, {}).catch((e) =>
                            setError(e.message),
                          )
                        }
                      >
                        <Icon name="stop" size={15} />
                        Stop run
                      </button>
                    ) : (
                      <button
                        className="primary"
                        disabled={
                          (mode === "case" && !config.birdeyeConfigured) ||
                          (mode === "case" && !caseReady) ||
                          (mode === "chat" && !aiConfigured)
                        }
                      >
                        {mode === "chat" ? "Send message" : "Run research"} <Icon name="arrow" size={17} />
                      </button>
                    )}
                  </div>
                </form>
              </div>
              {busy && (
                <div className="progress-line" role="status">
                  <span className="pulse-dot" />
                  {progress || "Working…"}
                  {activeId && run?.id !== activeId && (
                    <button
                      className="text-link"
                      onClick={() =>
                        void watch(activeId).catch((e) => setError(e.message))
                      }
                    >
                      View active run
                    </button>
                  )}
                  <span>{activeCu} CU reserved</span>
                </div>
              )}
              {run && (
                <section className="results">
                  <div className="result-heading">
                    <div>
                      <span
                        className={`badge ${run.status === "completed" ? "good" : ""}`}
                      >
                        {run.status}
                      </span>
                      <h2><AddressText text={titleFor[run.title] || run.title} /></h2>
                    </div>
                    <button
                      className="quiet"
                      disabled={!result}
                      onClick={() =>
                        exportFile(result, `birdeye-${run.id}.json`)
                      }
                    >
                      <Icon name="download" size={16} />
                      Export JSON
                    </button>
                  </div>
                  <div className="run-usage">
                    <span>
                      <strong>{run.cu?.estimated ?? 0}</strong> estimated CU
                    </span>
                    <span>{run.cu?.budgetUsed ?? 0} CU reserved</span>
                    <span>{run.cu?.attempts ?? 0} API attempts</span>
                    {!!run.cu?.uncertainAttempts && (
                      <span>{run.cu.uncertainAttempts} uncertain</span>
                    )}
                    {!!run.ai?.calls && <span>{run.ai.inputTokens} in / {run.ai.outputTokens} out AI tokens{run.ai.unknownCalls ? " · usage incomplete" : ""}</span>}
                  </div>
                  {run.saved && <p className="field-hint">{run.fromStorage ? "Saved snapshot" : "Saved"} · {new Date(result?.meta?.retrievedAt || run.createdAt).toLocaleString()}</p>}
                  {run.status === "incomplete" && <p className="notice">Saved checkpoint only. This run is not active here; some data or analysis may be missing.</p>}
                  {run.storageError && <p className="notice error" role="alert">{run.storageError}</p>}
                  {result && mode !== "chat" && <button type="button" className="secondary" onClick={()=>{setMode("chat");setLiveData(true);setQuestion("");setChatMessages([]);}}>Discuss saved data with AI</button>}
                  {run.input && <details className="source"><summary>Saved run parameters</summary><pre><AddressText text={JSON.stringify(run.input,null,2)} /></pre></details>}
                  {result && <div className="output-tabs" role="group" aria-label="Result format">{[["ui","UI"],["plain","Plain"],["json","JSON"]].map(([value,label]) => <button key={value} aria-pressed={resultFormat === value} className={resultFormat === value ? "active" : ""} onClick={() => setResultFormat(value)}>{label}</button>)}</div>}
                  {result && resultFormat !== "ui" && <pre className="formatted-output" aria-label={`${resultFormat} result`}><AddressText text={resultFormat === "json" ? JSON.stringify(result, null, 2) : plainResult(result)} /></pre>}
                  <div hidden={!!result && resultFormat !== "ui"}>
                  {run.error && (
                    <div className="notice error" role="alert">
                      {run.error.message}
                    </div>
                  )}
                  {result?.data?.answer && mode !== "chat" && (
                    <div className="answer">
                      <h3>Findings</h3>
                      <MarkdownText text={result.data.answer} />
                    </div>
                  )}
                  {result && (
                    <>
                      {result.data?.missing?.length > 0 && <details className="source"><summary>Missing checks · {result.data.missing.length}</summary><ul>{result.data.missing.map((m: Data, i: number) => <li key={i}>{m.operation || m.step}: {m.message || m.reason}{m.subject ? <> · <AddressText text={String(m.subject)} kind={operationSubject(m.operation)} chain={result.meta.chain} /></> : ""}</li>)}</ul></details>}
                      {result.data?.outcomes?.length > 0 && <details className="source"><summary>Screening outcomes · {result.data.outcomes.length}</summary><ul>{result.data.outcomes.map((o: Data, i: number) => <li key={i}><AddressText text={o.address} kind="token" chain={result.meta.chain} /> · {o.status}: {o.reasons.join("; ")}</li>)}</ul></details>}
                      {result.data?.scopeNotes?.length > 0 && <details className="source"><summary>Scope and calculation notes</summary><p className="footnote"><AddressText text={result.data.scopeNotes.join(" ")} /></p></details>}
                      {result.data?.selections?.length > 0 && <details className="source"><summary>Candidate selection and coverage</summary><pre><AddressText text={JSON.stringify(result.data.selections, null, 2)} /></pre></details>}
                      {metrics.length > 0 && (result.data?.skillAnalysis ? <details className="source"><summary>Market metrics & source data</summary><Metrics rows={metrics} sources={sources} /></details> : <Metrics rows={metrics} sources={sources} />)}
                      {!sources.length && ((run.cu?.attempts ?? 0) > 0
                        ? <p className="notice error">No dataset was returned. Review the request errors before retrying. Reserved CU may still be billed by Birdeye.</p>
                        : <p className="notice">No API datasets attached. No Birdeye API request was made in this run.</p>)}
                      {result.data?.skillAnalysis && <SkillFindings key={run.id} analysis={result.data.skillAnalysis} kind={result.data.kind} sources={sources} onRescore={run.status!=="running"?async changes=>{const next=await api("/rescore",{runId:run.id,...changes});await watch(next.id);await refresh();}:undefined} />}
                      {metrics.length > 0 && (
                        <details className="source">
                          <summary>Calculation basis and source links</summary>
                          <pre>
                            <AddressText text={JSON.stringify(
                              metrics.map((m: Data) => ({
                                sourceId: m.sourceId,
                                address: m.address,
                                asOf: m.asOf,
                                chain: m.chain,
                                ratioBasis: m.ratioBasis,
                                weightBasis: m.weightBasis,
                                securityCoverage: m.securityCoverage,
                              })),
                              null,
                              2,
                            )} />
                          </pre>
                        </details>
                      )}
                      {result.meta.warnings?.length > 0 && (
                        <details className="source">
                          <summary>Coverage & limitations · {result.meta.warnings.length}</summary>
                          <ul>
                            {result.meta.warnings.map(
                              (w: string, i: number) => (
                                <li key={i}><AddressText text={w} /></li>
                              ),
                            )}
                          </ul>
                        </details>
                      )}
                      <details className="source"><summary>Source datasets · {sources.length}</summary>
                      {sources.map((s: Data, i: number) => (
                        <details className="source" key={i}>
                          <summary>
                            <span>{s.meta.operation}</span>
                            <span className="source-endpoint">
                              {s.meta.endpoint}
                            </span>
                            <span className="badge">{s.meta.coverage}</span>
                          </summary>
                          <p className="footnote">
                            Source ID: {s.meta.requestId} · retrieved{" "}
                            {s.meta.retrievedAt} (UTC)
                          </p>
                          {(s.meta.params?.address || s.meta.params?.wallet || s.meta.params?.token_address) && <p className="source-subject">Subject: <AddressText text={String(s.meta.params.wallet ?? s.meta.params.address ?? s.meta.params.token_address)} kind={operationSubject(s.meta.operation)} chain={s.meta.chain} /></p>}
                          <pre>
                            <AddressText text={JSON.stringify(
                              { data: s.data, meta: s.meta },
                              null,
                              2,
                            )} />
                          </pre>
                        </details>
                      ))}
                      </details>
                    </>
                  )}
                  </div>
                </section>
              )}

            </>
          )}
        </main>

      </div>
      <AddressCopyNotice />
      <RunHistory remove={removeHistory} busy={busy} more={status.historyNextCursor ? () => {void loadHistory();} : undefined} loading={historyLoading} runs={status.runs} selected={run?.id} choose={id => {void watch(id).catch(e => setError(e.message));}} clear={() => {viewedRun.current=null;setRun(null);setChatMessages([]);setQuestion("");setLiveData(true);setView("research");}} />
      </div>
    </div>
  );
}
function Brand() {
  return (
    <div className="brand">
      <svg width="29" height="29" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M4 5h23L16 16h11L4 28V5Z" fill="currentColor" />
        <circle cx="11" cy="11" r="2.1" fill="white" />
      </svg>
      <span>
        birdeye<span className="brand-suffix"> / skills</span>
      </span>
    </div>
  );
}
function UsageStat({ label, value }: { label: string; value: unknown }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{String(value ?? "Unknown")}</strong>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(<StorageGate><AddressCopyProvider><App /></AddressCopyProvider></StorageGate>);
