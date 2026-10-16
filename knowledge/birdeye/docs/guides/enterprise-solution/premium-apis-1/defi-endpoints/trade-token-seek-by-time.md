---
description: "''"
title: Trade - Token - Seek by time
excerpt: Get list of trades of a token with time bound option.
deprecated: false
hidden: true
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
**API Endpoint: /defi/txs/token/seek\_by\_time**

**Description:** This API endpoint allows users to query token transaction data based on Unix time. It provides detailed records of token transactions, including trade details, price information, transaction source, and more. Users can retrieve up to 10,000 records from a specified point in time.

**Important Usage Notes:**\
`before_time` Parameter: Use this to retrieve records before a specified Unix time. This is useful for querying historical data.\
`after_time` Parameter: Use this to retrieve records after a specified Unix time. This is useful for querying recent or ongoing data.\
**Do Not Use Both**: The API does not support querying a time range by passing both before and after parameters simultaneously. Doing so will result in an error code 422.\
**Sequential Queries**: To fetch additional records, adjust the before or after parameter in subsequent requests based on the time of the last retrieved record.

**Request Method:** GET

**Data Coverage:** Multi-chain

**Request URL:**

```plaintext
https://public-api.birdeye.so/defi/txs/token/seek_by_time
```

**Request Headers:**

```plaintext
accept: application/json
x-chain: any chains that Birdeye supports. Example: solana, ethereum
X-API-KEY: YOUR_API_KEY
```

**Parameters:**

| Key           | Data Type | Required | Details                                                                           | Default | Example                        |
| :------------ | :-------- | :------- | :-------------------------------------------------------------------------------- | :------ | :----------------------------- |
| `address`     | string    | Required | The token address to retrieve transaction records for.                            | None    | N/A                            |
| `offset`      | integer   | No       | The starting index for the list of market                                         | `0`     | `0` to `1000`                  |
| `limit`       | integer   | No       | The maximum number of markets to retrieve.                                        | `50`    | `1` to `50`                    |
| `tx_type`     | string    | No       | The type of transactions to filter by. Supports 4 values: swap, add, remove, all. | `swap`  | swap, add, remove, all         |
| `before_time` | integer   | Required | Filters transactions that occurred before this UNIX timestamp.                    | None    | Valid UNIX timestamp in second |
| `after_time`  | integer   | Required | Filters transactions that occurred after this UNIX timestamp.                     | None    | Valid UNIX timestamp in second |

**Example Request:**

```bash
curl -X 'GET' \
--url 'https://public-api.birdeye.so/defi/txs/token/seek_by_time?address=So11111111111111111111111111111111111111112&offset=0&limit=50&tx_type=swap&before_time=1731556705' \
-H 'accept: application/json' \
-H 'x-chain: solana' \
-H 'X-API-KEY: YOUR_API_KEY'
```

**Example Response:**

```bash json
{
    "data": {
        "items": [
            {
                "quote": {
                    "symbol": "AIKA",
                    "decimals": 6,
                    "address": "BsAEhPN1DKfpjMoSZ5UnDTL4impSYvT9ZpFjnBD2pump",
                    "amount": 10282738686,
                    "uiAmount": 10282.738686,
                    "price": 0.0029367411733378194,
                    "nearestPrice": 0.0029215002383463553,
                    "changeAmount": 10282738686,
                    "uiChangeAmount": 10282.738686
                },
                "base": {
                    "symbol": "SOL",
                    "decimals": 9,
                    "address": "So11111111111111111111111111111111111111112",
                    "amount": 138000000,
                    "uiAmount": 0.138,
                    "price": null,
                    "nearestPrice": 218.82421792644803,
                    "changeAmount": -138000000,
                    "uiChangeAmount": -0.138
                },
                "txHash": "3BeDzmSMqamgB6ySTSnoLfDfhiX4Bg7nT73v6agW5dp3uGxnS2du8sHBfGhjzrNSn8qz5dZJdvEbjEG2Kgy6wPGE",
                "source": "raydium",
                "blockUnixTime": 1731556704,
                "txType": "swap",
                "owner": "Hw8M26uUkftPdSFBKD5TyD4wAgX3dPYMaJVeor4HMqYX",
                "side": "sell",
                "pricePair": 74512.59917391304,
                "from": {
                    "symbol": "SOL",
                    "decimals": 9,
                    "address": "So11111111111111111111111111111111111111112",
                    "amount": 138000000,
                    "uiAmount": 0.138,
                    "price": null,
                    "nearestPrice": 218.82421792644803,
                    "changeAmount": -138000000,
                    "uiChangeAmount": -0.138
                },
                "to": {
                    "symbol": "AIKA",
                    "decimals": 6,
                    "address": "BsAEhPN1DKfpjMoSZ5UnDTL4impSYvT9ZpFjnBD2pump",
                    "amount": 10282738686,
                    "uiAmount": 10282.738686,
                    "price": 0.0029367411733378194,
                    "nearestPrice": 0.0029215002383463553,
                    "changeAmount": 10282738686,
                    "uiChangeAmount": 10282.738686
                },
                "poolId": "Fs3nRYJKagJXtM1PrArScUWkSJ66xuEzUScgE6xiRyWh"
            }
        ]
    }
}
```