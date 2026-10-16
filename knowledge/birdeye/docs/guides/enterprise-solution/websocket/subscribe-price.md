---
description: "''"
title: SUBSCRIBE_PRICE (OHLCV)
excerpt: ''
deprecated: false
hidden: true
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
# Subscribing to Real-Time Price Updates (SUBSCRIBE\_PRICE)

The "SUBSCRIBE\_PRICE" event allows you to receive real-time updates about price changes for tokens or token pairs. You can subscribe to price updates for individual tokens, token pairs, or a combination of both. This subscription is useful for tracking price movements and trends on the Birdeye platform.

### WebSocket Price Updates

Although the interval is **1 minute** (or any supported interval), price updates occur whenever a transaction affects the price, reflecting the new close price within the interval. However, the **aggregated price** is updated based on an internal **ranking pool mechanism**, meaning not every transaction results in a price change.

🔹 We recommend implementing **ping-pong checks and reconnection strategies** when using WebSockets to ensure a stable connection and accurate price updates.

You can use this Websocket to get real time price updates of following objects:

* Token Price
* Pair (Market Price)
* Multiple Tokens/Pairs Price

The instructions for each type of objects are described below.

## Code Example

Checkout this Github file for an example:

> [https://github.com/birdeye-so/tradingview-example-js-api/blob/main/websocket\_example.js](https://github.com/birdeye-so/tradingview-example-js-api/blob/main/websocket_example.js)

## 1 - Subscribe Token Price (OHLCV)

To receive real-time updates about price changes for a specific token in the form of OHLCV (Open, High, Low, Close, Volume) data, you can use the following subscription message format:

### Input

```json
{
    "type": "SUBSCRIBE_PRICE",
    "data": {
        "queryType": "simple",
        "chartType": "1m",
        "address": "So11111111111111111111111111111111111111112",
        "currency": "usd"
    }
}
```

### Output Example

```json
{
  "type": "PRICE_DATA",
  "data": {
    "o": 24.586420063533236,
    "h": 24.586420063533236,
    "l": 24.586420063533236,
    "c": 24.586420063533236,
    "eventType": "ohlcv",
    "type": "1m",
    "unixTime": 1675506000,
    "v": 32.928421816,
    "symbol": "SOL",
    "address": "So11111111111111111111111111111111111111112"
  }
}
```

## 2 - Subscribe Pair Price (OHLCV)

To receive real-time updates about price changes for a specific token pair in the form of OHLCV (Open, High, Low, Close, Volume) data, you can use the following subscription message format:

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