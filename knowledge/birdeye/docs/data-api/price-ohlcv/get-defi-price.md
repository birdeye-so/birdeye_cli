---
title: "Price"
description: "Retrieve the latest price information for a specified token."
hidden: false
metadata:
  title: Birdeye Data API | Price
  description: Retrieve the latest price information for a specified token.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/price"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Single-token spot price lookup.</strong></p>
  <ul>
    <li>Always use the checksum contract address on EVM chains and the canonical token mint address on Solana-like chains.</li>
    <li><code>include_liquidity=true</code> adds liquidity context to the latest price snapshot when available.</li>
    <li>Response may be <code>null</code> or omit fields if the token is unknown, unsupported, or not yet indexed on the selected chain.</li>
    <li>Solana and EVM responses can differ slightly because token metadata and liquidity sources differ by chain.</li>
    <li>Cache or poll this endpoint conservatively when rendering dashboards, bots, or watchlists.</li>
  </ul>
</Tab>

  <Tab title="Accessibility">
  <ul>
    <li>Standard</li>
    <li>Lite</li>
    <li>Starter</li>
    <li>Premium</li>
    <li>Business</li>
    <li>Enterprise</li>
  </ul>
</Tab>

  <Tab title="Chain Supported">
  <p><strong>All chains ⛓️ ✨</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>3 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Fetch the latest token price for portfolio rows, token details, and watchlist cards.</li>
    <li>Power alerts, bots, and automations that react to live price movement.</li>
    <li>Enrich trade, liquidity, and holder dashboards with a current spot-price anchor.</li>
    <li>Provide quick price checks before deeper calls such as OHLCV, price stats, or market-data lookups.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Pass one token address in <code>address</code>.</li>
    <li>Enable <code>include_liquidity=true</code> when you want price plus nearby liquidity context in the same call.</li>
    <li>Handle <code>null</code> price payloads gracefully for newly listed or unsupported tokens.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Reuse cached token metadata and decimals so this endpoint only needs to answer price, not identity.</li>
    <li>Pair the latest price with historical or OHLCV endpoints when you need context, not just the current mark.</li>
    <li>For large token sets, move to <code>Price - Multiple</code> instead of looping single-token requests.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/price

```json
{
  "tags": [
    "Price & OHLCV"
  ],
  "summary": "Price",
  "description": "Retrieve the latest price information for a specified token.",
  "parameters": [
    {
      "name": "x-chain",
      "description": "A chain name listed in supported networks.",
      "in": "header",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "solana",
          "ethereum",
          "bsc",
          "base",
          "robinhood",
          "arc",
          "sui",
          "mantle",
          "hyperevm",
          "arbitrum",
          "avalanche",
          "optimism",
          "polygon",
          "zksync",
          "monad",
          "aptos",
          "fogo",
          "megaeth"
        ],
        "default": "solana"
      }
    },
    {
      "name": "check_liquidity",
      "description": "Specify the liquidity value to check.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      },
      "example": 100
    },
    {
      "name": "include_liquidity",
      "description": "Specify whether to include liquidity in the response.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "boolean",
        "enum": [
          true,
          false
        ]
      }
    },
    {
      "name": "address",
      "description": "The address of the token contract.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "wsol": {
          "value": "So11111111111111111111111111111111111111112"
        },
        "solana": {
          "value": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
        },
        "ethereum": {
          "value": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce"
        },
        "solana_scaled_ui": {
          "value": "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh"
        }
      }
    },
    {
      "name": "ui_amount_mode",
      "description": "Indicate whether to use the scaled amount for scaled ui amount tokens. Only support solana",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "raw",
          "scaled",
          "both"
        ],
        "default": "raw"
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing price value and update time of a token",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "required": [
              "success",
              "data"
            ],
            "properties": {
              "success": {
                "type": "boolean",
                "description": "Whether the request completed successfully."
              },
              "data": {
                "type": "object",
                "required": [
                  "value",
                  "updateUnixTime",
                  "updateHumanTime",
                  "priceChange24h"
                ],
                "properties": {
                  "value": {
                    "type": "number",
                    "description": "Latest token price in the requested quote currency, typically USD."
                  },
                  "updateUnixTime": {
                    "type": "integer",
                    "description": "Unix timestamp in seconds when this price point was last updated."
                  },
                  "updateHumanTime": {
                    "type": "string",
                    "description": "Human-readable timestamp of the latest price update."
                  },
                  "priceChange24h": {
                    "type": "number",
                    "description": "Percentage price change over the last 24 hours."
                  },
                  "priceInNative": {
                    "type": "number",
                    "description": "Latest token price quoted in the chain's native asset when available."
                  },
                  "liquidity": {
                    "type": "number",
                    "description": "Current token liquidity in USD when liquidity lookup is enabled and available."
                  },
                  "isScaledUiToken": {
                    "type": "boolean",
                    "description": "True when the token uses Solana Token-2022 scaled UI amounts."
                  },
                  "scaledValue": {
                    "type": "number",
                    "description": "Latest price adjusted by the token's scaled UI multiplier. Present for scaled UI tokens."
                  },
                  "multiplier": {
                    "type": "number",
                    "description": "Scaled UI multiplier applied to raw token-denominated values for Token-2022 assets."
                  },
                  "scaledPriceInNative": {
                    "type": "number",
                    "description": "Latest native-asset price adjusted by the scaled UI multiplier. Present for scaled UI tokens."
                  }
                }
              }
            }
          },
          "examples": {
            "SolanaWithLiquidity": {
              "value": {
                "data": {
                  "isScaledUiToken": false,
                  "value": 0.38622452197470425,
                  "updateUnixTime": 1745058945,
                  "updateHumanTime": "2025-04-19T10:35:45",
                  "priceChange24h": 1.933391934259418,
                  "priceInNative": 0.0027761598581298626,
                  "liquidity": 10854103.37938592
                },
                "success": true
              }
            },
            "EVMWithLiquidity": {
              "value": {
                "data": {
                  "value": 0.000012151838032744844,
                  "updateUnixTime": 1745058827,
                  "updateHumanTime": "2025-04-19T10:33:47",
                  "priceChange24h": 1.4986903810717627,
                  "liquidity": 3349464.6246886267
                },
                "success": true
              }
            },
            "SolanaScaledUIAmount": {
              "value": {
                "data": {
                  "isScaledUiToken": true,
                  "value": 404.21180826549516,
                  "updateUnixTime": 1751369725,
                  "updateHumanTime": "2025-07-01T11:35:25",
                  "priceChange24h": 4.268112150090328,
                  "priceInNative": 2.7135492516187805,
                  "scaledValue": 404.21180826549516,
                  "multiplier": 1,
                  "scaledPriceInNative": 2.7135492516187805
                },
                "success": true
              }
            },
            "MissingPrice": {
              "value": {
                "success": true,
                "data": null
              }
            }
          }
        }
      }
    },
    "400": {
      "description": "Bad Request",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "success": {
                "type": "boolean"
              },
              "message": {
                "type": "string"
              }
            }
          },
          "example": {
            "success": false,
            "message": "Bad request"
          }
        }
      }
    },
    "401": {
      "description": "Unauthorized. API key is missing or invalid",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "success": {
                "type": "boolean"
              },
              "message": {
                "type": "string"
              }
            }
          },
          "example": {
            "success": false,
            "message": "Unauthorized"
          }
        }
      }
    },
    "403": {
      "description": "Forbidden. Request is blacklisted or not whitelisted",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "success": {
                "type": "boolean"
              },
              "message": {
                "type": "string"
              }
            }
          },
          "example": {
            "success": false,
            "message": "Access Denied"
          }
        }
      }
    },
    "429": {
      "description": "Too Many Requests. Rate limit reached",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "success": {
                "type": "boolean"
              },
              "message": {
                "type": "string"
              }
            }
          },
          "example": {
            "success": false,
            "message": "Too many requests"
          }
        }
      }
    },
    "500": {
      "description": "Internal Server Error",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "success": {
                "type": "boolean"
              },
              "message": {
                "type": "string"
              }
            }
          },
          "example": {
            "success": false,
            "message": "Internal Server Error"
          }
        }
      }
    }
  },
  "operationId": "get-defi-price",
  "x-mint": {
    "href": "/data-api/price-ohlcv/get-defi-price"
  },
  "security": [
    {
      "apiKeyAuth": []
    }
  ],
  "servers": [
    {
      "url": "https://public-api.birdeye.so"
    }
  ]
}
```
