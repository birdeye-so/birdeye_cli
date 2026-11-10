---
name: skill-smart-money-leaderboard
description: "Rank up to 10 Solana wallets side by side on 7-day and 30-day PnL and win rate, to see which one performs best."
---

<!-- Generated from src/workflows/skill-smart-money-leaderboard/definition.ts and catalog/skill-content.json; run npm run skills:sync. -->

# Smart Money Leaderboard

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Rank up to 10 Solana wallets side by side on 7-day and 30-day PnL and win rate, to see which one performs best.

## Input

One to ten Solana wallet addresses, separated by commas.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Use cases:
- Choosing which wallet to copy among candidates; building trader leaderboards for communities and wallet apps.

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

## Supported chains and limitations

Supported chains in this CLI: `solana`. Broader upstream API support does not enable additional chains for this skill.

- Compares 1–10 wallets you supply; doesn't find top wallets
- Ranks within your list only; 70 CU per wallet

### Execution notes

- Accepts 1–10 explicitly supplied Solana wallets, deduplicated before calls. This is a relative comparison of that list, not discovery of all top wallets.
- Ranking requires matching 7d/30d duration-only summaries and complete comparison metrics; missing inputs remain unranked. Per-token evidence is one page of up to 100 rows per wallet by default.
- Higher PnL improves relative rank, but the score is not absolute alpha or copy-trading ROI. Scores can change when the comparison set changes.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.
