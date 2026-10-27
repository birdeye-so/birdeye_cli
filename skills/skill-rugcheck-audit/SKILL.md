---
name: skill-rugcheck-audit
description: "Review contract, holder and actual liquidity-history evidence for potential risk."
---

<!-- Generated from src/workflows/skill-rugcheck-audit/definition.ts; run npm run skills:sync. -->

# RugCheck Audit

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Review contract, holder and actual liquidity-history evidence for potential risk.

## Input

A Solana token address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case skill-rugcheck-audit --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-rugcheck-audit --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-rugcheck-audit --help` for optional flags. Run from any directory.

## Result

Birdeye observations, holder groups and historical liquidity snapshots. This is not a RugCheck.org integration; unavailable honeypot/LP-lock checks are explicit.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
