---
title: 2026.07.22 - Release Wallet Tag Tracker API
description: Added release note.
---

# 2026.07.22 - Release Wallet Tag Tracker API

New API to track tagged wallet trading behavior for a Solana token over time.

## Features

### Token - Wallet Tags Tracker

[GET /token/v1/wallet-tags-tracker](../data-api/holder/get-token-v1-wallet-tags-tracker)

- Track how tagged wallets trade a Solana token over time
- Return buy and sell volume, USD volume, distinct wallet counts, and transaction counts bucketed by interval
- Group activity by wallet tag, exact tag combination, and top 10 holder activity
- Support filtering by specific tags through the `tags` parameter
- Support optional `top_10_holder` and `include_tag_combinations` views

#### Parameters

| Parameter                  | Type    | Required | Default      | Description                                                                                    |
| -------------------------- | ------- | -------- | ------------ | ---------------------------------------------------------------------------------------------- |
| `x-chain`                  | string  | No       | solana       | Chain header. Only Solana is supported.                                                        |
| `token_address`            | string  | Yes      | -            | Token mint address.                                                                            |
| `from_time`                | integer | Yes      | -            | Start of the range as a Unix timestamp in seconds.                                             |
| `to_time`                  | integer | No       | current time | End of the range as a Unix timestamp in seconds. Must be greater than or equal to `from_time`. |
| `interval`                 | string  | No       | 1D           | Bucket size for the time series.                                                               |
| `tags`                     | string  | No       | all tags     | Comma-separated list of wallet tags to include.                                                |
| `top_10_holder`            | boolean | No       | false        | Set to `true` to include the top 10 holder series.                                             |
| `include_tag_combinations` | boolean | No       | false        | Set to `true` to include the exact tag combination block.                                      |

**Usage Note:** The maximum allowed time range depends on the selected `interval`.
