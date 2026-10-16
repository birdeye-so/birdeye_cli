---
title: 2026.08.07 - Add Robinhood Support to Token Creation Info API
description: Added release note.
---

# 2026.08.07 - Add Robinhood Support to Token Creation Info API

Expand the Token Creation Info API to support the Robinhood network

## Features

### Token - Creation Token Info

[GET /defi/token_creation_info](../data-api/creation-trending/get-defi-token-creation-info)

- Add `robinhood` as a supported `x-chain` value
- Extend token creation transaction lookup to the Robinhood network
- Keep the existing request and response structure unchanged for all previously supported chains

#### Parameters

| Parameter | Type   | Required | Default | Description                                                                    |
| --------- | ------ | -------- | ------- | ------------------------------------------------------------------------------ |
| `x-chain` | string | No       | solana  | Supported networks: `solana`, `bsc`, `base`, `ethereum`, `monad`, `robinhood`. |
| `address` | string | Yes      | -       | Token address to retrieve creation transaction information for.                |

#### Compatibility Note

- This release only expands chain support by adding `robinhood`
- Existing behavior for `solana`, `bsc`, `base`, `ethereum`, and `monad` remains unchanged
