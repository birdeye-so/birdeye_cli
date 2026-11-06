# Changelog

User-visible changes are recorded here using [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) categories and [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Skills API list/view/download responses include `demo_url`, built from the canonical path and the origin configured with `--demo-host` or `SKILL_DEMO_HOST`. Trailing slashes are normalized; the default is the local API listener origin.

- Eight installable data skills: Launchpad Trending, Token Security, Token Stats, Top Holder Analysis, Top Trader Analysis, LP Analysis, Smart Money Holders and KOL Buy/Sell Signal. Each includes purpose-specific inputs, use cases, Birdeye API references, normalized evidence tables, bounded CU plans and explicit missing-data/pagination limits.

- Standalone `birdeye-api` entrypoint with `/price-surge` and Solana `/token-dd`, caller-supplied Birdeye keys in `X-API-KEY`, per-request server CU ceilings, durable checkpoints and graceful cancellation. Each request uses its caller's key without persisting it or falling back to server credentials; estimates need no key. The research API runs independently of the CLI web interface; clients must migrate the old UI `/price-surge` route to this service.

- Price Surge Screen: an aggregate `/price-surge` internal API, matching `birdeye-cli price-surge` command and installable `skill-price-surge` package. Includes server-side market filters, two-pass risk screening, bounded multi-chain enrichment, source evidence, CU budgets and installation/API documentation.

- Public HTTPS reverse-proxy support for browser storage mode via `--public-url`, while serving only static assets and keeping user workspaces in the browser.

- A browser-only static research demo with password-encrypted IndexedDB keys/history, temporary sessions, direct CORS-enabled provider calls, automatic locking, and `--storage browser` preview without SQLite.

- A scripted landing-page demo with UI/CLI playback, three research scenarios, timeline controls, JSON scripts and a self-contained offline HTML export.
- An npm installation quickstart and bundled installation/usage guides, available from the landing page and embedded documentation.
- A standalone Next.js landing and documentation app with an embeddable library, portable React components, searchable skills/workflows, and a generated JSON catalog that refreshes from source edits.
- English installation and usage guides, with the complete Vietnamese reference preserved as `README.vi.md`.
- MIT license, contribution and security guidance, and a public-release readiness review.
- A release process and CI checks requiring changelog updates for repository changes.
- An isolated tarball installation smoke test covering CLI version/help, offline estimates, bundled knowledge and the local web interface.

### Changed

- Descriptions, use cases, capabilities, agent prompts, chain summaries, limitations and illustrative samples for all 20 current skills now have one editable source in `catalog/skill-content.json`. API list/view expose the authored fields and `sample_output.example` while retaining generated CLI parameters and the JSON CU preview. Installable skill descriptions/instructions and the landing catalog synchronize from that source. Skill icon URLs use `#00ffa3`.

- GET `/agent/api/skills` now returns complete view data for every skill, including capabilities, agent prompts, CLI parameters and sample output, so frontends can cache the list for detail navigation. Category filters preserve the full objects and GET does not increment view/download counters.

- Skill list, view and download responses now share canonical `skill_id`, `demo_path` and advertised aliases with both demo hosts. View/download/stat accept short IDs and Price Surge spelling aliases and count them under the existing canonical ID; download now returns the skill summary and installation instructions in `data`.

- Eight token-data skill demos now open with task-specific summaries: launch screening, security controls, rolling activity, holder/trader comparisons, pool liquidity and cohort flow. Search, sorting, selection and timeline inspection replace the initial wall of tables; complete evidence remains available in disclosures, with missing values and scope limits preserved.

- Skills API `/agent/api/skills/view` now returns detail content for all 20 current skills: core capabilities, agent prompts, CLI parameter tables, demo paths and reproducible offline cost-preview samples, together with atomically updated view/download counts. Catalog schema v4 adds the detail data; deploy the matching service and catalog together. Skill-list, download and stat response shapes remain unchanged.

- Updated Trade Data and Markets reservations to 12 and 25 CU from current public endpoint documentation. New cohort reports use historical tracker buckets; rolling stats and trader rankings reject historical timestamp inputs.

- Local and browser-only demo skill filters now share Agent API category IDs, titles and public-skill counts; archived workflows are excluded consistently.

- Every current skill now states its implemented chains and evidence limits in its generated instructions and catalog usage. Added an all-skill support matrix, clarified compatibility packages, and corrected stale Solana-only guidance and retired skill installation examples.

- Workflows now own metadata, validation and planning in individual modules registered once; CLI IDs, commands, request scopes and CU accounting remain compatible.
- Agent skill packages carry their own reference documents, synchronized from canonical sources with isolated-package link checks. The `token-dd-score` executable moves into the CLI's `bin/` directory; its installed command stays unchanged.
- Public API and landing now expose one catalog of 23 skills with descriptions and usage instructions. Each skill has a generated, independently installable `SKILL.md`; four older broad packages remain available only for compatibility. Existing skill IDs, event routes and counters are preserved. Complex step plans and overlapping capabilities are recorded separately in `docs/SKILL_REVIEW.md` for maintainer review.

- Internal source documents, planning/research notes and their knowledge copies are excluded from public source and package distributions; private files remain available locally.
- Public-file checks reject tracked/internal package paths and provide a full-history check before public release.

- Package metadata now links to the repository, issues and documentation; user guides, license and changelog ship with the tarball.
- CI now covers the minimum Node version on Linux, Node 24 on Linux and Node 22 on macOS.

### Fixed

- Browser preview startup now reports `ADDRESS_IN_USE` with the occupied bind address and recovery instructions instead of a generic `INTERNAL_ERROR` when another process already uses the port.

- Selecting a skill or switching to a category with a different selected skill now updates the demo URL. Browser Back/Forward restores the skill and its category without reloading the workspace or creating duplicate history entries.

- Demo preview on port 8787 now opens current skills directly via `/<skill-id>` in browser and SQLite modes. Short skill IDs and Price Surge Screen aliases redirect to the canonical skill URL, preserving query parameters; unknown routes remain 404.

- Smart Money Profile and legacy wallet workflows now use one trade time cursor instead of the invalid two-bound request. Net-worth history sends and validates UTC `YYYY-MM-DD HH:mm:ss` values instead of Unix strings.
- Token Security Check, Token DD, Contract DD and RugCheck Audit now share Solana authority normalization: explicit null authorities mean inactive, missing/malformed values remain unknown, and mint evidence falls back to `ownerAddress` instead of requiring an absent `mintable` field. Reports disclose the interpretation basis.

- Landing and embedded documentation use a green design system with neutral charcoal surfaces, replacing the incorrectly inherited blue console palette.
- Workflow import tests no longer require an untracked `birdeye-data-skills` checkout.
- The lockfile includes esbuild packages for all supported platforms, so `npm ci` succeeds from a clean checkout.
- `npm test` builds the production entrypoints first, so tests do not depend on a stale or pre-existing `dist` directory.

## Development baseline: 0.4.0 (not a tagged release)

The local checkout had no release tags or project changelog when this file was introduced on 2026-10-23. Earlier commits reused `0.4.0`; the entries below summarize observable development history and do not claim separate published releases.

### Added

- Solana data commands, CU estimates and budgets, SQLite configuration/usage/history, and a local research interface.
- Optional AI chat, bundled documentation search, MCP discovery/calls, workflow imports and live-demo recipes.
- Workflow CLI command previews and token due-diligence scoring updates.

### Fixed

- Connection codes can be reused by multiple browsers within one server session and expire on restart.
- Public URL handling supports an HTTPS reverse proxy forwarding to loopback.

See [development history](https://github.com/birdeye-so/birdeye_cli/commits/main/) for individual commits. Published versions will use dated sections and immutable `vX.Y.Z` tags; release notes must identify breaking changes, migration steps and known limitations.
