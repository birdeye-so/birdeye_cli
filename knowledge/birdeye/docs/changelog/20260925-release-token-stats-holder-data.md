---
title: 2026.09.25 - Token Stats WebSocket Holder Data
description: Added optional Solana holder metrics to SUBSCRIBE_TOKEN_STATS.
---

# 2026.09.25 - Token Stats WebSocket Holder Data

The **SUBSCRIBE_TOKEN_STATS** WebSocket now supports optional holder-distribution and tagged-holder metrics for Solana tokens.

## What's New

Set `data.select.holder_data` to `true` to receive all supported holder fields:

* `top10_holder_percentage`
* `sniper_count` and `sniper_held_percentage`
* `bundler_count` and `bundler_held_percentage`
* `insider_count` and `insider_held_percentage`
* `dev_count` and `dev_held_percentage`

To request only selected tag metrics, pass `holder_data.tags` with one or more of `sniper`, `bundler`, `insider`, or `dev`. The response always includes `top10_holder_percentage` when holder data is selected.

Holder fields are available only on Solana. Missing fields are omitted, while valid zero values are preserved. Existing subscriptions are unchanged when `holder_data` is omitted or set to `false`.

## API Reference

[Token Stats WebSocket](../websockets/token-stats)

```text
SUBSCRIBE_TOKEN_STATS
```
