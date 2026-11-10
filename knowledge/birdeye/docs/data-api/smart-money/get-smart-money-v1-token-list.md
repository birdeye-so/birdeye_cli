---
title: "Smart Money - Token List"
description: "Returns tokens identified via smart money traders, segmented by trader style and risk appetite."
hidden: false
metadata:
  title: Birdeye Data API | Smart Money - Token List
  description: >-
    Returns tokens identified via smart money traders, segmented by trader style
    and risk appetite.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /smart-money/v1/token/list"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Token list ranked through smart-money wallet behavior.</strong></p>
  <ul>
    <li><code>interval</code> controls the observation window.</li>
    <li><code>trader_style</code> narrows the wallet cohort driving the ranking.</li>
    <li><code>sort_by</code> controls which smart-money dimension leads the ranking.</li>
    <li>Results are paginated with <code>offset</code> up to <code>10,000</code> and <code>limit</code> up to <code>20</code>.</li>
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
  <p><strong>SVM ⛓️ ✨</strong></p>
  <p><strong>EVM ⛓️ ✨</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>20 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Discover tokens being accumulated or actively traded by stronger wallets.</li>
    <li>Build smart-money boards, alpha feeds, and conviction watchlists.</li>
    <li>Compare trader styles and risk appetite across token sets.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> to a supported PnL-compatible network.</li>
    <li>Choose <code>interval</code>, <code>trader_style</code>, and <code>sort_by</code> for the signal you want.</li>
    <li>Page through the ranked token list with <code>offset</code> and <code>limit</code>.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use this as a discovery layer first, then validate shortlisted tokens with price, market, holder, and security data.</li>
    <li>Keep interval and sort choice explicit in UI so users understand why a token ranks highly.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /smart-money/v1/token/list

```json
{
  "x-metadata": {
    "released_at": 1770336000,
    "new": true
  },
  "tags": [
    "Smart Money"
  ],
  "summary": "Smart Money - Token List",
  "description": "Returns tokens identified via smart money traders, segmented by trader style and risk appetite.",
  "parameters": [
    {
      "name": "x-chain",
      "description": "The chain support PNL data.",
      "in": "header",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "solana",
          "ethereum",
          "arbitrum",
          "avalanche",
          "bsc",
          "optimism",
          "polygon",
          "base",
          "zksync",
          "monad",
          "hyperevm",
          "mantle",
          "megaeth",
          "robinhood"
        ],
        "default": "solana"
      }
    },
    {
      "name": "interval",
      "in": "query",
      "schema": {
        "type": "string",
        "enum": [
          "1d",
          "7d",
          "30d"
        ],
        "default": "1d"
      }
    },
    {
      "name": "trader_style",
      "in": "query",
      "schema": {
        "type": "string",
        "enum": [
          "all",
          "risk_averse",
          "risk_balancers",
          "trenchers"
        ],
        "default": "all"
      }
    },
    {
      "name": "sort_by",
      "in": "query",
      "schema": {
        "type": "string",
        "enum": [
          "net_flow",
          "smart_traders_no",
          "market_cap"
        ],
        "default": "smart_traders_no"
      }
    },
    {
      "name": "sort_type",
      "description": "Specify the sort order.",
      "in": "query",
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
        "default": 20,
        "minimum": 1,
        "maximum": 20
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing a total transfer",
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
                "type": "array",
                "description": "Ranked smart-money token list for the requested chain and filter set.",
                "items": {
                  "type": "object",
                  "additionalProperties": true,
                  "properties": {
                    "token": {
                      "type": "string",
                      "description": "Token mint or contract address."
                    },
                    "price": {
                      "type": "number",
                      "description": "Latest token price in USD."
                    },
                    "liquidity": {
                      "type": "number",
                      "description": "Current token liquidity in USD."
                    },
                    "market_cap": {
                      "type": "number",
                      "description": "Current token market capitalization in USD."
                    },
                    "net_flow": {
                      "type": "number",
                      "description": "Net smart-money flow for the selected time window and cohort."
                    },
                    "smart_traders_no": {
                      "type": "integer",
                      "description": "Number of smart-trader wallets contributing to the signal."
                    },
                    "trader_style": {
                      "type": "string",
                      "description": "Smart-money cohort or trader-style label used for the ranking."
                    },
                    "volume_usd": {
                      "type": "number",
                      "description": "Total USD trading volume associated with the smart-money activity."
                    },
                    "volume_buy_usd": {
                      "type": "number",
                      "description": "Buy-side USD volume attributed to smart-money wallets."
                    },
                    "volume_sell_usd": {
                      "type": "number",
                      "description": "Sell-side USD volume attributed to smart-money wallets."
                    },
                    "symbol": {
                      "type": "string",
                      "description": "Token symbol."
                    },
                    "name": {
                      "type": "string",
                      "description": "Token display name."
                    },
                    "logo_uri": {
                      "type": "string",
                      "description": "Token logo URL."
                    },
                    "price_change_percent": {
                      "type": "number",
                      "description": "Price change percentage over the requested ranking window."
                    }
                  }
                }
              }
            }
          },
          "examples": {
            "Solana": {
              "value": {
                "success": true,
                "data": [
                  {
                    "token": "C6HB4R62NeXacwT4CAfohnCTJiaLhYfuQZNsbsqypump",
                    "price": 0.00001883295471804635,
                    "liquidity": 14375.686217934,
                    "market_cap": 18588.443206268883,
                    "net_flow": 52810.052897156216,
                    "smart_traders_no": 308,
                    "trader_style": "trenchers",
                    "volume_usd": 13862029.460908774,
                    "volume_buy_usd": 6957419.756902965,
                    "volume_sell_usd": 6904609.704005809,
                    "symbol": "Nazijak",
                    "name": "Nazi Wojak",
                    "logo_uri": "https://wsrv.nl/?w=128&h=128&default=1&url=https://ipfs.io/ipfs/bafkreiecr4nqikoow756ahfgjj7fhqga5nepbqyi3hqisw7ehk2p6uzm4y",
                    "price_change_percent": 43.032329448293844
                  }
                ]
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
  "operationId": "get-smart-money-v1-token-list",
  "x-mint": {
    "href": "/data-api/smart-money/get-smart-money-v1-token-list"
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
