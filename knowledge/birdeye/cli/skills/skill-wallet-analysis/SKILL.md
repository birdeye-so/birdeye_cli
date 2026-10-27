---
name: skill-wallet-analysis
description: "Compare wallet PnL across several periods and inspect holdings, positions and recent activity."
---

<!-- Generated from src/workflows/skill-wallet-analysis/definition.ts; run npm run skills:sync. -->

# Wallet Analysis

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Compare wallet PnL across several periods and inspect holdings, positions and recent activity.

## Input

A Solana wallet address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case skill-wallet-analysis --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-wallet-analysis --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-wallet-analysis --help` for optional flags. Run from any directory.

## Result

Selected PnL windows, per-token PnL, optional holdings, transactions and first funding. Overlapping periods are not added together.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
