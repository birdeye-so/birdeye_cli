---
title: "Token - Holder Distribution"
description: "Retrieve distribution statistics for token holders based on their share of the total supply. Set include_list=true to return the wallet list for the specified range."
hidden: false
metadata:
  title: Birdeye Data API | Token - Holder Distribution
  description: >-
    Retrieve distribution statistics for token holders based on their share of
    the total supply. Set include_list=true to return the wallet list for the
    specified range.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /holder/v1/distribution"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Two distribution modes. Pick one mode and only use filters for that mode.</strong></p>
  <ul>
    <li><code>mode=top</code> — returns the top holders by supply share. Use <code>top_n</code> to control how many top holders to inspect.</li>
    <li><code>mode=percent</code> — returns holders inside a supply-share range. Use <code>min_percent</code> and <code>max_percent</code> to define the range.</li>
    <li><code>address_type=wallet</code> returns holder wallets. <code>address_type=token_account</code> returns token-account level ownership.</li>
    <li><code>include_list=true</code> returns the holder list. Set <code>include_list=false</code> when you only need the summary.</li>
  </ul>
  <p><strong>Reading the numbers.</strong> <code>summary.wallet_count</code> is the number of holders in the selected range. <code>summary.total_holding</code> is the total token amount held by that segment, and <code>summary.percent_of_supply</code> is that segment's share of total supply.</p>
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
    <li>This endpoint consumes <code>30 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Map the ownership shape of a token before trusting the market: see whether supply is spread across many wallets or concentrated in a few dominant hands.</li>
    <li>Build concentration-risk dashboards that flag tokens where the top holders control a dangerous share of supply.</li>
    <li>Segment holders by supply percentage to identify whales, mid-size holders, and long-tail retail distribution.</li>
    <li>Compare wallet-level and token-account-level views to understand whether apparent distribution is real or fragmented across accounts.</li>
    <li>Feed token safety scores, listing reviews, and pre-trade checks with holder concentration signals.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Provide a Solana <code>token_address</code>.</li>
    <li>Use <code>mode=top&amp;top_n=10</code> for the largest holders, or <code>mode=percent&amp;min_percent=1&amp;max_percent=5</code> for a supply-share bucket.</li>
    <li>Set <code>address_type=wallet</code> for owner-level analysis, or <code>address_type=token_account</code> for token-account level inspection.</li>
    <li>Set <code>include_list=false</code> for a lightweight summary, or keep it <code>true</code> when you need the actual holder rows.</li>
    <li>Use <code>offset</code> and <code>limit</code> to page through the holder list when <code>include_list=true</code>.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Start with <code>mode=top</code> to identify concentration risk, then use <code>mode=percent</code> to inspect the middle and long-tail ownership bands.</li>
    <li>Do not mix top-holder filters with percent-range filters; each mode has its own filter set.</li>
    <li>Use wallet-level distribution for product and risk summaries, and token-account level distribution when investigating account fragmentation.</li>
    <li>Pair distribution with holder-profile, first-buyers, and token overview data to understand who owns supply and whether ownership looks healthy.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
    <li><code>mode=top</code> cannot be combined with <code>min_percent</code> or <code>max_percent</code>.</li>
    <li><code>mode=percent</code> cannot be combined with <code>top_n</code>.</li>
    <li><code>top_n</code> supports up to 10,000 holders.</li>
    <li>Pagination supports offset up to 10,000 and limit up to 50.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /holder/v1/distribution

```json
{
  "tags": [
    "Holder"
  ],
  "summary": "Token - Holder Distribution",
  "description": "Retrieve distribution statistics for token holders based on their share of the total supply. Set include_list=true to return the wallet list for the specified range.",
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
      "description": "Token contract address.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana": {
          "value": "11111Zxp8hv4GVzZTWcgcFTcFCfPzW8YmbwvGahTBP"
        }
      }
    },
    {
      "name": "address_type",
      "description": "Return holder distribution by wallet or token account address.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "default": "wallet",
        "enum": [
          "wallet",
          "token_account"
        ]
      }
    },
    {
      "name": "mode",
      "description": "Holder filter mode (percent = by supply % range, top = top holders by supply %).",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string",
        "default": "top",
        "enum": [
          "percent",
          "top"
        ]
      }
    },
    {
      "name": "top_n",
      "description": "Number of top holders to return (used only when mode = top).",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "default": 10,
        "minimum": 1,
        "maximum": 10000
      }
    },
    {
      "name": "min_percent",
      "description": "Minimum % of total supply a holder must have (used only when mode = percent).",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "minimum": 0,
        "maximum": 100
      }
    },
    {
      "name": "max_percent",
      "description": "Maximum % of total supply a holder can have (used only when mode = percent).",
      "in": "query",
      "required": false,
      "schema": {
        "type": "number",
        "minimum": 0,
        "maximum": 100
      }
    },
    {
      "name": "include_list",
      "description": "Return holder list (true / false).",
      "in": "query",
      "required": false,
      "schema": {
        "type": "boolean",
        "default": true
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
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing token holder distribution details",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "description": "Response containing holder-distribution summary data and optional holder rows.",
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
                "description": "Holder-distribution payload for the requested token and mode.",
                "required": [
                  "token_address",
                  "mode",
                  "summary",
                  "holders"
                ],
                "properties": {
                  "token_address": {
                    "type": "string",
                    "description": "The token address the distribution was computed for."
                  },
                  "mode": {
                    "type": "string",
                    "enum": [
                      "percent",
                      "top"
                    ],
                    "description": "The filter mode the result was computed with. `percent` = holders within the [min_percent, max_percent] supply range, `top` = the top_n holders by supply share."
                  },
                  "summary": {
                    "type": "object",
                    "description": "Aggregated statistics across every holder matching the selected mode.",
                    "properties": {
                      "wallet_count": {
                        "type": "integer",
                        "description": "Number of matching holders. Counts token accounts instead of wallets when address_type=token_account."
                      },
                      "total_holding": {
                        "type": "string",
                        "description": "Total token amount held by all matching holders."
                      },
                      "percent_of_supply": {
                        "type": "number",
                        "description": "Percentage of total supply held by all matching holders."
                      }
                    }
                  },
                  "holders": {
                    "type": "array",
                    "description": "The matching holders, ordered by holding descending. Returned only when include_list=true; otherwise an empty array.",
                    "items": {
                      "type": "object",
                      "properties": {
                        "wallet": {
                          "type": "string",
                          "description": "Holder wallet address. Returned when address_type=wallet (default)."
                        },
                        "token_account": {
                          "type": "string",
                          "description": "Holder token account address. Returned when address_type=token_account."
                        },
                        "holding": {
                          "type": "string",
                          "description": "Token amount held by this holder."
                        },
                        "percent_of_supply": {
                          "type": "number",
                          "description": "Percentage of total supply held by this holder."
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "examples": {
            "By wallet (default address_type=wallet)": {
              "value": {
                "success": true,
                "data": {
                  "token_address": "11111Zxp8hv4GVzZTWcgcFTcFCfPzW8YmbwvGahTBP",
                  "mode": "percent",
                  "summary": {
                    "wallet_count": 2,
                    "total_holding": "0.007374018405092705",
                    "percent_of_supply": 0.0000017374018405092703
                  },
                  "holders": [
                    {
                      "wallet": "aXG7W1eYYHN3SyAp515Dqu595wzNJxdGtcG5sjLVky1",
                      "holding": "0.000017910381239401126",
                      "percent_of_supply": 0.0000017910381239401128
                    },
                    {
                      "wallet": "aXG7W1wjjgiNnu8emgqJsTqbN86B8KEeKhN4J4JChqd",
                      "holding": "0.0000007910381239401126",
                      "percent_of_supply": 0.0000017910381239401128
                    }
                  ]
                }
              }
            },
            "By token account (address_type=token_account)": {
              "value": {
                "success": true,
                "data": {
                  "token_address": "5nC81GfjADGGWTiTn2pSrzSefErvya1zUqKq1Ttio7N7",
                  "mode": "percent",
                  "summary": {
                    "wallet_count": 2,
                    "total_holding": "292058.747997",
                    "percent_of_supply": 100
                  },
                  "holders": [
                    {
                      "token_account": "7Sq3fyMWeE87pgi5G1E7HP3EuEHmkSDySpCQdZT9Bvc9",
                      "holding": "292057.747997",
                      "percent_of_supply": 99.99966
                    },
                    {
                      "token_account": "BG5hdVb1Ji3fSWMULxWxTsi3fRnddt6q31JWib1261ew",
                      "holding": "1",
                      "percent_of_supply": 0.00034
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
  "operationId": "get-holder-v1-distribution",
  "x-mint": {
    "href": "/data-api/holder/get-holder-v1-distribution"
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
