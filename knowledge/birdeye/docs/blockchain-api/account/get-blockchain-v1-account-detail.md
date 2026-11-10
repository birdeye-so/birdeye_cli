---
title: "Blockchain - Account Detail"
description: "Returns account details for a Solana address.\n"
hidden: false
openapi: "openapi/blockchain/openapi_blockchain_docs.json GET /blockchain/v1/account/detail"
---
<Tabs>
  <Tab title="Usage Note">
  <ul>
    <li>Returns one Solana account by raw address, including both the base64 account data and Birdeye's parsed view when a decoder is available.</li>
    <li><code>data_parsed</code> depends on the owning program and account layout; unknown layouts may only return raw <code>data</code>.</li>
    <li><code>is_on_curve</code> helps distinguish normal keypair addresses from PDAs and program-owned derived accounts.</li>
    <li><code>decode_error</code> may appear when the account exists but its data could not be parsed into a known schema.</li>
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
  <p><strong>Solana</strong></p>
</Tab>
</Tabs>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Inspect any Solana account before deciding whether it is a wallet, PDA, mint, vault, or custom program account.</li>
    <li>Read parsed launchpad, AMM, staking, or token-program state without building your own decoder first.</li>
    <li>Debug protocol integrations by comparing raw base64 data with Birdeye's parsed fields.</li>
    <li>Power block explorers, internal tooling, and support workflows that need fast account introspection.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Pass the Solana address in <code>address</code>.</li>
    <li>Read <code>owner</code> first to understand which program controls the account.</li>
    <li>Use <code>data_parsed</code> when present for structured fields; fall back to raw <code>data</code> when you need your own decoder.</li>
    <li>Check <code>executable</code> and <code>is_on_curve</code> before treating the address like a normal wallet account.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Cache static or rarely changing accounts, especially metadata-like state and immutable PDAs.</li>
    <li>Treat <code>data_parsed</code> as program-specific, not a universal schema across all account owners.</li>
    <li>Use this endpoint together with token metadata, transaction detail, and token-account lookups to reconstruct full protocol state.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /blockchain/v1/account/detail

```json
{
  "tags": [
    "Account"
  ],
  "summary": "Blockchain - Account Detail",
  "description": "Returns account details for a Solana address.\n",
  "parameters": [
    {
      "name": "address",
      "description": "Solana account address.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "example": "99wRz6QVMo8HbDQTrv4GrFEUPymiiZeXtzjs3JGVbFNs"
      }
    }
  ],
  "responses": {
    "200": {
      "description": "Successful response",
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
                "type": "boolean"
              },
              "data": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "Decoded account type or parser label when Birdeye recognizes the account layout."
                  },
                  "program": {
                    "type": "string",
                    "description": "Program family associated with the account data parser."
                  },
                  "lamports": {
                    "type": "integer",
                    "format": "int64",
                    "description": "Lamport balance currently held by the account."
                  },
                  "data": {
                    "type": "string",
                    "description": "Base64 encoded account data."
                  },
                  "data_parsed": {
                    "type": "object",
                    "description": "Best-effort parsed account data when Birdeye has a decoder for this account type.",
                    "additionalProperties": true
                  },
                  "owner": {
                    "type": "string",
                    "description": "Program id that owns the account."
                  },
                  "executable": {
                    "type": "boolean",
                    "description": "Whether the account is executable."
                  },
                  "rent_epoch": {
                    "type": "integer",
                    "format": "int64",
                    "description": "Next epoch at which rent is due, or the sentinel value used by Solana runtime for rent-exempt accounts."
                  },
                  "is_on_curve": {
                    "type": "boolean",
                    "description": "Whether the address lies on the Ed25519 curve and can be a normal wallet keypair."
                  },
                  "decode_error": {
                    "type": "string",
                    "description": "Decoder error message when raw data could not be parsed into a known layout."
                  }
                }
              }
            }
          },
          "examples": {
            "Example": {
              "value": {
                "success": true,
                "data": {
                  "name": "BondingCurve",
                  "program": "pump",
                  "lamports": 2040843,
                  "data": "F7f4N2DYrGDO/8t04s8DALsuJfwGAAAAzme5KFHRAgC7ggEAAAAAAACAxqR+jQMAAFT6k+xbg5mwoIGlqPjjmPN6AYRz8A2IsL6gBVUa37xvAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
                  "data_parsed": {
                    "complete": false,
                    "creator": "6iirpNpiVKgNWm43ZsMqMXhtFhGwmqYjLoJcRCLyMPvN",
                    "is_cashback_coin": true,
                    "is_mayhem_mode": false,
                    "quote_mint": "11111111111111111111111111111111",
                    "real_quote_reserves": 99003,
                    "real_token_reserves": 793096459216846,
                    "token_total_supply": 1000000000000000,
                    "virtual_quote_reserves": 30000099003,
                    "virtual_token_reserves": 1072996459216846
                  },
                  "owner": "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
                  "executable": false,
                  "rent_epoch": 18446744073709552000,
                  "is_on_curve": false
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
  "operationId": "get-blockchain-v1-account-detail",
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
