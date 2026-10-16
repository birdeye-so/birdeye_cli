---
title: "Token - Top traders"
description: "Rank the top trader trading a token by volume, trade count, PnL, USD volume, or Solana holder position metrics. On Solana, the response can include wallet tags, current holding stats, average buy/sell prices, first and last trade time, and optional holder net worth and funding details.\n"
hidden: false
metadata:
  title: Birdeye Data API | Token - Top traders
  description: >
    Rank the top trader trading a token by volume, trade count, PnL, USD volume,
    or Solana holder position metrics. On Solana, the response can include
    wallet tags, current holding stats, average buy/sell prices, first and last
    trade time, and optional holder net worth and funding details.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v2/tokens/top_traders"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Top traders ranks wallets by token trading impact and, on Solana, adds holder stats context.</strong></p>
  <ul>
    <li>Use <code>sort_by=volume</code> or <code>sort_by=trade</code> for activity leaders.</li>
    <li>Use <code>sort_by=total_pnl</code>, <code>realized_pnl</code>, <code>unrealized_pnl</code>, or <code>volume_usd</code> for PnL and USD-volume views on supported chains.</li>
    <li>On Solana, use <code>sort_by=hold_volume</code> to rank traders by the amount they still hold.</li>
    <li>Use the optional min/max filters to narrow traders by trade count, token volume, USD volume, realized PnL, or unrealized PnL on both Solana and EVM-supported requests.</li>
    <li><code>min_trade</code> and <code>max_trade</code> must be non-negative integers. <code>min_volume</code>, <code>max_volume</code>, <code>min_volume_usd</code>, and <code>max_volume_usd</code> must be non-negative. PnL filters support both positive and negative values.</li>
    <li><code>min_trade</code>, <code>max_trade</code>, <code>min_volume</code>, <code>max_volume</code>, <code>min_volume_usd</code>, <code>max_volume_usd</code>, <code>min_realized_pnl</code>, <code>max_realized_pnl</code>, <code>min_unrealized_pnl</code>, and <code>max_unrealized_pnl</code> are not supported when <code>sort_by=hold_volume</code>.</li>
    <li>On Solana, <code>wallet_tags</code> filters the result by wallet cohort. Supported values are <code>dev</code>, <code>bundler</code>, <code>sniper</code>, <code>insider</code>, and <code>smart_trader</code>.</li>
    <li>On Solana, <code>get_holders_networth=true</code> adds <code>netWorth</code>, <code>solBalance</code>, and <code>funding</code> to each trader item. This enriches holder stats but may make the response slightly slower.</li>
  </ul>
  <p><strong>Compatibility note.</strong> This release keeps existing response fields, sorting behavior, pagination, and response shape unchanged. The new filters are additive and optional.</p>
  <p><strong>Reading the numbers.</strong> <code>tradeBuy</code> and <code>tradeSell</code> count buy and sell transactions. <code>volumeBuy</code> and <code>volumeSell</code> are token amounts; <code>volumeBuyUSD</code>, <code>volumeSellUSD</code>, and <code>volumeUsd</code> are USD values. <code>holdVolume</code>, <code>holdVolumeUsd</code>, and <code>holdAvgPrice</code> describe the current remaining holder position. <code>avgBuyPrice</code> and <code>avgSellPrice</code> summarize historical trade prices. <code>firstTradeUnixTime</code> and <code>lastTradeUnixTime</code> are Unix timestamps in seconds.</p>
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
  <p><strong>All chains ⛓️ ✨</strong></p>
</Tab>
</Tabs>

<Accordion title="Wallet Tag Definitions 🏷️" icon="fa-tags">
  <ul>
    <li><strong>dev</strong> — The wallet that created the token, based on the mint creator / initialize-mint transaction.</li>
    <li><strong>sniper</strong> — A wallet that bought within the first <code>n</code> blocks of the token, counted from the token's first swap. On Solana, <code>n = 5</code>; a buy qualifies when its slot is within <code>first_trade_slot + 5</code>.</li>
    <li><strong>bundler</strong> — Coordinated buying detected at either level: Level 1 means at least 4 buy transactions in the same slot; Level 2 means at least 3 distinct wallets buying across adjacent slots where the max slot gap is 1.</li>
    <li><strong>insider</strong> — A wallet that received the token directly from the Chef wallet through a token transfer, not through a swap.</li>
    <li><strong>smart_trader</strong> — A non-bot wallet ranked in Top Realized PnL over the last 90 days with realized PnL greater than $10,000. Wallets identified as bots are excluded before ranking and never receive this tag.</li>
  </ul>
</Accordion>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>25 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Find the wallets that drove most token volume, trade count, or PnL during a launch or trading window.</li>
    <li>Identify whether top traders are still holding, accumulating, or selling by comparing <code>holdVolume</code> against buy/sell activity.</li>
    <li>Screen for high-conviction trader cohorts by requiring minimum trade count, token volume, USD volume, or profit thresholds.</li>
    <li>Filter Solana results by wallet cohort to inspect developers, bundlers, snipers, insiders, or smart traders separately.</li>
    <li>Use <code>get_holders_networth=true</code> to enrich wallet research with net worth, SOL balance, and funding source context.</li>
    <li>Build token research dashboards that combine trader ranking, wallet tags, holder position stats, and PnL.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Provide a token <code>address</code> and choose <code>x-chain</code>.</li>
    <li>Pick <code>time_frame</code> based on the analysis window. Solana additionally supports <code>all_time</code>.</li>
    <li>Pick <code>sort_by</code>: use <code>volume</code>, <code>trade</code>, <code>total_pnl</code>, <code>realized_pnl</code>, <code>unrealized_pnl</code>, <code>volume_usd</code>, or Solana-only <code>hold_volume</code>.</li>
    <li>Add any of <code>min_trade</code>, <code>max_trade</code>, <code>min_volume</code>, <code>max_volume</code>, <code>min_volume_usd</code>, <code>max_volume_usd</code>, <code>min_realized_pnl</code>, <code>max_realized_pnl</code>, <code>min_unrealized_pnl</code>, or <code>max_unrealized_pnl</code> when you want threshold-based filtering.</li>
    <li>Do not combine those min/max filters with <code>sort_by=hold_volume</code>.</li>
    <li>On Solana, pass <code>wallet_tags=dev,sniper,smart_trader</code> to filter by wallet cohorts.</li>
    <li>On Solana, set <code>get_holders_networth=true</code> when you need net worth, SOL balance, and funding details.</li>
    <li>Use <code>offset</code> and <code>limit</code> to page through ranked traders.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Start with <code>sort_by=volume</code> or <code>trade</code> to find active wallets, then switch to PnL or holder fields to understand outcomes.</li>
    <li>Use min/max filters to turn this endpoint into a trader screener, not just a leaderboard.</li>
    <li>Use <code>hold_volume</code> on Solana to separate traders who exited from traders still exposed to the token.</li>
    <li>Compare <code>realizedPnl</code> and <code>unrealizedPnl</code> with <code>holdVolumeUsd</code> to distinguish realized profit from open exposure.</li>
    <li>Use wallet tag filters to reduce noise when investigating launch behavior or suspicious cohorts.</li>
    <li>Enable <code>get_holders_networth</code> only when holder net worth and funding context are needed, because it may add latency.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li><code>all_time</code>, <code>hold_volume</code>, <code>wallet_tags</code>, holder position stats, and <code>get_holders_networth</code> are Solana-only additions.</li>
    <li>Non-Solana chains keep their existing supported intervals, sort fields, parameters, and response behavior.</li>
    <li>Min/max trade, volume, USD-volume, realized-PnL, and unrealized-PnL filters are not supported with <code>sort_by=hold_volume</code>.</li>
    <li><code>wallet_tags</code> accepts <code>dev</code>, <code>bundler</code>, <code>sniper</code>, <code>insider</code>, and <code>smart_trader</code>.</li>
    <li><code>get_holders_networth=true</code> may return <code>netWorth</code> or <code>solBalance</code> as <code>0</code> when holder net worth data is unavailable.</li>
    <li>Results are paginated with offset and limit.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /defi/v2/tokens/top_traders

```json
{
  "tags": [
    "Wallet, Networth & PnL"
  ],
  "summary": "Token - Top traders",
  "description": "Rank the top trader trading a token by volume, trade count, PnL, USD volume, or Solana holder position metrics. On Solana, the response can include wallet tags, current holding stats, average buy/sell prices, first and last trade time, and optional holder net worth and funding details.\n",
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
      "name": "address",
      "description": "The address of the token contract.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana": {
          "value": "3xF8fgj5maAgFwprsEs26bJNmaPDS24zT1VTtELspump"
        },
        "ethereum": {
          "value": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce"
        }
      }
    },
    {
      "name": "time_frame",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "enum": [
          "30m",
          "1h",
          "2h",
          "4h",
          "6h",
          "8h",
          "12h",
          "24h",
          "2d",
          "3d",
          "7d",
          "14d",
          "30d",
          "60d",
          "90d",
          "all_time"
        ],
        "default": "24h"
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
    },
    {
      "name": "sort_by",
      "description": "Specify the sort field.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "enum": [
          "volume",
          "trade",
          "total_pnl",
          "unrealized_pnl",
          "realized_pnl",
          "volume_usd",
          "hold_volume"
        ],
        "default": "volume"
      }
    },
    {
      "name": "offset",
      "description": "Pagination start position. offset + limit <= 10000",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 0,
        "minimum": 0,
        "maximum": 10000
      }
    },
    {
      "name": "limit",
      "description": "Number of items per page.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 10,
        "minimum": 1,
        "maximum": 10
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
          "scaled"
        ],
        "default": "scaled"
      }
    },
    {
      "name": "wallet_tags",
      "description": "Filter Solana traders by wallet tags. Supports comma-separated values.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": [
            "dev",
            "bundler",
            "sniper",
            "insider",
            "smart_trader"
          ]
        }
      },
      "style": "form",
      "explode": false,
      "example": [
        "dev",
        "smart_trader"
      ]
    },
    {
      "name": "get_holders_networth",
      "description": "Solana only. When true, the response includes netWorth, solBalance, and funding for each trader. This may make the response slightly slower than when disabled.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "boolean",
        "default": false
      }
    },
    {
      "name": "min_trade",
      "description": "Filter top traders with trade count greater than or equal to this value. Not supported when sort_by=hold_volume.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "max_trade",
      "description": "Filter top traders with trade count less than or equal to this value. Not supported when sort_by=hold_volume.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume",
      "description": "Filter top traders with token volume greater than or equal to this value. On Solana with ui_amount_mode=scaled, this value uses scaled UI amount. Not supported when sort_by=hold_volume.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "max_volume",
      "description": "Filter top traders with token volume less than or equal to this value. On Solana with ui_amount_mode=scaled, this value uses scaled UI amount. Not supported when sort_by=hold_volume.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume_usd",
      "description": "Filter top traders with USD volume greater than or equal to this value. Not supported when sort_by=hold_volume.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "max_volume_usd",
      "description": "Filter top traders with USD volume less than or equal to this value. Not supported when sort_by=hold_volume.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_realized_pnl",
      "description": "Filter top traders with realized PnL greater than or equal to this value. Not supported when sort_by=hold_volume.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "max_realized_pnl",
      "description": "Filter top traders with realized PnL less than or equal to this value. Not supported when sort_by=hold_volume.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_unrealized_pnl",
      "description": "Filter top traders with unrealized PnL greater than or equal to this value. Not supported when sort_by=hold_volume.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "max_unrealized_pnl",
      "description": "Filter top traders with unrealized PnL less than or equal to this value. Not supported when sort_by=hold_volume.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing a list of top traded tokens",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "description": "Response containing a ranked list of top traders for a token.",
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
                "type": "object",
                "description": "Top-trader ranking result.",
                "properties": {
                  "items": {
                    "type": "array",
                    "description": "Ranked trader rows for the requested token and time window.",
                    "items": {
                      "type": "object",
                      "description": "A trader row with trading, PnL, and optional holder-context metrics.",
                      "properties": {
                        "tokenAddress": {
                          "type": "string",
                          "description": "Token address used for the ranking request."
                        },
                        "owner": {
                          "type": "string",
                          "description": "Trader wallet address."
                        },
                        "tags": {
                          "type": "array",
                          "description": "Solana wallet tags assigned to the trader, such as dev, bundler, sniper, insider, or smart_trader."
                        },
                        "type": {
                          "type": "string",
                          "description": "Timeframe label for the returned ranking row, such as 24h, matching the effective analysis window."
                        },
                        "volume": {
                          "type": "number",
                          "description": "Total token volume traded by this wallet over the selected time window."
                        },
                        "trade": {
                          "type": "integer",
                          "description": "Total trade count for this wallet over the selected time window."
                        },
                        "tradeBuy": {
                          "type": "integer",
                          "description": "Number of buy trades executed by this wallet."
                        },
                        "tradeSell": {
                          "type": "integer",
                          "description": "Number of sell trades executed by this wallet."
                        },
                        "volumeBuy": {
                          "type": "number",
                          "description": "Total token amount bought by this wallet."
                        },
                        "volumeSell": {
                          "type": "number",
                          "description": "Total token amount sold by this wallet."
                        },
                        "volumeBuyUSD": {
                          "type": "number",
                          "description": "USD value of all buys executed by this wallet."
                        },
                        "volumeSellUSD": {
                          "type": "number",
                          "description": "USD value of all sells executed by this wallet."
                        },
                        "volumeUsd": {
                          "type": "number",
                          "description": "Total USD trading volume for this wallet, typically buy-side plus sell-side USD volume."
                        },
                        "totalPnl": {
                          "type": "number",
                          "description": "Combined realized and unrealized PnL for this trader."
                        },
                        "unrealizedPnl": {
                          "type": "number",
                          "description": "Mark-to-market PnL of the trader's remaining open token position."
                        },
                        "realizedPnl": {
                          "type": "number",
                          "description": "PnL already realized from completed sell activity."
                        },
                        "holdVolume": {
                          "type": "number",
                          "description": "Current token amount still held by this trader. Most relevant for Solana hold-volume ranking."
                        },
                        "holdVolumeUsd": {
                          "type": "number",
                          "description": "Current USD value of the trader's remaining held token position."
                        },
                        "holdAvgPrice": {
                          "type": "number",
                          "description": "Average cost basis of the trader's remaining held token position."
                        },
                        "avgBuyPrice": {
                          "type": "number",
                          "description": "Average buy price across the trader's buy history for the token."
                        },
                        "avgSellPrice": {
                          "type": "number",
                          "description": "Average sell price across the trader's sell history for the token."
                        },
                        "firstTradeUnixTime": {
                          "type": "number",
                          "description": "Unix timestamp in seconds of the trader's first recorded trade for the token."
                        },
                        "lastTradeUnixTime": {
                          "type": "number",
                          "description": "Unix timestamp in seconds of the trader's most recent recorded trade for the token."
                        },
                        "netWorth": {
                          "type": "number",
                          "description": "Trader wallet net worth. Returned on Solana when get_holders_networth=true."
                        },
                        "solBalance": {
                          "type": "number",
                          "description": "Trader wallet SOL balance. Returned on Solana when get_holders_networth=true."
                        },
                        "isScaledUiToken": {
                          "type": "boolean",
                          "description": "Whether the token uses Solana Token-2022 scaled UI amount handling."
                        },
                        "multiplier": {
                          "type": "number",
                          "nullable": true,
                          "description": "Scaled UI multiplier for Solana Token-2022 tokens when applicable; otherwise null."
                        },
                        "funding": {
                          "type": "object",
                          "description": "Earliest known funding details for the trader wallet. Returned on Solana when get_holders_networth=true.",
                          "properties": {
                            "funder": {
                              "type": "string",
                              "description": "Wallet address that funded the trader wallet."
                            },
                            "unixTime": {
                              "type": "number",
                              "description": "Unix timestamp in seconds when the funding transaction occurred."
                            },
                            "amount": {
                              "type": "number",
                              "description": "Amount transferred in the funding transaction."
                            },
                            "txHash": {
                              "type": "string",
                              "description": "Transaction hash or signature of the funding transfer."
                            }
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
            "SolanaScaledUIAmount": {
              "value": {
                "success": true,
                "data": {
                  "items": [
                    {
                      "tokenAddress": "3xF8fgj5maAgFwprsEs26bJNmaPDS24zT1VTtELspump",
                      "owner": "CEikLmYN9dcDtHZC9qfwPpaUcLm3CNWMrR55Ub5mRyUn",
                      "tags": [
                        "fresh",
                        "bundler",
                        "sniper"
                      ],
                      "type": "24h",
                      "trade": 27,
                      "tradeBuy": 1,
                      "tradeSell": 26,
                      "volume": 696438428.401387,
                      "volumeBuy": 427829917.472286,
                      "volumeSell": 268608510.92910105,
                      "volumeUsd": 6260.822052904342,
                      "volumeBuyUSD": 1551.8066478152505,
                      "volumeSellUSD": 4709.0154050890915,
                      "totalPnl": 3438.2253375103355,
                      "unrealizedPnl": -296.5045959543089,
                      "realizedPnl": 3734.7299334646445,
                      "holdVolume": 0,
                      "holdVolumeUsd": 0,
                      "holdAvgPrice": 0.0000036271578597954727,
                      "avgBuyPrice": 0.0000036271578597954727,
                      "avgSellPrice": 0.000017531147426419527,
                      "firstTradeUnixTime": 1784802145,
                      "lastTradeUnixTime": 1784802524,
                      "netWorth": 0,
                      "solBalance": 0,
                      "funding": {
                        "funder": "7iVfPjXEMnuGQkaYbxmvi4BRnzpS6dthWwNQB32D61nz",
                        "unixTime": 1784802145,
                        "amount": 21.372,
                        "txHash": "61oxPM8LXQ9wCurgLxzdqxv516rZPtrnxtGXdLnVCLuhYkRyW5nHwEr7Wzzi5YHaZzCGzRNiCs7egH7kCQQyPTDQ"
                      },
                      "isScaledUiToken": false,
                      "multiplier": null
                    }
                  ]
                }
              }
            },
            "Tokens": {
              "value": {
                "success": true,
                "data": {
                  "items": [
                    {
                      "tokenAddress": "3xF8fgj5maAgFwprsEs26bJNmaPDS24zT1VTtELspump",
                      "owner": "MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa",
                      "tags": [],
                      "type": "24h",
                      "volume": 675542.1369220349,
                      "trade": 74194,
                      "tradeBuy": 38909,
                      "tradeSell": 35285,
                      "volumeBuy": 372626.71744350606,
                      "volumeSell": 302915.4194785288
                    },
                    {
                      "tokenAddress": "3xF8fgj5maAgFwprsEs26bJNmaPDS24zT1VTtELspump",
                      "owner": "YubQzu18FDqJRyNfG8JqHmsdbxhnoQqcKUHBdUkN6tP",
                      "tags": [],
                      "type": "24h",
                      "volume": 188500.06136997032,
                      "trade": 35531,
                      "tradeBuy": 17249,
                      "tradeSell": 18282,
                      "volumeBuy": 94139.68529835819,
                      "volumeSell": 94360.37607161213
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
  "operationId": "get-defi-v2-tokens-top_traders",
  "x-mint": {
    "href": "/data-api/wallet-networth-pnl/get-defi-v2-tokens-top-traders"
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
