---
name: skill-token-dd-score
description: "Explain token due-diligence risk through security, holders, activity, liquidity and smart-money evidence."
---

<!-- Generated from src/workflows/skill-token-dd-score/definition.ts; run npm run skills:sync. -->

# Token DD Score · Advanced

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Explain token due-diligence risk through security, holders, activity, liquidity and smart-money evidence.

## Input

A Solana token address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case skill-token-dd-score --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-token-dd-score --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-token-dd-score --help` for optional flags. Run from any directory.

## Result

Five scored pillars, coverage, drawdown gate and an auditable risk rating. Standard uses two calls; advanced uses seven. Saved evidence can be re-scored locally at zero CU.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.

Read [the detailed reference](references/details.md) when interpreting formulas, selecting evidence modes, or re-scoring saved evidence.
