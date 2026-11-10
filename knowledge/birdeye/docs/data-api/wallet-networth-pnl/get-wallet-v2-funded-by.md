---
title: "Wallet - Funded by"
description: "Retrieve the earliest native SOL funders of a wallet via supported instructions: transfer, balance-changing createAccount, createAccountWithRedeem, UnwrapLamports, and WithdrawExcessLamports."
hidden: false
metadata:
  title: Birdeye Data API | Wallet - Funded by
  description: >-
    Retrieve the earliest native SOL funders of a wallet via supported
    instructions: transfer, balance-changing createAccount,
    createAccountWithRedeem, UnwrapLamports, and WithdrawExcessLamports.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /wallet/v2/funded-by"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Wallet provenance and source-of-funds lookup.</strong></p>
  <ul>
    <li>Use this endpoint to identify who first funded a Solana wallet with native SOL.</li>
    <li>The result is based on the earliest qualifying SOL funding event found in indexed history.</li>
    <li>Supported instruction patterns include direct transfer, balance-changing <code>createAccount</code>, <code>createAccountWithSeed</code>, <code>UnwrapLamports</code>, and <code>WithdrawExcessLamports</code>.</li>
    <li>This endpoint returns funding provenance, not portfolio balances, PnL, or transfer history.</li>
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
    <li>This endpoint consumes <code>30 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Trace the source wallet that initially funded a trader, sniper, or whale wallet.</li>
    <li>Cluster wallets that were seeded by the same origin wallet.</li>
    <li>Add provenance context to wallet research, top-trader analysis, and holder investigations.</li>
    <li>Support risk, compliance, and forensic workflows that need source-of-funds attribution.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Pass the target wallet in the <code>wallet</code> query parameter.</li>
    <li>Use the returned <code>funders</code> list and <code>tx_hash</code> to connect the wallet back to its earliest known SOL funding event.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Combine this endpoint with wallet portfolio, PnL, and top-trader endpoints when you need both provenance and behavior.</li>
    <li>Treat the result as attribution context rather than proof of ultimate ownership.</li>
    <li>Cache results because earliest funding provenance is much less volatile than market or portfolio data.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
  </ul>
</Accordion>

## Resolved API contract

GET /wallet/v2/funded-by

```json
{
  "x-metadata": {
    "released_at": 1756368000,
    "new": true
  },
  "tags": [
    "Wallet, Networth & PnL"
  ],
  "summary": "Wallet - Funded by",
  "description": "Retrieve the earliest native SOL funders of a wallet via supported instructions: transfer, balance-changing createAccount, createAccountWithRedeem, UnwrapLamports, and WithdrawExcessLamports.",
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
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing the wallet that first funded the requested address with SOL, along with the funding details",
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
                  "funders": {
                    "type": "array",
                    "description": "Wallets associated with the first funding event.",
                    "items": {
                      "type": "object",
                      "required": [
                        "funder",
                        "funder_name"
                      ],
                      "properties": {
                        "funder": {
                          "type": "string",
                          "description": "Address of the wallet that funded the requested wallet."
                        },
                        "funder_name": {
                          "type": "string",
                          "description": "Known name or label of the funding wallet, if available."
                        }
                      }
                    }
                  },
                  "token_address": {
                    "type": "string",
                    "description": "Token address used to fund the wallet."
                  },
                  "token_decimals": {
                    "type": "integer",
                    "description": "Number of decimals for the funding token."
                  },
                  "block_number": {
                    "type": "integer",
                    "description": "Block or slot number of the first funding event."
                  },
                  "unix_time": {
                    "type": "integer",
                    "description": "Unix timestamp in seconds of the first funding event."
                  },
                  "amount": {
                    "type": [
                      "number",
                      "string"
                    ],
                    "description": "Amount transferred in the first funding event, in the token's smallest unit."
                  },
                  "tx_hash": {
                    "type": "string",
                    "description": "Transaction hash of the first funding event."
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
                  "funders": [
                    {
                      "funder": "AgmLJBMDCqWynYnQiPCuj9ewsNNsBJXyzoUhD9LJzN51",
                      "funder_name": "MEV Bot"
                    },
                    {
                      "funder": "4SnmsNwQLpBhuNvdjXQwafT6kV1BDvR6KgF3B9777wQd",
                      "funder_name": ""
                    }
                  ],
                  "token_address": "So11111111111111111111111111111111111111111",
                  "token_decimals": 9,
                  "block_number": 403982922,
                  "unix_time": 1772558735,
                  "amount": 37030480,
                  "tx_hash": "2uAZx5CQ5AgrA21LbqZd7hFH5wit3Xm7w4fB3YeZCqCaUs6MS3SmoFfJ1jsAQDwgzgmieCjzYegNNwZprovJe5Vo"
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
  "operationId": "get-wallet-v2-funded-by",
  "x-mint": {
    "href": "/data-api/wallet-networth-pnl/get-wallet-v2-funded-by"
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
