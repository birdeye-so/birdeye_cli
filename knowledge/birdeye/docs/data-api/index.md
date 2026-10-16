---
title: Birdeye Data API
deprecated: false
hidden: false
metadata:
  robots: index
---
# Birdeye Data API

Birdeye Data API is a full-spectrum blockchain and DEX data platform for teams that need production-grade crypto market intelligence across tokens, pairs, wallets, traders, protocols, and chains.

It gives you one unified data layer for building:

- exchange and broker experiences
- trading terminals and charting products
- bots, alerting systems, and automated strategies
- wallet trackers, portfolio apps, and PnL dashboards
- token screeners, discovery feeds, and analytics platforms
- smart-money, holder, and on-chain behavior analysis
- backtesting, research, and internal data pipelines

Across the Birdeye Data API groups, you can access:

- real-time prices, OHLCV, liquidity, and historical market data
- token, pair, and market-level stats and overviews
- recent trades, transaction streams, and transfer activity
- wallet portfolio, net worth, trader ranking, and PnL data
- holder distributions, holder profiles, and tagged-wallet behavior
- token discovery, trending, meme, creation, and search utilities
- token security signals, smart money flows, and protocol metrics

## Which group should I start with?

| If you need... | Start here |
| --- | --- |
| Spot prices, candles, and historical charts | `Price & OHLCV` |
| Token snapshots, market data, metadata, and pair overviews | `Stats & Market Data` |
| Token lists, market lists, and new listings | `Token/Market List` |
| Trade feeds, recent swaps, and transaction lookups | `Transactions` |
| Wallet portfolio, current holdings, PnL, and trader rankings | `Wallet, Networth & PnL` |
| Wallet transfer history, token balances, and balance changes | `Balance & Transfer` |
| Holder concentration, holder cohorts, and wallet-tag behavior | `Holder` |
| All-time trade aggregates and historical summaries | `Alltime & History` |
| Supported chains and latest indexed block data | `Blockchain` |
| Token creation data and trending discovery | `Creation & Trending` |
| Meme-token discovery and detail pages | `Meme` |
| Token risk and contract-security signals | `Security` |
| Search and utility endpoints | `Search & Utils` |
| Smart-money token activity | `Smart Money` |
| Fee analytics | `Global Fees Paid` |
| Protocol and blockchain market metrics | `DEX & Protocol` |
| Wallet/domain identity resolution | `Wallet Identity` |

## Typical workflow

1. Start with `Token/Market List` or `Search & Utils` to find the assets you care about.
2. Pull `Price & OHLCV` and `Stats & Market Data` for real-time price, liquidity, and token context.
3. Add `Transactions`, `Holder`, and `Smart Money` when you need behavior and flow analysis.
4. Add `Wallet, Networth & PnL` and `Balance & Transfer` for user-facing wallet products or trader analytics.
5. Layer in `Security`, `DEX & Protocol`, and `Alltime & History` for deeper risk, market-structure, and research workflows.
