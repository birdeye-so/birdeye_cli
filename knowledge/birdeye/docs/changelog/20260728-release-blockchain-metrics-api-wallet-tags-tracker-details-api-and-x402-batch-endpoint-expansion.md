---
title: 2026.07.28 - Release Blockchain Metrics API, Wallet Tags Tracker Details API, and x402 Batch Endpoint Expansion
description: Added release note.
---

# 2026.07.28 - Release Blockchain Metrics API, Wallet Tags Tracker Details API, and x402 Batch Endpoint Expansion

Add two new  APIs for blockchain market metrics and Wallet Tags Tracker drilldowns, plus expand x402 coverage to 12 additional batch and multi-item endpoints.

## Features

### Blockchain Market Metrics

[GET /market/v1/blockchain-metrics](../data-api/dex-protocol/get-market-v1-blockchain-metrics)

- Retrieve blockchain-level market metrics aggregated by time bucket
- Return trading volume, trade count, active trading tokens, and stablecoin market capitalization
- Support Solana chain requests
- Support Lite API access

#### Parameters

| Parameter             | Type    | Required | Default | Description                                                        |
| --------------------- | ------- | -------- | ------- | ------------------------------------------------------------------ |
| `x-chain`             | string  | No       | solana  | Chain header. This release currently supports Solana requests.     |
| `time_frame`          | string  | Yes      | -       | Aggregation interval for the market metrics series.                |
| `reference_timestamp` | integer | No       | now     | Reference Unix timestamp used to anchor the returned time buckets. |
| `direction`           | string  | No       | before  | Time traversal direction relative to the reference timestamp.      |
| `limit`               | integer | No       | 10      | Number of time buckets to return. Maximum 10.                      |

### Wallet Tags Tracker Details

[GET /token/v1/wallet-tags-tracker/details](../data-api/holder/get-token-v1-wallet-tags-tracker-details)

- Drill into Wallet Tags Tracker buckets and list the tagged wallets active in each candle
- Return per-wallet buy/sell volume and transaction counts for the selected time range
- Support filtering by wallet tags, specific wallet addresses, minimum USD volume, and top-10-holder view
- Support Solana-only requests
- Support Lite API access

#### Parameters

| Parameter        | Type       | Required | Default | Description                                                                                 |
| ---------------- | ---------- | -------- | ------- | ------------------------------------------------------------------------------------------- |
| `x-chain`        | string     | No       | solana  | Chain header. This endpoint is currently Solana-only.                                       |
| `token_address`  | string     | Yes      | -       | Token mint address.                                                                         |
| `time_from`      | integer    | Yes      | -       | Start of the range as a Unix timestamp in seconds.                                          |
| `time_to`        | integer    | No       | now     | End of the range as a Unix timestamp in seconds. Must be greater than `time_from`.          |
| `time_frame`     | string     | Yes      | -       | Size of each time bucket. Must match the Wallet Tags Tracker bucket being inspected.        |
| `tags`           | string\[]  | No       | all     | Comma-separated wallet tags to restrict the response to.                                    |
| `wallets`        | string\[]  | No       | -       | Comma-separated wallet addresses to restrict the response to. Supports up to 100 addresses. |
| `min_volume_usd` | number     | No       | 0       | Only include wallets whose USD volume in a bucket is at least this value.                   |
| `top_10_holder`  | boolean    | No       | false   | Set to `true` to restrict results to wallets in the token's top 10 holder set.              |
| `sort_by`        | string     | No       | volume  | Sort field for wallet activity inside each bucket.                                          |
| `sort_type`      | string     | No       | desc    | Sort direction: `asc` or `desc`.                                                            |
| `offset`         | integer    | No       | 0       | Pagination offset for wallets inside each bucket.                                           |
| `limit`          | integer    | No       | 10      | Number of wallet rows to return per bucket.                                                 |

### x402 Batch Endpoint Expansion

Birdeye x402 now supports 12 additional batch and multi-item endpoints so AI agents and programmatic clients can pay per request for more bulk DeFi and wallet data workflows without API keys.

#### New x402-Supported Endpoints

| Method        | Path                                          |
| ------------- | --------------------------------------------- |
| `GET`, `POST` | `/x402/defi/multi_price`                      |
| `POST`        | `/x402/defi/price_volume/multi`               |
| `GET`         | `/x402/defi/v3/token/meta-data/multiple`      |
| `GET`         | `/x402/defi/v3/token/trade-data/multiple`     |
| `GET`         | `/x402/defi/v3/token/market-data/multiple`    |
| `GET`         | `/x402/defi/v3/pair/overview/multiple`        |
| `POST`        | `/x402/defi/v3/all-time/trades/multiple`      |
| `GET`         | `/x402/defi/v3/token/exit-liquidity/multiple` |
| `POST`        | `/x402/defi/v3/price/stats/multiple`          |
| `GET`         | `/x402/wallet/v2/pnl/multiple`                |
| `POST`        | `/x402/wallet/v2/token-balance`               |
| `POST`        | `/x402/defi/v3/liquidity/latest/token`        |

#### Notes

- All x402 endpoints remain prefixed with `/x402`
- Wallet and token endpoints under this release keep their existing route-level validation and request shapes
- Solana-only behavior continues to apply where required by the underlying endpoint
