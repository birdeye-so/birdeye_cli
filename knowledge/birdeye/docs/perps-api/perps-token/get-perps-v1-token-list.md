---
title: "Perps Token List"
hidden: false
metadata:
  title: Perps Data API | Perps Token List
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
openapi: "openapi/perps/openapi_perps_docs.json GET /perps/v1/token/list"
---

<Tabs>
  <Tab title="Usage Note">
    <ul>
      <li>Returns supported perpetual markets on Hyperliquid with ranking-style market metrics.</li>
      <li>Use list filters and sorting to narrow the market set before drilling into one token.</li>
      <li>This endpoint is market discovery for perp tokens, not a candle, trade, or wallet-position feed.</li>
      <li>Values are perp-market fields and should not be mixed directly with spot token analytics without normalization.</li>
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
- Discover supported perp markets before loading deeper token-level analytics.
- Build ranked derivatives boards for open interest, directional bias, leverage, and participation.
- Feed market screeners that separate perp market structure from spot market activity.
- Find candidate markets for liquidation monitoring, position analysis, or trader tracking.
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
- Start here when you need the available Hyperliquid perp token universe.
- Apply supported sorting and filtering params to rank the markets you care about.
- Take the returned token identifier into `Perps Token Overview`, `Perps Token Open Positions`, or `Perps Token Liquidation Map`.
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
- Use this endpoint as the first step in a perp workflow, then drill into one market with the token detail endpoints.
- Keep spot and perp dashboards separated unless you explicitly label and reconcile the metric definitions.
- Cache ranked lists briefly and refresh detail endpoints more aggressively for active monitoring flows.
</Accordion>


## Resolved API contract

GET /perps/v1/token/list

```json
{
  "x-metadata": {
    "released_at": 1778803200,
    "new": true
  },
  "tags": [
    "Perps - Token"
  ],
  "summary": "Perps - Token List",
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
      "name": "time_frame",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "4h",
          "1d",
          "7d",
          "30d",
          "all"
        ],
        "default": "all"
      }
    },
    {
      "name": "sort_by",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "long_io",
          "short_io",
          "open_interest"
        ],
        "default": "open_interest"
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
        "maximum": 20
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing a list of tokens with certain fields",
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
                "description": "Perpetual markets ranked by the requested sort metric and time frame.",
                "items": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "token": {
                      "type": "string",
                      "description": "Perpetual market symbol, such as `BTC` or `ETH`."
                    },
                    "long_io": {
                      "type": "number",
                      "description": "Total long open interest for the token market."
                    },
                    "short_io": {
                      "type": "number",
                      "description": "Total short open interest for the token market."
                    },
                    "open_interest": {
                      "type": "number",
                      "description": "Combined open interest across long and short positions."
                    },
                    "margin": {
                      "type": "number",
                      "description": "Total margin currently backing all open positions."
                    },
                    "margin_used": {
                      "type": "number",
                      "description": "Margin actively committed to current positions."
                    },
                    "entry_margin": {
                      "type": "number",
                      "description": "Margin value measured at entry prices across current positions."
                    },
                    "unrealized_pnl": {
                      "type": "number",
                      "description": "Aggregate unrealized profit and loss across all current positions."
                    },
                    "leverage": {
                      "type": "number",
                      "description": "Aggregate effective leverage across open positions."
                    },
                    "bias": {
                      "type": "number",
                      "description": "Net directional bias between long and short positioning. Positive values indicate long skew; negative values indicate short skew."
                    },
                    "bias_text": {
                      "type": "string",
                      "description": "Human-readable interpretation of the positioning bias."
                    }
                  }
                }
              }
            }
          },
          "examples": {
            "TokenList": {
              "value": {
                "success": true,
                "data": [
                  {
                    "token": "BTC",
                    "long_io": 248130937.65533,
                    "short_io": 131704764.64346,
                    "open_interest": 379835702.29879,
                    "margin": 93565344.18447486,
                    "margin_used": 27115263.997527998,
                    "entry_margin": 27123192.271091487,
                    "unrealized_pnl": 205455.992125,
                    "bias": 1.2443300885242552,
                    "leverage": 14.0081875040353,
                    "bias_text": "Very Bullish"
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
  "operationId": "get-perps-v1-token-list",
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
