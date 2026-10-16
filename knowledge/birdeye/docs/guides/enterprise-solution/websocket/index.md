---
description: "''"
title: WebSocket
excerpt: ''
deprecated: false
hidden: false
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
# Birdeye Real-Time WebSocket Documentation

## Introduction

The **Birdeye Real-Time WebSocket** provides real-time updates for cryptocurrency-related events, including **price changes, transactions, OHLCV data, and wallet activity**. This documentation outlines how to connect, subscribe to events, and receive live data updates.

### Connection Limits

Each WebSocket **connection** supports:

* **Price, Transactions, and OHLCV:** Up to **100 tokens per connection**
* **Wallet Tracking:** **1 address per connection**

WebSocket access is available for **Business Package** subscribers, which includes **500 concurrent connections** by default. For higher limits, consider upgrading to the **Enterprise Package** for more concurrent connections.  
**We strongly encourage you to implement a ping-pong mechanism for the connection to prevent it from being disconnected due to network issues**

# Supported Timeframes

We support a wide range of timeframes for all chains via the WebSocket API, ranging from 1 minute to 1 month: `1m, 3m, 5m, 15m, 30m, 1H, 2H, 4H, 6H, 8H, 12H, 1D, 3D, 1W, 1M` For Solana, we also support additional smaller intervals: `1s, 15s, 30s` These timeframes can be used in your subscription requests to receive candlestick data at the desired granularity.

## Code Example

Checkout this Github file for an example: [https://github.com/TheNang2710/bds-public#L62-L65](https://github.com/TheNang2710/bds-public)

Sample for new-pair on javascript [https://github.com/TheNang2710/bds-public/blob/main/new-pair-simple.js](https://github.com/TheNang2710/bds-public/blob/main/new-pair-simple.js)

Sample code for ohlcv on Go [https://github.com/TheNang2710/bds-public/blob/main/go/ws_price.go](https://github.com/TheNang2710/bds-public/blob/main/go/ws_price.go)

## WebSocket URL:

```
wss://public-api.birdeye.so/socket/solana?x-api-key=YOUR-API-KEY
```

### Header

| Key                      | Value                      |
| ------------------------ | -------------------------- |
| `Origin`                 | ws://public-api.birdeye.so |
| `Sec-WebSocket-Origin`   | ws://public-api.birdeye.so |
| `Sec-WebSocket-Protocol` | echo-protocol              |

**Note:**

* Replace `<chain>` with the desired blockchain identifier (e.g., `solana` for the Solana blockchain, ethereum for the Ethereum blockchain) and `<api_key>` with your Birdeye API key.
* Add `echo-protocol` to your request header.

## Subscription and Unsubscription

To receive real-time updates, you need to subscribe to specific events using subscription messages. The example code above demonstrates how to send a subscription message to receive price updates for a specific currency pair.

## Supported WebSocket Events

Birdeye Real-Time WebSocket supports the following subscription types:

### **Subscription Events**

| **Subscription Type**                                                                   | **Description**                                                                                                                                                                          |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [SUBSCRIBE_PRICE (OHLCV)](../../../websockets/subscribe-price-ohlcv)      | Subscribe to receive real-time price updates for tokens or token pairs.                                                                                                                  |
| [SUBSCRIBE_TXS](../../../websockets/tokenpair-transactions)               | Subscribe to receive real-time transaction updates for tokens or token pairs.                                                                                                            |
| [SUBSCRIBE_BASE_QUOTE_PRICE](../../../websockets/base-quote-ohlcv)        | Subscribe to receive real-time updates about price changes for any token pairs without needing to input a specific pair address                                                          |
| [SUBSCRIBE_TOKEN_NEW_LISTING](../../../websockets/new-token-listing)      | Subscribe to real-time updates about new token listings.                                                                                                                                 |
| [SUBSCRIBE_NEW_PAIR](../../../websockets/new-pair)                        | Subscribe to receive real-time updates about new pairs.                                                                                                                                  |
| [SUBSCRIBE_LARGE_TRADE_TXS](../../../websockets/track-large-transactions) | Subscribe to large trade transactions filtered by specified volume thresholds in USD.                                                                                                    |
| [SUBSCRIBE_WALLET_TXS](http://docs.birdeye.so/reference/wallet-transactions)            | Subscribe to real-time updates for transactions involving a specific wallet address; useful for tracking all token transactions of a given address.                                      |
| [SUBSCRIBE_TOKEN_STATS](../../../websockets/token-stats)                  | Subscribe to real-time updates for token overview data                                                                                                                                   |
| [SUBSCRIBE_MEME](../../../websockets/meme-stats)                          | Subscribe to real-time updates for meme tokens based on flexible filtering criteria such as source, progress, and lifecycle timestamps.                                                  |
| [SUBSCRIBE_TRANSFER](../../../websockets/transfer)                        | Subscribe to real-time token transfer updates on Solana based on flexible filtering criteria such as wallet addresses, token addresses, transfer direction, and amount/value thresholds. |

### **Unsubscription Events**

The WebSocket also supports unsubscription with the following message values:

* **`UNSUBSCRIBE_NEW_PAIR`**
* **`UNSUBSCRIBE_PRICE`**
* **`UNSUBSCRIBE_BASE_QUOTE_PRICE`**
* **`UNSUBSCRIBE_LARGE_TRADE_TXS`**
* **`UNSUBSCRIBE_TOKEN_NEW_LISTING`**
* **`UNSUBSCRIBE_TXS`**
* **`UNSUBSCRIBE_WALLET_TXS`**
* **`TOKEN_STATS_DATA`**

For example:

```
msg = {
   type: "UNSUBSCRIBE_TXS"
}
```

## Connection Instructions

To establish a WebSocket connection to the Birdeye Real-Time API, you can use various WebSocket client libraries available for different programming languages.

Here's an example using Node.js:

```javascript
const WebSocketClient = require('websocket').client;
const util = require("util");
const fs = require('fs');
require('dotenv').config();
const client = new WebSocketClient();

// Load the API key from environment variables
const apiKey = process.env.apiKey;

// Accept chain and address from command line arguments with defaults
const chain = process.argv[2] || 'solana'; // Default to 'solana' if not specified
const address = process.argv[3] || 'So11111111111111111111111111111111111111112'; // Default address

// Construct the WebSocket URL
const url = util.format('wss://public-api.birdeye.so/socket/%s?x-api-key=%s', chain, apiKey);

client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');

    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });

    connection.on('close', function () {
        console.log('WebSocket Connection Closed');
    });

    connection.on('ping', function (_) {
        console.log("Received ping from server");
        connection.pong();
    });

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
            const data = JSON.parse(message.utf8Data);

            // Process different message types
            switch(data.type) {
                case 'PRICE_DATA':
                    console.log('Price Update Received:');
                    console.log(`Open: ${data.data.o}`);
                    console.log(`High: ${data.data.h}`);
                    console.log(`Low: ${data.data.l}`);
                    console.log(`Close: ${data.data.c}`);
                    console.log(`Volume: ${data.data.v}`);
                    console.log(`Symbol: ${data.data.symbol}`);
                    console.log(`Time: ${new Date(data.data.unixTime * 1000).toLocaleString()}`);
                    break;
                case 'WELCOME':
                    console.log('Welcome Message Received');
                    break;
                default:
                    console.log('Unhandled message type:', data.type);
            }
        }
    });

    // Send a subscription message
    const subscriptionMsg = {
        type: "SUBSCRIBE_PRICE",
        data: {
            queryType: "simple",
            chartType: "1m",
            address: address,
            currency: "usd"
        }
    };

    connection.send(JSON.stringify(subscriptionMsg));

});

client.connect(url, 'echo-protocol');
```

## Message Format

WebSocket messages are exchanged in **JSON format**, consisting of:

* **`type`**: Specifies the subscription type (e.g., `"SUBSCRIBE_PRICE"`).
* **`data`**: Contains the relevant subscription details.

***

## Real-Time Data

Once subscribed, real-time updates are received in **JSON format**, containing relevant information based on the subscribed event. The structure of the response varies depending on the event type.

***

## Error Handling

WebSocket connections may encounter **errors** due to network instability, API limits, or invalid requests. To ensure smooth operation:

* **Monitor error events** and handle them gracefully.
* **Implement automatic reconnection** in case of connection failures.

***

## Closing & Reconnecting

To properly close a WebSocket connection, ensure a **graceful shutdown**. If the connection is lost unexpectedly, implement a **reconnection mechanism** to restore subscriptions automatically.

Recommended **reconnection strategy**:

* **Use exponential backoff** to manage reconnection attempts.
* **Verify network connectivity** before retrying.
* **Re-subscribe to previous events** upon reconnection.

***

## Overwriting Subscription Messages

Each WebSocket connection supports one active subscription per message type.

If you send a new subscription message with the same type but different parameters, the previous subscription of that type will be overwritten.

Example:

You send:

* `SUBSCRIBE_TXS` for `So11111111111111111111111111111111111111112`
* `SUBSCRIBE_PRICE` for `So11111111111111111111111111111111111111112`

You will begin receiving:

* Transaction events for So11111111111111111111111111111111111111112
* OHLCV (price) events for So11111111111111111111111111111111111111112

You then send:

* `SUBSCRIBE_TXS` for `JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN`

The result:

* You continue receiving OHLCV events for `So11111111111111111111111111111111111111112` (unchanged).
* You stop receiving transaction events for `So11111111111111111111111111111111111111112`.
* You start receiving transaction events for `JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN`.

The previous `SUBSCRIBE_TXS` subscription is overwritten by the new one.

***

## Security Considerations

* **Keep API keys secure** and avoid exposing them in public repositories or front-end code.
* **Use environment variables** to store sensitive credentials.
* **Monitor WebSocket usage** to detect unauthorized access.

## Connection Stability: Ping-Pong and Reconnection Strategy

To ensure long-lived and reliable WebSocket connections—especially for streaming real-time price updates—we recommend implementing a ping-pong mechanism alongside a reconnection strategy.

WebSocket connections can silently drop due to network issues, timeouts, or intermediate proxies. A heartbeat system using ping-pong messages helps detect these drops and recover gracefully.

🔁 Implementing Ping-Pong Birdeye WebSocket servers support standard WebSocket ping/pong frames.

**Client-Side (Example in JavaScript):**

```javascript
const WebSocketClient = require('websocket').client;
const util = require("util");

const client = new WebSocketClient();

client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function (connection) {
    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });

    connection.on('close', function () {
        console.log('WebSocket Connection Closed');
    });

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
            // Process received data here
        }
    });

    connection.on('ping', function () {
        connection.pong()
    });

    // Send subscription message here
    const subscriptionMsg = {
        type: "SUBSCRIBE_PRICE",
        data: {
            chartType: "1m",
            currency: "pair",
            address: "FmKAfMMnxRMaqG1c4emgA4AhaThi4LQ4m2A12hwoTibb"
        }
    };

    connection.send(JSON.stringify(subscriptionMsg));
});

// Connect to Birdeye WebSocket
const chain = "solana"; // Example chain
const apiKey = "<your_api_key_here>";
const wsUrl = util.format('wss://public-api.birdeye.so/socket/%s?x-api-key=%s', chain, apiKey);

client.connect(wsUrl, 'echo-protocol', "https://birdeye.so");
```

Notes:

* The server may also initiate pings. Make sure your client responds with a pong automatically or manually, depending on the WebSocket library you’re using.
* Adjust ping intervals based on your latency tolerance and expected traffic volume.
* Always clear timeouts and intervals when closing or reconnecting.
