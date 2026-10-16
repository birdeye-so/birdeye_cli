---
description: "''"
title: token security
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
GET https://public-api.birdeye.so/defi/token_security
```

### Description

The Token Security API provides comprehensive security information about a specified token. It includes details such as ownership, creation information, authority balances, and various security parameters.

### Data Coverage

Multi-chain

### Request URL

```plaintext
https://public-api.birdeye.so/defi/token_security
```

### Request Header

* `X-API-KEY`: Your API key for authentication.
* `x-chain`: The blockchain you are querying (e.g., `solana`).

### Parameters

* `address` (required): The address of the token for which security information is requested.

### Response

```json
{
  "data": {
    // Detailed security information
  },
  "success": true,
  "statusCode": 200
}
```

### Example Request

```bash
curl --request GET \
     --url 'https://public-api.birdeye.so/defi/token_security?address=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' \
     --header 'X-API-KEY: YOUR_API_KEY' \
     --header 'x-chain: solana'
```

### Example Response

```json
{
  "data": {
    "creatorAddress": null,
    "ownerAddress": null,
    "creationTx": null,
    "creationTime": null,
    "creationSlot": null,
    "mintTx": null,
    "mintTime": null,
    "mintSlot": null,
    "creatorBalance": null,
    "ownerBalance": null,
    "ownerPercentage": null,
    "creatorPercentage": null,
    "metaplexUpdateAuthority": "9AhKqLR67hwapvG8SA2JFXaCshXc9nALJjpKaHZrsbkw",
    "metaplexUpdateAuthorityBalance": 1567546605.09151,
    "metaplexUpdateAuthorityPercent": 0.000016743634184301057,
    "mutableMetadata": true,
    "top10HolderBalance": 32621589429360.246,
    "top10HolderPercent": 0.3484451168096428,
    "top10UserBalance": 32621589429360.246,
    "top10UserPercent": 0.3484451168096428,
    "isTrueToken": null,
    "totalSupply": 93620452276797.36,
    "preMarketHolder": [],
    "lockInfo": null,
    "freezeable": null,
    "freezeAuthority": null,
    "transferFeeEnable": null,
    "transferFeeData": null,
    "isToken2022": false,
    "nonTransferable": null
  },
  "success": true,
  "statusCode": 200
}
```

**Note**\
mintable: ownerAddress != null\
mutable: mutableMetadata == true\
renounced: !mintable \<=> ownerAddress == null