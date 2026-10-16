---
title: "Perps Wallet Trade Fills"
hidden: false
metadata:
  title: Perps Data API | Perps Wallet Trade Fills
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - perps
    - hyperliquid
  robots: index
openapi: "openapi/perps/openapi_perps_docs.json POST /perps/v1/wallet/trade_fills"
---

<Tabs>
  <Tab title="Usage Note">
    <ul>
      <li>Returns historical perpetual trade fills for one Hyperliquid wallet.</li>
      <li>Use <code>sort_type</code> to read fills in ascending or descending time order.</li>
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
- Build a wallet's perpetual execution history.
- Analyze entry and exit activity, realized PnL, fees, and traded volume.
- Support trader attribution, performance review, and position lifecycle analysis.
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
- Pass a Hyperliquid wallet address in the request body.
- Start with an empty cursor and use `nextCursor` to continue pagination.
- Use `sort_type=desc` for the newest fills first or `sort_type=asc` for chronological processing.
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
- Persist the cursor when processing long histories.
- Deduplicate by transaction hash when combining pages or polling repeatedly.
- Combine fills with Wallet Open Positions to compare execution history with current exposure.
</Accordion>


## Resolved API contract

POST /perps/v1/wallet/trade_fills

```json
{
  "x-metadata": {
    "released_at": 1778803200,
    "new": true
  },
  "tags": [
    "Perps - Wallet"
  ],
  "summary": "Perps - Wallet Trade Fills",
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
          "WalletTradeFills": {
            "value": {
              "wallet": "0x5b5d51203a0f9079f8aeb098a6523a13f298c060",
              "sort_type": "desc",
              "limit": 1,
              "cursor": "MHg1YjVkNTEyMDNhMGY5MDc5ZjhhZWIwOThhNjUyM2ExM2YyOThjMDYwLTE3ODkzNDM4NzcwMjgtMHhjOTYxNTY5MmM1YjQ0ZWJjY2FkYjA0NDQ1OGE4NDcwMjAyNDgwMDc4NjBiNzZkOGU2ZDJhMDFlNTg0YjgyOGE3"
            }
          }
        }
      }
    }
  },
  "responses": {
    "200": {
      "description": "JSON object containing a list of trade fills with certain fields",
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
            "WalletTradeFills": {
              "value": {
                "data": {
                  "data": [
                    {
                      "time": 1789343885,
                      "hash": "0x1ac3874b7d5799501c3d044458a8ad0205540031185ab822be8c329e3c5b733a",
                      "token": "PUMP",
                      "side": "Buy",
                      "direction": "Close Short",
                      "size": 2881240,
                      "volume_usd": 9997.9028,
                      "start_position": -3411528597,
                      "closed_pnl": 3275.96988,
                      "fee_value": 2.099559,
                      "price": 0.00347
                    }
                  ],
                  "nextCursor": "MHg1YjVkNTEyMDNhMGY5MDc5ZjhhZWIwOThhNjUyM2ExM2YyOThjMDYwLTE3ODkzNDM4NzcwMjgtMHhjOTYxNTY5MmM1YjQ0ZWJjY2FkYjA0NDQ1OGE4NDcwMjAyNDgwMDc4NjBiNzZkOGU2ZDJhMDFlNTg0YjgyOGE3"
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
  "operationId": "post-perps-v1-wallet-trade_fills",
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
