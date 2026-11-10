---
title: "Token - First Buyers"
description: "Identify the earliest buyers of a token and see whether they are still holding, added more, or have sold — useful for spotting early conviction, smart money, and potential insiders. Returns up to the top 1000 first buyers, paginated via offset and limit (offset + limit <= 1000)."
hidden: false
metadata:
  title: Birdeye Data API | Token - First Buyers
  description: >-
    Identify the earliest buyers of a token and see whether they are still
    holding, added more, or have sold — useful for spotting early conviction,
    smart money, and potential insiders. Returns up to the top 1000 first
    buyers, paginated via offset and limit (offset + limit <= 1000).
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /token/v1/first-buyers"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Earliest buyer timeline for a token.</strong></p>
  <ul>
    <li>Buyers are ordered from earliest to latest.</li>
    <li><code>position_status</code> compares the wallet's current holding to the amount it held right after its first buy.</li>
    <li><code>buy_more</code> means the wallet increased from its initial holding; <code>hold</code> means it kept the initial holding; <code>sell_partial</code> means it sold a meaningful portion; <code>sell_all</code> means it has almost fully exited.</li>
    <li><code>page_summary</code> aggregates position statuses for the buyers returned in the current page.</li>
    <li>Wallet tags may include labels such as <code>bundler</code>, <code>smart_trader</code>, <code>sniper</code>, <code>dev</code>, <code>insider</code>, and <code>kol</code>.</li>
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
    <li>Reconstruct the first wave of conviction behind a token by seeing who entered earliest, how much they bought, and what they did afterward.</li>
    <li>Identify whether early buyers are still aligned with the token or already exited into later liquidity.</li>
    <li>Surface suspicious launches where first buyers are heavily tagged as insiders, bundlers, snipers, KOLs, or other high-risk cohorts.</li>
    <li>Build early-holder leaderboards that distinguish real conviction from fast extraction using current holding and position status.</li>
    <li>Feed post-launch investigations, alpha research, and risk engines with the wallets that shaped the token's first market structure.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Provide a Solana <code>token_address</code>.</li>
    <li>Use <code>offset</code> and <code>limit</code> to page through the earliest buyers.</li>
    <li>Start with the default <code>limit=70</code>, then page forward if you need more of the first-buyer cohort.</li>
    <li>Read <code>first_buy_volume</code>, <code>first_buy_volume_usd</code>, <code>initial_holding</code>, and <code>current_holding</code> together to understand each wallet's behavior.</li>
    <li>Use <code>position_status</code> and <code>tags</code> to prioritize wallets worth deeper investigation.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Treat early buyers as a high-signal cohort, especially around new launches where first entries often shape the token's market structure.</li>
    <li>Combine <code>position_status</code> with wallet tags to distinguish conviction from coordinated extraction.</li>
    <li>Use first-buyers before wallet-tags-tracker when you need to know which wallets seeded the earliest market activity.</li>
    <li>Pair this endpoint with holder-positions to inspect current exposure and PnL for the wallets that entered first.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
    <li>Pagination is limited to the first 1,000 buyers; <code>offset + limit</code> must not exceed 1,000.</li>
    <li><code>limit</code> defaults to 70 and supports up to 100 records per request.</li>
    <li><code>position_status</code> is relative to the wallet's initial holding after its first buy, not to all-time maximum exposure.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /token/v1/first-buyers

```json
{
  "x-metadata": {
    "new": true
  },
  "tags": [
    "Holder"
  ],
  "summary": "Token - First Buyers",
  "description": "Identify the earliest buyers of a token and see whether they are still holding, added more, or have sold — useful for spotting early conviction, smart money, and potential insiders. Returns up to the top 1000 first buyers, paginated via offset and limit (offset + limit <= 1000).",
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
        "example": "So11111111111111111111111111111111111111112"
      }
    },
    {
      "name": "offset",
      "description": "Pagination start position. Make sure offset + limit <= 1000.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 0,
        "minimum": 0,
        "maximum": 1000
      }
    },
    {
      "name": "limit",
      "description": "Number of items per page. Make sure offset + limit <= 1000.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 70,
        "minimum": 1,
        "maximum": 100
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing the first wallets that bought the token",
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
                  "token_address": {
                    "type": "string",
                    "description": "Token mint address"
                  },
                  "flow": {
                    "type": "string",
                    "description": "Trade flow direction",
                    "enum": [
                      "buy"
                    ]
                  },
                  "page_summary": {
                    "type": "object",
                    "description": "Aggregated counts of position statuses for the buyers returned in this page",
                    "properties": {
                      "total_wallets": {
                        "type": "integer",
                        "description": "Total number of wallets in this page"
                      },
                      "buy_more": {
                        "type": "integer",
                        "description": "Number of wallets with position_status = buy_more"
                      },
                      "hold": {
                        "type": "integer",
                        "description": "Number of wallets with position_status = hold"
                      },
                      "sell_partial": {
                        "type": "integer",
                        "description": "Number of wallets with position_status = sell_partial"
                      },
                      "sell_all": {
                        "type": "integer",
                        "description": "Number of wallets with position_status = sell_all"
                      }
                    }
                  },
                  "buyers": {
                    "type": "array",
                    "description": "List of the first wallets that bought the token, ordered from earliest to latest.",
                    "items": {
                      "type": "object",
                      "properties": {
                        "wallet_address": {
                          "type": "string",
                          "description": "Wallet address of the buyer"
                        },
                        "block_number": {
                          "type": "integer",
                          "description": "Block number of the wallet's first buy transaction for this token"
                        },
                        "block_unix_time": {
                          "type": "integer",
                          "description": "Unix timestamp (seconds) of the wallet's first buy transaction for this token"
                        },
                        "first_buy_volume": {
                          "type": "number",
                          "description": "Token amount bought in the wallet's first buy transaction"
                        },
                        "first_buy_volume_usd": {
                          "type": "number",
                          "description": "USD value of the first buy"
                        },
                        "total_buy_volume": {
                          "type": "number",
                          "description": "Cumulative token amount the wallet has bought up to now"
                        },
                        "total_buy_volume_usd": {
                          "type": "number",
                          "description": "Cumulative buy volume in USD up to now"
                        },
                        "initial_holding": {
                          "type": "number",
                          "description": "Token balance right after the first buy. May include tokens transferred in beforehand."
                        },
                        "current_holding": {
                          "type": "number",
                          "description": "Token amount the wallet currently holds"
                        },
                        "position_status": {
                          "type": "string",
                          "enum": [
                            "buy_more",
                            "hold",
                            "sell_partial",
                            "sell_all"
                          ],
                          "description": "Position status of the wallet relative to its initial holding (the amount it held right after its first buy):\n- `buy_more`: current_holding > initial_holding — the wallet actively bought more (highest conviction).\n- `hold`: current_holding == initial_holding — the wallet is holding, nothing sold yet.\n- `sell_partial`: initial_holding × 0.01 < current_holding < initial_holding — the wallet sold a meaningful portion.\n- `sell_all`: current_holding <= initial_holding × 0.01 — the wallet sold almost everything (≤ 1% dust left)."
                        },
                        "tags": {
                          "type": "array",
                          "description": "Wallet classification tags. Supported tags: `bundler`, `sniper`, `insider`, `dev`, `smart_trader`, `kol`. Empty when the wallet carries no tag.",
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
              }
            }
          },
          "examples": {
            "Sample": {
              "value": {
                "success": true,
                "data": {
                  "token_address": "39i5b9Q3UWpsxaEVqmtyXLzYBFijBN9f6GsRGyY8pump",
                  "flow": "buy",
                  "page_summary": {
                    "total_wallets": 2,
                    "buy_more": 1,
                    "hold": 0,
                    "sell_partial": 0,
                    "sell_all": 1
                  },
                  "buyers": [
                    {
                      "wallet_address": "DuojVrALrNwwck6bqrLXPuiBnYVnc1ekfcjyeWDeTAdi",
                      "block_number": 422919059,
                      "block_unix_time": 1780050060,
                      "first_buy_volume": 10625406.111661,
                      "first_buy_volume_usd": 24.659147767012907,
                      "total_buy_volume": 10625406.111661,
                      "total_buy_volume_usd": 24.659147767012907,
                      "initial_holding": 10625406.111661,
                      "current_holding": 0,
                      "position_status": "sell_all",
                      "tags": [
                        "bundler",
                        "sniper"
                      ]
                    },
                    {
                      "wallet_address": "Gygj9QQby4j2jryqyqBHvLP7ctv2SaANgh4sCb69BUpA",
                      "block_number": 422919061,
                      "block_unix_time": 1780050061,
                      "first_buy_volume": 32804387.246183004,
                      "first_buy_volume_usd": 57.38558677840249,
                      "total_buy_volume": 41000000.5,
                      "total_buy_volume_usd": 72.15,
                      "initial_holding": 32804387.246183004,
                      "current_holding": 41000000.5,
                      "position_status": "buy_more",
                      "tags": [
                        "smart_trader"
                      ]
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
  "operationId": "get-token-v1-first-buyers",
  "x-mint": {
    "href": "/data-api/holder/get-token-v1-first-buyers"
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
