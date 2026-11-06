---
name: skill-wallet-style
description: "Tag a Solana wallet’s trading style from trade frequency and PnL profile, with a style label and the numbers behind it."
---

<!-- Generated from src/workflows/skill-wallet-style/definition.ts and catalog/skill-content.json; run npm run skills:sync. -->

# Wallet Style

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Tag a Solana wallet’s trading style from trade frequency and PnL profile, with a style label and the numbers behind it.

## Input

A Solana wallet address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Use cases:
- Knowing how a wallet trades before following it; segmenting users in wallet apps.

Preview without API calls:

```bash
birdeye-cli case skill-wallet-style --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-wallet-style --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-wallet-style --help` for optional flags. Run from any directory.

## Result

Frequency × PnL classification with sample size and per-token loss share. Transaction and first-funding evidence are optional.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.

## Supported chains and limitations

Supported chains in this CLI: `solana`. Broader upstream API support does not enable additional chains for this skill.

- 7d or 30d windows only
- Reads up to 100 positions per run

### Execution notes

- Style classification supports 7d or 30d only, with matching summary and position scopes. Missing, empty, incompatible or skipped positions can make classification unavailable.
- The default position and optional transaction requests each return up to 100 rows. Loss share describes fetched positions; it is not a full wallet census.
- Frequency and PnL do not establish holding time, intent or trader identity. First funding does not establish wallet age; the result is not a return forecast.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.
