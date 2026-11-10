---
title: "Perps Wallet Overview"
hidden: false
metadata:
  title: Perps Data API | Perps Wallet Overview
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
openapi: "openapi/perps/openapi_perps_docs.json GET /perps/v1/wallet/overview"
---

<Tabs>
  <Tab title="Usage Note">
    <ul>
      <li>Returns a single Hyperliquid wallet summary across perpetual trading activity.</li>
      <li>Use this endpoint for equity, PnL, ROI, ROE, volume, win-rate-style, and directional overview fields exposed by the service.</li>
      <li>This is the wallet summary layer, not the wallet's per-position inventory.</li>
      <li>Pair with wallet open positions when you need the exact current risk book.</li>
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
- Show a trader profile summary for one perp wallet.
- Evaluate whether a wallet is worth deeper review before loading open positions.
- Power wallet intelligence views focused on derivatives performance and exposure.
- Compare a shortlist of notable wallets across high-level perp metrics.
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
- Pass one Hyperliquid wallet address.
- Read the response as a summarized wallet profile across the available perp metrics.
- If the wallet matters, continue to `Perps Wallet Open Positions` for actual live exposure.
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
- Use overview as the lightweight profile layer and reserve position-level calls for drill-down.
- Keep point-in-time snapshots if you need to analyze wallet performance changes over time.
- Compare wallet-level summary with token-level market state before drawing conclusions about conviction or risk.
</Accordion>


## Resolved API contract

GET /perps/v1/wallet/overview

```json
{
  "x-metadata": {
    "released_at": 1778803200,
    "new": true
  },
  "tags": [
    "Perps - Wallet"
  ],
  "summary": "Perps - Wallet Overview",
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
      "description": "JSON object containing overview information of a wallet",
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
                  "perp_equity": {
                    "type": "number",
                    "description": "Current total perp equity for the wallet."
                  },
                  "long_value": {
                    "type": "number",
                    "description": "Total notional value of open long positions."
                  },
                  "short_value": {
                    "type": "number",
                    "description": "Total notional value of open short positions."
                  },
                  "unrealized_pnl": {
                    "type": "number",
                    "description": "Current unrealized profit and loss across open positions."
                  },
                  "order_count": {
                    "type": "integer",
                    "description": "Lifetime number of perp orders or fills tracked for the wallet."
                  },
                  "order_count_90d": {
                    "type": "integer",
                    "description": "Perp orders or fills recorded during the last 90 days."
                  },
                  "win": {
                    "type": "integer",
                    "description": "Lifetime number of profitable realized trades or position outcomes."
                  },
                  "win_90d": {
                    "type": "integer",
                    "description": "Profitable realized trades or position outcomes during the last 90 days."
                  },
                  "loss": {
                    "type": "integer",
                    "description": "Lifetime number of losing realized trades or position outcomes."
                  },
                  "loss_90d": {
                    "type": "integer",
                    "description": "Losing realized trades or position outcomes during the last 90 days."
                  },
                  "volume_usd": {
                    "type": "number",
                    "description": "Lifetime perp trading volume in USD."
                  },
                  "volume_90d_usd": {
                    "type": "number",
                    "description": "Perp trading volume in USD during the last 90 days."
                  },
                  "open_volume_usd": {
                    "type": "number",
                    "description": "Lifetime USD notional value of currently open positions."
                  },
                  "open_volume_90d_usd": {
                    "type": "number",
                    "description": "USD notional value of positions opened during the last 90 days."
                  },
                  "realized_pnl": {
                    "type": "number",
                    "description": "Lifetime realized profit and loss in USD."
                  },
                  "realized_pnl_90d": {
                    "type": "number",
                    "description": "Realized profit and loss in USD during the last 90 days."
                  },
                  "funding_fee": {
                    "type": "number",
                    "description": "Lifetime net funding paid or received."
                  },
                  "funding_fee_90d": {
                    "type": "number",
                    "description": "Net funding paid or received during the last 90 days."
                  },
                  "first_trade": {
                    "type": "integer",
                    "description": "Unix timestamp in seconds of the wallet's first recorded perp trade."
                  },
                  "last_trade": {
                    "type": "integer",
                    "description": "Unix timestamp in seconds of the wallet's most recent recorded perp trade."
                  },
                  "open_value": {
                    "type": "number",
                    "description": "Current total notional value of all open positions."
                  },
                  "total_pnl": {
                    "type": "number",
                    "description": "Lifetime total PnL including realized and unrealized components."
                  },
                  "total_pnl_90d": {
                    "type": "number",
                    "description": "Total PnL during the last 90 days."
                  },
                  "win_rate": {
                    "type": "number",
                    "description": "Lifetime win rate across realized outcomes."
                  },
                  "win_rate_90d": {
                    "type": "number",
                    "description": "Win rate during the last 90 days."
                  },
                  "roe": {
                    "type": "number",
                    "description": "Aggregate return on equity for the wallet's perp activity."
                  },
                  "roi": {
                    "type": "number",
                    "description": "Aggregate return on invested capital across the wallet's perp activity."
                  },
                  "roi_90d": {
                    "type": "number",
                    "description": "Return on invested capital during the last 90 days."
                  },
                  "bias": {
                    "type": "number",
                    "description": "Net directional bias between long and short positioning. Positive values indicate long skew; negative values indicate short skew."
                  },
                  "bias_text": {
                    "type": "string",
                    "description": "Human-readable interpretation of the positioning bias."
                  },
                  "leverage": {
                    "type": "number",
                    "description": "Aggregate effective leverage across open positions."
                  }
                }
              }
            }
          },
          "examples": {
            "WalletOverview": {
              "value": {
                "success": true,
                "data": {
                  "perp_equity": 4820256.661112,
                  "long_value": 7711796.4816,
                  "short_value": 27162652.130878,
                  "unrealized_pnl": 519753.636517,
                  "order_count": 528268,
                  "order_count_90d": 40946,
                  "win": 204298,
                  "win_90d": 18111,
                  "loss": 50566,
                  "loss_90d": 2810,
                  "volume_usd": 2877059275.010704,
                  "volume_90d_usd": 287016529.073075,
                  "open_volume_usd": 1317279026.67999,
                  "open_volume_90d_usd": 155549308.313184,
                  "realized_pnl": 171489764.775849,
                  "realized_pnl_90d": 9018515.858766,
                  "funding_fee": -1923466.812288,
                  "funding_fee_90d": -2530808.146744,
                  "first_trade": 1748185475,
                  "last_trade": 1778818326,
                  "open_value": 34874448.612478,
                  "total_pnl": 172009518.412366,
                  "total_pnl_90d": 9538269.495283,
                  "win_rate": 0.8015961453951912,
                  "win_rate_90d": 0.8656851966923187,
                  "roe": 0.11145774849176364,
                  "roi": 0.13018484413895512,
                  "roi_90d": 0.05797850184333872,
                  "bias": -4.035232357272615,
                  "leverage": 7.234977525954543,
                  "bias_text": "Very Bearish"
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
  "operationId": "get-perps-v1-wallet-overview",
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
