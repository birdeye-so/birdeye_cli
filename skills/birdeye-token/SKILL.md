---
name: birdeye-token
description: Research Solana tokens with Birdeye CLI due diligence, deep reports, holder cohorts, money flow and risk review. Use for token identity, security, ownership and market evidence with CU accounting.
---

Requires the separately installed `birdeye-cli` (Node.js >=22.16) and configured Birdeye credentials. Run the commands below from any directory; prefix `case`, `token`, `market`, `portfolio`, `cases`, `capabilities`, `workflow` and `usage` commands with `birdeye-cli`.

## Supported chains and limitations

Compatibility package. These token research procedures support `solana` only. Some raw security/trader operations accept other chains, but that does not extend the complete research procedure.

The procedures fetch bounded pages and snapshots. They do not audit contract source, independently simulate honeypots or verify LP locks, or verify teams and social claims. Missing checks stay unknown; scores and observations do not prove safety. Current focused packages are `skill-token-dd-score`, `skill-contract-dd`, `skill-rugcheck-audit` and `skill-kline-pattern`.

## Use

Require a Solana contract address. `token search <keyword>` returns candidates; confirm the intended contract before research. Read `capabilities --short` for current inputs and `cases --short` for workflow names.

Choose the smallest workflow that answers the request:

- Scored due diligence: `case skill-token-dd-score --address <mint> --dd-mode advanced`. Use [Token Due-Diligent Score](references/scoring.md) for pillar formulas, coverage, provisional CU and zero-call SQLite re-score. This is a separate reconstructed risk heuristic; the existing observation-only Token DD recipe remains available.

- Reference collection: `case skill-token-dd`, `case skill-contract-dd`, `case skill-rugcheck-audit`, `case skill-kline-pattern`, each with `--address <address>`. See [reference workflows](references/birdeye-data-skills.md) for steps, costs and adaptations. Token DD supports `--include list,advanced_security,risk_history`; Contract Due-Diligent supports `--skip-kline`; candle recipes accept `--resolution` and `--window-days`.
- Kline scores are versioned heuristics using closed candles. Contract Due-Diligent and Token DD report observations, not the source's unsafe composite or Safe tier. RugCheck Audit uses Birdeye liquidity history, not RugCheck.org or price-derived liquidity; unresolved checks keep the report partial.

- `case token-due-diligence --address <address>`: identity and security checklist.
- `case token-research --address <address>`: overview, security and top holders; `--depth full` adds markets, one pair and holder profile.
- `case project-deep-report --address <address>`: on-chain report including pools, cohorts, candles and activity. Team, funding and social sentiment need separate evidence.
- `case risk-warning --address <address>`: security first; `--depth full` adds positions and cohort timeline. This is a snapshot review, not a scheduler.

Plan with `--estimate-cu --short` before execution. Keep execution inside the user's `--max-cu`; for multiple invocations create `workflow create --label token-research --max-cu <budget>` and pass its ID through `--workflow <id>`. Read the final aggregate from `usage show --workflow <id> --short`; do not sum cumulative response totals. Failed attempts may still be billed.

Apply `--min-liquidity`, `--max-top10-pct`, `--exclude-freezeable` only for user-selected criteria. Top10 policy measures token-account share, not unique-wallet concentration. Missing required fields stop that subject as insufficient-data. Report `missing`, `outcomes`, source time and scope alongside the findings; a completed recipe is not a safety guarantee.

For focused drilldown use `token markets`, `market pair-overview`, `token holder-profile`, `token holder-positions --labels dev,kol`, `token holder-distribution`, `token first-buyers`, `token tags-tracker`, or `token money-flow`. Use each command's `--help`; list flags accept comma-separated values, boolean flags require true/false. Tracker takes explicit `--time-from`/`--time-to`. Holder profile accepts smart_trader; money-flow accepts smart_money; tracker supports only dev/sniper/smart_trader/kol. Preserve provider classification and never sum overlapping cohorts.

Default to `--short`. Workflow short output previews at most five rows per source array and marks outputTruncation; use full output or an atomic command when all fetched rows matter. Atomic `token security --short` retains material fields. Preserve null, false, units, wallet/account basis and source IDs. Do not infer insider absence from unlabeled rows, sales from transfers, or withdrawal from USD liquidity decline.

Credentials belong in BIRDEYE_API_KEY or CLI Settings, never chat/flags. External agents do not need to configure an additional AI provider to call data commands.
