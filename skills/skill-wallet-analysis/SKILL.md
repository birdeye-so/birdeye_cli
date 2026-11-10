---
name: skill-wallet-analysis
description: "Deep-dive a Solana wallet’s portfolio and performance — holdings, realized and unrealized PnL, ROI, win rate and per-token PnL from 24h to all-time — plus the wallet that first funded it."
---

<!-- Generated from src/workflows/skill-wallet-analysis/definition.ts and catalog/skill-content.json; run npm run skills:sync. -->

# Wallet Analysis

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Deep-dive a Solana wallet’s portfolio and performance — holdings, realized and unrealized PnL, ROI, win rate and per-token PnL from 24h to all-time — plus the wallet that first funded it.

## Input

A Solana wallet address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Use cases:
- Portfolio view in wallet apps; due diligence on a wallet.

Preview without API calls:

```bash
birdeye-cli case skill-wallet-analysis --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-wallet-analysis --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-wallet-analysis --help` for optional flags. Run from any directory.

## Result

Selected PnL windows, per-token PnL, optional holdings, transactions and first funding. Overlapping periods are not added together.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.

## Supported chains and limitations

Supported chains in this CLI: `solana`. Broader upstream API support does not enable additional chains for this skill.

- Windows 24h, 7d, 30d, 90d and all; they overlap
- Up to 100 holdings, positions and transactions each

### Execution notes

- Select up to five distinct summary windows from 24h, 7d, 30d, 90d and all. These overlap and must not be added. Per-token positions use the separate duration input, default 30d.
- Default holdings, positions and transactions each cover one page of up to 100 rows; low-liquidity assets and provider history may be missing. --skip-* flags remove evidence, not just output.
- Net worth is not PnL, first funding is not proven age, and observed PnL is not copy-trade ROI. Preserve the accounting method and requested windows in comparisons.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.
