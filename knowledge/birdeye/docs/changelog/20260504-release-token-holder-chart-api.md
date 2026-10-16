---
title: 2026.05.04 - Release Token Holder Chart API
description: Added release note.
---

# 2026.05.04 - Release Token Holder Chart API

New API to retrieve historical holder count chart data for tokens on Solana.

## Features

### Token - Holder Chart

[GET /token/v1/holder/chart](../data-api/holder/get-token-v1-holder-chart)

* Retrieve historical holder count data for any Solana token
* Support multiple time granularities: 1s, 1m, 1h, 1d
* Configurable data padding mode for handling missing timestamps
* Percentage change calculation modes (beginning vs previous)
* **Note:** 1s granularity only supports data within the last 3 days

#### Parameters

| Parameter     | Type    | Required | Default   | Description                                                                        |
| ------------- | ------- | -------- | --------- | ---------------------------------------------------------------------------------- |
| token_address | string  | Yes      | -         | Token mint address                                                                 |
| chart_type    | string  | No       | 1h        | Time granularity: 1d, 1h, 1m, 1s                                                   |
| from          | integer | No       | -         | Start time (Unix timestamp)                                                        |
| to            | integer | No       | -         | End time (Unix timestamp)                                                          |
| mode          | string  | No       | padding   | Data handling: `padding` (fills gaps) or `no_fill` (only changed values)           |
| percent_mode  | string  | No       | beginning | % change calculation: `beginning` (vs first record) or `previous` (vs last record) |
| count         | integer | No       | 20        | Number of records (1-100)                                                          |
