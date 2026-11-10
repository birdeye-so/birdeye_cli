---
title: 2026.04.16 - Release x402 Payment Support
description: Added release note.
---

# 2026.04.16 - Release x402 Payment Support

Birdeye Data now supports [x402](../resources/x402), an open payment protocol built on the HTTP 402 standard. AI agents and applications can access Birdeye Data APIs by paying per request on-chain using USDC on Solana — no API key or subscription required.

## Features

### x402 Endpoints

47 Birdeye API endpoints are now accessible via x402 payment, organized across 7 categories:

| Category    | Base path              | Endpoints |
| ----------- | ---------------------- | --------- |
| DeFi (v1)   | `/x402/defi`           | 16        |
| DeFi (v2)   | `/x402/defi/v2`        | 3         |
| DeFi (v3)   | `/x402/defi/v3`        | 21        |
| Token       | `/x402/token/v1`       | 3         |
| Trader      | `/x402/trader`         | 2         |
| Holder      | `/x402/holder/v1`      | 1         |
| Smart Money | `/x402/smart-money/v1` | 1         |

These endpoints are identical to their standard counterparts in functionality and response format — only the authentication method differs. Instead of an API key, each request is accompanied by an on-chain USDC payment on Solana, verified by the x402 facilitator before the request is processed.

### How it works

1. Send a request to any `/x402/...` endpoint without an API key
2. The server responds with `402 Payment Required`, including a payment payload describing the amount and recipient address
3. Your client signs and submits the on-chain payment
4. Resend the request with the payment proof — the server verifies and returns the data

A discovery endpoint is available at `GET /x402/discover` to list all supported routes along with their pricing and network details.
