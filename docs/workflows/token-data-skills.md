# Token discovery and data analysis skills

These eight skills run through the CLI, the local console and agent research tools. They use Solana data from Birdeye Public API and return normalized findings with source IDs, retrieval times, pagination and unavailable fields. Each installed skill includes this reference.

## Choose a skill by the question

| Skill | Use it when | Main input and result |
| --- | --- | --- |
| `skill-launchpad-trending` | “Which Pump.fun tokens are nearing graduation?” | Launch source/stage → ranked candidates and launch metadata. |
| `skill-token-security` | “Does this token still have mint or freeze controls?” | Token → observed security checklist, with unknown checks. |
| `skill-token-stats` | “How does activity in the last hour compare with 24h?” | Token and rolling frames → valuation, liquidity, holders and activity. |
| `skill-top-holder-analysis` | “How concentrated is ownership among the largest wallets?” | Token and top-N → wallet holdings and supply concentration. |
| `skill-top-trader-analysis` | “Who traded this token most or made the most realized profit?” | Token, ranking and relative window → trader activity and token-specific PnL. |
| `skill-lp-analysis` | “Where is this token's liquidity, and has it changed?” | Token → pool page, selected pair snapshots and optional token history. |
| `skill-smart-money-holders` | “Which smart traders still hold this token?” | Token → labeled positions; optional bounded activity timeline. |
| `skill-kol-signal` | “Did observed KOL buying or selling dominate this period?” | Token and time range → cohort buckets, net USD and optional wallet samples. |

All are data reports. For a composite token risk score use Token Due-Diligent Score; for wallet-wide performance use Wallet Analysis or Wallet Score. Smart Money Holders takes a **token** address, whereas Smart Money Profile takes a **wallet** address.

## Install and run

Install `birdeye-cli` with Node.js >=22.16 and configure your Birdeye API key locally with `birdeye-cli config init`. Install the instruction package separately, for example:

```bash
npx skills add https://github.com/birdeye-so/birdeye_cli/tree/main/skills --skill skill-kol-signal --global
birdeye-cli case skill-kol-signal --address <SOLANA_TOKEN> --depth full --estimate-cu
birdeye-cli case skill-kol-signal --address <SOLANA_TOKEN> --depth full --max-cu 60 --format table
```

Replace placeholders before running. `--estimate-cu` is free and makes no upstream request; `--max-cu` bounds paid work including retries. `--format json` preserves the structured report, `table` prints its tables, and `--format interface` opens the local console. `--short` reduces displayed source payloads without changing requests. Keys belong in local configuration or `BIRDEYE_API_KEY`, not in chat.

## Purpose-specific options

Common options are `--depth core|full`, `--scan-limit`, and `--limit` for bounded enrichment. Use the skill's documented flags; these skills fix their source semantics and reject `--step-overrides`. Raw CLI operations remain available for arbitrary endpoint queries.

| Skill | Options and behavior |
| --- | --- |
| Launchpad | `--source all|pump_dot_fun|moonshot|raydium_launchlab|meteora_dynamic_bonding_curve`; `--stage newly-created|near-graduation|graduated|newly-listed`; `--launch-sort volume_24h_usd|liquidity|market_cap|creation_time|graduated_time|progress_percent`; `--scan-limit 1–50`. Near-graduation requires `--min-progress`; optional `--min-liquidity` applies to the meme feed. Full enriches up to `--limit 1–5` launch records. Newly-listed requires source all, omits liquidity filtering and uses up to 20 listing rows in provider order. |
| Security | Token address only. One security request; no candles or synthetic score. |
| Stats | `--stats-frames 1h,24h` by default; supported frames `1m,5m,30m,1h,2h,4h,8h,24h`. These are rolling windows; explicit `--from/--to` is rejected. |
| Top Holder | `--top-n 10–50` (default 50). Full adds labeled cohort context. Wallet-based distribution, not token-account concentration. |
| Top Trader | `--trader-window` defaults to `24h`; supported range starts at `30m` and includes `all_time`. `--trader-sort volume_usd|trade|total_pnl|realized_pnl|unrealized_pnl|hold_volume`; scan-limit is capped at 10. Explicit `--from/--to` is rejected. |
| LP | Scan-limit is capped at 20 pools; limit selects up to 5 pair details (default 3). Full adds token aggregate history using 4h snapshots, capped at 100. It does not calculate a wallet's LP yield, fees or impermanent loss. |
| Smart Money Holders | `--scan-limit 1–50`; `--include-exited` includes zero-balance positions. Core reads profile and positions with label `smart_trader`; full adds cohort and wallet activity. Lifetime position metrics remain separate from the timeline. |
| KOL Signal | `--signal-threshold-usd` defaults to 0. Core reads KOL summary buckets; full adds wallet details, capped by scan-limit per bucket and 100 buckets. |

For launch time filters, LP history and cohort timelines, supply both `--from` and `--to` in Unix seconds or omit both for the default last day. `--tracker-frame 1m|5m|15m|30m|1h|4h|1D` controls timeline buckets, default `1h`. This does not change the fixed one-hour volume window in holder-profile.

Examples (append `--estimate-cu`, then replace it with your chosen `--max-cu`):

```bash
birdeye-cli case skill-launchpad-trending --source pump_dot_fun --stage near-graduation --min-progress 80 --scan-limit 10
birdeye-cli case skill-token-security --address <SOLANA_TOKEN>
birdeye-cli case skill-token-stats --address <SOLANA_TOKEN> --stats-frames 1h,24h
birdeye-cli case skill-top-holder-analysis --address <SOLANA_TOKEN> --top-n 10 --depth full
birdeye-cli case skill-top-trader-analysis --address <SOLANA_TOKEN> --trader-window 24h --trader-sort realized_pnl
birdeye-cli case skill-lp-analysis --address <SOLANA_TOKEN> --limit 2 --depth full
birdeye-cli case skill-smart-money-holders --address <SOLANA_TOKEN> --scan-limit 10 --depth full
birdeye-cli case skill-kol-signal --address <SOLANA_TOKEN> --depth full --signal-threshold-usd 1000
```

## API choice and interpretation

| Source | Why this source is used | Interpretation |
| --- | --- | --- |
| [Meme List](https://data.birdeye.so/docs/data-api/meme/get-defi-v3-token-meme-list) | Launch lifecycle, progress and ranked candidates | Lifecycle fields come from `meme_info`; creation, listing and graduation are different events. |
| [Security](https://data.birdeye.so/docs/data-api/security/get-defi-token-security) | Contract controls and provider security evidence | On Solana, explicit null ownerAddress/freezeAuthority means inactive; a missing or malformed authority stays unknown. Explicit boolean flags take precedence. Security supply fractions are converted to percentages. Opaque fee schedules remain unknown. |
| [Overview](https://data.birdeye.so/docs/data-api/stats/get-defi-token-overview) and [Trade Data](https://data.birdeye.so/docs/data-api/stats/get-defi-v3-token-trade-data-single) | Valuation/holders plus requested activity windows | Trade-data volume fields ending in `_usd` are USD; trade counts use `trade_1h`, not token-list's `trade_1h_count`. Windows are relative to retrieval. |
| [Holder Distribution](https://data.birdeye.so/docs/data-api/holder/get-holder-v1-distribution) | Largest wallets and provider supply shares | Percentage fields are already 0–100. Segment summaries and returned pages have different scopes. Top-10 requires ten distinct valid top rows. |
| [Holder Profile](https://data.birdeye.so/docs/data-api/holder/get-token-v1-holder-profile) and [Holder Positions](https://data.birdeye.so/docs/data-api/holder/get-token-v1-holder-positions) | Cohort summary and exact labeled positions | Smart-holder queries explicitly exclude zero balances by default. Tags can overlap. Current holdings do not establish when a wallet bought. |
| [Top Traders](https://data.birdeye.so/docs/data-api/wallet-networth-pnl/get-defi-v2-tokens-top-traders) | Token-specific ranking and PnL | Wallet address is `owner`; token amounts and USD amounts are separate. Its tag filter does not support KOL. |
| [Markets](https://data.birdeye.so/docs/data-api/tokenmarket-list/get-defi-v2-markets) and [Pair Overview](https://data.birdeye.so/docs/data-api/stats/get-defi-v3-pair-overview-single) | Pool list and selected pool activity | Pair overview takes a pool address. Market-list `volume24h` retains provider units; pair `volume_24h` is USD. Page shares are not whole-market shares. |
| [Liquidity History](https://data.birdeye.so/docs/data-api/price-ohlcv/get-defi-v3-liquidity-history-token) | Historical token-level liquidity snapshots | A fall in USD liquidity does not prove LP withdrawals. Token history is not the history of each pool or an executable quote. |
| [Wallet Tags Tracker](https://data.birdeye.so/docs/data-api/holder/get-token-v1-wallet-tags-tracker) and [Details](https://data.birdeye.so/docs/data-api/holder/get-token-v1-wallet-tags-tracker-details) | Historical KOL/smart-trader activity and sampled wallets | Results are bucket aggregates, not individual transaction records. Repeated wallets are deduplicated only for the observed detail sample. Missing tag groups stay unknown. |

Rolling Money Flow has no arbitrary historical `from/to`; the cohort skills therefore use Tracker for dated questions. KOL summaries use only the `kol` group. They do not substitute profitable top traders or KOL holders for KOL purchases.

The signal rule is deterministic: sum known buy and sell USD values in the returned, nonduplicated buckets; net = buy − sell. Net greater than the threshold is `buy-dominant`, less than its negative is `sell-dominant`, otherwise `balanced`. Explicit zero activity is `no-observed-activity`; absent or incomplete amount evidence is `unknown`. This describes the fetched sample, not an investment recommendation. Inspect pagination before treating a sample as a complete period.

## Coverage and costs

One page is fetched per step. `has_more`, cursors, limits, source IDs and retrieval times remain in the report. Missing sources or required metrics produce a partial result; other tables remain available. A limit on detail wallets means observed unique wallets are only a sample. Some highly held tokens are excluded by the tracker upstream.

CU estimates use the CLI request catalog. Trade Data reserves 12 CU and Markets 25 CU, checked against the official endpoint pages on 2026-10-28. Security, profile, positions and traders retain the existing conservative 30-CU reservation. Liquidity history uses resolution/lookback-dependent estimates. Estimates exclude retries and are not confirmed billing; run the free preview for your actual options.

These are on-demand reports. They do not provide a market-wide KOL feed, continuous monitoring, push notifications, transaction execution or copy-trading backtests.
