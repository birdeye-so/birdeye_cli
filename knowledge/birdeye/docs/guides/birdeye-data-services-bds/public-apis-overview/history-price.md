---
description: "''"
title: history_price
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
**API Endpoint: /public/history\_price**

**Description:** This endpoint allows you to retrieve historical end-of-day token price data from various blockchain networks. You can specify a time range and choose between two types of data: aggregated token price across the blockchain ('token') or token price of a specific pool/market ('pair').

**Request Method:** GET

**Request URL:**

```vbnet
https://public-api.birdeye.so/public/history_price?address=So11111111111111111111111111111111111111112&type=token&time_from=1691875200&time_to=1692175119
```

**Request Headers:**

* `accept: application/json`
* `x-chain: solana`

**Parameters:**

* `address` (string): The token address for which you want to retrieve historical price data.
* `type` (string): Specify as 'token' for aggregated token price or 'pair' for token price of a specific pool/market.
* `time_from` (integer): Unix timestamp representing the starting time of the desired time range.
* `time_to` (integer): Unix timestamp representing the ending time of the desired time range.

**Response:** The response includes historical end-of-day token price data points within the specified time range and for the selected data type.

**Example Request:**

```bash
curl -X 'GET' \
  'https://public-api.birdeye.so/public/history_price?address=So11111111111111111111111111111111111111112&type=token&time_from=1691875200&time_to=1692175119' \
  -H 'accept: application/json' \
  -H 'x-chain: solana'
```

**Example Response:**

```json
{
  "data": {
    "items": [
      {
        "address": "So11111111111111111111111111111111111111112",
        "unixTime": 1691884800,
        "value": 24.218945330793254
      },
      {
        "address": "So11111111111111111111111111111111111111112",
        "unixTime": 1691971200,
        "value": 25.160691078049613
      },
      {
        "address": "So11111111111111111111111111111111111111112",
        "unixTime": 1692057600,
        "value": 23.886289977544283
      },
      {
        "address": "So11111111111111111111111111111111111111112",
        "unixTime": 1692144000,
        "value": 23.360067155936587
      }
    ]
  },
  "success": true
}
```

**Note:** Replace the token address, type, and timestamps in the request URL with the actual values for your query. The `x-chain` header specifies the blockchain network (in this case, Solana) for the request. The response structure contains actual historical end-of-day token price data points received from the server.

## Try it out

Visit the following page to try out all the endpoints:

**API Base URL:** [https://public-api.birdeye.so/](https://public-api.birdeye.so/)
