---
title: "Token - Creation Token Info"
description: "Retrieve the creation transaction information of a specified token"
hidden: false
metadata:
  title: Birdeye Data API | Token - Creation Token Info
  description: Retrieve the creation transaction information of a specified token
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/token_creation_info"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Creation transaction context for one token.</strong></p>
  <ul>
    <li>This endpoint returns the mint-creation or contract-creation context for a token.</li>
    <li>Useful when you need provenance, launch timing, or creation-wallet attribution.</li>
    <li>Supported networks are <code>solana</code>, <code>bsc</code>, <code>base</code>, <code>ethereum</code>, and <code>monad</code>.</li>
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
  <p><strong>BSC</strong></p>
  <p><strong>Base</strong></p>
  <p><strong>Ethereum</strong></p>
  <p><strong>Monad</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>30 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Attribute a token to its creation wallet or deployment event.</li>
    <li>Build launch timelines, provenance checks, and token-origin reviews.</li>
    <li>Pair token creation context with holder or security analysis for early-stage token research.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> to one of the supported creation-info networks.</li>
    <li>Pass the token <code>address</code>.</li>
    <li>Use the returned creation details as the earliest anchor in token lifecycle analysis.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Use creation info early in token review so later holder, trade, and security analysis has a clean origin point.</li>
    <li>Pair this endpoint with trending, security, and holder endpoints for launch diligence.</li>
  </ul>
</Accordion>

<br />


## Resolved API contract

GET /defi/token_creation_info

```json
{
  "tags": [
    "Creation & Trending"
  ],
  "summary": "Token - Creation Token Info",
  "description": "Retrieve the creation transaction information of a specified token",
  "parameters": [
    {
      "name": "x-chain",
      "description": "Solana, BSC, Base, Ethereum, Monad, Robinhood networks only.",
      "in": "header",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "solana",
          "bsc",
          "base",
          "ethereum",
          "monad",
          "robinhood"
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
          "value": "D7rcV8SPxbv94s3kJETkrfMrWqHFs6qrmtbiu6saaany"
        }
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing creation information of a token",
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
                  "txHash": {
                    "type": "string"
                  },
                  "slot": {
                    "type": "integer"
                  },
                  "tokenAddress": {
                    "type": "string"
                  },
                  "decimals": {
                    "type": "integer"
                  },
                  "owner": {
                    "type": "string"
                  },
                  "blockUnixTime": {
                    "type": "integer"
                  },
                  "blockHumanTime": {
                    "type": "string"
                  }
                }
              }
            }
          },
          "examples": {
            "TokenCreationInfo": {
              "value": {
                "success": true,
                "data": {
                  "txHash": "3cW2HpkUs5Hg2FBMa52iJoSMUf8MNkkzkRcGuBs1JEesQ1pnsvNwCbTmZfeJf8hTi9NSHh1Tqx6Rz5Wrr7ePDEps",
                  "slot": 223012712,
                  "tokenAddress": "D7rcV8SPxbv94s3kJETkrfMrWqHFs6qrmtbiu6saaany",
                  "decimals": 5,
                  "owner": "JEFL3KwPQeughdrQAjLo9o75qh15nYbFJ2ZDrb695qsZ",
                  "blockUnixTime": 1697044029,
                  "blockHumanTime": "2023-10-11T17:07:09.000Z"
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
  "operationId": "get-defi-token_creation_info",
  "x-mint": {
    "href": "/data-api/creation-trending/get-defi-token-creation-info"
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
