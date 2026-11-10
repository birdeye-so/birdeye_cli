---
title: "Blockchain - Multiple Account Details"
description: "Returns account details for up to 100 Solana addresses.\n"
hidden: false
openapi: "openapi/blockchain/openapi_blockchain_docs.json POST /blockchain/v1/account/detail/multiple"
---
<Tabs>
  <Tab title="Usage Note">
  <ul>
    <li>Batch version of account detail for up to 100 Solana addresses per request.</li>
    <li>Response is a map keyed by address, so missing or unparseable accounts are easy to detect without preserving request order.</li>
    <li>Parsed account data is returned only when Birdeye has a decoder for that account layout.</li>
    <li>Use this endpoint when auditing multiple PDAs, pools, vaults, or launchpad accounts at once.</li>
  </ul>
</Tab>

  <Tab title="Accessibility">
  <ul>
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
    <li>Hydrate a protocol dashboard with many program accounts in one request.</li>
    <li>Batch-inspect pools, vaults, fee accounts, and PDAs during monitoring or indexing.</li>
    <li>Validate account ownership and decoded state across a watchlist of protocol accounts.</li>
    <li>Speed up support, research, and forensic workflows that need multiple account snapshots together.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Send the address list in the <code>addresses</code> array.</li>
    <li>Keep the list deduplicated so each account appears once in the response map.</li>
    <li>Read each returned object's <code>owner</code>, <code>data_parsed</code>, and <code>decode_error</code> to classify the account quickly.</li>
    <li>Join the result back to your own watchlist by address, not by array position.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Chunk large crawls into batches of up to 100 addresses.</li>
    <li>Reuse the single-account endpoint only for ad hoc inspection; use this one for systems and dashboards.</li>
    <li>Group addresses by expected program owner so downstream parsing and validation stay simpler.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

POST /blockchain/v1/account/detail/multiple

```json
{
  "tags": [
    "Account"
  ],
  "summary": "Blockchain - Multiple Account Details",
  "description": "Returns account details for up to 100 Solana addresses.\n",
  "requestBody": {
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "required": [
            "addresses"
          ],
          "properties": {
            "addresses": {
              "type": "array",
              "minItems": 1,
              "maxItems": 100,
              "description": "Solana account addresses. Maximum 100 addresses.",
              "items": {
                "type": "string"
              }
            }
          }
        },
        "example": {
          "addresses": [
            "99wRz6QVMo8HbDQTrv4GrFEUPymiiZeXtzjs3JGVbFNs",
            "BXeZkgCdNgpJ8SkSWqVnheB5WSUm7qy52SkRDrE1Jbi6",
            "12LmXPr2z4TfkDMS4PA87wvAbW8w2JUBKsW5kMV9VN5",
            "125Ei5rFXvLoThesL8PpszoebQS2mTKNtLAH1NECtQd"
          ]
        }
      }
    }
  },
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
                "additionalProperties": {
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
            }
          },
          "examples": {
            "Example": {
              "value": {
                "success": true,
                "data": {
                  "99wRz6QVMo8HbDQTrv4GrFEUPymiiZeXtzjs3JGVbFNs": {
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
                  },
                  "125Ei5rFXvLoThesL8PpszoebQS2mTKNtLAH1NECtQd": {
                    "name": "PoolState",
                    "program": "raydium_launchpad",
                    "lamports": 3876720,
                    "data": "9+3j9dfD3kaYAwAAAAAAAPoABgkBAIDGpH6NAwAAeMX7UdECAN50Dj7pzwMA168w/AYAAAAnJSwK0AAAAFKEfQEAAAAAABJlyhMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVxqOAcjfeCD51ms8c2W40eSvqBt4VMwu91zvWL0Ihn7Z43muccQHrOyvERB3Ee6vHb7tmq6FmYSy3N5CMGKU7nZ83C/DwRkVzNl6PAantRdSQQJH3Cpmg5UU5sC9Mqm1BpuIV/6rgYT7aH9jRhjANdrEOdwa6ztVmKDwAAAAAAHrQeA4dFcQqIaAVqsCc9W3F5F2G0Jk/ZCEJtOcklMVRHxdHEqDRylHj0hq2dRU2r1PPfMyXe34cKp7zuDPd89N4/766J4TkjF3H81LUjcN2ESYLg/P/ukSkC3jAESj940AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "data_parsed": {
                      "amm_creator_fee_on": {
                        "variant": "QuoteToken"
                      },
                      "auth_bump": 250,
                      "base_decimals": 6,
                      "base_mint": "8yXY3Zeb1SWktToQE1ZpC33uVuYLFvMNfVe7zAMNbonk",
                      "base_vault": "GqM54DAsx6XSPuJxqoPkKzmARr2PAW35Hw1QuiRiAfWb",
                      "creator": "GM145cZ2ZwxAv27ggpPLJYSwxKTcvvqM9b9LV4gBoQLL",
                      "epoch": 920,
                      "global_config": "6s1xP3hpbAfFoNtUNF8mfHsjr2Bd97JxFJRWLbL6aHuX",
                      "migrate_fee": 0,
                      "migrate_type": 1,
                      "padding": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                      ],
                      "platform_config": "FfYek5vEz23cMkWsdJwG2oa6EphsvXSHrGpdALN4g6W1",
                      "platform_fee": 0,
                      "platform_vesting_share": 0,
                      "quote_decimals": 9,
                      "quote_mint": "So11111111111111111111111111111111111111112",
                      "quote_protocol_fee": 0,
                      "quote_vault": "9NTuK6boCAFk3gb8V8asp9t7emrXKmkPTxtcCUeGGMDW",
                      "real_base": 893523862823,
                      "real_quote": 25003090,
                      "status": 0,
                      "supply": 1000000000000000,
                      "token_program_flag": 0,
                      "total_base_sell": 793100000000000,
                      "total_quote_fund_raising": 85000000000,
                      "vesting_schedule": {
                        "allocated_share_amount": 0,
                        "cliff_period": 0,
                        "start_time": 0,
                        "total_locked_amount": 0,
                        "unlock_period": 0
                      },
                      "virtual_base": 1073025605596382,
                      "virtual_quote": 30000852951
                    },
                    "owner": "LanMV9sAd7wArD4vJFi2qDdfnVhFxYSUg6eADduJ3uj",
                    "executable": false,
                    "rent_epoch": 18446744073709552000,
                    "is_on_curve": false
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
  "operationId": "post-blockchain-v1-account-detail-multiple",
  "parameters": [],
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
