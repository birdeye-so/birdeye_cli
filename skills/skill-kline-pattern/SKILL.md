---
name: skill-kline-pattern
description: "Read a Solana token’s candlestick chart at a chosen resolution and window, detect the price pattern, score it 0–100 and mark observed support and resistance levels."
---

<!-- Generated from src/workflows/skill-kline-pattern/definition.ts and catalog/skill-content.json; run npm run skills:sync. -->

# Kline Pattern

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Read a Solana token’s candlestick chart at a chosen resolution and window, detect the price pattern, score it 0–100 and mark observed support and resistance levels.

## Input

A Solana token address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Use cases:
- Timing entries and exits around key price levels; adding chart signals to trading agents and alert bots.

Preview without API calls:

```bash
birdeye-cli case skill-kline-pattern --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-kline-pattern --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-kline-pattern --help` for optional flags. Run from any directory.

## Result

Pattern, heuristic score and supporting measurements from closed candles. Thin or invalid data produces an unavailable result.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.

## Supported chains and limitations

Supported chains in this CLI: `solana`. Broader upstream API support does not enable additional chains for this skill.

- Candles from 1m to 1D; needs at least 8 closed candles
- Support and resistance are observed levels, not forecasts
- The score is a heuristic, not a backtest

### Execution notes

- Supports 1m, 5m, 15m, 30m, 1H, 4H and 1D candles over a maximum 5000-interval request window. Intervals are case-sensitive; closed valid candles only, with at least eight required.
- Reports invalid candles and gaps; a missing volume baseline receives no volume adjustment. Observed support/resistance are sample extrema, not forecasts.
- The pattern score is a heuristic, not a backtest or prediction. OHLCV CU reserves the largest documented tier; actual billing may differ.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.
