---
title: 2026.07.23 - Release Wallet Identity APIs and Solana Top Traders Improvements
description: Added release note.
---

# 2026.07.23 - Release Wallet Identity APIs and Solana Top Traders Improvements

New Identity APIs to resolve Solana wallet labels and domains, plus Solana-only improvements for the Token Top Traders API.

## Features

### Wallet Identity - Single

[GET /identity/v1/single](../data-api/wallet-identity/get-identity-v1-single)

- Resolve one wallet address or `.sol` domain to a compact identity
- Return identity type, named entity, display label, category, tags, and wallet domain preview
- Include `domains_total` for wallets with owned `.sol` domains
- Support Lite API access

#### Parameters

| Parameter | Type   | Required | Default | Description                                           |
| --------- | ------ | -------- | ------- | ----------------------------------------------------- |
| `x-chain` | string | No       | solana  | Chain header. Identity APIs currently support Solana. |
| `address` | string | Yes      | -       | Solana wallet address or `.sol` domain to resolve.    |

### Wallet Identity - Multiple

[POST /identity/v1/multiple](../data-api/wallet-identity/post-identity-v1-multiple)

- Resolve up to 100 wallet addresses or `.sol` domains in one request
- Return an identity map keyed by input address
- De-duplicate repeated addresses in the request
- Require Premium API access or higher

#### Request Body

| Field       | Type      | Required | Default | Description                                                                      |
| ----------- | --------- | -------- | ------- | -------------------------------------------------------------------------------- |
| `addresses` | string\[] | Yes      | -       | List of Solana wallet addresses or `.sol` domains to resolve. Maximum 100 items. |

### Wallet Identity - Domains

[GET /identity/v1/domains](../data-api/wallet-identity/get-identity-v1-domains)

- Return the full paginated `.sol` domain list owned by one wallet
- Support wallets with very large domain ownership counts
- Order domains shortest-first, then alphabetical
- Support Lite API access

#### Parameters

| Parameter | Type    | Required | Default | Description                                           |
| --------- | ------- | -------- | ------- | ----------------------------------------------------- |
| `x-chain` | string  | No       | solana  | Chain header. Identity APIs currently support Solana. |
| `address` | string  | Yes      | -       | Solana wallet address to list domains for.            |
| `offset`  | integer | No       | 0       | Number of domains to skip.                            |
| `limit`   | integer | No       | 50      | Page size. Maximum 100.                               |

### Token - Top Traders

[GET /defi/v2/tokens/top_traders](../data-api/wallet-networth-pnl/get-defi-v2-tokens-top-traders)

- Add Solana holder stats to help analyze whether top traders are still holding, accumulating, or selling the token
- Support `all_time` for Solana top traders
- Support sorting Solana traders by `hold_volume`
- Support filtering Solana traders by wallet tags through the `wallet_tags` parameter
- Rename the public smart-money wallet tag to `smart_trader`
- Return Solana holder position stats such as hold volume, hold value, and average buy/sell prices
- Support optional holder net worth stats through `get_holders_networth`, including wallet net worth, SOL balance, and funding source details
- Keep existing behavior unchanged for non-Solana chains

#### Parameters

| Parameter              | Type    | Required | Default | Description                                                                                                                             |
| ---------------------- | ------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `x-chain`              | string  | No       | solana  | Chain header. New fields and filters in this changelog only apply to Solana.                                                            |
| `address`              | string  | Yes      | -       | Token contract or mint address.                                                                                                         |
| `time_frame`           | string  | No       | 24h     | Time range for ranking. Solana additionally supports `all_time`.                                                                        |
| `sort_by`              | string  | No       | volume  | Sort field. Solana additionally supports `hold_volume`.                                                                                 |
| `sort_type`            | string  | No       | desc    | Sort direction: `asc` or `desc`.                                                                                                        |
| `offset`               | integer | No       | 0       | Pagination offset.                                                                                                                      |
| `limit`                | integer | No       | 10      | Number of records to return per request.                                                                                                |
| `wallet_tags`          | string  | No       | -       | Solana only. Comma-separated list of wallet tags to filter by. Supported values: `dev`, `bundler`, `sniper`, `insider`, `smart_trader`. |
| `get_holders_networth` | boolean | No       | false   | Solana only. Set to `true` to include additional holder stats: `netWorth`, `solBalance`, and `funding`.                                 |

#### Response Additions

For Solana requests, each trader item may include holder trading stats:

- `holdVolume`
- `holdVolumeUsd`
- `holdAvgPrice`
- `avgBuyPrice`
- `avgSellPrice`
- `firstTradeUnixTime`
- `lastTradeUnixTime`

When `get_holders_networth=true`, each trader item may also include holder net worth stats:

- `netWorth`
- `solBalance`
- `funding`

**Usage Note:** `get_holders_networth=true` enriches each trader with holder stats from net worth and funding data. This may make the response slightly slower than regular top traders requests.

**Compatibility Note:** Top Traders changes are Solana-only. Non-Solana chains keep the existing supported `time_frame`, `sort_by`, parameters, and response behavior.
