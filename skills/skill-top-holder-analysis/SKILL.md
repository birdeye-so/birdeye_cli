---
name: skill-top-holder-analysis
description: "Inspect the largest holders of a Solana token and their share of supply. Use to investigate ownership concentration and labeled holder groups."
---

<!-- Generated from src/workflows/skill-top-holder-analysis/definition.ts; run npm run skills:sync. -->

# Top Holder Analysis

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Inspect the largest holders of a Solana token and their share of supply. Use to investigate ownership concentration and labeled holder groups.

## Input

A Solana token address, top-n (10–50), and optional depth full.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu. Uses wallet-based holder distribution rather than token-account totals. --depth full adds holder-profile. Cohort shares can overlap and are not added; a label alone does not establish common ownership.

Use cases:
- Find the largest holders and how much supply the top ten control.
- Add labeled cohort context when investigating concentrated ownership.

Preview without API calls:

```bash
birdeye-cli case skill-top-holder-analysis --address <SOLANA_ADDRESS> --top-n 10 --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-top-holder-analysis --address <SOLANA_ADDRESS> --top-n 10 --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-top-holder-analysis --help` for optional flags. Run from any directory.

## Result

Top wallet holdings, provider-reported supply shares, top-1/top-10 concentration when covered, and optional cohort context.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.

## Supported chains and limitations

Supported chains in this CLI: `solana`. Broader upstream API support does not enable additional chains for this skill.

- One distribution page of 10–50 wallets. Top-10 is unavailable when fewer than ten valid, distinct rows are returned.
- Supply percentages use the distribution provider's denominator; token-account concentration from security is not relabeled as wallet concentration.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.

Read [the API and usage reference](references/details.md) to choose evidence depth, understand units and distinguish rolling snapshots from historical activity.
