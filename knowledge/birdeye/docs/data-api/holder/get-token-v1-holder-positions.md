---
title: "Token - Holder Positions"
description: "Retrieve a paginated list of wallet positions for a specified token, filtered by holder tags. Returns per-wallet trading data including PnL, volumes, and associated labels."
hidden: false
metadata:
  title: Birdeye Data API | Token - Holder Positions
  description: >-
    Retrieve a paginated list of wallet positions for a specified token,
    filtered by holder tags. Returns per-wallet trading data including PnL,
    volumes, and associated labels.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /token/v1/holder-positions"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Wallet-level positions behind holder labels.</strong></p>
  <ul>
    <li>Use <code>labels</code> to filter wallets by <code>bundler</code>, <code>sniper</code>, <code>insider</code>, <code>dev</code>, <code>smart_trader</code>, and <code>kol</code>.</li>
    <li>If <code>labels</code> is omitted, the default label is <code>bundler</code>.</li>
    <li>Each row includes wallet address, held amount, supply share, buy/sell volume, average buy price, PnL, trade counts, first trade time, and labels.</li>
    <li><code>include_zero_balance=true</code> includes wallets that traded the token but no longer hold it.</li>
    <li><code>sort_by=amount</code> ranks wallets by held amount; <code>order_type</code> controls ascending or descending order.</li>
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
    <li>This endpoint consumes <code>25 CU</code> per request.</li>
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
  <ul>
    <li><strong>kol</strong> — A tracked key-opinion-leader wallet label for this token when Birdeye classification identifies the wallet as a KOL cohort member.</li>
  </ul>
</Accordion>
<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Move from cohort summary to wallet-level evidence: inspect exactly which labeled wallets hold supply, how they traded, and where their PnL stands.</li>
    <li>Build investigative tables for bundlers, snipers, insiders, developers, smart traders, and KOL wallets behind a token.</li>
    <li>Rank tagged wallets by holding size to find the highest-impact actors still exposed to the token.</li>
    <li>Combine buy/sell volume, average buy price, first trade time, and PnL to separate conviction from extraction.</li>
    <li>Power moderation, listing review, and risk workflows that need wallet-level proof behind holder-profile signals.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Provide a Solana <code>token_address</code>.</li>
    <li>Use <code>labels=bundler,sniper,insider,dev,smart_trader,kol</code> to choose the wallet cohorts you want to inspect.</li>
    <li>Set <code>sort_by=amount&amp;order_type=desc</code> to see the largest labeled holders first.</li>
    <li>Use <code>offset</code> and <code>limit</code> to page through the result set.</li>
    <li>Set <code>ui_amount_mode=raw</code> for raw token amounts or <code>ui_amount_mode=scaled</code> for Solana Token-2022 scaled UI amounts when the token supports scaled UI amount extension.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Start from holder-profile to identify suspicious or important cohorts, then use holder-positions to inspect the exact wallets.</li>
    <li>Sort by amount descending when reviewing supply risk, then inspect PnL and buy/sell volume to understand behavior.</li>
    <li>Include zero-balance wallets when investigating extraction, exits, or early washout behavior.</li>
    <li>Combine first trade time with current holdings to distinguish early conviction from late accumulation.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
    <li><code>sort_by</code> currently supports <code>amount</code>.</li>
    <li>Supported <code>order_type</code> values are <code>asc</code> and <code>desc</code>.</li>
    <li>Results are paginated with offset up to 10,000 and limit up to 50.</li>
    <li>Holder labels depend on available indexing and classification coverage.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /token/v1/holder-positions

```json
{
  "x-metadata": {
    "new": true
  },
  "tags": [
    "Holder"
  ],
  "summary": "Token - Holder Positions",
  "description": "Retrieve a paginated list of wallet positions for a specified token, filtered by holder tags. Returns per-wallet trading data including PnL, volumes, and associated labels.",
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
      "in": "query",
      "required": true,
      "description": "Token mint address",
      "schema": {
        "type": "string",
        "example": "J3Dhvhga7QwgLWUGn43caDJtaoUTkDLmiMGqstS2Dw8A"
      }
    },
    {
      "name": "labels",
      "in": "query",
      "required": false,
      "description": "Comma-separated list of holder tags to filter by. Default: bundler",
      "style": "form",
      "explode": false,
      "schema": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": [
            "bundler",
            "sniper",
            "insider",
            "dev",
            "smart_trader",
            "kol"
          ]
        },
        "default": [
          "bundler"
        ],
        "example": [
          "bundler",
          "sniper"
        ]
      }
    },
    {
      "name": "sort_by",
      "in": "query",
      "required": false,
      "description": "Field to sort by. Default: amount",
      "schema": {
        "type": "string",
        "enum": [
          "amount"
        ],
        "default": "amount"
      }
    },
    {
      "name": "order_type",
      "in": "query",
      "required": false,
      "description": "Sort direction. Default: desc",
      "schema": {
        "type": "string",
        "enum": [
          "asc",
          "desc"
        ],
        "default": "desc"
      }
    },
    {
      "name": "ui_amount_mode",
      "in": "query",
      "required": false,
      "description": "Display mode for token amounts. Default: raw",
      "schema": {
        "type": "string",
        "enum": [
          "scaled",
          "raw"
        ],
        "default": "raw"
      }
    },
    {
      "name": "include_zero_balance",
      "in": "query",
      "required": false,
      "description": "Include wallets that have traded the token but no longer hold it (zero balance). Default: true",
      "schema": {
        "type": "boolean",
        "default": true
      }
    },
    {
      "name": "offset",
      "description": "Specify the offset for pagination. Filter for records with offset greater than the specified offset value, including those with offset equal to the specified offset.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 0
      }
    },
    {
      "name": "limit",
      "description": "Number of items per page.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 50,
        "minimum": 1,
        "maximum": 50
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON array containing token holder position details",
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
                "type": "array",
                "description": "Wallet positions matching the requested labels, one entry per wallet.",
                "items": {
                  "type": "object",
                  "description": "One wallet position row for the requested token and holder labels.",
                  "properties": {
                    "wallet_address": {
                      "type": "string",
                      "description": "Holder wallet address"
                    },
                    "hold_amount": {
                      "type": "string",
                      "description": "Token amount currently held by this wallet"
                    },
                    "percent_of_supply": {
                      "type": "number",
                      "description": "Percentage of total supply held by this wallet"
                    },
                    "buy_volume": {
                      "type": "string",
                      "description": "Total token buy volume of this wallet"
                    },
                    "sell_volume": {
                      "type": "string",
                      "description": "Total token sell volume of this wallet"
                    },
                    "buy_volume_usd": {
                      "type": "string",
                      "description": "Total buy volume in USD of this wallet"
                    },
                    "sell_volume_usd": {
                      "type": "string",
                      "description": "Total sell volume in USD of this wallet"
                    },
                    "avg_buy_price": {
                      "type": "string",
                      "description": "Average buy price in USD of this wallet"
                    },
                    "pnl": {
                      "type": "string",
                      "description": "Total PnL in USD for this wallet, realized and unrealized combined"
                    },
                    "buy_count": {
                      "type": "integer",
                      "description": "Number of buy transactions made by this wallet"
                    },
                    "sell_count": {
                      "type": "integer",
                      "description": "Number of sell transactions made by this wallet"
                    },
                    "first_trade_at": {
                      "type": "string",
                      "format": "date-time",
                      "description": "Timestamp of this wallet's first trade on the token (ISO 8601, UTC)"
                    },
                    "labels": {
                      "type": "array",
                      "description": "Labels associated with this wallet for the given token. Supported labels: `bundler`, `sniper`, `insider`, `dev`, `smart_trader`, `kol`.",
                      "items": {
                        "type": "string",
                        "enum": [
                          "bundler",
                          "sniper",
                          "insider",
                          "dev",
                          "smart_trader",
                          "kol"
                        ]
                      }
                    }
                  }
                }
              }
            }
          },
          "examples": {
            "Sample": {
              "value": {
                "success": true,
                "data": [
                  {
                    "wallet_address": "Ddh8bLNrt44uRttF7wTZcZQAy5LH4vBEJiPHinasW6Ee",
                    "hold_amount": "29071167.107303",
                    "percent_of_supply": 2.90729,
                    "buy_volume": "29071167.107303",
                    "sell_volume": "0",
                    "buy_volume_usd": "503.7999904930808",
                    "sell_volume_usd": "0",
                    "avg_buy_price": "0.00001733",
                    "pnl": "-402.7013196418882",
                    "buy_count": 8,
                    "sell_count": 0,
                    "first_trade_at": "2026-03-30T17:09:53Z",
                    "labels": [
                      "bundler",
                      "sniper"
                    ]
                  }
                ]
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
  "operationId": "get-token-v1-holder-positions",
  "x-mint": {
    "href": "/data-api/holder/get-token-v1-holder-positions"
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
