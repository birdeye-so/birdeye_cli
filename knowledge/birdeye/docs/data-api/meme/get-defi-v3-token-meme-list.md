---
title: "Meme Token - List"
description: "Get list of meme tokens"
hidden: false
metadata:
  title: Birdeye Data API | Meme Token - List
  description: Get list of meme tokens
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/token/meme/list"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Discovery list for meme tokens across supported launch ecosystems.</strong></p>
  <ul>
    <li>Use filtering, sorting, and pagination to shape the exact meme board you need.</li>
    <li>Returns summary-level token data such as name, symbol, address, price, volume, market cap, and popularity-style metrics.</li>
    <li>Coverage depends on launch venue data availability:</li>
    <li><code>pump_dot_fun</code>, <code>moonshot</code>, <code>raydium_launchlab</code>: from <strong>2025-06-20</strong></li>
    <li><code>meteora_dynamic_bonding_curve</code>: from <strong>2025-09-20</strong></li>
    <li><code>four.meme</code>: from <strong>2025-11-20</strong></li>
    <li><code>nad.fun</code>: from <strong>2025-11-17</strong></li>
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
  <p><strong>BSC</strong></p>
  <p><strong>Monad</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>30 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Build meme-token discovery boards across supported chains and launch venues.</li>
    <li>Surface fast-moving meme names for watchlists, alerts, and internal research queues.</li>
    <li>Feed launch-monitoring products with sortable popularity, price, and activity snapshots.</li>
    <li>Compare meme-token cohorts before drilling into detailed token pages.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> to <code>solana</code>, <code>bsc</code>, or <code>monad</code>.</li>
    <li>Apply filters and sorting to narrow the meme-token universe to the cohort you care about.</li>
    <li>Use pagination parameters to scroll through larger result sets.</li>
    <li>Open the single-detail endpoint when one token needs deeper inspection.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Treat this as a discovery layer first, then validate shortlisted tokens with market, holder, security, and transaction endpoints.</li>
    <li>Keep venue and chain filters visible in UI so users understand why a token appears in the list.</li>
    <li>Re-query on a moderate cadence during active launches because meme-token rankings can move quickly.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/token/meme/list

```json
{
  "tags": [
    "Meme"
  ],
  "summary": "Meme Token - List",
  "description": "Get list of meme tokens",
  "parameters": [
    {
      "name": "x-chain",
      "description": "Meme networks support.",
      "in": "header",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "solana",
          "bsc",
          "monad"
        ],
        "default": "solana"
      }
    },
    {
      "name": "sort_by",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "enum": [
          "progress_percent",
          "graduated_time",
          "creation_time",
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
        "default": "progress_percent"
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
      "name": "source",
      "description": "Source name of the meme token. Default to all",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "all",
          "pump_dot_fun",
          "moonshot",
          "raydium_launchlab",
          "meteora_dynamic_bonding_curve",
          "four.meme",
          "nad.fun",
          "flap",
          "something",
          "lfj_token_mill"
        ],
        "default": "all"
      }
    },
    {
      "name": "creator",
      "description": "Creator of the meme token",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string"
      },
      "examples": {
        "creator": {
          "value": "F2Q7h7KSmHqE4bW2xCU1Qmeicge1UZdjZAJZnU1736wU"
        }
      }
    },
    {
      "name": "platform_id",
      "description": "The program address of the meme platform.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana_pump_fun": {
          "value": "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
        }
      }
    },
    {
      "name": "graduated",
      "description": "Filter meme tokens which already graduated",
      "in": "query",
      "required": false,
      "schema": {
        "type": "boolean"
      }
    },
    {
      "name": "min_progress_percent",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "minimum": 0,
        "exclusiveMinimum": true,
        "maximum": 100
      }
    },
    {
      "name": "max_progress_percent",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "minimum": 0,
        "exclusiveMinimum": true,
        "maximum": 100,
        "exclusiveMaximum": true
      }
    },
    {
      "name": "min_graduated_time",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "minimum": 0,
        "exclusiveMinimum": true,
        "maximum": 10000000000
      }
    },
    {
      "name": "max_graduated_time",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "minimum": 0,
        "exclusiveMinimum": true,
        "maximum": 10000000000
      }
    },
    {
      "name": "min_creation_time",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "minimum": 0,
        "exclusiveMinimum": true,
        "maximum": 10000000000
      }
    },
    {
      "name": "max_creation_time",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "minimum": 0,
        "exclusiveMinimum": true,
        "maximum": 10000000000
      }
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
    }
  ],
  "responses": {
    "200": {
      "description": "OK",
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
                  "items": {
                    "type": "array",
                    "description": "Meme tokens returned for the requested sort and filters.",
                    "items": {
                      "type": "object",
                      "additionalProperties": true,
                      "properties": {
                        "address": {
                          "type": "string",
                          "description": "Token mint address."
                        },
                        "logo_uri": {
                          "type": "string",
                          "description": "Logo URL for the token."
                        },
                        "name": {
                          "type": "string",
                          "description": "Display name of the token."
                        },
                        "symbol": {
                          "type": "string",
                          "description": "Ticker symbol of the token."
                        },
                        "decimals": {
                          "type": "integer",
                          "description": "Number of token decimals."
                        },
                        "extensions": {
                          "type": [
                            "object",
                            "null"
                          ],
                          "description": "Optional social links and external metadata.",
                          "additionalProperties": {
                            "type": [
                              "string",
                              "number",
                              "boolean",
                              "null"
                            ]
                          }
                        },
                        "market_cap": {
                          "type": "number",
                          "description": "Current market capitalization in USD."
                        },
                        "fdv": {
                          "type": "number",
                          "description": "Fully diluted valuation in USD."
                        },
                        "total_supply": {
                          "type": "number",
                          "description": "Current total token supply."
                        },
                        "circulating_supply": {
                          "type": "number",
                          "description": "Current circulating supply."
                        },
                        "liquidity": {
                          "type": "number",
                          "description": "Current token liquidity in USD."
                        },
                        "last_trade_unix_time": {
                          "type": "integer",
                          "description": "Unix timestamp in seconds of the latest observed trade."
                        },
                        "global_fees_paid": {
                          "type": "number",
                          "description": "Global fees paid by the token, in SOL-equivalent units where available."
                        },
                        "holder": {
                          "type": "integer",
                          "description": "Current holder count."
                        },
                        "recent_listing_time": {
                          "type": "integer",
                          "description": "Unix timestamp in seconds when the token was recently listed."
                        },
                        "price": {
                          "type": "number",
                          "description": "Latest token price in USD."
                        },
                        "meme_info": {
                          "type": "object",
                          "additionalProperties": true,
                          "properties": {
                            "created_at": {
                              "type": "object",
                              "additionalProperties": true,
                              "properties": {
                                "block_time": {
                                  "type": [
                                    "integer",
                                    "null"
                                  ],
                                  "description": "Block timestamp in Unix seconds for the recorded event."
                                },
                                "slot": {
                                  "type": [
                                    "integer",
                                    "null"
                                  ],
                                  "description": "Solana slot for the recorded event."
                                },
                                "tx_hash": {
                                  "type": [
                                    "string",
                                    "null"
                                  ],
                                  "description": "Transaction signature that recorded the event."
                                }
                              }
                            },
                            "creator": {
                              "type": "string",
                              "description": "Creator wallet that launched the meme token."
                            },
                            "address": {
                              "type": "string",
                              "description": "Token address for the meme asset."
                            },
                            "creation_time": {
                              "type": "integer",
                              "description": "Unix timestamp in seconds when the token was created."
                            },
                            "graduated": {
                              "type": "boolean",
                              "description": "Whether the token has graduated out of the launch platform."
                            },
                            "pool": {
                              "type": "object",
                              "additionalProperties": true,
                              "properties": {
                                "address": {
                                  "type": [
                                    "string",
                                    "null"
                                  ],
                                  "description": "Pool address associated with the meme token launch."
                                },
                                "real_sol_reserves": {
                                  "type": [
                                    "string",
                                    "null"
                                  ],
                                  "description": "Observed SOL reserves in the bonding curve or launch pool."
                                },
                                "real_token_reserves": {
                                  "type": [
                                    "string",
                                    "null"
                                  ],
                                  "description": "Observed token reserves in the launch pool."
                                },
                                "virtual_token_reserves": {
                                  "type": [
                                    "string",
                                    "null"
                                  ],
                                  "description": "Virtual token reserves used by the launch mechanism when applicable."
                                },
                                "token_total_supply": {
                                  "type": [
                                    "string",
                                    "null"
                                  ],
                                  "description": "Total token supply tracked by the launch pool."
                                }
                              }
                            },
                            "progress_percent": {
                              "type": "number",
                              "description": "Bonding-curve or launch progress as a percentage."
                            },
                            "source": {
                              "type": "string",
                              "description": "Launch platform or source for the meme token."
                            },
                            "platform_id": {
                              "type": "string",
                              "description": "Platform program or contract identifier for the launch source."
                            },
                            "graduated_time": {
                              "type": [
                                "integer",
                                "null"
                              ],
                              "description": "Unix timestamp in seconds when the token graduated, if it has graduated."
                            },
                            "updated_at": {
                              "type": "object",
                              "additionalProperties": true,
                              "properties": {
                                "tx_hash": {
                                  "type": [
                                    "string",
                                    "null"
                                  ],
                                  "description": "Transaction signature of the last tracked metadata update."
                                },
                                "slot": {
                                  "type": [
                                    "integer",
                                    "null"
                                  ],
                                  "description": "Slot of the last tracked metadata update."
                                }
                              }
                            },
                            "graduated_at": {
                              "type": "object",
                              "additionalProperties": true,
                              "properties": {
                                "block_time": {
                                  "type": [
                                    "integer",
                                    "null"
                                  ],
                                  "description": "Block timestamp in Unix seconds for the recorded event."
                                },
                                "slot": {
                                  "type": [
                                    "integer",
                                    "null"
                                  ],
                                  "description": "Solana slot for the recorded event."
                                },
                                "tx_hash": {
                                  "type": [
                                    "string",
                                    "null"
                                  ],
                                  "description": "Transaction signature that recorded the event."
                                }
                              }
                            }
                          }
                        },
                        "volume_1m_usd": {
                          "type": "number",
                          "description": "USD trading volume during the latest 1m window."
                        },
                        "volume_1m_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in USD trading volume versus the previous 1m window."
                        },
                        "price_change_1m_percent": {
                          "type": "number",
                          "description": "Percentage change in token price versus 1m ago."
                        },
                        "volume_5m_usd": {
                          "type": "number",
                          "description": "USD trading volume during the latest 5m window."
                        },
                        "volume_5m_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in USD trading volume versus the previous 5m window."
                        },
                        "price_change_5m_percent": {
                          "type": "number",
                          "description": "Percentage change in token price versus 5m ago."
                        },
                        "volume_30m_usd": {
                          "type": "number",
                          "description": "USD trading volume during the latest 30m window."
                        },
                        "volume_30m_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in USD trading volume versus the previous 30m window."
                        },
                        "price_change_30m_percent": {
                          "type": "number",
                          "description": "Percentage change in token price versus 30m ago."
                        },
                        "volume_1h_usd": {
                          "type": "number",
                          "description": "USD trading volume during the latest 1h window."
                        },
                        "volume_1h_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in USD trading volume versus the previous 1h window."
                        },
                        "price_change_1h_percent": {
                          "type": "number",
                          "description": "Percentage change in token price versus 1h ago."
                        },
                        "volume_2h_usd": {
                          "type": "number",
                          "description": "USD trading volume during the latest 2h window."
                        },
                        "volume_2h_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in USD trading volume versus the previous 2h window."
                        },
                        "price_change_2h_percent": {
                          "type": "number",
                          "description": "Percentage change in token price versus 2h ago."
                        },
                        "volume_4h_usd": {
                          "type": "number",
                          "description": "USD trading volume during the latest 4h window."
                        },
                        "volume_4h_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in USD trading volume versus the previous 4h window."
                        },
                        "price_change_4h_percent": {
                          "type": "number",
                          "description": "Percentage change in token price versus 4h ago."
                        },
                        "volume_8h_usd": {
                          "type": "number",
                          "description": "USD trading volume during the latest 8h window."
                        },
                        "volume_8h_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in USD trading volume versus the previous 8h window."
                        },
                        "price_change_8h_percent": {
                          "type": "number",
                          "description": "Percentage change in token price versus 8h ago."
                        },
                        "volume_24h_usd": {
                          "type": "number",
                          "description": "USD trading volume during the latest 24h window."
                        },
                        "volume_24h_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in USD trading volume versus the previous 24h window."
                        },
                        "price_change_24h_percent": {
                          "type": "number",
                          "description": "Percentage change in token price versus 24h ago."
                        },
                        "volume_7d_usd": {
                          "type": "number",
                          "description": "USD trading volume during the latest 7d window."
                        },
                        "volume_7d_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in USD trading volume versus the previous 7d window."
                        },
                        "price_change_7d_percent": {
                          "type": "number",
                          "description": "Percentage change in token price versus 7d ago."
                        },
                        "volume_30d_usd": {
                          "type": "number",
                          "description": "USD trading volume during the latest 30d window."
                        },
                        "volume_30d_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in USD trading volume versus the previous 30d window."
                        },
                        "price_change_30d_percent": {
                          "type": "number",
                          "description": "Percentage change in token price versus 30d ago."
                        },
                        "trade_1m_count": {
                          "type": "integer",
                          "description": "Total trade count during the latest 1m window."
                        },
                        "trade_5m_count": {
                          "type": "integer",
                          "description": "Total trade count during the latest 5m window."
                        },
                        "trade_30m_count": {
                          "type": "integer",
                          "description": "Total trade count during the latest 30m window."
                        },
                        "trade_1h_count": {
                          "type": "integer",
                          "description": "Total trade count during the latest 1h window."
                        },
                        "trade_2h_count": {
                          "type": "integer",
                          "description": "Total trade count during the latest 2h window."
                        },
                        "trade_4h_count": {
                          "type": "integer",
                          "description": "Total trade count during the latest 4h window."
                        },
                        "trade_8h_count": {
                          "type": "integer",
                          "description": "Total trade count during the latest 8h window."
                        },
                        "trade_24h_count": {
                          "type": "integer",
                          "description": "Total trade count during the latest 24h window."
                        },
                        "trade_7d_count": {
                          "type": "integer",
                          "description": "Total trade count during the latest 7d window."
                        },
                        "trade_30d_count": {
                          "type": "integer",
                          "description": "Total trade count during the latest 30d window."
                        },
                        "buy_24h": {
                          "type": "integer",
                          "description": "Buy-side trade count during the latest 24h window."
                        },
                        "buy_24h_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in buy-side trade count versus the previous 24h window."
                        },
                        "volume_buy_24h_usd": {
                          "type": "number",
                          "description": "Buy-side USD volume during the latest 24h window."
                        },
                        "volume_buy_24h_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in buy-side USD volume versus the previous 24h window."
                        },
                        "sell_24h": {
                          "type": "integer",
                          "description": "Sell-side trade count during the latest 24h window."
                        },
                        "sell_24h_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in sell-side trade count versus the previous 24h window."
                        },
                        "volume_sell_24h_usd": {
                          "type": "number",
                          "description": "Sell-side USD volume during the latest 24h window."
                        },
                        "volume_sell_24h_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in sell-side USD volume versus the previous 24h window."
                        },
                        "buy_7d": {
                          "type": "integer",
                          "description": "Buy-side trade count during the latest 7d window."
                        },
                        "buy_7d_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in buy-side trade count versus the previous 7d window."
                        },
                        "volume_buy_7d_usd": {
                          "type": "number",
                          "description": "Buy-side USD volume during the latest 7d window."
                        },
                        "volume_buy_7d_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in buy-side USD volume versus the previous 7d window."
                        },
                        "sell_7d": {
                          "type": "integer",
                          "description": "Sell-side trade count during the latest 7d window."
                        },
                        "sell_7d_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in sell-side trade count versus the previous 7d window."
                        },
                        "volume_sell_7d_usd": {
                          "type": "number",
                          "description": "Sell-side USD volume during the latest 7d window."
                        },
                        "volume_sell_7d_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in sell-side USD volume versus the previous 7d window."
                        },
                        "buy_30d": {
                          "type": "integer",
                          "description": "Buy-side trade count during the latest 30d window."
                        },
                        "buy_30d_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in buy-side trade count versus the previous 30d window."
                        },
                        "volume_buy_30d_usd": {
                          "type": "number",
                          "description": "Buy-side USD volume during the latest 30d window."
                        },
                        "volume_buy_30d_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in buy-side USD volume versus the previous 30d window."
                        },
                        "sell_30d": {
                          "type": "integer",
                          "description": "Sell-side trade count during the latest 30d window."
                        },
                        "sell_30d_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in sell-side trade count versus the previous 30d window."
                        },
                        "volume_sell_30d_usd": {
                          "type": "number",
                          "description": "Sell-side USD volume during the latest 30d window."
                        },
                        "volume_sell_30d_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in sell-side USD volume versus the previous 30d window."
                        },
                        "unique_wallet_24h": {
                          "type": "integer",
                          "description": "Number of distinct wallets that traded the token during the latest 24-hour window."
                        },
                        "unique_wallet_24h_change_percent": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Percentage change in distinct trading wallets versus the previous 24-hour window."
                        }
                      }
                    }
                  },
                  "has_next": {
                    "type": "boolean",
                    "description": "Whether more tokens are available for pagination."
                  }
                }
              }
            }
          },
          "examples": {
            "MemeTokenListData": {
              "value": {
                "data": {
                  "items": [
                    {
                      "address": "4kniCuBuhsLBPv1zzGFEw8tySw6xV6NiHjme3pN8pump",
                      "logo_uri": "https://ipfs.io/ipfs/QmZF9uaGwUYYq4v9xbPxivHDH561jd1auoPQ8zZLmssLNx",
                      "name": "nothing ever Happens",
                      "symbol": "neh",
                      "decimals": 6,
                      "extensions": null,
                      "market_cap": 2378.761186407517,
                      "fdv": 2378.761186407517,
                      "total_supply": 1000000000,
                      "circulating_supply": 1000000000,
                      "liquidity": 0.32746902247014553,
                      "last_trade_unix_time": 1770718076,
                      "global_fees_paid": 5.5,
                      "volume_1m_usd": 0,
                      "volume_5m_usd": 0,
                      "volume_30m_usd": 83.33272090352035,
                      "volume_1m_change_percent": null,
                      "volume_5m_change_percent": null,
                      "volume_30m_change_percent": null,
                      "volume_1h_usd": 83.33272090352035,
                      "volume_1h_change_percent": null,
                      "volume_2h_usd": 83.33272090352035,
                      "volume_2h_change_percent": null,
                      "volume_4h_usd": 83.33272090352035,
                      "volume_4h_change_percent": null,
                      "volume_8h_usd": 83.33272090352035,
                      "volume_8h_change_percent": null,
                      "volume_24h_usd": 83.33272090352035,
                      "volume_24h_change_percent": null,
                      "volume_7d_usd": 83.33272090352035,
                      "volume_7d_change_percent": null,
                      "volume_30d_usd": 83.33272090352035,
                      "volume_30d_change_percent": null,
                      "trade_1m_count": 0,
                      "trade_5m_count": 0,
                      "trade_30m_count": 5,
                      "trade_1h_count": 5,
                      "trade_2h_count": 5,
                      "trade_4h_count": 5,
                      "trade_8h_count": 5,
                      "trade_24h_count": 5,
                      "trade_7d_count": 5,
                      "trade_30d_count": 5,
                      "buy_24h": 3,
                      "buy_24h_change_percent": null,
                      "volume_buy_24h_usd": 41.672060333790355,
                      "volume_buy_24h_change_percent": null,
                      "buy_7d": 3,
                      "buy_7d_change_percent": null,
                      "volume_buy_7d_usd": 41.672060333790355,
                      "volume_buy_7d_change_percent": null,
                      "buy_30d": 3,
                      "buy_30d_change_percent": null,
                      "volume_buy_30d_usd": 41.672060333790355,
                      "volume_buy_30d_change_percent": null,
                      "sell_24h": 2,
                      "sell_24h_change_percent": null,
                      "volume_sell_24h_usd": 41.66066056973,
                      "volume_sell_24h_change_percent": null,
                      "sell_7d": 2,
                      "sell_7d_change_percent": null,
                      "volume_sell_7d_usd": 41.66066056973,
                      "volume_sell_7d_change_percent": null,
                      "sell_30d": 2,
                      "sell_30d_change_percent": null,
                      "volume_sell_30d_usd": 41.66066056973,
                      "volume_sell_30d_change_percent": null,
                      "unique_wallet_24h": 3,
                      "unique_wallet_24h_change_percent": null,
                      "price": 0.000002378761186407517,
                      "price_change_1m_percent": 0,
                      "price_change_5m_percent": 0,
                      "price_change_30m_percent": -0.05600390312888975,
                      "price_change_1h_percent": -0.05600390312888975,
                      "price_change_2h_percent": -0.05600390312888975,
                      "price_change_4h_percent": -0.05600390312888975,
                      "price_change_8h_percent": -0.05600390312888975,
                      "price_change_24h_percent": -0.05600390312888975,
                      "price_change_7d_percent": -0.05600390312888975,
                      "price_change_30d_percent": -0.05600390312888975,
                      "holder": 2,
                      "recent_listing_time": 1770717909,
                      "meme_info": {
                        "created_at": {
                          "block_time": 1770717909,
                          "slot": 399301182,
                          "tx_hash": "57T66aM8PdrLG7mGZc4T2Uen8reC4jL9QStt8tkJcZUD5omVudbLm4tk8qrcV45Ar8i1KMTXaQxTFq8XbdGHnrSG"
                        },
                        "creator": "2J2rtMBRLxAbFkSLgrsuSNN8N5KMTJVaRTdnGfbZ5Vjw",
                        "address": "4kniCuBuhsLBPv1zzGFEw8tySw6xV6NiHjme3pN8pump",
                        "creation_time": 1770717909,
                        "graduated": false,
                        "pool": {
                          "address": "Chxbj4uRvwe94Pi4GYMgLQBkBABUJzyzoCbfMoBnQsev",
                          "real_sol_reserves": "99",
                          "real_token_reserves": "793099996586128",
                          "virtual_token_reserves": "1072999996586128",
                          "token_total_supply": "1000000000000000"
                        },
                        "progress_percent": 1.08639,
                        "source": "pump_dot_fun",
                        "platform_id": "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
                        "graduated_time": null
                      }
                    },
                    {
                      "address": "8avqVj8keXnxbNxDQ6w7rKZx2Sid8ygp1MBRnhqepump",
                      "logo_uri": "https://desperate-moccasin-minnow.myfilebase.com/ipfs/QmUPiDnnNMz3dkf8TVoknjyQsdAdixB72BMnURnByatYy9",
                      "name": "Nietzschean Giraffe",
                      "symbol": "GIRAFFEBETA",
                      "decimals": 6,
                      "extensions": null,
                      "market_cap": 2363.686706723888,
                      "fdv": 2363.686706723888,
                      "total_supply": 1000000000,
                      "circulating_supply": 1000000000,
                      "liquidity": 0.2631242285399431,
                      "last_trade_unix_time": 1770718296,
                      "global_fees_paid": 5.5,
                      "volume_1m_usd": 0,
                      "volume_5m_usd": 0,
                      "volume_30m_usd": 40.03289998373133,
                      "volume_1m_change_percent": null,
                      "volume_5m_change_percent": null,
                      "volume_30m_change_percent": null,
                      "volume_1h_usd": 40.03289998373133,
                      "volume_1h_change_percent": null,
                      "volume_2h_usd": 40.03289998373133,
                      "volume_2h_change_percent": null,
                      "volume_4h_usd": 40.03289998373133,
                      "volume_4h_change_percent": null,
                      "volume_8h_usd": 40.03289998373133,
                      "volume_8h_change_percent": null,
                      "volume_24h_usd": 40.03289998373133,
                      "volume_24h_change_percent": null,
                      "volume_7d_usd": 40.03289998373133,
                      "volume_7d_change_percent": null,
                      "volume_30d_usd": 40.03289998373133,
                      "volume_30d_change_percent": null,
                      "trade_1m_count": 0,
                      "trade_5m_count": 0,
                      "trade_30m_count": 5,
                      "trade_1h_count": 5,
                      "trade_2h_count": 5,
                      "trade_4h_count": 5,
                      "trade_8h_count": 5,
                      "trade_24h_count": 5,
                      "trade_7d_count": 5,
                      "trade_30d_count": 5,
                      "buy_24h": 3,
                      "buy_24h_change_percent": null,
                      "volume_buy_24h_usd": 20.026709987856,
                      "volume_buy_24h_change_percent": null,
                      "buy_7d": 3,
                      "buy_7d_change_percent": null,
                      "volume_buy_7d_usd": 20.026709987856,
                      "volume_buy_7d_change_percent": null,
                      "buy_30d": 3,
                      "buy_30d_change_percent": null,
                      "volume_buy_30d_usd": 20.026709987856,
                      "volume_buy_30d_change_percent": null,
                      "sell_24h": 2,
                      "sell_24h_change_percent": null,
                      "volume_sell_24h_usd": 20.00618999587533,
                      "volume_sell_24h_change_percent": null,
                      "sell_7d": 2,
                      "sell_7d_change_percent": null,
                      "volume_sell_7d_usd": 20.00618999587533,
                      "volume_sell_7d_change_percent": null,
                      "sell_30d": 2,
                      "sell_30d_change_percent": null,
                      "volume_sell_30d_usd": 20.00618999587533,
                      "volume_sell_30d_change_percent": null,
                      "unique_wallet_24h": 3,
                      "unique_wallet_24h_change_percent": null,
                      "price": 0.000002363686706723888,
                      "price_change_1m_percent": 0,
                      "price_change_5m_percent": 0,
                      "price_change_30m_percent": 0.02342091983003837,
                      "price_change_1h_percent": 0.02342091983003837,
                      "price_change_2h_percent": 0.02342091983003837,
                      "price_change_4h_percent": 0.02342091983003837,
                      "price_change_8h_percent": 0.02342091983003837,
                      "price_change_24h_percent": 0.02342091983003837,
                      "price_change_7d_percent": 0.02342091983003837,
                      "price_change_30d_percent": 0.02342091983003837,
                      "holder": 2,
                      "recent_listing_time": 1770717908,
                      "meme_info": {
                        "created_at": {
                          "block_time": 1770717908,
                          "slot": 399301180,
                          "tx_hash": "4nY7cpV4DWBhLUuKsYuXmhWKNgwrZT3Z4jB4ob31aVvsGjXnzpf56axwWkPLW6dQE3DCvoXdhC6tGuWcvh4xBqz2"
                        },
                        "creator": "DJ4hjUajRDySeCMppb6vqRN97HVuogGDAnwx2k6k1cEB",
                        "address": "8avqVj8keXnxbNxDQ6w7rKZx2Sid8ygp1MBRnhqepump",
                        "creation_time": 1770717908,
                        "graduated": false,
                        "pool": {
                          "address": "8ZL9WpMcHnrR9xGv5eVfNiYNCCdgBTNp3crAYpX74iVS",
                          "real_sol_reserves": "98765",
                          "real_token_reserves": "793096467588330",
                          "virtual_token_reserves": "1072996467588330",
                          "token_total_supply": "1000000000000000"
                        },
                        "progress_percent": 0.00045,
                        "source": "pump_dot_fun",
                        "platform_id": "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
                        "graduated_time": null
                      }
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
  "operationId": "get-defi-v3-token-meme-list",
  "x-mint": {
    "href": "/data-api/meme/get-defi-v3-token-meme-list"
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
