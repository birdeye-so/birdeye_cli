---
title: 2026.06.19 - New updates for the Top Traders API
description: Added release note.
---

# 2026.06.19 - New updates for the Top Traders API

Expanding advanced ranking support beyond Solana to all EVM chains

## Features

### Token - Top Traders

[GET /defi/v2/tokens/top_traders](../data-api/wallet-networth-pnl/get-defi-v2-tokens-top-traders)

* Extend Solana advanced Top Traders capabilities to all EVM chains: 
  * Support longer timeframes on EVM chains: `2d`, `3d`, `7d`, `14d`, `30d`, `60d`, `90d`
  * Support advanced sorting fields on EVM chains: `total_pnl`, `unrealized_pnl`, `realized_pnl`, `volume_usd` 
  * Return richer trader ranking data on EVM chains, including PnL and USD volume fields
* Support multiple wallet labels in the `tags` field on Solana, for example `["dev", "bundler", "sniper", "insider"]`

#### Supported Chains

* `solana`
* `ethereum`
* `bsc`
* `base`
* `arbitrum`
* `optimism`
* `polygon`
* `avalanche`
* `zksync`
* `sui`
* `aptos`
* `linea`
* `mantle`
* `monad`
* `hyperevm`
* `megaeth`
* `plasma`
* `unichain`
* `fogo`

#### Parameters

| Parameter    | Type    | Required | Default | Description                                                                                                                                                                |
| ------------ | ------- | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `x-chain`    | string  | No       | solana  | Chain header for the target network.                                                                                                                                       |
| `address`    | string  | Yes      | -       | Token contract or mint address.                                                                                                                                            |
| `time_frame` | string  | No       | 24h     | Supported default values: `30m`, `1h`, `2h`, `4h`, `6h`, `8h`, `12h`, `24h`. Additional values on supported internal chains: `2d`, `3d`, `7d`, `14d`, `30d`, `60d`, `90d`. |
| `sort_by`    | string  | No       | volume  | Supported  values: `volume`, `trade`.`total_pnl`, `unrealized_pnl`, `realized_pnl`, `volume_usd`.                                                                          |
| `sort_type`  | string  | No       | desc    | Sort direction: `asc` or `desc`.                                                                                                                                           |
| `offset`     | integer | No       | 0       | Pagination offset.                                                                                                                                                         |
| `limit`      | integer | No       | 10      | Number of records to return per request.                                                                                                                                   |
