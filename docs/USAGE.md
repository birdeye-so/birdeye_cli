# Usage

[Back to README](../README.md) · [Full flags and command reference (Vietnamese)](../README.vi.md#cli-arguments)

## Discover commands

Use `birdeye-cli price-surge --help` for market-cap and momentum screening, risk flags and bounded advanced enrichment. The same aggregate result is available through `POST /price-surge` on the separate `birdeye-api` service. `POST /token-dd` exposes Solana Token DD standard/advanced scoring. See the [Price Surge command reference](workflows/price-surge.md) and [standalone API setup, authentication and limits](workflows/internal-api.md). The CLI web interface has its own process and login; it no longer serves the aggregate `/price-surge` route.

```bash
birdeye-cli --help
birdeye-cli token --help
birdeye-cli token price --help
birdeye-cli capabilities --short
birdeye-cli cases --short
```

`capabilities` includes schemas, estimated CU costs and each raw operation's `chains`; `cases` includes each current skill's `supportedChains` and `limitations`. Price Surge supports `solana`, `bsc`, `base`, `ethereum` and `robinhood`. The other 19 current skills are Solana-only. Raw Token List V3, token security and top-trader calls also accept those five chains, which does not extend complete skill support. Parameters and chain restrictions are validated before requests. See [all skill scopes and limitations](workflows/skill-support.md) and [token data skills: purposes, use cases and APIs](workflows/token-data-skills.md).

## Costs and output

```bash
# Offline estimate; no API key needed.
birdeye-cli token price So11111111111111111111111111111111111111112 --estimate-cu
# Live data; consumes Birdeye CU.
birdeye-cli token price So11111111111111111111111111111111111111112 --max-cu 3 --short
# Read the local usage ledger.
birdeye-cli usage show --short
```

JSON is the default format. `--format table` selects tabular output; `--short` produces compact output. `--max-cu` limits documented estimates for a run; `--session-max-cu` limits an interface session. Retry attempts can use additional CU. Estimates are not a guarantee of provider billing.

MCP tools have no local price catalog. Calls are recorded with unknown cost and are not included in known-cost totals; a numeric budget cannot guarantee the bill for unpriced calls. A zero budget blocks MCP data calls. Saved-only chat blocks all MCP requests, including discovery. AI token charges are separate from CU.

| Exit code | Meaning |
| --- | --- |
| 0 | Success, including help/version and valid estimates |
| 1 | Other application, network, provider or storage error; Commander parse errors also use this code |
| 2 | Application input validation error (`INVALID_INPUT`) |
| 3 | Authentication error whose code starts with `AUTH` |
| 4 | CU budget exceeded |
| 5 | Partial workflow result; inspect coverage and missing evidence |

Read stdout for result JSON and stderr for errors/warnings. Do not retry paid workflows automatically just because they returned partial data. Unknown command/option errors may be plain Commander text rather than the application JSON error envelope.

## Workflows and history

```bash
birdeye-cli case --help
birdeye-cli history list --limit 20 --short
birdeye-cli workflow imports --help
```

Use the [workflow guides](workflows/README.md) for recipe-specific parameters. In the UI, select a workflow, supply the requested address, inspect the cost and run. Copy its **CLI command** to reproduce the selected parameters in a terminal.

Imports can map supported Markdown workflows or validate a version 1 workflow JSON definition. Importing a public GitHub URL makes network requests to GitHub but does not spend Birdeye CU. Previewing a saved definition is free; running it consumes CU. Unknown Markdown is not executed as shell code. [Import examples](workflows/import-examples/) are bundled with the package.

History keeps results locally across restarts. Reading/exporting a saved result does not fetch new data. Opening a fresh workflow or allowing live requests in chat can do so.

## Optional AI chat

Use **Settings → AI provider** in the local UI, or:

```bash
birdeye-cli config ai init --api-format responses --save-key
birdeye-cli config ai show --short
```

Supply a provider base URL, model and key through the prompts. Use `--api-format chat-completions` if that is the provider's supported format. The base URL must not already end in `/responses` or `/chat/completions`. The provider must support tool/function calling for research tools. Saving the provider in the UI, or opening **Ask AI**, sends one small test request; Settings and Ask AI warn when the model does not call the test tool or the provider rejects tools.

`birdeye-cli doctor --ai --short` sends a provider request and may incur AI charges. Restart an already running UI after changing config through the CLI. When using saved-only chat, Birdeye calls are blocked but AI usage can still be billed. The provider receives the question and selected research/documentation context.

## Common errors

| Symptom | What to check |
| --- | --- |
| Birdeye 401/403 | API key, account plan and endpoint permissions; `doctor --live` uses CU. |
| AI 404 or missing provider | Base URL, model, API format, key environment override and saved profile. |
| `CU_BUDGET_EXCEEDED` | Review the estimate, reduce workflow scope or explicitly increase the budget. |
| `ORIGIN_DENIED` | Use the exact UI URL printed by the server; check Host/Origin headers for a proxy. |
| Settings disappear after restart | Check the save checkbox, OS user, config directory and environment overrides. |
| Data is missing or partial | Read per-source coverage and timestamps; provider availability is not guaranteed. |

Before reporting a bug, include `birdeye-cli --version`, `node --version`, OS, the redacted command, error code and expected result. Never attach `config.sqlite`, real keys, session cookies or unredacted private research.
