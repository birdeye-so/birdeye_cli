---
description: "''"
title: ohlcv base/quote
excerpt: ''
deprecated: false
hidden: true
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
**API Endpoint:** /defi/ohlcv/base\_quote

**Description:** This endpoint facilitates retrieving historical Open, High, Low, Close, and Volume (OHLCV) data for a specific trading pair based on the addresses of the base and quote tokens. By providing the base and quote token addresses and the OHLCV interval type (e.g., 15 minutes). The response can include up to a maximum of 1000 records.

**Request Method:** GET

**Data Coverage:** Multi-chain

**Request URL:**

```undefined
https://public-api.birdeye.so/defi/ohlcv/base_quote?base_address=So11111111111111111111111111111111111111112&quote_address=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&type=15m&time_from=1691997839&time_to=1692266639
```

**Request Headers:**

```undefined
accept: application/json
x-chain: any chains that Birdeye supports. Example: solana, ethereum
X-API-KEY: YOUR_API_KEY
```

**Parameters:**

* `base_address` (string): The base token's Solana address for the trading pair.
* `quote_address` (string): The quote token's Solana address for the trading pair.
* `type` (string): The OHLCV interval type (e.g., 15m for 15 minutes).
* `time_from` (int): The Unix timestamp representing the start of the desired time range.
* `time_to` (int): The Unix timestamp representing the end of the desired time range.

**Response:** The response provides an array of OHLCV data points for the specified trading pair, each including open, high, low, close, volume for the base and quote tokens, interval type, and Unix timestamp.

**Example Request:**

```bash
curl -X 'GET' \
  'https://public-api.birdeye.so/defi/ohlcv/base_quote?base_address=So11111111111111111111111111111111111111112&quote_address=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&type=15m&time_from=1691997839&time_to=1692266639' \
  -H 'accept: application/json' \
  -H 'x-chain: solana' \
  -H 'X-API-KEY: YOUR_API_KEY'
```

**Example Response:**

```json
{
  "data": {
    "items": [
      {
        "o": 24.47148962093433,
        "c": 24.41362256919705,
        "h": 24.49053693406104,
        "l": 24.350683512640458,
        "baseAddress": "So11111111111111111111111111111111111111112",
        "quoteAddress": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "vBase": 3409.157415062003,
        "vQuote": 91515.13598700023,
        "type": "15m",
        "unixTime": 1691998200
      },
      // More OHLCV data points for the trading pair...
    ]
  },
  "success": true
}
```

**Note:** Replace the base\_address and quote\_address in the request URL with the actual addresses of the base and quote tokens for the trading pair. The x-chain header specifies the blockchain network, and the X-API-KEY header provides authentication for the premium API.