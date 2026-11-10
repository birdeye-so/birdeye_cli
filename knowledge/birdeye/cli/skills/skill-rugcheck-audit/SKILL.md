---
name: skill-rugcheck-audit
description: "Review a Solana token’s rug risk — contract controls, holder concentration, labeled holder groups and liquidity history — with every unverified check listed instead of assumed safe."
---

<!-- Generated from src/workflows/skill-rugcheck-audit/definition.ts and catalog/skill-content.json; run npm run skills:sync. -->

# RugCheck Audit

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Review a Solana token’s rug risk — contract controls, holder concentration, labeled holder groups and liquidity history — with every unverified check listed instead of assumed safe.

## Input

A Solana token address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu.

Use cases:
- A fast yes/no safety gate before buying or listing a token; auto-blocking risky tokens in wallets, DEX listings and trading bots.

Preview without API calls:

```bash
birdeye-cli case skill-rugcheck-audit --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-rugcheck-audit --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-rugcheck-audit --help` for optional flags. Run from any directory.

## Result

Birdeye observations, holder groups and historical liquidity snapshots. This is not a RugCheck.org integration; unavailable honeypot/LP-lock checks are explicit.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.

## Supported chains and limitations

Supported chains in this CLI: `solana`. Broader upstream API support does not enable additional chains for this skill.

- Uses Birdeye data; not a RugCheck.org integration
- No honeypot simulation or LP-lock verification
- A drop in USD liquidity doesn't prove an LP pull

### Execution notes

- Uses Birdeye, not RugCheck.org. Honeypot simulation and independent LP-lock verification are unavailable; unknown controls are not passed checks.
- Default holder evidence is one 20-row page plus labeled cohorts. Liquidity history takes at most 100 snapshots; at least two are required for a change calculation. Cohorts can overlap.
- USD liquidity changes do not prove LP withdrawal; price falls are never substituted for liquidity history. Liquidity-history CU uses a conservative resolution/lookback estimate, not confirmed billing.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.
