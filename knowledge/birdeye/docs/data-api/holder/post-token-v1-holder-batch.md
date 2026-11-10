---
title: "Token - Holder (Batch)"
description: "Retrieve the token balance held by a list of wallet owners."
hidden: false
metadata:
  title: Birdeye Data API | Token - Holder (Batch)
  description: Retrieve the token balance held by a list of wallet owners.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json POST /token/v1/holder/batch"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Check one token across many wallet owners.</strong></p>
  <ul>
    <li>Request body accepts <code>token_address</code> and <code>wallets</code>.</li>
    <li><code>wallets</code> must contain 1 to 500 wallet addresses.</li>
    <li>Response returns balance rows for wallets that hold the requested token.</li>
    <li><code>ui_amount_mode=scaled</code> applies Solana Token-2022 scaled UI amount when the token supports scaled UI amount extension.</li>
  </ul>
  <p><strong>Reading the numbers.</strong> <code>balance</code> is the raw token balance before decimals. <code>amount</code> is the balance after decimals or Token-2022 scaled UI amount when requested and supported.</p>
</Tab>

  <Tab title="Accessibility">
  <ul>
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
    <li>Batch CU is calculated as <code>ceil(30 * wallet_count^0.8)</code>.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Check whether a curated wallet list holds a specific token without calling the single-holder endpoint repeatedly.</li>
    <li>Power holder verification workflows for watchlists, KOL wallets, smart wallets, or internal risk lists.</li>
    <li>Enrich wallet cohorts with token balances before ranking exposure or deciding who to monitor.</li>
    <li>Build batch screens that compare which tracked wallets accumulated or still hold a token.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Send a JSON body with <code>token_address</code> and a <code>wallets</code> array.</li>
    <li>Keep each request between 1 and 500 wallet addresses.</li>
    <li>Set <code>ui_amount_mode=raw</code> for raw decimal-adjusted amounts, or <code>ui_amount_mode=scaled</code> for Solana Token-2022 scaled UI amounts when supported.</li>
    <li>Match each returned <code>owner</code> back to your submitted wallet list.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use batch holder checks when the wallet list is already known; use top-holder APIs when you need to discover holders.</li>
    <li>Deduplicate wallet addresses before calling the API to avoid wasted request size.</li>
    <li>Store zero or missing holders separately if your workflow needs to track wallets that do not currently hold the token.</li>
    <li>Pair batch balances with wallet PnL or transfer APIs when you need behavior, not just current exposure.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
    <li>Requires Premium, Business, or Enterprise access.</li>
    <li>This endpoint checks one token per request; it is not a multi-token balance endpoint.</li>
    <li>Response includes current balances, not historical balance changes.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

POST /token/v1/holder/batch

```json
{
  "tags": [
    "Holder"
  ],
  "summary": "Token - Holder (Batch)",
  "description": "Retrieve the token balance held by a list of wallet owners.",
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
  "requestBody": {
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "required": [
            "wallets",
            "token_address"
          ],
          "type": "object",
          "description": "Request body for retrieving one token balance across multiple wallet owners.",
          "properties": {
            "wallets": {
              "type": "array",
              "description": "Wallet owner addresses to check. Supports 1 to 500 wallets per request.",
              "items": {
                "type": "string",
                "description": "Wallet owner address."
              },
              "example": [
                "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
                "2fgUSSpZFi8PjyhbrETSeLutJpFsuCfWsk2H6gb3Reye"
              ]
            },
            "token_address": {
              "type": "string",
              "description": "Token mint address to check in each wallet.",
              "example": "So11111111111111111111111111111111111111112"
            }
          }
        },
        "examples": {
          "solana": {
            "value": {
              "token_address": "So11111111111111111111111111111111111111112",
              "wallets": [
                "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
                "2fgUSSpZFi8PjyhbrETSeLutJpFsuCfWsk2H6gb3Reye",
                "CZY9M9BywshFAFjPw7uLgXw9yGtNL26YypLCJdewiHo"
              ]
            }
          }
        }
      }
    }
  },
  "responses": {
    "200": {
      "description": "JSON object containing token balances held by a list of wallet owners",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "description": "Response containing token balances for a list of wallet owners.",
            "required": [
              "success",
              "data"
            ],
            "properties": {
              "success": {
                "type": "boolean",
                "description": "Indicates whether the request was successful."
              },
              "data": {
                "type": "object",
                "description": "Token balances for the requested wallet owners.",
                "properties": {
                  "items": {
                    "type": "array",
                    "description": "One balance row per wallet that holds the requested token.",
                    "items": {
                      "type": "object",
                      "description": "Token balance for one requested wallet owner.",
                      "properties": {
                        "balance": {
                          "type": "string",
                          "description": "Raw token balance held by the wallet before applying token decimals."
                        },
                        "decimals": {
                          "type": "integer",
                          "description": "Number of decimal places used by the token mint."
                        },
                        "mint": {
                          "type": "string",
                          "description": "Token mint address."
                        },
                        "owner": {
                          "type": "string",
                          "description": "Wallet address from the request."
                        },
                        "amount": {
                          "type": "number",
                          "description": "Token balance after applying decimals or Solana Token-2022 scaled UI amount when requested and supported."
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "examples": {
            "TokenMarketDataMultiple": {
              "value": {
                "data": {
                  "items": [
                    {
                      "balance": "2039280",
                      "decimals": 9,
                      "mint": "So11111111111111111111111111111111111111112",
                      "owner": "2fgUSSpZFi8PjyhbrETSeLutJpFsuCfWsk2H6gb3Reye",
                      "amount": 0.00203928
                    },
                    {
                      "balance": "1563400084419",
                      "decimals": 9,
                      "mint": "So11111111111111111111111111111111111111112",
                      "owner": "CZY9M9BywshFAFjPw7uLgXw9yGtNL26YypLCJdewiHo",
                      "amount": 1563.400084419
                    },
                    {
                      "balance": "4961135742857367",
                      "decimals": 9,
                      "mint": "So11111111111111111111111111111111111111112",
                      "owner": "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
                      "amount": 4961135.742857367
                    }
                  ]
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
  "operationId": "post-token-v1-holder-batch",
  "x-mint": {
    "href": "/data-api/holder/post-token-v1-holder-batch"
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
