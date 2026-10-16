---
title: "Wallet - Current Net Worth Summary (Multiple)"
description: "Retrieve the current total asset value of multiple wallets. Maximum 100 wallets per request."
hidden: false
metadata:
  title: Birdeye Data API | Wallet - Current Net Worth Summary (Multiple)
  description: >-
    Retrieve the current total asset value of multiple wallets. Maximum 100
    wallets per request.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json POST /wallet/v2/net-worth-summary/multiple"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Current portfolio value for multiple Solana wallets.</strong></p>
  <ul>
    <li>Send up to <code>100</code> wallet addresses in the POST body.</li>
    <li>This endpoint returns current total asset value summaries, not detailed holdings breakdowns.</li>
    <li>Use it for batch wallet valuation across leaderboards, cohorts, or watchlists.</li>
  </ul>
</Tab>

  <Tab title="Accessibility">
  <ul>
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
    <li>Batch CU is calculated as <code>ceil(20 * wallet_count^0.8)</code>.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Value many wallets at once for cohort monitoring or whale boards.</li>
    <li>Build internal watchlists of treasury wallets, smart money wallets, or tracked accounts.</li>
    <li>Compare total wallet size across a batch before deeper research.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Send up to <code>100</code> wallet addresses in the POST body.</li>
    <li>Use this summary endpoint first, then follow up on individual wallets with detailed portfolio endpoints.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use this endpoint as a cheap batch prefilter before opening per-wallet detail pages.</li>
    <li>Deduplicate wallet addresses before sending the body.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Business and Enterprise only.</li>
    <li>Solana only.</li>
  </ul>
</Accordion>


## Resolved API contract

POST /wallet/v2/net-worth-summary/multiple

```json
{
  "x-metadata": {
    "released_at": 1761782400,
    "new": true
  },
  "tags": [
    "Wallet, Networth & PnL"
  ],
  "summary": "Wallet - Current Net Worth Summary (Multiple)",
  "description": "Retrieve the current total asset value of multiple wallets. Maximum 100 wallets per request.",
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
              ]
            }
          }
        }
      }
    }
  },
  "responses": {
    "200": {
      "description": "JSON object containing summary networth",
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
                  "currency": {
                    "type": "string",
                    "description": "Display currency used for valuation."
                  },
                  "current_timestamp": {
                    "type": "string",
                    "description": "Timestamp when the valuation snapshot was computed."
                  },
                  "wallets": {
                    "type": "object",
                    "description": "Map keyed by wallet address to current net-worth summary.",
                    "additionalProperties": {
                      "type": "object",
                      "additionalProperties": true,
                      "properties": {
                        "value": {
                          "type": [
                            "number",
                            "string"
                          ],
                          "description": "Current net worth of the wallet in the selected currency."
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
                "data": {
                  "currency": "usd",
                  "current_timestamp": "2025-10-30T03:33:40.980036224Z",
                  "wallets": {
                    "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1": {
                      "value": "1764819473.530063"
                    },
                    "WLHv2UAZm6z4KyaaELi5pjdbJh6RESMva1Rnn8pJVVh": {
                      "value": "3508619230.707581"
                    }
                  }
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
  "operationId": "post-wallet-v2-net-worth-summary-multiple",
  "x-mint": {
    "href": "/data-api/wallet-networth-pnl/post-wallet-v2-net-worth-summary-multiple"
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
