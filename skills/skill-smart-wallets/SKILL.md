---
name: skill-smart-wallets
description: "Discover wallets trading tokens in Birdeye's smart-money list, then inspect a bounded wallet shortlist."
---

<!-- Generated from src/workflows/skill-smart-wallets/definition.ts; run npm run skills:sync. -->

# Smart Wallets

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Discover wallets trading tokens in Birdeye's smart-money list, then inspect a bounded wallet shortlist.

## Input

No address is required. Choose filters appropriate to the research question.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case skill-smart-wallets --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-smart-wallets --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-smart-wallets --help` for optional flags. Run from any directory.

## Result

Token → top traders → deduplicated wallets. Standard adds PnL; deep adds holdings and per-token PnL. No overlapping token-level PnL is summed.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
