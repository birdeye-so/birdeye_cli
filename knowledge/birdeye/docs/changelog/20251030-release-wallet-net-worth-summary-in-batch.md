---
title: 2025.10.30 - Release Wallet Net worth Summary in batch
description: Added release note.
---

# 2025.10.30 - Release Wallet Net worth Summary in batch

Now support fetching net worth summary of up to 100 wallets

## New Features

### Wallet - Current net worth Summary - Solana Only

#### [GET /wallet/v2/net-worth-summary/multiple](../data-api/wallet-networth-pnl/post-wallet-v2-net-worth-summary-multiple#/)

Retrieve current net worth value of a batch of wallets

**Features:**

* Support up to 100 wallets in a single request.
* Return net worth summary value.

**Important notes:**

* Current only support Solana.
* Accessible by Business and above packages.
