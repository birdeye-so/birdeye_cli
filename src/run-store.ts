import type {Ledger} from "./ledger.js";
import {AppError, integer, now, type Data} from "./shared.js";
import type {Result} from "./runner.js";

export type StoredRun = {
  id: string; title: string; status: string; createdAt: string;
  input: Data; result?: Result; error?: unknown; ai: Data;
};

// Shares the ledger database and permissions, but never stores provider configuration.
export class RunStore {
  constructor(private ledger: Ledger) {
    ledger.db.exec(`CREATE TABLE IF NOT EXISTS saved_runs (
      id TEXT PRIMARY KEY, title TEXT NOT NULL, status TEXT NOT NULL,
      created_at TEXT NOT NULL, saved_at TEXT NOT NULL, has_result INTEGER NOT NULL,
      payload TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS deleted_saved_runs (id TEXT PRIMARY KEY);`);
  }
  save(run: StoredRun): string {
    const savedAt = now();
    try {
      const written = this.ledger.db.prepare(`INSERT INTO saved_runs SELECT ?,?,?,?,?,?,?
        WHERE NOT EXISTS (SELECT 1 FROM deleted_saved_runs WHERE id=?)
        ON CONFLICT(id) DO UPDATE SET title=excluded.title,status=excluded.status,
        saved_at=excluded.saved_at,has_result=excluded.has_result,payload=excluded.payload`)
        .run(run.id, run.title, run.status, run.createdAt, savedAt, run.result ? 1 : 0,
          JSON.stringify({id:run.id,title:run.title,status:run.status,createdAt:run.createdAt,
            input:run.input,result:run.result,error:run.error,ai:run.ai}), run.id);
      if (!written.changes) throw new Error("Run was deleted");
      return savedAt;
    } catch {
      throw new AppError("RUN_STORAGE_FAILED", "Could not save the run to SQLite. Export available results before closing and check disk space/permissions.");
    }
  }
  remove(id?: string): number {
    this.ledger.db.exec("BEGIN IMMEDIATE");
    try {
      if (id !== undefined) {
        this.ledger.db.prepare("INSERT OR IGNORE INTO deleted_saved_runs VALUES(?)").run(id);
      } else {
        this.ledger.db.exec("INSERT OR IGNORE INTO deleted_saved_runs SELECT id FROM saved_runs");
      }
      const result = id === undefined
        ? this.ledger.db.prepare("DELETE FROM saved_runs").run()
        : this.ledger.db.prepare("DELETE FROM saved_runs WHERE id=?").run(id);
      this.ledger.db.exec("COMMIT");
      return Number(result.changes);
    } catch {
      this.ledger.db.exec("ROLLBACK");
      throw new AppError("RUN_DELETE_FAILED", "Could not delete history from SQLite. Check disk space/permissions and retry.");
    }
  }
  get(id: string) {
    const row = this.ledger.db.prepare("SELECT payload,saved_at FROM saved_runs WHERE id=?").get(id);
    if (!row) throw new AppError("RUN_NOT_FOUND", "Saved run not found.");
    let run: StoredRun;
    try { run = JSON.parse(String(row.payload)); }
    catch { throw new AppError("RUN_STORAGE_INVALID", "Saved run data could not be read."); }
    // A disk snapshot cannot establish whether its originating process is still alive.
    // Live interface runs override this view; never resume a paid request automatically.
    if (run.status === "running") {
      run.status = "incomplete";
      if (run.result) {
        run.result.meta.coverage = "partial";
        if (run.result.meta.operation === "analysis") run.result.data.status = "partial";
        run.result.meta.warnings = [...(run.result.meta.warnings || []), "Saved checkpoint only. This run is not attached to the current interface and may be incomplete."];
      }
    }
    const cu = this.ledger.summary(id);
    if (run.result) run.result.meta.cu = cu;
    return {...run, cu, saved: true, savedAt: String(row.saved_at), fromStorage: true, events: []};
  }
  list(limit = 50, before?: number) {
    integer(limit, "limit", 1, 100);
    if (before !== undefined) integer(before, "before", 1, Number.MAX_SAFE_INTEGER);
    const rows = this.ledger.db.prepare(`SELECT rowid AS sequence,id,title,status,created_at,saved_at,has_result
      FROM saved_runs ${before === undefined ? "" : "WHERE rowid < ?"} ORDER BY rowid DESC LIMIT ?`)
      .all(...(before === undefined ? [limit + 1] : [before, limit + 1]));
    const page = rows.slice(0, limit);
    return {items: page.map(r => ({id:String(r.id),title:String(r.title),
      status:r.status === "running" ? "incomplete" : String(r.status),
      createdAt:String(r.created_at),savedAt:String(r.saved_at),hasResult:!!r.has_result})),
      nextCursor: rows.length > limit ? Number(page.at(-1)!.sequence) : null};
  }
}
