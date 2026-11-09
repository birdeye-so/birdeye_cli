import test from "node:test";
import assert from "node:assert/strict";
import { completion, runChat, checkToolCalling } from "../src/ai.js";
import { profileSchema, type Profile } from "../src/config.js";
import { Ledger } from "../src/ledger.js";
import { Runner } from "../src/runner.js";
import { AppError, type Data } from "../src/shared.js";
import {planCase} from "../src/workflows.js";

const address = "So11111111111111111111111111111111111111112";
const profile: Profile = {provider: "openai-compatible", apiFormat: "responses", baseUrl: "https://provider.test/v1/", model: "fixture", apiKeyEnv: "BIRDEYE_TEST_UNUSED_KEY", apiKey: "fixture"};
const usage = () => ({inputTokens: 0, outputTokens: 0, calls: 0, unknownCalls: 0});
const message = (text: string) => ({type: "message", role: "assistant", content: [{type: "output_text", text}]});
const call = (id: string, name: string, args: Data) => ({type: "function_call", id: `fc_${id}`, call_id: id, name, arguments: JSON.stringify(args)});
const response = (output: Data[]) => Response.json({status: "completed", output, usage: {input_tokens: 10, output_tokens: 5}});

test("selected workflow calls enforce the CU budget and preserve partial evidence", async () => {
  const ledger = new Ledger(":memory:"); let dataCalls = 0, rounds = 0;
  const runner = new Runner(ledger, "fixture", {fetch: async () => {dataCalls++; return Response.json({success: true, data: {address, price: 42}});}});
  try {
    const input = planCase({kind: "token-research", address}).input;
    const result = await runChat(runner, ledger.createRun(18), profile, "Research this workflow", {
      workflow: {kind: input.kind, input},
      fetch: async () => rounds++ ? response([message("Only overview was within budget.")]) : response([call("selected", "run_selected_workflow", {})]),
    });
    assert.equal(dataCalls, 1);
    assert.equal(result.meta.cu.estimated, 18);
    assert.equal(result.data.sources.length, 1);
    assert.equal(result.meta.coverage, "partial");
    assert.ok(result.data.missing.length > 0);
  } finally {ledger.close();}
});

test("an incomplete selected workflow remains discoverable but cannot execute invented inputs", async () => {
  const ledger = new Ledger(":memory:"); let rounds = 0;
  const runner = new Runner(ledger, "fixture", {fetch: async () => {throw new Error("No data request allowed");}});
  try {
    const result = await runChat(runner, ledger.createRun(), profile, "Research this token", {
      workflow: {kind: "token-research"},
      fetch: async (_, init) => {
        const body = JSON.parse(String(init?.body));
        assert.ok(!body.tools.some((t: Data) => t.name === "run_selected_workflow"));
        if (!rounds++) return response([call("context", "read_research_context", {}), call("forged", "run_selected_workflow", {})]);
        const outputs = body.input.filter((item: Data) => item.type === "function_call_output");
        const context = JSON.parse(outputs[0].output);
        assert.equal(context.workflow.kind, "token-research");
        assert.equal(context.workflow.ready, false);
        assert.equal(context.workflow.input, undefined);
        assert.equal(JSON.parse(outputs[1].output).error.code, "WORKFLOW_INPUT_MISSING");
        return response([message("Please provide the token address.")]);
      },
    });
    assert.equal(result.meta.cu.attempts, 0);
  } finally {ledger.close();}
});

test("Responses tool rounds preserve reasoning, correlate call_id, deduplicate requests and enforce CU budget", async () => {
  const ledger = new Ledger(":memory:");
  let dataCalls = 0, aiCalls = 0;
  const runner = new Runner(ledger, "fixture", {fetch: async () => {
    dataCalls++;
    return Response.json({success: true, data: {address, liquidity: 10}});
  }});
  const reasoning = {type: "reasoning", id: "rs_fixture", summary: [], encrypted_content: "opaque-fixture"};
  const first = [reasoning, message("Checking data."), call("one", "token_overview", {address}), call("two", "token_overview", {address})];
  const second = [call("blocked", "token_security", {address}), call("estimate", "estimate_workflow", {kind: "skill-token-dd", address})];
  try {
    const result = await runChat(runner, ledger.createRun(18), profile, "Research this token", {
      short: true, history: [{role: "user", content: "Earlier question"}, {role: "assistant", content: "Earlier answer"}],
      fetch: async (url, init) => {
        aiCalls++;
        assert.equal(String(url), "https://provider.test/v1/responses");
        const body = JSON.parse(String(init?.body));
        assert.equal(body.store, false);
        assert.equal(body.max_output_tokens, 1800);
        assert.equal(body.messages, undefined);
        assert.equal(body.max_tokens, undefined);
        assert.equal(body.previous_response_id, undefined);
        assert.deepEqual(body.include, ["reasoning.encrypted_content"]);
        assert.ok(body.tools.every((tool: Data) => tool.type === "function" && tool.name && tool.parameters && tool.strict === false && !tool.function));
        assert.equal(body.input[1].content, "Earlier question");
        assert.match(body.input[0].content, /Answer concisely/);
        if (aiCalls === 1) return response(first);
        assert.deepEqual(body.input.slice(4, 8), first);
        const outputs = body.input.filter((item: Data) => item.type === "function_call_output");
        assert.deepEqual(outputs.slice(0, 2).map((item: Data) => item.call_id), ["one", "two"]);
        assert.ok(outputs.every((item: Data) => typeof item.output === "string"));
        if (aiCalls === 2) return response(second);
        assert.deepEqual(body.input.slice(10, 12), second);
        assert.equal(JSON.parse(outputs[2].output).error.code, "CU_BUDGET_EXCEEDED");
        assert.equal(JSON.parse(outputs[3].output).estimatedCu, 58);
        return response([message("Observed liquidity."), message("Security check exceeded budget.")]);
      },
    });
    assert.equal(dataCalls, 1);
    assert.equal(aiCalls, 3);
    assert.equal(result.meta.cu.estimated, 18);
    assert.deepEqual(result.meta.ai, {inputTokens: 30, outputTokens: 15, calls: 3, unknownCalls: 0});
    assert.equal(result.data.sources.length, 1);
    assert.match(JSON.stringify(result.data), /Observed liquidity.\\nSecurity check/);
  } finally { ledger.close(); }
});

test("Responses handles text, refusals, incomplete/error output and missing usage", async () => {
  const counts = usage();
  const result = await completion(profile, [{role: "user", content: "Hi"}], {usage: counts, fetch: async () => response([message("Hello")])});
  assert.equal(result.content, "Hello");
  const refusal = await completion(profile, [], {usage: counts, fetch: async () => Response.json({status: "completed", output: [{type: "message", role: "assistant", content: [{type: "refusal", refusal: "Cannot answer."}]}]})});
  assert.equal(refusal.content, "Cannot answer.");
  assert.equal(counts.unknownCalls, 1);
  for (const body of [
    {status: "incomplete", output: [call("partial", "token_overview", {address})], usage: {input_tokens: 7, output_tokens: 3}},
    {status: "failed", error: {message: "private-secret"}},
    {status: "completed", output: []},
    {status: "completed", output: [{type: "function_call", id: "no_call_id", name: "token_overview", arguments: "{}"}]},
  ]) {
    const count = usage();
    await assert.rejects(completion(profile, [], {usage: count, fetch: async () => Response.json(body)}),
      (e: unknown) => e instanceof AppError && !e.message.includes("private-secret"));
    assert.equal(count.calls, 1);
    assert.equal(count.unknownCalls, body.status === "incomplete" ? 0 : 1);
    if (body.status === "incomplete") assert.equal(count.outputTokens, 3);
  }
});

test("Responses transport errors stay redacted and cancellation reaches fetch", async () => {
  const count = usage();
  await assert.rejects(completion(profile, [], {usage: count, fetch: async () => new Response("private-secret", {status: 429})}),
    (e: unknown) => e instanceof AppError && e.code === "AI_PROVIDER_ERROR" && !e.message.includes("private-secret"));
  assert.equal(count.unknownCalls, 1);
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(completion(profile, [], {usage: usage(), signal: controller.signal, fetch: async (_, init) => {
    assert.equal(init?.signal?.aborted, true);
    init?.signal?.throwIfAborted();
    return response([message("unreachable")]);
  }}), {name: "AbortError"});
});

test("legacy profiles keep Chat Completions and reject unknown API formats", async () => {
  assert.throws(() => profileSchema.parse({...profile, apiFormat: "response"}));
  const {apiFormat: _, ...legacy} = profile;
  await completion(legacy, [{role: "user", content: "Hi"}], {usage: usage(), fetch: async (url, init) => {
    assert.equal(String(url), "https://provider.test/v1/chat/completions");
    const body = JSON.parse(String(init?.body));
    assert.deepEqual(body.messages, [{role: "user", content: "Hi"}]);
    assert.equal(body.input, undefined);
    return Response.json({choices: [{message: {role: "assistant", content: "OK"}}]});
  }});
});

test("function-calling probe distinguishes tool support, silent tool dropping and rejected tools", async () => {
  const probe = (reply: (body: Data) => Response) => checkToolCalling(profile, {fetch: async (_, init) => reply(JSON.parse(String(init?.body)))});
  assert.deepEqual(await probe(() => response([call("p", "confirm_tool_support", {ok: true})])), {supported: true});
  assert.deepEqual(await probe(() => response([message("ok")])), {supported: false, message: "The model answered with text instead of calling the test tool."});
  const sent: Data[] = [];
  assert.deepEqual(await probe(body => {sent.push(body); return body.tools ? new Response("{}", {status: 400}) : response([message("ok")]);}),
    {supported: false, message: "The provider rejected the tools parameter."});
  assert.equal(sent.length, 2); assert.equal(sent[1].tools, undefined);
  await assert.rejects(probe(() => new Response("{}", {status: 400})), (e: AppError) => e.code === "AI_PROVIDER_ERROR");
  await assert.rejects(probe(() => new Response("{}", {status: 503})), (e: AppError) => e.code === "AI_PROVIDER_ERROR" && e.retryable);
  const chat = {...profile, apiFormat: "chat-completions" as const};
  assert.deepEqual(await checkToolCalling(chat, {fetch: async () => Response.json({choices: [{message: {role: "assistant", content: null, tool_calls: [{id: "c", type: "function", function: {name: "confirm_tool_support", arguments: "{\"ok\":true}"}}]}}]})}), {supported: true});
  assert.deepEqual(await checkToolCalling(chat, {fetch: async () => Response.json({choices: [{message: {role: "assistant", content: "ok"}}]})}), {supported: false, message: "The model answered with text instead of calling the test tool."});
});

test("provider errors show the provider's reason without the configured key", async () => {
  const fail = (status: number, body: string) => completion(profile, [{role: "user", content: "hi"}], {usage: usage(), fetch: async () => new Response(body, {status})});
  await assert.rejects(fail(400, JSON.stringify({error: {message: "Unsupported parameter: 'max_tokens'. Key fixture was used.", param: "max_tokens"}})),
    (e: AppError) => e.message === "AI provider returned HTTP 400: Unsupported parameter: 'max_tokens'. Key <redacted> was used." && !e.retryable);
  await assert.rejects(fail(400, "<html>Bad Request</html>"), (e: AppError) => e.message === "AI provider returned HTTP 400. Check the model, key and tool-calling support.");
  await assert.rejects(fail(422, JSON.stringify({detail: "x".repeat(500)})), (e: AppError) => e.message.length === "AI provider returned HTTP 422: ".length + 300);
  const rejected = await checkToolCalling(profile, {fetch: async (_, init) => JSON.parse(String(init?.body)).tools
    ? new Response(JSON.stringify({error: {message: "Invalid schema for function 'confirm_tool_support'."}}), {status: 400}) : response([message("ok")])});
  assert.deepEqual(rejected, {supported: false, message: "The provider rejected the tools parameter: Invalid schema for function 'confirm_tool_support'."});
});

test("user request parameters override provider defaults and null removes them", async () => {
  const sent = async (p: Profile) => {let body: Data = {}; await completion(p, [{role: "user", content: "hi"}], {usage: usage(), fetch: async (_, init) => {body = JSON.parse(String(init?.body)); return p.apiFormat === "responses" ? response([message("ok")]) : Response.json({choices: [{message: {role: "assistant", content: "ok"}}]});}}); return body;};
  const chat = {...profile, apiFormat: "chat-completions" as const};
  const plain = await sent(chat);
  assert.equal("max_tokens" in plain, false); assert.equal("max_completion_tokens" in plain, false);
  assert.equal((await sent({...chat, requestParams: {max_tokens: 500}})).max_tokens, 500);
  const openai = await sent({...chat, requestParams: {max_completion_tokens: 1800, reasoning_effort: "low"}});
  assert.equal("max_tokens" in openai, false);
  assert.equal(openai.max_completion_tokens, 1800); assert.equal(openai.reasoning_effort, "low"); assert.equal(openai.model, "fixture");
  const responses = await sent({...profile, requestParams: {include: null, max_output_tokens: 4000, reasoning: {effort: "high"}}});
  assert.equal("include" in responses, false); assert.equal(responses.store, false);
  assert.equal(responses.max_output_tokens, 4000); assert.deepEqual(responses.reasoning, {effort: "high"});
  for (const key of ["model", "messages", "input", "tools", "stream"])
    assert.throws(() => profileSchema.parse({...profile, requestParams: {[key]: "x"}}), /set by the app/);
  assert.throws(() => profileSchema.parse({...profile, requestParams: {notes: "x".repeat(4001)}}), /4,000/);
  assert.throws(() => profileSchema.parse({...profile, requestParams: ["max_tokens"]}));
});
