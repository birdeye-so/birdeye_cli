---
title: "Token - List (V1)"
description: "Retrieve a list of tokens on a specified chain."
hidden: false
metadata:
  title: Birdeye Data API | Token - List (V1)
  description: Retrieve a list of tokens on a specified chain.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/tokenlist"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Legacy token directory list.</strong></p>
  <ul>
    <li>This is the lighter token-list endpoint for broad token browsing on one chain.</li>
    <li><code>limit</code> supports <code>1</code> to <code>50</code> items per request.</li>
    <li><code>sort_by</code> supports <code>mc</code>, <code>v24hUSD</code>, <code>v24hChangePercent</code>, and <code>liquidity</code>.</li>
    <li><code>min_liquidity</code> defaults to <code>100</code>, which helps filter low-signal assets from the default result set.</li>
    <li><code>ui_amount_mode</code> affects token-amount fields where chain-specific scaled balances are relevant.</li>
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
    <li>This endpoint consumes <code>30 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Build token registries, simple token explorers, and asset-picking dropdowns.</li>
    <li>Power lightweight ranked lists by liquidity, market cap, or 24h volume.</li>
    <li>Preload token identity and summary rows before deeper market-data calls.</li>
    <li>Support simple browse flows where V3 screening would be overkill.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Choose <code>sort_by</code> and <code>sort_type</code> for the ranking you want.</li>
    <li>Page with <code>offset</code> and <code>limit</code>, keeping <code>limit</code> at <code>50</code> or below.</li>
    <li>Use <code>min_liquidity</code> and optional <code>max_liquidity</code> to bound the result set.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Treat this as a browse endpoint, not a full screener; move to V3 when you need richer filters.</li>
    <li>Keep <code>min_liquidity</code> explicit in production screens so result quality stays predictable.</li>
    <li>Cache token-list pages briefly when multiple users are likely to hit the same leaderboard view.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/tokenlist

```json
{
  "tags": [
    "Token/Market List"
  ],
  "summary": "Token - List (V1)",
  "description": "Retrieve a list of tokens on a specified chain.",
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
      "name": "sort_by",
      "description": "Specify the sort field.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "enum": [
          "mc",
          "v24hUSD",
          "v24hChangePercent",
          "liquidity"
        ],
        "default": "v24hUSD"
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
      "name": "offset",
      "description": "Specify the offset for pagination. Filter for records with offset greater than the specified offset value, including those with offset equal to the specified offset.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 0
      }
    },
    {
      "name": "limit",
      "description": "Number of items per page.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 50,
        "minimum": 1,
        "maximum": 50
      }
    },
    {
      "name": "min_liquidity",
      "description": "Specify the lower bound of liquidity. Filter for records with liquidity greater than the minimum liquidity value, excluding those with liquidity equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "default": 100,
        "minimum": 0
      }
    },
    {
      "name": "max_liquidity",
      "description": "Specify the upper bound of liquidity. Filter for records with liquidity less than the maximum liquidity value, excluding those with liquidity equal to the maximum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "exclusiveMinimum": 0
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
      "description": "JSON object containing a list of tokens with certain fields",
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
                "description": "Paged token-list payload with ranking metadata and token rows.",
                "properties": {
                  "updateUnixTime": {
                    "type": "integer",
                    "description": "Unix timestamp in seconds when the token list snapshot was last refreshed."
                  },
                  "updateTime": {
                    "type": "string",
                    "description": "Human-readable timestamp when the token list snapshot was last refreshed."
                  },
                  "total": {
                    "type": "number",
                    "description": "Total number of tokens matching the request before pagination is applied."
                  },
                  "tokens": {
                    "type": "array",
                    "description": "Token rows returned for the current page.",
                    "items": {
                      "type": "object",
                      "description": "One token row from the V1 token list.",
                      "properties": {
                        "address": {
                          "type": "string",
                          "description": "Token mint or contract address."
                        },
                        "decimals": {
                          "type": "integer",
                          "description": "Number of decimal places used by the token."
                        },
                        "lastTradeUnixTime": {
                          "type": "integer",
                          "description": "Unix timestamp in seconds of the latest observed trade for the token."
                        },
                        "liquidity": {
                          "type": "number",
                          "description": "Current token liquidity in USD."
                        },
                        "logoURI": {
                          "type": "string",
                          "description": "Logo image URL for the token."
                        },
                        "mc": {
                          "type": "number",
                          "description": "Current market capitalization."
                        },
                        "name": {
                          "type": "string",
                          "description": "Display name of the token."
                        },
                        "symbol": {
                          "type": "string",
                          "description": "Ticker symbol for the token."
                        },
                        "v24hChangePercent": {
                          "type": "number",
                          "description": "Percentage change in 24-hour traded token volume versus the previous 24-hour window."
                        },
                        "v24hUSD": {
                          "type": "number",
                          "description": "Total traded USD volume during the latest 24-hour window."
                        }
                      }
                    }
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
                  "updateUnixTime": 1754885276,
                  "updateTime": "2025-08-11T04:07:56.945Z",
                  "tokens": [
                    {
                      "isScaledUiToken": false,
                      "multiplier": null,
                      "address": "So11111111111111111111111111111111111111112",
                      "decimals": 9,
                      "price": 185.45023454574132,
                      "lastTradeUnixTime": 1754885221,
                      "liquidity": 23349538049.2037,
                      "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
                      "mc": 100058305776.50261,
                      "name": "Wrapped SOL",
                      "symbol": "SOL",
                      "v24hChangePercent": -1.4820129368250423,
                      "v24hUSD": 9515832024.915321
                    }
                  ],
                  "total": 298068
                }
              }
            },
            "Tokens": {
              "value": {
                "success": true,
                "data": {
                  "updateUnixTime": 1726679660,
                  "updateTime": "2024-09-18T17:14:20",
                  "tokens": [
                    {
                      "address": "So11111111111111111111111111111111111111112",
                      "decimals": 9,
                      "price": 152.37270634528284,
                      "lastTradeUnixTime": 1726679251,
                      "liquidity": 7027121030.361493,
                      "logoURI": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png",
                      "mc": 75217627246.4999,
                      "name": "Wrapped SOL",
                      "symbol": "SOL",
                      "v24hChangePercent": -6.4865412491445245,
                      "v24hUSD": 753340393.0850035
                    },
                    {
                      "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                      "decimals": 6,
                      "price": 0.99997,
                      "lastTradeUnixTime": 1726679250,
                      "liquidity": 3507793000.4033475,
                      "logoURI": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FEPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v%2Flogo.png",
                      "mc": 2973865527.5120635,
                      "name": "USD Coin",
                      "symbol": "USDC",
                      "v24hChangePercent": -20.022827653450364,
                      "v24hUSD": 364654013.9369947
                    }
                  ],
                  "total": 455148
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
  "operationId": "get-defi-tokenlist",
  "x-mint": {
    "href": "/data-api/tokenmarket-list/get-defi-tokenlist"
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
