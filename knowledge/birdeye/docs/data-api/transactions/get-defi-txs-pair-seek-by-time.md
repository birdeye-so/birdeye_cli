---
title: "Trades - Pair Seek By Time"
description: "Retrieve a list of trades of a specified pair with time bound option."
hidden: false
metadata:
  title: Birdeye Data API | Trades - Pair Seek By Time
  description: Retrieve a list of trades of a specified pair with time bound option.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/txs/pair/seek_by_time"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Time-bounded legacy trade sync for one pair.</strong></p>
  <ul>
    <li>Pass the pair address in <code>address</code>.</li>
    <li><code>limit</code> supports <code>1</code> to <code>100</code> items per request, and <code>offset</code> supports up to <code>10,000</code>.</li>
    <li>Use <code>before_time</code> and <code>after_time</code> to step through historical pair activity.</li>
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
    <li>Retrieve historical trades for a specific trading pair from a given timestamp.</li>
    <li>Great for analyzing liquidity pool activity or pair-specific trading trends.</li>
    <li>Use to backfill DEX trade data for historical analysis or visualizations.</li>
    <li>Combine with token and pair stats for comprehensive DeFi pair insights.</li>
    <li>Backfill venue-specific trade history over explicit time ranges.</li>
    <li>Analyze pair activity during liquidity shifts, launches, or execution anomalies.</li>
    <li>Build pair trade archives for research, dashboards, or surveillance.</li>
    <li>Investigate whether one market led or lagged other venues for the same asset.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for the target network.</li>
    <li>Pass the pair address in <code>address</code>.</li>
    <li>Bound the request with <code>after_time</code> and <code>before_time</code>.</li>
    <li>Page dense windows with <code>offset</code> and <code>limit</code>, keeping <code>limit</code> at <code>100</code> or below.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use pair seek for venue forensics where one pool matters more than token-wide flow.</li>
    <li>Keep time windows deterministic so resumes and replays do not create gaps.</li>
    <li>Compare pair history with token-wide history when diagnosing cross-venue divergence.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/txs/pair/seek_by_time

```json
{
  "tags": [
    "Transactions"
  ],
  "summary": "Trades - Pair Seek By Time",
  "description": "Retrieve a list of trades of a specified pair with time bound option.",
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
                      "txHash": "3zyGYe6NVJeFVPrsg2tvTdSxRoKGAiedcEqhuxhqUopdGoaAj69r4svfiePAstmogGoU8dkrfWnUj5PuMf4PCGie",
                      "source": "phoenix",
                      "blockUnixTime": 1741078031,
                      "txType": "swap",
                      "address": "4DoNfFBfF7UokCC2FQzriy7yHK6DY6NVdYpuekQ5pRgg",
                      "owner": "4yDvNjJxLCb5nznyowT8cgNwMs4i36eZaCyAgT6ZwPwv",
                      "from": {
                        "symbol": "USDC",
                        "decimals": 6,
                        "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                        "amount": 92762810,
                        "typeSwap": "from",
                        "uiAmount": 92.76281,
                        "price": 0.99991,
                        "changeAmount": -92762810,
                        "uiChangeAmount": -92.76281,
                        "isScaledUiToken": false,
                        "multiplier": null
                      },
                      "to": {
                        "symbol": "SOL",
                        "decimals": 9,
                        "address": "So11111111111111111111111111111111111111112",
                        "amount": 677000000,
                        "typeSwap": "to",
                        "uiAmount": 0.677,
                        "price": 136.96359554514504,
                        "changeAmount": 677000000,
                        "uiChangeAmount": 0.677,
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
                      "txHash": "XYULkDnsuogzymf6fiM1v2zTmz9LSkiMPCvK9uuE7f58Kb2cJM2hixKzk7ZV2ZsVGZm17gdC3UpEqtxUiRfcBJj",
                      "source": "raydium",
                      "blockUnixTime": 1731556689,
                      "address": "9uWW4C36HiCTGr6pZW9VFhr9vdXktZ8NA8jVnzQU35pJ",
                      "owner": "8NgW4LgwnTL3mHZknDF9aP9mxApsP8WK566v4Cg9Xi3t",
                      "txType": "swap",
                      "from": {
                        "symbol": "SOL",
                        "decimals": 9,
                        "address": "So11111111111111111111111111111111111111112",
                        "amount": 5000000000,
                        "type": "transfer",
                        "typeSwap": "from",
                        "uiAmount": 5,
                        "price": null,
                        "nearestPrice": 218.925039633365,
                        "changeAmount": -5000000000,
                        "uiChangeAmount": -5
                      },
                      "to": {
                        "symbol": "BILLY",
                        "decimals": 6,
                        "address": "3B5wuUrMEi5yATD7on46hKfej3pfmd7t1RKgrsN3pump",
                        "amount": 15049154562,
                        "type": "transfer",
                        "typeSwap": "to",
                        "feeInfo": null,
                        "uiAmount": 15049.154562,
                        "price": 0.07273665730903037,
                        "nearestPrice": 0.07256692035947697,
                        "changeAmount": 15049154562,
                        "uiChangeAmount": 15049.154562
                      }
                    },
                    {
                      "txHash": "n9PZgEXAaQu9uCieRSbKNAV5XMjVebrUoTFgzvBCGqMZBE8MZVfpQsTPgsZe5WBPYKab8BK6ARoiYd7NSsZ8o35",
                      "source": "raydium",
                      "blockUnixTime": 1731556685,
                      "address": "9uWW4C36HiCTGr6pZW9VFhr9vdXktZ8NA8jVnzQU35pJ",
                      "owner": "8BXMjPy3NZ3P7hQDbFQZyn6ahxCCbmhfH1X75sKgCrdy",
                      "txType": "swap",
                      "from": {
                        "symbol": "BILLY",
                        "decimals": 6,
                        "address": "3B5wuUrMEi5yATD7on46hKfej3pfmd7t1RKgrsN3pump",
                        "amount": 1525582093,
                        "type": "transfer",
                        "typeSwap": "from",
                        "uiAmount": 1525.582093,
                        "price": 0.07228331856826616,
                        "nearestPrice": 0.07234274200745022,
                        "changeAmount": -1525582093,
                        "uiChangeAmount": -1525.582093
                      },
                      "to": {
                        "symbol": "SOL",
                        "decimals": 9,
                        "address": "So11111111111111111111111111111111111111112",
                        "amount": 504135998,
                        "type": "transfer",
                        "typeSwap": "to",
                        "feeInfo": null,
                        "uiAmount": 0.504135998,
                        "price": null,
                        "nearestPrice": 218.73886583747043,
                        "changeAmount": 504135998,
                        "uiChangeAmount": 0.504135998
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
  "operationId": "get-defi-txs-pair-seek_by_time",
  "x-mint": {
    "href": "/data-api/transactions/get-defi-txs-pair-seek-by-time"
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
