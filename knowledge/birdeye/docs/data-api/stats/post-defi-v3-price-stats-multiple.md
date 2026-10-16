---
title: "Price stats (Multiple)"
description: "Get the price stats (current price, high/low, percentage change) by time frame for multiple tokens. Max to 20 tokens"
hidden: false
metadata:
  title: Birdeye Data API | Price stats (Multiple)
  description: >-
    Get the price stats (current price, high/low, percentage change) by time
    frame for multiple tokens. Max to 20 tokens
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json POST /defi/v3/price/stats/multiple"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Batch price stats for multiple tokens across selected timeframes.</strong></p>
  <ul>
    <li>Request body accepts token addresses through <code>list_address</code>.</li>
    <li>Maximum batch size is 20 unique token addresses per request.</li>
    <li>Returns current price, high, low, and price-change percent for each token and requested timeframe.</li>
    <li><code>list_timeframe</code> accepts comma-separated values such as <code>1m</code>, <code>5m</code>, <code>30m</code>, <code>1h</code>, <code>2h</code>, <code>4h</code>, <code>8h</code>, <code>24h</code>, <code>2d</code>, <code>3d</code>, and <code>7d</code>.</li>
    <li>Request up to 3 timeframes per call.</li>
    <li><code>ui_amount_mode=scaled</code> applies Solana Token-2022 scaled UI amount when tokens support scaled UI amount extension.</li>
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
    <li>Batch CU is calculated as <code>ceil(5 * count^0.8)</code>.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Refresh price-stat tables for many tokens in one request.</li>
    <li>Power screeners that rank multiple tokens by price change, high/low range, and current price.</li>
    <li>Evaluate watchlists for momentum alerts across shared timeframes.</li>
    <li>Build compact market boards without fetching full OHLCV series for every token.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Send token addresses in the request body and pass <code>list_timeframe</code> in the query.</li>
    <li>Keep the timeframe list consistent across all tokens in the batch.</li>
    <li>Set <code>ui_amount_mode=raw</code> or <code>scaled</code> consistently with your Token-2022 price handling.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use this endpoint for batch dashboards and alert scans where high/low and percentage change are enough.</li>
    <li>Combine batch price stats with batch market data when ranking both momentum and market quality.</li>
    <li>Deduplicate token addresses before requesting batch stats.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

POST /defi/v3/price/stats/multiple

```json
{
  "tags": [
    "Stats"
  ],
  "summary": "Price stats (Multiple)",
  "description": "Get the price stats (current price, high/low, percentage change) by time frame for multiple tokens. Max to 20 tokens",
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
  "requestBody": {
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "required": [
            "list_address"
          ],
          "type": "object",
          "properties": {
            "list_address": {
              "type": "string",
              "default": "So11111111111111111111111111111111111111112,DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
            }
          }
        },
        "examples": {
          "solana": {
            "value": {
              "list_address": "So11111111111111111111111111111111111111112,DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
            }
          }
        }
      }
    }
  },
  "operationId": "post-defi-v3-price-stats-multiple",
  "x-mint": {
    "href": "/data-api/stats/post-defi-v3-price-stats-multiple"
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
