import { createSkillServer } from "./server.js";
import { readCatalog } from "./catalog.js";
import { openSkillStats } from "./store.js";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    port: { type: "string" },
    "demo-host": { type: "string" },
    help: { type: "boolean", short: "h" },
  },
});
if (values.help) {
  console.log(
    "Usage: node dist/index.js [--port <port>] [--demo-host <HTTP(S) origin>]\n\n--port overrides SKILL_API_PORT (default: 3003; range: 1–65535).\n--demo-host overrides SKILL_DEMO_HOST for demo_url in list/view/download.\nWithout either demo-host setting, demo_url uses the local HTTP listener origin.",
  );
  process.exit(0);
}
const host = process.env.SKILL_API_HOST || "127.0.0.1";
const port = Number(values.port ?? (process.env.SKILL_API_PORT || 3003));
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error(
    "--port / SKILL_API_PORT must be an integer from 1 to 65535.",
  );
const server = createSkillServer({ demoHost: values["demo-host"] });
await readCatalog();
openSkillStats().close();
server.listen(port, host, () =>
  console.log(`Skills API listening on http://${host}:${port}/agent`),
);
for (const signal of ["SIGINT", "SIGTERM"] as const)
  process.once(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => {
      server.closeAllConnections();
      process.exit(1);
    }, 10000).unref();
  });
