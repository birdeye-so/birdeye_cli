---
name: skill-lp-analysis
description: "Analyze where and how deep a Solana token can be traded — its top pools with venue, liquidity, 24h volume and age, plus total and exit liquidity over time."
---

<!-- Generated from src/workflows/skill-lp-analysis/definition.ts and catalog/skill-content.json; run npm run skills:sync. -->

# Liquidity Pool Analysis

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Analyze where and how deep a Solana token can be traded — its top pools with venue, liquidity, 24h volume and age, plus total and exit liquidity over time.

## Input

A Solana token address, scan-limit (capped at 20 pools), limit (1–5 pair details), and optional depth full.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu. Core reads pools and at most --limit pair overviews. Full adds token-level liquidity history over --from/--to (default one day), using 4h snapshots. Each historical response is bounded to 100 rows. This analyzes token pools, not a wallet's LP fees or yield.

Use cases:
- Spotting concentration and insider risk; seeing who could dump.

Preview without API calls:

```bash
birdeye-cli case skill-lp-analysis --address <SOLANA_ADDRESS> --scan-limit 10 --limit 3 --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-lp-analysis --address <SOLANA_ADDRESS> --scan-limit 10 --limit 3 --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-lp-analysis --help` for optional flags. Run from any directory.

## Result

Pool liquidity and activity, shares within the fetched pool page, bounded pair details and optional token-level liquidity history.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.

## Supported chains and limitations

Supported chains in this CLI: `solana`. Broader upstream API support does not enable additional chains for this skill.

- Up to 20 pools; shares are within those pools
- Liquidity history is per token, not per pool
- No slippage, APR or impermanent-loss figures

### Execution notes

- Pool percentages are relative to the fetched page, not all market liquidity. Pair details cover at most five pools.
- Historical liquidity belongs to the token, not each pool. USD changes do not prove LP withdrawals; no slippage quote, LP APR or impermanent-loss calculation is provided.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.

Read [the API and usage reference](references/details.md) to choose evidence depth, understand units and distinguish rolling snapshots from historical activity.
