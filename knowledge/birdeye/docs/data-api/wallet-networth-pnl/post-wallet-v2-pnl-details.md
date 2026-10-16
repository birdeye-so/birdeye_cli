---
title: "Wallet - PnL Details"
description: "Retrieve a wallet's overall PnL and trading statistics, along with aggregated PnL and trading details for each token."
hidden: false
metadata:
  title: Birdeye Data API | Wallet - PnL Details
  description: >-
    Retrieve a wallet's overall PnL and trading statistics, along with
    aggregated PnL and trading details for each token.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json POST /wallet/v2/pnl/details"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Detailed wallet PnL breakdown.</strong></p>
  <ul>
    <li>Maximum number of tokens per request body is <code>100</code>.</li>
    <li>Body parameters include <code>wallet</code>, optional <code>token_addresses</code>, <code>duration</code>, <code>position_scope</code>, <code>pnl_method</code>, <code>sort_by</code>, <code>sort_type</code>, <code>offset</code>, and <code>limit</code>.</li>
    <li><code>limit</code> supports <code>1</code> to <code>100</code>, and <code>offset</code> supports up to <code>10,000</code>.</li>
    <li>Use this endpoint when you need wallet-level summary plus token-level breakdown in one request.</li>
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
    <li>This endpoint consumes <code>30 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Drill from wallet-level PnL into token-level contributors in one call.</li>
    <li>Sort and page through the assets that drove gains or losses.</li>
    <li>Support research views that need both summary and breakdown without multiple round trips.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set the supported PnL chain in <code>x-chain</code>.</li>
    <li>Send the wallet address in the POST body.</li>
    <li>Optionally restrict the breakdown with <code>token_addresses</code>.</li>
    <li>Set <code>pnl_method=netcash</code> or <code>pnl_method=wac</code> when you need to lock the accounting method used in the result.</li>
    <li>Use <code>offset</code>, <code>limit</code>, <code>sort_by</code>, and <code>sort_type</code> to control the returned token rows.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Start with the summary endpoint when you need only headline metrics, then switch to details when the wallet warrants investigation.</li>
    <li>Restrict <code>token_addresses</code> for focused investigations instead of always requesting a full breakdown.</li>
    <li>Keep sort order stable across pagination so result slices are reproducible.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

POST /wallet/v2/pnl/details

```json
{
  "x-metadata": {
    "released_at": 1762214400,
    "new": true
  },
  "tags": [
    "Wallet, Networth & PnL"
  ],
  "summary": "Wallet - PnL Details",
  "description": "Retrieve a wallet's overall PnL and trading statistics, along with aggregated PnL and trading details for each token.",
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
    }
  ],
  "requestBody": {
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "required": [
            "wallet"
          ],
          "type": "object",
          "properties": {
            "wallet": {
              "type": "string",
              "example": "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"
            },
            "token_addresses": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "example": [
                "2VKDTnMF9hmDfCG4i7yPHsfYzYCRhLwQcgUQPxvvYKnV"
              ]
            },
            "duration": {
              "type": "string",
              "enum": [
                "all",
                "90d",
                "30d",
                "7d",
                "24h"
              ],
              "default": "all"
            },
            "position_scope": {
              "type": "string",
              "description": "Calculation mode for PnL. duration_only calculates PnL only for each selected time bucket. cumulative calculates realized_pnl cumulatively from the start time, while unrealized_pnl is based on the all-time open position. Defaults to duration_only.",
              "enum": [
                "duration_only",
                "cumulative"
              ],
              "default": "duration_only"
            },
            "pnl_method": {
              "type": "string",
              "description": "PNL calculation method. `wac` (Weighted Average Cost): calculates PNL for each sell against the average cost of the position held at the time of the sell. Buys only re-average the cost of the remaining inventory, and previously realized sell PNL is not affected by later trades. `netcash` (Net Cash): calculates PNL across the full trade history using the spread between cumulative average sell price and cumulative average buy price. The buy average includes all buys and is not reduced by sells, so later buys can change the reported PNL.",
              "required": false,
              "schema": {
                "type": "string",
                "enum": [
                  "wac",
                  "net_cash"
                ],
                "default": "net_cash"
              }
            },
            "sort_type": {
              "type": "string",
              "enum": [
                "asc",
                "desc"
              ],
              "default": "desc"
            },
            "sort_by": {
              "type": "string",
              "enum": [
                "last_trade"
              ],
              "default": "last_trade"
            },
            "limit": {
              "type": "integer",
              "minimum": 1,
              "maximum": 100,
              "default": 10
            },
            "offset": {
              "type": "integer",
              "minimum": 0,
              "maximum": 10000,
              "default": 0
            }
          }
        },
        "examples": {
          "solana": {
            "value": {
              "wallet": "123hJZ8FGVhesDUrv5dCgorewd7KMqBkFhoGdyZNp62D",
              "sort_by": "value",
              "duration": "7d",
              "sort_type": "asc",
              "limit": 2,
              "token_addresses": [
                "2VKDTnMF9hmDfCG4i7yPHsfYzYCRhLwQcgUQPxvvYKnV"
              ]
            }
          }
        }
      }
    }
  },
  "responses": {
    "200": {
      "description": "JSON object containing a wallet",
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
                    "type": "array",
                    "description": "Per-token PnL rows.",
                    "items": {
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
                  },
                  "summary": {
                    "type": "object",
                    "additionalProperties": true,
                    "description": "Aggregated PnL summary across every token included in the request scope.",
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
                "data": {
                  "meta": {
                    "address": "123hJZ8FGVhesDUrv5dCgorewd7KMqBkFhoGdyZNp62D",
                    "currency": "usd",
                    "holding_check": false,
                    "time": "2025-10-31T08:38:25.295882105Z"
                  },
                  "tokens": [
                    {
                      "symbol": "G7",
                      "decimals": 6,
                      "address": "2VKDTnMF9hmDfCG4i7yPHsfYzYCRhLwQcgUQPxvvYKnV",
                      "counts": {
                        "total_buy": 1,
                        "total_sell": 1,
                        "total_trade": 2
                      },
                      "quantity": {
                        "total_bought_amount": 6152601.258849,
                        "total_sold_amount": 6152601.258849,
                        "holding": 0
                      },
                      "cashflow_usd": {
                        "cost_of_quantity_sold": 9.7233729560565,
                        "total_invested": 9.7233729560565,
                        "total_sold": 9.85555342050984,
                        "current_value": 0
                      },
                      "pnl": {
                        "realized_profit_usd": 0.13218046445334128,
                        "realized_profit_percent": 1.3594095901773329,
                        "unrealized_usd": 0,
                        "unrealized_percent": 0,
                        "total_usd": 0.13218046445334128,
                        "total_percent": 1.3594095901773329,
                        "avg_profit_per_trade_usd": 0.13218046445334128
                      },
                      "pricing": {
                        "current_price": null,
                        "avg_buy_cost": 0.0000015803678065552884,
                        "avg_sell_cost": 0.0000016018514780776761
                      }
                    }
                  ],
                  "summary": {
                    "unique_tokens": 7,
                    "counts": {
                      "total_buy": 19,
                      "total_sell": 19,
                      "total_trade": 38,
                      "total_win": 4,
                      "total_loss": 1,
                      "win_rate": 0.5714285714285714
                    },
                    "cashflow_usd": {
                      "total_invested": 424.183016567611,
                      "total_sold": 555.080692928933,
                      "current_value": 392.84271337031083
                    },
                    "pnl": {
                      "realized_profit_usd": 130.8976763613221,
                      "realized_profit_percent": 30.858773512554855,
                      "unrealized_usd": 0,
                      "total_usd": 130.8976763613221,
                      "avg_profit_per_trade_usd": 3.444675693719003
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
  "operationId": "post-wallet-v2-pnl-details",
  "x-mint": {
    "href": "/data-api/wallet-networth-pnl/post-wallet-v2-pnl-details"
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
