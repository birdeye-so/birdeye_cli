---
description: "''"
title: SUBSCRIBE_BASE_QUOTE_PRICE
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
The "SUBSCRIBE\_BASE\_QUOTE\_PRICE" event allows you to receive real-time updates about price changes for any token pairs without needing to input a specific pair address; you can simply pass the two token addresses you want to track. You can subscribe to price updates for these token pairs in the form of OHLCV (Open, High, Low, Close, Volume) data. This subscription is useful for tracking price movements and trends on the Birdeye platform.

## Code Example

Check out this Github file for an example:

[https://github.com/TheNang2710/bds-public/blob/main/ws-base-quote.js](https://github.com/TheNang2710/bds-public/blob/main/ws-base-quote.js)

## 1. WebSocket URL:

```
wss://public-api.birdeye.so/socket/solana?x-api-key=YOUR-API-KEY
```

### Header

| Key                      | Value                       |
| ------------------------ | --------------------------- |
| `Origin`                 | ws\://public-api.birdeye.so |
| `Sec-WebSocket-Origin`   | ws\://public-api.birdeye.so |
| `Sec-WebSocket-Protocol` | echo-protocol               |

## 2. Subscribe to Base-Quote Price (OHLCV)

To receive real-time updates about price changes for a specific token pair in the form of OHLCV data, use the following subscription message format:

### Subscription message

```Text json
{  
  "type": "SUBSCRIBE_BASE_QUOTE_PRICE",  
  "data": {  
    "baseAddress": "So11111111111111111111111111111111111111112",  
    "quoteAddress": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  
    "chartType": "1m"  
  }  
} 
```

### Sample response

```Text json
{  
  "type": "BASE_QUOTE_PRICE_DATA",  
  "data": {  
    "o": 153.00668789866964,  
    "h": 153.0229060481432,  
    "l": 152.88823226160142,  
    "c": 152.89094335479908,  
    "eventType": "ohlcv",  
    "type": "1m",  
    "unixTime": 1729158060,  
    "v": 0,  
    "baseAddress": "So11111111111111111111111111111111111111112",  
    "quoteAddress": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"  
  }  
}
```

### Implementation Example in JavaScript

Use the above github js code and run

```Text bash
node ws-base-quote.js solana So11111111111111111111111111111111111111112 EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v 1m
```

**Explanation:**

* `solana`: The blockchain chain to subscribe to (e.g., Solana).
* `So11111111111111111111111111111111111111112`: The base token address.
* `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`: The quote token address (e.g., USDC).
* `1m`: The chart type, which is the interval for OHLCV data (e.g., 1 minute).

**Note:**

* This example subscribes to real-time price updates for a token pair and logs the Open, High, Low, Close, and Volume data to the console. The subscription is automatically closed after 1 hour.
* This WebSocket only support 1 base-quote pair for 1 connection. You need to open another connection for new base-quote subscription.