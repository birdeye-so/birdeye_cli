---
title: Per API rate limit
deprecated: false
hidden: false
metadata:
  robots: index
---
| **API Name**                    | **API Endpoint**                      | **Rate Limit (rps)** |
| ------------------------------- | ------------------------------------- | -------------------- |
| Price                           | `/defi/price`                         | 300                  |
| Price - Multiple                | `/defi/multi_price`                   | 300                  |
| Price - Historical              | `/defi/history_price`                 | 100                  |
| Price - Historical by Unix Time | `/defi/historical_price_unix`         | 100                  |
| Trades - Token                  | `/defi/txs/token`                     | 100                  |
| Trades - Pair                   | `/defi/txs/pair`                      | 100                  |
| Trades - Token Seek By Time     | `/defi/txs/token/seek_by_time`        | 100                  |
| Trades - Pair Seek By Time      | `/defi/txs/pair/seek_by_time`         | 100                  |
| Trades - Token (V3)             | `/defi/v3/token/txs`                  | 100                  |
| OHLCV                           | `/defi/ohlcv`                         | 100                  |
| OHLCV - Pair                    | `/defi/ohlcv/pair`                    | 100                  |
| OHLCV - Base/Quote              | `/defi/ohlcv/base_quote`              | 300                  |
| Price Volume - Single           | `/defi/price_volume/single`           | 300                  |
| Price Volume - Multi            | `/defi/price_volume/multi`            | 300                  |
| Pair - Overview (Single)        | `/defi/v3/pair/overview/single`       | 100                  |
| Pair - Overview (Multiple)      | `/defi/v3/pair/overview/multiple`     | 100                  |
| Trade v3 - All                  | `/defi/v3/txs`                        | 100                  |
| Token - List (V1)               | `/defi/tokenlist`                     | 150                  |
| Token - Security                | `/defi/token_security`                | 150                  |
| Token - Overview                | `/defi/token_overview`                | 300                  |
| Token - Creation Token Info     | `/defi/token_creation_info`           | 100                  |
| Token - Trending List           | `/defi/token_trending`                | 100                  |
| Token - New Listing             | `/defi/v2/tokens/new_listing`         | 100                  |
| Token - Top Traders             | `/defi/v2/tokens/top_traders`         | 300                  |
| Token - All Market List         | `/defi/v2/markets`                    | 100                  |
| Token - Metadata (Single)       | `/defi/v3/token/meta-data/single`     | 300                  |
| Token - Metadata (Multiple)     | `/defi/v3/token/meta-data/multiple`   | 300                  |
| Token - Market Data             | `/defi/v3/token/market-data`          | 300                  |
| Token - Market Data (Multiple)  | `/defi/v3/token/market-data/multiple` | 300                  |
| Token - Trade Data (Single)     | `/defi/v3/token/trade-data/single`    | 300                  |
| Token - Trade Data (Multiple)   | `/defi/v3/token/trade-data/multiple`  | 300                  |
| Token - Holder                  | `/defi/v3/token/holder`               | 100                  |
| Token - Mint/Burn               | `/defi/v3/token/mint-burn-txs`        | 100                  |
| Token - List (V3)               | `/defi/v3/token/list`                 | 100                  |
| Token - List (V3) scroll        | `/defi/v3/token/list/scroll`          | 2                    |
| Alltime - Trades (Single)       | `/defi/v3/all-time/trades/single`     | 300                  |
| Alltime - Trades (Multiple)     | `/defi/v3/all-time/trades/multiple`   | 300                  |
| Trader - Gainers/Losers         | `/trader/gainers-losers`              | 100                  |
| Trader - Trades Seek By Time    | `/trader/txs/seek_by_time`            | 100                  |
| Wallet Portfolio                | `/v1/wallet/token_list`               | 30 rps / 150 rpm     |
| Wallet Transaction History      | `/v1/wallet/tx_list`                  | 30 rps / 150 rpm     |
| Wallet - Token Balance          | `/v1/wallet/token_balance`            | 30 rps / 150 rpm     |
| Search                          | `/defi/v3/search`                     | 100                  |
| Supported Networks              | `/defi/networks`                      | 100                  |
| Wallet Supported Networks       | `/v1/wallet/list_supported_chain`     | 30 rps / 150 rpm     |
| Trade - Latest block number     | `/defi/v3/txs/latest-block`           | 100                  |