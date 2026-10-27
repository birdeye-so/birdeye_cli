# Skills API

Standalone Node.js service exposing one skill catalog: skills with descriptions and usage instructions, plus persistent view/download counters. No separate workflow collection or landing-app dependency. Requires Node >=22.16.

```bash
# From the repository root
npm --prefix apps/skills-api ci
npm run skills-api:build
npm run skills-api:start
```

To deploy this directory independently, run `npm ci`, `npm run build`, then `npm start` inside it. The bundled catalog is ready to use. Regeneration requires the source checkout.

| Environment variable | Default | Purpose |
| --- | --- | --- |
| `SKILL_API_HOST` | `127.0.0.1` | Bind address; use `0.0.0.0` for all interfaces |
| `SKILL_API_PORT` | `3002` | HTTP port |
| `SKILL_API_CORS_ORIGINS` | `*` | Allowed browser origins, comma-separated |
| `SKILL_CATALOG_PATH` | Bundled `catalog.json` | Optional absolute path to a schema-v3 catalog |
| `SKILL_STATS_DB_PATH` | `.birdeye/skill-stats.sqlite` | Persistent SQLite path |

Use an absolute persistent path for SQLite and keep its WAL/SHM files on the same local volume. The directory is created automatically. The service validates catalog/storage before listening and closes gracefully on SIGINT/SIGTERM.

## Endpoints

Reverse proxies must forward `/agent/*`, `/<skill_id>`, `/main.js` and `/main.css` to this service.

| Method | Path | Input |
| --- | --- | --- |
| GET / HEAD | `/<skill_id>` | Open the browser demo with that current skill selected |
| GET | `/agent/health` | None |
| GET | `/agent/api/skills` | Optional `?category=token` |
| GET | `/agent/api/categories` | Nonempty skill categories with `skill_count` |
| POST | `/agent/api/skills/view` | `{"skill_id":"skill-token-dd-score"}` |
| POST | `/agent/api/skills/download` | `{"skill_id":"skill-token-dd-score"}` |
| POST | `/agent/api/skills/stat` | `{"skill_id":"skill-token-dd-score","action":"view"}` or `download` |

GET returns `{"code":0,"reason":"","message":"success","data":{"list":[...]}}`. Each item has:

- `id`, `skill_id`, `title`, `category`, `description`, `icon_url`, `demo_path`;
- `usage.input`, `usage.instructions`, `usage.result`;
- `usage.preview_command`, `usage.run_command`, `usage.install_command`;
- `view_count`, `download_count`.

`icon_url` is an absolute public SVG URL from [Lucide](https://lucide.dev/icons/) via the [Iconify SVG API](https://iconify.design/docs/api/svg.html), e.g. `https://api.iconify.design/lucide/flame.svg?color=%232563eb`. Frontends can use it directly in an image element.

```js
const apiOrigin = 'https://support-api.owland.xyz';
const iconSrc = skill.icon_url;
const demoUrl = apiOrigin + skill.demo_path; // e.g. /skill-token-dd-score
const {data} = await fetch(apiOrigin + '/agent/api/categories').then(r => r.json());
// data.list: [{id: "token", title: "Token research", description: "...", skill_count: 4}, ...]
// Filter with GET /agent/api/skills?category=<id>; omit category for All.
```

Category counts reflect the current catalog; categories with no public skills are omitted. Category reads do not open the stats database or increment counters. Each current skill maps to a distinct Lucide icon; custom IDs fall back to `file-text`. Icons load directly from Iconify, so frontend image CSP must permit `https://api.iconify.design`. JSON stays uncached.

The public response omits internal steps and relationships. Each skill has a matching `skills/<id>/SKILL.md` package. The four older broad instruction packages remain usable for compatibility but are not additional catalog items.

POST requires `Content-Type: application/json`, accepts at most 8 KiB, and returns `{"code":0,"reason":"","message":"success","data":null}` after committing. A download POST records a download click; it does not transfer a file or prove successful installation. GET never changes counters. This service does not run the displayed commands.

```bash
curl 'http://localhost:3002/agent/api/skills?category=token'
curl 'http://localhost:3002/agent/api/skills/view' \
  -H 'Content-Type: application/json' --data '{"skill_id":"skill-token-dd-score"}'
curl 'http://localhost:3002/agent/api/skills/download' \
  -H 'Content-Type: application/json' --data '{"skill_id":"skill-token-dd-score"}'
```

Invalid categories/payloads return 400, unknown skill IDs 404, unsupported content types 415, unavailable catalog/storage 503. JSON responses are not cached. CORS permits OPTIONS without cookies; it is not authentication.

## Catalog updates and review

Skill definitions own the canonical metadata and execution. Run `npm run catalog:sync` to regenerate instructions, both public snapshots, and [the maintainer review](../../docs/SKILL_REVIEW.md). `npm run skills-api:sync` regenerates this API snapshot only, including the required instruction packages. The root `skills-api:build` command also synchronizes.

The API reads its snapshot per request, so atomic replacement updates a running server. Deploy v3 catalog and matching code together. Custom catalogs must follow the same schema. Step graphs and complex-case questions stay in the maintainer review, outside the response.

## Existing counters

Keep the same `SKILL_STATS_DB_PATH` when upgrading. The deployed `skill_stats` table and skill IDs are unchanged, including `skill-token-dd-score`; live test counters remain associated with that ID. Old package IDs and retired IDs retain their database rows even when absent from the public list.

If an intermediate local build used `resource_stats`, startup consolidates its rows by ID once into `skill_stats`. Those totals replace the pre-migration values, avoiding double counting. The old table remains for audit. Stop other writers and take a SQLite-consistent backup before that upgrade; old typed writers must not continue after consolidation.

The public catalog uses `/agent/api/skills` and `/agent/api/categories`. The intermediate `/agent/api/workflows`, its `workflow_id` payload, and unprefixed paths are unsupported.

## Storage and tests

Writes use atomic UPSERT, WAL, FULL synchronous durability and a five-second busy timeout. Multiple processes on one host must share the same database file; independent replicas/files do not share counts. Ephemeral serverless storage and WAL on network filesystems are unsupported.

Counts represent accepted events, not unique visitors. Each successful POST adds one, including retries; there is no deduplication, authentication or bot filtering. A lost response after commit does not imply that retrying is exactly-once.

`npm run test:skills-api` covers HTTP routes/CORS, filtering, validation, persistence, compatibility migration and 3,600 increments across six processes.

## Direct demo links

`https://support-api.owland.xyz/skill-token-dd-score` opens Token DD. All current catalog IDs have a route; retired or unknown IDs return 404. Links select the skill after the browser workspace is opened/unlocked. Opening a link never starts research or increments view/download counters.

The repository-root `npm run skills-api:build` bundles the browser demo into `apps/skills-api/public/` as well as compiling the API. Include that directory when deploying the standalone service. `SKILL_DEMO_DIR` can point to an alternate absolute directory containing the browser build (`index.html`, `main.js`, `main.css`). Missing assets return 503. Public hosting must use HTTPS for the browser workspace.

The demo uses the browser runtime and browser-held credentials, rather than exposing a server-side research workspace. Keep the same stats database path when restarting the API.
