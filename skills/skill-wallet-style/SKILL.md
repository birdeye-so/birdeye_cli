---
name: skill-wallet-style
description: "Describe how often a wallet trades and how profitable those trades were over a fixed period."
---

<!-- Generated from src/workflows/skill-wallet-style/definition.ts; run npm run skills:sync. -->

# Wallet Style

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Describe how often a wallet trades and how profitable those trades were over a fixed period.

## Input

A Solana wallet address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case skill-wallet-style --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-wallet-style --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-wallet-style --help` for optional flags. Run from any directory.

## Result

Frequency × PnL classification with sample size and per-token loss share. Transaction and first-funding evidence are optional.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
