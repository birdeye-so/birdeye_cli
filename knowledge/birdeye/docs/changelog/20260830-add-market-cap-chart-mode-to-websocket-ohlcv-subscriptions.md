---
title: 2026.08.30 - Add Market Cap Chart Mode to WebSocket OHLCV Subscriptions
description: Added release note.
---

# 2026.08.30 - Add Market Cap Chart Mode to WebSocket OHLCV Subscriptions

Expand WebSocket OHLCV subscriptions with a new `chartBy` selector so clients can receive OHLCV candles by token price or by market cap.

**WebSocket - Subscribe OHLCV**

[Token/Pair OHLCV](../websockets/subscribe-price-ohlcv)

### Features

- Add `chartBy` to OHLCV subscriptions
- Support `price` and `mcap` as valid `chartBy` values
- Default `chartBy` to `price` when omitted
- Support market cap OHLCV output for token subscriptions on Solana
- Fall back to price-based OHLCV if token supply is unavailable
- Keep existing OHLCV subscription behavior unchanged for clients that do not send `chartBy`

#### Parameters

| Parameter | Type | Required | Default | Description |
| --------- | ---- | -------- | ------- | ----------- |
| `chartBy` | string | No | `price` | Select OHLCV display mode: `price` or `mcap`. `mcap` applies to token OHLCV on Solana and falls back to `price` if supply is unavailable. |

#### Compatibility Note

- Existing clients continue receiving price-based OHLCV data without any request changes
- `chartBy=mcap` is only applicable to token OHLCV on Solana
- Unsupported `chartBy` values are rejected

