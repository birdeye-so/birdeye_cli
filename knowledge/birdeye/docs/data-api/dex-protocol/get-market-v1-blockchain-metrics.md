---
title: "Blockchain Market Metrics"
description: "Retrieves market metrics for the specified blockchain, aggregated by the specified time frame. The response includes trading metrics (trading volume, trade count, and active trading tokens) aggregated over each time frame, and snapshot metric (stablecoin market capitalization) representing values at the end of each time frame."
hidden: false
metadata:
  title: Birdeye Data API | Blockchain Market Metrics
  description: >-
    Retrieves market metrics for the specified blockchain, aggregated by the
    specified time frame. The response includes trading metrics (trading volume,
    trade count, and active trading tokens) aggregated over each time frame, and
    snapshot metric (stablecoin market capitalization) representing values at
    the end of each time frame.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /market/v1/blockchain-metrics"
---
<Tabs>
  <Tab title="Usage Notes">
  <p><strong>Data Availability</strong></p>
  <ul>
    <li>Trading volume, Trade count, and Active trading tokens: From 2022-01-01 00:00 UTC (unix timestamp: 1640995200)</li>
    <li>Stablecoin market capitalization: From 2025-05-22 00:00 UTC (unix timestamp: 1747872000)</li>
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
    <li>This endpoint consumes <code>40 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Track historical blockchain activity through trading volume, transaction count, active trading tokens, and stablecoin market capitalization.</li>
    <li>Build dashboards to monitor market activity and stablecoin growth over time.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Specify the target <code>chain</code> and the desired <code>time_frame</code> for data aggregation.</li>
    <li>Provide a reference <code>time</code> and a <code>direction</code> (<code>backward</code> or <code>forward</code>) to retrieve historical time frames relative to that timestamp.</li>
    <li>Each record represents a single time frame. <code>unix_time</code> is the UTC timestamp of the beginning of the time frame. Trading metrics are aggregated over the time frame, while <code>stable_coin_market_cap</code> represents the value at the end of the time frame.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Analyze <code>volume_usd</code>, <code>trade_count</code>, and <code>active_trading_tokens</code> together to distinguish increased trading activity from broader market participation.</li>
    <li>Compare trading activity with <code>stable_coin_market_cap</code> to understand how changes in on-chain stablecoin supply relate to market activity.</li>
  </ul>
</Accordion>

<Accordion title="Notes 📝" icon="fa-circle-info">
  <ul>
    <li><code>volume_usd</code>, <code>trade_count</code>, and <code>active_trading_tokens</code> are aggregated over each time frame.</li>
    <li><code>stable_coin_market_cap</code> represents the market capitalization as of the end of each time frame.</li>
    <li><code>time</code> is used only to determine the starting time frame. If it does not align with the specified <code>time_frame</code>, it is mapped to the corresponding time frame.</li>
    <li><code>unix_time</code> always represents the start of the corresponding time frame in UTC.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /market/v1/blockchain-metrics

```json
{
  "x-metadata": {
    "released_at": 1784617627,
    "new": true
  },
  "tags": [
    "DEX & Protocol"
  ],
  "summary": "Blockchain Market Metrics",
  "description": "Retrieves market metrics for the specified blockchain, aggregated by the specified time frame. The response includes trading metrics (trading volume, trade count, and active trading tokens) aggregated over each time frame, and snapshot metric (stablecoin market capitalization) representing values at the end of each time frame.",
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
    },
    {
      "name": "time_frame",
      "description": "The aggregation interval for the returned data.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "1D"
        ],
        "default": "1D"
      }
    },
    {
      "name": "time",
      "description": "The reference unix timestamp in seconds to start retrieving data. Defaults to the current time.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 0,
        "maximum": 10000000000
      },
      "example": 1750950840
    },
    {
      "name": "direction",
      "description": "The retrieval direction relative to the reference time.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "backward",
          "forward"
        ],
        "default": "backward"
      }
    },
    {
      "name": "count",
      "description": "Limit the number of data records returned.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 10,
        "minimum": 1,
        "maximum": 10
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing market metrics of a specified chain.",
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
                "type": "object",
                "properties": {
                  "items": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "unix_time": {
                          "type": "integer",
                          "description": "The Unix timestamp in seconds (UTC timezone) of the beginning of the aggregated time frame."
                        },
                        "volume_usd": {
                          "type": "number",
                          "description": "The total trading volume in USD for the corresponding time frame."
                        },
                        "trade_count": {
                          "type": "number",
                          "description": "The total number of trades during the corresponding time frame."
                        },
                        "active_trading_tokens": {
                          "type": "number",
                          "description": "The number of unique tokens with at least one trade during the corresponding time frame."
                        },
                        "stable_coin_market_cap": {
                          "type": "number",
                          "description": "The total market capitalization (USD) of all stablecoins on the selected blockchain at the end of the corresponding time frame."
                        }
                      }
                    }
                  },
                  "has_more": {
                    "type": "boolean",
                    "description": "Indicates whether there are more data points available beyond the current response."
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
                      "unix_time": 1784505600,
                      "volume_usd": 6830233087.9298725,
                      "trade_count": 28959937,
                      "active_trading_tokens": 70410,
                      "stable_coin_market_cap": 14836981086.24842
                    },
                    {
                      "unix_time": 1784505600,
                      "volume_usd": 843958590.8503149,
                      "trade_count": 3335919,
                      "active_trading_tokens": 13823,
                      "stable_coin_market_cap": 14760991987.594704
                    }
                  ],
                  "has_more": true
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
  "operationId": "get-market-v1-blockchain-metrics",
  "x-mint": {
    "href": "/data-api/dex-protocol/get-market-v1-blockchain-metrics"
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
