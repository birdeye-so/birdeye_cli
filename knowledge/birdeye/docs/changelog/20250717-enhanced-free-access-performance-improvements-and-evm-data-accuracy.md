---
title: 2025.07.17 - Enhanced Free Access, Performance Improvements, and EVM Data Accuracy
description: Improved release note.
---

# 2025.07.17 - Enhanced Free Access, Performance Improvements, and EVM Data Accuracy

## OHLCV v3 API – Candle Limit Update

A maximum of 5,000 candles per request is now enforced on the OHLCV v3 endpoints to improve performance and response times.

[OHLCV V3](../data-api/price-ohlcv/get-defi-v3-ohlcv#/)

[OHLCV V3 - Pair](../data-api/price-ohlcv/get-defi-v3-ohlcv-pair#/)

## Standard Plan Upgrade – Free Access to 20+ Endpoints

All standard users now get access to 20+ endpoints, including:

* /defi/price
* /defi/v3/txs
* /defi/v3/token/txs
* /defi/v3/txs/recent
* /defi/ohlcv/pair
* /defi/v3/ohlcv/pair
* /defi/history\_price
* /defi/v3/pair/overview/single
* /defi/tokenlist
* /defi/v3/token/market-data
* /defi/v3/token/holder
* /defi/v2/tokens/new\_listing
* /defi/v2/tokens/top\_traders
* /defi/v2/markets
* /defi/token\_trending
* /trader/gainers-losers
* /wallet/v2/balance-change
* /v1/wallet/tx\_list
* /defi/v3/txs/latest-block
* /defi/networks\
  🔗[ View our accessibility details](/guides/data-accessibility-by-packages)

## Transaction API – `log_index` for EVM Chains

`log_index` values have been filled for all supported EVM chains (data up to July 16, 2025), improving event ordering accuracy in historical transaction logs.\
🔗 [txs endpoint](../data-api/transactions/get-defi-v3-txs#/)
🔗 [token\_txs endpoint](../data-api/transactions/get-defi-v3-token-txs#/)
