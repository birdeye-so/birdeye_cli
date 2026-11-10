---
title: "Wallet - Net Worth Chart"
description: "Retrieve the historical net worth (total asset value) of a wallet over time, with daily, hourly granularity."
hidden: false
metadata:
  title: Birdeye Data API | Wallet - Net Worth Chart
  description: >-
    Retrieve the historical net worth (total asset value) of a wallet over time,
    with daily, hourly granularity.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /wallet/v2/net-worth"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Historical Solana net worth chart.</strong></p>
  <ul>
    <li><code>count</code> supports <code>1</code> to <code>90</code> intervals.</li>
    <li><code>type</code> accepts <code>1h</code> and <code>1d</code>.</li>
    <li><code>direction</code> controls whether the series is built backward or forward from <code>time</code>.</li>
    <li><code>time</code> must use <code>YYYY-MM-DD HH:mm:ss</code> in UTC, must not be in the future, and when <code>type=1h</code> it must be within the last 7 days.</li>
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
  <p><strong>Solana</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>50 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Chart wallet net worth over time for portfolio-performance views.</li>
    <li>Show how a wallet's value changed before and after major trades or market events.</li>
    <li>Support treasury reporting and wallet-performance dashboards.</li>
    <li>Compare trend direction before inspecting token-level PnL.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Pass the wallet address in <code>wallet</code>.</li>
    <li>Choose <code>type=1h</code> for short windows and <code>type=1d</code> for broader history.</li>
    <li>Use <code>time</code>, <code>direction</code>, and <code>count</code> to anchor and shape the series you want.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use <code>1d</code> for most product dashboards and reserve <code>1h</code> for recent, event-driven analysis.</li>
    <li>Keep chart timezone labeling in UTC unless your UI explicitly converts it.</li>
    <li>Align this chart with PnL or price timelines when telling a wallet-performance story.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
    <li><code>type=1h</code> is limited to the last 7 days.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /wallet/v2/net-worth

```json
{
  "x-metadata": {
    "released_at": 1752105600,
    "new": true
  },
  "tags": [
    "Wallet, Networth & PnL"
  ],
  "summary": "Wallet - Net Worth Chart",
  "description": "Retrieve the historical net worth (total asset value) of a wallet over time, with daily, hourly granularity.",
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
      "name": "wallet",
      "description": "The wallet of the account.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana": {
          "value": "eJpBLoF3bgXpzjxqJRAvMchjEo4EqdAmiQh3ASmEtZT"
        }
      }
    },
    {
      "name": "count",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 7,
        "minimum": 1,
        "maximum": 90
      }
    },
    {
      "name": "direction",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "back",
          "forward"
        ],
        "default": "back"
      }
    },
    {
      "name": "time",
      "description": "Time get net worth. Default is current time.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string"
      },
      "example": "2025-07-30 02:00:00"
    },
    {
      "name": "type",
      "in": "query",
      "required": false,
      "description": "Time granularity used to group the returned net worth data. Use `1d` for daily data with full historical coverage, or `1h` for hourly data limited to the last 7 days.",
      "schema": {
        "type": "string",
        "enum": [
          "1h",
          "1d"
        ],
        "default": "1d"
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
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing net worth of an address",
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
                "properties": {
                  "wallet_address": {
                    "type": "string",
                    "description": "Wallet address whose history was requested."
                  },
                  "currency": {
                    "type": "string",
                    "description": "Display currency used for valuation."
                  },
                  "current_timestamp": {
                    "type": "string",
                    "description": "Timestamp of the latest history point in the response."
                  },
                  "past_timestamp": {
                    "type": "string",
                    "description": "Start timestamp of the requested comparison window."
                  },
                  "history": {
                    "type": "array",
                    "description": "Historical net-worth points for the wallet.",
                    "items": {
                      "type": "object",
                      "properties": {
                        "timestamp": {
                          "type": "string",
                          "description": "Timestamp of the history point."
                        },
                        "net_worth": {
                          "type": [
                            "number",
                            "string"
                          ],
                          "description": "Net worth at this timestamp."
                        },
                        "net_worth_change": {
                          "type": [
                            "number",
                            "string"
                          ],
                          "description": "Absolute net-worth change versus the comparison baseline."
                        },
                        "net_worth_change_percent": {
                          "type": [
                            "number",
                            "string"
                          ],
                          "description": "Percentage net-worth change versus the comparison baseline."
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
                  "wallet_address": "HV1KXxWFaSeriyFvXyx48FqG9BoFbfinB8njCJonqP7K",
                  "currency": "usd",
                  "current_timestamp": "2025-07-31T23:59:59Z",
                  "past_timestamp": "2025-07-01T23:59:59Z",
                  "history": [
                    {
                      "timestamp": "2025-07-30T23:59:59Z",
                      "net_worth": 13210463.21,
                      "net_worth_change": 1971274.94,
                      "net_worth_change_percent": 17.54
                    },
                    {
                      "timestamp": "2025-07-29T23:59:59Z",
                      "net_worth": 11839478.54,
                      "net_worth_change": 600290.26,
                      "net_worth_change_percent": 5.35
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
  "operationId": "get-wallet-v2-net-worth",
  "x-mint": {
    "href": "/data-api/wallet-networth-pnl/get-wallet-v2-net-worth"
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
