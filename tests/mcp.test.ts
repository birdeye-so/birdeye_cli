import test from "node:test";
import assert from "node:assert/strict";
import { BirdeyeMcp, BIRDEYE_MCP_URL, type McpTool } from "../src/mcp.js";
import { Ledger } from "../src/ledger.js";
import { Runner } from "../src/runner.js";
import { runChat } from "../src/ai.js";
import { RunStore } from "../src/run-store.js";
import { startInterface } from "../src/interface/server.js";
import { inProcessFetch } from "./http-helper.js";
import type { Profile } from "../src/config.js";
import type { Data } from "../src/shared.js";

const address = "So11111111111111111111111111111111111111112";
const tool: McpTool = {name: "get_token_price", description: "Current token price", inputSchema: {
  type: "object", properties: {address: {type: "string", minLength: 32}}, required: ["address"], additionalProperties: false,
}, annotations: {readOnlyHint: true}};
const profile: Profile = {provider: "openai-compatible", apiFormat: "responses", baseUrl: "https://provider.test/v1", model: "fixture", apiKey: "fixture-ai", apiKeyEnv: "BIRDEYE_TEST_UNUSED_KEY"};
const call = (id: string, name: string, args: Data) => ({type: "function_call", call_id: id, name, arguments: JSON.stringify(args)});
const answer = {type: "message", role: "assistant", content: [{type: "output_text", text: "Provider reported price; MCP CU is unknown."}]};
const aiResponse = (output: Data[]) => Response.json({status: "completed", output, usage: {input_tokens: 10, output_tokens: 5}});

function fixture(options: {sse?: boolean; key?: string; page?: (params: Data) => Data; result?: Data; failure?: boolean} = {}) {
  const requests: Data[] = [];
  let closed = 0;
  const fetch: typeof globalThis.fetch = async (url, init) => {
    assert.equal(String(url), BIRDEYE_MCP_URL);
    assert.equal(init?.redirect, "error");
    const headers = new Headers(init?.headers);
    assert.equal(headers.get("x-api-key"), options.key || null);
    if (init?.method === "DELETE") { closed++; return new Response(null, {status: 204}); }
    const request = JSON.parse(String(init?.body));
    requests.push(request);
    assert.match(headers.get("accept") || "", /application\/json, text\/event-stream/);
    if (request.method === "initialize") return Response.json({jsonrpc: "2.0", id: request.id, result: {protocolVersion: "2025-06-18", capabilities: {tools: {}}}}, {headers: {"Mcp-Session-Id": "test-session"}});
    assert.equal(headers.get("mcp-session-id"), "test-session");
    assert.equal(headers.get("mcp-protocol-version"), "2025-06-18");
    if (request.method === "notifications/initialized") {
      assert.equal(request.id, undefined);
      return new Response(null, {status: 202});
    }
    if (request.method === "tools/call" && options.failure) throw new Error("secret from upstream");
    const result = request.method === "tools/list" ? options.page?.(request.params) || {tools: [tool]}
      : options.result || {content: [{type: "text", text: '{"price":42}'}], structuredContent: {price: 42}};
    const message = JSON.stringify({jsonrpc: "2.0", id: request.id, result});
    if (!options.sse) return new Response(message, {headers: {"Content-Type": "application/json"}});
    const bytes = new TextEncoder().encode(`: heartbeat\r\n\r\ndata: {"jsonrpc":"2.0","method":"notifications/tools/list_changed"}\r\n\r\nevent: message\r\ndata: ${message}\r\n\r\n`);
    let offset = 0;
    // Keep the stream open after its response: the client must stop on the matching id.
    return new Response(new ReadableStream({pull(controller) {
      if (offset < bytes.length) {controller.enqueue(bytes.slice(offset, offset + 7)); offset += 7;}
    }}), {headers: {"Content-Type": "text/event-stream"}});
  };
  return {fetch, requests, get closed() {return closed;}};
}

test("MCP initializes, authenticates, paginates, caches, refreshes and reads fragmented SSE", async () => {
  const remote = fixture({sse: true, key: "private-mcp-key", page: params => params.cursor
    ? {tools: [{...tool, name: "get_token_overview"}]}
    : {tools: [tool], nextCursor: "page-2"}});
  const client = new BirdeyeMcp("private-mcp-key", {fetch: remote.fetch});
  try {
    assert.equal((await client.listTools()).length, 2);
    await client.getTool(tool.name);
    assert.equal(remote.requests.filter(r => r.method === "tools/list").length, 2);
    await client.listTools(undefined, true);
    assert.equal(remote.requests.filter(r => r.method === "tools/list").length, 4);
    const data = await client.callTool(tool.name, {address});
    assert.equal(data.structuredContent.price, 42);
  } finally {await client.close();}
  assert.equal(remote.closed, 1);
});

test("MCP rejects unknown tools and bad arguments before calls, redacts credentials and honors cancellation", async () => {
  const remote = fixture({key: "private-mcp-key", result: {isError: true, content: [{type: "text", text: "Error private-mcp-key"}]}});
  const client = new BirdeyeMcp("private-mcp-key", {fetch: remote.fetch});
  try {
    await assert.rejects(client.callTool("invented", {}), {code: "MCP_TOOL_NOT_FOUND"});
    await assert.rejects(client.callTool(tool.name, {address: 123}), {code: "MCP_INVALID_ARGUMENTS"});
    assert.equal(remote.requests.filter(r => r.method === "tools/call").length, 0);
    const result = await client.callTool(tool.name, {address});
    assert.equal(result.isError, true);
    assert.ok(!JSON.stringify(result).includes("private-mcp-key"));
  } finally {await client.close();}
  const controller = new AbortController(); controller.abort();
  let contacted = false;
  await assert.rejects(new BirdeyeMcp("", {fetch: async () => {contacted = true; throw new Error();}}).listTools(controller.signal), {name: "AbortError"});
  assert.equal(contacted, false);
});

test("MCP rejects pagination loops, mismatched IDs, HTTP errors and oversized responses", async () => {
  const repeating = fixture({page: () => ({tools: [tool], nextCursor: "again"})});
  const client = new BirdeyeMcp("", {fetch: repeating.fetch});
  try {await assert.rejects(client.listTools(), {code: "MCP_PROTOCOL_ERROR"});}
  finally {await client.close();}
  for (const [response, code] of [
    [() => Response.json({jsonrpc: "2.0", id: 999, result: {}}), "MCP_PROTOCOL_ERROR"],
    [() => new Response("private error", {status: 401}), "MCP_HTTP_ERROR"],
    [() => Response.json({padding: "a".repeat(2_000_001)}), "MCP_RESPONSE_TOO_LARGE"],
  ] as const) {
    await assert.rejects(new BirdeyeMcp("", {fetch: async () => response()}).listTools(), {code});
  }
});

test("MCP accounting shares request limits, records unknown cost and never retries failed calls", async () => {
  const ledger = new Ledger(":memory:"), runner = new Runner(ledger, "");
  const remote = fixture(), client = new BirdeyeMcp("", {fetch: remote.fetch});
  try {
    const run = ledger.createRun(15, undefined, 1);
    const result = await runner.executeMcp(client, tool.name, {address}, {run});
    assert.equal(result.meta.estimatedCu, null);
    assert.equal(ledger.attempts(run)[0].estimated, null);
    assert.equal(ledger.summary(run).unknownCostAttempts, 1);
    assert.equal(ledger.summary(run).uncertainAttempts, 0);
    await assert.rejects(runner.executeMcp(client, tool.name, {address}, {run}), {code: "REQUEST_LIMIT"});
    assert.throws(() => ledger.reserve(run, "token.price", 3, "fixture"), {code: "REQUEST_LIMIT"});
    await assert.rejects(runner.executeMcp(client, tool.name, {address}, {run: ledger.createRun(0)}), {code: "CU_BUDGET_EXCEEDED"});
    const workflow = ledger.createWorkflow("zero", 0);
    await assert.rejects(runner.executeMcp(client, tool.name, {address}, {run: ledger.createRun(10, workflow.id)}), {code: "CU_BUDGET_EXCEEDED"});
    assert.equal(remote.requests.filter(r => r.method === "tools/call").length, 1);
    const broken = fixture({failure: true}), failed = new BirdeyeMcp("", {fetch: broken.fetch}), failedRun = ledger.createRun();
    try {await assert.rejects(runner.executeMcp(failed, tool.name, {address}, {run: failedRun}), {code: "MCP_CONNECTION_ERROR"});}
    finally {await failed.close();}
    assert.equal(broken.requests.filter(r => r.method === "tools/call").length, 1);
    assert.equal(ledger.summary(failedRun).unknownCostAttempts, 1);
    assert.equal(ledger.summary(failedRun).uncertainAttempts, 1);
  } finally {await client.close(); ledger.close();}
});

test("chat discovers MCP schemas, calls once for duplicates and retains source evidence", async () => {
  for (const apiFormat of ["responses", "chat-completions"] as const) {
    const ledger = new Ledger(":memory:"), remote = fixture(), runner = new Runner(ledger, "");
    let round = 0, checkpoints = 0;
    const outputs: Data[][] = [
      [call("search", "search_birdeye_mcp_tools", {query: "price"})],
      [call("schema", "read_birdeye_mcp_tool", {name: tool.name})],
      [call("data", "call_birdeye_mcp_tool", {name: tool.name, arguments: {address}}), call("duplicate", "call_birdeye_mcp_tool", {arguments: {address}, name: tool.name})],
      [answer],
    ];
    try {
      const run = ledger.createRun(), store = new RunStore(ledger);
      const result = await runChat(runner, run, {...profile, apiFormat}, "Discover price tools", {
        mcp: new BirdeyeMcp("", {fetch: remote.fetch}), dataPolicy: "live",
        evidence: result => {checkpoints++; store.save({id: run, title: "MCP research", input: {}, status: "running", createdAt: new Date().toISOString(), ai: {}, result});},
        fetch: async (_, init) => {
          const body = JSON.parse(String(init?.body));
          const names = body.tools.map((t: Data) => t.name || t.function?.name);
          assert.ok(names.includes("search_birdeye_mcp_tools"));
          if (round === 2) assert.match(JSON.stringify(body), /additionalProperties/);
          if (round === 3) assert.match(JSON.stringify(body), /structuredContent/);
          const output = outputs[round++];
          return apiFormat === "responses" ? aiResponse(output) : Response.json({choices: [{message: output[0] === answer
            ? {role: "assistant", content: "Provider reported price; MCP CU is unknown."}
            : {role: "assistant", content: "", tool_calls: output.map(c => ({id: c.call_id, type: "function", function: {name: c.name, arguments: c.arguments}}))}}]});
        },
      });
      assert.equal(round, 4); assert.equal(checkpoints, 1);
      assert.equal(result.data.sources.length, 1);
      assert.equal(result.data.sources[0].meta.endpoint, BIRDEYE_MCP_URL);
      assert.equal(result.meta.cu.unknownCostAttempts, 1);
      assert.match(result.meta.warnings.join(" "), /unknown CU/);
      assert.equal(store.get(run).result!.data.sources[0].data.structuredContent.price, 42);
      assert.equal(remote.requests.filter(r => r.method === "tools/call").length, 1);
      assert.equal(remote.closed, 1);
    } finally {ledger.close();}
  }
});

test("saved-only rejects all MCP entry points without network access", async () => {
  const ledger = new Ledger(":memory:"), remote = fixture(); let round = 0;
  const names = ["search_birdeye_mcp_tools", "read_birdeye_mcp_tool", "call_birdeye_mcp_tool"];
  try {
    await runChat(new Runner(ledger, ""), ledger.createRun(0), profile, "Use saved data", {
      dataPolicy: "saved-only", mcp: new BirdeyeMcp("", {fetch: remote.fetch}),
      fetch: async (_, init) => {
        const body = JSON.parse(String(init?.body));
        assert.ok(body.tools.every((t: Data) => !names.includes(t.name)));
        if (!round++) return aiResponse(names.map(name => call(name, name, {})));
        const outputs = body.input.filter((item: Data) => item.type === "function_call_output");
        assert.ok(outputs.every((item: Data) => JSON.parse(item.output).error.code === "LIVE_DATA_DISABLED"));
        return aiResponse([answer]);
      },
    });
    assert.equal(remote.requests.length, 0); assert.equal(remote.closed, 0);
    assert.equal(ledger.summary().attempts, 0);
  } finally {ledger.close();}
});

test("interface wires its Birdeye credential into live MCP and archives tool errors as failed evidence", async () => {
  const ledger = new Ledger(":memory:"), remote = fixture({key: process.env.BIRDEYE_API_KEY || "test-data-key", result: {isError: true, content: [{type: "text", text: "No coverage for this token"}]}});
  let round = 0;
  const app = await startInterface({ledger, listen: false, config: {birdeyeApiKey: "test-data-key", ai: {defaultProfile: "research", profiles: {research: profile}}}, mcpFetch: remote.fetch,
    aiFetch: async () => aiResponse(round++ ? [answer] : [call("data", "call_birdeye_mcp_tool", {name: tool.name, arguments: {address}})]),
  });
  const fetch = inProcessFetch(app.handler, app.url);
  try {
    const login = await fetch(app.url + "/api/connect", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({code: app.connectCode})});
    const headers = {"Content-Type": "application/json", Cookie: login.headers.get("set-cookie")!.split(";")[0]};
    const {id} = await (await fetch(app.url + "/api/runs", {method: "POST", headers, body: JSON.stringify({mode: "chat", question: "Check price", dataPolicy: "live"})})).json();
    await fetch(`${app.url}/api/runs/${id}/events`, {headers});
    const run = await (await fetch(`${app.url}/api/runs/${id}`, {headers})).json();
    assert.equal(run.saved, true);
    assert.equal(run.result.data.sources[0].meta.isError, true);
    assert.equal(run.result.data.sources[0].meta.coverage, "empty");
    assert.equal(run.cu.unknownCostAttempts, 1);
    assert.equal(run.status, "partial");
    assert.equal(remote.closed, 1);
  } finally {await app.close(); ledger.close();}
});
