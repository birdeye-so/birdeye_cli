---
name: project-deep-report
description: "Build an on-chain evidence report about a token's market, ownership and price behavior."
---

<!-- Generated from src/workflows/project-deep-report/definition.ts; run npm run skills:sync. -->

# Project Deep Report

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Build an on-chain evidence report about a token's market, ownership and price behavior.

## Input

A Solana token address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case project-deep-report --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case project-deep-report --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case project-deep-report --help` for optional flags. Run from any directory.

## Result

Token and pool snapshots, holder groups, price candles and trading activity. Team, funding and social claims are outside this report.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
