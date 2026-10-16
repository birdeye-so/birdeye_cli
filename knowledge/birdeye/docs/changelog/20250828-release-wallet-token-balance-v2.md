---
title: 2025.08.28 - Release Wallet Token Balance V2
description: Added release note.
---

# 2025.08.28 - Release Wallet Token Balance V2

## New Features

### Wallet - Tokens Balance (only Solana)

#### [POST /wallet/v2/token-balance](../data-api/balance-transfer/post-wallet-v2-token-balance#/)

* New endpoint to fetch wallet token balances with normalized amounts, USD values, and token metadata.
* Provides both raw balances (base units) and human-readable values.
* Works seamlessly with [Wallet Current Net Worth](../data-api/wallet-networth-pnl/get-wallet-v2-current-net-worth#/) for a complete view of holdings and portfolio value.
