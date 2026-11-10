---
title: "Trades - Token Seek By Time"
description: "Retrieve a list of trades of a specified token with time bound option."
hidden: false
metadata:
  title: Birdeye Data API | Trades - Token Seek By Time
  description: Retrieve a list of trades of a specified token with time bound option.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/txs/token/seek_by_time"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Time-bounded legacy trade sync for one token.</strong></p>
  <ul>
    <li>Pass the token address in <code>address</code>.</li>
    <li><code>limit</code> supports <code>1</code> to <code>100</code> items per request, and <code>offset</code> supports up to <code>10,000</code>.</li>
    <li>Use <code>before_time</code> and <code>after_time</code> to step through historical windows.</li>
    <li>Insights in the response:</li>
    <li><code>price</code>: the executed price of the trade at the exact moment the transaction occurred.</li>
    <li><code>nearestPrice</code>: the closest available market price to the transaction timestamp from Birdeye's price index.</li>
    <li><code>basePrice</code>: the USD price of the base token at the time of the trade.</li>
    <li><code>quotePrice</code>: the USD price of the quote token at the time of the trade.</li>
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
    <li>Fetch historical token trades starting from a specific timestamp.</li>
    <li>Perfect for syncing trade data into your database or analytics tools.</li>
    <li>Enables building time-based trade charts or volume trend analysis.</li>
    <li>Combine with real-time transaction endpoints to create full trade timelines.</li>
    <li>Great for tracking whale activity, token movements, or suspicious patterns.</li>
    <li>Backfill token trades into a database with explicit time windows.</li>
    <li>Reconstruct trade timelines around launches, news, or whale activity.</li>
    <li>Build historical trade charts and flow analytics from raw events.</li>
    <li>Continue ingestion from a known checkpoint instead of replaying the entire feed.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Pass the token address in <code>address</code>.</li>
    <li>Use <code>after_time</code> and <code>before_time</code> to define the window you want.</li>
    <li>Page through dense windows with <code>offset</code> and <code>limit</code>, keeping <code>limit</code> at <code>100</code> or below.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use fixed window sizes in your backfill jobs so retries and deduplication stay simple.</li>
    <li>Treat <code>nearestPrice</code> as a reference price, not the executed fill price.</li>
    <li>Switch to V3 token trades if you later need owner, source, or block-range filters.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/txs/token/seek_by_time

```json
{
  "tags": [
    "Transactions"
  ],
  "summary": "Trades - Token Seek By Time",
  "description": "Retrieve a list of trades of a specified token with time bound option.",
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
        ],
        "default": "swap"
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
                    "description": "Trades for the requested token, ordered by the endpoint's default sort.",
                    "items": {
                      "type": "object",
                      "description": "One trade returned by token transaction endpoints.",
                      "additionalProperties": true,
                      "properties": {
                        "quote": {
                          "type": "object",
                          "description": "One token leg inside a legacy trade response. Values may be raw integers or strings depending on chain and serializer.",
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
                            "decimals": {
                              "type": "integer",
                              "description": "Number of decimals used by the token."
                            },
                            "address": {
                              "type": "string",
                              "description": "Token mint or contract address."
                            },
                            "mint": {
                              "type": "string",
                              "description": "Mint or token contract address on some EVM responses."
                            },
                            "amount": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Raw token amount before decimal scaling."
                            },
                            "uiAmount": {
                              "type": "number",
                              "description": "Human-readable token amount after decimals are applied."
                            },
                            "price": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Indexed USD price for this token at the exact transaction time when available."
                            },
                            "nearestPrice": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Closest indexed USD price near the transaction time when the exact trade-time price is unavailable."
                            },
                            "changeAmount": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Signed raw balance change for this leg in the wallet or swap flow."
                            },
                            "uiChangeAmount": {
                              "type": "number",
                              "description": "Signed human-readable balance change for this leg."
                            },
                            "feeInfo": {
                              "type": [
                                "object",
                                "null"
                              ],
                              "description": "Optional fee metadata for this leg.",
                              "additionalProperties": true
                            },
                            "type": {
                              "type": "string",
                              "description": "Low-level event type for this leg such as `log`, `burn`, `mintTo`, or `transfer`."
                            },
                            "typeSwap": {
                              "type": "string",
                              "description": "Legacy swap direction marker for this leg, such as `from` or `to`."
                            },
                            "type_swap": {
                              "type": "string",
                              "description": "Swap direction marker for this leg in snake_case responses, such as `from` or `to`."
                            },
                            "isScaledUiToken": {
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
                        "base": {
                          "type": "object",
                          "description": "One token leg inside a legacy trade response. Values may be raw integers or strings depending on chain and serializer.",
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
                            "decimals": {
                              "type": "integer",
                              "description": "Number of decimals used by the token."
                            },
                            "address": {
                              "type": "string",
                              "description": "Token mint or contract address."
                            },
                            "mint": {
                              "type": "string",
                              "description": "Mint or token contract address on some EVM responses."
                            },
                            "amount": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Raw token amount before decimal scaling."
                            },
                            "uiAmount": {
                              "type": "number",
                              "description": "Human-readable token amount after decimals are applied."
                            },
                            "price": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Indexed USD price for this token at the exact transaction time when available."
                            },
                            "nearestPrice": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Closest indexed USD price near the transaction time when the exact trade-time price is unavailable."
                            },
                            "changeAmount": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Signed raw balance change for this leg in the wallet or swap flow."
                            },
                            "uiChangeAmount": {
                              "type": "number",
                              "description": "Signed human-readable balance change for this leg."
                            },
                            "feeInfo": {
                              "type": [
                                "object",
                                "null"
                              ],
                              "description": "Optional fee metadata for this leg.",
                              "additionalProperties": true
                            },
                            "type": {
                              "type": "string",
                              "description": "Low-level event type for this leg such as `log`, `burn`, `mintTo`, or `transfer`."
                            },
                            "typeSwap": {
                              "type": "string",
                              "description": "Legacy swap direction marker for this leg, such as `from` or `to`."
                            },
                            "type_swap": {
                              "type": "string",
                              "description": "Swap direction marker for this leg in snake_case responses, such as `from` or `to`."
                            },
                            "isScaledUiToken": {
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
                          "description": "One token leg inside a legacy trade response. Values may be raw integers or strings depending on chain and serializer.",
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
                            "decimals": {
                              "type": "integer",
                              "description": "Number of decimals used by the token."
                            },
                            "address": {
                              "type": "string",
                              "description": "Token mint or contract address."
                            },
                            "mint": {
                              "type": "string",
                              "description": "Mint or token contract address on some EVM responses."
                            },
                            "amount": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Raw token amount before decimal scaling."
                            },
                            "uiAmount": {
                              "type": "number",
                              "description": "Human-readable token amount after decimals are applied."
                            },
                            "price": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Indexed USD price for this token at the exact transaction time when available."
                            },
                            "nearestPrice": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Closest indexed USD price near the transaction time when the exact trade-time price is unavailable."
                            },
                            "changeAmount": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Signed raw balance change for this leg in the wallet or swap flow."
                            },
                            "uiChangeAmount": {
                              "type": "number",
                              "description": "Signed human-readable balance change for this leg."
                            },
                            "feeInfo": {
                              "type": [
                                "object",
                                "null"
                              ],
                              "description": "Optional fee metadata for this leg.",
                              "additionalProperties": true
                            },
                            "type": {
                              "type": "string",
                              "description": "Low-level event type for this leg such as `log`, `burn`, `mintTo`, or `transfer`."
                            },
                            "typeSwap": {
                              "type": "string",
                              "description": "Legacy swap direction marker for this leg, such as `from` or `to`."
                            },
                            "type_swap": {
                              "type": "string",
                              "description": "Swap direction marker for this leg in snake_case responses, such as `from` or `to`."
                            },
                            "isScaledUiToken": {
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
                          "description": "One token leg inside a legacy trade response. Values may be raw integers or strings depending on chain and serializer.",
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
                            "decimals": {
                              "type": "integer",
                              "description": "Number of decimals used by the token."
                            },
                            "address": {
                              "type": "string",
                              "description": "Token mint or contract address."
                            },
                            "mint": {
                              "type": "string",
                              "description": "Mint or token contract address on some EVM responses."
                            },
                            "amount": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Raw token amount before decimal scaling."
                            },
                            "uiAmount": {
                              "type": "number",
                              "description": "Human-readable token amount after decimals are applied."
                            },
                            "price": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Indexed USD price for this token at the exact transaction time when available."
                            },
                            "nearestPrice": {
                              "type": [
                                "number",
                                "null"
                              ],
                              "description": "Closest indexed USD price near the transaction time when the exact trade-time price is unavailable."
                            },
                            "changeAmount": {
                              "type": [
                                "number",
                                "string"
                              ],
                              "description": "Signed raw balance change for this leg in the wallet or swap flow."
                            },
                            "uiChangeAmount": {
                              "type": "number",
                              "description": "Signed human-readable balance change for this leg."
                            },
                            "feeInfo": {
                              "type": [
                                "object",
                                "null"
                              ],
                              "description": "Optional fee metadata for this leg.",
                              "additionalProperties": true
                            },
                            "type": {
                              "type": "string",
                              "description": "Low-level event type for this leg such as `log`, `burn`, `mintTo`, or `transfer`."
                            },
                            "typeSwap": {
                              "type": "string",
                              "description": "Legacy swap direction marker for this leg, such as `from` or `to`."
                            },
                            "type_swap": {
                              "type": "string",
                              "description": "Swap direction marker for this leg in snake_case responses, such as `from` or `to`."
                            },
                            "isScaledUiToken": {
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
                        "basePrice": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Indexed USD price of the base token at the transaction time."
                        },
                        "quotePrice": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Indexed USD price of the quote token at the transaction time."
                        },
                        "txHash": {
                          "type": "string",
                          "description": "Transaction signature or hash."
                        },
                        "source": {
                          "type": "string",
                          "description": "DEX, AMM, or protocol source of the trade."
                        },
                        "blockUnixTime": {
                          "type": "integer",
                          "description": "Block timestamp in Unix seconds."
                        },
                        "txType": {
                          "type": "string",
                          "description": "Transaction classification, typically `swap`."
                        },
                        "owner": {
                          "type": "string",
                          "description": "Primary wallet that initiated or owned the trade flow."
                        },
                        "side": {
                          "type": "string",
                          "description": "Trade side relative to the requested token, such as `buy` or `sell`."
                        },
                        "alias": {
                          "type": [
                            "string",
                            "null"
                          ],
                          "description": "Optional label for the owner wallet when available."
                        },
                        "pricePair": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Executed pair price derived from the traded base and quote amounts."
                        },
                        "tokenPrice": {
                          "type": [
                            "number",
                            "null"
                          ],
                          "description": "Indexed USD price of the requested token at the transaction time."
                        },
                        "poolId": {
                          "type": [
                            "string",
                            "null"
                          ],
                          "description": "Pool or market address associated with the trade."
                        }
                      }
                    }
                  },
                  "hasNext": {
                    "type": "boolean",
                    "description": "Whether more records are available for pagination."
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
                      "quote": {
                        "symbol": "SOL",
                        "decimals": 9,
                        "address": "So11111111111111111111111111111111111111112",
                        "amount": "83",
                        "uiAmount": 8.3e-8,
                        "price": 133.58588874466795,
                        "changeAmount": 83,
                        "uiChangeAmount": 8.3e-8,
                        "isScaledUiToken": false,
                        "multiplier": null
                      },
                      "base": {
                        "symbol": "Poppy",
                        "decimals": 6,
                        "address": "7Am9kVe9qymLGzLu9LnGFT6pX43DAuMYBLveSRijpump",
                        "amount": "2999999",
                        "uiAmount": 2.999999,
                        "price": 0.000003840642989117913,
                        "changeAmount": -2999999,
                        "uiChangeAmount": -2.999999,
                        "isScaledUiToken": false,
                        "multiplier": null
                      },
                      "basePrice": 0.000003840642989117913,
                      "quotePrice": 133.58588874466795,
                      "txHash": "2rfQEtcrKmbCrwLet9REvUMWd6PoKjRV5fjUhYfmUjdS3ECkwF12s2bmswi8VGYxX1zp96nTfFxeSafjxDmASH6q",
                      "source": "pump_dot_fun",
                      "blockUnixTime": 1741531132,
                      "txType": "swap",
                      "owner": "J8RsYYa1CSsRi77aThfy48YPc7K5gwaepQDdvz2E3UoM",
                      "side": "buy",
                      "alias": null,
                      "pricePair": 36144566.26506024,
                      "from": {
                        "symbol": "Poppy",
                        "decimals": 6,
                        "address": "7Am9kVe9qymLGzLu9LnGFT6pX43DAuMYBLveSRijpump",
                        "amount": "2999999",
                        "uiAmount": 2.999999,
                        "price": 0.000003840642989117913,
                        "changeAmount": -2999999,
                        "uiChangeAmount": -2.999999,
                        "isScaledUiToken": false,
                        "multiplier": null
                      },
                      "to": {
                        "symbol": "SOL",
                        "decimals": 9,
                        "address": "So11111111111111111111111111111111111111112",
                        "amount": "83",
                        "uiAmount": 8.3e-8,
                        "price": 133.58588874466795,
                        "changeAmount": 83,
                        "uiChangeAmount": 8.3e-8,
                        "isScaledUiToken": false,
                        "multiplier": null
                      },
                      "tokenPrice": 133.58588874466795,
                      "poolId": "2qPLBXMp8YvQyM1SDQ4QoYF314jcLzM86NpMUF6Wni6H"
                    }
                  ],
                  "hasNext": true
                }
              }
            },
            "TokenTransactions": {
              "value": {
                "success": true,
                "data": {
                  "items": [
                    {
                      "quote": {
                        "symbol": "Pnut ",
                        "decimals": 6,
                        "address": "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
                        "amount": 315220781,
                        "feeInfo": null,
                        "uiAmount": 315.220781,
                        "price": null,
                        "nearestPrice": 2.1228198408315455,
                        "changeAmount": 315220781,
                        "uiChangeAmount": 315.220781
                      },
                      "base": {
                        "symbol": "SOL",
                        "decimals": 9,
                        "address": "So11111111111111111111111111111111111111112",
                        "amount": 3059408483,
                        "uiAmount": 3.059408483,
                        "price": null,
                        "nearestPrice": 218.81293132875214,
                        "changeAmount": -3059408483,
                        "uiChangeAmount": -3.059408483
                      },
                      "basePrice": null,
                      "quotePrice": null,
                      "txHash": "SYypBp6KSdMSfe3M2m4qK86p2JDJRmNKPrqwDxGb3MuPYq6yPodWApoEQBXAvzpfTf9WCmCFbEkPEM4HET84u2L",
                      "source": "raydium_clamm",
                      "blockUnixTime": 1731556704,
                      "txType": "swap",
                      "owner": "AmTRLjX9T8KktBBnw1F78DyDb17fr6L8BNpEgCPGs5eM",
                      "side": "sell",
                      "alias": null,
                      "pricePair": 103.0332440900145,
                      "from": {
                        "symbol": "SOL",
                        "decimals": 9,
                        "address": "So11111111111111111111111111111111111111112",
                        "amount": 3059408483,
                        "uiAmount": 3.059408483,
                        "price": null,
                        "nearestPrice": 218.81293132875214,
                        "changeAmount": -3059408483,
                        "uiChangeAmount": -3.059408483
                      },
                      "to": {
                        "symbol": "Pnut ",
                        "decimals": 6,
                        "address": "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
                        "amount": 315220781,
                        "feeInfo": null,
                        "uiAmount": 315.220781,
                        "price": null,
                        "nearestPrice": 2.1228198408315455,
                        "changeAmount": 315220781,
                        "uiChangeAmount": 315.220781
                      },
                      "tokenPrice": null,
                      "poolId": "8oT91ooChsr7aHTHha9oJxKTYwUhZ75tjJ6bhtiggG5Y"
                    },
                    {
                      "quote": {
                        "symbol": "USDC",
                        "decimals": 6,
                        "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                        "amount": "20003691",
                        "uiAmount": 20.003691,
                        "price": null,
                        "nearestPrice": 0.99995378,
                        "changeAmount": -20003691,
                        "uiChangeAmount": -20.003691
                      },
                      "base": {
                        "symbol": "SOL",
                        "decimals": 9,
                        "address": "So11111111111111111111111111111111111111112",
                        "amount": "90851454",
                        "feeInfo": null,
                        "uiAmount": 0.090851454,
                        "price": null,
                        "nearestPrice": 218.81293132875214,
                        "changeAmount": "90851454",
                        "uiChangeAmount": 0.090851454
                      },
                      "basePrice": null,
                      "quotePrice": null,
                      "txHash": "5hEDZZXh9PJreM16Wp7UVYzuVvDy2u9vvzaHeP7gnfRh9ebv6CLnnPuUgxjKCfsLt5FwpgohAw3hhzBjFbnEkVTB",
                      "source": "meteora_dlmm",
                      "blockUnixTime": 1731556704,
                      "txType": "swap",
                      "owner": "HV1KXxWFaSeriyFvXyx48FqG9BoFbfinB8njCJonqP7K",
                      "side": "buy",
                      "alias": null,
                      "pricePair": 220.18019656570385,
                      "from": {
                        "symbol": "USDC",
                        "decimals": 6,
                        "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                        "amount": "20003691",
                        "uiAmount": 20.003691,
                        "price": null,
                        "nearestPrice": 0.99995378,
                        "changeAmount": -20003691,
                        "uiChangeAmount": -20.003691
                      },
                      "to": {
                        "symbol": "SOL",
                        "decimals": 9,
                        "address": "So11111111111111111111111111111111111111112",
                        "amount": "90851454",
                        "feeInfo": null,
                        "uiAmount": 0.090851454,
                        "price": null,
                        "nearestPrice": 218.81293132875214,
                        "changeAmount": "90851454",
                        "uiChangeAmount": 0.090851454
                      },
                      "tokenPrice": null,
                      "poolId": "sZxb9vrxJBpFiJBogovhfkYqfapVzveLEU4TmzWv4GN"
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
  "operationId": "get-defi-txs-token-seek_by_time",
  "x-mint": {
    "href": "/data-api/transactions/get-defi-txs-token-seek-by-time"
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
