---
title: Meme Stats
deprecated: false
hidden: false
metadata:
  robots: index
---
# SUBSCRIBE_MEME

## Overview

`SUBSCRIBE_MEME` is a WebSocket subscription message used to receive<br />real-time updates for meme tokens based on flexible filtering criteria<br />such as source, progress, and lifecycle timestamps. Only support on **Solana, Monad, Bsc**

## 1. WebSocket URL:

```yaml
wss://public-api.birdeye.so/socket/solana?x-api-key=YOUR-API-KEY
```

***

## Subscription Message

```json
{
  "type": "SUBSCRIBE_MEME",
  "data": {
    "address": "string (optional)",
    "graduated": "boolean (optional)",
    "source": "string (optional)",
    "progress_percent": {
      "min": "number (0-100)",
      "max": "number (0-100)"
    }, // optional
    "creation_time": {
      "from": "unix timestamp (seconds)",
      "to": "unix timestamp (seconds)"
    }, // optional
    "graduated_time": {
      "from": "unix timestamp (seconds)",
      "to": "unix timestamp (seconds)"
    }, // optional
    "intervals": "list interval trading volume/tx to received", // optional
  }
}
```

***

## Example Subscription Message

```json
{
    "type": "SUBSCRIBE_MEME",
    "data":{
        "graduated": false,
        "progress_percent": {
            "min": 50,
            "max": 100,
        },
        "intervals": ["1m", "5m", "15m", "6h", "24h"]
    }
}
```

## Unsubscribe Message

To stop receiving meme statistics updates for the current WebSocket connection, send:

```json
{
  "type": "UNSUBSCRIBE_MEME"
}
```

The unsubscribe message does not require a `data` object.

## Parameters

### address

- Type: `string`
- Optional
- Description: Token address to filter a specific meme token.

### graduated

- Type: `boolean`
- Optional
- Description:
  - `true`: only graduated tokens
  - `false`: only non-graduated tokens

### source

- Type: `string`
- Optional
- Description: Filter tokens by originating platform or bonding
  mechanism.

Supported values (non-exhaustive):

- `meteora_dynamic_bonding_curve`
- `pump_dot_fun`
- `moonshot`
- `raydium_launchlab`

### progress_percent

- Type: `object`
- Optional
- Description: Filter tokens by bonding curve progress.

Fields:

- `min` (number): minimum value (0-100)
- `max` (number):
  maximum value (0-100)

### creation_time

- Type: `object`
- Optional
- Description: Filter by token creation time (Unix timestamp in
  seconds).

Fields:

- `from` (number): start timestamp
- `to` (number): end
  timestamp

### graduated_time

- Type: `object`
- Optional
- Description: Filter by token graduation time (Unix timestamp in
  seconds).

Fields:

- `from` (number): start timestamp
- `to` (number): end
  timestamp

Constraints: Requires `graduated = true`

### intervals

Fields:

- Type: `array of strings`
- Description: Trading-volume and transaction-stat intervals to receive. Available intervals: `["1m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "24h"]`.
- Default: Get all intervals stats

Selecting an interval adds interval-suffixed fields such as `buy_15m`, `sell_15m`, `volume_15m_usd`, `volume_15m_change_percent`, `buy_6h`, `sell_6h`, and `volume_6h_usd` to `MEME_DATA`.

***

## WebSocket Event

### Event Type

MEME_DATA

***

## Event Payload Example

```json
{
  "type": "MEME_DATA",
  "data": {
    "eventType": "meme_stats",
    "address": "6HVg17rR8zzYQibLQoaGGeB4ToTr5uQRvXpntdUHpump",
    "name": "The Elite",
    "symbol": "ELITE",
    "decimals": 6,
    "extensions": {
      "twitter": "https://x.com/UselessDevReal/status/2045166430870548522",
      "website": "https://pump.fun",
      "description": "Created on https://rapidlaunch.io"
    },
    "logo_uri": "https://image.solanatracker.io/proxy?url=https%3A%2F%2Faxiomtrading.sfo3.cdn.digitaloceanspaces.com%2F8RZAa7iy4g8GwRVfEDsbNF4X6CSfvTrcRuWrs14epump.webp",
    "price": 0.000006676163656815801,
    "buy_1m": 168,
    "sell_1m": 160,
    "volume_buy_1m_usd": 5467.618135688758,
    "volume_sell_1m_usd": 5595.711755131418,
    "volume_1m_usd": 11063.329890820176,
    "volume_1m_change_percent": 33.01235726886691,
    "buy_5m": 236,
    "sell_5m": 212,
    "volume_buy_5m_usd": 9662.319559839883,
    "volume_sell_5m_usd": 7967.623516901405,
    "volume_5m_usd": 17629.94307674129,
    "volume_5m_change_percent": null,
    "buy_30m": 236,
    "sell_30m": 212,
    "volume_buy_30m_usd": 9662.319559839882,
    "volume_sell_30m_usd": 7967.623516901404,
    "volume_30m_usd": 17629.943076741285,
    "volume_30m_change_percent": null,
    "buy_1h": 236,
    "sell_1h": 212,
    "volume_buy_1h_usd": 9662.319559839882,
    "volume_sell_1h_usd": 7967.623516901404,
    "volume_1h_usd": 17629.943076741285,
    "volume_1h_change_percent": null,
    "buy_2h": 236,
    "sell_2h": 212,
    "volume_buy_2h_usd": 9662.319559839882,
    "volume_sell_2h_usd": 7967.623516901404,
    "volume_2h_usd": 17629.943076741285,
    "volume_2h_change_percent": null,
    "buy_4h": 236,
    "sell_4h": 212,
    "volume_buy_4h_usd": 9662.319559839883,
    "volume_sell_4h_usd": 7967.6235169014035,
    "volume_4h_usd": 17629.943076741285,
    "buy_8h": 236,
    "sell_8h": 212,
    "volume_buy_8h_usd": 9662.319559839883,
    "volume_sell_8h_usd": 7967.6235169014035,
    "volume_8h_usd": 17629.943076741285,
    "volume_8h_change_percent": null,
    "buy_24h": 236,
    "sell_24h": 212,
    "volume_buy_24h_usd": 9662.319559839883,
    "volume_sell_24h_usd": 7967.6235169014035,
    "volume_24h_usd": 17629.943076741285,
    "volume_24h_change_percent": null,
    "liquidity": 5502.697883957337,
    "total_supply": 1000000000,
    "circulating_supply": 1000000000,
    "fdv": 6676.163656815801,
    "holder": 10,
    "top10_holder_percentage": 82.89565525666829,
    "market_cap": 6676.163656815801,
    "meme_info": {
      "source": "pump_dot_fun",
      "platform_id": "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
      "created_at": {
        "tx_hash": "211iLFuvgg3nnDixLL5CWAu83EgA1CHbHT8Gw4c3SyL94JGGUXQokeewUV3EFW5v1pbktKbPFV1iGezzYCjA4dLZ",
        "slot": 413849055,
        "block_time": 1776440654
      },
      "creation_time": 1776440654,
      "creator": "8YcbyX92UHTU23HZv3ccP9o13qibErQkKaUjoxqxd7SJ",
      "graduated": false,
      "graduated_time": null,
      "pool": {
        "address": "5DYMPAa5eCauzYgNMV8aKecatqp67qjaFmmXnBZ8L6cY",
        "realSolReserves": "14032101715",
        "realTokenReserves": "451157544301090",
        "tokenTotalSupply": "1000000000000000",
        "virtualTokenReserves": "731057544301090"
      },
      "progress_percent": 43.11467,
      "address": "6HVg17rR8zzYQibLQoaGGeB4ToTr5uQRvXpntdUHpump"
    },
    "sniper_count": 18,
    "bundler_count": 170,
    "insider_count": 0,
    "dev_count": 1,
    "sniper_held_percentage": 0,
    "bundler_held_percentage": 25.1666808899323,
    "insider_held_percentage": 0,
    "dev_held_percentage": 0
  }
}
```

***

## Notes

- All timestamps are in Unix seconds
- `progress_percent` is always between 0 and 100
- `graduated_time` is only valid when `graduated = true`
- Events are streamed in real-time and may update frequently
- Sending a new `SUBSCRIBE_MEME` message will overwrite the previous
  subscription and replace all existing filters
