---
description: "''"
title: Price Volume - Single token
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
\*API Endpoint:\*\* /defi/price\_volume/single

**Description:** This endpoint retrieves the current price and volume data for a specified token over a given time period. It provides additional details such as the most recent update time, price change percentage, and volume change percentage over the specified period. The default period is 24 hours.

## Request

**Request Method:** GET

**Data Coverage:** Multi-chain

**Request URL:**

```undefined
https://public-api.birdeye.so/defi/price_volume/single?address=So11111111111111111111111111111111111111112&type=24h
```

**Request Headers:**

```undefined
accept: application/json
x-chain: any chains that Birdeye supports. Example: solana, ethereum
X-API-KEY: YOUR_API_KEY
```

**Parameters:**

| Key       | Data Type | Details                                                                              | Example                                     |
| :-------- | :-------- | :----------------------------------------------------------------------------------- | :------------------------------------------ |
| `address` | string    | The Solana token address to retrieve historical prices for.                          | So11111111111111111111111111111111111111112 |
| `type`    | string    | The time period for the data. Supported values: 1h, 2h, 4h, 8h, 24h. Default is 24h. | 24h                                         |

## **Response**

The response provides the current price and volume data for the specified token over the given period, along with the percentage changes and the time of the last update.

**Example Request:**

```bash
curl -X 'GET' \
  'https://public-api.birdeye.so/defi/price_volume/single?address=So11111111111111111111111111111111111111112&type=24h' \
  -H 'accept: application/json' \
  -H 'x-chain: solana' \
  -H 'X-API-KEY: YOUR-API-KEY'
```

**Example Response:**

```json
{
    "success": true,
    "data": {
        "price": 146.97843882208798,
        "updateUnixTime": 1719905910,
        "updateHumanTime": "2024-07-02T07:38:30",
        "volumeUSD": 1012968266.6856732,
        "volumeChangePercent": 4.602474543711091,
        "priceChangePercent": -0.6528161755948374
    }
}
```

**Response Parameters:**

| Key                   | Data Type | Details                                                           | Example               |
| :-------------------- | :-------- | :---------------------------------------------------------------- | :-------------------- |
| `price`               | float     | The current price of the token.                                   | 146.97843882208798    |
| `updateUnixTime`      | integer   | The Unix timestamp                                                | 1719905910            |
| `updateHumanTime`     | string    | The human-readable time of the most recent update.                | "2024-07-02T07:38:30" |
| `volumeUSD`           | float     | The trading volume in USD of the token over the specified period. | 1012968266.6856732    |
| `volumeChangePercent` | float     | The percentage change in volume over the specified period.        | 4.602474543711091     |
| `priceChangePercent`  | float     | The percentage change in price over the specified period.         | \-0.6528161755948374  |

**Note:** This endpoint provides real-time data on the token's price and trading volume, along with percentage changes over a specified period, allowing users to monitor the token's performance effectively. **If data for the full 24-hour period (or other type) is unavailable, the calculation will be based on the interval of available data from the specified timestamp to the oldest available price.**