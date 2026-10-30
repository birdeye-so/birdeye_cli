import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {reports} from './fixtures/skill-visual-reports.mjs';
import {dataReports} from './fixtures/token-data-reports.mjs';
await build({entryPoints:['web/skill-visuals.tsx','web/skill-visual-data.ts'],outdir:'.test-dist/skill-visuals',bundle:true,packages:'external',platform:'node',format:'esm',jsx:'automatic',outExtension:{'.js':'.mjs'}});
const {SkillDashboard}=await import('../.test-dist/skill-visuals/skill-visuals.mjs');
const {numeric,timeSeries,pnlWindows,trendingRows}=await import('../.test-dist/skill-visuals/skill-visual-data.mjs');
const render=props=>renderToStaticMarkup(React.createElement(SkillDashboard,props));
test('eight data reports render evidence tables, units and missing values from executed fixtures',()=>{
 for(const [kind,report] of Object.entries(dataReports)){
  const html=render(report);
  assert.match(html,/<table>/,kind);
  assert.match(html,/Source coverage and pagination/,kind);
  assert.doesNotMatch(html,/NaN|undefined|\[object Object\]/,kind);
 }
 assert.match(render(dataReports['skill-token-security']),/N\/A/);
 const pools=render(dataReports['skill-lp-analysis']);
 assert.match(pools,/Fetched-page share/);
 assert.doesNotMatch(pools,/href="https:\/\/birdeye.so\/solana\/token\//,'Pool addresses must not link to a token page');
 assert.match(render(dataReports['skill-kol-signal']),/Incomplete evidence/);
});
test('all eleven other skills show their data-specific visual report',()=>{
 const expected={ 'skill-trending-list':'Market watchlist','skill-smart-wallets':'Discovery path','skill-token-dd':'Contract controls','skill-contract-dd':'Closing price','skill-rugcheck-audit':'Liquidity history','skill-kline-pattern':'Closing price','skill-wallet-score':'Score breakdown','skill-wallet-style':'Trading profile','skill-wallet-analysis':'PnL by period','skill-smart-money-profile':'Net-worth history','skill-smart-money-leaderboard':'Wallet leaderboard'};
 for(const [kind,report] of Object.entries(reports)){
  const html=render(report);assert.ok(html.includes(expected[kind]),kind);assert.doesNotMatch(html,/NaN|undefined|\[object Object\]/,kind);
 }
});
test('missing evidence is never invented as zero, a passed security check or a series',()=>{
 for(const kind of Object.keys(reports)){
  const html=render({kind,analysis:{findings:[]},sources:[]});assert.doesNotMatch(html,/NaN|undefined|\$0.00|<polyline/);
 }
 const html=render({kind:'skill-contract-dd',analysis:{findings:[{kind:'security-evidence',missing:[]}]},sources:[]});
 assert.match(html,/Unknown/);assert.doesNotMatch(html,/>Safe<|>Disabled</);
 for(const v of [null,undefined,'',true,Infinity,'NaN'])assert.equal(numeric(v),null);
 assert.equal(numeric('0'),0);
});
test('series preserve times, deduplicate, and reject open or invalid candles',()=>{
 const source=reports['skill-kline-pattern'].sources.find(s=>s.meta.operation==='market.ohlcv');
 const points=timeSeries(source,'price');assert.equal(points.length,48);
 const malformed={...source,data:{items:[...source.data.items,source.data.items[0],{...source.data.items[0],unix_time:source.meta.params.time_to},{...source.data.items[0],unix_time:source.meta.params.time_from+1,c:null}]}};
 assert.deepEqual(timeSeries(malformed,'price'),points);
 assert.deepEqual(timeSeries({data:{items:[{unix_time:1,liquidity_usd:null},{unix_time:2,liquidity_usd:0},{unix_time:10,liquidity_usd:20}]},meta:{}},'liquidity'),[{time:2,value:0},{time:10,value:20}]);
});
test('PnL uses count-derived rates, keeps zero and excludes failed sources',()=>{
 const source={meta:{operation:'portfolio.pnl-summary',params:{duration:'7d'}},data:{summary:{pnl:{realized_profit_usd:'0'},counts:{total_win:0,total_loss:4}}}};
 const values=pnlWindows([source,{...source,meta:{...source.meta,isError:true}}]);assert.equal(values.length,1);assert.equal(values[0].realized,0);assert.equal(values[0].winRate,0);assert.equal(values[0].unrealized,null);
 assert.match(render(reports['skill-wallet-analysis']),/−\$250.00/);
});
test('native trending preserves its documented 24h fields and tiny prices',()=>{
 const rows=trendingRows([{meta:{operation:'market.trending'},data:{tokens:[{price:.00000042,volume24hUSD:12,price24hChangePercent:0}]}}]);
 assert.equal(rows[0].volume,12);assert.equal(rows[0].change,0);
 assert.match(render(reports['skill-trending-list']),/\$0.00000042/);
});

test('net-worth charts accept provider ISO timestamps and retain holdings without a PnL summary',()=>{
 const sources=reports['skill-smart-money-profile'].sources;
 const worth=sources.find(s=>s.meta.operation==='portfolio.net-worth-history');
 assert.equal(timeSeries(worth,'worth').length,16);
 const html=render({kind:'skill-smart-money-profile',analysis:{findings:[]},sources:sources.filter(s=>s.meta.operation!=='portfolio.pnl-summary')});
 assert.match(html,/Holdings composition/);assert.match(html,/Net-worth history/);assert.match(html,/No wallet-wide PnL was fetched/);
});
