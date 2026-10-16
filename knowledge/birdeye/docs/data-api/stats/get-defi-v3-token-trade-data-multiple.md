---
title: "Token - Trade Data (Multiple)"
description: "Retrieve trade data of multiple tokens. Maximum 20 addresses."
hidden: false
metadata:
  title: Birdeye Data API | Token - Trade Data (Multiple)
  description: Retrieve trade data of multiple tokens. Maximum 20 addresses.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/token/trade-data/multiple"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Batch trading-activity stats for multiple tokens.</strong></p>
  <ul>
    <li>Pass token addresses as a comma-separated list in <code>list_address</code>.</li>
    <li>Maximum batch size is 20 token addresses per request.</li>
    <li>Use <code>frames</code> to request the same set of timeframes for every token in the batch.</li>
    <li>Returns trade, wallet, buy/sell, volume, and change metrics for indexed tokens across the same requested time windows.</li>
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
    <li>Batch CU is calculated as <code>ceil(10 * count^0.8)</code>.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Compare trading activity across a watchlist or screener result set.</li>
    <li>Detect volume spikes and buy/sell pressure across many tokens with fewer API calls.</li>
    <li>Compare which tokens are attracting fresh participation or losing activity across the same recent windows.</li>
    <li>Rank tokens by recent participation, trade count, and volume momentum.</li>
    <li>Feed batch trade metrics into bots, alerting systems, and analytics pipelines.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Pass <code>list_address</code> as comma-separated token addresses.</li>
    <li>Use the same <code>frames</code> across the batch so every token is comparable.</li>
    <li>Use this endpoint when you want multi-token activity windows, not just current price or valuation snapshots.</li>
    <li>Use the single endpoint for drill-down views after a user selects one token.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use batch trade data for screeners and alerts where every token should be scored on the same timeframe set.</li>
    <li>Deduplicate addresses and keep the requested frame list consistent.</li>
    <li>Join with batch market data to rank both market quality and current activity.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/token/trade-data/multiple

```json
{
  "tags": [
    "Stats"
  ],
  "summary": "Token - Trade Data (Multiple)",
  "description": "Retrieve trade data of multiple tokens. Maximum 20 addresses.",
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
      "name": "list_address",
      "description": "A list of token addresses in string separated by commas (,)",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana": {
          "value": "So11111111111111111111111111111111111111112,mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So,EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
        },
        "ethereum": {
          "value": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce,0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
        },
        "solana_scaled_ui": {
          "value": "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh,Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg,XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp"
        }
      }
    },
    {
      "name": "frames",
      "description": "A list of custom time intervals separated by comma (,). Users can pass up to 8 intervals.\nRules:\n- Minute intervals: from 1m up to 1440m (e.g. 1m,15m,16m,17m,89m,90m,92m,1440m ...).\n- Second intervals: must be multiples of 5s, from 5s up to 3600s (e.g. 5s,10s,15s,90s,3600s   ...).\n- Hours intervals: only support (1h 2h 4h 8h 24h)\n",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string"
      },
      "examples": {
        "minute_intervals": {
          "value": "1m,15m,30m,90m,1000m,1440m"
        },
        "second_intervals": {
          "value": "5s,15s,30s,1000s,3600s"
        },
        "mixed": {
          "value": "5s,300s,30m,90m,1440m"
        }
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
      "description": "JSON object containing trade data of multiple tokens",
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
                "description": "Map keyed by token address. Each value is the token trade-data object for that token, or `null` when trade data is unavailable.",
                "additionalProperties": {
                  "type": "object",
                  "required": [
                    "address",
                    "liquidity",
                    "last_trade_unix_time",
                    "last_trade_human_time",
                    "price",
                    "history_30m_price",
                    "price_change_30m_percent",
                    "history_1h_price",
                    "price_change_1h_percent",
                    "history_2h_price",
                    "price_change_2h_percent",
                    "history_4h_price",
                    "price_change_4h_percent",
                    "history_6h_price",
                    "price_change_6h_percent",
                    "history_8h_price",
                    "price_change_8h_percent",
                    "history_12h_price",
                    "price_change_12h_percent",
                    "history_24h_price",
                    "price_change_24h_percent",
                    "unique_wallet_30m",
                    "unique_wallet_history_30m",
                    "unique_wallet_30m_change_percent",
                    "unique_wallet_1h",
                    "unique_wallet_history_1h",
                    "unique_wallet_1h_change_percent",
                    "unique_wallet_2h",
                    "unique_wallet_history_2h",
                    "unique_wallet_2h_change_percent",
                    "unique_wallet_4h",
                    "unique_wallet_history_4h",
                    "unique_wallet_4h_change_percent",
                    "unique_wallet_8h",
                    "unique_wallet_history_8h",
                    "unique_wallet_8h_change_percent",
                    "unique_wallet_24h",
                    "unique_wallet_history_24h",
                    "unique_wallet_24h_change_percent",
                    "trade_30m",
                    "trade_history_30m",
                    "trade_30m_change_percent",
                    "sell_30m",
                    "sell_history_30m",
                    "sell_30m_change_percent",
                    "buy_30m",
                    "buy_history_30m",
                    "buy_30m_change_percent",
                    "volume_30m",
                    "volume_30m_usd",
                    "volume_history_30m",
                    "volume_history_30m_usd",
                    "volume_30m_change_percent",
                    "volume_buy_30m",
                    "volume_buy_30m_usd",
                    "volume_buy_history_30m",
                    "volume_buy_history_30m_usd",
                    "volume_buy_30m_change_percent",
                    "volume_sell_30m",
                    "volume_sell_30m_usd",
                    "volume_sell_history_30m",
                    "volume_sell_history_30m_usd",
                    "volume_sell_30m_change_percent",
                    "trade_1h",
                    "trade_history_1h",
                    "trade_1h_change_percent",
                    "sell_1h",
                    "sell_history_1h",
                    "sell_1h_change_percent",
                    "buy_1h",
                    "buy_history_1h",
                    "buy_1h_change_percent",
                    "volume_1h",
                    "volume_1h_usd",
                    "volume_history_1h",
                    "volume_history_1h_usd",
                    "volume_1h_change_percent",
                    "volume_buy_1h",
                    "volume_buy_1h_usd",
                    "volume_buy_history_1h",
                    "volume_buy_history_1h_usd",
                    "volume_buy_1h_change_percent",
                    "volume_sell_1h",
                    "volume_sell_1h_usd",
                    "volume_sell_history_1h",
                    "volume_sell_history_1h_usd",
                    "volume_sell_1h_change_percent",
                    "trade_2h",
                    "trade_history_2h",
                    "trade_2h_change_percent",
                    "sell_2h",
                    "sell_history_2h",
                    "sell_2h_change_percent",
                    "buy_2h",
                    "buy_history_2h",
                    "buy_2h_change_percent",
                    "volume_2h",
                    "volume_2h_usd",
                    "volume_history_2h",
                    "volume_history_2h_usd",
                    "volume_2h_change_percent",
                    "volume_buy_2h",
                    "volume_buy_2h_usd",
                    "volume_buy_history_2h",
                    "volume_buy_history_2h_usd",
                    "volume_buy_2h_change_percent",
                    "volume_sell_2h",
                    "volume_sell_2h_usd",
                    "volume_sell_history_2h",
                    "volume_sell_history_2h_usd",
                    "volume_sell_2h_change_percent",
                    "trade_4h",
                    "trade_history_4h",
                    "trade_4h_change_percent",
                    "sell_4h",
                    "sell_history_4h",
                    "sell_4h_change_percent",
                    "buy_4h",
                    "buy_history_4h",
                    "buy_4h_change_percent",
                    "volume_4h",
                    "volume_4h_usd",
                    "volume_history_4h",
                    "volume_history_4h_usd",
                    "volume_4h_change_percent",
                    "volume_buy_4h",
                    "volume_buy_4h_usd",
                    "volume_buy_history_4h",
                    "volume_buy_history_4h_usd",
                    "volume_buy_4h_change_percent",
                    "volume_sell_4h",
                    "volume_sell_4h_usd",
                    "volume_sell_history_4h",
                    "volume_sell_history_4h_usd",
                    "volume_sell_4h_change_percent",
                    "trade_8h",
                    "trade_history_8h",
                    "trade_8h_change_percent",
                    "sell_8h",
                    "sell_history_8h",
                    "sell_8h_change_percent",
                    "buy_8h",
                    "buy_history_8h",
                    "buy_8h_change_percent",
                    "volume_8h",
                    "volume_8h_usd",
                    "volume_history_8h",
                    "volume_history_8h_usd",
                    "volume_8h_change_percent",
                    "volume_buy_8h",
                    "volume_buy_8h_usd",
                    "volume_buy_history_8h",
                    "volume_buy_history_8h_usd",
                    "volume_buy_8h_change_percent",
                    "volume_sell_8h",
                    "volume_sell_8h_usd",
                    "volume_sell_history_8h",
                    "volume_sell_history_8h_usd",
                    "volume_sell_8h_change_percent",
                    "trade_24h",
                    "trade_history_24h",
                    "trade_24h_change_percent",
                    "sell_24h",
                    "sell_history_24h",
                    "sell_24h_change_percent",
                    "buy_24h",
                    "buy_history_24h",
                    "buy_24h_change_percent",
                    "volume_24h",
                    "volume_24h_usd",
                    "volume_history_24h",
                    "volume_history_24h_usd",
                    "volume_24h_change_percent",
                    "volume_buy_24h",
                    "volume_buy_24h_usd",
                    "volume_buy_history_24h",
                    "volume_buy_history_24h_usd",
                    "volume_buy_24h_change_percent",
                    "volume_sell_24h",
                    "volume_sell_24h_usd",
                    "volume_sell_history_24h",
                    "volume_sell_history_24h_usd",
                    "volume_sell_24h_change_percent"
                  ],
                  "properties": {
                    "address": {
                      "type": "string",
                      "description": "Token mint or contract address."
                    },
                    "liquidity": {
                      "type": "number",
                      "description": "Current token liquidity in USD."
                    },
                    "last_trade_unix_time": {
                      "type": "number",
                      "description": "Unix timestamp in seconds of the latest observed trade."
                    },
                    "last_trade_human_time": {
                      "type": "string",
                      "description": "Human-readable timestamp of the latest observed trade."
                    },
                    "price": {
                      "type": "number",
                      "description": "Latest token price in USD."
                    },
                    "holder": {
                      "type": "number",
                      "description": "Current holder count when available for the chain."
                    },
                    "market": {
                      "type": "number",
                      "description": "Number of markets or pools contributing to the token's trade activity when available."
                    },
                    "is_scaled_ui_token": {
                      "type": "boolean",
                      "description": "True when the token uses Solana Token-2022 scaled UI amounts."
                    },
                    "multiplier": {
                      "type": "number",
                      "nullable": true,
                      "description": "Scaled UI multiplier for Token-2022 assets. Present when scaled UI metadata is available."
                    },
                    "history_1m_price": {
                      "type": "number",
                      "description": "Reference price from 1m ago used as the baseline for current price change."
                    },
                    "price_change_1m_percent": {
                      "type": "number",
                      "description": "Percentage change between the latest price and the baseline price from 1m ago."
                    },
                    "history_5m_price": {
                      "type": "number",
                      "description": "Reference price from 5m ago used as the baseline for current price change."
                    },
                    "price_change_5m_percent": {
                      "type": "number",
                      "description": "Percentage change between the latest price and the baseline price from 5m ago."
                    },
                    "history_30m_price": {
                      "type": "number",
                      "description": "Reference price from 30m ago used as the baseline for current price change."
                    },
                    "price_change_30m_percent": {
                      "type": "number",
                      "description": "Percentage change between the latest price and the baseline price from 30m ago."
                    },
                    "history_1h_price": {
                      "type": "number",
                      "description": "Reference price from 1h ago used as the baseline for current price change."
                    },
                    "price_change_1h_percent": {
                      "type": "number",
                      "description": "Percentage change between the latest price and the baseline price from 1h ago."
                    },
                    "history_2h_price": {
                      "type": "number",
                      "description": "Reference price from 2h ago used as the baseline for current price change."
                    },
                    "price_change_2h_percent": {
                      "type": "number",
                      "description": "Percentage change between the latest price and the baseline price from 2h ago."
                    },
                    "history_4h_price": {
                      "type": "number",
                      "description": "Reference price from 4h ago used as the baseline for current price change."
                    },
                    "price_change_4h_percent": {
                      "type": "number",
                      "description": "Percentage change between the latest price and the baseline price from 4h ago."
                    },
                    "history_6h_price": {
                      "type": "number",
                      "description": "Reference price from 6h ago used as the baseline for current price change."
                    },
                    "price_change_6h_percent": {
                      "type": "number",
                      "description": "Percentage change between the latest price and the baseline price from 6h ago."
                    },
                    "history_8h_price": {
                      "type": "number",
                      "description": "Reference price from 8h ago used as the baseline for current price change."
                    },
                    "price_change_8h_percent": {
                      "type": "number",
                      "description": "Percentage change between the latest price and the baseline price from 8h ago."
                    },
                    "history_12h_price": {
                      "type": "number",
                      "description": "Reference price from 12h ago used as the baseline for current price change."
                    },
                    "price_change_12h_percent": {
                      "type": "number",
                      "description": "Percentage change between the latest price and the baseline price from 12h ago."
                    },
                    "history_24h_price": {
                      "type": "number",
                      "description": "Reference price from 24h ago used as the baseline for current price change."
                    },
                    "price_change_24h_percent": {
                      "type": "number",
                      "description": "Percentage change between the latest price and the baseline price from 24h ago."
                    },
                    "unique_wallet_30m": {
                      "type": "number",
                      "description": "Number of distinct wallets that traded the token during the latest 30m window."
                    },
                    "unique_wallet_history_30m": {
                      "type": "number",
                      "description": "Number of distinct wallets that traded the token during the previous 30m window used for comparison."
                    },
                    "unique_wallet_30m_change_percent": {
                      "type": "number",
                      "description": "Percentage change in distinct trading wallets versus the previous 30m window."
                    },
                    "trade_30m": {
                      "type": "number",
                      "description": "Total trade count during the latest 30m window."
                    },
                    "trade_history_30m": {
                      "type": "number",
                      "description": "Total trade count during the previous 30m window used for comparison."
                    },
                    "trade_30m_change_percent": {
                      "type": "number",
                      "description": "Percentage change in total trade count versus the previous 30m window."
                    },
                    "sell_30m": {
                      "type": "number",
                      "description": "Sell-side trade count during the latest 30m window."
                    },
                    "sell_history_30m": {
                      "type": "number",
                      "description": "Sell-side trade count during the previous 30m window used for comparison."
                    },
                    "sell_30m_change_percent": {
                      "type": "number",
                      "description": "Percentage change in sell-side trade count versus the previous 30m window."
                    },
                    "buy_30m": {
                      "type": "number",
                      "description": "Buy-side trade count during the latest 30m window."
                    },
                    "buy_history_30m": {
                      "type": "number",
                      "description": "Buy-side trade count during the previous 30m window used for comparison."
                    },
                    "buy_30m_change_percent": {
                      "type": "number",
                      "description": "Percentage change in buy-side trade count versus the previous 30m window."
                    },
                    "volume_30m": {
                      "type": "number",
                      "description": "Total traded token volume during the latest 30m window."
                    },
                    "volume_30m_usd": {
                      "type": "number",
                      "description": "Total traded USD volume during the latest 30m window."
                    },
                    "volume_history_30m": {
                      "type": "number",
                      "description": "Total traded token volume during the previous 30m window used for comparison."
                    },
                    "volume_history_30m_usd": {
                      "type": "number",
                      "description": "Total traded USD volume during the previous 30m window used for comparison."
                    },
                    "volume_30m_change_percent": {
                      "type": "number",
                      "description": "Percentage change in total traded token volume versus the previous 30m window."
                    },
                    "volume_buy_30m": {
                      "type": "number",
                      "description": "Buy-side token volume during the latest 30m window."
                    },
                    "volume_buy_30m_usd": {
                      "type": "number",
                      "description": "Buy-side USD volume during the latest 30m window."
                    },
                    "volume_buy_history_30m": {
                      "type": "number",
                      "description": "Buy-side token volume during the previous 30m window used for comparison."
                    },
                    "volume_buy_history_30m_usd": {
                      "type": "number",
                      "description": "Buy-side USD volume during the previous 30m window used for comparison."
                    },
                    "volume_buy_30m_change_percent": {
                      "type": "number",
                      "description": "Percentage change in buy-side token volume versus the previous 30m window."
                    },
                    "volume_sell_30m": {
                      "type": "number",
                      "description": "Sell-side token volume during the latest 30m window."
                    },
                    "volume_sell_30m_usd": {
                      "type": "number",
                      "description": "Sell-side USD volume during the latest 30m window."
                    },
                    "volume_sell_history_30m": {
                      "type": "number",
                      "description": "Sell-side token volume during the previous 30m window used for comparison."
                    },
                    "volume_sell_history_30m_usd": {
                      "type": "number",
                      "description": "Sell-side USD volume during the previous 30m window used for comparison."
                    },
                    "volume_sell_30m_change_percent": {
                      "type": "number",
                      "description": "Percentage change in sell-side token volume versus the previous 30m window."
                    },
                    "unique_wallet_1h": {
                      "type": "number",
                      "description": "Number of distinct wallets that traded the token during the latest 1h window."
                    },
                    "unique_wallet_history_1h": {
                      "type": "number",
                      "description": "Number of distinct wallets that traded the token during the previous 1h window used for comparison."
                    },
                    "unique_wallet_1h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in distinct trading wallets versus the previous 1h window."
                    },
                    "trade_1h": {
                      "type": "number",
                      "description": "Total trade count during the latest 1h window."
                    },
                    "trade_history_1h": {
                      "type": "number",
                      "description": "Total trade count during the previous 1h window used for comparison."
                    },
                    "trade_1h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in total trade count versus the previous 1h window."
                    },
                    "sell_1h": {
                      "type": "number",
                      "description": "Sell-side trade count during the latest 1h window."
                    },
                    "sell_history_1h": {
                      "type": "number",
                      "description": "Sell-side trade count during the previous 1h window used for comparison."
                    },
                    "sell_1h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in sell-side trade count versus the previous 1h window."
                    },
                    "buy_1h": {
                      "type": "number",
                      "description": "Buy-side trade count during the latest 1h window."
                    },
                    "buy_history_1h": {
                      "type": "number",
                      "description": "Buy-side trade count during the previous 1h window used for comparison."
                    },
                    "buy_1h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in buy-side trade count versus the previous 1h window."
                    },
                    "volume_1h": {
                      "type": "number",
                      "description": "Total traded token volume during the latest 1h window."
                    },
                    "volume_1h_usd": {
                      "type": "number",
                      "description": "Total traded USD volume during the latest 1h window."
                    },
                    "volume_history_1h": {
                      "type": "number",
                      "description": "Total traded token volume during the previous 1h window used for comparison."
                    },
                    "volume_history_1h_usd": {
                      "type": "number",
                      "description": "Total traded USD volume during the previous 1h window used for comparison."
                    },
                    "volume_1h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in total traded token volume versus the previous 1h window."
                    },
                    "volume_buy_1h": {
                      "type": "number",
                      "description": "Buy-side token volume during the latest 1h window."
                    },
                    "volume_buy_1h_usd": {
                      "type": "number",
                      "description": "Buy-side USD volume during the latest 1h window."
                    },
                    "volume_buy_history_1h": {
                      "type": "number",
                      "description": "Buy-side token volume during the previous 1h window used for comparison."
                    },
                    "volume_buy_history_1h_usd": {
                      "type": "number",
                      "description": "Buy-side USD volume during the previous 1h window used for comparison."
                    },
                    "volume_buy_1h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in buy-side token volume versus the previous 1h window."
                    },
                    "volume_sell_1h": {
                      "type": "number",
                      "description": "Sell-side token volume during the latest 1h window."
                    },
                    "volume_sell_1h_usd": {
                      "type": "number",
                      "description": "Sell-side USD volume during the latest 1h window."
                    },
                    "volume_sell_history_1h": {
                      "type": "number",
                      "description": "Sell-side token volume during the previous 1h window used for comparison."
                    },
                    "volume_sell_history_1h_usd": {
                      "type": "number",
                      "description": "Sell-side USD volume during the previous 1h window used for comparison."
                    },
                    "volume_sell_1h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in sell-side token volume versus the previous 1h window."
                    },
                    "unique_wallet_2h": {
                      "type": "number",
                      "description": "Number of distinct wallets that traded the token during the latest 2h window."
                    },
                    "unique_wallet_history_2h": {
                      "type": "number",
                      "description": "Number of distinct wallets that traded the token during the previous 2h window used for comparison."
                    },
                    "unique_wallet_2h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in distinct trading wallets versus the previous 2h window."
                    },
                    "trade_2h": {
                      "type": "number",
                      "description": "Total trade count during the latest 2h window."
                    },
                    "trade_history_2h": {
                      "type": "number",
                      "description": "Total trade count during the previous 2h window used for comparison."
                    },
                    "trade_2h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in total trade count versus the previous 2h window."
                    },
                    "sell_2h": {
                      "type": "number",
                      "description": "Sell-side trade count during the latest 2h window."
                    },
                    "sell_history_2h": {
                      "type": "number",
                      "description": "Sell-side trade count during the previous 2h window used for comparison."
                    },
                    "sell_2h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in sell-side trade count versus the previous 2h window."
                    },
                    "buy_2h": {
                      "type": "number",
                      "description": "Buy-side trade count during the latest 2h window."
                    },
                    "buy_history_2h": {
                      "type": "number",
                      "description": "Buy-side trade count during the previous 2h window used for comparison."
                    },
                    "buy_2h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in buy-side trade count versus the previous 2h window."
                    },
                    "volume_2h": {
                      "type": "number",
                      "description": "Total traded token volume during the latest 2h window."
                    },
                    "volume_2h_usd": {
                      "type": "number",
                      "description": "Total traded USD volume during the latest 2h window."
                    },
                    "volume_history_2h": {
                      "type": "number",
                      "description": "Total traded token volume during the previous 2h window used for comparison."
                    },
                    "volume_history_2h_usd": {
                      "type": "number",
                      "description": "Total traded USD volume during the previous 2h window used for comparison."
                    },
                    "volume_2h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in total traded token volume versus the previous 2h window."
                    },
                    "volume_buy_2h": {
                      "type": "number",
                      "description": "Buy-side token volume during the latest 2h window."
                    },
                    "volume_buy_2h_usd": {
                      "type": "number",
                      "description": "Buy-side USD volume during the latest 2h window."
                    },
                    "volume_buy_history_2h": {
                      "type": "number",
                      "description": "Buy-side token volume during the previous 2h window used for comparison."
                    },
                    "volume_buy_history_2h_usd": {
                      "type": "number",
                      "description": "Buy-side USD volume during the previous 2h window used for comparison."
                    },
                    "volume_buy_2h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in buy-side token volume versus the previous 2h window."
                    },
                    "volume_sell_2h": {
                      "type": "number",
                      "description": "Sell-side token volume during the latest 2h window."
                    },
                    "volume_sell_2h_usd": {
                      "type": "number",
                      "description": "Sell-side USD volume during the latest 2h window."
                    },
                    "volume_sell_history_2h": {
                      "type": "number",
                      "description": "Sell-side token volume during the previous 2h window used for comparison."
                    },
                    "volume_sell_history_2h_usd": {
                      "type": "number",
                      "description": "Sell-side USD volume during the previous 2h window used for comparison."
                    },
                    "volume_sell_2h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in sell-side token volume versus the previous 2h window."
                    },
                    "unique_wallet_4h": {
                      "type": "number",
                      "description": "Number of distinct wallets that traded the token during the latest 4h window."
                    },
                    "unique_wallet_history_4h": {
                      "type": "number",
                      "description": "Number of distinct wallets that traded the token during the previous 4h window used for comparison."
                    },
                    "unique_wallet_4h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in distinct trading wallets versus the previous 4h window."
                    },
                    "trade_4h": {
                      "type": "number",
                      "description": "Total trade count during the latest 4h window."
                    },
                    "trade_history_4h": {
                      "type": "number",
                      "description": "Total trade count during the previous 4h window used for comparison."
                    },
                    "trade_4h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in total trade count versus the previous 4h window."
                    },
                    "sell_4h": {
                      "type": "number",
                      "description": "Sell-side trade count during the latest 4h window."
                    },
                    "sell_history_4h": {
                      "type": "number",
                      "description": "Sell-side trade count during the previous 4h window used for comparison."
                    },
                    "sell_4h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in sell-side trade count versus the previous 4h window."
                    },
                    "buy_4h": {
                      "type": "number",
                      "description": "Buy-side trade count during the latest 4h window."
                    },
                    "buy_history_4h": {
                      "type": "number",
                      "description": "Buy-side trade count during the previous 4h window used for comparison."
                    },
                    "buy_4h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in buy-side trade count versus the previous 4h window."
                    },
                    "volume_4h": {
                      "type": "number",
                      "description": "Total traded token volume during the latest 4h window."
                    },
                    "volume_4h_usd": {
                      "type": "number",
                      "description": "Total traded USD volume during the latest 4h window."
                    },
                    "volume_history_4h": {
                      "type": "number",
                      "description": "Total traded token volume during the previous 4h window used for comparison."
                    },
                    "volume_history_4h_usd": {
                      "type": "number",
                      "description": "Total traded USD volume during the previous 4h window used for comparison."
                    },
                    "volume_4h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in total traded token volume versus the previous 4h window."
                    },
                    "volume_buy_4h": {
                      "type": "number",
                      "description": "Buy-side token volume during the latest 4h window."
                    },
                    "volume_buy_4h_usd": {
                      "type": "number",
                      "description": "Buy-side USD volume during the latest 4h window."
                    },
                    "volume_buy_history_4h": {
                      "type": "number",
                      "description": "Buy-side token volume during the previous 4h window used for comparison."
                    },
                    "volume_buy_history_4h_usd": {
                      "type": "number",
                      "description": "Buy-side USD volume during the previous 4h window used for comparison."
                    },
                    "volume_buy_4h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in buy-side token volume versus the previous 4h window."
                    },
                    "volume_sell_4h": {
                      "type": "number",
                      "description": "Sell-side token volume during the latest 4h window."
                    },
                    "volume_sell_4h_usd": {
                      "type": "number",
                      "description": "Sell-side USD volume during the latest 4h window."
                    },
                    "volume_sell_history_4h": {
                      "type": "number",
                      "description": "Sell-side token volume during the previous 4h window used for comparison."
                    },
                    "volume_sell_history_4h_usd": {
                      "type": "number",
                      "description": "Sell-side USD volume during the previous 4h window used for comparison."
                    },
                    "volume_sell_4h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in sell-side token volume versus the previous 4h window."
                    },
                    "unique_wallet_6h": {
                      "type": "number",
                      "description": "Number of distinct wallets that traded the token during the latest 6h window."
                    },
                    "unique_wallet_history_6h": {
                      "type": "number",
                      "description": "Number of distinct wallets that traded the token during the previous 6h window used for comparison."
                    },
                    "unique_wallet_6h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in distinct trading wallets versus the previous 6h window."
                    },
                    "trade_6h": {
                      "type": "number",
                      "description": "Total trade count during the latest 6h window."
                    },
                    "trade_history_6h": {
                      "type": "number",
                      "description": "Total trade count during the previous 6h window used for comparison."
                    },
                    "trade_6h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in total trade count versus the previous 6h window."
                    },
                    "sell_6h": {
                      "type": "number",
                      "description": "Sell-side trade count during the latest 6h window."
                    },
                    "sell_history_6h": {
                      "type": "number",
                      "description": "Sell-side trade count during the previous 6h window used for comparison."
                    },
                    "sell_6h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in sell-side trade count versus the previous 6h window."
                    },
                    "buy_6h": {
                      "type": "number",
                      "description": "Buy-side trade count during the latest 6h window."
                    },
                    "buy_history_6h": {
                      "type": "number",
                      "description": "Buy-side trade count during the previous 6h window used for comparison."
                    },
                    "buy_6h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in buy-side trade count versus the previous 6h window."
                    },
                    "volume_6h": {
                      "type": "number",
                      "description": "Total traded token volume during the latest 6h window."
                    },
                    "volume_6h_usd": {
                      "type": "number",
                      "description": "Total traded USD volume during the latest 6h window."
                    },
                    "volume_history_6h": {
                      "type": "number",
                      "description": "Total traded token volume during the previous 6h window used for comparison."
                    },
                    "volume_history_6h_usd": {
                      "type": "number",
                      "description": "Total traded USD volume during the previous 6h window used for comparison."
                    },
                    "volume_6h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in total traded token volume versus the previous 6h window."
                    },
                    "volume_buy_6h": {
                      "type": "number",
                      "description": "Buy-side token volume during the latest 6h window."
                    },
                    "volume_buy_6h_usd": {
                      "type": "number",
                      "description": "Buy-side USD volume during the latest 6h window."
                    },
                    "volume_buy_history_6h": {
                      "type": "number",
                      "description": "Buy-side token volume during the previous 6h window used for comparison."
                    },
                    "volume_buy_history_6h_usd": {
                      "type": "number",
                      "description": "Buy-side USD volume during the previous 6h window used for comparison."
                    },
                    "volume_buy_6h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in buy-side token volume versus the previous 6h window."
                    },
                    "volume_sell_6h": {
                      "type": "number",
                      "description": "Sell-side token volume during the latest 6h window."
                    },
                    "volume_sell_6h_usd": {
                      "type": "number",
                      "description": "Sell-side USD volume during the latest 6h window."
                    },
                    "volume_sell_history_6h": {
                      "type": "number",
                      "description": "Sell-side token volume during the previous 6h window used for comparison."
                    },
                    "volume_sell_history_6h_usd": {
                      "type": "number",
                      "description": "Sell-side USD volume during the previous 6h window used for comparison."
                    },
                    "volume_sell_6h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in sell-side token volume versus the previous 6h window."
                    },
                    "unique_wallet_8h": {
                      "type": "number",
                      "description": "Number of distinct wallets that traded the token during the latest 8h window."
                    },
                    "unique_wallet_history_8h": {
                      "type": "number",
                      "description": "Number of distinct wallets that traded the token during the previous 8h window used for comparison."
                    },
                    "unique_wallet_8h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in distinct trading wallets versus the previous 8h window."
                    },
                    "trade_8h": {
                      "type": "number",
                      "description": "Total trade count during the latest 8h window."
                    },
                    "trade_history_8h": {
                      "type": "number",
                      "description": "Total trade count during the previous 8h window used for comparison."
                    },
                    "trade_8h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in total trade count versus the previous 8h window."
                    },
                    "sell_8h": {
                      "type": "number",
                      "description": "Sell-side trade count during the latest 8h window."
                    },
                    "sell_history_8h": {
                      "type": "number",
                      "description": "Sell-side trade count during the previous 8h window used for comparison."
                    },
                    "sell_8h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in sell-side trade count versus the previous 8h window."
                    },
                    "buy_8h": {
                      "type": "number",
                      "description": "Buy-side trade count during the latest 8h window."
                    },
                    "buy_history_8h": {
                      "type": "number",
                      "description": "Buy-side trade count during the previous 8h window used for comparison."
                    },
                    "buy_8h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in buy-side trade count versus the previous 8h window."
                    },
                    "volume_8h": {
                      "type": "number",
                      "description": "Total traded token volume during the latest 8h window."
                    },
                    "volume_8h_usd": {
                      "type": "number",
                      "description": "Total traded USD volume during the latest 8h window."
                    },
                    "volume_history_8h": {
                      "type": "number",
                      "description": "Total traded token volume during the previous 8h window used for comparison."
                    },
                    "volume_history_8h_usd": {
                      "type": "number",
                      "description": "Total traded USD volume during the previous 8h window used for comparison."
                    },
                    "volume_8h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in total traded token volume versus the previous 8h window."
                    },
                    "volume_buy_8h": {
                      "type": "number",
                      "description": "Buy-side token volume during the latest 8h window."
                    },
                    "volume_buy_8h_usd": {
                      "type": "number",
                      "description": "Buy-side USD volume during the latest 8h window."
                    },
                    "volume_buy_history_8h": {
                      "type": "number",
                      "description": "Buy-side token volume during the previous 8h window used for comparison."
                    },
                    "volume_buy_history_8h_usd": {
                      "type": "number",
                      "description": "Buy-side USD volume during the previous 8h window used for comparison."
                    },
                    "volume_buy_8h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in buy-side token volume versus the previous 8h window."
                    },
                    "volume_sell_8h": {
                      "type": "number",
                      "description": "Sell-side token volume during the latest 8h window."
                    },
                    "volume_sell_8h_usd": {
                      "type": "number",
                      "description": "Sell-side USD volume during the latest 8h window."
                    },
                    "volume_sell_history_8h": {
                      "type": "number",
                      "description": "Sell-side token volume during the previous 8h window used for comparison."
                    },
                    "volume_sell_history_8h_usd": {
                      "type": "number",
                      "description": "Sell-side USD volume during the previous 8h window used for comparison."
                    },
                    "volume_sell_8h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in sell-side token volume versus the previous 8h window."
                    },
                    "unique_wallet_12h": {
                      "type": "number",
                      "description": "Number of distinct wallets that traded the token during the latest 12h window."
                    },
                    "unique_wallet_history_12h": {
                      "type": "number",
                      "description": "Number of distinct wallets that traded the token during the previous 12h window used for comparison."
                    },
                    "unique_wallet_12h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in distinct trading wallets versus the previous 12h window."
                    },
                    "trade_12h": {
                      "type": "number",
                      "description": "Total trade count during the latest 12h window."
                    },
                    "trade_history_12h": {
                      "type": "number",
                      "description": "Total trade count during the previous 12h window used for comparison."
                    },
                    "trade_12h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in total trade count versus the previous 12h window."
                    },
                    "sell_12h": {
                      "type": "number",
                      "description": "Sell-side trade count during the latest 12h window."
                    },
                    "sell_history_12h": {
                      "type": "number",
                      "description": "Sell-side trade count during the previous 12h window used for comparison."
                    },
                    "sell_12h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in sell-side trade count versus the previous 12h window."
                    },
                    "buy_12h": {
                      "type": "number",
                      "description": "Buy-side trade count during the latest 12h window."
                    },
                    "buy_history_12h": {
                      "type": "number",
                      "description": "Buy-side trade count during the previous 12h window used for comparison."
                    },
                    "buy_12h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in buy-side trade count versus the previous 12h window."
                    },
                    "volume_12h": {
                      "type": "number",
                      "description": "Total traded token volume during the latest 12h window."
                    },
                    "volume_12h_usd": {
                      "type": "number",
                      "description": "Total traded USD volume during the latest 12h window."
                    },
                    "volume_history_12h": {
                      "type": "number",
                      "description": "Total traded token volume during the previous 12h window used for comparison."
                    },
                    "volume_history_12h_usd": {
                      "type": "number",
                      "description": "Total traded USD volume during the previous 12h window used for comparison."
                    },
                    "volume_12h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in total traded token volume versus the previous 12h window."
                    },
                    "volume_buy_12h": {
                      "type": "number",
                      "description": "Buy-side token volume during the latest 12h window."
                    },
                    "volume_buy_12h_usd": {
                      "type": "number",
                      "description": "Buy-side USD volume during the latest 12h window."
                    },
                    "volume_buy_history_12h": {
                      "type": "number",
                      "description": "Buy-side token volume during the previous 12h window used for comparison."
                    },
                    "volume_buy_history_12h_usd": {
                      "type": "number",
                      "description": "Buy-side USD volume during the previous 12h window used for comparison."
                    },
                    "volume_buy_12h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in buy-side token volume versus the previous 12h window."
                    },
                    "volume_sell_12h": {
                      "type": "number",
                      "description": "Sell-side token volume during the latest 12h window."
                    },
                    "volume_sell_12h_usd": {
                      "type": "number",
                      "description": "Sell-side USD volume during the latest 12h window."
                    },
                    "volume_sell_history_12h": {
                      "type": "number",
                      "description": "Sell-side token volume during the previous 12h window used for comparison."
                    },
                    "volume_sell_history_12h_usd": {
                      "type": "number",
                      "description": "Sell-side USD volume during the previous 12h window used for comparison."
                    },
                    "volume_sell_12h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in sell-side token volume versus the previous 12h window."
                    },
                    "unique_wallet_24h": {
                      "type": "number",
                      "description": "Number of distinct wallets that traded the token during the latest 24h window."
                    },
                    "unique_wallet_history_24h": {
                      "type": "number",
                      "description": "Number of distinct wallets that traded the token during the previous 24h window used for comparison."
                    },
                    "unique_wallet_24h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in distinct trading wallets versus the previous 24h window."
                    },
                    "trade_24h": {
                      "type": "number",
                      "description": "Total trade count during the latest 24h window."
                    },
                    "trade_history_24h": {
                      "type": "number",
                      "description": "Total trade count during the previous 24h window used for comparison."
                    },
                    "trade_24h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in total trade count versus the previous 24h window."
                    },
                    "sell_24h": {
                      "type": "number",
                      "description": "Sell-side trade count during the latest 24h window."
                    },
                    "sell_history_24h": {
                      "type": "number",
                      "description": "Sell-side trade count during the previous 24h window used for comparison."
                    },
                    "sell_24h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in sell-side trade count versus the previous 24h window."
                    },
                    "buy_24h": {
                      "type": "number",
                      "description": "Buy-side trade count during the latest 24h window."
                    },
                    "buy_history_24h": {
                      "type": "number",
                      "description": "Buy-side trade count during the previous 24h window used for comparison."
                    },
                    "buy_24h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in buy-side trade count versus the previous 24h window."
                    },
                    "volume_24h": {
                      "type": "number",
                      "description": "Total traded token volume during the latest 24h window."
                    },
                    "volume_24h_usd": {
                      "type": "number",
                      "description": "Total traded USD volume during the latest 24h window."
                    },
                    "volume_history_24h": {
                      "type": "number",
                      "description": "Total traded token volume during the previous 24h window used for comparison."
                    },
                    "volume_history_24h_usd": {
                      "type": "number",
                      "description": "Total traded USD volume during the previous 24h window used for comparison."
                    },
                    "volume_24h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in total traded token volume versus the previous 24h window."
                    },
                    "volume_buy_24h": {
                      "type": "number",
                      "description": "Buy-side token volume during the latest 24h window."
                    },
                    "volume_buy_24h_usd": {
                      "type": "number",
                      "description": "Buy-side USD volume during the latest 24h window."
                    },
                    "volume_buy_history_24h": {
                      "type": "number",
                      "description": "Buy-side token volume during the previous 24h window used for comparison."
                    },
                    "volume_buy_history_24h_usd": {
                      "type": "number",
                      "description": "Buy-side USD volume during the previous 24h window used for comparison."
                    },
                    "volume_buy_24h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in buy-side token volume versus the previous 24h window."
                    },
                    "volume_sell_24h": {
                      "type": "number",
                      "description": "Sell-side token volume during the latest 24h window."
                    },
                    "volume_sell_24h_usd": {
                      "type": "number",
                      "description": "Sell-side USD volume during the latest 24h window."
                    },
                    "volume_sell_history_24h": {
                      "type": "number",
                      "description": "Sell-side token volume during the previous 24h window used for comparison."
                    },
                    "volume_sell_history_24h_usd": {
                      "type": "number",
                      "description": "Sell-side USD volume during the previous 24h window used for comparison."
                    },
                    "volume_sell_24h_change_percent": {
                      "type": "number",
                      "description": "Percentage change in sell-side token volume versus the previous 24h window."
                    }
                  },
                  "additionalProperties": true
                },
                "maxProperties": 50
              }
            }
          },
          "examples": {
            "SolanaScaledUIAmount": {
              "value": {
                "success": true,
                "data": {
                  "So11111111111111111111111111111111111111112": {
                    "address": "So11111111111111111111111111111111111111112",
                    "holder": 3499140,
                    "market": 189737,
                    "last_trade_unix_time": 1755058812,
                    "last_trade_human_time": "2025-08-13T04:20:12",
                    "price": 199.98794169268422,
                    "history_1m_price": 199.7093584833286,
                    "price_change_1m_percent": 0.13949431887983973,
                    "history_5m_price": 199.08815924367772,
                    "price_change_5m_percent": 0.45195176469796405,
                    "history_30m_price": 198.22141301108715,
                    "price_change_30m_percent": 0.8911896322211458,
                    "history_1h_price": 198.54371624183344,
                    "price_change_1h_percent": 0.7274092971502866,
                    "history_2h_price": 194.28095313746698,
                    "price_change_2h_percent": 2.9374925658199516,
                    "history_4h_price": 192.49069567980555,
                    "price_change_4h_percent": 3.8948615081893583,
                    "history_6h_price": 192.60116257977168,
                    "price_change_6h_percent": 3.83527233894711,
                    "history_8h_price": 191.01937366628366,
                    "price_change_8h_percent": 4.6951091160360034,
                    "history_12h_price": 181.53883656902224,
                    "price_change_12h_percent": 10.162621658450208,
                    "history_24h_price": 175.7360146296086,
                    "price_change_24h_percent": 13.80020317075608,
                    "unique_wallet_1m": 9919,
                    "unique_wallet_history_1m": 10205,
                    "unique_wallet_1m_change_percent": -2.8025477707006368,
                    "unique_wallet_5m": 30876,
                    "unique_wallet_history_5m": 30852,
                    "unique_wallet_5m_change_percent": 0.07779074290159471,
                    "unique_wallet_30m": 84877,
                    "unique_wallet_history_30m": 91310,
                    "unique_wallet_30m_change_percent": -7.045230533347936,
                    "unique_wallet_1h": 140850,
                    "unique_wallet_history_1h": 139362,
                    "unique_wallet_1h_change_percent": 1.0677229086838593,
                    "unique_wallet_2h": 232838,
                    "unique_wallet_history_2h": 256234,
                    "unique_wallet_2h_change_percent": -9.130716454490816,
                    "unique_wallet_4h": 397846,
                    "unique_wallet_history_4h": 319789,
                    "unique_wallet_4h_change_percent": 24.408907123134316,
                    "unique_wallet_8h": 616497,
                    "unique_wallet_history_8h": 598174,
                    "unique_wallet_8h_change_percent": 3.0631555366833063,
                    "unique_wallet_24h": 1312571,
                    "unique_wallet_history_24h": 1595218,
                    "unique_wallet_24h_change_percent": -17.718393348119193,
                    "trade_1m": 22382,
                    "trade_history_1m": 24983,
                    "trade_1m_change_percent": -10.411079534083177,
                    "sell_1m": 12625,
                    "sell_history_1m": 14424,
                    "sell_1m_change_percent": -12.472268441486412,
                    "buy_1m": 9757,
                    "buy_history_1m": 10559,
                    "buy_1m_change_percent": -7.595416232597783,
                    "volume_1m": 19402.25827599,
                    "volume_1m_usd": 3877354.094558342,
                    "volume_history_1m": 22411.114589328998,
                    "volume_history_1m_usd": 4475845.358663695,
                    "volume_1m_change_percent": -13.425732581688099,
                    "volume_buy_1m": 10919.262528264999,
                    "volume_buy_1m_usd": 2182246.2382117016,
                    "volume_buy_history_1m": 11059.580722686998,
                    "volume_buy_history_1m_usd": 2208895.1658868995,
                    "volume_buy_1m_change_percent": -1.2687478661298504,
                    "volume_sell_1m": 8482.995747725001,
                    "volume_sell_1m_usd": 1695107.8563466403,
                    "volume_sell_history_1m": 11351.533866642,
                    "volume_sell_history_1m_usd": 2266950.192776796,
                    "volume_sell_1m_change_percent": -25.270048546889168,
                    "trade_5m": 120448,
                    "trade_history_5m": 132553,
                    "trade_5m_change_percent": -9.13219617813252,
                    "sell_5m": 68867,
                    "sell_history_5m": 74871,
                    "sell_5m_change_percent": -8.019126230449707,
                    "buy_5m": 51581,
                    "buy_history_5m": 57682,
                    "buy_5m_change_percent": -10.576956416213031,
                    "volume_5m": 134293.28506683398,
                    "volume_5m_usd": 26766762.067839466,
                    "volume_history_5m": 169555.78181202302,
                    "volume_history_5m_usd": 33700058.87877406,
                    "volume_5m_change_percent": -20.796988677320712,
                    "volume_buy_5m": 71284.36863666699,
                    "volume_buy_5m_usd": 14209360.95633716,
                    "volume_buy_history_5m": 86179.23586617,
                    "volume_buy_history_5m_usd": 17129947.159285817,
                    "volume_buy_5m_change_percent": -17.283591667758163,
                    "volume_sell_5m": 63008.916430166995,
                    "volume_sell_5m_usd": 12557401.111502308,
                    "volume_sell_history_5m": 83376.54594585301,
                    "volume_sell_history_5m_usd": 16570111.71948824,
                    "volume_sell_5m_change_percent": -24.428487993390018,
                    "trade_30m": 701197,
                    "trade_history_30m": 726567,
                    "trade_30m_change_percent": -3.491763319831481,
                    "sell_30m": 405193,
                    "sell_history_30m": 423206,
                    "sell_30m_change_percent": -4.256319617396729,
                    "buy_30m": 296004,
                    "buy_history_30m": 303361,
                    "buy_30m_change_percent": -2.42516341916067,
                    "volume_30m": 949543.568352686,
                    "volume_30m_usd": 188331559.77578738,
                    "volume_history_30m": 1007682.2970747652,
                    "volume_history_30m_usd": 200156959.86425337,
                    "volume_30m_change_percent": -5.769549479121749,
                    "volume_buy_30m": 473130.29251346184,
                    "volume_buy_30m_usd": 93856764.62199154,
                    "volume_buy_history_30m": 479675.0794320691,
                    "volume_buy_history_30m_usd": 95280522.80842383,
                    "volume_buy_30m_change_percent": -1.3644208755552232,
                    "volume_sell_30m": 476413.2758392241,
                    "volume_sell_30m_usd": 94474795.15379584,
                    "volume_sell_history_30m": 528007.2176426961,
                    "volume_sell_history_30m_usd": 104876437.05582954,
                    "volume_sell_30m_change_percent": -9.771446313520995,
                    "trade_1h": 1323781,
                    "trade_history_1h": 1460948,
                    "trade_1h_change_percent": -9.388903643387717,
                    "sell_1h": 766537,
                    "sell_history_1h": 833994,
                    "sell_1h_change_percent": -8.088427494682215,
                    "buy_1h": 557244,
                    "buy_history_1h": 626954,
                    "buy_1h_change_percent": -11.1188380646746,
                    "volume_1h": 1820201.59264859,
                    "volume_1h_usd": 361341012.2305983,
                    "volume_history_1h": 2215504.2512326725,
                    "volume_history_1h_usd": 436450282.08621264,
                    "volume_1h_change_percent": -17.842559244205567,
                    "volume_buy_1h": 887557.0838598588,
                    "volume_buy_1h_usd": 176209011.91770583,
                    "volume_buy_history_1h": 1115539.1923768108,
                    "volume_buy_history_1h_usd": 219688244.87947023,
                    "volume_buy_1h_change_percent": -20.436942966674668,
                    "volume_sell_1h": 932644.5087887311,
                    "volume_sell_1h_usd": 185132000.31289244,
                    "volume_sell_history_1h": 1099965.058855862,
                    "volume_sell_history_1h_usd": 216762037.2067424,
                    "volume_sell_1h_change_percent": -15.211442283554966,
                    "trade_2h": 2680277,
                    "trade_history_2h": 2737323,
                    "trade_2h_change_percent": -2.084006892865767,
                    "sell_2h": 1540883,
                    "sell_history_2h": 1520437,
                    "sell_2h_change_percent": 1.344744964769997,
                    "buy_2h": 1139394,
                    "buy_history_2h": 1216886,
                    "buy_2h_change_percent": -6.368057484431573,
                    "volume_2h": 3831436.2591108195,
                    "volume_2h_usd": 757193487.9218342,
                    "volume_history_2h": 4109861.943241723,
                    "volume_history_2h_usd": 795392999.4275689,
                    "volume_2h_change_percent": -6.774575106804935,
                    "volume_buy_2h": 1923072.2242222985,
                    "volume_buy_2h_usd": 379995670.0617659,
                    "volume_buy_history_2h": 2184514.4664095147,
                    "volume_buy_history_2h_usd": 422774489.6633253,
                    "volume_buy_2h_change_percent": -11.967979439244672,
                    "volume_sell_2h": 1908364.0348885208,
                    "volume_sell_2h_usd": 377197817.8600683,
                    "volume_sell_history_2h": 1925347.4768322085,
                    "volume_sell_history_2h_usd": 372618509.7642436,
                    "volume_sell_2h_change_percent": -0.8820974991813233,
                    "trade_4h": 5678777,
                    "trade_history_4h": 4738200,
                    "trade_4h_change_percent": 19.850934954202017,
                    "sell_4h": 3202740,
                    "sell_history_4h": 2598002,
                    "sell_4h_change_percent": 23.277041357166006,
                    "buy_4h": 2476037,
                    "buy_history_4h": 2140198,
                    "buy_4h_change_percent": 15.691959342079564,
                    "volume_4h": 8309320.811196025,
                    "volume_4h_usd": 1622815342.7326021,
                    "volume_history_4h": 5827559.3867111625,
                    "volume_history_4h_usd": 1117139333.4616933,
                    "volume_4h_change_percent": 42.586634640637584,
                    "volume_buy_4h": 4284655.759920602,
                    "volume_buy_4h_usd": 836546459.2978258,
                    "volume_buy_history_4h": 2923792.0279110167,
                    "volume_buy_history_4h_usd": 560556194.860776,
                    "volume_buy_4h_change_percent": 46.54447782258615,
                    "volume_sell_4h": 4024665.0512754233,
                    "volume_sell_4h_usd": 786268883.4347763,
                    "volume_sell_history_4h": 2903767.358800146,
                    "volume_sell_history_4h_usd": 556583138.6009173,
                    "volume_sell_4h_change_percent": 38.60149777764701,
                    "trade_8h": 9833979,
                    "trade_history_8h": 10453618,
                    "trade_8h_change_percent": -5.9275075863686615,
                    "sell_8h": 5479388,
                    "sell_history_8h": 5773818,
                    "sell_8h_change_percent": -5.099398699439435,
                    "buy_8h": 4354591,
                    "buy_history_8h": 4679800,
                    "buy_8h_change_percent": -6.949207231078251,
                    "volume_8h": 13222473.11080315,
                    "volume_8h_usd": 2564461762.1546955,
                    "volume_history_8h": 14155274.76815367,
                    "volume_history_8h_usd": 2581042172.9211245,
                    "volume_8h_change_percent": -6.589781354503434,
                    "volume_buy_8h": 6715098.255980505,
                    "volume_buy_8h_usd": 1302403501.8965921,
                    "volume_buy_history_8h": 7280589.108363739,
                    "volume_buy_history_8h_usd": 1327749998.8559382,
                    "volume_buy_8h_change_percent": -7.767102963324963,
                    "volume_sell_8h": 6507374.854822645,
                    "volume_sell_8h_usd": 1262058260.2581036,
                    "volume_sell_history_8h": 6874685.65978993,
                    "volume_sell_history_8h_usd": 1253292174.0651865,
                    "volume_sell_8h_change_percent": -5.342946909059243,
                    "trade_24h": 30745188,
                    "trade_history_24h": 33058246,
                    "trade_24h_change_percent": -6.996916896316882,
                    "sell_24h": 17120896,
                    "sell_history_24h": 18482135,
                    "sell_24h_change_percent": -7.365161005479075,
                    "buy_24h": 13624292,
                    "buy_history_24h": 14576111,
                    "buy_24h_change_percent": -6.5299928080953835,
                    "volume_24h": 43277742.1619526,
                    "volume_24h_usd": 7920279131.146593,
                    "volume_history_24h": 49475082.60178679,
                    "volume_history_24h_usd": 8868558906.245562,
                    "volume_24h_change_percent": -12.52618512982609,
                    "volume_buy_24h": 21921600.663383704,
                    "volume_buy_24h_usd": 4013460416.672328,
                    "volume_buy_history_24h": 24403487.274207145,
                    "volume_buy_history_24h_usd": 4374621039.616789,
                    "volume_buy_24h_change_percent": -10.170212900049862,
                    "volume_sell_24h": 21356141.4985689,
                    "volume_sell_24h_usd": 3906818714.4742656,
                    "volume_sell_history_24h": 25071595.327579647,
                    "volume_sell_history_24h_usd": 4493937866.628773,
                    "volume_sell_24h_change_percent": -14.819375394606885,
                    "is_scaled_ui_token": false,
                    "multiplier": null
                  },
                  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So": {
                    "address": "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
                    "holder": 154578,
                    "market": 109,
                    "last_trade_unix_time": 1755058809,
                    "last_trade_human_time": "2025-08-13T04:20:09",
                    "price": 262.98670680518865,
                    "history_1m_price": 262.70278280753195,
                    "price_change_1m_percent": 0.10807803199584518,
                    "history_5m_price": 261.91755440219526,
                    "price_change_5m_percent": 0.4082018883513294,
                    "history_30m_price": 260.7109387939594,
                    "price_change_30m_percent": 0.8729085253410946,
                    "history_1h_price": 261.1699519292572,
                    "price_change_1h_percent": 0.695621706291677,
                    "history_2h_price": 255.60795345564043,
                    "price_change_2h_percent": 2.886746382415979,
                    "history_4h_price": 252.63997246560257,
                    "price_change_4h_percent": 4.095446274241028,
                    "history_6h_price": 252.45441235151782,
                    "price_change_6h_percent": 4.171958951149426,
                    "history_8h_price": 251.48576070904278,
                    "price_change_8h_percent": 4.573199716643966,
                    "history_12h_price": 239.02755642073214,
                    "price_change_12h_percent": 10.023593406228036,
                    "history_24h_price": 231.16561917408512,
                    "price_change_24h_percent": 13.765493218582755,
                    "unique_wallet_1m": 28,
                    "unique_wallet_history_1m": 43,
                    "unique_wallet_1m_change_percent": -34.883720930232556,
                    "unique_wallet_5m": 102,
                    "unique_wallet_history_5m": 73,
                    "unique_wallet_5m_change_percent": 39.726027397260275,
                    "unique_wallet_30m": 288,
                    "unique_wallet_history_30m": 301,
                    "unique_wallet_30m_change_percent": -4.318936877076412,
                    "unique_wallet_1h": 482,
                    "unique_wallet_history_1h": 623,
                    "unique_wallet_1h_change_percent": -22.63242375601926,
                    "unique_wallet_2h": 976,
                    "unique_wallet_history_2h": 982,
                    "unique_wallet_2h_change_percent": -0.6109979633401222,
                    "unique_wallet_4h": 1740,
                    "unique_wallet_history_4h": 1491,
                    "unique_wallet_4h_change_percent": 16.70020120724346,
                    "unique_wallet_8h": 2940,
                    "unique_wallet_history_8h": 3087,
                    "unique_wallet_8h_change_percent": -4.761904761904762,
                    "unique_wallet_24h": 6691,
                    "unique_wallet_history_24h": 5459,
                    "unique_wallet_24h_change_percent": 22.56823594064847,
                    "trade_1m": 73,
                    "trade_history_1m": 177,
                    "trade_1m_change_percent": -58.75706214689266,
                    "sell_1m": 36,
                    "sell_history_1m": 89,
                    "sell_1m_change_percent": -59.55056179775281,
                    "buy_1m": 37,
                    "buy_history_1m": 88,
                    "buy_1m_change_percent": -57.95454545454546,
                    "volume_1m": 12.059571704,
                    "volume_1m_usd": 3171.3705478902007,
                    "volume_history_1m": 37.398013155,
                    "volume_history_1m_usd": 9824.980892155985,
                    "volume_1m_change_percent": -67.75344279917267,
                    "volume_buy_1m": 6.029785852,
                    "volume_buy_1m_usd": 1585.7385240127205,
                    "volume_buy_history_1m": 18.503508619999998,
                    "volume_buy_history_1m_usd": 4861.455461890566,
                    "volume_buy_1m_change_percent": -67.41274330273477,
                    "volume_sell_1m": 6.029785852,
                    "volume_sell_1m_usd": 1585.6320238774802,
                    "volume_sell_history_1m": 18.894504535,
                    "volume_sell_history_1m_usd": 4963.525430265419,
                    "volume_sell_1m_change_percent": -68.08709198576506,
                    "trade_5m": 653,
                    "trade_history_5m": 406,
                    "trade_5m_change_percent": 60.83743842364532,
                    "sell_5m": 324,
                    "sell_history_5m": 204,
                    "sell_5m_change_percent": 58.82352941176471,
                    "buy_5m": 329,
                    "buy_history_5m": 202,
                    "buy_5m_change_percent": 62.87128712871287,
                    "volume_5m": 162.28248443299998,
                    "volume_5m_usd": 42558.97155905787,
                    "volume_history_5m": 106.457894647,
                    "volume_history_5m_usd": 27843.252679286117,
                    "volume_5m_change_percent": 52.43818691991493,
                    "volume_buy_5m": 80.69316228699999,
                    "volume_buy_5m_usd": 21163.129320319964,
                    "volume_buy_history_5m": 52.24340721,
                    "volume_buy_history_5m_usd": 13664.499121192126,
                    "volume_buy_5m_change_percent": 54.456163172210516,
                    "volume_sell_5m": 81.58932214599999,
                    "volume_sell_5m_usd": 21395.84223873791,
                    "volume_sell_history_5m": 54.214487437,
                    "volume_sell_history_5m_usd": 14178.753558093993,
                    "volume_sell_5m_change_percent": 50.493578383104584,
                    "trade_30m": 2750,
                    "trade_history_30m": 3048,
                    "trade_30m_change_percent": -9.776902887139109,
                    "sell_30m": 1382,
                    "sell_history_30m": 1557,
                    "sell_30m_change_percent": -11.23956326268465,
                    "buy_30m": 1368,
                    "buy_history_30m": 1491,
                    "buy_30m_change_percent": -8.249496981891348,
                    "volume_30m": 799.0710690200001,
                    "volume_30m_usd": 208527.97926690662,
                    "volume_history_30m": 2481.054935338,
                    "volume_history_30m_usd": 648754.0741432161,
                    "volume_30m_change_percent": -67.79309246084304,
                    "volume_buy_30m": 373.422228748,
                    "volume_buy_30m_usd": 97472.73322911118,
                    "volume_buy_history_30m": 522.7496909670001,
                    "volume_buy_history_30m_usd": 136616.53562110744,
                    "volume_buy_30m_change_percent": -28.565767670329773,
                    "volume_sell_30m": 425.64884027200003,
                    "volume_sell_30m_usd": 111055.24603779544,
                    "volume_sell_history_30m": 1958.305244371,
                    "volume_sell_history_30m_usd": 512137.5385221087,
                    "volume_sell_30m_change_percent": -78.26442831139347,
                    "trade_1h": 5309,
                    "trade_history_1h": 7560,
                    "trade_1h_change_percent": -29.775132275132275,
                    "sell_1h": 2687,
                    "sell_history_1h": 3808,
                    "sell_1h_change_percent": -29.438025210084035,
                    "buy_1h": 2622,
                    "buy_history_1h": 3752,
                    "buy_1h_change_percent": -30.11727078891258,
                    "volume_1h": 3138.6927878439997,
                    "volume_1h_usd": 820410.1239532583,
                    "volume_history_1h": 3282.0023030169996,
                    "volume_history_1h_usd": 851813.8301435173,
                    "volume_1h_change_percent": -4.3665269534168765,
                    "volume_buy_1h": 824.397139262,
                    "volume_buy_1h_usd": 215375.7401405987,
                    "volume_buy_history_1h": 1399.4322926629998,
                    "volume_buy_history_1h_usd": 363318.59453095926,
                    "volume_buy_1h_change_percent": -41.0906019830911,
                    "volume_sell_1h": 2314.2956485819996,
                    "volume_sell_1h_usd": 605034.3838126595,
                    "volume_sell_history_1h": 1882.5700103539998,
                    "volume_sell_history_1h_usd": 488495.235612558,
                    "volume_sell_1h_change_percent": 22.93277996852918,
                    "trade_2h": 12547,
                    "trade_history_2h": 12272,
                    "trade_2h_change_percent": 2.2408735332464147,
                    "sell_2h": 6334,
                    "sell_history_2h": 6048,
                    "sell_2h_change_percent": 4.728835978835979,
                    "buy_2h": 6213,
                    "buy_history_2h": 6224,
                    "buy_2h_change_percent": -0.17673521850899743,
                    "volume_2h": 6316.872997122,
                    "volume_2h_usd": 1645085.3454827392,
                    "volume_history_2h": 7986.443651562,
                    "volume_history_2h_usd": 2035706.3497173262,
                    "volume_2h_change_percent": -20.90505771130637,
                    "volume_buy_2h": 2172.1645888589997,
                    "volume_buy_2h_usd": 565188.3951737988,
                    "volume_buy_history_2h": 4509.220244333001,
                    "volume_buy_history_2h_usd": 1149040.4230995753,
                    "volume_buy_2h_change_percent": -51.8283767223638,
                    "volume_sell_2h": 4144.708408263,
                    "volume_sell_2h_usd": 1079896.9503089404,
                    "volume_sell_history_2h": 3477.223407229,
                    "volume_sell_history_2h_usd": 886665.9266177509,
                    "volume_sell_2h_change_percent": 19.195919354687625,
                    "trade_4h": 25318,
                    "trade_history_4h": 16850,
                    "trade_4h_change_percent": 50.255192878338285,
                    "sell_4h": 12628,
                    "sell_history_4h": 8470,
                    "sell_4h_change_percent": 49.09090909090909,
                    "buy_4h": 12690,
                    "buy_history_4h": 8380,
                    "buy_4h_change_percent": 51.43198090692124,
                    "volume_4h": 14337.506949092993,
                    "volume_4h_usd": 3688905.157495865,
                    "volume_history_4h": 9402.798090806,
                    "volume_history_4h_usd": 2372860.9187707277,
                    "volume_4h_change_percent": 52.48128068507737,
                    "volume_buy_4h": 6744.683454876996,
                    "volume_buy_4h_usd": 1730053.0971775858,
                    "volume_buy_history_4h": 4024.800055123,
                    "volume_buy_history_4h_usd": 1016578.6286089938,
                    "volume_buy_4h_change_percent": 67.57809984354301,
                    "volume_sell_4h": 7592.823494215997,
                    "volume_sell_4h_usd": 1958852.0603182793,
                    "volume_sell_history_4h": 5377.998035683,
                    "volume_sell_history_4h_usd": 1356282.290161734,
                    "volume_sell_4h_change_percent": 41.18308418555821,
                    "trade_8h": 40860,
                    "trade_history_8h": 39077,
                    "trade_8h_change_percent": 4.562786293727768,
                    "sell_8h": 20461,
                    "sell_history_8h": 19558,
                    "sell_8h_change_percent": 4.617036506800287,
                    "buy_8h": 20399,
                    "buy_history_8h": 19519,
                    "buy_8h_change_percent": 4.508427685844562,
                    "volume_8h": 22711.31062530999,
                    "volume_8h_usd": 5801740.492862853,
                    "volume_history_8h": 31386.551458990005,
                    "volume_history_8h_usd": 7548528.231382184,
                    "volume_8h_change_percent": -27.639993661027635,
                    "volume_buy_8h": 9883.368016022996,
                    "volume_buy_8h_usd": 2522686.871093817,
                    "volume_buy_history_8h": 12230.382385765002,
                    "volume_buy_history_8h_usd": 2929602.9775913735,
                    "volume_buy_8h_change_percent": -19.190032622967756,
                    "volume_sell_8h": 12827.942609286996,
                    "volume_sell_8h_usd": 3279053.621769036,
                    "volume_sell_history_8h": 19156.169073225003,
                    "volume_sell_history_8h_usd": 4618925.253790811,
                    "volume_sell_8h_change_percent": -33.03492697181874,
                    "trade_24h": 93721,
                    "trade_history_24h": 65222,
                    "trade_24h_change_percent": 43.6953788598939,
                    "sell_24h": 46575,
                    "sell_history_24h": 32556,
                    "sell_24h_change_percent": 43.06118687799484,
                    "buy_24h": 47146,
                    "buy_history_24h": 32666,
                    "buy_24h_change_percent": 44.32743525378069,
                    "volume_24h": 78243.334932192,
                    "volume_24h_usd": 18897097.90192979,
                    "volume_history_24h": 50370.62079124302,
                    "volume_history_24h_usd": 11776721.001745548,
                    "volume_24h_change_percent": 55.33526032260987,
                    "volume_buy_24h": 42989.095074099,
                    "volume_buy_24h_usd": 10271722.313242288,
                    "volume_buy_history_24h": 29127.373655922,
                    "volume_buy_history_24h_usd": 6775170.992515063,
                    "volume_buy_24h_change_percent": 47.590014746690755,
                    "volume_sell_24h": 35254.23985809299,
                    "volume_sell_24h_usd": 8625375.5886875,
                    "volume_sell_history_24h": 21243.247135321017,
                    "volume_sell_history_24h_usd": 5001550.009230484,
                    "volume_sell_24h_change_percent": 65.95504271790907,
                    "is_scaled_ui_token": false,
                    "multiplier": null
                  },
                  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": {
                    "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                    "holder": 5154436,
                    "market": 13924,
                    "last_trade_unix_time": 1755058812,
                    "last_trade_human_time": "2025-08-13T04:20:12",
                    "price": 0.99982817,
                    "history_1m_price": 0.99983,
                    "price_change_1m_percent": -0.00018303111528764472,
                    "history_5m_price": 0.99985096,
                    "price_change_5m_percent": -0.002279339712784718,
                    "history_30m_price": 0.99981573,
                    "price_change_30m_percent": 0.0012442292741285887,
                    "history_1h_price": 0.9998087,
                    "price_change_1h_percent": 0.0019473725323675833,
                    "history_2h_price": 0.99977426,
                    "price_change_2h_percent": 0.005392217239118594,
                    "history_4h_price": 0.99982515,
                    "price_change_4h_percent": 0.0003020528139309876,
                    "history_6h_price": 0.99979,
                    "price_change_6h_percent": 0.0038178017383710128,
                    "history_8h_price": 0.99989717,
                    "price_change_8h_percent": -0.006900709599966739,
                    "history_12h_price": 0.99987,
                    "price_change_12h_percent": -0.0041835438607039374,
                    "history_24h_price": 0.99985,
                    "price_change_24h_percent": -0.0021833274991249147,
                    "unique_wallet_1m": 788,
                    "unique_wallet_history_1m": 867,
                    "unique_wallet_1m_change_percent": -9.111880046136102,
                    "unique_wallet_5m": 2834,
                    "unique_wallet_history_5m": 2470,
                    "unique_wallet_5m_change_percent": 14.736842105263158,
                    "unique_wallet_30m": 11107,
                    "unique_wallet_history_30m": 11401,
                    "unique_wallet_30m_change_percent": -2.5787211648101045,
                    "unique_wallet_1h": 18673,
                    "unique_wallet_history_1h": 20161,
                    "unique_wallet_1h_change_percent": -7.380586280442438,
                    "unique_wallet_2h": 32553,
                    "unique_wallet_history_2h": 28401,
                    "unique_wallet_2h_change_percent": 14.619203549170804,
                    "unique_wallet_4h": 50145,
                    "unique_wallet_history_4h": 45190,
                    "unique_wallet_4h_change_percent": 10.964815224607214,
                    "unique_wallet_8h": 79361,
                    "unique_wallet_history_8h": 84308,
                    "unique_wallet_8h_change_percent": -5.867770555581914,
                    "unique_wallet_24h": 174611,
                    "unique_wallet_history_24h": 189227,
                    "unique_wallet_24h_change_percent": -7.724056292178178,
                    "trade_1m": 3336,
                    "trade_history_1m": 4958,
                    "trade_1m_change_percent": -32.7148043565954,
                    "sell_1m": 1990,
                    "sell_history_1m": 2938,
                    "sell_1m_change_percent": -32.26684819605173,
                    "buy_1m": 1346,
                    "buy_history_1m": 2020,
                    "buy_1m_change_percent": -33.366336633663366,
                    "volume_1m": 1308404.009448,
                    "volume_1m_usd": 1308333.7870999281,
                    "volume_history_1m": 2041033.7818900002,
                    "volume_history_1m_usd": 2041005.2145372764,
                    "volume_1m_change_percent": -35.89503412156089,
                    "volume_buy_1m": 413612.422125,
                    "volume_buy_1m_usd": 413584.4634477553,
                    "volume_buy_history_1m": 442307.3128550001,
                    "volume_buy_history_1m_usd": 442295.99373712466,
                    "volume_buy_1m_change_percent": -6.487546078490237,
                    "volume_sell_1m": 894791.587323,
                    "volume_sell_1m_usd": 894749.3236521728,
                    "volume_sell_history_1m": 1598726.469035,
                    "volume_sell_history_1m_usd": 1598709.2208001518,
                    "volume_sell_1m_change_percent": -44.03097686478532,
                    "trade_5m": 19059,
                    "trade_history_5m": 14490,
                    "trade_5m_change_percent": 31.53209109730849,
                    "sell_5m": 11062,
                    "sell_history_5m": 7934,
                    "sell_5m_change_percent": 39.425258381648604,
                    "buy_5m": 7997,
                    "buy_history_5m": 6556,
                    "buy_5m_change_percent": 21.97986577181208,
                    "volume_5m": 8100982.060734,
                    "volume_5m_usd": 8100710.993758566,
                    "volume_history_5m": 5912049.999242,
                    "volume_history_5m_usd": 5911844.975958601,
                    "volume_5m_change_percent": 37.02492471769773,
                    "volume_buy_5m": 2254139.6831360003,
                    "volume_buy_5m_usd": 2254073.993651012,
                    "volume_buy_history_5m": 2948171.02885,
                    "volume_buy_history_5m_usd": 2948025.698099201,
                    "volume_buy_5m_change_percent": -23.541081535718163,
                    "volume_sell_5m": 5846842.377598,
                    "volume_sell_5m_usd": 5846637.000107554,
                    "volume_sell_history_5m": 2963878.970392,
                    "volume_sell_history_5m_usd": 2963819.2778594,
                    "volume_sell_5m_change_percent": 97.26994374620843,
                    "trade_30m": 92499,
                    "trade_history_30m": 107437,
                    "trade_30m_change_percent": -13.903962322105048,
                    "sell_30m": 49070,
                    "sell_history_30m": 53177,
                    "sell_30m_change_percent": -7.723263817063768,
                    "buy_30m": 43429,
                    "buy_history_30m": 54260,
                    "buy_30m_change_percent": -19.961297456690012,
                    "volume_30m": 46140187.79487201,
                    "volume_30m_usd": 46138347.92390235,
                    "volume_history_30m": 57457497.16842799,
                    "volume_history_30m_usd": 57455175.09102805,
                    "volume_30m_change_percent": -19.696836672820947,
                    "volume_buy_30m": 20421163.090902995,
                    "volume_buy_30m_usd": 20420285.68942718,
                    "volume_buy_history_30m": 27067094.84286599,
                    "volume_buy_history_30m_usd": 27066254.220179565,
                    "volume_buy_30m_change_percent": -24.553546623843328,
                    "volume_sell_30m": 25719024.703969013,
                    "volume_sell_30m_usd": 25718062.234475173,
                    "volume_sell_history_30m": 30390402.325561997,
                    "volume_sell_history_30m_usd": 30388920.87084848,
                    "volume_sell_30m_change_percent": -15.371226650934434,
                    "trade_1h": 183426,
                    "trade_history_1h": 243809,
                    "trade_1h_change_percent": -24.76651805306613,
                    "sell_1h": 94226,
                    "sell_history_1h": 125768,
                    "sell_1h_change_percent": -25.07951148145792,
                    "buy_1h": 89200,
                    "buy_history_1h": 118041,
                    "buy_1h_change_percent": -24.433035979024236,
                    "volume_1h": 92749755.27730599,
                    "volume_1h_usd": 92746037.12634899,
                    "volume_history_1h": 147967895.39918795,
                    "volume_history_1h_usd": 147961003.80891407,
                    "volume_1h_change_percent": -37.31764919201858,
                    "volume_buy_1h": 42212679.94161198,
                    "volume_buy_1h_usd": 42211074.238075525,
                    "volume_buy_history_1h": 67930255.24647099,
                    "volume_buy_history_1h_usd": 67926771.65416785,
                    "volume_buy_1h_change_percent": -37.858793863718105,
                    "volume_sell_1h": 50537075.33569401,
                    "volume_sell_1h_usd": 50534962.88827346,
                    "volume_sell_history_1h": 80037640.15271696,
                    "volume_sell_history_1h_usd": 80034232.15474622,
                    "volume_sell_1h_change_percent": -36.858364090612845,
                    "trade_2h": 412431,
                    "trade_history_2h": 386632,
                    "trade_2h_change_percent": 6.672753419272073,
                    "sell_2h": 212386,
                    "sell_history_2h": 198632,
                    "sell_2h_change_percent": 6.9243626404607515,
                    "buy_2h": 200045,
                    "buy_history_2h": 188000,
                    "buy_2h_change_percent": 6.406914893617022,
                    "volume_2h": 233556433.41227996,
                    "volume_2h_usd": 233546096.14317834,
                    "volume_history_2h": 200676703.92325795,
                    "volume_history_2h_usd": 200670380.0438611,
                    "volume_2h_change_percent": 16.38442771194596,
                    "volume_buy_2h": 107292908.10336798,
                    "volume_buy_2h_usd": 107287917.68279324,
                    "volume_buy_history_2h": 95716891.60262197,
                    "volume_buy_history_2h_usd": 95714426.14595845,
                    "volume_buy_2h_change_percent": 12.094016329745616,
                    "volume_sell_2h": 126263525.30891198,
                    "volume_sell_2h_usd": 126258178.46038508,
                    "volume_sell_history_2h": 104959812.32063597,
                    "volume_sell_history_2h_usd": 104955953.89790262,
                    "volume_sell_2h_change_percent": 20.297018942065616,
                    "trade_4h": 830719,
                    "trade_history_4h": 739363,
                    "trade_4h_change_percent": 12.356041619610394,
                    "sell_4h": 427554,
                    "sell_history_4h": 390782,
                    "sell_4h_change_percent": 9.409849993090777,
                    "buy_4h": 403165,
                    "buy_history_4h": 348581,
                    "buy_4h_change_percent": 15.658914283911058,
                    "volume_4h": 444764661.72954196,
                    "volume_4h_usd": 444747744.9248905,
                    "volume_history_4h": 403490702.36459595,
                    "volume_history_4h_usd": 403476786.22676635,
                    "volume_4h_change_percent": 10.229221918390248,
                    "volume_buy_4h": 209077860.69843987,
                    "volume_buy_4h_usd": 209070141.66263077,
                    "volume_buy_history_4h": 206645655.16793695,
                    "volume_buy_history_4h_usd": 206636627.6737574,
                    "volume_buy_4h_change_percent": 1.1769933069854814,
                    "volume_sell_4h": 235686801.0311021,
                    "volume_sell_4h_usd": 235677603.26225972,
                    "volume_sell_history_4h": 196845047.196659,
                    "volume_sell_history_4h_usd": 196840158.5530089,
                    "volume_sell_4h_change_percent": 19.732146877761192,
                    "trade_8h": 1502472,
                    "trade_history_8h": 1579030,
                    "trade_8h_change_percent": -4.848419599374299,
                    "sell_8h": 782357,
                    "sell_history_8h": 845060,
                    "sell_8h_change_percent": -7.419946512673656,
                    "buy_8h": 720115,
                    "buy_history_8h": 733970,
                    "buy_8h_change_percent": -1.8876793329427635,
                    "volume_8h": 821709120.2497389,
                    "volume_8h_usd": 821679006.179775,
                    "volume_history_8h": 946874319.4912045,
                    "volume_history_8h_usd": 946849383.5006773,
                    "volume_8h_change_percent": -13.218776416781703,
                    "volume_buy_8h": 401974198.85122186,
                    "volume_buy_8h_usd": 401957962.7464045,
                    "volume_buy_history_8h": 435401537.64981294,
                    "volume_buy_history_8h_usd": 435390296.48382026,
                    "volume_buy_8h_change_percent": -7.677358922300407,
                    "volume_sell_8h": 419734921.39851713,
                    "volume_sell_8h_usd": 419721043.4333705,
                    "volume_sell_history_8h": 511472781.84139156,
                    "volume_sell_history_8h_usd": 511459087.01685715,
                    "volume_sell_8h_change_percent": -17.936019999461568,
                    "trade_24h": 3866559,
                    "trade_history_24h": 3269920,
                    "trade_24h_change_percent": 18.246287370944856,
                    "sell_24h": 2033949,
                    "sell_history_24h": 1655266,
                    "sell_24h_change_percent": 22.877471052990877,
                    "buy_24h": 1832610,
                    "buy_history_24h": 1614654,
                    "buy_24h_change_percent": 13.498619518485075,
                    "volume_24h": 2045204750.9809194,
                    "volume_24h_usd": 2045144320.587021,
                    "volume_history_24h": 1543163627.203192,
                    "volume_history_24h_usd": 1543123874.7516944,
                    "volume_24h_change_percent": 32.53323982808094,
                    "volume_buy_24h": 973697087.8169838,
                    "volume_buy_24h_usd": 973667513.1963601,
                    "volume_buy_history_24h": 807894931.7944231,
                    "volume_buy_history_24h_usd": 807872635.6768489,
                    "volume_buy_24h_change_percent": 20.522737486952167,
                    "volume_sell_24h": 1071507663.1639357,
                    "volume_sell_24h_usd": 1071476807.390661,
                    "volume_sell_history_24h": 735268695.4087689,
                    "volume_sell_history_24h_usd": 735251239.0748456,
                    "volume_sell_24h_change_percent": 45.73008069767426,
                    "is_scaled_ui_token": false,
                    "multiplier": null
                  }
                }
              }
            },
            "TokenTradeDataMultiple": {
              "value": {
                "data": {
                  "So11111111111111111111111111111111111111112": {
                    "address": "So11111111111111111111111111111111111111112",
                    "holder": 1760230,
                    "market": 196569,
                    "last_trade_unix_time": 1746802179,
                    "last_trade_human_time": "2025-05-09T14:49:39",
                    "price": 168.6163239777922,
                    "history_1m_price": 167.8048566230487,
                    "price_change_1m_percent": 0.4835779911700451,
                    "history_5m_price": 169.09729500392336,
                    "price_change_5m_percent": -0.28443448851148007,
                    "history_30m_price": 171.0111537830427,
                    "price_change_30m_percent": -1.4003939230120266,
                    "history_1h_price": 173.19810480366027,
                    "price_change_1h_percent": -2.6453989384364425,
                    "history_2h_price": 172.2847660639025,
                    "price_change_2h_percent": -2.1292898785662997,
                    "history_4h_price": 170.20060302676234,
                    "price_change_4h_percent": -0.9308304558245422,
                    "history_6h_price": 166.77262847108634,
                    "price_change_6h_percent": 1.105514450187799,
                    "history_8h_price": 163.78096525226772,
                    "price_change_8h_percent": 2.9523325363705752,
                    "history_12h_price": 162.85944689196924,
                    "price_change_12h_percent": 3.5348745164544955,
                    "history_24h_price": 157.54129242137248,
                    "price_change_24h_percent": 7.029923003803708,
                    "unique_wallet_1m": 7701,
                    "unique_wallet_history_1m": 8889,
                    "unique_wallet_1m_change_percent": -13.364832939588256,
                    "unique_wallet_5m": 26522,
                    "unique_wallet_history_5m": 27287,
                    "unique_wallet_5m_change_percent": -2.8035328178253383,
                    "unique_wallet_30m": 98738,
                    "unique_wallet_history_30m": 98887,
                    "unique_wallet_30m_change_percent": -0.15067703540404703,
                    "unique_wallet_1h": 166368,
                    "unique_wallet_history_1h": 145186,
                    "unique_wallet_1h_change_percent": 14.5895609769537,
                    "unique_wallet_2h": 266222,
                    "unique_wallet_history_2h": 181521,
                    "unique_wallet_2h_change_percent": 46.661818742735,
                    "unique_wallet_4h": 383247,
                    "unique_wallet_history_4h": 275988,
                    "unique_wallet_4h_change_percent": 38.86364624548894,
                    "unique_wallet_8h": 566554,
                    "unique_wallet_history_8h": 593685,
                    "unique_wallet_8h_change_percent": -4.569931866225355,
                    "unique_wallet_24h": 1666417,
                    "unique_wallet_history_24h": 1404422,
                    "unique_wallet_24h_change_percent": 18.65500540435852,
                    "trade_1m": 21329,
                    "trade_history_1m": 24598,
                    "trade_1m_change_percent": -13.289698349459306,
                    "sell_1m": 11442,
                    "sell_history_1m": 13713,
                    "sell_1m_change_percent": -16.560927586961277,
                    "buy_1m": 9887,
                    "buy_history_1m": 10885,
                    "buy_1m_change_percent": -9.168580615525954,
                    "volume_1m": 32886.042657262,
                    "volume_1m_usd": 5569412.577064864,
                    "volume_history_1m": 36817.037119158005,
                    "volume_history_1m_usd": 6259558.328708703,
                    "volume_1m_change_percent": -10.677107039258427,
                    "volume_buy_1m": 21175.290352262997,
                    "volume_buy_1m_usd": 3572722.6990984404,
                    "volume_buy_history_1m": 16240.604788685003,
                    "volume_buy_history_1m_usd": 2777543.101086156,
                    "volume_buy_1m_change_percent": 30.384863296569105,
                    "volume_sell_1m": 11710.752304999001,
                    "volume_sell_1m_usd": 1996689.877966424,
                    "volume_sell_history_1m": 20576.432330473006,
                    "volume_sell_history_1m_usd": 3482015.227622547,
                    "volume_sell_1m_change_percent": -43.08657537460578,
                    "trade_5m": 113382,
                    "trade_history_5m": 126445,
                    "trade_5m_change_percent": -10.330973941239275,
                    "sell_5m": 63801,
                    "sell_history_5m": 71439,
                    "sell_5m_change_percent": -10.691639020702977,
                    "buy_5m": 49581,
                    "buy_history_5m": 55006,
                    "buy_5m_change_percent": -9.862560447951132,
                    "volume_5m": 148139.64909717703,
                    "volume_5m_usd": 25242382.01732124,
                    "volume_history_5m": 190968.88301959998,
                    "volume_history_5m_usd": 32599167.024338104,
                    "volume_5m_change_percent": -22.42733645670808,
                    "volume_buy_5m": 76037.241803054,
                    "volume_buy_5m_usd": 12976982.958676936,
                    "volume_buy_history_5m": 95496.301480897,
                    "volume_buy_history_5m_usd": 16337365.895444943,
                    "volume_buy_5m_change_percent": -20.37676787067568,
                    "volume_sell_5m": 72102.40729412301,
                    "volume_sell_5m_usd": 12265399.058644304,
                    "volume_sell_history_5m": 95472.58153870297,
                    "volume_sell_history_5m_usd": 16261801.12889316,
                    "volume_sell_5m_change_percent": -24.478414501765712,
                    "trade_30m": 819946,
                    "trade_history_30m": 797963,
                    "trade_30m_change_percent": 2.7548896377400958,
                    "sell_30m": 460007,
                    "sell_history_30m": 446408,
                    "sell_30m_change_percent": 3.046316374258526,
                    "buy_30m": 359939,
                    "buy_history_30m": 351555,
                    "buy_30m_change_percent": 2.38483309866166,
                    "volume_30m": 1300593.600139237,
                    "volume_30m_usd": 222767664.984795,
                    "volume_history_30m": 1014809.626640769,
                    "volume_history_30m_usd": 176963012.98413345,
                    "volume_30m_change_percent": 28.16133844181913,
                    "volume_buy_30m": 645088.0375125521,
                    "volume_buy_30m_usd": 110334385.91274282,
                    "volume_buy_history_30m": 515256.87016754213,
                    "volume_buy_history_30m_usd": 89409857.07236338,
                    "volume_buy_30m_change_percent": 25.197367538795508,
                    "volume_sell_30m": 655505.562626685,
                    "volume_sell_30m_usd": 112433279.07205218,
                    "volume_sell_history_30m": 499552.7564732268,
                    "volume_sell_history_30m_usd": 87553155.91177008,
                    "volume_sell_30m_change_percent": 31.2184857620371,
                    "trade_1h": 1497621,
                    "trade_history_1h": 1320699,
                    "trade_1h_change_percent": 13.396087980682955,
                    "sell_1h": 838726,
                    "sell_history_1h": 721102,
                    "sell_1h_change_percent": 16.31170070253584,
                    "buy_1h": 658895,
                    "buy_history_1h": 599597,
                    "buy_1h_change_percent": 9.889642543241543,
                    "volume_1h": 2155096.4900977304,
                    "volume_1h_usd": 372099117.86534846,
                    "volume_history_1h": 1783376.1195459762,
                    "volume_history_1h_usd": 315517691.7376682,
                    "volume_1h_change_percent": 20.843632842094426,
                    "volume_buy_1h": 1074875.1483996215,
                    "volume_buy_1h_usd": 185033216.42392257,
                    "volume_buy_history_1h": 870775.027542904,
                    "volume_buy_history_1h_usd": 151538134.971131,
                    "volume_buy_1h_change_percent": 23.43890378122508,
                    "volume_sell_1h": 1080221.341698109,
                    "volume_sell_1h_usd": 187065901.4414259,
                    "volume_sell_history_1h": 912601.092003072,
                    "volume_sell_history_1h_usd": 163979556.76653722,
                    "volume_sell_1h_change_percent": 18.36730759626054,
                    "trade_2h": 2700735,
                    "trade_history_2h": 2273625,
                    "trade_2h_change_percent": 18.78541975919512,
                    "sell_2h": 1495863,
                    "sell_history_2h": 1214967,
                    "sell_2h_change_percent": 23.119640286526298,
                    "buy_2h": 1204872,
                    "buy_history_2h": 1058658,
                    "buy_2h_change_percent": 13.81125916018204,
                    "volume_2h": 3777744.0079868184,
                    "volume_2h_usd": 659336304.7277063,
                    "volume_history_2h": 4986668.953994334,
                    "volume_history_2h_usd": 876699150.961254,
                    "volume_2h_change_percent": -24.24313619293223,
                    "volume_buy_2h": 1859472.8275801751,
                    "volume_buy_2h_usd": 321565280.427372,
                    "volume_buy_history_2h": 2552431.93778671,
                    "volume_buy_history_2h_usd": 447965734.71457183,
                    "volume_buy_2h_change_percent": -27.148975059739318,
                    "volume_sell_2h": 1918271.180406643,
                    "volume_sell_2h_usd": 337771024.30033433,
                    "volume_sell_history_2h": 2434237.0162076233,
                    "volume_sell_history_2h_usd": 428733416.24668217,
                    "volume_sell_2h_change_percent": -21.196203671441168,
                    "trade_4h": 5123157,
                    "trade_history_4h": 4712834,
                    "trade_4h_change_percent": 8.706502287158852,
                    "sell_4h": 2789623,
                    "sell_history_4h": 2530641,
                    "sell_4h_change_percent": 10.233849842786867,
                    "buy_4h": 2333534,
                    "buy_history_4h": 2182193,
                    "buy_4h_change_percent": 6.935271078222686,
                    "volume_4h": 8985805.366700899,
                    "volume_4h_usd": 1573444650.61512,
                    "volume_history_4h": 8303593.777521941,
                    "volume_history_4h_usd": 1399553943.2157688,
                    "volume_4h_change_percent": 8.215859391215929,
                    "volume_buy_4h": 4531957.405336594,
                    "volume_buy_4h_usd": 789561842.2425901,
                    "volume_buy_history_4h": 4305672.358770635,
                    "volume_buy_history_4h_usd": 725954295.8032504,
                    "volume_buy_4h_change_percent": 5.255510120388459,
                    "volume_sell_4h": 4453847.961364305,
                    "volume_sell_4h_usd": 783882808.3725297,
                    "volume_sell_history_4h": 3997921.418751306,
                    "volume_sell_history_4h_usd": 673599647.4125183,
                    "volume_sell_4h_change_percent": 11.404089647049664,
                    "trade_8h": 9321207,
                    "trade_history_8h": 9379085,
                    "trade_8h_change_percent": -0.6170964438428695,
                    "sell_8h": 5046590,
                    "sell_history_8h": 5093401,
                    "sell_8h_change_percent": -0.9190519262080483,
                    "buy_8h": 4274617,
                    "buy_history_8h": 4285684,
                    "buy_8h_change_percent": -0.2582318248382288,
                    "volume_8h": 15955390.884366825,
                    "volume_8h_usd": 2740816553.9291916,
                    "volume_history_8h": 9435031.81369001,
                    "volume_history_8h_usd": 1548030762.8614295,
                    "volume_8h_change_percent": 69.1079712229049,
                    "volume_buy_8h": 8077437.272185957,
                    "volume_buy_8h_usd": 1383375089.9782276,
                    "volume_buy_history_8h": 4725061.174831935,
                    "volume_buy_history_8h_usd": 774623834.5994598,
                    "volume_buy_8h_change_percent": 70.94884009566843,
                    "volume_sell_8h": 7877953.612180868,
                    "volume_sell_8h_usd": 1357441463.9509637,
                    "volume_sell_history_8h": 4709970.638858074,
                    "volume_sell_history_8h_usd": 773406928.2619697,
                    "volume_sell_8h_change_percent": 67.2612042883322,
                    "trade_24h": 29336226,
                    "trade_history_24h": 24668611,
                    "trade_24h_change_percent": 18.92127205702826,
                    "sell_24h": 15999666,
                    "sell_history_24h": 13552421,
                    "sell_24h_change_percent": 18.05762232445406,
                    "buy_24h": 13336560,
                    "buy_history_24h": 11116190,
                    "buy_24h_change_percent": 19.974199793274494,
                    "volume_24h": 38792027.488995165,
                    "volume_24h_usd": 6459392062.652276,
                    "volume_history_24h": 27529677.595021047,
                    "volume_history_24h_usd": 4160810504.560139,
                    "volume_24h_change_percent": 40.90985030645982,
                    "volume_buy_24h": 19586757.81966657,
                    "volume_buy_24h_usd": 3255526835.774689,
                    "volume_buy_history_24h": 13821503.465453008,
                    "volume_buy_history_24h_usd": 2090095440.02877,
                    "volume_buy_24h_change_percent": 41.71220857863888,
                    "volume_sell_24h": 19205269.6693286,
                    "volume_sell_24h_usd": 3203865226.877587,
                    "volume_sell_history_24h": 13708174.129568037,
                    "volume_sell_history_24h_usd": 2070715064.5313692,
                    "volume_sell_24h_change_percent": 40.100858712492766
                  },
                  "NeonTjSjsuo3rexg9o6vHuMXw62f9V7zvmu8M8Zut44": {
                    "address": "NeonTjSjsuo3rexg9o6vHuMXw62f9V7zvmu8M8Zut44",
                    "holder": 15925,
                    "market": 18,
                    "last_trade_unix_time": 1746802079,
                    "last_trade_human_time": "2025-05-09T14:47:59",
                    "price": 0.12420729138723606,
                    "history_1m_price": 0.12420729138723606,
                    "price_change_1m_percent": 0,
                    "history_5m_price": 0.12414728918836315,
                    "price_change_5m_percent": 0.0483314611742098,
                    "history_30m_price": 0.1257361799789287,
                    "price_change_30m_percent": -1.2159496112804191,
                    "history_1h_price": 0.1285564153653252,
                    "price_change_1h_percent": -3.383047019263886,
                    "history_2h_price": 0.127335918828378,
                    "price_change_2h_percent": -2.456987368472731,
                    "history_4h_price": 0.125698740869959,
                    "price_change_4h_percent": -1.1865269869854211,
                    "history_6h_price": 0.12533027081460005,
                    "price_change_6h_percent": -0.8960161181054185,
                    "history_8h_price": 0.12394386406068382,
                    "price_change_8h_percent": 0.21253761010973832,
                    "history_12h_price": 0.12275308532670935,
                    "price_change_12h_percent": 1.1846594785428937,
                    "history_24h_price": 0.1210786804346019,
                    "price_change_24h_percent": 2.583948669909736,
                    "unique_wallet_1m": 0,
                    "unique_wallet_history_1m": 1,
                    "unique_wallet_1m_change_percent": -100,
                    "unique_wallet_5m": 3,
                    "unique_wallet_history_5m": 3,
                    "unique_wallet_5m_change_percent": 0,
                    "unique_wallet_30m": 11,
                    "unique_wallet_history_30m": 14,
                    "unique_wallet_30m_change_percent": -21.428571428571427,
                    "unique_wallet_1h": 19,
                    "unique_wallet_history_1h": 8,
                    "unique_wallet_1h_change_percent": 137.5,
                    "unique_wallet_2h": 23,
                    "unique_wallet_history_2h": 45,
                    "unique_wallet_2h_change_percent": -48.888888888888886,
                    "unique_wallet_4h": 54,
                    "unique_wallet_history_4h": 48,
                    "unique_wallet_4h_change_percent": 12.5,
                    "unique_wallet_8h": 76,
                    "unique_wallet_history_8h": 33,
                    "unique_wallet_8h_change_percent": 130.3030303030303,
                    "unique_wallet_24h": 118,
                    "unique_wallet_history_24h": 120,
                    "unique_wallet_24h_change_percent": -1.6666666666666667,
                    "trade_1m": 0,
                    "trade_history_1m": 1,
                    "trade_1m_change_percent": -100,
                    "sell_1m": 0,
                    "sell_history_1m": 0,
                    "sell_1m_change_percent": null,
                    "buy_1m": 0,
                    "buy_history_1m": 1,
                    "buy_1m_change_percent": -100,
                    "volume_1m": 0,
                    "volume_1m_usd": 0,
                    "volume_history_1m": 79.862867037,
                    "volume_history_1m_usd": 9.919785,
                    "volume_1m_change_percent": -100,
                    "volume_buy_1m": 0,
                    "volume_buy_1m_usd": 0,
                    "volume_buy_history_1m": 79.862867037,
                    "volume_buy_history_1m_usd": 9.919785,
                    "volume_buy_1m_change_percent": -100,
                    "volume_sell_1m": 0,
                    "volume_sell_1m_usd": 0,
                    "volume_sell_history_1m": 0,
                    "volume_sell_history_1m_usd": 0,
                    "volume_sell_1m_change_percent": null,
                    "trade_5m": 3,
                    "trade_history_5m": 3,
                    "trade_5m_change_percent": 0,
                    "sell_5m": 0,
                    "sell_history_5m": 2,
                    "sell_5m_change_percent": -100,
                    "buy_5m": 3,
                    "buy_history_5m": 1,
                    "buy_5m_change_percent": 200,
                    "volume_5m": 518.532281063,
                    "volume_5m_usd": 64.394683,
                    "volume_history_5m": 544.339203843,
                    "volume_history_5m_usd": 67.282128,
                    "volume_5m_change_percent": -4.740963465024143,
                    "volume_buy_5m": 518.532281063,
                    "volume_buy_5m_usd": 64.394683,
                    "volume_buy_history_5m": 135.449365223,
                    "volume_buy_history_5m_usd": 16.816176,
                    "volume_buy_5m_change_percent": 282.8237070061592,
                    "volume_sell_5m": 0,
                    "volume_sell_5m_usd": 0,
                    "volume_sell_history_5m": 408.88983862,
                    "volume_sell_history_5m_usd": 50.465952,
                    "volume_sell_5m_change_percent": -100,
                    "trade_30m": 24,
                    "trade_history_30m": 49,
                    "trade_30m_change_percent": -51.02040816326531,
                    "sell_30m": 12,
                    "sell_history_30m": 30,
                    "sell_30m_change_percent": -60,
                    "buy_30m": 12,
                    "buy_history_30m": 19,
                    "buy_30m_change_percent": -36.84210526315789,
                    "volume_30m": 32306.264221494,
                    "volume_30m_usd": 4030.288435322418,
                    "volume_history_30m": 59684.326486043996,
                    "volume_history_30m_usd": 7469.499588545696,
                    "volume_30m_change_percent": -45.87144377167734,
                    "volume_buy_30m": 16283.755177089,
                    "volume_buy_30m_usd": 2040.2546082400142,
                    "volume_buy_history_30m": 18300.105601477,
                    "volume_buy_history_30m_usd": 2295.4225363394503,
                    "volume_buy_30m_change_percent": -11.018244748408776,
                    "volume_sell_30m": 16022.509044405,
                    "volume_sell_30m_usd": 1990.033827082404,
                    "volume_sell_history_30m": 41384.220884566996,
                    "volume_sell_history_30m_usd": 5174.077052206246,
                    "volume_sell_30m_change_percent": -61.283531012709936,
                    "trade_1h": 69,
                    "trade_history_1h": 17,
                    "trade_1h_change_percent": 305.88235294117646,
                    "sell_1h": 42,
                    "sell_history_1h": 7,
                    "sell_1h_change_percent": 500,
                    "buy_1h": 27,
                    "buy_history_1h": 10,
                    "buy_1h_change_percent": 170,
                    "volume_1h": 82384.74373696599,
                    "volume_1h_usd": 10292.237858328092,
                    "volume_history_1h": 3564.2949645470003,
                    "volume_history_1h_usd": 454.32065689977003,
                    "volume_1h_change_percent": 2211.38961720124,
                    "volume_buy_1h": 24978.013807993997,
                    "volume_buy_1h_usd": 3128.126979039443,
                    "volume_buy_history_1h": 2523.265494998,
                    "volume_buy_history_1h_usd": 322.2482526219116,
                    "volume_buy_1h_change_percent": 889.9082699584808,
                    "volume_sell_1h": 57406.729928971996,
                    "volume_sell_1h_usd": 7164.110879288649,
                    "volume_sell_history_1h": 1041.0294695490002,
                    "volume_sell_history_1h_usd": 132.07240427785842,
                    "volume_sell_1h_change_percent": 5414.4192943780945,
                    "trade_2h": 86,
                    "trade_history_2h": 270,
                    "trade_2h_change_percent": -68.14814814814815,
                    "sell_2h": 49,
                    "sell_history_2h": 139,
                    "sell_2h_change_percent": -64.74820143884892,
                    "buy_2h": 37,
                    "buy_history_2h": 131,
                    "buy_2h_change_percent": -71.7557251908397,
                    "volume_2h": 85949.038701513,
                    "volume_2h_usd": 10746.558515227862,
                    "volume_history_2h": 121116.066490666,
                    "volume_history_2h_usd": 15340.380299133165,
                    "volume_2h_change_percent": -29.035807393780576,
                    "volume_buy_2h": 27501.279302991996,
                    "volume_buy_2h_usd": 3450.3752316613545,
                    "volume_buy_history_2h": 59906.41115064099,
                    "volume_buy_history_2h_usd": 7619.477501910608,
                    "volume_buy_2h_change_percent": -54.092927994239005,
                    "volume_sell_2h": 58447.759398521,
                    "volume_sell_2h_usd": 7296.183283566507,
                    "volume_sell_history_2h": 61209.655340025005,
                    "volume_sell_history_2h_usd": 7720.902797222558,
                    "volume_sell_2h_change_percent": -4.512189990552036,
                    "trade_4h": 398,
                    "trade_history_4h": 298,
                    "trade_4h_change_percent": 33.557046979865774,
                    "sell_4h": 207,
                    "sell_history_4h": 170,
                    "sell_4h_change_percent": 21.764705882352942,
                    "buy_4h": 191,
                    "buy_history_4h": 128,
                    "buy_4h_change_percent": 49.21875,
                    "volume_4h": 227158.78789799998,
                    "volume_4h_usd": 28606.589461036434,
                    "volume_history_4h": 182988.70116253902,
                    "volume_history_4h_usd": 22853.481010176198,
                    "volume_4h_change_percent": 24.138149762715162,
                    "volume_buy_4h": 102252.90269332401,
                    "volume_buy_4h_usd": 12933.95725902829,
                    "volume_buy_history_4h": 83234.866083524,
                    "volume_buy_history_4h_usd": 10419.548846173395,
                    "volume_buy_4h_change_percent": 22.84864204709107,
                    "volume_sell_4h": 124905.88520467599,
                    "volume_sell_4h_usd": 15672.632202008142,
                    "volume_sell_history_4h": 99753.835079015,
                    "volume_sell_history_4h_usd": 12433.932164002801,
                    "volume_sell_4h_change_percent": 25.214118440396856,
                    "trade_8h": 567,
                    "trade_history_8h": 137,
                    "trade_8h_change_percent": 313.8686131386861,
                    "sell_8h": 311,
                    "sell_history_8h": 63,
                    "sell_8h_change_percent": 393.6507936507936,
                    "buy_8h": 256,
                    "buy_history_8h": 74,
                    "buy_8h_change_percent": 245.94594594594597,
                    "volume_8h": 354287.212231586,
                    "volume_8h_usd": 44429.920860648606,
                    "volume_history_8h": 168314.641242657,
                    "volume_history_8h_usd": 20661.27679053176,
                    "volume_8h_change_percent": 110.49102420080898,
                    "volume_buy_8h": 160253.477232887,
                    "volume_buy_8h_usd": 20180.43414548757,
                    "volume_buy_history_8h": 88467.665032377,
                    "volume_buy_history_8h_usd": 10904.625741904958,
                    "volume_buy_8h_change_percent": 81.14355925889775,
                    "volume_sell_8h": 194033.73499869902,
                    "volume_sell_8h_usd": 24249.486715161038,
                    "volume_sell_history_8h": 79846.97621028,
                    "volume_sell_history_8h_usd": 9756.651048626803,
                    "volume_sell_8h_change_percent": 143.00699188370504,
                    "trade_24h": 1134,
                    "trade_history_24h": 875,
                    "trade_24h_change_percent": 29.599999999999998,
                    "sell_24h": 612,
                    "sell_history_24h": 461,
                    "sell_24h_change_percent": 32.75488069414317,
                    "buy_24h": 522,
                    "buy_history_24h": 414,
                    "buy_24h_change_percent": 26.08695652173913,
                    "volume_24h": 838772.492908917,
                    "volume_24h_usd": 103602.6151341583,
                    "volume_history_24h": 1065654.20492195,
                    "volume_history_24h_usd": 123913.53811871028,
                    "volume_24h_change_percent": -21.29036895506362,
                    "volume_buy_24h": 392626.32190174906,
                    "volume_buy_24h_usd": 48695.964598773375,
                    "volume_buy_history_24h": 487588.68761235796,
                    "volume_buy_history_24h_usd": 56983.39472233019,
                    "volume_buy_24h_change_percent": -19.475916509799287,
                    "volume_sell_24h": 446146.17100716796,
                    "volume_sell_24h_usd": 54906.65053538493,
                    "volume_sell_history_24h": 578065.517309592,
                    "volume_sell_history_24h_usd": 66930.1433963801,
                    "volume_sell_24h_change_percent": -22.82082953440943
                  }
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
  "operationId": "get-defi-v3-token-trade-data-multiple",
  "x-mint": {
    "href": "/data-api/stats/get-defi-v3-token-trade-data-multiple"
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
