# Install Birdeye CLI and agent skills

[Back to README](../README.md) · [Usage](USAGE.md)

Install the built package with npm to use `birdeye-cli` from any directory. Registry installation (`npm install -g birdeye-cli`) is not available yet; use a maintainer-provided `.tgz` or build the package from source as described below.

For AI-agent setup, start with [Install agent skills](#install-agent-skills). For terminal or web-interface use, follow the CLI steps below. Installing the npm package alone does not register skills in an agent.

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

## Install agent skills

Use this flow to give your AI agent Birdeye capabilities: choose a skill, install its instructions, install the CLI runtime, configure a key for live queries, then verify. A copyable setup prompt is in the [README](../README.md#install-birdeye-skills-in-your-ai-agent).

### 1. Choose a skill

| Skill name | Use it for | Example prompt after setup |
| --- | --- | --- |
| `birdeye-market` | Trending tokens, market discovery and smart-money research | Use birdeye-market to plan a Solana trending-token scan. Show the CU estimate without fetching data. |
| `birdeye-token` | Token overview, holders, security and pool research | Use birdeye-token to research PUMP at `pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn`. Show the plan and CU estimate first. |
| `birdeye-portfolio` | Wallet holdings, performance and activity | Use birdeye-portfolio to plan analysis of `GNRgBxkRFnyLYUTX8DSs3SM3Wm4jYSHQn6JQQVXapoRc`, keeping 7d and 30d PnL separate. Estimate only. |
| `token-duediligence` | Token DD Score, evidence coverage and saved-run re-scoring | Use token-duediligence to estimate an advanced PUMP review. Explain the checks and missing evidence. Do not fetch yet. |

These are four agent skills, each covering one or more CLI workflows. Installing one skill does not install a separate skill for every workflow. Birdeye currently supports Solana research, not trading or continuous monitoring.

### 2. Install the instructions

Requires npm and an agent supported by the third-party [Skills CLI](https://github.com/vercel-labs/skills). Use your existing source checkout from [Option A](#option-a-build-from-the-repository), and run from its root:

```bash
# Discover skill names without installing anything.
npx skills add ./skills --list

# Install one skill; select your agent if prompted.
npx skills add ./skills --skill birdeye-market --global

# Or install all four.
npx skills add ./skills --skill birdeye-market birdeye-token birdeye-portfolio token-duediligence --global
```

`--global` installs for your user rather than the current project. Omit it for a project-scoped installation. To choose the target explicitly, append `--agent claude-code` or `--agent codex`, for example:

```bash
npx skills add ./skills --skill birdeye-token --global --agent claude-code
npx skills add ./skills --skill birdeye-token --global --agent codex
```

These commands install instructions for the chosen agent, not the agent application itself. An installer invoked from inside an agent may auto-select that agent; check its reported destination. Reopen the agent session after installing.

For direct GitHub installation, use the skills subdirectory to avoid discovering generated documentation copies:

```bash
npx skills add https://github.com/birdeye-so/birdeye_cli/tree/main/skills --skill birdeye-market --global
```

This requires Git access to the repository. If HTTPS reports authentication failure, use an authorized checkout (for example, clone with `git clone git@github.com:birdeye-so/birdeye_cli.git` if your SSH key has access), then run the local commands above. The command is not evidence that anonymous access is available.

### 3. Install the CLI and configure live access

Skills contain instructions; they do not run the CLI installation automatically. Complete [Option A](#option-a-build-from-the-repository) or [Option B](#option-b-install-a-built-tarball), then check from the terminal used by your agent:

```bash
birdeye-cli --version
birdeye-cli --help
birdeye-cli case skill-trending-list --estimate-cu --short
```

The estimate works without a key. For live queries, obtain your own [Birdeye API key](https://data.birdeye.so/) and enter it locally:

```bash
birdeye-cli config init
birdeye-cli doctor --short
```

Do not paste the key into agent chat or a skill file. Birdeye does not provide a public demo key in this repository. The landing demo uses a saved snapshot and does not validate your live API access. `doctor --live --short` is an optional paid API check; use it when you are ready to make a live request.

Keep the complete source checkout or installed npm package available for supporting files. Some skill links point outside their own folder (for example, `../../docs/workflows/birdeye-data-skills.md` or a sibling skill). A single-skill copy may not include those targets: open the corresponding file in the source checkout, or under `$(npm root -g)/birdeye-cli`, rather than assuming the copied link resolves. Tell the agent that source location when needed. Use the installed `birdeye-cli` or `token-dd-score` executable; do not run a copied `token-dd-score.mjs` from the agent's skill folder, because that wrapper expects the package's `dist/` tree.

### 4. Verify the agent can use it

In a new agent session, send:

```text
Use birdeye-market. Confirm you can read its SKILL.md and find the
birdeye-cli executable. Run:
birdeye-cli case skill-trending-list --estimate-cu --short
Summarize the planned requests and estimated CU. Do not fetch live data.
```

A successful setup means the agent finds the installed skill, can execute the CLI, and returns an estimate. A successful skills install alone does not prove the CLI or API key works. For live research, give the agent the subject and an explicit CU budget; it should use `--max-cu` and report coverage and missing data.

### Update, remove and troubleshoot skills

Re-run the same `npx skills add` command after updating your source checkout to a reviewed revision, or use the GitHub source to reinstall. Update the CLI separately using [Update and rollback](#update-and-rollback); installing new instructions does not upgrade the executable.

```bash
# Remove only this global skill; the installer selects the target agent.
npx skills remove birdeye-market --global
```

Removing skills leaves CLI configuration and research history intact.

| Symptom | Action |
| --- | --- |
| GitHub authentication failure | Use Git credentials with repository access or install from an authorized local checkout. |
| Skill installed but not discovered | Check the selected agent and installation scope, then reopen the agent session. |
| `birdeye-cli: command not found` inside the agent | Install the CLI separately and restart the agent so its process inherits the correct PATH. |
| Missing referenced docs or missing `dist/index.js` | Use the complete source/package for references and the installed CLI executable, not a copied wrapper. |
| Estimate works but live request fails | Check the local API key and endpoint access; estimates do not validate credentials. |

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
