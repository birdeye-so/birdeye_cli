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
**API Endpoint: /defi/price**

**Description:** This endpoint allows you to fetch the current price of a specific token on various blockchain networks. Birdeye provides comprehensive data support across multiple blockchain networks, and new data is continually added.

**Request Method:** GET

**Data Coverage:** Multi-chain

**Request URL:**

```plaintext
https://public-api.birdeye.so/defi/price?address=So11111111111111111111111111111111111111112
```

**Request Headers:**

```plaintext
accept: application/json
x-chain: any chains that Birdeye supports. Example: solana, ethereum
X-API-KEY: YOUR_API_KEY
```

**Parameters:**

| Key                 | Data Type | Details                                                                                                                                | Example                                     |
| :------------------ | :-------- | :------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------ |
| `include_liquidity` | boolean   | Indicates whether liquidity data is included.                                                                                          | True                                        |
| `check_liquidity`   | number    | The liquidity value to verify. For examples, if there is no pool having liquidity higher than the check value, then the price is null. | 1000.25                                     |
| `address`           | string    | The token address to retrieve historical prices for.                                                                                   | So11111111111111111111111111111111111111112 |

**Response:** The response includes the current token price along with update information.

**Example Request:**

```bash
curl -X 'GET' \
  --url 'https://public-api.birdeye.so/defi/price?check_liquidity=1000.25&include_liquidity=true&address=So11111111111111111111111111111111111111112' \
  -H 'accept: application/json' \
  -H 'x-chain: solana' \
  -H 'X-API-KEY: YOUR_API_KEY'
```

**Example Response:**

```json
{
  "data": {
    "value": 183.7711080837706,
    "updateUnixTime": 1710817067,
    "updateHumanTime": "2024-03-19T02:57:47",
    "liquidity": 133174881.38553858
  },
  "success": true
}
```

**Response parameters:**

| Key               | Data Type | Details                                                           | Example               |
| :---------------- | :-------- | :---------------------------------------------------------------- | :-------------------- |
| `value`           | number    | The price of the token at the Unix timestamp.                     | 180.82995503693155    |
| `updateUnixtime`  | integer   | Represents a Unix timestamp measured in seconds.                  | 1710819729            |
| `updateHumanTime` | string    | Represents a human-readable date and time in ISO 8601 format.     | "2024-03-19T03:42:09" |
| `liquidity`       | number    | Represents the liquidity value associated with the request token. | 131808964.67666951    |

**Note:** Replace `So11111111111111111111111111111111111111112` in the request URL with the actual Solana token address you wish to inquire about. The `x-chain` header specifies the blockchain network (Solana) for the request, and the `X-API-KEY` header requires your API key for authorization.