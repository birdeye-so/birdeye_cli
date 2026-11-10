---
title: "Perps Token Liquidation Map"
hidden: false
metadata:
  title: Perps Data API | Perps Token Liquidation Map
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
openapi: "openapi/perps/openapi_perps_docs.json GET /perps/v1/token/liquidation_map"
---

<Tabs>
  <Tab title="Usage Note">
    <ul>
      <li>Returns a price-bucketed liquidation map for one Hyperliquid perpetual market.</li>
      <li>The response is organized around liquidation concentration by price zone, not by wallet or trade.</li>
      <li>Use this endpoint to understand where long and short liquidation pressure may cluster.</li>
      <li>Pair with token overview and open positions for fuller market-structure interpretation.</li>
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
    <li>This endpoint consumes <code>20 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
- Visualize liquidation pressure above and below the current market price.
- Build liquidation heatmaps for trader dashboards and risk tooling.
- Identify crowded zones that may accelerate moves once price enters them.
- Add liquidation context to market commentary, alerts, or derivatives analytics.
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
- Query the target Hyperliquid perp token market.
- Read the returned map as liquidation concentration across price bands.
- Compare nearby clusters with current price and open-interest context from `Perps Token Overview`.
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
- Use this endpoint as a risk-context layer, not as a standalone trading signal.
- Plot the map visually to make clustering easier to interpret than raw tables alone.
- Reconcile liquidation zones with current positioning concentration before making directional assumptions.
</Accordion>


## Resolved API contract

GET /perps/v1/token/liquidation_map

```json
{
  "x-metadata": {
    "released_at": 1778803200,
    "new": true
  },
  "tags": [
    "Perps - Token"
  ],
  "summary": "Perps - Token Liquidation Map",
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
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing a list of liquidation with certain fields",
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
                "description": "Liquidation buckets showing where long and short positions are exposed across price ranges.",
                "items": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "low_price": {
                      "type": "number",
                      "description": "Lower bound of the price bucket."
                    },
                    "high_price": {
                      "type": "number",
                      "description": "Upper bound of the price bucket."
                    },
                    "position_count": {
                      "type": "integer",
                      "description": "Number of positions that would be affected inside this bucket."
                    },
                    "long_liq_size": {
                      "type": "number",
                      "description": "Total long position size exposed to liquidation within this bucket."
                    },
                    "long_liq_value": {
                      "type": "number",
                      "description": "USD value of long liquidations within this bucket."
                    },
                    "short_liq_size": {
                      "type": "number",
                      "description": "Total short position size exposed to liquidation within this bucket."
                    },
                    "short_liq_value": {
                      "type": "number",
                      "description": "USD value of short liquidations within this bucket."
                    },
                    "cum_long_liq_size": {
                      "type": "number",
                      "description": "Cumulative long liquidation size from the current price toward this bucket."
                    },
                    "cum_long_liq_value": {
                      "type": "number",
                      "description": "Cumulative USD value of long liquidations from the current price toward this bucket."
                    },
                    "cum_short_liq_size": {
                      "type": "number",
                      "description": "Cumulative short liquidation size from the current price toward this bucket."
                    },
                    "cum_short_liq_value": {
                      "type": "number",
                      "description": "Cumulative USD value of short liquidations from the current price toward this bucket."
                    }
                  }
                }
              }
            }
          },
          "examples": {
            "TokenLiquidationMap": {
              "value": {
                "success": true,
                "data": [
                  {
                    "low_price": 59355.907139877854,
                    "high_price": 60425.81178288396,
                    "position_count": 255,
                    "long_liq_size": 928.74387,
                    "long_liq_value": 55407181.36036671,
                    "short_liq_size": 0,
                    "short_liq_value": 0,
                    "cum_long_liq_size": 6978.52862,
                    "cum_long_liq_value": 483658047.865786,
                    "cum_short_liq_size": 0,
                    "cum_short_liq_value": 0
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
  "operationId": "get-perps-v1-token-liquidation_map",
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
