# Changelog

User-visible changes are recorded here using [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) categories and [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- A scripted landing-page demo with UI/CLI playback, three research scenarios, timeline controls, JSON scripts and a self-contained offline HTML export.
- An npm installation quickstart and bundled installation/usage guides, available from the landing page and embedded documentation.
- A standalone Next.js landing and documentation app with an embeddable library, portable React components, searchable skills/workflows, and a generated JSON catalog that refreshes from source edits.
- English installation and usage guides, with the complete Vietnamese reference preserved as `README.vi.md`.
- MIT license, contribution and security guidance, and a public-release readiness review.
- A release process and CI checks requiring changelog updates for repository changes.
- An isolated tarball installation smoke test covering CLI version/help, offline estimates, bundled knowledge and the local web interface.

### Changed

- Workflows now own metadata, validation and planning in individual modules registered once; CLI IDs, commands, request scopes and CU accounting remain compatible.
- Agent skill packages carry their own reference documents, synchronized from canonical sources with isolated-package link checks. The `token-dd-score` executable moves into the CLI's `bin/` directory; its installed command stays unchanged.
- Public API and landing now expose one catalog of 23 skills with descriptions and usage instructions. Each skill has a generated, independently installable `SKILL.md`; four older broad packages remain available only for compatibility. Existing skill IDs, event routes and counters are preserved. Complex step plans and overlapping capabilities are recorded separately in `docs/SKILL_REVIEW.md` for maintainer review.

- Internal source documents, planning/research notes and their knowledge copies are excluded from public source and package distributions; private files remain available locally.
- Public-file checks reject tracked/internal package paths and provide a full-history check before public release.

- Package metadata now links to the repository, issues and documentation; user guides, license and changelog ship with the tarball.
- CI now covers the minimum Node version on Linux, Node 24 on Linux and Node 22 on macOS.

### Fixed

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
