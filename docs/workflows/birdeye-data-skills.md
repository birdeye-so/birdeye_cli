# Workflows from Birdeye Data Skills

Implemented from [TheNang2710/birdeye-data-skills](https://github.com/TheNang2710/birdeye-data-skills), commit `5dd7833a161e76ef2a3da74233af548a2eccb4d5`. The local reference is `../../birdeye-data-skills` from this directory. Eleven analysis skills are present in source; the README's count of twelve is inaccurate. [Research and API mapping](../research/birdeye-data-skills.md) records source conflicts and adaptations.

These recipes use `case skill-<name>` so the earlier GMGN-inspired commands retain their behavior. UI names match the source and are grouped into Discover, Token and Wallet. Earlier workflows remain in their own group. All execution is Solana-only and goes through the same validated API wrappers, retry accounting and CU budgets. No upstream Python process or third-party RugCheck service is required.

## Steps and default CU

Costs are upper estimates before retries. Each requested page/attempt is charged separately; repeated identical requests within a run are deduplicated.

| Group | Workflow | API steps | Default CU |
|---|---|---|---:|
| Discover | `skill-trending-list` | V3 token list; native trending can replace it | 50; native 25 |
| Discover | `skill-smart-wallets` | Smart-money tokens → top traders per selected token → wallet deduplication; standard adds PnL; deep adds holdings/details | fast 110; standard 170; deep 320 at limit 3 |
| Token | `skill-token-dd` | Overview → security → token-specific smart-money flow | 58 |
| Token | `skill-contract-dd` | Overview → security → holder distribution → optional OHLCV | 178; skip kline 78 |
| Token | `skill-rugcheck-audit` | Overview → security → holders → holder groups → measured liquidity history | 258 |
| Token | `skill-kline-pattern` | OHLCV → closed-candle measurements → pattern and heuristic score | 100 |
| Wallet | `skill-wallet-score` | 30d/90d/24h PnL → 30d positions → holdings → first funding | 150 |
| Wallet | `skill-wallet-style` | Chosen-period PnL → positions → first funding → transactions | 140 |
| Wallet | `skill-wallet-analysis` | PnL 24h/7d/30d/90d/all → positions → holdings → first funding → transactions | 240 |
| Wallet | `skill-smart-money-profile` | 7d/30d PnL → positions → holdings → first funding → trader swaps → net-worth history | 190 |
| Wallet | `skill-smart-money-leaderboard` | 7d/30d PnL + position page for each explicit wallet | 70 per unique wallet |

Token DD `--include list,advanced_security,risk_history` adds holders (30), holder groups (30) and liquidity history (150 default). First funding costs 40 per wallet; transaction pages cost 50. Skip flags remove the associated steps. Smart Wallets uses at most five selected tokens and five selected wallets; provider rows are deduplicated, not automatically replaced. Smart-money discovery fetches at most 20 token rows.

Liquidity-history CU reserves the highest documented lookback multiplier: 60 at 1m, 150 at 4h, 600 at 1D, for at most 100 snapshots. Editing the resolution changes plan, preview and request reservation together. It is an upper bound, not a claim about the account's billed CU. OHLCV retains the existing 100-CU upper bound; candle windows above 5000 supported intervals must be narrowed.

## Configure and run

```bash
# Free: no key and no Birdeye request
node dist/index.js cases --short
node dist/index.js case skill-trending-list --estimate-cu --short
node dist/index.js case skill-smart-wallets --skill-depth deep --limit 3 --estimate-cu --short
node dist/index.js case skill-kline-pattern --address So11111111111111111111111111111111111111112 --resolution 1H --window-days 7 --estimate-cu --short
node dist/index.js case skill-wallet-score --address So11111111111111111111111111111111111111112 --skip-first-funded --estimate-cu --short
node dist/index.js case skill-smart-money-leaderboard --wallets So11111111111111111111111111111111111111112,11111111111111111111111111111112 --estimate-cu --short

# Interface: planning remains free; Run research uses configured Birdeye credentials
node dist/index.js --format interface --bind 127.0.0.1:8787

# Live: costs up to 50 CU before retries; requires BIRDEYE_API_KEY
node dist/index.js case skill-trending-list --scan-limit 20 --max-cu 50 --short
```

Use `case --help` for flags. Wallet Analysis accepts `--intervals 7d,30d`; leaderboard accepts up to ten valid addresses, deduplicated before planning. Wallet Score fixes summary windows to 30d/90d/24h and position duration to 30d; Wallet Style supports 7d or 30d. `--skip-first-funded`, `--skip-transactions`, `--skip-portfolio`, `--skip-positions` affect relevant wallet recipes. `--skip-kline` affects Contract DD.

In UI, select a group and skill, read Purpose/What you get, then configure the relevant inputs. Workflow overview shows method/path, information, purpose, subject dependencies, per-request CU and editable API parameters. Leaderboard steps identify their individual wallet. Edits are schema-validated; invalid input disables execution. Changing recipe settings resets step edits. Source switching clears incompatible platform/sort settings. Preview and run share normalized input and fixed observation time.

## Derived results and deliberate differences

Results contain `data.skillAnalysis.findings` with formula version, source IDs, measurements, missing inputs and calculation basis. UI renders scores, components, styles and wallet rankings, with full evidence available in a disclosure and JSON export. Existing Sources and CU displays remain available.

- **Kline:** implements source module's eleven first-match patterns and score deltas; uses only valid closed candles. Duplicate timestamps are deduplicated; gaps and invalid candles are counted. At least eight closed candles are required. A missing volume baseline is explicit and receives no volume adjustment. Observed highs/lows are window extrema, not lifetime levels or a forecast. Uses floating-point arithmetic for heuristic ratios/scores, not for accounting totals.
- **Wallet alpha:** follows source v3.2 profitability/consistency/quality/activity weights (35/35/20/10) and sustainability caps. Requires valid fixed-window, matching-method inputs. Win rate derives from win/loss counts; no magnitude-based percent guessing. Missing required data returns null. Positions are a fetched page, so this is a sampled heuristic, not a wallet-wide backtest. Copyability proxies and source recommendation tiers are not emitted.
- **Wallet style:** frequency × realized ROI classification; uses documented ratio units and a corrected -50% loss threshold. Gives neutral descriptive labels. Incomplete data is unavailable. No estimated holding time is presented as an observed fact.
- **Leaderboard:** compares only fully observed supplied wallets; fixes source's reversed PnL percentile. Ties share percentile; constant min/max factors are neutral. Missing wallets remain unranked. The comparison score is not Wallet Score alpha.
- **Token DD / Contract DD:** retain identity, security, ownership and market evidence. Token DD uses a documented per-token money-flow call instead of joining a limited global smart-money list. No composite safety score or “Safe” label is emitted from absent honeypot, mint or LP-lock fields. Those checks remain explicit gaps.
- **RugCheck Audit:** uses the real Birdeye liquidity-history endpoint. No guessed endpoints, price-to-liquidity proxy or RugCheck.org claim. Declining USD liquidity does not prove an LP withdrawal. Full LP-lock/honeypot coverage is unavailable.
- **Smart Wallets:** bounds discovery and adds actual wallet PnL for standard/deep, rather than summing overlapping per-token trader results. Unsupported source pass-score/copyability filters are omitted.

Partial evidence returns `data.status=partial` and CLI exit code 5, even when every available API step succeeded. This is expected for unsupported audit checks. Empty, failed or truncated source data is not a passing score. Replay of an existing interface result uses in-memory session history with no API call; cross-restart disk history, Telegram rendering, source multi-chain support and automatic trading are not added by these recipes.

## Tests

```bash
npm run typecheck
npm test
npm run test:browser
```

Fixture tests cover all eleven recipes, wire parameters for new APIs, first-funded POST mapping, dynamic liquidity reservations, wallet deduplication, skip switches, missing-data handling, closed-candle scoring and leaderboard ordering. Browser tests cover group navigation, editable steps, multi-wallet preview and no-cost estimates. Browser testing requires permission to bind localhost and launch Chrome; sandbox `EPERM` prevents rendered verification.
