---
title: "Token - Metadata (Multiple)"
description: "Retrieve metadata of multiple tokens. Maximum 50 addresses."
hidden: false
metadata:
  title: Birdeye Data API | Token - Metadata (Multiple)
  description: Retrieve metadata of multiple tokens. Maximum 50 addresses.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/token/meta-data/multiple"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Batch token identity lookup.</strong></p>
  <ul>
    <li>Always use checksum contract addresses on EVM chains and canonical token mint addresses on Solana-like chains.</li>
    <li>Pass token addresses as a comma-separated list in <code>list_address</code>.</li>
    <li>Maximum batch size is 50 token addresses per request.</li>
    <li>Token metadata can vary by chain and token standard.</li>
    <li>Response entries may be <code>null</code> or missing fields if metadata is not indexed or unavailable for a token.</li>
    <li>Use this endpoint for batch metadata lookups across token lists, watchlists, search results, or portfolio rows.</li>
    <li>Cache token metadata where possible because it changes less frequently than market data.</li>
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
  <p><strong>All chains ⛓️ ✨</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>Batch CU is calculated as <code>ceil(3 * count^0.8)</code>.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Hydrate token lists with names, symbols, decimals, and logos in one request.</li>
    <li>Prepare metadata for portfolio, screener, and watchlist pages.</li>
    <li>Reduce request volume when loading many token cards at once.</li>
    <li>Join metadata with price, volume, and liquidity data for richer token tables.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Pass <code>list_address</code> as comma-separated token addresses.</li>
    <li>Cache returned metadata and refresh it less frequently than market metrics.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use this endpoint before batch market-data calls so every row has readable token identity.</li>
    <li>Deduplicate token addresses before calling to keep requests clean.</li>
    <li>Store token decimals from metadata as shared formatting context for balances, prices, and quantities.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/token/meta-data/multiple

```json
{
  "tags": [
    "Stats"
  ],
  "summary": "Token - Metadata (Multiple)",
  "description": "Retrieve metadata of multiple tokens. Maximum 50 addresses.",
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
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing metadata of multiple tokens",
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
                "description": "Map keyed by token address. Each value is the metadata object for that token, or `null` when metadata is unavailable.",
                "additionalProperties": {
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
                },
                "maxProperties": 50
              }
            }
          },
          "examples": {
            "TokenMetadataMultiple": {
              "value": {
                "data": {
                  "So11111111111111111111111111111111111111112": {
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
                  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": {
                    "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                    "decimals": 6,
                    "symbol": "USDC",
                    "name": "USD Coin",
                    "extensions": {
                      "coingecko_id": "usd-coin",
                      "website": "https://www.circle.com/en/usdc",
                      "twitter": "https://twitter.com/circle",
                      "medium": "https://medium.com/centre-blog",
                      "discord": "https://discord.com/invite/buildoncircle"
                    },
                    "logo_uri": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FEPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v%2Flogo.png"
                  }
                },
                "success": true
              }
            },
            "MissingTokenMetadataMultiple": {
              "value": {
                "data": {
                  "So11111111111111111111111111111111111111112": null,
                  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": null
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
  "operationId": "get-defi-v3-token-meta-data-multiple",
  "x-mint": {
    "href": "/data-api/stats/get-defi-v3-token-meta-data-multiple"
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
