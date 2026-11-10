---
title: "Blockchain - Token Metadata"
description: "Returns metadata for a Solana token mint.\n"
hidden: false
openapi: "openapi/blockchain/openapi_blockchain_docs.json GET /blockchain/v1/token/metadata"
---
<Tabs>
  <Tab title="Usage Note">
  <ul>
    <li>Returns mint-level metadata and Metaplex metadata for one Solana token mint.</li>
    <li>Useful for both fungible tokens and NFTs; <code>is_nft</code> and <code>token_standard</code> help separate the two.</li>
    <li><code>mint_authority</code> and <code>freeze_authority</code> may be <code>null</code> when those controls have been removed.</li>
    <li><code>uri</code> points to off-chain metadata and should be treated as external content that can change or disappear.</li>
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
    <li>Fetch Solana mint metadata for wallets, galleries, explorers, and internal tooling.</li>
    <li>Check token authorities, mutability, and royalty fields before listing or supporting an asset.</li>
    <li>Distinguish fungible tokens, NFTs, and collection-linked assets from one endpoint.</li>
    <li>Hydrate token cards and token detail pages with on-chain metadata before reading off-chain JSON.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Pass the mint address in <code>token</code>.</li>
    <li>Read <code>decimals</code>, <code>supply</code>, and <code>is_initialized</code> for mint-level basics.</li>
    <li>Use <code>update_authority</code>, <code>is_mutable</code>, and <code>collection</code> when you need NFT or creator checks.</li>
    <li>Fetch and cache the off-chain <code>uri</code> separately if your application needs artwork or extended attributes.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Cache this metadata more aggressively than price or trade data.</li>
    <li>Treat off-chain URI content as untrusted input and validate it before display.</li>
    <li>Combine this endpoint with account detail or token-account queries when you need both metadata and holdings.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /blockchain/v1/token/metadata

```json
{
  "tags": [
    "Token"
  ],
  "summary": "Blockchain - Token Metadata",
  "description": "Returns metadata for a Solana token mint.\n",
  "parameters": [
    {
      "name": "token",
      "description": "Solana token mint address.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "example": "2wjBpgBd215Wp5s9hxJ8wG8K7hoxEhGFfyp55NCh8Fmt"
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
                  "supply": {
                    "type": "integer",
                    "format": "int64",
                    "description": "Raw total supply reported by the mint."
                  },
                  "decimals": {
                    "type": "integer",
                    "description": "Number of decimals used by the mint."
                  },
                  "is_initialized": {
                    "type": "boolean",
                    "description": "Whether the mint account is initialized."
                  },
                  "mint_authority": {
                    "type": [
                      "string",
                      "null"
                    ],
                    "description": "Current mint authority, if minting is still allowed."
                  },
                  "freeze_authority": {
                    "type": [
                      "string",
                      "null"
                    ],
                    "description": "Current freeze authority, if freezing is supported."
                  },
                  "is_nft": {
                    "type": "boolean",
                    "description": "Whether the mint is classified as an NFT."
                  },
                  "key": {
                    "type": "string",
                    "description": "Metaplex metadata account discriminator or key type."
                  },
                  "update_authority": {
                    "type": [
                      "string",
                      "null"
                    ],
                    "description": "Metaplex update authority that can change metadata."
                  },
                  "name": {
                    "type": "string",
                    "description": "Token or NFT name from metadata."
                  },
                  "symbol": {
                    "type": "string",
                    "description": "Token or NFT symbol from metadata."
                  },
                  "uri": {
                    "type": "string",
                    "description": "Metadata URI published by the token creator."
                  },
                  "seller_fee_basis_points": {
                    "type": "integer",
                    "description": "Royalty basis points stored in Metaplex metadata."
                  },
                  "creators": {
                    "type": "array",
                    "description": "Creator entries declared in the token metadata.",
                    "items": {
                      "type": "object",
                      "properties": {
                        "address": {
                          "type": "string",
                          "description": "Creator wallet address."
                        },
                        "verified": {
                          "type": "boolean",
                          "description": "Whether the creator entry has been verified on-chain."
                        },
                        "share": {
                          "type": "integer",
                          "description": "Royalty share percentage assigned to the creator."
                        }
                      }
                    }
                  },
                  "primary_sale_happened": {
                    "type": "boolean",
                    "description": "Whether the primary sale flag has been set in metadata."
                  },
                  "is_mutable": {
                    "type": "boolean",
                    "description": "Whether the metadata can still be modified."
                  },
                  "edition_nonce": {
                    "type": [
                      "integer",
                      "null"
                    ],
                    "description": "Edition nonce when the mint is part of a Metaplex master-edition flow."
                  },
                  "token_standard": {
                    "type": "string",
                    "description": "Metaplex token standard classification."
                  },
                  "collection": {
                    "type": "object",
                    "properties": {
                      "verified": {
                        "type": "boolean",
                        "description": "Whether the collection link has been verified."
                      },
                      "key": {
                        "type": "string",
                        "description": "Collection mint address."
                      }
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
                  "supply": 1,
                  "decimals": 0,
                  "is_initialized": true,
                  "mint_authority": "HZZKPtYNXzvD7UUNA5BAJdTV6waECFQ4bYV2VrfVyDfk",
                  "freeze_authority": "HZZKPtYNXzvD7UUNA5BAJdTV6waECFQ4bYV2VrfVyDfk",
                  "is_nft": true,
                  "key": "MetadataV1",
                  "update_authority": "3bwq8YJDGQN6GJfGjcrkCTKT2g2LCzBdgtg6x7PmE3Fz",
                  "name": "Magellanic Clouds",
                  "symbol": "",
                  "uri": "https://bafkreiblcmp6u7j6fdspyr7sf2igpbipihqexecj3d4mg43brpxfombnxm.ipfs.dweb.link?ext=",
                  "seller_fee_basis_points": 1000,
                  "creators": [
                    {
                      "address": "3bwq8YJDGQN6GJfGjcrkCTKT2g2LCzBdgtg6x7PmE3Fz",
                      "verified": true,
                      "share": 98
                    },
                    {
                      "address": "tsU33UT3K2JTfLgHUo7hdzRhRe4wth885cqVbM8WLiq",
                      "verified": true,
                      "share": 2
                    }
                  ],
                  "primary_sale_happened": false,
                  "is_mutable": true,
                  "edition_nonce": 253,
                  "token_standard": "NonFungible",
                  "collection": {
                    "verified": true,
                    "key": "H2MmeHoKSTzmfmtd8HDEfTtTbDFsXKbnDA6Ec2Pjrvvc"
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
  "operationId": "get-blockchain-v1-token-metadata",
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
