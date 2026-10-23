#!/usr/bin/env node
import {Command,Option} from "commander";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {existsSync} from "node:fs";

// Thin Node.js entrypoint: scoring, validation and SQLite storage belong to the CLI.
const cli = new Command().name("token-dd-score")
  .description("Token due-diligence score; reconstructed default formula, Solana only")
  .argument("[address]", "Solana token address; omit for --rescore")
  .addOption(new Option("--mode <mode>","evidence depth").choices(["standard","advanced"]))
  .addOption(new Option("--format <format>","output format").choices(["ui","json","raw-json","telegram","plain","interface"]).default("plain"))
  .addOption(new Option("--weights-preset <preset>","only the specified default preset is available").choices(["default"]))
  .option("--top-n <n>","top holder rows (10–50)")
  .option("--liq-resolution <resolution>","1m,5m,15m,30m,1h,4h,1D; default 15m")
  .option("--liq-candles <n>","1–100; default 96")
  .option("--rescore <source>","SQLite run ID, full JSON path, or base64:JSON; 0 CU")
  .option("--explain","include signal rules in plain output")
  .option("--short","compact output; use full JSON or SQLite for re-score")
  .option("--estimate-cu","plan only, no API calls")
  .option("--max-cu <n>","optional CU budget")
  .option("--chain <chain>","solana only")
  .option("--config-dir <path>","SQLite configuration directory")
  .option("--bind <address>","interface host:port")
  .option("--public-url <url>","interface browser URL")
  .parse();
const o=cli.opts();
const script=fileURLToPath(new URL("../../dist/index.js",import.meta.url));
if(!existsSync(script))cli.error("Build first with npm run build (Node >=22.16).");
const args=[script,"case","skill-token-dd-score"];
if(cli.args[0])args.push("--address",cli.args[0]);
for(const [key,flag] of Object.entries({mode:"dd-mode",topN:"top-n",liqResolution:"liq-resolution",liqCandles:"liq-candles",rescore:"rescore",maxCu:"max-cu",chain:"chain",configDir:"config-dir",bind:"bind",publicUrl:"public-url"}))if(o[key]!==undefined)args.push(`--${flag}`,o[key]);
if(o.estimateCu)args.push("--estimate-cu");
if(o.short)args.push("--short");
args.push("--format",o.format==="interface"?"interface":"json");
const child=spawnSync(process.execPath,args,{stdio:o.format==="interface"?"inherit":["inherit","pipe","inherit"],encoding:"utf8",maxBuffer:64*1024*1024});
if(child.error)cli.error(child.error.message);
if(o.format!=="interface"&&child.stdout) {
  let result;try{result=JSON.parse(child.stdout);}catch{process.stdout.write(child.stdout);process.exit(child.status??1);}
  const report=result?.data?.skillAnalysis?.findings?.find(f=>f.kind==="token-dd-score");
  if(["ui","json","raw-json"].includes(o.format)||!report)process.stdout.write(child.stdout);
  else {
    const number=v=>v==null?"N/A":Number(v).toFixed(1);
    console.log(`Token DD · ${report.mode} · ${report.address}\n${report.score.rating??"N/A"} · ${number(report.score.final)}/100 · ${report.score.verdict}`);
    for(const [name,p] of Object.entries(report.pillars)) {
      console.log(`${name}: ${number(p.score)} · coverage ${number(p.coverage*100)}%`);
      if(o.explain&&p.signals)for(const [key,s] of Object.entries(p.signals))console.log(`  ${key}: ${number(s.score)} — ${s.rule}`);
    }
    console.log(`Base ${number(report.score.base)} × gate ${report.gate_detail.gate.toFixed(3)}\nCoverage differs by mode. Risk label, not a trade call.`);
    console.log(`⚡ ${report.meta.cu_estimated_total} estimated CU · ${result.meta.cu.attempts} API attempts · billed CU unknown`);
    if(result.meta.rescore)console.log("0-CU re-score from cache");
    if(o.format!=="telegram"&&!o.short)console.log(report.caveats.join("\n"));
  }
}
process.exitCode=child.status??1;
