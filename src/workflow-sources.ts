import { readFileSync, lstatSync, readdirSync } from "node:fs";
import { resolve, join, basename, extname } from "node:path";
import { createHash } from "node:crypto";
import { AppError } from "./shared.js";

export type WorkflowSource = {
  name: string;
  origin: string;
  content: string;
  sha256: string;
};
const MAX_BYTES = 256_000,
  MAX_FILES = 40,
  MAX_TOTAL = 2_000_000;
class SourceHttpError extends AppError {
  constructor(
    public status: number,
    public host: string,
    remaining: string | null,
    retryAfter: string | null,
  ) {
    const reason =
      remaining === "0"
        ? "GitHub API rate limit exhausted."
        : "Check repository/ref/path and network access.";
    super(
      "IMPORT_FETCH_FAILED",
      `${host} returned HTTP ${status}. ${reason} ${retryAfter ? `Retry after ${retryAfter} seconds. ` : ""}You can import local files or upload/paste Markdown instead.`,
      false,
      { host, status },
    );
  }
}
export function sourceDocument(
  name: string,
  origin: string,
  content: string,
): WorkflowSource {
  if (!content.trim() || Buffer.byteLength(content) > MAX_BYTES)
    throw new AppError(
      "IMPORT_SIZE",
      "Each workflow must contain 1–256,000 bytes.",
    );
  return {
    name: name.slice(0, 200),
    origin,
    content,
    sha256: createHash("sha256").update(content).digest("hex"),
  };
}
function bounded(documents: WorkflowSource[]) {
  if (!documents.length)
    throw new AppError(
      "IMPORT_EMPTY",
      "No workflow Markdown, SKILL.md or .workflow.json files were found. Choose a specific file or workflow folder.",
    );
  if (
    documents.length > MAX_FILES ||
    documents.reduce((n, d) => n + Buffer.byteLength(d.content), 0) > MAX_TOTAL
  )
    throw new AppError(
      "IMPORT_SIZE",
      "Choose a smaller source: at most 40 files and 2 MB per import.",
    );
  return documents;
}
const candidate = (name: string) =>
  /^(?:workflow[-_].*\.md|.*-workflow\.md|SKILL\.md)$/.test(basename(name)) ||
  name.endsWith(".workflow.json");
async function remote(url: string, fetcher: typeof fetch) {
  let response: Response;
  try {
    response = await fetcher(url, {
      redirect: "error",
      signal: AbortSignal.timeout(15_000),
      headers: {
        Accept: "application/json, text/plain",
        "User-Agent": "birdeye-cli-workflow-import",
      },
    });
  } catch {
    throw new AppError(
      "IMPORT_FETCH_FAILED",
      "Could not fetch the GitHub source. Check network access or upload/paste the Markdown or JSON file instead.",
    );
  }
  if (!response.ok) {
    await response.body?.cancel();
    throw new SourceHttpError(
      response.status,
      new URL(url).hostname,
      response.headers.get("x-ratelimit-remaining"),
      response.headers.get("retry-after"),
    );
  }
  const reader = response.body?.getReader();
  if (!reader) throw new AppError("IMPORT_EMPTY", "Source has no content.");
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_TOTAL)
        throw new AppError("IMPORT_SIZE", "Remote response exceeds 2 MB.");
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  return Buffer.concat(chunks).toString("utf8");
}
/** Fetch only public GitHub content. No shell, archives, arbitrary URLs or source instructions execute. */
export async function githubDocuments(
  source: string,
  fetcher: typeof fetch = fetch,
  refOverride?: string,
): Promise<WorkflowSource[]> {
  const url = new URL(source);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.port ||
    url.search ||
    url.hash ||
    !["github.com", "raw.githubusercontent.com"].includes(url.hostname)
  )
    throw new AppError(
      "IMPORT_SOURCE",
      "Use a public HTTPS GitHub repository/file URL; upload or paste other sources.",
    );
  const parts = url.pathname.split("/").filter(Boolean).map(decodeURIComponent);
  if (
    parts.some((p) => !p || p === "." || p === ".." || /[\\\x00-\x1f]/.test(p))
  )
    throw new AppError("IMPORT_SOURCE", "Invalid GitHub source path.");
  const [owner, repoPart, kind, branch, ...rest] = parts,
    repo = repoPart?.replace(/\.git$/, "");
  if (!owner || !repo || !/^[\w.-]+$/.test(owner + repo))
    throw new AppError(
      "IMPORT_SOURCE",
      "Provide a GitHub owner/repository URL.",
    );
  const raw = async (ref: string, path: string) => {
    if (!/\.(?:mdx?|json)$/i.test(path))
      throw new AppError(
        "IMPORT_SOURCE",
        "Choose a Markdown or workflow JSON file.",
      );
    return sourceDocument(
      basename(path),
      `https://github.com/${owner}/${repo}/blob/${encodeURIComponent(ref)}/${path}`,
      await remote(
        `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(ref)}/${path.split("/").map(encodeURIComponent).join("/")}`,
        fetcher,
      ),
    );
  };
  if (url.hostname === "raw.githubusercontent.com") {
    if (!kind || !branch)
      throw new AppError(
        "IMPORT_SOURCE",
        "Provide a raw Markdown or JSON file URL.",
      );
    return bounded([await raw(kind, [branch, ...rest].join("/"))]);
  }
  if (kind === "blob")
    return bounded([await raw(refOverride || branch, rest.join("/"))]);
  if (kind && kind !== "tree")
    throw new AppError("IMPORT_SOURCE", "Use a repository, tree, or blob URL.");
  const api = `https://api.github.com/repos/${owner}/${repo}`;
  const prefix = rest.join("/");
  let ref = refOverride || branch;
  ref ||= JSON.parse(await remote(api, fetcher)).default_branch;
  if (typeof ref !== "string" || !ref)
    throw new AppError(
      "IMPORT_SOURCE",
      "Could not determine repository branch. Pass --ref.",
    );
  const tree = JSON.parse(
    await remote(
      `${api}/git/trees/${encodeURIComponent(ref)}?recursive=1`,
      fetcher,
    ),
  );
  if (tree.truncated)
    throw new AppError(
      "IMPORT_SIZE",
      "Repository tree is truncated; import individual files instead.",
    );
  const files = (tree.tree || []).filter(
    (e: { type: string; path: string; mode: string }) =>
      e.type === "blob" &&
      e.mode !== "120000" &&
      (!prefix || e.path.startsWith(prefix + "/")) &&
      candidate(e.path),
  );
  if (files.length > MAX_FILES)
    throw new AppError(
      "IMPORT_SIZE",
      "More than 40 workflow files found. Choose a narrower tree URL.",
    );
  const docs: WorkflowSource[] = [];
  for (const file of files) {
    docs.push(await raw(ref, file.path));
    bounded(docs);
  }
  return bounded(docs);
}
export async function loadWorkflowSources(
  source: string,
  options: { fetch?: typeof fetch; ref?: string } = {},
) {
  if (/^https?:\/\//.test(source))
    return githubDocuments(source, options.fetch, options.ref);
  const root = resolve(source),
    docs: WorkflowSource[] = [];
  function visit(path: string, depth: number) {
    const stat = lstatSync(path);
    if (stat.isSymbolicLink())
      throw new AppError(
        "IMPORT_SOURCE",
        "Workflow imports do not follow symbolic links.",
      );
    if (stat.isDirectory()) {
      if (depth > 8)
        throw new AppError(
          "IMPORT_SIZE",
          "Choose a shallower workflow directory.",
        );
      for (const entry of readdirSync(path, { withFileTypes: true })) {
        if (
          entry.name.startsWith(".") ||
          ["node_modules", "dist", "artifacts", "knowledge"].includes(
            entry.name,
          ) ||
          entry.isSymbolicLink()
        )
          continue;
        if (entry.isDirectory() || candidate(entry.name))
          visit(join(path, entry.name), depth + 1);
      }
    } else {
      if (![".md", ".mdx", ".json"].includes(extname(path)))
        throw new AppError(
          "IMPORT_SOURCE",
          "Import Markdown or workflow JSON only.",
        );
      if (stat.size > MAX_BYTES)
        throw new AppError(
          "IMPORT_SIZE",
          "Workflow file exceeds 256,000 bytes.",
        );
      docs.push(
        sourceDocument(basename(path), path, readFileSync(path, "utf8")),
      );
      bounded(docs);
    }
  }
  visit(root, 0);
  return bounded(docs);
}
