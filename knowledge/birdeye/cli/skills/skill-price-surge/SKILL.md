---
name: skill-price-surge
description: "Find surging tokens within a market-cap band and screen liquidity, trading and optional security risks."
---

<!-- Generated from src/workflows/skill-price-surge/definition.ts; run npm run skills:sync. -->

# Price Surge Screen

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Find surging tokens within a market-cap band and screen liquidity, trading and optional security risks.

## Input

Chain, surge interval and market-cap band. Standard is the default; choose advanced, top and optional security to bound enrichment.

## Use

Install birdeye-cli and configure the Birdeye API key locally. Preview the user's filters and CU budget, then run the same command with --max-cu. Standard costs 50 CU. Advanced hydrates at most --top survivors; --with-security adds security, while --no-holder-health skips Solana holder cohorts. --no-auto-filter retains every row with its flags. Top-10 and developer caps require security evidence. Unknown KOL tags are not zero buyers. Use --help for the full filter list; read the detailed reference for interpretation and the /price-surge API contract.

Preview without API calls:

```bash
birdeye-cli price-surge --chain solana --interval 1h --min-market-cap 50000 --max-market-cap 5000000 --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli price-surge --chain solana --interval 1h --min-market-cap 50000 --max-market-cap 5000000 --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli price-surge --help` for optional flags. Run from any directory.

## Result

Ranked candidates, every exclusion reason, bounded advanced evidence, raw source data and CU usage. Unknown risk fields stay null.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.

## Supported chains and limitations

Supported chains in this CLI: `solana`, `bsc`, `base`, `ethereum`, `robinhood`. Broader upstream API support does not enable additional chains for this skill.

- Arbitrum is unavailable because Token List V3 does not document it. Other upstream chains are outside this skill's implemented scope.
- Standard requests one page of 1–100 tokens for 50 CU. Advanced hydrates at most min(top, limit) first-pass survivors; exclusions are not backfilled. Unhydrated rows have no advanced risk assessment.
- Holder health is Solana-only in this implementation, even though the provider also documents Robinhood. Non-Solana runs omit holder profiles and Solana-only trader options.
- Security is opt-in in advanced mode. Developer/top-10 caps remain unevaluated without security; unknown authority, lock, tax or KOL evidence stays null, not a passed check.
- Trader metrics cover at most ten sampled wallets; 1m/5m screens use a 30m trader window. Holder-profile volume uses 1h. Profitability is not a market-wide win rate; a KOL holder count is not a KOL buyer count.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.

Read [the detailed reference](references/details.md) for filters, risk interpretation, missing data, installation or the aggregate HTTP API.
