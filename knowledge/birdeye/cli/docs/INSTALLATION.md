# Install Birdeye CLI and agent skills

For Price Surge, complete the CLI setup below, then run `npx skills add ./skills --skill skill-price-surge --global` from your checkout. Verify without an API key using `birdeye-cli price-surge --estimate-cu`; the standard plan is 50 CU. See [Price Surge setup and API](workflows/price-surge.md).

[Back to README](../README.md) · [Usage](USAGE.md) · [中文安装指南](#中文安装指南)

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

To run the independent research API, run `birdeye-api --port 8788 --max-cu 320`. From a built checkout, use `npm run api:start -- --port 8788 --max-cu 320`. It serves Price Surge and Solana Token Due-Diligent Score without starting the web interface. Each live client request supplies the user's Birdeye key in `X-API-KEY`; the API needs no server key or separate internal token. Read the [standalone API setup and request examples](workflows/internal-api.md) for credentials, supported chains and limits.

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

npm installs runtime dependencies and creates the `birdeye-cli`, `birdeye-api` and `token-dd-score` executables. No build tools are needed by the tarball recipient. Do not substitute `npm install -g birdeye-cli`: registry distribution is not configured for this project yet.

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
| `skill-price-surge` | Momentum within a market-cap band and bounded risk screening | Use skill-price-surge to estimate a Base screen; explain which checks are unavailable on that chain. |
| `skill-trending-list` | Trending tokens, market discovery and smart-money research | Use skill-trending-list to plan a Solana trending-token scan. Show the CU estimate without fetching data. |
| `skill-contract-dd` | Token overview, security, holder distribution and optional candles | Use skill-contract-dd to research PUMP at `pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn`. Show the plan and CU estimate first. |
| `skill-wallet-analysis` | Wallet holdings, performance and activity | Use skill-wallet-analysis to plan analysis of `GNRgBxkRFnyLYUTX8DSs3SM3Wm4jYSHQn6JQQVXapoRc`, keeping 7d and 30d PnL separate. Estimate only. |
| `skill-token-dd-score` | Token Due-Diligent Score, evidence coverage and saved-run re-scoring | Use skill-token-dd-score to estimate an advanced PUMP review. Explain the checks and missing evidence. Do not fetch yet. |

The catalog has 20 current skills; four older instruction packages remain for compatibility. Price Surge supports Solana, BSC, Base, Ethereum and Robinhood. The other 19 current skills are Solana-only. See the [complete chain-support and limitations matrix](workflows/skill-support.md) before selecting a skill. Skills perform research, not trading or continuous monitoring.

### 2. Install the instructions

Requires npm and an agent supported by the third-party [Skills CLI](https://github.com/vercel-labs/skills). Use your existing source checkout from [Option A](#option-a-build-from-the-repository), and run from its root:

```bash
# Discover skill names without installing anything.
npx skills add ./skills --list

# Install one skill; select your agent if prompted.
npx skills add ./skills --skill skill-trending-list --global

# Or install these example skills.
npx skills add ./skills --skill skill-trending-list skill-contract-dd skill-wallet-analysis skill-token-dd-score --global
```

`--global` installs for your user rather than the current project. Omit it for a project-scoped installation. To choose the target explicitly, append `--agent claude-code` or `--agent codex`, for example:

```bash
npx skills add ./skills --skill skill-contract-dd --global --agent claude-code
npx skills add ./skills --skill skill-contract-dd --global --agent codex
```

These commands install instructions for the chosen agent, not the agent application itself. An installer invoked from inside an agent may auto-select that agent; check its reported destination. Reopen the agent session after installing.

For direct GitHub installation, use the skills subdirectory to avoid discovering generated documentation copies:

```bash
npx skills add https://github.com/birdeye-so/birdeye_cli/tree/main/skills --skill skill-trending-list --global
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

Each skill includes its instructions and any referenced files inside its own directory. Install the CLI separately and use the installed `birdeye-cli` or `token-dd-score` executable from any directory.

### 4. Verify the agent can use it

In a new agent session, send:

```text
Use skill-trending-list. Confirm you can read its SKILL.md and find the
birdeye-cli executable. Run:
birdeye-cli case skill-trending-list --estimate-cu --short
Summarize the planned requests and estimated CU. Do not fetch live data.
```

A successful setup means the agent finds the installed skill, can execute the CLI, and returns an estimate. A successful skills install alone does not prove the CLI or API key works. For live research, give the agent the subject and an explicit CU budget; it should use `--max-cu` and report coverage and missing data.

### Update, remove and troubleshoot skills

Re-run the same `npx skills add` command after updating your source checkout to a reviewed revision, or use the GitHub source to reinstall. Update the CLI separately using [Update and rollback](#update-and-rollback); installing new instructions does not upgrade the executable.

```bash
# Remove only this global skill; the installer selects the target agent.
npx skills remove skill-trending-list --global
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


## 中文安装指南

本指南介绍如何为 AI 助手安装 Birdeye skills，并配置运行这些技能所需的 CLI。也可以直接复制 [README 中的中文安装提示词](../README.md#中文复制给-ai-助手)交给助手完成。

需要 Node.js **22.16.0 或更新版本**及 npm。支持 macOS、Linux；Windows 用户请使用 WSL。Price Surge 支持 Solana、BSC、Base、Ethereum 和 Robinhood；其他当前 skill 仅支持 Solana。不执行交易，也不需要钱包私钥。

### 1. 选择需要的 skill

| Skill 名称 | 用途 |
| --- | --- |
| `skill-price-surge` | 按市值和涨幅筛选代币，并在限定 CU 内补充风险证据 |
| `skill-trending-list` | 热门代币、市场发现、聪明钱研究 |
| `skill-contract-dd` | 代币概览、安全检查、持有人分布和可选 K 线分析 |
| `skill-wallet-analysis` | 钱包持仓、盈亏和交易活动分析 |
| `skill-token-dd-score` | 代币尽调评分、证据覆盖率及已保存结果的重新评分 |

上表为 12 个当前 skill 中的示例；另有 4 个兼容指令包。Price Surge 支持 Solana、BSC、Base、Ethereum 和 Robinhood，其余 11 个当前 skill 仅支持 Solana。每个 skill 的范围和限制见[完整支持矩阵](workflows/skill-support.md)。安装 skill 只会注册助手指令，**不会自动安装 CLI，也不会配置 API key**。

### 2. 安装 skill 指令

如果已经获取了本仓库，请在仓库根目录运行：

```bash
# 查看可用技能，不执行安装
npx skills add ./skills --list

# 安装一个技能
npx skills add ./skills --skill skill-trending-list --global

# 或安装全部四个技能
npx skills add ./skills --skill skill-trending-list skill-contract-dd skill-wallet-analysis skill-token-dd-score --global
```

`--global` 表示安装到当前用户范围；省略它则安装到当前项目。按提示选择使用的 AI 助手，也可以明确指定目标：

```bash
# Claude Code
npx skills add ./skills --skill skill-contract-dd --global --agent claude-code

# Codex
npx skills add ./skills --skill skill-contract-dd --global --agent codex
```

安装器可能自动识别当前助手，请检查输出中的安装位置。完成后重新打开助手会话。这些命令安装的是 skill 指令，不是助手应用本身。

如果 Git 凭据具有仓库访问权限，也可以直接从 GitHub 安装：

```bash
npx skills add https://github.com/birdeye-so/birdeye_cli/tree/main/skills --skill skill-trending-list --global
```

将 `skill-trending-list` 替换为表中的其他名称即可选择对应技能。若 HTTPS 提示认证失败，请使用具有权限的本地仓库；如果 SSH key 已获授权，也可以通过 `git clone git@github.com:birdeye-so/birdeye_cli.git` 获取仓库。不要假设该仓库支持匿名访问。

### 3. 单独安装 CLI

尚未获取源码时，先执行：

```bash
git clone https://github.com/birdeye-so/birdeye_cli.git
cd birdeye_cli
```

已有仓库时直接进入其根目录，然后构建并打包：

```bash
npm ci
npm run build
npm pack
npm install --global ./birdeye-cli-0.4.0.tgz
birdeye-cli --version
birdeye-cli --help
```

请使用 `npm pack` 实际输出的文件名，版本号可能不同。如果维护者已经提供构建好的 `.tgz` 文件，只需执行全局安装和验证命令，无需重新构建。当前不支持通过 `npm install -g birdeye-cli` 从 npm registry 安装。

每个 skill 的说明和引用文件都包含在自己的目录中，可以单独安装。CLI 需要另外安装；请在任意目录使用已安装的 `birdeye-cli` 或 `token-dd-score` 命令。

### 4. 配置 API key 并验证

先执行不需要 API key 的成本估算：

```bash
birdeye-cli case skill-trending-list --estimate-cu --short
```

该命令不会请求实时数据，也不消耗 Birdeye CU。若要查询实时数据，请使用自己的 [Birdeye API key](https://data.birdeye.so/)，并在本地终端输入：

```bash
birdeye-cli config init
birdeye-cli doctor --short
```

在 `config init` 的隐藏输入提示中填写密钥，不要将其发送到聊天或写入 skill 文件。本仓库不提供公共演示密钥。网页 demo 播放的是已保存的数据快照，不需要用户的 key，也不能用来验证实时 API 权限。

`doctor --short` 只检查本地配置。准备好调用实时接口后，可选执行 `birdeye-cli doctor --live --short`；该操作会使用 CU，且只验证它调用的接口。

在新的助手会话中发送以下提示词：

```text
请使用 skill-trending-list，确认你能读取它的 SKILL.md 并找到 birdeye-cli 命令。
执行 birdeye-cli case skill-trending-list --estimate-cu --short，
总结计划请求的接口和预计消耗的 CU。不要获取实时数据。
```

助手能够找到 skill、执行 CLI 并返回估算结果，才说明基本安装完成。进行实时研究时，请提供代币或钱包地址及明确的 CU 预算，让助手使用 `--max-cu`，并说明结果覆盖范围和缺失数据。成本估算成功并不代表 API key 有效或拥有全部接口权限。

### 5. 更新、卸载和常见问题

更新源码后，重新执行相同的 `npx skills add` 命令以更新指令。CLI 需要单独重新构建、打包和安装；更新 skill 不会升级 CLI。更新 CLI 前请参考英文版的 [Update and rollback](#update-and-rollback) 备份配置与历史记录。

```bash
# 仅移除当前用户范围内的 skill-trending-list 技能
npx skills remove skill-trending-list --global
```

移除 skill 不会删除 CLI 的配置或研究历史。

| 问题 | 处理方法 |
| --- | --- |
| GitHub 认证失败 | 使用有仓库权限的 Git 凭据，或从已授权的本地仓库安装。 |
| 助手找不到 skill | 检查安装目标和用户/项目范围，然后重新打开会话。 |
| `birdeye-cli: command not found` | 单独安装 CLI，检查 PATH，并重启助手进程。 |
| 引用文档或 `dist/index.js` 不存在 | 使用完整源码/安装包查阅文档，并调用已安装的 CLI，不要运行复制的包装脚本。 |
| 估算成功但实时请求失败 | 检查本地 API key 及接口权限；估算不会验证凭据。 |
