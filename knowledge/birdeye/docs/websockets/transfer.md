---
title: Transfer
excerpt: SUBSCRIBE_TRANSFER
deprecated: false
hidden: false
metadata:
  robots: index
---
## Overview

`SUBSCRIBE_TRANSFER` is a WebSocket subscription message used to receive real-time token transfer updates on Solana based on flexible filtering criteria such as wallet addresses, token addresses, transfer direction, and amount/value thresholds. Only support for **Solana**

## 1. WebSocket URL:

```yaml
wss://public-api.birdeye.so/socket/solana?x-api-key=YOUR-API-KEY
```

***

## Subscription Message

```json
{
  "type": "SUBSCRIBE_TRANSFER",
  "data": {
    "filters": [
      {
        "wallet_addresses": ["string"],
        "flow": "string (optional)",
        "token_addresses": ["string"],
        "ui_amount_min": "number (optional)",
        "ui_amount_max": "number (optional)",
        "value_min": "number (optional)",
        "value_max": "number (optional)"
      }
    ]
  }
}
```

***

## Example Subscription Message

```json
{
  "type": "SUBSCRIBE_TRANSFER",
  "data": {
    "filters": [
      {
        "wallet_addresses": [
          "5Q544fKrFoe6tsEbLhJ2fJfSLavYWhfXQ5QfVf8h2y2x"
        ],
        "flow": "in",
        "token_addresses": [
          "So11111111111111111111111111111111111111112"
        ],
        "ui_amount_min": 1,
        "ui_amount_max": 1000,
        "value_min": 10,
        "value_max": 100000
      }
    ]
  }
}
```

## Parameters

### filters

- Type: `array`
- Required
- Description: A list of filter objects. Each filter defines a set of criteria for transfers to match. Filters are evaluated with **OR logic** — a transfer matching any single filter will be returned.

Constraints:

- Maximum **10 filters** per subscription
- Sending a new `SUBSCRIBE_TRANSFER` message will overwrite the previous subscription and replace all existing filters

***

### filters\[].wallet_addresses

- Type: `array of strings`
- Required
- Description: List of wallet addresses to monitor. A transfer is matched if either `from_address` or `to_address` is in this list (combined with `flow` to narrow direction).

Constraints:

- Maximum **20 addresses** per filter

***

### filters\[].flow

- Type: `string`
- Optional
- Description: Filter transfers by direction relative to the wallet addresses.

Supported values:

- `in` — only include transfers **into** the wallet (wallet is `to_address`)
- `out` — only include transfers **out of** the wallet (wallet is `from_address`)

If omitted, both inbound and outbound transfers are returned.

***

### filters\[].token_addresses

- Type: `array of strings`
- Optional
- Description: List of token mint addresses to filter. Only transfers involving one of the specified tokens will be returned.

Constraints:

- Maximum **20 addresses** per filter

***

### filters\[].ui_amount_min

- Type: `number`
- Optional
- Description: Minimum token transfer amount in human-readable units (i.e., after applying token decimals). Transfers with `ui_amount` below this value are excluded.

***

### filters\[].ui_amount_max

- Type: `number`
- Optional
- Description: Maximum token transfer amount in human-readable units. Transfers with `ui_amount` above this value are excluded.

***

### filters\[].value_min

- Type: `number`
- Optional
- Description: Minimum USD value of the transfer. Transfers with `value` below this threshold are excluded.

***

### filters\[].value_max

- Type: `number`
- Optional
- Description: Maximum USD value of the transfer. Transfers with `value` above this threshold are excluded.

***

## WebSocket Event

### Event Type

TRANSFER_DATA

***

## Event Payload Example

```json
{
  "type": "TRANSFER_DATA",
  "data": {
    "block_number": 419596325,
    "unix_time": 1778725622,
    "token_address": "So11111111111111111111111111111111111111112",
    "from_address": "JA4g4DL31DTbJw6iHGTwCKjG794dbh638BAdGUuZ5ZKi",
    "to_address": "44FqodakqgKqQJU6ZAjBMwiBuLwNyMVtRTmzgbNdpfPN",
    "from_token_account": "FEo3AwWAVAhAKcwVKwFjeu8byPebBXyu1XnBR7deyYGs",
    "to_token_account": "2k96MHzsmLEc8ewX4P1D4bkEfVuAVVFaNyXxBuaivsoZ",
    "amount": 9365893168,
    "ui_amount": 9.365893168,
    "price": 91.1494938542852,
    "value": 853.6964217565077,
    "token_decimals": 9,
    "tx_hash": "ZTHRts1kgiXqHykpy43FFrS9BV41jQt6fjvyhMKxsVWNuie4geReGX3LdaogwnBrNPWWthFmD6H9oC25Zi8EhBH",
    "action": "transfer",
    "ins_index": 14,
    "inner_index": 1,
    "network": "solana"
  }
}
```

***

## Event Payload Fields

### block_number

- Type: `number`
- Description: The Solana slot number in which this transfer was confirmed.

### unix_time

- Type: `number`
- Description: Unix timestamp (seconds) of the block containing this transfer.

### token_address

- Type: `string`
- Description: Mint address of the token being transferred.

### from_address

- Type: `string`
- Description: Wallet address of the sender.

### to_address

- Type: `string`
- Description: Wallet address of the recipient.

### from_token_account

- Type: `string`
- Description: Associated token account (ATA) of the sender for this token.

### to_token_account

- Type: `string`
- Description: Associated token account (ATA) of the recipient for this token.

### amount

- Type: `number`
- Description: Raw transfer amount in the token's smallest unit (i.e., before applying decimals).

### ui_amount

- Type: `number`
- Description: Human-readable transfer amount after applying `token_decimals`.

### price

- Type: `number`
- Description: Token price in USD at the time of the transfer.

### value

- Type: `number`
- Description: USD value of the transfer (`ui_amount × price`).

### token_decimals

- Type: `number`
- Description: Number of decimal places for the token.

### tx_hash

- Type: `string`
- Description: Transaction signature on Solana.

### action

- Type: `string`
- Description: Type of transfer action. Possible values: `transfer` (value `1`) or `burn` (value `2`).

### ins_index

- Type: `number`
- Description: Index of the instruction within the transaction that produced this transfer.

### inner_index

- Type: `number`
- Description: Index of the inner instruction (if applicable) within `ins_index`.

### network

- Type: `string`
- Description: Blockchain network. Currently always `"solana"`.

***

## Notes

- All timestamps are in Unix seconds
- `ui_amount` equals `amount / 10^token_decimals`
- `value` equals `ui_amount × price`
- `action` is encoded as an integer internally: `1` = transfer, `2` = burn
- Filters use **OR logic** — a transfer matching any one filter will be emitted
- Maximum **10 filters** per subscription; maximum **20 addresses** per filter
- Only **Solana** is supported at this time
- Sending a new `SUBSCRIBE_TRANSFER` message overwrites the previous subscription entirely
