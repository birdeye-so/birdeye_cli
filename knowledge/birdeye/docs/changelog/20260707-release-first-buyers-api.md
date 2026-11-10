---
title: 2026.07.07 - Release First-Buyers API
description: Added release note.
---

# 2026.07.07 - Release First-Buyers API

New API to identify the earliest buyers of a Solana token and track whether they are still holding, have added more, or have sold.

## Features

### Token - First Buyers

[GET /token/v1/first-buyers](../data-api/holder/get-token-v1-first-buyers)

- Retrieve the earliest wallets that bought a given Solana token
- Classify each wallet by current position status: `buy_more`, `hold`, `sell_partial`, or `sell_all`
- Return per-wallet first buy volume, cumulative buy volume, current holding, and wallet tags
- Include page-level summary counts for each position status
- Return up to the top 1000 first buyers with pagination support

#### Parameters

| Parameter       | Type    | Required | Default | Description                                           |
| --------------- | ------- | -------- | ------- | ----------------------------------------------------- |
| `x-chain`       | string  | No       | solana  | Chain header. Only Solana is supported.               |
| `token_address` | string  | Yes      | -       | Token mint address.                                   |
| `offset`        | integer | No       | 0       | Pagination offset. Maximum 1000.                      |
| `limit`         | integer | No       | 70      | Number of records to return per request. Maximum 100. |

**Usage Note:** `offset + limit` must not exceed `1000`.
