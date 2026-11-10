---
title: "Wallet Supported Networks"
description: "Retrieve a list of all wallet supported networks."
hidden: false
metadata:
  title: Birdeye Data API | Wallet Supported Networks
  description: Retrieve a list of all wallet supported networks.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /v1/wallet/list_supported_chain"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>List of wallet API supported networks.</strong></p>
  <ul>
    <li>Use this endpoint to discover which wallet networks are currently available before sending wallet portfolio or PnL requests.</li>
    <li>This is a lightweight capability-check endpoint and is useful for client-side network selectors or backend feature gating.</li>
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
    <li>Populate wallet-network dropdowns and supported-chain badges.</li>
    <li>Gate wallet features dynamically instead of hardcoding chain assumptions.</li>
    <li>Check compatibility before routing users into wallet portfolio or PnL flows.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Call this endpoint at app startup or cache the result in your backend.</li>
    <li>Use the returned network list to decide which wallet endpoints to expose for a given chain.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Cache the supported network list and refresh it occasionally rather than on every page load.</li>
    <li>Use this endpoint as a source of truth when new wallet chains roll out.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /v1/wallet/list_supported_chain

```json
{
  "tags": [
    "Wallet, Networth & PnL"
  ],
  "summary": "Wallet Supported Networks",
  "description": "Retrieve a list of all wallet supported networks.",
  "responses": {
    "200": {
      "description": "A list of supported networks for wallet APIs",
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
              "solana"
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
  "operationId": "get-v1-wallet-list_supported_chain",
  "x-mint": {
    "href": "/data-api/wallet-networth-pnl/get-v1-wallet-list-supported-chain"
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
