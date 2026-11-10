// Explicit refresh only: this script makes paid Birdeye requests. Builds never do.
import { DatabaseSync } from "node:sqlite";
import { homedir } from "node:os";
import { resolve, join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { Ledger } from "../dist/ledger.js";
import { Runner } from "../dist/runner.js";
import { planCase } from "../dist/workflows.js";
import { runCase } from "../dist/analysis.js";

const token = "pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn";
const wallet = "GNRgBxkRFnyLYUTX8DSs3SM3Wm4jYSHQn6JQQVXapoRc";
let key = process.env.BIRDEYE_API_KEY;
if (!key) {
  const db = new DatabaseSync(
    join(
      process.env.BIRDEYE_CONFIG_DIR || join(homedir(), ".config/birdeye"),
      "config.sqlite",
    ),
    { readOnly: true },
  );
  try {
    key = JSON.parse(
      db.prepare("SELECT data FROM configuration WHERE id=1").get()?.data ||
        "{}",
    ).birdeyeApiKey;
  } finally {
    db.close();
  }
}
if (!key)
  throw new Error("Configure a Birdeye API key before capturing a real demo.");
await mkdir(".birdeye/demo-capture", { recursive: true });
const ledger = new Ledger(resolve(".birdeye/demo-capture/usage.sqlite"));
const runner = new Runner(ledger, key, { retries: 0, timeoutMs: 30000 });
const to = Math.floor(Date.now() / 1000);
const jobs = [
  {
    id: "token-research",
    title: "PUMP token",
    address: token,
    inputs: [
      { kind: "project-deep-report", address: token, depth: "full" },
      {
        kind: "skill-token-dd-score",
        address: token,
        ddMode: "advanced",
        topN: 50,
      },
    ],
  },
  {
    id: "skill-wallet-analysis",
    title: "Wallet analysis",
    address: wallet,
    inputs: [
      {
        kind: "skill-wallet-analysis",
        address: wallet,
        intervals: ["24h", "7d", "30d", "90d", "all"],
      },
      { kind: "skill-smart-money-profile", address: wallet },
    ],
  },
];
const captures = [];
for (const job of jobs) {
  const reports = [];
  for (const input of job.inputs) {
    const plan = planCase({ ...input, from: to - 7 * 86400, to });
    console.log(
      `${input.kind}: ${plan.estimatedCu} estimated CU, ${plan.maxRequests} requests`,
    );
    const run = ledger.createRun(plan.estimatedCu, undefined, plan.maxRequests);
    const result = await runCase(runner, run, plan.input);
    if (!result.data.sources?.length)
      throw new Error(
        `No evidence captured for ${input.kind}: ${JSON.stringify(result.data.missing)}`,
      );
    const serialized = JSON.stringify(result);
    if (serialized.includes(key))
      throw new Error("Credential detected in report; refusing export.");
    reports.push({ workflow: input.kind, plan, result });
    await writeFile(
      resolve(".birdeye/demo-capture", `${input.kind}.json`),
      serialized + "\n",
    );
    console.log(
      `${input.kind}: ${result.meta.coverage}, ${result.data.sources?.length ?? 0} sources`,
    );
  }
  captures.push({
    id: job.id,
    title: job.title,
    address: job.address,
    reports,
  });
}
await writeFile(
  "apps/landing/public/demo-snapshots.json",
  JSON.stringify(
    { schemaVersion: 1, capturedAt: new Date().toISOString(), captures },
    null,
    2,
  ) + "\n",
);
console.log("Saved full responses to apps/landing/public/demo-snapshots.json");
