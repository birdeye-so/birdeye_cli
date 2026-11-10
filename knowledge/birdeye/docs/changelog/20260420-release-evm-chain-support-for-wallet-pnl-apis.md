---
title: 2026.04.20 - Release EVM Chain Support for Wallet PnL APIs
description: Added release note.
---

# 2026.04.20 - Release EVM Chain Support for Wallet PnL APIs

Expanded Wallet PnL APIs to support all major EVM chains, in addition to the previously supported Solana and Base.

## Features

### Wallet - PnL

[GET /v2/wallet/pnl](../data-api/wallet-networth-pnl/get-wallet-v2-pnl)

* Add support for Ethereum, BSC, Arbitrum, Avalanche, Optimism, Polygon, and other EVM chains

[GET /v2/wallet/pnl/multiple](../data-api/wallet-networth-pnl/get-wallet-v2-pnl-multiple)

* Add support for the same EVM chains above

[GET /v2/wallet/pnl/summary](../data-api/wallet-networth-pnl/get-wallet-v2-pnl-summary)

* Add support for the same EVM chains above

[POST /v2/wallet/pnl/details](../data-api/wallet-networth-pnl/post-wallet-v2-pnl-details)

* Add support for the same EVM chains above

***

## Summary

This release extends all 4 Wallet PnL endpoints to cover EVM chains beyond Solana and Base. Chains not yet supported: `sui`, `fogo`, `aptos`, `unichain`, `linea`, `plasma`.
