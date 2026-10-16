---
title: "Wallet Portfolio (Beta)"
description: "Retrieve the portfolio of a wallet."
hidden: false
metadata:
  title: Birdeye Data API | Wallet Portfolio (Beta)
  description: Retrieve the portfolio of a wallet.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /v1/wallet/token_list"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Beta wallet holdings inventory.</strong></p>
  <ul>
    <li>This endpoint returns the current portfolio inventory for one wallet.</li>
    <li><code>ui_amount_mode</code> controls Solana Token-2022 scaled amounts; other chains are normalized to <code>scaled</code>.</li>
    <li>This is a beta wallet endpoint. Prefer V2 net-worth endpoints when you need maintained portfolio valuation flows.</li>
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
  <p><strong>Solana</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>50 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>List a wallet's current token holdings for portfolio tables and account explorers.</li>
    <li>Build wallet inventory screens before layering in PnL or net-worth analysis.</li>
    <li>Quickly inspect which tokens a wallet currently holds.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Pass the wallet address in <code>wallet</code>.</li>
    <li>Use <code>ui_amount_mode</code> when you need raw versus scaled token amounts on Solana.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Treat this as an inventory endpoint, not a valuation endpoint; combine it with price or PnL data if needed.</li>
    <li>Prefer V2 portfolio APIs for production-facing wallet value screens.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Beta endpoint.</li>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /v1/wallet/token_list

```json
{
  "tags": [
    "Wallet, Networth & PnL"
  ],
  "summary": "Wallet Portfolio (Beta)",
  "description": "Retrieve the portfolio of a wallet.",
  "deprecated": true,
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
      "description": "JSON object containing a wallet's token holdings, with one row per token and optional total USD value.",
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
                  "wallet": {
                    "type": "string",
                    "description": "Wallet address when echoed by the endpoint."
                  },
                  "totalUsd": {
                    "type": "number",
                    "description": "Total USD value of all returned token balances."
                  },
                  "items": {
                    "type": "array",
                    "description": "Token balances currently held by the wallet.",
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
              }
            }
          },
          "examples": {
            "SolanaScaledUIAmount": {
              "value": {
                "success": true,
                "data": {
                  "items": [
                    {
                      "address": "So11111111111111111111111111111111111111112",
                      "decimals": 9,
                      "balance": 130718,
                      "uiAmount": 0.000130718,
                      "chainId": "solana",
                      "name": "Wrapped SOL",
                      "symbol": "SOL",
                      "icon": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
                      "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
                      "priceUsd": 186.35315787784225,
                      "valueUsd": 0.02435971209147578,
                      "isScaledUiToken": false,
                      "multiplier": null
                    },
                    {
                      "address": "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
                      "decimals": 9,
                      "balance": 20280,
                      "uiAmount": 0.00002028,
                      "chainId": "solana",
                      "name": "Jito Staked SOL",
                      "symbol": "JitoSOL",
                      "icon": "https://storage.googleapis.com/token-metadata/JitoSOL-256.png",
                      "logoURI": "https://storage.googleapis.com/token-metadata/JitoSOL-256.png",
                      "priceUsd": 227.7398265331134,
                      "valueUsd": 0.0046185636820915395,
                      "isScaledUiToken": false,
                      "multiplier": null
                    },
                    {
                      "address": "J3NKxxXZcnNiMjKw9hYb2K4LUxgwB6t1FtPtQVsv3KFr",
                      "decimals": 8,
                      "balance": 3159,
                      "uiAmount": 0.00003159,
                      "chainId": "solana",
                      "name": "SPX6900 (Wormhole)",
                      "symbol": "SPX",
                      "icon": "https://i.postimg.cc/w3Yq0dHf/2023-12-21-17-19-37.jpg",
                      "logoURI": "https://i.postimg.cc/w3Yq0dHf/2023-12-21-17-19-37.jpg",
                      "priceUsd": 1.9727875449629464,
                      "valueUsd": 0.00006232035854537948,
                      "isScaledUiToken": false,
                      "multiplier": null
                    }
                  ]
                }
              }
            },
            "Solana": {
              "value": {
                "success": true,
                "data": {
                  "wallet": "Gt4RRcMg2mzEN9SDtSUjEjezC9b1nXjEGDQyEVbrc7Sk",
                  "totalUsd": 47.28979693780992,
                  "items": [
                    {
                      "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                      "decimals": 6,
                      "balance": 47289918,
                      "uiAmount": 47.289918,
                      "chainId": "solana",
                      "name": "USD Coin",
                      "symbol": "USDC",
                      "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
                      "priceUsd": 0.99999744,
                      "valueUsd": 47.28979693780992
                    }
                  ]
                }
              }
            },
            "EVM": {
              "value": {
                "success": true,
                "data": {
                  "wallet": "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621",
                  "totalUsd": 177417911.42802328,
                  "items": [
                    {
                      "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                      "name": "Tether USD",
                      "symbol": "USDT",
                      "decimals": 6,
                      "balance": "72938605011215",
                      "uiAmount": 72938605.011215,
                      "chainId": "ethereum",
                      "logoURI": "https://assets.coingecko.com/coins/images/325/small/Tether.png?1668148663",
                      "priceUsd": 1.0000259715445037,
                      "valueUsd": 72940499.33944109
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
  "operationId": "get-v1-wallet-token_list",
  "x-mint": {
    "href": "/data-api/wallet-networth-pnl/get-v1-wallet-token-list"
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
