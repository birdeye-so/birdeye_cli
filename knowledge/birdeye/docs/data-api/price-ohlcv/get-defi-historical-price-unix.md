---
title: "Price - Historical by unix time"
description: "Retrieve historical price by unix timestamp."
hidden: false
metadata:
  title: Birdeye Data API | Price - Historical by unix time
  description: Retrieve historical price by unix timestamp.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/historical_price_unix"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Exact historical price checkpoint.</strong></p>
  <ul>
    <li>Pass one token address plus a required <code>unixtime</code> in seconds.</li>
    <li>Use this endpoint when you need the price at one exact moment, not a full time series.</li>
    <li>This is useful for PnL checkpoints, valuation snapshots, and event-based lookups where a single timestamp matters more than a chart.</li>
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
  <p><strong>Solana</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>5 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Returns historical USD prices for a token at a certain timestamp.</li>
    <li>Perfect for portfolio time series reconstruction or backtesting strategies.</li>
    <li>Great for generating custom charts, price annotations, and historical comparisons.</li>
    <li>Value a wallet or portfolio at a specific historical checkpoint.</li>
    <li>Measure slippage, entry quality, or event impact at a known timestamp.</li>
    <li>Backfill price annotations for trades, transfers, or on-chain alerts.</li>
    <li>Support ROI and tax-style workflows that require point-in-time pricing.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Pass the token mint in <code>address</code>.</li>
    <li>Provide <code>unixtime</code> in seconds for the checkpoint you want to price.</li>
    <li>Use <code>Price - Historical</code> instead when you need a continuous series around the same event.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Normalize all event timestamps to seconds before calling this endpoint.</li>
    <li>Reuse the same checkpoint price across related calculations so PnL and valuation stay consistent.</li>
    <li>Batch many checkpoints asynchronously in your backend rather than blocking a user flow one request at a time.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/historical_price_unix

```json
{
  "tags": [
    "Price & OHLCV"
  ],
  "summary": "Price - Historical by unix time",
  "description": "Retrieve historical price by unix timestamp.",
  "parameters": [
    {
      "name": "x-chain",
      "description": "Solana network only.",
      "in": "header",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "solana"
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
      "name": "unixtime",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 0,
        "maximum": 10000000000
      },
      "example": 1726700000
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
      "description": "JSON object containing the historical price of a token resolved near the requested unix timestamp",
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
                  "priceChange24h"
                ],
                "description": "Historical token price resolved near the requested unix timestamp.",
                "properties": {
                  "value": {
                    "type": "number",
                    "description": "Historical token price in the requested quote currency."
                  },
                  "updateUnixTime": {
                    "type": "integer",
                    "description": "Unix timestamp in seconds of the matched historical price record."
                  },
                  "priceChange24h": {
                    "type": "number",
                    "description": "24-hour percentage price change relative to the matched historical price point."
                  },
                  "isScaledUiToken": {
                    "type": "boolean",
                    "description": "True when the token uses Solana Token-2022 scaled UI amounts."
                  },
                  "scaledValue": {
                    "type": "number",
                    "description": "Historical price adjusted by the scaled UI multiplier. Present for scaled UI tokens."
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
                  "value": 128.09276765626564,
                  "updateUnixTime": 1726675897,
                  "priceChange24h": -4.924324221890145
                }
              }
            },
            "SolanaScaledUIAmount": {
              "value": {
                "data": {
                  "isScaledUiToken": true,
                  "value": 154.24048063205083,
                  "updateUnixTime": 1751417954,
                  "priceChange24h": -2.3458062991146713,
                  "scaledValue": 154.24048063205083,
                  "multiplier": 1
                },
                "success": true
              }
            },
            "MissingHistoryPriceUnix": {
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
  "operationId": "get-defi-historical_price_unix",
  "x-mint": {
    "href": "/data-api/price-ohlcv/get-defi-historical-price-unix"
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
