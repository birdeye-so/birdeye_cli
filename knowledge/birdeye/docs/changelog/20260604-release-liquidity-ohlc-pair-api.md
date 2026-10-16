---
title: 2026.06.04 - Release Liquidity OHLC Pair API
description: Added release note.
---

# 2026.06.04 - Release Liquidity OHLC Pair API

Introducing a historical liquidity time-series API for Solana pools, converting raw on-chain pool states into OHLC data for TVL, token balances, and USD-denominated liquidity. It enables TradingView-style liquidity charting, deep liquidity analytics, pool-level liquidity provider tracking, abnormal liquidity event detection, manipulation and rug-risk surveillance, and quantitative backtesting of liquidity-driven strategies. Unlike traditional APIs limited to current snapshots or price/volume data, this dataset reveals the full historical evolution of pool liquidity structure over time, unlocking a new analytical layer for DeFi market intelligence and risk modeling.

## Features

### DeFi - Liquidity OHLC (Pair)

[GET /defi/v3/liquidity/ohlc/pair](../data-api/price-ohlcv/get-defi-v3-liquidity-ohlc-pair)

* New endpoint: returns minute-level OHLC candles for the liquidity pool of a given pair address
* Each candle includes **liquidity in USD** (open/high/low/close), **base and quote token balances** (raw and UI amounts), and **base/quote prices** — giving a full picture of pool state at each time bucket
* Supports **bidirectional pagination** via `time` anchor + `direction` (`back` / `forward`) with cursor fields (`next_cursor`, `prev_cursor`, `has_more`) for efficient historical traversal
* Identifies the **vault/LP address** via the `pair_address` field alongside `base_mint` and `quote_mint` — enabling attribution of liquidity provider activity per market
* Up to **100 candles per request**
* Available on **Solana**
* **Use cases:**

> - Reconstruct full liquidity history for any Solana pair to detect abnormal add/remove patterns
> - Identify price manipulation via sudden liquidity spikes or withdrawals
> - Detect artificial liquidity inflation — pools that show high TVL but cycle funds rapidly across candles
