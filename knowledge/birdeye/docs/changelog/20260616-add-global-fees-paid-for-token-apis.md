---
title: 2026.06.16 - Add Global Fees Paid For Token APIs
description: Added release note.
---

# 2026.06.16 - Add Global Fees Paid For Token APIs

New fee-related updates across token discovery and overview APIs on Solana. These changes add all-time `global_fees_paid` data to existing token responses, and extend list endpoints with fee-based filtering and sorting.

## Features

### Token - Overview

[GET /defi/token_overview](../data-api/stats/get-defi-token-overview)

* Add `global_fees_paid` to the token overview response on Solana
* Return the token's all-time global fees paid amount in SOL

***

### Meme Token - List

[GET /defi/v3/token/meme/list](../data-api/meme/get-defi-v3-token-meme-list)

* Add `global_fees_paid` to meme token list responses on Solana
* Support filtering by minimum all-time fee paid with `min_global_fees_paid`
* Support sorting by `global_fees_paid`

***

### Meme Token - Detail

[GET /defi/v3/token/meme/detail/single](../data-api/meme/get-defi-v3-token-meme-detail-single)

* Add `global_fees_paid` to meme token detail responses on Solana
* Return the token's all-time global fees paid amount in SOL

***

### Token - List (V3)

[GET /defi/v3/token/list](../data-api/tokenmarket-list/get-defi-v3-token-list)

* Add `global_fees_paid` to token list responses on Solana
* Support filtering by minimum all-time fee paid with `min_global_fees_paid`
* Support sorting by `global_fees_paid`

***

### Token - List (V3) Scroll

[GET /defi/v3/token/list/scroll](../data-api/tokenmarket-list/get-defi-v3-token-list-scroll)

* Add `global_fees_paid` to scroll token list responses on Solana
* Support filtering by minimum all-time fee paid with `min_global_fees_paid`
* Support sorting by `global_fees_paid`

#### Parameters

| Parameter              | Type   | Required       | Default | Description                                                       |
| ---------------------- | ------ | -------------- | ------- | ----------------------------------------------------------------- |
| `global_fees_paid`     | number | Response field | -       | All-time global fees paid amount in SOL.                          |
| `min_global_fees_paid` | number | No             | -       | Filter tokens by minimum all-time global fees paid amount in SOL. |
