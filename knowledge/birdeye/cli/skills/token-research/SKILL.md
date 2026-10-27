---
name: token-research
description: "Understand a token before deciding whether to investigate further. Check its market activity, security observations and holder concentration together."
---

<!-- Generated from src/workflows/token-research/definition.ts; run npm run skills:sync. -->

# Token Research

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Understand a token before deciding whether to investigate further. Check its market activity, security observations and holder concentration together.

## Input

A Solana token address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case token-research --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case token-research --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case token-research --help` for optional flags. Run from any directory.

## Result

Price, liquidity, activity and holder evidence; full depth adds pools and labeled holder groups.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
