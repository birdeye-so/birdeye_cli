---
description: "''"
title: amm supported
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
**API Endpoint: /public/amm\_supported**

**Description:** This endpoint provides information about Automated Market Maker (AMM) platforms that support specific tokens across multiple blockchain networks supported by Birdeye.

**Request Method:** GET

**Request URL:**

```vbnet
https://public-api.birdeye.so/public/amm_supported
```

**Request Headers:**

* `accept: application/json`

**Response:** The response includes a list of AMM platforms that support specific tokens. Each platform's information is provided, including icons, websites, source names, program IDs, token addresses, symbols, and summaries.

**Example Request:**

```bash
curl -X 'GET' \
  'https://public-api.birdeye.so/public/amm_supported' \
  -H 'accept: application/json'
```

**Example Response:**

```json
{
  "data": [
    {
      "icon": "https://cdn.jsdelivr.net/gh/birdeye-so/birdeye-ads/pool_providers/raydium.svg",
      "website": "https://raydium.io",
      "source": "raydium",
      "program_ids": [
        "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"
      ],
      "token_address": "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
      "symbol": "RAY",
      "summary": true
    },
    {
      "icon": "https://cdn.jsdelivr.net/gh/birdeye-so/birdeye-ads/pool_providers/raydium.svg",
      "website": "https://raydium.io",
      "source": "raydium_clamm",
      "program_ids": [
        "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK"
      ],
      "token_address": "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
      "symbol": "RAY",
      "summary": true
    }
  ],
  "success": true
}
```

The response structure contains information about supported AMM platforms and their respective token data.

## Try it out

Visit the following page to try out all the endpoints:

### API Base URL: [https://public-api.birdeye.so/](https://public-api.birdeye.so/)
