---
title: 2026.04.01 - Release BSC support for Token Creation Info and Historical Price Unix improvements
description: Improved release note.
---

# 2026.04.01 - Release BSC support for Token Creation Info and Historical Price Unix improvements

Expanded token creation info to BSC and improved reliability of the historical price unix endpoint.

## Features

### Token - Creation Info now supports BSC

[GET /defi/token_creation_info](../data-api/creation-trending/get-defi-token-creation-info)

* Add BSC chain support
* Pass `x-chain: bsc` to retrieve the creation transaction, deployer address, and block timestamp for any BEP-20 token
* Supported chains are now: `solana`, `base`, `bsc`

## Improvements

### Token - Historical Price Unix stricter input validation

[GET /defi/historical_price_unix](../data-api/price-ohlcv/get-defi-historical-price-unix)

* The `unixtime` parameter must be a valid Unix timestamp in seconds
* Requests with a missing or invalid `unixtime` value now receive a clear `400` error response immediately, rather than propagating through to the handler
