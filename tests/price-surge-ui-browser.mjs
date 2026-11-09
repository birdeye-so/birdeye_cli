// Price Surge results must render ranked and excluded tokens in the demo. Synthetic key; Birdeye is a fixture.
import {chromium} from "playwright-core";
import assert from "node:assert/strict";
import {startBrowserInterface} from "../dist/interface/browser-server.js";
const token=(n,liquidity)=>({address:`So1111111111111111111111111111111111111111${n}`,symbol:`SURGE${n}`,price:n,price_change_1h_percent:60+n,
  liquidity,market_cap:1_000_000,fdv:1_000_000,volume_1h_usd:20_000,trade_1h_count:300,holder:1200});
const app=await startBrowserInterface("127.0.0.1:0");
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:true});
try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  // SURGE3 has liquidity/market cap below the default 0.5% floor, so the screen excludes it as thin liquidity.
  await page.route("https://public-api.birdeye.so/**",r=>r.fulfill({contentType:"application/json",body:JSON.stringify({success:true,data:{items:[token(1,80_000),token(2,50_000),token(3,1_000)],hasNext:false}})}));
  await page.goto(app.url+"/skill-price-surge");
  await page.getByRole("button",{name:"Use temporary session"}).click();
  await page.getByRole("button",{name:"Settings",exact:true}).first().click();
  await page.locator("#bkey").fill("synthetic-birdeye-key");
  await page.getByRole("button",{name:"Save connections",exact:true}).click();
  await page.getByRole("button",{name:"Research",exact:true}).click();
  await page.locator("button:enabled",{hasText:"Run research"}).click();
  const finding=page.getByRole("region",{name:"Surging tokens"});
  await finding.waitFor();
  assert.match(await finding.innerText(),/2 ranked · 1 excluded/);
  assert.deepEqual(await finding.locator(".sv-token-name strong").allInnerTexts(),["SURGE1","SURGE2"]);
  assert.match(await finding.locator(".sv-watchlist-select").first().innerText(),/61(\.0+)?%/);
  await finding.locator(".sv-watchlist-select").filter({hasText:"SURGE2"}).click();
  assert.match(await page.getByRole("region",{name:"Selected surge token"}).innerText(),/SURGE2[\s\S]*Market cap/);
  await finding.getByText("Excluded tokens · 1").click();
  assert.match(await finding.locator("details").innerText(),/SURGE3[\s\S]*Thin liquidity/);
  assert.deepEqual(errors,[]);
  console.log("Price Surge UI: ranked candidates, selection and exclusion reasons render after a run.");
} finally {await browser.close();await app.close();}
