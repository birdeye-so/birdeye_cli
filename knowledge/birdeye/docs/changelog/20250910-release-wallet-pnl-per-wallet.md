---
title: 2025.09.10 - Release Wallet PnL (Per Wallet)
description: Added release note.
---

# 2025.09.10 - Release Wallet PnL (Per Wallet)

## New Features

### Wallet PnL - Per Wallet (only Solana)

#### [POST /wallet/v2/pnl/multiple](../data-api/wallet-networth-pnl/get-wallet-v2-pnl-multiple#/)

Returns PnL of a specific token across multiple wallets.

**Features:**

* Metrics include trade count, quantity, cashflow in USD, realized & unrealized PnL, and pricing
* Query up to 50 wallets per request
* Perfect for tracking smart money and building token-specific data dashboards
* For PnL of a specific wallet across multiple tokens, check out [Wallet - PnL (Per Token)](../data-api/wallet-networth-pnl/get-wallet-v2-pnl#/)
