---
title: "Trades - Pair"
description: "Retrieve a list of trades of a specified pair."
hidden: false
metadata:
  title: Birdeye Data API | Trades - Pair
  description: Retrieve a list of trades of a specified pair.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/txs/pair"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Legacy trade list for one pair or pool.</strong></p>
  <ul>
    <li>Pass the pair address in <code>address</code>.</li>
    <li><code>limit</code> supports <code>1</code> to <code>50</code> items per request, and <code>offset</code> supports up to <code>50,000</code>.</li>
    <li><code>tx_type</code> defaults to <code>swap</code> and can also be used to inspect <code>add</code> or <code>remove</code> liquidity events.</li>
    <li>Pair-level trade history is useful when venue-specific behavior matters more than token-level aggregation.</li>
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
    <li>Inspect venue-specific trade flow for one pool or pair.</li>
    <li>Monitor pair activity for LP analysis, execution review, or routing research.</li>
    <li>Compare one pair's tape with token-level aggregates to spot fragmented liquidity behavior.</li>
    <li>Build pair trade feeds for dashboards or trading surfaces.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Pass the pair address in <code>address</code>.</li>
    <li>Page with <code>offset</code> and <code>limit</code>, keeping <code>limit</code> at <code>50</code> or below.</li>
    <li>Use <code>tx_type</code> to isolate swaps versus liquidity changes.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Prefer pair-level trades when the asset has multiple active venues and you care about one exact market.</li>
    <li>Keep pair identity visible in your UI so the feed is not confused with token-wide trading.</li>
    <li>Pair this endpoint with pair OHLCV and liquidity endpoints for fuller venue diagnostics.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/txs/pair

```json
{
  "tags": [
    "Transactions"
  ],
  "summary": "Trades - Pair",
  "description": "Retrieve a list of trades of a specified pair.",
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
      "description": "JSON object containing transactions of a pair",
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
                    "description": "Trades for the requested pair, ordered by the endpoint's default sort.",
                    "items": {
                      "type": "object",
                      "description": "One trade returned by pair transaction endpoints.",
                      "additionalProperties": true,
                      "properties": {
                        "txHash": {
                          "type": "string",
                          "description": "Transaction signature or hash."
                        },
                        "source": {
                          "type": "string",
                          "description": "DEX, AMM, or venue source."
                        },
                        "blockUnixTime": {
                          "type": "integer",
                          "description": "Block timestamp in Unix seconds."
                        },
                        "txType": {
                          "type": "string",
                          "description": "Transaction classification, typically `swap`."
                        },
                        "address": {
                          "type": "string",
                          "description": "Pair or market address the trade belongs to."
                        },
                        "owner": {
                          "type": "string",
                          "description": "Primary wallet that initiated or owned the trade flow."
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
                      "txHash": "2s27V8t3HANqUA572KLqBNXFvGyqvYobFX2Cn3c5puoWbHSNCebjT6PDX7gixe5HjdNhuG7SuHpDroJXFrBpAFn1",
                      "source": "phoenix",
                      "blockUnixTime": 1754882843,
                      "txType": "swap",
                      "address": "4DoNfFBfF7UokCC2FQzriy7yHK6DY6NVdYpuekQ5pRgg",
                      "owner": "MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa",
                      "from": {
                        "symbol": "USDC",
                        "decimals": 6,
                        "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                        "amount": 4000129768,
                        "type": "log",
                        "typeSwap": "from",
                        "uiAmount": 4000.129768,
                        "price": 0.99986,
                        "nearestPrice": 0.99986,
                        "changeAmount": -4000129768,
                        "uiChangeAmount": -4000.129768,
                        "isScaledUiToken": false,
                        "multiplier": null
                      },
                      "to": {
                        "symbol": "SOL",
                        "decimals": 9,
                        "address": "So11111111111111111111111111111111111111112",
                        "amount": 21638000000,
                        "type": "log",
                        "typeSwap": "to",
                        "uiAmount": 21.638,
                        "price": 184.67395202659998,
                        "nearestPrice": 184.67395202659998,
                        "changeAmount": 21638000000,
                        "uiChangeAmount": 21.638,
                        "isScaledUiToken": false,
                        "multiplier": null
                      }
                    }
                  ],
                  "hasNext": true
                }
              }
            },
            "PairTransactions": {
              "value": {
                "success": true,
                "data": {
                  "items": [
                    {
                      "txHash": "37U8R16dfZHbe56J8ZhxwrJduUJHwQnJpuocCej6st7r6CAYDzvv7TFTj9yrz6jkYSdMSCkhdAhkaciU4PQWfJis",
                      "source": "phoenix",
                      "blockUnixTime": 1745402802,
                      "address": "4DoNfFBfF7UokCC2FQzriy7yHK6DY6NVdYpuekQ5pRgg",
                      "owner": "MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa",
                      "from": {
                        "symbol": "USDC",
                        "decimals": 6,
                        "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                        "amount": 399920249,
                        "type": "log",
                        "typeSwap": "from",
                        "uiAmount": 399.920249,
                        "price": null,
                        "nearestPrice": 0.99994282,
                        "changeAmount": -399920249,
                        "uiChangeAmount": -399.920249
                      },
                      "to": {
                        "symbol": "SOL",
                        "decimals": 9,
                        "address": "So11111111111111111111111111111111111111112",
                        "amount": 2642000000,
                        "type": "log",
                        "typeSwap": "to",
                        "feeInfo": null,
                        "uiAmount": 2.642,
                        "price": null,
                        "nearestPrice": 151.35706807903856,
                        "changeAmount": 2642000000,
                        "uiChangeAmount": 2.642
                      }
                    },
                    {
                      "txHash": "2w3kTsgkgBJNk7iJmmo4P4k8UZ8zKXChLL33R1DSod7T3KyfqSH8m63f731yhBsdXULao6f7gUZamkKnVjsCcf4W",
                      "source": "phoenix",
                      "blockUnixTime": 1745402801,
                      "address": "4DoNfFBfF7UokCC2FQzriy7yHK6DY6NVdYpuekQ5pRgg",
                      "owner": "MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa",
                      "from": {
                        "symbol": "USDC",
                        "decimals": 6,
                        "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                        "amount": 399920938,
                        "type": "log",
                        "typeSwap": "from",
                        "uiAmount": 399.920938,
                        "price": null,
                        "nearestPrice": 0.99994282,
                        "changeAmount": -399920938,
                        "uiChangeAmount": -399.920938
                      },
                      "to": {
                        "symbol": "SOL",
                        "decimals": 9,
                        "address": "So11111111111111111111111111111111111111112",
                        "amount": 2643000000,
                        "type": "log",
                        "typeSwap": "to",
                        "feeInfo": null,
                        "uiAmount": 2.643,
                        "price": null,
                        "nearestPrice": 151.33213768145356,
                        "changeAmount": 2643000000,
                        "uiChangeAmount": 2.643
                      }
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
  "operationId": "get-defi-txs-pair",
  "x-mint": {
    "href": "/data-api/transactions/get-defi-txs-pair"
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
