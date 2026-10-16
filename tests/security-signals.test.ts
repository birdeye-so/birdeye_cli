import test from "node:test";
import assert from "node:assert/strict";
import {securityEvidenceSections} from "../src/security-signals.js";
import type {Result} from "../src/runner.js";

const source=(operation:string,data:unknown):Result=>({schemaVersion:1,data,meta:{operation,requestId:operation+"-request",retrievedAt:"2026-10-16T08:00:00Z"}});
const section=(sections:ReturnType<typeof securityEvidenceSections>,title:string)=>sections.find(s=>s.title.startsWith(title))!.rows;
test("security evidence preserves exact balances, ratio units and independent source provenance",()=>{
  const sections=securityEvidenceSections([
    source("token.overview",{marketCap:2000000,fdv:5000000,liquidity:100000,v24hUSD:250000,holder:2345,trade24h:42,buy24h:12,sell24h:30,vBuy24hUSD:100000,vSell24hUSD:150000,totalSupply:"9007199254740993.123456789"}),
    source("token.security",{top10HolderPercent:"0.625",top10UserPercent:"0.4",creatorPercentage:0,ownerPercentage:1,creatorBalance:"9007199254740993.123456789",freezeable:false,transferFeeEnable:true}),
    source("token.holder-distribution",{summary:{wallet_count:10,total_holding:"9007199254740993.123456789",percent_of_supply:68},holders:[{wallet:"wallet-1",holding:"9007199254740993.123456789",percent_of_supply:18}]}),
  ]);
  const market=section(sections,"Market"),ownership=section(sections,"Ownership"),controls=section(sections,"Token control");
  const value=(rows:Record<string,any>[],key:string)=>rows.find(r=>r.key===key)!.value;
  assert.equal(value(market,"liquidityToMarketCap"),"5");assert.equal(value(market,"volumeToLiquidity"),"2.5");
  assert.equal(value(market,"netBuy24hUSD"),"-50000");assert.equal(value(market,"totalSupply"),"9007199254740993.123456789");
  assert.equal(value(ownership,"top10HolderPercent"),"62.5");assert.equal(value(ownership,"top10UserPercent"),"40");
  assert.equal(value(ownership,"creatorPercentage"),"0");assert.equal(value(ownership,"ownerPercentage"),"100");
  assert.equal(value(ownership,"creatorBalance"),"9007199254740993.123456789");
  assert.equal(value(controls,"freezeable"),false);assert.equal(value(controls,"transferFeeEnable"),true);
  assert.equal(value(controls,"nonTransferable"),null);
  const holder=section(sections,"Holder")[0];assert.equal(holder.amount,"9007199254740993.123456789");assert.equal(holder.supplySharePct,"18");assert.equal(holder.position,1);
  assert.ok(market.every(r=>r.sourceId==="token.overview-request"&&r.asOf));
  assert.ok(ownership.slice(0,10).every(r=>r.sourceId==="token.security-request"&&r.asOf));
  assert.equal(holder.sourceId,"token.holder-distribution-request");
  assert.equal(value(ownership,"topWalletSupplyPct"),"68","Distribution percentages must not be multiplied by 100");
  assert.equal(value(ownership,"topWalletCount"),"10");
  assert.equal(sections.slice(0,4).reduce((sum,s)=>sum+s.rows.length,0),38);
});
test("security evidence handles missing, malformed, negative and zero-denominator values without false zeroes",()=>{
  for(const bad of [null,undefined,"",true,"NaN",Infinity,-1,{},[]]) {
    const sections=securityEvidenceSections([source("token.overview",{marketCap:0,liquidity:0,v24hUSD:0,holder:bad,vBuy24hUSD:bad,vSell24hUSD:0}),source("token.security",{top10HolderPercent:bad,freezeable:"false",ownerAddress:null})]);
    const market=section(sections,"Market"),ownership=section(sections,"Ownership");
    for(const key of ["holder","liquidityToMarketCap","volumeToLiquidity","netBuy24hUSD"])assert.equal(market.find(r=>r.key===key)!.value,null);
    assert.equal(ownership[0].value,null);assert.equal(section(sections,"Token control")[0].value,null);
    assert.equal(section(sections,"Authority")[1].value,null);
  }
  const invalid=securityEvidenceSections([source("token.overview",{holder:1.5}),source("token.security",{top10HolderPercent:1.01})]);
  assert.equal(section(invalid,"Ownership")[0].value,null);assert.equal(section(invalid,"Market").find(r=>r.key==="holder")!.value,null);
  const empty=securityEvidenceSections([]);
  assert.ok(empty.slice(0,4).every(s=>s.rows.every(r=>r.value===null&&r.sourceId===null&&r.asOf===null)));
  assert.deepEqual(section(empty,"Holder"),[]);
});
