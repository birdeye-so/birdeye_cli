---
title: "Token - Tag Holdings Chart"
description: "Retrieve timestamped holder and holding data grouped by Solana holder tag type. Each tag returns up to 100 chart points."
hidden: false
metadata:
  title: Birdeye Data API | Token - Tag Holdings Chart
  description: >-
    Retrieve timestamped holder and holding data grouped by Solana holder tag
    type. Each tag returns up to 100 chart points.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /token/v1/chart/tag-holdings"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Holder and holding trends grouped by wallet tag.</strong></p>
  <ul>
    <li><code>tag_type</code> supports <code>bundler</code> and <code>sniper</code>. Omit it to return all supported tag series.</li>
    <li><code>chart_type</code> controls the time interval and supports <code>1d</code>, <code>1h</code>, and <code>1m</code>.</li>
    <li><code>time_from</code> and <code>time_to</code> are unix timestamps in seconds. <code>time_to</code> defaults to now.</li>
    <li>Each tag series contains timestamped points with <code>total_holder</code>, <code>total_holding</code>, and <code>time</code>.</li>
  </ul>
  <p><strong>Reading the numbers.</strong> <code>total_holder</code> is the number of wallets with the tag that hold the token at that point. <code>total_holding</code> is the token amount held by that tagged cohort.</p>
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
    <li>This endpoint consumes <code>20 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Wallet Tag Definitions 🏷️" icon="fa-tags">
  <ul>
    <li><strong>dev</strong> — The wallet that created the token: the mint creator from the initialize-mint transaction.</li>
  </ul>
  <ul>
    <li><strong>sniper</strong> — A wallet that bought within the first <code>n</code> blocks of the token, counted from the token's first swap. On Solana, <code>n = 5</code>; a buy qualifies when its slot is within <code>first_trade_slot + 5</code>.</li>
  </ul>
  <ul>
    <li><strong>bundler</strong> — Coordinated buying detected in either level:</li>
    <li>Level 1: at least 4 buy transactions in the same slot.</li>
    <li>Level 2: at least 3 distinct wallets buying across adjacent slots, where max slot gap is 1.</li>
  </ul>
  <ul>
    <li><strong>insider</strong> — A wallet that received the token directly from the Chef wallet via token transfer, not via a swap.</li>
  </ul>
  <ul>
    <li><strong>smart_trader</strong> — A non-bot wallet ranked in Top Realized PnL over the last 90 days with realized PnL &gt; $10,000. Wallets identified as bots are excluded before ranking and never receive this tag.</li>
  </ul>
</Accordion>
<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Turn holder labels into a living time series: watch bundler and sniper cohorts expand, shrink, accumulate, or distribute over time.</li>
    <li>Build launch-quality charts that show whether suspicious early cohorts are still holding meaningful supply after trading begins.</li>
    <li>Detect changing risk posture when tagged holder count falls while tagged holding remains high, or when holding drops sharply across a short window.</li>
    <li>Pair tag holdings with price and volume charts to understand whether labeled wallets are supporting momentum or selling into demand.</li>
    <li>Create narrative research panels that show how token ownership evolves from launch concentration toward broader or riskier distribution.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Provide a Solana <code>token_address</code>.</li>
    <li>Choose <code>chart_type=1m</code>, <code>1h</code>, or <code>1d</code> based on the granularity you need.</li>
    <li>Use <code>tag_type=bundler</code>, <code>tag_type=sniper</code>, or omit <code>tag_type</code> to return all supported tags.</li>
    <li>Use <code>time_from</code> and <code>time_to</code> to focus on a launch window, volatility event, or post-launch period.</li>
    <li>Plot <code>total_holder</code> and <code>total_holding</code> together to see both cohort size and token exposure.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Compare holder count and holding amount together; a small holder count with high holding can signal concentrated tagged exposure.</li>
    <li>Align tag-holding changes with price and volume candles to see whether tagged cohorts accumulated before momentum or distributed into demand.</li>
    <li>Use this endpoint for time-series cohort behavior, then use holder-positions when you need the exact wallets.</li>
    <li>Keep the chart window focused; shorter windows make launch and exit patterns easier to interpret.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
    <li>Supported <code>tag_type</code> values are <code>bundler</code> and <code>sniper</code>.</li>
    <li>Supported <code>chart_type</code> values are <code>1d</code>, <code>1h</code>, and <code>1m</code>.</li>
    <li>Each tag returns up to 100 chart points.</li>
    <li>This endpoint returns tagged cohort trends, not individual wallet-level positions.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /token/v1/chart/tag-holdings

```json
{
  "tags": [
    "Holder"
  ],
  "summary": "Token - Tag Holdings Chart",
  "description": "Retrieve timestamped holder and holding data grouped by Solana holder tag type. Each tag returns up to 100 chart points.",
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
      "name": "token_address",
      "description": "Token contract address.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana": {
          "value": "J3Dhvhga7QwgLWUGn43caDJtaoUTkDLmiMGqstS2Dw8A"
        }
      }
    },
    {
      "name": "chart_type",
      "description": "Chart interval: 1d, 1h, 1m.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "1d",
          "1h",
          "1m"
        ],
        "default": "1d"
      }
    },
    {
      "name": "tag_type",
      "description": "Comma-separated holder tag types. Omit to return all supported tag types.",
      "in": "query",
      "required": false,
      "style": "form",
      "explode": false,
      "schema": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": [
            "bundler",
            "sniper"
          ]
        },
        "default": [
          "bundler",
          "sniper"
        ],
        "example": [
          "bundler",
          "sniper"
        ]
      }
    },
    {
      "name": "time_from",
      "description": "Start time using unix timestamp in seconds. Defaults to 3 months before the current time.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 10000000000
      }
    },
    {
      "name": "time_to",
      "description": "End time using unix timestamp in seconds. Defaults to the current time.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 10000000000
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing holder chart data grouped by tag type",
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
                "description": "Whether the request succeeded."
              },
              "data": {
                "type": "object",
                "description": "Holder time series grouped by holder tag type. Each key is a tag type and maps to its time series. Supported tag types: `bundler`, `sniper`. Only the tag types requested via the tag_type parameter are returned.",
                "properties": {
                  "bundler": {
                    "type": "array",
                    "description": "Holder time series for a single tag type, ordered from newest to oldest.",
                    "items": {
                      "type": "object",
                      "description": "A single data point in the holder time series for a tag type.",
                      "properties": {
                        "total_holder": {
                          "type": "integer",
                          "description": "Number of wallets carrying this tag that hold the token at this data point."
                        },
                        "total_holding": {
                          "type": "number",
                          "description": "Total token amount held by the tagged wallets at this data point."
                        },
                        "time": {
                          "type": "integer",
                          "description": "Start time of the data point as a unix timestamp in seconds."
                        }
                      }
                    }
                  },
                  "sniper": {
                    "type": "array",
                    "description": "Holder time series for a single tag type, ordered from newest to oldest.",
                    "items": {
                      "type": "object",
                      "description": "A single data point in the holder time series for a tag type.",
                      "properties": {
                        "total_holder": {
                          "type": "integer",
                          "description": "Number of wallets carrying this tag that hold the token at this data point."
                        },
                        "total_holding": {
                          "type": "number",
                          "description": "Total token amount held by the tagged wallets at this data point."
                        },
                        "time": {
                          "type": "integer",
                          "description": "Start time of the data point as a unix timestamp in seconds."
                        }
                      }
                    }
                  }
                },
                "additionalProperties": {
                  "type": "array",
                  "description": "Holder time series for a single tag type, ordered from newest to oldest.",
                  "items": {
                    "type": "object",
                    "description": "A single data point in the holder time series for a tag type.",
                    "properties": {
                      "total_holder": {
                        "type": "integer",
                        "description": "Number of wallets carrying this tag that hold the token at this data point."
                      },
                      "total_holding": {
                        "type": "number",
                        "description": "Total token amount held by the tagged wallets at this data point."
                      },
                      "time": {
                        "type": "integer",
                        "description": "Start time of the data point as a unix timestamp in seconds."
                      }
                    }
                  }
                }
              }
            }
          },
          "examples": {
            "solana": {
              "value": {
                "data": {
                  "bundler": [
                    {
                      "total_holder": 2,
                      "total_holding": 0.000002,
                      "time": 1700697600
                    }
                  ],
                  "sniper": [
                    {
                      "total_holder": 1,
                      "total_holding": 0,
                      "time": 1700697600
                    }
                  ]
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
  "operationId": "get-token-v1-chart-tag-holdings",
  "x-mint": {
    "href": "/data-api/holder/get-token-v1-chart-tag-holdings"
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
