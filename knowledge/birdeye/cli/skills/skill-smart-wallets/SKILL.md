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

## Supported chains and limitations

Supported chains in this CLI: `solana`. Broader upstream API support does not enable additional chains for this skill.

- Default discovery takes at most 20 smart-money tokens from a 1d page, then ten 30d top traders for each of 1–5 selected tokens. It deduplicates at most 1–5 wallets in provider order; this is not a complete wallet leaderboard.
- Fast mode has no wallet-wide PnL evidence; standard adds 30d PnL and deep adds holdings and a per-token PnL page. Token-scoped trader PnL cannot be summed into wallet-wide PnL or win rate.
- Provider labels may be incomplete and do not establish future performance. Holdings and positions are paginated samples; no copy-trade return is calculated.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.
