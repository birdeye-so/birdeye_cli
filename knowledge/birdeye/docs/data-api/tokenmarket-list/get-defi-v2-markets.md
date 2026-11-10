---
title: "Token - All Market List"
description: "Retrieve a list of markets for a specified token."
hidden: false
metadata:
  title: Birdeye Data API | Token - All Market List
  description: Retrieve a list of markets for a specified token.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v2/markets"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Market list for a single token.</strong></p>
  <ul>
    <li>Pass one token address to retrieve the markets or pools where that token trades.</li>
    <li><code>limit</code> supports <code>1</code> to <code>20</code> items per request.</li>
    <li><code>sort_by</code> supports <code>liquidity</code> and <code>volume24h</code>.</li>
    <li>Use this endpoint after token discovery when you need to inspect venue coverage for one asset.</li>
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
    <li>This endpoint consumes <code>20 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Discover where a token trades and which pools matter most.</li>
    <li>Compare markets by liquidity or 24h volume before charting or trade analysis.</li>
    <li>Support token detail pages that need a venue table or pool selector.</li>
    <li>Route users from token discovery into pair-level price, OHLCV, or liquidity analysis.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Pass the token address in <code>address</code>.</li>
    <li>Choose <code>sort_by=liquidity</code> or <code>sort_by=volume24h</code> depending on whether depth or activity matters more.</li>
    <li>Page with <code>offset</code> and <code>limit</code>, keeping <code>limit</code> at <code>20</code> or below.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Start by sorting on liquidity for execution-focused workflows and on volume for attention-focused workflows.</li>
    <li>Join the selected market or pair into pair-level OHLCV and liquidity endpoints for deeper venue analysis.</li>
    <li>Cache venue tables briefly, since market composition changes more slowly than spot price.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v2/markets

```json
{
  "tags": [
    "Token/Market List"
  ],
  "summary": "Token - All Market List",
  "description": "Retrieve a list of markets for a specified token.",
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
      "name": "sort_by",
      "description": "Specify the sort field.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "enum": [
          "liquidity",
          "volume24h"
        ],
        "default": "liquidity"
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
        "default": 10,
        "minimum": 1,
        "maximum": 20
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing a list of markets of a token",
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
                "description": "Market-list payload for one token.",
                "properties": {
                  "items": {
                    "type": "array",
                    "description": "Markets or pools associated with the requested token.",
                    "items": {
                      "type": "object",
                      "description": "One market or pool row. Exact fields depend on the market source returned by the service."
                    }
                  },
                  "total": {
                    "type": "integer",
                    "description": "Total number of markets or pools found for the requested token."
                  }
                }
              }
            }
          },
          "examples": {
            "Markets": {
              "value": {
                "success": true,
                "data": {
                  "items": [
                    {
                      "address": "Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb",
                      "base": {
                        "address": "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn",
                        "decimals": 9,
                        "symbol": "JitoSOL",
                        "icon": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fstorage.googleapis.com%2Ftoken-metadata%2FJitoSOL-256.png"
                      },
                      "createdAt": "2024-05-28T07:19:22.813Z",
                      "liquidity": 1733225301.1348372,
                      "name": "JitoSOL-SOL",
                      "price": null,
                      "quote": {
                        "address": "So11111111111111111111111111111111111111112",
                        "decimals": 9,
                        "icon": "https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png",
                        "symbol": "SOL"
                      },
                      "source": "Stake Pool",
                      "trade24h": 1021,
                      "trade24hChangePercent": 72.46621621621621,
                      "uniqueWallet24h": 382,
                      "uniqueWallet24hChangePercent": -13.769751693002258,
                      "volume24h": 7610352.270776577
                    }
                  ],
                  "total": 1523
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
  "operationId": "get-defi-v2-markets",
  "x-mint": {
    "href": "/data-api/tokenmarket-list/get-defi-v2-markets"
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
