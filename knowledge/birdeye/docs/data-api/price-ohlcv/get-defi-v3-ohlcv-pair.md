---
title: "OHLCV V3 - Pair"
description: "Retrieve candlestick data in OHLCV format of a specified pair. Maximum 5000 records. Compared to v1: Added 1s, 15s, and 30s intervals and no candle padding"
hidden: false
metadata:
  title: Birdeye Data API | OHLCV V3 - Pair
  description: >-
    Retrieve candlestick data in OHLCV format of a specified pair. Maximum 5000
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
openapi: "openapi/data/openapi_docs.json GET /defi/v3/ohlcv/pair"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Extended pair OHLCV with finer intervals and count mode.</strong></p>
  <ul>
    <li>V3 pair candles support <code>1s</code>, <code>15s</code>, and <code>30s</code> intervals in addition to the legacy set.</li>
    <li>Empty candles are not returned unless <code>padding=true</code>.</li>
    <li>When <code>mode=count</code>, provide either <code>time_from</code> or <code>time_to</code>, but not both; <code>count_limit</code> can go up to <code>5000</code>.</li>
    <li>Data retention for the newest intervals is shorter: <code>1s</code> up to 2 weeks, <code>15s</code> and <code>30s</code> up to 3 months.</li>
    <li>Use pair-scoped candles when you need one venue's precise market behavior instead of token-level aggregation.</li>
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
    <li>Inspect launch-time candles for a single pair with second-level precision.</li>
    <li>Compare venues for the same asset and detect price fragmentation or temporary dislocations.</li>
    <li>Backtest pool-specific execution logic, routing, or market-making behavior.</li>
    <li>Build pair-native charts for traders who care about one exact market, not blended token pricing.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> to one of the supported V3 networks.</li>
    <li>Pass the pair address plus <code>type</code>.</li>
    <li>Use <code>mode=range</code> for bounded chart windows, or <code>mode=count</code> for a rolling candle count.</li>
    <li>Enable <code>padding</code> only when your chart explicitly requires contiguous empty buckets.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use pair V3 for launch forensics and short-window analysis where venue specificity matters.</li>
    <li>Keep your venue labeling explicit in UI so users do not confuse pair candles with aggregate token candles.</li>
    <li>Pair these candles with liquidity data when diagnosing sudden wick behavior or temporary price distortions.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /defi/v3/ohlcv/pair

```json
{
  "tags": [
    "Price & OHLCV"
  ],
  "summary": "OHLCV V3 - Pair",
  "description": "Retrieve candlestick data in OHLCV format of a specified pair. Maximum 5000 records. Compared to v1: Added 1s, 15s, and 30s intervals and no candle padding",
  "parameters": [
    {
      "name": "x-chain",
      "description": "Solana, Base, BSC, Ethereum, Monad, Fogo, Mantle, Hyperevm, Megaeth, Robinhood  network.",
      "in": "header",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "solana",
          "bsc",
          "base",
          "ethereum",
          "monad",
          "aptos",
          "fogo",
          "mantle",
          "hyperevm",
          "megaeth",
          "robinhood"
        ],
        "default": "solana"
      }
    },
    {
      "name": "address",
      "description": "The address of a pair contract",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana": {
          "value": "4DoNfFBfF7UokCC2FQzriy7yHK6DY6NVdYpuekQ5pRgg"
        },
        "ethereum": {
          "value": "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"
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
    },
    {
      "name": "inversion",
      "description": "Indicate whether to invert the base/quote on pair. Default: false",
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
      "description": "JSON object containing list of ohlcv  data of a pair",
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
                "description": "OHLCV candle series for the requested trading pair using the V3 schema.",
                "properties": {
                  "items": {
                    "type": "array",
                    "description": "Pair candle list ordered by timestamp.",
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
                          "description": "Traded base-token volume during the candle."
                        },
                        "v_usd": {
                          "type": "number",
                          "description": "Traded volume converted to USD for the same candle."
                        },
                        "address": {
                          "type": "string",
                          "description": "Pair address the candle belongs to."
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
                  "items": [
                    {
                      "address": "9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT",
                      "h": 210,
                      "o": 210,
                      "l": 210,
                      "c": 210,
                      "type": "15m",
                      "v": 0,
                      "unix_time": 1726670700,
                      "v_usd": 1000
                    },
                    {
                      "address": "9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT",
                      "h": 210,
                      "o": 210,
                      "l": 210,
                      "c": 210,
                      "type": "15m",
                      "v": 0,
                      "unix_time": 1726671600,
                      "v_usd": 1000
                    }
                  ]
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
  "operationId": "get-defi-v3-ohlcv-pair",
  "x-mint": {
    "href": "/data-api/price-ohlcv/get-defi-v3-ohlcv-pair"
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
