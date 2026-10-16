---
title: "Trades - Recent (V3)"
description: "Retrieve a list of recent trades."
hidden: false
metadata:
  title: Birdeye Data API | Trades - Recent (V3)
  description: Retrieve a list of recent trades.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/txs/recent"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Latest V3 trade feed on one chain.</strong></p>
  <ul>
    <li>This endpoint is optimized for freshness rather than deep archival queries.</li>
    <li><code>limit</code> supports <code>1</code> to <code>500</code> items per request, and <code>offset + limit</code> must stay within <code>10,000</code>.</li>
    <li>You may filter by time or block-number window, but only one range model is allowed per request.</li>
    <li><code>sort_by</code> is selected automatically from the range filter you use, and sort order is descending.</li>
    <li><code>tx_type</code> supports side-aware values such as <code>buy</code> and <code>sell</code>.</li>
    <li>On Solana, <code>ui_amount_mode</code> can switch between <code>raw</code> and <code>scaled</code>; other chains are normalized to <code>scaled</code>.</li>
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
    <li>CU is dynamic: <code>12 CU</code> for up to <code>100</code> items, <code>30 CU</code> for up to <code>300</code> items, and <code>50 CU</code> for up to <code>500</code> items.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Get recent DEX trades across all tokens and pairs on a specific chain.</li>
    <li>Great for tracking whale activity, token movements, or suspicious patterns.</li>
    <li>Drive the freshest trade feed for dashboards, monitors, and alert pipelines.</li>
    <li>Watch a chain for sudden buy, sell, or swap bursts in near real time.</li>
    <li>Build recent-flow widgets before deciding which tokens deserve deeper analysis.</li>
    <li>Feed streaming-like polling systems when WebSocket is not the chosen integration.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Use <code>tx_type</code> and optional <code>owner</code> filters to shape the recent feed.</li>
    <li>Optionally narrow by recent time or block range, but do not mix both.</li>
    <li>Keep the request under the <code>10,000</code> total record cap from <code>offset + limit</code>.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Poll on a steady cadence and deduplicate by transaction identifiers in your consumer.</li>
    <li>Keep limits as low as the UI or job can tolerate so CU stays efficient.</li>
    <li>Use this endpoint for freshness, then hand off to <code>Trades - All (V3)</code> or token-specific endpoints for deeper backfills.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /defi/v3/txs/recent

```json
{
  "tags": [
    "Transactions"
  ],
  "summary": "Trades - Recent (V3)",
  "description": "Retrieve a list of recent trades.",
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
      "name": "offset",
      "description": "Make sure offset + limit <= 10000",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 0,
        "minimum": 0,
        "maximum": 9999
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
        "maximum": 500
      }
    },
    {
      "name": "tx_type",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "swap",
          "add",
          "remove",
          "all"
        ],
        "default": "swap"
      }
    },
    {
      "name": "owner",
      "description": "The address of the wallet.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana": {
          "value": "ob2htHLoCu2P6tX7RrNVtiG1mYTas8NGJEVLaFEUngk"
        },
        "ethereum": {
          "value": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce"
        }
      }
    },
    {
      "name": "before_time",
      "description": "Specify the time seeked before using unix timestamps in seconds",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 10000000000
      },
      "example": 1741531133
    },
    {
      "name": "after_time",
      "description": "Specify the time seeked after using unix timestamps in seconds",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 10000000000
      },
      "example": 1741444733
    },
    {
      "name": "before_block_number",
      "description": "Specify the upper bound of block_number for the filter range, excluding values equal to before_block_number.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 9007199254740991
      },
      "example": 1000000
    },
    {
      "name": "after_block_number",
      "description": "Specify the lower bound of block_number for the filter range, excluding values equal to after_block_number.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 9007199254740991
      },
      "example": 1000000
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
      "description": "JSON object containing trades",
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
                    "description": "Trades returned by the V3 endpoint.",
                    "items": {
                      "type": "object",
                      "description": "One trade returned by V3 trade endpoints.",
                      "additionalProperties": true,
                      "properties": {
                        "base": {
                          "type": "object",
                          "description": "One token leg inside a V3 trade response. Uses snake_case field names and may include signers on Solana.",
                          "additionalProperties": true,
                          "properties": {
                            "symbol": {
                              "type": "string",
                              "description": "Token symbol for this leg."
                            },
                            "name": {
                              "type": "string",
                              "description": "Token name when available."
                            },
                            "address": {
                              "type": "string",
                              "description": "Token mint or contract address."
                            },
                            "decimals": {
                              "type": "integer",
                              "description": "Number of token decimals."
                            },
                            "price": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Indexed USD price of the token at the transaction time."
                            },
                            "amount": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Raw token amount before decimal scaling."
                            },
                            "ui_amount": {
                              "type": "number",
                              "description": "Human-readable token amount after decimals are applied."
                            },
                            "ui_change_amount": {
                              "type": "number",
                              "description": "Signed human-readable balance change for this leg."
                            },
                            "nearest_price": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Closest indexed USD price near the transaction time when available."
                            },
                            "change_amount": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Signed raw balance change for this leg when returned."
                            },
                            "type": {
                              "type": "string",
                              "description": "Low-level event type for this leg such as `split`, `burn`, or `transfer`."
                            },
                            "type_swap": {
                              "type": "string",
                              "description": "Swap direction marker for this leg, such as `from` or `to`."
                            },
                            "is_scaled_ui_token": {
                              "type": "boolean",
                              "description": "Whether this token uses Solana Token-2022 scaled UI amounts."
                            },
                            "multiplier": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Scaled UI multiplier for Token-2022 assets when available."
                            }
                          }
                        },
                        "quote": {
                          "type": "object",
                          "description": "One token leg inside a V3 trade response. Uses snake_case field names and may include signers on Solana.",
                          "additionalProperties": true,
                          "properties": {
                            "symbol": {
                              "type": "string",
                              "description": "Token symbol for this leg."
                            },
                            "name": {
                              "type": "string",
                              "description": "Token name when available."
                            },
                            "address": {
                              "type": "string",
                              "description": "Token mint or contract address."
                            },
                            "decimals": {
                              "type": "integer",
                              "description": "Number of token decimals."
                            },
                            "price": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Indexed USD price of the token at the transaction time."
                            },
                            "amount": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Raw token amount before decimal scaling."
                            },
                            "ui_amount": {
                              "type": "number",
                              "description": "Human-readable token amount after decimals are applied."
                            },
                            "ui_change_amount": {
                              "type": "number",
                              "description": "Signed human-readable balance change for this leg."
                            },
                            "nearest_price": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Closest indexed USD price near the transaction time when available."
                            },
                            "change_amount": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Signed raw balance change for this leg when returned."
                            },
                            "type": {
                              "type": "string",
                              "description": "Low-level event type for this leg such as `split`, `burn`, or `transfer`."
                            },
                            "type_swap": {
                              "type": "string",
                              "description": "Swap direction marker for this leg, such as `from` or `to`."
                            },
                            "is_scaled_ui_token": {
                              "type": "boolean",
                              "description": "Whether this token uses Solana Token-2022 scaled UI amounts."
                            },
                            "multiplier": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Scaled UI multiplier for Token-2022 assets when available."
                            }
                          }
                        },
                        "from": {
                          "type": "object",
                          "description": "One token leg inside a V3 trade response. Uses snake_case field names and may include signers on Solana.",
                          "additionalProperties": true,
                          "properties": {
                            "symbol": {
                              "type": "string",
                              "description": "Token symbol for this leg."
                            },
                            "name": {
                              "type": "string",
                              "description": "Token name when available."
                            },
                            "address": {
                              "type": "string",
                              "description": "Token mint or contract address."
                            },
                            "decimals": {
                              "type": "integer",
                              "description": "Number of token decimals."
                            },
                            "price": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Indexed USD price of the token at the transaction time."
                            },
                            "amount": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Raw token amount before decimal scaling."
                            },
                            "ui_amount": {
                              "type": "number",
                              "description": "Human-readable token amount after decimals are applied."
                            },
                            "ui_change_amount": {
                              "type": "number",
                              "description": "Signed human-readable balance change for this leg."
                            },
                            "nearest_price": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Closest indexed USD price near the transaction time when available."
                            },
                            "change_amount": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Signed raw balance change for this leg when returned."
                            },
                            "type": {
                              "type": "string",
                              "description": "Low-level event type for this leg such as `split`, `burn`, or `transfer`."
                            },
                            "type_swap": {
                              "type": "string",
                              "description": "Swap direction marker for this leg, such as `from` or `to`."
                            },
                            "is_scaled_ui_token": {
                              "type": "boolean",
                              "description": "Whether this token uses Solana Token-2022 scaled UI amounts."
                            },
                            "multiplier": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Scaled UI multiplier for Token-2022 assets when available."
                            }
                          }
                        },
                        "to": {
                          "type": "object",
                          "description": "One token leg inside a V3 trade response. Uses snake_case field names and may include signers on Solana.",
                          "additionalProperties": true,
                          "properties": {
                            "symbol": {
                              "type": "string",
                              "description": "Token symbol for this leg."
                            },
                            "name": {
                              "type": "string",
                              "description": "Token name when available."
                            },
                            "address": {
                              "type": "string",
                              "description": "Token mint or contract address."
                            },
                            "decimals": {
                              "type": "integer",
                              "description": "Number of token decimals."
                            },
                            "price": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Indexed USD price of the token at the transaction time."
                            },
                            "amount": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Raw token amount before decimal scaling."
                            },
                            "ui_amount": {
                              "type": "number",
                              "description": "Human-readable token amount after decimals are applied."
                            },
                            "ui_change_amount": {
                              "type": "number",
                              "description": "Signed human-readable balance change for this leg."
                            },
                            "nearest_price": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Closest indexed USD price near the transaction time when available."
                            },
                            "change_amount": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Signed raw balance change for this leg when returned."
                            },
                            "type": {
                              "type": "string",
                              "description": "Low-level event type for this leg such as `split`, `burn`, or `transfer`."
                            },
                            "type_swap": {
                              "type": "string",
                              "description": "Swap direction marker for this leg, such as `from` or `to`."
                            },
                            "is_scaled_ui_token": {
                              "type": "boolean",
                              "description": "Whether this token uses Solana Token-2022 scaled UI amounts."
                            },
                            "multiplier": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Scaled UI multiplier for Token-2022 assets when available."
                            }
                          }
                        },
                        "tx_type": {
                          "type": "string",
                          "description": "Trade classification such as `buy`, `sell`, or `swap`."
                        },
                        "tx_hash": {
                          "type": "string",
                          "description": "Transaction signature or hash."
                        },
                        "ins_index": {
                          "type": [
                            "integer",
                            "null"
                          ],
                          "description": "Instruction index within the transaction."
                        },
                        "inner_ins_index": {
                          "type": [
                            "integer",
                            "null"
                          ],
                          "description": "Inner instruction index when the trade happened inside a nested call."
                        },
                        "block_unix_time": {
                          "type": "integer",
                          "description": "Block timestamp in Unix seconds."
                        },
                        "block_number": {
                          "type": "integer",
                          "description": "Block or slot number for the transaction."
                        },
                        "volume_usd": {
                          "type": "number",
                          "description": "Trade value in USD."
                        },
                        "volume": {
                          "type": "number",
                          "description": "Trade size in token units for the requested context."
                        },
                        "owner": {
                          "type": "string",
                          "description": "Primary wallet that initiated or owned the trade flow."
                        },
                        "signers": {
                          "type": "array",
                          "description": "Signer accounts attached to the transaction when available, primarily on Solana.",
                          "items": {
                            "type": "string"
                          }
                        },
                        "source": {
                          "type": "string",
                          "description": "DEX, AMM, or protocol source."
                        },
                        "side": {
                          "type": "string",
                          "description": "Trade side relative to the requested token when available."
                        },
                        "alias": {
                          "type": [
                            "string",
                            "null"
                          ],
                          "description": "Optional human-readable label for the owner wallet."
                        },
                        "price_pair": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Executed pair price derived from the traded amounts."
                        },
                        "base_price": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Indexed USD price of the base token at the transaction time."
                        },
                        "quote_price": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Indexed USD price of the quote token at the transaction time."
                        },
                        "pool_id": {
                          "type": [
                            "string",
                            "null"
                          ],
                          "description": "Pool or market address associated with the trade."
                        },
                        "address": {
                          "type": [
                            "string",
                            "null"
                          ],
                          "description": "Pool, pair, or contract address associated with the transaction context."
                        },
                        "interacted_program_id": {
                          "type": [
                            "string",
                            "null"
                          ],
                          "description": "Program or contract address directly interacted with by the transaction."
                        }
                      }
                    }
                  },
                  "has_next": {
                    "type": "boolean",
                    "description": "Whether more records are available for pagination in snake_case responses."
                  },
                  "hasNext": {
                    "type": "boolean",
                    "description": "Whether more records are available for pagination in camelCase responses."
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
                  "items": [
                    {
                      "base": {
                        "symbol": "CLIPPY",
                        "address": "GCLTmivKZfxYi8SV17FrpqH8HZtJauoePQPRHxJxBAGS",
                        "decimals": 9,
                        "price": 0.00026036603447282113,
                        "amount": "24285885836773",
                        "ui_amount": 24285.885836773,
                        "ui_change_amount": 24285.885836773,
                        "type_swap": "to",
                        "is_scaled_ui_token": false,
                        "multiplier": null
                      },
                      "quote": {
                        "symbol": "SOL",
                        "address": "So11111111111111111111111111111111111111112",
                        "decimals": 9,
                        "price": 185.6186502639611,
                        "amount": "34118151",
                        "ui_amount": 0.034118151,
                        "ui_change_amount": -0.034118151,
                        "type_swap": "from",
                        "is_scaled_ui_token": false,
                        "multiplier": null
                      },
                      "tx_type": "swap",
                      "tx_hash": "4z62PXFvbo52qY66XAMhsaKSfNH9MoBinFQtsjoZcjRTc2gCGP2o86yTUdaHpnYozHxNkiATX3KRGPfFb7CyjoPW",
                      "ins_index": 0,
                      "inner_ins_index": 3,
                      "block_unix_time": 1754885184,
                      "block_number": 359262879,
                      "volume_usd": 6.332965138122014,
                      "volume": 24285.885836773,
                      "owner": "7dGrdJRYtsNR8UYxZ3TnifXGjGc9eRYLq9sELwYpuuUu",
                      "signers": [
                        "7dGrdJRYtsNR8UYxZ3TnifXGjGc9eRYLq9sELwYpuuUu"
                      ],
                      "source": "meteora_dlmm",
                      "interacted_program_id": "King7ki4SKMBPb3iupnQwTyjsq294jaXsgLmJo8cb7T",
                      "pool_id": "6LR2pDMBbYZNhj1iF86b4X5zRYyX7BNrhpzRDEZYNam9"
                    }
                  ],
                  "hasNext": true
                }
              }
            },
            "Transactions": {
              "value": {
                "data": {
                  "items": [
                    {
                      "base": {
                        "symbol": "KIKO",
                        "address": "3weaLsXbBnrraexeLed9hmuDVgeHKDZPtZSs4x6cD7qG",
                        "decimals": 6,
                        "price": 0.02988415183896015,
                        "amount": "454487131",
                        "ui_amount": 454.487131,
                        "ui_change_amount": -454.487131,
                        "type_swap": "from"
                      },
                      "quote": {
                        "symbol": "SOL",
                        "address": "So11111111111111111111111111111111111111112",
                        "decimals": 9,
                        "price": 165.64320257489635,
                        "amount": "81995290",
                        "ui_amount": 0.08199529,
                        "ui_change_amount": 0.08199529,
                        "type_swap": "to"
                      },
                      "tx_type": "swap",
                      "tx_hash": "393SUr4ZiPnGDCqzR5hrMpxkHur5JMvz1omGeqDVZq6DKvtHe8vnZET9adFygvaHFsYKYo4v91MP22yk9x7Jggkj",
                      "ins_index": 2,
                      "inner_ins_index": null,
                      "block_unix_time": 1747745377,
                      "block_number": 341273735,
                      "volume_usd": 13.581962431657372,
                      "volume": 454.487131,
                      "owner": "46zJ4LQQxCEC4it9GUfvTETdwrzDT8rVzEEXQTmJTJuq",
                      "signers": [
                        "46zJ4LQQxCEC4it9GUfvTETdwrzDT8rVzEEXQTmJTJuq"
                      ],
                      "source": "raydium",
                      "interacted_program_id": "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
                      "pool_id": "8oFgUziy5yRpQ3rsmZ2qEMcxpVkHiiwkebnsgMcHTR1w"
                    },
                    {
                      "base": {
                        "symbol": "KIKO",
                        "address": "3weaLsXbBnrraexeLed9hmuDVgeHKDZPtZSs4x6cD7qG",
                        "decimals": 6,
                        "price": 0.03002938305013581,
                        "amount": "371122946",
                        "ui_amount": 371.122946,
                        "ui_change_amount": 371.122946,
                        "type_swap": "to"
                      },
                      "quote": {
                        "symbol": "SOL",
                        "address": "So11111111111111111111111111111111111111112",
                        "decimals": 9,
                        "price": 165.64320257489635,
                        "amount": "67280715",
                        "ui_amount": 0.067280715,
                        "ui_change_amount": -0.067280715,
                        "type_swap": "from"
                      },
                      "tx_type": "swap",
                      "tx_hash": "3ud5wbaFMELDrJmNoC4uFXgE5WTKirKajnBcwaNfiRqycmJH4zzB2Cwr2nf9DKZN4Qrwg7zG9auQXgqH9gAfEXPJ",
                      "ins_index": 2,
                      "inner_ins_index": null,
                      "block_unix_time": 1747745377,
                      "block_number": 341273735,
                      "volume_usd": 11.144593104128868,
                      "volume": 371.122946,
                      "owner": "4oQHz59WxXtyeRpXdmAFNGso4mD2E7rziteQfST4c1BK",
                      "signers": [
                        "4oQHz59WxXtyeRpXdmAFNGso4mD2E7rziteQfST4c1BK"
                      ],
                      "source": "raydium",
                      "interacted_program_id": "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
                      "pool_id": "8oFgUziy5yRpQ3rsmZ2qEMcxpVkHiiwkebnsgMcHTR1w"
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
  "operationId": "get-defi-v3-txs-recent",
  "x-mint": {
    "href": "/data-api/transactions/get-defi-v3-txs-recent"
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
