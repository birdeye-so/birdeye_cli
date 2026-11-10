import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
  readFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { isPrivatePath } from "../scripts/public-files.mjs";

test("public content policy rejects internal source and generated copies", () => {
  for (const path of [
    "internaldocs/reference.pdf",
    "docs/research/notes.md",
    "docs/plans/next.md",
    "docs/ui/design.md",
    "PRODUCT.md",
    "DESIGN.md",
    "docs/PUBLIC_READINESS.md",
    ".impeccable/design.json",
    "knowledge/birdeye/cli/docs/research/notes.md",
    ".README.md.swp",
  ]) {
    assert.ok(isPrivatePath(path), path);
  }
  for (const path of [
    "docs/workflows/README.md",
    "docs/INSTALLATION.md",
    "README.vi.md",
    "knowledge/birdeye/docs/data-api/token.md",
    "skills/birdeye-token/SKILL.md",
  ]) {
    assert.ok(!isPrivatePath(path), path);
  }
  const manifest = JSON.parse(
    readFileSync("knowledge/birdeye/manifest.json", "utf8"),
  );
  assert.ok(
    manifest.entries.every((entry) => !isPrivatePath(entry.id)),
    "Private docs must not be indexed for AI search",
  );
  for (const entry of manifest.entries.filter((entry) =>
    entry.id.startsWith("cli/"),
  )) {
    const body = readFileSync(join("knowledge/birdeye", entry.id), "utf8");
    assert.ok(
      !/\]\([^)]*(?:docs\/(?:research|plans|ui)|\.\.\/research|PUBLIC_READINESS\.md)[^)]*\)/.test(
        body,
      ),
      `Private link in ${entry.id}`,
    );
  }
});

test("a sanitized current tree cannot pass the history gate when old commits contain internal files", () => {
  const dir = mkdtempSync(join(tmpdir(), "birdeye-private-history-"));
  const git = (...args) =>
    execFileSync("git", args, {
      cwd: dir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  const script = resolve("scripts/check-public-files.mjs");
  const check = (...args) =>
    spawnSync(process.execPath, [script, ...args], {
      cwd: dir,
      encoding: "utf8",
    });
  try {
    git("init", "--quiet");
    git("config", "user.name", "Test");
    git("config", "user.email", "test@example.invalid");
    git("config", "commit.gpgsign", "false");
    writeFileSync(join(dir, "README.md"), "# Public fixture\n");
    git("add", ".");
    git("commit", "--quiet", "-m", "public baseline");
    assert.equal(check("--history").status, 0);
    mkdirSync(join(dir, "internaldocs"));
    writeFileSync(
      join(dir, "internaldocs/fixture.md"),
      "Synthetic internal fixture\n",
    );
    git("add", ".");
    assert.equal(
      check().status,
      1,
      "Index inspection catches a new internal file",
    );
    git("commit", "--quiet", "-m", "internal fixture");
    git("rm", "--cached", "internaldocs/fixture.md");
    git("commit", "--quiet", "-m", "remove internal file from tree");
    assert.equal(check().status, 0);
    assert.equal(
      check("--history").status,
      1,
      "Deleting the current path must not certify old history",
    );
    assert.equal(
      readFileSync(join(dir, "internaldocs/fixture.md"), "utf8"),
      "Synthetic internal fixture\n",
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
