---
title: "Wallet - PnL (Per Wallet)"
description: "Retrieve all-time PnL and trading metrics for each specified wallet for a given token."
hidden: false
metadata:
  title: Birdeye Data API | Wallet - PnL (Per Wallet)
  description: >-
    Retrieve all-time PnL and trading metrics for each specified wallet for a
    given token.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /wallet/v2/pnl/multiple"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Per-wallet PnL for one token.</strong></p>
  <ul>
    <li>Maximum number of wallets per request is <code>50</code>.</li>
    <li><code>pnl_method</code> supports <code>netcash</code> and <code>wac</code> so per-wallet comparisons use the accounting method you expect.</li>
    <li><code>token_metadata</code> contains the token identity context for the request.</li>
    <li><code>data[&lt;wallet_address&gt;]</code> contains the PnL and trading metrics for each wallet.</li>
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
    <li>Compare how multiple wallets performed on one token.</li>
    <li>Rank a tracked wallet set by realized, unrealized, or total PnL for a single asset.</li>
    <li>Build cohort studies across whales, smart money, or treasury wallets for one token.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set the supported PnL chain in <code>x-chain</code>.</li>
    <li>Pass one <code>token_address</code>.</li>
    <li>Pass up to <code>50</code> wallet addresses in <code>wallets</code>.</li>
    <li>Set <code>pnl_method</code> when this comparison must line up with summary, detail, or internal accounting outputs.</li>
    <li>Use this endpoint when the token is fixed and the wallet cohort changes.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Deduplicate wallet addresses before sending the request.</li>
    <li>Pair this endpoint with token-level trade or holder data when explaining why one cohort outperformed another.</li>
    <li>Use the single-wallet endpoints when the wallet is fixed and the token set varies.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /wallet/v2/pnl/multiple

```json
{
  "x-metadata": {
    "released_at": 1756252800,
    "new": true
  },
  "tags": [
    "Wallet, Networth & PnL"
  ],
  "summary": "Wallet - PnL (Per Wallet)",
  "description": "Retrieve all-time PnL and trading metrics for each specified wallet for a given token.",
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
      "name": "token_address",
      "description": "The address of the token contract.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana": {
          "value": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
        },
        "ethereum": {
          "value": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce"
        },
        "solana_scaled_ui": {
          "value": "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh"
        }
      }
    },
    {
      "name": "wallets",
      "description": "List of wallet.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana": {
          "value": "4mwReoK1x668B6KuuSAbGm2tUQULSTHGgTpCa2jUMXtD,3aLF8VXyUbEPSFyqSoQrsq6TdgKXgLmwJprE2yTfdNA2"
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
      "description": "JSON object containing multiple wallet’s PnL per token",
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
                  "token_metadata": {
                    "type": "object",
                    "description": "Token identity shared by every wallet row in the response.",
                    "properties": {
                      "symbol": {
                        "type": "string",
                        "description": "Token symbol for the requested token."
                      },
                      "decimals": {
                        "type": "integer",
                        "description": "Number of token decimals for the requested token."
                      }
                    }
                  },
                  "data": {
                    "type": "object",
                    "description": "Map keyed by wallet address to per-wallet PnL metrics for the requested token.",
                    "additionalProperties": {
                      "type": "object",
                      "description": "PnL, position, and trading metrics for one wallet on the requested token.",
                      "properties": {
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
                  "token_metadata": {
                    "symbol": "PUMP",
                    "decimals": 9
                  },
                  "data": {
                    "3aLF8VXyUbEPSFyqSoQrsq6TdgKXgLmwJprE2yTfdNA2": {
                      "counts": {
                        "total_buy": 3,
                        "total_sell": 0,
                        "total_trade": 3
                      },
                      "quantity": {
                        "total_bought_amount": 29285.756489887,
                        "total_sold_amount": 0,
                        "holding": 880839335.5814558
                      },
                      "cashflow_usd": {
                        "cost_of_quantity_sold": 0,
                        "total_invested": 2.6329984012898864,
                        "total_sold": 0,
                        "current_value": 7.5417466875590655
                      },
                      "pnl": {
                        "realized_profit_usd": 0,
                        "realized_profit_percent": 0,
                        "unrealized_usd": -2.6327476566329686,
                        "unrealized_percent": -99.99047683975823,
                        "total_usd": -2.6327476566329686,
                        "total_percent": -99.99047683975824,
                        "avg_profit_per_trade_usd": 0
                      },
                      "pricing": {
                        "current_price": 8.562000336395786e-9,
                        "avg_buy_cost": 0.00008990713291627338,
                        "avg_sell_cost": null
                      }
                    },
                    "4mwReoK1x668B6KuuSAbGm2tUQULSTHGgTpCa2jUMXtD": {
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
  "operationId": "get-wallet-v2-pnl-multiple",
  "x-mint": {
    "href": "/data-api/wallet-networth-pnl/get-wallet-v2-pnl-multiple"
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
