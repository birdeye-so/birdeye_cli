# Skills API

Standalone Node.js service exposing one skill catalog: skills with descriptions and usage instructions, plus persistent view/download counters. No separate workflow collection or landing-app dependency. Requires Node >=22.16.

```bash
# From the repository root
npm --prefix apps/skills-api ci
npm run skills-api:build
npm run skills-api:start -- --demo-host https://support-api.owland.xyz/
```

To deploy this directory independently, run `npm ci`, `npm run build`, then `npm start` inside it. The bundled catalog is ready to use. Pass the demo origin with `npm start -- --demo-host https://support-api.owland.xyz/` (or `node dist/index.js --demo-host https://support-api.owland.xyz/`). Regeneration requires the source checkout.

| Environment variable | Default | Purpose |
| --- | --- | --- |
| `SKILL_API_HOST` | `127.0.0.1` | Bind address; use `0.0.0.0` for all interfaces |
| `SKILL_API_PORT` | `3003` | HTTP port; overridden by `--port` |
| `SKILL_DEMO_HOST` | Local HTTP listener origin | Origin used for `demo_url`; overridden by `--demo-host` |
| `SKILL_API_CORS_ORIGINS` | `*` | Allowed browser origins, comma-separated |
| `SKILL_CATALOG_PATH` | Bundled `catalog.json` | Optional absolute path to a schema-v4 catalog |
| `SKILL_STATS_DB_PATH` | `.birdeye/skill-stats.sqlite` | Persistent SQLite path |

Choose a port with `npm run skills-api:start -- --port 3032 --demo-host https://support-api.owland.xyz/`. In this directory, use `npm start -- --port 3032` or `node dist/index.js --port 3032`. Precedence is `--port` → `SKILL_API_PORT` → `3003`; valid ports are integers from 1 to 65535. Existing deployments with `SKILL_API_PORT` keep that configured port. When moving an existing deployment from 3002 to 3003, update its reverse-proxy upstream to the same port.

`--demo-host` accepts an HTTP(S) origin with an optional trailing `/`; it rejects credentials, paths, query strings and fragments. Each response uses `demo_url = normalized demo_host + demo_path`. CLI values override `SKILL_DEMO_HOST`; without either setting, links point to the local HTTP listener. Set the public HTTPS origin explicitly behind a reverse proxy. This option belongs to the Skills API process that generates JSON; the separate browser preview on port 8787 uses `--public-url` to allow its public Host/Origin.

Use an absolute persistent path for SQLite and keep its WAL/SHM files on the same local volume. The directory is created automatically. The service validates catalog/storage before listening and closes gracefully on SIGINT/SIGTERM.

## Endpoints

Forward `/agent/*` to this service. Demo paths (`/<skill_id>` and supported aliases), `/main.js` and `/main.css` can go either to this service or to the browser preview on port 8787. Keep HTML and assets on the same demo host; both hosts use the same skill identity rules.

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

- `id`, `skill_id`, `title`, `category`, `description`, `icon_url`, `demo_path`, `demo_url`, `aliases`;
- `usage.input`, `usage.instructions`, `usage.result`;
- `usage.preview_command`, `usage.run_command`, `usage.install_command`;
- `core_capabilities`, `just_say_to_your_agent`, `cli_parameters`, `sample_output` (same fields and structure as `/view`);
- `use_cases`, `supported_chains`, `limitations`;
- `view_count`, `download_count`.

Each list item contains the complete skill detail at the top level, so frontends can fetch the list once, cache it by `skill_id` in application state, and display detail screens without calling `/view`. Category-filtered lists return the same complete objects. GET does not increment counters. Cached counts reflect the time of the fetch; refresh the list when fresh counts or catalog changes are needed. HTTP responses remain `no-store`; this is an application-managed cache.

`skill_id` and `id` always contain the canonical ID; `demo_path` is always `/<skill_id>` in **list, view and download** responses. All current skills accept their short ID without `skill-` in API requests and demo URLs. `aliases` lists these accepted alternatives. Price Surge Screen uses `skill-price-surge`; its compatibility aliases also include `price-surge-screen`, `skill-price-surge-screen`, `prige-surge`, `skill-prige-surge`, `prige-surge-screen` and `skill-prige-surge-screen`. Alias requests resolve to the canonical skill and increment the same counters; demo aliases redirect to the canonical path. Use the returned canonical ID and path when generating new links.

For example, the identity fields returned for Price Surge Screen are:

```json
{"id":"skill-price-surge","skill_id":"skill-price-surge","demo_path":"/skill-price-surge","demo_url":"https://support-api.owland.xyz/skill-price-surge"}
```

`icon_url` is an absolute public SVG URL from [Lucide](https://lucide.dev/icons/) via the [Iconify SVG API](https://iconify.design/docs/api/svg.html), e.g. `https://api.iconify.design/lucide/flame.svg?color=%2300ffa3`. All skill icons use `#00ffa3`. Frontends can use the URL directly in an image element.

```js
const apiOrigin = 'https://support-api.owland.xyz';
const iconSrc = skill.icon_url;
const demoUrl = skill.demo_url; // configured demo host + /skill-token-dd-score
const {data} = await fetch(apiOrigin + '/agent/api/categories').then(r => r.json());
// data.list: [{id: "token", title: "Token Due Diligence", description: "...", skill_count: 4}, ...]
// Filter with GET /agent/api/skills?category=<id>; omit category for All.
```

Category counts reflect the current catalog; categories with no public skills are omitted. Category reads do not open the stats database or increment counters. Each current skill maps to a distinct Lucide icon; custom IDs fall back to `file-text`. Icons load directly from Iconify, so frontend image CSP must permit `https://api.iconify.design`. JSON stays uncached.

The public response omits internal steps and relationships. Each skill has a matching `skills/<id>/SKILL.md` package. The four older broad instruction packages remain usable for compatibility but are not additional catalog items.

POST requires `Content-Type: application/json` and accepts at most 8 KiB. `/view` increments the view counter and returns the requested skill in `data`, including its updated counters and these detail fields:

| Section | Response field | Shape |
| --- | --- | --- |
| Core Capabilities | `core_capabilities` | Array of capability descriptions |
| Just say to your Agent | `just_say_to_your_agent` | Array of prompts with input placeholders |
| CLI parameters | `cli_parameters` | Array of `{param, required, values, default}` rows |
| Demo link | `demo_url`, `demo_path` | Absolute URL using `--demo-host`, plus canonical path |
| Sample output | `sample_output` | `{format, kind, description, command, output}` |
| Use cases | `use_cases` | Array of editorial use cases |
| Supported chains and limitations | `supported_chains`, `limitations` | Chain IDs and concise limitations |
| Display example | `sample_output.example` | Optional `{format: "text", kind: "illustrative", description, output}` |

Each list item has the same shape as `/view` data, including all detail fields above. `/view` additionally increments the view counter before returning its result. `required` is a boolean. Conditional requirements are explained in `values`; `default` preserves its JSON type (including arrays and booleans), uses text for computed defaults, and is `null` when unset. For example, `--max-cu` defaults to `null` (unlimited). Values and defaults are generated from the CLI schemas with skill-specific restrictions.

`sample_output.kind` is `estimate`: a reproducible offline cost preview generated by the real planner, using illustrative inputs and a fixed observation time. `output` is the JSON produced by `command`, including the request plan and estimated CU. It is not a live research report and does not fetch market data. Prompt placeholders must be replaced with the user's inputs.

For the editorial sample table, render `sample_output.example.output` as preformatted text alongside `sample_output.example.description`. These examples were supplied for documentation and are explicitly illustrative; they are not fetched market data. The existing JSON cost preview remains available in `sample_output.output`. Examples are optional and may be removed from the editorial source.

```js
// Fetch once, then keep the map in application state for detail navigation.
const {data: catalog} = await fetch(apiOrigin + '/agent/api/skills').then(r => r.json());
const skillsById = new Map(catalog.list.map(skill => [skill.skill_id, skill]));
const detail = skillsById.get('skill-token-dd-score');
const demoLink = detail.demo_url;
// detail.cli_parameters includes:
// {param: "--dd-mode", required: false, values: "standard | advanced", default: "advanced"}
const sampleJson = JSON.stringify(detail.sample_output.output, null, 2);
```

`/download` now returns the canonical skill summary in `data`, including `skill_id`, `demo_path`, `demo_url`, `aliases`, `usage` (with `install_command`) and updated counters. `/stat` keeps returning `{"code":0,"reason":"","message":"success","data":null}` after committing, including `/stat` with `action: "view"`. A download POST records a download click; it does not transfer a file or prove successful installation. GET never changes counters. This service does not run the displayed commands.

```bash
curl 'http://localhost:3003/agent/api/skills?category=token'
curl 'http://localhost:3003/agent/api/skills/view' \
  -H 'Content-Type: application/json' --data '{"skill_id":"skill-token-dd-score"}'
curl 'http://localhost:3003/agent/api/skills/download' \
  -H 'Content-Type: application/json' --data '{"skill_id":"skill-token-dd-score"}'
```

Invalid categories/payloads return 400, unknown skill IDs 404, unsupported content types 415, unavailable catalog/storage 503. JSON responses are not cached. CORS permits OPTIONS without cookies; it is not authentication.

## Catalog updates and review

### Editing descriptions and skill-page content

Edit [catalog/skill-content.json](../../catalog/skill-content.json), keyed by canonical skill ID. This is the editable source; generated catalogs and `SKILL.md` files are replaced during synchronization.

| Section | Editable JSON field | API list/view field |
| --- | --- | --- |
| Description | `description` | `description` |
| Use cases | `use_cases` | `use_cases` (also included in usage instructions) |
| Core Capabilities | `core_capabilities` | `core_capabilities` |
| Just say to your Agent | `just_say_to_your_agent` | `just_say_to_your_agent` |
| Supported chains | `supported_chains` | `supported_chains` |
| Limitations | `limitations` | `limitations` |
| Sample table (optional) | `sample_output.output` | `sample_output.example.output` |
| Sample provenance label | `sample_output.description` | `sample_output.example.description` |

Use `\n` inside JSON sample strings for line breaks. Keep sample provenance set to `kind: "illustrative"`. The file contains only the 20 implemented skills; it does not publish planned skills. Chain changes must match actual support in `src/workflows/<skill-id>/definition.ts` or synchronization fails. Operational limits, schemas and calculation logic remain in those definitions and their referenced modules; the generated instructions retain those detailed execution notes.

After editing:

```bash
npm run catalog:sync
npm run skills-api:build
npm run test:skills-api
```

The first command updates the API catalog, landing catalog, installable skills and review materials. Deploy the regenerated API catalog together with the matching API code. `scripts/lib/skill-details.mjs` still generates CLI parameters and the reproducible JSON CU preview from runtime schemas. Icon mappings and color live in [src/icons.ts](src/icons.ts).

Skill definitions own the canonical metadata and execution. Run `npm run catalog:sync` to regenerate instructions and both public snapshots. `npm run skills-api:sync` regenerates this API snapshot only, including the required instruction packages. The root `skills-api:build` command also synchronizes the standalone copy of `src/skill-identity.ts`. Edit identity rules in that source file, then sync; tests reject a stale API copy.

The API reads its snapshot per request, so atomic replacement updates a running server. Deploy v4 catalog and matching code together; v3 custom snapshots must be regenerated to include detail content. Custom catalogs must follow the same schema. Skill-list entries omit step graphs; the detail's sample output includes its cost-preview plan. Complex-case questions stay in the maintainer review.

## Existing counters

Keep the same `SKILL_STATS_DB_PATH` when upgrading. The deployed `skill_stats` table and skill IDs are unchanged, including `skill-token-dd-score`; live test counters remain associated with that ID. Old package IDs and retired IDs retain their database rows even when absent from the public list.

If an intermediate local build used `resource_stats`, startup consolidates its rows by ID once into `skill_stats`. Those totals replace the pre-migration values, avoiding double counting. The old table remains for audit. Stop other writers and take a SQLite-consistent backup before that upgrade; old typed writers must not continue after consolidation.

The public catalog uses `/agent/api/skills` and `/agent/api/categories`. The intermediate `/agent/api/workflows`, its `workflow_id` payload, and unprefixed paths are unsupported.

## Storage and tests

Writes use atomic UPSERT, WAL, FULL synchronous durability and a five-second busy timeout. Multiple processes on one host must share the same database file; independent replicas/files do not share counts. Ephemeral serverless storage and WAL on network filesystems are unsupported.

HTTP view/download/stat requests are limited to 60 per client IP per minute per process; excess requests return 429 with Retry-After. GET catalog requests remain available. A shared SQLite transaction counts each client IP / skill / action at most once in a rolling 24-hour window, including across restarts and processes. Client addresses are stored only as keyed hashes. Expired records are pruned and the deduplication table is capped at 100,000 entries; when full, new events are served without incrementing counters.

Forwarded headers are ignored by default. Behind a reverse proxy, set `SKILL_API_TRUSTED_PROXIES` to its exact socket IP addresses (comma-separated, for example `127.0.0.1,::1`). The proxy must overwrite or append the real client address to `X-Forwarded-For`. The server walks the chain from the trusted socket toward the first untrusted hop. Without this configuration, clients behind one proxy share its limits and counts.

Counters measure deduplicated client-IP events, not verified downloads or unique people. NAT users share an identity and distributed bots can use multiple IPs. Keep edge rate limits for public deployments; independent database replicas do not share deduplication.

`npm run test:skills-api` covers HTTP routes/CORS, filtering, validation, persistence, compatibility migration and 3,600 increments across six processes.

## Direct demo links

`https://support-api.owland.xyz/skill-token-dd-score` opens Token Due-Diligence Score. All current catalog IDs and their advertised aliases have a route on this server and the browser preview on port 8787; retired or unknown IDs return 404. Links select the skill after the browser workspace is opened/unlocked. Opening a link never starts research or increments view/download counters.

The repository-root `npm run skills-api:build` bundles the browser demo into `apps/skills-api/public/` as well as compiling the API. Include that directory when deploying the standalone service. `SKILL_DEMO_DIR` can point to an alternate absolute directory containing the browser build (`index.html`, `main.js`, `main.css`). Missing assets return 503. Public hosting must use HTTPS for the browser workspace.

The demo uses the browser runtime and browser-held credentials, rather than exposing a server-side research workspace. Keep the same stats database path when restarting the API.
