---
title: "Token - Market Data (Multiple)"
description: "Retrieve market data of multiple tokens. Maximum 20 addresses."
hidden: false
metadata:
  title: Birdeye Data API | Token - Market Data (Multiple)
  description: Retrieve market data of multiple tokens. Maximum 20 addresses.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/token/market-data/multiple"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Batch market fundamentals for multiple tokens.</strong></p>
  <ul>
    <li>Pass token addresses as a comma-separated list in <code>list_address</code>.</li>
    <li>Maximum batch size is 20 token addresses per request.</li>
    <li>Returns current price, liquidity, valuation, supply, and holder metrics for each indexed token in the request.</li>
    <li>Use <code>ui_amount_mode=scaled</code> for Solana Token-2022 scaled UI amounts when tokens support scaled UI amount extension.</li>
  </ul>
</Tab>

  <Tab title="Accessibility">
  <ul>
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
    <li>Batch CU is calculated as <code>ceil(8 * count^0.8)</code>.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Build watchlists or token screeners with current price and market data for many tokens.</li>
    <li>Refresh portfolio token metrics in fewer API calls.</li>
    <li>Compare liquidity, valuation, supply, and holder signals across a selected token set.</li>
    <li>Power scheduled alert systems that evaluate many tokens together.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Pass <code>list_address</code> as comma-separated token addresses.</li>
    <li>Set <code>ui_amount_mode=raw</code> or <code>scaled</code> consistently with your Token-2022 amount handling.</li>
    <li>Use this endpoint when every row needs current price plus market fundamentals, but not per-timeframe trade windows.</li>
    <li>Use the single endpoint when a user opens one token detail page.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use this endpoint for batch dashboards and screeners instead of looping over single-token calls.</li>
    <li>Deduplicate addresses before requesting market data.</li>
    <li>Combine with metadata multiple to render clean token tables with both identity and market context.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/token/market-data/multiple

```json
{
  "tags": [
    "Stats"
  ],
  "summary": "Token - Market Data (Multiple)",
  "description": "Retrieve market data of multiple tokens. Maximum 20 addresses.",
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
      "description": "JSON object containing market data of multiple tokens",
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
                "description": "Map keyed by token address. Each value is the token market-data object for that token, or `null` when market data is unavailable.",
                "additionalProperties": {
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
                },
                "maxProperties": 50
              }
            }
          },
          "examples": {
            "SolanaScaledUIAmount": {
              "value": {
                "success": true,
                "data": {
                  "So11111111111111111111111111111111111111112": {
                    "address": "So11111111111111111111111111111111111111112",
                    "price": 185.9491010572536,
                    "liquidity": 23338480211.61425,
                    "total_supply": 607187786.3995525,
                    "circulating_supply": 539542585.1183889,
                    "fdv": 112906023053.9405,
                    "market_cap": 100327458684.87115,
                    "holder": 398897,
                    "is_scaled_ui_token": false,
                    "multiplier": null
                  },
                  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So": {
                    "address": "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
                    "price": 244.42542119470204,
                    "liquidity": 41563027.3417533,
                    "total_supply": 3548170.779026702,
                    "circulating_supply": 3548170.779026702,
                    "fdv": 867263137.1343358,
                    "market_cap": 867263137.1343358,
                    "holder": 3498897,
                    "is_scaled_ui_token": false,
                    "multiplier": null
                  },
                  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": {
                    "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                    "price": 0.9999,
                    "liquidity": 1317751947.580185,
                    "total_supply": 8861727603.599123,
                    "circulating_supply": 8861727603.599123,
                    "fdv": 8860841430.838762,
                    "market_cap": 8860841430.838762,
                    "holder": 498897,
                    "is_scaled_ui_token": false,
                    "multiplier": null
                  }
                }
              }
            },
            "TokenMarketDataMultiple": {
              "value": {
                "data": {
                  "So11111111111111111111111111111111111111112": {
                    "address": "So11111111111111111111111111111111111111112",
                    "liquidity": 7889932801.542948,
                    "price": 128.00523659221298,
                    "total_supply": 583981435.5103763,
                    "circulating_supply": 583981433.2307372,
                    "fdv": 74790067044.55531,
                    "holder": 3498897,
                    "market_cap": 74790067336.507
                  },
                  "NeonTjSjsuo3rexg9o6vHuMXw62f9V7zvmu8M8Zut44": {
                    "address": "NeonTjSjsuo3rexg9o6vHuMXw62f9V7zvmu8M8Zut44",
                    "liquidity": 151316.56751659588,
                    "price": 0.1813036976418708,
                    "total_supply": 999999903.3262283,
                    "circulating_supply": 999999903.3262283,
                    "fdv": 181303680.11455852,
                    "holder": 498897,
                    "market_cap": 181303680.11455852
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
  "operationId": "get-defi-v3-token-market-data-multiple",
  "x-mint": {
    "href": "/data-api/stats/get-defi-v3-token-market-data-multiple"
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
