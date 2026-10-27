---
name: skill-smart-money-leaderboard
description: "Compare an explicit list of wallets using consistent PnL windows and accounting."
---

<!-- Generated from src/workflows/skill-smart-money-leaderboard/definition.ts; run npm run skills:sync. -->

# Smart Money Leaderboard

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Compare an explicit list of wallets using consistent PnL windows and accounting.

## Input

One to ten Solana wallet addresses, separated by commas.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case skill-smart-money-leaderboard --wallets <WALLET_1,WALLET_2> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-smart-money-leaderboard --wallets <WALLET_1,WALLET_2> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-smart-money-leaderboard --help` for optional flags. Run from any directory.

## Result

7d/30d performance and per-token evidence per wallet, ranked with higher PnL scoring higher. Missing metrics remain unranked.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.
