---
title: "Overview"
description: "Connect AI agents and coding assistants to Birdeye Data"
---

Birdeye Data is built to be read and used by AI agents, not just humans. This section covers every way an agent can connect: MCP, the endpoint catalog, and pay-per-request access through x402.

## What you can build

With Birdeye MCP, your agent can:

- **Access real-time market data**: Get aggregated prices, market cap, and trading volume for over 15k\+ coins on Birdeye.
- **Dive into onchain analytics**: Query onchain DEX price and liquidity data for more than 8M tokens across 10\+ networks.
- **Discover market trends**: Instantly find trending coins, new token listings, top gainers/losers, and popular NFT collections.
- **Retrieve rich metadata**: Pull essential details like project descriptions, logos, social links, contract addresses, security info, and more.
- **Analyze historical performance**: Access historical price, market data, and OHLCV for any cryptocurrency.
- **Explore crypto categories**: Effortlessly list coins within specific sectors like Meme, DeFi, Layer 1, AI agent, and more.

<Frame>
  ![A Bitcoin price and volume dashboard built with Claude and Birdeye MCP](/agents/images/mcp-demo-claude-dashboard.png)
</Frame>

A dashboard like this, built entirely from a single prompt, gives a sense of what's possible once your agent is connected.

## Where to start

<CardGroup cols={3}>
  <Card title="Birdeye MCP" icon="plug" href="/agents/birdeye-mcp">
    Connect Claude, Cursor, or any MCP compatible client directly to Birdeye Data. Includes setup for 12\+ tools.
  </Card>

  <Card title="Tool Catalog" icon="list" href="/agents/tool-catalog">
    Look up which endpoint to call for a given task before you write a query.
  </Card>

  <Card title="x402 and Agentic Payments" icon="coins" href="/agents/x402-agentic-payments">
    Skip the API key. Let your agent pay per request with its own wallet.
  </Card>
</CardGroup>

## Example prompts

Use these prompts to get a feel for what an agent connected to Birdeye MCP can do.

### Simple queries

- What is the current price of Bitcoin in USD?
- What is the current price of JUP in USD?
- What are the top 10 BONK holders?
- What are the top 3 trending coins on Birdeye right now?
- What are the top AI coins on Birdeye now?

### Advanced queries

List tokens launched in the last 72 hours with liquidity above \$500k. Include price, market cap, liquidity, and 24h volume. Display in an interactive table.

<Frame>
  ![An interactive table of tokens launched in the last 72 hours, built with Claude and Birdeye MCP](/agents/images/new-tokens-72h-dashboard.png)
</Frame>

Generate a 14 day price chart for Solana (SOL) against USD. Include both price and trading volume.

<Frame>
  ![A 14 day Solana price and volume chart, built with Claude and Birdeye MCP](/agents/images/solana-14day-price-chart.png)
</Frame>

### Creative and fun ideas

Create a Whale Moves dashboard that highlights tokens with significant accumulation from top holders over the past 7 days. Include price change and liquidity.

<Frame>
  ![A Whale Moves dashboard tracking 7 day token accumulation, built with Claude and Birdeye MCP](/agents/images/whale-moves-dashboard.png)
</Frame>

Build a Market Mood view that compares performance of major sectors like AI, Meme, and DeFi over the last 7 days. Display sector averages and total volume.

<Frame>
  ![A Market Mood dashboard comparing AI, Meme, and DeFi sector performance, built with Claude and Birdeye MCP](/agents/images/market-mood-dashboard.png)
</Frame>

<Tip>
  All four examples above were built and shared as [Claude Artifacts](https://claude.ai/public/artifacts/cea3f8e3-a330-41d5-b28b-bd3fb9cade54). Try connecting Birdeye MCP and building your own.
</Tip>
