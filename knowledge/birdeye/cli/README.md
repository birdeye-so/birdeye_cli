# Birdeye CLI

Query Solana token, market and wallet data from your terminal, or use a local web interface to run research workflows and explore saved results with optional AI chat.

[Installation](docs/INSTALLATION.md) · [Usage](docs/USAGE.md) · [Tiếng Việt / full command reference](README.vi.md) · [Changelog](CHANGELOG.md) · [Contributing](CONTRIBUTING.md)

Standalone website: [Next.js landing, embeddable docs and live catalog](apps/landing/README.md). Run `npm run landing:install` then `npm run landing:dev` to open it at `http://localhost:3001`.

## Project status

**Pre-1.0, under active development.** The current development version is `0.4.0`. No tagged release baseline is recorded in this checkout. The documented install paths are a source build or a maintainer-provided `.tgz`; installation from the npm registry is not a supported distribution path yet.

The CLI currently supports **Solana only**, even though the bundled provider documentation describes other chains. It reads data and does not execute trades or require a wallet private key.

## Requirements

- Node.js **22.16.0 or newer** and npm. Node's built-in SQLite stores configuration and history; no database server is needed.
- macOS or Linux with Bash/Zsh. On Windows, use WSL; native Windows is not currently validated.
- A [Birdeye API key](https://data.birdeye.so/) with access to the endpoints you use. Help, cost estimates and saved data do not need a key.
- An AI provider is optional. Data commands and workflows work without AI credentials.

## Install from source

```bash
git clone https://github.com/birdeye-so/birdeye_cli.git
cd birdeye_cli
npm ci
npm run build
node dist/index.js --version
node dist/index.js --help
```

To install the built CLI globally:

```bash
npm pack
npm install --global ./birdeye-cli-0.4.0.tgz
birdeye-cli --version
```

Use the filename printed by `npm pack` if the version differs. For a source-only installation, replace `birdeye-cli` below with `node dist/index.js` and run from the repository directory. See [installation](docs/INSTALLATION.md) for tarballs, updates, backups, uninstalling and PATH issues.

## First run

Save your Birdeye key through the hidden prompt, then check local configuration:

```bash
birdeye-cli config init
birdeye-cli config show --short
birdeye-cli doctor --short
```

Explore available commands and estimate a request **without spending CU**:

```bash
birdeye-cli capabilities --short
birdeye-cli cases --short
birdeye-cli token price So11111111111111111111111111111111111111112 --estimate-cu --short
```

Fetch a live price (**uses Birdeye CU**):

```bash
birdeye-cli token price So11111111111111111111111111111111111111112 --max-cu 3 --short
birdeye-cli usage show --short
```

`--estimate-cu` plans without calling the API. `--max-cu` caps documented cost estimates; actual provider billing can differ. `--short` reduces output size, not API cost. No CU limit is applied unless you set one. MCP tool costs may be unknown; see [usage and billing](docs/USAGE.md#costs-and-output).

## Local web interface

```bash
birdeye-cli --format interface --bind 127.0.0.1:8787 --max-cu 250 --session-max-cu 2000
```

Open `http://127.0.0.1:8787`. Configure connections in **Settings**, choose a workflow, inspect its estimate, then run it. **History** opens saved results without fetching them again. Keep the terminal open; press `Ctrl+C` to stop.

AI chat requires a provider base URL, model and API key in Settings. AI usage is billed separately from Birdeye CU. Disable **Allow new Birdeye requests** when chatting only about saved evidence.

The interface is a shared local workspace. Connected browsers share credentials, history and budgets; there are no per-user accounts. Use an [SSH tunnel](docs/INSTALLATION.md#remote-access) for remote access.

## Documentation

| Task | Guide |
| --- | --- |
| Install, update, back up or uninstall | [Installation](docs/INSTALLATION.md) |
| Commands, AI setup, output and troubleshooting | [Usage](docs/USAGE.md) |
| Full CLI flags and proxy setup (Vietnamese) | [Detailed reference](README.vi.md#cli-arguments) |
| Research recipes and imports | [Workflow guides](docs/workflows/README.md) |
| Track changes and compatibility | [Changelog](CHANGELOG.md) |
| Contribute or release a version | [Contributing](CONTRIBUTING.md), [Releasing](docs/RELEASING.md) |
| Report a vulnerability or understand storage | [Security](SECURITY.md) |

## Development

```bash
npm ci
npm run typecheck
npm test
npm run build
npm run check:changelog
npm run test:package
```

The automated suite uses fixtures and does not need real API keys. The package smoke test builds a tarball, installs it into a temporary prefix, and checks the installed CLI and web interface. See [contributing](CONTRIBUTING.md) for optional browser checks.

## Support and license

Report reproducible bugs through [GitHub Issues](https://github.com/birdeye-so/birdeye_cli/issues), including CLI/Node versions, operating system, a redacted command and expected versus actual results. Do not include API keys or configuration databases.

CLI code is licensed under [MIT](LICENSE). See [third-party notices](THIRD_PARTY_NOTICES.md) for bundled documentation and dependencies. Follow the [release checks](docs/RELEASING.md) before distributing a new version.
