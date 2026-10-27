# Archived workflow — market-shortlist

Outdated. Retained for historical reference only. Use maintained packages in `skills/` for new research and installations.

---
name: market-shortlist
description: "Quickly inspect the first few tokens in the provider's trending order."
---

<!-- Generated from src/workflows/market-shortlist/definition.ts; run npm run skills:sync. -->

# Market Shortlist

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Quickly inspect the first few tokens in the provider's trending order.

## Input

No address is required. Choose filters appropriate to the research question.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case market-shortlist --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case market-shortlist --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case market-shortlist --help` for optional flags. Run from any directory.

## Result

A small trending list enriched with security and market snapshots. This recipe keeps provider order.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
