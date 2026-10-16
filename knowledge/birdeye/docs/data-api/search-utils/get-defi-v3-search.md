---
title: "Search - Token, market Data"
description: "Search for tokens and market data by providing a name, symbol, token address, or market address."
hidden: false
metadata:
  title: Birdeye Data API | Search - Token, market Data
  description: >-
    Search for tokens and market data by providing a name, symbol, token
    address, or market address.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/search"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Search entry point for tokens and markets.</strong></p>
  <ul>
    <li>Search by token name, symbol, token address, or market address.</li>
    <li><code>target</code>, <code>search_mode</code>, and <code>search_by</code> shape how broad or exact the search should be.</li>
    <li>Results are paginated with <code>offset</code> and <code>limit</code> up to <code>20</code>.</li>
    <li><code>ui_amount_mode=scaled</code> applies Solana Token-2022 scaled UI amount where supported.</li>
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
    <li>This endpoint consumes <code>20 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Power token and market search bars.</li>
    <li>Resolve noisy symbols into exact token or market candidates.</li>
    <li>Support discovery flows before users open token detail pages.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> or use the supported search chain mode.</li>
    <li>Pass <code>keyword</code>, then narrow with <code>target</code>, <code>search_mode</code>, or <code>search_by</code> if needed.</li>
    <li>Use <code>offset</code> and <code>limit</code> for paginated result sets.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use exact address search when you already know the token or market address.</li>
    <li>Use fuzzy or broader search for UI search boxes, then hydrate the selected result with dedicated data endpoints.</li>
    <li>Keep <code>limit</code> small for interactive search experiences.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/search

```json
{
  "tags": [
    "Search & Utils"
  ],
  "summary": "Search - Token, market Data",
  "description": "Search for tokens and market data by providing a name, symbol, token address, or market address.",
  "parameters": [
    {
      "name": "chain",
      "description": "Specify the chain.",
      "in": "query",
      "schema": {
        "type": "string",
        "enum": [
          "all",
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
        "default": "all"
      }
    },
    {
      "name": "keyword",
      "in": "query",
      "schema": {
        "type": "string"
      },
      "example": "sol"
    },
    {
      "name": "target",
      "description": "An option to search tokens based on their expected results as token, market, or both.",
      "in": "query",
      "schema": {
        "type": "string",
        "enum": [
          "all",
          "token",
          "market"
        ],
        "default": "all"
      }
    },
    {
      "name": "search_mode",
      "description": "An option to search tokens with exact match or partially match.",
      "in": "query",
      "schema": {
        "type": "string",
        "enum": [
          "exact",
          "fuzzy"
        ],
        "default": "exact"
      }
    },
    {
      "name": "search_by",
      "description": "An option to search tokens by symbol, name, or both.",
      "in": "query",
      "schema": {
        "type": "string",
        "enum": [
          "combination",
          "address",
          "name",
          "symbol"
        ],
        "default": "symbol"
      }
    },
    {
      "name": "sort_by",
      "description": "Specify the sort field.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "enum": [
          "fdv",
          "marketcap",
          "liquidity",
          "price",
          "price_change_24h_percent",
          "trade_24h",
          "trade_24h_change_percent",
          "buy_24h",
          "buy_24h_change_percent",
          "sell_24h",
          "sell_24h_change_percent",
          "unique_wallet_24h",
          "unique_view_24h_change_percent",
          "last_trade_unix_time",
          "volume_24h_usd",
          "volume_24h_change_percent"
        ],
        "default": "volume_24h_usd"
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
      "name": "verify_token",
      "description": "A filter to retrieve tokens based on their verification status (supported on Solana).",
      "in": "query",
      "schema": {
        "type": "boolean",
        "enum": [
          true,
          false
        ]
      },
      "example": true
    },
    {
      "name": "markets",
      "description": "A comma-separated list of market sources to filter results (supported on Solana). Available options: ['Raydium', 'Raydium CP', 'Raydium Clamm', 'Meteora', 'Meteora DLMM', 'Fluxbeam', 'Pump.fun', 'OpenBook', 'OpenBook V2', 'Orca'].",
      "in": "query",
      "schema": {
        "type": "string"
      },
      "example": "Raydium, Pump.fun"
    },
    {
      "name": "offset",
      "description": "Specify the offset for pagination. Filter for records with offset greater than the specified offset value, including those with offset equal to the specified offset.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 0
      }
    },
    {
      "name": "limit",
      "description": "Number of items per page.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 20,
        "minimum": 1,
        "maximum": 20
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
      "description": "Search for token and market data matching keyword, tokenAddress using full-text search",
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
                "description": "Whether the request completed successfully."
              },
              "data": {
                "type": "object",
                "description": "Search results grouped by result type.",
                "properties": {
                  "items": {
                    "type": "array",
                    "description": "Grouped search results returned by the query.",
                    "items": {
                      "type": "object",
                      "properties": {
                        "type": {
                          "type": "string",
                          "description": "Result group type, such as token or pair."
                        },
                        "result": {
                          "type": "array",
                          "description": "Matched entities for the group type.",
                          "items": {
                            "oneOf": [
                              {
                                "type": "object",
                                "properties": {
                                  "name": {
                                    "type": "string",
                                    "description": "Token or market name."
                                  },
                                  "symbol": {
                                    "type": "string",
                                    "description": "Token symbol."
                                  },
                                  "address": {
                                    "type": "string",
                                    "description": "Token contract or market address."
                                  },
                                  "network": {
                                    "type": "string",
                                    "description": "Network where the asset is listed."
                                  },
                                  "decimals": {
                                    "type": "number",
                                    "description": "Token decimals."
                                  },
                                  "logo_uri": {
                                    "type": "string",
                                    "description": "Logo URL for the asset."
                                  },
                                  "verified": {
                                    "type": "boolean",
                                    "description": "Whether the token metadata is verified."
                                  },
                                  "fdv": {
                                    "type": "number",
                                    "description": "Fully diluted valuation."
                                  },
                                  "market_cap": {
                                    "type": "number",
                                    "description": "Market capitalization."
                                  },
                                  "liquidity": {
                                    "type": "number",
                                    "description": "Liquidity in USD."
                                  },
                                  "price": {
                                    "type": "number",
                                    "description": "Latest token price."
                                  },
                                  "price_change_24h_percent": {
                                    "type": "number",
                                    "description": "24-hour price change percentage."
                                  },
                                  "sell_24h": {
                                    "type": "integer",
                                    "description": "Sell count in the last 24 hours."
                                  },
                                  "sell_24h_change_percent": {
                                    "type": "number",
                                    "description": "24-hour change in sell count."
                                  },
                                  "buy_24h": {
                                    "type": "integer",
                                    "description": "Buy count in the last 24 hours."
                                  },
                                  "buy_24h_change_percent": {
                                    "type": "number",
                                    "description": "24-hour change in buy count."
                                  },
                                  "unique_wallet_24h": {
                                    "type": "number",
                                    "description": "Unique wallets that traded in the last 24 hours."
                                  },
                                  "unique_wallet_24h_change_percent": {
                                    "type": "number",
                                    "description": "24-hour change in unique wallet count."
                                  },
                                  "trade_24h": {
                                    "type": "integer",
                                    "description": "Trade count in the last 24 hours."
                                  },
                                  "trade_24h_change_percent": {
                                    "type": "number",
                                    "description": "24-hour change in trade count."
                                  },
                                  "volume_24h_change_percent": {
                                    "type": "number",
                                    "description": "24-hour change in volume."
                                  },
                                  "volume_24h_usd": {
                                    "type": "number",
                                    "description": "24-hour volume in USD."
                                  },
                                  "last_trade_unix_time": {
                                    "type": "number",
                                    "description": "Unix timestamp of the last trade."
                                  },
                                  "last_trade_human_time": {
                                    "type": "string",
                                    "description": "Human-readable timestamp of the last trade."
                                  },
                                  "supply": {
                                    "type": "number",
                                    "description": "Token supply."
                                  },
                                  "updated_time": {
                                    "type": "integer",
                                    "description": "Unix timestamp when the search result was last updated."
                                  }
                                },
                                "required": [
                                  "name",
                                  "symbol",
                                  "address",
                                  "decimals",
                                  "fdv",
                                  "liquidity",
                                  "volume_24h_usd",
                                  "volume_24h_change_percent",
                                  "price",
                                  "price_change_24h_percent",
                                  "logo_uri"
                                ]
                              },
                              {
                                "type": "object",
                                "properties": {
                                  "name": {
                                    "type": "string",
                                    "description": "Market or pair name."
                                  },
                                  "address": {
                                    "type": "string",
                                    "description": "Pair address or market address."
                                  },
                                  "network": {
                                    "type": "string",
                                    "description": "Network where the market exists."
                                  },
                                  "liquidity": {
                                    "type": "number",
                                    "description": "Liquidity in USD."
                                  },
                                  "unique_wallet_24h": {
                                    "type": "integer",
                                    "description": "Unique wallets that traded the market in the last 24 hours."
                                  },
                                  "unique_wallet_24h_change_percent": {
                                    "type": "number",
                                    "description": "24-hour change in unique wallet count."
                                  },
                                  "trade_24h": {
                                    "type": "integer",
                                    "description": "Trade count in the last 24 hours."
                                  },
                                  "trade_24h_change_percent": {
                                    "type": "number",
                                    "description": "24-hour change in trade count."
                                  },
                                  "volume_24h_usd": {
                                    "type": "number",
                                    "description": "24-hour volume in USD."
                                  },
                                  "last_trade_unix_time": {
                                    "type": "integer",
                                    "description": "Unix timestamp of the last trade."
                                  },
                                  "last_trade_human_time": {
                                    "type": "string",
                                    "description": "Human-readable timestamp of the last trade."
                                  },
                                  "source": {
                                    "type": "string",
                                    "description": "DEX or market source for the pair."
                                  },
                                  "base_mint": {
                                    "type": "string",
                                    "description": "Base token mint address."
                                  },
                                  "quote_mint": {
                                    "type": "string",
                                    "description": "Quote token mint address."
                                  },
                                  "amount_base": {
                                    "type": "number",
                                    "description": "Base token amount in the latest trade snapshot."
                                  },
                                  "amount_quote": {
                                    "type": "number",
                                    "description": "Quote token amount in the latest trade snapshot."
                                  }
                                },
                                "required": [
                                  "name",
                                  "address",
                                  "liquidity",
                                  "base_mint",
                                  "quote_mint"
                                ]
                              }
                            ]
                          }
                        }
                      },
                      "required": [
                        "type",
                        "result"
                      ]
                    }
                  }
                },
                "required": [
                  "items"
                ]
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
                      "type": "token",
                      "result": [
                        {
                          "name": "TRENDSDOTFUN",
                          "symbol": "",
                          "address": "CdsF47CkMGnXnMuGNPw9TpCbE6hxRvA4XUbxbZcLrfJ8",
                          "network": "solana",
                          "decimals": 6,
                          "verified": false,
                          "fdv": 13697.614698138917,
                          "market_cap": 13697.614698138917,
                          "liquidity": 60054.03786109897,
                          "price": 0.000013697614670743687,
                          "price_change_24h_percent": 333.97707074856015,
                          "sell_24h": 4088,
                          "sell_24h_change_percent": null,
                          "buy_24h": 4374,
                          "buy_24h_change_percent": null,
                          "unique_wallet_24h": 203,
                          "unique_wallet_24h_change_percent": null,
                          "trade_24h": 8462,
                          "trade_24h_change_percent": null,
                          "volume_24h_change_percent": null,
                          "volume_24h_usd": 1867782.2902830783,
                          "last_trade_unix_time": 1749490559,
                          "last_trade_human_time": "2025-06-09T17:35:59",
                          "updated_time": 1749491343,
                          "creation_time": "2025-06-09T17:13:02.490Z",
                          "is_scaled_ui_token": false,
                          "multiplier": null
                        }
                      ]
                    },
                    {
                      "type": "market",
                      "result": []
                    }
                  ]
                }
              }
            },
            "SearchData": {
              "value": {
                "data": {
                  "items": [
                    {
                      "type": "token",
                      "result": [
                        {
                          "name": "Wrapped SOL",
                          "symbol": "SOL",
                          "address": "So11111111111111111111111111111111111111112",
                          "network": "solana",
                          "decimals": 9,
                          "logo_uri": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
                          "verified": true,
                          "fdv": 90819272048.42484,
                          "market_cap": 78411420690.92838,
                          "liquidity": 13151956937.267107,
                          "price": 151.87906506413003,
                          "price_change_24h_percent": 8.382435933049754,
                          "sell_24h": 14987224,
                          "sell_24h_change_percent": 2.545108704948598,
                          "buy_24h": 11808908,
                          "buy_24h_change_percent": -1.730191226931713,
                          "unique_wallet_24h": 1918596,
                          "unique_wallet_24h_change_percent": 12.744451058663554,
                          "trade_24h": 26796132,
                          "trade_24h_change_percent": 0.6160241681533454,
                          "volume_24h_change_percent": 23.428765048651922,
                          "volume_24h_usd": 3529926746.199748,
                          "last_trade_unix_time": 1745403512,
                          "last_trade_human_time": "2025-04-23T10:18:32",
                          "supply": 596038231.288297,
                          "updated_time": 1745403518
                        },
                        {
                          "name": "The Clever Galapagos Hunter",
                          "symbol": "Sol",
                          "address": "51g2iAa2XMpWkzA7SGBG7qJtVbPpLGtSksoh7L72PUMP",
                          "network": "solana",
                          "decimals": 6,
                          "verified": false,
                          "fdv": 236.9309248798655,
                          "market_cap": 236.9309248798655,
                          "liquidity": 8.415722964906944,
                          "price": 2.369309248798655e-8,
                          "price_change_24h_percent": -99.99630719886537,
                          "sell_24h": 136072,
                          "sell_24h_change_percent": null,
                          "buy_24h": 135847,
                          "buy_24h_change_percent": null,
                          "unique_wallet_24h": 225,
                          "unique_wallet_24h_change_percent": null,
                          "trade_24h": 271919,
                          "trade_24h_change_percent": null,
                          "volume_24h_change_percent": null,
                          "volume_24h_usd": 13620948.061542135,
                          "last_trade_unix_time": 1745320033,
                          "last_trade_human_time": "2025-04-22T11:07:13",
                          "updated_time": 1745320409,
                          "creation_time": "2025-04-22T02:51:01.804Z"
                        }
                      ]
                    },
                    {
                      "type": "market",
                      "result": [
                        {
                          "name": "SOL-USDC",
                          "address": "Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE",
                          "network": "solana",
                          "liquidity": 27586976.29702192,
                          "unique_wallet_24h": 3019,
                          "unique_wallet_24h_change_percent": -14.717514124293785,
                          "trade_24h": 63476,
                          "trade_24h_change_percent": -15.101582248853104,
                          "volume_24h_usd": 215816762.24573693,
                          "last_trade_unix_time": 1741859485,
                          "last_trade_human_time": "2025-03-13T09:51:25.000Z",
                          "source": "Orca",
                          "base_mint": "So11111111111111111111111111111111111111112",
                          "quote_mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                          "amount_base": 173168.012566278,
                          "amout_quote": 6036799.351477
                        },
                        {
                          "name": "SOL-USDC",
                          "address": "3ucNos4NbumPLZNWztqGHNFFgkHeRMBQAVemeeomsUxv",
                          "network": "solana",
                          "liquidity": 7558785.231379336,
                          "unique_wallet_24h": 2982,
                          "unique_wallet_24h_change_percent": -14.604810996563575,
                          "trade_24h": 59389,
                          "trade_24h_change_percent": -1.4879076402481504,
                          "volume_24h_usd": 123387689.97390246,
                          "last_trade_unix_time": 1741859484,
                          "last_trade_human_time": "2025-03-13T09:51:24.000Z",
                          "source": "Raydium Clamm",
                          "base_mint": "So11111111111111111111111111111111111111112",
                          "quote_mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                          "amount_base": 41501.80227063,
                          "amout_quote": 2394129.681614,
                          "creation_time": "2024-08-07T21:17:56.963Z"
                        }
                      ]
                    }
                  ]
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
  "operationId": "get-defi-v3-search",
  "x-mint": {
    "href": "/data-api/search-utils/get-defi-v3-search"
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
