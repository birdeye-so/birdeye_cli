# Security

## Reporting

Do not report credentials or exploitable vulnerability details in a public issue. Use GitHub's **Security → Report a vulnerability** on this repository when private reporting is enabled. Maintainers must enable and verify this channel before making the repository public. No response-time commitment or security support window is established yet; pre-1.0 releases are under active development.

Include affected version/commit, reproduction steps, impact and a redacted proof of concept. Never include working API keys. If private reporting is unavailable, ask maintainers to enable a private reporting channel without disclosing the vulnerability publicly.

## Local data and access

Configuration keys are stored in `config.sqlite` with private filesystem permissions, not encrypted. Research history, imports and chats are stored in `usage.sqlite`. Protect the whole config directory and its backups. Environment credentials override saved credentials; `.env` is not loaded automatically.

The web interface is one shared workspace. Connected users can access shared data and consume the configured API budget. Connection codes are reusable until restart; this is not per-user authentication or isolation. Prefer loopback with an SSH tunnel for remote use. Review public URL, TLS and proxy settings before any Internet exposure.

AI providers receive prompts and selected evidence/context. Birdeye and MCP requests use configured credentials. Review what data you send to each service. The CLI does not need wallet seed phrases or private keys.

## Maintainer release checks

Review tracked files and Git history for secrets and confidential content before changing repository visibility. Removing a file from the current tree does not erase earlier commits. Rotate any exposed credential and coordinate history cleanup before public release. Check dependency advisories and third-party redistribution terms for every release.

## Provider credentials in the shared interface

Only AI profiles configured by the process owner before startup may use environment credentials. The interface binds each profile name and environment variable to its startup provider origin. Settings-created profiles and changes to another origin disable environment lookup (stored as an empty `apiKeyEnv`); provide an explicit key for that provider. This restriction survives restart. To authorize a new environment-backed provider, configure it from the CLI and restart. The shared SQLite interface still grants connected users access to shared research and settings; use browser storage for public demos.

## Release gates

Run `node scripts/check-public-files.mjs --history`, `node scripts/check-secrets.mjs --history`, dependency audits for all three packages, and the package smoke test before publishing. The literal scanner redacts findings and checks common API key/private-key/token patterns; supplement it with full secret scanning and review. Documentation synchronization replaces literal API-key examples with placeholders, and package smoke tests scan the installed tarball. Removing a credential from source/history does not revoke it: revoke or rotate it with its owner before treating an exposure as resolved.
