---
title: 2025.10.24 - Release Wallet PnL API
description: Added release note.
---

# 2025.10.24 - Release Wallet PnL API

Now support whole wallet PnL and improve Search API

## New Features

### Wallet - PnL Summary - Solana Only

#### [GET /wallet/v2/pnl/summary](https://docs.birdeye.so/update/reference/get-wallet-v2-pnl-summary#/)

Retrieve profit and loss data of a wallet

**Features:**

* Support duration filter to retrieve wallet all time or other time range PnL.
* Realized and unrealized PnL in USD value
* Total volume trades and current portfolio value.

**Important notes:**

* Trade data per protocol aren't backfilled and might affect the calculation of PnL.

## Improvements

### Search support for CJK

Search API now supports Chinese-Japanese-Korean (CJK) with improved search results.
