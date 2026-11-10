---
title: "Wallet - Net Worth Details"
description: "Retrieve a wallet's total asset value and detailed asset breakdown at a specific point in the past"
hidden: false
metadata:
  title: Birdeye Data API | Wallet - Net Worth Details
  description: >-
    Retrieve a wallet's total asset value and detailed asset breakdown at a
    specific point in the past
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /wallet/v2/net-worth-details"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Historical Solana net worth breakdown at one checkpoint.</strong></p>
  <ul>
    <li><code>limit</code> supports <code>1</code> to <code>100</code> items per request, and <code>offset</code> supports up to <code>10,000</code>.</li>
    <li><code>type</code> accepts <code>1h</code> and <code>1d</code>.</li>
    <li><code>time</code> must use <code>YYYY-MM-DD HH:mm:ss</code> in UTC, must not be in the future, and when <code>type=1h</code> it must be within the last 7 days.</li>
    <li>Response fields:</li>
    <li><code>balance</code>: raw on-chain balance before decimal adjustment.</li>
    <li><code>price</code>: token price in USD at the selected checkpoint.</li>
    <li><code>value</code>: token balance multiplied by price after decimal adjustment.</li>
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
  <p><strong>Solana</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>40 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Reconstruct a wallet's asset composition at a past checkpoint.</li>
    <li>Explain historical net-worth moves by showing which holdings mattered at that time.</li>
    <li>Support portfolio forensics, treasury reporting, and audit-style wallet review.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Pass the wallet address in <code>wallet</code>.</li>
    <li>Choose <code>time</code> and <code>type</code> for the checkpoint resolution.</li>
    <li>Page through large historical holdings sets with <code>offset</code> and <code>limit</code>.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use this after the net-worth chart identifies an interesting timestamp.</li>
    <li>Keep checkpoint times consistent across related analyses so holdings, price, and PnL line up.</li>
    <li>Use <code>1d</code> for broad historical review and <code>1h</code> only for recent deep dives.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
    <li><code>type=1h</code> is limited to the last 7 days.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /wallet/v2/net-worth-details

```json
{
  "x-metadata": {
    "released_at": 1752105600,
    "new": true
  },
  "tags": [
    "Wallet, Networth & PnL"
  ],
  "summary": "Wallet - Net Worth Details",
  "description": "Retrieve a wallet's total asset value and detailed asset breakdown at a specific point in the past",
  "parameters": [
    {
      "name": "x-chain",
      "description": "Solana network only.",
      "in": "header",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "solana"
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
      "name": "time",
      "description": "Time get net worth. Default is current time.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string"
      },
      "example": "2025-07-30 02:00:00"
    },
    {
      "name": "type",
      "in": "query",
      "required": false,
      "description": "Time granularity used to group the returned net worth data. Use `1d` for daily data with full historical coverage, or `1h` for hourly data limited to the last 7 days.",
      "schema": {
        "type": "string",
        "enum": [
          "1h",
          "1d"
        ],
        "default": "1d"
      }
    },
    {
      "name": "sort_type",
      "description": "Specify the sort order.",
      "in": "query",
      "required": true,
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
      "name": "limit",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 20,
        "minimum": 1,
        "maximum": 100
      }
    },
    {
      "name": "offset",
      "description": "Make sure offset <= 10000",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 0,
        "minimum": 0,
        "maximum": 10000
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing list assets of an address at a specific time",
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
                  "wallet_address": {
                    "type": "string",
                    "description": "Wallet address whose detail snapshot was requested."
                  },
                  "currency": {
                    "type": "string",
                    "description": "Display currency used for valuation."
                  },
                  "net_worth": {
                    "type": "number",
                    "description": "Net worth at the resolved timestamp."
                  },
                  "requested_timestamp": {
                    "type": "string",
                    "description": "Timestamp originally requested by the caller."
                  },
                  "resolved_timestamp": {
                    "type": "string",
                    "description": "Timestamp actually used after alignment to an available snapshot."
                  },
                  "net_assets": {
                    "type": "array",
                    "description": "Asset rows contributing to the net-worth snapshot.",
                    "items": {
                      "type": "object",
                      "properties": {
                        "symbol": {
                          "type": "string",
                          "description": "Token symbol."
                        },
                        "token_address": {
                          "type": "string",
                          "description": "Token mint or contract address."
                        },
                        "decimal": {
                          "type": "integer",
                          "description": "Number of token decimals."
                        },
                        "balance": {
                          "type": [
                            "number",
                            "string"
                          ],
                          "description": "Raw or human-readable asset balance, depending on the endpoint serializer."
                        },
                        "price": {
                          "type": [
                            "number",
                            "string"
                          ],
                          "description": "Indexed token price in the selected currency."
                        },
                        "value": {
                          "type": [
                            "number",
                            "string"
                          ],
                          "description": "Asset valuation in the selected currency."
                        }
                      }
                    }
                  }
                }
              },
              "pagination": {
                "type": "object",
                "properties": {
                  "limit": {
                    "type": "integer",
                    "description": "Requested page size."
                  },
                  "offset": {
                    "type": "integer",
                    "description": "Requested pagination offset."
                  },
                  "total": {
                    "type": "integer",
                    "description": "Total number of available asset rows."
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
                  "wallet_address": "HV1KXxWFaSeriyFvXyx48FqG9BoFbfinB8njCJonqP7K",
                  "currency": "usd",
                  "net_worth": 11839478.53162622,
                  "requested_timestamp": "2025-07-31T04:50:06.303258803Z",
                  "resolved_timestamp": "2025-07-31T04:50:06.475623209Z",
                  "net_assets": [
                    {
                      "symbol": "Salute",
                      "token_address": "49aR46Zgvh3w7cLnM3nZRC4DSVV2A25tYV1fVxYbjtb4",
                      "decimal": 4,
                      "balance": "50000000000",
                      "price": 1.931249899999106,
                      "value": 9656249.49999553
                    },
                    {
                      "symbol": "SOL",
                      "token_address": "So11111111111111111111111111111111111111112",
                      "decimal": 9,
                      "balance": "7316581866484",
                      "price": 181.4958586895311,
                      "value": 1327929.3085297658
                    }
                  ]
                },
                "pagination": {
                  "limit": 100,
                  "offset": 0,
                  "total": 2
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
  "operationId": "get-wallet-v2-net-worth-details",
  "x-mint": {
    "href": "/data-api/wallet-networth-pnl/get-wallet-v2-net-worth-details"
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
