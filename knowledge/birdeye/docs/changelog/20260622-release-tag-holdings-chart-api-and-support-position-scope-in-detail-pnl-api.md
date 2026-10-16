---
title: 2026.06.22 - Release Tag Holdings Chart API and Support position_scope Param for Detail Pnl API
description: Added release note.
---

# 2026.06.22 - Release Tag Holdings Chart API and Support position_scope Param for Detail Pnl API

New updates for token holder analytics and wallet PnL breakdown APIs, including a new Solana holder tag chart endpoint and an additional `position_scope` parameter for wallet PnL details.

## Features

### Token - Tag Holdings Chart

[GET /token/v1/chart/tag-holdings](../data-api/holder/get-token-v1-chart-tag-holdings)

* Retrieve timestamped holder and holding data grouped by wallet tag type on Solana
* Support filtering by one or many tag categories through `tag_type`
* Support chart granularity and time-range queries
* Return up to 100 chart points for each tag

#### Parameters

| Parameter       | Type               | Required | Default            | Description                                 |
| --------------- | ------------------ | -------- | ------------------ | ------------------------------------------- |
| `x-chain`       | string             | No       | solana             | Chain header. Only Solana is supported.     |
| `token_address` | string             | Yes      | -                  | Token mint address.                         |
| `chart_type`    | string             | No       | 1d                 | Chart interval for the tag holdings series. |
| `tag_type`      | string or string[] | No       | all supported tags | Filter by one or many holder tag types.     |
| `time_from`     | integer            | No       | -                  | Start time as Unix timestamp in seconds.    |
| `time_to`       | integer            | No       | current time       | End time as Unix timestamp in seconds.      |

***

### Wallet - PnL Details

[POST /wallet/v2/pnl/details](../data-api/wallet-networth-pnl/post-wallet-v2-pnl-details)

* Add `position_scope` to the request body for wallet PnL details
* Support `duration_only` and `cumulative` calculation modes
* Default `position_scope` to `duration_only`

#### Parameters

| Parameter        | Type   | Required | Default       | Description                                                                                                                                                                                                              |
| ---------------- | ------ | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `position_scope` | string | No       | duration_only | PnL calculation mode. `duration_only` calculates PnL only for the selected duration. `cumulative` calculates realized PnL cumulatively from the start time, while unrealized PnL is based on the all-time open position. |
