---
name: skill-trending-list
description: "Discover tokens by activity, liquidity or market size, optionally within a launch platform."
---

<!-- Generated from src/workflows/skill-trending-list/definition.ts; run npm run skills:sync. -->

# Trending List

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Discover tokens by activity, liquidity or market size, optionally within a launch platform.

## Input

No address is required. Choose filters appropriate to the research question.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Preview without API calls:

```bash
birdeye-cli case skill-trending-list --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-trending-list --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-trending-list --help` for optional flags. Run from any directory.

## Result

A ranked token page. Choose V3 token list or native trending; sorting options follow the selected API.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.

## Supported chains and limitations

Supported chains in this CLI: `solana`. Broader upstream API support does not enable additional chains for this skill.

- This skill remains Solana-only even though the underlying raw Token List V3 operation supports other chains.
- The default scan is one page of up to 50 tokens; per-step overrides remain bounded by the selected endpoint. Intervals are 1h, 4h or 24h. This ranking is not a market-wide scan or a risk screen.
- Platform filters require v3-list. Native trending permits volume, liquidity or rank; rank requires native trending. No per-token security or holder hydration is performed.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.
