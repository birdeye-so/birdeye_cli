# Install birdeye-cli with npm

[Back to README](../README.md) · [Usage](USAGE.md)

Install the built package with npm to use `birdeye-cli` from any directory. Registry installation (`npm install -g birdeye-cli`) is not available yet; use a maintainer-provided `.tgz` or build the package from source as described below.

## Quick install and run

Requires Node.js **22.16.0 or newer**, npm, and the package file. Run the installation command in the directory containing the `.tgz`; use the actual filename if its version differs.

```bash
npm install --global ./birdeye-cli-0.4.0.tgz
birdeye-cli --version
birdeye-cli --help
birdeye-cli config init
birdeye-cli doctor --short
birdeye-cli case skill-trending-list --estimate-cu --short
```

Enter your Birdeye API key in the hidden `config init` prompt. The estimate command does not fetch data or spend Birdeye CU. To run the workflow against Birdeye, remove `--estimate-cu`; that requires API access and uses CU.

To start the local interface:

```bash
birdeye-cli --format interface --bind 127.0.0.1:8787
```

Open `http://127.0.0.1:8787` and keep the terminal running. Press `Ctrl+C` to stop. Global installation creates the `birdeye-cli` executable; use it directly, rather than `npm run birdeye-cli`.

## Supported setup

Use Node.js >=22.16.0 and npm on macOS or Linux. WSL is the documented Windows route; native Windows has not been validated. The CI matrix checks the minimum Node version on Linux, Node 24 on Linux and Node 22 on macOS. Check the workflow results for the commit you install.

```bash
node --version
npm --version
```

Node 22 may print an experimental SQLite warning to stderr. It does not invalidate JSON output on stdout. You do not need Docker, Python or a SQLite server.

## Option A: build from the repository

```bash
git clone https://github.com/birdeye-so/birdeye_cli.git
cd birdeye_cli
npm ci
npm run build
node dist/index.js --version
node dist/index.js --help
```

Run source commands from the repository root. To use the examples in the other guides, replace `birdeye-cli` with `node dist/index.js`, or install globally:

```bash
npm pack
npm install --global ./birdeye-cli-0.4.0.tgz
birdeye-cli --version
```

`npm pack` builds automatically through `prepack`. Use the tarball filename it prints. A direct Git URL install is not a supported shortcut: this repository expects the explicit build/pack steps above.

## Option B: install a built tarball

Obtain a `.tgz` from the maintainers. Once tagged releases exist, use the assets attached to [GitHub Releases](https://github.com/birdeye-so/birdeye_cli/releases). Do not assume an asset exists just because a version appears in `package.json`.

```bash
# Run in the directory containing the downloaded file.
npm install --global ./birdeye-cli-0.4.0.tgz
birdeye-cli --version
birdeye-cli --help
```

npm installs runtime dependencies and creates the `birdeye-cli` and `token-dd-score` executables. No build tools are needed by the tarball recipient. Do not substitute `npm install -g birdeye-cli`: registry distribution is not configured for this project yet.

## Configure and verify

```bash
birdeye-cli config init
birdeye-cli config show --short
birdeye-cli doctor --short
birdeye-cli token price So11111111111111111111111111111111111111112 --estimate-cu --short
```

Enter the API key in the hidden prompt; do not put it in a command argument. Expect `birdeyeConfigured: true` and a price estimate of 3 CU in this version. These checks do not contact Birdeye.

To verify the key against Birdeye, run `birdeye-cli doctor --live --short`. This uses CU (1 CU before retries according to the current catalog) and validates only the endpoint it calls, not every endpoint in your plan.

## Configuration and backups

The default directory is `~/.config/birdeye`:

| File | Contents |
| --- | --- |
| `config.sqlite` | Saved Birdeye/AI keys and provider profiles |
| `usage.sqlite` | Usage ledger, research history, chat, imports and documentation index |

Keys are stored with private file permissions, **without encryption**. Protect backups as credentials. `birdeye-cli doctor --short` reports the actual directory.

Precedence: `--config-dir` overrides `BIRDEYE_CONFIG_DIR`, which overrides the default. `BIRDEYE_API_KEY` overrides the saved Birdeye key. The AI profile's key environment variable (default `BIRDEYE_AI_API_KEY`) overrides its saved key. The CLI does not load `.env` files automatically.

Stop all CLI processes using the directory before copying it:

```bash
birdeye_backup="$HOME/birdeye-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -m 700 "$birdeye_backup"
cp -R "${BIRDEYE_CONFIG_DIR:-$HOME/.config/birdeye}/." "$birdeye_backup/"
```

If you use `--config-dir`, use that directory as the source instead. You can inspect a backup with `birdeye-cli doctor --config-dir "$birdeye_backup" --short`. To restore, stop the CLI, preserve the current directory separately, then copy the complete backup to your chosen config directory. Keep its permissions private. Do not merge individual SQLite files from different snapshots.

## Update and rollback

Read the [changelog](../CHANGELOG.md), stop the UI and back up the data directory before updating.

- **Tarball/global:** install the new `.tgz` with `npm install --global ./<new-file>.tgz`, then check `birdeye-cli --version`.
- **Source:** fetch the intended reviewed commit/tag (or update a clean branch using `git pull --ff-only`), run `npm ci` and `npm run build`, then restart. Rebuild and reinstall the tarball separately if you also use the global command.

Refresh the browser after restart. Installing a package preserves configuration/history. Future schema changes may prevent older versions from reading newer databases: a rollback requires both the previous package and its matching pre-upgrade data backup. Follow version-specific migration notes; do not assume a package downgrade reverses a database migration.

## Uninstall

```bash
npm uninstall --global birdeye-cli
```

This removes the CLI executables but keeps configuration and history. If you also want to erase saved keys/data, stop the CLI, confirm the exact directory with `doctor` before uninstalling, then remove that directory yourself. A source checkout can be removed separately.

## Remote access

Run on the server:

```bash
birdeye-cli --format interface --bind 127.0.0.1:8787 --require-code
```

On your own computer:

```bash
ssh -N -L 8787:127.0.0.1:8787 user@remote-host
```

Open `http://127.0.0.1:8787` and enter the code printed by the server. Keep the same port at both ends for Host/Origin validation. Codes are reusable within a server session and expire on restart. Everyone connected shares the same workspace. Reverse proxy and HTTPS instructions are in the [Vietnamese guide](../README.vi.md).

## Installation troubleshooting

| Symptom | Action |
| --- | --- |
| `EBADENGINE` or missing `node:sqlite` | Select Node >=22.16.0, then reinstall with that Node version. |
| `command not found` | Check `npm list -g --depth=0`, `npm prefix -g` and `command -v birdeye-cli`. Ensure the prefix's `bin` directory is on PATH. |
| Installed with nvm, then command disappears | Global packages belong to each Node installation. Select the same Node version with `nvm use 22` or reinstall under the intended version. |
| `EACCES` during global install | Use a user-owned Node installation/prefix or run from source. Avoid `sudo npm install` with nvm. |
| Missing `dist/index.js` | Run `npm ci` and `npm run build` in the source checkout. |
| UI displays an old build | Stop the old process, check which CLI is on PATH, reinstall the new tarball if needed, restart and refresh. |
| Port in use | Choose another port with `--bind 127.0.0.1:8788`; use it in the browser and tunnel as well. |
