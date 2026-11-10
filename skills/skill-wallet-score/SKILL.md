---
name: skill-wallet-score
description: "Score any Solana wallet 0–100 on profitability, consistency, trade quality and activity, showing PnL, win rate and the breakdown behind each component."
---

<!-- Generated from src/workflows/skill-wallet-score/definition.ts and catalog/skill-content.json; run npm run skills:sync. -->

# Wallet Score

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Score any Solana wallet 0–100 on profitability, consistency, trade quality and activity, showing PnL, win rate and the breakdown behind each component.

## Input

A Solana wallet address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Use cases:
- Vetting a wallet before copy-trading; ranking wallets.

Preview without API calls:

```bash
birdeye-cli case skill-wallet-score --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-wallet-score --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-wallet-score --help` for optional flags. Run from any directory.

## Result

A versioned alpha heuristic with component breakdown and missing-data checks. Scores use fetched positions and are not a copy-trading return forecast.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.

## Supported chains and limitations

Supported chains in this CLI: `solana`. Broader upstream API support does not enable additional chains for this skill.

- Scored on fixed 30d and 90d PnL windows only
- Reads up to 100 positions, not the full portfolio
- Not a forecast of copy-trading returns

### Execution notes

- Alpha requires matching 30d/90d duration-only PnL and a 30d position page using the same accounting method. Other duration inputs are rejected; incompatible overrides or skipped/missing positions make the score unavailable.
- Positions and holdings are one page of up to 100 each by default, not the full portfolio. The 24h summary is additional context, not a replacement for the required scoring windows.
- First funding is provenance, not proven wallet age. The alpha score is a research heuristic, not expected copy-trading ROI; provider history can be incomplete.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.
