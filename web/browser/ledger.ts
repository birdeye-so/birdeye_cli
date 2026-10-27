import {AppError,integer,now} from "../../src/shared";
import {PRICING_VERSION} from "../../src/catalog";
import type {Workspace} from "./vault";
import type {LedgerPort} from "../../src/ledger-port";
export class BrowserLedger implements LedgerPort {
  constructor(private state: Workspace) {}
  createRun(maxCu:number|null=null, workflow?:string, maxRequests=20) {
    if(workflow) throw new AppError("UNSUPPORTED","Shared session budgets are not used in browser storage.");
    if(maxCu!==null)integer(maxCu,"max-cu",0,Number.MAX_SAFE_INTEGER);
    integer(maxRequests,"max-requests",1,1000);
    const id=crypto.randomUUID();this.state.ledgerRuns.push({id,maxCu,maxRequests});return id;
  }
  reserve(run:string,operation:string,cost:number|null,credential:string) {
    const settings=this.state.ledgerRuns.find(r=>r.id===run);
    if(!settings)throw new AppError("RUN_NOT_FOUND","Run not found.");
    const own=this.summary(run);
    if(own.attempts>=settings.maxRequests)throw new AppError("REQUEST_LIMIT","Request-attempt limit reached.");
    if(settings.maxCu!==null && ((cost===null && settings.maxCu===0)||own.budgetUsed+(cost??0)>settings.maxCu))throw new AppError("CU_BUDGET_EXCEEDED","Run CU budget exhausted.");
    const id=crypto.randomUUID();
    this.state.attempts.push({id,run,operation,credential,reserved:cost??0,estimated:cost===null?null:0,status:"pending",created_at:now(),pricing_version:cost===null?"mcp-unpriced":PRICING_VERSION});
    return id;
  }
  finish(id:string,status:"completed"|"uncertain"|"not-sent",estimated=0) {
    const row=this.state.attempts.find(a=>a.id===id);
    if(!row || row.status!=="pending")return;
    row.status=status;row.estimated=row.pricing_version==="mcp-unpriced"?null:estimated;
    if(status==="not-sent")row.reserved=0;
  }
  summary(run?:string) {
    const rows=this.state.attempts.filter(a=>!run||a.run===run);
    return {estimated:rows.reduce((s,a)=>s+Number(a.estimated),0),reported:null,unknownCostAttempts:rows.filter(a=>a.pricing_version==="mcp-unpriced"&&a.status!=="not-sent").length,budgetUsed:rows.reduce((s,a)=>s+a.reserved,0),uncertainAttempts:rows.filter(a=>["pending","uncertain"].includes(a.status)).length,attempts:rows.filter(a=>a.status!=="not-sent").length,pricingVersion:PRICING_VERSION};
  }
  attempts(run?:string) {return this.state.attempts.filter(a=>!run||a.run===run);}
  snapshot(_credential:string,_data:unknown) {}
}
