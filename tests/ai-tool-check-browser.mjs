// Users are told when the configured model cannot call functions. Synthetic keys; providers are fixtures.
import {chromium} from "playwright-core";
import assert from "node:assert/strict";
import {mkdtemp,rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {Ledger} from "../dist/ledger.js";
import {startInterface} from "../dist/interface/server.js";
import {startBrowserInterface} from "../dist/interface/browser-server.js";
delete process.env.BIRDEYE_API_KEY;delete process.env.BIRDEYE_AI_API_KEY;
// Only "tools-model" calls the probe tool; other models answer with text as if tools were dropped.
const payload=body=>{
  const call=body.model==="tools-model" && body.tools?.some(t=>t.name==="confirm_tool_support");
  return {status:"completed",usage:{input_tokens:1,output_tokens:1},output:[call
    ? {type:"function_call",call_id:"probe",name:"confirm_tool_support",arguments:"{\"ok\":true}"}
    : {type:"message",role:"assistant",content:[{type:"output_text",text:"Text only."}]}]};
};
const dir=await mkdtemp(join(tmpdir(),"birdeye-tool-check-"));
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:true});
async function check(mode,app,route){
  const page=await browser.newPage(),errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  if(route)await page.route("https://provider.test/**",r=>r.fulfill({contentType:"application/json",body:JSON.stringify(payload(JSON.parse(r.request().postData())))}));
  await page.goto(app.url);
  if(route)await page.getByRole("button",{name:"Use temporary session"}).click();
  await page.getByRole("heading",{name:"Token Trending",exact:true}).waitFor();
  const save=async model=>{
    await page.getByRole("button",{name:"Settings",exact:true}).first().click();
    await page.locator("#akey").fill("synthetic-ai-key");
    await page.getByLabel("Base URL",{exact:true}).fill(mode==="browser"?"https://provider.test/v1":"http://127.0.0.1:9/v1");
    await page.getByLabel("API format").selectOption("responses");
    await page.getByLabel("Model ID").fill(model);
    await page.getByRole("button",{name:"Save connections",exact:true}).click();
  };
  await save("text-model");
  await page.getByText("Function calling: not supported. The model answered with text instead of calling the test tool.").waitFor();
  await page.getByRole("button",{name:"Research",exact:true}).click();
  await page.getByRole("button",{name:"Ask AI",exact:true}).click();
  await page.getByText("This model does not support function calling.").waitFor();
  await save("tools-model");
  await page.getByText("Function calling: supported.").waitFor();
  await page.getByRole("button",{name:"Research",exact:true}).click();
  assert.equal(await page.getByText("This model does not support function calling.").count(),0);
  assert.deepEqual(errors,[]);
  await page.close();
}
try {
  const preview=await startBrowserInterface("127.0.0.1:0");
  try {await check("browser",preview,true);} finally {await preview.close();}
  const server=await startInterface({ledger:new Ledger(":memory:"),bind:"127.0.0.1:0",dir,aiFetch:async(_,init)=>Response.json(payload(JSON.parse(String(init.body))))});
  try {await check("sqlite",server,false);} finally {await server.close();}
  console.log("AI tool check: unsupported models are flagged in Settings and Ask AI; supported models clear the warning (browser + SQLite).");
} finally {await browser.close();await rm(dir,{recursive:true,force:true});}
