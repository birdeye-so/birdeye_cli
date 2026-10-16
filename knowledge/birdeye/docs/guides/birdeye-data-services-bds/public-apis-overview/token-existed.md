---
description: "''"
title: token existed
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
**API Endpoint:** `**/public/exists_token**`

**Description:** This endpoint allows you to verify the existence of a specific token on the Solana blockchain.

**Request Method:** GET

**Request URL:**

```undefined
https://public-api.birdeye.so/public/exists_token?address=So11111111111111111111111111111111111111112
```

**Request Headers:**

* `accept: application/json`
* `x-chain: solana`

**Parameters:**

* `address` (string): The token address you want to verify.

**Response:** The response will indicate whether the token with the provided address exists on Birdeye database.

**Example Request:**

```bash
curl -X 'GET' \
  'https://public-api.birdeye.so/public/exists_token?address=So11111111111111111111111111111111111111112' \
  -H 'accept: application/json' \
  -H 'x-chain: solana'
```

**Example Response (Token Exists):**

```json
{
  "data": {
    "exists": true
  },
  "success": true
}
```

**Example Response (Token Does Not Exist):**

```json
{
  "data": {
    "exists": false
  },
  "success": true
}
```

**Note:** Replace `So11111111111111111111111111111111111111112` in the request URL with the actual Solana token address you want to verify. The `x-chain` header specifies the blockchain network (in this case, Solana) for the request.

## Try it out

Visit the following page to try out all the endpoints:

### API Base URL: [https://public-api.birdeye.so/](https://public-api.birdeye.so/)
