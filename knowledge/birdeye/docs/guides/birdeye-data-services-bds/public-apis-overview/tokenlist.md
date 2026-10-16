---
description: "''"
title: token list
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
**API Endpoint: /public/tokenlist**

**Description:** This endpoint offers complete list of available tokens from various blockchain networks that Birdeye supports. You can customize the token list using parameters to sort, filter, and paginate through the results.

**Request Method:** GET

**Request URL:**

```vbnet
https://public-api.birdeye.so/public/tokenlist?sort_by=mc&sort_type=desc&offset=0&limit=50
```

**Request Headers:**

* `accept: application/json`
* `x-chain: solana`

**Parameters:**

* `sort_by` (string): Specify the sorting criteria. Available values: mc (market capitalization), v24hUSD (24-hour trading volume in USD), v24hChangePercent (24-hour change percentage).
* `sort_type` (string): Specify the sort order. Available values: desc (descending), asc (ascending).
* `offset` (integer): Offset for pagination, increment by 50 for each page.
* `limit` (integer): Maximum number of tokens to retrieve per request (maximum value: 50).

**Response:** The response includes a list of tokens, each with its address, decimals, logo URI, market capitalization, symbol, 24-hour change percentage, 24-hour trading volume in USD, and name. The total number of tokens is provided.

**Example Request:**

```bash
curl -X 'GET' \
  'https://public-api.birdeye.so/public/tokenlist?sort_by=mc&sort_type=desc&offset=0&limit=50' \
  -H 'accept: application/json' \
  -H 'x-chain: solana'
```

**Example Response:**

```json
{
  "data": {
    "updateUnixTime": 1692177448,
    "updateTime": "2023-08-16T09:17:28",
    "tokens": [
      {
        "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "decimals": 6,
        "logoURI": "https://img.fotofolio.xyz/?w=30&h=30&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FEPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v%2Flogo.png",
        "mc": 5035653324.272158,
        "symbol": "USDC",
        "v24hChangePercent": 12.587879465898308,
        "v24hUSD": 25656226.55150058,
        "name": "USD Coin"
      },
      {
        "address": "So11111111111111111111111111111111111111112",
        "decimals": 9,
        "logoURI": "https://img.fotofolio.xyz/?w=30&h=30&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png",
        "mc": 12987564221.565718,
        "symbol": "SOL",
        "v24hChangePercent": 3.9579696482368276,
        "v24hUSD": 21747903.368939526,
        "name": "Wrapped SOL"
      }
    ],
    "total": 11031
  },
  "success": true
}
```

**Note:** You can customize the sorting, pagination, and limit to tailor your token list query. The `x-chain` header specifies the blockchain network (in this case, Solana) for the request. The response structure contains actual token data received from the server.

## Try it out

Visit the following page to try out all the endpoints:

**API Base URL:** [https://public-api.birdeye.so/](https://public-api.birdeye.so/)
