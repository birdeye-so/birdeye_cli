---
title: "Token - Holder Chart"
description: "Retrieve timestamped holder-count data points for visualizing a Solana token’s holder trends with configurable intervals, filters, and chart modes."
hidden: false
metadata:
  title: Birdeye Data API | Token - Holder Chart
  description: >-
    Retrieve timestamped holder-count data points for visualizing a Solana
    token’s holder trends with configurable intervals, filters, and chart modes.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /token/v1/holder/chart"
---
<br />

<Tabs>
  <Tab title="Usage Notes">
  <ul>
    <li><code>time_from</code> and <code>time_to</code> are optional. If not passed, the latest records will be returned.</li>
    <li><code>net_change</code>: Absolute change in holder count compared to the reference point. Whether this is compared to the previous interval or the beginning of the queried range depends on the percent_mode parameter</li>
    <li><code>percent_change</code>: Percentage change in holder count relative to the same reference point as net_change. Expressed as a percentage (e.g., 0.035 = 0.035%).</li>
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
  <ul>
    <li>Solana</li>
  </ul>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>25 CU</code> per request.</li>
  </ul>
</Accordion>

## Resolved API contract

GET /token/v1/holder/chart

```json
{
  "tags": [
    "Holder"
  ],
  "summary": "Token - Holder Chart",
  "description": "Retrieve timestamped holder-count data points for visualizing a Solana token’s holder trends with configurable intervals, filters, and chart modes.",
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
      "description": "Token mint address.",
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
          "value": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
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
      "name": "chart_type",
      "description": "Holder-count chart interval. Supported values: 1d, 1h, 1m, 1s. Note: 1s chart type only supports data within the last 3 days.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "1d",
          "1h",
          "1m",
          "1s"
        ],
        "default": "1h"
      }
    },
    {
      "name": "from",
      "description": "Start time for the chart as a unix timestamp in seconds.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 10000000000
      }
    },
    {
      "name": "to",
      "description": "End time for the chart as a unix timestamp in seconds.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 10000000000
      }
    },
    {
      "name": "mode",
      "description": "Controls how chart data is handled. padding fills missing timestamps to maintain continuity; no_fill returns only timestamps where values change.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "no_fill",
          "padding"
        ],
        "default": "padding"
      }
    },
    {
      "name": "percent_mode",
      "description": "Defines how holder-count percentage change is calculated. beginning compares each point with the first record; previous compares each point with the previous record.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "beginning",
          "previous"
        ],
        "default": "beginning"
      }
    },
    {
      "name": "count",
      "description": "Maximum number of chart points to return.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 20,
        "minimum": 1,
        "maximum": 100
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing token holder-count chart data",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "description": "Response containing holder-count chart data for a Solana token.",
            "required": [
              "success",
              "data"
            ],
            "properties": {
              "success": {
                "type": "boolean",
                "description": "Indicates whether the request was successful."
              },
              "data": {
                "type": "array",
                "description": "Holder-count chart points ordered according to the chart query.",
                "items": {
                  "type": "object",
                  "description": "One holder-count chart point.",
                  "properties": {
                    "timestamp": {
                      "type": "integer",
                      "description": "Timestamp of the holder-count data point as a unix timestamp in seconds."
                    },
                    "holder": {
                      "type": "integer",
                      "description": "Number of token holders at this timestamp."
                    },
                    "net_change": {
                      "type": "integer",
                      "description": "Net holder-count change compared with the baseline selected by percent_mode."
                    },
                    "percent_change": {
                      "type": "number",
                      "description": "Holder-count percentage change compared with the baseline selected by percent_mode."
                    }
                  }
                }
              }
            }
          },
          "examples": {
            "solana": {
              "value": {
                "data": [
                  {
                    "timestamp": 1763608550,
                    "holder": 4451715,
                    "net_change": -160,
                    "percent_change": -0.0035939912958023305
                  },
                  {
                    "timestamp": 1763608548,
                    "holder": 4451713,
                    "net_change": -162,
                    "percent_change": -0.00363891618699986
                  }
                ],
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
  "operationId": "get-token-v1-holder-chart",
  "x-mint": {
    "href": "/data-api/holder/get-token-v1-holder-chart"
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
