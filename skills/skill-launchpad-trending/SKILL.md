---
name: skill-launchpad-trending
description: "Scan Solana launchpad tokens — Pump.fun, Moonshot, Raydium LaunchLab and Meteora DBC — by launch stage or bonding-curve progress, filtered by liquidity, showing progress, creator, liquidity and trading activity."
---

<!-- Generated from src/workflows/skill-launchpad-trending/definition.ts and catalog/skill-content.json; run npm run skills:sync. -->

# Token Launchpad Trending

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Scan Solana launchpad tokens — Pump.fun, Moonshot, Raydium LaunchLab and Meteora DBC — by launch stage or bonding-curve progress, filtered by liquidity, showing progress, creator, liquidity and trading activity.

## Input

Choose source, stage, scan-limit and launch-sort; near-graduation requires min-progress. No token address is needed.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu. Use --depth full --limit 3 only when detailed launch metadata is needed. --min-liquidity filters the launch feed. --from/--to select creation or graduation time; newly-listed uses listing time and requires source all. Ranking covers one page, not the whole market.

Use cases:
- Catching early launches, building launch watchlists, launchpad alert bots.

Preview without API calls:

```bash
birdeye-cli case skill-launchpad-trending --source pump_dot_fun --stage near-graduation --min-progress 80 --scan-limit 10 --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-launchpad-trending --source pump_dot_fun --stage near-graduation --min-progress 80 --scan-limit 10 --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-launchpad-trending --help` for optional flags. Run from any directory.

## Result

A ranked launchpad page with launch stage, progress, market data and observation sources; full depth adds metadata for a bounded shortlist.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.

## Supported chains and limitations

Supported chains in this CLI: `solana`. Broader upstream API support does not enable additional chains for this skill.

- Up to 50 tokens per run (20 for newly listed)
- Created, listed and graduated are separate stages
- Launch progress is not a safety signal

### Execution notes

- One launch page, up to 50 rows; newly-listed allows up to 20. Full enriches at most 1–5 tokens. No security score is inferred from launch progress.
- Newly listed, newly created and graduated are different events. Newly-listed keeps provider order; other stages use launch-sort. Source coverage is provider-specific.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.

Read [the API and usage reference](references/details.md) to choose evidence depth, understand units and distinguish rolling snapshots from historical activity.
