import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { redactCredentialExamples } from "./lib/credential-scan.mjs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { isPrivatePath } from "./public-files.mjs";
const project = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const root = resolve(process.argv[2] || join(project, "../bds-docs-mintlify"));
const target = join(project, "knowledge/birdeye");
const hash = (s) => createHash("sha256").update(s).digest("hex");
// Only pages in the site navigation are public; hidden, draft and copied pages stay out of the snapshot.
const navigation = new Set();
(function walk(value) {
  if (Array.isArray(value)) value.forEach(walk);
  else if (value && typeof value === "object")
    for (const [key, child] of Object.entries(value)) {
      if (key === "pages" && Array.isArray(child))
        child.forEach((page) =>
          typeof page === "string" ? navigation.add(page) : walk(page),
        );
      else walk(child);
    }
})(JSON.parse(readFileSync(join(root, "docs.json"), "utf8")).navigation);
const files = execFileSync("git", ["-C", root, "ls-files", "-z"], {
  encoding: "utf8",
})
  .split("\0")
  .filter(
    (p) =>
      p &&
      /\.mdx?$/.test(p) &&
      navigation.has(p.replace(/\.mdx?$/, "")) &&
      !p.startsWith(".") &&
      !p.split("/").includes("node_modules") &&
      !isPrivatePath(p),
  );
const specs = new Map(
  [
    "data/openapi_docs.json",
    "blockchain/openapi_blockchain_docs.json",
    "perps/openapi_perps_docs.json",
  ].map((p) => [
    "openapi/" + p,
    JSON.parse(readFileSync(join(root, "openapi", p), "utf8")),
  ]),
);
function resolveRefs(value, spec, seen = new Set()) {
  if (Array.isArray(value)) return value.map((v) => resolveRefs(v, spec, seen));
  if (!value || typeof value !== "object") return value;
  if (value.$ref?.startsWith("#/")) {
    if (seen.has(value.$ref)) return value;
    const resolved = value.$ref
      .slice(2)
      .split("/")
      .reduce(
        (o, k) => o?.[k.replaceAll("~1", "/").replaceAll("~0", "~")],
        spec,
      );
    if (!resolved) throw new Error("Unresolved reference: " + value.$ref);
    const next = new Set(seen);
    next.add(value.$ref);
    return resolveRefs(
      {
        ...resolved,
        ...Object.fromEntries(
          Object.entries(value).filter(([k]) => k !== "$ref"),
        ),
      },
      spec,
      next,
    );
  }
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [k, resolveRefs(v, spec, seen)]),
  );
}
const entries = [];
let operationPages = 0;
function add(id, body, source, sourceHash) {
  body = redactCredentialExamples(body);
  const title = (
    body.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1] ||
    body.match(/^# (.+)$/m)?.[1] ||
    id.split("/").at(-1)
  ).replace(/["']$/, "");
  const output = join(target, id);
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, body);
  entries.push({
    id,
    title,
    source,
    sha256: hash(body),
    sourceSha256: sourceHash,
  });
}
for (const path of files) {
  const original = readFileSync(join(root, path), "utf8");
  let body = original;
  const api = body.match(
    /^openapi:\s*["']?([^\s"']+)\s+(GET|POST|PUT|DELETE|PATCH)\s+([^\s"']+)/m,
  );
  if (api) {
    const spec = specs.get(api[1]);
    if (!spec) throw new Error("Spec not allowlisted: " + api[1]);
    const item = spec.paths[api[3]],
      operation = item?.[api[2].toLowerCase()];
    if (!operation) throw new Error("Missing operation: " + api[0]);
    body +=
      "\n\n## Resolved API contract\n\n" +
      api[2] +
      " " +
      api[3] +
      "\n\n```json\n" +
      JSON.stringify(
        resolveRefs(
          {
            ...operation,
            parameters: [
              ...(item.parameters || []),
              ...(operation.parameters || []),
            ],
            security: operation.security ?? spec.security,
            servers: operation.servers ?? spec.servers,
          },
          spec,
        ),
        null,
        2,
      ) +
      "\n```\n";
    operationPages++;
  }
  add(
    "docs/" + path.replace(/\.mdx?$/, ".md"),
    body,
    "https://docs.birdeye.so/" + path.replace(/\.mdx?$/, ""),
    hash(original),
  );
}
const manifest = {
  schemaVersion: 1,
  sourceCommit: execFileSync("git", ["-C", root, "rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim(),
  generatedAt: new Date().toISOString(),
  documentationPages: files.length,
  operationPages,
  specs: [...specs.keys()].map((path) => ({
    path,
    sha256: hash(readFileSync(join(root, path), "utf8")),
  })),
  entries,
};
writeFileSync(
  join(target, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
await import("./sync-cli-knowledge.mjs");
console.log(
  `Provider snapshot: ${files.length} documentation pages, ${operationPages} resolved API pages.`,
);
