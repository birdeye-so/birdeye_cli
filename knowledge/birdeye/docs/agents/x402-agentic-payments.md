---
title: "x402 and Agentic Payments"
description: "Let an agent pay for Birdeye Data API usage autonomously, per request, with no account or subscription"
---

<Note>
  x402 is Birdeye Data's Pay As You Go package. It works alongside standard subscription plans rather than replacing them. If your agent already has an API key, you do not need x402.
</Note>

## What is x402

[x402](https://x402.org/) is an open HTTP payment standard that revives the long dormant `402 Payment Required` status code. Instead of requiring an account, an API key, and a billing cycle, x402 lets any client, human or machine, pay for a resource at the moment it requests it.

The flow has four steps:

<Steps>
  <Step title="Client sends an API request">
    No API key or authentication header needed.
  </Step>
  <Step title="Server responds with 402 Payment Required">
    Birdeye returns payment instructions alongside the `402` status.
  </Step>
  <Step title="Client signs a stablecoin payment">
    The client signs a USDC payment for the request.
  </Step>
  <Step title="Server verifies and returns the data">
    Birdeye verifies the payment through a blockchain facilitator, Coinbase CDP on Base or PayAI on Solana, then returns the requested data.
  </Step>
</Steps>

No signup. No API key provisioning. No monthly invoice. Just data for payment, per request.

## Pricing and access

| Detail | Spec |
| --- | --- |
| Price per request | \$0.003 |
| Access level | Full REST API access, all endpoints, no subscription needed |
| Payment method | USDC via x402 (stablecoin micropayment) |
| Settlement | Instant (about 2s onchain) via Coinbase CDP (Base) or PayAI (Solana) |
| Networks | Base, Solana |
| Limitations | WebSocket streaming not supported under x402 |

<Warning>
  WebSocket streaming is not available through x402. If your agent needs real time streams, use a standard Pro or Enterprise plan instead.
</Warning>

## Who this is for

<CardGroup cols={3}>
  <Card title="AI agents" icon="robot">
    The primary use case. An agent can query Birdeye Data and pay for each request autonomously from its own wallet, with no human in the loop and no API key to manage.
  </Card>

  <Card title="Developers testing and prototyping" icon="flask">
    Query the full API surface on a per request basis before committing to a monthly plan.
  </Card>

  <Card title="Applications with variable usage" icon="chart-line">
    Spiky or event-driven traffic can pay per request instead of guessing the right subscription tier upfront.
  </Card>
</CardGroup>

## What you can access

x402 gives pay-per-request access to Birdeye's full REST API, the same data trusted by global leaders like Phantom, Raydium, Coinbase, and Bybit:

- Real-time token data: prices, market cap, volume, liquidity across Solana, Sui, and major EVM chains
- Trading data: live trades, OHLCV candles, buy and sell ratios, top traders
- Wallet analytics: portfolio tracking, transaction history, PnL
- Market discovery: trending tokens, new listings, gainers and losers
- Token security: safety signals, metadata, holder distribution
- New listings: newly created tokens with creation timestamps, useful for meme and early-entry agents

## Getting started

Using Birdeye via x402 requires no account setup. Any x402-compatible client can start making paid API requests immediately.

<CardGroup cols={2}>
  <Card title="Birdeye x402 API Reference" icon="book" href="/resources/x402">
    Supported endpoints, pricing, and payment details for querying Birdeye Data over x402.
  </Card>

  <Card title="Coinbase x402 Documentation" icon="code" href="https://docs.cdp.coinbase.com/x402/docs/welcome">
    SDKs in TypeScript and Go for building x402 clients.
  </Card>

  <Card title="x402 Open Standard" icon="globe" href="https://x402.org/">
    The protocol specification behind x402, maintained independently of any single provider.
  </Card>

  <Card title="Prefer a subscription?" icon="key" href="https://birdeye.so/data-api">
    Birdeye's standard packages, including a free Standard tier, are available at birdeye.so/data-api.
  </Card>
</CardGroup>
