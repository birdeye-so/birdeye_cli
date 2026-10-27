import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export type SkillAction = 'view' | 'download';
type Counts = {skill_id: string; view_count: number; download_count: number};

// Connections share SQLite's write lock, including across Node processes.
export function openSkillStats(path = process.env.SKILL_STATS_DB_PATH || resolve(process.cwd(), '.birdeye/skill-stats.sqlite')) {
  mkdirSync(dirname(path), {recursive: true});
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
    `);
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
    return {
      list: () => db.prepare('SELECT skill_id, view_count, download_count FROM skill_stats').all() as Counts[],
      increment(skillId: string, action: SkillAction) {
        // No read/modify/write race: insert and increment are one transaction.
        db.prepare(`INSERT INTO skill_stats (skill_id, view_count, download_count) VALUES (?, ?, ?)
          ON CONFLICT(skill_id) DO UPDATE SET
            view_count = skill_stats.view_count + excluded.view_count,
            download_count = skill_stats.download_count + excluded.download_count
        `).run(skillId, action === 'view' ? 1 : 0, action === 'download' ? 1 : 0);
      },
      close: () => db.close(),
    };
  } catch (error) {
    db.close();
    throw error;
  }
}
