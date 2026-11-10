---
title: "What is Compute Unit Cost?"
metadata:
  title: "Compute Unit Cost"
  description: "Compute unit pricing for Birdeye Data API, Perps Data API, and Blockchain Data API."
  robots: "index"
---

Compute units (CU) measure the resource cost of each API request across Birdeye Data API, Perps Data API, and Blockchain Data API.

## CU Models

- **fixed**: one constant CU value per request
- **batch**: `ceil(base * n^multiplier)` ([Reference](compute-unit-cost/batch-token-cu-cost))
- **dynamic**: CU depends on response size tiers ([Reference](compute-unit-cost/dynamic-compute-unit-cost))
- **dynamic-by-resolution**: CU depends on resolution, requested depth, and historical lookback ([Reference](compute-unit-cost/multi-factor-cu-cost))

## Birdeye Data API / Price & OHLCV

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../data-api/price-ohlcv/get-defi-historical-price-unix"><code>GET /defi/historical\_price\_unix</code></a> | Price - Historical by unix time | fixed | 5 CU |
| <a href="../data-api/price-ohlcv/get-defi-history-price"><code>GET /defi/history\_price</code></a> | Price - Historical | dynamic | \<=100: 12 CU; \<=300: 25 CU; default: 35 CU |
| <a href="../data-api/price-ohlcv/get-defi-multi-price"><code>GET /defi/multi\_price</code></a> | Price - Multiple | batch | ceil(3 \* count^0.8) |
| <a href="../data-api/price-ohlcv/post-defi-multi-price"><code>POST /defi/multi\_price</code></a> | Price - Multiple | batch | ceil(3 \* count^0.8) |
| <a href="../data-api/price-ohlcv/get-defi-ohlcv"><code>GET /defi/ohlcv</code></a> | OHLCV | dynamic | \<=100: 12 CU; \<=300: 25 CU; default: 35 CU |
| <a href="../data-api/price-ohlcv/get-defi-ohlcv-base-quote"><code>GET /defi/ohlcv/base\_quote</code></a> | OHLCV - Base/Quote | dynamic | \<=100: 12 CU; \<=300: 25 CU; default: 35 CU |
| <a href="../data-api/price-ohlcv/get-defi-ohlcv-pair"><code>GET /defi/ohlcv/pair</code></a> | OHLCV - Pair | dynamic | \<=100: 12 CU; \<=300: 25 CU; default: 35 CU |
| <a href="../data-api/price-ohlcv/get-defi-price"><code>GET /defi/price</code></a> | Price | fixed | 3 CU |
| <a href="../data-api/price-ohlcv/post-defi-price-volume-multi"><code>POST /defi/price\_volume/multi</code></a> | Price Volume - Multi | batch | ceil(5 \* count^0.8) |
| <a href="../data-api/price-ohlcv/get-defi-price-volume-single"><code>GET /defi/price\_volume/single</code></a> | Price Volume - Single | fixed | 5 CU |
| <a href="../data-api/price-ohlcv/get-defi-v3-liquidity-history-token"><code>GET /defi/v3/liquidity/history/token</code></a> | Liquidity History - Token | dynamic-by-resolution | 1m base 20 CU, 4h base 50 CU, 1D base 200 CU; depth multiplier: \<=100 x1, \<=300 x2, \<=500 x3; lookback multiplier: \<1 day x1, 1-100 days x1.5, \>100 days x3; formula: ceil(base _depth_ lookback) |
| <a href="../data-api/price-ohlcv/get-defi-v3-liquidity-history-pair"><code>GET /defi/v3/liquidity/history/pair</code></a> | Liquidity History - Pair | fixed/batch | 5 CU; with count: ceil(5 \* count^0.5) |
| <a href="../data-api/price-ohlcv/post-defi-v3-liquidity-latest-token"><code>POST /defi/v3/liquidity/latest/token</code></a> | Liquidity Latest - Token | batch | ceil(5 \* token\_count^0.8) |
| <a href="../data-api/price-ohlcv/get-defi-v3-liquidity-ohlc-pair"><code>GET /defi/v3/liquidity/ohlc/pair</code></a> | Liquidity OHLC - Pair | dynamic-by-resolution | 1m base 20 CU; depth multiplier: \<=100 x1, \<=300 x2, \<=500 x3; lookback multiplier: \<1 day x1, 1-100 days x1.5, \>100 days x3; formula: ceil(base _depth_ lookback) |
| <a href="../data-api/price-ohlcv/get-defi-v3-liquidity-ohlc-token"><code>GET /defi/v3/liquidity/ohlc/token</code></a> | Liquidity OHLC - Token | dynamic-by-resolution | 1m base 20 CU, 4h base 50 CU, 1D base 200 CU; depth multiplier: \<=100 x1, \<=300 x2, \<=500 x3; lookback multiplier: \<1 day x1, 1-100 days x1.5, \>100 days x3; formula: ceil(base _depth_ lookback) |
| <a href="../data-api/price-ohlcv/get-defi-v3-ohlcv"><code>GET /defi/v3/ohlcv</code></a> | OHLCV V3 | dynamic | \<=100: 12 CU; \<=300: 25 CU; \<=1000: 40 CU; \<=2000: 75 CU; \<=5000: 100 CU; default: 40 CU |
| <a href="../data-api/price-ohlcv/get-defi-v3-ohlcv-pair"><code>GET /defi/v3/ohlcv/pair</code></a> | OHLCV V3 - Pair | dynamic | \<=100: 12 CU; \<=300: 25 CU; \<=1000: 40 CU; \<=2000: 75 CU; \<=5000: 100 CU; default: 40 CU |

## Birdeye Data API / Stats

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../data-api/stats/get-defi-token-overview"><code>GET /defi/token\_overview</code></a> | Token - Overview | fixed | 15 CU |
| <a href="../data-api/stats/get-defi-v3-pair-overview-multiple"><code>GET /defi/v3/pair/overview/multiple</code></a> | Pair - Pair Overview (Multiple) | batch | ceil(15 \* pair\_count^0.8) |
| <a href="../data-api/stats/get-defi-v3-pair-overview-single"><code>GET /defi/v3/pair/overview/single</code></a> | Pair - Pair Overview (Single) | fixed | 15 CU |
| <a href="../data-api/stats/post-defi-v3-price-stats-multiple"><code>POST /defi/v3/price/stats/multiple</code></a> | Price stats (Multiple) | batch | ceil(5 \* count^0.8) |
| <a href="../data-api/stats/get-defi-v3-price-stats-single"><code>GET /defi/v3/price/stats/single</code></a> | Price stats (Single) | fixed | 5 CU |
| <a href="../data-api/stats/get-defi-v3-token-exit-liquidity"><code>GET /defi/v3/token/exit-liquidity</code></a> | Token - Liquidity (Single) | fixed | 15 CU |
| <a href="../data-api/stats/get-defi-v3-token-exit-liquidity-multiple"><code>GET /defi/v3/token/exit-liquidity/multiple</code></a> | Token - Liquidity (Multiple) | batch | ceil(15 \* count^0.8) |
| <a href="../data-api/stats/get-defi-v3-token-market-data"><code>GET /defi/v3/token/market-data</code></a> | Token - Market Data (Single) | fixed | 8 CU |
| <a href="../data-api/stats/get-defi-v3-token-market-data-multiple"><code>GET /defi/v3/token/market-data/multiple</code></a> | Token - Market Data (Multiple) | batch | ceil(8 \* count^0.8) |
| <a href="../data-api/stats/get-defi-v3-token-meta-data-multiple"><code>GET /defi/v3/token/meta-data/multiple</code></a> | Token - Metadata (Multiple) | batch | ceil(3 \* count^0.8) |
| <a href="../data-api/stats/get-defi-v3-token-meta-data-single"><code>GET /defi/v3/token/meta-data/single</code></a> | Token - Metadata (Single) | fixed | 3 CU |
| <a href="../data-api/stats/get-defi-v3-token-trade-data-multiple"><code>GET /defi/v3/token/trade-data/multiple</code></a> | Token - Trade Data (Multiple) | batch | ceil(10 \* count^0.8) |
| <a href="../data-api/stats/get-defi-v3-token-trade-data-single"><code>GET /defi/v3/token/trade-data/single</code></a> | Token - Trade Data (Single) | fixed | 10 CU |

## Birdeye Data API / Token/Market List

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../data-api/tokenmarket-list/get-defi-tokenlist"><code>GET /defi/tokenlist</code></a> | Token - List (V1) | fixed | 30 CU |
| <a href="../data-api/tokenmarket-list/get-defi-v2-markets"><code>GET /defi/v2/markets</code></a> | Token - All Market List | fixed | 20 CU |
| <a href="../data-api/tokenmarket-list/get-defi-v2-tokens-new-listing"><code>GET /defi/v2/tokens/new\_listing</code></a> | Token - New listing | fixed | 20 CU |
| <a href="../data-api/tokenmarket-list/get-defi-v3-token-list"><code>GET /defi/v3/token/list</code></a> | Token - List (V3) | fixed | 50 CU |
| <a href="../data-api/tokenmarket-list/get-defi-v3-token-list-scroll"><code>GET /defi/v3/token/list/scroll</code></a> | Token - List (V3) Scroll | fixed | 300 CU |

## Birdeye Data API / Transactions

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../data-api/transactions/get-defi-txs-pair"><code>GET /defi/txs/pair</code></a> | Trades - Pair | fixed | 10 CU |
| <a href="../data-api/transactions/get-defi-txs-pair-seek-by-time"><code>GET /defi/txs/pair/seek\_by\_time</code></a> | Trades - Pair Seek By Time | fixed | 10 CU |
| <a href="../data-api/transactions/get-defi-txs-token"><code>GET /defi/txs/token</code></a> | Trades - Token | fixed | 10 CU |
| <a href="../data-api/transactions/get-defi-txs-token-seek-by-time"><code>GET /defi/txs/token/seek\_by\_time</code></a> | Trades - Token Seek By Time | fixed | 10 CU |
| <a href="../data-api/transactions/get-defi-v3-token-mint-burn-txs"><code>GET /defi/v3/token/mint-burn-txs</code></a> | Token - Mint/Burn | fixed | 15 CU |
| <a href="../data-api/transactions/get-defi-v3-token-txs"><code>GET /defi/v3/token/txs</code></a> | Trades - Token (V3) | fixed | 12 CU |
| <a href="../data-api/transactions/get-defi-v3-token-txs-by-volume"><code>GET /defi/v3/token/txs-by-volume</code></a> | Trades - Token Filtered By Volume (V3) | dynamic | \<=100: 40 CU; \<=200: 80 CU; \<=500: 200 CU |
| <a href="../data-api/transactions/get-defi-v3-txs"><code>GET /defi/v3/txs</code></a> | Trades - All (V3) | fixed | 12 CU |
| <a href="../data-api/transactions/get-defi-v3-txs-recent"><code>GET /defi/v3/txs/recent</code></a> | Trades - Recent (V3) | dynamic | \<=100: 12 CU; \<=300: 30 CU; \<=500: 50 CU |
| <a href="../data-api/transactions/get-trader-txs-seek-by-time"><code>GET /trader/txs/seek\_by\_time</code></a> | Trader - Trades Seek By Time | fixed | 10 CU |

## Birdeye Data API / Wallet, Networth & PnL


| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../data-api/wallet-networth-pnl/get-defi-v2-tokens-top-traders"><code>GET /defi/v2/tokens/top\_traders</code></a> | Token - Top traders | fixed | 25 CU |
| <a href="../data-api/wallet-networth-pnl/get-trader-gainers-losers"><code>GET /trader/gainers-losers</code></a> | Trader - Gainers/Losers | fixed | 25 CU |
| <a href="../data-api/wallet-networth-pnl/get-v1-wallet-list-supported-chain"><code>GET /v1/wallet/list\_supported\_chain</code></a> | Wallet Supported Networks | fixed | 1 CU |
| <a href="../data-api/wallet-networth-pnl/get-v1-wallet-token-list"><code>GET /v1/wallet/token\_list</code></a> | Wallet Portfolio (Beta) | fixed | 50 CU |
| <a href="../data-api/wallet-networth-pnl/get-v1-wallet-tx-list"><code>GET /v1/wallet/tx\_list</code></a> | Wallet - Transaction History (Beta) | fixed | 50 CU |
| <a href="../data-api/wallet-networth-pnl/get-wallet-v2-current-net-worth"><code>GET /wallet/v2/current-net-worth</code></a> | Wallet - Portfolio (V2) | fixed | 20 CU |
| <a href="../data-api/wallet-networth-pnl/get-wallet-v2-leaderboard"><code>GET /wallet/v2/leaderboard</code></a> | Wallet - Leaderboard | fixed | 25 CU |
| <a href="../data-api/wallet-networth-pnl/get-wallet-v2-net-worth"><code>GET /wallet/v2/net-worth</code></a> | Wallet - Net Worth Chart | fixed | 50 CU |
| <a href="../data-api/wallet-networth-pnl/get-wallet-v2-net-worth-details"><code>GET /wallet/v2/net-worth-details</code></a> | Wallet - Net Worth Details | fixed | 40 CU |
| <a href="../data-api/wallet-networth-pnl/post-wallet-v2-net-worth-summary-multiple"><code>POST /wallet/v2/net-worth-summary/multiple</code></a> | Wallet - Current Net Worth Summary (Multiple) | batch | ceil(20 \* count^0.8) |
| <a href="../data-api/wallet-networth-pnl/get-wallet-v2-pnl"><code>GET /wallet/v2/pnl</code></a> | Wallet - PnL (Per Token) | batch | ceil(10 \* count^0.8) |
| <a href="../data-api/wallet-networth-pnl/get-wallet-v2-pnl-chart"><code>GET /wallet/v2/pnl/chart</code></a> | Wallet - PnL Chart | fixed | 30 CU |
| <a href="../data-api/wallet-networth-pnl/post-wallet-v2-pnl-details"><code>POST /wallet/v2/pnl/details</code></a> | Wallet - PnL Details | fixed | 30 CU |
| <a href="../data-api/wallet-networth-pnl/get-wallet-v2-pnl-multiple"><code>GET /wallet/v2/pnl/multiple</code></a> | Wallet - PnL (Per Wallet) | batch | ceil(10 \* count^0.8) |
| <a href="../data-api/wallet-networth-pnl/get-wallet-v2-pnl-summary"><code>GET /wallet/v2/pnl/summary</code></a> | Wallet - PnL | fixed | 20 CU |
| <a href="../data-api/wallet-networth-pnl/get-wallet-v2-funded-by"><code>GET /wallet/v2/funded-by</code></a> | Wallet - Funded By | fixed | 30 CU |
| <a href="../data-api/wallet-networth-pnl/post-wallet-v2-tx-first-funded"><code>POST /wallet/v2/tx/first-funded</code></a> | Wallet - First Tx Funded | batch | ceil(40 \* wallet\_count^0.8) |

## Birdeye Data API / Balance & Transfer

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../data-api/balance-transfer/post-token-v1-transfer"><code>POST /token/v1/transfer</code></a> | Token - Transfer List | fixed | 8 CU |
| <a href="../data-api/balance-transfer/post-token-v1-transfer-total"><code>POST /token/v1/transfer/total</code></a> | Token - Transfer Total | fixed | 1 CU |
| <a href="../data-api/balance-transfer/get-v1-wallet-token-balance"><code>GET /v1/wallet/token\_balance</code></a> | Wallet - Token Balance (Beta) | fixed | 20 CU |
| <a href="../data-api/balance-transfer/get-wallet-v2-balance-change"><code>GET /wallet/v2/balance-change</code></a> | Wallet - Balance Change | fixed | 8 CU |
| <a href="../data-api/balance-transfer/post-wallet-v2-token-balance"><code>POST /wallet/v2/token-balance</code></a> | Wallet - Tokens Balance | batch | ceil(10 \* token\_count^0.8) |
| <a href="../data-api/balance-transfer/post-wallet-v2-transfer"><code>POST /wallet/v2/transfer</code></a> | Wallet - Transfer | fixed | 8 CU |
| <a href="../data-api/balance-transfer/post-wallet-v2-transfer-total"><code>POST /wallet/v2/transfer/total</code></a> | Wallet - Transfer total | fixed | 1 CU |

## Birdeye Data API / Holder

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../data-api/holder/get-defi-v3-token-holder"><code>GET /defi/v3/token/holder</code></a> | Token - Holder | fixed | 30 CU |
| <a href="../data-api/holder/get-holder-v1-distribution"><code>GET /holder/v1/distribution</code></a> | Token - Holder Distribution | fixed | 30 CU |
| <a href="../data-api/holder/get-token-v1-chart-tag-holdings"><code>GET /token/v1/chart/tag-holdings</code></a> | Token - Tag Holdings Chart | fixed | 20 CU |
| <a href="../data-api/holder/get-token-v1-first-buyers"><code>GET /token/v1/first-buyers</code></a> | Token - First Buyers | fixed | 25 CU |
| <a href="../data-api/holder/get-token-v1-holder-positions"><code>GET /token/v1/holder-positions</code></a> | Token - Holder Positions | fixed | 25 CU |
| <a href="../data-api/holder/get-token-v1-holder-profile"><code>GET /token/v1/holder-profile</code></a> | Token - Holder Profile | fixed | 25 CU |
| <a href="../data-api/holder/post-token-v1-holder-batch"><code>POST /token/v1/holder/batch</code></a> | Token - Holder (Batch) | batch | ceil(30 \* wallet\_count^0.8) |
| <a href="../data-api/holder/get-token-v1-holder-chart"><code>GET /token/v1/holder/chart</code></a> | Token - Holder Chart | fixed | 25 CU |
| <a href="../data-api/holder/get-token-v1-wallet-tags-tracker"><code>GET /token/v1/wallet-tags-tracker</code></a> | Token - Wallet Tags Tracker | fixed | 30 CU |
| <a href="../data-api/holder/get-token-v1-wallet-tags-tracker-details"><code>GET /token/v1/wallet-tags-tracker/details</code></a> | Token - Wallet Tags Tracker Details | fixed | 30 CU |

## Birdeye Data API / Alltime & History

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../data-api/alltime-history/post-defi-v3-all-time-trades-multiple"><code>POST /defi/v3/all-time/trades/multiple</code></a> | All Time Trades (Multiple) | batch | ceil(10 \* count^0.8) |
| <a href="../data-api/alltime-history/get-defi-v3-all-time-trades-single"><code>GET /defi/v3/all-time/trades/single</code></a> | All Time Trades (Single) | fixed | 10 CU |

## Birdeye Data API / Blockchain

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../data-api/blockchain/get-defi-networks"><code>GET /defi/networks</code></a> | Supported Networks | fixed | 1 CU |
| <a href="../data-api/blockchain/get-defi-v3-txs-latest-block"><code>GET /defi/v3/txs/latest-block</code></a> | Trades - Latest Block Number | fixed | 1 CU |

## Birdeye Data API / Creation & Trending

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../data-api/creation-trending/get-defi-token-creation-info"><code>GET /defi/token\_creation\_info</code></a> | Token - Creation Token Info | fixed | 30 CU |
| <a href="../data-api/creation-trending/get-defi-token-trending"><code>GET /defi/token\_trending</code></a> | Token - Trending List | fixed | 25 CU |

## Birdeye Data API / Meme

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../data-api/meme/get-defi-v3-token-meme-detail-single"><code>GET /defi/v3/token/meme/detail/single</code></a> | Meme Token Detail - Single | fixed | 15 CU |
| <a href="../data-api/meme/get-defi-v3-token-meme-list"><code>GET /defi/v3/token/meme/list</code></a> | Meme Token - List | fixed | 30 CU |

## Birdeye Data API / Security

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../data-api/security/get-defi-token-security"><code>GET /defi/token\_security</code></a> | Token - Security | fixed | 25 CU |

## Birdeye Data API / Search & Utils

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../data-api/search-utils/get-defi-v3-search"><code>GET /defi/v3/search</code></a> | Search - Token, market Data | fixed | 20 CU |
| <a href="../data-api/search-utils/get-utils-v1-credits"><code>GET /utils/v1/credits</code></a> | Utils - Credits Usage of current account | fixed | 1 CU |

## Birdeye Data API / Smart Money

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../data-api/smart-money/get-smart-money-v1-token-list"><code>GET /smart-money/v1/token/list</code></a> | Smart Money - Token List | fixed | 20 CU |
| <a href="../data-api/smart-money/post-defi-v3-token-money-flow"><code>POST /defi/v3/token/money-flow</code></a> | Token Money Flow | fixed | 10 CU |

## Birdeye Data API / Global Fees Paid

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../data-api/global-fees-paid/get-defi-v3-token-fee-multiple"><code>GET /defi/v3/token/fee/multiple</code></a> | Token - Fee (Multiple) | batch | ceil(3 \* count^0.8) |
| <a href="../data-api/global-fees-paid/get-defi-v3-token-fee-single"><code>GET /defi/v3/token/fee/single</code></a> | Token - Fee (Single) | fixed | 3 CU |

## Birdeye Data API / DEX & Protocol

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../data-api/dex-protocol/get-market-v1-blockchain-metrics"><code>GET /market/v1/blockchain-metrics</code></a> | Blockchain Market Metrics | fixed | 40 CU |

## Birdeye Data API / Wallet Identity

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../data-api/wallet-identity/get-identity-v1-domains"><code>GET /identity/v1/domains</code></a> | Wallet Identity - Domains | fixed | 5 CU |
| <a href="../data-api/wallet-identity/post-identity-v1-multiple"><code>POST /identity/v1/multiple</code></a> | Wallet Identity - Multiple | batch | ceil(30 \* count^0.8) |
| <a href="../data-api/wallet-identity/get-identity-v1-single"><code>GET /identity/v1/single</code></a> | Wallet Identity - Single | fixed | 30 CU |

## Blockchain Data API / Account

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../blockchain-api/account/get-blockchain-v1-account-detail"><code>GET /blockchain/v1/account/detail</code></a> | Blockchain - Account Detail | fixed | 5 CU |
| <a href="../blockchain-api/account/post-blockchain-v1-account-detail-multiple"><code>POST /blockchain/v1/account/detail/multiple</code></a> | Blockchain - Multiple Account Details | batch | ceil(5 \* address\_count^0.5) |
| <a href="../blockchain-api/account/get-blockchain-v1-account-token-accounts"><code>GET /blockchain/v1/account/token-accounts</code></a> | Blockchain - Token Accounts | fixed | 2 CU |

## Blockchain Data API / Token

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../blockchain-api/token/get-blockchain-v1-token-metadata"><code>GET /blockchain/v1/token/metadata</code></a> | Blockchain - Token Metadata | fixed | 5 CU |
| <a href="../blockchain-api/token/post-blockchain-v1-token-metadata-multiple"><code>POST /blockchain/v1/token/metadata/multiple</code></a> | Blockchain - Multiple Token Metadata | batch | ceil(5 \* token\_count^0.5) |

## Blockchain Data API / Transaction

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../blockchain-api/transaction/get-blockchain-v1-transaction-detail"><code>GET /blockchain/v1/transaction/detail</code></a> | Blockchain - Transaction Detail | fixed | 10 CU |

## Perps Data API / Perps Token

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../perps-api/perps-token/get-perps-v1-token-liquidation-map"><code>GET /perps/v1/token/liquidation\_map</code></a> | Perps Token Liquidation Map | fixed | 20 CU |
| <a href="../perps-api/perps-token/get-perps-v1-token-list"><code>GET /perps/v1/token/list</code></a> | Perps Token List | fixed | 10 CU |
| <a href="../perps-api/perps-token/get-perps-v1-token-open-positions"><code>GET /perps/v1/token/open\_positions</code></a> | Perps Token Open Positions | fixed | 10 CU |
| <a href="../perps-api/perps-token/get-perps-v1-token-overview"><code>GET /perps/v1/token/overview</code></a> | Perps Token Overview | fixed | 5 CU |

## Perps Data API / Perps Wallet

| Endpoint | Summary | CU model | CU rule |
| :-- | :-- | :-- | :-- |
| <a href="../perps-api/perps-wallet/get-perps-v1-wallet-list"><code>GET /perps/v1/wallet/list</code></a> | Perps Wallet List | fixed | 10 CU |
| <a href="../perps-api/perps-wallet/get-perps-v1-wallet-open-positions"><code>GET /perps/v1/wallet/open\_positions</code></a> | Perps Wallet Open Positions | fixed | 5 CU |
| <a href="../perps-api/perps-wallet/get-perps-v1-wallet-overview"><code>GET /perps/v1/wallet/overview</code></a> | Perps Wallet Overview | fixed | 5 CU |
| <a href="../perps-api/perps-wallet/post-perps-v1-wallet-trade-fills"><code>POST /perps/v1/wallet/trade_fills</code></a> | Perps Wallet Trade Fills | fixed | 5 CU |
| <a href="../perps-api/perps-wallet/post-perps-v1-wallet-transfers"><code>POST /perps/v1/wallet/transfers</code></a> | Perps Wallet Transfers | fixed | 5 CU |

<br />

## Websocket

Websocket subscriptions are billed by bytes (CUPB). Use these values as the per-byte pricing reference:

- [SUBSCRIBE_PRICE (OHLCV)](/websockets/subscribe-price-ohlcv) and [SUBSCRIBE_BASE_QUOTE_PRICE](/websockets/base-quote-ohlcv) - `0.0015`
- [SUBSCRIBE_TXS](/websockets/tokenpair-transactions) - `0.00015`
- [SUBSCRIBE_TOKEN_NEW_LISTING](/websockets/new-token-listing) - `0.04`
- [SUBSCRIBE_NEW_PAIR](/websockets/new-pair) - `0.03`
- [SUBSCRIBE_LARGE_TRADE_TXS](/websockets/track-large-transactions) - `0.005`
- [SUBSCRIBE_WALLET_TXS](/websockets/wallet-transactions) - `0.002`
- [SUBSCRIBE_TOKEN_STATS](/websockets/token-stats) - `0.002`
- [SUBCRIBE_MEME](/websockets/meme-stats) - `0.001`
- [SUBCRIBE_TRANSFER](/websockets/transfer) - `0.0002`
