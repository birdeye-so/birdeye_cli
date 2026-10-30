---
name: skill-token-stats
description: "Summarize a Solana token's valuation, liquidity, holders and buying/selling activity. Use for a market snapshot across supported rolling windows."
---

<!-- Generated from src/workflows/skill-token-stats/definition.ts; run npm run skills:sync. -->

# Token Stats

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Summarize a Solana token's valuation, liquidity, holders and buying/selling activity. Use for a market snapshot across supported rolling windows.

## Input

A Solana token address and stats-frames, default 1h,24h.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu. Overview supplies valuation and holders; trade-data supplies the requested rolling windows. These endpoints do not retrieve historical snapshots at --from/--to. Overlapping windows are shown separately.

Use cases:
- Compare a token's last hour of activity with its last 24 hours.
- Check market cap, FDV and liquidity before choosing a deeper analysis.

Preview without API calls:

```bash
birdeye-cli case skill-token-stats --address <SOLANA_ADDRESS> --stats-frames 1h,24h --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-token-stats --address <SOLANA_ADDRESS> --stats-frames 1h,24h --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-token-stats --help` for optional flags. Run from any directory.

## Result

A token snapshot plus per-window USD volume, price change, trades and active wallets, preserving units and missing fields.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.

## Supported chains and limitations

Supported chains in this CLI: `solana`. Broader upstream API support does not enable additional chains for this skill.

- Two current-data requests, not historical snapshot reconstruction. Windows overlap and must not be added together.
- Volume is reported in USD, token counts are separate, and market cap is not substituted with FDV when unavailable.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.

Read [the API and usage reference](references/details.md) to choose evidence depth, understand units and distinguish rolling snapshots from historical activity.
