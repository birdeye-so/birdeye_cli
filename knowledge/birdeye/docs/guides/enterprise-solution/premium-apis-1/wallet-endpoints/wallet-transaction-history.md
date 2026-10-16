---
description: "''"
title: wallet transaction history (Beta)
excerpt: In beta
deprecated: false
hidden: true
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
\*API Endpoint:\*\* [https://public-api.birdeye.so/v1/wallet/tx\_list](https://public-api.birdeye.so/v1/wallet/tx_list)

**Description:** This API endpoint enables the retrieval of transaction lists for a specified wallet on a given blockchain. Clients can provide optional parameters such as **limit** and **before** to control the pagination of the results. The **limit** parameter determines the maximum number of transactions returned in a single request, promoting efficient data transfer and processing. The **before** parameter allows for the fetching of transactions that occurred before a specific transaction identifier, facilitating incremental data loading. This endpoint is particularly useful for users and applications needing to track transaction histories, monitor wallet activity, or audit transactions systematically.

**Request Method:** GET

**Data Coverage:** Multi-chain

**Request URL:**

```undefined
https://public-api.birdeye.so/v1/wallet/tx_list?wallet=3bLx8KHs7ipaf3aTB8wwekv1wgTmM4fW8xfP4HB2ejwz&limit=5
```

**Request Headers:**

```undefined
x-chain: any chains that Birdeye supports. Example: solana, ethereum
X-API-KEY: YOUR_API_KEY
```

**Parameters:**

| Key      | Data Type | Details                                                                                                                             | Example                                                                                  |
| :------- | :-------- | :---------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------- |
| `wallet` | string    | The wallet address                                                                                                                  | 3bLx8KHs7ipaf3aTB8wwekv1wgTmM4fW8xfP4HB2ejwz                                             |
| `limit`  | integer   | Number of transactions that user wants to get from response                                                                         | 5                                                                                        |
| `before` | string    | A cursor for use in pagination; the API returns transactions that occurred before the transaction hash specified by this parameter. | 3x534tN6ZM7y6fyC8pR9V7xfvKE11VzavdF2mPVzmwAaQrpgyy8kotzBPFKEGBa5GY2K6xVW74LFZeJtVNqkKQJw |

**Note** : limit and before parameters currently only work on solana network. Full list of transactions are returned on other chains.

**Response:** The response from the getTxList API endpoint is structured as a JSON object containing two main elements: a success flag and a data section. The success flag is a boolean that indicates whether the API request was successful or not. The data section includes detailed information about transactions grouped by blockchain networks, such as Solana. Each transaction within the array provides comprehensive details including transaction hash, block number, transaction time, status, initiating and receiving wallet addresses, the fee paid, the main action of the transaction, and any balance changes involving various tokens.

**Example Request:**

```bash
curl --request GET \
     --url 'https://public-api.birdeye.so/v1/wallet/tx_list?wallet=3bLx8KHs7ipaf3aTB8wwekv1wgTmM4fW8xfP4HB2ejwz&limit=2&before=3x534tN6ZM7y6fyC8pR9V7xfvKE11VzavdF2mPVzmwAaQrpgyy8kotzBPFKEGBa5GY2K6xVW74LFZeJtVNqkKQJw' \
     --header 'X-API-KEY: YOUR_API_KEY' \
     --header 'x-chain: solana'
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "solana": [
      {
        "txHash": "3b1iF5dgrevrbDLazoAavf52Qp46By2JB8DTAFhY8qScVoYw775hovo1Pk56R7wWqedAH2LH8UqAMEJ7NDWsxc8n",
        "blockNumber": 254997395,
        "blockTime": "2024-03-18T20:32:31+00:00",
        "status": true,
        "from": "7zaQPy9TcE3F895MUqv84Qof3tcaoZp1VLUjXviDK63Q",
        "to": "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY",
        "fee": 21000,
        "mainAction": "unknown",
        "balanceChange": [
          {
            "amount": 0,
            "symbol": "SOL",
            "name": "Wrapped SOL",
            "decimals": 9,
            "address": "So11111111111111111111111111111111111111112",
            "logoURI": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png"
          }
        ],
        "contractLabel": {
          "address": "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY",
          "name": "Bubblegum",
          "metadata": {
            "icon": ""
          }
        }
      },
      {
        "txHash": "42uBXQdPb19DGw4fiCszhh49s6t19s2zNjMG5tnGZsmkT7RZwQfTUB7h6WMAKXJPprH7zr5QpXhTmx7DkPoGZkZC",
        "blockNumber": 254720820,
        "blockTime": "2024-03-17T12:11:24+00:00",
        "status": true,
        "from": "4r3uxFLem8MRASus4JPFWuWxwT3ptPdN966dnZi7Qb4E",
        "to": "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY",
        "fee": 35000,
        "mainAction": "unknown",
        "balanceChange": [
          {
            "amount": 0,
            "symbol": "SOL",
            "name": "Wrapped SOL",
            "decimals": 9,
            "address": "So11111111111111111111111111111111111111112",
            "logoURI": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png"
          }
        ],
        "contractLabel": {
          "address": "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY",
          "name": "Bubblegum",
          "metadata": {
            "icon": ""
          }
        }
      }
    ]
  }
}
```

**Note:**