---
title: 2026.02.10 - Release extra intervals for token & meme list
description: Added release note.
---

# 2026.02.10 - Release extra intervals for token & meme list

Add more intervals for token & meme list. Also add more filter to meme list API.

## Features

### Token - List v3

[GET /defi/v3/token/list](../data-api/tokenmarket-list/get-defi-v3-token-list)  

* Add interval `1m`, `5m` and `30m` to sort, filter and responses.

### Meme List

[GET /defi/v3/token/meme/list](../data-api/meme/get-defi-v3-token-meme-list)

* Add interval `1m`, `5m` and `30m` to sort, filter and responses.
* Add `total` and `migrated` fields when filtering by `creator`
