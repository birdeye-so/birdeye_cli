---
title: "Token - Wallet Tags Tracker Details"
description: "Drill into the Wallet Tags Tracker: for each time bucket, list the individual tagged wallets that traded, with their per-wallet buy/sell volume and transaction counts. Use it to see exactly which developers, snipers, or smart-money wallets were active in a given candle."
hidden: false
metadata:
  title: Birdeye Data API | Token - Wallet Tags Tracker Details
  description: >-
    Drill into the Wallet Tags Tracker: for each time bucket, list the
    individual tagged wallets that traded, with their per-wallet buy/sell volume
    and transaction counts. Use it to see exactly which developers, snipers, or
    smart-money wallets were active in a given candle.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /token/v1/wallet-tags-tracker/details"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>One row per wallet, per bucket.</strong> The response is a list of time buckets (<code>items</code>); each bucket has a <code>unix_time</code> (bucket open time) and a <code>wallets</code> array of the tagged wallets that traded in it.</p>
  <ul>
    <li>Each wallet row carries its own <code>volume_buy</code> / <code>volume_sell</code> (token amounts) and <code>volume_buy_usd</code> / <code>volume_sell_usd</code>, plus <code>tx_buy_count</code> / <code>tx_sell_count</code>.</li>
    <li><code>tags</code> lists the wallet's tags for this token (<code>dev</code>, <code>sniper</code>, <code>smart_trader</code>, <code>kol</code>). A wallet can carry several.</li>
    <li><code>is_top_10_holder</code> appears only when <code>top_10_holder=true</code>, flagging wallets that are among the token's top 10 holders.</li>
  </ul>
  <p><strong>Reading the numbers.</strong> Volumes are gross and leg-based — a transaction that both buys and sells counts on both sides, with no netting. <code>tx_buy_count</code> / <code>tx_sell_count</code> count that wallet's buy/sell transactions in the bucket. Wallets are ordered by USD volume descending and capped per bucket by <code>limit_wallet</code>; buckets with no activity are omitted. At most <code>limit_bucket</code> buckets are returned — while <code>has_more</code> is true, pass <code>next_time_from</code> back as <code>time_from</code> to page forward.</p>
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

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Drill into a single candle to see exactly which developers, snipers, and smart-money wallets bought or sold.</li>
    <li>Turn a volume spike from the summary endpoint into the actual wallet addresses behind it — ready to label, follow, or alert on.</li>
    <li>Track a known set of wallets over time by passing <code>wallets=</code>, watching how specific actors accumulate or exit bucket by bucket.</li>
    <li>Build wallet-level launch forensics and post-mortems that name who drove each phase, not just how much volume moved.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Provide a <code>token_address</code>, a required <code>time_from</code> unix timestamp in seconds, and a required <code>time_frame</code>. Omit <code>time_to</code> to read activity up to now.</li>
    <li>Pick <code>time_frame</code> by the question you're asking: <code>1s</code>–<code>30s</code> for launch forensics, <code>1m</code>–<code>30m</code> for intraday rotation, <code>1h</code>–<code>1M</code> for trend.</li>
    <li>Use <code>tags=dev,sniper,smart_trader,kol</code> to narrow the cohorts, or <code>wallets=addr1,addr2</code> (up to 50) to restrict to specific addresses.</li>
    <li>Set <code>min_volume_usd</code> to drop dust wallets, and <code>top_10_holder=true</code> to flag top holders via <code>is_top_10_holder</code>.</li>
    <li>Tune <code>limit_wallet</code> (wallets per bucket, up to 50) and <code>limit_bucket</code> (buckets returned, up to 300). While <code>has_more</code> is true, pass <code>next_time_from</code> back as <code>time_from</code> to page forward.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use the Wallet Tags Tracker (summary) to spot the interesting buckets first, then drill into those windows here for the wallet-level detail.</li>
    <li>Raise <code>min_volume_usd</code> to focus on wallets that actually moved the market and keep noise out of dashboards.</li>
    <li>Pass <code>wallets=</code> to follow a known cohort — insiders, a dev's set, or flagged smart money — across every bucket in the range.</li>
    <li>Keep <code>limit_wallet</code> tight for UI tables and page buckets with <code>next_time_from</code> rather than requesting an oversized range at once.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
    <li>Supported tags are <code>dev</code>, <code>sniper</code>, <code>smart_trader</code>, and <code>kol</code>.</li>
    <li>Maximum range per time_frame — seconds: 30 days, minutes: 60 days, hours: 90 days, <code>1D</code>/<code>1W</code>/<code>1M</code>: 365 days. Exceeding it returns 400.</li>
    <li>Some highly held or high-cost tokens (wSOL, USDC, USDT, BONK) are not supported for this endpoint.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /token/v1/wallet-tags-tracker/details

```json
{
  "x-metadata": {
    "new": true
  },
  "tags": [
    "Holder"
  ],
  "summary": "Token - Wallet Tags Tracker Details",
  "description": "Drill into the Wallet Tags Tracker: for each time bucket, list the individual tagged wallets that traded, with their per-wallet buy/sell volume and transaction counts. Use it to see exactly which developers, snipers, or smart-money wallets were active in a given candle.",
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
      "required": true,
      "description": "Size of each time bucket. Must match the bucket the drilldown is read against.",
      "schema": {
        "type": "string",
        "example": "1D",
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
      "description": "Comma-separated wallet tags to restrict the response to. Defaults to all supported tags.",
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
      "name": "wallets",
      "in": "query",
      "required": false,
      "description": "Comma-separated wallet addresses to restrict the response to. Up to 50 addresses.",
      "style": "form",
      "explode": false,
      "schema": {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    },
    {
      "name": "min_volume_usd",
      "in": "query",
      "required": false,
      "description": "Only include wallets whose USD volume in a bucket is at least this value.",
      "schema": {
        "type": "number",
        "minimum": 0,
        "default": 0
      }
    },
    {
      "name": "top_10_holder",
      "in": "query",
      "required": false,
      "description": "Set to true to flag wallets that are among the token's top 10 holders (is_top_10_holder).",
      "schema": {
        "type": "boolean",
        "default": false
      }
    },
    {
      "name": "limit_wallet",
      "in": "query",
      "required": false,
      "description": "Max wallets returned per bucket, ordered by USD volume descending. 1-50.",
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 50,
        "default": 10
      }
    },
    {
      "name": "limit_bucket",
      "in": "query",
      "required": false,
      "description": "Max time buckets returned. 1-300. Use next_time_from to page beyond this.",
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 300,
        "default": 300
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing the per-bucket wallet drilldown for tagged wallets: each time bucket lists the wallets that traded in it with their buy/sell volume and transaction counts",
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
                    "description": "The token mint address the drilldown was computed for."
                  },
                  "time_frame": {
                    "type": "string",
                    "description": "The time frame each bucket covers, echoing the request.",
                    "example": "1D"
                  },
                  "items": {
                    "type": "array",
                    "description": "Time buckets in the requested window, ordered by time ascending. Buckets with no activity are omitted; at most limit_bucket buckets are returned.",
                    "items": {
                      "type": "object",
                      "description": "One time bucket with the wallets that traded in it.",
                      "properties": {
                        "unix_time": {
                          "type": "integer",
                          "description": "Bucket open time as a unix timestamp in seconds."
                        },
                        "wallets": {
                          "type": "array",
                          "description": "Wallets active in this bucket, ordered by USD volume descending, capped by limit_wallet.",
                          "items": {
                            "type": "object",
                            "description": "One tagged wallet's trading activity inside a single time bucket.",
                            "properties": {
                              "wallet": {
                                "type": "string",
                                "description": "Wallet address."
                              },
                              "volume_buy": {
                                "type": "number",
                                "description": "Token amount bought by the wallet in this bucket."
                              },
                              "volume_sell": {
                                "type": "number",
                                "description": "Token amount sold by the wallet in this bucket."
                              },
                              "volume_buy_usd": {
                                "type": "number",
                                "description": "USD value of the buy volume in this bucket."
                              },
                              "volume_sell_usd": {
                                "type": "number",
                                "description": "USD value of the sell volume in this bucket."
                              },
                              "tx_buy_count": {
                                "type": "integer",
                                "description": "Number of buy transactions by the wallet in this bucket."
                              },
                              "tx_sell_count": {
                                "type": "integer",
                                "description": "Number of sell transactions by the wallet in this bucket."
                              },
                              "tags": {
                                "type": "array",
                                "description": "Wallet tags for this token. Supported tags: `dev`, `sniper`, `smart_trader`, `kol`.",
                                "items": {
                                  "type": "string",
                                  "enum": [
                                    "dev",
                                    "sniper",
                                    "smart_trader",
                                    "kol"
                                  ]
                                }
                              },
                              "is_top_10_holder": {
                                "type": "boolean",
                                "description": "True when the wallet is one of the token's top 10 holders. Present only when top_10_holder=true."
                              }
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
                    "description": "Pass back as time_from to fetch the next page. Present only when has_more is true."
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
                  "token_address": "9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump",
                  "time_frame": "1D",
                  "items": [
                    {
                      "unix_time": 1785024000,
                      "wallets": [
                        {
                          "wallet": "kn9DxXLihmitnvKTt33wvwzWQHmeX34MUNDsmbt3zNH",
                          "volume_buy": 0,
                          "volume_sell": 1852281.332125,
                          "volume_buy_usd": 0,
                          "volume_sell_usd": 346515.28093932976,
                          "tx_buy_count": 0,
                          "tx_sell_count": 19,
                          "tags": [
                            "dev",
                            "sniper",
                            "smart_trader"
                          ],
                          "is_top_10_holder": true
                        },
                        {
                          "wallet": "6JJdhkhk2fsxJcv5f2pEfrkMfHDe6bJSWT6JF2pUXGAK",
                          "volume_buy": 154123.11024299997,
                          "volume_sell": 458600,
                          "volume_buy_usd": 28295.629788006085,
                          "volume_sell_usd": 88923.28892993511,
                          "tx_buy_count": 15,
                          "tx_sell_count": 60,
                          "tags": [
                            "smart_trader"
                          ]
                        }
                      ]
                    }
                  ],
                  "has_more": true,
                  "next_time_from": 1785112156
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
  "operationId": "get-token-v1-wallet-tags-tracker-details",
  "x-mint": {
    "href": "/data-api/holder/get-token-v1-wallet-tags-tracker-details"
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
