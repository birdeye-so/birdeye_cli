import {skillAnalysis} from '../../dist/skill-metrics.js';
import {planCase} from '../../dist/workflows.js';
import {skillInfo} from '../../dist/skill-recipes.js';
export const token='So11111111111111111111111111111111111111112';
export const wallet='11111111111111111111111111111112', wallet2='11111111111111111111111111111113';
const at=1791504000;
const source=(operation,data,params={})=>({data,meta:{operation,chain:'solana',params,requestId:operation+JSON.stringify(params),retrievedAt:new Date(at*1000).toISOString()}});
const summary=(duration,w=wallet)=>source('portfolio.pnl-summary',{summary:{unique_tokens:10,pnl:{realized_profit_usd:duration==='7d'?-250:duration==='90d'?9000:3000,unrealized_usd:duration==='7d'?0:-120},cashflow_usd:{total_invested:10000,total_sold:13000},counts:{total_trade:100,total_win:7,total_loss:3}}},{wallet:w,duration,pnl_method:'wac',position_scope:'duration_only'});
const positions=Array.from({length:10},(_,i)=>({address:token,symbol:`POSITION-${i+1}`,pnl:{realized_profit_usd:300,unrealized_usd:0,total_percent:.3,realized_profit_percent:.3},counts:{total_buy:5,total_sell:5},cashflow_usd:{total_invested:1000}}));
const shared=[
 source('token.overview',{address:token,symbol:'SAMPLE',price:.00234,liquidity:12500000,v24hUSD:31000000,holder:21000},{address:token}),
 source('token.security',{freezeable:false,mintable:true,mutableMetadata:null,top10HolderPercent:.64},{address:token}),
 source('market.ohlcv',{items:Array.from({length:48},(_,i)=>({unix_time:at-(48-i)*3600,o:100+i,c:100+i+Math.sin(i)*2,h:104+i,l:96+i,v:100+i}))},{address:token,type:'1H',time_from:at-48*3600,time_to:at}),
 source('token.liquidity-history',{items:Array.from({length:12},(_,i)=>({unix_time:at-(12-i)*14400,liquidity_usd:1000000-i*25000+Math.sin(i)*20000}))},{address:token}),
 source('token.holder-profile',{tags:[{tag:'dev',percent_of_supply:1},{tag:'smart_money',percent_of_supply:23}]},{token_address:token}),
 source('token.money-flow',[{tag:'smart_money',frame:'24h',total_value_buy:250000,total_value_sell:100000},{tag:'whales',frame:'24h',total_value_buy:100000,total_value_sell:180000}],{token_address:token}),
 source('market.token-list',{items:[{address:token,symbol:'SAMPLE-A',price:1.25,liquidity:2500000,volume_24h_usd:7200000,price_change_24h_percent:12.4,market_cap:25000000},{address:wallet,symbol:'SAMPLE-B',price:.00000042,liquidity:5100000,volume_24h_usd:14000000,price_change_24h_percent:-3.2,market_cap:1200000},{address:wallet2,symbol:'SAMPLE-C',price:0,liquidity:0,volume_24h_usd:null,price_change_24h_percent:null}]},{}),
 source('market.smart-money',[{token}],{}),
 source('token.top-traders',{items:[{owner:wallet},{owner:wallet2}]},{address:token}),
 ...['7d','30d','90d','24h'].map(d=>summary(d)),summary('7d',wallet2),summary('30d',wallet2),
 source('portfolio.pnl-details',{tokens:positions},{wallet,duration:'30d',pnl_method:'wac',position_scope:'duration_only'}),
 source('portfolio.holdings',{items:[{address:token,symbol:'SOL',valueUsd:12000},{address:wallet2,symbol:'SAMPLE',value:4200},{address:wallet,symbol:'UNPRICED',value:null}]},{wallet}),
 source('portfolio.net-worth-history',{history:Array.from({length:16},(_,i)=>({timestamp:new Date((at-(16-i)*86400)*1000).toISOString(),net_worth:10000+i*400+Math.sin(i)*1200}))},{wallet}),
];
const kinds=['skill-trending-list','skill-smart-wallets','skill-token-dd','skill-contract-dd','skill-rugcheck-audit','skill-kline-pattern','skill-wallet-score','skill-wallet-style','skill-wallet-analysis','skill-smart-money-profile','skill-smart-money-leaderboard'];
export const reports=Object.fromEntries(kinds.map(kind=>{
 const input=planCase({kind,...(skillInfo[kind].subject==='token'?{address:token}:skillInfo[kind].subject==='wallet'?{address:wallet}:skillInfo[kind].subject==='wallets'?{wallets:[wallet,wallet2]}:{}),duration:'30d',resolution:'1H',from:at-48*3600,to:at,include:['advanced_security','risk_history'],intervals:['7d','30d','90d'],skillDepth:'deep'}).input;
 const operations=planCase(input).steps.map(s=>s.operation);
 const sources=shared.filter(s=>operations.includes(s.meta.operation)&&(!kind.includes('leaderboard')||s.meta.params.wallet));
 // A single-wallet view must not mix another wallet's PnL or holdings.
 const scoped=sources.filter(s=>kind.includes('leaderboard')||kind==='skill-smart-wallets'||!s.meta.params.wallet||s.meta.params.wallet===wallet);
 return [kind,{kind,analysis:skillAnalysis(input,scoped),sources:scoped}];
}));
