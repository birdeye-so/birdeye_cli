---
title: 2026.04.17 - Release Token Holder Profile & Positions APIs
description: Added release note.
---

# 2026.04.17 - Release Token Holder Profile & Positions APIs

Introducing 2 new APIs to analyze token holder composition on Solana — identify bundlers, snipers, insiders, and developers, with per-wallet PnL and volume data.

## Features

### Token - Holder Profile

[GET /token/v1/holder-profile](../data-api/holder/get-token-v1-holder-profile)

* New endpoint: returns aggregated holder summary for a token
* Includes token market data (market cap, liquidity, 1h volumes), top 10 holder concentration, and breakdown by holder tag (`bundler`, `sniper`, `insider`, `dev`)
* Each tag entry includes holder count, hold amount, percent of supply, buy/sell volumes, average buy price, and unrealized PnL
* Supports `include_zero_balance` and `ui_amount_mode` (`raw` / `scaled`) parameters
* Available on **Solana** 

> **Note:** Bundler tag data is accurate for tokens created from **2026-03-01** onwards. Data for earlier tokens is still being backfilled.

### Token - Holder Positions

[GET /token/v1/holder-positions](../data-api/holder/get-token-v1-holder-positions)

* New endpoint: returns a paginated list of individual wallet positions for a token
* Filter by holder tags (`bundler`, `sniper`, `insider`, `dev`); each entry includes hold amount, percent of supply, buy/sell volumes, average buy price, unrealized PnL, trade counts, first trade time, and associated labels
* Supports sorting by amount (`asc` / `desc`) and `ui_amount_mode` parameter
* Available on **Solana**

> **Note:** Bundler tag data is accurate for tokens created from **2026-03-01** onwards. Data for earlier tokens is still being backfilled.

***

## Summary

This release adds 2 new API endpoints for token holder analysis. Together they let developers surface insider/bundler/sniper activity, measure holder concentration, and retrieve per-wallet trading data for any Solana token.
