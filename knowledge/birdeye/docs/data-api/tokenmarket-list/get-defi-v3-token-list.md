---
title: "Token - List (V3)"
description: "Retrieve a list of tokens on a specified chain."
hidden: false
metadata:
  title: Birdeye Data API | Token - List (V3)
  description: Retrieve a list of tokens on a specified chain.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/token/list"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Token screener and ranked list endpoint.</strong></p>
  <ul>
    <li>This is the richer token-list endpoint with filtering across liquidity, market cap, FDV, holder count, recent listing time, last trade time, volume, price change, trade counts, and global fees paid.</li>
    <li><code>limit</code> supports <code>1</code> to <code>100</code> items per request and <code>offset</code> supports up to <code>10,000</code>.</li>
    <li>Default ranking is <code>sort_by=liquidity</code> with descending order.</li>
    <li>Use <code>ui_amount_mode</code> when downstream token-amount fields need chain-aware scaled values.</li>
    <li>This endpoint is designed for interactive screening; use the scroll variant when you need deeper crawling beyond normal pagination.</li>
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
  <p><strong>All chains ⛓️ ✨</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>50 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Build token screeners ranked by liquidity, market cap, activity, holder count, or recent price momentum.</li>
    <li>Discover tradable assets that satisfy quality floors such as minimum liquidity or volume.</li>
    <li>Power leaderboard pages, research dashboards, and filtered market boards.</li>
    <li>Shortlist candidates before running price, security, holder, or smart-money analysis.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Choose a ranking field in <code>sort_by</code> and a direction in <code>sort_type</code>.</li>
    <li>Apply only the filters needed for the screen, such as <code>min_liquidity</code>, <code>min_market_cap</code>, <code>min_volume_24h_usd</code>, or <code>min_trade_24h_count</code>.</li>
    <li>Page with <code>offset</code> and <code>limit</code>, keeping <code>limit</code> at <code>100</code> or below.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Start with a narrow filter set and add thresholds incrementally so you can see which condition removes too much of the market.</li>
    <li>Keep ranking and filtering aligned; for example, pair momentum filters with momentum sort fields, not unrelated liquidity ordering.</li>
    <li>For app UIs, use this endpoint for the first few pages and reserve scroll-based crawling for back-office jobs.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/token/list

```json
{
  "tags": [
    "Token/Market List"
  ],
  "summary": "Token - List (V3)",
  "description": "Retrieve a list of tokens on a specified chain.",
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
      "name": "min_global_fees_paid",
      "description": "Specify the minimum all-time global fee paid amount in SOL.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number"
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
        "default": 100,
        "minimum": 1,
        "maximum": 100
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
                "description": "Token-list payload with screener-style market, price, and activity metrics.",
                "properties": {
                  "items": {
                    "type": "array",
                    "description": "Token rows returned for the request.",
                    "items": {
                      "type": "object",
                      "description": "One token row from the V3 token list.",
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
                      "address": "So11111111111111111111111111111111111111112",
                      "logo_uri": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
                      "name": "Wrapped SOL",
                      "symbol": "SOL",
                      "decimals": 9,
                      "extensions": {
                        "coingecko_id": "solana",
                        "serum_v3_usdc": "9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT",
                        "serum_v3_usdt": "HWHvQhFmJB3NUcu1aihKmrKegfVxBEHzwVX6yZCKEsi1",
                        "website": "https://solana.com/",
                        "telegram": null,
                        "twitter": "https://twitter.com/solana",
                        "description": "Wrapped Solana ",
                        "discord": "https://discordapp.com/invite/pquxPsq",
                        "medium": "https://medium.com/solana-labs"
                      },
                      "market_cap": 47804731539.07422,
                      "fdv": 52235322779.27986,
                      "total_supply": 620122784.8312707,
                      "circulating_supply": 567524075.143289,
                      "liquidity": 5022039892.110555,
                      "last_trade_unix_time": 1770719861,
                      "volume_1m_usd": 5391130.519996273,
                      "volume_5m_usd": 28359800.05996658,
                      "volume_30m_usd": 204986981.09311706,
                      "volume_1m_change_percent": -7.179022227208377,
                      "volume_5m_change_percent": -41.473980089148036,
                      "volume_30m_change_percent": -27.375926305902265,
                      "volume_1h_usd": 463249920.4345513,
                      "volume_1h_change_percent": -10.711726491059386,
                      "volume_2h_usd": 954270205.9201734,
                      "volume_2h_change_percent": -6.883129860766711,
                      "volume_4h_usd": 1952318583.0152369,
                      "volume_4h_change_percent": -17.06915667365536,
                      "volume_8h_usd": 4089123147.485524,
                      "volume_8h_change_percent": -12.566952710315663,
                      "volume_24h_usd": 12633047621.390213,
                      "volume_24h_change_percent": -12.921308265029118,
                      "volume_7d_usd": 106771633719.01566,
                      "volume_7d_change_percent": 31.90021766177634,
                      "volume_30d_usd": 391778461308.8114,
                      "volume_30d_change_percent": 132.15573119504776,
                      "trade_1m_count": 24331,
                      "trade_5m_count": 119357,
                      "trade_30m_count": 764052,
                      "trade_1h_count": 1489737,
                      "trade_2h_count": 3042558,
                      "trade_4h_count": 6412259,
                      "trade_8h_count": 12570622,
                      "trade_24h_count": 36973993,
                      "trade_7d_count": 258141842,
                      "trade_30d_count": 1003628436,
                      "buy_24h": 16481536,
                      "buy_24h_change_percent": -0.9536171997725992,
                      "volume_buy_24h_usd": 6302501622.213389,
                      "volume_buy_24h_change_percent": -12.806383632452265,
                      "buy_7d": 114379995,
                      "buy_7d_change_percent": 7.715464699960623,
                      "volume_buy_7d_usd": 53297726916.68083,
                      "volume_buy_7d_change_percent": 32.49353523038235,
                      "buy_30d": 431992822,
                      "buy_30d_change_percent": 47.46342899958093,
                      "volume_buy_30d_usd": 194545982041.11035,
                      "volume_buy_30d_change_percent": 135.1685602170761,
                      "sell_24h": 20492457,
                      "sell_24h_change_percent": -2.2658535562879996,
                      "volume_sell_24h_usd": 6330545999.176824,
                      "volume_sell_24h_change_percent": -13.035405188202965,
                      "sell_7d": 143761847,
                      "sell_7d_change_percent": 2.7004638578022044,
                      "volume_sell_7d_usd": 53473906802.33482,
                      "volume_sell_7d_change_percent": 31.313993807692704,
                      "sell_30d": 571635614,
                      "sell_30d_change_percent": 42.041623270904104,
                      "volume_sell_30d_usd": 197232479267.70108,
                      "volume_sell_30d_change_percent": 129.25438596973004,
                      "unique_wallet_24h": 1078316,
                      "unique_wallet_24h_change_percent": 27.006090501244365,
                      "price": 84.23383893802996,
                      "price_change_1m_percent": 0.009695978575668942,
                      "price_change_5m_percent": -0.11684480646276182,
                      "price_change_30m_percent": -0.18244121670926866,
                      "price_change_1h_percent": -0.4145320861606307,
                      "price_change_2h_percent": 0.017801124275801165,
                      "price_change_4h_percent": -1.4714631467113624,
                      "price_change_8h_percent": -2.6402925798351617,
                      "price_change_24h_percent": 1.3435381835763764,
                      "price_change_7d_percent": -17.97571312121106,
                      "price_change_30d_percent": -38.274858405973575,
                      "holder": 5395501,
                      "recent_listing_time": null,
                      "global_fees_paid": 125.5,
                      "is_scaled_ui_token": false,
                      "multiplier": null
                    }
                  ],
                  "hasNext": true
                }
              }
            },
            "TokenListV3Data": {
              "value": {
                "data": {
                  "items": [
                    {
                      "address": "So11111111111111111111111111111111111111112",
                      "logo_uri": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
                      "name": "Wrapped SOL",
                      "symbol": "SOL",
                      "decimals": 9,
                      "extensions": {
                        "coingecko_id": "solana",
                        "serum_v3_usdc": "9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT",
                        "serum_v3_usdt": "HWHvQhFmJB3NUcu1aihKmrKegfVxBEHzwVX6yZCKEsi1",
                        "website": "https://solana.com/",
                        "telegram": null,
                        "twitter": "https://twitter.com/solana",
                        "description": "Wrapped Solana ",
                        "discord": "https://discordapp.com/invite/pquxPsq",
                        "medium": "https://medium.com/solana-labs"
                      },
                      "market_cap": 70986064152.41452,
                      "fdv": 83119267824.4418,
                      "liquidity": 21550102465.71004,
                      "total_supply": 607331645.8349773,
                      "circulating_supply": 539665463.3820738,
                      "last_trade_unix_time": 1741400559,
                      "volume_1h_usd": 114732972.33349997,
                      "volume_1h_change_percent": 26.600242887580787,
                      "volume_2h_usd": 197164311.91243982,
                      "volume_2h_change_percent": -24.201147221219546,
                      "volume_4h_usd": 494857896.4547814,
                      "volume_4h_change_percent": -37.41364293011281,
                      "volume_8h_usd": 1249189237.4290442,
                      "volume_8h_change_percent": 1.7083969276685818,
                      "volume_24h_usd": 3362990076.206178,
                      "volume_24h_change_percent": 17.12828046192169,
                      "volume_7d_usd": 44776616773.85637,
                      "volume_7d_change_percent": -4.490473727713475,
                      "volume_30d_usd": 194809679362.42694,
                      "volume_30d_change_percent": -11.806191109609804,
                      "trade_1h_count": 1023528,
                      "trade_2h_count": 1904835,
                      "trade_4h_count": 4538696,
                      "trade_8h_count": 9721597,
                      "trade_24h_count": 26369792,
                      "trade_7d_count": 151448507,
                      "trade_30d_count": 666734917,
                      "buy_24h": 14771154,
                      "buy_24h_change_percent": 7.746892343149886,
                      "volume_buy_24h_usd": 4993762682.777149,
                      "volume_buy_24h_change_percent": 10.97366285493131,
                      "sell_24h": 18141313,
                      "sell_24h_change_percent": 2.5983034387059663,
                      "volume_sell_24h_usd": 4943234699.7945595,
                      "volume_sell_24h_change_percent": 9.47816681940243,
                      "buy_7d": 62405012,
                      "buy_7d_change_percent": -2.9000492307002896,
                      "volume_buy_7d_usd": 21913747848.287697,
                      "volume_buy_7d_change_percent": -4.373314066523053,
                      "buy_30d": 273142584,
                      "buy_30d_change_percent": -10.964893920828219,
                      "volume_buy_30d_usd": 95177822772.74564,
                      "volume_buy_30d_change_percent": -12.672501751867692,
                      "sell_7d": 89043495,
                      "sell_7d_change_percent": -6.44253507663079,
                      "volume_sell_7d_usd": 22862868925.56867,
                      "volume_sell_7d_change_percent": -4.602503467697474,
                      "sell_30d": 393592333,
                      "sell_30d_change_percent": -7.507152214571946,
                      "volume_sell_30d_usd": 99631856589.68129,
                      "volume_sell_30d_change_percent": -10.962345770960217,
                      "unique_wallet_24h": 1262031,
                      "unique_wallet_24h_change_percent": -26.286938857043396,
                      "price": 139.52300907321856,
                      "price_change_1h_percent": 0.003981660688414792,
                      "price_change_2h_percent": 0.5243251304288506,
                      "price_change_4h_percent": -1.3858689583782735,
                      "price_change_8h_percent": -3.8244082037697713,
                      "price_change_24h_percent": -0.5479088778176531,
                      "price_change_7d_percent": -6.276199085335215,
                      "price_change_30d_percent": -10.863860572329296,
                      "holder": 1420526,
                      "recent_listing_time": null,
                      "global_fees_paid": 125.5
                    }
                  ],
                  "has_next": true
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
  "operationId": "get-defi-v3-token-list",
  "x-mint": {
    "href": "/data-api/tokenmarket-list/get-defi-v3-token-list"
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
