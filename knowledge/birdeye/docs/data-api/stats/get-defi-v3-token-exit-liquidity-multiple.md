---
title: "Token - Liquidity (Multiple)"
description: "Provides multiple tokens' liquidity value based on USD, native tokens, and other high-liquidity assets to confirm on-chain pools have real liquidity prior to user trades. Maximum 50 addresses."
hidden: false
metadata:
  title: Birdeye Data API | Token - Liquidity (Multiple)
  description: >-
    Provides multiple tokens' liquidity value based on USD, native tokens, and
    other high-liquidity assets to confirm on-chain pools have real liquidity
    prior to user trades. Maximum 50 addresses.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/token/exit-liquidity/multiple"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Batch exit-liquidity estimate for Base tokens.</strong></p>
  <ul>
    <li>Pass token addresses as a comma-separated list in <code>list_address</code>.</li>
    <li>Maximum batch size is 50 token addresses per request.</li>
    <li>Returns exit-liquidity data for indexed Base tokens.</li>
    <li>Use this endpoint when screening or monitoring many Base tokens together.</li>
  </ul>
</Tab>

  <Tab title="Accessibility">
  <ul>
    <li>Premium</li>
    <li>Business</li>
    <li>Enterprise</li>
  </ul>
</Tab>

  <Tab title="Chain Supported">
  <p><strong>Base</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>Batch CU is calculated as <code>ceil(15 * token_count^0.8)</code>.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Screen many Base tokens for usable exit liquidity in one request.</li>
    <li>Add liquidity-risk flags to token tables, discovery feeds, and watchlists.</li>
    <li>Compare liquidity quality across a selected token set.</li>
    <li>Feed batch liquidity checks into alerts, risk dashboards, and listing review workflows.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=base</code>.</li>
    <li>Pass <code>list_address</code> as comma-separated Base token contract addresses.</li>
    <li>Use the single endpoint when a user opens one token detail page.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use batch exit liquidity for screeners where every token needs a liquidity-quality score.</li>
    <li>Deduplicate token addresses before requesting batch liquidity.</li>
    <li>Combine with market-data multiple to rank tokens by both valuation and practical liquidity.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Base only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/token/exit-liquidity/multiple

```json
{
  "tags": [
    "Stats"
  ],
  "summary": "Token - Liquidity (Multiple)",
  "description": "Provides multiple tokens' liquidity value based on USD, native tokens, and other high-liquidity assets to confirm on-chain pools have real liquidity prior to user trades. Maximum 50 addresses.",
  "parameters": [
    {
      "name": "x-chain",
      "description": "Base network only.",
      "in": "header",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "base"
        ],
        "default": "base"
      }
    },
    {
      "name": "list_address",
      "description": "A list of token addresses in string separated by commas (,)",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana": {
          "value": "So11111111111111111111111111111111111111112,mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So,EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
        },
        "ethereum": {
          "value": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce,0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
        },
        "solana_scaled_ui": {
          "value": "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh,Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg,XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp"
        }
      }
    }
  ],
  "responses": {
    "200": {
      "description": "OK",
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
                "description": "Whether the request completed successfully."
              },
              "data": {
                "type": "object",
                "description": "Batch exit-liquidity payload.",
                "required": [
                  "items"
                ],
                "properties": {
                  "items": {
                    "description": "A list of objects containing token exit liquidity data",
                    "type": "array",
                    "items": {
                      "type": "object",
                      "required": [
                        "token",
                        "exit_liquidity",
                        "liquidity",
                        "price",
                        "currency",
                        "address",
                        "name",
                        "symbol",
                        "decimals",
                        "extensions",
                        "logo_uri"
                      ],
                      "properties": {
                        "token": {
                          "type": "string",
                          "description": "Token mint or contract address used for the exit-liquidity calculation."
                        },
                        "exit_liquidity": {
                          "type": "number",
                          "description": "Estimated USD liquidity available for exiting the configured position size under the endpoint's exit-liquidity model."
                        },
                        "liquidity": {
                          "type": "number",
                          "description": "Current token liquidity in USD."
                        },
                        "price": {
                          "type": "object",
                          "description": "Latest price snapshot used for the exit-liquidity calculation.",
                          "required": [
                            "value",
                            "update_unix_time",
                            "update_human_time",
                            "update_in_slot"
                          ],
                          "properties": {
                            "value": {
                              "type": "number",
                              "description": "Latest token price in the requested quote currency."
                            },
                            "update_unix_time": {
                              "type": "integer",
                              "description": "Unix timestamp in seconds when the price snapshot was last updated."
                            },
                            "update_human_time": {
                              "type": "string",
                              "description": "Human-readable timestamp when the price snapshot was last updated."
                            },
                            "update_in_slot": {
                              "type": "integer",
                              "description": "Blockchain slot or block-equivalent associated with the price update when available."
                            }
                          }
                        },
                        "currency": {
                          "type": "string",
                          "description": "Quote currency used for price and exit-liquidity values."
                        },
                        "address": {
                          "type": "string",
                          "description": "Canonical token mint or contract address for this token."
                        },
                        "name": {
                          "type": "string",
                          "description": "Display name of the token."
                        },
                        "symbol": {
                          "type": "string",
                          "description": "Ticker symbol for the token."
                        },
                        "decimals": {
                          "type": "string",
                          "description": "Number of decimal places used by the token."
                        },
                        "extensions": {
                          "type": "object",
                          "description": "Optional token metadata links and external identifiers."
                        },
                        "logo_uri": {
                          "type": "string",
                          "description": "Logo image URL for the token."
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
                      "token": "0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42",
                      "exit_liquidity": 6719817.16468568,
                      "liquidity": 10277766.97799163,
                      "price": {
                        "value": 1.1516170107394188,
                        "update_unix_time": 1750385591,
                        "update_human_time": "2025-06-20T02:13:11",
                        "update_in_slot": 31798122
                      },
                      "currency": "USD",
                      "address": "0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42",
                      "name": "EURC",
                      "symbol": "EURC",
                      "decimals": 6,
                      "extensions": {
                        "twitter": "https://twitter.com/circlepay",
                        "website": "https://www.circle.com",
                        "telegram": null
                      },
                      "logo_uri": "https://coin-images.coingecko.com/coins/images/26045/small/euro.png?1696525125"
                    },
                    {
                      "token": "0xD7eA1d4d2528fc6Ff010006694C3489f386e2532",
                      "exit_liquidity": 162397.14079820755,
                      "liquidity": 324794.2815964151,
                      "price": {
                        "value": 0.0016673684083016622,
                        "update_unix_time": 1750385591,
                        "update_human_time": "2025-06-20T02:13:11",
                        "update_in_slot": 31798122
                      },
                      "currency": "USD",
                      "address": "0xD7eA1d4d2528fc6Ff010006694C3489f386e2532",
                      "name": "JPmorgan Dollar",
                      "symbol": "JPMD",
                      "decimals": 18,
                      "extensions": {
                        "twitter": null,
                        "website": null,
                        "telegram": null
                      },
                      "logo_uri": "https://dd.dexscreener.com/ds-data/tokens/base/0xd7ea1d4d2528fc6ff010006694c3489f386e2532.png?size=xl"
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
  "operationId": "get-defi-v3-token-exit-liquidity-multiple",
  "x-mint": {
    "href": "/data-api/stats/get-defi-v3-token-exit-liquidity-multiple"
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
