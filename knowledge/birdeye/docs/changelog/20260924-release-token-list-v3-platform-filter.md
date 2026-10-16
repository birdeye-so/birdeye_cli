---
title: 2026.09.24 - Token List V3 Platform Filter
description: Added creation-platform filtering to Token List V3 and Token List V3 Scroll.
---

# 2026.09.24 - Token List V3 Platform Filter

The **Token List V3** and **Token List V3 Scroll** APIs now support filtering tokens by their creation platform.

## What's New

Use the optional `platform_name` query parameter with either endpoint. Supported platform names include:

* `pump.fun`
* `mayhem`
* `stonkfun`
* `meteora dbc`
* `moonshot`
* `raydium`
* `letsbonk.fun`
* `jupiter studio`
* `gobolt`
* `bags.fm`
* `possumlabs`
* `trix`
* `diesel`
* `meme.com platform`

## API Reference

* [Token - List (V3)](../data-api/tokenmarket-list/get-defi-v3-token-list)
* [Token - List (V3) Scroll](../data-api/tokenmarket-list/get-defi-v3-token-list-scroll)

```text
GET /defi/v3/token/list
GET /defi/v3/token/list/scroll
```
