---
title: "Perps Token Overview"
hidden: false
metadata:
  title: Perps Data API | Perps Token Overview
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
openapi: "openapi/perps/openapi_perps_docs.json GET /perps/v1/token/overview"
---

<Tabs>
  <Tab title="Usage Note">
    <ul>
      <li>Returns a token-level perpetual market snapshot for one Hyperliquid market.</li>
      <li>Use this endpoint for current market structure such as price, open interest, position count, and liquidation context.</li>
      <li>This is a summarized market view, not a row-by-row position ledger.</li>
      <li>Join with open-positions or liquidation-map endpoints when you need participant-level or price-bucket detail.</li>
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
- Show a perp market summary card with price, open interest, and positioning context.
- Compare one market's current structure before and after large moves or liquidation waves.
- Power derivatives research pages that summarize crowding, exposure, and recent market state.
- Provide a quick market-health view before loading heavier position-level data.
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
- Pass the target Hyperliquid perp token identifier.
- Read this overview first to decide whether you need position inventory or liquidation clustering next.
- Follow with `Perps Token Open Positions` for wallet-level exposure or `Perps Token Liquidation Map` for liquidation concentration.
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
- Use this endpoint for the fast summary layer in dashboards, then lazy-load heavier detail endpoints on demand.
- Keep a clear distinction between current snapshot fields and time-series or execution data from other surfaces.
- Pair it with wallet-side perp endpoints when you need both market state and participant attribution.
</Accordion>


## Resolved API contract

GET /perps/v1/token/overview

```json
{
  "x-metadata": {
    "released_at": 1778803200,
    "new": true
  },
  "tags": [
    "Perps - Token"
  ],
  "summary": "Perps - Token Overview",
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
      "description": "JSON object containing overview information of a token",
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
                "type": "object",
                "additionalProperties": true,
                "properties": {
                  "price": {
                    "type": "number",
                    "description": "Current mark or market price for the perpetual token."
                  },
                  "position_count": {
                    "type": "integer",
                    "description": "Number of currently open positions for this token."
                  },
                  "open_interest": {
                    "type": "number",
                    "description": "Combined open interest across all positions in the token market."
                  },
                  "long_liquidation_1h": {
                    "type": "number",
                    "description": "Estimated long-side liquidation value over the 1-hour lookback window."
                  },
                  "short_liquidation_1h": {
                    "type": "number",
                    "description": "Estimated short-side liquidation value over the 1-hour lookback window."
                  },
                  "long_liquidation_4h": {
                    "type": "number",
                    "description": "Estimated long-side liquidation value over the 4-hour lookback window."
                  },
                  "short_liquidation_4h": {
                    "type": "number",
                    "description": "Estimated short-side liquidation value over the 4-hour lookback window."
                  },
                  "long_liquidation_1d": {
                    "type": "number",
                    "description": "Estimated long-side liquidation value over the 1-day lookback window."
                  },
                  "short_liquidation_1d": {
                    "type": "number",
                    "description": "Estimated short-side liquidation value over the 1-day lookback window."
                  },
                  "long_liquidation_7d": {
                    "type": "number",
                    "description": "Estimated long-side liquidation value over the 7-day lookback window."
                  },
                  "short_liquidation_7d": {
                    "type": "number",
                    "description": "Estimated short-side liquidation value over the 7-day lookback window."
                  }
                }
              }
            }
          },
          "examples": {
            "TokenOverview": {
              "value": {
                "success": true,
                "data": {
                  "price": 80707,
                  "position_count": 27967,
                  "open_interest": 2176626728.25445,
                  "long_liquidation_1h": 0,
                  "short_liquidation_1h": 0,
                  "long_liquidation_4h": 1368222.64619,
                  "short_liquidation_4h": 13790.85989,
                  "long_liquidation_1d": 1506653.41144,
                  "short_liquidation_1d": 9848277.21284,
                  "long_liquidation_7d": 32705301.59656,
                  "short_liquidation_7d": 32312554.24219
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
  "operationId": "get-perps-v1-token-overview",
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
