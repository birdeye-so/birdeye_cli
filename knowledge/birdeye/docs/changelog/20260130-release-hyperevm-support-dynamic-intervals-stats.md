---
title: 2026.01.30 - Release HyperEVM support & dynamic intervals stats
description: Added release note.
---

# 2026.01.30 - Release HyperEVM support & dynamic intervals stats

Now support HyperEVM APIs and Websocket as well as added dynamic intervals selection to token stats

BDS provides a complete suite of APIs and streaming endpoints for HyperEVM, enabling developers to build dashboards, trading bots, explorers, analytics tools, and DeFi applications.

## New Features

### Token overview and trading data dynamic intervals

##### [GET /defi/token_overview](../data-api/stats/get-defi-token-overview)

#### [GET /defi/v3/token/trade-data/single](../data-api/stats/get-defi-v3-token-trade-data-single)

#### [GET /defi/v3/token/trade-data/multiple](../data-api/stats/get-defi-v3-token-trade-data-multiple)

**Features:**

* User can optionally select one or multiple timeframes using the `frames` parameter.
  * If `frames` are not specified, the API will return data for default timeframes: 1m 5m 30m 1h 2h 4h 8h 24h.
  * If `frames` include both supported and unsupported intervals, only supported intervals will be returned.
  * Custom supported timeframes are time intervals separated by comma (,). Users can pass up to 8 intervals. Rules:
    * Supported chains: solana, base, bsc, ethereum
    * Hours intervals: only support 1h 2h 4h 8h 24h
    * Minute intervals: must be from 1m up to 1440m (e.g. 1m,15m,16m,17m,89m,90m,92m,1440m ...).
    * Second intervals: must be multiples of 5s, from 5s up to 3600s (e.g. 5s,10s,15s,90s,3600s.
