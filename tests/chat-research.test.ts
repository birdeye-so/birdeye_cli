import test from "node:test";
import assert from "node:assert/strict";
import { Ledger } from "../src/ledger.js";
import { Runner } from "../src/runner.js";
import { startInterface } from "../src/interface/server.js";
import { inProcessFetch } from "./http-helper.js";
import type { Data } from "../src/shared.js";

const address = "So11111111111111111111111111111111111111112";
const call = (id: string, name: string, args: Data = {}) => ({
  type: "function_call",
  call_id: id,
  name,
  arguments: JSON.stringify(args),
});
const answer = {
  type: "message",
  role: "assistant",
  content: [
    {
      type: "output_text",
      text: "Research complete using available evidence.",
    },
  ],
};

for (const apiFormat of ["responses", "chat-completions"] as const)
  test(`chat researches the selected workflow through tools (${apiFormat})`, async () => {
    const ledger = new Ledger(":memory:"),
      requests: URL[] = [],
      bodies: Data[] = [];
    const outputs = [
      [
        call("context", "read_research_context"),
        call("flows", "list_workflows", { query: "token" }),
      ],
      [call("execute", "run_selected_workflow")],
      [answer],
    ];
    const app = await startInterface({
      ledger,
      listen: false,
      config: {
        birdeyeApiKey: "fixture-data",
        ai: {
          defaultProfile: "research",
          profiles: {
            research: {
              provider: "openai-compatible",
              apiFormat,
              baseUrl: "https://provider.test/v1",
              model: "fixture",
              apiKeyEnv: "BIRDEYE_TEST_UNUSED_KEY",
              apiKey: "fixture-ai",
            },
          },
        },
      },
      runnerFactory: () =>
        new Runner(ledger, "fixture-data", {
          fetch: async (url) => {
            requests.push(new URL(String(url)));
            return Response.json({
              success: true,
              data: { address, price: 42, items: [{ address, amount: "10" }] },
            });
          },
        }),
      aiFetch: async (_, init) => {
        bodies.push(JSON.parse(String(init?.body)));
        const output = outputs[Math.min(bodies.length - 1, outputs.length - 1)];
        return apiFormat === "responses"
          ? Response.json({ status: "completed", output })
          : Response.json({
              choices: [
                {
                  message:
                    output[0] === answer
                      ? { role: "assistant", content: "Research complete." }
                      : {
                          role: "assistant",
                          content: "",
                          tool_calls: output.map((c: Data) => ({
                            id: c.call_id,
                            type: "function",
                            function: { name: c.name, arguments: c.arguments },
                          })),
                        },
                },
              ],
            });
      },
    });
    try {
      const fetch = inProcessFetch(app.handler, app.url);
      const login = await fetch(app.url + "/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: app.connectCode }),
      });
      const headers = {
        "Content-Type": "application/json",
        Cookie: login.headers.get("set-cookie")!.split(";")[0],
      };
      const request = (path: string, body?: Data) =>
        fetch(app.url + path, {
          headers,
          ...(body ? { method: "POST", body: JSON.stringify(body) } : {}),
        });
      const { id } = await (
        await request("/api/runs", {
          mode: "chat",
          question: "Research the selected flow",
          case: {
            kind: "token-research",
            address,
            stepOverrides: { holders: { limit: 3 } },
          },
          maxCu: 78,
        })
      ).json();
      await request(`/api/runs/${id}/events`);
      const run = await (await request(`/api/runs/${id}`)).json();
      const names = bodies[0].tools.map(
        (t: Data) => t.name || t.function?.name,
      );
      assert.ok(
        names.includes("run_workflow"),
        "New research chat must expose executable workflow tools",
      );
      assert.ok(names.includes("run_selected_workflow"));
      assert.match(JSON.stringify(bodies[1]), /"?stepOverrides/);
      assert.match(JSON.stringify(bodies[1]), new RegExp(address));
      assert.equal(requests.length, 3);
      assert.equal(
        requests
          .find((url) => url.pathname.endsWith("holder"))!
          .searchParams.get("limit"),
        "3",
      );
      assert.equal(run.input.dataPolicy, "live");
      assert.equal(run.result.data.sources.length, 3);
      assert.equal(run.cu.estimated, 78);
      assert.equal(run.saved, true);
      assert.equal(run.input.case.address, address);
      // Continuing a saved chat inherits the selected flow and an explicit saved-only choice.
      const next = await (
        await request("/api/runs", {
          mode: "chat",
          question: "Explain saved findings",
          parentId: id,
          dataPolicy: "saved-only",
        })
      ).json();
      await request(`/api/runs/${next.id}/events`);
      const last = await (
        await request("/api/runs", {
          mode: "chat",
          question: "Continue",
          parentId: next.id,
        })
      ).json();
      await request(`/api/runs/${last.id}/events`);
      const restored = await (await request(`/api/runs/${last.id}`)).json();
      assert.equal(restored.input.dataPolicy, "saved-only");
      assert.equal(restored.input.case.address, address);
      assert.equal(restored.cu.attempts, 0);
      assert.equal(requests.length, 3);
    } finally {
      await app.close();
      ledger.close();
    }
  });
