---
title: "Token - Holder Profile"
description: "Retrieve holder profile summary for a specified token, including token market data, holder summary, and breakdown by holder tags (bundler, sniper, insider, dev, smart_trader, kol)."
hidden: false
metadata:
  title: Birdeye Data API | Token - Holder Profile
  description: >-
    Retrieve holder profile summary for a specified token, including token
    market data, holder summary, and breakdown by holder tags (bundler, sniper,
    insider, dev, smart_trader, kol).
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /token/v1/holder-profile"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Cohort-level holder summary for labeled wallets.</strong></p>
  <ul>
    <li>Supported holder tags are <code>bundler</code>, <code>sniper</code>, <code>insider</code>, <code>dev</code>, <code>smart_trader</code>, and <code>kol</code>.</li>
    <li><code>holder_summary</code> aggregates all labeled holders returned by the profile.</li>
    <li><code>tags</code> breaks the token down by holder label, with holder count, held amount, supply share, buy/sell volume, average buy price, and PnL.</li>
    <li><code>top10_holder</code> summarizes the token's top 10 holders separately from labeled cohorts.</li>
    <li><code>include_zero_balance=true</code> includes wallets that traded the token but no longer hold it.</li>
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
    <li>Compress token-holder intelligence into one executive snapshot: market context, top-holder concentration, labeled-holder exposure, and cohort-level PnL.</li>
    <li>Score token quality by comparing how much supply is controlled by bundlers, snipers, insiders, developers, smart traders, and KOL cohorts.</li>
    <li>Build risk panels that highlight whether suspicious cohorts dominate supply or whether higher-quality smart-money wallets are participating.</li>
    <li>Track cohort conviction through hold amount, percent of supply, buy/sell volume, average buy price, and unrealized PnL.</li>
    <li>Use as the top-level overview before drilling into Holder Positions for the exact wallets behind each label.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Provide a Solana <code>token_address</code>.</li>
    <li>Use <code>interval=1h</code> for the volume fields returned in the profile.</li>
    <li>Set <code>ui_amount_mode=raw</code> for raw token amounts or <code>ui_amount_mode=scaled</code> for Solana Token-2022 scaled UI amounts when the token supports scaled UI amount extension.</li>
    <li>Set <code>include_zero_balance=false</code> when you only want wallets that still hold the token.</li>
    <li>Read <code>token</code>, <code>holder_summary</code>, and <code>tags</code> together to connect market context with cohort behavior.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use holder-profile as the first stop for token-holder risk review, then drill into holder-positions for wallet-level evidence.</li>
    <li>Compare <code>percent_of_supply</code> across labels before trusting volume alone; small active cohorts can still control meaningful supply.</li>
    <li>Watch for a high share of bundler, sniper, insider, or dev holdings when evaluating launch quality.</li>
    <li>Treat smart-trader participation as one signal among several; validate it against liquidity, price action, and current holdings.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
    <li><code>interval</code> currently supports <code>1h</code>.</li>
    <li>Holder labels depend on available indexing and classification coverage.</li>
    <li>Cohort summaries are not wallet-level evidence; use holder-positions when you need exact wallets.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /token/v1/holder-profile

```json
{
  "x-metadata": {
    "new": true
  },
  "tags": [
    "Holder"
  ],
  "summary": "Token - Holder Profile",
  "description": "Retrieve holder profile summary for a specified token, including token market data, holder summary, and breakdown by holder tags (bundler, sniper, insider, dev, smart_trader, kol).",
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
      "name": "interval",
      "in": "query",
      "required": false,
      "description": "Time interval for volume data. Default: 1h",
      "schema": {
        "type": "string",
        "enum": [
          "1h"
        ],
        "default": "1h"
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
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing token holder profile summary",
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
                "description": "Holder-profile payload for the requested token.",
                "properties": {
                  "token": {
                    "type": "object",
                    "description": "Market and issuance context for the token tied to the holder profile.",
                    "properties": {
                      "creation_time": {
                        "type": "integer",
                        "description": "Token creation time as unix timestamp"
                      },
                      "market_cap": {
                        "type": "number",
                        "description": "Current market cap in USD"
                      },
                      "liquidity": {
                        "type": "number",
                        "description": "Current liquidity in USD"
                      },
                      "volume_1h": {
                        "type": "number",
                        "description": "Total trade volume in token amount over the selected interval"
                      },
                      "volume_1h_usd": {
                        "type": "number",
                        "description": "Total trade volume in USD over the selected interval"
                      },
                      "buy_volume_1h": {
                        "type": "number",
                        "description": "Buy volume in token amount over the selected interval"
                      },
                      "buy_volume_1h_usd": {
                        "type": "number",
                        "description": "Buy volume in USD over the selected interval"
                      },
                      "sell_volume_1h": {
                        "type": "number",
                        "description": "Sell volume in token amount over the selected interval"
                      },
                      "sell_volume_1h_usd": {
                        "type": "number",
                        "description": "Sell volume in USD over the selected interval"
                      },
                      "is_scaled_ui_token": {
                        "type": "boolean",
                        "description": "Whether this token has scaled UI amount. Always returned regardless of ui_amount_mode."
                      },
                      "top10_holder": {
                        "type": "object",
                        "description": "Aggregated stats for the top 10 holders",
                        "properties": {
                          "hold_amount": {
                            "type": "string",
                            "description": "Total token amount held by the top 10 holders"
                          },
                          "percent_of_supply": {
                            "type": "number",
                            "description": "Percentage of total supply held by the top 10 holders"
                          }
                        }
                      }
                    }
                  },
                  "holder_summary": {
                    "type": "object",
                    "description": "Aggregated stats across all labeled holders",
                    "properties": {
                      "total_holder": {
                        "type": "integer",
                        "description": "Total number of labeled holders"
                      },
                      "total_holding": {
                        "type": "number",
                        "description": "Total token amount held by all labeled holders"
                      },
                      "percent_of_supply": {
                        "type": "number",
                        "description": "Percentage of total supply held by all labeled holders"
                      }
                    }
                  },
                  "tags": {
                    "type": "array",
                    "description": "Breakdown by holder tag, one entry per tag. Supported tags: `bundler`, `sniper`, `insider`, `dev`, `smart_trader`, `kol`. A tag with no matching holder is still returned, with zeroed metrics.",
                    "items": {
                      "type": "object",
                      "properties": {
                        "tag": {
                          "type": "string",
                          "enum": [
                            "bundler",
                            "sniper",
                            "insider",
                            "dev",
                            "smart_trader",
                            "kol"
                          ],
                          "description": "Holder category tag."
                        },
                        "holder_count": {
                          "type": "integer",
                          "description": "Number of wallets with this tag that currently hold the token"
                        },
                        "hold_amount": {
                          "type": "string",
                          "description": "Total token amount held by wallets with this tag"
                        },
                        "percent_of_supply": {
                          "type": "number",
                          "description": "Percentage of total supply held by wallets with this tag"
                        },
                        "buy_volume": {
                          "type": "string",
                          "description": "Total token buy volume by wallets with this tag"
                        },
                        "sell_volume": {
                          "type": "string",
                          "description": "Total token sell volume by wallets with this tag"
                        },
                        "buy_volume_usd": {
                          "type": "string",
                          "description": "Total buy volume in USD by wallets with this tag"
                        },
                        "sell_volume_usd": {
                          "type": "string",
                          "description": "Total sell volume in USD by wallets with this tag"
                        },
                        "avg_buy_price": {
                          "type": "string",
                          "description": "Average buy price in USD across all wallets with this tag"
                        },
                        "pnl": {
                          "type": "string",
                          "description": "Total PnL in USD for wallets with this tag, realized and unrealized combined"
                        }
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
                "data": {
                  "token": {
                    "creation_time": 1743621183,
                    "market_cap": 76953.927132964,
                    "liquidity": 31093.1204999,
                    "volume_1h": 98369093.075709,
                    "volume_1h_usd": 7724.716658279683,
                    "buy_volume_1h": 55864766.46463199,
                    "buy_volume_1h_usd": 4389.081586003591,
                    "sell_volume_1h": 42504326.61107701,
                    "sell_volume_1h_usd": 3335.6350722760917,
                    "is_scaled_ui_token": false,
                    "top10_holder": {
                      "hold_amount": "328262230.042939",
                      "percent_of_supply": 32.82937
                    }
                  },
                  "holder_summary": {
                    "total_holder": 409,
                    "total_holding": 516552632.417262,
                    "percent_of_supply": 51.660209
                  },
                  "tags": [
                    {
                      "tag": "bundler",
                      "holder_count": 404,
                      "hold_amount": "504468333.328127",
                      "percent_of_supply": 50.45166,
                      "buy_volume": "2323780188.2655096",
                      "sell_volume": "1845315786.9764643",
                      "buy_volume_usd": "329574.1593590265",
                      "sell_volume_usd": "259958.9376750694",
                      "avg_buy_price": "0.00014183",
                      "pnl": "-36019.85710298"
                    },
                    {
                      "tag": "sniper",
                      "holder_count": 0,
                      "hold_amount": "0",
                      "percent_of_supply": 0,
                      "buy_volume": "0",
                      "sell_volume": "0",
                      "buy_volume_usd": "0",
                      "sell_volume_usd": "0",
                      "avg_buy_price": "0",
                      "pnl": "0"
                    },
                    {
                      "tag": "insider",
                      "holder_count": 0,
                      "hold_amount": "0",
                      "percent_of_supply": 0,
                      "buy_volume": "0",
                      "sell_volume": "0",
                      "buy_volume_usd": "0",
                      "sell_volume_usd": "0",
                      "avg_buy_price": "0",
                      "pnl": "0"
                    },
                    {
                      "tag": "dev",
                      "holder_count": 1,
                      "hold_amount": "0",
                      "percent_of_supply": 0,
                      "buy_volume": "82538461.538461",
                      "sell_volume": "82538461.538461",
                      "buy_volume_usd": "209.95208323574846",
                      "sell_volume_usd": "332.72892173159056",
                      "avg_buy_price": "0.00000254",
                      "pnl": "122.77683849584209"
                    },
                    {
                      "tag": "smart_trader",
                      "holder_count": 0,
                      "hold_amount": "0",
                      "percent_of_supply": 0,
                      "buy_volume": "0",
                      "sell_volume": "0",
                      "buy_volume_usd": "0",
                      "sell_volume_usd": "0",
                      "avg_buy_price": "0",
                      "pnl": "0"
                    },
                    {
                      "tag": "kol",
                      "holder_count": 0,
                      "hold_amount": "0",
                      "percent_of_supply": 0,
                      "buy_volume": "0",
                      "sell_volume": "0",
                      "buy_volume_usd": "0",
                      "sell_volume_usd": "0",
                      "avg_buy_price": "0",
                      "pnl": "0"
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
  "operationId": "get-token-v1-holder-profile",
  "x-mint": {
    "href": "/data-api/holder/get-token-v1-holder-profile"
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
