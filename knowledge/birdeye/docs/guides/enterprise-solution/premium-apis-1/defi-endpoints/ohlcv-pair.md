---
description: "''"
title: ohlcv pair
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
**API Endpoint:** /defi/ohlcv/pair

**Description:** This endpoint enables you to retrieve historical Open, High, Low, Close, and Volume (OHLCV) data for a specific trading pair on various blockchain networks. By specifying the trading pair's address and OHLCV interval type (e.g., 15 minutes). The response can include up to a maximum of 1000 records.

**Request Method:** GET

**Data Coverage:** Multi-chain

**Request URL:**

```undefined
https://public-api.birdeye.so/defi/ohlcv/pair?address=9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT&type=15m&time_from=1691997839&time_to=1692266639
```

**Request Headers:**

```undefined
accept: application/json
x-chain: any chains that Birdeye supports. Example: solana, ethereum
X-API-KEY: YOUR_API_KEY
```

**Parameters:**

* `address` (string): The trading pair's token address for which you want to retrieve OHLCV data.
* `type` (string): The OHLCV interval type (e.g., 15m for 15 minutes).
* `time_from` (int): The Unix timestamp representing the start of the desired time range.
* `time_to` (int): The Unix timestamp representing the end of the desired time range. **Response:** The response provides an array of OHLCV data points for the specified trading pair, each including open, high, low, close, volume, interval type, and Unix timestamp. **Example Request:**

```bash
curl -X 'GET' \
  'https://public-api.birdeye.so/defi/ohlcv/pair?address=9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT&type=15m&time_from=1691997839&time_to=1692266639' \
  -H 'accept: application/json' \
  -H 'x-chain: solana' \
  -H 'X-API-KEY: YOUR_API_KEY'
```

**Example Response:**

```json
{
  "data": {
    "items": [
      {
        "address": "9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT",
        "h": 39,
        "o": 39,
        "l": 39,
        "c": 39,
        "type": "15m",
        "v": 0,
        "unixTime": 1691998200
      },
      // More OHLCV data points for the trading pair...
    ]
  },
  "success": true
}
```

**Note:** Replace the address in the request URL with the actual trading pair's token address. The x-chain header specifies the blockchain network (Solana), and the X-API-KEY header provides authentication for the premium API.