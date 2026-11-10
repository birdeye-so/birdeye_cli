---
title: "Wallet - Portfolio (V2)"
description: "Retrieve the portfolio and total asset value of a given wallet address."
hidden: false
metadata:
  title: Birdeye Data API | Wallet - Portfolio (V2)
  description: Retrieve the portfolio and total asset value of a given wallet address.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /wallet/v2/current-net-worth"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Current Solana wallet portfolio and valuation.</strong></p>
  <ul>
    <li>This endpoint returns a current wallet portfolio snapshot with total asset value and paginated asset rows.</li>
    <li><code>limit</code> supports <code>1</code> to <code>100</code> items per request, and <code>offset</code> supports up to <code>10,000</code>.</li>
    <li><code>filter_value</code> can be used to hide small positions below a minimum USD threshold.</li>
    <li><code>flags</code> can include additional portfolio behaviors such as <code>include_low_liquidity</code>.</li>
    <li><code>sort_by</code> is currently value-oriented and <code>sort_type</code> supports ascending or descending order.</li>
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
    <li>This endpoint consumes <code>20 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Show a wallet's current portfolio value and holdings breakdown.</li>
    <li>Power wallet overview pages, treasury dashboards, and portfolio snapshots.</li>
    <li>Filter out dust positions and focus on the holdings that matter.</li>
    <li>Rank or inspect one wallet's top assets before drilling into per-token PnL.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Pass the wallet address in <code>wallet</code>.</li>
    <li>Use <code>filter_value</code> to suppress tiny positions.</li>
    <li>Page through holdings with <code>offset</code> and <code>limit</code>.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use this as the primary current-portfolio endpoint instead of stitching holdings and prices manually.</li>
    <li>Apply <code>filter_value</code> in UI views where dust assets would otherwise drown out signal.</li>
    <li>Cache per-wallet snapshots for a short interval rather than polling every interaction.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /wallet/v2/current-net-worth

```json
{
  "x-metadata": {
    "released_at": 1752105600,
    "new": true
  },
  "tags": [
    "Wallet, Networth & PnL"
  ],
  "summary": "Wallet - Portfolio (V2)",
  "description": "Retrieve the portfolio and total asset value of a given wallet address.",
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
      "name": "filter_value",
      "description": "Minimum value threshold; returns tokens with value ≥ this (optional, no default).",
      "in": "query",
      "schema": {
        "type": "number"
      },
      "example": "12.5"
    },
    {
      "name": "sort_by",
      "description": "Specify the sort field.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "value"
        ],
        "default": "value"
      }
    },
    {
      "name": "flags",
      "in": "query",
      "description": "Modifiers that change result behavior (default: empty; excludes low-liquidity tokens < $100, use include_low_liquidity to include them).",
      "required": false,
      "style": "form",
      "explode": true,
      "schema": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": [
            "include_low_liquidity"
          ]
        },
        "example": [
          "include_low_liquidity"
        ]
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
      "description": "JSON object containing portfolio of an address",
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
                    "description": "Wallet address whose net worth was calculated."
                  },
                  "currency": {
                    "type": "string",
                    "description": "Display currency used for valuation."
                  },
                  "total_value": {
                    "type": [
                      "number",
                      "string"
                    ],
                    "description": "Current total net worth in the selected currency."
                  },
                  "current_timestamp": {
                    "type": "string",
                    "description": "Timestamp when the valuation snapshot was computed."
                  },
                  "items": {
                    "type": "array",
                    "description": "Assets contributing to the current net-worth snapshot.",
                    "items": {
                      "type": "object",
                      "additionalProperties": true,
                      "properties": {
                        "address": {
                          "type": "string",
                          "description": "Token mint or contract address."
                        },
                        "decimals": {
                          "type": "integer",
                          "description": "Number of token decimals."
                        },
                        "balance": {
                          "type": [
                            "number",
                            "string"
                          ],
                          "description": "Raw token balance before decimal scaling."
                        },
                        "uiAmount": {
                          "type": "number",
                          "description": "Human-readable token amount after decimals are applied."
                        },
                        "chainId": {
                          "type": "string",
                          "description": "Network identifier for the token balance."
                        },
                        "network": {
                          "type": "string",
                          "description": "Network name when the response uses `network` instead of `chainId`."
                        },
                        "name": {
                          "type": "string",
                          "description": "Token display name."
                        },
                        "symbol": {
                          "type": "string",
                          "description": "Token symbol."
                        },
                        "icon": {
                          "type": "string",
                          "description": "Icon URL for the token when returned."
                        },
                        "logoURI": {
                          "type": "string",
                          "description": "Logo URL for the token when using camelCase fields."
                        },
                        "logo_uri": {
                          "type": "string",
                          "description": "Logo URL for the token when using snake_case fields."
                        },
                        "priceUsd": {
                          "type": "number",
                          "description": "Latest token price in USD."
                        },
                        "price": {
                          "type": "number",
                          "description": "Latest token price in USD when the response uses `price`."
                        },
                        "valueUsd": {
                          "type": "number",
                          "description": "Current USD value of the token balance."
                        },
                        "value": {
                          "type": [
                            "number",
                            "string"
                          ],
                          "description": "Current USD value of the token balance when the response uses `value`."
                        },
                        "amount": {
                          "type": "number",
                          "description": "Human-readable token amount when the response uses `amount`."
                        },
                        "isScaledUiToken": {
                          "type": "boolean",
                          "description": "Whether the token uses Solana Token-2022 scaled UI amounts."
                        },
                        "multiplier": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Scaled UI multiplier for Token-2022 assets when available."
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
                  "wallet_address": "8X35rQUK2u9hfn8rMPwwr6ZSEUhbmfDPEapp589XyoM1",
                  "currency": "usd",
                  "total_value": "0.010349446772590722",
                  "current_timestamp": "2025-05-19T04:47:19.414327725Z",
                  "items": [
                    {
                      "address": "cCpv5Z3nqKbKohYqgY7rxFebjMjvU7SBhwgYbCipump",
                      "decimals": 6,
                      "price": 0.00014999198221145974,
                      "balance": "69000000",
                      "amount": 69,
                      "network": "solana",
                      "name": "Smellow",
                      "symbol": "SMLO",
                      "logo_uri": "https://pump.mypinata.cloud/ipfs/QmcCjKS4MMeji11PqnNhqDSXd6gD4iGj1nC6zjyfaekuQZ",
                      "value": "0.010349446772590722"
                    }
                  ]
                },
                "pagination": {
                  "limit": 100,
                  "offset": 0,
                  "total": 1
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
  "operationId": "get-wallet-v2-current-net-worth",
  "x-mint": {
    "href": "/data-api/wallet-networth-pnl/get-wallet-v2-current-net-worth"
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
