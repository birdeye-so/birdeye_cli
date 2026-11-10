---
title: 2026.10.02 - Token Stats and Meme Stats WebSocket Intervals
description: Added 15-minute and 6-hour intervals to Token Stats and Meme Stats WebSocket subscriptions.
---

# 2026.10.02 - Token Stats and Meme Stats WebSocket Intervals

The **Token Stats** and **Meme Stats** WebSocket subscriptions now support additional aggregation intervals for real-time trading activity.

## What's New

- Added `15m` and `6h` to `SUBSCRIBE_TOKEN_STATS`.
- Added `15m` and `6h` to `SUBSCRIBE_MEME`.
- Token Stats can return the corresponding interval-based volume, trade, price-history, price-change, and unique-wallet fields when selected.
- Meme Stats can return corresponding interval-suffixed buy, sell, volume, and volume-change fields.

Existing subscriptions remain unchanged when the new intervals are not requested.

## WebSocket Reference

- [Token Stats](../websockets/token-stats)
- [Meme Stats](../websockets/meme-stats)
