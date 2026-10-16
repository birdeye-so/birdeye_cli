---
title: "Wallet - Token Balance (Beta)"
description: "Retrieve the balance of a token in a wallet."
hidden: false
metadata:
  title: Birdeye Data API | Wallet - Token Balance (Beta)
  description: Retrieve the balance of a token in a wallet.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /v1/wallet/token_balance"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Current balance of one token in one wallet.</strong></p>
  <ul>
    <li>Provide one wallet address and one token mint address.</li>
    <li>Response is a current balance snapshot, not a historical balance series.</li>
    <li><code>ui_amount_mode=scaled</code> applies Solana Token-2022 scaled UI amount when the token supports the scaled UI extension.</li>
  </ul>
  <p><strong>Reading the numbers.</strong> <code>balance</code> is the raw token balance in base units. <code>amount</code> is the decimal-adjusted balance, or the scaled UI amount when requested and supported. <code>price</code> is the latest token price in USD, and <code>value</code> is the wallet position value in USD.</p>
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
    <li>This endpoint consumes <code>20 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Show the exact balance of one token in one wallet.</li>
    <li>Build portfolio widgets, treasury views, or token-position popovers.</li>
    <li>Check current exposure before deeper PnL or transfer analysis.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Pass the wallet in <code>wallet</code> and the mint in <code>token_address</code>.</li>
    <li>Use <code>ui_amount_mode=raw</code> for raw-decimal output or <code>ui_amount_mode=scaled</code> for Token-2022 scaled UI amounts when supported.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use this endpoint for single-token checks; use <code>Wallet - Tokens Balance</code> when you already have a list of many mints.</li>
    <li>Keep <code>ui_amount_mode</code> consistent across token balance, holder, and transfer analysis for scaled UI tokens.</li>
    <li>Cache responses briefly if multiple views in the same screen need the same balance snapshot.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
    <li>Beta endpoint.</li>
    <li>Returns the current balance only, not balance history.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /v1/wallet/token_balance

```json
{
  "tags": [
    "Balance & Transfer"
  ],
  "summary": "Wallet - Token Balance (Beta)",
  "description": "Retrieve the balance of a token in a wallet.",
  "parameters": [
    {
      "name": "x-chain",
      "description": "A chain name listed in supported networks.",
      "in": "header",
      "required": true,
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
      "description": "The address of a wallet.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana": {
          "value": "Gt4RRcMg2mzEN9SDtSUjEjezC9b1nXjEGDQyEVbrc7Sk"
        },
        "ethereum": {
          "value": "0xE76aDA2ADE5585859789b3500DDE494e5479fb75"
        }
      }
    },
    {
      "name": "token_address",
      "description": "Token mint address.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "wsol": {
          "value": "So11111111111111111111111111111111111111112"
        },
        "solana": {
          "value": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
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
      "name": "ui_amount_mode",
      "description": "Indicate whether to use the scaled amount for scaled ui amount tokens. Only support solana",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "raw",
          "scaled"
        ],
        "default": "scaled"
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing the balance and USD value for a single token holding.",
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
          },
          "examples": {
            "SolanaScaledUIAmount": {
              "value": {
                "success": true,
                "data": {
                  "address": "So11111111111111111111111111111111111111112",
                  "decimals": 9,
                  "balance": 130718,
                  "uiAmount": 0.000130718,
                  "chainId": "solana-mainnet",
                  "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
                  "name": "Wrapped SOL",
                  "symbol": "SOL",
                  "priceUsd": 186.17611361160655,
                  "valueUsd": 0.024336569219081984,
                  "isScaledUiToken": false,
                  "multiplier": null
                }
              }
            },
            "Solana": {
              "value": {
                "success": true,
                "data": {
                  "address": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
                  "decimals": 6,
                  "balance": 1177780977972721,
                  "uiAmount": 1177780977.972721,
                  "chainId": "solana-mainnet",
                  "logoURI": "https://img.fotofolio.xyz/?w=30&h=30&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FEs9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB%2Flogo.svg",
                  "name": "USDT",
                  "symbol": "USDT",
                  "priceUsd": 0.9999915198446391,
                  "valueUsd": 1177770990.2070467
                }
              }
            },
            "EVM": {
              "value": {
                "success": true,
                "data": {
                  "address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                  "name": "Tether USD",
                  "symbol": "USDT",
                  "decimals": 6,
                  "balance": 94149341656019,
                  "uiAmount": 94149341.656019,
                  "chainId": "eth-mainnet",
                  "priceUsd": 0.9999915198446391,
                  "valueUsd": 94149341656019.2
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
  "operationId": "get-v1-wallet-token_balance",
  "x-mint": {
    "href": "/data-api/balance-transfer/get-v1-wallet-token-balance"
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
