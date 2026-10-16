---
description: "''"
title: token creation info
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
### API Endpoint

```plaintext
GET https://public-api.birdeye.so/defi/token_creation_info
```

### Description

The Token Creation Info API provides information about the creation details of a specified token. It includes data such as transaction hash, creation slot, token address, decimals, block time, and owner information. Block Unix Time and Block Human Time responses are exclusively for the Solana network.

### Data Coverage

Multi-chain

### Request URL

```plaintext
https://public-api.birdeye.so/defi/token_creation_info
```

### Request Header

* `X-API-KEY`: Your API key for authentication.
* `x-chain`: The blockchain you are querying (e.g., `solana`). Default is 'solana'.

### Parameters

* `address` (required): The address of the token for which creation information is requested.

### Example Request

```bash
curl --request GET \
     --url 'https://public-api.birdeye.so/defi/token_creation_info?address=9a9RqHn6YjmhX4Z9cEZ7qLjtfhy4JtC4SVCoaap49A1R' \
     --header 'X-API-KEY: YOUR_API_KEY' \
     --header 'x-chain: solana'
```

### Example Response

```json
{
    "data": {
        "txHash": "48HrbnXRSJKLu5Xh9WyR4FEfsvyKSXzNm1jmg4xXkX2Fg9MWXf33Uqr7o9oZ66WdVDQC8yiBXDVfnjqx8p8XNS4C",
        "slot": 275489904,
        "tokenAddress": "9a9RqHn6YjmhX4Z9cEZ7qLjtfhy4JtC4SVCoaap49A1R",
        "decimals": 6,
        "owner": "Gy3FSu2aeTpVz8XHzTS8be6EhUQcZmh8bS5F6HdQ8GiU",
        "blockUnixTime": 1720032070,
        "blockHumanTime": "2024-07-03T18:41:10.000Z"
    },
    "success": true
}
```

**Notes**

* Provide Block Unix Time and Block Human Time responses exclusively for the Solana network.