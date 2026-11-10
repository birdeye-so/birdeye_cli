// Users are told when the configured model cannot call functions. Synthetic keys; providers are fixtures.
import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Ledger } from "../dist/ledger.js";
import { startInterface } from "../dist/interface/server.js";
import { startBrowserInterface } from "../dist/interface/browser-server.js";
delete process.env.BIRDEYE_API_KEY;
delete process.env.BIRDEYE_AI_API_KEY;
// Only "tools-model" calls the probe tool; other models answer with text as if tools were dropped.
const payload = (body) => {
  const call =
    body.model === "tools-model" &&
    body.tools?.some((t) => t.name === "confirm_tool_support");
  return {
    status: "completed",
    usage: { input_tokens: 1, output_tokens: 1 },
    output: [
      call
        ? {
            type: "function_call",
            call_id: "probe",
            name: "confirm_tool_support",
            arguments: '{"ok":true}',
          }
        : {
            type: "message",
            role: "assistant",
            content: [{ type: "output_text", text: "Text only." }],
          },
    ],
  };
};
const dir = await mkdtemp(join(tmpdir(), "birdeye-tool-check-"));
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
async function check(mode, app) {
  const route = mode === "browser",
    page = await browser.newPage(),
    errors = [],
    direct = [],
    relayed = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    const u = new URL(r.url());
    if (u.host === "provider.test") direct.push(u.pathname);
    if (u.pathname.startsWith("/relay/")) relayed.push(u.pathname);
  });
  // Chat Completions behaves like newer OpenAI models: max_tokens is rejected with the provider's real error.
  const chat = (body) =>
    "max_tokens" in body
      ? {
          status: 400,
          body: {
            error: {
              message:
                "Unsupported parameter: 'max_tokens' is not supported with this model. Use 'max_completion_tokens' instead.",
              type: "invalid_request_error",
              param: "max_tokens",
              code: "unsupported_parameter",
            },
          },
        }
      : {
          status: 200,
          body: {
            choices: [
              {
                message: body.tools?.some(
                  (t) => t.function?.name === "confirm_tool_support",
                )
                  ? {
                      role: "assistant",
                      content: null,
                      tool_calls: [
                        {
                          id: "c",
                          type: "function",
                          function: {
                            name: "confirm_tool_support",
                            arguments: '{"ok":true}',
                          },
                        },
                      ],
                    }
                  : { role: "assistant", content: "Text only." },
              },
            ],
          },
        };
  const chatBodies = [];
  if (route)
    await page.route("https://provider.test/**", (r) => {
      const body = JSON.parse(r.request().postData());
      if (!r.request().url().endsWith("/chat/completions"))
        return r.fulfill({
          contentType: "application/json",
          body: JSON.stringify(payload(body)),
        });
      chatBodies.push(body);
      const reply = chat(body);
      return r.fulfill({
        status: reply.status,
        contentType: "application/json",
        body: JSON.stringify(reply.body),
      });
    });
  await page.goto(app.loginUrl ?? app.url);
  if (mode !== "sqlite")
    await page.getByRole("button", { name: "Use temporary session" }).click();
  await page
    .getByRole("heading", { name: "Token Trending", exact: true })
    .waitFor();
  const save = async (model) => {
    await page
      .getByRole("button", { name: "Settings", exact: true })
      .first()
      .click();
    await page.locator("#akey").fill("synthetic-ai-key");
    await page
      .getByLabel("Base URL", { exact: true })
      .fill("https://provider.test/v1");
    await page.getByLabel("API format").selectOption("responses");
    await page.getByLabel("Model ID").fill(model);
    await page
      .getByRole("button", { name: "Save connections", exact: true })
      .click();
  };
  await save("text-model");
  await page
    .getByText(
      "Function calling: not working with these settings. The model answered with text instead of calling the test tool.",
    )
    .waitFor();
  await page.getByRole("button", { name: "Research", exact: true }).click();
  await page.getByRole("button", { name: "Ask AI", exact: true }).click();
  await page
    .getByText("Function calling is not working with the current AI settings.")
    .waitFor();
  await save("tools-model");
  await page.getByText("Function calling: supported.").waitFor();
  await page.getByRole("button", { name: "Research", exact: true }).click();
  assert.equal(
    await page
      .getByText(
        "Function calling is not working with the current AI settings.",
      )
      .count(),
    0,
  );
  if (mode === "browser") {
    await page
      .getByRole("button", { name: "Settings", exact: true })
      .first()
      .click();
    const params = page.getByLabel("Extra request parameters (JSON, optional)");
    const saveAndProbe = async () => {
      const reply = page.waitForResponse((r) =>
        r.url().endsWith("/chat/completions"),
      );
      await page
        .getByRole("button", { name: "Save connections", exact: true })
        .click();
      await reply;
    };
    // No token-limit default, so a provider that rejects max_tokens works out of the box.
    await page.getByLabel("API format").selectOption("chat-completions");
    await saveAndProbe();
    await page.getByText("Function calling: supported.").waitFor();
    assert.equal("max_tokens" in chatBodies.at(-1), false);
    await params.fill("not json");
    await page
      .getByRole("button", { name: "Save connections", exact: true })
      .click();
    await page
      .getByRole("alert")
      .filter({ hasText: "Extra request parameters must be a JSON object" })
      .waitFor();
    // A parameter the provider rejects surfaces the provider's own reason.
    await params.fill('{"max_tokens": 500}');
    await saveAndProbe();
    await page
      .getByRole("alert")
      .filter({
        hasText:
          "AI provider returned HTTP 400: Unsupported parameter: 'max_tokens' is not supported with this model. Use 'max_completion_tokens' instead.",
      })
      .waitFor();
    await params.fill('{"max_completion_tokens": 1800}');
    await saveAndProbe();
    await page.getByText("Function calling: supported.").waitFor();
    assert.equal(chatBodies.at(-1).max_completion_tokens, 1800);
    await page.getByRole("button", { name: "Research", exact: true }).click();
    await page
      .getByRole("button", { name: "Settings", exact: true })
      .first()
      .click();
    assert.deepEqual(JSON.parse(await params.inputValue()), {
      max_completion_tokens: 1800,
    });
  }
  if (mode === "relay") {
    // provider.test is not routed here: answers can only arrive through the same-origin relay.
    await page.getByRole("button", { name: "Ask AI", exact: true }).click();
    await page.getByLabel("Allow new Birdeye requests").uncheck();
    await page.locator("textarea").first().fill("Explain.");
    await page
      .getByRole("button", { name: "Send message", exact: true })
      .click();
    await page.getByText("Text only.").first().waitFor();
    assert.deepEqual(direct, []);
    assert.ok(
      relayed.length >= 3 &&
        relayed.every((p) => p === "/relay/provider.test/v1/responses"),
      JSON.stringify(relayed),
    );
    assert.match(
      await page.locator(".browser-storage-bar").innerText(),
      /AI requests to provider.test, which this site relays/,
    );
    await page
      .getByRole("button", { name: "Settings", exact: true })
      .first()
      .click();
    await page
      .getByText(
        "provider.test blocks direct browser requests (CORS), so this site relays them.",
      )
      .waitFor();
  }
  assert.deepEqual(errors, []);
  await page.close();
}
try {
  const preview = await startBrowserInterface("127.0.0.1:0");
  try {
    await check("browser", preview);
  } finally {
    await preview.close();
  }
  const relay = await startBrowserInterface("127.0.0.1:0", undefined, {
    aiRelayHosts: ["provider.test"],
    relayFetch: async (_, init) =>
      Response.json(payload(JSON.parse(Buffer.from(init.body).toString()))),
  });
  try {
    await check("relay", relay);
  } finally {
    await relay.close();
  }
  const server = await startInterface({
    ledger: new Ledger(":memory:"),
    bind: "127.0.0.1:0",
    dir,
    aiFetch: async (_, init) =>
      Response.json(payload(JSON.parse(String(init.body)))),
  });
  try {
    await check("sqlite", server);
  } finally {
    await server.close();
  }
  console.log(
    "AI tool check: unsupported models are flagged in Settings and Ask AI; supported models clear the warning (browser, browser with AI relay, SQLite).",
  );
} finally {
  await browser.close();
  await rm(dir, { recursive: true, force: true });
}
