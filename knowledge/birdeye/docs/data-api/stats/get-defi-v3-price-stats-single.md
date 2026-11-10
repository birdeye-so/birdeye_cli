---
title: "Price stats (Single)"
description: "Get the price stats (current price, high/low, percentage change) by time frame for one token"
hidden: false
metadata:
  title: Birdeye Data API | Price stats (Single)
  description: >-
    Get the price stats (current price, high/low, percentage change) by time
    frame for one token
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/price/stats/single"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Price stats for one token across selected timeframes.</strong></p>
  <ul>
    <li>Returns current price, high, low, and price-change percent for each requested timeframe.</li>
    <li><code>list_timeframe</code> accepts comma-separated values such as <code>1m</code>, <code>5m</code>, <code>30m</code>, <code>1h</code>, <code>2h</code>, <code>4h</code>, <code>8h</code>, <code>24h</code>, <code>2d</code>, <code>3d</code>, and <code>7d</code>.</li>
    <li>Request up to 3 timeframes per call.</li>
    <li><code>ui_amount_mode=scaled</code> applies Solana Token-2022 scaled UI amount when the token supports scaled UI amount extension.</li>
  </ul>
  <p><strong>Reading the numbers.</strong> <code>price_change_percent</code> compares the current price with the selected timeframe window. <code>high</code> and <code>low</code> are the highest and lowest prices inside that timeframe.</p>
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
    <li>This endpoint consumes <code>5 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Build compact price-stat cards with current price, high, low, and percentage change.</li>
    <li>Power alert thresholds across short and medium timeframes without fetching full candles.</li>
    <li>Rank tokens by price momentum across the exact windows your product cares about.</li>
    <li>Add high/low context to watchlists, token profile headers, and trading widgets.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Provide <code>address</code> as the token address and set <code>x-chain</code>.</li>
    <li>Pass <code>list_timeframe=1m,1h,24h</code> or another set of up to 3 supported timeframes.</li>
    <li>Set <code>ui_amount_mode=raw</code> or <code>scaled</code> consistently with your Token-2022 price handling.</li>
    <li>Use OHLCV endpoints when you need full candle series instead of summary stats.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use price stats for lightweight momentum widgets and alerts.</li>
    <li>Keep timeframe sets consistent across tokens when ranking or comparing performance.</li>
    <li>Combine price stats with volume and liquidity data before treating price movement as meaningful.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/price/stats/single

```json
{
  "tags": [
    "Stats"
  ],
  "summary": "Price stats (Single)",
  "description": "Get the price stats (current price, high/low, percentage change) by time frame for one token",
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
      "name": "list_timeframe",
      "description": "A list of time frames seprated by comma (,). List of supported time frames: 1m, 5m, 30m, 1h, 2h, 4h, 8h, 24h, 2d, 3d, 7d",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string"
      },
      "examples": {
        "single": {
          "value": "1m"
        },
        "double": {
          "value": "1m,5m"
        },
        "multiple": {
          "value": "1m,30m,24h"
        }
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
      "description": "JSON object containing list of price stats of tokens",
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
                "type": "array",
                "description": "Array of price-stat rows for the requested token set and timeframes.",
                "items": {
                  "type": "object",
                  "required": [
                    "address",
                    "data"
                  ],
                  "properties": {
                    "address": {
                      "type": "string",
                      "description": "The address of the token contract."
                    },
                    "is_scaled_ui_token": {
                      "type": "boolean"
                    },
                    "multiplier": {
                      "type": "number",
                      "description": "Multiplier used to scale the token price"
                    },
                    "data": {
                      "type": "array",
                      "description": "Price data for a timeframe",
                      "items": {
                        "type": "object",
                        "required": [
                          "unix_time_update_price",
                          "time_frame",
                          "price",
                          "price_change_percent",
                          "high",
                          "low"
                        ],
                        "properties": {
                          "unix_time_update_price": {
                            "type": "integer",
                            "description": "Unix timestamp of when the data was updated"
                          },
                          "time_frame": {
                            "type": "string",
                            "description": "Time period for the data (e.g., '24h', '2d', '3d')",
                            "example": "24h"
                          },
                          "price": {
                            "type": "number",
                            "description": "Current token price"
                          },
                          "price_change_percent": {
                            "type": "number",
                            "description": "Percentage change in price over the specified timeframe"
                          },
                          "high": {
                            "type": "number",
                            "description": "Highest price during the timeframe"
                          },
                          "low": {
                            "type": "number",
                            "description": "Lowest price during the timeframe"
                          },
                          "scaled_price": {
                            "type": "number",
                            "description": "Current token scaled price"
                          },
                          "scaled_high": {
                            "type": "number",
                            "description": "Highest scaled price during the timeframe"
                          },
                          "scaled_low": {
                            "type": "number",
                            "description": "Lowest scaled price during the timeframe"
                          }
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
                "data": [
                  {
                    "address": "So11111111111111111111111111111111111111112",
                    "is_scaled_ui_token": false,
                    "data": [
                      {
                        "unix_time_update_price": 1751419434,
                        "time_frame": "1m",
                        "price": 147.37122560933628,
                        "price_change_percent": -0.023923362896247174,
                        "high": 147.48709093365915,
                        "low": 147.31438207414254
                      },
                      {
                        "unix_time_update_price": 1751419434,
                        "time_frame": "5m",
                        "price": 147.37122560933628,
                        "price_change_percent": 0.8046203174783053,
                        "high": 147.55458435764513,
                        "low": 146.0332035916541
                      }
                    ]
                  }
                ],
                "success": true
              }
            },
            "SolanaScaledUIAmount": {
              "value": {
                "data": [
                  {
                    "address": "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh",
                    "is_scaled_ui_token": true,
                    "multiplier": 1,
                    "data": [
                      {
                        "unix_time_update_price": 1751419250,
                        "time_frame": "1m",
                        "price": 153.80113886441467,
                        "price_change_percent": 0,
                        "high": 153.80113886441467,
                        "low": 153.80113886441467,
                        "scaled_price": 153.80113886441467,
                        "scaled_high": 153.80113886441467,
                        "scaled_low": 153.80113886441467
                      },
                      {
                        "unix_time_update_price": 1751419250,
                        "time_frame": "5m",
                        "price": 153.80113886441467,
                        "price_change_percent": -0.000881089093618502,
                        "high": 153.80249400141503,
                        "low": 153.0064128845785,
                        "scaled_price": 153.80113886441467,
                        "scaled_high": 153.80249400141503,
                        "scaled_low": 153.0064128845785
                      }
                    ]
                  }
                ],
                "success": true
              }
            },
            "EVM": {
              "value": {
                "success": true,
                "data": {
                  "items": [
                    {
                      "address": "0xEE94eb70f808960230B4385F2247dB5E2e24b1a0",
                      "data": [
                        {
                          "unix_time_update_price": 1747643906,
                          "time_frame": "2d",
                          "price": 5.854518628897683,
                          "price_change_percent": -0.6435749789961294,
                          "high": 5.854518628897683,
                          "low": 5.854518628897683
                        },
                        {
                          "unix_time_update_price": 1747643906,
                          "time_frame": "3d",
                          "price": 5.854518628897683,
                          "price_change_percent": -0.6435749789961294,
                          "high": 9913.708977616778,
                          "low": 7.024614764659337
                        },
                        {
                          "unix_time_update_price": 1747643906,
                          "time_frame": "24h",
                          "price": 5.854518628897683,
                          "price_change_percent": -0.6435749789961294,
                          "high": 9913.708977616778,
                          "low": 7.024614764659337
                        }
                      ]
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
  "operationId": "get-defi-v3-price-stats-single",
  "x-mint": {
    "href": "/data-api/stats/get-defi-v3-price-stats-single"
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
