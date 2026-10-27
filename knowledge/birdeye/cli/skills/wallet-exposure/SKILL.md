---
name: wallet-exposure
description: "See how a wallet's observed asset value is distributed across the holdings page you fetch."
---

<!-- Generated from src/workflows/wallet-exposure/definition.ts; run npm run skills:sync. -->

# Wallet Exposure

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

See how a wallet's observed asset value is distributed across the holdings page you fetch.

## Input

A Solana wallet address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case wallet-exposure --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case wallet-exposure --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case wallet-exposure --help` for optional flags. Run from any directory.

## Result

Asset values and relative weights for that page. Balances do not measure investment returns.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
