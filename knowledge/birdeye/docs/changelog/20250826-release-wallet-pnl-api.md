---
title: 2025.08.26 - Release Wallet PnL API
description: Added release note.
---

# 2025.08.26 - Release Wallet PnL API

## New Features

### Wallet - PnL (only Solana)

#### [GET /wallet/v2/pnl](../data-api/wallet-networth-pnl/get-wallet-v2-pnl#/)

* Introduced endpoint to retrieve **profit and loss (PnL) per wallet and per token**.
* Provides detailed insights including trade counts, token quantities, cashflow in USD, realized & unrealized profit, ROI percentages, and pricing metrics.
* Token amounts are returned in normalized units (already adjusted by `10^-decimals`).
* Ideal for tracking trading performance, building dashboards, and generating wallet profit reports.
