---
title: 2025.07.10 - WebSocket Intervals, Token Holder Lookup, and Wallet Net Worth
description: Added release note.
---

# 2025.07.10 - WebSocket Intervals, Token Holder Lookup, and Wallet Net Worth

### Smaller Interval Support for [WebSocket API ](https://docs.birdeye.so/docs/websocket#/) on Solana

* Supported intervals: 1s, 15s, 30s
* Enables high-frequency real-time price updates

### Token Holder Lookup (Solana Only)

* New endpoints to retrieve token balances for one or multiple wallets (up to 500)
  * [Single wallet query](../data-api/holder/get-defi-v3-token-holder#/)
  * [Batch wallet query](../data-api/holder/post-token-v1-holder-batch#/)
* Returns token metadata and balance information per wallet

### Current Net Worth (Solana Only)

* Get total net worth of any wallet
* Includes token-level breakdown (amount, decimals, token info)
* [API Reference](../data-api/wallet-networth-pnl/get-wallet-v2-current-net-worth#/)
