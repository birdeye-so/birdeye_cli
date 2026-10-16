---
title: "Token - List (V3) Scroll"
description: "Retrieve up to 5,000 tokens per batch. For the first request, apply any filter parameters except scroll_id. For subsequent requests, provide only the scroll_id parameter using the next_scroll_id value returned previously. Limited to 1 scroll_id per account per 30 seconds."
hidden: false
metadata:
  title: Birdeye Data API | Token - List (V3) Scroll
  description: >-
    Retrieve up to 5,000 tokens per batch. For the first request, apply any
    filter parameters except scroll_id. For subsequent requests, provide only
    the scroll_id parameter using the next_scroll_id value returned previously.
    Limited to 1 scroll_id per account per 30 seconds.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/token/list/scroll"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>High-volume token crawl with scroll sessions.</strong></p>
  <ul>
    <li>Use this endpoint when normal offset pagination is not enough and you need to walk a large filtered token universe.</li>
    <li><code>limit</code> supports <code>1</code> to <code>5000</code> items per request.</li>
    <li>Initial request: send your filters without <code>scroll_id</code>.</li>
    <li>Subsequent requests: send only the returned <code>scroll_id</code> and continue the same crawl session.</li>
    <li>Each account is limited by active scroll-session rules; an active scroll expires after about 30 seconds of inactivity, and an empty <code>items</code> page ends the session.</li>
  </ul>
</Tab>

  <Tab title="Accessibility">
  <ul>
    <li>Business</li>
    <li>Enterprise</li>
  </ul>
</Tab>

  <Tab title="Chain Supported">
  <p><strong>All chains ⛓️ ✨</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>300 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Crawl large token universes for offline indexing, warehousing, or scheduled refresh pipelines.</li>
    <li>Export broad market slices that are too large for interactive offset pagination.</li>
    <li>Build internal ranking datasets or research snapshots at chain scale.</li>
    <li>Feed downstream enrichment jobs with token candidates from a consistent filtered population.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> and send your initial filter set without <code>scroll_id</code>.</li>
    <li>Store the returned <code>next_scroll_id</code>.</li>
    <li>Continue by calling the same endpoint with that <code>scroll_id</code>.</li>
    <li>Stop when <code>items</code> is empty, then start a new initial request if you need a fresh crawl.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Treat scroll sessions as short-lived pipelines; consume pages promptly instead of leaving them idle.</li>
    <li>Use stable filters for one crawl session so downstream datasets stay internally consistent.</li>
    <li>Reserve this endpoint for backend jobs, not end-user UI pagination, because CU cost is high and session state is temporary.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/token/list/scroll

```json
{
  "tags": [
    "Token/Market List"
  ],
  "summary": "Token - List (V3) Scroll",
  "description": "Retrieve up to 5,000 tokens per batch. For the first request, apply any filter parameters except scroll_id. For subsequent requests, provide only the scroll_id parameter using the next_scroll_id value returned previously. Limited to 1 scroll_id per account per 30 seconds.",
  "parameters": [
    {
      "name": "x-chain",
      "description": "Solana, Base, BSC, Ethereum, Monad, Fogo, Mantle, Hyperevm, Megaeth, Robinhood network.",
      "in": "header",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "solana",
          "base",
          "bsc",
          "ethereum",
          "monad",
          "fogo",
          "mantle",
          "hyperevm",
          "megaeth",
          "robinhood"
        ],
        "default": "solana"
      }
    },
    {
      "name": "limit",
      "description": "Number of items per page.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 5000,
        "minimum": 1,
        "maximum": 5000
      }
    },
    {
      "name": "scroll_id",
      "description": "Assign scroll_id to continue fetching data from previous scroll request",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string"
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
          "liquidity",
          "market_cap",
          "fdv",
          "recent_listing_time",
          "last_trade_unix_time",
          "holder",
          "volume_1m_usd",
          "volume_5m_usd",
          "volume_30m_usd",
          "volume_1h_usd",
          "volume_2h_usd",
          "volume_4h_usd",
          "volume_8h_usd",
          "volume_24h_usd",
          "volume_7d_usd",
          "volume_30d_usd",
          "volume_1m_change_percent",
          "volume_5m_change_percent",
          "volume_30m_change_percent",
          "volume_1h_change_percent",
          "volume_2h_change_percent",
          "volume_4h_change_percent",
          "volume_8h_change_percent",
          "volume_24h_change_percent",
          "volume_7d_change_percent",
          "volume_30d_change_percent",
          "price_change_1m_percent",
          "price_change_5m_percent",
          "price_change_30m_percent",
          "price_change_1h_percent",
          "price_change_2h_percent",
          "price_change_4h_percent",
          "price_change_8h_percent",
          "price_change_24h_percent",
          "price_change_7d_percent",
          "price_change_30d_percent",
          "trade_1m_count",
          "trade_5m_count",
          "trade_30m_count",
          "trade_1h_count",
          "trade_2h_count",
          "trade_4h_count",
          "trade_8h_count",
          "trade_24h_count",
          "trade_7d_count",
          "trade_30d_count",
          "global_fees_paid"
        ],
        "default": "liquidity"
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
      "name": "platform_name",
      "description": "Token creation platform. Supported platforms: `pump.fun`, `mayhem`, `stonkfun`, `meteora dbc`, `moonshot`, `raydium`, `letsbonk.fun`, `jupiter studio`, `gobolt`, `bags.fm`, `possumlabs`, `trix`, `diesel`, and `meme.com platform`.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string"
      },
      "example": "pump.fun"
    },
    {
      "name": "min_liquidity",
      "description": "Specify the lower bound of liquidity. Filter for records with liquidity greater than the minimum liquidity value, including those with liquidity equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "max_liquidity",
      "description": "Specify the upper bound of liquidity. Filter for records with liquidity less than the maximum liquidity value, including those with liquidity equal to the maximum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_market_cap",
      "description": "Specify the lower bound of market cap. Filter for records with market cap greater than the minimum market cap value, including those with market cap equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "max_market_cap",
      "description": "Specify the upper bound of market cap. Filter for records with market cap less than the maximum market cap value, including those with market cap equal to the maximum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_fdv",
      "description": "Specify the lower bound of FDV. Filter for records with FDV greater than the minimum FDV value, including those with FDV equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "max_fdv",
      "description": "Specify the upper bound of FDV. Filter for records with FDV less than the maximum FDV value, including those with FDV equal to the maximum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_recent_listing_time",
      "description": "Specify the lower bound of recent listing time. Filter for records with recent listing time greater than the minimum recent listing time value, including those with recent listing time equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 10000000000
      }
    },
    {
      "name": "max_recent_listing_time",
      "description": "Specify the upper bound of recent listing time. Filter for records with recent listing time less than the maximum recent listing time value, including those with recent listing time equal to the maximum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 10000000000
      }
    },
    {
      "name": "min_last_trade_unix_time",
      "description": "Specify the lower bound of last trade time. Filter for records with last trade time greater than the minimum last trade time value, including those with last trade time equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 10000000000
      }
    },
    {
      "name": "max_last_trade_unix_time",
      "description": "Specify the upper bound of last trade time. Filter for records with last trade time less than the maximum last trade time value, including those with last trade time equal to the maximum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 10000000000
      }
    },
    {
      "name": "min_holder",
      "description": "Specify the minimum number of holders. Filter for records with holder count greater than the minimum holder count value, including those with holder count equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer"
      }
    },
    {
      "name": "min_volume_1m_usd",
      "description": "Specify the minimum volume in the last minute. Filter for records with volume greater than the minimum volume value, including those with volume equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume_5m_usd",
      "description": "Specify the minimum volume in the last 5 minutes. Filter for records with volume greater than the minimum volume value, including those with volume equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume_30m_usd",
      "description": "Specify the minimum volume in the last 30 minutes. Filter for records with volume greater than the minimum volume value, including those with volume equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume_1h_usd",
      "description": "Specify the minimum volume in the last hour. Filter for records with volume greater than the minimum volume value, including those with volume equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume_2h_usd",
      "description": "Specify the minimum volume in the last two hours. Filter for records with volume greater than the minimum volume value, including those with volume equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume_4h_usd",
      "description": "Specify the minimum volume in the last four hours. Filter for records with volume greater than the minimum volume value, including those with volume equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume_8h_usd",
      "description": "Specify the minimum volume in the last eight hours. Filter for records with volume greater than the minimum volume value, including those with volume equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume_24h_usd",
      "description": "Specify the minimum volume in the last 24 hours. Filter for records with volume greater than the minimum volume value, including those with volume equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume_7d_usd",
      "description": "Specify the minimum volume in the last 7 days. Filter for records with volume greater than the minimum volume value, including those with volume equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume_30d_usd",
      "description": "Specify the minimum volume in the last 30 days. Filter for records with volume greater than the minimum volume value, including those with volume equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_global_fees_paid",
      "description": "Specify the minimum all-time global fee paid amount in SOL.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume_1m_change_percent",
      "description": "Specify the minimum volume change percentage in the last minute. Filter for records with volume change percentage greater than the minimum volume change percentage value, including those with volume change percentage equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume_5m_change_percent",
      "description": "Specify the minimum volume change percentage in the last 5 minutes. Filter for records with volume change percentage greater than the minimum volume change percentage value, including those with volume change percentage equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume_30m_change_percent",
      "description": "Specify the minimum volume change percentage in the last 30 minutes. Filter for records with volume change percentage greater than the minimum volume change percentage value, including those with volume change percentage equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume_1h_change_percent",
      "description": "Specify the minimum volume change percentage in the last hour. Filter for records with volume change percentage greater than the minimum volume change percentage value, including those with volume change percentage equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume_2h_change_percent",
      "description": "Specify the minimum volume change percentage in the last two hours. Filter for records with volume change percentage greater than the minimum volume change percentage value, including those with volume change percentage equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume_4h_change_percent",
      "description": "Specify the minimum volume change percentage in the last four hours. Filter for records with volume change percentage greater than the minimum volume change percentage value, including those with volume change percentage equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume_8h_change_percent",
      "description": "Specify the minimum volume change percentage in the last eight hours. Filter for records with volume change percentage greater than the minimum volume change percentage value, including those with volume change percentage equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume_24h_change_percent",
      "description": "Specify the minimum volume change percentage in the last 24 hours. Filter for records with volume change percentage greater than the minimum volume change percentage value, including those with volume change percentage equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume_7d_change_percent",
      "description": "Specify the minimum volume change percentage in the last 7 days. Filter for records with volume change percentage greater than the minimum volume change percentage value, including those with volume change percentage equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_volume_30d_change_percent",
      "description": "Specify the minimum volume change percentage in the last 30 days. Filter for records with volume change percentage greater than the minimum volume change percentage value, including those with volume change percentage equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_price_change_1m_percent",
      "description": "Specify the minimum price change percentage in the last  minute. Filter for records with price change percentage greater than the minimum price change percentage value, including those with price change percentage equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_price_change_5m_percent",
      "description": "Specify the minimum price change percentage in the last 5 minutes. Filter for records with price change percentage greater than the minimum price change percentage value, including those with price change percentage equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_price_change_30m_percent",
      "description": "Specify the minimum price change percentage in the last 30 minutes. Filter for records with price change percentage greater than the minimum price change percentage value, including those with price change percentage equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_price_change_1h_percent",
      "description": "Specify the minimum price change percentage in the last hour. Filter for records with price change percentage greater than the minimum price change percentage value, including those with price change percentage equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_price_change_2h_percent",
      "description": "Specify the minimum price change percentage in the last two hours. Filter for records with price change percentage greater than the minimum price change percentage value, including those with price change percentage equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_price_change_4h_percent",
      "description": "Specify the minimum price change percentage in the last four hours. Filter for records with price change percentage greater than the minimum price change percentage value, including those with price change percentage equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_price_change_8h_percent",
      "description": "Specify the minimum price change percentage in the last eight hours. Filter for records with price change percentage greater than the minimum price change percentage value, including those with price change percentage equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_price_change_24h_percent",
      "description": "Specify the minimum price change percentage in the last 24 hours. Filter for records with price change percentage greater than the minimum price change percentage value, including those with price change percentage equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_price_change_7d_percent",
      "description": "Specify the minimum price change percentage in the last 7 days. Filter for records with price change percentage greater than the minimum price change percentage value, including those with price change percentage equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_price_change_30d_percent",
      "description": "Specify the minimum price change percentage in the last 30 days. Filter for records with price change percentage greater than the minimum price change percentage value, including those with price change percentage equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
      }
    },
    {
      "name": "min_trade_1m_count",
      "description": "Specify the minimum number of trades in the last minute. Filter for records with trade count greater than the minimum trade count value, including those with trade count equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer"
      }
    },
    {
      "name": "min_trade_5m_count",
      "description": "Specify the minimum number of trades in the 5 minutes. Filter for records with trade count greater than the minimum trade count value, including those with trade count equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer"
      }
    },
    {
      "name": "min_trade_30m_count",
      "description": "Specify the minimum number of trades in the last 30 minutes. Filter for records with trade count greater than the minimum trade count value, including those with trade count equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer"
      }
    },
    {
      "name": "min_trade_1h_count",
      "description": "Specify the minimum number of trades in the last hour. Filter for records with trade count greater than the minimum trade count value, including those with trade count equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer"
      }
    },
    {
      "name": "min_trade_2h_count",
      "description": "Specify the minimum number of trades in the last two hours. Filter for records with trade count greater than the minimum trade count value, including those with trade count equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer"
      }
    },
    {
      "name": "min_trade_4h_count",
      "description": "Specify the minimum number of trades in the last four hours. Filter for records with trade count greater than the minimum trade count value, including those with trade count equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer"
      }
    },
    {
      "name": "min_trade_8h_count",
      "description": "Specify the minimum number of trades in the last eight hours. Filter for records with trade count greater than the minimum trade count value, including those with trade count equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer"
      }
    },
    {
      "name": "min_trade_24h_count",
      "description": "Specify the minimum number of trades in the last 24 hours. Filter for records with trade count greater than the minimum trade count value, including those with trade count equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer"
      }
    },
    {
      "name": "min_trade_7d_count",
      "description": "Specify the minimum number of trades in the last 7 days. Filter for records with trade count greater than the minimum trade count value, including those with trade count equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer"
      }
    },
    {
      "name": "min_trade_30d_count",
      "description": "Specify the minimum number of trades in the last 30 days. Filter for records with trade count greater than the minimum trade count value, including those with trade count equal to the minimum.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer"
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
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing a list of token",
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
                "description": "Scroll-pagination payload for the V3 token list.",
                "properties": {
                  "next_scroll_id": {
                    "type": "string",
                    "description": "Cursor to pass back in the next request to continue scrolling from this point."
                  },
                  "scroll_time": {
                    "type": "string",
                    "description": "Timestamp associated with the scroll cursor snapshot."
                  },
                  "items": {
                    "type": "array",
                    "description": "Token rows returned for the current scroll page.",
                    "items": {
                      "type": "object",
                      "description": "One token row from the V3 scroll token list.",
                      "properties": {
                        "address": {
                          "type": "string",
                          "description": "Token mint or contract address."
                        },
                        "name": {
                          "type": "string",
                          "description": "Display name of the token."
                        },
                        "symbols": {
                          "type": "string",
                          "description": "Ticker symbol or symbol string returned by the listing service."
                        },
                        "decimals": {
                          "type": "integer",
                          "description": "Number of decimal places used by the token."
                        },
                        "logo_uri": {
                          "type": "string",
                          "description": "Logo image URL for the token."
                        },
                        "market_cap": {
                          "type": "number",
                          "description": "Current market capitalization based on circulating supply and latest price."
                        },
                        "fdv": {
                          "type": "number",
                          "description": "Fully diluted valuation based on total supply and latest price."
                        },
                        "liquidity": {
                          "type": "number",
                          "description": "Current token liquidity in USD."
                        },
                        "price": {
                          "type": "number",
                          "description": "Latest token price in USD."
                        },
                        "holder": {
                          "type": "integer",
                          "description": "Current holder count when holder data is available."
                        },
                        "volume_1h_usd": {
                          "type": "number",
                          "description": "Total traded USD volume during the latest 1-hour window."
                        },
                        "volume_1h_change_percent": {
                          "type": "number",
                          "description": "Percentage change in 1-hour USD volume versus the previous 1-hour window."
                        },
                        "price_change_1h_percent": {
                          "type": "number",
                          "description": "Percentage change in price over the latest 1-hour window."
                        },
                        "trade_1h_count": {
                          "type": "integer",
                          "description": "Total trade count during the latest 1-hour window."
                        },
                        "volume_2h_usd": {
                          "type": "number",
                          "description": "Total traded USD volume during the latest 2-hour window."
                        },
                        "volume_2h_change_percent": {
                          "type": "number",
                          "description": "Percentage change in 2-hour USD volume versus the previous 2-hour window."
                        },
                        "price_change_2h_percent": {
                          "type": "number",
                          "description": "Percentage change in price over the latest 2-hour window."
                        },
                        "trade_2h_count": {
                          "type": "integer",
                          "description": "Total trade count during the latest 2-hour window."
                        },
                        "volume_4h_usd": {
                          "type": "number",
                          "description": "Total traded USD volume during the latest 4-hour window."
                        },
                        "volume_4h_change_percent": {
                          "type": "number",
                          "description": "Percentage change in 4-hour USD volume versus the previous 4-hour window."
                        },
                        "price_change_4h_percent": {
                          "type": "number",
                          "description": "Percentage change in price over the latest 4-hour window."
                        },
                        "trade_4h_count": {
                          "type": "integer",
                          "description": "Total trade count during the latest 4-hour window."
                        },
                        "volume_8h_usd": {
                          "type": "number",
                          "description": "Total traded USD volume during the latest 8-hour window."
                        },
                        "volume_8h_change_percent": {
                          "type": "number",
                          "description": "Percentage change in 8-hour USD volume versus the previous 8-hour window."
                        },
                        "price_change_8h_percent": {
                          "type": "number",
                          "description": "Percentage change in price over the latest 8-hour window."
                        },
                        "trade_8h_count": {
                          "type": "integer",
                          "description": "Total trade count during the latest 8-hour window."
                        },
                        "volume_24h_usd": {
                          "type": "number",
                          "description": "Total traded USD volume during the latest 24-hour window."
                        },
                        "volume_24h_change_percent": {
                          "type": "number",
                          "description": "Percentage change in 24-hour USD volume versus the previous 24-hour window."
                        },
                        "price_change_24h_percent": {
                          "type": "number",
                          "description": "Percentage change in price over the latest 24-hour window."
                        },
                        "trade_24h_count": {
                          "type": "integer",
                          "description": "Total trade count during the latest 24-hour window."
                        },
                        "recent_listing_time": {
                          "type": "integer",
                          "description": "Unix timestamp in seconds when the token was recently listed or first detected by the listing feed."
                        },
                        "global_fees_paid": {
                          "type": "number",
                          "nullable": true,
                          "description": "All-time global fees paid in SOL for the token when available."
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
                      "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                      "creation_time": 1602610673,
                      "logo_uri": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
                      "name": "USD Coin",
                      "symbol": "USDC",
                      "decimals": 6,
                      "extensions": {
                        "website": "https://www.circle.com/en/usdc",
                        "twitter": "https://twitter.com/circle",
                        "github": "https://github.com/centrehq/centre-tokens",
                        "discord": "https://discord.com/invite/buildoncircle",
                        "serum_v3_usdt": "77quYg4MGneUdjgXCunt9GgM1usmrxKY31twEy3WHwcS",
                        "telegram": null,
                        "description": "USDC is a fully collateralized US dollar stablecoin. USDC is the bridge between dollars and trading on cryptocurrency exchanges. The technology behind CENTRE makes it possible to exchange value between people, businesses and financial institutions just like email between mail services and texts between SMS providers. We believe by removing artificial economic borders, we can create a more inclusive global economy.",
                        "medium": "https://medium.com/centre-blog",
                        "coingecko_id": "usd-coin"
                      },
                      "market_cap": 9359949288.472162,
                      "fdv": 9359949288.472162,
                      "total_supply": 9361475558.537651,
                      "circulating_supply": 9361475558.537651,
                      "liquidity": 717266609.8997043,
                      "last_trade_unix_time": 1773821608,
                      "global_fees_paid": 50,
                      "volume_1m_usd": 1783949.8016073245,
                      "volume_5m_usd": 6593930.865015753,
                      "volume_30m_usd": 37151797.047260106,
                      "volume_1m_change_percent": -16.712719155491957,
                      "volume_5m_change_percent": 22.319717252902382,
                      "volume_30m_change_percent": -7.328161152300243,
                      "volume_1h_usd": 71241764.65583831,
                      "volume_1h_change_percent": 5.1849793666244945,
                      "volume_2h_usd": 131380409.39402528,
                      "volume_2h_change_percent": 4.024396952248327,
                      "volume_4h_usd": 260864825.9415995,
                      "volume_4h_change_percent": -1.5700141357838566,
                      "volume_8h_usd": 497659947.6690345,
                      "volume_8h_change_percent": -6.21062719905141,
                      "volume_24h_usd": 1561358883.882102,
                      "volume_24h_change_percent": -17.59907485415478,
                      "volume_7d_usd": 11002942936.987179,
                      "volume_7d_change_percent": 0.19602006660813098,
                      "volume_30d_usd": 50881158726.32789,
                      "volume_30d_change_percent": -44.776825872610445,
                      "trade_1m_count": 3106,
                      "trade_5m_count": 13823,
                      "trade_30m_count": 78255,
                      "trade_1h_count": 152533,
                      "trade_2h_count": 287556,
                      "trade_4h_count": 622509,
                      "trade_8h_count": 1262789,
                      "trade_24h_count": 3805792,
                      "trade_7d_count": 26859044,
                      "trade_30d_count": 106739919,
                      "buy_24h": 1866645,
                      "buy_24h_change_percent": -13.838975176566759,
                      "volume_buy_24h_usd": 785187030.2092333,
                      "volume_buy_24h_change_percent": -17.483967313700145,
                      "buy_7d": 13111982,
                      "buy_7d_change_percent": -1.1499550907164513,
                      "volume_buy_7d_usd": 5497050486.576448,
                      "volume_buy_7d_change_percent": -0.11422541847775614,
                      "buy_30d": 52384055,
                      "buy_30d_change_percent": -19.06397767685987,
                      "volume_buy_30d_usd": 25530963641.516197,
                      "volume_buy_30d_change_percent": -44.845365851293614,
                      "sell_24h": 1939147,
                      "sell_24h_change_percent": -14.558761843663639,
                      "volume_sell_24h_usd": 776171853.6728687,
                      "volume_sell_24h_change_percent": -17.71518694174977,
                      "sell_7d": 13747062,
                      "sell_7d_change_percent": -0.7381533105196504,
                      "volume_sell_7d_usd": 5505892450.410731,
                      "volume_sell_7d_change_percent": 0.507695573136195,
                      "sell_30d": 54355864,
                      "sell_30d_change_percent": -17.98159868592781,
                      "volume_sell_30d_usd": 25350195084.81169,
                      "volume_sell_30d_change_percent": -44.70762485154118,
                      "unique_wallet_24h": 97794,
                      "unique_wallet_24h_change_percent": -0.9299781181619255,
                      "price": 0.9998369626608599,
                      "price_change_1m_percent": 0.0006212696240536864,
                      "price_change_5m_percent": 0.001696571468846449,
                      "price_change_30m_percent": -0.005174309814692479,
                      "price_change_1h_percent": -0.007304391309228121,
                      "price_change_2h_percent": -0.004304250424063729,
                      "price_change_4h_percent": -0.006304364350449888,
                      "price_change_8h_percent": -0.014304019994411629,
                      "price_change_24h_percent": -0.0036305799372838227,
                      "price_change_7d_percent": -0.010137765388845308,
                      "price_change_30d_percent": -0.01030435217514935,
                      "holder": 6354377,
                      "recent_listing_time": null,
                      "is_scaled_ui_token": false,
                      "multiplier": null
                    }
                  ],
                  "hasNext": true
                }
              }
            },
            "TokenListV3ScrollData": {
              "value": {
                "data": {
                  "next_scroll_id": "FGluY2x1ZGVfY29udGV4dF91dWlkDXF1ZXJ5QW5kRmV0Y2gBFmZGREI3THl5UlBDOVVJbzNTMXNvR3cAAAAAAHBZkRZzbmcwdVpNdlRlcW1qdll2eFhBMnd3",
                  "scroll_time": "30s",
                  "items": [
                    {
                      "address": "So11111111111111111111111111111111111111112",
                      "logo_uri": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
                      "name": "Wrapped SOL",
                      "symbol": "SOL",
                      "decimals": 9,
                      "extensions": null,
                      "market_cap": 80713028194.94469,
                      "fdv": 80681317625.50807,
                      "liquidity": 102195454231.63649,
                      "total_supply": 607331645.8349773,
                      "circulating_supply": 539665463.3820738,
                      "last_trade_unix_time": 1740624839,
                      "volume_1h_usd": 119052838.8883853,
                      "volume_1h_change_percent": -30.676240518398508,
                      "volume_2h_usd": 347643855.9198067,
                      "volume_2h_change_percent": -36.688231416663434,
                      "volume_4h_usd": 836575903.2292848,
                      "volume_4h_change_percent": 52.61914024534799,
                      "volume_8h_usd": 1576625036.3259573,
                      "volume_8h_change_percent": 6.480949870721473,
                      "volume_24h_usd": 1577428262.8046324,
                      "volume_24h_change_percent": 1510.6913892846712,
                      "trade_1h_count": 975539,
                      "trade_2h_count": 2036713,
                      "trade_4h_count": 3892579,
                      "trade_8h_count": 6655047,
                      "trade_24h_count": 6658133,
                      "buy_24h": 14771154,
                      "buy_24h_change_percent": 7.746892343149886,
                      "volume_buy_24h_usd": 4993762682.777149,
                      "volume_buy_24h_change_percent": 10.97366285493131,
                      "sell_24h": 18141313,
                      "sell_24h_change_percent": 2.5983034387059663,
                      "volume_sell_24h_usd": 4943234699.7945595,
                      "volume_sell_24h_change_percent": 9.47816681940243,
                      "unique_wallet_24h": 1262031,
                      "unique_wallet_24h_change_percent": -26.286938857043396,
                      "price": 135.60243562980554,
                      "price_change_1h_percent": -1.2205896217256513,
                      "price_change_2h_percent": -0.7972262955887118,
                      "price_change_4h_percent": -0.5530869831453828,
                      "price_change_8h_percent": 3.0142100916272554,
                      "price_change_24h_percent": null,
                      "holder": 89514,
                      "recent_listing_time": 1736177092
                    }
                  ]
                },
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
  "operationId": "get-defi-v3-token-list-scroll",
  "x-mint": {
    "href": "/data-api/tokenmarket-list/get-defi-v3-token-list-scroll"
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
