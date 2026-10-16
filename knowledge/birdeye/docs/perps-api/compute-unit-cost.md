---
title: Perps Compute Unit Cost
description: Compute unit pricing for Perps Data API endpoints.
---

# Perps Compute Unit Cost

Compute units (CU) measure the resource cost of each Perps Data API request.

## CU Models

- **fixed**: one constant CU value per request
- **batch**: `ceil(base * n^multiplier)` ([Reference](/guides/compute-unit-cost/batch-token-cu-cost))
- **dynamic**: CU depends on response size tiers ([Reference](/guides/compute-unit-cost/dynamic-compute-unit-cost))
- **dynamic-by-resolution**: CU depends on resolution, requested depth, and historical lookback ([Reference](/guides/compute-unit-cost/multi-factor-cu-cost-2))

## Perps Token

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="./perps-token/get-perps-v1-token-list"><code>GET /perps/v1/token/list</code></a> | Perps Token List | fixed | 10 CU |
| <a href="./perps-token/get-perps-v1-token-overview"><code>GET /perps/v1/token/overview</code></a> | Perps Token Overview | fixed | 5 CU |
| <a href="./perps-token/get-perps-v1-token-open-positions"><code>GET /perps/v1/token/open_positions</code></a> | Perps Token Open Positions | fixed | 10 CU |
| <a href="./perps-token/get-perps-v1-token-liquidation-map"><code>GET /perps/v1/token/liquidation_map</code></a> | Perps Token Liquidation Map | fixed | 20 CU |

## Perps Wallet

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="./perps-wallet/get-perps-v1-wallet-list"><code>GET /perps/v1/wallet/list</code></a> | Perps Wallet List | fixed | 10 CU |
| <a href="./perps-wallet/get-perps-v1-wallet-overview"><code>GET /perps/v1/wallet/overview</code></a> | Perps Wallet Overview | fixed | 5 CU |
| <a href="./perps-wallet/get-perps-v1-wallet-open-positions"><code>GET /perps/v1/wallet/open_positions</code></a> | Perps Wallet Open Positions | fixed | 5 CU |
| <a href="./perps-wallet/post-perps-v1-wallet-trade-fills"><code>POST /perps/v1/wallet/trade_fills</code></a> | Perps Wallet Trade Fills | fixed | 5 CU |
| <a href="./perps-wallet/post-perps-v1-wallet-transfers"><code>POST /perps/v1/wallet/transfers</code></a> | Perps Wallet Transfers | fixed | 5 CU |

## Websocket

| Websocket | Cost (CUPB - Compute Unit Per Byte) |
| :-- | :-- |
| [SUBSCRIBE_PRICE (OHLCV)](/websockets/subscribe-price-ohlcv) <br /> [SUBSCRIBE_BASE_QUOTE_PRICE](/websockets/base-quote-ohlcv) | 0.0015 |
| [SUBSCRIBE_TXS](/websockets/tokenpair-transactions) | 0.00015 |
| [SUBSCRIBE_TOKEN_NEW_LISTING](/websockets/new-token-listing) | 0.06 |
| [SUBSCRIBE_NEW_PAIR](/websockets/new-pair) | 0.05 |
| [SUBSCRIBE_LARGE_TRADE_TXS](/websockets/track-large-transactions) | 0.005 |
| [SUBSCRIBE_WALLET_TXS](/websockets/wallet-transactions) | 0.003 |
| [SUBSCRIBE_TOKEN_STATS](/websockets/token-stats) | 0.003 |
| [SUBCRIBE_MEME](/websockets/meme-stats) | 0.0015 |
| [SUBCRIBE_TRANSFER](/websockets/transfer) | 0.0002 |

## Notes

- Compute costs are subject to change at any time without prior notice.
- WebSocket data uses different overage pricing from REST API calls.
