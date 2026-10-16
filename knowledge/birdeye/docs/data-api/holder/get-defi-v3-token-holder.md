---
title: "Token - Holder"
description: "Retrieve top holders of a Solana token. By default, results are returned per token account. Set mode=wallet to group token accounts by owner wallet and include wallet-level holder stats."
hidden: false
metadata:
  title: Birdeye Data API | Token - Holder
  description: >-
    Retrieve top holders of a Solana token. By default, results are returned per
    token account. Set mode=wallet to group token accounts by owner wallet and
    include wallet-level holder stats.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/token/holder"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Top holders for one token, with token-account mode and wallet mode.</strong></p>
  <ul>
    <li><code>mode=token_account</code> returns the legacy view: one row per token account.</li>
    <li><code>mode=wallet</code> groups token accounts by owner wallet and returns wallet-level holder stats.</li>
    <li><code>get_holder_infos=true</code> is only supported when <code>mode=wallet</code>. It adds <code>netWorth</code>, <code>solBalance</code>, and <code>funding</code> to each holder row and may make the response slightly slower.</li>
    <li>Holder rows always include raw balance (<code>amount</code>), token decimals, mint address, owner wallet, and <code>ui_amount</code>. <code>token_account</code> is returned for token-account rows; wallet mode adds wallet-level stats such as <code>amountUsd</code>, <code>holdAvgPrice</code>, <code>avgBuyPrice</code>, <code>avgSellPrice</code>, <code>firstTradeUnixTime</code>, and <code>lastTradeUnixTime</code>.</li>
    <li>Top-level <code>holder</code> and <code>top10HoldPercent</code> follow the selected mode: token-account holder stats in <code>token_account</code> mode, wallet-level holder stats in <code>wallet</code> mode.</li>
    <li><code>ui_amount_mode=scaled</code> applies Solana Token-2022 scaled UI amount when the token supports scaled UI amount extension.</li>
    <li>Use <code>offset</code> and <code>limit</code> to page through holders.</li>
  </ul>
  <p><strong>Reading the numbers.</strong> <code>amount</code> is the raw balance before decimals in token-account mode, or the grouped wallet holding amount in wallet mode. <code>ui_amount</code> is the balance after applying decimals or Token-2022 scaled UI amount when requested and supported. <code>amountUsd</code> is wallet holding value in USD. <code>holdAvgPrice</code> describes the current wallet position cost; <code>avgBuyPrice</code> and <code>avgSellPrice</code> summarize historical trade prices.</p>
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
  <p><strong>Solana</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>30 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Find the largest token holders and inspect the wallet owners behind major balances.</li>
    <li>Build top-holder tables for token profile pages, holder dashboards, and risk review workflows.</li>
    <li>Detect concentration risk by combining holder balances with total supply and holder-distribution data.</li>
    <li>Switch to wallet mode when you need true wallet-level concentration instead of token-account fragmentation.</li>
    <li>Identify wallets or token accounts worth deeper investigation before listing, trading, or monitoring a token.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Provide a Solana <code>token_address</code>.</li>
    <li>Choose <code>mode=token_account</code> for raw account-level ownership, or <code>mode=wallet</code> to collapse token accounts by owner wallet.</li>
    <li>Set <code>get_holder_infos=true</code> only with <code>mode=wallet</code> when you need holder net worth, SOL balance, and funding details.</li>
    <li>Use <code>limit</code> to control page size and <code>offset</code> to move through the holder list.</li>
    <li>Set <code>ui_amount_mode=raw</code> for raw decimal-adjusted amounts, or <code>ui_amount_mode=scaled</code> for Solana Token-2022 scaled UI amounts when supported.</li>
    <li>Use the returned <code>owner</code> for wallet-level analysis and <code>token_account</code> for account-level investigation.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Start with <code>mode=wallet</code> when the goal is concentration analysis, whale tracking, or wallet research.</li>
    <li>Use <code>mode=token_account</code> when you need the exact token-account distribution, custodial splits, or account-level investigation.</li>
    <li>Start with the first page to inspect top holders, then page further only when you need long-tail ownership.</li>
    <li>Combine this endpoint with holder-distribution to quantify how concentrated the top holders are.</li>
    <li>Use owner wallet addresses with wallet intelligence APIs to understand broader portfolio behavior.</li>
    <li>Enable <code>get_holder_infos</code> only when the extra wallet context is needed.</li>
    <li>Keep <code>ui_amount_mode</code> consistent across holder, overview, and market-data calls when analyzing Token-2022 scaled UI amount tokens.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
    <li>Pagination supports offset up to 10,000 and limit up to 100.</li>
    <li>This endpoint returns holder balances, not trade history, PnL, or wallet labels.</li>
    <li><code>get_holder_infos</code> is only available when <code>mode=wallet</code>.</li>
    <li><code>ui_amount_mode=scaled</code> only changes amounts for tokens that support Solana Token-2022 scaled UI amount extension.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/token/holder

```json
{
  "tags": [
    "Holder"
  ],
  "summary": "Token - Holder",
  "description": "Retrieve top holders of a Solana token. By default, results are returned per token account. Set mode=wallet to group token accounts by owner wallet and include wallet-level holder stats.",
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
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 10,
        "minimum": 1,
        "maximum": 100
      }
    },
    {
      "name": "mode",
      "description": "Solana only. `token_account` returns one item per token account and keeps the legacy response. `wallet` groups token accounts by owner wallet and returns wallet-level holder stats.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "token_account",
          "wallet"
        ],
        "default": "token_account"
      }
    },
    {
      "name": "get_holder_infos",
      "description": "Solana only. Only available when mode=wallet. When true, the response includes netWorth, solBalance, and funding for each holder. This may make the response slightly slower than when disabled.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "boolean",
        "default": false
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
      "description": "JSON object containing a list of token holder",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "description": "Response containing a paginated list of token holders for a Solana token.",
            "required": [
              "success",
              "data"
            ],
            "properties": {
              "success": {
                "type": "boolean",
                "description": "Indicates whether the request was successful."
              },
              "data": {
                "type": "object",
                "description": "Paginated token holder result.",
                "properties": {
                  "holder": {
                    "type": "integer",
                    "description": "Total holder count. In token_account mode this follows the existing token-account holder stats; in wallet mode this is wallet-level holder count."
                  },
                  "top10HoldPercent": {
                    "type": "number",
                    "description": "Percentage of token supply held by the top 10 holders. In wallet mode this is calculated by wallet-level holder distribution."
                  },
                  "items": {
                    "type": "array",
                    "description": "List of token holders sorted by balance.",
                    "items": {
                      "type": "object",
                      "description": "A token account and owner wallet holding the token.",
                      "properties": {
                        "amount": {
                          "oneOf": [
                            {
                              "type": "string"
                            },
                            {
                              "type": "number"
                            }
                          ],
                          "description": "Raw token balance before applying decimals in token_account mode, or wallet holding amount in wallet mode."
                        },
                        "amountUsd": {
                          "type": "number",
                          "description": "Wallet holding amount in USD. Returned in wallet mode."
                        },
                        "decimals": {
                          "type": "integer",
                          "description": "Number of decimal places used by the token mint."
                        },
                        "mint": {
                          "type": "string",
                          "description": "Token mint address."
                        },
                        "owner": {
                          "type": "string",
                          "description": "Wallet address that owns the token account."
                        },
                        "token_account": {
                          "type": "string",
                          "description": "Token account address that holds the balance."
                        },
                        "ui_amount": {
                          "type": "number",
                          "description": "Token balance after applying decimals or Solana Token-2022 scaled UI amount when requested and supported."
                        },
                        "isScaledUiToken": {
                          "type": "boolean",
                          "description": "Whether the token uses Solana Token-2022 scaled UI amount. Returned in token_account and wallet modes."
                        },
                        "multiplier": {
                          "type": "number",
                          "nullable": true,
                          "description": "Scaled UI multiplier when the token uses scaled UI amount; otherwise null."
                        },
                        "holdAvgPrice": {
                          "type": "number",
                          "description": "Average price of the current holder position. Returned in wallet mode."
                        },
                        "avgBuyPrice": {
                          "type": "number",
                          "description": "Average buy price for the holder wallet. Returned in wallet mode."
                        },
                        "avgSellPrice": {
                          "type": "number",
                          "description": "Average sell price for the holder wallet. Returned in wallet mode."
                        },
                        "firstTradeUnixTime": {
                          "type": "integer",
                          "description": "Unix timestamp of the holder wallet's first trade for the token. Returned in wallet mode."
                        },
                        "lastTradeUnixTime": {
                          "type": "integer",
                          "description": "Unix timestamp of the holder wallet's last trade for the token. Returned in wallet mode."
                        },
                        "netWorth": {
                          "type": "number",
                          "description": "Holder wallet net worth. Returned only when mode=wallet and get_holder_infos=true."
                        },
                        "solBalance": {
                          "type": "number",
                          "description": "Holder wallet SOL balance. Returned only when mode=wallet and get_holder_infos=true."
                        },
                        "funding": {
                          "type": "object",
                          "description": "Funding details for the holder wallet. Returned only when mode=wallet and get_holder_infos=true.",
                          "properties": {
                            "funder": {
                              "type": "string",
                              "description": "Address of the wallet that initially funded this holder wallet."
                            },
                            "unixTime": {
                              "type": "integer",
                              "description": "Unix timestamp in seconds of the funding transaction."
                            },
                            "amount": {
                              "type": "number",
                              "description": "Funding amount transferred in the native token."
                            },
                            "txHash": {
                              "type": "string",
                              "description": "Transaction hash of the funding event."
                            }
                          }
                        }
                      }
                    }
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
                  "holder": 120450,
                  "top10HoldPercent": 18.42,
                  "items": [
                    {
                      "amount": "4995300410087424",
                      "decimals": 9,
                      "mint": "So11111111111111111111111111111111111111112",
                      "owner": "AVzP2GeRmqGphJsMxWoqjpUifPpCret7LqWhD8NWQK49",
                      "token_account": "BUvduFTd2sWFagCunBPLupG8fBTJqweLw9DuhruNFSCm",
                      "ui_amount": 4995300.410087424,
                      "is_scaled_ui_token": false,
                      "multiplier": null
                    }
                  ]
                }
              }
            },
            "SPLTokenTopHolder": {
              "value": {
                "success": true,
                "data": {
                  "holder": 5321,
                  "top10HoldPercent": 22.15,
                  "items": [
                    {
                      "amount": "100000000000",
                      "decimals": 9,
                      "mint": "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
                      "owner": "6Zk9e3nfXdYLXHYu5NvDiPHGMcjujVBv6gWRr7ckSdhP",
                      "token_account": "HdmGPmTkBgsiJcyVDgiGkYdTZr4h5XmpjYoUjU2rapf4",
                      "ui_amount": 100
                    },
                    {
                      "amount": "90000000000",
                      "decimals": 9,
                      "mint": "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
                      "owner": "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
                      "token_account": "EauuZAnB7CcnCrwvCMcnb2Rjk12Ecs13ycAZQBb5tLYM",
                      "ui_amount": 90
                    }
                  ]
                }
              }
            },
            "WalletModeHolderStats": {
              "value": {
                "success": true,
                "data": {
                  "holder": 8432,
                  "top10HoldPercent": 31.77,
                  "items": [
                    {
                      "mint": "3xF8fgj5maAgFwprsEs26bJNmaPDS24zT1VTtELspump",
                      "owner": "CEikLmYN9dcDtHZC9qfwPpaUcLm3CNWMrR55Ub5mRyUn",
                      "amount": 696438428.401387,
                      "amountUsd": 6260.822052904342,
                      "holdAvgPrice": 0.0000036271578795427,
                      "avgBuyPrice": 0.0000036271578795427,
                      "avgSellPrice": 0.000017531147426419527,
                      "firstTradeUnixTime": 1784802145,
                      "lastTradeUnixTime": 1784802524,
                      "isScaledUiToken": false,
                      "multiplier": null,
                      "netWorth": 70247.52743167555,
                      "solBalance": 1.994403076,
                      "funding": {
                        "funder": "7iVfPjXEMnuGQkaYbxmvi4BRnzpS6dthWwNQB32D61nz",
                        "unixTime": 1784802145,
                        "amount": 21.372,
                        "txHash": "61oxPM8LXQ9wCurgLxzdqxv516rZPtrnxtGXdLnVCLuhYkRyW5nHwEr7Wzzi5YHaZzCGzRNiCs7egH7kCQQyPTDQ"
                      }
                    }
                  ]
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
  "operationId": "get-defi-v3-token-holder",
  "x-mint": {
    "href": "/data-api/holder/get-defi-v3-token-holder"
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
