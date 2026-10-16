---
title: "Token - Transfer List"
description: "Retrieve the transfer history of a specified token"
hidden: false
metadata:
  title: Birdeye Data API | Token - Transfer List
  description: Retrieve the transfer history of a specified token
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json POST /token/v1/transfer"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Cursor-paginated transfer history for one Solana token.</strong></p>
  <ul>
    <li>Solana transfer data is available from epoch <code>257</code> (<code>2021-11-12</code>).</li>
    <li>Supports four transfer actions: <code>mint</code>, <code>burn</code>, <code>transfer</code>, and <code>set_authority</code>.</li>
    <li>Pagination uses a cursor. On the first request, send normal filters without <code>cursor</code>. Subsequent requests should send only the returned <code>next_cursor</code>.</li>
    <li>When <code>cursor</code> is provided together with other filters, only <code>cursor</code> is applied.</li>
  </ul>
  <p><strong>Reading the numbers.</strong> Use token transfer rows when you need the exact movement records behind supply changes, wallet flows, or mint/burn events.</p>
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
    <li>Inspect token transfer flow across all wallets for one mint.</li>
    <li>Review mint, burn, and standard transfer activity around launches or supply events.</li>
    <li>Support forensic timelines, treasury tracing, and token-flow monitoring.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Send the token mint and any transfer filters in the POST body.</li>
    <li>On page 1, omit <code>cursor</code>.</li>
    <li>While <code>next_cursor</code> is present, send only that <code>cursor</code> value on the next request.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use the total endpoint first when you only need counts before pulling the full list.</li>
    <li>Persist <code>next_cursor</code> while paging; do not mix it with stale filters.</li>
    <li>Use this token-level view when the token is the anchor, and wallet-transfer endpoints when one wallet is the anchor.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
    <li>Historical coverage starts from epoch <code>257</code> (<code>2021-11-12</code>).</li>
    <li>Cursor pagination means page boundaries are driven by <code>next_cursor</code>, not offset.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

POST /token/v1/transfer

```json
{
  "x-metadata": {
    "released_at": 1765497600,
    "new": true
  },
  "tags": [
    "Balance & Transfer"
  ],
  "summary": "Token - Transfer List",
  "description": "Retrieve the transfer history of a specified token",
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
            "token_address"
          ],
          "type": "object",
          "properties": {
            "token_address": {
              "type": "string",
              "description": "Address of the token to retrieve transfers for.",
              "example": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
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
              "description": "Address of the sender wallet.",
              "example": "41zCUJsKk6cMB94DDtm99qWmyMZfp4GkAhhuz4xTwePu"
            },
            "to_wallet": {
              "type": "string",
              "description": "Address of the recipient wallet.",
              "example": "41zCUJsKk6cMB94DDtm99qWmyMZfp4GkAhhuz4xTwePu"
            },
            "cursor": {
              "type": "string",
              "description": "Cursor used to retrieve the next page of results.",
              "example": "xxx"
            },
            "limit": {
              "type": "number",
              "example": 100
            }
          }
        },
        "examples": {
          "solana": {
            "value": {
              "token_address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
              "time_from": 1727788070,
              "time_to": 1727788076,
              "from_amount": 10.01,
              "to_amount": 10.001,
              "from_value": 1.001,
              "to_value": 10000,
              "from_wallet": "41zCUJsKk6cMB94DDtm99qWmyMZfp4GkAhhuz4xTwePu",
              "to_wallet": "41zCUJsKk6cMB94DDtm99qWmyMZfp4GkAhhuz4xTwePu",
              "cursor": "xxxx",
              "limit": 100
            }
          }
        }
      }
    }
  },
  "responses": {
    "200": {
      "description": "JSON object containing list transfer",
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
                "type": "array",
                "description": "Transfer events matching the request filters.",
                "items": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "time": {
                      "type": "string",
                      "description": "Human-readable time of the transfer."
                    },
                    "block_number": {
                      "type": "integer",
                      "description": "Block or slot number of the transfer."
                    },
                    "unix_time": {
                      "type": "integer",
                      "description": "Unix timestamp in seconds of the transfer."
                    },
                    "token_address": {
                      "type": "string",
                      "description": "Token mint or contract address being transferred."
                    },
                    "from_address": {
                      "type": "string",
                      "description": "Sender wallet address."
                    },
                    "to_address": {
                      "type": "string",
                      "description": "Recipient wallet address."
                    },
                    "from_token_account": {
                      "type": "string",
                      "description": "Source token account when the chain exposes token-account addresses."
                    },
                    "to_token_account": {
                      "type": "string",
                      "description": "Destination token account when the chain exposes token-account addresses."
                    },
                    "amount": {
                      "type": [
                        "number",
                        "string"
                      ],
                      "description": "Raw token amount transferred."
                    },
                    "ui_amount": {
                      "type": "number",
                      "description": "Human-readable token amount transferred."
                    },
                    "price": {
                      "type": "number",
                      "description": "Indexed token price in USD at the transfer time."
                    },
                    "value": {
                      "type": "number",
                      "description": "USD value of the transfer at the transfer time."
                    },
                    "tx_hash": {
                      "type": "string",
                      "description": "Transaction signature or hash of the transfer."
                    },
                    "flow": {
                      "type": "string",
                      "description": "Direction of the transfer relative to the queried wallet, such as `in` or `out`."
                    },
                    "token_info": {
                      "type": "object",
                      "additionalProperties": true,
                      "description": "Token metadata for the transferred asset."
                    },
                    "action": {
                      "type": "string",
                      "description": "Interpreted transfer action label."
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
                "data": [
                  {
                    "time": "2025-11-18T04:32:26Z",
                    "block_number": 380819945,
                    "unix_time": 1763440346,
                    "token_address": "9TR9Ge75PMHfoKBAzo88XpDhvhjsirETEuPtRS4VtrpJ",
                    "from_address": "HLnpSz9h2S4hiLQ43rnSD9XkcUThA7B8hQMKmDaiTLcC",
                    "to_address": "FCgMrWxuY5mWgFn55czYLysfGi3QFsZm3W7sJ7wTDQpz",
                    "from_token_account": "5JAZp6t5eSNXbdEwu3pMbB8uKV1e9cf2yg8E4Yq56WZa",
                    "to_token_account": "FKtWCwxFKdc7g7ymxVgyBSbwzGMNGWe7HtbKkum99f9C",
                    "amount": "14213245095",
                    "ui_amount": 14213.245095,
                    "price": 0.000029247096468293907,
                    "value": 0.4156961504209702,
                    "tx_hash": "2vLYZuCrKARicrXRDf2eGnzaKR9PP6qFFuzgPCHUNAnwepcqvFQ8WiPRuZjBNihNsNoxxQ5bLVLX7Wu6i6h5tmuP",
                    "flow": "out",
                    "token_info": {
                      "address": "9TR9Ge75PMHfoKBAzo88XpDhvhjsirETEuPtRS4VtrpJ",
                      "decimals": 6,
                      "symbol": "NYAN",
                      "name": "Nyan Cat",
                      "logo_uri": "https://wsrv.nl/?w=128&h=128&default=1&url=https://rs.debot.ai/logo/CMx7yon2cLzHcXqgHsKJhuU3MmME6noWLQk2rAycBAGS.gif"
                    },
                    "action": "transfer"
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
  "operationId": "post-token-v1-transfer",
  "x-mint": {
    "href": "/data-api/balance-transfer/post-token-v1-transfer"
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
