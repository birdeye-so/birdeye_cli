---
title: "Supported Networks"
description: "Retrieve a list of all supported networks."
hidden: false
metadata:
  title: Birdeye Data API | Supported Networks
  description: Retrieve a list of all supported networks.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/networks"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Discovery endpoint for current Birdeye network coverage.</strong></p>
  <ul>
    <li>Use this endpoint when your app needs to present or validate supported chain choices dynamically.</li>
    <li>Response is network metadata, not token or market data.</li>
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
    <li>This endpoint consumes <code>1 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Build chain selectors from live supported-network data.</li>
    <li>Validate user-selected networks before firing deeper API calls.</li>
    <li>Keep multichain products aligned with Birdeye coverage as networks evolve.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Call the endpoint without token or wallet parameters.</li>
    <li>Cache the result and refresh it infrequently.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use this as the source of truth for supported-network UI and validation.</li>
    <li>Refresh on a slower cadence than market data because network coverage changes less often.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/networks

```json
{
  "tags": [
    "Blockchain"
  ],
  "summary": "Supported Networks",
  "description": "Retrieve a list of all supported networks.",
  "responses": {
    "200": {
      "description": "A list of supported networks",
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
                "type": "boolean"
              },
              "data": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          },
          "example": {
            "success": true,
            "data": [
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
            ]
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
  "operationId": "get-defi-networks",
  "x-mint": {
    "href": "/data-api/blockchain/get-defi-networks"
  },
  "parameters": [],
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
