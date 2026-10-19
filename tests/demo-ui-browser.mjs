// No HTTP server, keys or paid API calls. Playwright fulfills every document request locally.
import {chromium} from "playwright-core";
import {build} from "esbuild";
import {readFile,mkdir} from "node:fs/promises";
import assert from "node:assert/strict";
const built=await build({stdin:{contents:`
import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {DemoView} from './web/demo-views';
import {AddressCopyProvider,AddressCopyNotice} from './web/address-text';
import {demoReports,walletDiscoveryReport} from './tests/fixtures/demo-reports.mjs';
const reports={...demoReports,'wallet-discovery':walletDiscoveryReport};
function Fixture(){const [id,setId]=useState('terminal');const [theme,setTheme]=useState('dark');const [empty,setEmpty]=useState(false);return <AddressCopyProvider><div className={'console-app '+theme}><header className="console-header"><strong>Birdeye demo UI fixtures</strong><span>Synthetic data · 0 API calls</span><label>Demo<select value={id} onChange={e=>setId(e.target.value)}>{Object.keys(reports).map(d=><option key={d}>{d}</option>)}</select></label><label>Theme<select value={theme} onChange={e=>setTheme(e.target.value)}><option>dark</option><option>light</option></select></label><label><input type="checkbox" checked={empty} onChange={e=>setEmpty(e.target.checked)}/>Empty evidence</label></header><main className="content"><DemoView key={id} id={id==='wallet-discovery'?'wallet-intelligence':id} report={empty?undefined:reports[id]} onSelectWallet={address=>{window.selectedWallet=address}} onExportMessage={()=>{window.exportedMessage=demoReports[id].message}}/></main><AddressCopyNotice/></div></AddressCopyProvider>}
createRoot(document.getElementById('root')).render(<Fixture/>);`,resolveDir:process.cwd(),loader:"tsx"},bundle:true,write:false,format:"iife",jsx:"automatic",define:{"process.env.NODE_ENV":'"production"'}});
const css=await readFile("web/style.css","utf8");
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Demo UI fixtures</title><style>${css}</style><div id="root"></div><script>${built.outputFiles[0].text.replaceAll("</script", "<\\/script")}</script></html>`;
let browser;
try {
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH||"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.route("**/*",route=>route.fulfill({contentType:"text/html",body:html}));
  await page.goto("http://demo-ui.test/");
  await page.getByRole("heading",{name:"Market watchlist"}).waitFor();
  await page.getByRole("button",{name:/SAMPLE-B/}).click();
  assert.match(await page.getByLabel("Selected token",{exact:true}).innerText(),/SAMPLE-B/);
  await page.getByLabel("Filter tokens").fill("does-not-exist");
  await page.getByText("No tokens match this filter.").waitFor();
  await page.getByLabel("Filter tokens").fill("");
  await page.getByLabel("Sort tokens").selectOption("liquidityUsd");
  await page.getByLabel("Demo",{exact:true}).selectOption("dex-inspector");
  await page.getByRole("button",{name:/Sample pool B/}).click();
  assert.match(await page.locator(".demo-inspector").innerText(),/Sample pool B/);
  await page.getByLabel("Demo",{exact:true}).selectOption("wallet-intelligence");
  await page.getByRole("button",{name:"30 days",exact:true}).click();
  await page.getByRole("heading",{name:"PnL breakdown · 30d"}).waitFor();
  assert.match(await page.locator(".demo-wallet .demo-stats").innerText(),/\$1,400.00/);
  await page.getByLabel("Demo",{exact:true}).selectOption("security-signals");
  await page.getByRole("heading",{name:"Ownership concentration",exact:true}).waitFor();
  assert.match(await page.locator(".security-evidence").innerText(),/24,983/);
  await page.locator(".security-evidence-group > .demo-provenance > summary").first().click();
  assert.match(await page.locator(".security-evidence-group > .demo-provenance").first().innerText(),/fixture-request/);
  await page.getByLabel("Filter checks").selectOption("attention");
  assert.equal(await page.locator(".demo-rule").count(),1);
  await page.getByLabel("Filter checks").selectOption("unknown");
  assert.match(await page.locator(".demo-rule").innerText(),/Freezeable/);
  await page.getByLabel("Demo",{exact:true}).selectOption("telegram-brief");
  await page.getByRole("button",{name:"Inspect plain text"}).click();
  await page.getByRole("button",{name:"Export message",exact:true}).click();
  assert.match(await page.evaluate(()=>window.exportedMessage),/Synthetic UI fixture/);
  await page.getByLabel("Demo",{exact:true}).selectOption("wallet-discovery");
  await page.getByRole("heading",{name:"Discover smart wallets",exact:true}).waitFor();
  await page.getByRole("button",{name:/Select wallet/}).click();
  assert.equal(await page.evaluate(()=>window.selectedWallet),"So11111111111111111111111111111111111111112");
  await page.getByLabel("Filter wallets").fill("no-match");
  await page.getByText("No wallets match this filter.").waitFor();
  await page.getByLabel("Filter wallets").fill("");
  await mkdir(".impeccable/review",{recursive:true});
  for(const id of ["terminal","dex-inspector","wallet-intelligence","wallet-discovery","security-signals","telegram-brief"]){
    await page.getByLabel("Demo",{exact:true}).selectOption(id);
    for(const [name,width,height] of [["desktop",1440,1000],["mobile",390,844]]){
      await page.setViewportSize({width,height});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${id} ${name} overflow`);
      await page.screenshot({path:`.impeccable/review/demo-${id}-${name}.png`,fullPage:true});
    }
    await page.getByLabel("Empty evidence").check();
    assert.doesNotMatch(await page.locator(".demo-product").innerText(),/NaN|undefined/);
    await page.getByLabel("Empty evidence").uncheck();
  }
  await page.getByLabel("Theme",{exact:true}).selectOption("light");
  await page.getByLabel("Demo",{exact:true}).selectOption("security-signals");
  await page.screenshot({path:".impeccable/review/demo-security-light-mobile.png",fullPage:true});
  assert.deepEqual(errors,[]);
  console.log("Five demo views: interactions, empty states and desktop/mobile captures passed. Synthetic evidence; no APIs called.");
}finally{await browser?.close();}
