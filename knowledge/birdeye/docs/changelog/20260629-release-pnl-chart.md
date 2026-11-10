---
title: 2026.06.29 - Release PnL Chart API
description: Added release note.
---

# 2026.06.29 - Release PnL Chart API

New API to retrieve wallet PnL chart data over time, with support for configurable time ranges and PnL calculation scope.

## Features

### Wallet - PnL Chart

[GET /wallet/v2/pnl/chart](../data-api/wallet-networth-pnl/get-wallet-v2-pnl-chart)

* Retrieve time-series wallet PnL chart data
* Support custom time range selection with `time_from` and `time_to`
* Support `position_scope` to control PnL calculation mode
* Default `time_from` to 100 days before the current time when omitted
* Default `time_to` to the current time when omitted
* Limit the maximum time range between `time_from` and `time_to` to 100 days

#### Parameters

| Parameter        | Type   | Required | Default                 | Description                                                                                                                                                                                                                  |
| ---------------- | ------ | -------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `x-chain`        | string | No       | chain-specific          | Chain header for supported wallet PnL networks.                                                                                                                                                                              |
| `wallet`         | string | Yes      | -                       | Wallet address.                                                                                                                                                                                                              |
| `position_scope` | string | No       | duration_only           | PnL calculation mode. `duration_only` calculates PnL only for each selected time bucket. `cumulative` calculates realized PnL cumulatively from the start time, while unrealized PnL is based on the all-time open position. |
| `time_from`      | string | No       | current time - 100 days | Start time in `YYYY-MM-DD HH:mm:ss` format.                                                                                                                                                                                  |
| `time_to`        | string | No       | current time            | End time in `YYYY-MM-DD HH:mm:ss` format.                                                                                                                                                                                    |
