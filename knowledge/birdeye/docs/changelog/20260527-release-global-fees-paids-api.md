---
title: 2026.05.27 - Release Global Fees Paid API
description: Added release note.
---

# 2026.05.27 - Release Global Fees Paid API

New APIs to retrieve global fees paid analytics for Solana tokens, including fee composition breakdowns across network, priority, tips, and trading platforms.

## Features

### Token - Fee (Single)

[GET /defi/v3/token/fee/single](../data-api/global-fees-paid/get-defi-v3-token-fee-single)

* Retrieve global fees paid metrics for a single token
* Include aggregated `summary` and source-level `details`
* Support up to 3 requested timeframes per call
* Supported timeframes: `alltime`, `24h`, `8h`, `4h`, `2h`, `1h`, `30m`, `15m`, `5m`, `1m`

***

### Token - Fee (Multiple)

[GET /defi/v3/token/fee/multiple](../data-api/global-fees-paid/get-defi-v3-token-fee-multiple)

* Retrieve global fees paid metrics for multiple tokens in one request
* Return per-token, per-timeframe fee breakdown with both summary and details sections
* Support up to 3 requested timeframes per call
* Supported timeframes: `alltime`, `24h`, `8h`, `4h`, `2h`, `1h`, `30m`, `15m`, `5m`, `1m`

#### Parameters

| Endpoint                      | Parameter        | Type   | Required | Default | Description                                       |
| ----------------------------- | ---------------- | ------ | -------- | ------- | ------------------------------------------------- |
| `/defi/v3/token/fee/single`   | `x-chain`        | string | No       | solana  | Chain header. Currently supports Solana.          |
| `/defi/v3/token/fee/single`   | `address`        | string | Yes      | -       | Token mint address.                               |
| `/defi/v3/token/fee/single`   | `list_timeframe` | string | No       | -       | Comma-separated timeframe list. Maximum 3 values. |
| `/defi/v3/token/fee/multiple` | `x-chain`        | string | No       | solana  | Chain header. Currently supports Solana.          |
| `/defi/v3/token/fee/multiple` | `list_address`   | string | Yes      | -       | Comma-separated token mint addresses.             |
| `/defi/v3/token/fee/multiple` | `list_timeframe` | string | No       | -       | Comma-separated timeframe list. Maximum 3 values. |
