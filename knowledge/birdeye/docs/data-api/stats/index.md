---
title: Stats & Market Data
excerpt: >-
  The Stats group is the fastest way to turn a token or pair address into usable
  market data context
deprecated: false
hidden: false
metadata:
  robots: index
---
The Stats group is the fastest way to turn a token or pair address into usable market context.

It covers:

- token overview snapshots
- market data
- token metadata
- market fundamentals
- trading activity
- exit liquidity
- pair-level market overviews
- lightweight price statistics across multiple timeframes

## Which endpoint should I use?

| If you need...                                                                | Use this endpoint                 |
| ----------------------------------------------------------------------------- | --------------------------------- |
| One all-in-one token snapshot                                                 | `Token - Overview`                |
| Name, symbol, decimals, logo, and metadata for one token                      | `Token - Metadata (Single)`       |
| Metadata for many tokens at once                                              | `Token - Metadata (Multiple)`     |
| Liquidity, FDV, market cap, supply, and holder count for one token            | `Token - Market Data (Single)`    |
| Market data fundamentals for many tokens                                      | `Token - Market Data (Multiple)`  |
| Volume, trades, wallets, buy/sell activity, and timeframe stats for one token | `Token - Trade Data (Single)`     |
| Trade-activity stats for many tokens                                          | `Token - Trade Data (Multiple)`   |
| Exit liquidity estimate for one Base token                                    | `Token - Liquidity (Single)`      |
| Exit liquidity estimates for many Base tokens                                 | `Token - Liquidity (Multiple)`    |
| Pool-level market view for one pair                                           | `Pair - Pair Overview (Single)`   |
| Pool-level market view for many pairs                                         | `Pair - Pair Overview (Multiple)` |
| Lightweight price movement stats for one token                                | `Price Stats (Single)`            |
| Lightweight price movement stats for many tokens                              | `Price Stats (Multiple)`          |

## Notes

- `Token - Overview` is the best starting point when you want one broad token snapshot.
- Use `Metadata` endpoints when you only need identity fields and want the lightest response.
- Use `Market Data` when you need fundamentals without the heavier overview payload.
- Use `Trade Data` when you need timeframe-based activity and buy/sell behavior.
- Use `Pair Overview` for pool-level analysis instead of token-level analysis.
- Batch limits differ by endpoint, so check each page's `Usage Note` before sending large requests.
- On Solana, some endpoints support `ui_amount_mode` for Token-2022 scaled UI amounts.

## Typical workflow

1. Load `Token - Metadata` to hydrate names, symbols, decimals, and logos.
2. Load `Token - Market Data` or `Token - Overview` for valuation and liquidity context.
3. Load `Token - Trade Data` or `Price Stats` for recent momentum and activity.
4. Add `Exit Liquidity` or `Pair Overview` when execution quality or pool structure matters.
