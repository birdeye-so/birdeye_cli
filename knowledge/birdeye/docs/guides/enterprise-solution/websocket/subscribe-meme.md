---
title: SUBSCRIBE_MEME
deprecated: false
hidden: true
metadata:
  robots: index
---
<br />

# SUBSCRIBE_MEME

## Overview

`SUBSCRIBE_MEME` is a WebSocket subscription message used to receive
real-time updates for meme tokens based on flexible filtering criteria
such as source, progress, and lifecycle timestamps.

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
    } // optional
  }
}
```

***

## Parameters

### address

* Type: `string`
* Optional
* Description: Token address to filter a specific meme token.

### graduated

* Type: `boolean`
* Optional
* Description:
  * `true`: only graduated tokens
  * `false`: only non-graduated tokens

### source

* Type: `string`
* Optional
* Description: Filter tokens by originating platform or bonding
  mechanism.

Supported values (non-exhaustive):

* `meteora_dynamic_bonding_curve`
* `pump_dot_fun`
* `moonshot`
* `raydium_launchlab`

### progress_percent

* Type: `object`
* Optional
* Description: Filter tokens by bonding curve progress.

Fields:

* `min` (number): minimum value (0-100)
* `max` (number):
  maximum value (0-100)

### creation_time

* Type: `object`
* Optional
* Description: Filter by token creation time (Unix timestamp in
  seconds).

Fields:

* `from` (number): start timestamp
* `to` (number): end
  timestamp

### graduated_time

* Type: `object`
* Optional
* Description: Filter by token graduation time (Unix timestamp in
  seconds).

Fields:

* `from` (number): start timestamp
* `to` (number): end
  timestamp

Constraints: Requires `graduated = true`

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
    "address": "63zhewydcQoZ7ftw9Z6arQentCyTNvRTY5LgnQzw1dsH",
    "name": "Google AI✨",
    "symbol": "Google✨",
    "decimals": 6,
    "extensions": {
      "description": "Google AI✨ (Google✨)"
    },
    "logo_uri": "https://gmgn.ai/external-res-va/00008fdea964bccfcb6a30aba4691bc1_v2l.webp",
    "price": 0.00009234530557074583,
    "liquidity": 2136.5737543631853,
    "total_supply": 1000000000,
    "circulating_supply": 1000000000,
    "fdv": 92345.30557074583,
    "market_cap": 92345.30557074583,
    "meme_info": {
      "source": "meteora_dynamic_bonding_curve",
      "platform_id": null,
      "created_at": {
        "tx_hash": "string",
        "slot": 407566019,
        "block_time": 1773969345
      },
      "creation_time": 1773969345,
      "creator": "string",
      "graduated": false,
      "graduated_time": null,
      "pool": {
        "address": "TXYNMBmtHqh95Qz1ia97cKD8AXjxWDF7XJh3ZmbEd9G",
        "config": "6CHBnMZ3qERYeesb79WTq8RqNr5v9UyWjT3FD1iCiVur",
        "creator": "2btAYTyupaQK3Ko1JzHCBe6ow5LVBjS7a2U3XUXr43dH",
        "baseMint": "63zhewydcQoZ7ftw9Z6arQentCyTNvRTY5LgnQzw1dsH",
        "baseThresholdMigration": "10000000070126",
        "quoteThresholdMigration": "11000000000",
        "baseVault": "8GPaq21VHM6n8MpgZZJwamUZGQ7YzSqCaiKyLGXtqvFU",
        "quoteVault": "GQFvFHbGzZ34Vqwhb7tmwNrKzBggNP7HLrukqBe1EcPc",
        "baseReserve": "10289913738931",
        "quoteReserve": "10690000000"
      },
      "progress_percent": 97.18,
      "address": "63zhewydcQoZ7ftw9Z6arQentCyTNvRTY5LgnQzw1dsH"
    }
  }
}
```

***

## Notes

* All timestamps are in Unix seconds
* `progress_percent` is always between 0 and 100
* `graduated_time` is only valid when `graduated = true`
* Events are streamed in real-time and may update frequently
* Sending a new `SUBSCRIBE_MEME` message will overwrite the previous
  subscription and replace all existing filters