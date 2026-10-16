---
title: "Token - Trade Data (Single)"
description: "Retrieve trade data of a specified token."
hidden: false
metadata:
  title: Birdeye Data API | Token - Trade Data (Single)
  description: Retrieve trade data of a specified token.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/token/trade-data/single"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Focused trading-activity stats for one token.</strong></p>
  <ul>
    <li>Returns buy/sell counts, trade counts, unique wallets, volume, and change metrics across requested timeframes.</li>
    <li>Use <code>frames</code> to request one or more custom timeframes.</li>
    <li>Use this endpoint when you need timeframe-based market activity around the current price, not just the current market snapshot.</li>
    <li>Use <code>ui_amount_mode=scaled</code> for Solana Token-2022 scaled UI amounts when the token supports scaled UI amount extension.</li>
  </ul>
  <p><strong>Reading the numbers.</strong> Buy/sell counts and volumes describe activity inside each timeframe. Change-percent fields compare the current timeframe window with the previous matching window, which makes this endpoint useful for reading recent momentum and participation around price moves.</p>
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
    <li>This endpoint consumes <code>10 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Analyze buy/sell pressure and trading activity for a single token.</li>
    <li>Build momentum indicators using trade counts, unique wallets, and volume over selected frames.</li>
    <li>Study how participation and turnover changed across recent windows before or after a price move.</li>
    <li>Trigger alerts when trading activity, volume, or buy/sell imbalance changes quickly.</li>
    <li>Combine with market data to explain whether valuation changes are backed by real activity.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Provide <code>address</code> as the token address and set <code>x-chain</code>.</li>
    <li>Use <code>frames=5m,1h,24h</code> style requests for the horizons your product displays.</li>
    <li>Use shorter frames when you care about recent momentum and reaction, and longer frames when you care about broader context.</li>
    <li>Set <code>ui_amount_mode=raw</code> or <code>scaled</code> consistently with your Token-2022 amount handling.</li>
    <li>Use Token Overview when you need both market fundamentals and trade activity in one payload.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Pair trade counts with unique-wallet counts to separate broad market participation from repeated activity by a smaller wallet set.</li>
    <li>Compare buy and sell volume together instead of reading total volume alone.</li>
    <li>Use shorter frames for alerts and longer frames for ranking or trend summaries.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/token/trade-data/single

```json
{
  "tags": [
    "Stats"
  ],
  "summary": "Token - Trade Data (Single)",
  "description": "Retrieve trade data of a specified token.",
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
        "wsol": {
          "value": "So11111111111111111111111111111111111111112"
        },
        "solana": {
          "value": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
        },
        "ethereum": {
          "value": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce"
        },
        "solana_scaled_ui": {
          "value": "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh"
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
      "description": "JSON object containing trade data of a specific token",
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
              }
            }
          },
          "examples": {
            "SolanaScaledUIAmount": {
              "value": {
                "success": true,
                "data": {
                  "address": "So11111111111111111111111111111111111111112",
                  "holder": 3498897,
                  "market": 189737,
                  "last_trade_unix_time": 1755058915,
                  "last_trade_human_time": "2025-08-13T04:21:55",
                  "price": 199.57308084999997,
                  "history_1m_price": 200.0657028658876,
                  "price_change_1m_percent": -0.246230117821773,
                  "history_5m_price": 199.04185542048768,
                  "price_change_5m_percent": 0.2668913171001369,
                  "history_30m_price": 198.08683911027157,
                  "price_change_30m_percent": 0.750298074523282,
                  "history_1h_price": 198.6762767605752,
                  "price_change_1h_percent": 0.4513896193582795,
                  "history_2h_price": 194.219974488669,
                  "price_change_2h_percent": 2.75620794175486,
                  "history_4h_price": 191.95599557869642,
                  "price_change_4h_percent": 3.968141369244581,
                  "history_6h_price": 192.36297986748752,
                  "price_change_6h_percent": 3.748174928190051,
                  "history_8h_price": 190.83016849547622,
                  "price_change_8h_percent": 4.581514769626696,
                  "history_12h_price": 181.29476421508093,
                  "price_change_12h_percent": 10.082098462167592,
                  "history_24h_price": 175.69158133703775,
                  "price_change_24h_percent": 13.592853642286466,
                  "unique_wallet_1m": 10535,
                  "unique_wallet_history_1m": 10512,
                  "unique_wallet_1m_change_percent": 0.21879756468797565,
                  "unique_wallet_5m": 30484,
                  "unique_wallet_history_5m": 31329,
                  "unique_wallet_5m_change_percent": -2.697181525104536,
                  "unique_wallet_30m": 84841,
                  "unique_wallet_history_30m": 91310,
                  "unique_wallet_30m_change_percent": -7.084656664111269,
                  "unique_wallet_1h": 141012,
                  "unique_wallet_history_1h": 139362,
                  "unique_wallet_1h_change_percent": 1.1839669350325053,
                  "unique_wallet_2h": 229096,
                  "unique_wallet_history_2h": 256234,
                  "unique_wallet_2h_change_percent": -10.59110032236159,
                  "unique_wallet_4h": 398071,
                  "unique_wallet_history_4h": 319789,
                  "unique_wallet_4h_change_percent": 24.47926601602932,
                  "unique_wallet_8h": 616389,
                  "unique_wallet_history_8h": 598174,
                  "unique_wallet_8h_change_percent": 3.0451005894605916,
                  "unique_wallet_24h": 1312446,
                  "unique_wallet_history_24h": 1595218,
                  "unique_wallet_24h_change_percent": -17.72622926772391,
                  "trade_1m": 25063,
                  "trade_history_1m": 25516,
                  "trade_1m_change_percent": -1.7753566389716258,
                  "sell_1m": 14783,
                  "sell_history_1m": 14281,
                  "sell_1m_change_percent": 3.5151600028009247,
                  "buy_1m": 10280,
                  "buy_history_1m": 11235,
                  "buy_1m_change_percent": -8.500222518914107,
                  "volume_1m": 28014.353663877002,
                  "volume_1m_usd": 5594914.331353994,
                  "volume_history_1m": 30288.275618175,
                  "volume_history_1m_usd": 6053381.114696328,
                  "volume_1m_change_percent": -7.507597933153688,
                  "volume_buy_1m": 13316.670472043998,
                  "volume_buy_1m_usd": 2659745.040809564,
                  "volume_buy_history_1m": 15438.603833983001,
                  "volume_buy_history_1m_usd": 3085880.865821625,
                  "volume_buy_1m_change_percent": -13.74433455743107,
                  "volume_sell_1m": 14697.683191833004,
                  "volume_sell_1m_usd": 2935169.29054443,
                  "volume_sell_history_1m": 14849.671784191998,
                  "volume_sell_history_1m_usd": 2967500.248874703,
                  "volume_sell_1m_change_percent": -1.0235148262387246,
                  "trade_5m": 125589,
                  "trade_history_5m": 133103,
                  "trade_5m_change_percent": -5.64525217312908,
                  "sell_5m": 72259,
                  "sell_history_5m": 75307,
                  "sell_5m_change_percent": -4.047432509594062,
                  "buy_5m": 53330,
                  "buy_history_5m": 57796,
                  "buy_5m_change_percent": -7.727178351443007,
                  "volume_5m": 138839.93120513,
                  "volume_5m_usd": 27706918.700082216,
                  "volume_history_5m": 168486.357245985,
                  "volume_history_5m_usd": 33501205.892243676,
                  "volume_5m_change_percent": -17.595742780272776,
                  "volume_buy_5m": 71016.083050991,
                  "volume_buy_5m_usd": 14172671.643556839,
                  "volume_buy_history_5m": 86636.89562773002,
                  "volume_buy_history_5m_usd": 17227812.75124113,
                  "volume_buy_5m_change_percent": -18.030208104247027,
                  "volume_sell_5m": 67823.84815413899,
                  "volume_sell_5m_usd": 13534247.056525378,
                  "volume_sell_history_5m": 81849.46161825501,
                  "volume_sell_history_5m_usd": 16273393.141002549,
                  "volume_sell_5m_change_percent": -17.13586526632432,
                  "trade_30m": 742916,
                  "trade_history_30m": 726567,
                  "trade_30m_change_percent": 2.2501710096935317,
                  "sell_30m": 429567,
                  "sell_history_30m": 423206,
                  "sell_30m_change_percent": 1.5030505238583574,
                  "buy_30m": 313349,
                  "buy_history_30m": 303361,
                  "buy_30m_change_percent": 3.2924469526405833,
                  "volume_30m": 999257.254695175,
                  "volume_30m_usd": 198262635.32251042,
                  "volume_history_30m": 1007682.2970747652,
                  "volume_history_30m_usd": 200156959.86425337,
                  "volume_30m_change_percent": -0.8360812136967729,
                  "volume_buy_30m": 496626.18523781083,
                  "volume_buy_30m_usd": 98550796.11048704,
                  "volume_buy_history_30m": 479675.0794320691,
                  "volume_buy_history_30m_usd": 95280522.80842383,
                  "volume_buy_30m_change_percent": 3.5338725175824632,
                  "volume_sell_30m": 502631.0694573641,
                  "volume_sell_30m_usd": 99711839.21202336,
                  "volume_sell_history_30m": 528007.2176426961,
                  "volume_sell_history_30m_usd": 104876437.05582954,
                  "volume_sell_30m_change_percent": -4.8060229741980764,
                  "trade_1h": 1365500,
                  "trade_history_1h": 1460948,
                  "trade_1h_change_percent": -6.533292081579906,
                  "sell_1h": 790911,
                  "sell_history_1h": 833994,
                  "sell_1h_change_percent": -5.165864502622321,
                  "buy_1h": 574589,
                  "buy_history_1h": 626954,
                  "buy_1h_change_percent": -8.35228740864561,
                  "volume_1h": 1869915.2789910787,
                  "volume_1h_usd": 371272087.7773213,
                  "volume_history_1h": 2215504.2512326725,
                  "volume_history_1h_usd": 436450282.08621264,
                  "volume_1h_change_percent": -15.598659855846062,
                  "volume_buy_1h": 911052.9765842077,
                  "volume_buy_1h_usd": 180903043.40620133,
                  "volume_buy_history_1h": 1115539.1923768108,
                  "volume_buy_history_1h_usd": 219688244.87947023,
                  "volume_buy_1h_change_percent": -18.330706548903663,
                  "volume_sell_1h": 958862.302406871,
                  "volume_sell_1h_usd": 190369044.37111995,
                  "volume_sell_history_1h": 1099965.058855862,
                  "volume_sell_history_1h_usd": 216762037.2067424,
                  "volume_sell_1h_change_percent": -12.827930788616154,
                  "trade_2h": 2721996,
                  "trade_history_2h": 2737323,
                  "trade_2h_change_percent": -0.5599266144331524,
                  "sell_2h": 1565257,
                  "sell_history_2h": 1520437,
                  "sell_2h_change_percent": 2.9478367074729173,
                  "buy_2h": 1156739,
                  "buy_history_2h": 1216886,
                  "buy_2h_change_percent": -4.942698001291822,
                  "volume_2h": 3881149.9454533085,
                  "volume_2h_usd": 767124563.4685572,
                  "volume_history_2h": 4109861.943241723,
                  "volume_history_2h_usd": 795392999.4275689,
                  "volume_2h_change_percent": -5.564955732016972,
                  "volume_buy_2h": 1946568.1169466476,
                  "volume_buy_2h_usd": 384689701.5502614,
                  "volume_buy_history_2h": 2184514.4664095147,
                  "volume_buy_history_2h_usd": 422774489.6633253,
                  "volume_buy_2h_change_percent": -10.892413537272542,
                  "volume_sell_2h": 1934581.8285066609,
                  "volume_sell_2h_usd": 382434861.91829586,
                  "volume_sell_history_2h": 1925347.4768322085,
                  "volume_sell_history_2h_usd": 372618509.7642436,
                  "volume_sell_2h_change_percent": 0.47962000550912426,
                  "trade_4h": 5720496,
                  "trade_history_4h": 4738200,
                  "trade_4h_change_percent": 20.73141699379511,
                  "sell_4h": 3227114,
                  "sell_history_4h": 2598002,
                  "sell_4h_change_percent": 24.215223852791492,
                  "buy_4h": 2493382,
                  "buy_history_4h": 2140198,
                  "buy_4h_change_percent": 16.502398376225003,
                  "volume_4h": 8359034.497538514,
                  "volume_4h_usd": 1632746418.2793252,
                  "volume_history_4h": 5827559.3867111625,
                  "volume_history_4h_usd": 1117139333.4616933,
                  "volume_4h_change_percent": 43.439713657830495,
                  "volume_buy_4h": 4308151.652644951,
                  "volume_buy_4h_usd": 841240490.7863214,
                  "volume_buy_history_4h": 2923792.0279110167,
                  "volume_buy_history_4h_usd": 560556194.860776,
                  "volume_buy_4h_change_percent": 47.34808808282536,
                  "volume_sell_4h": 4050882.844893563,
                  "volume_sell_4h_usd": 791505927.4930038,
                  "volume_sell_history_4h": 2903767.358800146,
                  "volume_sell_history_4h_usd": 556583138.6009173,
                  "volume_sell_4h_change_percent": 39.50438669327189,
                  "trade_8h": 9875698,
                  "trade_history_8h": 10453618,
                  "trade_8h_change_percent": -5.528420877824309,
                  "sell_8h": 5503762,
                  "sell_history_8h": 5773818,
                  "sell_8h_change_percent": -4.677251690302673,
                  "buy_8h": 4371936,
                  "buy_history_8h": 4679800,
                  "buy_8h_change_percent": -6.578571733834779,
                  "volume_8h": 13272186.797145639,
                  "volume_8h_usd": 2574392837.701419,
                  "volume_history_8h": 14155274.76815367,
                  "volume_history_8h_usd": 2581042172.9211245,
                  "volume_8h_change_percent": -6.238578801697224,
                  "volume_buy_8h": 6738594.148704853,
                  "volume_buy_8h_usd": 1307097533.3850877,
                  "volume_buy_history_8h": 7280589.108363739,
                  "volume_buy_history_8h_usd": 1327749998.8559382,
                  "volume_buy_8h_change_percent": -7.444383299096738,
                  "volume_sell_8h": 6533592.648440785,
                  "volume_sell_8h_usd": 1267295304.3163311,
                  "volume_sell_history_8h": 6874685.65978993,
                  "volume_sell_history_8h_usd": 1253292174.0651865,
                  "volume_sell_8h_change_percent": -4.961579746754095,
                  "trade_24h": 30786907,
                  "trade_history_24h": 33058246,
                  "trade_24h_change_percent": -6.870718428315888,
                  "sell_24h": 17145270,
                  "sell_history_24h": 18482135,
                  "sell_24h_change_percent": -7.233282302071703,
                  "buy_24h": 13641637,
                  "buy_history_24h": 14576111,
                  "buy_24h_change_percent": -6.410996732942004,
                  "volume_24h": 43327455.84829509,
                  "volume_24h_usd": 7930210206.693316,
                  "volume_history_24h": 49475082.60178679,
                  "volume_history_24h_usd": 8868558906.245562,
                  "volume_24h_change_percent": -12.425702859300893,
                  "volume_buy_24h": 21945096.556108054,
                  "volume_buy_24h_usd": 4018154448.1608233,
                  "volume_buy_history_24h": 24403487.274207145,
                  "volume_buy_history_24h_usd": 4374621039.616789,
                  "volume_buy_24h_change_percent": -10.073932018303982,
                  "volume_sell_24h": 21382359.29218704,
                  "volume_sell_24h_usd": 3912055758.532493,
                  "volume_sell_history_24h": 25071595.327579647,
                  "volume_sell_history_24h_usd": 4493937866.628773,
                  "volume_sell_24h_change_percent": -14.714803693940917,
                  "is_scaled_ui_token": false,
                  "multiplier": null
                }
              }
            },
            "TokenTradeDataSingle": {
              "value": {
                "data": {
                  "address": "So11111111111111111111111111111111111111112",
                  "holder": 1760227,
                  "market": 196569,
                  "last_trade_unix_time": 1746802135,
                  "last_trade_human_time": "2025-05-09T14:48:55",
                  "price": 167.80896431930182,
                  "history_1m_price": 167.97995938671679,
                  "price_change_1m_percent": -0.10179492127468956,
                  "history_5m_price": 168.74640381986768,
                  "price_change_5m_percent": -0.5555315428034545,
                  "history_30m_price": 171.3541322895,
                  "price_change_30m_percent": -2.068913029893365,
                  "history_1h_price": 173.01102576022566,
                  "price_change_1h_percent": -3.006780300888644,
                  "history_2h_price": 172.41071095217168,
                  "price_change_2h_percent": -2.669060760468895,
                  "history_4h_price": 170.00055611750162,
                  "price_change_4h_percent": -1.289167428772999,
                  "history_6h_price": 167.23388621052743,
                  "price_change_6h_percent": 0.34387654428507225,
                  "history_8h_price": 163.69124737148164,
                  "price_change_8h_percent": 2.515538865969675,
                  "history_12h_price": 162.88072815150505,
                  "price_change_12h_percent": 3.0256717438128855,
                  "history_24h_price": 157.75046659685455,
                  "price_change_24h_percent": 6.376207905712674,
                  "unique_wallet_1m": 8192,
                  "unique_wallet_history_1m": 8475,
                  "unique_wallet_1m_change_percent": -3.3392330383480826,
                  "unique_wallet_5m": 26830,
                  "unique_wallet_history_5m": 27305,
                  "unique_wallet_5m_change_percent": -1.7396081303790514,
                  "unique_wallet_30m": 99015,
                  "unique_wallet_history_30m": 98887,
                  "unique_wallet_30m_change_percent": 0.12944067470951692,
                  "unique_wallet_1h": 166549,
                  "unique_wallet_history_1h": 145186,
                  "unique_wallet_1h_change_percent": 14.714228644635158,
                  "unique_wallet_2h": 265703,
                  "unique_wallet_history_2h": 181521,
                  "unique_wallet_2h_change_percent": 46.375901410856045,
                  "unique_wallet_4h": 382828,
                  "unique_wallet_history_4h": 275988,
                  "unique_wallet_4h_change_percent": 38.71182805049495,
                  "unique_wallet_8h": 566015,
                  "unique_wallet_history_8h": 593685,
                  "unique_wallet_8h_change_percent": -4.660720752587651,
                  "unique_wallet_24h": 1666080,
                  "unique_wallet_history_24h": 1404422,
                  "unique_wallet_24h_change_percent": 18.63100976771939,
                  "trade_1m": 21298,
                  "trade_history_1m": 23504,
                  "trade_1m_change_percent": -9.385636487406398,
                  "sell_1m": 11841,
                  "sell_history_1m": 13283,
                  "sell_1m_change_percent": -10.855981329518933,
                  "buy_1m": 9457,
                  "buy_history_1m": 10221,
                  "buy_1m_change_percent": -7.474806770374719,
                  "volume_1m": 29410.160852206005,
                  "volume_1m_usd": 5010526.161090311,
                  "volume_history_1m": 34453.924082532,
                  "volume_history_1m_usd": 5804615.536877414,
                  "volume_1m_change_percent": -14.639154652584734,
                  "volume_buy_1m": 13048.077415550002,
                  "volume_buy_1m_usd": 2240126.102087374,
                  "volume_buy_history_1m": 14560.112629287,
                  "volume_buy_history_1m_usd": 2451792.1698234,
                  "volume_buy_1m_change_percent": -10.384776905472611,
                  "volume_sell_1m": 16362.083436656001,
                  "volume_sell_1m_usd": 2770400.0590029373,
                  "volume_sell_history_1m": 19893.811453245,
                  "volume_sell_history_1m_usd": 3352823.3670540145,
                  "volume_sell_1m_change_percent": -17.752897803869146,
                  "trade_5m": 118495,
                  "trade_history_5m": 127530,
                  "trade_5m_change_percent": -7.084607543323139,
                  "sell_5m": 67163,
                  "sell_history_5m": 71454,
                  "sell_5m_change_percent": -6.005262126682901,
                  "buy_5m": 51332,
                  "buy_history_5m": 56076,
                  "buy_5m_change_percent": -8.459947214494616,
                  "volume_5m": 157979.91831452603,
                  "volume_5m_usd": 26898374.50699684,
                  "volume_history_5m": 203644.55615971796,
                  "volume_history_5m_usd": 34760962.82863176,
                  "volume_5m_change_percent": -22.423696810916592,
                  "volume_buy_5m": 76418.93760057601,
                  "volume_buy_5m_usd": 13042984.023109829,
                  "volume_buy_history_5m": 101159.86561724,
                  "volume_buy_history_5m_usd": 17268939.602353815,
                  "volume_buy_5m_change_percent": -24.45725670522001,
                  "volume_sell_5m": 81560.98071395,
                  "volume_sell_5m_usd": 13855390.48388701,
                  "volume_sell_history_5m": 102484.69054247798,
                  "volume_sell_history_5m_usd": 17492023.226277944,
                  "volume_sell_5m_change_percent": -20.41642485113959,
                  "trade_30m": 803215,
                  "trade_history_30m": 797963,
                  "trade_30m_change_percent": 0.6581758803353038,
                  "sell_30m": 451062,
                  "sell_history_30m": 446408,
                  "sell_30m_change_percent": 1.042544040429383,
                  "buy_30m": 352153,
                  "buy_history_30m": 351555,
                  "buy_30m_change_percent": 0.17010140660778542,
                  "volume_30m": 1272891.865948019,
                  "volume_30m_usd": 218072556.17494345,
                  "volume_history_30m": 1014809.626640769,
                  "volume_history_30m_usd": 176963012.98413345,
                  "volume_30m_change_percent": 25.43159155491617,
                  "volume_buy_30m": 626378.2635002071,
                  "volume_buy_30m_usd": 107175212.0302041,
                  "volume_buy_history_30m": 515256.87016754213,
                  "volume_buy_history_30m_usd": 89409857.07236338,
                  "volume_buy_30m_change_percent": 21.5662128476875,
                  "volume_sell_30m": 646513.602447812,
                  "volume_sell_30m_usd": 110897344.14473933,
                  "volume_sell_history_30m": 499552.7564732268,
                  "volume_sell_history_30m_usd": 87553155.91177008,
                  "volume_sell_30m_change_percent": 29.418483647674844,
                  "trade_1h": 1480890,
                  "trade_history_1h": 1320699,
                  "trade_1h_change_percent": 12.129258824304403,
                  "sell_1h": 829781,
                  "sell_history_1h": 721102,
                  "sell_1h_change_percent": 15.071238188217478,
                  "buy_1h": 651109,
                  "buy_history_1h": 599597,
                  "buy_1h_change_percent": 8.591103691312666,
                  "volume_1h": 2127394.755906512,
                  "volume_1h_usd": 367404009.05549693,
                  "volume_history_1h": 1783376.1195459762,
                  "volume_history_1h_usd": 315517691.7376682,
                  "volume_1h_change_percent": 19.290301837624607,
                  "volume_buy_1h": 1056165.3743872764,
                  "volume_buy_1h_usd": 181874042.54138386,
                  "volume_buy_history_1h": 870775.027542904,
                  "volume_buy_history_1h_usd": 151538134.971131,
                  "volume_buy_1h_change_percent": 21.290269125826295,
                  "volume_sell_1h": 1071229.381519236,
                  "volume_sell_1h_usd": 185529966.51411304,
                  "volume_sell_history_1h": 912601.092003072,
                  "volume_sell_history_1h_usd": 163979556.76653722,
                  "volume_sell_1h_change_percent": 17.381996461125198,
                  "trade_2h": 2684004,
                  "trade_history_2h": 2273625,
                  "trade_2h_change_percent": 18.049546429160483,
                  "sell_2h": 1486918,
                  "sell_history_2h": 1214967,
                  "sell_2h_change_percent": 22.38340629827806,
                  "buy_2h": 1197086,
                  "buy_history_2h": 1058658,
                  "buy_2h_change_percent": 13.07579973891474,
                  "volume_2h": 3750042.2737956005,
                  "volume_2h_usd": 654641195.9178548,
                  "volume_history_2h": 4986668.953994334,
                  "volume_history_2h_usd": 876699150.961254,
                  "volume_2h_change_percent": -24.798651998107722,
                  "volume_buy_2h": 1840763.0535678302,
                  "volume_buy_2h_usd": 318406106.5448333,
                  "volume_buy_history_2h": 2552431.93778671,
                  "volume_buy_history_2h_usd": 447965734.71457183,
                  "volume_buy_2h_change_percent": -27.881992608037535,
                  "volume_sell_2h": 1909279.2202277703,
                  "volume_sell_2h_usd": 336235089.3730215,
                  "volume_sell_history_2h": 2434237.0162076233,
                  "volume_sell_history_2h_usd": 428733416.24668217,
                  "volume_sell_2h_change_percent": -21.565599096742922,
                  "trade_4h": 5106426,
                  "trade_history_4h": 4712834,
                  "trade_4h_change_percent": 8.35149296580359,
                  "sell_4h": 2780678,
                  "sell_history_4h": 2530641,
                  "sell_4h_change_percent": 9.880382085013244,
                  "buy_4h": 2325748,
                  "buy_history_4h": 2182193,
                  "buy_4h_change_percent": 6.578474039647272,
                  "volume_4h": 8958103.63250968,
                  "volume_4h_usd": 1568749541.8052683,
                  "volume_history_4h": 8303593.777521941,
                  "volume_history_4h_usd": 1399553943.2157688,
                  "volume_4h_change_percent": 7.88224800639352,
                  "volume_buy_4h": 4513247.631324249,
                  "volume_buy_4h_usd": 786402668.3600514,
                  "volume_buy_history_4h": 4305672.358770635,
                  "volume_buy_history_4h_usd": 725954295.8032504,
                  "volume_buy_4h_change_percent": 4.8209723187781455,
                  "volume_sell_4h": 4444856.001185431,
                  "volume_sell_4h_usd": 782346873.4452169,
                  "volume_sell_history_4h": 3997921.418751306,
                  "volume_sell_history_4h_usd": 673599647.4125183,
                  "volume_sell_4h_change_percent": 11.179173766094655,
                  "trade_8h": 9304476,
                  "trade_history_8h": 9379085,
                  "trade_8h_change_percent": -0.7954827149983181,
                  "sell_8h": 5037645,
                  "sell_history_8h": 5093401,
                  "sell_8h_change_percent": -1.0946713207933167,
                  "buy_8h": 4266831,
                  "buy_history_8h": 4285684,
                  "buy_8h_change_percent": -0.4399064420055235,
                  "volume_8h": 15927689.150175609,
                  "volume_8h_usd": 2736121445.11934,
                  "volume_history_8h": 9435031.81369001,
                  "volume_history_8h_usd": 1548030762.8614295,
                  "volume_8h_change_percent": 68.81436612714866,
                  "volume_buy_8h": 8058727.498173612,
                  "volume_buy_8h_usd": 1380215916.0956888,
                  "volume_buy_history_8h": 4725061.174831935,
                  "volume_buy_history_8h_usd": 774623834.5994598,
                  "volume_buy_8h_change_percent": 70.55287116912834,
                  "volume_sell_8h": 7868961.652001996,
                  "volume_sell_8h_usd": 1355905529.023651,
                  "volume_sell_history_8h": 4709970.638858074,
                  "volume_sell_history_8h_usd": 773406928.2619697,
                  "volume_sell_8h_change_percent": 67.0702909925106,
                  "trade_24h": 29319491,
                  "trade_history_24h": 24668611,
                  "trade_24h_change_percent": 18.853432809816493,
                  "sell_24h": 15990717,
                  "sell_history_24h": 13552421,
                  "sell_24h_change_percent": 17.991589842139643,
                  "buy_24h": 13328774,
                  "buy_history_24h": 11116190,
                  "buy_24h_change_percent": 19.904157809465293,
                  "volume_24h": 38764233.754803956,
                  "volume_24h_usd": 6454681445.618767,
                  "volume_history_24h": 27529677.595021047,
                  "volume_history_24h_usd": 4160810504.560139,
                  "volume_24h_change_percent": 40.808891135778374,
                  "volume_buy_24h": 19568048.045654222,
                  "volume_buy_24h_usd": 3252367661.8921504,
                  "volume_buy_history_24h": 13821503.465453008,
                  "volume_buy_history_24h_usd": 2090095440.02877,
                  "volume_buy_24h_change_percent": 41.5768414381602,
                  "volume_sell_24h": 19196185.70914973,
                  "volume_sell_24h_usd": 3202313783.7266164,
                  "volume_sell_history_24h": 13708174.129568037,
                  "volume_sell_history_24h_usd": 2070715064.5313692,
                  "volume_sell_24h_change_percent": 40.03459197198444
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
  "operationId": "get-defi-v3-token-trade-data-single",
  "x-mint": {
    "href": "/data-api/stats/get-defi-v3-token-trade-data-single"
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
