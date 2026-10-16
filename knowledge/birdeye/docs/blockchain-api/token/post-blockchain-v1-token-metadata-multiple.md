---
title: "Blockchain - Multiple Token Metadata"
description: "Returns metadata for up to 100 Solana token mints.\n"
hidden: false
openapi: "openapi/blockchain/openapi_blockchain_docs.json POST /blockchain/v1/token/metadata/multiple"
---
<Tabs>
  <Tab title="Usage Note">
  <ul>
    <li>Batch version of Solana token metadata for up to 100 mint addresses per request.</li>
    <li>Response is keyed by mint address, which makes it easy to merge into watchlists, portfolios, or discovery pipelines.</li>
    <li>Each entry may be <code>null</code> if the mint is unknown, invalid, or metadata is unavailable.</li>
    <li>This endpoint is better than repeated single calls when populating token tables or NFT inventories.</li>
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
    <li>Hydrate large Solana token lists with mint and metadata fields in one request.</li>
    <li>Prepare NFT inventories, token directories, and portfolio tables without serial single-mint lookups.</li>
    <li>Batch-check authority, mutability, collection, and royalty fields across many mints.</li>
    <li>Reduce request overhead when building Solana-first explorers or backoffice tools.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Send the mint list in the <code>tokens</code> array.</li>
    <li>Deduplicate mint addresses before the request.</li>
    <li>Read the returned map by mint key and handle <code>null</code> entries conservatively.</li>
    <li>Cache the successful mint metadata and refresh it less often than activity data.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Chunk large metadata jobs into batches of up to 100 mints.</li>
    <li>Persist core mint metadata locally so repeated screens do not fan out to the endpoint again.</li>
    <li>Resolve the off-chain <code>uri</code> asynchronously if you also need extended JSON metadata or images.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

POST /blockchain/v1/token/metadata/multiple

```json
{
  "tags": [
    "Token"
  ],
  "summary": "Blockchain - Multiple Token Metadata",
  "description": "Returns metadata for up to 100 Solana token mints.\n",
  "requestBody": {
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "type": "object",
          "required": [
            "tokens"
          ],
          "properties": {
            "tokens": {
              "type": "array",
              "minItems": 1,
              "maxItems": 100,
              "description": "Solana token mint addresses. Maximum 100 tokens.",
              "items": {
                "type": "string"
              }
            }
          }
        },
        "example": {
          "tokens": [
            "FhMxWnZts95ViF8hgzwvomydAiLP9qfgZHyGRnvkNia5",
            "6hiALznKpxkDjUXmmja8QhCY3meTN1wTEga8vSSUgaA4"
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
                  "oneOf": [
                    {
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
                    },
                    {
                      "type": "null"
                    }
                  ]
                }
              }
            }
          },
          "examples": {
            "Example": {
              "value": {
                "success": true,
                "data": {
                  "FhMxWnZts95ViF8hgzwvomydAiLP9qfgZHyGRnvkNia5": {
                    "supply": 999743839592276900,
                    "decimals": 9,
                    "is_initialized": true,
                    "mint_authority": null,
                    "freeze_authority": null,
                    "is_nft": false,
                    "key": "MetadataV1",
                    "update_authority": "65USnH8wG5iGXNUcYqSFzfdUUKDhZ9PtM1Lc4h142xc9",
                    "name": "LYDIAN$",
                    "symbol": "LYD$",
                    "uri": "https://nftstorage.link/ipfs/bafkreictlkcmobpvfaou6layeextjgf5ytlzjnijsnxppwt4vhup4jqpwu/",
                    "seller_fee_basis_points": 0,
                    "creators": [
                      {
                        "address": "65USnH8wG5iGXNUcYqSFzfdUUKDhZ9PtM1Lc4h142xc9",
                        "verified": true,
                        "share": 100
                      }
                    ],
                    "primary_sale_happened": false,
                    "is_mutable": false,
                    "edition_nonce": 255,
                    "token_standard": "Fungible"
                  },
                  "6hiALznKpxkDjUXmmja8QhCY3meTN1wTEga8vSSUgaA4": {
                    "supply": 996756255212019,
                    "decimals": 9,
                    "is_initialized": true,
                    "mint_authority": null,
                    "freeze_authority": null,
                    "is_nft": false,
                    "key": "MetadataV1",
                    "update_authority": "8X27f7skxnSZv5LmyqvHL2uazGrSyBeawBr88rn9Zun8",
                    "name": "dog wif hoodie",
                    "symbol": "dwh",
                    "uri": "https://maroon-genetic-fowl-955.mypinata.cloud/ipfs/QmcKFww8gFwuCmPJcJDS17qsWQ9DBj2poTXajoezGSTWFQ",
                    "seller_fee_basis_points": 0,
                    "creators": [
                      {
                        "address": "8X27f7skxnSZv5LmyqvHL2uazGrSyBeawBr88rn9Zun8",
                        "verified": true,
                        "share": 100
                      }
                    ],
                    "primary_sale_happened": false,
                    "is_mutable": true,
                    "edition_nonce": 254,
                    "token_standard": "Fungible"
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
  "operationId": "post-blockchain-v1-token-metadata-multiple",
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
