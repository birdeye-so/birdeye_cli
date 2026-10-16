---
title: "Price Volume - Single"
description: "Retrieve price and volume updates of a specified token."
hidden: false
metadata:
  title: Birdeye Data API | Price Volume - Single
  description: Retrieve price and volume updates of a specified token.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/price_volume/single"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Compact price-plus-volume snapshot for one token.</strong></p>
  <ul>
    <li>This endpoint returns current price plus rolling volume metrics without the heavier payload of OHLCV or full market data.</li>
    <li><code>type</code> defaults to <code>24h</code> and also supports shorter windows such as <code>1h</code>, <code>2h</code>, <code>4h</code>, and <code>8h</code>.</li>
    <li>Use this endpoint when you need a market snapshot card, not a full candle series.</li>
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
    <li>This endpoint consumes <code>5 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Populate token cards with live price and rolling-volume context.</li>
    <li>Power lightweight dashboards, watchlists, and mobile summary views.</li>
    <li>Rank assets by recent activity without loading full OHLCV history.</li>
    <li>Trigger alerts when price moves and volume expansion happen together.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Pass one token address in <code>address</code>.</li>
    <li>Choose <code>type</code> for the rolling window you want summarized.</li>
    <li>Move to OHLCV or historical-price endpoints if you need per-bucket detail.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use shorter windows for scanners and alerts, and longer windows for summary cards.</li>
    <li>Keep the chosen timeframe visible in UI so users do not confuse <code>1h</code> and <code>24h</code> metrics.</li>
    <li>Pair this endpoint with metadata and latest price for fast-loading token rows.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/price_volume/single

```json
{
  "tags": [
    "Price & OHLCV"
  ],
  "summary": "Price Volume - Single",
  "description": "Retrieve price and volume updates of a specified token.",
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
      "name": "type",
      "description": "Time frame/interval.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "default": "24h",
        "enum": [
          "1h",
          "2h",
          "4h",
          "8h",
          "24h"
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
      "description": "JSON object containing price and volume with changes data of a token",
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
                  "price",
                  "updateUnixTime",
                  "updateHumanTime",
                  "volumeUSD",
                  "volumeChangePercent",
                  "priceChangePercent"
                ],
                "properties": {
                  "price": {
                    "type": "number",
                    "description": "Latest token price in the requested quote currency."
                  },
                  "updateUnixTime": {
                    "type": "integer",
                    "description": "Unix timestamp in seconds when the price-volume snapshot was last updated."
                  },
                  "updateHumanTime": {
                    "type": "string",
                    "description": "Human-readable timestamp of the latest snapshot update."
                  },
                  "volumeUSD": {
                    "type": "number",
                    "description": "Trading volume in USD over the requested timeframe."
                  },
                  "volumeChangePercent": {
                    "type": "number",
                    "description": "Percentage change in trading volume versus the previous equivalent timeframe."
                  },
                  "priceChangePercent": {
                    "type": "number",
                    "description": "Percentage change in price over the requested timeframe."
                  },
                  "isScaledUiToken": {
                    "type": "boolean",
                    "description": "True when the token uses Solana Token-2022 scaled UI amounts."
                  },
                  "scaledValue": {
                    "type": "number",
                    "description": "Latest price adjusted by the scaled UI multiplier. Present for scaled UI tokens."
                  },
                  "multiplier": {
                    "type": "number",
                    "description": "Scaled UI multiplier applied to raw token values for Token-2022 assets."
                  }
                }
              }
            }
          },
          "examples": {
            "Solana": {
              "value": {
                "success": true,
                "data": {
                  "isScaledUiToken": false,
                  "price": 128.70426432642992,
                  "updateUnixTime": 1726678569,
                  "updateHumanTime": "2024-09-18T16:56:09",
                  "volumeUSD": 755004403.5277437,
                  "volumeChangePercent": -6.0377419970263055,
                  "priceChangePercent": -2.6091746792986936
                }
              }
            },
            "SolanaScaledUIAmount": {
              "value": {
                "success": true,
                "data": {
                  "isScaledUiToken": true,
                  "price": 404.21180826549516,
                  "updateUnixTime": 1751369725,
                  "updateHumanTime": "2025-07-01T11:35:25",
                  "volumeUSD": 735344.6318917507,
                  "volumeChangePercent": null,
                  "priceChangePercent": 4.268112150090329,
                  "scaledPrice": 404.21180826549516,
                  "multiplier": 1
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
  "operationId": "get-defi-price_volume-single",
  "x-mint": {
    "href": "/data-api/price-ohlcv/get-defi-price-volume-single"
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
