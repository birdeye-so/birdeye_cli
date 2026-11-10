---
name: skill-kol-signal
description: "Summarize KOL buying and selling on a Solana token over a chosen window, showing buy and sell USD, net flow, a buy/sell dominance label and optional wallet-level activity."
---

<!-- Generated from src/workflows/skill-kol-signal/definition.ts and catalog/skill-content.json; run npm run skills:sync. -->

# KOL Buy/Sell Signal

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Summarize KOL buying and selling on a Solana token over a chosen window, showing buy and sell USD, net flow, a buy/sell dominance label and optional wallet-level activity.

## Input

A Solana token address, optional from/to timestamps, tracker-frame, signal-threshold-usd and depth full.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu. Uses the KOL tracker for bounded historical buckets, rather than rolling money-flow or top-trader labels. Default is one day in hourly buckets. Full adds wallet details. Net USD above the threshold is buy-dominant, below its negative is sell-dominant; otherwise balanced. Missing buckets/cohort evidence stay unknown. This runs once and does not subscribe or send alerts.

Use cases:
- Following KOL calls, alert bots, detecting KOL exits.

Preview without API calls:

```bash
birdeye-cli case skill-kol-signal --address <SOLANA_ADDRESS> --depth full --tracker-frame 1h --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-kol-signal --address <SOLANA_ADDRESS> --depth full --tracker-frame 1h --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-kol-signal --help` for optional flags. Run from any directory.

## Result

KOL buy/sell USD totals and net flow from returned buckets, an explained dominance label, and optional sampled wallet-level activity.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.

## Supported chains and limitations

Supported chains in this CLI: `solana`. Broader upstream API support does not enable additional chains for this skill.

- Birdeye-labeled KOL wallets only, not a market-wide feed
- Activity comes in time buckets, not single transactions

### Execution notes

- Provider labels describe observed cohorts, not verified identities. Holdings are a snapshot; a position's lifetime buy/sell totals are not activity in the requested timeline window.
- Timeline totals cover returned buckets. Bucket wallet counts cannot be added as unique wallets; detail pages cap wallets per bucket and may have more pages. Unsupported tokens and absent cohorts stay unavailable.
- Signal describes only returned KOL activity, not a recommendation or market-wide feed. Detail rows are time buckets, not individual transactions; no transaction hash is inferred.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.

Read [the API and usage reference](references/details.md) to choose evidence depth, understand units and distinguish rolling snapshots from historical activity.
