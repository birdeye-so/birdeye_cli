---
title: "Trades - Token Filtered By Volume (V3)"
description: "Retrieve a list of trades with various filters of a specified token with volume (value)."
hidden: false
metadata:
  title: Birdeye Data API | Trades - Token Filtered By Volume (V3)
  description: >-
    Retrieve a list of trades with various filters of a specified token with
    volume (value).
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/token/txs-by-volume"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Large-trade filter for one token.</strong></p>
  <ul>
    <li>This endpoint is Solana-only.</li>
    <li>Pass the token mint in <code>token_address</code>.</li>
    <li><code>limit</code> supports up to <code>500</code> items per request.</li>
    <li><code>volume_type</code> lets you filter by USD value or token amount.</li>
    <li>If <code>min_volume</code> is provided without <code>max_volume</code>, the backend expands <code>max_volume</code> automatically for an open-ended upper bound.</li>
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
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>CU is dynamic: <code>40 CU</code> for up to <code>100</code> items, <code>80 CU</code> for up to <code>200</code> items, and <code>200 CU</code> for up to <code>500</code> items.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Isolate larger prints to study whale behavior, distribution, or accumulation.</li>
    <li>Great for tracking whale activity, token movements, or suspicious patterns.</li>
    <li>Build large-trade monitors and alert systems for one token.</li>
    <li>Filter out micro-noise when only meaningful size matters for your analysis.</li>
    <li>Examine whether outsized volume came from one owner, one venue, or one side of the market.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Pass <code>token_address</code> and choose <code>volume_type</code>.</li>
    <li>Use <code>min_volume</code> and optional <code>max_volume</code> to define the size bucket.</li>
    <li>Add <code>owner</code>, <code>tx_type</code>, <code>source</code>, and recent time filters as needed.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Define separate bands for medium and very large prints so your dashboards can distinguish accumulation from exceptional blocks.</li>
    <li>Use USD mode when comparing across tokens and amount mode when the token quantity itself matters.</li>
    <li>Pair this endpoint with holder and wallet endpoints when you need to identify whether repeated large prints belong to the same actor.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/token/txs-by-volume

```json
{
  "tags": [
    "Transactions"
  ],
  "summary": "Trades - Token Filtered By Volume (V3)",
  "description": "Retrieve a list of trades with various filters of a specified token with volume (value).",
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
      "description": "The address of the token contract.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
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
      "name": "volume_type",
      "in": "query",
      "description": "Volume type value to be filtered",
      "required": true,
      "schema": {
        "type": "string",
        "enum": [
          "usd",
          "amount"
        ]
      },
      "example": "usd"
    },
    {
      "name": "min_volume",
      "in": "query",
      "description": "Minimum volume value, support up to 3 decimals",
      "required": false,
      "schema": {
        "type": "number"
      },
      "example": 12.111
    },
    {
      "name": "max_volume",
      "in": "query",
      "description": "Maximum volume value, support up to 3 decimals",
      "required": false,
      "schema": {
        "type": "number"
      },
      "example": 13.111
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
      "name": "tx_type",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "swap",
          "buy",
          "sell",
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
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing transactions of a token",
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
            "TokenTxsSwap": {
              "value": {
                "data": {
                  "items": [
                    {
                      "tx_type": "buy",
                      "tx_hash": "3fqsirN8vbhBLHS2cVAaCXTdsCcCua75LgcBX6Z2G2yupM9cDEsmo2TP5AhXvEUBZ91xyy3KWiuDdHxoFVnp1R88",
                      "ins_index": 2,
                      "inner_ins_index": 0,
                      "block_unix_time": 1740380278,
                      "block_number": 322728531,
                      "volume_usd": 0.0005729458359923133,
                      "volume": 1733.23946,
                      "owner": "8bP4FJNXwN5Q4a6EybtHwsiAnxFFWb93sY38mYdo6Pr2",
                      "signers": [
                        "8bP4FJNXwN5Q4a6EybtHwsiAnxFFWb93sY38mYdo6Pr2"
                      ],
                      "source": "raydium",
                      "side": "buy",
                      "alias": null,
                      "price_pair": 486318591.4702581,
                      "from": {
                        "symbol": "PEPEAI",
                        "address": "7nM97F8takLArrKLJdT62L54jTtX1e7h7qPSjtBrsMQA",
                        "decimals": 6,
                        "price": 3.5071289483955604e-7,
                        "amount": "1733239460",
                        "ui_amount": 1733.23946,
                        "ui_change_amount": -1733.23946
                      },
                      "to": {
                        "symbol": "SOL",
                        "address": "So11111111111111111111111111111111111111112",
                        "decimals": 9,
                        "price": 160.7592132413898,
                        "amount": "3564",
                        "ui_amount": 0.000003564,
                        "ui_change_amount": 0.000003564
                      },
                      "pool_id": "8aTXVUjPcUSwSLAbUegaKTQdB6SaNosSKQkURvpbLCNC"
                    }
                  ],
                  "has_next": true
                },
                "success": true
              }
            },
            "TokenTxsBuy": {
              "value": {
                "data": {
                  "items": [
                    {
                      "tx_type": "buy",
                      "tx_hash": "3fqsirN8vbhBLHS2cVAaCXTdsCcCua75LgcBX6Z2G2yupM9cDEsmo2TP5AhXvEUBZ91xyy3KWiuDdHxoFVnp1R88",
                      "ins_index": 2,
                      "inner_ins_index": 0,
                      "block_unix_time": 1740380278,
                      "block_number": 322728531,
                      "volume_usd": 0.0005729458359923133,
                      "volume": 1733.23946,
                      "owner": "8bP4FJNXwN5Q4a6EybtHwsiAnxFFWb93sY38mYdo6Pr2",
                      "signers": [
                        "8bP4FJNXwN5Q4a6EybtHwsiAnxFFWb93sY38mYdo6Pr2"
                      ],
                      "source": "raydium",
                      "side": "buy",
                      "alias": null,
                      "price_pair": 486318591.4702581,
                      "from": {
                        "symbol": "PEPEAI",
                        "address": "7nM97F8takLArrKLJdT62L54jTtX1e7h7qPSjtBrsMQA",
                        "decimals": 6,
                        "price": 3.5071289483955604e-7,
                        "amount": "1733239460",
                        "ui_amount": 1733.23946,
                        "ui_change_amount": -1733.23946
                      },
                      "to": {
                        "symbol": "SOL",
                        "address": "So11111111111111111111111111111111111111112",
                        "decimals": 9,
                        "price": 160.7592132413898,
                        "amount": "3564",
                        "ui_amount": 0.000003564,
                        "ui_change_amount": 0.000003564
                      },
                      "pool_id": "8aTXVUjPcUSwSLAbUegaKTQdB6SaNosSKQkURvpbLCNC"
                    }
                  ],
                  "has_next": true
                },
                "success": true
              }
            },
            "TokenTxsSell": {
              "value": {
                "data": {
                  "items": [
                    {
                      "tx_type": "sell",
                      "tx_hash": "MCUsTrq9kxxLncqYLPEEBBhnB6qQ8xzpFQ61v9WDpHuLWhKhpPk3Y72KDB8ZaYFAF4sQ1ePmMpeyv8XajRhHGgL",
                      "ins_index": 2,
                      "inner_ins_index": 0,
                      "block_unix_time": 1741033247,
                      "block_number": 324378317,
                      "volume_usd": 2.1354753332522916,
                      "volume": 0.01491951,
                      "owner": "DYQjtsirB7yK78ivZRa8xMvAjmGo2zqsBqmW1Aek67h5",
                      "signers": [
                        "DYQjtsirB7yK78ivZRa8xMvAjmGo2zqsBqmW1Aek67h5"
                      ],
                      "source": "raydium_cp",
                      "side": "sell",
                      "alias": null,
                      "price_pair": 253778.18630672188,
                      "from": {
                        "symbol": "SOL",
                        "address": "So11111111111111111111111111111111111111112",
                        "decimals": 9,
                        "price": 143.13307429347824,
                        "amount": 14919510,
                        "ui_amount": 0.01491951,
                        "ui_change_amount": -0.01491951
                      },
                      "to": {
                        "symbol": "TRM",
                        "address": "E8ks5e8tegXXR2w4Rr2Bd4mvKEwfwdmEVKUjc4iEusdt",
                        "decimals": 9,
                        "price": 0.0005936932412742374,
                        "amount": 3786246188385,
                        "ui_amount": 3786.246188385,
                        "ui_change_amount": 3786.246188385
                      },
                      "pool_id": "8HiHe9KtMQhjXNKpcEoLRRfn3xSU8TUbAi2xCR5QJWCc"
                    }
                  ],
                  "has_next": true
                },
                "success": true
              }
            },
            "TokenTxsAddLiquid": {
              "value": {
                "data": {
                  "items": [
                    {
                      "tx_type": "add",
                      "tx_hash": "4YQCb9m5RCTKVqrXVyBV67wQzn9gqJLy3f9UJY6MaeJFmFhMHqVtmru52iHt77PSFmBg7G3HbA8Lv9u1Urpr4jis",
                      "ins_index": 2,
                      "inner_ins_index": 0,
                      "block_unix_time": 1740380441,
                      "block_number": 322728946,
                      "volume_usd": 0,
                      "owner": "6rugaR3NysRzG42PDmJGMGDegzVALkXTSSEefQmPz17P",
                      "signers": [
                        "6rugaR3NysRzG42PDmJGMGDegzVALkXTSSEefQmPz17P"
                      ],
                      "source": "pump_dot_fun",
                      "alias": null,
                      "pool_id": "8Wp84g9RsXzJAj1ScEeWb3oynRXjGKPyGPwXrua5gpEV",
                      "tokens": [
                        {
                          "address": "9gNot3AX9Q5efNAMLEhaNwnxDWLV3jfUNHqyQTmdpump",
                          "decimals": 6,
                          "amount": "1000000000000000",
                          "ui_amount": 1000000000
                        },
                        {
                          "symbol": "SOL",
                          "address": "So11111111111111111111111111111111111111112",
                          "decimals": 9,
                          "amount": 0,
                          "ui_amount": 0
                        }
                      ]
                    }
                  ],
                  "has_next": true
                },
                "success": true
              }
            },
            "TokenTxsRemoveLiquid": {
              "value": {
                "data": {
                  "items": [
                    {
                      "tx_type": "remove",
                      "tx_hash": "44xsqnqTgUwRyQrzjxKtj81Y1ETcdS8DqWMbjWkgfBCLSftQZHx6d4kxYLNAyCK9zf5WhE4aaWCFbaPwuz5YL1Fw",
                      "ins_index": 2,
                      "inner_ins_index": 0,
                      "block_unix_time": 1741033233,
                      "block_number": 324378282,
                      "volume_usd": 2319997.207389228,
                      "owner": "DhwspzurnruXtQ7YLQWx9g3fm9YmXW8KKYbFo1jMZgMR",
                      "signers": [
                        "DhwspzurnruXtQ7YLQWx9g3fm9YmXW8KKYbFo1jMZgMR"
                      ],
                      "source": "raydium_cp",
                      "alias": null,
                      "pool_id": "44GB8HbKnWMH6qrVTtrj37tUrAqgKzcxk5BDj3boHjJF",
                      "tokens": [
                        {
                          "symbol": "SOL",
                          "address": "So11111111111111111111111111111111111111112",
                          "decimals": 9,
                          "amount": 313635269787,
                          "ui_amount": 313.635269787
                        },
                        {
                          "symbol": "EYE",
                          "address": "2WwMDUiB3RGoDQTxivLYRAo1tqGiNcNUZNkGLmytTEYE",
                          "decimals": 6,
                          "amount": 2678077330656,
                          "ui_amount": 2678077.330656
                        }
                      ]
                    }
                  ],
                  "has_next": true
                },
                "success": true
              }
            },
            "SolanaScaledUIAmount": {
              "value": {
                "success": true,
                "data": {
                  "items": [
                    {
                      "tx_type": "buy",
                      "tx_hash": "351zF2LEwyW9izUT9WeKEL4yr3Ej4fjwDgbuijWSMTsCZoXHVverNwUEh4YjggAcYAP8j2cv1BW9j2CFNWbXUGSh",
                      "ins_index": 2,
                      "inner_ins_index": null,
                      "block_unix_time": 1754884657,
                      "block_number": 359261557,
                      "volume_usd": 37.190281762690454,
                      "volume": 0.200754834,
                      "owner": "2s44dURNXwC65t7t9XSZfRWA9eyXJDfWTPHDv8jbDKNp",
                      "signers": [
                        "2s44dURNXwC65t7t9XSZfRWA9eyXJDfWTPHDv8jbDKNp"
                      ],
                      "source": "pump_amm",
                      "interacted_program_id": "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA",
                      "side": "buy",
                      "alias": null,
                      "price_pair": 6458965.17052237,
                      "from": {
                        "symbol": "ZUMI",
                        "address": "H5UjPsXoxaJAkAcpkfs7Fds3T6oypK7BwLgTFUtTs6vy",
                        "decimals": 6,
                        "price": 0.000028681411107415812,
                        "amount": "1296668480620",
                        "ui_amount": 1296668.48062,
                        "ui_change_amount": -1296668.48062,
                        "is_scaled_ui_token": false,
                        "multiplier": null
                      },
                      "to": {
                        "symbol": "SOL",
                        "address": "So11111111111111111111111111111111111111112",
                        "decimals": 9,
                        "price": 185.25223538423216,
                        "amount": "200754834",
                        "ui_amount": 0.200754834,
                        "ui_change_amount": 0.200754834,
                        "is_scaled_ui_token": false,
                        "multiplier": null
                      },
                      "pool_id": "D45QQMsxGhohYXGZKDJEowMv2HArrKAsw5V3JnyDZWeS"
                    }
                  ],
                  "hasNext": true
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
  "operationId": "get-defi-v3-token-txs-by-volume",
  "x-mint": {
    "href": "/data-api/transactions/get-defi-v3-token-txs-by-volume"
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
