---
title: "Wallet - Transaction History (Beta)"
description: "Retrieve the transaction history of a wallet."
hidden: false
metadata:
  title: Birdeye Data API | Wallet - Transaction History (Beta)
  description: Retrieve the transaction history of a wallet.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /v1/wallet/tx_list"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Beta wallet transaction history.</strong></p>
  <ul>
    <li>This endpoint returns transaction history for one wallet.</li>
    <li>It is useful for quick wallet-history inspection, but it is still a beta endpoint.</li>
    <li><code>ui_amount_mode</code> controls Solana Token-2022 scaled amounts; other chains are normalized to <code>scaled</code>.</li>
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
    <li>Review a wallet's recent transaction history in a lightweight explorer flow.</li>
    <li>Investigate funding, movement, and activity patterns around one wallet.</li>
    <li>Support beta wallet-history views before deeper transfer or balance-change analysis.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Pass the wallet address in <code>wallet</code>.</li>
    <li>Use the endpoint's pagination parameters to step backward through history.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Cache wallet-history responses because they can be expensive to recompute repeatedly.</li>
    <li>Use this endpoint for inspection, then move to newer transfer/balance-change endpoints for structured analysis.</li>
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

GET /v1/wallet/tx_list

```json
{
  "tags": [
    "Wallet, Networth & PnL"
  ],
  "summary": "Wallet - Transaction History (Beta)",
  "description": "Retrieve the transaction history of a wallet.",
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
      "name": "limit",
      "description": "Limit the number of records returned.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 100,
        "minimum": 1,
        "maximum": 100
      }
    },
    {
      "name": "before",
      "description": "A transaction hash to traverse starting from. Only works with Solana.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string"
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
      "description": "JSON object containing the wallet's recent transaction history across supported chains.",
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
                "description": "Transactions grouped by chain family or source bucket.",
                "additionalProperties": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "additionalProperties": true,
                    "properties": {
                      "txHash": {
                        "type": "string",
                        "description": "Transaction signature or hash."
                      },
                      "blockNumber": {
                        "type": [
                          "integer",
                          "string"
                        ],
                        "description": "Block or slot number."
                      },
                      "blockTime": {
                        "type": [
                          "integer",
                          "string"
                        ],
                        "description": "Block time or timestamp for the transaction."
                      },
                      "status": {
                        "type": "boolean",
                        "description": "Whether the transaction succeeded."
                      },
                      "from": {
                        "type": "string",
                        "description": "Sender wallet or account address."
                      },
                      "to": {
                        "type": "string",
                        "description": "Recipient wallet or account address."
                      },
                      "fee": {
                        "type": [
                          "number",
                          "string"
                        ],
                        "description": "Transaction fee paid on-chain."
                      },
                      "mainAction": {
                        "type": "string",
                        "description": "Primary interpreted action of the transaction."
                      },
                      "balanceChange": {
                        "type": "array",
                        "description": "Balance changes associated with the transaction.",
                        "items": {
                          "type": "object",
                          "additionalProperties": true
                        }
                      },
                      "contractLabel": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Optional human-readable contract or protocol label."
                      },
                      "tokenTransfers": {
                        "type": "array",
                        "description": "Token transfer events parsed from the transaction.",
                        "items": {
                          "type": "object",
                          "additionalProperties": true
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
                  "solana": [
                    {
                      "txHash": "3MvG4bVz7HF76hWSGeGtcSkVAtDnLA5PmUVC97S22GPpGGvxbv7UqKEh91MVsAHJ35zSw4RkW9NBiHLfZbJm8xFn",
                      "blockNumber": 328889251,
                      "blockTime": "2025-03-24T15:06:14+00:00",
                      "status": true,
                      "from": "Gt4RRcMg2mzEN9SDtSUjEjezC9b1nXjEGDQyEVbrc7Sk",
                      "to": "11111111111111111111111111111111",
                      "fee": 80000,
                      "mainAction": "send",
                      "balanceChange": [
                        {
                          "amount": -165604794,
                          "symbol": "SOL",
                          "name": "Wrapped SOL",
                          "decimals": 9,
                          "address": "So11111111111111111111111111111111111111112",
                          "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
                          "isScaledUiToken": false,
                          "multiplier": null
                        }
                      ],
                      "contractLabel": {
                        "address": "11111111111111111111111111111111",
                        "name": "System Program",
                        "metadata": {
                          "icon": ""
                        }
                      },
                      "tokenTransfers": [
                        {
                          "fromTokenAccount": "Gt4RRcMg2mzEN9SDtSUjEjezC9b1nXjEGDQyEVbrc7Sk",
                          "toTokenAccount": "2YiHgAV2SaJYkLy63N3TMLZHKwkPKhWd3EUzAMZuay4T",
                          "fromUserAccount": "Gt4RRcMg2mzEN9SDtSUjEjezC9b1nXjEGDQyEVbrc7Sk",
                          "toUserAccount": "2YiHgAV2SaJYkLy63N3TMLZHKwkPKhWd3EUzAMZuay4T",
                          "tokenAmount": 0.165524794,
                          "mint": "So11111111111111111111111111111111111111111",
                          "transferNative": true,
                          "isScaledUiToken": false,
                          "multiplier": null
                        }
                      ]
                    }
                  ]
                }
              }
            },
            "Solana": {
              "value": {
                "success": true,
                "data": {
                  "solana": [
                    {
                      "txHash": "svTZ3o5j7GDsk1EfkXZjEQnV1kirqq48YhS29HyfqFkGUiSzosHRNQaQTPNovP3rbDbV3QrkFQh4GzdESEyRw6s",
                      "blockNumber": 284733408,
                      "blockTime": "2024-08-20T10:44:26+00:00",
                      "status": true,
                      "from": "66YZZejVBupBnMwSEqTaCkAMwPacpPzP41GSEst55Kgz",
                      "to": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                      "fee": 15000,
                      "mainAction": "send",
                      "balanceChange": [
                        {
                          "amount": 0,
                          "symbol": "SOL",
                          "name": "Wrapped SOL",
                          "decimals": 9,
                          "address": "So11111111111111111111111111111111111111112",
                          "logoURI": "https://img.fotofolio.xyz/?w=30&h=30&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png"
                        },
                        {
                          "tokenAccount": "99pfYkuFEUPvUzVSGsMc2VN47FaFSTrKBMXGnxg13tDt",
                          "owner": "Q6XprfkF8RQQKoQVG33xT88H7wi8Uk1B1CC7YAs69Gi",
                          "decimals": 6,
                          "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                          "amount": -10000000000000,
                          "address": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
                          "name": "USDT",
                          "symbol": "USDT",
                          "logoURI": "https://img.fotofolio.xyz/?w=30&h=30&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FEs9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB%2Flogo.svg"
                        }
                      ],
                      "contractLabel": {
                        "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                        "name": "Token Program",
                        "metadata": {
                          "icon": ""
                        }
                      }
                    }
                  ]
                }
              }
            },
            "EVM": {
              "value": {
                "success": true,
                "data": {
                  "ethereum": [
                    {
                      "txHash": "0x9e362abb139f2ae9270b66efd9a3bc9477481049c04256b804a5f7093640d24d",
                      "blockNumber": 20779293,
                      "blockTime": "2024-09-18T18:32:59Z",
                      "status": true,
                      "from": "0xf89d7b9c864f589bbF53a82105107622B35EaA40",
                      "to": "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621",
                      "gasUsed": 21000,
                      "gasPrice": 13739048708,
                      "fee": "288520022868000",
                      "feeUsd": 0.6724695987010954,
                      "value": "12228500000000000000",
                      "contractLabel": {
                        "address": "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621",
                        "name": "Jump Trading",
                        "metadata": {}
                      },
                      "mainAction": "call",
                      "balanceChange": [
                        {
                          "name": "ETH",
                          "symbol": "ETH",
                          "logoURI": "https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628",
                          "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                          "amount": -12228500000000000000,
                          "decimals": 18
                        }
                      ]
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
  "operationId": "get-v1-wallet-tx_list",
  "x-mint": {
    "href": "/data-api/wallet-networth-pnl/get-v1-wallet-tx-list"
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
