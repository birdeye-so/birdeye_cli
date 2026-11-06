// Synthetic credentials and intercepted providers only.
import {chromium} from "playwright-core";
import assert from "node:assert/strict";
import {mkdir} from "node:fs/promises";
import {startBrowserInterface} from "../dist/interface/browser-server.js";
const app=await startBrowserInterface("127.0.0.1:0");
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:true});
const password="test-only strong passphrase",bkey="birdeye-test-secret-123",akey="ai-test-secret-456";
try {
 const context=await browser.newContext(),page=await context.newPage(),errors=[],requests=[];
 page.on("pageerror",e=>errors.push(e.message));
 context.on("request",r=>requests.push({url:r.url(),headers:r.headers(),body:r.postData()}));
 await context.route("https://public-api.birdeye.so/**",route=>{
   assert.equal(route.request().headers()["x-api-key"],bkey);
   return route.fulfill({contentType:"application/json",body:JSON.stringify({success:true,data:{items:[{address:"So11111111111111111111111111111111111111112",symbol:"VAULT-FIXTURE",price:1.25,liquidity:100000,volume24hUSD:5000,price24hChangePercent:5}]}})});
 });
 await context.route("https://provider.test/**",route=>{
   assert.equal(route.request().headers().authorization,"Bearer "+akey);
   return route.fulfill({contentType:"application/json",body:JSON.stringify({status:"completed",output:[{type:"message",role:"assistant",content:[{type:"output_text",text:"Browser-only AI answer."}]}],usage:{input_tokens:10,output_tokens:5}})});
 });
 await page.goto(app.url);
 await mkdir(".impeccable/review",{recursive:true});
 await page.getByRole("button",{name:"Create workspace",exact:true}).waitFor();
 await page.setViewportSize({width:390,height:950});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:".impeccable/review/browser-vault-mobile.png"});
 await page.setViewportSize({width:1440,height:1000});

 await page.getByLabel("Workspace password",{exact:true}).fill(password);
 await page.getByLabel("Confirm password").fill(password);
 await page.getByRole("button",{name:"Create workspace",exact:true}).click();
 await page.getByRole("heading",{name:"Token Trending",exact:true}).waitFor();
 await page.getByRole("button",{name:"Settings",exact:true}).click();
 await page.locator("#bkey").fill(bkey);await page.locator("#akey").fill(akey);
 await page.getByLabel("Base URL",{exact:true}).fill("https://provider.test/v1");
 await page.getByLabel("Model ID").fill("fixture");
 await page.getByRole("button",{name:"Save connections",exact:true}).click();
 await page.getByText("Connections saved and active now.",{exact:false}).waitFor();
 assert.equal(await page.locator("#bkey").inputValue(),"");
 const envelope=()=>page.evaluate(async()=> {
   const db=await new Promise((resolve,reject)=>{const r=indexedDB.open("birdeye-browser-vault",1);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
   const value=await new Promise(resolve=>{const r=db.transaction("vault").objectStore("vault").get("workspace");r.onsuccess=()=>resolve(r.result);});
   db.close();return value?{version:value.version,salt:Array.from(value.salt),iv:Array.from(value.iv),ciphertext:Array.from(new Uint8Array(value.ciphertext))}:null;
 });
 const first=await envelope();assert.equal(first.version,1);assert.equal(first.iv.length,12);
 assert.doesNotMatch(JSON.stringify(first),new RegExp(bkey+"|"+akey));
 const other=await context.newPage();await other.goto(app.url);
 await other.getByLabel("Workspace password",{exact:true}).fill(password);
 await other.getByRole("button",{name:"Unlock workspace",exact:true}).click();
 await other.getByRole("alert").filter({hasText:"another tab"}).waitFor();await other.close();
 await page.getByRole("button",{name:"Research",exact:true}).click();
 await page.getByRole("button",{name:"Run research",exact:true}).click();
 await page.locator(".sv-watchlist").getByText("VAULT-FIXTURE",{exact:true}).waitFor();
 await page.getByText(/^Saved ·/).waitFor();
 await page.getByRole("button",{name:"Ask AI",exact:true}).click();
 const question=page.locator("textarea").first();
 await question.fill("Explain my saved data.");
 await page.getByRole("button",{name:"Send message",exact:true}).click();
 await page.getByText("Browser-only AI answer.",{exact:false}).first().waitFor();
 await page.getByText(/^Saved ·/).waitFor();
 const second=await envelope();assert.notDeepEqual(first.iv,second.iv);
 const decoded=await page.evaluate(async password=>{
   const db=await new Promise(resolve=>{const r=indexedDB.open("birdeye-browser-vault",1);r.onsuccess=()=>resolve(r.result);});
   const record=await new Promise(resolve=>{const r=db.transaction("vault").objectStore("vault").get("workspace");r.onsuccess=()=>resolve(r.result);});db.close();
   const material=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveKey"]);
   const key=await crypto.subtle.deriveKey({name:"PBKDF2",hash:"SHA-256",salt:record.salt,iterations:600000},material,{name:"AES-GCM",length:256},false,["decrypt"]);
   return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name:"AES-GCM",iv:record.iv},key,record.ciphertext)));
 },password);
 assert.equal(decoded.config.birdeyeApiKey,bkey);
 assert.equal(decoded.config.ai.profiles.research.apiKey,akey);
 assert.equal(decoded.runs.length,2);
 assert.doesNotMatch(await page.evaluate(()=>JSON.stringify({local:{...localStorage},session:{...sessionStorage}})),new RegExp(bkey+"|"+akey+"|"+password));

 await mkdir(".impeccable/review",{recursive:true});
 for(const width of [1440,390]){
   await page.setViewportSize({width,height:950});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.screenshot({path:`.impeccable/review/browser-storage-${width}.png`,fullPage:false});
 }
 await page.getByRole("button",{name:"Lock workspace",exact:true}).click();
 await page.getByRole("button",{name:"Unlock workspace",exact:true}).waitFor();
 const tamper=()=>page.evaluate(async()=>{
   const db=await new Promise(resolve=>{const r=indexedDB.open("birdeye-browser-vault",1);r.onsuccess=()=>resolve(r.result);});
   await new Promise((resolve,reject)=>{const tx=db.transaction("vault","readwrite"),store=tx.objectStore("vault"),r=store.get("workspace");r.onsuccess=()=>{const bytes=new Uint8Array(r.result.ciphertext);bytes[0]^=1;store.put({...r.result,ciphertext:bytes.buffer},"workspace");};tx.oncomplete=resolve;tx.onerror=reject;});db.close();
 });
 await tamper();
 await page.getByLabel("Workspace password",{exact:true}).fill(password);
 await page.getByRole("button",{name:"Unlock workspace",exact:true}).click();
 await page.getByRole("alert").filter({hasText:"Wrong password or damaged"}).waitFor();
 await tamper(); // Restore the original authenticated ciphertext.
 await page.getByLabel("Workspace password",{exact:true}).fill("incorrect password");
 await page.getByRole("button",{name:"Unlock workspace",exact:true}).click();
 await page.getByRole("alert").filter({hasText:"Wrong password"}).waitFor();
 await page.getByLabel("Workspace password",{exact:true}).fill(password);
 await page.getByRole("button",{name:"Unlock workspace",exact:true}).click();
 await page.getByRole("heading",{name:"Token Trending",exact:true}).waitFor();
 assert.match(await page.locator(".connection-bar").innerText(),/key configured/);
 if(!await page.locator(".history-rail").evaluate(el=>el.open))await page.locator(".history-rail > summary").click();
 assert.ok(await page.locator(".history-item").count()>=2);
 const beforeQuota=requests.filter(r=>r.url.startsWith("https://public-api.birdeye.so")).length;
 await page.evaluate(()=>{window.originalPut=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(){throw new DOMException("Quota exceeded","QuotaExceededError");};});
 await page.getByRole("button",{name:"Run research",exact:true}).click();
 await page.getByRole("alert").first().waitFor();
 assert.equal(requests.filter(r=>r.url.startsWith("https://public-api.birdeye.so")).length,beforeQuota,"Failed storage must prevent a paid request");
 await page.evaluate(()=>{IDBObjectStore.prototype.put=window.originalPut;});

 await page.reload();
 await page.getByRole("button",{name:"Unlock workspace",exact:true}).waitFor();
 await page.getByRole("button",{name:"Use temporary session",exact:true}).click();
 await page.getByRole("heading",{name:"Token Trending",exact:true}).waitFor();
 assert.match(await page.locator(".connection-bar").innerText(),/key required/);
 assert.equal(await page.locator(".history-item").count(),0);
 await page.getByRole("button",{name:"Lock workspace",exact:true}).click();
 await page.getByRole("button",{name:"Forget saved workspace",exact:true}).click();
 await page.getByRole("button",{name:"Delete browser data",exact:true}).click();
 await page.getByRole("button",{name:"Create workspace",exact:true}).waitFor();
 assert.equal(await envelope(),null);
 assert.equal(requests.filter(r=>new URL(r.url).origin===new URL(app.url).origin&&new URL(r.url).pathname.startsWith("/api")).length,0);
 for(const r of requests.filter(r=>new URL(r.url).origin===new URL(app.url).origin))assert.doesNotMatch(JSON.stringify(r),new RegExp(bkey+"|"+akey+"|"+password));
 assert.deepEqual(errors,[]);
 console.log("Browser vault: encrypted persistence, exclusive tab, direct Birdeye + AI, locking, wrong password, reload, temporary mode, deletion, responsive UI; no backend requests.");
} finally {await browser.close();await app.close();}
