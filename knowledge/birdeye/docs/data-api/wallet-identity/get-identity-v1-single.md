---
title: "Wallet Identity - Single"
description: "Resolve one address to a compact identity: its type, named entity, display label, category, tags, and — for wallets — the .sol domains it owns (a preview capped at 20, with `domains_total` for the true count). A .sol domain passed as `address` resolves to its owner. Non-wallet identities do not return domains.\n"
hidden: false
metadata:
  title: Birdeye Data API | Wallet Identity - Single
  description: >
    Resolve one address to a compact identity: its type, named entity, display
    label, category, tags, and — for wallets — the .sol domains it owns (a
    preview capped at 20, with `domains_total` for the true count). A .sol
    domain passed as `address` resolves to its owner. Non-wallet identities do
    not return domains.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /identity/v1/single"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Resolve one address to a single compact identity — who an address is, not what it did.</strong></p>
  <p>Pass a wallet address — or a <code>.sol</code> domain, which resolves to its owner — and get one identity object: a <code>type</code> (wallet / exchange / protocol / token / …), an optional named <code>entity</code>, a display <code>label</code>, a <code>category</code>, <code>tags</code>, and, for wallets, the <code>.sol</code> <code>domains</code> it owns plus <code>domains_total</code>.</p>
  <p>For a wallet identified only by a <code>.sol</code> domain, <code>label</code> is set to its first domain (<code>domains[0]</code>). The <code>domains</code> array is a <strong>preview capped at 20</strong>, ordered <strong>shortest-first then alphabetical</strong> — read <code>domains_total</code> for the true count and use the <strong><code>domains</code></strong> endpoint to page through them all. Non-wallet identities (exchange / protocol / token) never return domains: a CEX "owning" a <code>.sol</code> domain is SNS spam (anyone can point a domain's owner at any address).</p>
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
    <li>Put a human-readable name on a single address — exchange, protocol, known entity, or named wallet — instead of raw base58.</li>
    <li>Resolve a <code>.sol</code> domain to its owning wallet in one call.</li>
    <li>Enrich a transaction view, address page, or alert with a compact identity.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li><strong><code>address</code></strong> *(required)* — a wallet address <strong>or</strong> a <code>.sol</code> domain (resolves to the owner).</li>
    <li>Returns one identity object. An address with no label returns an empty object.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Trust <code>domains_total</code>, not <code>domains.length</code> — the array is a 20-item preview.</li>
    <li>Need every domain? Call the <code>domains</code> endpoint and page; don't infer it from this response.</li>
    <li>Treat a domain-only wallet's <code>label</code> as a display convenience (the shortest domain), not a user-chosen primary.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Returns at most <strong>20 domains</strong> (a preview) — use the <code>domains</code> endpoint for the full set.</li>
    <li>Domains are returned only for <code>type: wallet</code>; non-wallet identities suppress them (SNS-spam guard).</li>
    <li>The domain-only wallet <code>label</code> = first (shortest) domain until SNS favourite-domain ingest lands.</li>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /identity/v1/single

```json
{
  "tags": [
    "Wallet Identity"
  ],
  "summary": "Wallet Identity - Single",
  "description": "Resolve one address to a compact identity: its type, named entity, display label, category, tags, and — for wallets — the .sol domains it owns (a preview capped at 20, with `domains_total` for the true count). A .sol domain passed as `address` resolves to its owner. Non-wallet identities do not return domains.\n",
  "parameters": [
    {
      "name": "address",
      "description": "A Solana wallet address, or a .sol domain that resolves to its owner.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "example": "DaP44wF8mKmYki1M5zguvXYAW5XF6sLQEzvdmvcizRqD"
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
              }
            }
          },
          "examples": {
            "Example": {
              "value": {
                "success": true,
                "data": {
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
  "operationId": "get-identity-v1-single",
  "x-mint": {
    "href": "/data-api/wallet-identity/get-identity-v1-single"
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
