---
title: 2025.11.04 - Release Wallet PnL Details
description: Added release note.
---

# 2025.11.04 - Release Wallet PnL Details

Now support fetching PnL details of a wallet broken down into tokens

## New Features

### Wallet - Wallet PnL Details - Solana Only

#### [GET /wallet/v2/pnl/details](../data-api/wallet-networth-pnl/post-wallet-v2-pnl-details#/)

Retrieve PnL details of a wallet broken down into tokens

**Features:**

* Support up to 100 tokens in a single request.
* Sort by last trade.

**Important notes:**

* Current only support Solana.
* Accessible by Starter and above packages.
