---
title: "Trader - Gainers/Losers"
description: "Retrieve detailed information about top gainers/losers"
hidden: false
metadata:
  title: Birdeye Data API | Trader - Gainers/Losers
  description: Retrieve detailed information about top gainers/losers
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /trader/gainers-losers"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Top gaining and losing traders.</strong></p>
  <ul>
    <li><code>limit</code> supports up to <code>100</code>, and <code>offset</code> supports up to <code>10,000</code>.</li>
    <li>Use <code>type</code> to choose the ranking window and mode.</li>
    <li><code>sort_by</code> controls the ranking basis.</li>
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
  <p><strong>All chains ⛓️ ✨</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>25 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Rank top performing and worst performing traders over a selected window.</li>
    <li>Build gainers/losers trader boards and wallet discovery tools.</li>
    <li>Find unusual outperformers or underperformers for further wallet research.</li>
  </ul>
</Accordion>

  <Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Choose the ranking <code>type</code> and <code>sort_by</code>.</li>
    <li>Use <code>min_trade</code> and <code>max_trade</code> to filter by the number of trades.</li>
    <li>Use <code>min_volume_usd</code> and <code>max_volume_usd</code> to filter by trading volume.</li>
    <li>Use the realized, unrealized, or total PnL min/max filters to narrow the ranked traders by USD PnL.</li>
    <li>Page through the trader list with <code>offset</code> and <code>limit</code>.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Treat leaderboard position as a discovery signal, not a conclusion; follow up with wallet-level PnL and transaction review.</li>
    <li>Keep the selected time window visible so gains and losses are interpreted correctly.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /trader/gainers-losers

```json
{
  "tags": [
    "Wallet, Networth & PnL"
  ],
  "summary": "Trader - Gainers/Losers",
  "description": "Retrieve detailed information about top gainers/losers",
  "parameters": [
    {
      "name": "x-chain",
      "description": "A chain name listed in supported networks.",
      "in": "header",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "solana",
          "ethereum",
          "bsc",
          "base",
          "robinhood",
          "arc",
          "sui",
          "mantle",
          "hyperevm",
          "arbitrum",
          "avalanche",
          "optimism",
          "polygon",
          "zksync",
          "monad",
          "aptos",
          "fogo",
          "megaeth"
        ],
        "default": "solana"
      }
    },
    {
      "name": "type",
      "description": "Specify the type of top gainers/losers. Filter for records with type equal to the specified type.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "enum": [
          "yesterday",
          "today",
          "1W",
          "30d",
          "90d"
        ],
        "default": "1W"
      }
    },
    {
      "name": "sort_by",
      "description": "Specify the sort field. Use `trader_score` to rank traders by an overall 0–100 score based on profitability, consistency, trading quality, and activity relative to other eligible traders. Higher scores indicate stronger overall trading performance.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "enum": [
          "PnL",
          "realized_pnl",
          "unrealized_pnl",
          "trader_score"
        ],
        "default": "PnL"
      }
    },
    {
      "name": "min_trade",
      "description": "Minimum number of trades. Must be greater than or equal to 0.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "format": "uint64",
        "minimum": 0
      },
      "example": 10
    },
    {
      "name": "max_trade",
      "description": "Maximum number of trades. Must be greater than or equal to min_trade.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "format": "uint64",
        "minimum": 0
      },
      "example": 1000
    },
    {
      "name": "min_volume_usd",
      "description": "Minimum trading volume in USD. Must be greater than or equal to 0.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "format": "float",
        "minimum": 0
      },
      "example": 10000
    },
    {
      "name": "max_volume_usd",
      "description": "Maximum trading volume in USD. Must be greater than or equal to min_volume_usd.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "format": "float",
        "minimum": 0
      },
      "example": 1000000
    },
    {
      "name": "min_realized_pnl",
      "description": "Minimum realized PnL in USD. Must be greater than or equal to 1000. Defaults to 1000 when sort_by=realized_pnl and this parameter is not provided.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "format": "float"
      },
      "example": -10000
    },
    {
      "name": "max_realized_pnl",
      "description": "Maximum realized PnL in USD. Must be greater than or equal to min_realized_pnl.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "format": "float"
      },
      "example": 100000
    },
    {
      "name": "min_unrealized_pnl",
      "description": "Minimum unrealized PnL in USD. Must be greater than or equal to 1000. Defaults to 1000 when sort_by=unrealized_pnl and this parameter is not provided..",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "format": "float"
      },
      "example": -10000
    },
    {
      "name": "max_unrealized_pnl",
      "description": "Maximum unrealized PnL in USD. Must be greater than or equal to min_unrealized_pnl.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "format": "float"
      },
      "example": 100000
    },
    {
      "name": "min_pnl",
      "description": "Minimum PnL in USD. Must be greater than or equal to 1000. Defaults to 1000 when sort_by=PnL and this parameter is not provided.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "format": "float"
      },
      "example": -10000
    },
    {
      "name": "max_pnl",
      "description": "Maximum PnL in USD. Must be greater than or equal to min_pnl.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "format": "float"
      },
      "example": 100000
    },
    {
      "name": "offset",
      "description": "Pagination start position. offset + limit <= 10000",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 0,
        "minimum": 0,
        "maximum": 10000
      }
    },
    {
      "name": "limit",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 20,
        "minimum": 1,
        "maximum": 100
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing a list of top gainer loser traders",
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
                "description": "Indicates whether the request was successful."
              },
              "data": {
                "type": "object",
                "description": "Contains the trader gainer/loser result.",
                "required": [
                  "items"
                ],
                "properties": {
                  "items": {
                    "type": "array",
                    "description": "List of traders ranked by profit and loss (PnL).",
                    "items": {
                      "type": "object",
                      "required": [
                        "network",
                        "address",
                        "pnl",
                        "realized_pnl",
                        "unrealized_pnl",
                        "volume",
                        "trade_count"
                      ],
                      "properties": {
                        "network": {
                          "type": "string",
                          "description": "Blockchain network of the trader wallet, e.g. solana."
                        },
                        "address": {
                          "type": "string",
                          "description": "Wallet address of the trader."
                        },
                        "pnl": {
                          "type": "number",
                          "description": "Total profit and loss (PnL) of the trader in USD, including both realized and unrealized PnL."
                        },
                        "realized_pnl": {
                          "type": "number",
                          "description": "Realized profit and loss in USD from positions that have been sold or closed."
                        },
                        "unrealized_pnl": {
                          "type": "number",
                          "description": "Unrealized profit and loss in USD from tokens or positions currently held by the trader."
                        },
                        "volume": {
                          "type": "number",
                          "description": "Total trading volume in USD, including both buy and sell transactions."
                        },
                        "trade_count": {
                          "type": "integer",
                          "description": "Total number of trades executed by the trader."
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "examples": {
            "GainerList": {
              "value": {
                "success": true,
                "data": {
                  "items": [
                    {
                      "address": "1JKP3jcMcBzpp5SUSj9DFMFZGiJiXLyuRyGYcf6E97z",
                      "pnl": 67395290.55367899,
                      "realized_pnl": 761218.7928862367,
                      "unrealized_pnl": 66634071.76079275,
                      "volume": 7103127.149509426,
                      "trade_count": 83,
                      "network": "solana"
                    },
                    {
                      "address": "81m9aRw8RSAKchZ6pZo1L8m6DeJskq8hLZoTLU5gzoUc",
                      "pnl": 64080474.36939919,
                      "realized_pnl": -26045.200510758965,
                      "unrealized_pnl": 64106519.56990995,
                      "volume": 971495.1923311986,
                      "trade_count": 82,
                      "network": "solana"
                    }
                  ]
                }
              }
            },
            "LoserList": {
              "value": {
                "success": true,
                "data": {
                  "items": [
                    {
                      "address": "CRSGeS8KFhkZ2uSVnFjuqDsGEK57RuLXdXnbA7bEpogm",
                      "pnl": -124.26538655906916,
                      "realized_pnl": 42563749.511075355,
                      "unrealized_pnl": -42563873.776461914,
                      "volume": 85127871.81831038,
                      "trade_count": 12,
                      "network": "solana"
                    },
                    {
                      "address": "HCPZJMSHXHn3uv1mvWH3NqjjWdUVZnu8zQk1HprF9DTq",
                      "pnl": -27.387685663998127,
                      "realized_pnl": 22160831.154574737,
                      "unrealized_pnl": -22160858.5422604,
                      "volume": 44321734.129539385,
                      "trade_count": 14,
                      "network": "solana"
                    }
                  ]
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
  "operationId": "get-trader-gainers-losers",
  "x-mint": {
    "href": "/data-api/wallet-networth-pnl/get-trader-gainers-losers"
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
