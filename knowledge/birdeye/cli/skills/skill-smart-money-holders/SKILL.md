---
name: skill-smart-money-holders
description: "See which smart traders hold a Solana token, showing each wallet’s share of supply, average buy price, PnL, buy/sell volume and first trade time, plus the cohort’s buy/sell activity over time."
---

<!-- Generated from src/workflows/skill-smart-money-holders/definition.ts and catalog/skill-content.json; run npm run skills:sync. -->

# Smart Money Holder Analysis

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

See which smart traders hold a Solana token, showing each wallet’s share of supply, average buy price, PnL, buy/sell volume and first trade time, plus the cohort’s buy/sell activity over time.

## Input

A Solana token address, scan-limit (1–50 positions), optional include-exited and depth full.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu. The subject is a token, not a wallet. Core uses the smart_trader label and excludes zero-balance positions. --include-exited includes wallets that no longer hold the token. Full adds --from/--to and --tracker-frame activity; default one day in hourly buckets.

Use cases:
- Confirming smart-money conviction before entry; spotting smart money exiting.

Preview without API calls:

```bash
birdeye-cli case skill-smart-money-holders --address <SOLANA_ADDRESS> --scan-limit 10 --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-smart-money-holders --address <SOLANA_ADDRESS> --scan-limit 10 --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-smart-money-holders --help` for optional flags. Run from any directory.

## Result

Smart-trader cohort holdings and a bounded wallet-position page; full depth adds bucketed activity and sampled wallet evidence.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.

## Supported chains and limitations

Supported chains in this CLI: `solana`. Broader upstream API support does not enable additional chains for this skill.

- Up to 50 smart-trader positions per run
- Labels are observed cohorts, not verified identities

### Execution notes

- Provider labels describe observed cohorts, not verified identities. Holdings are a snapshot; a position's lifetime buy/sell totals are not activity in the requested timeline window.
- Timeline totals cover returned buckets. Bucket wallet counts cannot be added as unique wallets; detail pages cap wallets per bucket and may have more pages. Unsupported tokens and absent cohorts stay unavailable.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.

Read [the API and usage reference](references/details.md) to choose evidence depth, understand units and distinguish rolling snapshots from historical activity.
