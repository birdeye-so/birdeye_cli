---
title: "Wallet - Leaderboard"
description: "'  Retrieve the wallet leaderboard sorted by total asset value in descending order.'"
hidden: false
metadata:
  title: Birdeye Data API | Wallet - Leaderboard
  description: '  Retrieve the wallet leaderboard sorted by total asset value in descending order.'
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /wallet/v2/leaderboard"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Wallet leaderboard by total asset value.</strong></p>
  <ul>
    <li><code>limit</code> supports <code>1</code> to <code>100</code>, and <code>offset</code> supports up to <code>10,000</code>.</li>
    <li><code>from_value</code> defaults to <code>100,000</code> and cannot go below that threshold.</li>
    <li><code>to_value</code>, when provided, must be greater than <code>from_value</code>.</li>
    <li>Results are sorted by total asset value in descending order.</li>
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
  <p><strong>Solana</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>25 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Build whale leaderboards and wallet-rich-list style screens.</li>
    <li>Slice wallet rankings by value bands for cohort analysis.</li>
    <li>Find large wallets worth investigating further with PnL or funding endpoints.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Use <code>from_value</code> and optional <code>to_value</code> to define the wallet band.</li>
    <li>Page through the leaderboard with <code>offset</code> and <code>limit</code>.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use the leaderboard as a discovery layer, then drill into individual wallets with net-worth and PnL endpoints.</li>
    <li>Keep value bands explicit so comparisons stay meaningful across screens.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
    <li><code>from_value</code> has a hard floor of <code>100,000</code>.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /wallet/v2/leaderboard

```json
{
  "x-metadata": {
    "released_at": 1780012800,
    "new": true
  },
  "tags": [
    "Wallet, Networth & PnL"
  ],
  "summary": "Wallet - Leaderboard",
  "description": "  Retrieve the wallet leaderboard sorted by total asset value in descending order.",
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
      "name": "from_value",
      "description": "Minimum total value filter. Defaults to 100,000 and must be greater than or equal to 100,000.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "format": "float",
        "minimum": 100000,
        "default": 100000
      },
      "example": 110000
    },
    {
      "name": "to_value",
      "description": "Maximum total value filter. Must be greater than or equal to 100,000 and greater than from_value.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "format": "float",
        "minimum": 100000
      },
      "example": 200000
    },
    {
      "name": "sort_by",
      "description": "\n            Field used to sort leaderboard results.\n            Supported values:\n            - total_value: Total wallet value in USD.\n            - trade_count: Total number of trades.\n            - volume_usd: Total trading volume in USD.\n            - realized_pnl: Realized profit and loss in USD.\n            - unrealized_pnl: Unrealized profit and loss in USD.\n        ",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "total_value",
          "trade_count",
          "volume_usd",
          "realized_pnl",
          "unrealized_pnl"
        ],
        "default": "total_value"
      },
      "example": "realized_pnl"
    },
    {
      "name": "interval",
      "description": "Time interval used to calculate leaderboard metrics.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "30m",
          "1h",
          "2h",
          "4h",
          "6h",
          "8h",
          "12h",
          "24h",
          "2d",
          "3d",
          "7d",
          "14d",
          "30d",
          "60d",
          "90d",
          "all_time"
        ],
        "default": "7d"
      },
      "example": "7d"
    },
    {
      "name": "pnl_method",
      "description": "PNL calculation method. `wac` (Weighted Average Cost): calculates PNL for each sell against the average cost of the position held at the time of the sell. Buys only re-average the cost of the remaining inventory, and previously realized sell PNL is not affected by later trades. `netcash` (Net Cash): calculates PNL across the full trade history using the spread between cumulative average sell price and cumulative average buy price. The buy average includes all buys and is not reduced by sells, so later buys can change the reported PNL.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "wac",
          "net_cash"
        ],
        "default": "net_cash"
      },
      "example": "net_cash"
    },
    {
      "name": "min_trade",
      "description": "Minimum number of trades. Must be greater than or equal to 0.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "format": "uint64",
        "minimum": 0
      },
      "example": 10
    },
    {
      "name": "max_trade",
      "description": "Maximum number of trades. Must be greater than or equal to min_trade.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "format": "uint64",
        "minimum": 0
      },
      "example": 1000
    },
    {
      "name": "min_volume_usd",
      "description": "Minimum trading volume in USD. Must be greater than or equal to 0.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "format": "float",
        "minimum": 0
      },
      "example": 10000
    },
    {
      "name": "max_volume_usd",
      "description": "Maximum trading volume in USD. Must be greater than or equal to min_volume_usd.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "format": "float",
        "minimum": 0
      },
      "example": 1000000
    },
    {
      "name": "min_realized_pnl",
      "description": "Minimum realized PnL in USD. Can be negative.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "format": "float"
      },
      "example": -10000
    },
    {
      "name": "max_realized_pnl",
      "description": "Maximum realized PnL in USD. Must be greater than or equal to min_realized_pnl.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "format": "float"
      },
      "example": 100000
    },
    {
      "name": "min_unrealized_pnl",
      "description": "Minimum unrealized PnL in USD. Can be negative.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "format": "float"
      },
      "example": -10000
    },
    {
      "name": "max_unrealized_pnl",
      "description": "Maximum unrealized PnL in USD. Must be greater than or equal to min_unrealized_pnl.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "format": "float"
      },
      "example": 100000
    },
    {
      "name": "limit",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 20,
        "minimum": 1,
        "maximum": 100
      }
    },
    {
      "name": "offset",
      "description": "Make sure offset <= 10000",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 0,
        "minimum": 0,
        "maximum": 10000
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing the wallet leaderboard ranked by total asset value",
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
                "description": "Whether the request succeeded."
              },
              "data": {
                "type": "array",
                "description": "Ranked wallets for the requested leaderboard scope.",
                "items": {
                  "type": "object",
                  "required": [
                    "owner",
                    "total_value",
                    "trade_count",
                    "volume_usd",
                    "realized_pnl",
                    "unrealized_pnl"
                  ],
                  "properties": {
                    "owner": {
                      "type": "string",
                      "description": "Wallet address in the leaderboard.",
                      "example": "3QG3aFvShbd6SxN3SdPowYQbokfReLGV6L141kMJQoLc"
                    },
                    "total_value": {
                      "type": "number",
                      "format": "double",
                      "description": "Total wallet value in USD.",
                      "example": 5235177.875046033
                    },
                    "trade_count": {
                      "type": "integer",
                      "format": "uint64",
                      "description": "Total number of trades.",
                      "example": 82
                    },
                    "volume_usd": {
                      "type": "number",
                      "format": "double",
                      "description": "Total trading volume in USD.",
                      "example": 2528308.586962412
                    },
                    "realized_pnl": {
                      "type": "number",
                      "format": "double",
                      "description": "Realized profit and loss in USD.",
                      "example": -236.30401229077495
                    },
                    "unrealized_pnl": {
                      "type": "number",
                      "format": "double",
                      "description": "Unrealized profit and loss in USD.",
                      "example": 0
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
                "data": [
                  {
                    "owner": "3QG3aFvShbd6SxN3SdPowYQbokfReLGV6L141kMJQoLc",
                    "total_value": 5235177.875046033,
                    "trade_count": 82,
                    "volume_usd": 2528308.586962412,
                    "realized_pnl": -236.30401229077495,
                    "unrealized_pnl": 0
                  },
                  {
                    "owner": "226rXSbYUSwux7aHGC2XhhVhnuzazVPYuveGXyAsqvrt",
                    "total_value": 27178262.34140204,
                    "trade_count": 189,
                    "volume_usd": 1575267.9387524147,
                    "realized_pnl": -146.38501180820623,
                    "unrealized_pnl": 0
                  }
                ]
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
  "operationId": "get-wallet-v2-leaderboard",
  "x-mint": {
    "href": "/data-api/wallet-networth-pnl/get-wallet-v2-leaderboard"
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
