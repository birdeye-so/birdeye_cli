---
title: "Liquidity OHLC - Pair"
description: "A historical liquidity time-series API for Solana pools, converting raw on-chain pool states into OHLC data for TVL, token balances, and USD-denominated liquidity. It enables TradingView-style liquidity charting, deep liquidity analytics, pool-level liquidity provider tracking, abnormal liquidity event detection, manipulation and rug-risk surveillance, and quantitative backtesting of liquidity-driven strategies. Unlike traditional APIs limited to current snapshots or price/volume data, this dataset reveals the full historical evolution of pool liquidity structure over time, unlocking a new analytical layer for DeFi market intelligence and risk modeling. Maximum 100 records."
hidden: false
metadata:
  title: Birdeye Data API | Liquidity OHLC - Pair
  description: >-
    A historical liquidity time-series API for Solana pools, converting raw
    on-chain pool states into OHLC data for TVL, token balances, and
    USD-denominated liquidity. It enables TradingView-style liquidity charting,
    deep liquidity analytics, pool-level liquidity provider tracking, abnormal
    liquidity event detection, manipulation and rug-risk surveillance, and
    quantitative backtesting of liquidity-driven strategies. Unlike traditional
    APIs limited to current snapshots or price/volume data, this dataset reveals
    the full historical evolution of pool liquidity structure over time,
    unlocking a new analytical layer for DeFi market intelligence and risk
    modeling. Maximum 100 records.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/liquidity/ohlc/pair"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Historical liquidity candles for one Solana pool.</strong></p>
  <ul>
    <li>Pass a pool address and optionally anchor the query with <code>time</code>, <code>direction</code>, and <code>count</code>.</li>
    <li><code>direction</code> controls whether you page backward or forward from the anchor time.</li>
    <li>Maximum <code>count</code> is <code>100</code> records per request.</li>
    <li>Historical liquidity data is available from January 1, 2024 onward.</li>
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
    <li>CU is dynamic by resolution: base <code>20 CU</code> for <code>1m</code>, with depth and lookback multipliers applied.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Chart how pool liquidity evolved around launches, migrations, or withdrawals.</li>
    <li>Detect liquidity shocks, LP exits, or abrupt depth collapses.</li>
    <li>Support pool-level risk dashboards and rug-surveillance workflows.</li>
    <li>Study whether price moves were supported by real liquidity or happened into thin books.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Pass the pool address in <code>address</code>.</li>
    <li>Use <code>time</code> as the anchor point, <code>direction</code> to page backward or forward, and <code>count</code> up to <code>100</code>.</li>
    <li>Pair this endpoint with pair OHLCV when you want to compare price action and depth evolution side by side.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Start from the event timestamp and page outward instead of pulling random windows.</li>
    <li>Keep liquidity and price charts aligned to the same analysis window for easier diagnosis.</li>
    <li>Use this on suspicious pools first, then expand to broader monitoring if the pattern proves useful.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/liquidity/ohlc/pair

```json
{
  "x-metadata": {
    "new": true
  },
  "tags": [
    "Price & OHLCV"
  ],
  "summary": "Liquidity OHLC - Pair",
  "description": "A historical liquidity time-series API for Solana pools, converting raw on-chain pool states into OHLC data for TVL, token balances, and USD-denominated liquidity. It enables TradingView-style liquidity charting, deep liquidity analytics, pool-level liquidity provider tracking, abnormal liquidity event detection, manipulation and rug-risk surveillance, and quantitative backtesting of liquidity-driven strategies. Unlike traditional APIs limited to current snapshots or price/volume data, this dataset reveals the full historical evolution of pool liquidity structure over time, unlocking a new analytical layer for DeFi market intelligence and risk modeling. Maximum 100 records.",
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
      "name": "time",
      "description": "Unix timestamp in seconds used as the anchor time for the liquidity data window. Defaults to the latest available data point.",
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
      "description": "Maximum number of liquidity records returned. Defaults to 100 and is capped at 100.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 100,
        "minimum": 1,
        "maximum": 100
      },
      "example": 100
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing liquidity OHLC data of a pair",
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
                "description": "Liquidity OHLC candle series for the requested trading pair.",
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
                    "description": "Liquidity candles ordered by timestamp.",
                    "items": {
                      "type": "object",
                      "required": [
                        "pair_address",
                        "base_mint",
                        "quote_mint",
                        "timestamp",
                        "unix_time",
                        "open_liquidity_usd",
                        "high_liquidity_usd",
                        "low_liquidity_usd",
                        "close_liquidity_usd",
                        "open_base_balance",
                        "high_base_balance",
                        "low_base_balance",
                        "close_base_balance",
                        "open_quote_balance",
                        "high_quote_balance",
                        "low_quote_balance",
                        "close_quote_balance",
                        "base_open_price",
                        "base_high_price",
                        "base_low_price",
                        "base_close_price",
                        "quote_open_price",
                        "quote_high_price",
                        "quote_low_price",
                        "quote_close_price"
                      ],
                      "properties": {
                        "pair_address": {
                          "type": "string",
                          "description": "Pair address this liquidity candle belongs to."
                        },
                        "base_mint": {
                          "type": "string",
                          "description": "Base token mint or contract address for the pair."
                        },
                        "quote_mint": {
                          "type": "string",
                          "description": "Quote token mint or contract address for the pair."
                        },
                        "timestamp": {
                          "type": "string",
                          "format": "date-time",
                          "description": "Human-readable timestamp for the candle open time."
                        },
                        "unix_time": {
                          "type": "integer",
                          "description": "Unix timestamp in seconds for the candle open time."
                        },
                        "open_liquidity_usd": {
                          "type": "number",
                          "description": "Pair liquidity in USD at the start of the candle."
                        },
                        "high_liquidity_usd": {
                          "type": "number",
                          "description": "Highest pair liquidity in USD reached during the candle."
                        },
                        "low_liquidity_usd": {
                          "type": "number",
                          "description": "Lowest pair liquidity in USD reached during the candle."
                        },
                        "close_liquidity_usd": {
                          "type": "number",
                          "description": "Pair liquidity in USD at the end of the candle."
                        },
                        "open_base_balance": {
                          "type": "number",
                          "description": "Raw base-token reserve balance at the start of the candle."
                        },
                        "high_base_balance": {
                          "type": "number",
                          "description": "Highest raw base-token reserve balance during the candle."
                        },
                        "low_base_balance": {
                          "type": "number",
                          "description": "Lowest raw base-token reserve balance during the candle."
                        },
                        "close_base_balance": {
                          "type": "number",
                          "description": "Raw base-token reserve balance at the end of the candle."
                        },
                        "open_quote_balance": {
                          "type": "number",
                          "description": "Raw quote-token reserve balance at the start of the candle."
                        },
                        "high_quote_balance": {
                          "type": "number",
                          "description": "Highest raw quote-token reserve balance during the candle."
                        },
                        "low_quote_balance": {
                          "type": "number",
                          "description": "Lowest raw quote-token reserve balance during the candle."
                        },
                        "close_quote_balance": {
                          "type": "number",
                          "description": "Raw quote-token reserve balance at the end of the candle."
                        },
                        "open_base_amount_ui": {
                          "type": "number",
                          "description": "UI-formatted base-token reserve amount at the start of the candle."
                        },
                        "high_base_amount_ui": {
                          "type": "number",
                          "description": "Highest UI-formatted base-token reserve amount during the candle."
                        },
                        "low_base_amount_ui": {
                          "type": "number",
                          "description": "Lowest UI-formatted base-token reserve amount during the candle."
                        },
                        "close_base_amount_ui": {
                          "type": "number",
                          "description": "UI-formatted base-token reserve amount at the end of the candle."
                        },
                        "open_quote_amount_ui": {
                          "type": "number",
                          "description": "UI-formatted quote-token reserve amount at the start of the candle."
                        },
                        "high_quote_amount_ui": {
                          "type": "number",
                          "description": "Highest UI-formatted quote-token reserve amount during the candle."
                        },
                        "low_quote_amount_ui": {
                          "type": "number",
                          "description": "Lowest UI-formatted quote-token reserve amount during the candle."
                        },
                        "close_quote_amount_ui": {
                          "type": "number",
                          "description": "UI-formatted quote-token reserve amount at the end of the candle."
                        },
                        "base_open_price": {
                          "type": "number",
                          "description": "Base token price in USD at the start of the candle."
                        },
                        "base_high_price": {
                          "type": "number",
                          "description": "Highest base token price in USD during the candle."
                        },
                        "base_low_price": {
                          "type": "number",
                          "description": "Lowest base token price in USD during the candle."
                        },
                        "base_close_price": {
                          "type": "number",
                          "description": "Base token price in USD at the end of the candle."
                        },
                        "quote_open_price": {
                          "type": "number",
                          "description": "Quote token price in USD at the start of the candle."
                        },
                        "quote_high_price": {
                          "type": "number",
                          "description": "Highest quote token price in USD during the candle."
                        },
                        "quote_low_price": {
                          "type": "number",
                          "description": "Lowest quote token price in USD during the candle."
                        },
                        "quote_close_price": {
                          "type": "number",
                          "description": "Quote token price in USD at the end of the candle."
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
                    "description": "Number of candles requested from the upstream liquidity data service."
                  },
                  "next_cursor": {
                    "type": "integer",
                    "nullable": true,
                    "description": "Unix timestamp cursor for the next page of newer candles."
                  },
                  "prev_cursor": {
                    "type": "integer",
                    "nullable": true,
                    "description": "Unix timestamp cursor for the previous page of older candles."
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
                      "pair_address": "DyoDLq79qKTia7Q2aSEbrsjpvzjbZi1YhxjrEhctWPLQ",
                      "base_mint": "So11111111111111111111111111111111111111112",
                      "quote_mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                      "timestamp": "2025-06-26T15:14:00Z",
                      "unix_time": 1750950840,
                      "open_liquidity_usd": 35.54838054600674,
                      "high_liquidity_usd": 70.98678138336354,
                      "low_liquidity_usd": 2.86407480456388e-7,
                      "close_liquidity_usd": 2.86407480456388e-7,
                      "open_base_balance": 247500003,
                      "high_base_balance": 247500003,
                      "low_base_balance": 1,
                      "close_base_balance": 1,
                      "open_quote_balance": 11,
                      "high_quote_balance": 222979861711,
                      "low_quote_balance": 11,
                      "close_quote_balance": 222979861711,
                      "open_base_amount_ui": 0.247500003,
                      "high_base_amount_ui": 0.247500003,
                      "low_base_amount_ui": 1e-9,
                      "close_base_amount_ui": 1e-9,
                      "open_quote_amount_ui": 0.000011,
                      "high_quote_amount_ui": 222979.861711,
                      "low_quote_amount_ui": 0.000011,
                      "close_quote_amount_ui": 222979.861711,
                      "base_open_price": 143.2943958969169,
                      "base_high_price": 143.4076374200358,
                      "base_low_price": 143.20374022819402,
                      "base_close_price": 143.20374022819402,
                      "quote_open_price": 7547.011966964857,
                      "quote_high_price": 160566.25292547484,
                      "quote_low_price": 400.6525017637174,
                      "quote_close_price": 400.6525017637174
                    }
                  ],
                  "direction": "next",
                  "limit": 100,
                  "next_cursor": 1750950900,
                  "prev_cursor": 1750950780,
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
  "operationId": "get-defi-v3-liquidity-ohlc-pair",
  "x-mint": {
    "href": "/data-api/price-ohlcv/get-defi-v3-liquidity-ohlc-pair"
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
