---
title: "All Time Trades (Single)"
description: "Get all time trades or follow duration transactions for one token."
hidden: false
metadata:
  title: Birdeye Data API | All Time Trades (Single)
  description: Get all time trades or follow duration transactions for one token.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/all-time/trades/single"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Long-range trading activity for one token.</strong></p>
  <ul>
    <li>Use <code>time_frame</code> to choose the horizon: recent windows for momentum, or <code>all</code> for cumulative token history.</li>
    <li>Response is a summarized trade view, not a row-by-row transaction log.</li>
    <li><code>ui_amount_mode=scaled</code> applies Solana Token-2022 scaled UI amount when the token supports the scaled UI extension.</li>
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
    <li>This endpoint consumes <code>10 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Measure long-term token trading traction beyond short intraday windows.</li>
    <li>Power research pages, ranking models, and token-comparison views.</li>
    <li>Compare cumulative trading intensity across different market cycles.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Pass the token <code>address</code>.</li>
    <li>Choose <code>time_frame</code> based on whether you want recent or all-time context.</li>
    <li>Use <code>ui_amount_mode</code> consistently across related token analytics.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use this endpoint for compact trade-history metrics; switch to transaction endpoints when you need event-level detail.</li>
    <li>Compare tokens on the same <code>time_frame</code> to keep rankings fair.</li>
    <li>Pair this with price, volume, or market-data endpoints when you need both activity and valuation context.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/all-time/trades/single

```json
{
  "tags": [
    "Alltime & History"
  ],
  "summary": "All Time Trades (Single)",
  "description": "Get all time trades or follow duration transactions for one token.",
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
      "name": "time_frame",
      "description": "Time interval (Example: '24h')",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "enum": [
          "1m",
          "5m",
          "30m",
          "1h",
          "2h",
          "4h",
          "8h",
          "24h",
          "3d",
          "7d",
          "14d",
          "30d",
          "90d",
          "180d",
          "1y",
          "alltime"
        ],
        "default": "24h"
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
      "description": "OK",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "data": {
                "type": "array",
                "description": "All-time trading metrics grouped by token address.",
                "items": {
                  "type": "object",
                  "properties": {
                    "address": {
                      "type": "string",
                      "description": "Token address.",
                      "example": "So11111111111111111111111111111111111111112"
                    },
                    "total_volume": {
                      "type": "number",
                      "description": "Total traded volume in token units.",
                      "example": 158766463.26959822
                    },
                    "total_volume_usd": {
                      "type": "number",
                      "description": "Total traded volume in USD.",
                      "example": 20188521260.405678
                    },
                    "volume_buy_usd": {
                      "type": "number",
                      "description": "Total buy volume in USD.",
                      "example": 20188521260.405678
                    },
                    "volume_sell_usd": {
                      "type": "number",
                      "description": "Total sell volume in USD.",
                      "example": 20188521260.405678
                    },
                    "volume_buy": {
                      "type": "number",
                      "description": "Total buy volume in token units.",
                      "example": 78227859.16098201
                    },
                    "volume_sell": {
                      "type": "number",
                      "description": "Total sell volume in token units.",
                      "example": 80538604.1086162
                    },
                    "total_trade": {
                      "type": "number",
                      "description": "Total trade count.",
                      "example": 258522892
                    },
                    "buy": {
                      "type": "number",
                      "description": "Total buy trade count.",
                      "example": 87829497
                    },
                    "sell": {
                      "type": "number",
                      "description": "Total sell trade count.",
                      "example": 170693395
                    }
                  }
                }
              },
              "success": {
                "type": "boolean",
                "description": "Whether the request completed successfully.",
                "example": true
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
  "operationId": "get-defi-v3-all-time-trades-single",
  "x-mint": {
    "href": "/data-api/alltime-history/get-defi-v3-all-time-trades-single"
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
