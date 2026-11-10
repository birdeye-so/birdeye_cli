---
title: "Meme Token Detail - Single"
description: "Get detail of given meme token"
hidden: false
metadata:
  title: Birdeye Data API | Meme Token Detail - Single
  description: Get detail of given meme token
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/token/meme/detail/single"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Detailed profile for one meme token.</strong></p>
  <ul>
    <li>Pass one token address to retrieve richer meme-token metrics such as price, volume, market cap, price change, listing timestamp, and metadata.</li>
    <li>Use this endpoint after discovery when one token needs a dedicated detail view.</li>
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
    <li>This endpoint consumes <code>15 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Power a dedicated meme-token detail page after list discovery.</li>
    <li>Inspect one token's momentum, metadata, and listing context before alerting or trading.</li>
    <li>Add richer launch-context panels to meme dashboards and watchlists.</li>
    <li>Support analyst review when a meme token suddenly appears in trending or smart-money screens.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> to <code>solana</code>, <code>bsc</code>, or <code>monad</code>.</li>
    <li>Pass the meme token address you want to inspect.</li>
    <li>Combine the response with price, trades, holder, or security endpoints when you need a fuller view.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use the list endpoint for discovery and this endpoint for token-level drilldown.</li>
    <li>Keep venue-aware availability in mind when comparing tokens launched on different meme platforms.</li>
    <li>Pair detail data with recent transactions to confirm whether momentum is broad or short-lived.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/token/meme/detail/single

```json
{
  "tags": [
    "Meme"
  ],
  "summary": "Meme Token Detail - Single",
  "description": "Get detail of given meme token",
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
      "name": "address",
      "description": "Address of a meme token",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "default": "HHuLN58RAJoyNxwYte8NdEyV7dhQzDCLXDmTraHspump"
      },
      "examples": {
        "solana": {
          "value": "HHuLN58RAJoyNxwYte8NdEyV7dhQzDCLXDmTraHspump"
        }
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
                "allOf": [
                  {
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
                ],
                "description": "Detailed meme-token profile for the requested token address."
              }
            }
          },
          "examples": {
            "DefiMemeDetailSingleData": {
              "value": {
                "data": {
                  "address": "6R3LxpHiE8RjTL7HnvKWtoQCHVA76CR1ebF9MYk61wzS",
                  "name": "RekaAI",
                  "symbol": "RekaAI",
                  "decimals": 6,
                  "extensions": {
                    "twitter": "https://x.com/FusionLab_Inc",
                    "website": "https://reka.ai",
                    "description": "Multimodal AI you can deploy anywhere"
                  },
                  "logo_uri": "https://ipfs.io/ipfs/QmXuk2dXxM5hYARaxoPyoryJm5UQHdTkEhXrtsFFU7Siay",
                  "price": 0.001,
                  "liquidity": 0.2919295560985348,
                  "global_fees_paid": 125.5,
                  "circulating_supply": 1000000000,
                  "market_cap": 1000000,
                  "total_supply": 1000000000,
                  "fdv": 1000000,
                  "meme_info": {
                    "source": "pump_dot_fun",
                    "platform_id": "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
                    "created_at": {
                      "tx_hash": "25CRJJs4B5NVTgu6Sv1mMVpnXYMT5HG7LcfmvXTV5Tkp1GN8ajXDTjW59NTFN1UsHkXjkfCeUs7gKQAzTufCjpnw",
                      "slot": 330948137,
                      "block_time": 1743653081
                    },
                    "creation_time": 1743653081,
                    "creator": "2suZVbGzdD1jdMFgyojG35TR6XWKFtSbprvjnTFAg8Ru",
                    "updated_at": {
                      "tx_hash": "25CRJJs4B5NVTgu6Sv1mMVpnXYMT5HG7LcfmvXTV5Tkp1GN8ajXDTjW59NTFN1UsHkXjkfCeUs7gKQAzTufCjpnw",
                      "slot": 330948137
                    },
                    "graduated_at": {
                      "slot": null,
                      "tx_hash": null,
                      "block_time": null
                    },
                    "graduated": false,
                    "graduated_time": null,
                    "pool": {
                      "address": "2T6KViNFRuQb1MiFbmEtM4cA1mK2ayHKJTZHJ9K7aNw4",
                      "real_sol_reserves": "0",
                      "real_token_reserves": "793100000000000",
                      "token_total_supply": "1000000000000000",
                      "virtual_token_reserves": "1073000000000000"
                    },
                    "progress_percent": 0,
                    "address": "6R3LxpHiE8RjTL7HnvKWtoQCHVA76CR1ebF9MYk61wzS"
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
  "operationId": "get-defi-v3-token-meme-detail-single",
  "x-mint": {
    "href": "/data-api/meme/get-defi-v3-token-meme-detail-single"
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
