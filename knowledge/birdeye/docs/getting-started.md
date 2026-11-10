---
title: "Overview"
hidden: false
metadata:
  title: "Getting Started"
  description: "Create a BDS account, generate an API key from the Security tab, and make your first Birdeye API request."
  robots: "index"
icon: "bullseye-arrow"
---

Birdeye Data is a full-spectrum blockchain and DEX data platform for teams that need production-grade crypto market intelligence across tokens, pairs, wallets, traders, protocols, and chains.

From real-time prices, OHLCV, liquidity, and transaction flow to holder analytics, token and pair overviews, wallet portfolio and PnL, smart money, discovery, security, and blockchain-level utilities, Birdeye Data gives you a unified data layer for building serious crypto products at scale.

<Columns cols={2}>
  <Column>
    <Card title="Quickstart" icon="bolt" href="/quickstart">
      Create a free account, generate an API key and start building your product.
    </Card>

    ## New & Trending APIs
  </Column>
  <Column>
    <Card title="Packages" icon="wallet" href="https://birdeye.so/data-api/pricing">
      Check packages with flexible designs for individuals, teams, & enterprises.
    </Card>
  </Column>
</Columns>

<Columns cols={2}>
  <Column>
    <Card title="Liquidity OHLC - Pair" icon="chart-column" href="/data-api/price-ohlcv/get-defi-v3-liquidity-ohlc-pair">
      Chart historical TVL, token balances, and USD liquidity for any Solana pool.
    </Card>
  </Column>
  <Column>
    <Card title="Token - Overview" icon="database" href="/data-api/stats/get-defi-token-overview">
      Turn a token address into a complete market-intelligence snapshot
    </Card>
  </Column>
</Columns>

<Columns cols={2}>
  <Column>
    <Card title="Token - Holder Distribution" icon="poll-people" href="/data-api/holder/get-holder-v1-distribution">
      Retrieve distribution stats for token holders based on share of the  supply.
    </Card>
  </Column>
  <Column>
    <Card title="Wallet - PnL" icon="money-bill-trend-up" href="/data-api/wallet-networth-pnl/get-wallet-v2-pnl-summary">
      Retrieve a wallet’s overall PnL and trading statistics.
    </Card>
  </Column>
</Columns>

## Highlight Use Cases

<CardGroup cols={2}>
  <Card title="Wallet PnL Tracker" icon="chart-line" href="/use-cases/portfolio-and-wallets/wallet-pnl-tracker">
    Snapshot net worth, plot the equity curve, and compute realized and unrealized profit per token.
  </Card>

  <Card title="Solana Portfolio Tracker" icon="wallet" href="/use-cases/portfolio-and-wallets/solana-portfolio-tracker">
    Load holdings, net worth history, and PnL in one parallel batch, then lazy-load sparklines behind it.
  </Card>
</CardGroup>

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
