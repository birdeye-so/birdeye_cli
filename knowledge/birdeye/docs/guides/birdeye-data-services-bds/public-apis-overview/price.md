---
description: "''"
title: price
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
**API Endpoint: /public/price**

**Description:** This endpoint facilitates fetching the current price of a specific token on various blockchain networks. Birdeye provides comprehensive data support across multiple blockchain networks, and new data is continually added.

**Request Method:** GET

**Request URL:**

```vbnet
https://public-api.birdeye.so/public/price?address=So11111111111111111111111111111111111111112
```

**Request Headers:**

* `accept: application/json`
* `x-chain: solana`

**Parameters:**

* `address` (string): The Solana token address to retrieve the current price for.

**Response:** The response includes the current token price along with update information.

**Example Request:**

```bash
curl -X 'GET' \
  'https://public-api.birdeye.so/public/price?address=So11111111111111111111111111111111111111112' \
  -H 'accept: application/json' \
  -H 'x-chain: solana'
```

**Example Response:**

```json
{
  "data": {
    "value": 23.44450796529084,
    "updateUnixTime": 1692175119,
    "updateHumanTime": "2023-08-16T08:38:39"
  },
  "success": true
}
```

**Note:** Replace `So11111111111111111111111111111111111111112` in the request URL with the actual Solana token address you wish to inquire about. The `x-chain` header specifies the blockchain network (Solana) for the request.

## Try it out

Visit the following page to try out all the endpoints:

**API Base URL:** [https://public-api.birdeye.so/](https://public-api.birdeye.so/)
