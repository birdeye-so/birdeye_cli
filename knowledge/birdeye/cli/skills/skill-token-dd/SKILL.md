---
name: skill-token-dd
description: "Check market activity, security and smart-money context before taking a token further in research."
---

<!-- Generated from src/workflows/skill-token-dd/definition.ts; run npm run skills:sync. -->

# Token DD

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Check market activity, security and smart-money context before taking a token further in research.

## Input

A Solana token address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case skill-token-dd --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-token-dd --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-token-dd --help` for optional flags. Run from any directory.

## Result

Security observations, activity and labeled money flow. Optional holder list, holder groups and historical liquidity add evidence. No automatic buy recommendation.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
