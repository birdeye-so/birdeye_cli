---
title: "API Performance"
metadata:
  robots: "index"
---

| **API Group** | **API Name** | **API Endpoint** | **Rate Limit (rps)** | **Supported Chain** |
| --- | --- | --- | --- | --- |
| Price & OHLCV | Liquidity History - Token | /defi/v3/liquidity/history/token | 100 | Solana only |
| Price & OHLCV | Liquidity Latest - Token | /defi/v3/liquidity/latest/token | 100 | Solana only |
| Price & OHLCV | Liquidity OHLC - Pair | /defi/v3/liquidity/ohlc/pair | 100 | Solana only |
| Price & OHLCV | Liquidity OHLC - Token | /defi/v3/liquidity/ohlc/token | 100 | Solana only |
| Price & OHLCV | OHLCV | /defi/ohlcv | 100 | All chains |
| Price & OHLCV | OHLCV - Base/Quote | /defi/ohlcv/base\_quote | 300 | All chains |
| Price & OHLCV | OHLCV - Pair | /defi/ohlcv/pair | 100 | All chains |
| Price & OHLCV | OHLCV V3 | /defi/v3/ohlcv | 300 | All chains |
| Price & OHLCV | OHLCV V3 - Pair | /defi/v3/ohlcv/pair | 300 | All chains except Sui |
| Price & OHLCV | Price | /defi/price | 300 | All chains |
| Price & OHLCV | Price - Historical | /defi/history\_price | 100 | All chains |
| Price & OHLCV | Price - Historical by unix time | /defi/historical\_price\_unix | 100 | Solana only |
| Price & OHLCV | Price - Multiple | /defi/multi\_price | 300 | All chains |
| Price & OHLCV | Price - Multiple | /defi/multi\_price | 300 | All chains |
| Price & OHLCV | Price Volume - Multi | /defi/price\_volume/multi | 300 | All chains |
| Price & OHLCV | Price Volume - Single | /defi/price\_volume/single | 300 | All chains |
| Stats | Pair - Pair Overview (Multiple) | /defi/v3/pair/overview/multiple | 100 | Solana \+ Fogo |
| Stats | Pair - Pair Overview (Single) | /defi/v3/pair/overview/single | 100 | Solana \+ Fogo |
| Stats | Price stats (Multiple) | /defi/v3/price/stats/multiple | 300 | All chains |
| Stats | Price stats (Single) | /defi/v3/price/stats/single | 300 | All chains |
| Stats | Token - Liquidity (Multiple) | /defi/v3/token/exit-liquidity/multiple | 100 | Base |
| Stats | Token - Liquidity (Single) | /defi/v3/token/exit-liquidity | 100 | Base |
| Stats | Token - Market Data (Multiple) | /defi/v3/token/market-data/multiple | 300 | All chains |
| Stats | Token - Market Data (Single) | /defi/v3/token/market-data | 300 | All chains |
| Stats | Token - Metadata (Multiple) | /defi/v3/token/meta-data/multiple | 300 | All chains |
| Stats | Token - Metadata (Single) | /defi/v3/token/meta-data/single | 300 | All chains |
| Stats | Token - Overview | /defi/token\_overview | 300 | All chains |
| Stats | Token - Trade Data (Multiple) | /defi/v3/token/trade-data/multiple | 300 | All chains |
| Stats | Token - Trade Data (Single) | /defi/v3/token/trade-data/single | 300 | All chains |
| Token/Market List | Token - All Market List | /defi/v2/markets | 100 | All chains |
| Token/Market List | Token - List (V1) | /defi/tokenlist | 150 | All chains |
| Token/Market List | Token - List (V3) | /defi/v3/token/list | 100 | All chains except Sui, Optimism, Polygon |
| Token/Market List | Token - List (V3) Scroll | /defi/v3/token/list/scroll | 2 | All chains except Sui, Optimism, Polygon |
| Token/Market List | Token - New listing | /defi/v2/tokens/new\_listing | 100 | All chains |
| Transactions | Token - Mint/Burn | /defi/v3/token/mint-burn-txs | 100 | Solana only |
| Transactions | Trader - Trades Seek By Time | /trader/txs/seek\_by\_time | 100 | All chains |
| Transactions | Trades - All (V3) | /defi/v3/txs | 100 | All chains |
| Transactions | Trades - Pair | /defi/txs/pair | 100 | All chains |
| Transactions | Trades - Pair Seek By Time | /defi/txs/pair/seek\_by\_time | 100 | All chains |
| Transactions | Trades - Recent (V3) | /defi/v3/txs/recent | 100 | All chains |
| Transactions | Trades - Token | /defi/txs/token | 100 | All chains |
| Transactions | Trades - Token (V3) | /defi/v3/token/txs | 100 | All chains |
| Transactions | Trades - Token Filtered By Volume (V3) | /defi/v3/token/txs-by-volume | 100 | Solana only |
| Transactions | Trades - Token Seek By Time | /defi/txs/token/seek\_by\_time | 100 | All chains |
| Wallet, Networth & PnL | Token - Top traders | /defi/v2/tokens/top\_traders | 300 | All chains |
| Wallet, Networth & PnL | Trader - Gainers/Losers | /trader/gainers-losers | 100 | All chains |
| Wallet, Networth & PnL | Wallet - Current Net Worth Summary (Multiple) | /wallet/v2/net-worth-summary/multiple | 100 | Solana only |
| Wallet, Networth & PnL | Wallet - First Tx Funded | /wallet/v2/tx/first-funded | 100 | Solana only |
| Wallet, Networth & PnL | Wallet - Leaderboard | /wallet/v2/leaderboard | 100 | Solana only |
| Wallet, Networth & PnL | Wallet - Net Worth Chart | /wallet/v2/net-worth | 50 | Solana only |
| Wallet, Networth & PnL | Wallet - Net Worth Details | /wallet/v2/net-worth-details | 50 | Solana only |
| Wallet, Networth & PnL | Wallet - PnL | /wallet/v2/pnl/summary | 100 | All chains except Sui |
| Wallet, Networth & PnL | Wallet - PnL (Per Token) | /wallet/v2/pnl | 100 | All chains except Sui |
| Wallet, Networth & PnL | Wallet - PnL (Per Wallet) | /wallet/v2/pnl/multiple | 100 | All chains except Sui |
| Wallet, Networth & PnL | Wallet - PnL Chart | /wallet/v2/pnl/chart | 100 | All chains except Sui |
| Wallet, Networth & PnL | Wallet - PnL Details | /wallet/v2/pnl/details | 100 | All chains except Sui |
| Wallet, Networth & PnL | Wallet - Portfolio (V2) | /wallet/v2/current-net-worth | 100 | Solana only |
| Wallet, Networth & PnL | Wallet - Transaction History (Beta) | /v1/wallet/tx\_list | 100 | Solana only |
| Wallet, Networth & PnL | Wallet Portfolio (Beta) | /v1/wallet/token\_list | 30 | Solana only |
| Wallet, Networth & PnL | Wallet Supported Networks | /v1/wallet/list\_supported\_chain | 30 | N/A |
| Balance & Transfer | Token - Transfer List | /token/v1/transfer | 100 | Solana only |
| Balance & Transfer | Token - Transfer Total | /token/v1/transfer/total | 100 | Solana only |
| Balance & Transfer | Wallet - Balance Change | /wallet/v2/balance-change | 100 | Solana only |
| Balance & Transfer | Wallet - Token Balance (Beta) | /v1/wallet/token\_balance | 30 | Solana only |
| Balance & Transfer | Wallet - Tokens Balance | /wallet/v2/token-balance | 100 | Solana only |
| Balance & Transfer | Wallet - Transfer | /wallet/v2/transfer | 100 | Solana only |
| Balance & Transfer | Wallet - Transfer total | /wallet/v2/transfer/total | 100 | Solana only |
| Holder | Token - First Buyers | /token/v1/first-buyers | 100 | Solana only |
| Holder | Token - Holder | /defi/v3/token/holder | 100 | Solana only |
| Holder | Token - Holder (Batch) | /token/v1/holder/batch | 100 | Solana only |
| Holder | Token - Holder Chart | /token/v1/holder/chart | 100 | Solana only |
| Holder | Token - Holder Distribution | /holder/v1/distribution | 100 | Solana only |
| Holder | Token - Holder Positions | /token/v1/holder-positions | 100 | Solana only |
| Holder | Token - Holder Profile | /token/v1/holder-profile | 100 | Solana only |
| Holder | Token - Tag Holdings Chart | /token/v1/chart/tag-holdings | 100 | Solana only |
| Holder | Token - Wallet Tags Tracker | /token/v1/wallet-tags-tracker | 100 | Solana only |
| Holder | Token - Wallet Tags Tracker Details | /token/v1/wallet-tags-tracker/details | 100 | Solana only |
| Alltime & History | All Time Trades (Multiple) | /defi/v3/all-time/trades/multiple | 300 | All chains |
| Alltime & History | All Time Trades (Single) | /defi/v3/all-time/trades/single | 300 | All chains |
| Blockchain | Supported Networks | /defi/networks | 100 | N/A |
| Blockchain | Trades - Latest Block Number | /defi/v3/txs/latest-block | 100 | All chains |
| Creation & Trending | Token - Creation Token Info | /defi/token\_creation\_info | 100 | Solana, BSC, Base, Ethereum, Monad |
| Creation & Trending | Token - Trending List | /defi/token\_trending | 100 | All chains |
| Meme | Meme Token - List | /defi/v3/token/meme/list | 100 | Solana, BSC, Monad |
| Meme | Meme Token Detail - Single | /defi/v3/token/meme/detail/single | 100 | Solana, BSC, Monad |
| Security | Token - Security | /defi/token\_security | 150 | All chains except Sui |
| Search & Utils | Search - Token, market Data | /defi/v3/search | 100 | All chains except Sui |
| Search & Utils | Utils - Credits Usage of current account | /utils/v1/credits | 1 | N/A |
| Smart Money | Smart Money - Token List | /smart-money/v1/token/list | 100 | All chains except Sui |
| Global Fees Paid | Token - Fee (Multiple) | /defi/v3/token/fee/multiple | 100 | Solana only |
| Global Fees Paid | Token - Fee (Single) | /defi/v3/token/fee/single | 100 | Solana only |
| DEX & Protocol | Blockchain Market Metrics | /market/v1/blockchain-metrics | 100 | Solana only |
| Wallet Identity | Wallet Identity - Domains | /identity/v1/domains | 100 | Solana only |
| Wallet Identity | Wallet Identity - Multiple | /identity/v1/multiple | 100 | Solana only |
| Wallet Identity | Wallet Identity - Single | /identity/v1/single | 100 | Solana only |
| Perps Token | Perps Token Liquidation Map | /perps/v1/token/liquidation\_map | 100 | Hyperliquid only |
| Perps Token | Perps Token List | /perps/v1/token/list | 100 | Hyperliquid only |
| Perps Token | Perps Token Open Positions | /perps/v1/token/open\_positions | 100 | Hyperliquid only |
| Perps Token | Perps Token Overview | /perps/v1/token/overview | 100 | Hyperliquid only |
| Perps Wallet | Perps Wallet List | /perps/v1/wallet/list | 100 | Hyperliquid only |
| Perps Wallet | Perps Wallet Open Positions | /perps/v1/wallet/open\_positions | 100 | Hyperliquid only |
| Perps Wallet | Perps Wallet Overview | /perps/v1/wallet/overview | 100 | Hyperliquid only |
| Account | Blockchain - Account Detail | /blockchain/v1/account/detail | 100 | Solana only |
| Account | Blockchain - Multiple Account Details | /blockchain/v1/account/detail/multiple | 100 | Solana only |
| Account | Blockchain - Token Accounts | /blockchain/v1/account/token-accounts | 100 | Solana only |
| Token | Blockchain - Multiple Token Metadata | /blockchain/v1/token/metadata/multiple | 100 | Solana only |
| Token | Blockchain - Token Metadata | /blockchain/v1/token/metadata | 100 | Solana only |
| Transaction | Blockchain - Transaction Detail | /blockchain/v1/transaction/detail | 100 | Solana only |