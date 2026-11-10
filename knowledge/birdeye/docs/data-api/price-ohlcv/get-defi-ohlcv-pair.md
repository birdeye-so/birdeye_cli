---
title: "OHLCV - Pair"
description: "Retrieve candlestick data in OHLCV format of a specified pair. Maximum 1000 records."
hidden: false
metadata:
  title: Birdeye Data API | OHLCV - Pair
  description: >-
    Retrieve candlestick data in OHLCV format of a specified pair. Maximum 1000
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
openapi: "openapi/data/openapi_docs.json GET /defi/ohlcv/pair"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Legacy OHLCV candles scoped to one pair.</strong></p>
  <ul>
    <li>Pass a pair address when you want market-specific candles from one liquidity venue rather than token-level aggregation.</li>
    <li>Use <code>time_from</code>, <code>time_to</code>, and <code>type</code> to define the candle window and resolution.</li>
    <li>Pair candles are useful when DEX-specific pricing matters, especially for fragmented liquidity or venue analysis.</li>
    <li>Choose the V3 pair endpoint when you need second-level intervals or count-based retrieval.</li>
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
    <li>Chart a specific pool or pair instead of blended token pricing.</li>
    <li>Compare price action across different pools for the same asset.</li>
    <li>Monitor venue-specific dislocations, slippage risk, or routing quality.</li>
    <li>Build analytics for LPs, market makers, and DEX-specific trading workflows.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Pass the pair address in <code>address</code>.</li>
    <li>Define the time window with <code>time_from</code> and <code>time_to</code>.</li>
    <li>Choose a legacy candle interval in <code>type</code>.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use pair candles when the token trades across many venues and you need one market's exact behavior.</li>
    <li>Keep pair identity stable in your app so users know which venue they are looking at.</li>
    <li>Join pair OHLCV with pair-overview or liquidity data when execution conditions matter as much as price.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /defi/ohlcv/pair

```json
{
  "tags": [
    "Price & OHLCV"
  ],
  "summary": "OHLCV - Pair",
  "deprecated": true,
  "description": "Retrieve candlestick data in OHLCV format of a specified pair. Maximum 1000 records.",
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
                "description": "OHLCV candle series for the requested trading pair.",
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
                          "description": "Traded base-token volume during the candle."
                        },
                        "address": {
                          "type": "string",
                          "description": "Pair address the candle belongs to."
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
                      "address": "Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE",
                      "c": 131.98629958196778,
                      "h": 132.23482213379438,
                      "l": 131.51590533656915,
                      "o": 131.51590533656915,
                      "type": "15m",
                      "unixTime": 1726700400,
                      "v": 6156.155046497001
                    },
                    {
                      "address": "Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE",
                      "c": 132.7284,
                      "h": 132.81605139774013,
                      "l": 131.95800580371125,
                      "o": 131.98629958196778,
                      "type": "15m",
                      "unixTime": 1726701300,
                      "v": 7401.823317684
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
  "operationId": "get-defi-ohlcv-pair",
  "x-mint": {
    "href": "/data-api/price-ohlcv/get-defi-ohlcv-pair"
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
