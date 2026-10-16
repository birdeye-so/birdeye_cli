---
title: 2026.09.22 - Token Stats WebSocket Updates
description: Added 1m and 5m intervals and optional launchpad token metadata fields to the Token Stats WebSocket.
---

# 2026.09.22 - Token Stats WebSocket Updates

The **SUBSCRIBE_TOKEN_STATS** WebSocket now provides shorter interval metrics and additional token metadata for launchpad's tokens.

## What's New
The subscription now supports:

* `1m` and `5m` intervals in addition to the existing intervals

Added 3 fields for launchpad's tokens:

* `platform_name` in token stats responses
* `graduated` in token stats responses
* `graduated_time` in token stats responses

The new metadata fields are optional. They are omitted from the response when no corresponding data is available.

## API Reference

[Token Stats WebSocket](../websockets/token-stats)

```text
SUBSCRIBE_TOKEN_STATS
```
