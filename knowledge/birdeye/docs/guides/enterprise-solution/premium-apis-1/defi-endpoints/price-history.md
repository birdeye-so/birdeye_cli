---
description: "''"
title: price history
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
**API Endpoint:** /defi/history\_price

**Description:** This endpoint enables fetching historical token prices for a specific token address within a specified time range and interval. By providing the token address, address type (e.g., token), OHLCV interval type (e.g., 15 minutes). The response can include up to a maximum of 1000 records.

## Request

**Request Method:** GET

**Data Coverage:** Multi-chain

**Request URL:**

```undefined
https://public-api.birdeye.so/defi/history_price?address=So11111111111111111111111111111111111111112&address_type=token&type=15m&time_from=1691997839&time_to=1692266639
```

**Request Headers:**

```undefined
accept: application/json
x-chain: any chains that Birdeye supports. Example: solana, ethereum
X-API-KEY: YOUR_API_KEY
```

**Parameters:**

| Key            | Data Type | Details                                                              | Example                                     |
| :------------- | :-------- | :------------------------------------------------------------------- | :------------------------------------------ |
| `address`      | string    | The Solana token address to retrieve historical prices for.          | So11111111111111111111111111111111111111112 |
| `address_type` | string    | The type of address provided                                         | token                                       |
| `type`         | string    | The OHLCV interval type                                              | 15m                                         |
| `time_from`    | int       | The Unix timestamp representing the start of the desired time range. | 1691997839                                  |
| `time_to`      | int       | The Unix timestamp representing the end of the desired time range.   | 1692266639                                  |

## **Response**

 The response provides an array of historical token prices for the specified token address, each including the token address, Unix timestamp, and price value.

**Example Request:**

```bash
curl -X 'GET' \
  'https://public-api.birdeye.so/defi/history_price?address=So11111111111111111111111111111111111111112&address_type=token&type=15m&time_from=1691997839&time_to=1692266639' \
  -H 'accept: application/json' \
  -H 'x-chain: solana' \
  -H 'X-API-KEY: YOUR-API-KEY'
```

**Example Response:**

```json
{
  "data": {
    "items": [
      {
        "address": "So11111111111111111111111111111111111111112",
        "unixTime": 1691998200,
        "value": 24.417357853450138
      },
      {
        "address": "So11111111111111111111111111111111111111112",
        "unixTime": 1691999100,
        "value": 24.396416819129854
      },
      // More historical token price data points...
    ]
  },
  "success": true
}
```

**Response Parameters:**

| Key        | Data Type | Details                                                     | Example                                     |
| :--------- | :-------- | :---------------------------------------------------------- | :------------------------------------------ |
| `address`  | string    | The Solana token address to retrieve historical prices for. | So11111111111111111111111111111111111111112 |
| `unixTime` | string    | The Unix timestamp                                          | 1691998200                                  |
| `value`    | string    | The price of the token at the Unix timestamp                | 24.417357853450138                          |

**Note:** Replace the address in the request URL with the actual token address you wish to inquire about. The x-chain header specifies the blockchain network, and the X-API-KEY header provides authentication for the premium API.