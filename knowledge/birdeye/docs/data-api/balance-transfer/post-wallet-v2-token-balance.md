---
title: "Wallet - Tokens Balance"
description: "Retrieve the balances of a list of tokens in a wallet."
hidden: false
metadata:
  title: Birdeye Data API | Wallet - Tokens Balance
  description: Retrieve the balances of a list of tokens in a wallet.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json POST /wallet/v2/token-balance"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Batch token-balance lookup for one Solana wallet.</strong></p>
  <ul>
    <li>Maximum request size is <code>500</code> token addresses.</li>
    <li>Response is ordered by the submitted token list and returns one balance snapshot per requested token.</li>
    <li><code>ui_amount_mode=scaled</code> applies Solana Token-2022 scaled UI amount when the token supports the scaled UI extension.</li>
  </ul>
  <p><strong>Reading the numbers.</strong> <code>balance</code> is the raw balance in base units. <code>amount</code> is the decimal-adjusted balance, or scaled UI amount when requested and supported. <code>price</code> is the latest token price in USD, and <code>value</code> is the wallet holding value in USD.</p>
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
  <p><strong>Solana</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>Batch CU is calculated as <code>ceil(10 * wallet_count^0.8)</code>.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Load many token balances for one wallet in one request.</li>
    <li>Power portfolio pages, treasury views, and token-watch grids.</li>
    <li>Join wallet balances with prices for fast position-value displays.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Send the wallet address and up to <code>50</code> token mints in the POST body.</li>
    <li>Use <code>ui_amount_mode=raw</code> for raw-decimal output or <code>ui_amount_mode=scaled</code> for Token-2022 scaled UI amounts when supported.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Deduplicate token mints before sending the batch.</li>
    <li>Use this batch endpoint for known token sets; use broader wallet portfolio endpoints when discovery matters more than exact token selection.</li>
    <li>Reuse one batch response across multiple UI components during the same refresh cycle.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
    <li>Maximum <code>50</code> tokens per request.</li>
  </ul>
</Accordion>

## Resolved API contract

POST /wallet/v2/token-balance

```json
{
  "x-metadata": {
    "released_at": 1756368000,
    "new": true
  },
  "tags": [
    "Balance & Transfer"
  ],
  "summary": "Wallet - Tokens Balance",
  "description": "Retrieve the balances of a list of tokens in a wallet.",
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
    }
  ],
  "requestBody": {
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "required": [
            "wallets",
            "token_address"
          ],
          "type": "object",
          "properties": {
            "wallet": {
              "type": "string",
              "example": "GbrNi5tsbViArzsiE2WX94rMCCGz87w9cVVWVqcPEyx6"
            },
            "token_addresses": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "example": [
                "8i42ZVsjEGVhZ6spj4Z5aB36Msh9Vq4nnBaw5kq4pump"
              ]
            }
          }
        },
        "examples": {
          "solana": {
            "value": {
              "wallet": "GbrNi5tsbViArzsiE2WX94rMCCGz87w9cVVWVqcPEyx6",
              "token_addresses": [
                "8i42ZVsjEGVhZ6spj4Z5aB36Msh9Vq4nnBaw5kq4pump"
              ]
            }
          }
        }
      }
    }
  },
  "responses": {
    "200": {
      "description": "JSON object containing a wallet token balance",
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
                "description": "Token balances returned for the requested wallet and token filter.",
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
          "examples": {
            "Solana": {
              "value": {
                "success": true,
                "data": [
                  {
                    "address": "8i42ZVsjEGVhZ6spj4Z5aB36Msh9Vq4nnBaw5kq4pump",
                    "decimals": 9,
                    "price": 0.0020303701828560256,
                    "balance": "4998929789571623824",
                    "amount": 4998929789.571624,
                    "network": "solana",
                    "name": "BIGIFTRUE",
                    "symbol": "BIGIFTRUE",
                    "logo_uri": "https://ipfs.io/ipfs/bafkreihgbhs4sumfhvdcquud7mvggjjbidfuoisytxqnpafrx6ukrh4hlm",
                    "value": "10149677.99093697"
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
  "operationId": "post-wallet-v2-token-balance",
  "x-mint": {
    "href": "/data-api/balance-transfer/post-wallet-v2-token-balance"
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
