---
title: 2026.09.17 - Gainers/Losers Trader Filters
description: Added filtering options to the Trader - Gainers/Losers API.
---

# 2026.09.17 - Gainers/Losers Trader Filters

The **Trader - Gainers/Losers** API now supports more ways to filter ranked traders for wallet and trader analytics workflows.

## What's New

The endpoint now supports:

* Minimum and maximum filters for trade count
* Minimum and maximum filters for trading volume in USD
* Minimum and maximum filters for realized PnL
* Minimum and maximum filters for unrealized PnL
* Minimum and maximum filters for total PnL

## API Reference

[Trader - Gainers/Losers](../data-api/wallet-networth-pnl/get-trader-gainers-losers)

```text
GET /trader/gainers-losers
```

Existing ranking, pagination, and response behavior remain available.
