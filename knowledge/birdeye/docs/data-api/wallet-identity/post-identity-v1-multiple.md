---
title: "Wallet Identity - Multiple"
description: "Resolve up to 100 addresses to their identities in one request. Returns a map keyed by address; each value has the same shape as the single endpoint. Addresses with no identity are omitted.\n"
hidden: false
metadata:
  title: Birdeye Data API | Wallet Identity - Multiple
  description: >
    Resolve up to 100 addresses to their identities in one request. Returns a
    map keyed by address; each value has the same shape as the single endpoint.
    Addresses with no identity are omitted.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json POST /identity/v1/multiple"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Resolve up to 100 addresses to their identities in one request.</strong></p>
  <p>POST a list of addresses and get a map keyed by address: <code>&#123; "&lt;address&gt;": &lt;identity&gt;, … &#125;</code>. Each identity is the same compact object returned by the single endpoint — <code>type</code> (wallet / exchange / protocol / token / …), an optional named <code>entity</code>, a display <code>label</code>, a <code>category</code>, <code>tags</code>, and, for wallets, up to 20 <code>.sol</code> <code>domains</code> plus <code>domains_total</code>. Addresses with no identity (<code>type: unknown</code>) are simply <strong>omitted</strong> from the map.</p>
  <p>For a wallet identified only by a <code>.sol</code> domain, <code>label</code> is set to its first domain (<code>domains[0]</code>). The per-address <code>domains</code> array is a <strong>preview capped at 20</strong>, ordered <strong>shortest-first then alphabetical</strong> — use <code>domains_total</code> for the true count and the <strong><code>domains</code></strong> endpoint for the full list. Non-wallet identities never return domains (a CEX "owning" a <code>.sol</code> domain is SNS spam).</p>
</Tab>

  <Tab title="Accessibility">
  <ul>
    <li>Premium</li>
    <li>Business</li>
    <li>Enterprise</li>
  </ul>
</Tab>

  <Tab title="Chain Supported">
  <p><strong>Solana</strong></p>
</Tab>
</Tabs>

<Accordion title="Identity Field Definitions 🏷️" icon="fa-tags">
  <ul>
    <li><strong>type</strong> — the identity class: <code>wallet</code>, <code>exchange</code>, <code>protocol</code>, <code>token</code>, <code>program</code>, or <code>unknown</code>. Drives how a client should render the address.</li>
    <li><strong>entity</strong> — the named owner when known (e.g. <code>Binance</code>, <code>Jupiter</code>, <code>Astralane</code>). Absent for anonymous wallets.</li>
    <li><strong>label</strong> — the human-readable display name. For a domain-only wallet this is the first (shortest) <code>.sol</code> domain, until the owner's favourite domain is available.</li>
    <li><strong>category</strong> — the broad grouping behind the type (e.g. <code>Wallet</code>, <code>Exchange</code>, <code>Protocol</code>, <code>Token</code>).</li>
    <li><strong>tags</strong> — extra descriptors attached to the identity (e.g. a KOL's name, <code>deposit</code>). Empty array when none apply.</li>
    <li><strong>domains / domains_total</strong> — the <code>.sol</code> domains a wallet owns. <code>domains</code> is capped at 20 and sorted shortest-first then alphabetical; <code>domains_total</code> is the true count.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Label every address in an activity feed, leaderboard, or CSV export in a single round-trip.</li>
    <li>Annotate a batch of counterparties from a set of transactions with names, types, and tags.</li>
    <li>Back a UI that renders many addresses at once (holder lists, transfer tables) with identities.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Body: <strong><code>&#123; "addresses": ["&lt;addr1&gt;", "&lt;addr2&gt;", … ] &#125;</code></strong> — 1 to 100 addresses. Duplicates are de-duplicated.</li>
    <li>Returns <code>&#123; "&lt;address&gt;": &lt;identity&gt;, … &#125;</code>; addresses with no label are omitted (not returned as <code>null</code>).</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>De-duplicate and cap input at 100 per call; page your own list across multiple requests.</li>
    <li>Prefer this over many single calls when labelling more than a couple of addresses.</li>
    <li>Trust each identity's <code>domains_total</code>, not <code>domains.length</code> — the array is a 20-item preview; use the <code>domains</code> endpoint for a wallet's full list.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>At most <strong>100 addresses</strong> per request.</li>
    <li>Unlabelled addresses (<code>type: unknown</code>) are omitted from the response map.</li>
    <li>Each identity returns at most <strong>20 domains</strong> (a preview) — use the <code>domains</code> endpoint for the full set.</li>
    <li>Domains are returned only for <code>type: wallet</code>; non-wallet identities suppress them (SNS-spam guard).</li>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

POST /identity/v1/multiple

```json
{
  "tags": [
    "Wallet Identity"
  ],
  "summary": "Wallet Identity - Multiple",
  "description": "Resolve up to 100 addresses to their identities in one request. Returns a map keyed by address; each value has the same shape as the single endpoint. Addresses with no identity are omitted.\n",
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
              "description": "Wallet addresses (or .sol domains) to resolve. Maximum 100; duplicates are de-duplicated.",
              "items": {
                "type": "string"
              }
            }
          }
        },
        "example": {
          "addresses": [
            "DaP44wF8mKmYki1M5zguvXYAW5XF6sLQEzvdmvcizRqD",
            "5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9"
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
                    "address": {
                      "type": "string",
                      "description": "The resolved wallet address."
                    },
                    "input_domain": {
                      "type": "string",
                      "description": "Present only when a .sol domain was passed as the input; the domain that resolved to this address."
                    },
                    "type": {
                      "type": "string",
                      "enum": [
                        "wallet",
                        "exchange",
                        "protocol",
                        "token",
                        "program",
                        "unknown"
                      ],
                      "description": "Identity class of the address. Drives how a client should render it. `unknown` means no identity is known."
                    },
                    "entity": {
                      "type": "string",
                      "description": "The named owner when known (e.g. Binance, Jupiter, Astralane). Absent for anonymous wallets."
                    },
                    "label": {
                      "type": "string",
                      "description": "Human-readable display name. For a wallet identified only by a .sol domain, this is its first (shortest) domain."
                    },
                    "category": {
                      "type": "string",
                      "description": "Broad grouping behind the type (e.g. Wallet, Exchange, Protocol, Token)."
                    },
                    "tags": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      },
                      "description": "Extra descriptors attached to the identity (e.g. a KOL's name, deposit). Empty array when none apply."
                    },
                    "domains": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      },
                      "description": "The .sol domains a wallet owns — a preview capped at 20, ordered shortest-first then alphabetical. Returned only for type=wallet; use the domains endpoint for the full list."
                    },
                    "domains_total": {
                      "type": "integer",
                      "description": "True number of .sol domains the wallet owns (the domains array above is a capped preview)."
                    }
                  }
                },
                "description": "Map keyed by address → identity. Addresses with no identity (type=unknown) are omitted."
              }
            }
          },
          "examples": {
            "Example": {
              "value": {
                "success": true,
                "data": {
                  "DaP44wF8mKmYki1M5zguvXYAW5XF6sLQEzvdmvcizRqD": {
                    "address": "DaP44wF8mKmYki1M5zguvXYAW5XF6sLQEzvdmvcizRqD",
                    "type": "wallet",
                    "label": "dap4.sol",
                    "category": "Wallet",
                    "tags": [],
                    "domains": [
                      "dap4.sol",
                      "uapx.sol",
                      "ufox.sol",
                      "blxme.sol",
                      "bruca.sol"
                    ],
                    "domains_total": 2192
                  },
                  "5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9": {
                    "address": "5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9",
                    "type": "exchange",
                    "entity": "Binance",
                    "label": "Binance",
                    "category": "Exchange",
                    "tags": [
                      "Binance"
                    ]
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
  "operationId": "post-identity-v1-multiple",
  "x-mint": {
    "href": "/data-api/wallet-identity/post-identity-v1-multiple"
  },
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
