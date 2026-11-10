---
title: "Token - Metadata (Single)"
description: "Retrieve metadata of a specified token."
hidden: false
metadata:
  title: Birdeye Data API | Token - Metadata (Single)
  description: Retrieve metadata of a specified token.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/token/meta-data/single"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Lightweight token identity lookup.</strong></p>
  <ul>
    <li>Always use the checksum contract address on EVM chains and the canonical token mint address on Solana-like chains.</li>
    <li>Token metadata can vary by chain and token standard.</li>
    <li>Response may be <code>null</code> or missing fields if metadata is not indexed or unavailable.</li>
    <li>Use this endpoint when fetching metadata for one token; use the multiple endpoint for batch lookups.</li>
    <li>Cache token metadata where possible because it changes less frequently than market data.</li>
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
  <p><strong>All chains ⛓️ ✨</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>3 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Display token names, symbols, decimals, and logos in portfolios, token pages, and trading interfaces.</li>
    <li>Enrich search results, watchlists, and token cards before adding price or liquidity data.</li>
    <li>Normalize token display across chains using one metadata lookup pattern.</li>
    <li>Validate token identity before running analytics, alerts, or token-screening workflows.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Provide <code>address</code> as the token address and set <code>x-chain</code> for the target network.</li>
    <li>Use the multiple metadata endpoint when you need to hydrate a list of tokens.</li>
    <li>Cache metadata because it changes much less often than price, liquidity, or trading activity.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Fetch metadata before rendering token tables so users see readable names and symbols instead of raw addresses.</li>
    <li>Join metadata with market-data or price endpoints for richer token cards.</li>
    <li>Store decimals with the token record so downstream amount formatting stays consistent.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/token/meta-data/single

```json
{
  "tags": [
    "Stats"
  ],
  "summary": "Token - Metadata (Single)",
  "description": "Retrieve metadata of a specified token.",
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
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing metadata of a specific token",
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
                  "symbol",
                  "name",
                  "decimals",
                  "extensions",
                  "logoURI"
                ],
                "properties": {
                  "address": {
                    "type": "string",
                    "description": "Token mint or contract address."
                  },
                  "symbol": {
                    "type": "string",
                    "description": "Ticker symbol for the token."
                  },
                  "name": {
                    "type": "string",
                    "description": "Display name of the token."
                  },
                  "decimals": {
                    "type": "integer",
                    "description": "Number of decimal places used by the token."
                  },
                  "extensions": {
                    "type": "object",
                    "description": "Optional metadata links and external identifiers collected for the token.",
                    "properties": {
                      "coingecko_id": {
                        "type": "string",
                        "description": "Coingecko asset identifier when available."
                      },
                      "website": {
                        "type": "string",
                        "description": "Official project website."
                      },
                      "twitter": {
                        "type": "string",
                        "description": "Official Twitter/X profile URL."
                      },
                      "discord": {
                        "type": "string",
                        "description": "Official Discord invite or community link."
                      },
                      "medium": {
                        "type": "string",
                        "description": "Official Medium publication URL."
                      }
                    }
                  },
                  "logo_uri": {
                    "type": "string",
                    "description": "Logo image URL for the token."
                  }
                }
              }
            }
          },
          "examples": {
            "TokenMetadata": {
              "value": {
                "data": {
                  "address": "So11111111111111111111111111111111111111112",
                  "symbol": "SOL",
                  "name": "Wrapped SOL",
                  "decimals": 9,
                  "extensions": {
                    "coingecko_id": "solana",
                    "website": "https://solana.com/",
                    "twitter": "https://twitter.com/solana",
                    "discord": "https://discordapp.com/invite/pquxPsq",
                    "medium": "https://medium.com/solana-labs"
                  },
                  "logo_uri": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png"
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
  "operationId": "get-defi-v3-token-meta-data-single",
  "x-mint": {
    "href": "/data-api/stats/get-defi-v3-token-meta-data-single"
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
