---
title: "Wallet - First Tx Funded"
description: "Retrieve the earliest transaction in which the wallet's post-transaction balance differs from its pre-transaction balance."
hidden: false
metadata:
  title: Birdeye Data API | Wallet - First Tx Funded
  description: >-
    Retrieve the earliest transaction in which the wallet's post-transaction
    balance differs from its pre-transaction balance.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json POST /wallet/v2/tx/first-funded"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Earliest funding transaction for wallets.</strong></p>
  <ul>
    <li>Maximum number of wallets per request is <code>50</code>.</li>
    <li><code>token_address</code> is optional; pass it when you want the first funding transaction for a specific token instead of the wallet's earliest funding event overall.</li>
    <li>This endpoint helps attribute where a wallet was first funded from.</li>
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
    <li>Batch CU is calculated as <code>ceil(40 * wallet_count^0.8)</code>.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Find the earliest funding source for a wallet.</li>
    <li>Trace wallet provenance in fraud, sybil, or attribution investigations.</li>
    <li>Enrich whale, smart-money, or insider wallet research with first-funding context.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Send up to <code>50</code> wallet addresses in the POST body.</li>
    <li>Optionally include <code>token_address</code> when funding provenance should be scoped to one token.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use this endpoint after identifying a wallet cohort worth investigating, not as a first-pass screen.</li>
    <li>Keep wallet batches focused so attribution review remains manageable.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

POST /wallet/v2/tx/first-funded

```json
{
  "x-metadata": {
    "released_at": 1756368000,
    "new": true
  },
  "tags": [
    "Wallet, Networth & PnL"
  ],
  "summary": "Wallet - First Tx Funded",
  "description": "Retrieve the earliest transaction in which the wallet's post-transaction balance differs from its pre-transaction balance.",
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
            "wallets"
          ],
          "type": "object",
          "properties": {
            "wallets": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "example": [
                "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
                "2fgUSSpZFi8PjyhbrETSeLutJpFsuCfWsk2H6gb3Reye"
              ]
            },
            "token_address": {
              "type": "string",
              "description": "Token address used to identify the first transaction that funded each wallet with the specified token.",
              "example": "So11111111111111111111111111111111111111112"
            }
          }
        },
        "examples": {
          "solana": {
            "value": {
              "wallets": [
                "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
                "2fgUSSpZFi8PjyhbrETSeLutJpFsuCfWsk2H6gb3Reye",
                "CZY9M9BywshFAFjPw7uLgXw9yGtNL26YypLCJdewiHo"
              ],
              "token_addresses": "So11111111111111111111111111111111111111112"
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
                "type": "object",
                "description": "Map keyed by wallet address to the first-funding transaction details.",
                "additionalProperties": {
                  "type": "object",
                  "properties": {
                    "tx_hash": {
                      "type": "string",
                      "description": "Transaction hash of the first funding event."
                    },
                    "block_unix_time": {
                      "type": "integer",
                      "description": "Unix timestamp in seconds of the first funding event."
                    },
                    "block_number": {
                      "type": "integer",
                      "description": "Block or slot number of the first funding event."
                    },
                    "balance_change": {
                      "type": [
                        "number",
                        "string"
                      ],
                      "description": "Balance change caused by the first funding event."
                    },
                    "token_address": {
                      "type": "string",
                      "description": "Token address that funded the wallet."
                    },
                    "token_decimals": {
                      "type": "integer",
                      "description": "Number of token decimals for the funding asset."
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
                  "1jw5fDodwGEGBVqNXsx2eqiLgNmgMDEeXWSbrTreLCM": {
                    "tx_hash": "8g5kPkNNhbxozv7veVjwHqCdJ6FB4B3zMaXBfHigZKwPprNB3A3WcVBCdEm1rfuG1m3syHEVZHeYfCZfM7BgQ6s",
                    "block_unix_time": 1717292678,
                    "block_number": 269344897,
                    "balance_change": "7182720",
                    "token_address": "So11111111111111111111111111111111111111111",
                    "token_decimals": 9
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
  "operationId": "post-wallet-v2-tx-first-funded",
  "x-mint": {
    "href": "/data-api/wallet-networth-pnl/post-wallet-v2-tx-first-funded"
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
