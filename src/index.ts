#!/usr/bin/env node
import { Command, Option } from "commander";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
import {
  configDir,
  configPath,
  readConfig,
  saveConfig,
  safeConfig,
  dataKey,
  activeProfile,
  validateProviderUrl,
  type Config,
} from "./config.js";
import { Ledger } from "./ledger.js";
import { RunStore, type StoredRun } from "./run-store.js";
import { KnowledgeBase } from "./knowledge.js";
import {WorkflowImports,planImported,runImported} from "./workflow-import.js";
import {loadWorkflowSources} from "./workflow-sources.js";
import {demoCatalog,planDemo,runDemo} from "./demos.js";
import { Runner } from "./runner.js";
import { prepare, capabilities } from "./catalog.js";
import { render, project } from "./output.js";
import type { Result } from "./runner.js";
import { runCase } from "./analysis.js";
import { loadDdEvidence, rescoreDd } from "./token-dd-rescore.js";
import { planCase, workflowCatalog, type CaseInput } from "./workflows.js";
import { registerDataCommands } from "./commands.js";
import { completion } from "./ai.js";
import { AppError, errorData, integer, now, type Data } from "./shared.js";
import {registerPriceSurge} from "./price-surge/command.js";
import {planPriceSurge} from "./price-surge/api.js";

const program = new Command()
  .name("birdeye-cli")
  .version("0.4.0")
  .description("Birdeye data, CU accounting and a local AI research interface");
program
  .addOption(
    new Option("--format <format>", "output format")
      .choices(["json", "table", "interface", "plain", "ui"])
      .default("json"),
  )
  .option("--short", "compact deterministic output", false)
  .option("--chain <chain>", "chain (Price Surge also supports bsc, base, ethereum, robinhood)", "solana")
  .option(
    "--max-cu <cu>",
    "optional maximum estimated CU per run (default: unlimited)",
    (v) => integer(v, "max-cu", 0, Number.MAX_SAFE_INTEGER),
  )
  .option("--workflow <id>", "charge requests to an existing workflow budget")
  .option("--estimate-cu", "show the request and cost without calling Birdeye")
  .option("--config-dir <path>", "configuration and ledger directory")
  .option("--bind <address>", "interface host:port (default 127.0.0.1:3000)")
  .addOption(new Option("--storage <storage>", "interface storage: SQLite or encrypted browser workspace").choices(["sqlite", "browser"]).default("sqlite"))
  .option("--ai-profile <name>", "AI provider profile")
  .option("--require-code", "require a connection code even on loopback")
  .option("--session-max-cu <cu>", "interface session budget", (v) =>
    integer(v, "session-max-cu", 0, Number.MAX_SAFE_INTEGER),
  )
  .option("--tls-cert <path>", "HTTPS certificate for non-loopback bind")
  .option("--tls-key <path>", "HTTPS private key for non-loopback bind")
  .option(
    "--public-url <url>",
    "browser URL allowed by Host/Origin checks (supports HTTPS proxy to loopback)",
  );
let ledger: Ledger | undefined;
let currentRun: string | undefined;
let storedRun: StoredRun | undefined;
let runStore: RunStore | undefined;
let serving = false;
function options(command: Command) {
  const opts = command.optsWithGlobals();
  if (opts.format === "ui") opts.format = "json";
  if (opts.format === "plain") opts.format = "table";
  if (opts.configDir) process.env.BIRDEYE_CONFIG_DIR = opts.configDir;
  if (opts.storage === "browser" && opts.format !== "interface")
    throw new AppError("INVALID_INPUT", "--storage browser requires --format interface.");
  if (opts.bind && opts.format !== "interface")
    throw new AppError("INVALID_INPUT", "--bind requires --format interface.");
  return opts;
}
function db() {
  return (ledger ||= new Ledger(join(configDir(), "usage.sqlite")));
}
function archive() { return runStore ||= new RunStore(db()); }
function beginStoredRun(title: string, input: Data) {
  storedRun = {id:currentRun!,title,input,status:"running",createdAt:now(),ai:{inputTokens:0,outputTokens:0,calls:0,unknownCalls:0}};
  archive().save(storedRun);
}
function checkpoint(result: Result, finished = false) {
  storedRun!.result = result;
  storedRun!.status = finished ? (result.meta.coverage === "partial" ? "partial" : "completed") : "running";
  archive().save(storedRun!);
}
function print(data: unknown, opts: Data) {
  console.log(render(data, opts.format, opts.short));
}
async function serve(
  opts: Data,
  initial?: { operation: string; params: Data },
  initialCase?: CaseInput,
  initialRunId?: string,
) {
  if (opts.chain !== "solana" && initialCase?.kind !== "skill-price-surge")
    throw new AppError("UNSUPPORTED_CHAIN", "This release supports solana.");
  if(opts.storage === "browser") {
    if(initial || initialCase || initialRunId || opts.sessionMaxCu !== undefined || opts.maxCu !== undefined)
      throw new AppError("INVALID_INPUT", "Browser mode starts an independent workspace. Choose your skill and budget in the browser.");
    if(opts.requireCode || opts.tlsCert || opts.tlsKey)
      throw new AppError("INVALID_INPUT", "Browser mode serves static files on loopback. Terminate HTTPS at a reverse proxy and use --public-url; connection codes are not used.");
    const {startBrowserInterface}=await import("./interface/browser-server.js");
    const app=await startBrowserInterface(opts.bind,opts.publicUrl);
    serving=true;
    console.log(`Browser-only interface: ${app.url}\nLocal upstream: ${app.listenUrl}\nKeys, history and CU stay in the browser. No SQLite workspace is opened.\nFor website hosting, deploy dist/browser over HTTPS.`);
    for(const signal of ["SIGINT","SIGTERM"] as const)process.once(signal,()=>{void app.close();});
    return;
  }
  const { startInterface } = await import("./interface/server.js");
  const app = await startInterface({
    ledger: db(),
    bind: opts.bind,
    maxCu: opts.maxCu,
    sessionMaxCu: opts.sessionMaxCu,
    short: opts.short,
    aiProfile: opts.aiProfile,
    requireCode: opts.requireCode,
    tlsCert: opts.tlsCert,
    tlsKey: opts.tlsKey,
    publicUrl: opts.publicUrl,
    initial,
    initialCase,
    initialRunId,
  });
  serving = true;
  console.log(
    `Birdeye interface: ${app.url}\nConfiguration: ${configPath()}\nConnection code: ${app.connectCode}\nCode is reusable until restart; connected users share this workspace and API usage.\nLoopback browsers connect automatically unless --require-code is set. Remote access requires the code. Ctrl+C stops the server.`,
  );
  const close = async () => {
    await app.close();
    ledger?.close();
    process.exitCode = 0;
  };
  process.once("SIGINT", close);
  process.once("SIGTERM", close);
}
async function execute(operation: string, params: Data, command: Command) {
  const opts = options(command);
  prepare(operation, params, opts.chain);
  if (opts.estimateCu) {
    const p = prepare(operation, params, opts.chain);
    print(
      {
        operation,
        chain: opts.chain,
        params: p.params,
        estimatedCu: p.entry.cost,
        upperBoundCu: p.entry.cost,
        billing: "documentation estimate",
        provisional: !!p.entry.provisional,
      },
      opts.format === "interface" ? { ...opts, format: "json" } : opts,
    );
    return;
  }
  if (opts.format === "interface") {
    await serve(opts, { operation, params });
    return;
  }
  const runner = new Runner(db(), dataKey(readConfig()));
  currentRun = db().createRun(opts.maxCu, opts.workflow);
  beginStoredRun(operation, {mode:"operation", query:{operation,params:prepare(operation,params,opts.chain).params},chain:opts.chain});
  const result = await runner.execute(operation, params, {
      run: currentRun,
      chain: opts.chain,
    });
  checkpoint(result, true);
  print(result, opts);
}
const token = program.command("token").description("Token data");
for (const name of ["price", "overview", "security"])
  token
    .command(`${name} <address>`)
    .action(async (address: string, _: unknown, c: Command) =>
      execute(`token.${name}`, { address }, c),
    );
token
  .command("holders <address>")
  .option("--limit <n>", "page size", "10")
  .option("--offset <n>", "page offset", "0")
  .addOption(
    new Option("--mode <mode>", "holder grouping")
      .choices(["wallet", "token_account"])
      .default("wallet"),
  )
  .action(async (address: string, o: Data, c: Command) =>
    execute(
      "token.holders",
      { address, limit: o.limit, offset: o.offset, mode: o.mode },
      c,
    ),
  );
const market = program
  .command("market")
  .description("Market rankings and candles");
market
  .command("trending")
  .option("--limit <n>", "page size", "20")
  .option("--offset <n>", "page offset", "0")
  .option("--interval <interval>", "1h, 4h or 24h", "24h")
  .option("--sort-by <field>", "rank, volumeUSD, liquidity", "rank")
  .option("--sort-type <direction>", "asc or desc", "asc")
  .action(async (o: Data, c: Command) =>
    execute(
      "market.trending",
      {
        limit: o.limit,
        offset: o.offset,
        interval: o.interval,
        sort_by: o.sortBy,
        sort_type: o.sortType,
      },
      c,
    ),
  );
market
  .command("ohlcv <address>")
  .requiredOption("--from <seconds>", "start Unix timestamp in seconds")
  .requiredOption("--to <seconds>", "end Unix timestamp in seconds")
  .option(
    "--interval <interval>",
    "candle interval (case-sensitive; 1m, 1H, 1D)",
    "1H",
  )
  .action(async (address: string, o: Data, c: Command) =>
    execute(
      "market.ohlcv",
      { address, type: o.interval, time_from: o.from, time_to: o.to },
      c,
    ),
  );
program
  .command("portfolio")
  .command("holdings <wallet>")
  .option("--limit <n>", "page size", "20")
  .option("--offset <n>", "page offset", "0")
  .action(async (wallet: string, o: Data, c: Command) =>
    execute(
      "portfolio.holdings",
      { wallet, limit: o.limit, offset: o.offset },
      c,
    ),
  );
program
  .command("capabilities")
  .action((_: unknown, c: Command) => print(capabilities(), options(c)));
program
  .command("chains")
  .option("--refresh", "query upstream network list (1 CU)")
  .action(async (o: Data, c: Command) =>
    o.refresh
      ? execute("chains.refresh", {}, c)
      : print({
        implemented: [...new Set(capabilities().flatMap(operation => operation.chains))],
        skills: Object.fromEntries(workflowCatalog().filter(skill => skill.family !== "legacy").map(skill => [skill.kind, skill.supportedChains])),
        note: "Support varies by skill and operation; check cases and capabilities. Upstream network discovery does not enable additional CLI chains.",
      }, options(c)),
  );
const usage = program.command("usage");
usage.command("show").action((_: unknown, c: Command) => {
  const o = options(c);
  print(
    {
      cu: db().summary(undefined, o.workflow),
      ...(o.short ? {} : { attempts: db().attempts() }),
    },
    o,
  );
});
usage
  .command("credits")
  .action(async (_: unknown, c: Command) => execute("usage.credits", {}, c));
const workflow = program.command("workflow");
workflow.command("import <source>").description("Import GitHub, local Markdown/folder or Birdeye workflow JSON; no CU")
  .option("--ref <revision>","GitHub branch, tag or commit")
  .action(async(source:string,o:Data,c:Command)=>{const opts=options(c);const store=new WorkflowImports(db());const records=store.import(await loadWorkflowSources(source,{ref:o.ref}));print(records.map(r=>store.preview(r.id)),{...opts,format:opts.format==="interface"?"json":opts.format});});
const imported=workflow.command("imports").description("Inspect and execute migrated workflow definitions stored in SQLite");
imported.command("list").action((_:unknown,c:Command)=>{const opts=options(c);print(new WorkflowImports(db()).list(),opts);});
imported.command("show <id>").action((id:string,_:unknown,c:Command)=>{const opts=options(c);print(new WorkflowImports(db()).preview(id),opts);});
for(const action of ["plan","run"] as const) imported.command(`${action} <id>`)
  .option("--address <address>","Solana token/wallet input")
  .option("--params <json>","Runtime from/to, limit and stepOverrides JSON","{}")
  .action(async(id:string,o:Data,c:Command)=>{
    const opts=options(c),store=new WorkflowImports(db()),record=store.get(id),params={...JSON.parse(o.params),...(o.address?{address:o.address}:{})};
    if(opts.chain!=="solana")throw new AppError("UNSUPPORTED_CHAIN","Imported workflows currently support Solana.");
    if(action==="plan" || opts.estimateCu) {print(store.preview(id,params),{...opts,format:opts.format==="interface"?"json":opts.format});return;}
    if(opts.format==="interface")throw new AppError("INVALID_INPUT","Open --format interface and use the Imports tab to run this saved workflow.");
    const plan=planImported(record,params),runner=new Runner(db(),dataKey(readConfig()));
    currentRun=db().createRun(opts.maxCu,opts.workflow,Math.max(20,plan.maxRequests*2));
    beginStoredRun(record.title,{mode:"imported",importId:id,importParams:params});
    const result=await runImported(runner,currentRun,record,params,undefined,undefined,r=>checkpoint(r));
    checkpoint(result,true);print(result,opts);if(result.meta.coverage==="partial")process.exitCode=5;
  });
const knowledge = program.command("knowledge").description("Search the bundled Birdeye Markdown knowledge base (0 CU)");
knowledge.command("search <query>").action((query:string,_:unknown,c:Command)=>{const opts=options(c);print(new KnowledgeBase(db()).search(query),opts);});
knowledge.command("show <id>").option("--offset <n>","character offset",v=>integer(v,"offset",0,10000000),0)
  .action((id:string,o:Data,c:Command)=>{const opts=options(c);print(new KnowledgeBase(db()).read(id,o.offset),opts);});
const history = program.command("history").description("Reuse saved run data locally, without API requests");
history.command("list")
  .option("--limit <n>", "page size (1–100)", v => integer(v,"limit",1,100), 50)
  .option("--before <cursor>", "nextCursor from the previous page", v => integer(v,"before",1,Number.MAX_SAFE_INTEGER))
  .action((o:Data,c:Command) => {const opts=options(c);print(archive().list(o.limit,o.before),opts);});
history.command("show <id>").description("Read/export the original snapshot; no Birdeye or AI calls")
  .action(async (id:string,_:unknown,c:Command) => {
    const opts=options(c), run=archive().get(id);
    if(opts.format === "interface") {await serve(opts,undefined,undefined,id);return;}
    print({...run,...(opts.short && run.result ? {result:project(run.result,true)} : {}),reuse:{additionalCu:0,additionalAiTokens:0}},opts);
  });
workflow
  .command("create")
  .option("--label <label>", "workflow label", "research")
  .action((o: Data, c: Command) => {
    const opts = options(c);
    print(db().createWorkflow(o.label, opts.maxCu), opts);
  });
workflow.command("show <id>").action((id: string, _: unknown, c: Command) => {
  const opts = options(c);
  print(db().workflow(id), opts);
});
registerDataCommands(program, execute);
program.command("demos").description("List customer demo products; no API requests").action((_:unknown,c:Command)=>print(demoCatalog,options(c)));
program.command("demo <id>").description("Run a customer demo snapshot; see demos for IDs")
  .option("--address <address>","Solana token or wallet input")
  .option("--limit <n>","terminal: tokens to enrich; wallet discovery: maximum tokens / shortlisted wallets (1–5)",Number)
  .option("--min-liquidity <usd>","security signal threshold; default 100000 USD",Number)
  .option("--max-top10-pct <percent>","security top-10 token-account threshold; default 50",Number)
  .option("--from <seconds>","observation window start, Unix seconds",Number)
  .option("--to <seconds>","observation window end, Unix seconds",Number)
  .action(async(id:string,o:Data,c:Command)=>{
    const opts=options(c);
    if(opts.chain!=="solana")throw new AppError("UNSUPPORTED_CHAIN","Customer demos support Solana.");
    const plan=planDemo({id,...o},!!opts.estimateCu);
    if(opts.estimateCu) {print(plan,{...opts,format:opts.format==="interface"?"json":opts.format});return;}
    if(opts.format==="interface")throw new AppError("INVALID_INPUT","Open --format interface and choose the Demos tab.");
    const runner=new Runner(db(),dataKey(readConfig()));
    currentRun=db().createRun(opts.maxCu,opts.workflow,Math.max(20,plan.maxRequests*2));
    beginStoredRun(plan.demo.title,{mode:"demo",demo:plan.demoInput,case:plan.input});
    const result=await runDemo(runner,currentRun,plan.demoInput,undefined,undefined,result=>checkpoint(result));
    checkpoint(result,true);print(result,opts);if(result.meta.coverage==="partial")process.exitCode=5;
  });
async function executePriceSurge(params: Data, command: Command) {
  const opts = options(command);
  const plan = planPriceSurge(params);
  const output = {...opts, format: ["ui", "interface"].includes(opts.format) ? "json" : opts.format === "plain" ? "table" : opts.format};
  if (opts.estimateCu) { print(plan, output); return; }
  const input = planCase({kind: "skill-price-surge", priceSurge: plan.params}).input;
  if (opts.format === "interface") { await serve(opts, undefined, input); return; }
  const runner = new Runner(db(), dataKey(readConfig()));
  currentRun = db().createRun(opts.maxCu, opts.workflow, Math.max(20, plan.maxRequests * 2));
  beginStoredRun("Price Surge Screen", {mode: "case", case: input});
  const result = await runCase(runner, currentRun, input, undefined, undefined, result => checkpoint(result));
  checkpoint(result, true); print(result, output);
  if (result.meta.coverage === "partial") process.exitCode = 5;
}
registerPriceSurge(program, executePriceSurge);
program.command("cases").description("List available workflow recipes").action((_: unknown, c: Command) => print(workflowCatalog().filter(item => item.family !== "legacy"), options(c)));
program
  .command("case <kind>")
  .description("Run a bounded research workflow; see cases for available recipes")
  .option("--address <address>", "token or wallet address")
  .option("--limit <n>", "maximum subjects to enrich (1–5)", Number)
  .option("--scan-limit <n>", "discovery page size (1–50)", Number)
  .option("--interval <interval>", "trending window (1h, 4h, 24h)")
  .option("--depth <depth>", "core or full")
  .option("--duration <duration>", "wallet trade window (24h, 7d, 30d, 90d)")
  .option("--pnl-method <method>", "wac or net_cash")
  .option("--from <seconds>", "observation start Unix seconds", Number)
  .option("--to <seconds>", "observation end Unix seconds", Number)
  .option("--stage <stage>", "newly-listed, newly-created, near-graduation, graduated")
  .option("--source <venue>", "launch venue; default all")
  .option("--min-progress <percent>", "explicit threshold for near-graduation", Number)
  .option("--min-liquidity <usd>", "exclude candidates below this liquidity", Number)
  .option("--max-top10-pct <percent>", "exclude above this top-10 token-account supply share", Number)
  .option("--exclude-freezeable", "stop token enrichment when freezeable or unknown")
  .option("--baseline-liquidity <usd>", "user-supplied token liquidity baseline", Number)
  .option("--baseline-time <seconds>", "timestamp of the supplied baseline", Number)
  .option("--wallets <addresses>", "leaderboard wallets, comma-separated (1–10)", value => value.split(",").map((s: string) => s.trim()))
  .option("--intervals <durations>", "multi-window PnL: 24h,7d,30d,90d,all", value => value.split(",").map((s: string) => s.trim()))
  .option("--skill-depth <depth>", "Smart Wallets: fast, standard or deep")
  .option("--dd-mode <mode>", "Token DD Score: standard (2 calls) or advanced (7 calls)")
  .option("--top-n <n>", "Token DD Score: first holder page size (10–50)", Number)
  .option("--liq-resolution <resolution>", "Token DD Score liquidity candles: 1m,5m,15m,30m,1h,4h,1D")
  .option("--liq-candles <n>", "Token DD Score liquidity candles (1–100, default 96)", Number)
  .option("--rescore <source>", "Token DD Score: saved run ID, full JSON path or base64:JSON; 0 API calls")
  .option("--list-source <source>", "Trending List: v3-list or trending")
  .option("--sort-by <field>", "volume, liquidity, market_cap, holder, trade_count or rank")
  .option("--platform <name>", "V3 token list platform filter")
  .option("--resolution <interval>", "candles: 1m,5m,15m,30m,1H,4H,1D")
  .option("--window-days <days>", "token observation window (1–30)", Number)
  .option("--include <features>", "Token DD: list,advanced_security,risk_history", value => value.split(",").map((s: string) => s.trim()))
  .option("--skip-kline", "omit Contract DD candle step")
  .option("--skip-portfolio", "omit wallet holdings step")
  .option("--skip-first-funded", "omit first-funding lookup")
  .option("--skip-transactions", "omit wallet transaction/trade page")
  .option("--skip-positions", "omit per-token PnL; scores may become unavailable")
  .option("--step-overrides <json>", "Per-step API parameter overrides as a JSON object", JSON.parse)
  .option("--price-surge <json>", "Price Surge parameters as a JSON object", JSON.parse)
  .option("--launch-sort <field>", "Launchpad: volume_24h_usd, liquidity, market_cap, creation_time, graduated_time or progress_percent")
  .option("--stats-frames <frames>", "Token Stats rolling windows, e.g. 1h,24h", value => value.split(",").map((s: string) => s.trim()))
  .option("--trader-window <window>", "Top Trader window, from 30m to all_time; default 24h")
  .option("--trader-sort <field>", "Top Traders: volume_usd, trade, total_pnl, realized_pnl, unrealized_pnl or hold_volume")
  .option("--tracker-frame <frame>", "Cohort bucket: 1m,5m,15m,30m,1h,4h,1D; default 1h")
  .option("--include-exited", "Smart Money Holders: include labeled wallets with zero current balance")
  .option("--signal-threshold-usd <usd>", "KOL: absolute net USD threshold for observed buy/sell dominance", Number)
  .action(async (kind: string, o: Data, c: Command) => {
    const opts = options(c);
    if (kind === "skill-price-surge") {
      const unsupported = Object.keys(o).filter(key => key !== "priceSurge");
      if (unsupported.length) throw new AppError("INVALID_INPUT", "Use price-surge with flags, or case skill-price-surge --price-surge '{...}'.");
      await executePriceSurge({...o.priceSurge, chain: o.priceSurge?.chain ?? opts.chain}, c); return;
    }
    if (opts.chain !== "solana") throw new AppError("UNSUPPORTED_CHAIN", "This release supports solana.");
    if (o.rescore) {
      if(kind!=="skill-token-dd-score")throw new AppError("INVALID_INPUT","--rescore requires skill-token-dd-score.");
      if(opts.estimateCu)throw new AppError("INVALID_INPUT","Re-score always uses 0 CU; omit --estimate-cu to save the local calculation.");
      const {rescore,...overrides}=o;
      const saved=rescoreDd(loadDdEvidence(rescore,archive()),overrides,db(),archive());
      if(opts.format==="interface") {await serve(opts,undefined,undefined,saved.id);return;}
      print(saved.result,opts);return;
    }
    const plan = planCase({kind, ...o});
    if (opts.estimateCu) { print(plan, {...opts, format: opts.format === "interface" ? "json" : opts.format}); return; }
    if (opts.format === "interface") { await serve(opts, undefined, plan.input); return; }
    const runner = new Runner(db(), dataKey(readConfig()));
    currentRun = db().createRun(opts.maxCu, opts.workflow, Math.max(20, plan.maxRequests * 2));
    beginStoredRun(workflowCatalog().find(c=>c.kind===kind)?.title || kind, {mode:"case",case:plan.input});
    const result = await runCase(runner, currentRun, plan.input, undefined, undefined, result => checkpoint(result));
    checkpoint(result, true);
    print(result, opts);
    if (result.meta.coverage === "partial") process.exitCode = 5;
  });
async function prompt(label: string, secret = false) {
  if (!process.stdin.isTTY)
    throw new AppError(
      "INTERACTIVE_REQUIRED",
      "Use environment variables for non-interactive setup.",
    );
  process.stdout.write(label);
  const output = secret
    ? new Writable({
        write(_chunk, _encoding, callback) {
          callback();
        },
      })
    : process.stdout;
  const rl = createInterface({ input: process.stdin, output, terminal: true });
  try {
    return await rl.question("");
  } finally {
    rl.close();
    if (secret) process.stdout.write("\n");
  }
}
const config = program.command("config");
config.command("show").action((_: unknown, c: Command) => {
  const opts = options(c);
  print(safeConfig(readConfig()), opts);
});
config.command("init").action(async (_: unknown, c: Command) => {
  const opts = options(c);
  const cfg = readConfig();
  cfg.birdeyeApiKey =
    process.env.BIRDEYE_API_KEY || (await prompt("Birdeye API key: ", true));
  saveConfig(cfg);
  print(safeConfig(cfg), opts);
});
const ai = config.command("ai");
ai.command("show").action((_: unknown, c: Command) => {
  const opts = options(c);
  print(safeConfig(readConfig()).ai, opts);
});
ai.command("init")
  .option("--name <name>", "profile name", "research")
  .option("--base-url <url>", "OpenAI-compatible base URL")
  .option("--model <model>", "provider model ID")
  .addOption(new Option("--api-format <format>", "AI provider API format")
    .choices(["responses", "chat-completions"]))
  .option(
    "--api-key-env <name>",
    "environment variable containing key",
  )
  .option("--save-key", "save the AI key from its environment variable or a hidden prompt locally")
  .action(async (o: Data, c: Command) => {
    const opts = options(c);
    const cfg = readConfig();
    const baseUrl = o.baseUrl || (await prompt("AI base URL: "));
    validateProviderUrl(baseUrl);
    const model = o.model || (await prompt("Model: "));
    const prior = cfg.ai.profiles[o.name];
    const apiKeyEnv = o.apiKeyEnv ?? prior?.apiKeyEnv ?? "BIRDEYE_AI_API_KEY";
    const apiKey = o.saveKey
      ? process.env[apiKeyEnv] || (await prompt("AI API key: ", true))
      : prior && new URL(prior.baseUrl).origin === new URL(baseUrl).origin ? prior.apiKey : undefined;
    cfg.ai.profiles[o.name] = {
      provider: "openai-compatible",
      apiFormat: o.apiFormat ?? prior?.apiFormat ?? (prior ? "chat-completions" : "responses"),
      baseUrl,
      model,
      apiKeyEnv,
      ...(apiKey ? {apiKey} : {}),
    };
    cfg.ai.defaultProfile = o.name;
    saveConfig(cfg);
    print(safeConfig(cfg).ai, opts);
  });
program
  .command("doctor")
  .option("--live", "check Birdeye connection (1 CU)")
  .option("--ai", "send a minimal AI provider request (uses AI tokens)")
  .action(async (o: Data, c: Command) => {
    const opts = options(c);
    const cfg: Config = readConfig();
    if (o.live) {
      await execute("chains.refresh", {}, c);
      return;
    }
    if (o.ai) {
      const profile = activeProfile(cfg, opts.aiProfile);
      if (!profile)
        throw new AppError(
          "AI_CONFIG_MISSING",
          "Configure an AI profile first.",
        );
      const usage = {
        inputTokens: 0,
        outputTokens: 0,
        calls: 0,
        unknownCalls: 0,
      };
      await completion(profile, [{ role: "user", content: "Reply with OK." }], {
        usage,
      });
      print({ connected: true, apiFormat: profile.apiFormat ?? "chat-completions", usage }, opts);
      return;
    }
    print(
      {
        node: process.version,
        configDirectory: configDir(),
        configDatabase: configPath(),
        ...safeConfig(cfg),
        liveCheck: false,
      },
      opts,
    );
  });
program.action(async (o: Data, c: Command) => {
  const opts = options(c);
  if (opts.format === "interface") await serve(opts);
  else program.outputHelp();
});
program.exitOverride();
try {
  await program.parseAsync();
} catch (error) {
  const code = (error as { code?: string }).code;
  if (
    ![
      "commander.helpDisplayed",
      "commander.version",
      "commander.help",
    ].includes(code || "")
  ) {
    const data = code?.startsWith("commander.")
      ? {
          code: "INVALID_INPUT",
          message: (error as Error).message,
          retryable: false,
        }
      : errorData(error);
    let storageError;
    if (storedRun) {
      storedRun.status = "failed";
      storedRun.error = data;
      try { archive().save(storedRun); } catch(error) {storageError=errorData(error);}
    }
    console.error(
      JSON.stringify({
        error: data,
        ...(storageError ? {storageError,unsavedResult:storedRun?.result} : {}),
        ...(currentRun
          ? { meta: { runId: currentRun, cu: ledger?.summary(currentRun) } }
          : {}),
      }),
    );
    process.exitCode = data.code.startsWith("AUTH")
      ? 3
      : data.code === "INVALID_INPUT"
        ? 2
        : data.code === "CU_BUDGET_EXCEEDED"
          ? 4
          : 1;
  }
} finally {
  if (!serving) ledger?.close();
}
