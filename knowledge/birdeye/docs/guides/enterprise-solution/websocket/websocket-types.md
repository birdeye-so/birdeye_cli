---
title: Websocket Subscriptions
deprecated: false
hidden: false
metadata:
  robots: index
---
Explore Birdeye Data’s real-time WebSocket subscriptions to stream market data, transactions, wallet activity, new listings, and more. Each subscription type is designed for different use cases and supports various filtering options. Click on any subscription below to view detailed documentation, input/output examples, supported parameters, and integration guides.

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