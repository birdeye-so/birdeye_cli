---
description: "''"
title: Historical Price Unix
excerpt: >-
  This endpoint retrieves the historical price of a specified token at the
  closest available time to a given Unix timestamp.
deprecated: false
hidden: true
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
\*API Endpoint:\*\* /defi/historical\_price\_unix

**Description:** This endpoint is designed to provide historical price data for tokens at a specific point in time. When queried with a token's address and a Unix timestamp, it returns the token's price and 24-hour price change closest to the specified time in the past. Currently, this endpoint supports querying only a single token on the Solana network and supports data from August 2023 onward.

## Request

**Request Method:** GET

**Data Coverage:** Solana

**Request URL:**

```undefined
https://public-api.birdeye.so/defi/historical_price_unix?address=So11111111111111111111111111111111111111112&unixtime=1717662038
```

**Request Headers:**

```undefined
accept: application/json
x-chain: any chains that Birdeye supports. Example: solana, ethereum
X-API-KEY: YOUR_API_KEY
```

**Parameters:**

| Key        | Data Type | Details                                                                           | Example                                     |
| :--------- | :-------- | :-------------------------------------------------------------------------------- | :------------------------------------------ |
| `address`  | string    | The Solana token address to retrieve historical prices for.                       | So11111111111111111111111111111111111111112 |
| `unixtime` | integer   | The Unix timestamp representing the specific point in time you are interested in. | 1717662038                                  |

## **Response**

 The response provides an array of historical token price for the specified token address, each including the update Unix time, and price value.

**Example Request:**

```bash
curl -X 'GET' \
  'https://public-api.birdeye.so/defi/historical_price_unix?address=So11111111111111111111111111111111111111112&unixtime=1717662038'
  -H 'accept: application/json' \
  -H 'x-chain: solana' \
  -H 'X-API-KEY: YOUR-API-KEY'
```

**Example Response:**

```json
{
    "data": {
        "value": 140.80987179433274,
        "updateUnixTime": 1720498769,
        "priceChange24h": 7.87993650071166
    },
    "success": true
}
```

**Response Parameters:**

| Key              | Data Type | Details                                                                                                                                                     | Example            |
| :--------------- | :-------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------- |
| `value`          | float     | The price of the token at the Unix timestamp                                                                                                                | 172.45702008233184 |
| `updateUnixTime` | integer   | The Unix timestamp                                                                                                                                          | 1717662029         |
| `priceChange24h` | number    | The 24-hour price change in percentage closest to the Unix timestamp. If data for the full 24-hour period is unavailable, this field will be blank or null. | 7.87993650071166   |

**Note:** In this example, the API returns the price (172.45702008233184) of the token at the closest available time (1717662029) to the provided Unix timestamp.