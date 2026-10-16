---
description: "''"
title: Trending tokens
excerpt: Retrieve a dynamic list of trending tokens.
deprecated: false
hidden: false
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
# \*API Endpoint:\*\* /defi/token_trending

**Description:** This endpoint retrieves a dynamic and up-to-date list of trending tokens based on specified sorting criteria. Users can discover the hottest tokens in the market by sorting them by rank, liquidity, or 24-hour trading volume in USD. The response provides essential details such as rank, liquidity, and 24-hour volume, making it easy to stay ahead in the fast-paced world of cryptocurrency.

## Request

**Request Method:** GET

**Data Coverage:** Multi-chain

**Request URL:**

```undefined
<https://public-api.birdeye.so/defi/token_trending?sort_by=rank&sort_type=asc&offset=0&limit=3>
```

**Request Headers:**

```
accept: application/json
x-chain: any chains that Birdeye supports. Example: solana, ethereum
X-API-KEY: YOUR_API_KEY
```

**Parameters:**

| Key         | Data Type | Details                                                                                               | Example |
| ----------- | --------- | ----------------------------------------------------------------------------------------------------- | ------- |
| `sort_by`   | string    | The attribute to sort the tokens by. Supported values: `rank` (default), `liquidity`, `volume24hUSD`. | rank    |
| `sort_type` | string    | The order to sort the tokens in. Supported values: `asc` (default), `desc`.                           | asc     |
| `offset`    | integer   | The number of records to skip from the start. Default is `0`.                                         | 0       |
| `limit`     | integer   | The maximum number of records to return. Supported values: `<= 20`, Default is `20`.                  | 3       |

## Response

The response provides a list of trending tokens based on the specified sorting criteria, along with their rank, liquidity, and 24-hour volume in USD.

**Example Request:**

```bash
curl --request GET \
     --url 'https://public-api.birdeye.so/defi/token_trending?sort_by=rank&sort_type=asc&offset=0&limit=3' \
     --header 'X-API-KEY: YOUR_API_KEY' \
     --header 'x-chain: solana'
```

**Example Response:**

```Text JSON
{  
    "success": true,  
    "data": {  
        "updateUnixTime": 1720012620,  
        "updateTime": "2024-07-03T13:17:00",  
        "tokens": [  
            {  
                "address": "EphmxhQwGYtC3qMBLjywoF7PcCp6XnbBhUVLzz966UR7",  
                "decimals": 6,  
                "liquidity": 572411.039201234,  
                "logoURI": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fgateway.pinata.cloud%2Fipfs%2FQmWZ2nLQNzH4vpdTjuHZizCxW9RfXJwx7GXCQVPqL2vmB4",  
                "name": "Barron Trump",  
                "symbol": "BARRON",  
                "volume24hUSD": 2793145.1025349544,  
                "rank": 0  
            },  
            {  
                "address": "J4cojhnAdenazghRaNPzQY8vCF6iYgKPpJRifjU2CMNp",  
                "decimals": 6,  
                "liquidity": 547495.7322365416,  
                "logoURI": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fgateway.pinata.cloud%2Fipfs%2FQmY3BproM1BpQ4ETvrK4Wxre1Zy4fMjevd6qQD6mctLdLG",  
                "name": "BAKED",  
                "symbol": "BAKED",  
                "volume24hUSD": 3527918.040501778,  
                "rank": 1  
            },  
            {  
                "address": "BUvyaUe6P1dbzqjBMFaqcHKxUGWdBBm2ezRW6RipB6j4",  
                "decimals": 6,  
                "liquidity": 425092.85064021597,  
                "logoURI": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fgateway.pinata.cloud%2Fipfs%2FQmRqKFu4RTDag5MyHBkUniPSYwGXw4aDPY8dtdgyqxQVfc",  
                "name": "Windoge98",  
                "symbol": "Windoge98",  
                "volume24hUSD": 1380656.3887991658,  
                "rank": 2  
            }  
        ],  
        "total": 1000  
    }  
}
```

**Response Parameters:**

| Key                     | Data Type | Details                                              | Example                                                                                                                       |
| ----------------------- | --------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `updateUnixTime`        | integer   | The Unix timestamp of the most recent update.        | 1720012620                                                                                                                    |
| `updateTime`            | string    | The human-readable time of the most recent update.   | "2024-07-03T13:17:00"                                                                                                         |
| `tokens`                | array     | The list of trending tokens.                         |                                                                                                                               |
| `tokens[].address`      | string    | The token address.                                   | "EphmxhQwGYtC3qMBLjywoF7PcCp6XnbBhUVLzz966UR7"                                                                                |
| `tokens[].decimals`     | integer   | The number of decimal places for the token.          | 6                                                                                                                             |
| `tokens[].liquidity`    | float     | The liquidity of the token.                          | 572411.039201234                                                                                                              |
| `tokens[].logoURI`      | string    | The URI of the token's logo.                         | "https://img.fotofolio.xyz/?url=https%3A%2F%2Fgateway.pinata.cloud%2Fipfs%2FQmWZ2nLQNzH4vpdTjuHZizCxW9RfXJwx7GXCQVPqL2vmB4" |
| `tokens[].name`         | string    | The name of the token.                               | "Barron Trump"                                                                                                                |
| `tokens[].symbol`       | string    | The symbol of the token.                             | "BARRON"                                                                                                                      |
| `tokens[].volume24hUSD` | float     | The 24-hour trading volume of the token in USD.      | 2793145.1025349544                                                                                                            |
| `tokens[].rank`         | integer   | The rank of the token based on the sorting criteria. | 0                                                                                                                             |
| `total`                 | integer   | The total number of trending tokens.                 | 1000                                                                                                                          |

**Note:** This endpoint provides a real-time trending list of tokens, making it easy for users to identify and track the most active and liquid tokens in the market.