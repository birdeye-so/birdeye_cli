import { DatabaseSync } from "node:sqlite";
import { mkdirSync, chmodSync } from "node:fs";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";
import { AppError, now, integer } from "./shared.js";
import { PRICING_VERSION } from "./catalog.js";

export class Ledger {
  db: DatabaseSync;
  constructor(path: string) {
    if (path !== ":memory:")
      mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
    this.db = new DatabaseSync(path);
    if (path !== ":memory:") chmodSync(path, 0o600);
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS workflows(id TEXT PRIMARY KEY,label TEXT,max_cu INTEGER,created_at TEXT);
      CREATE TABLE IF NOT EXISTS runs(id TEXT PRIMARY KEY,workflow TEXT,max_cu INTEGER,max_requests INTEGER,created_at TEXT);
      CREATE TABLE IF NOT EXISTS attempts(id TEXT PRIMARY KEY,run TEXT,operation TEXT,credential TEXT,reserved INTEGER,estimated INTEGER,status TEXT,created_at TEXT,pricing_version TEXT);
      CREATE INDEX IF NOT EXISTS attempts_run ON attempts(run);
      CREATE TABLE IF NOT EXISTS snapshots(id TEXT PRIMARY KEY,credential TEXT,data TEXT,created_at TEXT);`);
  }
  createWorkflow(label: string, maxCu: number | null = null) {
    if (maxCu !== null) integer(maxCu, "max-cu", 0, Number.MAX_SAFE_INTEGER);
    const id = randomUUID();
    this.db
      .prepare("INSERT INTO workflows VALUES(?,?,?,?)")
      .run(id, label, maxCu, now());
    return { id, label, maxCu };
  }
  workflow(id: string) {
    const value = this.db.prepare("SELECT * FROM workflows WHERE id=?").get(id);
    if (!value)
      throw new AppError(
        "WORKFLOW_NOT_FOUND",
        "Workflow not found. Create it with workflow create.",
      );
    return { ...value, usage: this.summary(undefined, id) };
  }
  createRun(maxCu: number | null = null, workflow?: string, maxRequests = 20) {
    if (maxCu !== null) integer(maxCu, "max-cu", 0, Number.MAX_SAFE_INTEGER);
    integer(maxRequests, "max-requests", 1, 1000);
    if (workflow) this.workflow(workflow);
    const id = randomUUID();
    this.db
      .prepare("INSERT INTO runs VALUES(?,?,?,?,?)")
      .run(id, workflow || null, maxCu, maxRequests, now());
    return id;
  }
  reserve(run: string, operation: string, cost: number | null, credential: string) {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const r = this.db.prepare("SELECT * FROM runs WHERE id=?").get(run)!;
      if (!r) throw new AppError("RUN_NOT_FOUND", "Run not found.");
      if (cost === null && r.max_cu !== null && Number(r.max_cu) === 0)
        throw new AppError("CU_BUDGET_EXCEEDED", "A zero CU budget does not permit calls with unknown cost.");
      const own = this.summary(run);
      if (own.attempts >= Number(r.max_requests))
        throw new AppError("REQUEST_LIMIT", "Request-attempt limit reached.");
      if (r.max_cu !== null && own.budgetUsed + (cost ?? 0) > Number(r.max_cu))
        throw new AppError(
          "CU_BUDGET_EXCEEDED",
          `Request needs ${cost} CU; run has ${Number(r.max_cu) - own.budgetUsed} CU available.`,
        );
      if (r.workflow) {
        const w = this.db
          .prepare("SELECT * FROM workflows WHERE id=?")
          .get(r.workflow)!;
        if (
          w.max_cu !== null && ((cost === null && Number(w.max_cu) === 0) ||
          this.summary(undefined, String(r.workflow)).budgetUsed + (cost ?? 0) >
          Number(w.max_cu))
        )
          throw new AppError(
            "CU_BUDGET_EXCEEDED",
            "Workflow CU budget exhausted.",
          );
      }
      const id = randomUUID();
      this.db
        .prepare("INSERT INTO attempts VALUES(?,?,?,?,?,?,?,?,?)")
        .run(
          id,
          run,
          operation,
          credential,
          cost ?? 0,
          cost === null ? null : 0,
          "pending",
          now(),
          cost === null ? "mcp-unpriced" : PRICING_VERSION,
        );
      this.db.exec("COMMIT");
      return id;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }
  finish(
    id: string,
    status: "completed" | "uncertain" | "not-sent",
    estimated = 0,
  ) {
    this.db
      .prepare(
        "UPDATE attempts SET status=?,estimated=CASE WHEN pricing_version='mcp-unpriced' THEN NULL ELSE ? END,reserved=CASE WHEN ?='not-sent' THEN 0 ELSE reserved END WHERE id=? AND status='pending'",
      )
      .run(status, estimated, status, id);
  }
  summary(run?: string, workflow?: string) {
    const where = run ? "WHERE a.run=?" : workflow ? "WHERE r.workflow=?" : "";
    const args = run ? [run] : workflow ? [workflow] : [];
    const rows = this.db
      .prepare(`SELECT a.* FROM attempts a JOIN runs r ON r.id=a.run ${where}`)
      .all(...args);
    return {
      estimated: rows.reduce((s, r) => s + Number(r.estimated), 0),
      reported: null,
      unknownCostAttempts: rows.filter(r => r.pricing_version === "mcp-unpriced" && r.status !== "not-sent").length,
      budgetUsed: rows.reduce((s, r) => s + Number(r.reserved), 0),
      uncertainAttempts: rows.filter(
        (r) => r.status === "uncertain" || r.status === "pending",
      ).length,
      attempts: rows.filter((r) => r.status !== "not-sent").length,
      pricingVersion: PRICING_VERSION,
    };
  }
  attempts(run?: string) {
    return run
      ? this.db.prepare("SELECT * FROM attempts WHERE run=?").all(run)
      : this.db
          .prepare("SELECT * FROM attempts ORDER BY created_at DESC LIMIT 100")
          .all();
  }
  snapshot(credential: string, data: unknown) {
    this.db
      .prepare("INSERT INTO snapshots VALUES(?,?,?,?)")
      .run(randomUUID(), credential, JSON.stringify(data), now());
  }
  close() {
    this.db.close();
  }
}
