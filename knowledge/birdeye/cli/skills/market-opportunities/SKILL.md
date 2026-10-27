---
name: market-opportunities
description: "Scan trending tokens and prioritize a small research shortlist by observed 24h USD volume."
---

<!-- Generated from src/workflows/market-opportunities/definition.ts; run npm run skills:sync. -->

# Market Opportunities

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Scan trending tokens and prioritize a small research shortlist by observed 24h USD volume.

## Input

No address is required. Choose filters appropriate to the research question.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case market-opportunities --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case market-opportunities --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case market-opportunities --help` for optional flags. Run from any directory.

## Result

Deduplicated candidates with liquidity and security checks; full depth adds labeled money flow and holder groups. No trades are executed.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
