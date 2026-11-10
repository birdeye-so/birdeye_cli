---
title: 2026.05.29 - Release Wallet Leaderboard API
description: Added release note.
---

# 2026.05.29 - Release Wallet Leaderboard API

New API to retrieve the Solana wallet leaderboard ranked by total asset value.

## Features

### Wallet - Leaderboard

[GET /wallet/v2/leaderboard](../data-api/wallet-networth-pnl/get-wallet-v2-leaderboard)

* Retrieve the wallet leaderboard sorted by total asset value in descending order
* Designed for Solana chain only
* Support value-range filtering with `from_value` and `to_value`
