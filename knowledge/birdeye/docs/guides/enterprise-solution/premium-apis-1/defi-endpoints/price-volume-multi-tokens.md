---
description: "''"
title: Price Volume - Multi tokens
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
\*API Endpoint:\*\* /defi/price\_volume/multi

**Description:** This endpoint retrieves the current price and volume data for multiple specified tokens over a given time period. It provides additional details such as the most recent update time, price change percentage, and volume change percentage over the specified period. The default period is 24 hours. Note: A maximum of 50 addresses can be requested at once.

## Request

**Request Method:** POST

**Data Coverage:** Multi-chain

**Request URL:**

```undefined
https://public-api.birdeye.so/defi/price_volume/multi
```

**Request Headers:**

```undefined
accept: application/json
x-chain: any chains that Birdeye supports. Example: solana, ethereum
X-API-KEY: YOUR_API_KEY
```

**Parameters:**

| Key            | Data Type | Details                                                                              | Example                                                                                  |
| :------------- | :-------- | :----------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------- |
| `list_address` | string    | A comma-separated list of token addresses to retrieve historical prices for.         | So11111111111111111111111111111111111111112,DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263 |
| `type`         | string    | The time period for the data. Supported values: 1h, 2h, 4h, 8h, 24h. Default is 24h. | 24h                                                                                      |

**Response**

The response provides the current price and volume data for the specified tokens over the given period, along with the percentage changes and the time of the last update.

**Example Request:**

```bash
curl --request POST \
     --url https://public-api.birdeye.so/defi/price_volume/multi \
     --header 'X-API-KEY: YOUR_API_KEY' \
     --header 'content-type: application/json' \
     --data '
{
  "list_address": "So11111111111111111111111111111111111111112,DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  "type": "24h"
}
```

<br />

**Example Response:**

```json
{
    "success": true,
    "data": [
        {
            "address": "So11111111111111111111111111111111111111112",
            "price": 146.97843882208798,
            "updateUnixTime": 1719905910,
            "updateHumanTime": "2024-07-02T07:38:30",
            "volumeUSD": 1012968266.6856732,
            "volumeChangePercent": 4.602474543711091,
            "priceChangePercent": -0.6528161755948374
        },
        {
            "address": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
            "price": 320.451239234234,
            "updateUnixTime": 1719905915,
            "updateHumanTime": "2024-07-02T07:38:35",
            "volumeUSD": 2045892345.23454,
            "volumeChangePercent": 2.3456234534,
            "priceChangePercent": 1.234234345
        }
    ]
}
```

**Response Parameters:**

| Key                   | Data Type | Details                                                           | Example               |
| :-------------------- | :-------- | :---------------------------------------------------------------- | :-------------------- |
| `price`               | number    | The current price of the token.                                   | 146.97843882208798    |
| `updateUnixTime`      | integer   | The Unix timestamp                                                | 1719905910            |
| `updateHumanTime`     | string    | The human-readable time of the most recent update.                | "2024-07-02T07:38:30" |
| `volumeUSD`           | number    | The trading volume in USD of the token over the specified period. | 1012968266.6856732    |
| `volumeChangePercent` | number    | The percentage change in volume over the specified period.        | 4.602474543711091     |
| `priceChangePercent`  | number    | The percentage change in price over the specified period.         | '-0.6528161755948374  |

**Note**

* If data for the full 24-hour period (or other type) is unavailable, the calculation will be based on the interval of available data from the specified timestamp to the oldest available price.