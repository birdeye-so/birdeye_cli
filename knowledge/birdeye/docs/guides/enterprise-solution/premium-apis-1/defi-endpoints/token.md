---
description: "''"
title: Trades - Token
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
**API Endpoint: /defi/txs/token**

**Description:** This endpoint returns transaction records of a specific token on any blockchains that Birdeye supports. It provides information about transactions related to the specified token, including trade details, ownership, source, and other relevant data. 

As of the latest update on August 1, 2024, the endpoint allows users to sort the trades of the token **by UNIX time** in either ascending (oldest to newest) or descending (newest to oldest) order. Additionally, the offset is now set to a maximum of 1,000. For users who need to retrieve more data, the upcoming version will provide enhanced capabilities to support this requirement.

**Request Method:** GET

**Data Coverage:** Multi-chain

**Request URL:**

```plaintext

https://public-api.birdeye.so/defi/txs/token?address=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263&offset=0&limit=2&sort_type=asc
```

**Request Headers:**

```plaintext
accept: application/json
x-chain: any chains that Birdeye supports. Example: solana, ethereum
X-API-KEY: YOUR_API_KEY
```

**Parameters:**

<Table align={["left","left","left","left"]}>
  <thead>
    <tr>
      <th style={{ textAlign: "left" }}>
        Key
      </th>

      <th style={{ textAlign: "left" }}>
        Data Type
      </th>

      <th style={{ textAlign: "left" }}>
        Details
      </th>

      <th style={{ textAlign: "left" }}>
        Example
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td style={{ textAlign: "left" }}>
        `address`
      </td>

      <td style={{ textAlign: "left" }}>
        string
      </td>

      <td style={{ textAlign: "left" }}>
        The token address to retrieve transaction records for.
      </td>

      <td style={{ textAlign: "left" }}>
        Required<br/>default: So11111111111111111111111111111111111111112
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        `sort_type`
      </td>

      <td style={{ textAlign: "left" }}>
        string
      </td>

      <td style={{ textAlign: "left" }}>
        Sort the trades by UNIX time in the order, either descending or ascending. Descending means that sort from the latest trade backward.
      </td>

      <td style={{ textAlign: "left" }}>
        Required<br/>Value: \{desc, asc}<br/>Default: desc
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        `offset`
      </td>

      <td style={{ textAlign: "left" }}>
        integer
      </td>

      <td style={{ textAlign: "left" }}>
        The starting index for the list of market
      </td>

      <td style={{ textAlign: "left" }}>
        NOT required<br/>Range: \{0:1000}<br/>Default: 0
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        `limit`
      </td>

      <td style={{ textAlign: "left" }}>
        integer
      </td>

      <td style={{ textAlign: "left" }}>
        The maximum number of markets to retrieve.
      </td>

      <td style={{ textAlign: "left" }}>
        NOT required<br/>Range: \{1:50}<br/>Default: 50
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        `tx_type`
      </td>

      <td style={{ textAlign: "left" }}>
        string
      </td>

      <td style={{ textAlign: "left" }}>
        The type of transactions to filter by. Supports 4 values: swap, add, remove, all.
      </td>

      <td style={{ textAlign: "left" }}>
        NOT required<br/>Default: "swap"
      </td>
    </tr>
  </tbody>
</Table>

**Example Request:**

```bash
curl -X 'GET' \
  --url 'public-api.birdeye.so/defi/txs/token?address=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263&offset=0&limit=2&sort_type=asc' \
  -H 'accept: application/json' \
  -H 'x-chain: solana' \
  -H 'X-API-KEY: YOUR_API_KEY'
```

**Example Response:**

```json
{
    "data": {
        "items": [
            {
                "quote": {
                    "symbol": "SOL",
                    "decimals": 9,
                    "address": "So11111111111111111111111111111111111111112",
                    "amount": 264389930,
                    "uiAmount": 0.26438993,
                    "price": null,
                    "nearestPrice": 11.309597,
                    "changeAmount": -264389930,
                    "uiChangeAmount": -0.26438993
                },
                "base": {
                    "symbol": "Bonk",
                    "decimals": 5,
                    "address": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
                    "amount": 996222551477,
                    "uiAmount": 9962225.51477,
                    "price": null,
                    "nearestPrice": null,
                    "changeAmount": 996222551477,
                    "uiChangeAmount": 9962225.51477
                },
                "basePrice": null,
                "quotePrice": null,
                "txHash": "5dQDVDqA2T9YjRe6uuhQ1NXVNjqMWe3w4eR9DnFEbPM13HAjEmUhCY2T5XqR5qSbpNewLmMv52dKMNdMaPfaRRTp",
                "source": "raydium",
                "blockUnixTime": 1671883209,
                "txType": "swap",
                "owner": "VVVy6P2mfuL4RGCKZRhyg191g79GsooZfyBc98BrQS9",
                "side": "buy",
                "alias": null,
                "pricePair": 2.6539243626638986e-8,
                "from": {
                    "symbol": "SOL",
                    "decimals": 9,
                    "address": "So11111111111111111111111111111111111111112",
                    "amount": 264389930,
                    "uiAmount": 0.26438993,
                    "price": null,
                    "nearestPrice": 11.309597,
                    "changeAmount": -264389930,
                    "uiChangeAmount": -0.26438993
                },
                "to": {
                    "symbol": "Bonk",
                    "decimals": 5,
                    "address": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
                    "amount": 996222551477,
                    "uiAmount": 9962225.51477,
                    "price": null,
                    "nearestPrice": null,
                    "changeAmount": 996222551477,
                    "uiChangeAmount": 9962225.51477
                },
                "tokenPrice": null,
                "poolId": "HVNwzt7Pxfu76KHCMQPTLuTCLTm6WnQ1esLv4eizseSv"
            },
            {
                "quote": {
                    "symbol": "SOL",
                    "decimals": 9,
                    "address": "So11111111111111111111111111111111111111112",
                    "amount": 392776335,
                    "uiAmount": 0.392776335,
                    "price": null,
                    "nearestPrice": 11.320764627990165,
                    "changeAmount": -392776335,
                    "uiChangeAmount": -0.392776335
                },
                "base": {
                    "symbol": "Bonk",
                    "decimals": 5,
                    "address": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
                    "amount": 2252006173,
                    "uiAmount": 22520.06173,
                    "price": null,
                    "nearestPrice": null,
                    "changeAmount": 2252006173,
                    "uiChangeAmount": 22520.06173
                },
                "basePrice": null,
                "quotePrice": null,
                "txHash": "3JPGAvunAtkJjx3sikGX73JusZcfpDnBrYXR8WjMZZ2pKN1oejxf1kiz6yyBcPFJXChQEAs8sF6dqxjgK8LRKUwC",
                "source": "raydium",
                "blockUnixTime": 1671883220,
                "txType": "swap",
                "owner": "AmiiyHuxxsJdxvZ9YdGA5nNmpsGzr4F4zYgC1zEwTNzY",
                "side": "buy",
                "alias": null,
                "pricePair": 0.000017441174882605438,
                "from": {
                    "symbol": "SOL",
                    "decimals": 9,
                    "address": "So11111111111111111111111111111111111111112",
                    "amount": 392776335,
                    "uiAmount": 0.392776335,
                    "price": null,
                    "nearestPrice": 11.320764627990165,
                    "changeAmount": -392776335,
                    "uiChangeAmount": -0.392776335
                },
                "to": {
                    "symbol": "Bonk",
                    "decimals": 5,
                    "address": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
                    "amount": 2252006173,
                    "uiAmount": 22520.06173,
                    "price": null,
                    "nearestPrice": null,
                    "changeAmount": 2252006173,
                    "uiChangeAmount": 22520.06173
                },
                "tokenPrice": null,
                "poolId": "HVNwzt7Pxfu76KHCMQPTLuTCLTm6WnQ1esLv4eizseSv"
            }
        ],
        "hasNext": true
    },
    "success": true
}
```