---
name: skill-contract-dd
description: "Check a Solana token’s contract controls, holder concentration and optional candle pattern, with missing controls kept unknown and no overall safety score."
---

<!-- Generated from src/workflows/skill-contract-dd/definition.ts and catalog/skill-content.json; run npm run skills:sync. -->

# Contract Due-Diligence Score

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Check a Solana token’s contract controls, holder concentration and optional candle pattern, with missing controls kept unknown and no overall safety score.

## Input

A Solana token address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Use cases:
- Checking contract controls and concentration before deeper token research; adding optional chart context.

Preview without API calls:

```bash
birdeye-cli case skill-contract-dd --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-contract-dd --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-contract-dd --help` for optional flags. Run from any directory.

## Result

Security checklist, holder distribution and optional candlestick analysis. Unknown controls stay unknown; price action cannot establish contract safety.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.

## Supported chains and limitations

Supported chains in this CLI: `solana`. Broader upstream API support does not enable additional chains for this skill.

- No source-code audit, sell simulation or LP-lock check
- No safety score; missing controls stay unknown
- Candle check needs at least 8 closed candles

### Execution notes

- Uses Birdeye observations, a top-ten wallet distribution and optional candles; it does not audit source code, simulate selling, or independently verify LP locks.
- No Safe tier or composite safety score is produced. Missing controls remain unknown, and price action cannot establish contract safety.
- Candles use closed observations with a maximum 5000-interval request window; at least eight valid closed candles are needed for a pattern. --skip-kline omits that evidence and its CU.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.
