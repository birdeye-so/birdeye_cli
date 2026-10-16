---
title: "Explore Use Cases"
description: "Fourteen ways to build with Birdeye Data, from a full trading bot data layer down to a single focused pipeline"
---

Every page here is a real, runnable pipeline built on Birdeye Data, not a list of endpoints. Pick the one closest to what you are building, copy the code, and adjust it from there. Each page also links out to the others it depends on, so you never read the same explanation twice.

<Card title="Start here" icon="rocket" href="use-cases/complete-build/solana-trading-bot-api">
  Build the Data Layer for a Solana Trading Bot pulls together discovery, security gating, screening, monitoring, and holder profiling into one pipeline, and links out to the focused guide for each stage.
</Card>

## Discovery and Screening

<CardGroup cols={2}>
  <Card title="Token Screener" icon="filter" href="/use-cases/discovery-and-screening/token-screener">
    Discover trending tokens, bulk scan thousands per call, and refresh watchlists without one request per token.
  </Card>

  <Card title="Solana New Token Sniper" icon="radar" href="/use-cases/discovery-and-screening/new-token-sniper">
    Detect new launches over REST or WebSocket, gate every hit for rug risk, and rank survivors by early momentum.
  </Card>
</CardGroup>

## Trading Signals and Alerts

<CardGroup cols={2}>
  <Card title="Whale Transaction Tracker" icon="fish" href="/use-cases/trading-signals-and-alerts/whale-tracker">
    Size a threshold from a token's own baseline, detect large trades, and split buy and sell pressure.
  </Card>

  <Card title="Smart Money Copy Trading" icon="users" href="/use-cases/trading-signals-and-alerts/smart-money-copy-trading">
    Find the tokens smart wallets are buying, verify the wallets behind the flow, and monitor them for live moves.
  </Card>

  <Card title="Token Price Alert Monitor" icon="bell" href="/use-cases/trading-signals-and-alerts/token-price-alert-monitor">
    Poll a watchlist cheaply, check absolute and percent thresholds, and confirm every move on a closed candle.
  </Card>
</CardGroup>

## Market and Pricing

<CardGroup cols={2}>
  <Card title="Cross-DEX Price Scanner" icon="scale-balanced" href="/use-cases/market-and-pricing/cross-dex-price-scanner">
    List every pool a token trades on, normalize prices to USD, and confirm spreads before you trust them.
  </Card>

  <Card title="Solana Liquidity Monitoring" icon="droplet" href="/use-cases/market-and-pricing/liquidity-monitoring">
    Resolve a token to its deepest pool, track liquidity as OHLC candles, and explain a collapse with security data.
  </Card>

  <Card title="Solana TradingView Chart" icon="chart-candlestick" href="/use-cases/market-and-pricing/tradingview-chart">
    Resolve a token, seed the viewport with candles, backfill on scroll, and keep the live bar fresh.
  </Card>
</CardGroup>

## Risk and Integrity

<CardGroup cols={2}>
  <Card title="Token Investigation Dashboard" icon="magnifying-glass" href="/use-cases/risk-and-integrity/token-investigation-dashboard">
    Market stats, ownership, behavior tags, top traders, fee flow, and supply integrity in one screen.
  </Card>

  <Card title="Wash Trading Detector" icon="triangle-exclamation" href="/use-cases/risk-and-integrity/wash-trading-detector">
    Stack five independent signals into one wash trading suspicion score.
  </Card>

  <Card title="Rug Checker" icon="shield-check" href="/use-cases/risk-and-integrity/rug-checker">
    Score a token across authority, mint and burn history, holder concentration, and sellability, on Solana and EVM.
  </Card>
</CardGroup>

## Portfolio and Wallets

<CardGroup cols={2}>
  <Card title="Wallet PnL Tracker" icon="chart-line" href="/use-cases/portfolio-and-wallets/wallet-pnl-tracker">
    Snapshot net worth, plot the equity curve, and compute realized and unrealized profit per token.
  </Card>

  <Card title="Solana Portfolio Tracker" icon="wallet" href="/use-cases/portfolio-and-wallets/solana-portfolio-tracker">
    Load holdings, net worth history, and PnL in one parallel batch, then lazy-load sparklines behind it.
  </Card>
</CardGroup>
