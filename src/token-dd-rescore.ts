import {readFileSync,statSync} from "node:fs";
import type {Result} from "./runner.js";
import type {Ledger} from "./ledger.js";
import {RunStore} from "./run-store.js";
import {caseSchema} from "./workflows.js";
import {skillAnalysis} from "./skill-metrics.js";
import {AppError,now,type Data} from "./shared.js";

export function attachDdCu(result:Result,ledger:Ledger,run:string) {
  const report=result.data.skillAnalysis?.findings?.find((f:Data)=>f.kind==="token-dd-score");
  if(!report)return;
  const breakdown:Record<string,number>={base:0,list:0,advanced_security:0,risk_history:0,refunded_rollback:0};
  const groups:Record<string,string>={"token.overview":"base","token.security":"base","token.holder-distribution":"list","token.holder-profile":"list","token.holders":"list","token.money-flow":"advanced_security","token.liquidity-ohlc":"advanced_security"};
  for(const attempt of ledger.attempts(run)) {
    if(attempt.status!=="not-sent"&&groups[String(attempt.operation)])breakdown[groups[String(attempt.operation)]]+=Number(attempt.estimated??0);
  }
  report.meta={...report.meta,cu_breakdown:breakdown,cu_estimated_total:ledger.summary(run).estimated,cu_reserved_total:ledger.summary(run).budgetUsed,cu_billed_total:null,
    cu_note:"Documentation estimates, including retries; not confirmed billing. OHLC 30 CU is provisional, not a verified upper bound. No skipped-call refunds are claimed."};
}

export function loadDdEvidence(value:string,archive:RunStore):Result {
  if(/^[a-f0-9]{8}-[a-f0-9-]{27}$/i.test(value)) {
    const run=archive.get(value);if(!run.result)throw new AppError("RESCORE_INVALID","Saved run has no evidence.");return run.result;
  }
  let text:string;
  const max=32*1024*1024;
  try {
    if(value.startsWith("base64:")) {
      if(value.length>max*1.4)throw new Error();
      text=Buffer.from(value.slice(7),"base64").toString("utf8");
    } else {
      if(statSync(value).size>max)throw new Error();
      text=readFileSync(value,"utf8");
    }
    if(Buffer.byteLength(text)>max)throw new Error();
    const parsed=JSON.parse(text);return parsed.result??parsed;
  } catch {throw new AppError("RESCORE_INVALID","Use a saved run ID, full JSON export path, or base64:<encoded JSON> (maximum 32 MiB).");}
}

export function rescoreDd(original:Result,overrides:Data,ledger:Ledger,archive:RunStore) {
  if(original?.data?.plan?.kind!=="skill-token-dd-score"||!Array.isArray(original.data.sources))throw new AppError("RESCORE_INVALID","Expected a full Token DD Score result with source evidence.");
  if(original.data.sources.length>20||original.data.sources.some((s:Data)=>!s||typeof s!=="object"||!s.meta||typeof s.meta.operation!=="string"||!s.meta.params||s.data===undefined))throw new AppError("RESCORE_INVALID","Invalid source evidence in exported result.");
  if(original.data.sources.some((s:Data)=>s.outputTruncation)||original.meta?.outputTruncation)throw new AppError("RESCORE_INVALID","Short output cannot be re-scored. Use the full SQLite run or JSON export.");
  const allowed=new Set(["ddMode","topN","liqCandles"]);
  if(Object.keys(overrides).some(k=>!allowed.has(k)))throw new AppError("RESCORE_INVALID","Local re-score supports ddMode, topN and liqCandles only. Resolution and API step edits require a new fetch.");
  const input=caseSchema.parse({...original.data.plan.input,...overrides});
  const result:Result=structuredClone(original);
  const id=ledger.createRun(0),createdAt=now();
  result.data.plan={...result.data.plan,input,estimatedCu:0,maxRequests:0,steps:[]};
  result.data.skillAnalysis=skillAnalysis(input,result.data.sources);
  const report=result.data.skillAnalysis.findings[0];
  report.caveats.push("0-CU re-score from cache. No new observations; larger windows cannot recover unfetched evidence.");
  result.data.missing=report.missing.map((reason:string)=>({step:"analysis",reason}));
  result.data.status=result.data.missing.length?"partial":"complete-for-requested-scope";
  result.meta={...result.meta,runId:id,retrievedAt:createdAt,coverage:result.data.status,cu:ledger.summary(id),
    rescore:{sourceRunId:original.meta?.runId??null,sourceRetrievedAt:original.meta?.retrievedAt??null,sourceCu:original.meta?.cu??null},warnings:[...(original.meta?.warnings??[]),"0-CU re-score from cache; original observation times are preserved on sources."]};
  attachDdCu(result,ledger,id);
  archive.save({id,title:"Token DD Score · Re-score",status:result.data.missing.length?"partial":"completed",createdAt,input:{mode:"case",case:input,rescoreOf:original.meta?.runId??null},result,ai:{inputTokens:0,outputTokens:0,calls:0,unknownCalls:0}});
  return archive.get(id);
}
