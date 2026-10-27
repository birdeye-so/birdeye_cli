---
name: token-due-diligence
description: "Check a token's identity and the security fields that could rule it out of your research shortlist."
---

<!-- Generated from src/workflows/token-due-diligence/definition.ts; run npm run skills:sync. -->

# Token Due Diligence

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Check a token's identity and the security fields that could rule it out of your research shortlist.

## Input

A Solana token address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case token-due-diligence --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case token-due-diligence --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case token-due-diligence --help` for optional flags. Run from any directory.

## Result

An identity and security checklist with missing checks made explicit. This is not a safety verdict.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
