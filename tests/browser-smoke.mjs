import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
import { Ledger } from "../dist/ledger.js";
import { Runner } from "../dist/runner.js";
import { startInterface } from "../dist/interface/server.js";

const address = "So11111111111111111111111111111111111111112";
const markdownAnswer = `Saved-data analysis fixture.\n\n## Saved findings\n\n**Historical evidence**, with *limited coverage*.\n\n- Token: \`${address}\`\n- Read the [Birdeye docs](https://docs.birdeye.so/).\n\n| Token | Observation |\n| --- | --- |\n| SOL | Saved snapshot only |\n\n> No live requests were made.\n\n\`\`\`json\n{"address":"${address}","note":"A long code line stays inside the answer"}\n\`\`\``;
const ledger = new Ledger(":memory:");
const sentRequests = [];
const app = await startInterface({
  ledger,
  bind: "127.0.0.1:0",
  config: {
    birdeyeApiKey: "synthetic-test-key",
    ai: { defaultProfile: "research", profiles: {research:{provider:"openai-compatible",apiFormat:"responses",baseUrl:"https://provider.test/v1",model:"fixture",apiKey:"fixture",apiKeyEnv:"BIRDEYE_TEST_UNUSED_KEY"}} },
  },
  aiFetch: async () => Response.json({status:"completed",output:[{type:"message",role:"assistant",content:[{type:"output_text",text:markdownAnswer}]}],usage:{input_tokens:10,output_tokens:5}}),
  runnerFactory: () =>
    new Runner(ledger, "synthetic-test-key", {
      fetch: async (url) => {
        sentRequests.push(new URL(url));
        const path = new URL(url).pathname;
        if (path === "/smart-money/v1/token/list") return Response.json([{token: address, symbol: "FIXTURE", smart_traders_no: 3}]);
        const data = path.endsWith("token_overview")
          ? {
              address,
              symbol: "FIXTURE",
              encodedAddress: Buffer.alloc(32, 255).toString("base64"),
              price: 1.25,
              liquidity: 10000,
              v24hUSD: 20000,
            }
          : path.endsWith("token_security")
            ? { freezeable: false, top10HolderPercent: 0.1 }
            : path.endsWith("pnl/summary")
              ? { summary: { counts: { total_win: 2, total_loss: 1 }, pnl: { realized_profit_usd: 12 } } }
              : { items: [{ address, owner: address, value: 100 }] };
        return Response.json({ success: true, data });
      },
    }),
});
let browser;
try {
  browser = await chromium.launch({
    executablePath:
      process.env.CHROME_PATH ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    window.copiedAddresses = [];
    Object.defineProperty(navigator, "clipboard", {configurable: true, value: {writeText: async value => {window.copiedAddresses.push(value);}}});
  });
  await page.goto(app.url);
  await page.getByRole("heading", { name: "Token Trending", exact: true }).waitFor();
  assert.equal(await page.getByRole("navigation", {name:"Workspace"}).getByRole("button", {name:"Imports",exact:true}).count(),0);
  assert.equal(await page.getByLabel("Connection code").count(), 0, "Loopback must auto-connect");
  const choose = async (group, title) => {
    await page.getByRole("button", {name: group, exact: true}).click();
    if (!await page.locator(".skill-rail").evaluate(el => el.open)) await page.locator(".skill-rail > summary").click();
    await page.getByRole("navigation", {name: "Skills"}).getByRole("button", {name: title, exact: true}).click();
  };
  await page.getByRole("region", {name: "Skill parameters", exact: true}).waitFor();
  await choose("Earlier workflows", "Token Research");
  assert.equal(await page.getByText("Enter the workflow address above to run.", {exact: false}).count(), 0);
  assert.equal(await page.getByRole("button", {name: "Run research", exact: true}).isDisabled(), true);
  await mkdir(".impeccable/review", { recursive: true });

  await page.getByLabel("Token address", { exact: true }).fill(address);
  await page.locator(".workflow-details > summary").click();
  const holders = page.locator(".workflow-step").filter({has: page.getByRole("heading", {name: /Top holders/})});
  await holders.locator("summary").click();
  await holders.getByLabel("Rows per request", {exact: true}).fill("101");
  await page.getByRole("alert").filter({hasText: "Step holders"}).waitFor();
  assert.equal(await page.getByRole("button", {name: "Run research", exact: true}).isDisabled(), true);
  assert.equal(ledger.summary().attempts, 0);
  await holders.getByLabel("Rows per request", {exact: true}).fill("3");
  await holders.getByLabel("Holder grouping", {exact: true}).selectOption("token_account");
  await page.getByText("70 CU before retries · at most 3 requests", {exact: true}).waitFor();
  await page.locator(".cli-preview > summary").click();
  await page.getByRole("button", {name: "Copy CLI command", exact: true}).click();
  await page.locator(".cli-preview [role=status]").filter({hasText: "Copied"}).waitFor();
  const cliCommand = await page.evaluate(() => window.copiedAddresses.at(-1));
  assert.match(cliCommand, /birdeye-cli case token-research/);
  assert.match(cliCommand, /--step-overrides/);
  assert.ok(cliCommand.includes('"limit":3'));
  assert.ok(cliCommand.includes('"mode":"token_account"'));
  assert.equal(ledger.summary().attempts, 0, "Previewing and copying CLI must be free");
  await holders.getByRole("button", {name: "Reset this step", exact: true}).click();
  assert.equal(await holders.getByLabel("Rows per request", {exact: true}).inputValue(), "10");
  await holders.getByLabel("Rows per request", {exact: true}).fill("3");
  await holders.getByLabel("Holder grouping", {exact: true}).selectOption("token_account");
  await page.getByRole("button", { name: "Run research", exact: true }).click();
  await page.getByText("70", { exact: true }).waitFor();
  const copyToken = page.locator(`[data-address="${address}"]`).first();
  await copyToken.click();
  await page.locator(".copy-notice").filter({hasText: "Copied"}).waitFor();
  assert.equal(await page.evaluate(() => window.copiedAddresses.at(-1)), address);
  await page.getByRole("button", {name: "JSON", exact: true}).click();
  const encoded = Buffer.alloc(32, 255).toString("base64");
  const copyEncoded = page.getByLabel("json result").locator(`[data-address="${encoded}"]`).first();
  await copyEncoded.focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => window.copiedAddresses.at(-1)), encoded);
  await page.evaluate(() => {navigator.clipboard.writeText = async () => {throw new Error("denied");};});
  await copyEncoded.click();
  await page.locator(".copy-notice").filter({hasText: "Could not copy"}).waitFor();
  assert.equal(await page.locator(".copy-fallback").textContent(), encoded, "Failure recovery exposes the full address");
  await page.getByRole("button", {name: "Dismiss copy message"}).click();
  await page.getByRole("button", {name: "UI", exact: true}).click();
  assert.equal(ledger.summary().estimated, 70);
  assert.equal(sentRequests.find(url => url.pathname.endsWith("holder")).searchParams.get("limit"), "3");
  assert.equal(sentRequests.find(url => url.pathname.endsWith("holder")).searchParams.get("mode"), "token_account");
  await page.reload();
  await page
    .getByRole("button", { name: /Token Research\s*completed/ })
    .click();
  assert.equal(ledger.summary().estimated, 70);
  await page.setViewportSize({ width: 390, height: 844 });

  await choose("Earlier workflows", "Wallet Analysis");
  await page.getByLabel("Wallet address", { exact: true }).fill(address);
  await page.getByText("50 CU before retries · at most 3 requests", { exact: true }).waitFor();
  await page.locator(".workflow-details > summary").click();
  const pnl = page.locator(".workflow-step").filter({has: page.getByRole("heading", {name: /PnL summary/})});
  await pnl.locator("summary").click();
  await pnl.getByLabel("PnL accounting method", {exact: true}).selectOption("net_cash");
  await page.getByText("50 CU before retries · at most 3 requests", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Estimate CU", exact: true }).click();
  await page.getByText("50 CU before retries · at most 3 requests", { exact: true }).waitFor();
  assert.equal(ledger.summary().estimated, 70, "Estimate must be free");
  await page.getByRole("button", { name: "Run research", exact: true }).click();
  await page.getByRole("heading", { name: "Wallet Analysis", level: 2, exact: true }).waitFor();
  await page.getByText("50", { exact: true }).waitFor();
  assert.equal(ledger.summary().estimated, 120);
  assert.equal(sentRequests.find(url => url.pathname.endsWith("pnl/summary")).searchParams.get("pnl_method"), "net_cash");
  await page.getByRole("button", {name: "Wallet & Smart Money", exact: true}).click();
  await choose("Wallet & Smart Money", "Smart Money Leaderboard");
  await page.getByLabel("Wallet addresses", {exact: false}).fill(`${address},11111111111111111111111111111112`);
  await page.getByText("140 CU before retries · at most 6 requests", {exact: true}).waitFor();
  assert.equal(ledger.summary().estimated, 120, "Multi-wallet planning remains free");
  await page.getByRole("button", {name: "Token Due Diligence", exact: true}).click();
  await choose("Token Due Diligence", "RugCheck Audit");
  await page.getByText("245 CU before retries · at most 5 requests", {exact: true}).waitFor();
  await page.locator(".workflow-details > summary").click();
  const liquidity = page.locator(".workflow-step").filter({has: page.getByRole("heading", {name: /Historical liquidity/})});
  await liquidity.locator("summary").click();
  await liquidity.getByLabel("Liquidity resolution", {exact: true}).selectOption("1D");
  await page.getByText("6110 CU before retries · at most 5 requests", {exact: true}).waitFor();
  assert.equal(ledger.summary().estimated, 120, "Editing dynamic CU parameters remains free");
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
    false,
    "Mobile should not overflow",
  );
  await choose("Market Discovery", "Smart Wallets");
  await page.getByText("110 CU before retries · at most 4 requests", {exact: true}).waitFor();
  await page.getByRole("button", {name: "Run research", exact: true}).click();
  await page.getByRole("heading", {name: "Wallet shortlist", exact: true}).waitFor();
  assert.equal(ledger.summary().estimated, 170);
  assert.equal(ledger.summary().uncertainAttempts, 0);
  await page.getByRole("button", {name: "JSON", exact: true}).click();
  assert.ok((await page.getByLabel("json result").textContent()).includes('"wallet-discovery"'));
  await page.getByRole("button", {name: "UI", exact: true}).click();
  await page.getByRole("button", {name: "Discuss saved data with AI", exact: true}).click();
  await page.getByLabel("Message", {exact: true}).fill("Summarize the saved wallets");
  assert.equal(await page.getByLabel("Allow new Birdeye requests").isChecked(), true);
  await page.getByLabel("Allow new Birdeye requests").uncheck();
  await page.getByRole("button", {name: "Send message", exact: true}).click();
  await page.getByRole("log", {name:"Conversation"}).getByText("Saved-data analysis fixture.", {exact:true}).waitFor();
  const markdown = page.locator(".chat-answer .markdown-body").last();
  assert.equal(await markdown.getByRole("heading", {name: "Saved findings"}).count(), 1);
  assert.equal(await markdown.locator("table tbody tr").count(), 1);
  assert.equal(await markdown.locator("pre code").count(), 1);
  assert.equal(await markdown.getByRole("link", {name: "Birdeye docs"}).getAttribute("rel"), "noopener noreferrer");
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "Markdown stays within mobile width");
  await page.screenshot({path: ".impeccable/review/chat-markdown-mobile.png", fullPage: true});
  assert.equal(ledger.summary().estimated,170,"Saved-only chat must not call Birdeye");
  await page.reload();
  if (!await page.locator(".history-rail").evaluate(el => el.open)) await page.locator(".history-rail > summary").click();
  await page.getByRole("button", {name:/Summarize the saved wallets.*completed/}).click();
  await page.getByRole("log", {name:"Conversation"}).getByText("Saved-data analysis fixture.", {exact:true}).waitFor();
  assert.equal(ledger.summary().estimated,170);
  await page.setViewportSize({width: 1440, height: 1000});
  await page.screenshot({path: ".impeccable/review/desktop.png", fullPage: true});
  await page.setViewportSize({width: 390, height: 844});
  await page.screenshot({path: ".impeccable/review/mobile.png", fullPage: true});
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  assert.deepEqual(errors, []);
  if (!await page.locator(".history-rail").evaluate(el=>el.open)) await page.locator(".history-rail > summary").click();
  const historyCount=await page.locator(".history-item").count();
  await page.getByRole("button",{name:"Clear history",exact:true}).click();
  await page.getByRole("button",{name:"Cancel",exact:true}).click();
  assert.equal(await page.locator(".history-item").count(),historyCount);
  await page.locator(".history-row").first().getByRole("button",{name:/^Delete /}).click();
  await page.getByRole("button",{name:"Delete run",exact:true}).click();
  await page.getByText("Run deleted.",{exact:true}).waitFor();
  assert.equal(await page.locator(".history-item").count(),historyCount-1);
  await page.getByRole("button",{name:"Clear history",exact:true}).click();
  await page.getByRole("button",{name:"Delete all runs",exact:true}).click();
  await page.getByText("History cleared.",{exact:true}).waitFor();
  await page.reload();
  await page.locator(".history-empty").waitFor({state:"attached"});
  assert.equal(await page.locator(".history-item").count(),0);
  assert.equal(ledger.summary().estimated,170,"Deleting reports preserves CU accounting");
  assert.equal(await page.getByRole("button",{name:"Imports",exact:true}).count(),0);
  await page.getByRole("button",{name:"Demos",exact:true}).click();
  await page.getByRole("navigation",{name:"Product use case"}).getByRole("button",{name:"Security signals",exact:true}).click();
  await page.getByLabel("Token address",{exact:true}).fill(address);
  assert.equal(await page.getByRole("button",{name:"Preview APIs & CU",exact:true}).count(),0);
  await page.getByLabel("CU limit per run",{exact:true}).fill("1");
  await page.getByRole("button",{name:"Create draft",exact:true}).click();
  await page.getByRole("alert").filter({hasText:"Draft needs 70 estimated CU"}).waitFor();
  assert.equal(ledger.summary().estimated,170,"Insufficient draft budget must not spend CU");
  await page.getByLabel("CU limit per run",{exact:true}).fill("1000");
  await page.locator(".demo-query-settings > summary").click();
  await page.getByLabel("Minimum liquidity · USD",{exact:true}).fill("200000");
  assert.equal(await page.getByRole("button",{name:"Create draft",exact:true}).isDisabled(),false);
  await page.getByRole("button",{name:"Create draft",exact:true}).click();
  await page.getByRole("heading",{name:"Configured rule checks",exact:true}).waitFor();
  await page.locator(".demo-coverage-note").filter({hasText:"Partial evidence"}).waitFor();
  assert.equal(ledger.summary().estimated,240);
  await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({path:".impeccable/review/demos-desktop.png",fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:".impeccable/review/demos-mobile.png",fullPage:true});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.reload();
  if(!await page.locator(".history-rail").evaluate(el=>el.open))await page.locator(".history-rail > summary").click();
  await page.locator(".history-item").filter({hasText:"Security signals"}).click();
  await page.getByRole("heading",{name:"Configured rule checks",exact:true}).waitFor();
  assert.equal(ledger.summary().estimated,240,"Reopening a demo must reuse evidence");
  // Delayed draft preparation must not execute after opening another saved run.
  let releasePreview,previewStarted;
  const pendingPreview=new Promise(resolve=>{previewStarted=resolve;});
  const release=new Promise(resolve=>{releasePreview=resolve;});
  await page.route("**/api/demos/plan",async route=>{previewStarted();await release;await route.continue();});
  await page.getByRole("navigation",{name:"Product use case"}).getByRole("button",{name:"Research terminal",exact:true}).click();
  await page.getByRole("button",{name:"Create draft",exact:true}).click();
  await pendingPreview;
  await page.locator(".history-item").filter({hasText:"Security signals"}).click();
  await page.getByRole("heading",{name:"Configured rule checks",exact:true}).waitFor();
  const staleResponse=page.waitForResponse("**/api/demos/plan");
  releasePreview();await staleResponse;
  assert.equal(await page.getByRole("navigation",{name:"Product use case"}).getByRole("button",{name:"Security signals",exact:true}).getAttribute("aria-pressed"),"true");
  assert.equal(await page.getByRole("button",{name:"Create draft",exact:true}).isDisabled(),false);
  assert.equal(ledger.summary().estimated,240);
  await page.unroute("**/api/demos/plan");
  await page.getByRole("navigation",{name:"Product use case"}).getByRole("button",{name:"Wallet intelligence",exact:true}).click();
  await page.getByText("Create a draft to view results.",{exact:true}).waitFor();
  assert.equal(await page.getByLabel("Wallet address",{exact:true}).count(),0);
  const discoveryBefore=ledger.summary().estimated;
  await page.getByRole("button",{name:"Create draft",exact:true}).click();
  const candidate=page.getByRole("button",{name:`Select wallet ${address}`,exact:true});
  await candidate.waitFor();
  // The fixture discovers one token: 20 CU discovery + 30 CU traders, not the upper bound.
  await page.locator(".demo-run-state").filter({hasText:/^(completed|partial)$/}).waitFor();
  const afterDiscovery=ledger.summary().estimated;
  assert.equal(afterDiscovery-discoveryBefore,50);
  for(const [name,width,height] of [["desktop",1440,1000],["mobile",390,844]]){
    await page.setViewportSize({width,height});
    await page.screenshot({path:`.impeccable/review/wallet-discovery-${name}.png`,fullPage:true});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  }
  await candidate.click();
  assert.equal(ledger.summary().estimated,afterDiscovery,"Selecting a wallet must be free");
  assert.equal(await page.getByRole("button",{name:"Create draft",exact:true}).isDisabled(),false);
  await page.getByRole("button",{name:"Create draft",exact:true}).click();
  await page.getByRole("heading",{name:"PnL breakdown · 7d",exact:true}).waitFor();
  await page.locator(".demo-run-state").filter({hasText:/^(completed|partial)$/}).waitFor();
  assert.equal(ledger.summary().estimated,afterDiscovery+90);
  if(!await page.locator(".history-rail").evaluate(el=>el.open))await page.locator(".history-rail > summary").click();
  await page.locator(".history-item").filter({hasText:"Wallet intelligence · discover"}).click();
  await page.getByRole("heading",{name:"Discovered wallets",exact:true}).waitFor();
  assert.equal(ledger.summary().estimated,afterDiscovery+90,"History reuses the discovery shortlist");
  assert.deepEqual(errors,[]);
  console.log("Browser smoke passed; screenshots use synthetic fixture data.");
} finally {
  await browser?.close();
  await app.close();
  ledger.close();
}
