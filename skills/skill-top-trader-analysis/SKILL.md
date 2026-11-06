---
name: skill-top-trader-analysis
description: "List up to 10 top traders of a Solana token over 30m to all-time, sorted by volume, trades or PnL, showing buy/sell volume, trade count, realized, unrealized and total PnL, and wallet tags such as sniper, insider or smart trader."
---

<!-- Generated from src/workflows/skill-top-trader-analysis/definition.ts and catalog/skill-content.json; run npm run skills:sync. -->

# Top Trader Analysis

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

List up to 10 top traders of a Solana token over 30m to all-time, sorted by volume, trades or PnL, showing buy/sell volume, trade count, realized, unrealized and total PnL, and wallet tags such as sniper, insider or smart trader.

## Input

A Solana token address, trader-window and trader-sort. Up to ten traders per request.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu. Use trader-sort volume_usd for USD activity, realized_pnl for realized results, or hold_volume for current holdings. The window is the provider's relative trader window; --from/--to are not supported. PnL covers this token, not the whole wallet.

Use cases:
- Understanding who drives the price; finding wallets worth following.

Preview without API calls:

```bash
birdeye-cli case skill-top-trader-analysis --address <SOLANA_ADDRESS> --trader-window 24h --trader-sort realized_pnl --scan-limit 10 --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-top-trader-analysis --address <SOLANA_ADDRESS> --trader-window 24h --trader-sort realized_pnl --scan-limit 10 --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-top-trader-analysis --help` for optional flags. Run from any directory.

## Result

A ranked trader page with buys, sells, token-specific realized/unrealized PnL, current holding fields and source-defined window.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.

## Supported chains and limitations

Supported chains in this CLI: `solana`. Broader upstream API support does not enable additional chains for this skill.

- Up to 10 traders per run
- PnL covers this token only, not the whole wallet

### Execution notes

- One page of at most ten traders; scan-limit is capped at ten. Ranking and PnL apply to this token and the requested provider window.
- Current holdings do not prove purchases in the window. Missing PnL/holding fields remain unknown; highest volume does not imply trading skill.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.

Read [the API and usage reference](references/details.md) to choose evidence depth, understand units and distinguish rolling snapshots from historical activity.
