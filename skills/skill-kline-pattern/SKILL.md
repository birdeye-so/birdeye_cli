---
name: skill-kline-pattern
description: "Classify observed candle behavior using the reference skill's trend, slope, volatility, drawdown, volume and recovery rules."
---

<!-- Generated from src/workflows/skill-kline-pattern/definition.ts; run npm run skills:sync. -->

# Kline Pattern

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Classify observed candle behavior using the reference skill's trend, slope, volatility, drawdown, volume and recovery rules.

## Input

A Solana token address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case skill-kline-pattern --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-kline-pattern --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-kline-pattern --help` for optional flags. Run from any directory.

## Result

Pattern, heuristic score and supporting measurements from closed candles. Thin or invalid data produces an unavailable result.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
