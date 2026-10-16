---
description: "''"
title: Token - New Listing
excerpt: Retrieve a list of newly listed tokens.
deprecated: false
hidden: true
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
# \*API Endpoint:\*\* /defi/v2/tokens/new\_listing

**Description:** This endpoint retrieves a list of newly listed tokens up to a specified time (currently 3 days). It provides details such as token address, symbol, name, decimals, listing time, liquidity added time, and current liquidity. Users can limit the number of results returned, with a default limit of 10 and a range from 1 to 10. Only tokens with liquidity greater than or equal to $10 are considered.

Chain supported: solana, ethereum, sui, base, arbitrum, avalanche, bsc, optimism, polygon zksync.

Meme enable platform params: only solana

## Request

**Request Method:** GET

**Data Coverage:** Multi-chain

**Request URL:**

```
https://public-api.birdeye.so/defi/v2/tokens/new_listing?time_to=1733383017&limit=10&meme_platform_enabled=true
```

**Request Headers:**

```
accept: application/json  
x-chain: any chains that Birdeye supports. Example: solana, ethereum  
X-API-KEY: YOUR_API_KEY
```

**Parameters:**

<Table align={[null,null,"left",null,null]}>
  <thead>
    <tr>
      <th>
        Key
      </th>

      <th>
        Data Type
      </th>

      <th style={{ textAlign: "left" }}>
        Require?
      </th>

      <th>
        Details
      </th>

      <th>
        Example
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        `time_to`
      </td>

      <td>
        integer
      </td>

      <td style={{ textAlign: "left" }}>
        required
      </td>

      <td>
        The Unix timestamp to retrieve tokens listed up to.
      </td>

      <td>
        1720061753
      </td>
    </tr>

    <tr>
      <td>
        `limit`
      </td>

      <td>
        integer
      </td>

      <td style={{ textAlign: "left" }}>
        no
      </td>

      <td>
        The maximum number of records to return (default: `10`, range: 1-10).
      </td>

      <td>
        2
      </td>
    </tr>

    <tr>
      <td>
        `meme_platform_enabled`
      </td>

      <td>
        boolean
      </td>

      <td style={{ textAlign: "left" }}>
        no
      </td>

      <td>
        Enable to receive token new listing from meme platforms (eg: pump.fun). This filter only supports Solana.\
        default: `false`
      </td>

      <td>
        true
      </td>
    </tr>
  </tbody>
</Table>

## Response

The response provides a list of newly listed tokens, along with their details.

**Example Request:**

```Text JSON
curl --request GET \
     --url 'https://public-api.birdeye.so/defi/v2/tokens/new_listing?time_to=1720061753&limit=2' \
     --header 'X-API-KEY: YOUR_API_KEY' \
     --header 'x-chain: solana'
```

**Example Response:**

```Text JSON
{
    "success": true,
    "data": {
        "items": [
            {
                "address": "7i8BvxErtapzc4Cf6vTC9uUri8pAFprXhNdiAMs1pump",
                "symbol": "villy",
                "name": "villy ",
                "decimals": 6,
                "liquidityAddedAt": 1720061749,
                "liquidity": 772.2477156153459
            },
            {
                "address": "6Wbxo93YJ3EbdfV3r2VL6t2PGLh5dK3ZKkDaQEzEpump",
                "symbol": "cooper",
                "name": "Cooper 犬",
                "decimals": 6,
                "liquidityAddedAt": 1720061738,
                "liquidity": 3485.8797307051123
            }
        ]
    }
}`

```

**Response Parameters**

| Key                | Data Type | Details                                      | Example                                        |
| ------------------ | --------- | -------------------------------------------- | ---------------------------------------------- |
| `address`          | string    | The token address.                           | "7i8BvxErtapzc4Cf6vTC9uUri8pAFprXhNdiAMs1pump" |
| `symbol`           | string    | The token symbol.                            | "villy"                                        |
| `name`             | string    | The token name.                              | "villy"                                        |
| `decimals`         | integer   | The number of decimal places for the token.  | 6                                              |
| `liquidityAddedAt` | integer   | The Unix timestamp when liquidity was added. | 1720061749                                     |
| `liquidity`        | float     | The current liquidity of the token.          | 772.2477156153459                              |

Note: This endpoint provides a list of newly listed tokens with essential details, helping users stay informed about the latest additions in the cryptocurrency market. Users can specify the number of tokens returned, with a default limit of 10 and a range from 1 to 10.