---
title: "Wallet - PnL"
description: "Retrieve a wallet's overall PnL and trading statistics, including trade counts, win rate, cash flow, and realized and unrealized profit."
hidden: false
metadata:
  title: Birdeye Data API | Wallet - PnL
  description: >-
    Retrieve a wallet's overall PnL and trading statistics, including trade
    counts, win rate, cash flow, and realized and unrealized profit.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /wallet/v2/pnl/summary"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Wallet-level PnL summary.</strong></p>
  <ul>
    <li>Notes on data: trade data per protocol are not fully backfilled and can affect calculated PnL.</li>
    <li><code>duration</code> accepts <code>all</code>, <code>90d</code>, <code>30d</code>, <code>7d</code>, and <code>24h</code>.</li>
    <li><code>position_scope</code> controls whether the summary uses duration-only or cumulative position interpretation.</li>
    <li><code>pnl_method</code> supports <code>netcash</code> and <code>wac</code>. Use it when you need PnL to follow a specific accounting method.</li>
    <li>Insights in the response:</li>
    <li><code>counts</code>:</li>
    <li><code>total_buy</code>: Total number of buy trades.</li>
    <li><code>total_sell</code>: Total number of sell trades.</li>
    <li><code>total_trade</code>: Combined total of buys and sells.</li>
    <li><code>total_win</code>: Total trades have profit. Only account for fully realized tokens.</li>
    <li><code>total_loss</code>: Total trades in loss. Only account for fully realized tokens.</li>
    <li><code>win_rate</code>: Winning rate. Only account for fully realized tokens.</li>
    <li><code>cashflow_usd</code>:</li>
    <li><code>total_invested</code>: USD spent on all buys.</li>
    <li><code>total_sold</code>: USD received from sales.</li>
    <li><code>current_value</code>: Current position value in USD.</li>
    <li><code>pnl</code>:</li>
    <li><code>realized_profit_usd</code>: Profit/loss from completed trades.</li>
    <li><code>realized_profit_percent</code>: % gain/loss relative to sold cost basis.</li>
    <li><code>unrealized_usd</code>: Profit/loss of current holdings (mark-to-market).</li>
    <li><code>total_usd</code>: Sum of realized + unrealized profit in USD.</li>
    <li><code>avg_profit_per_trade_usd</code>: Average profit/loss per trade.</li>
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
  <p><strong>SVM ⛓️ ✨</strong></p>
  <p><strong>EVM ⛓️ ✨</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>20 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Get a fast wallet PnL summary without requesting token-by-token detail.</li>
    <li>Measure win rate, realized profit, unrealized exposure, and cash flow in one response.</li>
    <li>Power wallet overview cards, trader profile pages, and quick performance checks.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set the supported PnL chain in <code>x-chain</code>.</li>
    <li>Pass the wallet address in <code>wallet</code>.</li>
    <li>Choose <code>duration</code> and <code>position_scope</code> based on whether you want recent or all-time context.</li>
    <li>Set <code>pnl_method=netcash</code> or <code>pnl_method=wac</code> to match the accounting logic used by your app or report.</li>
    <li>Use this summary endpoint before opening detailed breakdowns.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Compare realized and unrealized values together; a high total PnL can hide very different risk profiles.</li>
    <li>Keep the selected duration visible in product UI so users do not confuse recent and all-time performance.</li>
    <li>Use the detail endpoint when the summary reveals something worth investigating.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /wallet/v2/pnl/summary

```json
{
  "x-metadata": {
    "released_at": 1761350400,
    "new": true
  },
  "tags": [
    "Wallet, Networth & PnL"
  ],
  "summary": "Wallet - PnL",
  "description": "Retrieve a wallet's overall PnL and trading statistics, including trade counts, win rate, cash flow, and realized and unrealized profit.",
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
      "name": "duration",
      "description": "Time period used to aggregate wallet transactions and calculate PnL statistics.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "all",
          "90d",
          "30d",
          "7d",
          "24h"
        ],
        "default": "all"
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
      "description": "JSON object containing a wallet’s PnL",
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
                "description": "PnL summary payload for the requested wallet scope.",
                "properties": {
                  "summary": {
                    "type": "object",
                    "additionalProperties": true,
                    "description": "Aggregated PnL summary across the tokens included in this request.",
                    "properties": {
                      "unique_tokens": {
                        "type": "integer",
                        "description": "Number of unique tokens included in the PnL summary."
                      },
                      "counts": {
                        "type": "object",
                        "additionalProperties": true,
                        "properties": {
                          "total_buy": {
                            "type": [
                              "number",
                              "string"
                            ],
                            "description": "Total number of buy trades."
                          },
                          "total_sell": {
                            "type": [
                              "number",
                              "string"
                            ],
                            "description": "Total number of sell trades."
                          },
                          "total_trade": {
                            "type": [
                              "number",
                              "string"
                            ],
                            "description": "Combined total number of buy and sell trades."
                          },
                          "total_win": {
                            "type": [
                              "number",
                              "string"
                            ],
                            "description": "Number of realized winning trades or tokens."
                          },
                          "total_loss": {
                            "type": [
                              "number",
                              "string"
                            ],
                            "description": "Number of realized losing trades or tokens."
                          },
                          "win_rate": {
                            "type": [
                              "number",
                              "string"
                            ],
                            "description": "Winning rate across realized trades or tokens."
                          }
                        }
                      },
                      "cashflow_usd": {
                        "type": "object",
                        "additionalProperties": true,
                        "properties": {
                          "total_invested": {
                            "type": [
                              "number",
                              "string"
                            ],
                            "description": "USD spent on all buys."
                          },
                          "total_sold": {
                            "type": [
                              "number",
                              "string"
                            ],
                            "description": "USD received from all sells."
                          },
                          "current_value": {
                            "type": [
                              "number",
                              "string"
                            ],
                            "description": "Current USD value of open positions when included in the response."
                          }
                        }
                      },
                      "pnl": {
                        "type": "object",
                        "additionalProperties": true,
                        "properties": {
                          "realized_profit_usd": {
                            "type": [
                              "number",
                              "string"
                            ],
                            "description": "Realized profit and loss in USD."
                          },
                          "realized_profit_percent": {
                            "type": [
                              "number",
                              "string"
                            ],
                            "description": "Realized profit and loss percentage."
                          },
                          "unrealized_usd": {
                            "type": [
                              "number",
                              "string"
                            ],
                            "description": "Unrealized profit and loss in USD."
                          },
                          "total_usd": {
                            "type": [
                              "number",
                              "string"
                            ],
                            "description": "Combined realized and unrealized profit and loss in USD."
                          },
                          "avg_profit_per_trade_usd": {
                            "type": [
                              "number",
                              "string"
                            ],
                            "description": "Average realized profit and loss per trade in USD."
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
                "success": true,
                "data": {
                  "summary": {
                    "unique_tokens": 2,
                    "counts": {
                      "total_buy": 11,
                      "total_sell": 3,
                      "total_trade": 14,
                      "total_win": 0,
                      "total_loss": 0,
                      "win_rate": 0
                    },
                    "cashflow_usd": {
                      "total_invested": 175666.37823969766,
                      "total_sold": 87670.81375594059
                    },
                    "pnl": {
                      "realized_profit_usd": 6045.934178885913,
                      "realized_profit_percent": 0.07406974699642274,
                      "unrealized_usd": -74830.62425247866,
                      "total_usd": -68784.69007359275,
                      "avg_profit_per_trade_usd": -4913.192148113768
                    }
                  }
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
  "operationId": "get-wallet-v2-pnl-summary",
  "x-mint": {
    "href": "/data-api/wallet-networth-pnl/get-wallet-v2-pnl-summary"
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
