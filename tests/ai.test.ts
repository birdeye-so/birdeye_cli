import test from "node:test";
import assert from "node:assert/strict";
import { completion, runChat } from "../src/ai.js";
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
    const result = await runChat(runner, ledger.createRun(15), profile, "Research this workflow", {
      workflow: {kind: input.kind, input},
      fetch: async () => rounds++ ? response([message("Only overview was within budget.")]) : response([call("selected", "run_selected_workflow", {})]),
    });
    assert.equal(dataCalls, 1);
    assert.equal(result.meta.cu.estimated, 15);
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
    const result = await runChat(runner, ledger.createRun(15), profile, "Research this token", {
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
        assert.equal(JSON.parse(outputs[3].output).estimatedCu, 50);
        return response([message("Observed liquidity."), message("Security check exceeded budget.")]);
      },
    });
    assert.equal(dataCalls, 1);
    assert.equal(aiCalls, 3);
    assert.equal(result.meta.cu.estimated, 15);
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
