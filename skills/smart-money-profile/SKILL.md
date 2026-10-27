---
name: smart-money-profile
description: "Research a supplied wallet or discover traders by realized PnL, then compare performance across time windows."
---

<!-- Generated from src/workflows/smart-money-profile/definition.ts; run npm run skills:sync. -->

# Smart Money Profile

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Research a supplied wallet or discover traders by realized PnL, then compare performance across time windows.

## Input

Optionally supply a Solana wallet address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case smart-money-profile --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case smart-money-profile --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case smart-money-profile --help` for optional flags. Run from any directory.

## Result

Holdings, two PnL snapshots and recent trades per wallet. Provider performance is not a copy-trading return estimate.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
