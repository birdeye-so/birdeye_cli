---
title: "Token - New listing"
description: "Retrieve a list of newly listed tokens."
hidden: false
metadata:
  title: Birdeye Data API | Token - New listing
  description: Retrieve a list of newly listed tokens.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v2/tokens/new_listing"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Recently listed token discovery.</strong></p>
  <ul>
    <li>This endpoint returns newly listed tokens and is intended for fresh-launch monitoring.</li>
    <li><code>limit</code> supports <code>1</code> to <code>20</code> items per request.</li>
    <li>If provided, <code>time_to</code> must stay within the last 3 days.</li>
    <li><code>meme_platform_enabled=true</code> includes meme-platform aware discovery behavior where supported.</li>
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
  <p><strong>All supported chains except Sui</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>20 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Monitor fresh token launches and seed candidate pipelines for research or trading.</li>
    <li>Power new-listing dashboards, alert feeds, and launch-watch pages.</li>
    <li>Track very recent supply entering the market before it shows up in broader ranked lists.</li>
    <li>Combine with security, holder, and price endpoints to triage new listings quickly.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Use <code>limit</code> to control batch size, keeping it at <code>20</code> or below.</li>
    <li>Optionally pass <code>time_to</code> when you want a bounded recent window, but keep it within the last 3 days.</li>
    <li>Enable <code>meme_platform_enabled</code> if your workflow explicitly cares about meme-platform launches.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Poll this endpoint on a tight cadence and deduplicate by token address in your ingestion layer.</li>
    <li>Rank or triage results immediately with security, liquidity, and holder checks so the feed stays actionable.</li>
    <li>Treat new listings as discovery leads, not quality signals on their own.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v2/tokens/new_listing

```json
{
  "tags": [
    "Token/Market List"
  ],
  "summary": "Token - New listing",
  "description": "Retrieve a list of newly listed tokens.",
  "parameters": [
    {
      "name": "x-chain",
      "description": "A chain name listed in supported networks except Sui.",
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
      "name": "time_to",
      "description": "Specify the end time using unix timestamps in seconds",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 10000000000
      },
      "example": 1726704000
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
    },
    {
      "name": "meme_platform_enabled",
      "description": "Enable to receive token new listing from meme platforms (eg: pump.fun). This filter only supports Solana.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "boolean",
        "enum": [
          true,
          false
        ],
        "default": false
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing a list of newly listed tokens",
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
                "description": "New-listing payload containing recently detected token launches.",
                "properties": {
                  "items": {
                    "type": "array",
                    "description": "Recently listed tokens returned for the request.",
                    "items": {
                      "type": "object",
                      "description": "One newly listed token entry.",
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
                        "source": {
                          "type": "string",
                          "description": "Listing source or venue that surfaced the token."
                        },
                        "liquidityAddedAt": {
                          "type": "string",
                          "description": "Timestamp when liquidity was first added or the listing was first detected."
                        },
                        "logoURI": {
                          "type": "string",
                          "description": "Logo image URL for the token."
                        },
                        "liquidity": {
                          "type": "number",
                          "description": "Initial or current liquidity in USD captured for the listing."
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "examples": {
            "NewListing": {
              "value": {
                "success": true,
                "data": {
                  "items": [
                    {
                      "address": "6Zk9e3nfXdYLXHYu5NvDiPHGMcjujVBv6gWRr7ckSdhP",
                      "symbol": "TOPCAT",
                      "name": "TOPCAT",
                      "decimals": 9,
                      "source": "raydium",
                      "liquidityAddedAt": "2024-09-18T17:59:23",
                      "logoURI": null,
                      "liquidity": 15507.41635596545
                    },
                    {
                      "address": "DsWUsiseYxAHZXEvq5cVcymYaohk8Gpe8E4otsjFpump",
                      "symbol": "Onigiri",
                      "name": "Onigiri",
                      "decimals": 6,
                      "source": "raydium",
                      "liquidityAddedAt": "2024-09-18T17:57:14",
                      "logoURI": "https://ipfs.io/ipfs/QmfXbLtRVuTTkazYqQix4R8FYW4Xkj2ZEnWKhLpGugaLQr",
                      "liquidity": 32994.397007045525
                    }
                  ]
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
  "operationId": "get-defi-v2-tokens-new_listing",
  "x-mint": {
    "href": "/data-api/tokenmarket-list/get-defi-v2-tokens-new-listing"
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
