---
name: birdeye-portfolio
description: Analyze Solana wallet holdings, PnL, recent trades and performance profiles with Birdeye CLI. Use for portfolio exposure, wallet research and smart-money candidate profiling with explicit scope and CU accounting.
---

For holdings only, use `case wallet-exposure --address <wallet> --short` or `portfolio holdings <wallet> --limit <n> --short`. For performance, use `case wallet-analysis --address <wallet> --duration 30d --pnl-method wac`; full adds per-token PnL details and checks a bounded set of positions. `case smart-money-profile --address <wallet>` compares 7d/30d PnL with holdings/trades; omit address to discover a bounded set from a realized-PnL ranking, not a rich list.

Before executing, use --estimate-cu --short and respect the user's --max-cu. For multiple calls, create a workflow budget and pass its ID through --workflow. Finish with usage show --workflow <id> --short. Cumulative CU totals are not additive; uncertain attempts remain charged against the local budget.

The reference collection adds `case skill-wallet-score`, `case skill-wallet-style`, `case skill-wallet-analysis` and `case skill-smart-money-profile` with `--address <wallet>`. `case skill-smart-money-leaderboard --wallets <wallet1,wallet2>` compares up to ten explicit wallets. See [reference workflows](../../docs/workflows/birdeye-data-skills.md). Wallet Score requires matching 30d/90d duration-only accounting and position evidence; missing inputs yield a null alpha score. Leaderboard scores are relative to eligible supplied wallets and reward higher PnL. They are not absolute alpha or copy ROI. Use skip flags to reduce requested evidence and CU, preserving resulting missing-data reports.

Holdings are paginated and low-liquidity assets may be excluded. observedWeightPct divides by priced assets on the fetched page, not total wallet wealth. Request additional pages explicitly with --offset and deduplicate assets while retaining retrieval times; moving snapshots can change page boundaries.

PnL requires a declared duration, position_scope and pnl_method. Workflows use duration_only and default wac. Atomic `portfolio pnl-summary` and `portfolio pnl-details` also accept cumulative scope and net_cash; use --help for exact flags. Preserve realized/unrealized separation and win-rate population; upstream backfill can be incomplete. PnL details sort by last trade, so the first page does not establish all-time top contributors.

`portfolio trades <wallet> --after-time <seconds> --before-time <seconds>` returns a page of trade history, not all transfers. Missing history cannot establish holding times or complete round trips. Smart-money profile's two PnL windows overlap; its trade range is reported separately. API classifications and observed profitability are distinct.

Report metrics with sources, accounting method, coverage, missing steps and CU. Workflow --short retains metrics and previews five rows per source array, with outputTruncation. Choose full output or atomic commands when evidence beyond the preview is needed. Holdings do not establish PnL; wallet PnL does not establish copy-trade ROI. copyTradeRoi stays unavailable without execution assumptions, fees, latency, slippage and complete transaction accounting.
