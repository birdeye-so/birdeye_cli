---
title: 2026.07.02 - Release Token Liquidity History APIs
description: Added release note.
---

# 2026.07.02 - Release Token Liquidity History APIs

New liquidity APIs for Solana tokens, covering historical OHLC liquidity candles, historical liquidity snapshots, and latest token liquidity lookup.

## Features

### Liquidity OHLC - Token

[GET /defi/v3/liquidity/ohlc/token](../data-api/price-ohlcv/get-defi-v3-liquidity-ohlc-token)

- Retrieve historical OHLC liquidity candles for a Solana token
- Return OHLC series for total liquidity, exit liquidity, and stable liquidity
- Support `1m`, `4h`, and `1d` resolutions
- Support cursor-style history navigation with `time`, `direction`, and `count`
- Return up to 100 records per request

***

### Liquidity History - Token

[GET /defi/v3/liquidity/history/token](../data-api/price-ohlcv/get-defi-v3-liquidity-history-token)

- Retrieve historical liquidity snapshots for a Solana token
- Return snapshot values from the open value of each liquidity candle
- Include total liquidity, exit liquidity, stable liquidity, and total pair count
- Support `1m`, `4h`, and `1d` resolutions
- Support cursor-style history navigation with `time`, `direction`, and `count`
- Return up to 100 records per request

***

### Liquidity Latest - Token

[POST /defi/v3/liquidity/latest/token](../data-api/price-ohlcv/post-defi-v3-liquidity-latest-token)

- Retrieve the latest liquidity data for Solana token addresses
- Return latest total liquidity, exit liquidity, stable liquidity, and token price
- Support batch lookup with up to 100 unique addresses
- Lite packages can request one address, while Starter and higher packages can request multiple addresses

####
