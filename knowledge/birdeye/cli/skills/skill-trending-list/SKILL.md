---
name: skill-trending-list
description: "Discover tokens by activity, liquidity or market size, optionally within a launch platform."
---

<!-- Generated from src/workflows/skill-trending-list/definition.ts; run npm run skills:sync. -->

# Trending List

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Discover tokens by activity, liquidity or market size, optionally within a launch platform.

## Input

No address is required. Choose filters appropriate to the research question.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case skill-trending-list --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-trending-list --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-trending-list --help` for optional flags. Run from any directory.

## Result

A ranked token page. Choose V3 token list or native trending; sorting options follow the selected API.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
