# Skills API

Standalone Node.js service with its own port, catalog, and SQLite database. It has no dependency on Next.js or the landing app.

```bash
# From the repository root
npm run skills-api:build
npm run skills-api:start
```

For deployment, copy this directory, run `npm ci`, `npm run build`, then `npm start`. Node >=22.16 is required.

| Environment variable | Default | Purpose |
| --- | --- | --- |
| `SKILL_API_HOST` | `127.0.0.1` | Set `0.0.0.0` to listen on all interfaces |
| `SKILL_API_PORT` | `3002` | HTTP port |
| `SKILL_API_CORS_ORIGINS` | `*` | Public browser access, or comma-separated allowed origins |
| `SKILL_CATALOG_PATH` | Bundled `catalog.json` | Absolute path to an alternative catalog |
| `SKILL_STATS_DB_PATH` | `.birdeye/skill-stats.sqlite` | Persistent database path, relative to process working directory by default |

The service validates catalog and storage before listening. `GET /agent/health` is a liveness check. SIGINT/SIGTERM gracefully close the server. POST bodies are limited to 8 KiB. CORS supports OPTIONS preflight without cookies; CORS is not authentication and does not restrict server-to-server callers.

The bundled `catalog.json` is generated from the current CLI workflows using the same metadata as the landing catalog. From the repository root, run `npm run skills-api:sync` after workflow changes; `npm run skills-api:build` also synchronizes it. Commit the generated catalog when updating workflows. The service remains standalone at runtime and does not load the landing app. It reads the catalog on every request, so syncing also updates a running service. Standalone deployments use the bundled snapshot; copy the updated catalog when deploying.

All routes use the `/agent` prefix. Reverse proxies must forward this prefix unchanged. The previous `/api/skills` and `/healthz` paths are no longer served.

## Endpoints

| Method | Path | Input |
| --- | --- | --- |
| GET | `/agent/api/skills` | Optional `?category=token` (catalog category ID) |
| POST | `/agent/api/skills/view` | `{"skill_id":"token-due-diligence"}` |
| POST | `/agent/api/skills/download` | `{"skill_id":"token-due-diligence"}` |
| POST | `/agent/api/skills/stat` | `{"skill_id":"token-due-diligence","action":"view"}` or action `download` |

POST requires `Content-Type: application/json`. IDs are the current workflow slugs (for example `token-due-diligence`), exposed under `catalog.skills`. The four agent instruction packages are not separate entries in this API. Use the returned `skill_id` for view/download events. Existing counters are preserved by ID; new workflow IDs start at zero. GET returns skill metadata (`id`, `title`, `category`, `description`, `source`), `skill_id`, `view_count`, and `download_count` in `{"code":0,"reason":"","message":"success","data":{"list":[...]}}`. New skills have zero counts. POST returns `{"code":0,"reason":"","message":"success","data":null}` only after committing the increment. The download endpoint records an event; it does not transfer a file. GET never increments counters.

```bash
curl 'http://localhost:3002/agent/api/skills?category=token'
curl 'http://localhost:3002/agent/api/skills/view' \
  -H 'Content-Type: application/json' --data '{"skill_id":"token-due-diligence"}'
curl 'http://localhost:3002/agent/api/skills/download' \
  -H 'Content-Type: application/json' --data '{"skill_id":"token-due-diligence"}'
```

Unknown categories and invalid payloads return HTTP 400; unknown skills return 404; unsupported content types return 415; unavailable catalog/storage returns 503. Errors use the same envelope with a nonzero `code`, a machine-readable `reason`, and `data: null`. Responses are not cached.

Storage uses built-in `node:sqlite` (Node >=22.16), defaulting to `.birdeye/skill-stats.sqlite` under the API process working directory. Set `SKILL_STATS_DB_PATH=/absolute/persistent/path/skill-stats.sqlite` for deployment. The directory is created automatically. Keep the database and its WAL/SHM files on persistent local storage outside build output and `public/`.

Each write uses a single atomic SQLite UPSERT, WAL journaling, FULL synchronous durability, and a five-second busy timeout. Multiple processes **on one host must use the same database file**. Separate replicas with their own files do not share counters; this deployment model does not support ephemeral serverless storage or SQLite WAL over network filesystems. Storage failures return errors rather than silently losing events.

Counts represent accepted events, not unique visitors. Every successful POST adds one; retries also add one. There is no authentication, deduplication, or bot filtering. A client that loses the response after commit cannot assume its retry is exactly-once. Consumers call this service directly; the landing app has no skill-statistics API routes.

## Tests

From the repository root, run `npm run test:skills-api`. The suite covers validation, filtering, persistence, HTTP routing/CORS, and 3,600 concurrent increments across six processes.

