---
description: "''"
title: multi price
excerpt: https://public-api.birdeye.so/defi/multi_price
deprecated: false
hidden: true
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
**API Endpoint: /defi/multi\_price**

**Description:** This endpoint facilitates the retrieval of current prices for a list of tokens specified by their token addresses. The Birdeye API supports comprehensive data for various blockchain networks, continuously expanding to encompass new data sources.

**Request Method:** GET

**Data Coverage:** Multi-chain

**Request URL:**

```plaintext
https://public-api.birdeye.so/defi/multi_price?list_address=So11111111111111111111111111111111111111112%2CmSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So
```

**Request Headers:**

```plaintext
accept: application/json
x-chain: any chains that Birdeye supports. Example: solana, ethereum
X-API-KEY: YOUR_API_KEY
```

**Parameters:**

| Key                 | Data Type | Details                                                                              | Example                                                                                 |
| :------------------ | :-------- | :----------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| `include_liquidity` | boolean   | Indicates whether liquidity data is included.                                        | True                                                                                    |
| `check_liquidity`   | float     | The liquidity value to verify.                                                       | 1000.25                                                                                 |
| `list_address`      | string    | A comma-separated list of Solana token addresses to retrieve the current prices for. | So11111111111111111111111111111111111111112,mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So |

**Response:** The response includes current token prices, update information, and the 24-hour price change percentage for each token.

**Example Request:**

```bash
curl -X 'GET' \
  'https://public-api.birdeye.so/defi/multi_price?list_address=So11111111111111111111111111111111111111112%2CmSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So' \
  -H 'accept: application/json' \
  -H 'x-chain: solana' \
  -H 'X-API-KEY: YOUR_API_KEY'
```

**Example Response:**

```json
{
  "data": {
    "So11111111111111111111111111111111111111112": {
      "value": 23.40138801321701,
      "updateUnixTime": 1692181644,
      "updateHumanTime": "2023-08-16T10:27:24",
      "priceChange24h": -6.1098865467031676
    },
    "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So": {
      "value": 26.419009478261618,
      "updateUnixTime": 1692181652,
      "updateHumanTime": "2023-08-16T10:27:32",
      "priceChange24h": -6.0892735007471925
    }
  },
  "success": true
}
```

**Response Parameters:** for each request address

| Key               | Data Type | Details                                                                                                                                            | Example               |
| :---------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------- |
| `value`           | float     | The price of the token at the Unix timestamp.                                                                                                      | 180.82995503693155    |
| `updateUnixtime`  | integer   | Represents a Unix timestamp measured in seconds.                                                                                                   | 1710819729            |
| `updateHumanTime` | string    | Represents a human-readable date and time in ISO 8601 format.                                                                                      | "2024-03-19T03:42:09" |
| `priceChange24h`  | float     | Represents the price change of an asset in the last 24 hours. A negative value indicates a decrease, while a positive value indicates an increase. | -6.1098865467031676   |

**Note:** Replace `YOUR_API_KEY` in the request headers with your actual API key. The `list_address` parameter should be a comma-separated list of Solana token addresses you wish to inquire about. The x-chain header specifies the blockchain network for the request.