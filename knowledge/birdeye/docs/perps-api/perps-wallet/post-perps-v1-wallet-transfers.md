---
title: "Perps Wallet Transfers"
hidden: false
metadata:
  title: Perps Data API | Perps Wallet Transfers
  keywords:
    - blockchain
    - data
    - crypto
    - transfers
    - birdeye
    - perps
    - hyperliquid
  robots: index
openapi: "openapi/perps/openapi_perps_docs.json POST /perps/v1/wallet/transfers"
---

<Tabs>
  <Tab title="Usage Note">
    <ul>
      <li>Returns historical transfers associated with one Hyperliquid wallet.</li>
      <li>Use <code>sort_type</code> to read transfers in ascending or descending time order.</li>
      <li>Use the returned <code>nextCursor</code> as <code>cursor</code> in the next request.</li>
      <li><code>limit</code> defaults to <code>10</code> and supports up to <code>20</code> records per request.</li>
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
    <p><strong>Hyperliquid</strong></p>
  </Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>5 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
- Track deposits, withdrawals, and internal asset movements for a perp wallet.
- Reconcile wallet funding activity with trading and PnL changes.
- Build transfer histories for trader research and operational monitoring.
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
- Pass a Hyperliquid wallet address in the request body.
- Start with an empty cursor and use `nextCursor` to continue pagination.
- Use `sort_type=desc` for the newest transfers first or `sort_type=asc` for chronological processing.
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
- Persist the cursor when processing long histories.
- Use the transaction hash to reconcile transfer records with external transaction data.
- Combine transfers with Wallet Overview and Trade Fills to explain changes in wallet exposure.
</Accordion>


## Resolved API contract

POST /perps/v1/wallet/transfers

```json
{
  "x-metadata": {
    "released_at": 1778803200,
    "new": true
  },
  "tags": [
    "Perps - Wallet"
  ],
  "summary": "Perps - Wallet Transfers",
  "description": "",
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
              "example": "0x5b5d51203a0f9079f8aeb098a6523a13f298c060"
            },
            "sort_type": {
              "type": "string",
              "enum": [
                "asc",
                "desc"
              ],
              "default": "desc"
            },
            "limit": {
              "type": "integer",
              "minimum": 1,
              "maximum": 20,
              "default": 10
            },
            "cursor": {
              "type": "string",
              "default": ""
            }
          }
        },
        "examples": {
          "WalletTransfers": {
            "value": {
              "wallet": "0x5b5d51203a0f9079f8aeb098a6523a13f298c060",
              "sort_type": "desc",
              "limit": 1,
              "cursor": "MHg1YjVkNTEyMDNhMGY5MDc5ZjhhZWIwOThhNjUyM2ExM2YyOThjMDYwLTE3ODkzNDA2NjAzMzYtMHhiOWI5MzcwMTE1M2JkNDFmYmIzMjA0NDQ1N2ZhNzgwMjAxNGIwMGU2YjAzZWYyZjE1ZDgxZTI1M2Q0M2ZhZTBh"
            }
          }
        }
      }
    }
  },
  "responses": {
    "200": {
      "description": "JSON object containing a list of transfers with certain fields",
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
                "type": "object"
              }
            }
          },
          "examples": {
            "WalletTransfers": {
              "value": {
                "data": {
                  "data": [
                    {
                      "time": 1789340787,
                      "hash": "0xe862f3d735dc25efe9dc044458016f0202d200bcd0df44c18c2b9f29f4dfffda",
                      "type": "Send",
                      "sender": "0x5b5d51203a0f9079f8aeb098a6523a13f298c060",
                      "recipient": "0x2000000000000000000000000000000000000000",
                      "token": "USDC",
                      "amount": 4000000,
                      "usdc_value": 4000000,
                      "fee": 0.00002,
                      "fee_token": "HYPE",
                      "source_dex": "spot",
                      "destination_dex": "spot",
                      "display_type": "Send"
                    }
                  ],
                  "nextCursor": "MHg1YjVkNTEyMDNhMGY5MDc5ZjhhZWIwOThhNjUyM2ExM2YyOThjMDYwLTE3ODkzNDA2NjAzMzYtMHhiOWI5MzcwMTE1M2JkNDFmYmIzMjA0NDQ1N2ZhNzgwMjAxNGIwMGU2YjAzZWYyZjE1ZDgxZTI1M2Q0M2ZhZTBh"
                },
                "success": true
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
  "operationId": "post-perps-v1-wallet-transfers",
  "parameters": [],
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
