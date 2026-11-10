---
title: "Price - Multiple"
description: "Retrieve the latest price information for multiple tokens. Maximum 100 tokens"
hidden: false
metadata:
  title: Birdeye Data API | Price - Multiple
  description: >-
    Retrieve the latest price information for multiple tokens. Maximum 100
    tokens
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json POST /defi/multi_price"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Batch spot pricing with request-body input.</strong></p>
  <ul>
    <li>This is the POST variant of <code>Price - Multiple</code> and is useful when the token list is easier to send in a JSON payload.</li>
    <li>Always use checksum contract addresses on EVM chains and canonical token mint addresses on Solana-like chains.</li>
    <li>Maximum batch size is <code>100</code> token addresses per request.</li>
    <li><code>include_liquidity=true</code> requests price plus liquidity context for each token when available.</li>
    <li>Individual response entries may be <code>null</code> or partial if a token is unknown, unsupported, or not yet indexed.</li>
  </ul>
</Tab>

  <Tab title="Accessibility">
  <ul>
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
    <li>Batch CU is calculated as <code>ceil(3 * count^0.8)</code>.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Price many tokens from backend jobs, refresh workers, or API gateways that already hold JSON arrays.</li>
    <li>Hydrate portfolio pages, watchlists, and token grids with one network round trip.</li>
    <li>Support screening systems that need current price snapshots before ranking or filtering assets.</li>
    <li>Lower request overhead when multiple app surfaces need the same batch at once.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Send the token list in the POST body using the documented request schema.</li>
    <li>Keep the request under <code>100</code> addresses.</li>
    <li>Use the GET variant when a simple comma-separated query string is more convenient.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Normalize addresses before batching so you do not waste slots on duplicates or invalid casing.</li>
    <li>Reuse the same batch response across multiple UI components during the same refresh cycle.</li>
    <li>Prefer this POST form when URL length becomes awkward with large token sets.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

POST /defi/multi_price

```json
{
  "tags": [
    "Price & OHLCV"
  ],
  "summary": "Price - Multiple",
  "description": "Retrieve the latest price information for multiple tokens. Maximum 100 tokens",
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
      "description": "JSON object containing price values and update time of multiple tokens",
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
                "description": "Map keyed by token address. Each value is the latest price object for that token, or `null` when price data is unavailable.",
                "additionalProperties": {
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
                },
                "maxProperties": 10
              }
            }
          },
          "examples": {
            "Solana": {
              "value": {
                "success": true,
                "data": {
                  "So11111111111111111111111111111111111111112": {
                    "isScaledUiToken": false,
                    "value": 127.32916175338693,
                    "updateUnixTime": 1726673192,
                    "updateHumanTime": "2024-09-18T15:26:32",
                    "priceInNative": 1,
                    "priceChange24h": -5.833510393308625,
                    "liquidity": 7026264396
                  },
                  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": {
                    "isScaledUiToken": false,
                    "value": 0.00001598090539282,
                    "updateUnixTime": 1726673185,
                    "updateHumanTime": "2024-09-18T15:26:25",
                    "priceInNative": 1.2583e-7,
                    "priceChange24h": -4.766925300538944,
                    "liquidity": 1234414
                  }
                }
              }
            },
            "EVM": {
              "value": {
                "success": true,
                "data": {
                  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": {
                    "value": 2600,
                    "updateUnixTime": 1726673192,
                    "updateHumanTime": "2024-09-18T15:26:32",
                    "priceChange24h": -5.833510393308625,
                    "liquidity": 7026264396
                  },
                  "0x6982508145454Ce325dDbE47a25d4ec3d2311933": {
                    "value": 9.58e-7,
                    "updateUnixTime": 1726673185,
                    "updateHumanTime": "2024-09-18T15:26:25",
                    "priceChange24h": -4.766925300538944,
                    "liquidity": 1431513
                  }
                }
              }
            },
            "SolanaScaledUIAmount": {
              "value": {
                "data": {
                  "XsP7xzNPvEHS1m6qfanPUGjNmdnmsLKEoNAnHjdxxyZ": {
                    "isScaledUiToken": true,
                    "value": 404.21180826549516,
                    "updateUnixTime": 1751369725,
                    "updateHumanTime": "2025-07-01T11:35:25",
                    "priceInNative": 2.71366223488443,
                    "priceChange24h": 4.268112150090328,
                    "scaledValue": 404.21180826549516,
                    "multiplier": 1,
                    "scaledPriceInNative": 2.71366223488443
                  },
                  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": {
                    "isScaledUiToken": false,
                    "value": 0.000013874375132396532,
                    "updateUnixTime": 1751369771,
                    "updateHumanTime": "2025-07-01T11:36:11",
                    "priceInNative": 9.314514583570637e-8,
                    "priceChange24h": -4.55999840357565
                  }
                },
                "success": true
              }
            },
            "MissingMultiPrice": {
              "value": {
                "success": true,
                "data": {
                  "So11111111111111111111111111111111111111112": null,
                  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": null
                }
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
  "requestBody": {
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "allOf": [
            {
              "required": [
                "list_address"
              ],
              "type": "object",
              "properties": {
                "list_address": {
                  "type": "string",
                  "default": "So11111111111111111111111111111111111111112,DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
                }
              }
            }
          ]
        },
        "examples": {
          "solana": {
            "value": {
              "list_address": "So11111111111111111111111111111111111111112,DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
            }
          }
        }
      }
    }
  },
  "operationId": "post-defi-multi_price",
  "x-mint": {
    "href": "/data-api/price-ohlcv/post-defi-multi-price"
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
