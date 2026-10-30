#!/usr/bin/env node
import {readFileSync} from "node:fs";
import {join} from "node:path";
import {Command} from "commander";
import {configDir} from "../config.js";
import {Ledger} from "../ledger.js";
import {errorData, integer} from "../shared.js";
import {ResearchService} from "./service.js";
import {startInternalApi} from "./server.js";

const pkg = JSON.parse(readFileSync(new URL("../../package.json", import.meta.url), "utf8"));
const program = new Command().name("birdeye-api").version(pkg.version)
  .description("Independent Birdeye research API: POST /price-surge and POST /token-dd")
  .option("--host <host>", "Listener hostname or IP", "127.0.0.1")
  .option("--port <port>", "Listener port (0 selects a free port)", "8788")
  .option("--config-dir <path>", "CU/history database directory (server credentials are not loaded)")
  .option("--max-cu <cu>", "Server ceiling for each live request; callers can lower it")
  .addHelpText("after", "\nClients supply their own Birdeye key in X-API-KEY on each live request.\nThe wrapper never loads a server Birdeye key or requires a separate internal API token.\nEstimates work without a key. This process does not start the CLI web interface.\n");

program.action(async options => {
  const port = integer(options.port, "port", 0, 65535);
  const maxCu = options.maxCu === undefined ? undefined : integer(options.maxCu, "max-cu", 0, Number.MAX_SAFE_INTEGER);
  const dir = options.configDir ?? configDir();
  const ledger = new Ledger(join(dir, "usage.sqlite"));
  try {
    const service = new ResearchService({ledger, maxCu});
    const app = await startInternalApi({service, host: options.host, port});
    process.stdout.write(`Birdeye internal API: ${app.url}\nPOST /price-surge · POST /token-dd · GET /health\n`);
    let stopping = false;
    const stop = async () => {
      if (stopping) return;
      stopping = true;
      try { await app.close(); }
      catch (error) { process.stderr.write(JSON.stringify({error: errorData(error)}) + "\n"); process.exitCode = 1; }
      finally { ledger.close(); }
    };
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  } catch (error) { ledger.close(); throw error; }
});

program.parseAsync().catch(error => {
  process.stderr.write(JSON.stringify({error: errorData(error)}) + "\n");
  process.exitCode = 1;
});
