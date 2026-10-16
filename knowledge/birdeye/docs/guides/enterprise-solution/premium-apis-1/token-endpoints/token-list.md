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
**API Endpoint:** [/defi/tokenlist](https://public-api.birdeye.so/defi/tokenlist)

**Description:** This endpoint facilitates the retrieval of a list of tokens based on various sorting criteria. You can specify the sorting method, sorting type, pagination parameters, and blockchain network to obtain a list of tokens along with their details. This API call is useful for obtaining an overview of tokens' metrics, such as market capitalization, trading volume, and volume change in percentage over the last 24 hours.\
Update on 01-Sep-2024: Add `min_liquidity` params to support user to filter the low liquidity tokens. 

**Request Method:** GET

**Data Coverage:** Multi-chain

**Request URL:**

```undefined
https://public-api.birdeye.so/defi/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=50
```

**Request Headers:**

```undefined
accept: application/json
x-chain: any chains that Birdeye supports. Example: solana, ethereum
X-API-KEY: YOUR_API_KEY
```

**Parameters:**

<Table>
  <thead>
    <tr>
      <th>
        Key
      </th>

      <th>
        Data Type
      </th>

      <th>
        Details
      </th>

      <th>
        Example
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        `sort_type`
        (Required)
      </td>

      <td>
        string
      </td>

      <td>
        The attribute to sort the tokens by. Supported values: `v24hUSD`, `mc`, `v24hChangePercent`. Default is `v24hUSD`
      </td>

      <td>
        mc
      </td>
    </tr>

    <tr>
      <td>
        `sort_type`\
        (Required)
      </td>

      <td>
        string
      </td>

      <td>
        The order to sort the traders in. Supported values: `asc`, `desc`. Default is `desc`.
      </td>

      <td>
        desc
      </td>
    </tr>

    <tr>
      <td>
        `offset`
      </td>

      <td>
        integer
      </td>

      <td>
        The starting index for the list of the token. Default is `0`
      </td>

      <td>
        0
      </td>
    </tr>

    <tr>
      <td>
        `limit`
      </td>

      <td>
        integer
      </td>

      <td>
        The maximum number of tokens to retrieve in a single call. Range: \{1:50}<br/>Default is `50`
      </td>

      <td>
        25
      </td>
    </tr>

    <tr>
      <td>
        `min_liquidity`
      </td>

      <td>
        number
      </td>

      <td>
        The filter for liquidity of the token to be returned. Default is `100`
      </td>

      <td>
        10.5
      </td>
    </tr>
  </tbody>
</Table>

**Response:** The response includes an array of token objects with their respective details, including token address, decimals, logo URI, market capitalization, symbol, 24-hour change percentage, trading volume over the last 24 hours, token name, and the total number of tokens available.

**Example Request:**

```bash
curl -X 'GET' \
  'https://public-api.birdeye.so/defi/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=0&limit=50' \
  -H 'accept: application/json' \
  -H 'x-chain: solana' \
  -H 'X-API-KEY: YOUR_API_KEY'
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "updateUnixTime": 1725507085,
    "updateTime": "2024-09-05T03:31:25",
    "tokens": [
      {
        "address": "So11111111111111111111111111111111111111112",
        "decimals": 9,
        "lastTradeUnixTime": 1725506817,
        "liquidity": 11305713600.578115,
        "logoURI": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png",
        "mc": 76959192381.0279,
        "name": "Wrapped SOL",
        "symbol": "SOL",
        "v24hChangePercent": -5.901636192870891,
        "v24hUSD": 896018873.5570325
      },
      {
        "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "decimals": 6,
        "lastTradeUnixTime": 1725506814,
        "liquidity": 3387829346.764559,
        "logoURI": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FEPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v%2Flogo.png",
        "mc": 2878289810.904429,
        "name": "USD Coin",
        "symbol": "USDC",
        "v24hChangePercent": 1.6333116913855503,
        "v24hUSD": 540339790.3614825
      }
    ],
    "total": 14815
  }
}
```

**Note:** The provided example illustrates the sorting of tokens by 24-hour trading volume in USD (v24hUSD), in descending order. Adjust the parameters as needed to tailor the response to your preferences.