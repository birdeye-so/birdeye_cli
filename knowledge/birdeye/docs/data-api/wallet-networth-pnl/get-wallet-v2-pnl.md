---
title: "Wallet - PnL (Per Token)"
description: "Retrieve all-time trading, holdings, cash flow, PnL, and pricing metrics for each specified token in a given wallet."
hidden: false
metadata:
  title: Birdeye Data API | Wallet - PnL (Per Token)
  description: >-
    Retrieve all-time trading, holdings, cash flow, PnL, and pricing metrics for
    each specified token in a given wallet.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /wallet/v2/pnl"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Per-token wallet PnL.</strong></p>
  <ul>
    <li>Maximum number of tokens per request is <code>50</code>.</li>
    <li>Notes on data: trade data per protocol aren't backfilled and might affect the calculation of PnL.</li>
    <li><code>pnl_method</code> supports <code>netcash</code> and <code>wac</code> so you can align the response with your accounting method.</li>
    <li><code>meta</code>:</li>
    <li><code>address</code>: wallet address.</li>
    <li><code>currency</code>: the currency in which PnL is calculated, such as USD.</li>
    <li><code>tokens[&lt;token_address&gt;]</code> includes counts, quantity, cashflow, PnL, and pricing blocks for each token.</li>
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
    <li>Quantity fields are already normalized by token decimals.</li>
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
    <li>Batch CU is calculated as <code>ceil(10 * wallet_count^0.8)</code>.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Break a wallet's PnL down token by token.</li>
    <li>Identify which assets drove gains, losses, and current unrealized exposure.</li>
    <li>Power wallet analytics views that need realized and unrealized PnL per holding.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set the supported PnL chain in <code>x-chain</code>.</li>
    <li>Pass the wallet address in <code>wallet</code>.</li>
    <li>Pass up to <code>50</code> token addresses in <code>token_addresses</code>.</li>
    <li>Set <code>pnl_method</code> explicitly when the output needs to match another reporting workflow or PnL view.</li>
    <li>Read <code>pricing</code>, <code>cashflow_usd</code>, and <code>pnl</code> together to understand both execution and current exposure.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use this endpoint when you already know which token set you want to evaluate.</li>
    <li>Compare <code>current_value</code> with <code>total_invested</code> and <code>total_sold</code> to separate realized outcomes from open positions.</li>
    <li>Treat this endpoint as deprecated over time and prefer newer summary/detail flows where they better fit the product.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /wallet/v2/pnl

```json
{
  "x-metadata": {
    "released_at": 1756252800,
    "new": true
  },
  "tags": [
    "Wallet, Networth & PnL"
  ],
  "summary": "Wallet - PnL (Per Token)",
  "description": "Retrieve all-time trading, holdings, cash flow, PnL, and pricing metrics for each specified token in a given wallet.",
  "deprecated": true,
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
      "name": "token_addresses",
      "description": "List of token address.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana": {
          "value": "pumpsAkNcb1nZs89Uees3DyRzUGxjqThuzF3A8LVVfn,So11111111111111111111111111111111111111112"
        }
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
      "description": "JSON object containing a wallet’s PnL per token",
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
                "properties": {
                  "meta": {
                    "type": "object",
                    "description": "Resolved wallet and valuation context for the response.",
                    "properties": {
                      "address": {
                        "type": "string",
                        "description": "Wallet address whose PnL was requested."
                      },
                      "currency": {
                        "type": "string",
                        "description": "Display currency used for valuation."
                      },
                      "holding_check": {
                        "type": "boolean",
                        "description": "Whether current holdings were included in the PnL calculation."
                      },
                      "time": {
                        "type": "string",
                        "description": "Timestamp of the PnL snapshot."
                      }
                    }
                  },
                  "tokens": {
                    "type": "object",
                    "description": "Map keyed by token address to per-token PnL details.",
                    "additionalProperties": {
                      "type": "object",
                      "additionalProperties": true,
                      "description": "Per-token PnL, position, and trading metrics for one wallet-token pair.",
                      "properties": {
                        "symbol": {
                          "type": "string",
                          "description": "Token symbol."
                        },
                        "decimals": {
                          "type": "integer",
                          "description": "Number of token decimals."
                        },
                        "address": {
                          "type": "string",
                          "description": "Token mint or contract address."
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
                        "quantity": {
                          "type": "object",
                          "additionalProperties": true,
                          "properties": {
                            "total_bought_amount": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Total token quantity bought."
                            },
                            "total_sold_amount": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Total token quantity sold."
                            },
                            "holding": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Current token quantity still held."
                            }
                          }
                        },
                        "cashflow_usd": {
                          "type": "object",
                          "additionalProperties": true,
                          "properties": {
                            "cost_of_quantity_sold": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Cost basis in USD for the quantity that has been sold."
                            },
                            "total_invested": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Total USD spent on buys."
                            },
                            "total_sold": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Total USD received from sells."
                            },
                            "current_value": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Current USD market value of the remaining position."
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
                              "description": "Realized profit and loss percentage relative to sold cost basis."
                            },
                            "unrealized_usd": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Unrealized mark-to-market profit and loss in USD."
                            },
                            "unrealized_percent": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Unrealized mark-to-market profit and loss percentage."
                            },
                            "total_usd": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Combined realized and unrealized profit and loss in USD."
                            },
                            "total_percent": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Combined realized and unrealized profit and loss percentage."
                            },
                            "avg_profit_per_trade_usd": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Average profit and loss per trade in USD."
                            }
                          }
                        },
                        "pricing": {
                          "type": "object",
                          "additionalProperties": true,
                          "properties": {
                            "current_price": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Current indexed token price in USD."
                            },
                            "avg_buy_cost": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Average buy cost per token in USD."
                            },
                            "avg_sell_cost": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Average sell price per token in USD."
                            }
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
                  "meta": {
                    "address": "4mwReoK1x668B6KuuSAbGm2tUQULSTHGgTpCa2jUMXtD",
                    "currency": "usd",
                    "holding_check": false,
                    "time": "2025-08-27T14:06:48.987054346Z"
                  },
                  "tokens": {
                    "So11111111111111111111111111111111111111112": {
                      "symbol": "SOL",
                      "decimals": 9,
                      "counts": {
                        "total_buy": 236570,
                        "total_sell": 236570,
                        "total_trade": 473140
                      },
                      "quantity": {
                        "total_bought_amount": 12092390.76837637,
                        "total_sold_amount": 0.00047313999999776897,
                        "holding": 0
                      },
                      "cashflow_usd": {
                        "cost_of_quantity_sold": 0.07608073802599198,
                        "total_invested": 1944451989.1810136,
                        "total_sold": 0.07602689546632857,
                        "current_value": 0
                      },
                      "pnl": {
                        "realized_profit_usd": -0.00005384255966340998,
                        "realized_profit_percent": -0.0707702909572399,
                        "unrealized_usd": 523529777.302561,
                        "unrealized_percent": 26.92428407777512,
                        "total_usd": 523529777.30250716,
                        "total_percent": 26.92428407671888,
                        "avg_profit_per_trade_usd": -2.275967352724774e-10
                      },
                      "pricing": {
                        "current_price": 204.09378209627866,
                        "avg_buy_cost": 160.79963229984938,
                        "avg_sell_cost": 160.6858339322126
                      }
                    },
                    "pumpsAkNcb1nZs89Uees3DyRzUGxjqThuzF3A8LVVfn": {
                      "symbol": "PUMP",
                      "decimals": 9,
                      "counts": {
                        "total_buy": 236570,
                        "total_sell": 236570,
                        "total_trade": 473140
                      },
                      "quantity": {
                        "total_bought_amount": 1.9012623099995465,
                        "total_sold_amount": 128820503932.7875,
                        "holding": 880839335.5814558
                      },
                      "cashflow_usd": {
                        "cost_of_quantity_sold": 5151221341.162621,
                        "total_invested": 0.07602689546632857,
                        "total_sold": 1944451989.1810136,
                        "current_value": 7.5417466875590655
                      },
                      "pnl": {
                        "realized_profit_usd": -0.04732872112474718,
                        "realized_profit_percent": -62.25260262759055,
                        "unrealized_usd": 0,
                        "unrealized_percent": 0,
                        "total_usd": -0.04732872112474718,
                        "total_percent": -62.25260262759055,
                        "avg_profit_per_trade_usd": -2.0006222735235735e-7
                      },
                      "pricing": {
                        "current_price": 8.562000336395786e-9,
                        "avg_buy_cost": 0.03998758880690519,
                        "avg_sell_cost": 0.015094274046587626
                      }
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
  "operationId": "get-wallet-v2-pnl",
  "x-mint": {
    "href": "/data-api/wallet-networth-pnl/get-wallet-v2-pnl"
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
