---
title: "OHLCV - Base/Quote"
description: "Retrieve candlestick data in OHLCV format of a specified base-quote pair. Maximum 1000 records."
hidden: false
metadata:
  title: Birdeye Data API | OHLCV - Base/Quote
  description: >-
    Retrieve candlestick data in OHLCV format of a specified base-quote pair.
    Maximum 1000 records.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/ohlcv/base_quote"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Aggregated OHLCV for a base/quote market.</strong></p>
  <ul>
    <li>Use this endpoint when you want candles across markets that share the same base and quote assets, rather than one explicit pair address.</li>
    <li>Provide the base and quote token addresses plus <code>time_from</code>, <code>time_to</code>, and candle <code>type</code>.</li>
    <li>This is useful for consolidated market views where the same asset pair trades across multiple pools or venues.</li>
    <li>Switch to <code>OHLCV - Pair</code> when venue-specific candles matter more than aggregate market behavior.</li>
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
    <li>Build consolidated base/quote charts across multiple markets.</li>
    <li>Reduce venue noise when the same pair trades across fragmented liquidity.</li>
    <li>Compare aggregate market direction with individual-pair behavior.</li>
    <li>Power dashboards that focus on the trading relationship between two assets, not one pool.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Pass the base and quote addresses using the documented query parameters.</li>
    <li>Set <code>time_from</code>, <code>time_to</code>, and the candle <code>type</code> needed for your chart.</li>
    <li>Use pair-level OHLCV if you later need to drill into one venue behind the aggregate.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use this endpoint first for a broad market read, then drill down into individual pairs where anomalies appear.</li>
    <li>Keep your base/quote ordering consistent so chart histories do not flip direction unexpectedly.</li>
    <li>Pair aggregate OHLCV with per-pair liquidity or price spreads when explaining divergences across venues.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /defi/ohlcv/base_quote

```json
{
  "tags": [
    "Price & OHLCV"
  ],
  "summary": "OHLCV - Base/Quote",
  "description": "Retrieve candlestick data in OHLCV format of a specified base-quote pair. Maximum 1000 records.",
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
      "name": "base_address",
      "description": "The address of the base token.",
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
      "name": "quote_address",
      "description": "The address of the quote token.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana": {
          "value": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
        },
        "ethereum": {
          "value": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
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
      "description": "JSON object containing list of ohlc and volume of base and quote",
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
                "description": "OHLCV candle series for a base/quote market.",
                "properties": {
                  "isScaledUiTokenBase": {
                    "type": "boolean",
                    "description": "True when the base token uses Solana Token-2022 scaled UI amounts."
                  },
                  "isScaledUiTokenQuote": {
                    "type": "boolean",
                    "description": "True when the quote token uses Solana Token-2022 scaled UI amounts."
                  },
                  "multiplierBase": {
                    "type": "number",
                    "description": "Scaled UI multiplier for the base token when it uses Token-2022 scaled UI amounts."
                  },
                  "multiplierQuote": {
                    "type": "number",
                    "description": "Scaled UI multiplier for the quote token when it uses Token-2022 scaled UI amounts."
                  },
                  "items": {
                    "type": "array",
                    "description": "Base/quote candle list ordered by timestamp.",
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
                        "unixTime"
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
                        "vBase": {
                          "type": "number",
                          "description": "Traded base-token volume during the candle."
                        },
                        "vQuote": {
                          "type": "number",
                          "description": "Traded quote-token volume during the candle."
                        },
                        "address": {
                          "type": "string",
                          "description": "Market or pair address the candle belongs to when available."
                        },
                        "type": {
                          "type": "string",
                          "description": "Candle interval such as `1m`, `1H`, or `1D`."
                        },
                        "unixTime": {
                          "type": "integer",
                          "description": "Unix timestamp in seconds for the candle open time."
                        },
                        "scaledO": {
                          "type": "number",
                          "description": "Open price adjusted by scaled UI rules when applicable."
                        },
                        "scaledH": {
                          "type": "number",
                          "description": "High price adjusted by scaled UI rules when applicable."
                        },
                        "scaledL": {
                          "type": "number",
                          "description": "Low price adjusted by scaled UI rules when applicable."
                        },
                        "scaledC": {
                          "type": "number",
                          "description": "Close price adjusted by scaled UI rules when applicable."
                        },
                        "scaledVBase": {
                          "type": "number",
                          "description": "Base-token volume adjusted by scaled UI rules when applicable."
                        },
                        "scaledVQuote": {
                          "type": "number",
                          "description": "Quote-token volume adjusted by scaled UI rules when applicable."
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
                      "o": 128.2848293438851,
                      "c": 127.98180512820512,
                      "h": 128.64650816293124,
                      "l": 127.91584674904873,
                      "vBase": 58641.16636665621,
                      "vQuote": 4362436.09417201,
                      "unixTime": 1726670700
                    },
                    {
                      "o": 127.98180512820512,
                      "c": 128.0549796460581,
                      "h": 128.51250171609132,
                      "l": 127.89610078074669,
                      "vBase": 47861.13031539581,
                      "vQuote": 3913815.120231004,
                      "unixTime": 1726671600
                    }
                  ],
                  "baseAddress": "So11111111111111111111111111111111111111112",
                  "quoteAddress": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                  "isScaledUiTokenBase": false,
                  "isScaledUiTokenQuote": false,
                  "type": "15m"
                }
              }
            },
            "SolanaScaledUIAmount": {
              "value": {
                "data": {
                  "items": [
                    {
                      "o": 1.044873537847058,
                      "c": 1.0464293679719943,
                      "h": 1.0464293679719943,
                      "l": 1.044873537847058,
                      "vBase": 0,
                      "vQuote": 55804.81725942366,
                      "unixTime": 1751417580,
                      "scaledO": 1.044873537847058,
                      "scaledC": 1.0464293679719943,
                      "scaledH": 1.0464293679719943,
                      "scaledL": 1.044873537847058,
                      "scaledVBase": 0,
                      "scaledVQuote": 55804.81725942366
                    },
                    {
                      "o": 1.0464293679719943,
                      "c": 1.0459240645688892,
                      "h": 1.0467828492410745,
                      "l": 1.0455628088823077,
                      "vBase": 0,
                      "vQuote": 60125.79360575415,
                      "unixTime": 1751417640,
                      "scaledO": 1.0464293679719943,
                      "scaledC": 1.0459240645688892,
                      "scaledH": 1.0467828492410745,
                      "scaledL": 1.0455628088823077,
                      "scaledVBase": 0,
                      "scaledVQuote": 60125.79360575415
                    }
                  ],
                  "baseAddress": "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh",
                  "quoteAddress": "So11111111111111111111111111111111111111112",
                  "isScaledUiTokenBase": true,
                  "isScaledUiTokenQuote": false,
                  "multiplierBase": 1,
                  "multiplierQuote": null,
                  "type": "1m"
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
  "operationId": "get-defi-ohlcv-base_quote",
  "x-mint": {
    "href": "/data-api/price-ohlcv/get-defi-ohlcv-base-quote"
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
