---
title: 2025.08.12 -  Wallet Net Worth APIs Release
description: Added release note.
---

# 2025.08.12 -  Wallet Net Worth APIs Release

## New Features

### Wallet - Net Worth (only Solana)

* [GET /wallet/v2/net-worth](../data-api/wallet-networth-pnl/get-wallet-v2-net-worth#/)\
  Enabled retrieval of a wallet's historical net worth with customizable parameters: `count`, `direction`, `type`, and `time`. This allows precise navigation through a wallet’s value changes across time.

### Wallet - Net Worth Details (only Solana)

* [GET /wallet/v2/net-worth-details](../data-api/wallet-networth-pnl/get-wallet-v2-net-worth-details#/)\
  Introduced endpoint to fetch a detailed per-asset breakdown for a wallet on a specific date. Perfect for examining asset-specific value dynamics.
