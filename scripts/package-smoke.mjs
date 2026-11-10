import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  existsSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync, spawn } from "node:child_process";
import { isPrivatePath } from "./public-files.mjs";
import { credentialFindings } from "./lib/credential-scan.mjs";

const root = process.cwd();
const address = "So11111111111111111111111111111111111111112";
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const work = mkdtempSync(join(tmpdir(), "birdeye-package-"));
const prefix = join(work, "prefix");
const env = { ...process.env, BIRDEYE_CONFIG_DIR: join(work, "config") };
delete env.BIRDEYE_API_KEY;
delete env.BIRDEYE_AI_API_KEY;
delete env.BIRDEYE_INTERNAL_API_TOKEN;
delete env.NODE_PATH;
let server;
let closed;
let apiServer;
let apiClosed;
const run = (command, args, cwd = work) =>
  execFileSync(command, args, {
    cwd,
    env,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
    timeout: 120_000,
    maxBuffer: 16 * 1024 * 1024,
  });
try {
  mkdirSync(prefix);
  // Build is the npm script's preceding step; pack exactly that output.
  const [archive] = JSON.parse(
    run(
      "npm",
      ["pack", "--ignore-scripts", "--json", "--pack-destination", work],
      root,
    ),
  );
  const files = new Set(archive.files.map((file) => file.path));
  for (const required of [
    "dist/index.js",
    "dist/web/main.js",
    "dist/web/index.html",
    "bin/token-dd-score.mjs",
    "knowledge/birdeye/manifest.json",
    "README.md",
    "README.vi.md",
    "CHANGELOG.md",
    "LICENSE",
    "THIRD_PARTY_NOTICES.md",
    "docs/INSTALLATION.md",
    "docs/USAGE.md",
    "docs/workflows/price-surge.md",
    "docs/workflows/internal-api.md",
    "dist/internal-api/index.js",
    "dist/internal-api/server.js",
    "dist/internal-api/service.js",
    "skills/skill-price-surge/references/internal-api.md",
    "skills/skill-token-dd-score/references/internal-api.md",
    "dist/price-surge/api.js",
    "skills/skill-price-surge/SKILL.md",
    "skills/skill-price-surge/references/details.md",
  ]) {
    assert.ok(files.has(required), `Missing package asset: ${required}`);
  }
  for (const path of files) {
    assert.ok(
      !isPrivatePath(path),
      `Private file must not be packaged: ${path}`,
    );
    assert.ok(
      !/(^|\/)(\.env(?:\..*)?|\.DS_Store|internaldocs|node_modules|\.git)(\/|$)|\.(swp|sqlite(?:-wal|-shm)?|pem|key)$/.test(
        path,
      ),
      `Unexpected package file: ${path}`,
    );
  }
  run("npm", [
    "install",
    "--global",
    "--prefix",
    prefix,
    "--omit=dev",
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
    join(work, archive.filename),
  ]);
  const cli = join(prefix, "bin", "birdeye-cli");
  const score = join(prefix, "bin", "token-dd-score");
  const api = join(prefix, "bin", "birdeye-api");
  assert.ok(
    existsSync(cli) && existsSync(score) && existsSync(api),
    "npm must create all three executable links",
  );
  for (const path of files) {
    const contents = readFileSync(
      join(prefix, "lib/node_modules", pkg.name, path),
      "utf8",
    );
    const findings = credentialFindings(contents);
    assert.equal(
      findings.length,
      0,
      `Credential-shaped literal in packaged file: ${path}`,
    );
  }
  assert.equal(run(cli, ["--version"]).trim(), pkg.version);
  assert.match(run(cli, ["--help"]), /Usage: birdeye-cli/);
  assert.match(run(score, ["--help"]), /Usage: token-dd-score/);
  assert.equal(run(api, ["--version"]).trim(), pkg.version);
  assert.match(run(api, ["--help"]), /POST \/token-dd/);
  assert.match(run(api, ["--help"]), /X-API-KEY/);
  assert.equal(
    JSON.parse(run(cli, ["config", "show", "--short"])).birdeyeConfigured,
    false,
  );
  const estimate = JSON.parse(
    run(cli, ["token", "price", address, "--estimate-cu"]),
  );
  assert.equal(estimate.estimatedCu, 3);
  assert.equal(
    JSON.parse(run(cli, ["price-surge", "--estimate-cu"])).estimatedCu,
    50,
  );
  assert.equal(
    JSON.parse(
      run(cli, [
        "price-surge",
        "--chain",
        "base",
        "--mode",
        "advanced",
        "--with-security",
        "--top",
        "3",
        "--estimate-cu",
      ]),
    ).estimatedCu,
    230,
  );
  assert.match(run(cli, ["knowledge", "search", "token", "--short"]), /source/);
  assert.ok(
    JSON.parse(run(score, [address, "--estimate-cu", "--format", "json"])),
  );
  for (const id of [
    "skill-launchpad-trending",
    "skill-token-security",
    "skill-token-stats",
    "skill-top-holder-analysis",
    "skill-top-trader-analysis",
    "skill-lp-analysis",
    "skill-smart-money-holders",
    "skill-kol-signal",
  ]) {
    for (const path of [
      `skills/${id}/SKILL.md`,
      `skills/${id}/references/details.md`,
      `skills/${id}/skill.json`,
    ])
      assert.ok(files.has(path), `Missing data-skill asset: ${path}`);
    const plan = JSON.parse(
      run(cli, [
        "case",
        id,
        ...(id === "skill-launchpad-trending" ? [] : ["--address", address]),
        "--estimate-cu",
      ]),
    );
    assert.ok(
      plan.estimatedCu > 0 && plan.steps.length > 0,
      `${id} must plan from the installed package without a key`,
    );
  }

  server = spawn(cli, ["--format", "interface", "--bind", "127.0.0.1:0"], {
    cwd: work,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  closed = new Promise((resolve) => server.once("close", resolve));
  const [url, code] = await new Promise((resolveUrl, reject) => {
    let output = "";
    const timer = setTimeout(
      () => reject(new Error("Installed UI did not start within 15s")),
      15_000,
    );
    server.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    server.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Installed UI exited (${code})`));
    });
    server.stderr.on("data", () => {}); // Consume warnings without logging connection credentials.
    server.stdout.on("data", (chunk) => {
      output += chunk;
      const match = output.match(
        /Birdeye interface: (http:\/\/127\.0\.0\.1:\d+)\/#code=([\w-]+)/,
      );
      if (match) {
        clearTimeout(timer);
        resolveUrl([match[1], match[2]]);
      }
    });
  });
  const get = (path) =>
    fetch(`${url}${path}`, { signal: AbortSignal.timeout(5000) });
  const page = await get("/");
  assert.equal(page.status, 200);
  assert.match(await page.text(), /main\.js/);
  const asset = await get("/main.js");
  assert.equal(asset.status, 200);
  assert.ok(
    (await asset.text()).length > 1000,
    "Built web bundle must be present",
  );
  assert.equal((await get("/api/status")).status, 401);
  const login = await fetch(`${url}/api/connect`, {
    method: "POST",
    signal: AbortSignal.timeout(5000),
    headers: {
      "Content-Type": "application/json",
      Origin: url,
      "Sec-Fetch-Site": "same-origin",
    },
    body: JSON.stringify({ code }),
  });
  assert.equal(login.status, 200);
  const status = await fetch(`${url}/api/status`, {
    signal: AbortSignal.timeout(5000),
    headers: { Cookie: login.headers.get("set-cookie").split(";")[0] },
  });
  assert.equal(status.status, 200);
  assert.equal((await get("/price-surge")).status, 404);

  apiServer = spawn(api, ["--port", "0", "--max-cu", "320"], {
    // A server environment key must never become a fallback for HTTP callers.
    cwd: work,
    env: { ...env, BIRDEYE_API_KEY: "server-key-must-not-be-used" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  apiClosed = new Promise((resolve) => apiServer.once("close", resolve));
  const apiUrl = await new Promise((resolveUrl, reject) => {
    let output = "";
    const timer = setTimeout(
      () => reject(new Error("Installed API did not start within 15s")),
      15_000,
    );
    apiServer.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    apiServer.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Installed API exited (${code})`));
    });
    apiServer.stderr.on("data", () => {});
    apiServer.stdout.on("data", (chunk) => {
      output += chunk;
      const match = output.match(
        /Birdeye internal API: (http:\/\/127\.0\.0\.1:\d+)/,
      );
      if (match) {
        clearTimeout(timer);
        resolveUrl(match[1]);
      }
    });
  });
  assert.equal((await fetch(`${apiUrl}/health`)).status, 200);
  const apiHeaders = { "Content-Type": "application/json" };
  const missingKey = await fetch(`${apiUrl}/price-surge`, {
    method: "POST",
    headers: apiHeaders,
    body: '{"max_cu":0}',
  });
  assert.equal(missingKey.status, 401);
  const withKey = await fetch(`${apiUrl}/price-surge`, {
    method: "POST",
    headers: { ...apiHeaders, "X-API-KEY": "package-client-key" },
    body: '{"max_cu":0}',
  });
  assert.equal(withKey.status, 200);
  const capped = await withKey.json();
  assert.equal(capped.meta.cu.attempts, 0); // Credential path tested without a paid request.
  for (const [path, body, cu] of [
    [
      "/price-surge",
      { chain: "base", mode: "advanced", top: 3, with_security: true },
      230,
    ],
    ["/token-dd", { address, mode: "standard" }, 51],
    ["/token-dd", { address }, 181],
  ]) {
    const response = await fetch(`${apiUrl}${path}`, {
      method: "POST",
      headers: apiHeaders,
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({ ...body, estimate_cu: true }),
    });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).estimatedCu, cu);
  }
  assert.equal(
    (await fetch(`${apiUrl}/api/status`, { headers: apiHeaders })).status,
    404,
  );
  assert.equal(
    (await get("/")).status,
    200,
    "UI remains independent while research API is running",
  );
  console.log(
    `Package smoke passed: ${archive.filename}, ${files.size} files, ${archive.size} bytes; installed CLI, offline data, HTTP UI and independent research API verified.`,
  );
} finally {
  for (const [child, done] of [
    [apiServer, apiClosed],
    [server, closed],
  ]) {
    if (child && child.exitCode === null && child.signalCode === null) {
      child.kill("SIGTERM");
      const force = setTimeout(() => child.kill("SIGKILL"), 5000);
      await done;
      clearTimeout(force);
    }
  }
  rmSync(work, { recursive: true, force: true });
}
