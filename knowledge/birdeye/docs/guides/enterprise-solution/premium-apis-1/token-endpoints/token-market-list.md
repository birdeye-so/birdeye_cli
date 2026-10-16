---
description: "''"
title: Token - Market List
excerpt: Get all markets of a token on any supported chains.
deprecated: false
hidden: true
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
Endpoint: [\<https://public-api.birdeye.so/defi/v2/markets>](https://public-api.birdeye.so/defi/v2/markets)

**Description:** The API provides detailed information about the markets for a specific cryptocurrency token on a specified blockchain. Users can retrieve data for one or multiple markets related to a single token. This endpoint requires the specification of a token address and the blockchain to filter results. Additionally, it supports optional query parameters such as offset, limit, and required sorting by liquidity or sort type (ascending or descending) to refine the output.

**Request Method:** GET

**Data Coverage:** Multi-chain

**Request URL:**

```undefined
https://public-api.birdeye.so/defi/v2/markets?address=So11111111111111111111111111111111111111112&sort_by=liquidity&sort_type=desc&offset=0&limit=10
```

**Request Headers:**

```undefined
accept: application/json
x-chain: any chains that Birdeye supports. Example: solana, ethereum
X-API-KEY: YOUR_API_KEY
```

**Query parameters**

<Table align={["left","left","left","left"]}>
  <thead>
    <tr>
      <th style={{ textAlign: "left" }}>
        Key
      </th>

      <th style={{ textAlign: "left" }}>
        Data Type
      </th>

      <th style={{ textAlign: "left" }}>
        Details
      </th>

      <th style={{ textAlign: "left" }}>
        Example
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td style={{ textAlign: "left" }}>
        `address`
      </td>

      <td style={{ textAlign: "left" }}>
        string
      </td>

      <td style={{ textAlign: "left" }}>
        The token address to retrieve market list records for.
      </td>

      <td style={{ textAlign: "left" }}>
        REQUIRED:\
        Default: So11111111111111111111111111111111111111112
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        'sort\_by'
      </td>

      <td style={{ textAlign: "left" }}>
        string
      </td>

      <td style={{ textAlign: "left" }}>
        Sort the market list by liquidity or volume24h
      </td>

      <td style={{ textAlign: "left" }}>
        REQUIRED\
        Value: \{liquidity, volume24h}\
        Default: liquidity
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        sort\_type
      </td>

      <td style={{ textAlign: "left" }}>
        string
      </td>

      <td style={{ textAlign: "left" }}>
        Sort the market list by descending or ascending order of the "sort\_by"
      </td>

      <td style={{ textAlign: "left" }}>
        REQUIRED\
        Value: \{desc, asc}\
        Default: desc
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        `offset`
      </td>

      <td style={{ textAlign: "left" }}>
        integer
      </td>

      <td style={{ textAlign: "left" }}>
        The starting index for the list of markets.
      </td>

      <td style={{ textAlign: "left" }}>
        Not required\
        Default: 0
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        `limit`
      </td>

      <td style={{ textAlign: "left" }}>
        integer
      </td>

      <td style={{ textAlign: "left" }}>
        The maximum number of markets to retrieve.
      </td>

      <td style={{ textAlign: "left" }}>
        NOT\
        required\
        Range: \{1:10}\
        Default: 10
      </td>
    </tr>
  </tbody>
</Table>

**Response:**\
**Example Request:**

```bash
curl -X 'GET' \
  --url 'https://dev-public-api.birdeye.so/defi/v2/markets?address=So11111111111111111111111111111111111111112&sort_by=liquidity&sort_type=desc&offset=10&limit=10' \
  -H 'accept: application/json' \
  -H 'x-chain: solana' \
  -H 'X-API-KEY: YOUR_API_KEY'
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "address": "8DqXqe2F2XMkAUg2pR5zcB8qnLCUXT8UQWR5KSZXQgHm",
        "base": {
          "address": "So11111111111111111111111111111111111111112",
          "decimals": 9,
          "icon": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png",
          "symbol": "SOL"
        },
        "createdAt": "2023-09-17T16:46:28.852Z",
        "name": "SOL-KZN",
        "quote": {
          "address": "EjSwAfwi4F6uYtoi2WuCSYSWPVUPJCdemmShZ9tdy65P",
          "decimals": 9,
          "icon": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FEjSwAfwi4F6uYtoi2WuCSYSWPVUPJCdemmShZ9tdy65P%2Flogo.png",
          "symbol": "KZN"
        },
        "source": "Raydium Clamm",
        "liquidity": 336243403041.08435,
        "liquidityChangePercentage24h": null,
        "price": 299293.0196374173,
        "trade24h": 1,
        "trade24hChangePercent": -50,
        "uniqueWallet24h": 1,
        "uniqueWallet24hChangePercent": -50,
        "volume24h": 2.888252202575408,
        "volume24hChangePercentage24h": null
      },
      {
        "address": "29PFtZeeQAKZpq2ia8Jd22YTYsjYu8VQrTt2V4DTuwCs",
        "base": {
          "address": "So11111111111111111111111111111111111111112",
          "decimals": 9,
          "icon": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png",
          "symbol": "SOL"
        },
        "createdAt": "2022-10-09T12:22:19.562Z",
        "name": "SOL-KZN",
        "quote": {
          "address": "EjSwAfwi4F6uYtoi2WuCSYSWPVUPJCdemmShZ9tdy65P",
          "decimals": 9,
          "icon": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FEjSwAfwi4F6uYtoi2WuCSYSWPVUPJCdemmShZ9tdy65P%2Flogo.png",
          "symbol": "KZN"
        },
        "source": "Cykura",
        "liquidity": 4533917796.457661,
        "liquidityChangePercentage24h": null,
        "price": null,
        "trade24h": 0,
        "trade24hChangePercent": null,
        "uniqueWallet24h": 0,
        "uniqueWallet24hChangePercent": null,
        "volume24h": null,
        "volume24hChangePercentage24h": null
      }
    ],
    "total": 629786
  }
}
```

**Note:** 

* "total": 629786 is the total number market lists of that token.
* The null value of 24h change could due to the new token released that has not have the previous data yet.