---
title: "Liquidity History - Token"
description: "A historical liquidity time-series API for Solana tokens, returning snapshot liquidity data from the open value of each liquidity candle. Supports 1m, 4h, and 1D resolutions. Maximum 100 records."
hidden: false
metadata:
  title: Birdeye Data API | Liquidity History - Token
  description: >-
    A historical liquidity time-series API for Solana tokens, returning snapshot
    liquidity data from the open value of each liquidity candle. Supports 1m,
    4h, and 1D resolutions. Maximum 100 records.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/liquidity/history/token"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Historical token liquidity snapshots on Solana.</strong></p>
  <ul>
    <li>This endpoint returns snapshot liquidity values from the open of each liquidity candle rather than full OHLC candle structure.</li>
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
    <li>Build a clean liquidity time series without needing full OHLC candle fields.</li>
    <li>Track how token depth changed across launches, incentives, or LP exits.</li>
    <li>Support risk, treasury, and market-health dashboards focused on liquidity levels.</li>
    <li>Join liquidity history with price, holder, or smart-money timelines for richer narratives.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Pass the token mint in <code>address</code>.</li>
    <li>Choose <code>resolution</code> and page with <code>time</code>, <code>direction</code>, and <code>count</code>.</li>
    <li>Use the OHLC token liquidity endpoint instead when you need open/high/low/close structure, not just snapshots.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Prefer this endpoint over OHLC liquidity when the consumer only needs level snapshots.</li>
    <li>Align liquidity history windows with the same resolution used by your price or holder charts.</li>
    <li>Use coarser resolutions for multi-week or multi-month views to avoid over-dense series.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/liquidity/history/token

```json
{
  "x-metadata": {
    "new": true
  },
  "tags": [
    "Price & OHLCV"
  ],
  "summary": "Liquidity History - Token",
  "description": "A historical liquidity time-series API for Solana tokens, returning snapshot liquidity data from the open value of each liquidity candle. Supports 1m, 4h, and 1D resolutions. Maximum 100 records.",
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
      "description": "JSON object containing historical liquidity snapshots of a token",
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
                "description": "Historical liquidity snapshots for the requested token.",
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
                    "description": "Historical liquidity points ordered by timestamp.",
                    "items": {
                      "type": "object",
                      "required": [
                        "unix_time",
                        "liquidity_usd",
                        "exit_liquidity_usd",
                        "stable_liquidity_usd",
                        "total_pairs"
                      ],
                      "properties": {
                        "unix_time": {
                          "type": "integer",
                          "description": "Unix timestamp in seconds for this liquidity snapshot."
                        },
                        "liquidity_usd": {
                          "type": "number",
                          "description": "Total token liquidity in USD at this timestamp."
                        },
                        "exit_liquidity_usd": {
                          "type": "number",
                          "description": "Estimated exit liquidity in USD at this timestamp."
                        },
                        "stable_liquidity_usd": {
                          "type": "number",
                          "description": "Liquidity in USD at this timestamp across pools paired with top coins, counting both sides of each pool."
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
                    "description": "Number of history points requested from the upstream liquidity data service."
                  },
                  "next_cursor": {
                    "type": "integer",
                    "nullable": true,
                    "description": "Unix timestamp cursor for the next page of newer history points."
                  },
                  "prev_cursor": {
                    "type": "integer",
                    "nullable": true,
                    "description": "Unix timestamp cursor for the previous page of older history points."
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
                      "unix_time": 1778112000,
                      "liquidity_usd": 76897848464.11568,
                      "exit_liquidity_usd": 76315406.4596759,
                      "stable_liquidity_usd": 79315782724.2839,
                      "total_pairs": 11782972
                    }
                  ],
                  "direction": "prev",
                  "limit": 100,
                  "next_cursor": null,
                  "prev_cursor": 1778097600,
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
  "operationId": "get-defi-v3-liquidity-history-token",
  "x-mint": {
    "href": "/data-api/price-ohlcv/get-defi-v3-liquidity-history-token"
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
