---
description: "''"
title: Token - Top Traders
excerpt: >-
  Retrieve top traders for a specific token based on trading volume or
  transactions.
deprecated: false
hidden: true
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
# **API Endpoint:** /defi/v2/tokens/top\_traders

**Description:** This endpoint retrieves the top traders for a specific token based on trading volume (volume of the token amount) or the number of transactions (trade) within a specified time frame. Users can discover the most active traders and gain insights into their trading activities, including identifying types such as bot trading when applicable.

Chain supported: solana, ethereum, arbitrum, avalanche, bsc, optimism, polygon, base, zksync.

## Request

**Request Method:** GET

**Data Coverage:** Multi-chain

**Request URL:**

````undefined
<https://public-api.birdeye.so/defi/v2/tokens/top_traders?sort_by=volume&sort_type=desc&address=0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7&time_frame=24h&offset=0&limit=10>```
````

**Request Headers:**

```
accept: application/json  
X-API-KEY: YOUR_API_KEY
x-chain: solana/ethereum/ etc..
```

**Parameters:**

| Key          | Data Type | Details                                                                                                                         | Example                                    |
| ------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `sort_by`    | string    | The attribute to sort the traders by. Supported values: `volume`, `trade`. Default is `volume`                                  | volume                                     |
| `sort_type`  | string    | The order to sort the traders in. Supported values: `asc`, `desc`. Default is `desc`.                                           | desc                                       |
| `address`    | string    | The token address to retrieve the top traders for. **(Required)**                                                               | 0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7 |
| `time_frame` | string    | The time frame for the top traders data. Supported values: `30m`, `1h`, `2h`, `4h`, `6h`, `8h`, `12h`, `24h`. Default is `24h`. | 24h                                        |
| `offset`     | integer   | The number of records to skip from the start. Default is `0`.                                                                   | 0                                          |
| `limit`      | integer   | The maximum number of records to return. Supported values: `1` to `10`, Default is `10`.                                        | 10                                         |

**Note: Solana chain does NOT support`time_frame` `6h` and `12h`.**

## Response

The response provides a list of the top traders for the specified token, sorted by the chosen criteria, along with their trading statistics.

**Example Request:**

```Text curl
\--request GET  
     --url '<https://public-api.birdeye.so/defi/v2/tokens/top_traders?sort_by=volume&sort_type=desc&address=0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7&time_frame=24H&offset=0&limit=10'>  
     --header 'X-API-KEY: YOUR_API_KEY'  
     --header 'accept: application/json'
```

**Example Response:**

```Text JSON
{
    "success": true,
    "data": {
        "items": [
            {
                "owner": "0x5785Fd6a2C4e11a6F3Cce7dAD5700CA9Db63bbdb",
                "tokenAddress": "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7",
                "trade": 4,
                "tradeBuy": 4,
                "tradeSell": 0,
                "type": "24h",
                "volume": 394.10190608949824,
                "volumeBuy": 394.10190608949824,
                "volumeSell": 0,
                "tags": []
            },
            {
                "owner": "0x16C473448E770Ff647c69CBe19e28528877fba1B",
                "tokenAddress": "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7",
                "trade": 5,
                "tradeBuy": 2,
                "tradeSell": 3,
                "type": "24h",
                "volume": 326.9638244478502,
                "volumeBuy": 294.7094594425826,
                "volumeSell": 32.25436500526758,
                "tags": [
                    "arbitrage-bot",
                    "sniper-bot"
                ]
            },
            {
                "owner": "0x6bF52B769ac1697E8046568dd9af25a0833301db",
                "tokenAddress": "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7",
                "trade": 2,
                "tradeBuy": 0,
                "tradeSell": 2,
                "type": "24h",
                "volume": 322.34765119398935,
                "volumeBuy": 0,
                "volumeSell": 322.34765119398935,
                "tags": []
            }
        ]
    }
}
```

**Response Parameters:**

<Table align={["left","left","left","left"]}>
  <thead>
    <tr>
      <th>
        Key
      </th>

      <th>
        Data type
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
        `createdAt`
      </td>

      <td>
        string
      </td>

      <td>
        The timestamp when the record was created.
      </td>

      <td>
        "2024-07-23T01:45:10.277Z"
      </td>
    </tr>

    <tr>
      <td>
        `owner`
      </td>

      <td>
        string
      </td>

      <td>
        The address of the trader.
      </td>

      <td>
        "0x171c53d55B1BCb725F660677d9e8BAd7fD084282"
      </td>
    </tr>

    <tr>
      <td>
        `tokenAddress`
      </td>

      <td>
        string
      </td>

      <td>
        The address of the token.
      </td>

      <td>
        "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7"
      </td>
    </tr>

    <tr>
      <td>
        `trade`
      </td>

      <td>
        integer
      </td>

      <td>
        The total number of trades.
      </td>

      <td>
        3
      </td>
    </tr>

    <tr>
      <td>
        `tradeBuy`
      </td>

      <td>
        integer
      </td>

      <td>
        The number of buy trades.
      </td>

      <td>
        0
      </td>
    </tr>

    <tr>
      <td>
        `tradeSell`
      </td>

      <td>
        integer
      </td>

      <td>
        The number of sell trades.
      </td>

      <td>
        3
      </td>
    </tr>

    <tr>
      <td>
        `type`
      </td>

      <td>
        string
      </td>

      <td>
        The time frame for the data.
      </td>

      <td>
        "24h"
      </td>
    </tr>

    <tr>
      <td>
        `updateTime`
      </td>

      <td>
        integer
      </td>

      <td>
        The Unix timestamp of the last update.
      </td>

      <td>
        1721718600
      </td>
    </tr>

    <tr>
      <td>
        `updatedAt`
      </td>

      <td>
        string
      </td>

      <td>
        The human-readable time of the last update.
      </td>

      <td>
        "2024-07-23T07:10:11.360Z"
      </td>
    </tr>

    <tr>
      <td>
        `volume`
      </td>

      <td>
        number
      </td>

      <td>
        The total trading volume (token amount).
      </td>

      <td>
        762.1365652097866
      </td>
    </tr>

    <tr>
      <td>
        `volumeBuy`
      </td>

      <td>
        number
      </td>

      <td>
        The total buy trading volume (token amount).
      </td>

      <td>
        0
      </td>
    </tr>

    <tr>
      <td>
        `volumeSell`
      </td>

      <td>
        number
      </td>

      <td>
        The total sell trading volume (token amount).
      </td>

      <td>
        762.1365652097866
      </td>
    </tr>

    <tr>
      <td>
        `tags`
      </td>

      <td>
        array
      </td>

      <td>
        Tags associated with the trader, such as bot types.
      </td>

      <td>
        \[
        "arbitrage-bot",
        "sniper-bot"
        ]\[
        "arbitrage-bot",
        "sniper-bot"
        ]
      </td>
    </tr>
  </tbody>
</Table>