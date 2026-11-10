---
title: Token/Pair OHLCV
excerpt: SUBSCRIBE_PRICE
deprecated: false
hidden: false
metadata:
  robots: index
---
# Subscribing to Real-Time Price Updates (SUBSCRIBE_PRICE)

The "SUBSCRIBE_PRICE" event allows you to receive real-time updates about price changes for tokens or token pairs. You can subscribe to price updates for individual tokens, token pairs, or a combination of both. This subscription is useful for tracking price movements and trends on the Birdeye platform.

### WebSocket Price Updates

Although the interval is **1 minute** (or any supported interval), price updates occur whenever a transaction affects the price, reflecting the new close price within the interval. However, the **aggregated price** is updated based on an internal **ranking pool mechanism**, meaning not every transaction results in a price change.

🔹 We recommend implementing **ping-pong checks and reconnection strategies** when using WebSockets to ensure a stable connection and accurate price updates.

You can use this Websocket to get real time price updates of following objects:

- Token Price
- Pair (Market Price)
- Multiple Tokens/Pairs Price

**Supported Timeframes**

We support a wide range of timeframes for all chains via the WebSocket API, ranging from 1 minute to 1 month: 1m, 3m, 5m, 15m, 30m, 1H, 2H, 4H, 6H, 8H, 12H, 1D, 3D, 1W, 1M. For **Solana, Ethereum, Base, Bsc, Robinhood, Mantle&#x20;**&#x77;e also support additional smaller intervals: **1s, 15s, 30s.** These timeframes can be used in your subscription requests to receive candlestick data at the desired granularity.<br />

**Chain support**: All chains<br />

## 1. WebSocket URL:

```yaml
wss://public-api.birdeye.so/socket/solana?x-api-key=YOUR-API-KEY
```

### Scaled OHLCV values

Price WebSocket subscriptions can return raw OHLCV values, scaled OHLCV values, or both.

Use the `mode` field in your subscription payload to control which values are returned.

| Field  | Type   | Required | Description                                                                                                           |
| ------ | ------ | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `mode` | string | No       | Controls whether the response includes raw values, scaled values, or both. Supported values: `raw`, `scaled`, `both`. |

Supported `mode` values:

| Mode     | Description                                                                             |
| -------- | --------------------------------------------------------------------------------------- |
| `raw`    | Returns the original OHLCV fields: `o`, `h`, `l`, `c`, and `v`.                         |
| `scaled` | Returns scaled OHLCV fields: `scaledO`, `scaledH`, `scaledL`, `scaledC`, and `scaledV`. |
| `both`   | Returns both raw and scaled OHLCV fields.                                               |

Scaled responses may also include:

| Field        | Type           | Description                                       |
| ------------ | -------------- | ------------------------------------------------- |
| `isScaled`   | boolean        | Indicates whether the token price data is scaled. |
| `multiplier` | number or null | The multiplier used to calculate scaled values.   |
| `scaledO`    | number         | Scaled open price.                                |
| `scaledH`    | number         | Scaled high price.                                |
| `scaledL`    | number         | Scaled low price.                                 |
| `scaledC`    | number         | Scaled close price.                               |
| `scaledV`    | number         | Scaled volume.                                    |

The instructions for each type of objects are described below.

## Code Example

Checkout this Github file for an example:

> [https://github.com/TheNang2710/bds-public/blob/main/wsPrice.js](https://github.com/TheNang2710/bds-public/blob/main/wsPrice.js)

## 1 - Subscribe Token Price (OHLCV)

To receive real-time updates about price changes for a specific token in the form of OHLCV (Open, High, Low, Close, Volume) data, you can use the following subscription message format:

### Input

```json
{
  "type": "SUBSCRIBE_PRICE",
  "data": {
    "queryType": "simple",
    "chartType": "1m",
    "address": "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB",
    "currency": "usd",
    "mode": "raw",
    "chartBy": "price"
  }
}
```

Set `mode` to `raw`, `scaled`, or `both` to control which OHLCV fields are returned.
Set `chartBy` to `mcap` when you want to get OHLC by market cap value instead of price
### Output Example

```json
{
    "type": "PRICE_DATA",
    "data": {
        "eventType": "ohlcv",
        "type": "1m",
        "unixTime": 1779178680,
        "vUsd": 845.4631204650238,
        "symbol": "TSLAx",
        "address": "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB",
        "isScaled": true,
        "multiplier": 1,
        "o": 408.06039994294514,
        "h": 408.36797602519937,
        "l": 407.7032068774737,
        "c": 408.11107798807353,
        "v": 2.07166681,
    }
}
```

### Response fields

| Field        | Type           | Description                                                     |
| ------------ | -------------- | --------------------------------------------------------------- |
| `o`          | number         | Raw open price.                                                 |
| `h`          | number         | Raw high price.                                                 |
| `l`          | number         | Raw low price.                                                  |
| `c`          | number         | Raw close price.                                                |
| `v`          | number         | Raw volume.                                                     |
| `scaledO`    | number         | Scaled open price. Returned when `mode` is `scaled` or `both`.  |
| `scaledH`    | number         | Scaled high price. Returned when `mode` is `scaled` or `both`.  |
| `scaledL`    | number         | Scaled low price. Returned when `mode` is `scaled` or `both`.   |
| `scaledC`    | number         | Scaled close price. Returned when `mode` is `scaled` or `both`. |
| `scaledV`    | number         | Scaled volume. Returned when `mode` is `scaled` or `both`.      |
| `isScaled`   | boolean        | Indicates whether the token price data is scaled.               |
| `multiplier` | number or null | The multiplier used to calculate scaled values.                 |

## 2 - Subscribe Pair Price (OHLCV)

To receive real-time updates about price changes for a specific token pair in the form of OHLCV (Open, High, Low, Close, Volume) data, you can use the following subscription message format:

Checkout this Github file for example

> [https://github.com/TheNang2710/bds-public/blob/main/wsPricePair.js](https://github.com/TheNang2710/bds-public/blob/main/wsPricePair.js)

### Input

```json
{
    "type": "SUBSCRIBE_PRICE",
    "data": {
        "queryType": "simple",
        "chartType": "1m",
        "address": "7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm",
        "currency": "pair"
    }
}
```

### Output Example

```json
{
  "type": "PRICE_DATA",
  "data": {
    "o": 24.552070604303985,
    "h": 24.555908821439385,
    "l": 24.552070604303985,
    "c": 24.555908821439385,
    "eventType": "ohlcv",
    "type": "1m",
    "unixTime": 1675506120,
    "v": 51.838008518,
    "symbol": "SOL-USDC",
    "address": "7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm"
  }
}
```

## 3 - Subscribe to Multiple Addresses Price (OHLCV) - Limit 100

You can also subscribe to price changes for multiple addresses by using the "complex" query type.

You can get updates for maximum 100 addresses at once.

**Subscribing to Price for Multiple Tokens**

**SUBSCRIBE_PRICE** replaces the existing price subscription for that connection and message type. If you want to **add** more tokens to your price subscription, you must send a new **SUBSCRIBE_PRICE** message whose payload includes **the full list of token addresses you want to receive price updates for**— including both tokens you were already subscribed to and the new ones.

**Example** You first send: **SUBSCRIBE_PRICE** for **So11111111111111111111111111111111111111112**

You will begin receiving:

OHLCV (price) events for **So11111111111111111111111111111111111111112**

Later, you want to subscribe to price updates for an additional token: **JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN**

To do this, you must send **SUBSCRIBE_PRICE** again with a payload containing both addresses: **SUBSCRIBE_PRICE** with addresses: **\[So11111111111111111111111111111111111111112, JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN]**

**Result**

You continue receiving OHLCV events for **So11111111111111111111111111111111111111112**

You start receiving OHLCV events for **JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN**

The previous **SUBSCRIBE_PRICE** subscription is overwritten by the new one (now containing both tokens)

Checkout this Github file for example

[https://github.com/TheNang2710/bds-public/blob/main/wsPriceMul.js](https://github.com/TheNang2710/bds-public/blob/main/wsPricePair.js)

The following example demonstrates how to subscribe to price changes for specific token addresses or token pair addresses:

### Input

```json
{
    "type": "SUBSCRIBE_PRICE",
    "data": {
        "queryType": "complex",
        "query": "(address = So11111111111111111111111111111111111111112 AND chartType = 1m AND currency = usd) OR (address = 7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm AND chartType = 3m AND currency = pair)"
    }
}
```

### Output Example (First Subscription)

```json
{
  "type": "PRICE_DATA",
  "data": {
    "o": 24.567048925168383,
    "h": 24.56815678411483,
    "l": 24.460703007175056,
    "c": 24.460884,
    "eventType": "ohlcv",
    "type": "1m",
    "unixTime": 1675506240,
    "v": 69.46933086099999,
    "symbol": "SOL",
    "address": "So11111111111111111111111111111111111111112"
  }
}
```

### Output Example (Second Subscription)

```json
{
  "type": "PRICE_DATA",
  "data": {
    "o": 24.544784561403507,
    "h": 24.544784561403507,
    "l": 24.543643515795363,
    "c": 24.543643515795363,
    "eventType": "ohlcv",
    "type": "3m",
    "unixTime": 1675506240,
    "v": 18.760775588,
    "symbol": "SOL-USDC",
    "address": "7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm"
  }
}
```

Please note that the provided examples in the output sections are truncated for brevity. The actual output may contain additional fields and information. Adapt the subscription messages according to your requirements and process the received real-time data accordingly.
