---
title: "OHLCV"
description: "Retrieve candlestick data in OHLCV format of a specified token. Maximum 1000 records."
hidden: false
metadata:
  title: Birdeye Data API | OHLCV
  description: >-
    Retrieve candlestick data in OHLCV format of a specified token. Maximum 1000
    records.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/ohlcv"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Legacy token OHLCV candles.</strong></p>
  <ul>
    <li>Request one token address plus <code>time_from</code>, <code>time_to</code>, and candle <code>type</code>.</li>
    <li>This endpoint returns open, high, low, close, and volume buckets for charting and historical analysis.</li>
    <li>Use the legacy OHLCV endpoint when the standard interval set is enough and you do not need V3-only options like second-level intervals or count mode.</li>
    <li>Prefer V3 OHLCV when you need <code>1s</code>, <code>15s</code>, <code>30s</code>, <code>count_limit</code>, <code>padding</code>, <code>outlier</code>, or <code>inversion</code>.</li>
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
    <li>Render classic candlestick charts for token detail pages and trading dashboards.</li>
    <li>Backtest price action with volume-aware buckets over fixed historical windows.</li>
    <li>Compare regime shifts before and after launches, liquidity adds, or large wallet activity.</li>
    <li>Feed technical-analysis indicators that rely on candle structure rather than spot price alone.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Pass the token address in <code>address</code>.</li>
    <li>Define the candle window with <code>time_from</code> and <code>time_to</code>.</li>
    <li>Choose <code>type</code> from the supported legacy intervals such as <code>1m</code>, <code>5m</code>, <code>1H</code>, <code>1D</code>, <code>1W</code>, or <code>1M</code>.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Pick the coarsest interval that still answers the question to keep charts lighter and easier to scan.</li>
    <li>Keep chart timezone and bucket labels consistent with your other historical endpoints.</li>
    <li>Move to <code>OHLCV V3</code> when you need finer launch-time analysis or more control over returned buckets.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /defi/ohlcv

```json
{
  "tags": [
    "Price & OHLCV"
  ],
  "summary": "OHLCV",
  "deprecated": true,
  "description": "Retrieve candlestick data in OHLCV format of a specified token. Maximum 1000 records.",
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
      "name": "currency",
      "description": "Currency in which OHLCV data is presented. Choose between usd or native token.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "default": "usd",
        "enum": [
          "usd",
          "native"
        ]
      }
    },
    {
      "name": "chart_type",
      "description": "Display OHLC as token price or market cap. mcap mode only applies to token OHLCV on Solana and falls back to price if supply is unavailable. Default: price",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "price",
          "mcap"
        ],
        "default": "price"
      }
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
      "description": "JSON object containing list of ohlcv  data of a token",
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
                "description": "OHLCV candle series for the requested token.",
                "properties": {
                  "isScaledUiToken": {
                    "type": "boolean",
                    "description": "True when the token uses Solana Token-2022 scaled UI amounts."
                  },
                  "multiplier": {
                    "type": "number",
                    "description": "Scaled UI multiplier applied to price and volume fields for Token-2022 assets."
                  },
                  "items": {
                    "type": "array",
                    "description": "Candle list ordered by timestamp.",
                    "items": {
                      "type": "object",
                      "required": [
                        "o",
                        "h",
                        "l",
                        "c",
                        "v",
                        "vUsd",
                        "address",
                        "type",
                        "unixTime",
                        "currency"
                      ],
                      "properties": {
                        "o": {
                          "type": "number",
                          "description": "Open price at the start of the candle."
                        },
                        "h": {
                          "type": "number",
                          "description": "Highest traded price during the candle."
                        },
                        "l": {
                          "type": "number",
                          "description": "Lowest traded price during the candle."
                        },
                        "c": {
                          "type": "number",
                          "description": "Close price at the end of the candle."
                        },
                        "v": {
                          "type": "number",
                          "description": "Traded token volume during the candle."
                        },
                        "vUsd": {
                          "type": "number",
                          "description": "Traded volume converted to USD for the same candle."
                        },
                        "address": {
                          "type": "string",
                          "description": "Token address the candle belongs to."
                        },
                        "type": {
                          "type": "string",
                          "description": "Candle interval such as `1m`, `1H`, or `1D`."
                        },
                        "unixTime": {
                          "type": "integer",
                          "description": "Unix timestamp in seconds for the candle open time."
                        },
                        "currency": {
                          "type": "string",
                          "description": "Quote currency used for price fields in this candle."
                        },
                        "scaledO": {
                          "type": "number",
                          "description": "Open price adjusted by the scaled UI multiplier. Present for scaled UI tokens."
                        },
                        "scaledH": {
                          "type": "number",
                          "description": "High price adjusted by the scaled UI multiplier. Present for scaled UI tokens."
                        },
                        "scaledL": {
                          "type": "number",
                          "description": "Low price adjusted by the scaled UI multiplier. Present for scaled UI tokens."
                        },
                        "scaledC": {
                          "type": "number",
                          "description": "Close price adjusted by the scaled UI multiplier. Present for scaled UI tokens."
                        },
                        "scaledV": {
                          "type": "number",
                          "description": "Volume adjusted by the scaled UI multiplier. Present for scaled UI tokens."
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
                      "o": 128.27328370924414,
                      "h": 128.6281001340782,
                      "l": 127.91200927364626,
                      "c": 127.97284640184616,
                      "v": 58641.16636665621,
                      "vUsd": 7506048,
                      "unixTime": 1726670700,
                      "address": "So11111111111111111111111111111111111111112",
                      "type": "15m",
                      "currency": "usd"
                    },
                    {
                      "o": 127.97284640184616,
                      "h": 128.49450996585105,
                      "l": 127.89354285873108,
                      "c": 128.04188346328968,
                      "v": 47861.13031539581,
                      "vUsd": 6127931,
                      "unixTime": 1726671600,
                      "address": "So11111111111111111111111111111111111111112",
                      "type": "15m",
                      "currency": "usd"
                    }
                  ],
                  "direction": "prev",
                  "limit": 2,
                  "next_cursor": 1768784520,
                  "prev_cursor": 1768784460,
                  "has_more": true
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
                      "o": 153.91024638704283,
                      "h": 153.91535871498587,
                      "l": 153.90894363533533,
                      "c": 153.91535871498587,
                      "v": 0.07037699,
                      "vUsd": 10.8312,
                      "unixTime": 1751414460,
                      "scaledO": 153.91024638704283,
                      "scaledH": 153.91535871498587,
                      "scaledL": 153.90894363533533,
                      "scaledC": 153.91535871498587,
                      "scaledV": 0.07037699,
                      "address": "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh",
                      "type": "1m",
                      "currency": "usd"
                    },
                    {
                      "o": 153.91535871498587,
                      "h": 153.91785401707773,
                      "l": 153.91535871498587,
                      "c": 153.91785401707773,
                      "v": 0.51971038,
                      "vUsd": 79.9974,
                      "unixTime": 1751414520,
                      "scaledO": 153.91535871498587,
                      "scaledH": 153.91785401707773,
                      "scaledL": 153.91535871498587,
                      "scaledC": 153.91785401707773,
                      "scaledV": 0.51971038,
                      "address": "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh",
                      "type": "1m",
                      "currency": "usd"
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
  "operationId": "get-defi-ohlcv",
  "x-mint": {
    "href": "/data-api/price-ohlcv/get-defi-ohlcv"
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
