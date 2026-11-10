---
title: 2026.03.30 - Release Base support for PnL APIs and Weekly/Monthly OHLCV Fix
description: Improved release note.
---

# 2026.03.30 - Release Base support for PnL APIs and Weekly/Monthly OHLCV Fix

Expanded PnL endpoint support to Base chain and fixed timestamp alignment for weekly and monthly OHLCV intervals.

## Features

### Wallet - PnL (Base chain support)

[https://docs.birdeye.so/reference/get-wallet-v2-pnl](../data-api/wallet-networth-pnl/get-wallet-v2-pnl-summary)  
[GET /wallet/pnl/multiple](../data-api/wallet-networth-pnl/get-wallet-v2-pnl-multiple)  
[GET /wallet/pnl/summary](../data-api/wallet-networth-pnl/get-wallet-v2-pnl-summary)  
[POST /wallet/pnl/details](../data-api/wallet-networth-pnl/post-wallet-v2-pnl-details)

* All four PnL endpoints now accept `x-chain: base` in addition to `x-chain: solana`
* Previously these endpoints returned a 400 error for any non-Solana chain

### OHLCV - Weekly and Monthly interval timestamp alignment

[GET /defi/ohlcv](../data-api/price-ohlcv/get-defi-ohlcv)  
[GET /defi/ohlcv/pair](../data-api/price-ohlcv/get-defi-ohlcv-pair)  
[GET /defi/ohlcv/base_quote](../data-api/price-ohlcv/get-defi-ohlcv-base-quote)  
[GET /defi/v3/ohlcv](../data-api/price-ohlcv/get-defi-v3-ohlcv)  
[GET /defi/v3/ohlcv/pair](../data-api/price-ohlcv/get-defi-v3-ohlcv-pair)  
[GET /defi/history_price](../data-api/price-ohlcv/get-defi-history-price)

* Fixed incorrect candle alignment for `1W` (weekly) and `1M` (monthly) intervals
