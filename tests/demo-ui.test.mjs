import test from "node:test";
import assert from "node:assert/strict";
import {build} from "esbuild";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {demoReports} from "./fixtures/demo-reports.mjs";
await build({entryPoints:["web/demo-views.tsx","web/demo-data.ts"],outdir:".test-dist/demo-ui",bundle:true,packages:"external",platform:"node",format:"esm",jsx:"automatic",outExtension:{".js":".mjs"}});
const {DemoView}=await import("../.test-dist/demo-ui/demo-views.mjs");
const {money,percent,ratio,sorted,observedAt}=await import("../.test-dist/demo-ui/demo-data.mjs");
const render=(id,report=demoReports[id])=>renderToStaticMarkup(React.createElement(DemoView,{id,report}));
test("demo units preserve zero, tiny prices, negative PnL and missing observations",()=>{
  assert.equal(money(0),"$0.00");assert.equal(money("0.00000042"),"$0.00000042");
  assert.equal(money("-120.5"),"−$120.50");assert.equal(money("9007199254740993.12"),"$9,007,199,254,740,993.12");
  for(const value of [null,undefined,"",true,Infinity,"NaN"])assert.equal(money(value),"Unavailable");
  assert.equal(percent(0),"0.00%");assert.equal(percent("-2.16",true),"-2.16%");
  assert.equal(ratio("25",100),25);assert.equal(ratio(null,100),0);assert.equal(ratio(200,100),100);
  assert.deepEqual(sorted([{v:null},{v:0},{v:-2},{v:"9007199254740993"},{v:"9007199254740992"}],"v").map(r=>r.v),["9007199254740993","9007199254740992",0,-2,null]);
});
test("each product renders its data-specific surface with bounded provenance",()=>{
  const terminal=render("terminal");assert.match(terminal,/Market watchlist/);assert.match(terminal,/Liquidity comparison/);assert.match(terminal,/Selected token/);assert.match(terminal,/\+3.45%/);assert.match(terminal,/data-address=/);
  const dex=render("dex-inspector");assert.match(dex,/Liquidity by pool/);assert.match(dex,/Sample pool A/);assert.match(dex,/\$1.60M/);assert.match(dex,/not executable depth/);
  const wallet=render("wallet-intelligence");assert.match(wallet,/PnL breakdown · 7d/);assert.match(wallet,/−\$120.50/);assert.match(wallet,/\$359.75/);assert.doesNotMatch(wallet,/\$1,400.00/);assert.match(wallet,/72.00%/);assert.match(wallet,/fetched page only/);
  const security=render("security-signals");assert.match(security,/Manual review required/);assert.match(security,/Triggers above 50.00%/);assert.match(security,/Unknown/);assert.doesNotMatch(security,/>Safe</);
  const telegram=render("telegram-brief");assert.match(telegram,/demo-chat-bubble/);assert.match(telegram,/no Telegram message sent/);assert.match(telegram,/Export message/);assert.doesNotMatch(telegram,/>Send</);
});
test("empty and legacy saved reports render unknown values without inventing metrics",()=>{
  for(const id of Object.keys(demoReports)){
    const html=render(id,{id,sections:[]});assert.doesNotMatch(html,/NaN|undefined|\$0.00|0.00%/);assert.match(html,/Unavailable|No pool|No priced|No eligible/);
  }
  const legacy={...demoReports["telegram-brief"],sections:demoReports["telegram-brief"].sections.slice(0,1)};
  assert.match(render("telegram-brief",legacy),/Unknown/);
  const malicious={sections:[{title:"Market snapshot",rows:[{symbol:'<img src=x onerror="alert(1)">',priceUsd:"bad"}]}]};
  const html=render("terminal",malicious);assert.doesNotMatch(html,/<img/);assert.match(html,/&lt;img/);
});

test("security evidence renders quantitative context, controls and holder values while supporting old snapshots",()=>{
  const html=render("security-signals");
  for(const label of ["Market depth &amp; activity","Ownership concentration","Token control observations","Authority addresses","Holder wallets · fetched page","Holder count","Net buy volume","Transfer fee enabled","Metadata authority share"])assert.ok(html.includes(label),label);
  for(const value of ["24,983","$80.00M","68.00%","18.00%","11.00%","151,845.12"])assert.ok(html.includes(value),value);
  assert.match(html,/32 \/ 38 observations available/);assert.match(html,/provider heuristics/);
  assert.match(html,/title="151845.12345"/);
  const old={...demoReports["security-signals"],sections:demoReports["security-signals"].sections.slice(0,2)};
  const legacy=render("security-signals",old);assert.match(legacy,/No supporting evidence in this snapshot/);assert.match(legacy,/Manual review required/);
  const partial=render("security-signals",{id:"security-signals",sections:[]});
  assert.match(partial,/Evidence incomplete/);assert.doesNotMatch(partial,/No configured rule triggered/);
});

test("source timestamps accept Birdeye Unix seconds, milliseconds and ISO without 1970 drift",()=>{
  const milliseconds=Date.parse("2026-10-16T08:00:00Z"),expected=new Date(milliseconds).toLocaleString();
  for(const value of [milliseconds,milliseconds/1000,String(milliseconds/1000),String(milliseconds),"2026-10-16T08:00:00Z"])assert.equal(observedAt(value),expected);
  for(const value of [null,undefined,"invalid",Infinity])assert.equal(observedAt(value),"Time unavailable");
});

test("wallet UI begins with discovery and keeps token evidence separate from selected-wallet PnL",()=>{
  const address="11111111111111111111111111111111";
  const report={walletStage:"discovery",sections:[{title:"Discovered wallets",rows:[{address,tokens:[address],observations:[{token:address,window:"30d",tokenRealizedPnlUsd:12,sourceId:"discovery-request"}]}]}]};
  const html=renderToStaticMarkup(React.createElement(DemoView,{id:"wallet-intelligence",report,onSelectWallet:()=>{}}));
  assert.match(html,/Discover smart wallets/);assert.match(html,/Select wallet/);assert.match(html,/Token realized PnL/);assert.doesNotMatch(html,/PnL breakdown/);
  const empty=renderToStaticMarkup(React.createElement(DemoView,{id:"wallet-intelligence"}));
  assert.match(empty,/No wallet address is needed/);assert.doesNotMatch(empty,/Wallet performance/);
});
