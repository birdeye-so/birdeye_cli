---
title: 2026.08.26 - Add Market Cap For OHLCV endpoints
description: Added release note.
---

# 2026.08.26 - Add Market Cap For OHLCV endpoints

A new OHLCV chart type option is now available for token OHLCV endpoints, allowing callers to return market cap candles instead of price candles without changing the response schema.

**OHLCV - Market Cap Chart Type**

[GET /defi/v3/ohlcv](../data-api/price-ohlcv/get-defi-v3-ohlcv)  
[GET /defi/ohlcv](../data-api/price-ohlcv/get-defi-ohlcv)

### Features

- Add `chart_type` support for token OHLCV endpoints
- Support `chart_type=price` and `chart_type=mcap`
- Keep `price` as the default for backward compatibility
- Return market cap OHLC values when `chart_type=mcap`

### Parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `x-chain` | string | No | solana | Chain header. Market cap charting applies to Solana token OHLCV only. |
| `address` | string | Yes | - | Token address to query. |
| `type` | string | Yes | - | Candle interval. |
| `currency` | string | No | usd | Quote currency. Supports `usd` and `native` for token OHLCV. |
| `ui_amount_mode` | string | No | raw | Display mode for OHLCV output: `raw`, `scaled`, or `both`. |
| `mode` | string | No | range | Query mode: `range` or `count`. |
| `count_limit` | integer | No | 5000 | Maximum candles returned when `mode=count`. Range: `1..5000`. |
| `chart_type` | string | No | price | OHLC chart type: `price` or `mcap`. |

### Response

The response keeps the existing OHLCV structure and can return:

- `o`, `h`, `l`, `c` - OHLC values as either price candles or market cap candles depending on `chart_type`
- `v` - token volume, unchanged
- `v_usd` / `vUsd` - USD volume, unchanged
- `scaledO`, `scaledH`, `scaledL`, `scaledC` - present according to `ui_amount_mode`; for `chart_type=mcap`, these mirror market cap OHLC values
- `scaledV` - unchanged and still follows existing scaled volume behavior
- `address` - token address
- `type` - candle interval
- `currency` - requested quote currency
- `unix_time` / `unixTime` - candle timestamp

### Use cases

- Chart token market cap history with the same OHLCV integration already used for price charts
- Switch between price candles and market cap candles without changing downstream parsing
- Analyze market cap structure over time for meme coins, new listings, and volatile tokens
- Build charting or analytics features that need backward-compatible OHLCV responses with alternative candle semantics
