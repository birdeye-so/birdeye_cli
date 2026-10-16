---
title: "Token - Market Data (Single)"
description: "Retrieve market data of a specified token."
hidden: false
metadata:
  title: Birdeye Data API | Token - Market Data (Single)
  description: Retrieve market data of a specified token.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/token/market-data"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Focused market fundamentals for one token.</strong></p>
  <ul>
    <li>Returns current price together with liquidity, market cap, FDV, supply, circulating supply, and holder metrics when available.</li>
    <li>Use <code>ui_amount_mode=scaled</code> for Solana Token-2022 scaled UI amounts when the token supports scaled UI amount extension.</li>
    <li>Use this endpoint when you need current market state and valuation, but do not need timeframe-based trade activity or change windows.</li>
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
  <p><strong>All chains ⛓️ ✨</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>8 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Show current token price and market metrics in trading panels, portfolio dashboards, and token profile headers.</li>
    <li>Monitor liquidity, supply, holder, FDV, and market-cap signals for token health.</li>
    <li>Build ranking systems that compare valuation and liquidity quality across tokens.</li>
    <li>Combine with metadata to create lightweight but complete token cards.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Provide <code>address</code> as the token address and set <code>x-chain</code> for the target network.</li>
    <li>Set <code>ui_amount_mode=raw</code> for raw decimal-adjusted amounts, or <code>ui_amount_mode=scaled</code> for Solana Token-2022 scaled UI amounts when supported.</li>
    <li>Use this endpoint when current price, liquidity, supply, and valuation are enough for the view.</li>
    <li>Use Token Trade Data when you also need buy/sell activity, trader counts, and volume by timeframe.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use this endpoint for high-refresh token cards where Token Overview would return more data than needed.</li>
    <li>Compare liquidity and FDV together to avoid ranking tokens by valuation without market depth context.</li>
    <li>Keep <code>ui_amount_mode</code> consistent across market-data, overview, and holder endpoints for Token-2022 scaled UI amount tokens.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/token/market-data

```json
{
  "tags": [
    "Stats"
  ],
  "summary": "Token - Market Data (Single)",
  "description": "Retrieve market data of a specified token.",
  "parameters": [
    {
      "name": "x-chain",
      "description": "A chain name listed in supported networks.",
      "in": "header",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "solana",
          "ethereum",
          "bsc",
          "base",
          "robinhood",
          "arc",
          "sui",
          "mantle",
          "hyperevm",
          "arbitrum",
          "avalanche",
          "optimism",
          "polygon",
          "zksync",
          "monad",
          "aptos",
          "fogo",
          "megaeth"
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
      "description": "JSON object containing market data of a specific token",
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
                  "address",
                  "price",
                  "liquidity",
                  "total_supply",
                  "circulating_supply",
                  "market_cap",
                  "fdv"
                ],
                "properties": {
                  "address": {
                    "type": "string",
                    "description": "Token mint or contract address."
                  },
                  "price": {
                    "type": "number",
                    "description": "Latest token price in USD."
                  },
                  "liquidity": {
                    "type": "number",
                    "description": "Current token liquidity in USD."
                  },
                  "total_supply": {
                    "type": "number",
                    "description": "Total token supply tracked for market-cap calculations."
                  },
                  "circulating_supply": {
                    "type": "number",
                    "description": "Circulating token supply used for market-cap calculations."
                  },
                  "market_cap": {
                    "type": "number",
                    "description": "Current market capitalization based on circulating supply and latest price."
                  },
                  "fdv": {
                    "type": "number",
                    "description": "Fully diluted valuation based on total supply and latest price."
                  },
                  "holder": {
                    "type": "number",
                    "description": "Current number of holders when holder data is available for the chain."
                  },
                  "is_scaled_ui_token": {
                    "type": "boolean",
                    "description": "True when the token uses Solana Token-2022 scaled UI amounts."
                  },
                  "multiplier": {
                    "type": "number",
                    "description": "Scaled UI multiplier for Token-2022 assets. Present when scaled UI metadata is available."
                  }
                }
              }
            }
          },
          "examples": {
            "SolanaScaledUIAmount": {
              "value": {
                "success": true,
                "data": {
                  "address": "So11111111111111111111111111111111111111112",
                  "price": 185.74132384799458,
                  "liquidity": 23338480211.61425,
                  "total_supply": 607187823.0928401,
                  "circulating_supply": 539542621.8877238,
                  "fdv": 112779870085.64606,
                  "market_cap": 100215360861.8438,
                  "holder": 3498897,
                  "is_scaled_ui_token": false,
                  "multiplier": null
                }
              }
            },
            "TokenMarketData": {
              "value": {
                "data": {
                  "address": "So11111111111111111111111111111111111111112",
                  "liquidity": 7889932801.542948,
                  "price": 128.00523659221298,
                  "total_supply": 583981435.5103763,
                  "circulating_supply": 583981433.2307372,
                  "fdv": 74790067044.55531,
                  "market_cap": 74790067336.507,
                  "holder": 3498897
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
  "operationId": "get-defi-v3-token-market-data",
  "x-mint": {
    "href": "/data-api/stats/get-defi-v3-token-market-data"
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
