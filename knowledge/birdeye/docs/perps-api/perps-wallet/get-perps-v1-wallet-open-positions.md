---
title: "Perps Wallet Open Positions"
hidden: false
metadata:
  title: Perps Data API | Perps Wallet Open Positions
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
openapi: "openapi/perps/openapi_perps_docs.json GET /perps/v1/wallet/open_positions"
---

<Tabs>
  <Tab title="Usage Note">
    <ul>
      <li>Returns the currently open perpetual positions for one Hyperliquid wallet.</li>
      <li>Position rows are live inventory entries, not historical executions.</li>
      <li>Use this endpoint to inspect token-by-token exposure, leverage, liquidation price, size, margin, and unrealized performance.</li>
      <li>This endpoint is wallet-centric; use token-centric position data when the market is your starting point instead of the trader.</li>
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
    <li>This endpoint consumes <code>5 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
- Inspect a trader's live perp book token by token.
- Build wallet risk dashboards showing leverage, liquidation sensitivity, and exposure concentration.
- Analyze whether a trader is net long, net short, diversified, or highly concentrated.
- Support trader due diligence, copy-trading research, and risk monitoring workflows.
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
- Pass one Hyperliquid wallet address.
- Read each row as one active perp position held by that wallet.
- Combine with `Perps Wallet Overview` for summary context and `Perps Token Overview` for market-side context.
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
- Use wallet overview first when you only need a quick trader snapshot.
- Diff consecutive snapshots if you want to detect position changes, scaling, or rotation.
- Cross-check liquidation prices against token-side liquidation-map context for better risk interpretation.
</Accordion>


## Resolved API contract

GET /perps/v1/wallet/open_positions

```json
{
  "x-metadata": {
    "released_at": 1778803200,
    "new": true
  },
  "tags": [
    "Perps - Wallet"
  ],
  "summary": "Perps - Wallet Open Positions",
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
      "name": "wallet",
      "description": "The address of the wallet.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "hyperliquid": {
          "value": "0xa822a9ceb6d6cb5b565bd10098abcfa9cf18d748"
        }
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
                "description": "Open perp positions currently held by the requested wallet.",
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
            "WalletOpenPositions": {
              "value": {
                "success": true,
                "data": [
                  {
                    "token": "BTC",
                    "leverage_type": "cross",
                    "leverage_value": 10,
                    "max_leverage": 40,
                    "entry_price": 77241.5,
                    "mark_price": 80787,
                    "liquidation_price": null,
                    "margin_used": 771179.64816,
                    "position_value": 7710078.6134399995,
                    "roe": 0.4590149077892066,
                    "size": 95.43712,
                    "unrealized_pnl": 338372.30896,
                    "cum_funding_since_open": 28605.300979,
                    "cum_funding_since_change": 398.514496,
                    "open_time": 1770775214
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
  "operationId": "get-perps-v1-wallet-open_positions",
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
