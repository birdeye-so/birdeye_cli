---
title: 2026.04.17 - Release Top Trader Improvements for Solana
description: Improved release note.
---

# 2026.04.17 - Release Top Trader Improvements for Solana

Enhanced the Token Top Traders API on Solana with richer data source, extended timeframe support, and new PnL-based sorting options.

## Features

### Token - Top Traders

[GET /defi/v2/tokens/top_traders](../data-api/wallet-networth-pnl/get-defi-v2-tokens-top-traders)

* **Extended timeframes for Solana**: in addition to the existing short-interval timeframes, Solana now supports longer timeframes: `2d`, `3d`, `7d`, `14d`, `30d`, `60d`, `90d`
* **New sort options for Solana**: `sort_by` now accepts `total_pnl`, `unrealized_pnl`, `realized_pnl`, and `volume_usd` on Solana (in addition to existing `volume` and `trade`)
* **New response fields for Solana**: each trader entry now includes `volumeUsd`, `volumeBuyUSD`, `volumeSellUSD`, `totalPnl`, `unrealizedPnl`, and `realizedPnl`

> All new timeframes and sort options are available on **Solana** only. Other chains continue to support existing timeframes (`30m`–`24h`) and sort options (`volume`, `trade`).

***

## Summary

This release improves the Token Top Traders endpoint for Solana with a higher-quality data source, longer lookback timeframes up to 90 days, PnL-based sorting, and new PnL/USD volume fields in the response. No breaking changes — existing parameters and response fields are unchanged.
