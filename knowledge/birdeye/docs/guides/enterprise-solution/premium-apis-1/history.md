---
description: "''"
title: history (decommissioned on June 10th, 2024)
excerpt: This API endpoint will be decommissioned on June 10th, 2024
deprecated: false
hidden: true
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
**API Endpoint: /defi/history**

**Description:** This endpoint enables the retrieval of historical API call records associated with the authorized user. Additionally, it provides information about the remaining time until the package's expiration, allowing users to manage renewals effectively and avoid service disruptions.

**Request Method:** GET

**Request URL:**

```plaintext
https://public-api.birdeye.so/defi/history
```

**Request Headers:**

```plaintext
accept: application/json
x-chain: any chains that Birdeye supports. Example: solana, ethereum
X-API-KEY: YOUR_API_KEY
```

**Response:** The response includes a list of historical API call identifiers and the remaining time until the package's expiration.

**Example Request:**

```bash
curl -X 'GET' \
  'https://public-api.birdeye.so/defi/history' \
  -H 'accept: application/json' \
  -H 'x-chain: solana' \
  -H 'X-API-KEY: YOUR_API_KEY'
```

**Example Response:**

```json
{
  "data": {
    "items": [
      "BWXrrYFhT7bMHmNBFoQFWdsSgA3yXoAnMhDK6Fn1eSEn",
      "USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX",
      "FoRGERiW7odcCBGU1bztZi16osPBHjxharvDathL5eds"
    ],
    "resetInSeconds": 19899
  },
  "success": true
}
```

**Note:** Replace `YOUR_API_KEY` in the request headers with your actual API key. This endpoint aids in tracking historical API usage and managing timely renewals to ensure continuous service availability.
