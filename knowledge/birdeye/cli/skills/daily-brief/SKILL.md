---
name: daily-brief
description: "Prepare a market briefing from short and daily trending windows, then inspect a few selected tokens."
---

<!-- Generated from src/workflows/daily-brief/definition.ts; run npm run skills:sync. -->

# Daily Brief

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Prepare a market briefing from short and daily trending windows, then inspect a few selected tokens.

## Input

Optionally supply a Solana wallet address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case daily-brief --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case daily-brief --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case daily-brief --help` for optional flags. Run from any directory.

## Result

Trending samples and token checks; full depth adds chain activity, smart-money tokens and launches. An optional wallet adds holdings.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
