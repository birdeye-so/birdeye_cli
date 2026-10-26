// Synthetic evidence only. No network APIs or API keys.
import {chromium} from 'playwright-core';
import {build} from 'esbuild';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {reports} from './fixtures/skill-visual-reports.mjs';
const bundle=await build({stdin:{contents:`
import React,{useState} from 'react';import {createRoot} from 'react-dom/client';
import {SkillDashboard} from './web/skill-visuals';import {AddressCopyProvider,AddressCopyNotice} from './web/address-text';
const reports=${JSON.stringify(reports)};
function App(){const [kind,setKind]=useState('skill-kline-pattern'),[theme,setTheme]=useState('dark'),[empty,setEmpty]=useState(false);return <AddressCopyProvider><div className={'console-app '+theme}><header className="console-header"><strong>Birdeye · Research skills</strong><span>Synthetic preview · 0 API calls</span><label>Skill<select aria-label="Skill" value={kind} onChange={e=>setKind(e.target.value)}>{Object.keys(reports).map(k=><option key={k} value={k}>{k.replace("skill-", "").replaceAll("-", " ")}</option>)}</select></label><label>Theme<select aria-label="Theme" value={theme} onChange={e=>setTheme(e.target.value)}><option>dark</option><option>light</option></select></label><label><input type="checkbox" checked={empty} onChange={e=>setEmpty(e.target.checked)}/>Empty evidence</label></header><main style={{maxWidth:1000,margin:'auto',padding:24}}><SkillDashboard key={kind+empty} {...reports[kind]} {...(empty?{analysis:{findings:[]},sources:[]}: {})}/></main><AddressCopyNotice/></div></AddressCopyProvider>};createRoot(document.getElementById('root')).render(<App/>);`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'}});
const css=await readFile('web/style.css','utf8');
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Birdeye skill previews</title><style>${css}</style><div id="root"></div><script>${bundle.outputFiles[0].text.replaceAll('</script','<\\/script')}</script></html>`;
await mkdir('.impeccable/review',{recursive:true});await writeFile('.impeccable/review/skills-preview.html',html);
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>route.fulfill({contentType:'text/html',body:html}));await page.goto('http://skills.test');
 const choose=kind=>page.getByLabel('Skill',{exact:true}).selectOption(kind);
 await page.getByRole('slider',{name:'Inspect Closing price observation'}).focus();await page.keyboard.press('Home');
 assert.match(await page.getByRole('slider').getAttribute('aria-valuetext'),/\$100/);
 await page.keyboard.press('ArrowRight');assert.equal(await page.getByRole('slider').inputValue(),'1');
 await choose('skill-trending-list');await page.getByLabel('Sort tokens').selectOption('liquidity');
 assert.match(await page.locator('.sv-watchlist > button').first().innerText(),/SAMPLE-B/);
 await page.locator('.sv-watchlist > button').filter({hasText:'SAMPLE-A'}).click();assert.match(await page.getByRole('region',{name:'Selected token'}).innerText(),/SAMPLE-A/);
 await page.getByLabel('Filter tokens').fill('no-result');await page.getByText('No tokens match this filter.').waitFor();
 await choose('skill-wallet-analysis');await page.getByRole('button',{name:'Inspect 7d PnL'}).click();assert.match(await page.getByRole('button',{name:'Inspect 7d PnL'}).getAttribute('aria-describedby'), /-0$/);assert.match(await page.locator('.sv-facts').first().innerText(),/−\$250.00/);
 await page.getByRole('button',{name:'Unrealized',exact:true}).click();assert.match(await page.getByRole('button',{name:'Inspect 7d PnL'}).innerText(),/\$0.00/);
 await choose('skill-smart-wallets');await page.getByRole('button',{name:/Wallet 2/}).click();assert.match(await page.getByRole('region',{name:'Selected discovered wallet'}).innerText(),/11113/);
 await choose('skill-smart-money-leaderboard');await page.getByLabel('Sort wallets').selectOption('pnl30');
 for(const kind of Object.keys(reports)){
  await choose(kind);
  for(const [size,width,height] of [['desktop',1440,1100],['mobile',390,844]]){
   await page.setViewportSize({width,height});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${kind} ${size} overflow`);
   assert.doesNotMatch(await page.locator('.skill-visuals').innerText(),/NaN|undefined|\[object Object\]/);
   await page.screenshot({path:`.impeccable/review/${kind}-${size}.png`,fullPage:true});
  }
  await page.getByLabel('Empty evidence').check();assert.doesNotMatch(await page.locator('.skill-visuals').innerText(),/NaN|undefined|\$0.00/);await page.getByLabel('Empty evidence').uncheck();
 }
 await page.getByLabel('Theme',{exact:true}).selectOption('light');
 for(const kind of ['skill-kline-pattern','skill-wallet-analysis','skill-wallet-style','skill-token-dd']){await choose(kind);await page.screenshot({path:`.impeccable/review/${kind}-light-mobile.png`,fullPage:true});}
 assert.deepEqual(errors,[]);console.log('11 skills passed: desktop/mobile, empty states, charts/keyboard inspection, search/sort, wallet selection, period switching and light theme. Synthetic data; no APIs.');
}finally{await browser.close();}
