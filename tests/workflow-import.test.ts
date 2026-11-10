import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { Ledger } from "../src/ledger.js";
import { Runner } from "../src/runner.js";
import { RunStore } from "../src/run-store.js";
import {
  WorkflowImports,
  migrateWorkflow,
  planImported,
  runImported,
} from "../src/workflow-import.js";
import {
  sourceDocument,
  loadWorkflowSources,
  githubDocuments,
} from "../src/workflow-sources.js";
import { startInterface } from "../src/interface/server.js";
import { inProcessFetch } from "./http-helper.js";
const token = "So11111111111111111111111111111111111111112",
  other = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const manifest = {
  version: 1,
  title: "Token evidence",
  purpose: "Inspect token identity and security",
  steps: [
    {
      id: "overview",
      operation: "token.overview",
      params: { address: "{{address}}" },
    },
    {
      id: "security",
      operation: "token.security",
      params: { address: "{{address}}" },
    },
  ],
};
const source = (value: unknown) =>
  sourceDocument(
    "evidence.workflow.json",
    "fixture:json",
    JSON.stringify(value),
  );
test("custom manifests plan offline, validate all steps, and reject code, unsupported chains and dependency cycles", () => {
  const record = migrateWorkflow(source(manifest));
  assert.equal(planImported(record, {}, true).estimatedCu, 48);
  assert.equal(planImported(record, {}, true).needsAddress, true);
  assert.throws(() => planImported(record), /Provide a Solana/);
  for (const bad of [
    { ...manifest, chain: "base" },
    { ...manifest, script: "rm -rf /" },
    { ...manifest, steps: [{ id: "x", operation: "__proto__" }] },
    {
      ...manifest,
      steps: [
        {
          id: "x",
          operation: "token.price",
          params: { address: "{{process.env.KEY}}" },
        },
      ],
    },
    {
      ...manifest,
      steps: [
        {
          id: "x",
          operation: "token.price",
          subjects: { from: ["x"], kind: "token", take: 2 },
        },
      ],
    },
  ])
    assert.throws(() => migrateWorkflow(source(bad)));
  assert.throws(
    () =>
      planImported(record, { address: token, stepOverrides: { missing: {} } }),
    /Unknown step/,
  );
  assert.throws(() =>
    planImported(record, { address: token, from: 20, to: 10 }),
  );
});
test("Markdown without a reviewed adapter is review-only", () => {
  for (const name of ["workflow-token-research.md", "SKILL.md"]) {
    const record = migrateWorkflow(
      sourceDocument(name, `fixture:${name}`, "# Custom\nResearch steps"),
    );
    assert.equal(record.adapter, "markdown");
    assert.equal(record.definition, null);
    assert.deepEqual(record.mapping, []);
    assert.throws(() => planImported(record), /reviewed workflow JSON/);
  }
});
test("imported definitions survive SQLite restart, deduplicate source content and expose exact endpoint docs", () => {
  const dir = mkdtempSync(join(tmpdir(), "birdeye-import-"));
  let ledger = new Ledger(join(dir, "usage.sqlite"));
  try {
    let store = new WorkflowImports(ledger);
    const [record] = store.import([source(manifest)]);
    assert.equal(store.import([source(manifest)])[0].id, record.id);
    assert.equal(store.list().length, 1);
    assert.throws(() =>
      store.import([
        source({ ...manifest, title: "new" }),
        source({ ...manifest, chain: "base" }),
      ]),
    );
    assert.equal(store.list().length, 1);
    ledger.close();
    ledger = new Ledger(join(dir, "usage.sqlite"));
    store = new WorkflowImports(ledger);
    const preview = store.preview(record.id, { address: token });
    assert.equal(preview.plan!.needsAddress, false);
    assert.equal(preview.plan!.steps[0].path, "/defi/token_overview");
    assert.match(
      preview.plan!.steps[0].docs,
      /data\.birdeye\.so\/docs\/data-api\/stats\/get-defi-token-overview$/,
    );
    assert.equal(ledger.summary().attempts, 0);
  } finally {
    ledger.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
test("preview distinguishes editable fixed addresses from shared bindings and reflects effective overrides", () => {
  const ledger = new Ledger(":memory:");
  try {
    const store = new WorkflowImports(ledger);
    const [fixed] = store.import([
      source({
        ...manifest,
        steps: [
          {
            id: "overview",
            operation: "token.overview",
            params: { address: token },
          },
        ],
      }),
    ]);
    const preview = store.preview(fixed.id, { address: other }).plan!;
    assert.equal(preview.usesAddressInput, false);
    assert.equal(preview.steps[0].subjectParameters.address, token);
    assert.ok(!preview.steps[0].lockedParams.includes("address"));
    assert.equal(
      store.preview(fixed.id, {
        stepOverrides: { overview: { address: other } },
      }).plan!.steps[0].params.address,
      other,
    );
    const [bound] = store.import([source(manifest)]);
    const missing = store.preview(bound.id).plan!;
    assert.equal(missing.usesAddressInput, true);
    assert.equal(missing.needsAddress, true);
    assert.ok(missing.steps[0].lockedParams.includes("address"));
    assert.equal(
      missing.steps[0].subjectParameters.address,
      "Provide workflow address",
    );
    const overridden = store.preview(bound.id, {
      stepOverrides: {
        overview: { address: token },
        security: { address: other },
      },
    }).plan!;
    assert.equal(overridden.usesAddressInput, false);
    assert.equal(overridden.needsAddress, false);
    assert.equal(overridden.steps[1].subjectParameters.address, other);
  } finally {
    ledger.close();
  }
});
test("editing a stored recipe parameter preserves its other step defaults", () => {
  for (const [kind, stepOverrides] of [
    ["early-project-screening", { candidates: { graduated: false } }],
    [
      "market-opportunities",
      { trending: { sort_by: "volumeUSD", sort_type: "desc" } },
    ],
  ] as const) {
    // Records imported by earlier versions keep their recipe in SQLite.
    const record = {
      ...migrateWorkflow(sourceDocument("stored.md", "fixture", "# Stored")),
      definition: { recipe: { kind, depth: "full", limit: 3, stepOverrides } },
    };
    const id = kind === "early-project-screening" ? "candidates" : "trending";
    const step = planImported(record, {
      stepOverrides: { [id]: { limit: 10 } },
    }).steps.find((s) => s.id === id)!;
    assert.equal(step.params.limit, 10);
    if (id === "candidates") assert.equal(step.params.graduated, false);
    else {
      assert.equal(step.params.sort_by, "volumeUSD");
      assert.equal(step.params.sort_type, "desc");
    }
  }
});
test("Birdeye Data Skills workflow documents use the reviewed native recipes", async () => {
  const sources = await loadWorkflowSources(
    resolve("tests/fixtures/birdeye-data-skills"),
  );
  assert.equal(sources.length, 6);
  for (const doc of sources) {
    const record = migrateWorkflow(doc);
    assert.equal(record.adapter, "birdeye-data-skills");
    assert.ok(planImported(record, {}, true).steps.length > 0);
  }
});
test("custom workflow execution uses bounded deduplicated dependencies, accounting and partial evidence on budget failure", async () => {
  const ledger = new Ledger(":memory:");
  let calls = 0;
  try {
    const record = migrateWorkflow(
      source({
        ...manifest,
        steps: [
          {
            id: "trending",
            operation: "market.trending",
            params: { limit: 3 },
          },
          {
            id: "overview",
            operation: "token.overview",
            subjects: { from: ["trending"], kind: "token", take: 2 },
          },
        ],
      }),
    );
    const runner = new Runner(ledger, "fixture", {
      retries: 0,
      fetch: async (url) => {
        calls++;
        return Response.json({
          success: true,
          data:
            new URL(String(url)).pathname === "/defi/token_trending"
              ? {
                  tokens: [
                    { address: token },
                    { address: token },
                    { address: other },
                  ],
                }
              : {
                  address: new URL(String(url)).searchParams.get("address"),
                  price: 1,
                },
        });
      },
    });
    const result = await runImported(runner, ledger.createRun(61), record);
    assert.equal(calls, 3);
    assert.equal(result.data.sources.length, 3);
    assert.equal(result.meta.cu.estimated, 61);
    const partial = await runImported(runner, ledger.createRun(25), record);
    assert.equal(calls, 4);
    assert.equal(partial.meta.coverage, "partial");
    assert.equal(partial.data.sources.length, 1);
    assert.equal(partial.data.missing.length, 2);
  } finally {
    ledger.close();
  }
});
test("local imports scan workflow files only and CLI import/plan never spends CU", async () => {
  const dir = mkdtempSync(join(tmpdir(), "birdeye-import-local-"));
  try {
    const folder = join(dir, "sources");
    mkdirSync(folder);
    writeFileSync(join(folder, "a.workflow.json"), JSON.stringify(manifest));
    writeFileSync(join(folder, "secret.pem"), "not a document");
    const docs = await loadWorkflowSources(folder);
    assert.equal(docs.length, 1);
    const cli = spawnSync(
      process.execPath,
      [
        resolve(".test-dist/src/index.js"),
        "workflow",
        "import",
        folder,
        "--config-dir",
        join(dir, "config"),
      ],
      { encoding: "utf8" },
    );
    assert.equal(cli.status, 0, cli.stderr);
    const [record] = JSON.parse(cli.stdout);
    assert.equal(record.plan.estimatedCu, 48);
    const ledger = new Ledger(join(dir, "config/usage.sqlite"));
    assert.equal(ledger.summary().attempts, 0);
    ledger.close();
    await assert.rejects(
      loadWorkflowSources(join(folder, "secret.pem")),
      /Markdown or workflow JSON/,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
test("GitHub source loading is bounded, follows no redirects and never fetches arbitrary hosts", async () => {
  const calls: string[] = [];
  const fetcher: typeof fetch = async (url, init) => {
    calls.push(String(url));
    assert.equal(init?.redirect, "error");
    if (String(url).includes("git/trees"))
      return Response.json({
        tree: [
          {
            type: "blob",
            mode: "100644",
            path: "docs/workflow-token-research.md",
          },
          { type: "blob", mode: "100644", path: "script.sh" },
        ],
      });
    return new Response("# Token research\nResearch steps");
  };
  const docs = await githubDocuments(
    "https://github.com/o/r/tree/main/docs",
    fetcher,
  );
  assert.equal(docs.length, 1);
  assert.equal(calls.length, 2);
  await assert.rejects(githubDocuments("http://localhost/private", fetcher));
  await assert.rejects(githubDocuments("https://evil.test/file.md", fetcher));
  assert.equal(calls.length, 2);
  await assert.rejects(
    githubDocuments("https://github.com/o/r/blob/main/main.js", fetcher),
    /Markdown or workflow JSON/,
  );
  await assert.rejects(
    githubDocuments(
      "https://github.com/o/r/blob/main/workflow.md",
      async () => {
        throw new TypeError("fetch failed");
      },
    ),
    /network|upload|paste/i,
  );
});
test("GitHub discovery errors are reported, not replaced with other files", async () => {
  for (const status of [403, 429, 404]) {
    const calls: string[] = [];
    await assert.rejects(
      githubDocuments("https://github.com/o/r/tree/main/docs", async (url) => {
        calls.push(String(url));
        return new Response(null, { status });
      }),
      new RegExp(`api\\.github\\.com.*${status}`),
    );
    assert.equal(calls.length, 1);
  }
});
test("HTTP import, preview and execution persist to History without requiring an AI provider", async () => {
  const ledger = new Ledger(":memory:");
  let calls = 0;
  const app = await startInterface({
    ledger,
    config: {
      birdeyeApiKey: "fixture",
      ai: { defaultProfile: "research", profiles: {} },
    },
    listen: false,
    importFetch: async () => new Response("# Workflow\nResearch steps"),
    runnerFactory: () =>
      new Runner(ledger, "fixture", {
        fetch: async () => {
          calls++;
          return Response.json({
            success: true,
            data: { address: token, price: 1, freezeable: false },
          });
        },
      }),
  });
  try {
    const fetch = inProcessFetch(app.handler, app.url),
      login = await fetch(app.url + "/api/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: app.url,
          "Sec-Fetch-Site": "same-origin",
        },
        body: JSON.stringify({ code: app.connectCode }),
      });
    const headers = {
      "Content-Type": "application/json",
      Cookie: login.headers.get("set-cookie")!.split(";")[0],
    };
    const request = (path: string, input?: unknown) =>
      fetch(app.url + path, {
        headers,
        ...(input === undefined
          ? {}
          : { method: "POST", body: JSON.stringify(input) }),
      });
    const fromUrl = await request("/api/workflow-imports", {
      url: "https://github.com/o/r/blob/main/workflow.md",
    });
    assert.equal(fromUrl.status, 200);
    assert.equal((await fromUrl.json()).items.length, 1);
    assert.equal(ledger.summary().attempts, 0);
    const imported = await (
        await request("/api/workflow-imports", {
          name: "custom.workflow.json",
          content: JSON.stringify(manifest),
        })
      ).json(),
      id = imported.items[0].id;
    const preview = await (
      await request(`/api/workflow-imports/${id}/plan`, { address: token })
    ).json();
    assert.equal(preview.plan.estimatedCu, 48);
    assert.equal(calls, 0);
    const started = await (
      await request("/api/runs", {
        mode: "imported",
        importId: id,
        importParams: { address: token },
        maxCu: 48,
      })
    ).json();
    await request(`/api/runs/${started.id}/events`);
    const saved = new RunStore(ledger).get(started.id);
    assert.equal(calls, 2);
    assert.equal(saved.input.mode, "imported");
    assert.equal(saved.result!.data.importedWorkflow.id, id);
    assert.equal(saved.cu.estimated, 48);
  } finally {
    await app.close();
    ledger.close();
  }
});
