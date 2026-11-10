---
title: "Blockchain - Token Accounts"
description: "Returns token accounts owned by a Solana address. Omit state to return all states. hide_zero defaults to false.\n"
hidden: false
openapi: "openapi/blockchain/openapi_blockchain_docs.json GET /blockchain/v1/account/token-accounts"
---
<Tabs>
  <Tab title="Usage Note">
  <ul>
    <li>Returns SPL token accounts owned by a Solana wallet or authority address.</li>
    <li>Use <code>state</code> to narrow to <code>initialized</code>, <code>frozen</code>, or <code>uninitialized</code> token accounts.</li>
    <li><code>hide_zero=false</code> returns empty token accounts too, which is useful for full inventory audits.</li>
    <li>Amounts are raw integer token balances; apply <code>decimals</code> for UI formatting.</li>
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

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Enumerate every token account controlled by a Solana wallet.</li>
    <li>Build token-account inventories for wallets, treasury monitors, or NFT tooling.</li>
    <li>Detect frozen or uninitialized token accounts before attempting transfers or closes.</li>
    <li>Audit token-account sprawl and cleanup candidates across operational wallets.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Pass the wallet or authority in <code>owner</code>.</li>
    <li>Set <code>state</code> only when you need one token-account lifecycle state.</li>
    <li>Set <code>hide_zero=true</code> when you only care about currently funded token accounts.</li>
    <li>Use <code>mint</code>, <code>amount</code>, and <code>decimals</code> to join each token account back to token metadata and balances.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Keep <code>hide_zero=false</code> for audits and reconciliation, but use <code>true</code> for user-facing portfolio screens.</li>
    <li>Pair this endpoint with token metadata if you need names, symbols, and collection details.</li>
    <li>Treat token accounts and owner wallets separately in your data model; the response is account-level, not mint-level.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /blockchain/v1/account/token-accounts

```json
{
  "tags": [
    "Account"
  ],
  "summary": "Blockchain - Token Accounts",
  "description": "Returns token accounts owned by a Solana address. Omit state to return all states. hide_zero defaults to false.\n",
  "parameters": [
    {
      "name": "owner",
      "description": "Solana owner address.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "example": "11111111111111111111111111111111"
      }
    },
    {
      "name": "state",
      "description": "Filter by state. Omit to return all states.",
      "in": "query",
      "schema": {
        "type": "string",
        "enum": [
          "uninitialized",
          "initialized",
          "frozen"
        ],
        "example": "initialized"
      }
    },
    {
      "name": "hide_zero",
      "description": "Exclude token accounts with zero balance. Defaults to false.",
      "in": "query",
      "schema": {
        "type": "boolean",
        "default": false,
        "example": false
      }
    }
  ],
  "responses": {
    "200": {
      "description": "Successful response",
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
                "type": "boolean"
              },
              "data": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": [
                    "token_account",
                    "mint",
                    "decimals",
                    "amount",
                    "state"
                  ],
                  "properties": {
                    "token_account": {
                      "type": "string"
                    },
                    "mint": {
                      "type": "string",
                      "description": "Mint address for the token account."
                    },
                    "decimals": {
                      "type": "integer",
                      "description": "Number of token decimals for the mint."
                    },
                    "amount": {
                      "type": "integer",
                      "format": "int64",
                      "description": "Raw token balance held by the token account."
                    },
                    "state": {
                      "type": "string",
                      "enum": [
                        "uninitialized",
                        "initialized",
                        "frozen"
                      ],
                      "description": "Current token-account state reported by the SPL Token program."
                    }
                  }
                }
              }
            }
          },
          "examples": {
            "Example": {
              "value": {
                "success": true,
                "data": [
                  {
                    "token_account": "14TDbofLkZ9BMLmQrWiwawD9ngjo62auj5Axs3g3ed9",
                    "mint": "HdAUYdY3NFnDytViCkBdkX3pdP2KFHxJ7oaujiQfycN8",
                    "decimals": 0,
                    "amount": 1,
                    "state": "initialized"
                  },
                  {
                    "token_account": "17fAxkeEaGS1t4uMVeE2A2ifyqstMRf2eJ6MEh3YxNB",
                    "mint": "3aF8DcwKxyUjQkh1C2Xaf54d6rHAe3pWXiWVsPsQEXKQ",
                    "decimals": 6,
                    "amount": 157145478888,
                    "state": "initialized"
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
  "operationId": "get-blockchain-v1-account-token-accounts",
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
