# Archived workflow — early-project-screening

Outdated. Retained for historical reference only. Use maintained packages in `skills/` for new research and installations.

---
name: early-project-screening
description: "Find tokens at a chosen launch stage and screen a bounded shortlist for liquidity, security and holder-group evidence."
---

<!-- Generated from src/workflows/early-project-screening/definition.ts; run npm run skills:sync. -->

# Early Project Screening

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Find tokens at a chosen launch stage and screen a bounded shortlist for liquidity, security and holder-group evidence.

## Input

No address is required. Choose filters appropriate to the research question.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case early-project-screening --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case early-project-screening --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case early-project-screening --help` for optional flags. Run from any directory.

## Result

Launch candidates, selection reasons and per-token checks. Newly listed and newly created describe different events.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
