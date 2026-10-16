---
title: "Perps Token Open Positions"
hidden: false
metadata:
  title: Perps Data API | Perps Token Open Positions
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
    - perps
    - hyperliquid
  robots: index
openapi: "openapi/perps/openapi_perps_docs.json GET /perps/v1/token/open_positions"
---

<Tabs>
  <Tab title="Usage Note">
    <ul>
      <li>Returns the open perpetual positions currently held in one Hyperliquid token market.</li>
      <li>Position rows are participant-level inventory, not executed trade history.</li>
      <li>Use this endpoint when you need wallet exposure, leverage, margin, size, entry price, mark price, or unrealized PnL per position.</li>
      <li>Large active markets can produce heavier result sets than overview endpoints.</li>
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
    <p><strong>Hyperliquid</strong></p>
  </Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>10 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
- Inspect who is carrying long and short exposure in a perp market right now.
- Build exposure ladders, leverage monitors, and wallet-level risk dashboards.
- Analyze how concentrated open interest is across market participants.
- Investigate crowded positioning before volatility events or liquidation cascades.
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
- Query one Hyperliquid perp token market.
- Read each returned row as a current open position with wallet, sizing, pricing, leverage, margin, and PnL context.
- Combine with `Perps Token Overview` for market summary and `Perps Wallet Open Positions` for wallet-centric follow-up.
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
- Use this endpoint only when you genuinely need position granularity; overview is cheaper for top-line monitoring.
- Compare position concentration with liquidation-map data to identify crowded risk zones.
- Keep position snapshots timestamped in your system if you plan to diff changes over time.
</Accordion>


## Resolved API contract

GET /perps/v1/token/open_positions

```json
{
  "x-metadata": {
    "released_at": 1778803200,
    "new": true
  },
  "tags": [
    "Perps - Token"
  ],
  "summary": "Perps - Token Open Positions",
  "description": "",
  "parameters": [
    {
      "name": "x-perp",
      "description": "Specify the perpetuals exchange. Currently supports hyperliquid.",
      "in": "header",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "hyperliquid"
        ],
        "default": "hyperliquid"
      }
    },
    {
      "name": "token",
      "description": "The symbol of a coin/token (e.g: BTC, SOL, ETH).",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "btc": {
          "value": "BTC"
        },
        "sol": {
          "value": "SOL"
        },
        "eth": {
          "value": "ETH"
        }
      }
    },
    {
      "name": "sort_by",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "position_value",
          "open_time"
        ],
        "default": "open_time"
      }
    },
    {
      "name": "sort_type",
      "description": "Specify the sort order.",
      "in": "query",
      "schema": {
        "type": "string",
        "enum": [
          "desc",
          "asc"
        ],
        "default": "desc"
      }
    },
    {
      "name": "offset",
      "description": "Specify the offset for pagination. Filter for records with offset greater than the specified offset value, including those with offset equal to the specified offset.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 0
      }
    },
    {
      "name": "limit",
      "description": "Number of items per page.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 10,
        "minimum": 1,
        "maximum": 50
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing a list of open positions with certain fields",
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
                "description": "Open positions for the requested token market.",
                "items": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "wallet": {
                      "type": "string",
                      "description": "Wallet address that owns the position."
                    },
                    "wallet_first_trade": {
                      "type": "integer",
                      "description": "Unix timestamp in seconds of the wallet's first recorded perp trade."
                    },
                    "token": {
                      "type": "string",
                      "description": "Perpetual market symbol for the position."
                    },
                    "leverage_type": {
                      "type": "string",
                      "description": "Margin mode used by the position, such as `isolated` or `cross`."
                    },
                    "leverage_value": {
                      "type": "number",
                      "description": "Configured leverage multiplier on the position."
                    },
                    "max_leverage": {
                      "type": "number",
                      "description": "Maximum leverage allowed for this market at the time of the snapshot."
                    },
                    "entry_price": {
                      "type": "number",
                      "description": "Average entry price of the open position."
                    },
                    "mark_price": {
                      "type": "number",
                      "description": "Current mark price used for PnL and liquidation calculations."
                    },
                    "liquidation_price": {
                      "type": [
                        "number",
                        "null"
                      ],
                      "description": "Estimated liquidation price of the position when available."
                    },
                    "margin_used": {
                      "type": "number",
                      "description": "Margin currently assigned to the position."
                    },
                    "position_value": {
                      "type": "number",
                      "description": "Current notional value of the open position."
                    },
                    "roe": {
                      "type": [
                        "number",
                        "null"
                      ],
                      "description": "Return on equity for the position when the endpoint provides it."
                    },
                    "size": {
                      "type": "number",
                      "description": "Signed position size. Positive values indicate net long exposure; negative values indicate net short exposure."
                    },
                    "unrealized_pnl": {
                      "type": "number",
                      "description": "Current unrealized profit and loss for the position."
                    },
                    "cum_funding_since_open": {
                      "type": "number",
                      "description": "Cumulative funding paid or received since the position was opened."
                    },
                    "cum_funding_since_change": {
                      "type": "number",
                      "description": "Cumulative funding paid or received since the last position size change."
                    },
                    "open_time": {
                      "type": "integer",
                      "description": "Unix timestamp in seconds when the current position was opened."
                    }
                  }
                }
              }
            }
          },
          "examples": {
            "TokenOpenPositions": {
              "value": {
                "success": true,
                "data": [
                  {
                    "wallet": "0x4c7ef4ce9317016a6bdf28fe6d4873d188d6fa7f",
                    "wallet_first_trade": 1758884208,
                    "token": "BTC",
                    "leverage_type": "isolated",
                    "leverage_value": 1,
                    "max_leverage": 40,
                    "entry_price": 80746,
                    "mark_price": 80748,
                    "margin_used": 29.863114,
                    "position_value": 29.87602,
                    "size": -0.00037,
                    "unrealized_pnl": 0,
                    "cum_funding_since_open": 0,
                    "cum_funding_since_change": 0,
                    "open_time": 1778830957
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
  "operationId": "get-perps-v1-token-open_positions",
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
