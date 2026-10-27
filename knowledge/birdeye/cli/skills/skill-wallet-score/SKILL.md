---
name: skill-wallet-score
description: "Assess a wallet's profitability, consistency, position quality and activity from matching PnL windows."
---

<!-- Generated from src/workflows/skill-wallet-score/definition.ts; run npm run skills:sync. -->

# Wallet Score

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Assess a wallet's profitability, consistency, position quality and activity from matching PnL windows.

## Input

A Solana wallet address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case skill-wallet-score --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-wallet-score --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-wallet-score --help` for optional flags. Run from any directory.

## Result

A versioned alpha heuristic with component breakdown and missing-data checks. Scores use fetched positions and are not a copy-trading return forecast.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
