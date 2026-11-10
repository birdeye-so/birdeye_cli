---
title: "Liquidity Latest - Token"
description: "Retrieve the latest total, exit, and stable liquidity with the latest price for Solana token addresses. Lite packages can request one address. Starter and higher packages can request up to 100 addresses."
hidden: false
metadata:
  title: Birdeye Data API | Liquidity Latest - Token
  description: >-
    Retrieve the latest total, exit, and stable liquidity with the latest price
    for Solana token addresses. Lite packages can request one address. Starter
    and higher packages can request up to 100 addresses.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json POST /defi/v3/liquidity/latest/token"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Latest liquidity snapshot for one or many Solana tokens.</strong></p>
  <ul>
    <li>Send token mints in the POST body under <code>addresses</code>.</li>
    <li>The request accepts <code>1</code> to <code>100</code> addresses after deduplication.</li>
    <li>Lite plans can request only one address; multi-address requests require Starter or higher.</li>
    <li>This endpoint returns the latest total, exit, and stable liquidity together with the latest price context.</li>
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
  <p><strong>Solana</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>Batch CU is calculated as <code>ceil(5 * token_count^0.8)</code>.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Fetch the newest liquidity snapshot for one or many tokens before ranking or screening them.</li>
    <li>Power token tables that need current liquidity alongside current price.</li>
    <li>Detect sudden drops in exit liquidity or stable liquidity before they show up in slower dashboards.</li>
    <li>Pre-check market depth quality before routing further analysis or trading actions.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Send <code>addresses</code> in the POST body.</li>
    <li>Keep the body at <code>100</code> addresses or fewer, and expect Lite plans to work only with a single address.</li>
    <li>Use liquidity history or liquidity OHLC endpoints when you need a time series instead of the latest snapshot.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Deduplicate token mints before sending the batch so you do not waste request capacity.</li>
    <li>Use this endpoint as a cheap liquidity prefilter before more expensive historical analysis.</li>
    <li>Surface total liquidity and exit liquidity separately in UI because they answer different risk questions.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

POST /defi/v3/liquidity/latest/token

```json
{
  "x-metadata": {
    "new": true
  },
  "tags": [
    "Price & OHLCV"
  ],
  "summary": "Liquidity Latest - Token",
  "description": "Retrieve the latest total, exit, and stable liquidity with the latest price for Solana token addresses. Lite packages can request one address. Starter and higher packages can request up to 100 addresses.",
  "parameters": [
    {
      "name": "x-chain",
      "description": "Solana network only.",
      "in": "header",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "solana"
        ],
        "default": "solana"
      }
    }
  ],
  "requestBody": {
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "required": [
            "addresses"
          ],
          "type": "object",
          "properties": {
            "addresses": {
              "type": "array",
              "minItems": 1,
              "maxItems": 100,
              "description": "Lite packages can request one address. Starter and higher packages can request up to 100 addresses.",
              "items": {
                "type": "string"
              },
              "example": [
                "2RaLR1kY37bbNfqWTK49AiCbPtdF27497jZ6DatKpump"
              ]
            }
          }
        },
        "examples": {
          "solana": {
            "value": {
              "addresses": [
                "2RaLR1kY37bbNfqWTK49AiCbPtdF27497jZ6DatKpump"
              ]
            }
          }
        }
      }
    }
  },
  "responses": {
    "200": {
      "description": "JSON object containing latest liquidity data of tokens",
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
                "description": "Latest liquidity snapshots for the requested tokens.",
                "required": [
                  "items"
                ],
                "properties": {
                  "items": {
                    "type": "array",
                    "description": "Latest liquidity items for each requested token.",
                    "items": {
                      "type": "object",
                      "required": [
                        "token",
                        "liquidity_usd",
                        "exit_liquidity_usd",
                        "stable_liquidity_usd",
                        "price"
                      ],
                      "properties": {
                        "token": {
                          "type": "string",
                          "description": "Token address for this liquidity snapshot."
                        },
                        "liquidity_usd": {
                          "type": "number",
                          "description": "Current token liquidity in USD."
                        },
                        "exit_liquidity_usd": {
                          "type": "number",
                          "description": "Current estimated exit liquidity in USD."
                        },
                        "stable_liquidity_usd": {
                          "type": "number",
                          "description": "Current liquidity in USD across pools paired with top coins, counting both sides of each pool."
                        },
                        "price": {
                          "type": "number",
                          "nullable": true,
                          "description": "Latest token price used alongside the liquidity snapshot when available."
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "examples": {
            "Solana": {
              "value": {
                "success": true,
                "data": {
                  "items": [
                    {
                      "token": "2RaLR1kY37bbNfqWTK49AiCbPtdF27497jZ6DatKpump",
                      "liquidity_usd": 0.431778300255171,
                      "exit_liquidity_usd": 0.143926100085057,
                      "stable_liquidity_usd": 0.287852200170114,
                      "price": 0.00002468
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
  "operationId": "post-defi-v3-liquidity-latest-token",
  "x-mint": {
    "href": "/data-api/price-ohlcv/post-defi-v3-liquidity-latest-token"
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
