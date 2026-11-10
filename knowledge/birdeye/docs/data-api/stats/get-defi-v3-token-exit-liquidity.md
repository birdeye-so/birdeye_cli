---
title: "Token - Liquidity (Single)"
description: "Provides a liquidity value based on USD, native tokens, and other high-liquidity assets to confirm on-chain pools have real liquidity prior to user trades."
hidden: false
metadata:
  title: Birdeye Data API | Token - Liquidity (Single)
  description: >-
    Provides a liquidity value based on USD, native tokens, and other
    high-liquidity assets to confirm on-chain pools have real liquidity prior to
    user trades.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/token/exit-liquidity"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Exit-liquidity estimate for one Base token.</strong></p>
  <ul>
    <li>Returns liquidity values based on USD, native tokens, and other high-liquidity assets.</li>
    <li>Use this endpoint when you need to understand whether a token has enough practical liquidity before user actions.</li>
    <li>This endpoint is designed for Base token liquidity analysis.</li>
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
  <p><strong>Base</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>15 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Estimate whether a Base token has enough usable liquidity before showing trade actions.</li>
    <li>Build low-liquidity and exit-liquidity warnings into token pages or internal risk tools.</li>
    <li>Combine with price and market data to evaluate whether valuation is backed by market depth.</li>
    <li>Trigger alerts when exit liquidity changes enough to affect user execution quality.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=base</code>.</li>
    <li>Provide <code>address</code> as the Base token contract address.</li>
    <li>Use the multiple endpoint when screening many Base tokens at once.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use exit liquidity alongside token price, volume, and holder distribution instead of relying on one metric.</li>
    <li>Add guardrails in trading interfaces when liquidity is thin relative to intended trade size.</li>
    <li>Refresh liquidity checks before high-impact user actions such as swaps, alerts, or listing decisions.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Base only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/token/exit-liquidity

```json
{
  "tags": [
    "Stats"
  ],
  "summary": "Token - Liquidity (Single)",
  "description": "Provides a liquidity value based on USD, native tokens, and other high-liquidity assets to confirm on-chain pools have real liquidity prior to user trades.",
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
                },
                "description": "Exit-liquidity snapshot for one token."
              }
            }
          },
          "examples": {
            "TokenExitLiquidity": {
              "value": {
                "data": {
                  "token": "0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42",
                  "exit_liquidity": 6787432.938612048,
                  "liquidity": 10355070.125772206,
                  "price": {
                    "value": 1.1515311597782227,
                    "update_unix_time": 1750385475,
                    "update_human_time": "2025-06-20T02:11:15",
                    "update_in_slot": 31798064
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
  "operationId": "get-defi-v3-token-exit-liquidity",
  "x-mint": {
    "href": "/data-api/stats/get-defi-v3-token-exit-liquidity"
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
