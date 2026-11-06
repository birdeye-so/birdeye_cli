---
description: "''"
title: Trades - Pair
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
**API Endpoint: /defi/txs/pair**

**Description:** This endpoint provides a comprehensive list of token pair transactions, enabling users to monitor swaps and transfers involving specific token pairs on any networks we support. Transactions are ordered chronologically, and the endpoint supports pagination for easy navigation through the transaction history.

**Request Method:** GET

**Data Coverage:** Multi-chain

**Request URL:**

```undefined
'https://public-api.birdeye.so/defi/txs/pair?address=842NwDnKYcfMRWAYqsD3hoTWXKKMi28gVABtmaupFcnS&tx_type=swap&sort_type=desc'
```

**Request Headers:**

```undefined
accept: application/json
x-chain: any chains that Birdeye supports. Example: solana, ethereum
X-API-KEY: YOUR_API_KEY
```

**Parameters:**

| Key        | Data Type | Details                                                      | Example                                        |
| :--------- | :-------- | :----------------------------------------------------------- | :--------------------------------------------- |
| address    | string    | The address of the pair for which transactions are fetched   | "842NwDnKYcfMRWAYqsD3hoTWXKKMi28gVABtmaupFcnS" |
| offset     | integer   | The offset from which to start fetching transaction data     | 0                                              |
| limit      | integer   | The maximum number of transactions to return in the response | 50                                             |
| tx\_type   | string    | The type of transactions to filter by                        | "swap"                                         |
| sort\_type | string    | The order in which transactions should be sorted             | "desc"                                         |

**Example Request:**

```shell
curl --request GET \
     --url 'https://public-api.birdeye.so/defi/txs/pair?address=842NwDnKYcfMRWAYqsD3hoTWXKKMi28gVABtmaupFcnS&tx_type=swap&sort_type=desc' \
     --header 'X-API-KEY:YOUR_API_KEY'
```

**Response:** The response includes a list of transaction items involving the specified token pair, each accompanied by transaction details and source information.

**Response format**

| Data Type | Details | Description                                            |
| :-------- | :------ | :----------------------------------------------------- |
| success   | boolean | Indicates whether the request was successful           |
| data      | object  | Contains the items array and pagination information    |
| items     | array   | An array of transactions. Each transaction is detailed |
| hasNext   | boolean | Indicates whether there are more records to fetch      |

**Example Response:**

```json
{
  "data": {
    "items": [
      {
        "txHash": "WuKNTaWYuk18K2WFkwcUR2FosNdeY6h9AvX4U93Tt1fsZ9pHNmyT2c3L5RpCMqVqQmThLJhxmdBXzWqi4YdoGXC",
        "source": "raydium",
        "blockUnixTime": 1714116459,
        "address": "842NwDnKYcfMRWAYqsD3hoTWXKKMi28gVABtmaupFcnS",
        "owner": "3jHUxMz7XprojdWFx6RgNzpMmcznUcKSUaKxgyGv3WaW",
        "from": {
          "symbol": "SOL",
          "decimals": 9,
          "address": "So11111111111111111111111111111111111111112",
          "amount": 93000000,
          "type": "transfer",
          "typeSwap": "from",
          "uiAmount": 0.093,
          "price": null,
          "nearestPrice": 144.26075569403358,
          "changeAmount": -93000000,
          "uiChangeAmount": -0.093
        },
        "to": {
          "symbol": "TOM",
          "decimals": 9,
          "address": "2rJSfgxoWP7h3rw3hDUF7HPToY3exb6FdH9xFBg7TeQk",
          "amount": 265575905341,
          "type": "transfer",
          "typeSwap": "to",
          "feeInfo": null,
          "uiAmount": 265.575905341,
          "price": 0.05051757335560479,
          "nearestPrice": 0.050266916041458554,
          "changeAmount": 265575905341,
          "uiChangeAmount": 265.575905341
        }
      }
    ],
    "hasNext": true
  },
  "success": true
}
```

**Transaction Detail**

Each transaction within the items array may contain:

**txHash**: The hash identifier of the transaction.\
**source:** The platform or service where the transaction occurred.\
**blockUnixTime:** The Unix timestamp denoting when the transaction was recorded on the blockchain.\
**from and to:** Objects detailing the transaction's source and destination addresses, amounts, symbols, and other relevant metadata.

**Note:** Replace the address parameter in the request URL with the actual address of the token pair you want to inquire about. The sort\_type parameter determines the sorting order for transactions (descending or ascending).