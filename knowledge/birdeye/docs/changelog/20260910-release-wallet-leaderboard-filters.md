---
title: 2026.09.10 - Wallet Leaderboard Filters and Sorting
description: Added filtering, sorting, interval, and PnL method options to the Wallet Leaderboard API.
---

# 2026.09.10 - Wallet Leaderboard Filters and Sorting

The **Wallet Leaderboard** API now supports more ways to filter and rank wallets for leaderboard and wallet analytics workflows.

## What's New

The endpoint now supports:

* `interval` to select the measurement period, from `30m` through `90d` and `all_time`
* `sort_by` to rank results by total value, trade count, volume, realized PnL, or unrealized PnL
* Minimum and maximum filters for:
  * trade count
  * trading volume in USD
  * realized PnL
  * unrealized PnL
* `pnl_method` to select the PnL calculation mode

## API Reference

[Wallet - Leaderboard](../data-api/wallet-networth-pnl/get-wallet-v2-leaderboard)

```text
GET /wallet/v2/leaderboard
```

Existing pagination and wallet-value filters remain available. The response format is unchanged.
