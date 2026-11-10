---
title: "Trades - Token"
description: "Retrieve a list of trades of a specified token."
hidden: false
metadata:
  title: Birdeye Data API | Trades - Token
  description: Retrieve a list of trades of a specified token.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/txs/token"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Legacy trade list for one token.</strong></p>
  <ul>
    <li>Pass the token address in <code>address</code>.</li>
    <li><code>limit</code> supports <code>1</code> to <code>50</code> items per request, and <code>offset</code> supports up to <code>50,000</code>.</li>
    <li><code>tx_type</code> defaults to <code>swap</code> and can also be used to inspect liquidity actions such as <code>add</code> and <code>remove</code>.</li>
    <li><code>ui_amount_mode</code> controls Solana Token-2022 scaled amounts; on non-Solana chains it is normalized to <code>scaled</code>.</li>
    <li>Use descending sort when you want the most recent trades first.</li>
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
    <li>View the latest on-chain trades for a specific token.</li>
    <li>Great for tracking whale activity, token movements, or suspicious patterns.</li>
    <li>Show the latest on-chain trades for a token on a detail page or monitoring dashboard.</li>
    <li>Inspect swaps and liquidity actions around launches, pumps, or distribution events.</li>
    <li>Build compact trade tapes without the heavier V3 filtering model.</li>
    <li>Join recent trades with price and holder data for quick market context.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Pass the token address in <code>address</code>.</li>
    <li>Page with <code>offset</code> and <code>limit</code>, keeping <code>limit</code> at <code>50</code> or below.</li>
    <li>Use <code>tx_type</code> to focus on swaps or liquidity actions.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use descending sort when the UI is meant to show the newest activity first.</li>
    <li>Keep pagination windows small on very active tokens so refreshes stay responsive.</li>
    <li>Move to <code>Trades - Token (V3)</code> when you need owner, source, pool, or block-range filters.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/txs/token

```json
{
  "tags": [
    "Transactions"
  ],
  "summary": "Trades - Token",
  "description": "Retrieve a list of trades of a specified token.",
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
        "default": 50,
        "minimum": 1,
        "maximum": 50
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
                        "symbol": "SHIPE",
                        "decimals": 6,
                        "address": "9K78h3XEb7qqRu4XEaAEhe3qXaAeN1XyHa65bLwKXaNp",
                        "amount": 3000940514830,
                        "uiAmount": 3000940.51483,
                        "price": 0.00008920248678973954,
                        "nearestPrice": 0.00008879906452142359,
                        "changeAmount": 3000940514830,
                        "uiChangeAmount": 3000940.51483,
                        "isScaledUiToken": false,
                        "multiplier": null
                      },
                      "base": {
                        "symbol": "SOL",
                        "decimals": 9,
                        "address": "So11111111111111111111111111111111111111112",
                        "amount": 1452043321,
                        "uiAmount": 1.452043321,
                        "price": 184.35493814782487,
                        "nearestPrice": 184.35493814782487,
                        "changeAmount": -1452043321,
                        "uiChangeAmount": -1.452043321,
                        "isScaledUiToken": false,
                        "multiplier": null
                      },
                      "basePrice": 184.35493814782487,
                      "quotePrice": 0.00008920248678973954,
                      "txHash": "NLiBctRYuhibKZCJPkPxGhDKi9pCo2fx818H1UBJ82gD5DKddvufzf5DAPVKkLgejQ4EezcgE72FUrf327VQGaV",
                      "source": "pump_amm",
                      "blockUnixTime": 1754883867,
                      "txType": "swap",
                      "owner": "5V7aauQjnizwXAPGcJnjC7mbpenbiQZBfBSxW3n7NGCD",
                      "side": "sell",
                      "alias": null,
                      "pricePair": 2066701.7790924432,
                      "from": {
                        "symbol": "SOL",
                        "decimals": 9,
                        "address": "So11111111111111111111111111111111111111112",
                        "amount": 1452043321,
                        "uiAmount": 1.452043321,
                        "price": 184.35493814782487,
                        "nearestPrice": 184.35493814782487,
                        "changeAmount": -1452043321,
                        "uiChangeAmount": -1.452043321,
                        "isScaledUiToken": false,
                        "multiplier": null
                      },
                      "to": {
                        "symbol": "SHIPE",
                        "decimals": 6,
                        "address": "9K78h3XEb7qqRu4XEaAEhe3qXaAeN1XyHa65bLwKXaNp",
                        "amount": 3000940514830,
                        "uiAmount": 3000940.51483,
                        "price": 0.00008920248678973954,
                        "nearestPrice": 0.00008879906452142359,
                        "changeAmount": 3000940514830,
                        "uiChangeAmount": 3000940.51483,
                        "isScaledUiToken": false,
                        "multiplier": null
                      },
                      "tokenPrice": 184.35493814782487,
                      "poolId": "7LfK73yHk16kaSqa4FDB8t1oU445zzSsgMMC3at4eCFR"
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
                        "symbol": "POTUS",
                        "decimals": 6,
                        "address": "7hyHfdgxwtaj1QpQSJw3s4R2LMxShPpmr2GsCw9npump",
                        "amount": 13922809,
                        "feeInfo": null,
                        "uiAmount": 13.922809,
                        "price": null,
                        "nearestPrice": 0.00008581853084042329,
                        "changeAmount": 13922809,
                        "uiChangeAmount": 13.922809
                      },
                      "base": {
                        "symbol": "SOL",
                        "decimals": 9,
                        "address": "So11111111111111111111111111111111111111112",
                        "amount": 9090,
                        "uiAmount": 0.00000909,
                        "price": null,
                        "nearestPrice": 128.201119598627,
                        "changeAmount": -9090,
                        "uiChangeAmount": -0.00000909
                      },
                      "basePrice": null,
                      "quotePrice": null,
                      "txHash": "5G72183B77KafzKv4GEJNnDrV7rtspv5X5WM9yG9g1P89iG1UCGBuAqcMasgGhRYN24bmWsNPkQqptRbX5uoH44K",
                      "source": "raydium",
                      "blockUnixTime": 1726676178,
                      "txType": "swap",
                      "owner": "AavgaV4YKned3RN6JVMANKmAaVS2Tpfnw88HbYtzgBAn",
                      "side": "sell",
                      "alias": null,
                      "pricePair": 1531662.1562156219,
                      "from": {
                        "symbol": "SOL",
                        "decimals": 9,
                        "address": "So11111111111111111111111111111111111111112",
                        "amount": 9090,
                        "uiAmount": 0.00000909,
                        "price": null,
                        "nearestPrice": 128.201119598627,
                        "changeAmount": -9090,
                        "uiChangeAmount": -0.00000909
                      },
                      "to": {
                        "symbol": "POTUS",
                        "decimals": 6,
                        "address": "7hyHfdgxwtaj1QpQSJw3s4R2LMxShPpmr2GsCw9npump",
                        "amount": 13922809,
                        "feeInfo": null,
                        "uiAmount": 13.922809,
                        "price": null,
                        "nearestPrice": 0.00008581853084042329,
                        "changeAmount": 13922809,
                        "uiChangeAmount": 13.922809
                      },
                      "tokenPrice": null,
                      "poolId": "2L8fo6g6me9ZubZhH2iiz6616GouRbGeEuvNoGv69xWE"
                    },
                    {
                      "quote": {
                        "symbol": "PEAKY",
                        "decimals": 6,
                        "address": "62uBW5K24PdxXk185tNjz9pwzkpHinKt8qZznxPPpump",
                        "amount": 35238136,
                        "feeInfo": null,
                        "uiAmount": 35.238136,
                        "price": null,
                        "nearestPrice": 0.00003742796781669965,
                        "changeAmount": 35238136,
                        "uiChangeAmount": 35.238136
                      },
                      "base": {
                        "symbol": "SOL",
                        "decimals": 9,
                        "address": "So11111111111111111111111111111111111111112",
                        "amount": 10333,
                        "uiAmount": 0.000010333,
                        "price": null,
                        "nearestPrice": 128.201119598627,
                        "changeAmount": -10333,
                        "uiChangeAmount": -0.000010333
                      },
                      "basePrice": null,
                      "quotePrice": null,
                      "txHash": "zXdSLDTX4MVzunVJgFbJmiLY9z2hZ3n28w6bYvKn1aZVL1QZGozkyMMMteFqpyWraUTdRyX1GKFnJYkqPsL5SJK",
                      "source": "raydium",
                      "blockUnixTime": 1726676178,
                      "txType": "swap",
                      "owner": "CDt3xtwPVWDbhENL3QhDX5XYVx9JNCvewfdfCRy1cKFt",
                      "side": "sell",
                      "alias": null,
                      "pricePair": 3410252.2016839255,
                      "from": {
                        "symbol": "SOL",
                        "decimals": 9,
                        "address": "So11111111111111111111111111111111111111112",
                        "amount": 10333,
                        "uiAmount": 0.000010333,
                        "price": null,
                        "nearestPrice": 128.201119598627,
                        "changeAmount": -10333,
                        "uiChangeAmount": -0.000010333
                      },
                      "to": {
                        "symbol": "PEAKY",
                        "decimals": 6,
                        "address": "62uBW5K24PdxXk185tNjz9pwzkpHinKt8qZznxPPpump",
                        "amount": 35238136,
                        "feeInfo": null,
                        "uiAmount": 35.238136,
                        "price": null,
                        "nearestPrice": 0.00003742796781669965,
                        "changeAmount": 35238136,
                        "uiChangeAmount": 35.238136
                      },
                      "tokenPrice": null,
                      "poolId": "5vsk6iYjKXEo6x7maZJwh36UjqwFxkRtoHK5Nphh3ht1"
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
  "operationId": "get-defi-txs-token",
  "x-mint": {
    "href": "/data-api/transactions/get-defi-txs-token"
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
