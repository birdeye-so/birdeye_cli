---
title: "Utils - Credits Usage of current account"
description: "Retrieve credit usage of current account."
hidden: false
metadata:
  title: Birdeye Data API | Utils - Credits Usage of current account
  description: Retrieve credit usage of current account.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /utils/v1/credits"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Current-cycle or bounded credit-usage report for the authenticated account.</strong></p>
  <ul>
    <li>Maximum <code>time_from</code> to <code>time_to</code> span is one year.</li>
    <li>If <code>time_from</code> and <code>time_to</code> are omitted, the endpoint returns the current billing-cycle view.</li>
    <li>If the requested range falls outside the current cycle, <code>remaining</code>, <code>overage_usage</code>, and <code>overage_cost</code> return <code>null</code>.</li>
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
  <p><strong>All chains ⛓️ ✨</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>1 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Monitor current credit consumption for one API account.</li>
    <li>Build internal usage dashboards and overage alerts.</li>
    <li>Reconcile product usage with subscription or billing state.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Call without time parameters for the current cycle.</li>
    <li>Add <code>time_from</code> and <code>time_to</code> when you need a bounded historical slice within the supported range.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Poll lightly and cache for ops dashboards; usage does not need market-data refresh frequency.</li>
    <li>Treat <code>null</code> overage or remaining fields as “outside current cycle,” not as zero.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /utils/v1/credits

```json
{
  "x-metadata": {
    "released_at": 1760313600,
    "new": true
  },
  "tags": [
    "Search & Utils"
  ],
  "summary": "Utils - Credits Usage of current account",
  "description": "Retrieve credit usage of current account.",
  "parameters": [
    {
      "name": "time_from",
      "description": "Specify the start time using unix timestamps in seconds",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 0,
        "maximum": 10000000000
      },
      "example": 1726700000
    },
    {
      "name": "time_to",
      "description": "Specify the end time using unix timestamps in seconds",
      "in": "query",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 0,
        "maximum": 10000000000
      },
      "example": 1726704000
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing the credits usage",
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
                "description": "Credit usage and remaining balance for the current account.",
                "required": [
                  "start_time",
                  "end_time",
                  "usage"
                ],
                "properties": {
                  "start_time": {
                    "type": "integer",
                    "description": "Start of the credit usage window as a Unix timestamp."
                  },
                  "end_time": {
                    "type": "integer",
                    "description": "End of the credit usage window as a Unix timestamp."
                  },
                  "usage": {
                    "type": "object",
                    "description": "Credit usage totals.",
                    "required": [
                      "api",
                      "ws",
                      "total"
                    ],
                    "properties": {
                      "api": {
                        "type": "integer",
                        "description": "API credits used."
                      },
                      "ws": {
                        "type": "integer",
                        "description": "WebSocket credits used."
                      },
                      "total": {
                        "type": "integer",
                        "description": "Total credits used."
                      }
                    }
                  },
                  "remaining": {
                    "type": "object",
                    "description": "Remaining credits in the account.",
                    "required": [
                      "api",
                      "ws",
                      "total"
                    ],
                    "properties": {
                      "api": {
                        "type": "integer",
                        "description": "Remaining API credits."
                      },
                      "ws": {
                        "type": "integer",
                        "description": "Remaining WebSocket credits."
                      },
                      "total": {
                        "type": "integer",
                        "description": "Total remaining credits."
                      }
                    }
                  },
                  "overage_usage": {
                    "type": "object",
                    "description": "Credits consumed beyond the plan allowance.",
                    "required": [
                      "api",
                      "ws",
                      "total"
                    ],
                    "properties": {
                      "api": {
                        "type": "integer",
                        "description": "Overage API credits used."
                      },
                      "ws": {
                        "type": "integer",
                        "description": "Overage WebSocket credits used."
                      },
                      "total": {
                        "type": "integer",
                        "description": "Total overage credits used."
                      }
                    }
                  },
                  "overage_cost": {
                    "type": "object",
                    "description": "Estimated overage cost by channel.",
                    "required": [
                      "api",
                      "ws",
                      "total"
                    ],
                    "properties": {
                      "api": {
                        "type": "integer",
                        "description": "Overage cost for API usage."
                      },
                      "ws": {
                        "type": "integer",
                        "description": "Overage cost for WebSocket usage."
                      },
                      "total": {
                        "type": "integer",
                        "description": "Total overage cost."
                      }
                    }
                  }
                }
              }
            }
          },
          "examples": {
            "CreditsUsage": {
              "value": {
                "data": {
                  "start_time": 1758367608,
                  "end_time": 1760959608,
                  "usage": {
                    "total": 1176300,
                    "api": 1162912,
                    "ws": 13388
                  },
                  "remaining": {
                    "api": 1498837088,
                    "ws": 49986612,
                    "total": 1548823700
                  },
                  "overage_usage": {
                    "api": 0,
                    "ws": 0,
                    "total": 0
                  },
                  "overage_cost": {
                    "api": 0,
                    "ws": 0,
                    "total": 0
                  }
                },
                "success": true
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
  "operationId": "get-utils-v1-credits",
  "x-mint": {
    "href": "/data-api/search-utils/get-utils-v1-credits"
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
