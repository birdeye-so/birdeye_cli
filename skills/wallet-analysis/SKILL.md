---
name: wallet-analysis
description: "Understand what a wallet holds, how its positions performed and what it traded in the chosen period."
---

<!-- Generated from src/workflows/wallet-analysis/definition.ts; run npm run skills:sync. -->

# Wallet Analysis

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Understand what a wallet holds, how its positions performed and what it traded in the chosen period.

## Input

A Solana wallet address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case wallet-analysis --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case wallet-analysis --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case wallet-analysis --help` for optional flags. Run from any directory.

## Result

Observed holdings, PnL and a page of trades. Full depth adds per-token PnL and token screening.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
