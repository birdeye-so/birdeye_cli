# Archived workflow — risk-warning

Outdated. Retained for historical reference only. Use maintained packages in `skills/` for new research and installations.

---
name: risk-warning
description: "Review security and ownership observations that need attention before continuing token research."
---

<!-- Generated from src/workflows/risk-warning/definition.ts; run npm run skills:sync. -->

# Risk Warning

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Review security and ownership observations that need attention before continuing token research.

## Input

A Solana token address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case risk-warning --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case risk-warning --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case risk-warning --help` for optional flags. Run from any directory.

## Result

A point-in-time risk checklist; full depth adds labeled positions and trading timelines. This is not a continuous alert service.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
