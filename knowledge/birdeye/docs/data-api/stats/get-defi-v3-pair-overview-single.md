---
title: "Pair - Pair Overview (Single)"
description: "Retrieve stats of a specified pair."
hidden: false
metadata:
  title: Birdeye Data API | Pair - Pair Overview (Single)
  description: Retrieve stats of a specified pair.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/pair/overview/single"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Market snapshot for one liquidity pair.</strong></p>
  <ul>
    <li>Returns pair-level stats such as liquidity, price, volume, trades, unique wallets, and base/quote activity when indexed.</li>
    <li>Use <code>address</code> as the pair address.</li>
    <li><code>ui_amount_mode=scaled</code> applies Solana Token-2022 scaled UI amount when supported by the token side of the pair.</li>
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
  <p><strong>Solana, Fogo</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>15 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Build pair profile pages with liquidity, trade, wallet, and volume activity.</li>
    <li>Compare activity quality across pools for the same token.</li>
    <li>Monitor a specific pool for liquidity movement, trading activity, and market participation.</li>
    <li>Feed DEX analytics panels that reason at pair level instead of token level.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> to a supported SVM chain.</li>
    <li>Provide <code>address</code> as the pair address.</li>
    <li>Use this endpoint when the pair is already known; use token market list endpoints when discovering pairs for a token.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use pair overview when pool-level liquidity and trading behavior matter more than aggregate token stats.</li>
    <li>Compare pair overview with token overview to understand whether one pool dominates token activity.</li>
    <li>Keep pair-level analytics separate from token-level analytics to avoid mixing pool-specific and aggregate signals.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/pair/overview/single

```json
{
  "tags": [
    "Stats"
  ],
  "summary": "Pair - Pair Overview (Single)",
  "description": "Retrieve stats of a specified pair.",
  "parameters": [
    {
      "name": "x-chain",
      "description": "SVM networks only.",
      "in": "header",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "solana",
          "fogo"
        ],
        "default": "solana"
      }
    },
    {
      "name": "address",
      "description": "The address of a pair contract",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana": {
          "value": "4DoNfFBfF7UokCC2FQzriy7yHK6DY6NVdYpuekQ5pRgg"
        },
        "ethereum": {
          "value": "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"
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
      "description": "JSON object containing pair(market) overview data of a specific pair",
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
                "description": "Overview metrics for one trading pair or market.",
                "properties": {
                  "address": {
                    "type": "string",
                    "description": "Pair or market address."
                  },
                  "base": {
                    "type": "object",
                    "description": "Metadata for one side of the pair.",
                    "properties": {
                      "address": {
                        "type": "string",
                        "description": "Token mint or contract address for this side of the pair."
                      },
                      "decimals": {
                        "type": "integer",
                        "description": "Number of decimal places used by this token."
                      },
                      "icon": {
                        "type": "string",
                        "description": "Logo image URL for this token."
                      },
                      "symbol": {
                        "type": "string",
                        "description": "Ticker symbol for this token."
                      },
                      "is_scaled_ui_token": {
                        "type": "boolean",
                        "description": "True when this token uses Solana Token-2022 scaled UI amounts."
                      },
                      "multiplier": {
                        "type": "number",
                        "description": "Scaled UI multiplier for this token when scaled UI metadata is available."
                      }
                    },
                    "additionalProperties": true
                  },
                  "quote": {
                    "type": "object",
                    "description": "Metadata for one side of the pair.",
                    "properties": {
                      "address": {
                        "type": "string",
                        "description": "Token mint or contract address for this side of the pair."
                      },
                      "decimals": {
                        "type": "integer",
                        "description": "Number of decimal places used by this token."
                      },
                      "icon": {
                        "type": "string",
                        "description": "Logo image URL for this token."
                      },
                      "symbol": {
                        "type": "string",
                        "description": "Ticker symbol for this token."
                      },
                      "is_scaled_ui_token": {
                        "type": "boolean",
                        "description": "True when this token uses Solana Token-2022 scaled UI amounts."
                      },
                      "multiplier": {
                        "type": "number",
                        "description": "Scaled UI multiplier for this token when scaled UI metadata is available."
                      }
                    },
                    "additionalProperties": true
                  },
                  "created_at": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Timestamp when the pair or market was first created or indexed."
                  },
                  "name": {
                    "type": "string",
                    "description": "Display name of the pair, typically `BASE-QUOTE`."
                  },
                  "source": {
                    "type": "string",
                    "description": "DEX, AMM, or venue that powers this pair."
                  },
                  "liquidity": {
                    "type": "number",
                    "description": "Current pair liquidity in USD."
                  },
                  "liquidity_change_percentage_24h": {
                    "type": "number",
                    "nullable": true,
                    "description": "Percentage change in pair liquidity versus 24 hours earlier."
                  },
                  "price": {
                    "type": "number",
                    "description": "Latest pair price, typically quoted as base priced in quote."
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
                    "nullable": true,
                    "description": "Percentage change in trade count versus the previous 30m window."
                  },
                  "unique_wallet_30m": {
                    "type": "number",
                    "description": "Number of distinct wallets that traded this pair during the latest 30m window."
                  },
                  "unique_wallet_30m_change_percent": {
                    "type": "number",
                    "nullable": true,
                    "description": "Percentage change in distinct trading wallets versus the previous 30m window."
                  },
                  "volume_30m": {
                    "type": "number",
                    "description": "Total traded volume in USD for the pair during the latest 30m window."
                  },
                  "volume_30m_base": {
                    "type": "number",
                    "description": "Base-token volume traded during the latest 30m window."
                  },
                  "volume_30m_quote": {
                    "type": "number",
                    "description": "Quote-token volume traded during the latest 30m window."
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
                    "nullable": true,
                    "description": "Percentage change in trade count versus the previous 1h window."
                  },
                  "unique_wallet_1h": {
                    "type": "number",
                    "description": "Number of distinct wallets that traded this pair during the latest 1h window."
                  },
                  "unique_wallet_1h_change_percent": {
                    "type": "number",
                    "nullable": true,
                    "description": "Percentage change in distinct trading wallets versus the previous 1h window."
                  },
                  "volume_1h": {
                    "type": "number",
                    "description": "Total traded volume in USD for the pair during the latest 1h window."
                  },
                  "volume_1h_base": {
                    "type": "number",
                    "description": "Base-token volume traded during the latest 1h window."
                  },
                  "volume_1h_quote": {
                    "type": "number",
                    "description": "Quote-token volume traded during the latest 1h window."
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
                    "nullable": true,
                    "description": "Percentage change in trade count versus the previous 2h window."
                  },
                  "unique_wallet_2h": {
                    "type": "number",
                    "description": "Number of distinct wallets that traded this pair during the latest 2h window."
                  },
                  "unique_wallet_2h_change_percent": {
                    "type": "number",
                    "nullable": true,
                    "description": "Percentage change in distinct trading wallets versus the previous 2h window."
                  },
                  "volume_2h": {
                    "type": "number",
                    "description": "Total traded volume in USD for the pair during the latest 2h window."
                  },
                  "volume_2h_base": {
                    "type": "number",
                    "description": "Base-token volume traded during the latest 2h window."
                  },
                  "volume_2h_quote": {
                    "type": "number",
                    "description": "Quote-token volume traded during the latest 2h window."
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
                    "nullable": true,
                    "description": "Percentage change in trade count versus the previous 4h window."
                  },
                  "unique_wallet_4h": {
                    "type": "number",
                    "description": "Number of distinct wallets that traded this pair during the latest 4h window."
                  },
                  "unique_wallet_4h_change_percent": {
                    "type": "number",
                    "nullable": true,
                    "description": "Percentage change in distinct trading wallets versus the previous 4h window."
                  },
                  "volume_4h": {
                    "type": "number",
                    "description": "Total traded volume in USD for the pair during the latest 4h window."
                  },
                  "volume_4h_base": {
                    "type": "number",
                    "description": "Base-token volume traded during the latest 4h window."
                  },
                  "volume_4h_quote": {
                    "type": "number",
                    "description": "Quote-token volume traded during the latest 4h window."
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
                    "nullable": true,
                    "description": "Percentage change in trade count versus the previous 8h window."
                  },
                  "unique_wallet_8h": {
                    "type": "number",
                    "description": "Number of distinct wallets that traded this pair during the latest 8h window."
                  },
                  "unique_wallet_8h_change_percent": {
                    "type": "number",
                    "nullable": true,
                    "description": "Percentage change in distinct trading wallets versus the previous 8h window."
                  },
                  "volume_8h": {
                    "type": "number",
                    "description": "Total traded volume in USD for the pair during the latest 8h window."
                  },
                  "volume_8h_base": {
                    "type": "number",
                    "description": "Base-token volume traded during the latest 8h window."
                  },
                  "volume_8h_quote": {
                    "type": "number",
                    "description": "Quote-token volume traded during the latest 8h window."
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
                    "nullable": true,
                    "description": "Percentage change in trade count versus the previous 12h window."
                  },
                  "unique_wallet_12h": {
                    "type": "number",
                    "description": "Number of distinct wallets that traded this pair during the latest 12h window."
                  },
                  "unique_wallet_12h_change_percent": {
                    "type": "number",
                    "nullable": true,
                    "description": "Percentage change in distinct trading wallets versus the previous 12h window."
                  },
                  "volume_12h": {
                    "type": "number",
                    "description": "Total traded volume in USD for the pair during the latest 12h window."
                  },
                  "volume_12h_base": {
                    "type": "number",
                    "description": "Base-token volume traded during the latest 12h window."
                  },
                  "volume_12h_quote": {
                    "type": "number",
                    "description": "Quote-token volume traded during the latest 12h window."
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
                    "nullable": true,
                    "description": "Percentage change in trade count versus the previous 24h window."
                  },
                  "unique_wallet_24h": {
                    "type": "number",
                    "description": "Number of distinct wallets that traded this pair during the latest 24h window."
                  },
                  "unique_wallet_24h_change_percent": {
                    "type": "number",
                    "nullable": true,
                    "description": "Percentage change in distinct trading wallets versus the previous 24h window."
                  },
                  "volume_24h": {
                    "type": "number",
                    "description": "Total traded volume in USD for the pair during the latest 24h window."
                  },
                  "volume_24h_base": {
                    "type": "number",
                    "description": "Base-token volume traded during the latest 24h window."
                  },
                  "volume_24h_quote": {
                    "type": "number",
                    "description": "Quote-token volume traded during the latest 24h window."
                  },
                  "volume_24h_change_percentage_24h": {
                    "type": "number",
                    "nullable": true,
                    "description": "Percentage change in 24-hour USD volume versus the previous 24-hour window."
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
                  "address": "4DoNfFBfF7UokCC2FQzriy7yHK6DY6NVdYpuekQ5pRgg",
                  "base": {
                    "address": "So11111111111111111111111111111111111111112",
                    "decimals": 9,
                    "icon": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
                    "symbol": "SOL",
                    "is_scaled_ui_token": false,
                    "multiplier": 1
                  },
                  "created_at": "2023-02-28T03:00:02.253Z",
                  "name": "SOL-USDC",
                  "quote": {
                    "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                    "decimals": 6,
                    "icon": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
                    "symbol": "USDC",
                    "is_scaled_ui_token": false,
                    "multiplier": 1
                  },
                  "source": "Phoenix",
                  "liquidity": 2798754.646440928,
                  "liquidity_change_percentage_24h": null,
                  "price": 185.2259461756374,
                  "trade_24h": 1088,
                  "trade_24h_change_percent": -16.628352490421456,
                  "trade_history_24h": 1305,
                  "unique_wallet_24h": 183,
                  "unique_wallet_24h_change_percent": -39.40397350993378,
                  "volume_24h": 3960934.260889339,
                  "volume_24h_base": 21735.928,
                  "volume_24h_change_percentage_24h": null,
                  "volume_24h_quote": 3961073.7718080003,
                  "volume_12h": 2371020.4454601924,
                  "volume_12h_base": 12961.386,
                  "volume_12h_quote": 2371101.2224080004,
                  "volume_1h": 167126.90920284906,
                  "volume_1h_base": 902.8530000000001,
                  "volume_1h_quote": 167127.603103,
                  "volume_2h": 528203.5824244855,
                  "volume_2h_base": 2859.9010000000003,
                  "volume_2h_quote": 528219.775809,
                  "volume_30m": 111882.67078251604,
                  "volume_30m_base": 604.808,
                  "volume_30m_quote": 111883.36210299999,
                  "volume_4h": 848002.9830474032,
                  "volume_4h_base": 4613.238,
                  "volume_4h_quote": 848022.866258,
                  "volume_8h": 2042469.7997546664,
                  "volume_8h_base": 11160.507,
                  "volume_8h_quote": 2042534.6387080003,
                  "trade_12h": 531,
                  "trade_12h_change_percent": -4.838709677419355,
                  "trade_1h": 33,
                  "trade_1h_change_percent": -62.06896551724138,
                  "trade_2h": 120,
                  "trade_2h_change_percent": 118.18181818181819,
                  "trade_30m": 9,
                  "trade_30m_change_percent": -60.86956521739131,
                  "trade_4h": 175,
                  "trade_4h_change_percent": -16.666666666666664,
                  "trade_8h": 385,
                  "trade_8h_change_percent": 41.02564102564102,
                  "trade_history_12h": 558,
                  "trade_history_1h": 87,
                  "trade_history_2h": 55,
                  "trade_history_30m": 23,
                  "trade_history_4h": 210,
                  "trade_history_8h": 273,
                  "unique_wallet_12h": 112,
                  "unique_wallet_12h_change_percent": 19.148936170212767,
                  "unique_wallet_1h": 14,
                  "unique_wallet_1h_change_percent": -44,
                  "unique_wallet_2h": 30,
                  "unique_wallet_2h_change_percent": 57.89473684210527,
                  "unique_wallet_30m": 4,
                  "unique_wallet_30m_change_percent": -66.66666666666666,
                  "unique_wallet_4h": 39,
                  "unique_wallet_4h_change_percent": -29.09090909090909,
                  "unique_wallet_8h": 83,
                  "unique_wallet_8h_change_percent": 29.6875
                }
              }
            },
            "SinglePairOverview": {
              "value": {
                "data": {
                  "address": "4DoNfFBfF7UokCC2FQzriy7yHK6DY6NVdYpuekQ5pRgg",
                  "base": {
                    "address": "So11111111111111111111111111111111111111112",
                    "decimals": 9,
                    "icon": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
                    "symbol": "SOL"
                  },
                  "created_at": "2023-02-28T03:00:02.253Z",
                  "name": "SOL-USDC",
                  "quote": {
                    "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                    "decimals": 6,
                    "icon": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
                    "symbol": "USDC"
                  },
                  "source": "Phoenix",
                  "liquidity": 2919768.9610976744,
                  "liquidity_change_percentage_24h": null,
                  "price": 151.59967168674697,
                  "trade_24h": 16140,
                  "trade_24h_change_percent": 0.09302325581395349,
                  "trade_history_24h": 16125,
                  "unique_wallet_24h": 714,
                  "unique_wallet_24h_change_percent": -6.052631578947368,
                  "volume_24h": 19515805.77115872,
                  "volume_24h_base": 151900.454,
                  "volume_24h_change_percentage_24h": null,
                  "volume_24h_quote": 19516364.993035,
                  "volume_12h": 14684617.063818816,
                  "volume_12h_base": 113438.48700000001,
                  "volume_12h_quote": 14684998.902693,
                  "volume_1h": 1356675.6066384057,
                  "volume_1h_base": 10327.071000000004,
                  "volume_1h_quote": 1356683.9284229998,
                  "volume_2h": 2232212.0021702545,
                  "volume_2h_base": 16991.945000000003,
                  "volume_2h_quote": 2232241.2586139995,
                  "volume_30m": 523655.0599800013,
                  "volume_30m_base": 3981.183,
                  "volume_30m_quote": 523662.4028330001,
                  "volume_4h": 3075106.4318026183,
                  "volume_4h_base": 23345.053,
                  "volume_4h_quote": 3075154.5230179993,
                  "volume_8h": 11272364.380447734,
                  "volume_8h_base": 86701.32800000001,
                  "volume_8h_quote": 11272703.083117,
                  "trade_12h": 9371,
                  "trade_12h_change_percent": 38.37861783815712,
                  "trade_1h": 539,
                  "trade_1h_change_percent": -11.639344262295081,
                  "trade_2h": 1149,
                  "trade_2h_change_percent": 7.887323943661972,
                  "trade_30m": 190,
                  "trade_30m_change_percent": -45.24495677233429,
                  "trade_4h": 2217,
                  "trade_4h_change_percent": -46.01899196493791,
                  "trade_8h": 6305,
                  "trade_8h_change_percent": 25.273196900456984,
                  "trade_history_12h": 6772,
                  "trade_history_1h": 610,
                  "trade_history_2h": 1065,
                  "trade_history_30m": 347,
                  "trade_history_4h": 4107,
                  "trade_history_8h": 5033,
                  "unique_wallet_12h": 446,
                  "unique_wallet_12h_change_percent": 20.54054054054054,
                  "unique_wallet_1h": 38,
                  "unique_wallet_1h_change_percent": -47.94520547945205,
                  "unique_wallet_2h": 94,
                  "unique_wallet_2h_change_percent": -21.666666666666668,
                  "unique_wallet_30m": 15,
                  "unique_wallet_30m_change_percent": -54.54545454545454,
                  "unique_wallet_4h": 180,
                  "unique_wallet_4h_change_percent": -38.56655290102389,
                  "unique_wallet_8h": 386,
                  "unique_wallet_8h_change_percent": 83.80952380952381
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
  "operationId": "get-defi-v3-pair-overview-single",
  "x-mint": {
    "href": "/data-api/stats/get-defi-v3-pair-overview-single"
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
