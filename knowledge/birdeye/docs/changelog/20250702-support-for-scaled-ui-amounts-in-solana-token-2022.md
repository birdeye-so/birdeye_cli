---
title: 2025.07.02 - Support for Scaled UI Amounts in Solana Token-2022
description: None release note.
---

# 2025.07.02 - Support for Scaled UI Amounts in Solana Token-2022

Birdeye now fully supports scaled UI amounts for Solana Token-2022, enhancing accuracy in token data representation. This update introduces a new API parameter and impacts several API endpoints.

🟢 What’s New\
**New API Parameter**: `ui_amount_mode`

A new optional parameter, ui\_amount\_mode, has been added to select endpoints.

When set, this parameter ensures that token amounts are returned in a human-readable format, automatically applying the token’s decimal precision.

| Mode              | Description                                                           |
| ----------------- | --------------------------------------------------------------------- |
| `raw` *(default)* | Returns the original on-chain value (e.g., 1000000000 for 9 decimals) |
| `scaled`          | Returns the value adjusted by the token’s decimal scale               |
| `both`            | Returns both raw and scaled fields (prefixed with `scaled_`)          |

📘 APIs Impacted

| Name                                                                                             | Endpoint                        |
| ------------------------------------------------------------------------------------------------ | ------------------------------- |
| [Price](../data-api/price-ohlcv/get-defi-price)                                        | `/defi/price`                   |
| [Price (Multiple) \[GET\]](../data-api/price-ohlcv/get-defi-multi-price)               | `GET /defi/multi_price`         |
| [Price (Multiple) \[POST\]](../data-api/price-ohlcv/post-defi-multi-price)             | `POST /defi/multi_price`        |
| [OHLCV](../data-api/price-ohlcv/get-defi-ohlcv)                                        | `/defi/ohlcv`                   |
| [OHLCV (Base/Quote)](../data-api/price-ohlcv/get-defi-ohlcv-base-quote)                | `/defi/ohlcv/base_quote`        |
| [OHLCV V3](../data-api/price-ohlcv/get-defi-v3-ohlcv)                                  | `/defi/v3/ohlcv`                |
| [Historical Price](../data-api/price-ohlcv/get-defi-history-price)                     | `/defi/history_price`           |
| [Historical Price by UnixTime](../data-api/price-ohlcv/get-defi-historical-price-unix) | `/defi/historical_price_unix`   |
| [Price Volume - Single](../data-api/price-ohlcv/get-defi-price-volume-single)          | `/defi/price_volume/single`     |
| [Price Volume - Multiple](../data-api/price-ohlcv/post-defi-price-volume-multi)        | `/defi/price_volume/multi`      |
| [Price Stats - Single](../data-api/stats/get-defi-v3-price-stats-single)         | `/defi/v3/price/stats/single`   |
| [Price Stats - Multiple](../data-api/stats/post-defi-v3-price-stats-multiple)    | `/defi/v3/price/stats/multiple` |

🔧 Backward compatibility: These changes won’t break current logic. raw mode will remain the default.
