// Cmd+Enter (macOS) / Ctrl+Enter (Windows, Linux) sends a chat message. Synthetic key; the provider is a fixture.
import {chromium} from "playwright-core";
import assert from "node:assert/strict";
import {startBrowserInterface} from "../dist/interface/browser-server.js";
const app=await startBrowserInterface("127.0.0.1:0");
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:true});
try {
  const page=await browser.newPage(),errors=[],asked=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.route("https://provider.test/**",r=>{
    const body=r.request().postData()??"";if(body.includes("Shortcut question"))asked.push(body);
    return r.fulfill({contentType:"application/json",body:JSON.stringify({status:"completed",usage:{input_tokens:1,output_tokens:1},output:[{type:"message",role:"assistant",content:[{type:"output_text",text:"Shortcut answer."}]}]})});
  });
  await page.goto(app.url);
  await page.getByRole("button",{name:"Use temporary session"}).click();
  await page.getByRole("button",{name:"Ask AI",exact:true}).click();
  const mac=await page.evaluate(()=>/Mac|iPhone|iPad|iPod/.test(navigator.platform||navigator.userAgent));
  const box=page.getByLabel("Message",{exact:true});
  assert.equal(await page.locator("#question-shortcut").innerText(),mac?"⌘ + Enter to send":"Ctrl + Enter to send");
  assert.equal(await box.getAttribute("aria-keyshortcuts"),mac?"Meta+Enter":"Control+Enter");
  // Without an AI provider the Send button is disabled, so the shortcut must not submit.
  await box.fill("Shortcut question");await box.press("ControlOrMeta+Enter");await page.waitForTimeout(300);
  assert.equal(asked.length,0);assert.equal(await box.inputValue(),"Shortcut question");
  await page.getByRole("button",{name:"Settings",exact:true}).first().click();
  await page.locator("#akey").fill("synthetic-ai-key");
  await page.getByLabel("Base URL",{exact:true}).fill("https://provider.test/v1");
  await page.getByLabel("Model ID").fill("fixture");
  await page.getByRole("button",{name:"Save connections",exact:true}).click();
  await page.getByRole("button",{name:"Research",exact:true}).click();
  await page.getByLabel("Allow new Birdeye requests").uncheck();
  await box.fill("Shortcut question");
  await box.press(mac?"Control+Enter":"Meta+Enter");await page.waitForTimeout(300);
  assert.equal(asked.length,0,"The other platform's modifier must not send");
  await box.press("ControlOrMeta+Enter");
  await page.getByText("Shortcut answer.").first().waitFor();
  assert.equal(asked.length,1);
  assert.deepEqual(errors,[]);
  console.log(`Chat shortcut: ${mac?"Cmd":"Ctrl"}+Enter sends, the other modifier and a disabled Send button do not.`);
} finally {await browser.close();await app.close();}
