import { execFileSync } from "node:child_process";
import { parseArgs } from "node:util";
import { isPrivatePath } from "./public-files.mjs";

const { values } = parseArgs({
  options: { history: { type: "boolean", default: false } },
});
const git = (args) =>
  execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
try {
  const tracked = git(["ls-files", "-z"]).split("\0").filter(Boolean);
  const privateFiles = tracked.filter(isPrivatePath);
  if (privateFiles.length) {
    throw new Error(
      `${privateFiles.length} private path(s) remain in the Git index. Keep local files but remove them from tracking before publishing.`,
    );
  }
  if (values.history) {
    const commits = git(["rev-list", "--all", "HEAD"])
      .trim()
      .split("\n")
      .filter(Boolean);
    let affected = 0;
    for (const commit of new Set(commits)) {
      const paths = git(["ls-tree", "-r", "--name-only", "-z", commit]).split(
        "\0",
      );
      if (paths.some(isPrivatePath)) affected++;
    }
    if (affected) {
      throw new Error(
        `${affected} reachable commit(s) contain private paths. Do not make this history public. Coordinate a history cleanup or publish a fresh repository from the sanitized source tree; deleting current files alone is insufficient.`,
      );
    }
  }
  console.log(
    `Public-file check passed (${tracked.length} indexed files${values.history ? ", including local ref history" : ""}).`,
  );
} catch (error) {
  console.error(`Public-file check failed: ${error.message}`);
  process.exitCode = 1;
}
