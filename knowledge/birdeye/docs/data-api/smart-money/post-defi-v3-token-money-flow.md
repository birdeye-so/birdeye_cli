---
title: "Token Money Flow"
description: "Retrieve token money flow metrics across selected time frames, wallet tags, and wallet addresses."
hidden: false
metadata:
  title: Birdeye Data API | Token Money Flow
  description: Retrieve token money flow metrics across selected time frames, wallet tags, and wallet addresses.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - smart money
  robots: index
openapi: "openapi/data/openapi_docs.json POST /defi/v3/token/money-flow"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Token money flow grouped by time frame and wallet cohort.</strong></p>
  <ul>
    <li>Use <code>wallet_tags</code> to select supported wallet cohorts such as smart money or KOLs.</li>
    <li>Use <code>frames</code> to request one or more aggregation windows.</li>
    <li>Use <code>wallets</code> to scope the calculation to specific wallets when needed.</li>
    <li>Wallets are deduplicated when a wallet belongs to more than one selected tag.</li>
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
    <li>This endpoint consumes <code>10 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Measure buying and selling pressure from selected wallet cohorts.</li>
    <li>Build smart-money dashboards, alerts, and token-flow screens.</li>
    <li>Compare money flow across multiple time frames.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code> and provide a token address.</li>
    <li>Select one or more <code>frames</code>, wallet tags, or explicit wallet addresses.</li>
    <li>Use the returned buy/sell totals, transaction counts, and trader counts for the selected window.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Keep the selected frames consistent when comparing tokens.</li>
    <li>Use explicit wallet tags for cohort analysis and explicit wallet addresses for targeted investigations.</li>
    <li>Combine money flow with price, liquidity, holder, and security data before making decisions.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

POST /defi/v3/token/money-flow

```json
{
  "tags": [
    "Smart Money"
  ],
  "summary": "Token Money Flow",
  "description": "Retrieve token money flow metrics across selected time frames, wallet tags, and wallet addresses.",
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
    }
  ],
  "requestBody": {
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "required": [
            "token_address"
          ],
          "type": "object",
          "properties": {
            "token_address": {
              "type": "string",
              "example": "Wd1YoGzJY8m6y16jxENtP41RogQUeSxJJC6eGQdUzec"
            },
            "wallet_tags": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": [
                  "all",
                  "smart_money",
                  "kol",
                  "whales"
                ]
              },
              "default": [
                "smart_money"
              ],
              "example": [
                "smart_money",
                "kol"
              ],
              "description": "`all` includes wallets from all currently supported tags. Wallets are deduplicated, so if the same wallet belongs to multiple tags (for example, both `whales` and `kol`), it will only be included once."
            },
            "frames": {
              "type": "array",
              "maxItems": 8,
              "items": {
                "type": "string",
                "enum": [
                  "1m",
                  "5m",
                  "30m",
                  "1h",
                  "2h",
                  "4h",
                  "8h",
                  "24h"
                ]
              },
              "example": [
                "1m",
                "5m",
                "30m",
                "1h",
                "2h",
                "4h",
                "8h",
                "24h"
              ]
            },
            "wallets": {
              "type": "array",
              "maxItems": 50,
              "items": {
                "type": "string"
              },
              "example": [
                "BkRUpYSosGE1EfdYHR56Rwh3QRHbd1AbHVqsh99U6DEc"
              ]
            }
          }
        },
        "examples": {
          "solana": {
            "value": {
              "token_address": "Wd1YoGzJY8m6y16jxENtP41RogQUeSxJJC6eGQdUzec",
              "wallet_tags": [
                "kol"
              ],
              "frames": [
                "1m",
                "5m",
                "30m",
                "1h",
                "2h",
                "4h",
                "8h",
                "24h"
              ],
              "wallets": [
                "BkRUpYSosGE1EfdYHR56Rwh3QRHbd1AbHVqsh99U6DEc"
              ]
            }
          }
        }
      }
    }
  },
  "responses": {
    "200": {
      "description": "List of token money flow data grouped by frame and wallet tag",
      "content": {
        "application/json": {
          "schema": {
            "type": "array",
            "items": {
              "type": "object",
              "required": [
                "uniq_trader",
                "trader_buy",
                "trader_sell",
                "frame",
                "token_address",
                "tag",
                "unix_time",
                "total_amount_buy",
                "total_amount_sell",
                "total_ui_amount_buy",
                "total_ui_amount_sell",
                "total_value_buy",
                "total_value_sell",
                "total_tx_buy",
                "total_tx_sell",
                "last_unix_time",
                "last_block_number"
              ],
              "properties": {
                "frame": {
                  "type": "string",
                  "enum": [
                    "1m",
                    "5m",
                    "30m",
                    "1h",
                    "2h",
                    "4h",
                    "8h",
                    "24h"
                  ],
                  "example": "1h",
                  "description": "Time frame used to aggregate the money flow data."
                },
                "token_address": {
                  "type": "string",
                  "example": "Wd1YoGzJY8m6y16jxENtP41RogQUeSxJJC6eGQdUzec",
                  "description": "Address of the token for which the money flow data is calculated."
                },
                "tag": {
                  "type": "string",
                  "enum": [
                    "all",
                    "smart_money",
                    "kol",
                    "whales"
                  ],
                  "example": "kol",
                  "description": "Wallet tag used to group and aggregate the money flow data."
                },
                "unix_time": {
                  "type": "integer",
                  "format": "int64",
                  "example": 1789700400,
                  "description": "  timestamp representing the start time of the data window for this frame."
                },
                "total_amount_buy": {
                  "type": "string",
                  "example": "0",
                  "description": "  raw token amount bought during the frame, expressed in the token's smallest unit."
                },
                "total_amount_sell": {
                  "type": "string",
                  "example": "3327368316844",
                  "description": "  raw token amount sold during the frame, expressed in the token's smallest unit."
                },
                "total_ui_amount_buy": {
                  "type": "number",
                  "format": "double",
                  "example": 0,
                  "description": "  token amount bought during the frame, adjusted for the token's decimals."
                },
                "total_ui_amount_sell": {
                  "type": "number",
                  "format": "double",
                  "example": 3327368.316844,
                  "description": "  token amount sold during the frame, adjusted for the token's decimals."
                },
                "total_value_buy": {
                  "type": "number",
                  "format": "double",
                  "example": 0,
                  "description": "  value of all buy transactions during the frame."
                },
                "total_value_sell": {
                  "type": "number",
                  "format": "double",
                  "example": 2109.8829944816816,
                  "description": "  value of all sell transactions during the frame."
                },
                "total_tx_buy": {
                  "type": "integer",
                  "example": 0,
                  "description": "  number of buy transactions during the frame."
                },
                "total_tx_sell": {
                  "type": "integer",
                  "example": 2,
                  "description": "  number of sell transactions during the frame."
                },
                "last_unix_time": {
                  "type": "integer",
                  "format": "int64",
                  "example": 1789701201,
                  "description": "  timestamp of the most recent transaction included in this aggregated data."
                },
                "last_block_number": {
                  "type": "integer",
                  "format": "int64",
                  "example": 447962632,
                  "description": "  number of the most recent transaction included in this aggregated data."
                },
                "uniq_trader": {
                  "type": "integer",
                  "format": "int64",
                  "example": 7,
                  "description": "Number of unique wallets that performed at least one buy or sell transaction during the frame."
                },
                "trader_buy": {
                  "type": "integer",
                  "format": "int64",
                  "example": 2,
                  "description": "Number of unique wallets that performed at least one buy transaction during the frame."
                },
                "trader_sell": {
                  "type": "integer",
                  "format": "int64",
                  "example": 6,
                  "description": "Number of unique wallets that performed at least one sell transaction during the frame."
                }
              }
            }
          },
          "examples": {
            "Solana": {
              "value": [
                {
                  "uniq_trader": 7,
                  "trader_buy": 2,
                  "trader_sell": 6,
                  "frame": "1h",
                  "token_address": "Wd1YoGzJY8m6y16jxENtP41RogQUeSxJJC6eGQdUzec",
                  "tag": "kol",
                  "unix_time": 1789700400,
                  "total_amount_buy": "0",
                  "total_amount_sell": "3327368316844",
                  "total_ui_amount_buy": 0,
                  "total_ui_amount_sell": 3327368.316844,
                  "total_value_buy": 0,
                  "total_value_sell": 2109.8829944816816,
                  "total_tx_buy": 0,
                  "total_tx_sell": 2,
                  "last_unix_time": 1789701201,
                  "last_block_number": 447962632
                }
              ]
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
  "operationId": "post-defi-v3-token-money-flow",
  "x-mint": {
    "href": "/data-api/smart-money/post-defi-v3-token-money-flow"
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
