---
title: "Trades - All (V3)"
description: "Retrieve a list of trades with various filters."
hidden: false
metadata:
  title: Birdeye Data API | Trades - All (V3)
  description: Retrieve a list of trades with various filters.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/txs"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Filtered V3 trade feed across the whole chain.</strong></p>
  <ul>
    <li><code>limit</code> supports <code>1</code> to <code>100</code> items per request, and <code>offset + limit</code> must stay within <code>10,000</code>.</li>
    <li>Solana notes:</li>
    <li>Transaction data includes <code>signers</code> — a list of accounts that authorize the transaction with their signatures.</li>
    <li>If time range and block number range are not provided:</li>
    <li>If <code>sort_by = block_unix_time</code>, default to fetching swaps within the last 7 days.</li>
    <li>If <code>sort_by = block_number</code>, default to fetching swaps within the last 500,000 blocks.</li>
    <li>Only one type of filter is accepted: either block time range or block number range.</li>
    <li>If filtering by block time (<code>after_time</code>, <code>before_time</code>), only allow sorting by <code>block_unix_time</code>.</li>
    <li>If filtering by block number (<code>after_block_number</code>, <code>before_block_number</code>), only allow sorting by <code>block_number</code>.</li>
    <li>Constraints:</li>
    <li>Block time range cannot exceed 30 days.</li>
    <li>Block number range cannot exceed 500,000 blocks.</li>
    <li>If only <code>after_time</code> is provided with no <code>before_time</code>, it must be within the last 30 days.</li>
    <li>If only <code>after_block_number</code> is provided with no <code>before_block_number</code>, it must be within the most recent 500,000 blocks.</li>
    <li>If <code>source</code> is used, it is supported on Solana only.</li>
    <li><code>sort_type</code> is descending-only in V3 trade endpoints.</li>
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
    <li>This endpoint consumes <code>12 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Get recent DEX trades across all tokens and pairs on a specific chain.</li>
    <li>Great for tracking whale activity, token movements, or suspicious patterns.</li>
    <li>Build filtered chain-wide trade feeds across tokens, pools, owners, or DEX sources.</li>
    <li>Investigate bursts of activity around a wallet, venue, or block range.</li>
    <li>Power analytics pipelines that need raw trades beyond a single token or pair.</li>
    <li>Detect chain-wide market flow patterns before summarizing them into dashboards or alerts.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Filter by <code>tx_type</code>, <code>owner</code>, <code>pool_id</code>, <code>source</code>, and either time range or block-number range.</li>
    <li>Use <code>sort_by=block_unix_time</code> for time windows and <code>sort_by=block_number</code> for block windows.</li>
    <li>Keep <code>offset + limit &lt;= 10000</code>.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use block ranges when you care about precise chain progression and time ranges when you care about wall-clock windows.</li>
    <li>Do not mix time and block filters in the same request; split them into separate jobs if needed.</li>
    <li>On non-Solana chains, omit <code>source</code> and rely on other filters instead.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /defi/v3/txs

```json
{
  "tags": [
    "Transactions"
  ],
  "summary": "Trades - All (V3)",
  "description": "Retrieve a list of trades with various filters.",
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
        "maximum": 100
      }
    },
    {
      "name": "sort_by",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "default": "block_unix_time",
        "enum": [
          "block_unix_time",
          "block_number"
        ]
      }
    },
    {
      "name": "sort_type",
      "description": "Specify the sort order.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "desc"
        ],
        "default": "desc"
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
      "name": "source",
      "description": "Source of the liquidity (AMMs). Only support solana.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "raydium",
          "raydium_clamm",
          "raydium_cp",
          "orca",
          "lifinity",
          "fluxbeam",
          "saber",
          "phoenix",
          "bonkswap",
          "meteora_dlmm",
          "pump_amm",
          "humidifi",
          "bisonfi",
          "solfi_v2",
          "alphaq",
          "aquifer",
          "solfi",
          "whirlpool",
          "goonfi",
          "goonfi_v2",
          "tesserav",
          "jupiterz",
          "vertigo",
          "pump_dot_fun",
          "raydium_launchlab",
          "meteora_virtual_curve",
          "meteora_dynamic_bonding_curve"
        ]
      },
      "examples": {
        "solana": {
          "value": "raydium"
        }
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
      "name": "pool_id",
      "description": "The address of the liquidity pool.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana": {
          "value": "3nMFwZXwY1s1M5s8vYAHqd4wGs4iSxXE4LRoUMMYqEgF"
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
  "operationId": "get-defi-v3-txs",
  "x-mint": {
    "href": "/data-api/transactions/get-defi-v3-txs"
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
