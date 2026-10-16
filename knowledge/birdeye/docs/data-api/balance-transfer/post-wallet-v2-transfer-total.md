---
title: "Wallet - Transfer total"
description: "Retrieve total transfer of the wallet."
hidden: false
metadata:
  title: Birdeye Data API | Wallet - Transfer total
  description: Retrieve total transfer of the wallet.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json POST /wallet/v2/transfer/total"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Cheap transfer-count summary for one Solana wallet.</strong></p>
  <ul>
    <li>Solana transfer data is available from epoch <code>257</code> (<code>2021-11-12</code>).</li>
    <li>Use the same wallet and transfer filters as the wallet-transfer list when you only need aggregate counts.</li>
    <li>This endpoint returns totals, not the underlying transfer rows.</li>
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
    <li>This endpoint consumes <code>1 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Count wallet transfers before pulling the full list.</li>
    <li>Show transfer activity totals in wallet dashboards or summary cards.</li>
    <li>Prefilter high-activity wallets before full forensic review.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Send the wallet and any transfer filters in the POST body.</li>
    <li>Use the returned count to decide whether you need the full wallet-transfer list.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use this endpoint as a cheap preflight before paginating transfer rows.</li>
    <li>Keep the filter set identical to the transfer-list call if you plan to compare totals and rows.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
    <li>Historical coverage starts from epoch <code>257</code> (<code>2021-11-12</code>).</li>
    <li>Returns totals only, not transfer row details.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

POST /wallet/v2/transfer/total

```json
{
  "x-metadata": {
    "released_at": 1765497600,
    "new": true
  },
  "tags": [
    "Balance & Transfer"
  ],
  "summary": "Wallet - Transfer total",
  "description": "Retrieve total transfer of the wallet.",
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
            "wallet"
          ],
          "type": "object",
          "properties": {
            "wallet": {
              "type": "string",
              "description": "Address of the wallet to retrieve transfers for.",
              "example": "41zCUJsKk6cMB94DDtm99qWmyMZfp4GkAhhuz4xTwePu"
            },
            "token_address": {
              "type": "string",
              "description": "Address of the token to filter transfers by.",
              "example": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
            },
            "flow": {
              "type": "string",
              "description": "Transfer direction relative to the specified wallet. Use `in` for incoming transfers or `out` for outgoing transfers.",
              "enum": [
                "in",
                "out"
              ],
              "example": "in"
            },
            "time_from": {
              "type": "number",
              "description": "Start of the transfer time range as a Unix timestamp.",
              "example": 1727788070
            },
            "time_to": {
              "type": "number",
              "description": "End of the transfer time range as a Unix timestamp.",
              "example": 1727788076
            },
            "from_amount": {
              "type": "number",
              "description": "Minimum token amount to include.",
              "example": 10.01
            },
            "to_amount": {
              "type": "number",
              "description": "Maximum token amount to include.",
              "example": 10.001
            },
            "from_value": {
              "type": "number",
              "description": "Minimum transfer value in USD to include.",
              "example": 1.001
            },
            "to_value": {
              "type": "number",
              "description": "Maximum transfer value in USD to include.",
              "example": 10000
            },
            "from_wallet": {
              "type": "string",
              "description": "Address of the sender wallet to filter transfers by.",
              "example": "41zCUJsKk6cMB94DDtm99qWmyMZfp4GkAhhuz4xTwePu"
            },
            "to_wallet": {
              "type": "string",
              "description": "Address of the recipient wallet to filter transfers by.",
              "example": "41zCUJsKk6cMB94DDtm99qWmyMZfp4GkAhhuz4xTwePu"
            }
          }
        },
        "examples": {
          "solana": {
            "value": {
              "wallet": "41zCUJsKk6cMB94DDtm99qWmyMZfp4GkAhhuz4xTwePu",
              "token_address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
              "time_from": 1727788070,
              "time_to": 1727788076,
              "flow": "in",
              "from_amount": 10.01,
              "to_amount": 10.001,
              "from_value": 1.001,
              "to_value": 10000,
              "from_wallet": "41zCUJsKk6cMB94DDtm99qWmyMZfp4GkAhhuz4xTwePu",
              "to_wallet": "41zCUJsKk6cMB94DDtm99qWmyMZfp4GkAhhuz4xTwePu"
            }
          }
        }
      }
    }
  },
  "responses": {
    "200": {
      "description": "JSON object containing a total transfer",
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
                  "total": {
                    "type": "integer",
                    "description": "Total number of transfer records matching the filters."
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
                  "total": 10
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
  "operationId": "post-wallet-v2-transfer-total",
  "x-mint": {
    "href": "/data-api/balance-transfer/post-wallet-v2-transfer-total"
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
