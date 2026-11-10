---
title: 2026.09.29 - Liquidity History Pair and Token Money Flow APIs
description: Added pair liquidity history and token money flow APIs.
---

# 2026.09.29 - Liquidity History Pair and Token Money Flow APIs

Birdeye Data API now includes two new Solana endpoints for historical liquidity analysis and smart-money flow analysis.

## What's New

- Added `GET /defi/v3/liquidity/history/pair` for point-in-time historical liquidity snapshots of a Solana trading pair.
- Added `POST /defi/v3/token/money-flow` for token buy and sell flow metrics grouped by time frame, wallet tags, and wallet addresses.
- Added support for cursor-based pair liquidity history using Unix timestamps or Solana slots.
- Added `wallet_tags`, `frames`, and `wallets` filters for token money flow analysis.

## API Reference

- [Liquidity History - Pair](../data-api/price-ohlcv/get-defi-v3-liquidity-history-pair)
- [Token Money Flow](../data-api/smart-money/post-defi-v3-token-money-flow)
