---
description: "''"
title: multi_price
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
**API Endpoint: /public/multi\_price**

**Description:** This endpoint allows you to fetch real-time prices for multiple tokens from various blockchain networks, including Solana.

**Request Method:** GET

**Request URL:**

```vbnet
https://public-api.birdeye.so/public/multi_price?list_address=So11111111111111111111111111111111111111112%2CmSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So
```

**Request Headers:**

* `accept: application/json`
* `x-chain: solana`

**Parameters:**

* `list_address` (string): Comma-separated list of token addresses for which you want to retrieve real-time prices.

**Response:** The response includes real-time price data for each token address provided in the request.

**Example Request:**

```bash
curl -X 'GET' \
  'https://public-api.birdeye.so/public/multi_price?list_address=So11111111111111111111111111111111111111112%2CmSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So' \
  -H 'accept: application/json' \
  -H 'x-chain: solana'
```

**Example Response:**

```json
{
  "data": {
    "So11111111111111111111111111111111111111112": {
      "value": 23.421456820799996,
      "updateUnixTime": 1692176422,
      "updateHumanTime": "2023-08-16T09:00:22",
      "priceChange24h": -5.574629053949564
    },
    "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So": {
      "value": 26.44064291722725,
      "updateUnixTime": 1692176483,
      "updateHumanTime": "2023-08-16T09:01:23",
      "priceChange24h": -5.564739707034138
    }
  },
  "success": true
}
```

**Note:** Replace the token addresses in the request URL with the actual addresses for which you want to retrieve real-time prices. The `x-chain` header specifies the blockchain network (in this case, Solana) for the request. The response structure contains actual price data and update information received from the server.

## Try it out

Visit the following page to try out all the endpoints:

**API Base URL:** [https://public-api.birdeye.so/](https://public-api.birdeye.so/)
