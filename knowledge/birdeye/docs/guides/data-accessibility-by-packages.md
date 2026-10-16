---
title: "Data Accessibility by Packages"
description: ""
metadata:
  robots: "index"
next:

icon: "badge-check"
---

Effective from: 26-Nov-2025

# Accessibility table

| API Name | Endpoint | Standard | Lite/Starter | Premium | Business / Enterprise | Supported chain |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| **price \+ ohlcv** |  |  |  |  |  |  |
| Defi - Historical Price Unix | `/defi/historical_price_unix` | x | x | x | x | only solana |
| Defi - Price Volume (multiple) | `/defi/price_volume/multi` |  | x | x | x | all |
| Defi - Price Volume (single) | `/defi/price_volume/single` | x | x | x | x | all |
| OHLCV | `/defi/ohlcv` | x | x | x | x | all |
| OHLCV - Base/Quote | `/defi/ohlcv/base_quote` | x | x | x | x | all |
| OHLCV - Pair | `/defi/ohlcv/pair` | x | x | x | x | all |
| Price | `/defi/price` | x | x | x | x | all |
| Price - Historical | `/defi/history_price` | x | x | x | x | all |
| Price - Multiple | `/defi/multi_price` |  | x | x | x | all |
| defi v3 ohlcv | `/defi/v3/ohlcv` | x | x | x | x |  |
| defi v3 ohlcv pair | `/defi/v3/ohlcv/pair` | x | x | x | x |  |
| **stats** |  |  |  |  |  |  |
| Pair - Overview (Multiple) | `/defi/v3/pair/overview/multiple` |  |  |  | x | only solana |
| Pair - Overview (Single) | `/defi/v3/pair/overview/single` | x | x | x | x | only solana |
| Token - Market Data | `/defi/v3/token/market-data` | x | x | x | x | all |
| Token - Market Data (Multiple) | `/defi/v3/token/market-data/multiple` |  |  |  | x | all |
| Token - Meta Data (Multiple) | `/defi/v3/token/meta-data/multiple` |  |  | x | x | all |
| Token - Meta Data (Single) | `/defi/v3/token/meta-data/single` |  | x | x | x | all |
| Token - Trading Data (Multiple) | `/defi/v3/token/trade-data/multiple` |  |  |  | x | all |
| Token - Trading Data (Single) | `/defi/v3/token/trade-data/single` |  | x | x | x |  |
| Token Overview | `/defi/token_overview` | x | x | x | x | all |
| price stats multiple | `/defi/v3/price/stats/multiple` |  |  |  | x |  |
| price stats single | `/defi/v3/price/stats/single` | x | x | x | x |  |
| token exit liquidity | `/defi/v3/token/exit-liquidity` | x | x | x | x |  |
| token exit liquidity multiple | `/defi/v3/token/exit-liquidity/multiple` |  |  |  | x |  |
| **token/market list** |  |  |  |  |  |  |
| Token - List (V3) | `/defi/v3/token/list` | x | x | x | x | only solana. other soon |
| Token - List (V3) Scroll | `/defi/v3/token/list/scroll` |  |  |  | x | only solana. other soon |
| Token - Market list | `/defi/v2/markets` | x | x | x | x | all |
| Token - New Listing | `/defi/v2/tokens/new_listing` | x | x | x | x | not sui |
| Token List | `/defi/tokenlist` | x | x | x | x | all |
| Token list - All | `/defi/v2/tokens/all` |  |  |  | x | all |
| **txs** |  |  |  |  |  |  |
| Token - Mint/ Burn | `/defi/v3/token/mint-burn-txs` | x | x | x | x | only solana |
| Trader - Trades Seek By Time | `/trader/txs/seek_by_time` | x | x | x | x | all |
| Trades - Pair Seek By Time | `/defi/txs/pair/seek_by_time` |  | x | x | x | all |
| Trades - Token (V3) | `/defi/v3/token/txs` | x | x | x | x | all |
| Trades - Token Seek By Time | `/defi/txs/token/seek_by_time` |  | x | x | x | all |
| Trades - by Pair | `/defi/txs/pair` | x | x | x | x | all |
| Trades - by Token | `/defi/txs/token` | x | x | x | x | all |
| txs | `/defi/v3/txs` | x | x | x | x |  |
| txs recent | `/defi/v3/txs/recent` | x | x | x | x |  |
| txs by volume | `/defi/v3/token/txs-by-volume` |  | x | x | x |  |
| **wallet \+ networth \+ pnl** |  |  |  |  |  |  |
| Net Worth - Chart | `/wallet/v2/net-worth` | x | x | x | x | only solana |
| Token - Top traders | `/defi/v2/tokens/top_traders` | x | x | x | x | all |
| Trader - Gainers Losers | `/trader/gainers-losers` | x | x | x | x | all |
| Transaction Simulation | `/v1/wallet/simulate` |  | x | x | x | not sui |
| Supported Networks | `/v1/wallet/list_supported_chain` | x | x | x | x | all |
| Wallet - Transaction History (short) | `/wallet/tx_list` |  | x | x | x | all |
| Wallet Portfolio | `/v1/wallet/token_list` |  | x | x | x | only solana |
| Wallet Transaction History | `/v1/wallet/tx_list` |  | x | x | x | only solana |
| Wallet v2 Current Net Worth | `/wallet/v2/current-net-worth` | x | x | x | x | only solana |
| Wallet v2 First Funded TX | `/wallet/v2/tx/first-funded` |  | x | x | x | only solana |
| Wallet v2 Funded By | `/wallet/v2/funded-by` |  | x | x | x | only solana |
| Wallet v2 Net Worth Details | `/wallet/v2/net-worth-details` | x | x | x | x | only solana |
| Wallet v2 Net Worth Summary (Multiple) | `/wallet/v2/net-worth-summary/multiple` |  |  |  | x | only solana |
| Wallet v2 PNL | `/wallet/v2/pnl` | x | x | x | x | only solana |
| Wallet v2 PNL Details | `/wallet/v2/pnl/details` | x | x | x | x | only solana |
| Wallet v2 PNL Multiple | `/wallet/v2/pnl/multiple` |  |  |  | x | only solana |
| Wallet v2 PNL Summary | `/wallet/v2/pnl/summary` | x | x | x | x | only solana |
| **holder** |  |  |  |  |  |  |
| Token - Holder distribution | `/holder/v1/distribution` | x | x | x | x | only solana |
| Token - Holder | `/defi/v3/token/holder` | x | x | x | x | only solana |
| Token Holder Batch | `/token/v1/holder/batch` |  |  |  | x | only solana |
| **balance-transfer** |  |  |  |  |  |  |
| Wallet - Token Balance | `/v1/wallet/token_balance` |  | x | x | x | only solana |
| Wallet v2 Token Balance | `/wallet/v2/token-balance` | x | x | x | x | only solana |
| wallet v2 balance change | `/wallet/v2/balance-change` | x | x | x | x | only solana |
| Token - Transfer | `/token/v1/transfer` | x | x | x | x | only solana |
| Token - Transfer (total count) | `/token/v1/transfer/total` | x | x | x | x | only solana |
| Wallet - Transfer | `/wallet/v2/transfer` | x | x | x | x | only solana |
| Wallet - Transfer (total count) | `/wallet/v2/transfer/total` | x | x | x | x | only solana |
| **Alltime-history** |  |  |  |  |  |  |
| Alltime - Trades (Multiple) | `/defi/v3/all-time/trades/multiple` |  |  |  | x | all |
| Alltime - Trades (Single) | `/defi/v3/all-time/trades/single` | x | x | x | x | all |
| **Blockchain** |  |  |  |  |  |  |
| Supported Networks (defi) | `/defi/networks` | x | x | x | x | all |
| Trades - Latest Block Number | `/defi/v3/txs/latest-block` | x | x | x | x | only solana |
| **Creation/ Trending** |  |  |  |  |  |  |
| Token - Creation Info | `/defi/token_creation_info` |  | x | x | x | only solana |
| Token - Trending | `/defi/token_trending` | x | x | x | x | all |
| **Meme** |  |  |  |  |  |  |
| Token Meme Detail (Single) | `/defi/v3/token/meme/detail/single` | x | x | x | x |  |
| Token Meme List | `/defi/v3/token/meme/list` | x | x | x | x |  |
| **Search & Utils** |  |  |  |  |  |  |
| Token - Search | `/defi/v3/search` | x | x | x | x | all |
| Utils Credits | `/utils/v1/credits` | x | x | x | x |  |
| **Smart Money** |  |  |  |  |  |  |
| Smart Money - Token List | `/smart-money/v1/token/list` |  | x | x | x | all |
| Token Money Flow | `/defi/v3/token/money-flow` |  | x | x | x | Solana only |
| **Security** |  |  |  |  |  |  |
| Token - Security | `/defi/token_security` |  | x | x | x | not sui |
| **Identity API** |  |  |  |  |  |  |
| Wallet Identity - Single | `/identity/v1/single` |  | x | x | x | solana |
| Wallet Identity - Multiple | `identity/v1/multiple` |  |  | x | x | solana |
| Wallet Identity - Domains | `identity/v1/domains` |  | x | x | x | solana |
| **Blockchain API** |  |  |  |  |  |  |
| Blockchain - Account Detail | `blockchain/v1/account/detail` | x | x | x | x | solana |
| Blockchain - Multiple Account Details | `blockchain/v1/account/detail/multiple` |  |  | x | x |  |
| Blockchain - Token Accounts | `blockchain/v1/account/token` | x | x | x | x |  |
| Blockchain - Token Metadata | `blockchain/v1/token/metadata` | x | x | x | x |  |
| Blockchain - Multiple Token Metadata | `blockchain/v1/token/metadata/multiple` |  |  | x | x |  |
| Blockchain - Transaction Detail | `blockchain/v1/transaction/detail` | x | x | x | x |  |
| **Websockets** |  |  |  |  |  |  |
| Token Price | SUBSCRIBE\_PRICE (OHLCV) |  |  | x | x |  |
| Token Transaction | SUBSCRIBE\_TXS |  |  | x | x |  |
| Pair Price | SUBSCRIBE\_BASE\_QUOTE\_PRICE |  |  | x | x |  |
| New Token Listing | SUBSCRIBE\_TOKEN\_NEW\_LISTING |  |  | x | x |  |
| New Pair | SUBSCRIBE\_NEW\_PAIR |  |  | x | x |  |
| Track Large Transaction | SUBSCRIBE\_LARGE\_TRADE\_TXS |  |  | x | x |  |
| Wallet Transaction | SUBSCRIBE\_WALLET\_TXS |  |  | x | x |  |
| Token Stats | SUBSCRIBE\_TOKEN\_STATS |  |  | x | x |  |

<br />

**Quick Notes**

- All wallet APIs are currently in beta and support a low rate limit across all packages (limited to 5 requests per second and 75 requests per minute for all wallet products).
- The LITE/ STARTER package can only access the multiple price API; all other "multiple" APIs are not accessible.
- Blockchain multiple endpoints are available from Starter and higher packages; they are not included in Lite.
- All other batch, multi/ multiple APIs are available exclusively for the BUSINESS package and higher.
- Max Usage Per Month defines the maximum allowable usage for the package each month is 5 times of the included amount. If the auto-renewal for max usage is not activated, the user will be immediately suspended upon reaching the limit. To continue, the user must manually re-subscribe to the current package or upgrade to a higher package. Users can also enable the auto-renewal feature via the dashboard for uninterrupted data usage. This is essential to keep you informed of high usage and prevent unexpected payments.
