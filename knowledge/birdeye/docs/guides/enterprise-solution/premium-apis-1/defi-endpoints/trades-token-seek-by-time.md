---
description: "''"
title: Trades - Pair Seek By Time
excerpt: Get list of trades of a pair with time bound option.
deprecated: false
hidden: true
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
**API Endpoint: /defi/txs/pair/seek\_by\_time**

**Description:** This API endpoint allows users to query pair transaction data based on Unix time. It provides detailed records of pair transactions, including trade details, price information, transaction source, and more. Users can retrieve up to 10,000 records from a specified point in time.

**Important Usage Notes:**\
`before_time` Parameter: Use this to retrieve records before a specified Unix time. This is useful for querying historical data.\
`after_time` Parameter: Use this to retrieve records after a specified Unix time. This is useful for querying recent or ongoing data.\
**Do Not Use Both**: The API does not support querying a time range by passing both before and after parameters simultaneously. Doing so will result in an error code 422.\
**Sequential Queries**: To fetch additional records, adjust the before or after parameter in subsequent requests based on the time of the last retrieved record.

**Request Method:** GET

**Data Coverage:** Multi-chain

**Request URL:**

```plaintext
https://public-api.birdeye.so/defi/txs/pair/seek_by_time
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
| `address`     | string    | Required | The pair address to retrieve transaction records for.                             | None    | N/A                            |
| `offset`      | integer   | No       | The starting index for the list of market                                         | `0`     | `0` to `1000`                  |
| `limit`       | integer   | No       | The maximum number of markets to retrieve.                                        | `50`    | `1` to `50`                    |
| `tx_type`     | string    | No       | The type of transactions to filter by. Supports 4 values: swap, add, remove, all. | `swap`  | swap, add, remove, all         |
| `before_time` | integer   | Required | Filters transactions that occurred before this UNIX timestamp.                    | None    | Valid UNIX timestamp in second |
| `after_time`  | integer   | Required | Filters transactions that occurred after this UNIX timestamp.                     | None    | Valid UNIX timestamp in second |

**Example Request:**

```bash
curl -X 'GET' \
--url 'https://public-api.birdeye.so/defi/txs/pair/seek_by_time?address=4DoNfFBfF7UokCC2FQzriy7yHK6DY6NVdYpuekQ5pRgg&offset=0&limit=50&tx_type=swap&sort_type=desc&before_time=0&after_time=1732997931' \
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
        "txHash": "iv68i89HCeRY9e1iaJivEBLV98HNz7nRmG7rsi32pgPxwgpEK583Dt83925BcuJzSASkxDAG27YW7UdDu8gvWJ8",
        "source": "phoenix",
        "blockUnixTime": 1732997947,
        "address": "4DoNfFBfF7UokCC2FQzriy7yHK6DY6NVdYpuekQ5pRgg",
        "owner": "CARjbftrHMAiThZpVG1kVrNDCaSJ2xJbVDVP43zWhHjq",
        "from": {
          "symbol": "USDC",
          "decimals": 6,
          "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          "amount": 572582702,
          "type": "log",
          "typeSwap": "from",
          "uiAmount": 572.582702,
          "price": null,
          "nearestPrice": 0.99995198,
          "changeAmount": -572582702,
          "uiChangeAmount": -572.582702
        },
        "to": {
          "symbol": "SOL",
          "decimals": 9,
          "address": "So11111111111111111111111111111111111111112",
          "amount": 2386000000,
          "type": "log",
          "typeSwap": "to",
          "feeInfo": null,
          "uiAmount": 2.386,
          "price": null,
          "nearestPrice": 239.89540229635685,
          "changeAmount": 2386000000,
          "uiChangeAmount": 2.386
        }
      }
    ],
    "hasNext": true
  },
  "success": true
}
```