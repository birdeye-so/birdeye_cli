---
title: "Token - Fee (Multiple)"
description: "Get global fees paid data for multiple tokens."
hidden: false
metadata:
  title: Birdeye Data API | Token - Fee (Multiple)
  description: Get global fees paid data for multiple tokens.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/v3/token/fee/multiple"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Fee-generation metrics for many tokens in one request.</strong></p>
  <ul>
    <li>Use this endpoint for cross-token comparison rather than single-token drilldown.</li>
    <li><code>alltime</code> data is available starting from <strong>May 26, 2026 at 19:00 UTC</strong>.</li>
    <li>The endpoint accepts a comma-separated token list and up to <code>3</code> interval values.</li>
  </ul>
</Tab>

  <Tab title="Accessibility">
  <ul>
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
    <li>Batch CU is calculated as <code>ceil(3 * count^0.8)</code>.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Rank token sets by fee generation.</li>
    <li>Compare revenue or fee activity across watchlists, cohorts, or protocol baskets.</li>
    <li>Feed dashboards that benchmark protocol usage across multiple tokens.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain=solana</code>.</li>
    <li>Pass token addresses as a comma-separated <code>list_address</code>.</li>
    <li>Choose up to <code>3</code> interval values in <code>interval</code>.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Keep the token set focused on assets you truly want to compare.</li>
    <li>Use the same intervals across the batch so rankings remain interpretable.</li>
    <li>Switch to the single endpoint when one token needs explanation or page-level detail.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/v3/token/fee/multiple

```json
{
  "tags": [
    "Global Fees Paid"
  ],
  "summary": "Token - Fee (Multiple)",
  "description": "Get global fees paid data for multiple tokens.",
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
      "name": "list_address",
      "description": "A list of token addresses in string separated by commas (,)",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "solana": {
          "value": "7c23msBoMSmCAcTkFJd4vksE2XfrPmG9U2xffi86pump,AG98yS95WVxnz7ZpkaNuznnA1wZs9nyWCghMNjZEpump"
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
                "description": "Global fees paid data grouped by token address and timeframe.",
                "additionalProperties": {
                  "type": "object",
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
            }
          },
          "examples": {
            "TokenFeeMultiple": {
              "value": {
                "success": true,
                "data": {
                  "7c23msBoMSmCAcTkFJd4vksE2XfrPmG9U2xffi86pump": {
                    "alltime": {
                      "summary": {
                        "sum_global_fee_paid_amount_sol": 31.844065518,
                        "sum_network_fee_amount_sol": 0.050545,
                        "sum_priority_fee_amount_sol": 3.957795217,
                        "sum_tips_fee_amount_sol": 1.640402995,
                        "sum_trading_platform_fee_amount_sol": 26.195322306,
                        "sum_trading_platform_fee_amount_stablecoins": 234.171577
                      },
                      "details": {
                        "tips_fee_amount_sol": {
                          "helius_sender": 0.085467223,
                          "0slot": 0.20945561,
                          "jito": 0.634858717,
                          "nozomi": 0.173040199,
                          "astralane": 0.053583969,
                          "nextblock": 0.01403,
                          "bloxroute": 0.452099869,
                          "block_razor": 0.016867408,
                          "node1": 0.001
                        },
                        "trading_platform_fee_amount_sol": {
                          "axiom": 15.716007989,
                          "trojan": 0.94711087,
                          "gmgn": 3.141299238,
                          "bonkbot": 0.542045413,
                          "bloom": 0.271720043,
                          "maestro": 0.080572133,
                          "photon": 1.351992787,
                          "padre": 3.987016904,
                          "soltradingbot": 0.00843525,
                          "bullx": 0.149121679
                        },
                        "trading_platform_fee_amout_stablecoins": {
                          "fomo": 205.286954,
                          "gmgn": 20.889774,
                          "padre": 7.994849
                        }
                      }
                    }
                  },
                  "AG98yS95WVxnz7ZpkaNuznnA1wZs9nyWCghMNjZEpump": {
                    "alltime": {
                      "summary": {
                        "sum_global_fee_paid_amount_sol": 11.87455467,
                        "sum_network_fee_amount_sol": 0.018465,
                        "sum_priority_fee_amount_sol": 1.892790462,
                        "sum_tips_fee_amount_sol": 0.690320681,
                        "sum_trading_platform_fee_amount_sol": 9.272978527,
                        "sum_trading_platform_fee_amount_stablecoins": 36.344839
                      },
                      "details": {
                        "tips_fee_amount_sol": {
                          "jito": 0.188022601,
                          "helius_sender": 0.025562077,
                          "0slot": 0.146888977,
                          "astralane": 0.01046,
                          "nozomi": 0.217246026,
                          "block_razor": 0.004541,
                          "node1": 0.0016,
                          "bloxroute": 0.096
                        },
                        "trading_platform_fee_amount_sol": {
                          "axiom": 6.083450079,
                          "padre": 1.205023533,
                          "gmgn": 0.978933497,
                          "trojan": 0.25310262,
                          "bonkbot": 0.256948374,
                          "photon": 0.311659393,
                          "bloom": 0.138585876,
                          "maestro": 0.023461059,
                          "bullx": 0.01,
                          "soltradingbot": 0.011814096
                        },
                        "trading_platform_fee_amout_stablecoins": {
                          "gmgn": 22.276849,
                          "fomo": 11.414191,
                          "padre": 2.653799
                        }
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
  "operationId": "get-defi-v3-token-fee-multiple",
  "x-mint": {
    "href": "/data-api/global-fees-paid/get-defi-v3-token-fee-multiple"
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
