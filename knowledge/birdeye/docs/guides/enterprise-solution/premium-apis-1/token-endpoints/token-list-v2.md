---
description: "''"
title: token list (v2)
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
**API Endpoint:** [https://public-api.birdeye.so/defi/v2/tokens/all](https://public-api.birdeye.so/defi/v2/tokens/all)

**Description:** This endpoint facilitates the retrieval of a list of tokens on a specified blockchain network. This upgraded version is exclusive to business and enterprise packages. By simply including the header for the requested blockchain without any query parameters, business and enterprise users can get the full list of tokens on the specified blockchain in the URL returned in the response. This removes the need for the limit response of the previous version and reduces the workload of making multiple calls.

**Request Method:** GET

**Data Coverage:** Multi-chain

**Request URL:**

```undefined
https://public-api.birdeye.so/defi/v2/tokens/all
```

**Request Headers:**

```undefined
x-chain: any chains that Birdeye supports. Example: solana, ethereum
X-API-KEY: YOUR_API_KEY
```

**Parameters:**

* There is no parameters needed

**Response:** The response includes a URL link that can be used to retrieve the up-to-date full token list on the specified blockchain network provided in the header.

**Example Request:**

```bash
curl -X 'GET' \
  'https://public-api.birdeye.so/defi/v2/tokens/all
  -H 'x-chain: solana' \
  -H 'X-API-KEY: YOUR_API_KEY'
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://bds-production.4e286f08d1a43a4675a07728d49fca08.r2.cloudflarestorage.com/data/tokens/solana_all_tokens.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=49bd22885999f193680f870beaa96580%2F20240527%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20240527T042429Z&X-Amz-Expires=1800&X-Amz-Signature=e6ad77d2143bb4ef9e698a40d539ff1d4cd9d6afe3512c334436c6770d128175&X-Amz-SignedHeaders=host&x-id=GetObject"
  }
}
```

**Note:** The URL in the response is for example purposes only.

**Content inside URL**

```json
{  
  "updateUnixTime": 1717396686,  
  "updateTime": "2024-06-03T06:38:06",  
  "items": [  
    {  
      "address": "kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6",  
      "decimals": 5,  
      "liquidity": 290134.33050119743,  
      "logoURI": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FkinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6%2Flogo.png",  
      "mc": 44516858.6678557,  
      "symbol": "KIN",  
      "v24hChangePercent": 745.4583313500134,  
      "v24hUSD": 127298.72863201969,  
      "name": "KIN",  
      "lastTradeUnixTime": 1717396333  
    }  
  ]  
}
```