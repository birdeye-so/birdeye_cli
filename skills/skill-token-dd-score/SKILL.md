---
name: skill-token-dd-score
description: "Score any Solana token 0–100 with an A+ to F rating across five pillars — security, holder concentration, trading activity, liquidity and smart money — showing each pillar’s points and the reason behind every deduction."
---

<!-- Generated from src/workflows/skill-token-dd-score/definition.ts and catalog/skill-content.json; run npm run skills:sync. -->

# Token Due-Diligence

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Score any Solana token 0–100 with an A+ to F rating across five pillars — security, holder concentration, trading activity, liquidity and smart money — showing each pillar’s points and the reason behind every deduction.

## Input

A Solana token address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu. Token Due-Diligence combines Standard and Advanced in one skill. Use --dd-mode standard for two API calls, or --dd-mode advanced (default) for seven calls and deeper holder, liquidity and smart-money evidence. Preview the selected mode before running. HTTP automation can call POST /token-dd on the separate birdeye-api service, sending the user's Birdeye key in X-API-KEY for each live request. The wrapper never uses a server key; estimates need no key. The endpoint is Solana-only and uses snake_case inputs.

Use cases:
- Pre-buy check, grading a shortlist, auto-rating tokens in a bot or wallet.

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

- Standard and Advanced scores are not comparable
- Checks without data are left out of the score
- Advanced samples top holders, not every holder

### Execution notes

- Standard uses overview/security only; advanced adds holder, flow and liquidity evidence. Scores from different modes or coverage are not comparable.
- Advanced distribution covers 10–50 top wallets, holders one page of up to 100, and liquidity 1–100 candles. Labeled cohorts can overlap; these samples are not the full holder population.
- Liquidity OHLC reserves a provisional 30 CU, not a verified billing upper bound. Missing checks are excluded from scored coverage and cannot establish safety.
- Only the default reconstructed scoring preset is implemented; canonical-mint/LST checks, pace and alternative presets are unavailable. Local re-scoring cannot fetch missing or wider-window evidence.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.

Read [the detailed reference](references/details.md) when interpreting formulas, selecting evidence modes, or re-scoring saved evidence.

For HTTP integration, read [the standalone research API reference](references/internal-api.md): `birdeye-api` startup, per-request Birdeye keys via `X-API-KEY`, endpoint inputs, chain limits and partial results. Terminal commands run in-process and need no background API server.
