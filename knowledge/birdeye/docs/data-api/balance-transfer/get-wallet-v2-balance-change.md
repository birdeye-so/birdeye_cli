---
title: "Wallet - Balance Change"
description: "Retrieve the balance change history of a wallet."
hidden: false
metadata:
  title: Birdeye Data API | Wallet - Balance Change
  description: Retrieve the balance change history of a wallet.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /wallet/v2/balance-change"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Balance-delta history for one Solana wallet.</strong></p>
  <ul>
    <li>Filter by <code>token_address</code> when you want one token only, or omit it for broader wallet activity.</li>
    <li><code>token_type</code> and <code>change_type</code> narrow the result to the asset class and change direction you care about.</li>
    <li><code>time_from</code> and <code>time_to</code> let you constrain the review window.</li>
    <li>Pagination uses <code>offset</code> up to <code>10,000</code> and <code>limit</code> up to <code>100</code>.</li>
    <li><code>ui_amount_mode=scaled</code> applies Solana Token-2022 scaled UI amount when the token supports the scaled UI extension.</li>
  </ul>
  <p><strong>Reading the numbers.</strong> Balance-change rows explain how a wallet's token balance moved over time, which token changed, and by how much after decimal or scaled UI normalization.</p>
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
    <li>This endpoint consumes <code>8 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Review how a wallet accumulated, distributed, or rotated tokens over time.</li>
    <li>Power audit trails, treasury monitoring, and operator activity review.</li>
    <li>Isolate changes for one token before drilling into transfer-level events.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Pass the wallet address in <code>wallet</code>.</li>
    <li>Add <code>token_address</code>, <code>token_type</code>, or <code>change_type</code> when you need a narrower slice.</li>
    <li>Use <code>time_from</code> and <code>time_to</code> for bounded investigations.</li>
    <li>Page through results with <code>offset</code> and <code>limit</code>.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Start broad, then add token and change filters once you see the wallet's activity pattern.</li>
    <li>Use this endpoint to find the interesting timestamps, then pair it with transfer endpoints for exact movement details.</li>
    <li>Keep <code>ui_amount_mode</code> aligned with other Solana Token-2022 analysis for consistent quantities.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
    <li>Offset pagination tops out at <code>10,000</code>.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /wallet/v2/balance-change

```json
{
  "x-metadata": {
    "released_at": 1748476800,
    "new": true
  },
  "tags": [
    "Balance & Transfer"
  ],
  "summary": "Wallet - Balance Change",
  "description": "Retrieve the balance change history of a wallet.",
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
      "name": "address",
      "description": "The address of the account.",
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
      "name": "token_address",
      "description": "The address of the token contract.",
      "in": "query",
      "schema": {
        "type": "string"
      },
      "examples": {
        "wsol": {
          "value": "So11111111111111111111111111111111111111112"
        },
        "solana": {
          "value": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
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
      "name": "time_from",
      "description": "Specify the start time using unix timestamps in seconds",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 0,
        "maximum": 10000000000
      },
      "example": 1726700000
    },
    {
      "name": "time_to",
      "description": "Specify the end time using unix timestamps in seconds",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 0,
        "maximum": 10000000000
      },
      "example": 1726704000
    },
    {
      "name": "type",
      "in": "query",
      "schema": {
        "type": "string",
        "enum": [
          "SOL",
          "SPL"
        ]
      }
    },
    {
      "name": "change_type",
      "in": "query",
      "schema": {
        "type": "string",
        "enum": [
          "increase",
          "decrease"
        ]
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
      "description": "JSON object containing a list of balance changes of an address",
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
                  "items": {
                    "type": "array",
                    "description": "Balance-change events for the requested wallet.",
                    "items": {
                      "type": "object",
                      "additionalProperties": true,
                      "properties": {
                        "time": {
                          "type": "string",
                          "description": "Human-readable event time."
                        },
                        "block_number": {
                          "type": [
                            "integer",
                            "string"
                          ],
                          "description": "Block or slot number of the event."
                        },
                        "block_unix_time": {
                          "type": "integer",
                          "description": "Block timestamp in Unix seconds."
                        },
                        "address": {
                          "type": "string",
                          "description": "Wallet address whose balance changed."
                        },
                        "token_account": {
                          "type": "string",
                          "description": "Token account or balance slot address."
                        },
                        "tx_hash": {
                          "type": "string",
                          "description": "Transaction signature or hash."
                        },
                        "pre_balance": {
                          "type": [
                            "number",
                            "string"
                          ],
                          "description": "Balance before the change."
                        },
                        "post_balance": {
                          "type": [
                            "number",
                            "string"
                          ],
                          "description": "Balance after the change."
                        },
                        "amount": {
                          "type": [
                            "number",
                            "string"
                          ],
                          "description": "Signed balance delta for the event."
                        },
                        "token_info": {
                          "type": "object",
                          "additionalProperties": true,
                          "description": "Metadata for the token whose balance changed."
                        },
                        "type": {
                          "type": "string",
                          "description": "Machine-readable event type."
                        },
                        "type_text": {
                          "type": "string",
                          "description": "Human-readable event type."
                        },
                        "change_type": {
                          "type": "string",
                          "description": "Machine-readable change-direction classification."
                        },
                        "change_type_text": {
                          "type": "string",
                          "description": "Human-readable change-direction label."
                        }
                      }
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
                  "items": [
                    {
                      "time": "2025-08-01T08:55:58Z",
                      "block_number": 357129280,
                      "block_unix_time": 1754038558,
                      "address": "51dEMNojjd2hZKrMeDWBRMPmhDS5QH1eCQWCdtR7CYKp",
                      "token_account": "ATgjegWTEidtsDniCfVJp5Py86fi5X8nzRyzndfimr59",
                      "tx_hash": "mBxrLzapLZtcdPsKSr6EkUUXgFJDyXJs7bJcwQ58xh7JXhN7nsz9ELNspxsnG6TxVaJdzsbrkvhjgrX8QArrp4h",
                      "pre_balance": "257629693",
                      "post_balance": "293106471",
                      "amount": "35476777",
                      "token_info": {
                        "address": "4a79c1TRehFCpHxQ7niHAiBAvHRJRWey3UkWuMDREKL7",
                        "decimals": 9,
                        "symbol": "",
                        "name": "",
                        "logo_uri": "",
                        "is_scaled_ui_token": true,
                        "multiplier": 1.5
                      },
                      "type": 2,
                      "type_text": "SPL",
                      "change_type": 1,
                      "change_type_text": "INCR"
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
  "operationId": "get-wallet-v2-balance-change",
  "x-mint": {
    "href": "/data-api/balance-transfer/get-wallet-v2-balance-change"
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
