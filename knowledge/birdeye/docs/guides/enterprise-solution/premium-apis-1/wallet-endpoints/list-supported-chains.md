---
description: "''"
title: list supported chains
excerpt: ''
deprecated: false
hidden: true
metadata:
  title: ''
  description: ''
  robots: noindex
next:
  description: ''
---
**API Description**

* **Endpoint**: /v1/wallet/list\_supported\_chain

* **Request Method**: GET

* **Description**: This API endpoint provides a list of supported blockchain chains that are available for wallet integration through the Birdeye public API.

* **Request Header**:
  * Accept: application/json (Indicates that the client expects a JSON response)

* **Sample Request**:

```bash
curl -X 'GET' 'https://public-api.birdeye.so/v1/wallet/list_supported_chain' -H 'accept: application/json'
```

* **Sample Response**:

```json
{
  "success": true,
  "data": [
    "eth-mainnet",
    "matic-mainnet",
    "bsc-mainnet",
    "avalanche-mainnet",
    "optimism-mainnet",
    "arbitrum-mainnet",
    "base-mainnet",
    "zksync-mainnet",
    "solana-mainnet"
  ]
}
```

* **Response Description**:

  * **success**: A boolean value indicating the success of the API request. `true` signifies a successful request, while `false` indicates an error.

  * **data**: An array containing the supported blockchain chain identifiers. Each identifier is a string representing a specific blockchain chain that can be integrated into wallets.

* **Sample Use Case**:
  * This API can be utilized by wallet service providers to fetch a list of supported blockchain chains for integration into their wallet applications.

* **Response Codes**:
  * 200 OK: The request was successful, and the list of supported chains is provided.
  * 4xx/5xx: Various error responses for client or server issues.

* **Error Response**:
  * If there is an error, the response will include an "error" field with additional information about the problem.

* **Security**:
  * No specific security requirements are mentioned for this read-only API, but token-based authentication may be required for other API endpoints depending on the use case.