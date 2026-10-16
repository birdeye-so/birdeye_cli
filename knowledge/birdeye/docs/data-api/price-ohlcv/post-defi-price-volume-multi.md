---
title: "Price Volume - Multi"
description: "Retrieve price and volume updates of multiple tokens. Maximum 50 tokens."
hidden: false
metadata:
  title: Birdeye Data API | Price Volume - Multi
  description: Retrieve price and volume updates of multiple tokens. Maximum 50 tokens.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json POST /defi/price_volume/multi"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Batch price-plus-volume snapshots.</strong></p>
  <ul>
    <li>This endpoint is the multi-token version of <code>Price Volume - Single</code>.</li>
    <li>Maximum batch size is <code>50</code> token addresses per request.</li>
    <li>Send the token list in the POST body using the documented request schema.</li>
    <li><code>type</code> defaults to <code>24h</code> and supports shorter rolling windows for more reactive screens.</li>
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
    <li>Batch CU is calculated as <code>ceil(8 * count^0.8)</code>.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Hydrate market boards, watchlists, and comparison tables with both price and rolling volume.</li>
    <li>Rank many tokens by momentum without pulling full candle histories.</li>
    <li>Power scanners that care about price action and trading activity at the same time.</li>
    <li>Reduce request fan-out versus calling the single-token endpoint repeatedly.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Send up to <code>50</code> token addresses in the POST body.</li>
    <li>Choose the rolling window in <code>type</code>.</li>
    <li>Use the single-token variant for detail pages or isolated refreshes.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Keep one shared timeframe per screen so all rows are comparable.</li>
    <li>Deduplicate addresses before batching.</li>
    <li>Refresh this batch on a cadence that matches the timeframe sensitivity of the screen.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

POST /defi/price_volume/multi

```json
{
  "tags": [
    "Price & OHLCV"
  ],
  "summary": "Price Volume - Multi",
  "description": "Retrieve price and volume updates of multiple tokens. Maximum 50 tokens.",
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
      "name": "ui_amount_mode",
      "description": "Indicate whether to use the scaled amount for scaled ui amount tokens. Only support solana",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "raw",
          "scaled",
          "both"
        ],
        "default": "raw"
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing price and volume with changes data of multiple tokens",
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
                "description": "Map keyed by token address. Each value is the latest price-volume snapshot for that token, or `null` when data is unavailable.",
                "additionalProperties": {
                  "type": "object",
                  "required": [
                    "price",
                    "updateUnixTime",
                    "updateHumanTime",
                    "volumeUSD",
                    "volumeChangePercent",
                    "priceChangePercent"
                  ],
                  "properties": {
                    "price": {
                      "type": "number",
                      "description": "Latest token price in the requested quote currency."
                    },
                    "updateUnixTime": {
                      "type": "integer",
                      "description": "Unix timestamp in seconds when the price-volume snapshot was last updated."
                    },
                    "updateHumanTime": {
                      "type": "string",
                      "description": "Human-readable timestamp of the latest snapshot update."
                    },
                    "volumeUSD": {
                      "type": "number",
                      "description": "Trading volume in USD over the requested timeframe."
                    },
                    "volumeChangePercent": {
                      "type": "number",
                      "description": "Percentage change in trading volume versus the previous equivalent timeframe."
                    },
                    "priceChangePercent": {
                      "type": "number",
                      "description": "Percentage change in price over the requested timeframe."
                    },
                    "isScaledUiToken": {
                      "type": "boolean",
                      "description": "True when the token uses Solana Token-2022 scaled UI amounts."
                    },
                    "scaledValue": {
                      "type": "number",
                      "description": "Latest price adjusted by the scaled UI multiplier. Present for scaled UI tokens."
                    },
                    "multiplier": {
                      "type": "number",
                      "description": "Scaled UI multiplier applied to raw token values for Token-2022 assets."
                    }
                  }
                },
                "maxProperties": 10
              }
            }
          },
          "examples": {
            "Solana": {
              "value": {
                "success": true,
                "data": {
                  "So11111111111111111111111111111111111111112": {
                    "isScaledUiToken": false,
                    "price": 128.94722473832456,
                    "updateUnixTime": 1726678893,
                    "updateHumanTime": "2024-09-18T17:01:33",
                    "volumeUSD": 754317820.7943375,
                    "volumeChangePercent": -6.2958716685581955,
                    "priceChangePercent": -2.618887600381405
                  },
                  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": {
                    "isScaledUiToken": false,
                    "price": 0.00001602442261925,
                    "updateUnixTime": 1726678874,
                    "updateHumanTime": "2024-09-18T17:01:14",
                    "volumeUSD": 3196948.7086882377,
                    "volumeChangePercent": -10.538000381034182,
                    "priceChangePercent": -3.4737068687710613
                  }
                }
              }
            },
            "SolanaScaledUIAmount": {
              "value": {
                "success": true,
                "data": {
                  "So11111111111111111111111111111111111111112": {
                    "isScaledUiToken": true,
                    "price": 404.21180826549516,
                    "updateUnixTime": 1751369725,
                    "updateHumanTime": "2025-07-01T11:35:25",
                    "volumeUSD": 735344.6318917507,
                    "volumeChangePercent": null,
                    "priceChangePercent": 4.268112150090329,
                    "scaledPrice": 404.21180826549516,
                    "multiplier": 1
                  },
                  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": {
                    "isScaledUiToken": false,
                    "price": 0.00001602442261925,
                    "updateUnixTime": 1726678874,
                    "updateHumanTime": "2024-09-18T17:01:14",
                    "volumeUSD": 3196948.7086882377,
                    "volumeChangePercent": -10.538000381034182,
                    "priceChangePercent": -3.4737068687710613
                  }
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
  "requestBody": {
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "allOf": [
            {
              "required": [
                "list_address"
              ],
              "type": "object",
              "properties": {
                "list_address": {
                  "type": "string",
                  "default": "So11111111111111111111111111111111111111112,DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
                }
              }
            },
            {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "enum": [
                    "1h",
                    "2h",
                    "4h",
                    "8h",
                    "24h"
                  ],
                  "default": "24h"
                }
              }
            }
          ]
        },
        "examples": {
          "solana": {
            "value": {
              "list_address": "So11111111111111111111111111111111111111112,DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
              "type": "24h"
            }
          }
        }
      }
    }
  },
  "operationId": "post-defi-price_volume-multi",
  "x-mint": {
    "href": "/data-api/price-ohlcv/post-defi-price-volume-multi"
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
