---
name: birdeye-market
description: Discover and compare Solana tokens using Birdeye CLI market opportunities, launch screening, daily briefs, smart-money flows and OHLCV. Use for bounded market research and watchlists with explicit CU budgets.
---

Requires the separately installed `birdeye-cli` (Node.js >=22.16) and configured Birdeye credentials. Run the commands below from any directory; prefix `case`, `token`, `market`, `portfolio`, `cases`, `capabilities`, `workflow` and `usage` commands with `birdeye-cli`.

## Supported chains and limitations

Compatibility package. These market research procedures support `solana` only. For BSC, Base, Ethereum or Robinhood surge screening, use the separate `skill-price-surge` package; its holder health remains Solana-only.

Discovery covers bounded pages and selected candidates, not the entire market. Listing, creation and graduation are different events; token samples cannot establish chain-wide trends. The procedures do not trade, schedule alerts or monitor WebSockets. Current focused packages are `skill-trending-list` and `skill-smart-wallets`.

## Use

Choose a workflow by purpose:

- `case skill-trending-list --list-source v3-list --sort-by volume`: reference discovery via token list V3; optional `--platform pump.fun`. Native `--list-source trending` supports volume/liquidity/rank only.
- `case skill-smart-wallets --skill-depth fast --limit 3`: smart-money tokens → per-token traders → deduplicated wallets. Standard adds wallet PnL; deep adds holdings and positions. Do not sum token-scoped trader PnL into wallet totals. See [reference workflows](references/birdeye-data-skills.md).

- `case market-opportunities --scan-limit 50 --limit 3`: scan one trending page, deduplicate and rank by volume24hUSD, then enrich a few candidates. `--depth full` adds money-flow and holder profile.
- `case early-project-screening --stage newly-created --source pump_dot_fun --limit 3`: discover by creation time. Other stages: newly-listed, graduated, near-graduation. Near-graduation requires a user-selected `--min-progress`; newly-listed cannot filter a specific venue.
- `case daily-brief --limit 2`: compare rolling 1h/24h trending samples. Full adds chain metrics, smart-money tokens and meme listings; an optional wallet address adds holdings.

Use `cases --short`, `capabilities --short` and command `--help` for available inputs. Plan with `--estimate-cu`; execute with the user's budget via `--max-cu`. Group multiple calls under `workflow create` and pass `--workflow <id>`; final CU comes from `usage show`, not a sum of cumulative response totals. Stop or narrow scope when remaining budget is insufficient.

The older `case market-shortlist --limit 5` enriches the first five provider-ranked tokens; it does not scan fifty. Preserve selections, observedRows, local ranking basis, outcomes and missing checks. A candidate rejected by policy is not automatically replaced. List calls return a page, not the entire market.

For focused queries, use `market smart-money`, `market new-listings`, `market meme-list`, `market chain-metrics`, `token money-flow`, or `market ohlcv`. Money-flow uses frames such as 24h, while smart-money list uses intervals such as 1d. Matching duration does not guarantee identical aggregation boundaries. OHLCV intervals are case-sensitive; supply explicit Unix seconds via --from/--to. Its estimate reserves the largest documented tier.

Listing, creation and graduation are distinct events. Provider rank is different from local volume24hUSD ordering. Chain totals come from chain-metrics, not summing top-token volumes. Do not infer sectors or market-wide risk appetite from token names or small samples. Use host metrics with their units, time windows and denominators; volume/liquidity is not an executable quote or wash-trade score.

Use --short for concise output; workflow source arrays are previews with explicit truncation, and full output retains all fetched rows. Reducing output tokens does not reduce CU. No trading, scheduling or WebSocket monitoring is performed by these recipes.
