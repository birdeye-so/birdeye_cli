---
name: skill-smart-money-profile
description: "Combine short and monthly performance with position, trade and net-worth history for one wallet."
---

<!-- Generated from src/workflows/skill-smart-money-profile/definition.ts; run npm run skills:sync. -->

# Smart Money Profile

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Combine short and monthly performance with position, trade and net-worth history for one wallet.

## Input

A Solana wallet address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case skill-smart-money-profile --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-smart-money-profile --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-smart-money-profile --help` for optional flags. Run from any directory.

## Result

7d/30d PnL, position details, holdings, swaps and net-worth snapshots. Balance changes include cash flows and are not trading ROI.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
