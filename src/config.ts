import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  closeSync,
  openSync,
} from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { z } from "zod";
import { AppError } from "./shared.js";

import { profileSchema, validateProviderUrl } from "./provider.js";
export { profileSchema, validateProviderUrl } from "./provider.js";
const configSchema = z
  .object({
    birdeyeApiKey: z.string().max(4096).optional(),
    ai: z
      .object({
        defaultProfile: z.string().default("research"),
        profiles: z.record(z.string(), profileSchema).default({}),
      })
      .default({ defaultProfile: "research", profiles: {} }),
  })
  .strict();
export type Config = z.infer<typeof configSchema>;
export type Profile = z.infer<typeof profileSchema>;
export const configDir = () =>
  process.env.BIRDEYE_CONFIG_DIR || join(homedir(), ".config", "birdeye");
export const configPath = (dir = configDir()) => join(dir, "config.sqlite");

function storedConfig(raw: string): Config {
  try {
    const config = configSchema.parse(JSON.parse(raw));
    for (const profile of Object.values(config.ai.profiles))
      validateProviderUrl(profile.baseUrl);
    return config;
  } catch {
    throw new AppError(
      "CONFIG_INVALID",
      "Stored configuration is invalid. Check the local configuration store.",
    );
  }
}

function withConfigDb<T>(dir: string, action: (db: DatabaseSync) => T): T {
  let db: DatabaseSync | undefined;
  try {
    mkdirSync(dir, { recursive: true, mode: 0o700 });
    const path = configPath(dir);
    // Create with private permissions before SQLite writes any credentials.
    closeSync(openSync(path, "a", 0o600));
    chmodSync(path, 0o600);
    db = new DatabaseSync(path);
    db.exec(`PRAGMA busy_timeout=5000;
      PRAGMA journal_mode=DELETE;
      PRAGMA secure_delete=ON;
      CREATE TABLE IF NOT EXISTS configuration (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        version INTEGER NOT NULL,
        data TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );`);
    return action(db);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "CONFIG_STORAGE_ERROR",
      `Cannot access configuration database at ${configPath(dir)}.`,
    );
  } finally {
    db?.close();
  }
}

export function readConfig(dir = configDir()): Config {
  const legacy = join(dir, "config.json");
  if (!existsSync(configPath(dir)) && !existsSync(legacy))
    return configSchema.parse({});
  return withConfigDb(dir, (db) => {
    let row = db
      .prepare("SELECT version, data FROM configuration WHERE id=1")
      .get();
    if (!row && existsSync(legacy)) {
      const config = storedConfig(readFileSync(legacy, "utf8"));
      // Atomic first import: never overwrite an existing SQLite configuration.
      db.prepare(
        "INSERT OR IGNORE INTO configuration (id, version, data, updated_at) VALUES (1, 1, ?, ?)",
      ).run(JSON.stringify(config), new Date().toISOString());
      row = db
        .prepare("SELECT version, data FROM configuration WHERE id=1")
        .get();
    }
    if (!row) return configSchema.parse({});
    if (row.version !== 1)
      throw new AppError(
        "CONFIG_VERSION_UNSUPPORTED",
        "Configuration database version is not supported by this CLI.",
      );
    return storedConfig(String(row.data));
  });
}

export function saveConfig(input: unknown, dir = configDir()) {
  const config = configSchema.parse(input);
  for (const p of Object.values(config.ai.profiles))
    validateProviderUrl(p.baseUrl);
  withConfigDb(dir, (db) => {
    const row = db
      .prepare("SELECT version FROM configuration WHERE id=1")
      .get();
    if (row && row.version !== 1)
      throw new AppError(
        "CONFIG_VERSION_UNSUPPORTED",
        "Configuration database version is not supported by this CLI.",
      );
    db.prepare(
      `INSERT INTO configuration (id, version, data, updated_at) VALUES (1, 1, ?, ?)
      ON CONFLICT(id) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at`,
    ).run(JSON.stringify(config), new Date().toISOString());
  });
  return config;
}
export function dataKey(config: Config) {
  return process.env.BIRDEYE_API_KEY || config.birdeyeApiKey || "";
}
export function credentialId(key: string) {
  return createHash("sha256").update(key).digest("hex").slice(0, 16);
}
export function activeProfile(
  config: Config,
  name?: string,
): Profile | undefined {
  return config.ai.profiles[name || config.ai.defaultProfile];
}
export function aiKey(profile: Profile) {
  return (
    (profile.apiKeyEnv ? process.env[profile.apiKeyEnv] : undefined) ||
    profile.apiKey ||
    ""
  );
}
export function safeConfig(config: Config) {
  return {
    birdeyeConfigured: !!dataKey(config),
    birdeyeSource: process.env.BIRDEYE_API_KEY ? "environment" : "config",
    ai: {
      defaultProfile: config.ai.defaultProfile,
      profiles: Object.fromEntries(
        Object.entries(config.ai.profiles).map(([name, profile]) => {
          const { apiKey: _, ...safe } = profile;
          return [
            name,
            {
              ...safe,
              apiFormat: profile.apiFormat ?? "chat-completions",
              configured: !!aiKey(profile),
            },
          ];
        }),
      ),
    },
  };
}
