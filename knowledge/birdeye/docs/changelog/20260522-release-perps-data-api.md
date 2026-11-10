---
title: 2026.05.22 - Release Perps Data API
description: Added release note.
---

# 2026.05.22 - Release Perps Data API

New API suite for perpetuals market data, starting with Hyperliquid support. Covers token-level market stats and wallet-level trading analytics.

## Features

### Perps Token - Token List

[GET /perps/v1/token/list](../perps-api/perps-token/get-perps-v1-token-list)

* Retrieve a ranked list of perpetual tokens with open interest, long/short exposure, margin, unrealized PnL, bias, and leverage

***

### Perps Token - Token Overview

[GET /perps/v1/token/overview](../perps-api/perps-token/get-perps-v1-token-overview)

* Retrieve current price, total open interest, position count, and liquidation volumes at multiple timeframes (1h, 4h, 1d, 7d) for a given token

***

### Perps Token - Open Positions

[GET /perps/v1/token/open_positions](../perps-api/perps-token/get-perps-v1-token-open-positions)

* List all open positions for a token, including wallet address, entry/mark prices, leverage, margin, position value, size, unrealized PnL, and funding accrued

***

### Perps Token - Liquidation Map

[GET /perps/v1/token/liquidation_map](../perps-api/perps-token/get-perps-v1-token-liquidation-map)

* Retrieve a price-bucketed liquidation map showing the concentration of long and short liquidations at each price level

***

### Perps Wallet - Wallet List

[GET /perps/v1/wallet/list](../perps-api/perps-wallet/get-perps-v1-wallet-list)

* Ranked list of top perp traders with comprehensive performance metrics including equity, PnL, win rate, ROE, ROI, volume, and directional bias

***

### Perps Wallet - Wallet Overview

[GET /perps/v1/wallet/overview](../perps-api/perps-wallet/get-perps-v1-wallet-overview)

* Full trading summary for a single wallet address, with the same fields as the wallet list response

***

### Perps Wallet - Open Positions

[GET /perps/v1/wallet/open_positions](../perps-api/perps-wallet/get-perps-v1-wallet-open-positions)

* List all open perpetual positions held by a wallet, including token, leverage, entry/mark price, liquidation price, size, ROE, and funding accrued
