---
title: "Liquidity History - Pair"
description: "Retrieve point-in-time historical liquidity snapshots for a Solana trading pair."
hidden: false
metadata:
  title: Birdeye Data API | Liquidity History - Pair
  description: Retrieve point-in-time historical liquidity snapshots for a Solana trading pair.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/liquidity/history/pair"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Historical pair liquidity snapshots on Solana.</strong></p>
  <ul>
    <li>Returns point-in-time liquidity snapshots for a trading pair.</li>
    <li>Use either <code>unix_time</code> or <code>block_number</code> as the cursor; they are mutually exclusive.</li>
    <li>Use <code>step</code> for sampled points and <code>skip_empty</code> to control repeated snapshots.</li>
    <li>The endpoint returns up to <code>100</code> records per request.</li>
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
    <li>This endpoint consumes <code>5 CU</code> per request.</li>
    <li>When <code>count</code> is provided, batch CU is calculated as <code>ceil(5 × count^0.5)</code>.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Track historical liquidity changes for a trading pair.</li>
    <li>Build execution-quality, depth, and market-health dashboards.</li>
    <li>Join pair liquidity history with price, trades, and OHLCV data.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code> and pass the pair address.</li>
    <li>Choose either a Unix timestamp or Solana slot as the cursor.</li>
    <li>Use <code>direction</code>, <code>step</code>, and <code>count</code> to page or sample the history.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use <code>block_number</code> when the consumer is indexed by Solana slots.</li>
    <li>Use <code>unix_time</code> for time-series charts and external market-data joins.</li>
    <li>Keep <code>count</code> and <code>step</code> aligned with the chart resolution to avoid redundant points.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /defi/v3/liquidity/history/pair

```json
{
  "x-metadata": {
    "new": true
  },
  "tags": [
    "Price & OHLCV"
  ],
  "summary": "Liquidity History - Pair",
  "description": "Retrieve point-in-time historical liquidity snapshots for a Solana trading pair. Maximum 100 records.",
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
      "name": "address",
      "description": "The address of a pair contract",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana": {
          "value": "4DoNfFBfF7UokCC2FQzriy7yHK6DY6NVdYpuekQ5pRgg"
        },
        "ethereum": {
          "value": "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"
        }
      }
    },
    {
      "name": "unix_time",
      "description": "Unix timestamp in seconds. Mutually exclusive with block_number. Defaults to the latest available data when neither unix_time nor block_number is provided.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 0,
        "maximum": 10000000000
      }
    },
    {
      "name": "block_number",
      "description": "Solana slot (block number) used as the cursor. Mutually exclusive with unix_time. Pagination cursors use slots when this parameter is supplied.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 0,
        "maximum": 9007199254740991
      }
    },
    {
      "name": "step",
      "description": "Optional sampling interval in slots for a block_number cursor or seconds for a unix_time cursor. When omitted, returns actual historical snapshots without regular sampling. With skip_empty=false, each sampling point uses the latest snapshot at or before it. With skip_empty=true, repeated snapshots are skipped.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 9007199254740991
      }
    },
    {
      "name": "skip_empty",
      "description": "For step sampling, false fills each requested point with the latest snapshot at or before it. True skips repeated snapshots using the existing skip/dedup behavior.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "boolean",
        "default": false
      }
    },
    {
      "name": "direction",
      "description": "Direction to query liquidity records from the anchor time. Use back for older records and forward for newer records.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "back",
          "forward"
        ],
        "default": "back"
      },
      "example": "back"
    },
    {
      "name": "count",
      "description": "Maximum number of historical points returned. Defaults to 1 and is capped at 100. Batch CU is ceil(5 × count^0.5).",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 100,
        "default": 1
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing historical liquidity snapshots of a pair",
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
                "description": "Historical liquidity snapshots for the requested trading pair.",
                "required": [
                  "items",
                  "direction",
                  "limit",
                  "next_cursor",
                  "prev_cursor",
                  "has_more"
                ],
                "properties": {
                  "items": {
                    "type": "array",
                    "description": "Point-in-time pair liquidity snapshots ordered by the selected cursor.",
                    "items": {
                      "type": "object",
                      "required": [
                        "unix_time",
                        "block_number",
                        "liquidity_usd",
                        "exit_liquidity_usd",
                        "base_amount",
                        "quote_amount",
                        "base_price",
                        "quote_price"
                      ],
                      "properties": {
                        "input_block_number": {
                          "type": "number",
                          "nullable": true,
                          "description": "Requested sampling block number for this point. Only returned for block_number queries; omitted for unix_time queries. Null when unavailable from upstream. May differ from the actual block_number selected by the as-of lookup."
                        },
                        "input_unix_time": {
                          "type": "number",
                          "nullable": true,
                          "description": "Requested sampling Unix timestamp in seconds for this point. Returned for unix_time queries (including the default time cursor); omitted for block_number queries. Null when unavailable from upstream. May differ from the actual unix_time of the snapshot."
                        },
                        "block_number": {
                          "type": "number",
                          "nullable": true,
                          "description": "Actual Solana slot (block number) of the liquidity snapshot selected by the as-of lookup, not the requested sampling slot. Multiple sampled points may share the same block number. Null when unavailable from upstream."
                        },
                        "unix_time": {
                          "type": "number",
                          "nullable": true,
                          "description": "Unix timestamp in seconds for this liquidity snapshot."
                        },
                        "liquidity_usd": {
                          "type": "number",
                          "nullable": true,
                          "description": "Total pair liquidity in USD at this timestamp."
                        },
                        "exit_liquidity_usd": {
                          "type": "number",
                          "nullable": true,
                          "description": "Estimated exit liquidity in USD at this timestamp."
                        },
                        "base_amount": {
                          "type": "number",
                          "nullable": true,
                          "description": "Base-token amount held by the pair at this timestamp."
                        },
                        "quote_amount": {
                          "type": "number",
                          "nullable": true,
                          "description": "Quote-token amount held by the pair at this timestamp."
                        },
                        "base_price": {
                          "type": "number",
                          "nullable": true,
                          "description": "Base-token price in USD at this timestamp."
                        },
                        "quote_price": {
                          "type": "number",
                          "nullable": true,
                          "description": "Quote-token price in USD at this timestamp."
                        }
                      }
                    }
                  },
                  "direction": {
                    "type": "string",
                    "enum": [
                      "next",
                      "prev"
                    ],
                    "description": "Internal cursor direction returned for the current result window."
                  },
                  "limit": {
                    "type": "integer",
                    "description": "Number of history points requested from the upstream liquidity data service."
                  },
                  "next_cursor": {
                    "type": "integer",
                    "nullable": true,
                    "description": "Cursor for the next page of newer history points: a Solana slot when querying by block_number, otherwise Unix seconds."
                  },
                  "prev_cursor": {
                    "type": "integer",
                    "nullable": true,
                    "description": "Cursor for the previous page of older history points: a Solana slot when querying by block_number, otherwise Unix seconds."
                  },
                  "has_more": {
                    "type": "boolean",
                    "description": "Whether another page is available in the returned direction."
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
                      "unix_time": 1707348246,
                      "block_number": 123456,
                      "input_unix_time": 1707348245,
                      "liquidity_usd": 101.21,
                      "exit_liquidity_usd": 90.5,
                      "base_amount": 966354838.709678,
                      "quote_amount": 1.00123192,
                      "base_price": 0,
                      "quote_price": 101.08562267000286
                    }
                  ],
                  "direction": "next",
                  "limit": 10,
                  "next_cursor": 1707348247,
                  "prev_cursor": 1707348246,
                  "has_more": true
                }
              }
            }
          }
        }
      }
    },
    "400": {
      "description": "Invalid query parameters",
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
          "examples": {
            "MissingAddress": {
              "value": {
                "success": false,
                "message": "address is required"
              }
            },
            "InvalidAddress": {
              "value": {
                "success": false,
                "message": "address is invalid format"
              }
            },
            "InvalidTime": {
              "value": {
                "success": false,
                "message": "time must be an integer Unix timestamp in seconds between 0 and 10000000000"
              }
            },
            "InvalidDirection": {
              "value": {
                "success": false,
                "message": "direction must be one of: back, forward"
              }
            },
            "InvalidCount": {
              "value": {
                "success": false,
                "message": "count must be an integer between 1 and 100"
              }
            }
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
    "422": {
      "description": "The liquidity data service rejected the request",
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
            "message": "cursor must be a Unix timestamp"
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
    },
    "502": {
      "description": "The liquidity data service returned an invalid response",
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
            "message": "Invalid response from liquidity history service: data must be an array"
          }
        }
      }
    },
    "503": {
      "description": "The liquidity data service is unavailable",
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
            "message": "Liquidity history service is temporarily unavailable"
          }
        }
      }
    }
  },
  "operationId": "get-defi-v3-liquidity-history-pair",
  "x-mint": {
    "href": "/data-api/price-ohlcv/get-defi-v3-liquidity-history-pair"
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
