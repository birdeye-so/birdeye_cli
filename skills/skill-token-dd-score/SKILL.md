---
name: skill-token-dd-score
description: "Explain token due-diligence risk through security, holders, activity, liquidity and smart-money evidence."
---

<!-- Generated from src/workflows/skill-token-dd-score/definition.ts; run npm run skills:sync. -->

# Token DD

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Explain token due-diligence risk through security, holders, activity, liquidity and smart-money evidence.

## Input

A Solana token address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu. Token DD combines Standard and Advanced in one skill. Use --dd-mode standard for two API calls, or --dd-mode advanced (default) for seven calls and deeper holder, liquidity and smart-money evidence. Preview the selected mode before running.

Preview without API calls:

```bash
birdeye-cli case skill-token-dd-score --address <SOLANA_ADDRESS> --dd-mode advanced --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-token-dd-score --address <SOLANA_ADDRESS> --dd-mode advanced --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-token-dd-score --help` for optional flags. Run from any directory.

## Result

Five scored pillars, coverage, drawdown gate and an auditable risk rating. Standard uses two calls; advanced uses seven. Saved evidence can be re-scored locally at zero CU.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.

## Supported chains and limitations

Supported chains in this CLI: `solana`. Broader upstream API support does not enable additional chains for this skill.

- Standard uses overview/security only; advanced adds holder, flow and liquidity evidence. Scores from different modes or coverage are not comparable.
- Advanced distribution covers 10–50 top wallets, holders one page of up to 100, and liquidity 1–100 candles. Labeled cohorts can overlap; these samples are not the full holder population.
- Liquidity OHLC reserves a provisional 30 CU, not a verified billing upper bound. Missing checks are excluded from scored coverage and cannot establish safety.
- Only the default reconstructed scoring preset is implemented; canonical-mint/LST checks, pace and alternative presets are unavailable. Local re-scoring cannot fetch missing or wider-window evidence.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.

Read [the detailed reference](references/details.md) when interpreting formulas, selecting evidence modes, or re-scoring saved evidence.
