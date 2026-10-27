---
name: skill-contract-dd
description: "Review contract controls, ownership concentration and price behavior together."
---

<!-- Generated from src/workflows/skill-contract-dd/definition.ts; run npm run skills:sync. -->

# Contract DD

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Review contract controls, ownership concentration and price behavior together.

## Input

A Solana token address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case skill-contract-dd --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-contract-dd --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-contract-dd --help` for optional flags. Run from any directory.

## Result

Security checklist, holder distribution and optional candlestick analysis. Unknown controls stay unknown; price action cannot establish contract safety.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
