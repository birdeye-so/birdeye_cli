---
title: "Wallet Identity - Domains"
description: "The full, paginated .sol domain list for one wallet (a wallet can own 100k+). Domains are ordered shortest-first then alphabetical, so page 1 matches the domains preview from the single/multiple endpoints. Only wallets return domains.\n"
hidden: false
metadata:
  title: Birdeye Data API | Wallet Identity - Domains
  description: >
    The full, paginated .sol domain list for one wallet (a wallet can own
    100k+). Domains are ordered shortest-first then alphabetical, so page 1
    matches the domains preview from the single/multiple endpoints. Only wallets
    return domains.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /identity/v1/domains"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>The full, paginated <code>.sol</code> domain list for one wallet.</strong></p>
  <p>Where <code>single</code>/<code>multiple</code> return only a 20-domain preview, this endpoint returns <strong>every</strong> domain a wallet owns — a single wallet can hold 100k+ — so it is single-address and paginated. The response is <code>&#123; address, total, offset, limit, domains &#125;</code>, where <code>domains</code> is the requested page and <code>total</code> is the full count.</p>
  <p>Domains are ordered <strong>shortest-first then alphabetical</strong>, so <strong>page 1 (<code>offset=0</code>) equals the <code>domains</code> preview returned by the <code>single</code>/<code>multiple</code> endpoints</strong>. Domains are returned only for wallets — a CEX / protocol / token "owning" a <code>.sol</code> domain is SNS spam (anyone can point a domain's owner at any address), so those addresses return an empty list.</p>
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

<Accordion title="Response Field Definitions 🏷️" icon="fa-tags">
  <ul>
    <li><strong>address</strong> — the wallet the domains belong to.</li>
    <li><strong>total</strong> — the true number of <code>.sol</code> domains the wallet owns (across all pages).</li>
    <li><strong>offset / limit</strong> — the pagination window echoed back from the request.</li>
    <li><strong>domains</strong> — the requested page of domain names, ordered shortest-first then alphabetical.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Enumerate every <code>.sol</code> domain a wallet holds for a profile, audit, or portfolio view.</li>
    <li>Build a domain-explorer or reverse-lookup that lists all names behind one owner.</li>
    <li>Verify a specific domain is (or isn't) among a wallet's holdings by paging the full set.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li><strong><code>address</code></strong> *(required)* — the wallet address to list domains for.</li>
    <li><strong><code>offset</code></strong> *(optional, default <code>0</code>)* — number of domains to skip.</li>
    <li><strong><code>limit</code></strong> *(optional, default <code>50</code>, max <code>100</code>)* — page size.</li>
    <li>Read <code>total</code>, then page forward with <code>offset += limit</code> until you've read <code>total</code> items.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Drive pagination from <code>total</code>, not from the length of a single page.</li>
    <li>Only need a preview? The <code>single</code> endpoint's <code>domains</code> array already gives the first 20 — no need to call this.</li>
    <li>Keep <code>limit</code> at or below 100; larger pages are rejected.</li>
  </ul>
</Accordion>

<Accordion title="Limitations ⚠️" icon="fa-exclamation-triangle">
  <ul>
    <li>Single wallet per request — this endpoint is not batched.</li>
    <li><code>limit</code> is capped at <strong>100</strong> per page.</li>
    <li>Non-wallet identities (exchange / protocol / token) return an empty <code>domains</code> list (SNS-spam guard).</li>
    <li>Solana only.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /identity/v1/domains

```json
{
  "tags": [
    "Wallet Identity"
  ],
  "summary": "Wallet Identity - Domains",
  "description": "The full, paginated .sol domain list for one wallet (a wallet can own 100k+). Domains are ordered shortest-first then alphabetical, so page 1 matches the domains preview from the single/multiple endpoints. Only wallets return domains.\n",
  "parameters": [
    {
      "name": "address",
      "description": "The wallet address to list .sol domains for.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string",
        "example": "DaP44wF8mKmYki1M5zguvXYAW5XF6sLQEzvdmvcizRqD"
      }
    },
    {
      "name": "offset",
      "description": "Number of domains to skip. Defaults to 0.",
      "in": "query",
      "schema": {
        "type": "integer",
        "minimum": 0,
        "default": 0,
        "example": 0
      }
    },
    {
      "name": "limit",
      "description": "Page size. Defaults to 50, maximum 100.",
      "in": "query",
      "schema": {
        "type": "integer",
        "minimum": 1,
        "maximum": 100,
        "default": 50,
        "example": 100
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
                "required": [
                  "address",
                  "total",
                  "offset",
                  "limit",
                  "domains"
                ],
                "properties": {
                  "address": {
                    "type": "string",
                    "description": "The wallet the domains belong to."
                  },
                  "total": {
                    "type": "integer",
                    "description": "True number of .sol domains the wallet owns across all pages."
                  },
                  "offset": {
                    "type": "integer",
                    "description": "The pagination offset echoed back from the request."
                  },
                  "limit": {
                    "type": "integer",
                    "description": "The page size echoed back from the request."
                  },
                  "domains": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "The requested page of domain names, ordered shortest-first then alphabetical. Page 1 (offset=0) matches the domains preview from the single/multiple endpoints."
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
                  "total": 2192,
                  "offset": 0,
                  "limit": 100,
                  "domains": [
                    "dap4.sol",
                    "uapx.sol",
                    "ufox.sol",
                    "blxme.sol",
                    "bruca.sol",
                    "draes.sol",
                    "jjust.sol",
                    "mufon.sol",
                    "tpusa.sol",
                    "uapac.sol"
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
  "operationId": "get-identity-v1-domains",
  "x-mint": {
    "href": "/data-api/wallet-identity/get-identity-v1-domains"
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
