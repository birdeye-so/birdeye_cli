---
title: "Token - Trending List"
description: "Retrieve a dynamic and up-to-date list of trending tokens based on specified sorting criteria."
hidden: false
metadata:
  title: Birdeye Data API | Token - Trending List
  description: >-
    Retrieve a dynamic and up-to-date list of trending tokens based on specified
    sorting criteria.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/token_trending"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Dynamic token discovery ranked by recent trend signals.</strong></p>
  <ul>
    <li>Use sorting and interval parameters to define what “trending” means for your screen or workflow.</li>
    <li>This is a discovery endpoint, not a full token fundamentals endpoint.</li>
    <li>Results are paginated for leaderboard-style browsing.</li>
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
    <li>This endpoint consumes <code>25 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Surface hot tokens across supported chains.</li>
    <li>Build trend boards, token-discovery feeds, and alert candidates.</li>
    <li>Feed watchlist generation with recently accelerating tokens.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Choose the sort and interval parameters that match the trend horizon you care about.</li>
    <li>Page through results with <code>offset</code> and <code>limit</code>.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use this endpoint for discovery first, then hydrate shortlisted tokens with market, price, or security data.</li>
    <li>Keep the selected interval visible in product UI so users understand the trend horizon.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/token_trending

```json
{
  "tags": [
    "Creation & Trending"
  ],
  "summary": "Token - Trending List",
  "description": "Retrieve a dynamic and up-to-date list of trending tokens based on specified sorting criteria.",
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
          "rank",
          "volumeUSD",
          "liquidity"
        ],
        "default": "rank"
      }
    },
    {
      "name": "interval",
      "description": "Specify the interval of trending.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "1h",
          "4h",
          "24h"
        ],
        "default": "24h"
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
          "asc",
          "desc"
        ],
        "default": "asc"
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
      "description": "JSON object containing a list of trending tokens",
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
                "description": "Trending-token payload with ranking metadata and token rows.",
                "properties": {
                  "updateUnixTime": {
                    "type": "integer",
                    "description": "Unix timestamp in seconds when the trending snapshot was last refreshed."
                  },
                  "updateTime": {
                    "type": "string",
                    "description": "Human-readable timestamp when the trending snapshot was last refreshed."
                  },
                  "total": {
                    "type": "number",
                    "description": "Total number of tokens included in the trending ranking before pagination is applied."
                  },
                  "tokens": {
                    "type": "array",
                    "description": "Trending token rows returned for the current page.",
                    "items": {
                      "type": "object",
                      "description": "One token row from the trending list.",
                      "properties": {
                        "address": {
                          "type": "string",
                          "description": "Token mint or contract address."
                        },
                        "decimals": {
                          "type": "integer",
                          "description": "Number of decimal places used by the token."
                        },
                        "liquidity": {
                          "type": "number",
                          "description": "Current token liquidity in USD."
                        },
                        "logoURI": {
                          "type": "string",
                          "description": "Logo image URL for the token."
                        },
                        "name": {
                          "type": "string",
                          "description": "Display name of the token."
                        },
                        "symbol": {
                          "type": "string",
                          "description": "Ticker symbol for the token."
                        },
                        "volume24hUSD": {
                          "type": "number",
                          "description": "Total traded USD volume during the latest 24-hour window."
                        },
                        "volume24hChangePercent": {
                          "type": "number",
                          "description": "Percentage change in 24-hour USD volume versus the previous 24-hour window."
                        },
                        "rank": {
                          "type": "integer",
                          "description": "Trending rank of the token in the returned list."
                        },
                        "price": {
                          "type": "number",
                          "description": "Latest token price in USD."
                        },
                        "price24hChangePercent": {
                          "type": "number",
                          "description": "Percentage change in price over the latest 24-hour window."
                        },
                        "fdv": {
                          "type": "number",
                          "description": "Fully diluted valuation based on total supply and latest price."
                        },
                        "marketcap": {
                          "type": "number",
                          "description": "Current market capitalization."
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
                  "updateUnixTime": 1726681733,
                  "updateTime": "2024-09-18T17:48:53",
                  "tokens": [
                    {
                      "address": "HJXh1XULVe2Mdp6mTKd5K7of1uFqBTbmcWzvBv6cpump",
                      "decimals": 6,
                      "liquidity": 34641.80933146691,
                      "logoURI": "https://ipfs.io/ipfs/QmR7QnPaYcfwoG8oymK5JRDsB9GSgHr71mJmL2MuJ7Qk3x",
                      "name": "AVOCATO",
                      "symbol": "ATO",
                      "volume24hUSD": 1202872.3148187269,
                      "volume24hChangePercent": 33,
                      "rank": 1,
                      "price": 0.00010551649518689046,
                      "price24hChangePercent": 210,
                      "fdv": 17028232129,
                      "marketcap": 28232129
                    },
                    {
                      "address": "HYFDwieKWth1kzKbtLFMtgMVwukyvyWNYFxyQDcWpump",
                      "decimals": 6,
                      "liquidity": 73874.80948083404,
                      "logoURI": "https://ipfs.io/ipfs/QmUxhHFAugzzWmTMCMCky1QjaJNjtpBNhC2iRELb77Vqfw",
                      "name": "The Liquidator",
                      "symbol": "LIQUIDATOR",
                      "volume24hUSD": 920580.3615402475,
                      "volume24hChangePercent": 5,
                      "rank": 2,
                      "price": 0.0006106216453936813,
                      "price24hChangePercent": 12,
                      "fdv": 1495237953,
                      "marketcap": 5425292
                    }
                  ],
                  "total": 1000
                }
              }
            },
            "Tokens": {
              "value": {
                "data": {
                  "updateUnixTime": 1726681733,
                  "updateTime": "2024-09-18T17:48:53",
                  "tokens": [
                    {
                      "address": "HJXh1XULVe2Mdp6mTKd5K7of1uFqBTbmcWzvBv6cpump",
                      "decimals": 6,
                      "liquidity": 34641.80933146691,
                      "logoURI": "https://ipfs.io/ipfs/QmR7QnPaYcfwoG8oymK5JRDsB9GSgHr71mJmL2MuJ7Qk3x",
                      "name": "AVOCATO",
                      "symbol": "ATO",
                      "volume24hUSD": 1202872.3148187269,
                      "volume24hChangePercent": 33,
                      "rank": 1,
                      "price": 0.00010551649518689046,
                      "price24hChangePercent": 210,
                      "fdv": 17028232129,
                      "marketcap": 28232129
                    },
                    {
                      "address": "HYFDwieKWth1kzKbtLFMtgMVwukyvyWNYFxyQDcWpump",
                      "decimals": 6,
                      "liquidity": 73874.80948083404,
                      "logoURI": "https://ipfs.io/ipfs/QmUxhHFAugzzWmTMCMCky1QjaJNjtpBNhC2iRELb77Vqfw",
                      "name": "The Liquidator",
                      "symbol": "LIQUIDATOR",
                      "volume24hUSD": 920580.3615402475,
                      "volume24hChangePercent": 5,
                      "rank": 2,
                      "price": 0.0006106216453936813,
                      "price24hChangePercent": 12,
                      "fdv": 1495237953,
                      "marketcap": 5425292
                    }
                  ],
                  "total": 1000
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
  "operationId": "get-defi-token_trending",
  "x-mint": {
    "href": "/data-api/creation-trending/get-defi-token-trending"
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
