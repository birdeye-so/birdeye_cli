---
title: "Price - Historical"
description: "Retrieve historical price line chart of a specified token."
hidden: false
metadata:
  title: Birdeye Data API | Price - Historical
  description: Retrieve historical price line chart of a specified token.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/history_price"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Historical price series for one token or pair.</strong></p>
  <ul>
    <li>Set <code>address_type</code> to <code>token</code> or <code>pair</code> depending on what the address represents.</li>
    <li>Use <code>time_from</code>, <code>time_to</code>, and <code>type</code> together to request a bounded series at the granularity you need.</li>
    <li>Returned prices are best suited for line charts, checkpoint analysis, and broad time-series workflows rather than candle-level OHLC studies.</li>
    <li>Choose OHLCV endpoints instead when you need open/high/low/close/volume per bucket.</li>
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
    <li>CU is dynamic: <code>12 CU</code> for up to <code>100</code> items, <code>25 CU</code> for up to <code>300</code> items, and <code>35 CU</code> by default.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Retrieves historical USD price series for a token or pair across a selected time window.</li>
    <li>Great for charting, research, and reconstructing token or pair price behavior across a past period.</li>
    <li>Can be used to track performance before and after events such as listings, unlocks, liquidity changes, or major announcements.</li>
    <li>Helpful for portfolio reconstruction, ROI calculators, trade-performance tools, and benchmark studies.</li>
    <li>Add historical context to trade, holder, and smart-money analysis.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Pass the target <code>address</code> and choose <code>address_type=token</code> or <code>address_type=pair</code>.</li>
    <li>Define the time window with <code>time_from</code> and <code>time_to</code>.</li>
    <li>Choose <code>type</code> based on the granularity needed for your chart or analysis window.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use wider intervals for long backfills and finer intervals only when the question really needs them.</li>
    <li>Align chart labels and downstream joins to the same bucket size you requested here.</li>
    <li>When you need an exact checkpoint instead of a series, switch to <code>Price - Historical by unix time</code>.</li>
  </ul>
</Accordion>


## Resolved API contract

GET /defi/history_price

```json
{
  "tags": [
    "Price & OHLCV"
  ],
  "summary": "Price - Historical",
  "description": "Retrieve historical price line chart of a specified token.",
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
      "name": "address_type",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "enum": [
          "token",
          "pair"
        ]
      }
    },
    {
      "name": "type",
      "description": "OHLCV time frame.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "enum": [
          "1m",
          "3m",
          "5m",
          "15m",
          "30m",
          "1H",
          "2H",
          "4H",
          "6H",
          "8H",
          "12H",
          "1D",
          "3D",
          "1W",
          "1M"
        ]
      },
      "example": "15m"
    },
    {
      "name": "time_from",
      "description": "Specify the start time using unix timestamps in seconds",
      "in": "query",
      "required": true,
      "schema": {
        "type": "integer",
        "minimum": 0,
        "maximum": 10000000000
      },
      "example": 1726700000
    },
    {
      "name": "time_to",
      "description": "Specify the end time using unix timestamps in seconds",
      "in": "query",
      "required": true,
      "schema": {
        "type": "integer",
        "minimum": 0,
        "maximum": 10000000000
      },
      "example": 1726704000
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
      "description": "JSON object containing values and  unix timestamps of a token or pair",
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
                  "items"
                ],
                "description": "Historical price series for the requested token or pair.",
                "properties": {
                  "isScaledUiToken": {
                    "type": "boolean",
                    "description": "True when the token uses Solana Token-2022 scaled UI amounts."
                  },
                  "multiplier": {
                    "type": "number",
                    "description": "Scaled UI multiplier applied to historical price values for Token-2022 assets."
                  },
                  "items": {
                    "type": "array",
                    "description": "Historical price points ordered by timestamp.",
                    "items": {
                      "type": "object",
                      "properties": {
                        "unixTime": {
                          "type": "integer",
                          "description": "Unix timestamp in seconds for this historical price point."
                        },
                        "value": {
                          "type": "number",
                          "description": "Token price at the requested timestamp bucket in the requested quote currency."
                        },
                        "scaledValue": {
                          "type": "number",
                          "description": "Historical price adjusted by the scaled UI multiplier. Present for scaled UI tokens."
                        }
                      }
                    }
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
                  "items": [
                    {
                      "unixTime": 1726670700,
                      "value": 127.97284640184616
                    },
                    {
                      "unixTime": 1726671600,
                      "value": 128.04188346328968
                    },
                    {
                      "unixTime": 1726672500,
                      "value": 127.40223856228901
                    }
                  ]
                }
              }
            },
            "SolanaScaledUIAmount": {
              "value": {
                "data": {
                  "isScaledUiToken": true,
                  "multiplier": 1,
                  "items": [
                    {
                      "address": "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh",
                      "unixTime": 1751417580,
                      "value": 153.4602929354709,
                      "scaledValue": 153.4602929354709
                    },
                    {
                      "address": "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh",
                      "unixTime": 1751417640,
                      "value": 153.4602929354709,
                      "scaledValue": 153.4602929354709
                    }
                  ]
                },
                "success": true
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
  "operationId": "get-defi-history_price",
  "x-mint": {
    "href": "/data-api/price-ohlcv/get-defi-history-price"
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
