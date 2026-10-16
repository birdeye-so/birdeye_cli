---
title: "Liquidity OHLC - Token"
description: "A historical liquidity time-series API for Solana tokens, returning OHLC data for total token liquidity, exit liquidity, and stable liquidity. Supports 1m, 4h, and 1D resolutions. Maximum 100 records."
hidden: false
metadata:
  title: Birdeye Data API | Liquidity OHLC - Token
  description: >-
    A historical liquidity time-series API for Solana tokens, returning OHLC
    data for total token liquidity, exit liquidity, and stable liquidity.
    Supports 1m, 4h, and 1D resolutions. Maximum 100 records.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/liquidity/ohlc/token"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Historical token liquidity OHLC on Solana.</strong></p>
  <ul>
    <li>This endpoint returns OHLC liquidity series for total liquidity, exit liquidity, and stable liquidity.</li>
    <li>Supported <code>resolution</code> values are <code>1m</code>, <code>4h</code>, and <code>1D</code>.</li>
    <li>Maximum <code>count</code> is <code>100</code> records per request.</li>
    <li>Historical liquidity data is available from January 1, 2024 onward.</li>
  </ul>
</Tab>
  <Tab title="Accessibility">
  <ul>
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
    <li>CU is dynamic by resolution: base <code>20 CU</code> for <code>1m</code>, <code>50 CU</code> for <code>4h</code>, <code>200 CU</code> for <code>1D</code>, with depth and lookback multipliers applied.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Track how token-level liquidity builds, peaks, and decays over time.</li>
    <li>Compare total liquidity against exit liquidity to understand sell-side depth quality.</li>
    <li>Build launch dashboards, post-TGE monitoring, and liquidity-health reports.</li>
    <li>Investigate whether market-cap growth was accompanied by durable liquidity growth.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Pass the token mint in <code>address</code>.</li>
    <li>Choose <code>resolution</code> based on the horizon you care about: <code>1m</code> for event analysis, <code>4h</code> or <code>1D</code> for broader trends.</li>
    <li>Use <code>time</code>, <code>direction</code>, and <code>count</code> to page through the history window you want.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use <code>1m</code> only around narrow event windows; prefer <code>4h</code> or <code>1D</code> for routine trend monitoring.</li>
    <li>Compare liquidity OHLC with price OHLCV to distinguish price momentum from real market depth support.</li>
    <li>Track exit liquidity separately when assessing liquidation or whale-exit risk.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/liquidity/ohlc/token

```json
{
  "x-metadata": {
    "new": true
  },
  "tags": [
    "Price & OHLCV"
  ],
  "summary": "Liquidity OHLC - Token",
  "description": "A historical liquidity time-series API for Solana tokens, returning OHLC data for total token liquidity, exit liquidity, and stable liquidity. Supports 1m, 4h, and 1D resolutions. Maximum 100 records.",
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
      "name": "resolution",
      "description": "Liquidity candle resolution.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "1m",
          "4h",
          "1D"
        ],
        "default": "1m"
      }
    },
    {
      "name": "time",
      "description": "Unix timestamp in seconds used as the anchor time for the liquidity data window. Defaults to the latest available data point.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 0,
        "maximum": 10000000000
      },
      "example": 1750950840
    },
    {
      "name": "direction",
      "description": "Direction to query liquidity records from the anchor time. Use back for older records and forward for newer records.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "back",
          "forward"
        ],
        "default": "back"
      },
      "example": "back"
    },
    {
      "name": "count",
      "description": "Maximum number of liquidity records returned. Defaults to 100 and is capped at 100.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 100,
        "minimum": 1,
        "maximum": 100
      },
      "example": 100
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing liquidity OHLC data of a token",
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
                "description": "Liquidity OHLC candle series for the requested token.",
                "required": [
                  "items",
                  "direction",
                  "limit",
                  "next_cursor",
                  "prev_cursor",
                  "has_more"
                ],
                "properties": {
                  "items": {
                    "type": "array",
                    "description": "Liquidity candles ordered by timestamp.",
                    "items": {
                      "type": "object",
                      "required": [
                        "token",
                        "timestamp",
                        "unix_time",
                        "open_liquidity_usd",
                        "high_liquidity_usd",
                        "low_liquidity_usd",
                        "close_liquidity_usd",
                        "open_exit_liquidity_usd",
                        "high_exit_liquidity_usd",
                        "low_exit_liquidity_usd",
                        "close_exit_liquidity_usd",
                        "open_stable_liquidity_usd",
                        "high_stable_liquidity_usd",
                        "low_stable_liquidity_usd",
                        "close_stable_liquidity_usd",
                        "total_pairs"
                      ],
                      "properties": {
                        "token": {
                          "type": "string",
                          "description": "Token address this liquidity candle belongs to."
                        },
                        "timestamp": {
                          "type": "string",
                          "format": "date-time",
                          "description": "Human-readable timestamp for the candle open time."
                        },
                        "unix_time": {
                          "type": "integer",
                          "description": "Unix timestamp in seconds for the candle open time."
                        },
                        "open_liquidity_usd": {
                          "type": "number",
                          "description": "Token liquidity in USD at the start of the candle."
                        },
                        "high_liquidity_usd": {
                          "type": "number",
                          "description": "Highest token liquidity in USD reached during the candle."
                        },
                        "low_liquidity_usd": {
                          "type": "number",
                          "description": "Lowest token liquidity in USD reached during the candle."
                        },
                        "close_liquidity_usd": {
                          "type": "number",
                          "description": "Token liquidity in USD at the end of the candle."
                        },
                        "open_exit_liquidity_usd": {
                          "type": "number",
                          "description": "Exit liquidity in USD at the start of the candle."
                        },
                        "high_exit_liquidity_usd": {
                          "type": "number",
                          "description": "Highest exit liquidity in USD reached during the candle."
                        },
                        "low_exit_liquidity_usd": {
                          "type": "number",
                          "description": "Lowest exit liquidity in USD reached during the candle."
                        },
                        "close_exit_liquidity_usd": {
                          "type": "number",
                          "description": "Exit liquidity in USD at the end of the candle."
                        },
                        "open_stable_liquidity_usd": {
                          "type": "number",
                          "description": "Liquidity in USD at the start of the candle across pools paired with top coins, counting both sides of each pool."
                        },
                        "high_stable_liquidity_usd": {
                          "type": "number",
                          "description": "Highest liquidity in USD during the candle across pools paired with top coins, counting both sides of each pool."
                        },
                        "low_stable_liquidity_usd": {
                          "type": "number",
                          "description": "Lowest liquidity in USD during the candle across pools paired with top coins, counting both sides of each pool."
                        },
                        "close_stable_liquidity_usd": {
                          "type": "number",
                          "description": "Liquidity in USD at the end of the candle across pools paired with top coins, counting both sides of each pool."
                        },
                        "total_pairs": {
                          "type": "integer",
                          "description": "Number of token pairs contributing to the liquidity snapshot."
                        }
                      }
                    }
                  },
                  "direction": {
                    "type": "string",
                    "enum": [
                      "next",
                      "prev"
                    ],
                    "description": "Internal cursor direction returned for the current result window."
                  },
                  "limit": {
                    "type": "integer",
                    "description": "Number of candles requested from the upstream liquidity data service."
                  },
                  "next_cursor": {
                    "type": "integer",
                    "nullable": true,
                    "description": "Unix timestamp cursor for the next page of newer candles."
                  },
                  "prev_cursor": {
                    "type": "integer",
                    "nullable": true,
                    "description": "Unix timestamp cursor for the previous page of older candles."
                  },
                  "has_more": {
                    "type": "boolean",
                    "description": "Whether another page is available in the returned direction."
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
                      "token": "8thqCqGi8z5hnyvK5ximYarxagYd6Rvzc5dUSiHdpump",
                      "timestamp": "2026-06-17T19:29:00Z",
                      "unix_time": 1781724540,
                      "open_liquidity_usd": 1062.1323768982022,
                      "high_liquidity_usd": 1062.5375387105653,
                      "low_liquidity_usd": 1056.0793845380088,
                      "close_liquidity_usd": 1058.687722615185,
                      "open_exit_liquidity_usd": 354.04412563273405,
                      "high_exit_liquidity_usd": 354.1791795701884,
                      "low_exit_liquidity_usd": 352.0264615126695,
                      "close_exit_liquidity_usd": 352.895907538395,
                      "open_stable_liquidity_usd": 708.0882512654681,
                      "high_stable_liquidity_usd": 708.3583591403768,
                      "low_stable_liquidity_usd": 704.052923025339,
                      "close_stable_liquidity_usd": 705.79181507679,
                      "total_pairs": 1
                    }
                  ],
                  "direction": "prev",
                  "limit": 100,
                  "next_cursor": null,
                  "prev_cursor": 1781724480,
                  "has_more": true
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
  "operationId": "get-defi-v3-liquidity-ohlc-token",
  "x-mint": {
    "href": "/data-api/price-ohlcv/get-defi-v3-liquidity-ohlc-token"
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
