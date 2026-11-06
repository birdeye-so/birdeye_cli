import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, closeSync, openSync, chmodSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import {createHmac, randomBytes} from 'node:crypto';

export type SkillAction = 'view' | 'download';
type Counts = {skill_id: string; view_count: number; download_count: number};

// Connections share SQLite's write lock, including across Node processes.
export function openSkillStats(path = process.env.SKILL_STATS_DB_PATH || resolve(process.cwd(), '.birdeye/skill-stats.sqlite')) {
  if (path !== ':memory:') {
    mkdirSync(dirname(path), {recursive: true, mode: 0o700});
    closeSync(openSync(path, 'a', 0o600));
    chmodSync(path, 0o600);
  }
  const db = new DatabaseSync(path);
  try {
    db.exec(`
      PRAGMA busy_timeout = 5000;
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = FULL;
      CREATE TABLE IF NOT EXISTS skill_stats (
        skill_id TEXT PRIMARY KEY,
        view_count INTEGER NOT NULL DEFAULT 0 CHECK(view_count >= 0 AND view_count <= 9007199254740991),
        download_count INTEGER NOT NULL DEFAULT 0 CHECK(download_count >= 0 AND download_count <= 9007199254740991)
      ) STRICT;
      CREATE TABLE IF NOT EXISTS stats_settings (id INTEGER PRIMARY KEY CHECK(id = 1), salt TEXT NOT NULL) STRICT;
      CREATE TABLE IF NOT EXISTS stats_clients (
        skill_id TEXT NOT NULL, action TEXT NOT NULL, client_hash TEXT NOT NULL, counted_at INTEGER NOT NULL,
        PRIMARY KEY(skill_id, action, client_hash)
      ) STRICT;
      CREATE INDEX IF NOT EXISTS stats_clients_age ON stats_clients(counted_at);
    `);
    db.prepare('INSERT OR IGNORE INTO stats_settings VALUES (1, ?)').run(randomBytes(32).toString('hex'));
    const salt = String(db.prepare('SELECT salt FROM stats_settings WHERE id = 1').get()!.salt);
    // The deployed v1 table is already keyed by these stable skill IDs.
    // If a local v2 build ran, its typed counters are authoritative after that migration.
    db.exec("CREATE TABLE IF NOT EXISTS stats_migrations (id TEXT PRIMARY KEY) STRICT; BEGIN IMMEDIATE;");
    try {
      if (!db.prepare("SELECT id FROM stats_migrations WHERE id = 'unified-skills-v3'").get()) {
        if (db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'resource_stats'").get()) {
          db.exec(`INSERT INTO skill_stats (skill_id, view_count, download_count)
            SELECT resource_id, SUM(view_count), SUM(download_count) FROM resource_stats GROUP BY resource_id
            ON CONFLICT(skill_id) DO UPDATE SET view_count = excluded.view_count, download_count = excluded.download_count;`);
        }
        db.prepare("INSERT INTO stats_migrations (id) VALUES ('unified-skills-v3')").run();
      }
      db.exec('COMMIT');
    } catch (error) {db.exec('ROLLBACK'); throw error;}
    const increment = (skillId: string, action: SkillAction) => {
        return db.prepare(`INSERT INTO skill_stats (skill_id, view_count, download_count) VALUES (?, ?, ?)
          ON CONFLICT(skill_id) DO UPDATE SET
            view_count = skill_stats.view_count + excluded.view_count,
            download_count = skill_stats.download_count + excluded.download_count
          RETURNING skill_id, view_count, download_count
        `).get(skillId, action === 'view' ? 1 : 0, action === 'download' ? 1 : 0) as Counts;
    };
    return {
      list: () => db.prepare('SELECT skill_id, view_count, download_count FROM skill_stats').all() as Counts[],
      increment(skillId: string, action: SkillAction, client?: string, now = Date.now()) {
        // Internal imports can increment directly. HTTP callers always supply
        // their server-resolved identity; no raw client address is persisted.
        if (client === undefined) return increment(skillId, action);
        const hash = createHmac('sha256', salt).update(client).digest('hex');
        db.exec('BEGIN IMMEDIATE');
        try {
          db.prepare('DELETE FROM stats_clients WHERE counted_at <= ?').run(now - 86_400_000);
          const seen = db.prepare('SELECT 1 FROM stats_clients WHERE skill_id = ? AND action = ? AND client_hash = ?').get(skillId, action, hash);
          const full = Number(db.prepare('SELECT COUNT(*) AS count FROM stats_clients').get()!.count) >= 100_000;
          let counts: Counts;
          if (seen || full) {
            counts = db.prepare('SELECT skill_id, view_count, download_count FROM skill_stats WHERE skill_id = ?').get(skillId) as Counts || {skill_id: skillId, view_count: 0, download_count: 0};
          } else {
            db.prepare('INSERT INTO stats_clients VALUES (?, ?, ?, ?)').run(skillId, action, hash, now);
            counts = increment(skillId, action);
          }
          db.exec('COMMIT');
          return counts;
        } catch (error) {db.exec('ROLLBACK'); throw error;}
      },
      close: () => db.close(),
    };
  } catch (error) {
    db.close();
    throw error;
  }
}
