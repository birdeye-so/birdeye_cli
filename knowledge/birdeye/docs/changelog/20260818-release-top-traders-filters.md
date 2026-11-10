---
title: 2026.08.18 - Add Filters For Top Traders API
description: Improved release note.
---

# 2026.08.18 - Add Filters For Top Traders API

Add min/max filters to the Token Top Traders API for Solana and EVM chains

## Features

### Token - Top Traders

[GET /defi/v2/tokens/top_traders](../data-api/wallet-networth-pnl/get-defi-v2-tokens-top-traders)

- Support filtering top traders by trade count, token volume, USD volume, realized PnL, and unrealized PnL
- Apply filters to both Solana and EVM-supported Top Traders requests
- Keep existing sorting, pagination, and response fields unchanged
-  min/max filters are not supported  when use with `sort_by=hold_volume`

#### New Parameters

| Parameter            | Type    | Required | Default | Description                                                       |
| -------------------- | ------- | -------- | ------- | ----------------------------------------------------------------- |
| `min_trade`          | integer | No       | -       | Minimum trade count. Not supported when `sort_by=hold_volume`.    |
| `max_trade`          | integer | No       | -       | Maximum trade count. Not supported when `sort_by=hold_volume`.    |
| `min_volume`         | number  | No       | -       | Minimum token volume. Not supported when `sort_by=hold_volume`.   |
| `max_volume`         | number  | No       | -       | Maximum token volume. Not supported when `sort_by=hold_volume`.   |
| `min_volume_usd`     | number  | No       | -       | Minimum USD volume. Not supported when `sort_by=hold_volume`.     |
| `max_volume_usd`     | number  | No       | -       | Maximum USD volume. Not supported when `sort_by=hold_volume`.     |
| `min_realized_pnl`   | number  | No       | -       | Minimum realized PnL. Not supported when `sort_by=hold_volume`.   |
| `max_realized_pnl`   | number  | No       | -       | Maximum realized PnL. Not supported when `sort_by=hold_volume`.   |
| `min_unrealized_pnl` | number  | No       | -       | Minimum unrealized PnL. Not supported when `sort_by=hold_volume`. |
| `max_unrealized_pnl` | number  | No       | -       | Maximum unrealized PnL. Not supported when `sort_by=hold_volume`. |

**Usage Note:** `min_trade` and `max_trade` must be non-negative integers. Volume filters must be non-negative. PnL filters support both positive and negative values.

**Compatibility Note:** This release does not change existing response fields or existing sort behavior. Filters are additive and optional.
