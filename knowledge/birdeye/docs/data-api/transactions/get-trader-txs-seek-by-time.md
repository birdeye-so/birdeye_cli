---
title: "Trader - Trades Seek By Time"
description: "Retrieve a list of trades of a trader with time bound option."
hidden: false
metadata:
  title: Birdeye Data API | Trader - Trades Seek By Time
  description: Retrieve a list of trades of a trader with time bound option.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /trader/txs/seek_by_time"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Time-bounded trade history for one trader wallet.</strong></p>
  <ul>
    <li>Pass the trader wallet in <code>address</code>.</li>
    <li><code>limit</code> supports <code>1</code> to <code>100</code> items per request.</li>
    <li>Use <code>before_time</code> and <code>after_time</code> to retrieve wallet trade activity over a chosen window.</li>
    <li>Insights in the response:</li>
    <li><code>price</code>: the executed price of the trade at the exact moment the transaction occurred.</li>
    <li><code>nearestPrice</code>: the closest available market price to the transaction timestamp from Birdeye's price index.</li>
    <li><code>basePrice</code>: the USD price of the base token at the time of the trade.</li>
    <li><code>quotePrice</code>: the USD price of the quote token at the time of the trade.</li>
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
    <li>This endpoint consumes <code>10 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Retrieve historical trades for a specific trader from a given timestamp.</li>
    <li>Useful for trader behavior analysis, execution review, and wallet-level flow reconstruction.</li>
    <li>Great for tracking whale activity, token movements, or suspicious patterns.</li>
    <li>Reconstruct a wallet's trading timeline over a specific period.</li>
    <li>Review whether a trader accumulated, flipped, or exited around a market event.</li>
    <li>Backfill trader-centric execution data into performance or behavior models.</li>
    <li>Investigate how one wallet's trade path aligned with token or market-level moves.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Pass the trader wallet in <code>address</code>.</li>
    <li>Bound the query with <code>after_time</code> and <code>before_time</code>.</li>
    <li>Page with <code>offset</code> and <code>limit</code>, keeping <code>limit</code> at <code>100</code> or below.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use deterministic time windows for trader backfills so retries and deduplication stay clean.</li>
    <li>Join the wallet's trades with holder, PnL, or token-level trade views when investigating attribution.</li>
    <li>Treat <code>nearestPrice</code> as reference context and <code>price</code> as the actual executed trade price.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /trader/txs/seek_by_time

```json
{
  "tags": [
    "Transactions"
  ],
  "summary": "Trader - Trades Seek By Time",
  "description": "Retrieve a list of trades of a trader with time bound option.",
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
      "description": "The address of a trader.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana": {
          "value": "GBJ4MZe8fqpA6UVgjh19BwJPMb79KDfMv78XnFVxgH2Q"
        },
        "ethereum": {
          "value": "0xE76aDA2ADE5585859789b3500DDE494e5479fb75"
        }
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
        ]
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
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing transactions of a trader",
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
                      "quote": {
                        "symbol": "SOL",
                        "decimals": 9,
                        "address": "So11111111111111111111111111111111111111112",
                        "amount": 8791828613200,
                        "type": "split",
                        "type_swap": "to",
                        "ui_amount": 8791.8286132,
                        "price": 182.32478738013168,
                        "nearest_price": 182.32478738013168,
                        "change_amount": 8791828613200,
                        "ui_change_amount": 8791.8286132,
                        "is_scaled_ui_token": false,
                        "multiplier": null
                      },
                      "base": {
                        "symbol": "BNSOL",
                        "decimals": 9,
                        "address": "BNso1VUJnh4zcfpZa6986Ea66P6TCp59hvtNJ8b1X85",
                        "amount": 8243057055060,
                        "type": "burn",
                        "type_swap": "from",
                        "ui_amount": 8243.05705506,
                        "price": 195.07266605796318,
                        "nearest_price": 195.07266605796318,
                        "change_amount": -8243057055060,
                        "ui_change_amount": -8243.05705506,
                        "is_scaled_ui_token": false,
                        "multiplier": null
                      },
                      "base_price": 195.07266605796318,
                      "quote_price": 182.32478738013168,
                      "tx_hash": "3tiVFmNkAzesSgJ8RJfRMFSMSTGMbvVd8Qm23uroSCPQFSi6rqhr9tqCCRCu4nZD8u3jLVMcuh3qxmEzFnbS61rF",
                      "source": "stake_pool",
                      "block_unix_time": 1754870741,
                      "tx_type": "swap",
                      "address": "Hr9pzexrBge3vgmBNRR8u42CNQgBXdHm4UkUN2DH4a7r",
                      "owner": "GBJ4MZe8fqpA6UVgjh19BwJPMb79KDfMv78XnFVxgH2Q",
                      "block_number": 359226070,
                      "volume_usd": 1602968.2825842479,
                      "volume": 8243.05705506,
                      "ins_index": 2,
                      "inner_ins_index": 0,
                      "signers": [
                        "GBJ4MZe8fqpA6UVgjh19BwJPMb79KDfMv78XnFVxgH2Q",
                        "5Z4RXtFUSBzQeptBRxBT4PHFMdMqgTt6YXNwEgngcSQ7"
                      ],
                      "interacted_program_id": "bn1dUNRecofQLxcGp895mGmKEVtFLMjdvjxBjFqhFU7"
                    }
                  ],
                  "hasNext": true
                }
              }
            },
            "Solana": {
              "value": {
                "success": true,
                "data": {
                  "items": [
                    {
                      "quote": {
                        "symbol": "SOL",
                        "decimals": 9,
                        "address": "So11111111111111111111111111111111111111112",
                        "amount": 1514222137120,
                        "type": "transfer",
                        "type_swap": "from",
                        "ui_amount": 1514.22213712,
                        "price": 147.08334361834326,
                        "nearest_price": 147.08334361834326,
                        "change_amount": -1514222137120,
                        "ui_change_amount": -1514.22213712
                      },
                      "base": {
                        "symbol": "BNSOL",
                        "decimals": 9,
                        "address": "BNso1VUJnh4zcfpZa6986Ea66P6TCp59hvtNJ8b1X85",
                        "amount": 1430091473491,
                        "type": "mintTo",
                        "type_swap": "to",
                        "ui_amount": 1430.091473491,
                        "price": 155.4548663026571,
                        "nearest_price": 155.4548663026571,
                        "change_amount": 1430091473491,
                        "ui_change_amount": 1430.091473491
                      },
                      "base_price": 155.4548663026571,
                      "quote_price": 147.08334361834326,
                      "tx_hash": "3fXZUQds8F1vCPwCvB8hSNumrzHjTmCgLdmNdqAWTBvrWuJE71XqdLmnK9wkZPahJQdJidadCMjKbXKF7rAAvByt",
                      "source": "stake_pool",
                      "block_unix_time": 1750377939,
                      "tx_type": "swap",
                      "address": "Hr9pzexrBge3vgmBNRR8u42CNQgBXdHm4UkUN2DH4a7r",
                      "owner": "GBJ4MZe8fqpA6UVgjh19BwJPMb79KDfMv78XnFVxgH2Q",
                      "block_number": 347921215,
                      "volume_usd": 222716.85490852306,
                      "volume": 1430.091473491,
                      "ins_index": 1,
                      "inner_ins_index": 0,
                      "signers": [
                        "GBJ4MZe8fqpA6UVgjh19BwJPMb79KDfMv78XnFVxgH2Q"
                      ],
                      "interacted_program_id": "bn1dUNRecofQLxcGp895mGmKEVtFLMjdvjxBjFqhFU7"
                    }
                  ],
                  "hasNext": true
                }
              }
            },
            "EVM": {
              "value": {
                "data": {
                  "items": [
                    {
                      "quote": {
                        "symbol": "USDTB",
                        "decimals": 18,
                        "address": "0xC139190F447e929f090Edeb554D95AbB8b18aC1C",
                        "name": "USDtb",
                        "amount": 93773757100000000000,
                        "mint": "0xC139190F447e929f090Edeb554D95AbB8b18aC1C",
                        "type_swap": "from",
                        "ui_amount": 93.7737571,
                        "price": 1.000610301093257,
                        "nearest_price": 1.0001633146747766,
                        "change_amount": -93773757100000000000,
                        "ui_change_amount": -93.7737571
                      },
                      "base": {
                        "symbol": "USDE",
                        "decimals": 18,
                        "address": "0x4c9EDD5852cd905f086C759E8383e09bff1E68B3",
                        "name": "Ethena USDe",
                        "amount": 93874755715366390000,
                        "mint": "0x4c9EDD5852cd905f086C759E8383e09bff1E68B3",
                        "type_swap": "to",
                        "ui_amount": 93.87475571536639,
                        "price": 0.9995337576267879,
                        "nearest_price": 0.9995337576267879,
                        "change_amount": 93874755715366390000,
                        "ui_change_amount": 93.87475571536639
                      },
                      "base_price": 0.9995337576267879,
                      "quote_price": 1.000610301093257,
                      "tx_hash": "0x87a45becbdfae806c25dd75d5aec6fe40e5d646e63fdb24e2a5697aae02b2663",
                      "source": "0x2D9Bf9C1beFd77C094461df615bdbE905895f7C6",
                      "block_unix_time": 1744125659,
                      "tx_type": "swap",
                      "address": "0x2D9Bf9C1beFd77C094461df615bdbE905895f7C6",
                      "owner": "0xE76aDA2ADE5585859789b3500DDE494e5479fb75",
                      "block_number": 22225044,
                      "volume_usd": 93.83098732647694,
                      "volume": 93.87475571536639,
                      "ins_index": 4,
                      "interacted_program_id": "0x45312ea0eFf7E09C83CBE249fa1d7598c4C8cd4e"
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
  "operationId": "get-trader-txs-seek_by_time",
  "x-mint": {
    "href": "/data-api/transactions/get-trader-txs-seek-by-time"
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
