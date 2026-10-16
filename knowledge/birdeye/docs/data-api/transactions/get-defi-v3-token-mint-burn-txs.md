---
title: "Token - Mint/Burn"
description: "Retrieve the mint/burn transaction list of a specified token. Only support solana"
hidden: false
metadata:
  title: Birdeye Data API | Token - Mint/Burn
  description: >-
    Retrieve the mint/burn transaction list of a specified token. Only support
    solana
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/token/mint-burn-txs"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Mint and burn event history for one token.</strong></p>
  <ul>
    <li>This endpoint is Solana-only.</li>
    <li>Pass the token address in <code>address</code>.</li>
    <li><code>limit</code> supports up to <code>100</code> items per request and <code>offset</code> supports up to <code>10,000</code>.</li>
    <li>Filter by <code>type</code> to focus on mint events, burn events, or both.</li>
    <li>Use <code>after_time</code> and <code>before_time</code> for bounded event windows.</li>
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
    <li>This endpoint consumes <code>15 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Track supply expansion and contraction through raw mint and burn events.</li>
    <li>Investigate treasury activity, token emissions, or deflation events.</li>
    <li>Build tokenomics dashboards that need event-level supply changes instead of just totals.</li>
    <li>Explain abrupt supply, liquidity, or price changes with the underlying mint or burn history.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Pass the token address in <code>address</code>.</li>
    <li>Filter by <code>type</code> and bound the window with <code>after_time</code> and <code>before_time</code>.</li>
    <li>Page with <code>offset</code> and <code>limit</code>, keeping <code>limit</code> at <code>100</code> or below.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Review mint and burn events alongside holder and transfer activity so supply moves are interpreted in context.</li>
    <li>Use bounded time windows around suspected emissions or treasury operations instead of scanning very broad ranges.</li>
    <li>Keep separate views for mint and burn when analyzing inflationary versus deflationary behavior.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /defi/v3/token/mint-burn-txs

```json
{
  "tags": [
    "Transactions"
  ],
  "summary": "Token - Mint/Burn",
  "description": "Retrieve the mint/burn transaction list of a specified token. Only support solana",
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
      "description": "The address of the token contract.",
      "in": "query",
      "required": true,
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
      "name": "sort_by",
      "description": "Specify the sort order for mint/burn transactions. Filter for records with sort order equal to the specified sort order.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "enum": [
          "block_time"
        ],
        "default": "block_time"
      }
    },
    {
      "name": "sort_type",
      "description": "Specify the sort order.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "enum": [
          "desc",
          "asc"
        ],
        "default": "desc"
      }
    },
    {
      "name": "type",
      "description": "Specify the type of mint/burn transactions. Filter for records with type equal to the specified type.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "enum": [
          "all",
          "mint",
          "burn"
        ],
        "default": "all"
      }
    },
    {
      "name": "after_time",
      "description": "Specify the lower bound of time. Filter for records with time greater than the specified after time value, excluding those with time equal to the specified after time.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer"
      }
    },
    {
      "name": "before_time",
      "description": "Specify the upper bound of time. Filter for records with time less than the specified before time value, excluding those with time equal to the specified before time.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer"
      }
    },
    {
      "name": "offset",
      "description": "Pagination start position. offset + limit <= 10000",
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
      "description": "Number of items per page.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 100,
        "minimum": 1,
        "maximum": 100
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing a list of mint/burn transactions",
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
                "type": "object",
                "properties": {
                  "items": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "amount": {
                          "type": "string"
                        },
                        "block_human_time": {
                          "type": "string"
                        },
                        "block_time": {
                          "type": "number"
                        },
                        "common_type": {
                          "type": "string"
                        },
                        "decimals": {
                          "type": "number"
                        },
                        "mint": {
                          "type": "string"
                        },
                        "program_id": {
                          "type": "string"
                        },
                        "slot": {
                          "type": "number"
                        },
                        "tx_hash": {
                          "type": "string"
                        },
                        "ui_amount": {
                          "type": "number"
                        },
                        "ui_amount_string": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "examples": {
            "MintBurnTxs": {
              "value": {
                "success": true,
                "data": {
                  "items": [
                    {
                      "amount": "870",
                      "block_human_time": "2024-11-08T07:28:18.000Z",
                      "block_time": 1731050898,
                      "common_type": "burn",
                      "decimals": 0,
                      "mint": "fueL3hBZjLLLJHiFH9cqZoozTG3XQZ53diwFPwbzNim",
                      "program_id": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                      "slot": 300145960,
                      "tx_hash": "TyqmrBiZaW6bXsm6fV1owkVL2ea3PF2rbHPNZQtQrLYiZVThHEmkcD4QHKw37W43nyUdrFSdNr2xxTPZkPBY3pZ",
                      "ui_amount": 870,
                      "ui_amount_string": "870"
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
  "operationId": "get-defi-v3-token-mint-burn-txs",
  "x-mint": {
    "href": "/data-api/transactions/get-defi-v3-token-mint-burn-txs"
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
