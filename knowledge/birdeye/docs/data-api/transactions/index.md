---
title: Transactions
deprecated: false
hidden: false
metadata:
  robots: index
---

# Transactions

The Transactions group is the raw event layer for trade-level activity across tokens, pairs, wallets, and chains.

Use this group when you need:
- per-trade event streams instead of aggregated candles or stats
- token-specific or pair-specific trade history
- chain-wide recent trades
- time-bounded backfills
- large-trade filtering
- mint and burn event history

## Which endpoint should I use?

| If you need... | Use this endpoint |
| --- | --- |
| Recent trades for one token | `Trades - Token` |
| Recent trades for one pair | `Trades - Pair` |
| Time-bounded trades for one token | `Trades - Token Seek By Time` |
| Time-bounded trades for one pair | `Trades - Pair Seek By Time` |
| Filtered chain-wide V3 trade feed | `Trades - All (V3)` |
| Latest chain-wide V3 trades | `Trades - Recent (V3)` |
| Filtered V3 trades for one token | `Trades - Token (V3)` |
| Large token trades only | `Trades - Token Filtered By Volume (V3)` |
| Token mint and burn events | `Token - Mint/Burn` |
| Time-bounded trades for one trader wallet | `Trader - Trades Seek By Time` |

## Notes

- Use legacy token or pair trade endpoints for simple pagination and straightforward activity views.
- Use `seek_by_time` endpoints when you need incremental syncs or bounded time windows.
- Use V3 trade endpoints when you need richer filters such as owner, source, pool, block-number ranges, or token-side `buy` and `sell`.
- Use `Trades - Recent (V3)` for the freshest feed and `Trades - All (V3)` when you need a filtered archive.
- Use `Trades - Token Filtered By Volume (V3)` when you only care about larger prints.

## Typical workflow

1. Start with `Trades - Recent (V3)` or `Trades - Token (V3)` to inspect current activity.
2. Switch to `seek_by_time` or `Trades - All (V3)` for bounded backfills.
3. Add price, holder, liquidity, or wallet analysis endpoints to explain who traded and what changed after the trade flow.
