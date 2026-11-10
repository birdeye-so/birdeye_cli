---
title: "Token - Wallet Tags Tracker"
description: "Track how tagged wallets trade a token over time. Returns buy/sell volume, distinct wallet counts, and transaction counts bucketed by interval, so you can see when developers took profit, whether snipers exited or held, and how smart money timed entries relative to price."
hidden: false
metadata:
  title: Birdeye Data API | Token - Wallet Tags Tracker
  description: >-
    Track how tagged wallets trade a token over time. Returns buy/sell volume,
    distinct wallet counts, and transaction counts bucketed by interval, so you
    can see when developers took profit, whether snipers exited or held, and how
    smart money timed entries relative to price.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /token/v1/wallet-tags-tracker"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Three groupings under <code>groups</code>. They overlap each other — never sum one block into another.</strong></p>
  <ul>
    <li><code>tags</code> — one series per tag. <strong>Overlapping</strong>: a dev+sniper wallet appears in both series, so summing these keys double-counts it.</li>
    <li><code>tag_combinations</code> — one series per exact tag set (<code>dev</code>, <code>dev_sniper</code>, <code>dev_sniper_smart_trader</code>, …). <strong>Disjoint</strong>: every wallet lands in exactly one key, so these are the only keys safe to sum for a total. Needs <code>include_tag_combinations=true</code>.</li>
    <li><code>top_10_holder</code> — a single series for the top 10 holders. An independent dimension that overlaps both tag blocks. Needs <code>top_10_holder=true</code>.</li>
  </ul>
  <p><strong>Reading the numbers.</strong> <code>unix_time</code> is the bucket open time. Volumes are gross and leg-based — a transaction that both buys and sells counts on both sides, with no netting. <code>wallet_buy_count</code> counts distinct wallets; <code>tx_buy_count</code> counts (wallet, transaction) pairs, so a bundle touching N wallets counts N times. Buckets with no activity are omitted from the series.</p>
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
    <li>This endpoint consumes <code>30 CU</code> per request.</li>
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
    <li>Follow the wallets that matter most — developers, snipers, smart traders, KOLs, and the token's top holders — across every phase of a launch.</li>
    <li>Build a launch-forensics timeline that reveals when insiders accumulated, when snipers rotated out, and when smart money started leaning in.</li>
    <li>Separate signal from noise by comparing buy volume, sell volume, distinct wallet counts, and transaction intensity bucket by bucket.</li>
    <li>Power monitoring dashboards, alerts, and post-launch research reports that show whether tagged wallets are holding conviction, taking profit, or exiting into liquidity.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Provide a <code>token_address</code> and a required <code>time_from</code> unix timestamp in seconds. Omit <code>time_to</code> to track activity up to now.</li>
    <li>Pick <code>time_frame</code> by the question you're asking: <code>1s</code>–<code>30s</code> for launch forensics, <code>1m</code>–<code>30m</code> for intraday rotation, <code>1h</code>–<code>1M</code> for trend.</li>
    <li>Use <code>tags=dev,sniper,smart_trader,kol</code> to narrow the cohorts returned, or omit <code>tags</code> to return all supported tag series.</li>
    <li>Set <code>top_10_holder=true</code> to add the top-holder series, and <code>include_tag_combinations=true</code> to add the disjoint cohorts.</li>
    <li>While <code>has_more</code> is true, pass <code>next_time_from</code> back as <code>time_from</code> to page forward.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Start with a coarse interval to understand the overall story, then zoom into minute or second buckets around the suspicious launch, pump, or exit.</li>
    <li>Score wallets from <code>tag_combinations</code>, not <code>tags</code> — any model that sums the <code>tags</code> keys will over-weight multi-tagged wallets.</li>
    <li>Compare buy-side and sell-side wallet counts against USD volume to distinguish broad participation from a few large actors.</li>
    <li>Pair this endpoint with price, volume, first-buyers, and holder-profile data to explain not just what happened, but who drove it.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only. Supported tags are <code>dev</code>, <code>sniper</code>, <code>smart_trader</code>, and <code>kol</code>.</li>
    <li>Supported tags are <code>dev</code>, <code>sniper</code>, <code>smart_trader</code>, and <code>kol</code>.</li>
    <li>Maximum range per interval — seconds: 30 days, minutes: 60 days, hours: 90 days, <code>1D</code>/<code>1W</code>/<code>1M</code>: 365 days. Exceeding it returns 400.</li>
    <li>Some highly held or high-cost tokens (wSOL, USDC, USDT, BONK) are not supported for this endpoint.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /token/v1/wallet-tags-tracker

```json
{
  "x-metadata": {
    "new": true
  },
  "tags": [
    "Holder"
  ],
  "summary": "Token - Wallet Tags Tracker",
  "description": "Track how tagged wallets trade a token over time. Returns buy/sell volume, distinct wallet counts, and transaction counts bucketed by interval, so you can see when developers took profit, whether snipers exited or held, and how smart money timed entries relative to price.",
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
        "example": "9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump"
      }
    },
    {
      "name": "time_from",
      "in": "query",
      "required": true,
      "description": "Start of the range, as a unix timestamp in seconds.",
      "schema": {
        "type": "integer",
        "example": 1782864000
      }
    },
    {
      "name": "time_to",
      "in": "query",
      "required": false,
      "description": "End of the range, as a unix timestamp in seconds. Defaults to now. Must be greater than time_from, and within the time_frame's maximum range.",
      "schema": {
        "type": "integer",
        "example": 1785369600
      }
    },
    {
      "name": "time_frame",
      "in": "query",
      "required": false,
      "description": "Size of each time bucket.",
      "schema": {
        "type": "string",
        "default": "1D",
        "enum": [
          "1s",
          "5s",
          "15s",
          "30s",
          "1m",
          "3m",
          "5m",
          "15m",
          "30m",
          "1h",
          "2h",
          "4h",
          "1D",
          "1W",
          "1M"
        ]
      }
    },
    {
      "name": "tags",
      "in": "query",
      "required": false,
      "description": "Comma-separated wallet tags to restrict the response to. Defaults to all supported tags. Also narrows which keys appear in tag_combinations.",
      "style": "form",
      "explode": false,
      "schema": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": [
            "dev",
            "sniper",
            "smart_trader",
            "kol"
          ]
        },
        "example": [
          "dev",
          "sniper",
          "smart_trader",
          "kol"
        ]
      }
    },
    {
      "name": "top_10_holder",
      "in": "query",
      "required": false,
      "description": "Set to true to include the top_10_holder series.",
      "schema": {
        "type": "boolean",
        "default": false
      }
    },
    {
      "name": "include_tag_combinations",
      "in": "query",
      "required": false,
      "description": "Set to true to include the tag_combinations block, the only block whose keys are safe to sum.",
      "schema": {
        "type": "boolean",
        "default": false
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing tagged-wallet trading activity bucketed by interval, grouped by tag, by exact tag combination, and by top 10 holder",
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
                    "description": "The token mint address the series were computed for."
                  },
                  "time_frame": {
                    "type": "string",
                    "description": "The time frame each bucket covers. Echoed back under the same name the request used: callers passing the legacy `interval` receive `interval` instead.",
                    "example": "1m"
                  },
                  "groups": {
                    "type": "object",
                    "description": "The three wallet groupings. They overlap with each other by design, so never sum one block into another.",
                    "properties": {
                      "tags": {
                        "type": "object",
                        "description": "One series per tag, keyed by tag name. Supported tags: `dev`, `sniper`, `smart_trader`, `kol`. Only the tags requested via the tags parameter are returned. OVERLAPPING: a wallet tagged both dev and sniper is counted in both series, so summing across these keys double-counts. Use tag_combinations when you need a total.",
                        "properties": {
                          "dev": {
                            "type": "array",
                            "description": "Time series of buckets, ordered by time ascending. Buckets with no activity are omitted.",
                            "items": {
                              "type": "object",
                              "description": "One time bucket of trading activity for a wallet group. Volumes are leg-based and gross: a transaction that both buys and sells counts on both sides, with no netting.",
                              "properties": {
                                "unix_time": {
                                  "type": "integer",
                                  "description": "Bucket open time as a unix timestamp in seconds."
                                },
                                "volume_buy": {
                                  "type": "number",
                                  "description": "Token amount bought by the group in this bucket."
                                },
                                "volume_sell": {
                                  "type": "number",
                                  "description": "Token amount sold by the group in this bucket."
                                },
                                "volume_buy_usd": {
                                  "type": "number",
                                  "description": "USD value of the buy volume in this bucket."
                                },
                                "volume_sell_usd": {
                                  "type": "number",
                                  "description": "USD value of the sell volume in this bucket."
                                },
                                "wallet_buy_count": {
                                  "type": "integer",
                                  "description": "Number of distinct wallets in the group with a buy leg in this bucket."
                                },
                                "wallet_sell_count": {
                                  "type": "integer",
                                  "description": "Number of distinct wallets in the group with a sell leg in this bucket."
                                },
                                "tx_buy_count": {
                                  "type": "integer",
                                  "description": "Number of (wallet, transaction) pairs with a buy leg. A bundled transaction touching N wallets counts N times, so this is not a distinct transaction count."
                                },
                                "tx_sell_count": {
                                  "type": "integer",
                                  "description": "Number of (wallet, transaction) pairs with a sell leg. A bundled transaction touching N wallets counts N times, so this is not a distinct transaction count."
                                }
                              }
                            }
                          },
                          "sniper": {
                            "type": "array",
                            "description": "Time series of buckets, ordered by time ascending. Buckets with no activity are omitted.",
                            "items": {
                              "type": "object",
                              "description": "One time bucket of trading activity for a wallet group. Volumes are leg-based and gross: a transaction that both buys and sells counts on both sides, with no netting.",
                              "properties": {
                                "unix_time": {
                                  "type": "integer",
                                  "description": "Bucket open time as a unix timestamp in seconds."
                                },
                                "volume_buy": {
                                  "type": "number",
                                  "description": "Token amount bought by the group in this bucket."
                                },
                                "volume_sell": {
                                  "type": "number",
                                  "description": "Token amount sold by the group in this bucket."
                                },
                                "volume_buy_usd": {
                                  "type": "number",
                                  "description": "USD value of the buy volume in this bucket."
                                },
                                "volume_sell_usd": {
                                  "type": "number",
                                  "description": "USD value of the sell volume in this bucket."
                                },
                                "wallet_buy_count": {
                                  "type": "integer",
                                  "description": "Number of distinct wallets in the group with a buy leg in this bucket."
                                },
                                "wallet_sell_count": {
                                  "type": "integer",
                                  "description": "Number of distinct wallets in the group with a sell leg in this bucket."
                                },
                                "tx_buy_count": {
                                  "type": "integer",
                                  "description": "Number of (wallet, transaction) pairs with a buy leg. A bundled transaction touching N wallets counts N times, so this is not a distinct transaction count."
                                },
                                "tx_sell_count": {
                                  "type": "integer",
                                  "description": "Number of (wallet, transaction) pairs with a sell leg. A bundled transaction touching N wallets counts N times, so this is not a distinct transaction count."
                                }
                              }
                            }
                          },
                          "smart_trader": {
                            "type": "array",
                            "description": "Time series of buckets, ordered by time ascending. Buckets with no activity are omitted.",
                            "items": {
                              "type": "object",
                              "description": "One time bucket of trading activity for a wallet group. Volumes are leg-based and gross: a transaction that both buys and sells counts on both sides, with no netting.",
                              "properties": {
                                "unix_time": {
                                  "type": "integer",
                                  "description": "Bucket open time as a unix timestamp in seconds."
                                },
                                "volume_buy": {
                                  "type": "number",
                                  "description": "Token amount bought by the group in this bucket."
                                },
                                "volume_sell": {
                                  "type": "number",
                                  "description": "Token amount sold by the group in this bucket."
                                },
                                "volume_buy_usd": {
                                  "type": "number",
                                  "description": "USD value of the buy volume in this bucket."
                                },
                                "volume_sell_usd": {
                                  "type": "number",
                                  "description": "USD value of the sell volume in this bucket."
                                },
                                "wallet_buy_count": {
                                  "type": "integer",
                                  "description": "Number of distinct wallets in the group with a buy leg in this bucket."
                                },
                                "wallet_sell_count": {
                                  "type": "integer",
                                  "description": "Number of distinct wallets in the group with a sell leg in this bucket."
                                },
                                "tx_buy_count": {
                                  "type": "integer",
                                  "description": "Number of (wallet, transaction) pairs with a buy leg. A bundled transaction touching N wallets counts N times, so this is not a distinct transaction count."
                                },
                                "tx_sell_count": {
                                  "type": "integer",
                                  "description": "Number of (wallet, transaction) pairs with a sell leg. A bundled transaction touching N wallets counts N times, so this is not a distinct transaction count."
                                }
                              }
                            }
                          },
                          "kol": {
                            "type": "array",
                            "description": "Time series of buckets, ordered by time ascending. Buckets with no activity are omitted.",
                            "items": {
                              "type": "object",
                              "description": "One time bucket of trading activity for a wallet group. Volumes are leg-based and gross: a transaction that both buys and sells counts on both sides, with no netting.",
                              "properties": {
                                "unix_time": {
                                  "type": "integer",
                                  "description": "Bucket open time as a unix timestamp in seconds."
                                },
                                "volume_buy": {
                                  "type": "number",
                                  "description": "Token amount bought by the group in this bucket."
                                },
                                "volume_sell": {
                                  "type": "number",
                                  "description": "Token amount sold by the group in this bucket."
                                },
                                "volume_buy_usd": {
                                  "type": "number",
                                  "description": "USD value of the buy volume in this bucket."
                                },
                                "volume_sell_usd": {
                                  "type": "number",
                                  "description": "USD value of the sell volume in this bucket."
                                },
                                "wallet_buy_count": {
                                  "type": "integer",
                                  "description": "Number of distinct wallets in the group with a buy leg in this bucket."
                                },
                                "wallet_sell_count": {
                                  "type": "integer",
                                  "description": "Number of distinct wallets in the group with a sell leg in this bucket."
                                },
                                "tx_buy_count": {
                                  "type": "integer",
                                  "description": "Number of (wallet, transaction) pairs with a buy leg. A bundled transaction touching N wallets counts N times, so this is not a distinct transaction count."
                                },
                                "tx_sell_count": {
                                  "type": "integer",
                                  "description": "Number of (wallet, transaction) pairs with a sell leg. A bundled transaction touching N wallets counts N times, so this is not a distinct transaction count."
                                }
                              }
                            }
                          }
                        }
                      },
                      "tag_combinations": {
                        "type": "object",
                        "description": "One series per exact tag set, keyed by the tags joined with an underscore in the order dev, sniper, smart_trader, kol (for example `dev`, `dev_sniper`, `dev_sniper_smart_trader_kol`). DISJOINT: every wallet falls into exactly one key, so summing across keys yields the token total. Returned only when include_tag_combinations=true.",
                        "additionalProperties": {
                          "type": "array",
                          "description": "Time series of buckets, ordered by time ascending. Buckets with no activity are omitted.",
                          "items": {
                            "type": "object",
                            "description": "One time bucket of trading activity for a wallet group. Volumes are leg-based and gross: a transaction that both buys and sells counts on both sides, with no netting.",
                            "properties": {
                              "unix_time": {
                                "type": "integer",
                                "description": "Bucket open time as a unix timestamp in seconds."
                              },
                              "volume_buy": {
                                "type": "number",
                                "description": "Token amount bought by the group in this bucket."
                              },
                              "volume_sell": {
                                "type": "number",
                                "description": "Token amount sold by the group in this bucket."
                              },
                              "volume_buy_usd": {
                                "type": "number",
                                "description": "USD value of the buy volume in this bucket."
                              },
                              "volume_sell_usd": {
                                "type": "number",
                                "description": "USD value of the sell volume in this bucket."
                              },
                              "wallet_buy_count": {
                                "type": "integer",
                                "description": "Number of distinct wallets in the group with a buy leg in this bucket."
                              },
                              "wallet_sell_count": {
                                "type": "integer",
                                "description": "Number of distinct wallets in the group with a sell leg in this bucket."
                              },
                              "tx_buy_count": {
                                "type": "integer",
                                "description": "Number of (wallet, transaction) pairs with a buy leg. A bundled transaction touching N wallets counts N times, so this is not a distinct transaction count."
                              },
                              "tx_sell_count": {
                                "type": "integer",
                                "description": "Number of (wallet, transaction) pairs with a sell leg. A bundled transaction touching N wallets counts N times, so this is not a distinct transaction count."
                              }
                            }
                          }
                        }
                      },
                      "top_10_holder": {
                        "type": "array",
                        "description": "Single series for the token's top 10 holders. An independent dimension that overlaps with the tag blocks. Returned only when top_10_holder=true.",
                        "items": {
                          "type": "object",
                          "description": "One time bucket of trading activity for a wallet group. Volumes are leg-based and gross: a transaction that both buys and sells counts on both sides, with no netting.",
                          "properties": {
                            "unix_time": {
                              "type": "integer",
                              "description": "Bucket open time as a unix timestamp in seconds."
                            },
                            "volume_buy": {
                              "type": "number",
                              "description": "Token amount bought by the group in this bucket."
                            },
                            "volume_sell": {
                              "type": "number",
                              "description": "Token amount sold by the group in this bucket."
                            },
                            "volume_buy_usd": {
                              "type": "number",
                              "description": "USD value of the buy volume in this bucket."
                            },
                            "volume_sell_usd": {
                              "type": "number",
                              "description": "USD value of the sell volume in this bucket."
                            },
                            "wallet_buy_count": {
                              "type": "integer",
                              "description": "Number of distinct wallets in the group with a buy leg in this bucket."
                            },
                            "wallet_sell_count": {
                              "type": "integer",
                              "description": "Number of distinct wallets in the group with a sell leg in this bucket."
                            },
                            "tx_buy_count": {
                              "type": "integer",
                              "description": "Number of (wallet, transaction) pairs with a buy leg. A bundled transaction touching N wallets counts N times, so this is not a distinct transaction count."
                            },
                            "tx_sell_count": {
                              "type": "integer",
                              "description": "Number of (wallet, transaction) pairs with a sell leg. A bundled transaction touching N wallets counts N times, so this is not a distinct transaction count."
                            }
                          }
                        }
                      }
                    }
                  },
                  "has_more": {
                    "type": "boolean",
                    "description": "Whether more buckets exist after the returned range."
                  },
                  "next_time_from": {
                    "type": "integer",
                    "description": "Pass back as time_from to fetch the next page. Present only when has_more is true. Echoed under the name matching the request: callers using the legacy from_time receive next_from_time instead."
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
                  "token_address": "2RaLR1kY37bbNfqWTK49AiCbPtdF27497jZ6DatKpump",
                  "time_frame": "1m",
                  "groups": {
                    "tags": {
                      "dev": [
                        {
                          "unix_time": 1792800060,
                          "volume_buy": 200,
                          "volume_sell": 60,
                          "volume_buy_usd": 200,
                          "volume_sell_usd": 60,
                          "wallet_buy_count": 1,
                          "wallet_sell_count": 1,
                          "tx_buy_count": 1,
                          "tx_sell_count": 1
                        }
                      ],
                      "sniper": [
                        {
                          "unix_time": 1792800060,
                          "volume_buy": 240,
                          "volume_sell": 0,
                          "volume_buy_usd": 240,
                          "volume_sell_usd": 0,
                          "wallet_buy_count": 2,
                          "wallet_sell_count": 0,
                          "tx_buy_count": 2,
                          "tx_sell_count": 0
                        }
                      ],
                      "smart_trader": [
                        {
                          "unix_time": 1792800180,
                          "volume_buy": 150,
                          "volume_sell": 0,
                          "volume_buy_usd": 150,
                          "volume_sell_usd": 0,
                          "wallet_buy_count": 1,
                          "wallet_sell_count": 0,
                          "tx_buy_count": 1,
                          "tx_sell_count": 0
                        }
                      ]
                    },
                    "tag_combinations": {
                      "dev": [
                        {
                          "unix_time": 1792800060,
                          "volume_buy": 0,
                          "volume_sell": 60,
                          "volume_buy_usd": 0,
                          "volume_sell_usd": 60,
                          "wallet_buy_count": 0,
                          "wallet_sell_count": 1,
                          "tx_buy_count": 0,
                          "tx_sell_count": 1
                        }
                      ],
                      "sniper": [
                        {
                          "unix_time": 1792800060,
                          "volume_buy": 40,
                          "volume_sell": 0,
                          "volume_buy_usd": 40,
                          "volume_sell_usd": 0,
                          "wallet_buy_count": 1,
                          "wallet_sell_count": 0,
                          "tx_buy_count": 1,
                          "tx_sell_count": 0
                        }
                      ],
                      "dev_sniper": [
                        {
                          "unix_time": 1792800060,
                          "volume_buy": 200,
                          "volume_sell": 0,
                          "volume_buy_usd": 200,
                          "volume_sell_usd": 0,
                          "wallet_buy_count": 1,
                          "wallet_sell_count": 0,
                          "tx_buy_count": 1,
                          "tx_sell_count": 0
                        }
                      ],
                      "smart_trader": [
                        {
                          "unix_time": 1792800180,
                          "volume_buy": 150,
                          "volume_sell": 0,
                          "volume_buy_usd": 150,
                          "volume_sell_usd": 0,
                          "wallet_buy_count": 1,
                          "wallet_sell_count": 0,
                          "tx_buy_count": 1,
                          "tx_sell_count": 0
                        }
                      ]
                    },
                    "top_10_holder": [
                      {
                        "unix_time": 1792800120,
                        "volume_buy": 300,
                        "volume_sell": 0,
                        "volume_buy_usd": 300,
                        "volume_sell_usd": 0,
                        "wallet_buy_count": 1,
                        "wallet_sell_count": 0,
                        "tx_buy_count": 1,
                        "tx_sell_count": 0
                      }
                    ]
                  },
                  "has_more": false
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
  "operationId": "get-token-v1-wallet-tags-tracker",
  "x-mint": {
    "href": "/data-api/holder/get-token-v1-wallet-tags-tracker"
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
