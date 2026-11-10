---
title: "OHLCV V3"
description: "Retrieve candlestick data in OHLCV format of a specified token. Maximum 5000 records. Compared to v1: Added 1s, 15s, and 30s intervals and no candle padding"
hidden: false
metadata:
  title: Birdeye Data API | OHLCV V3
  description: >-
    Retrieve candlestick data in OHLCV format of a specified token. Maximum 5000
    records. Compared to v1: Added 1s, 15s, and 30s intervals and no candle
    padding
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/ohlcv"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Extended OHLCV with finer intervals and count mode.</strong></p>
  <ul>
    <li>V3 adds <code>1s</code>, <code>15s</code>, and <code>30s</code> intervals, plus <code>mode</code>, <code>count_limit</code>, <code>padding</code>, <code>outlier</code>, and <code>inversion</code>.</li>
    <li>Empty candles are not returned unless <code>padding=true</code>.</li>
    <li>When <code>mode=count</code>, provide either <code>time_from</code> or <code>time_to</code>, but not both; <code>count_limit</code> can go up to <code>5000</code>.</li>
    <li>Data retention for the newest intervals is shorter: <code>1s</code> up to 2 weeks, <code>15s</code> and <code>30s</code> up to 3 months.</li>
    <li>Use <code>outlier=false</code> when you want raw candles without Birdeye outlier filtering.</li>
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
    <li>CU is dynamic: <code>12 CU</code> for up to <code>100</code> items, <code>25 CU</code> for up to <code>300</code> items, <code>40 CU</code> for up to <code>1000</code> items, <code>75 CU</code> for up to <code>2000</code> items, <code>100 CU</code> for up to <code>5000</code> items, and <code>40 CU</code> by default.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Analyze launches, breakouts, and microstructure with second-level candles.</li>
    <li>Backfill large candle windows for research, charting, and signal generation.</li>
    <li>Build advanced chart tools that need control over padding, inversion, and outlier handling.</li>
    <li>Study price behavior around wallet activity, liquidity shocks, and execution events.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> to one of the supported V3 networks.</li>
    <li>Pass the token address plus <code>type</code>.</li>
    <li>Use <code>mode=range</code> with <code>time_from</code> and <code>time_to</code> for normal chart windows.</li>
    <li>Use <code>mode=count</code> with either <code>time_from</code> or <code>time_to</code> when you want the latest or previous <code>N</code> candles.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Start with broader intervals, then zoom into <code>1s</code> or <code>15s</code> only where the event warrants it.</li>
    <li>Leave <code>padding=false</code> for launch and sparse-trading tokens so empty buckets do not imply false activity.</li>
    <li>Keep <code>count_limit</code> as small as the use case allows to reduce payload size and CU.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /defi/v3/ohlcv

```json
{
  "tags": [
    "Price & OHLCV"
  ],
  "summary": "OHLCV V3",
  "description": "Retrieve candlestick data in OHLCV format of a specified token. Maximum 5000 records. Compared to v1: Added 1s, 15s, and 30s intervals and no candle padding",
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
      "description": "OHLCV V3 time frame.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "enum": [
          "1s",
          "15s",
          "30s",
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
    },
    {
      "name": "mode",
      "description": "Select either range (time range) or count (number of candles). If mode is count, time_from and time_to params must exist but not both. Default: range",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "range",
          "count"
        ]
      }
    },
    {
      "name": "count_limit",
      "description": "Specify the maximum candles returned. Only used with mode \"count\". Default: 5000",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 0,
        "maximum": 5000
      }
    },
    {
      "name": "padding",
      "description": "Indicate whether to use padding on empty candles. Default: false",
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
      "name": "outlier",
      "description": "Indicate whether to allow outliers exist in the results. Default: true",
      "in": "query",
      "required": false,
      "schema": {
        "type": "boolean",
        "enum": [
          true,
          false
        ]
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
                "description": "OHLCV candle series for the requested token using the V3 schema.",
                "properties": {
                  "is_scaled_ui_token": {
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
                        "address",
                        "type",
                        "unix_time",
                        "currency",
                        "v_usd"
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
                        "v_usd": {
                          "type": "number",
                          "description": "Traded volume converted to USD for the same candle."
                        },
                        "address": {
                          "type": "string",
                          "description": "Token address the candle belongs to."
                        },
                        "type": {
                          "type": "string",
                          "description": "Candle interval such as `1s`, `1m`, `1H`, or `1D`."
                        },
                        "unix_time": {
                          "type": "integer",
                          "description": "Unix timestamp in seconds for the candle open time."
                        },
                        "currency": {
                          "type": "string",
                          "description": "Quote currency used for price fields in this candle."
                        },
                        "scaled_o": {
                          "type": "number",
                          "description": "Open price adjusted by the scaled UI multiplier. Present for scaled UI tokens."
                        },
                        "scaled_h": {
                          "type": "number",
                          "description": "High price adjusted by the scaled UI multiplier. Present for scaled UI tokens."
                        },
                        "scaled_l": {
                          "type": "number",
                          "description": "Low price adjusted by the scaled UI multiplier. Present for scaled UI tokens."
                        },
                        "scaled_c": {
                          "type": "number",
                          "description": "Close price adjusted by the scaled UI multiplier. Present for scaled UI tokens."
                        },
                        "scaled_v": {
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
                  "is_scaled_ui_token": false,
                  "items": [
                    {
                      "o": 128.27328370924414,
                      "h": 128.6281001340782,
                      "l": 127.91200927364626,
                      "c": 127.97284640184616,
                      "v": 58641.16636665621,
                      "v_usd": 7506048,
                      "unix_time": 1726670700,
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
                      "v_usd": 7506048,
                      "unix_time": 1726671600,
                      "address": "So11111111111111111111111111111111111111112",
                      "type": "15m",
                      "currency": "usd"
                    }
                  ]
                }
              }
            },
            "SolanaScaledUIAmount": {
              "value": {
                "data": {
                  "is_scaled_ui_token": true,
                  "multiplier": 1,
                  "items": [
                    {
                      "o": 153.91024638704283,
                      "h": 153.91535871498587,
                      "l": 153.90894363533533,
                      "c": 153.91535871498587,
                      "v": 0.07037699,
                      "unix_time": 1751414460,
                      "scaled_o": 153.91024638704283,
                      "scaled_h": 153.91535871498587,
                      "scaled_l": 153.90894363533533,
                      "scaled_c": 153.91535871498587,
                      "scaled_v": 0.07037699,
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
                      "unix_time": 1751414520,
                      "scaled_o": 153.91535871498587,
                      "scaled_h": 153.91785401707773,
                      "scaled_l": 153.91535871498587,
                      "scaled_c": 153.91785401707773,
                      "scaled_v": 0.51971038,
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
  "operationId": "get-defi-v3-ohlcv",
  "x-mint": {
    "href": "/data-api/price-ohlcv/get-defi-v3-ohlcv"
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
