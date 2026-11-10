---
title: "Wallet - PnL Chart"
description: "Retrieve the realized PnL chart of a wallet."
hidden: false
metadata:
  title: Birdeye Data API | Wallet - PnL Chart
  description: Retrieve the realized PnL chart of a wallet.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /wallet/v2/pnl/chart"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Realized PnL time series for one wallet.</strong></p>
  <ul>
    <li><code>position_scope</code> supports <code>duration_only</code> and <code>cumulative</code>.</li>
    <li><code>pnl_method</code> supports <code>netcash</code> and <code>wac</code> so the chart can follow the same realized-PnL accounting method as your backend.</li>
    <li><code>time_from</code> and <code>time_to</code> must use <code>YYYY-MM-DD HH:mm:ss</code> in UTC.</li>
    <li>If omitted, the backend fills a default window bounded to at most 100 days.</li>
    <li>The time range from <code>time_from</code> to <code>time_to</code> must not exceed 100 days.</li>
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
  <p><strong>SVM ⛓️ ✨</strong></p>
  <p><strong>EVM ⛓️ ✨</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>30 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Plot realized PnL over time for one wallet.</li>
    <li>Compare cumulative versus duration-only profit behavior.</li>
    <li>Support trader-performance charts and recent-versus-all-time performance analysis.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set the supported PnL chain in <code>x-chain</code>.</li>
    <li>Pass the wallet address in <code>wallet</code>.</li>
    <li>Provide <code>time_from</code> and <code>time_to</code> in UTC when you need an explicit window.</li>
    <li>Choose <code>position_scope</code> based on whether you want isolated interval behavior or cumulative progression.</li>
    <li>Pass <code>pnl_method</code> explicitly when the chart must match summary and detail views exactly.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use explicit windows for reporting jobs so charts are reproducible.</li>
    <li>Keep chart labels clear about whether the series is cumulative or duration-only.</li>
    <li>Pair the PnL chart with wallet summary metrics so users can reconcile line shape with total outcomes.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Maximum chart range is 100 days.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /wallet/v2/pnl/chart

```json
{
  "x-metadata": {
    "released_at": 1780333200,
    "new": true
  },
  "tags": [
    "Wallet, Networth & PnL"
  ],
  "summary": "Wallet - PnL Chart",
  "description": "Retrieve the realized PnL chart of a wallet.",
  "parameters": [
    {
      "name": "x-chain",
      "description": "The chain support PNL data.",
      "in": "header",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "solana",
          "ethereum",
          "arbitrum",
          "avalanche",
          "bsc",
          "optimism",
          "polygon",
          "base",
          "zksync",
          "monad",
          "hyperevm",
          "mantle",
          "megaeth",
          "robinhood"
        ],
        "default": "solana"
      }
    },
    {
      "name": "wallet",
      "description": "The wallet of the account.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana": {
          "value": "eJpBLoF3bgXpzjxqJRAvMchjEo4EqdAmiQh3ASmEtZT"
        }
      }
    },
    {
      "name": "position_scope",
      "description": "Calculation mode for PnL. duration_only calculates PnL only for each selected time bucket. cumulative calculates realized_pnl cumulatively from the start time, while unrealized_pnl is based on the all-time open position. Defaults to duration_only.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "duration_only",
          "cumulative"
        ],
        "default": "duration_only"
      }
    },
    {
      "name": "time_from",
      "description": "Specify the start time in `YYYY-MM-DD HH:mm:ss` format. Defaults to 100 days before the current time. The time range between time_from and time_to must not exceed 100 days.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string"
      },
      "example": "2025-01-01 00:00:00"
    },
    {
      "name": "time_to",
      "description": "Specify the start time in `YYYY-MM-DD HH:mm:ss` format. Defaults to the current time.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string"
      },
      "example": "2025-03-01 00:00:00"
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
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing a wallet pnl chart",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "required": [
              "data"
            ],
            "properties": {
              "success": {
                "type": "boolean",
                "description": "Whether the request succeeded."
              },
              "data": {
                "type": "array",
                "description": "Time-series points for realized PnL and trading activity.",
                "items": {
                  "type": "object",
                  "properties": {
                    "timestamp": {
                      "type": "string",
                      "description": "End timestamp for the aggregation bucket."
                    },
                    "realized_pnl": {
                      "type": "number",
                      "description": "Realized PnL accumulated in the bucket."
                    },
                    "total_volume_usd": {
                      "type": "number",
                      "description": "Total USD trading volume in the bucket."
                    },
                    "total_token_traded": {
                      "type": "number",
                      "description": "Number of unique tokens traded in the bucket."
                    },
                    "total_tx_count": {
                      "type": "number",
                      "description": "Number of transactions in the bucket."
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
                    "timestamp": "2026-05-30T23:59:59Z",
                    "realized_pnl": 0,
                    "total_volume_usd": 64.447324224148,
                    "total_token_traded": 13,
                    "total_tx_count": 13
                  },
                  {
                    "timestamp": "2026-05-31T23:59:59Z",
                    "realized_pnl": 0.014336242978757942,
                    "total_volume_usd": 159.60189124804634,
                    "total_token_traded": 18,
                    "total_tx_count": 48
                  },
                  {
                    "timestamp": "2026-06-01T23:59:59Z",
                    "realized_pnl": 0.006014134550233186,
                    "total_volume_usd": 220.32103859032927,
                    "total_token_traded": 22,
                    "total_tx_count": 75
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
  "operationId": "get-wallet-v2-pnl-chart",
  "x-mint": {
    "href": "/data-api/wallet-networth-pnl/get-wallet-v2-pnl-chart"
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
