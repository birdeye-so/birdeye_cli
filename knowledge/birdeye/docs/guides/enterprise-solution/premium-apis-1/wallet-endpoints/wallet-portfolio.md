---
description: "''"
title: Wallet - Portfolio (Beta)
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
API Endpoint: [https://public-api.birdeye.so/v1/wallet/token\_list](https://public-api.birdeye.so/v1/wallet/token_list)

Description: This endpoint retrieves a detailed list of all tokens held in a specific wallet, providing essential information such as token balances, USD values, and token metadata. The endpoint helps users to monitor their portfolio across supported networks.

Request Method: GET

Data Coverage: Multi-chain

**Request URL:**

```plaintext
'https://public-api.birdeye.so/v1/wallet/token_list?wallet=GQszyLwSVt3BSmuTuYbGmSinM9zbLK9ZMNE1J7UoWmZU'

```

**Request Headers:**

```plaintext
accept: application/json
x-chain: any chains that Birdeye supports. Example: solana, ethereum
X-API-KEY: YOUR_API_KEY
```

**Parameters:**

| Key      | Data Type | Details                                                 | Example                                      |
| :------- | :-------- | :------------------------------------------------------ | :------------------------------------------- |
| `wallet` | string    | The address of the wallet for which tokens are fetched. | GQszyLwSVt3BSmuTuYbGmSinM9zbLK9ZMNE1J7UoWmZU |

**Example Request:**

```bash
curl -X 'GET' \
  --url 'public-api.birdeye.so/v1/wallet/token_list?wallet=GQszyLwSVt3BSmuTuYbGmSinM9zbLK9ZMNE1J7UoWmZU' \
  -H 'accept: application/json' \
  -H 'x-chain: solana' \
  -H 'X-API-KEY: YOUR_API_KEY'
```

**Response:** The response includes detailed information about each token in the specified wallet, such as balance, USD value, and token metadata.

**Response format**

| Key       | type    | Example                                                   |
| :-------- | :------ | :-------------------------------------------------------- |
| `success` | boolean | Indicates whether the request was successful              |
| `data`    | object  | Contains wallet address, total USD value, and token items |
| `items`   | array   | An array of tokens. Each token is detailed                |

**Example Response:**

```json
{
  "success": true,
  "data": {
    "wallet": "GQszyLwSVt3BSmuTuYbGmSinM9zbLK9ZMNE1J7UoWmZU",
    "totalUsd": 399.0161242614661,
    "items": [
      {
        "address": "So11111111111111111111111111111111111111111",
        "decimals": 9,
        "balance": 1920633406,
        "uiAmount": 1.920633406,
        "chainId": "solana",
        "name": "SOL",
        "symbol": "SOL",
        "logoURI": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png",
        "priceUsd": 138.18044855253925,
        "valueUsd": 265.39398554607124
      },
      {
        "address": "FViMp5phQH2bX81S7Yyn1yXjj3BRddFBNcMCbTH8FCze",
        "decimals": 4,
        "balance": 575472909883400,
        "uiAmount": 57547290988.34,
        "chainId": "solana",
        "name": "Toad",
        "symbol": "$TOAD",
        "icon": "https://i.ibb.co/nw9h3xs/IMG-20240606-022911-804.png",
        "logoURI": "https://i.ibb.co/nw9h3xs/IMG-20240606-022911-804.png",
        "priceUsd": 4.5088777451623546e-10,
        "valueUsd": 25.947369963170832
      },
      {
        "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "decimals": 6,
        "balance": 18044608,
        "uiAmount": 18.044608,
        "chainId": "solana",
        "name": "USD Coin",
        "symbol": "USDC",
        "icon": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FEPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v%2Flogo.png",
        "logoURI": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FEPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v%2Flogo.png",
        "priceUsd": 1.00003229,
        "valueUsd": 18.045190660392322
      }
    ]
  }
}

```

**Response details**

| Field    | Description                                     | Example                                                                                                                                                                                                                                                                                                                                                                         |
| :------- | :---------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| address  | The address of the token.                       | "So11111111111111111111111111111111111111111"                                                                                                                                                                                                                                                                                                                                   |
| decimals | The number of decimal places the token uses.    | 9                                                                                                                                                                                                                                                                                                                                                                               |
| balance  | The raw balance of the token in the wallet.     | 1920633406                                                                                                                                                                                                                                                                                                                                                                      |
| uiAmount | The amount of token balance                     | 1.920633406                                                                                                                                                                                                                                                                                                                                                                     |
| chainId  | The blockchain network where the token resides. | "solana"                                                                                                                                                                                                                                                                                                                                                                        |
| name     | The name of the token.                          | "SOL"                                                                                                                                                                                                                                                                                                                                                                           |
| symbol   | The symbol representing the token.              | "SOL"                                                                                                                                                                                                                                                                                                                                                                           |
| logoURI  | The URL to the token's logo image.              | "[https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png"](https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png") |
| priceUsd | The current price of the token in USD.          | 138.18044855253925                                                                                                                                                                                                                                                                                                                                                              |
| valueUsd | The current USD value of the token balance.     | 265.39398554607124                                                                                                                                                                                                                                                                                                                                                              |