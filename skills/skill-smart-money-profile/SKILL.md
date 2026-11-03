---
name: skill-smart-money-profile
description: "Combine short and monthly performance with position, trade and net-worth history for one wallet."
---

<!-- Generated from src/workflows/skill-smart-money-profile/definition.ts; run npm run skills:sync. -->

# Smart Money Profile

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Combine short and monthly performance with position, trade and net-worth history for one wallet.

## Input

A Solana wallet address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case skill-smart-money-profile --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-smart-money-profile --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-smart-money-profile --help` for optional flags. Run from any directory.

## Result

7d/30d PnL, position details, holdings, swaps and net-worth snapshots. Balance changes include cash flows and are not trading ROI.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.

## Supported chains and limitations

Supported chains in this CLI: `solana`. Broader upstream API support does not enable additional chains for this skill.

- Profiles one supplied wallet using overlapping 7d/30d summaries. Position duration and the trade time cursor are separate inputs; do not merge incompatible scopes.
- Default positions, holdings and trades each cover at most 100 rows, and net-worth history requests 30 daily snapshots. Trades are swaps, not complete transfer history.
- Net-worth changes include deposits and withdrawals; neither those changes nor the smart-money label establish trading ROI or future returns. First funding is provenance only.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.
