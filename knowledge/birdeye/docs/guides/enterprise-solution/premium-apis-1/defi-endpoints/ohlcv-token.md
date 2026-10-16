---
description: "''"
title: ohlcv token
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
**API Endpoint:** /defi/ohlcv

**Description:** This endpoint allows you to fetch historical Open, High, Low, Close, and Volume (OHLCV) data for a specific token across various blockchain networks. By specifying the OHLCV interval type (e.g., 15 minutes). The response can include up to a maximum of 1000 records.

**Data Coverage:** Multi-chain

**Request Method:** GET

**Request URL:**

```undefined
https://public-api.birdeye.so/defi/ohlcv?address=So11111111111111111111111111111111111111112&type=15m&time_from=1691997839&time_to=1692266639
```

**Request Headers:**

```undefined
accept: application/json
x-chain: any chains that Birdeye supports. Example: solana, ethereum
X-API-KEY: YOUR_API_KEY
```

**Parameters:**

* `address` (string): The token address for which you want to retrieve OHLCV data.

* `type` (string): The OHLCV interval type.
  * Available values: `1m, 3m, 5m, 15m, 30m, 1H, 2H, 4H, 6H, 8H, 12H, 1D, 3D, 1W, 1M`

* `time_from` (int): The Unix timestamp representing the start of the desired time range.

* time\_to (int): The Unix timestamp representing the end of the desired time range.

**Response:** The response provides an array of OHLCV data points, each including open, high, low, close, volume, interval type, and Unix timestamp.

**Example Request:**

```bash
curl -X 'GET' \
  'https://public-api.birdeye.so/defi/ohlcv?address=So11111111111111111111111111111111111111112&type=15m&time_from=1691997839&time_to=1692266639' \
  -H 'accept: application/json' \
  -H 'x-chain: solana' \
  -H 'X-API-KEY: 061eef71caa947a3b82c8dbda8bbdf63'
```

**Example Response:**

```json
{
  "data": {
    "items": [
      {
        "address": "So11111111111111111111111111111111111111112",
        "c": 24.417357853450138,
        "h": 24.488782676900453,
        "l": 24.364198141989977,
        "o": 24.48333382191086,
        "type": "15m",
        "unixTime": 1691998200,
        "v": 3409.157415062003
      },
      // More OHLCV data points...
    ]
  },
  "success": true
}
```

**Note:** Replace the address in the request URL with the actual token address. The x-chain header specifies the blockchain network, and the X-API-KEY header provides authentication for the premium API.