---
title: 2025.10.15 - Release Txs filtered by volume
description: Added release note.
---

# 2025.10.15 - Release Txs filtered by volume

Introducing a new endpoint to retrieve token trades filtered by volume on Solana.

## New Features

### Trades - Token Filtered By Volume (V3) — Solana only

#### [GET /defi/v3/token/txs-by-volume](../data-api/transactions/get-defi-v3-token-txs-by-volume#/)

Retrieve a list of trades for a specified token with volume-based filters.

**Features:**

* Support time range filters beyond 30 days
* Maximum limit of 500 transactions
* Newly supported parameters:
  * volume_type: usd or amount (token amount)
  * min_volume and max_volume for volume-based filtering
* Chain support: Solana only
