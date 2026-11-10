---
title: 2026.09.24 - Perps Wallet Trade Fills and Transfers APIs
description: Added APIs for Hyperliquid wallet trade fills and transfer history.
---

# 2026.09.24 - Perps Wallet Trade Fills and Transfers APIs

Two new **Perps Wallet** APIs provide historical execution and transfer activity for Hyperliquid wallets.

## Features

### Perps Wallet Trade Fills

[POST /perps/v1/wallet/trade_fills](../perps-api/perps-wallet/post-perps-v1-wallet-trade-fills)

* Retrieve historical perpetual trade fills for one wallet
* Inspect direction, size, volume, realized PnL, fees, and execution price
* Paginate with a cursor and sort results in ascending or descending time order

### Perps Wallet Transfers

[POST /perps/v1/wallet/transfers](../perps-api/perps-wallet/post-perps-v1-wallet-transfers)

* Retrieve historical transfers associated with one wallet
* Inspect sender, recipient, token, amount, fees, and source or destination DEX context
* Paginate with a cursor and sort results in ascending or descending time order

