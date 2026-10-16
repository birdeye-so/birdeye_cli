---
title: Base-Quote OHLCV
excerpt: SUBSCRIBE_BASE_QUOTE_PRICE
deprecated: false
hidden: false
metadata:
  robots: index
---
The "SUBSCRIBE_BASE_QUOTE_PRICE" event allows you to receive real-time updates about price changes for any token pairs without needing to input a specific pair address; you can simply pass the two token addresses you want to track. You can subscribe to price updates for these token pairs in the form of OHLCV (Open, High, Low, Close, Volume) data. This subscription is useful for tracking price movements and trends on the Birdeye platform.

## Code Example

Check out this Github file for an example:

[https://github.com/TheNang2710/bds-public/blob/main/ws-base-quote.js](https://github.com/TheNang2710/bds-public/blob/main/ws-base-quote.js)

## 1. WebSocket URL:

```
wss://public-api.birdeye.so/socket/solana?x-api-key=YOUR-API-KEY
```

### Header

| Key                      | Value                      |
| ------------------------ | -------------------------- |
| `Origin`                 | ws://public-api.birdeye.so |
| `Sec-WebSocket-Origin`   | ws://public-api.birdeye.so |
| `Sec-WebSocket-Protocol` | echo-protocol              |

## 2. Subscribe to Base-Quote Price (OHLCV)

To receive real-time updates about price changes for a specific token pair in the form of OHLCV data, use the following subscription message format:

### Subscription message

```json JSON
{
  "type": "SUBSCRIBE_BASE_QUOTE_PRICE",
  "data": {
    "baseAddress": "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB",
    "quoteAddress": "So11111111111111111111111111111111111111112",
    "chartType": "1m",
    "mode": "both"
  }
}
```

### Subscription fields

| Field          | Type   | Required | Description                                                                          |
| -------------- | ------ | -------- | ------------------------------------------------------------------------------------ |
| `baseAddress`  | string | Yes      | Base token address.                                                                  |
| `quoteAddress` | string | Yes      | Quote token address.                                                                 |
| `chartType`    | string | Yes      | OHLCV interval. Example: `1m`.                                                       |
| `mode`         | string | No       | Controls which OHLCV values are returned. Supported values: `raw`, `scaled`, `both`. |

### Mode values

Use `mode` to control whether the WebSocket response includes raw OHLCV values, scaled OHLCV values, or both.

| Mode     | Description                                                                             |
| -------- | --------------------------------------------------------------------------------------- |
| `raw`    | Returns raw OHLCV fields: `o`, `h`, `l`, `c`, and `v`.                                  |
| `scaled` | Returns scaled OHLCV fields: `scaledO`, `scaledH`, `scaledL`, `scaledC`, and `scaledV`. |
| `both`   | Returns both raw and scaled OHLCV fields.                                               |

### Sample response

```json JSON
{
  "type": "BASE_QUOTE_PRICE_DATA",
  "data": {
    "eventType": "ohlcv",
    "type": "1m",
    "unixTime": 1779175980,
    "vUsd": 0,
    "baseAddress": "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB",
    "quoteAddress": "So11111111111111111111111111111111111111112",
    "isScaledBase": true,
    "isScaledQuote": false,
    "multiplierBase": 1,
    "multiplierQuote": null,
    "o": 4.792529252342796,
    "h": 4.795878266968378,
    "l": 4.79082399724625,
    "c": 4.791854954030759,
    "v": 0,
    "scaledO": 4.792529252342796,
    "scaledH": 4.795878266968378,
    "scaledL": 4.79082399724625,
    "scaledC": 4.791854954030759,
    "scaledV": 0
  }
}
```

### Response fields

| Field             | Type           | Description                                                                                |
| ----------------- | -------------- | ------------------------------------------------------------------------------------------ |
| `eventType`       | string         | Event type. For OHLCV updates, this is `ohlcv`.                                            |
| `type`            | string         | OHLCV interval. Example: `1m`.                                                             |
| `unixTime`        | number         | Candle timestamp in Unix time.                                                             |
| `vUsd`            | number         | Volume in USD.                                                                             |
| `baseAddress`     | string         | Base token address.                                                                        |
| `quoteAddress`    | string         | Quote token address.                                                                       |
| `isScaledBase`    | boolean        | Indicates whether the base token uses scaled values.                                       |
| `isScaledQuote`   | boolean        | Indicates whether the quote token uses scaled values.                                      |
| `multiplierBase`  | number         | Multiplier applied to the base token.                                                      |
| `multiplierQuote` | number or null | Multiplier applied to the quote token. Returns `null` when no quote multiplier is applied. |
| `o`               | number         | Raw open price. Returned when `mode` is `raw` or `both`.                                   |
| `h`               | number         | Raw high price. Returned when `mode` is `raw` or `both`.                                   |
| `l`               | number         | Raw low price. Returned when `mode` is `raw` or `both`.                                    |
| `c`               | number         | Raw close price. Returned when `mode` is `raw` or `both`.                                  |
| `v`               | number         | Raw volume. Returned when `mode` is `raw` or `both`.                                       |
| `scaledO`         | number         | Scaled open price. Returned when `mode` is `scaled` or `both`.                             |
| `scaledH`         | number         | Scaled high price. Returned when `mode` is `scaled` or `both`.                             |
| `scaledL`         | number         | Scaled low price. Returned when `mode` is `scaled` or `both`.                              |
| `scaledC`         | number         | Scaled close price. Returned when `mode` is `scaled` or `both`.                            |
| `scaledV`         | number         | Scaled volume. Returned when `mode` is `scaled` or `both`.                                 |

### Implementation Example in JavaScript

Use the above github js code and run

```shell bash
node ws-base-quote.js solana So11111111111111111111111111111111111111112 EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v 1m
```

**Explanation:**

* `solana`: The blockchain chain to subscribe to (e.g., Solana).
* `So11111111111111111111111111111111111111112`: The base token address.
* `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`: The quote token address (e.g., USDC).
* `1m`: The chart type, which is the interval for OHLCV data (e.g., 1 minute).

**Note:**

* This example subscribes to real-time price updates for a token pair and logs the Open, High, Low, Close, and Volume data to the console. The subscription is automatically closed after 1 hour.
* This WebSocket only support 1 base-quote pair for 1 connection. You need to open another connection for new base-quote subscription.
