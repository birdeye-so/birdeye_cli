---
description: "''"
title: Supported networks
excerpt: ''
deprecated: false
hidden: false
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
**API Endpoint: /defi/networks**

**Description:** This endpoint allows users to query the currently supported networks of Birdeye Data Services.

**Request Method:** GET

**Request URL:**

```plaintext
https://public-api.birdeye.so/defi/networks
```

**Request Headers:**

```plaintext
accept: application/json
X-API-KEY: YOUR_API_KEY
```

**Response:** The response includes a list of historical API call identifiers and the remaining time until the package's expiration.

**Example Request:**

```bash
curl --request GET \
     --url https://public-api.birdeye.so/defi/networks \
 		 -H 'X-API-KEY: YOUR_API_KEY'
```

**Current supported networks:**

```json
{
  "data": [
    "solana",
    "ethereum",
    "arbitrum",
    "avalanche",
    "bsc",
    "optimism",
    "polygon",
    "base",
    "zksync",
    "sui",
    "monad",
    "megaeth",
    "fogo",
		"aptos"
  ],
  "success": true
}
```

**Notes for SUI network**

1. Not supported APIs:

* Wallet APIs (v1/wallet/)
* defi/token_security
* defi/token_creation_info
* defi/v2/tokens/all

2. Data not reruned in tokenoverview endpoint

* mc
* supply

3. API defi/price & API defi/token_overview

* The liquidity calculation is currently different for this endpoint. The improvement will be release on the version 2 of both two above APIs.
