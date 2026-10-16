---
title: "Token - Fee (Single)"
description: "Get global fees paid data for a single token."
hidden: false
metadata:
  title: Birdeye Data API | Token - Fee (Single)
  description: Get global fees paid data for a single token.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/token/fee/single"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Fee-generation metrics for one token across selected intervals.</strong></p>
  <ul>
    <li><code>interval</code> accepts up to the supported global-fee timeframes.</li>
    <li><code>alltime</code> data is available starting from <strong>May 26, 2026 at 19:00 UTC</strong>.</li>
    <li>Use this endpoint when one token needs fee detail rather than cross-token comparison.</li>
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
    <li>This endpoint consumes <code>3 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Inspect how much fee activity one token has generated over different horizons.</li>
    <li>Add monetization or protocol-activity context to token research pages.</li>
    <li>Compare fee-generation against price, volume, and liquidity trends for one token.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Pass the token <code>address</code>.</li>
    <li>Choose one or more supported <code>interval</code> values for the view you need.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Pair fee data with volume and market data to tell whether usage and trading are rising together.</li>
    <li>Use shorter intervals for recent momentum and <code>alltime</code> for cumulative protocol footprint.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/token/fee/single

```json
{
  "tags": [
    "Global Fees Paid"
  ],
  "summary": "Token - Fee (Single)",
  "description": "Get global fees paid data for a single token.",
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
        "solana": {
          "value": "7c23msBoMSmCAcTkFJd4vksE2XfrPmG9U2xffi86pump"
        }
      }
    },
    {
      "name": "interval",
      "description": "A list of intervals separated by comma (,). Supported values: alltime, 24h, 8h, 4h, 2h, 1h, 30m, 15m, 5m, 1m. Maximum 3 timeframes per request.",
      "in": "query",
      "required": false,
      "schema": {
        "type": "string"
      },
      "examples": {
        "single": {
          "value": "alltime"
        },
        "double": {
          "value": "5m,alltime"
        },
        "triple": {
          "value": "15m,24h,alltime"
        }
      }
    }
  ],
  "responses": {
    "200": {
      "description": "OK",
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
                "description": "Global fees paid data grouped by timeframe.",
                "additionalProperties": {
                  "type": "object",
                  "properties": {
                    "summary": {
                      "type": "object",
                      "properties": {
                        "sum_global_fee_paid_amount_sol": {
                          "type": "number",
                          "description": "Total global fees paid in SOL."
                        },
                        "sum_network_fee_amount_sol": {
                          "type": "number",
                          "description": "Total network fees paid in SOL."
                        },
                        "sum_priority_fee_amount_sol": {
                          "type": "number",
                          "description": "Total priority fees paid in SOL."
                        },
                        "sum_tips_fee_amount_sol": {
                          "type": "number",
                          "description": "Total tips fees paid in SOL."
                        },
                        "sum_trading_platform_fee_amount_sol": {
                          "type": "number",
                          "description": "Total trading platform fees paid in SOL."
                        },
                        "sum_trading_platform_fee_amount_stablecoins": {
                          "type": "number",
                          "description": "Total trading platform fees paid in stablecoins."
                        }
                      },
                      "description": "Aggregated fee totals for the timeframe."
                    },
                    "details": {
                      "type": "object",
                      "properties": {
                        "tips_fee_amount_sol": {
                          "type": "object",
                          "description": "Breakdown of tips fees paid in SOL by provider.",
                          "additionalProperties": {
                            "type": "number"
                          }
                        },
                        "trading_platform_fee_amount_sol": {
                          "type": "object",
                          "description": "Breakdown of trading platform fees paid in SOL by provider.",
                          "additionalProperties": {
                            "type": "number"
                          }
                        },
                        "trading_platform_fee_amout_stablecoins": {
                          "type": "object",
                          "description": "Breakdown of trading platform fees paid in stablecoins by provider.",
                          "additionalProperties": {
                            "type": "number"
                          }
                        }
                      },
                      "description": "Provider-level fee breakdown for the timeframe."
                    },
                    "unix_start": {
                      "type": "number",
                      "description": "Start of the timeframe as a Unix timestamp."
                    },
                    "unix_end": {
                      "type": "number",
                      "description": "End of the timeframe as a Unix timestamp."
                    }
                  }
                }
              }
            }
          },
          "examples": {
            "TokenFeeSingle": {
              "value": {
                "success": true,
                "data": {
                  "5m": {
                    "summary": {
                      "sum_global_fee_paid_amount_sol": 2.260741268,
                      "sum_network_fee_amount_sol": 0.00409,
                      "sum_priority_fee_amount_sol": 0.264060373,
                      "sum_tips_fee_amount_sol": 0.084882903,
                      "sum_trading_platform_fee_amount_sol": 1.907707992,
                      "sum_trading_platform_fee_amount_stablecoins": 20.888957
                    },
                    "details": {
                      "tips_fee_amount_sol": {
                        "block_razor": 0.0008785,
                        "jito": 0.027954592,
                        "helius_sender": 0.003794858,
                        "bloxroute": 0.0155,
                        "0slot": 0.016689954,
                        "nozomi": 0.007,
                        "nextblock": 0.013,
                        "astralane": 0.000064999
                      },
                      "trading_platform_fee_amount_sol": {
                        "axiom": 1.094898688,
                        "padre": 0.240799484,
                        "gmgn": 0.265565729,
                        "photon": 0.149330908,
                        "trojan": 0.109667944,
                        "bullx": 0.005773436,
                        "bloom": 0.03079268,
                        "bonkbot": 0.010879123
                      },
                      "trading_platform_fee_amout_stablecoins": {
                        "fomo": 19.838957,
                        "gmgn": 1.05
                      }
                    },
                    "unix_start": 1779869700,
                    "unix_end": 1779870005
                  },
                  "alltime": {
                    "summary": {
                      "sum_global_fee_paid_amount_sol": 14.072168125,
                      "sum_network_fee_amount_sol": 0.021225,
                      "sum_priority_fee_amount_sol": 1.502911309,
                      "sum_tips_fee_amount_sol": 0.645540837,
                      "sum_trading_platform_fee_amount_sol": 11.902490979,
                      "sum_trading_platform_fee_amount_stablecoins": 93.877686
                    },
                    "details": {
                      "tips_fee_amount_sol": {
                        "helius_sender": 0.03185853,
                        "0slot": 0.099127349,
                        "jito": 0.313039066,
                        "nozomi": 0.070482395,
                        "astralane": 0.014424995,
                        "nextblock": 0.01403,
                        "bloxroute": 0.0955,
                        "block_razor": 0.007078502
                      },
                      "trading_platform_fee_amount_sol": {
                        "axiom": 7.315011285,
                        "trojan": 0.31617015,
                        "gmgn": 1.338555658,
                        "bonkbot": 0.335715947,
                        "bloom": 0.212465719,
                        "maestro": 0.053424493,
                        "photon": 0.554688827,
                        "padre": 1.725283079,
                        "soltradingbot": 0.00303525,
                        "bullx": 0.048140571
                      },
                      "trading_platform_fee_amout_stablecoins": {
                        "fomo": 77.976457,
                        "gmgn": 14.504494,
                        "padre": 1.396735
                      }
                    }
                  },
                  "24h": {
                    "summary": {
                      "sum_global_fee_paid_amount_sol": 14.072168125,
                      "sum_network_fee_amount_sol": 0.021225,
                      "sum_priority_fee_amount_sol": 1.502911309,
                      "sum_tips_fee_amount_sol": 0.645540837,
                      "sum_trading_platform_fee_amount_sol": 11.902490979,
                      "sum_trading_platform_fee_amount_stablecoins": 93.877686
                    },
                    "details": {
                      "tips_fee_amount_sol": {
                        "helius_sender": 0.03185853,
                        "0slot": 0.099127349,
                        "jito": 0.313039066,
                        "nozomi": 0.070482395,
                        "astralane": 0.014424995,
                        "nextblock": 0.01403,
                        "bloxroute": 0.0955,
                        "block_razor": 0.007078502
                      },
                      "trading_platform_fee_amount_sol": {
                        "axiom": 7.315011285,
                        "trojan": 0.31617015,
                        "gmgn": 1.338555658,
                        "bonkbot": 0.335715947,
                        "bloom": 0.212465719,
                        "maestro": 0.053424493,
                        "photon": 0.554688827,
                        "padre": 1.725283079,
                        "soltradingbot": 0.00303525,
                        "bullx": 0.048140571
                      },
                      "trading_platform_fee_amout_stablecoins": {
                        "fomo": 77.976457,
                        "gmgn": 14.504494,
                        "padre": 1.396735
                      }
                    },
                    "unix_start": 1779782400,
                    "unix_end": 1779870600
                  }
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
  "operationId": "get-defi-v3-token-fee-single",
  "x-mint": {
    "href": "/data-api/global-fees-paid/get-defi-v3-token-fee-single"
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
