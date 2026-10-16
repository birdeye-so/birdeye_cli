---
title: "All Time Trades (Multiple)"
description: "Get all time trades or follow duration transactions for multiple tokens. Max to 20 tokens"
hidden: false
metadata:
  title: Birdeye Data API | All Time Trades (Multiple)
  description: >-
    Get all time trades or follow duration transactions for multiple tokens. Max
    to 20 tokens
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json POST /defi/v3/all-time/trades/multiple"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Long-range trading activity for many tokens in one request.</strong></p>
  <ul>
    <li>Maximum batch size is <code>20</code> token addresses.</li>
    <li>Use the same <code>time_frame</code> across the whole batch so tokens remain comparable.</li>
    <li><code>ui_amount_mode=scaled</code> applies Solana Token-2022 scaled UI amount when supported.</li>
  </ul>
</Tab>

  <Tab title="Accessibility">
  <ul>
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
    <li>Batch CU is calculated as <code>ceil(10 * count^0.8)</code>.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Rank many tokens by long-range trading activity in one request.</li>
    <li>Build comparison tables, scanners, and portfolio research boards.</li>
    <li>Feed token screening logic with consistent all-time or duration-bounded trade metrics.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Send up to <code>20</code> token addresses in the request body.</li>
    <li>Choose one shared <code>time_frame</code> for the batch.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Deduplicate token addresses before sending the batch.</li>
    <li>Keep the batch focused on tokens you truly want to compare under the same horizon.</li>
    <li>Use the single endpoint when one token needs deeper explanation or page-level detail.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

POST /defi/v3/all-time/trades/multiple

```json
{
  "tags": [
    "Alltime & History"
  ],
  "summary": "All Time Trades (Multiple)",
  "description": "Get all time trades or follow duration transactions for multiple tokens. Max to 20 tokens",
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
      "name": "list_address",
      "description": "A list of token addresses in string separated by commas (,)",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana": {
          "value": "So11111111111111111111111111111111111111112,mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So,EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
        },
        "ethereum": {
          "value": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce,0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
        },
        "solana_scaled_ui": {
          "value": "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh,Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg,XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp"
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
  "operationId": "post-defi-v3-all-time-trades-multiple",
  "x-mint": {
    "href": "/data-api/alltime-history/post-defi-v3-all-time-trades-multiple"
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
