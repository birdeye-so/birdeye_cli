---
description: "''"
title: API Sample Request/Response
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
# Endpoints

Click on each API to view detailed instructions

| No. | API                            | Description                                                                                                            | Endpoint                                                                                                                           |
| :-- | :----------------------------- | :--------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Token List                     | Access a list of available DeFi tokens, offering a comprehensive overview of tokens available for analysis.            | [https://docs.birdeye.so/reference/get\_defi-tokenlist](../../../data-api/tokenmarket-list/get-defi-tokenlist)                      |
| 2   | Price                          | Access real-time price data for tokens (not NFTs), enabling the tracking of market prices across various tokens.       | [https://docs.birdeye.so/reference/get\_defi-price](../../../data-api/price-ohlcv/get-defi-price)                              |
| 3   | Price History                  | Retrieve historical price data for tokens (not NFTs), providing insights into past price movements and trends.         | [https://docs.birdeye.so/reference/get\_defi-history-price](../../../data-api/price-ohlcv/get-defi-history-price)              |
| 4   | Token Overview                 | Obtain an overview of a specific DeFi token, including key information such as symbol, name, and other relevant data.  | [https://docs.birdeye.so/reference/get\_defi-token-overview](../../../data-api/stats/get-defi-token-overview)            |
| 5   | Token - Security               | Get details about security of a token, including its mint time, smart contract status, etc.                            | [https://docs.birdeye.so/reference/get\_defi-token-security](../../../data-api/security/get-defi-token-security)            |
| 6   | Multi Price                    | Obtain multi-token price data for tokens and pairs, allowing simultaneous retrieval of pricing information.            | [https://docs.birdeye.so/reference/get\_defi-multi-price](../../../data-api/price-ohlcv/get-defi-multi-price)                  |
| 7   | Trades - by Token              | Fetch trade history for a specific token (not NFTs), providing insights into recent token movements and activities.    | [https://docs.birdeye.so/reference/get\_defi-txs-token](../../../data-api/transactions/get-defi-txs-token)                      |
| 8   | Trades - by Pair               | Retrieve trade history for a specific pair/market, offering details about trades and interactions within that pair.    | [https://docs.birdeye.so/reference/get\_defi-txs-pair](../../../data-api/transactions/get-defi-txs-pair)                        |
| 9   | OHLCV - by Token               | Obtain Open-High-Low-Close-Volume (OHLCV) data for DeFi tokens, presenting historical price movements and trends.      | [https://docs.birdeye.so/reference/get\_defi-ohlcv](../../../data-api/price-ohlcv/get-defi-ohlcv)                              |
| 10  | OHLCV - by Pair                | Get OHLCV data for a specific DeFi token pair/market, offering insights into historical price movements for that pair. | [https://docs.birdeye.so/reference/get\_defi-ohlcv-pair](../../../data-api/price-ohlcv/get-defi-ohlcv-pair)                    |
| 11  | OHLCV - by Base/Quote          | Fetch OHLCV data for any two tokens, which do not necessarily have common pairs/markets.                               | [https://docs.birdeye.so/reference/get\_defi-ohlcv-base-quote](../../../data-api/price-ohlcv/get-defi-ohlcv-base-quote)        |
| 12  | Token - All market list        | Detailed information about cryptocurrency markets on blockchain                                                        | [https://public-api.birdeye.so/defi/v2/markets](https://public-api.birdeye.so/defi/v2/markets)                                     |
| 14  | Price- Historical  Unix        | Retrieves the historical price of a specified token at the closest available time to a given Unix timestamp.           | [https://public-api.birdeye.so/defi/historical\_price\_unix](https://public-api.birdeye.so/defi/historical_price_unix)             |
| 15  | Defi - Price Volume (Single)   | Retrieves the current price and volume data for a specified token over a given time period.                            | [https://public-api.birdeye.so/defi/price\_volume/single](https://public-api.birdeye.so/defi/price_volume/single)                  |
| 16  | Defi - Price Volume (Multiple) | Retrieves the current price and volume data for multiple specified tokens over a given time period.                    | [https://public-api.birdeye.so/defi/price\_volume/multi](https://public-api.birdeye.so/defi/price_volume/multi)                    |
| 17  | Token - New Listing            | Get newly listed tokens of any supported chains.                                                                       | [https://public-api.birdeye.so/defi/v2/tokens/new\_listing](https://public-api.birdeye.so/defi/v2/tokens/new_listing)              |
| 18  | Token - Top Traders            | Get top traders of given token.                                                                                        | [https://public-api.birdeye.so/defi/v2/tokens/top\_traders](https://public-api.birdeye.so/defi/v2/tokens/top_traders)              |
| 19  | Token - Trending               | Retrieve a dynamic and up-to-date list of trending tokens based on specified sorting criteria.                         | [https://public-api.birdeye.so/defi/token\_trending](https://public-api.birdeye.so/defi/token_trending)                            |
| 20  | Token - Meta Data (Single)     | retrieving detailed metadata about a specific token on a chosen blockchain.                                            | [https://public-api.birdeye.so/defi/v3/token/meta-data/single](https://public-api.birdeye.so/defi/v3/token/meta-data/single)       |
| 21  | Token - Meta Data (Multiple)   | pull metadata for multiple tokens in a single API call.                                                                | [https://public-api.birdeye.so/defi/v3/token/meta-data/multiple](https://public-api.birdeye.so/defi/v3/token/meta-data/multiple)   |
| 22  | Token - Market Data            | get real-time and historical market data for a specific token on a given blockchain.                                   | [https://public-api.birdeye.so/defi/v3/token/market-data](https://public-api.birdeye.so/defi/v3/token/market-data)                 |
| 23  | Token - Trade Data (Single)    | retrieves trade data for a specific token identified by its address.                                                   | [https://public-api.birdeye.so/defi/v3/token/trade-data/single](https://public-api.birdeye.so/defi/v3/token/trade-data/single)     |
| 24  | Token - Trade Data (Multiple)  | retrieves trade data for multiple tokens identified by their addresses.                                                | [https://public-api.birdeye.so/defi/v3/token/trade-data/multiple](https://public-api.birdeye.so/defi/v3/token/trade-data/multiple) |
| 25  | Token - Holder list            | Get holder list of a token in descending order                                                                         | [https://public-api.birdeye.so/defi/v3/token/holder](https://public-api.birdeye.so/defi/v3/token/holder)                           |
| 26  | Trader - Gainers Losers        | The API provides detailed information top gainers/losers                                                               | /trader/gainers-losers                                                                                                             |
| 27  | Trades - Token Seek By Time    | Get list of trades of a token with time bound option.                                                                  | /defi/txs/token/seek\_by\_time                                                                                                     |
| 28  | Trades - Pair Seek By Time     | Get list of trades of a certain pair or market with time bound option.                                                 | /defi/txs/pair/seek\_by\_time                                                                                                      |
| 29  | Trader - Trades Seek By Time   | Get list of trades of a trader with time bound option.                                                                 | /trader/txs/seek\_by\_time                                                                                                         |
| 30  | Token Creation Info            | Get creation info of token                                                                                             | /defi/token\_creation\_info                                                                                                        |
| 31  | Search                         | Search for token and market data by matching a pattern or a specific token, market address.                            | /defi/v3/search                                                                                                                    |
| 32  | Pair overview -                | Get overview of single pair                                                                                            | /defi/v3/pair/overview/single                                                                                                      |
| 33  | Pair overview - Multiple       | Get overview of multiple pairs                                                                                         | /defi/v3/pair/overview/multiple                                                                                                    |

## In Beta:

The below APIs are currently on beta and will soon be published for our clients. Birdeye's clients who possess specific API keys can still access these APIs for testing purpose.

| No. | API                                        | Description                                                                                                                     | Endpoint                                                                                                                                      |
| :-- | :----------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | List of Supported Chains                   | Provides a list of supported blockchains that are available for wallet integration through the Birdeye APIs.                    | [https://docs.birdeye.so/reference/get\_v1-wallet-list-supported-chain](../../../data-api/wallet-networth-pnl/get-v1-wallet-list-supported-chain) |
| B2  | Wallet - Portfolio - Selected Chain        | Access detailed information about a user's portfolio, including current holdings, transaction history, and performance metrics. | [https://docs.birdeye.so/reference/get\_v1-wallet-token-list](../../../data-api/wallet-networth-pnl/get-v1-wallet-token-list)                     |
| B3  | Wallet - Token Balance                     | Check wallet's balance of a specific token.                                                                                     | [https://docs.birdeye.so/reference/get\_v1-wallet-token-balance](../../../data-api/balance-transfer/get-v1-wallet-token-balance)               |
| B4  | Wallet - Transaction List - Selected Chain | Retrieve portfolio data of a wallet in a specific blockchain network, providing a comprehensive view of the user's assets.      | [https://docs.birdeye.so/reference/get\_v1-wallet-tx-list](../../../data-api/wallet-networth-pnl/get-v1-wallet-tx-list)                           |
| B5  | Transaction Simulation                     | Retrieve a preview of transactions for users to check before they finalize and sign the transaction.                            | [https://docs.birdeye.so/reference/post\_v1-wallet-simulate](https://docs.birdeye.so/reference/post_v1-wallet-simulate)                       |

# Try it out

Visit the [**APIs Endpoints**](../../../data-api/price-ohlcv/get-defi-price) to try out all the endpoints: