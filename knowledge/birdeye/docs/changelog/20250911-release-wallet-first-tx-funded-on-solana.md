---
title: 2025.09.11 - Release Wallet First Tx Funded on Solana
description: Added release note.
---

# 2025.09.11 - Release Wallet First Tx Funded on Solana

## New Features

### Wallet First Tx Funded (only Solana)

#### [POST /wallet/v2/tx/first-funded](../data-api/wallet-networth-pnl/post-wallet-v2-tx-first-funded#/)

Returns the first funding transactions of multiple wallets.

**Features:**

* Metrics include transaction hash, block time, block number, balance change, token address and decimals
* Optional token-filtering to retrieve first funding transaction of a specific token
* Query up to 50 wallets per request
* Perfect for identifying new wallet
