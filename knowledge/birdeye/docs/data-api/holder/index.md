---
title: Holder
deprecated: false
hidden: false
metadata:
  robots: index
---
# Holder

This group covers token-holder analysis, holder distribution, tagged-wallet behavior, first-buyer cohorts, and wallet-level position breakdowns for token research and post-launch monitoring.

Use this group when you need:

- current top holders for a token
- token-account or wallet-mode holder views
- supply concentration and distribution bands
- tagged holder breakdowns such as dev, sniper, insider, bundler, smart trader, and kol
- holder-count and tag-holdings time series
- earliest buyer cohorts and their current conviction
- wallet-level token positions filtered by holder tags
- bucketed trading activity from tagged wallets over time

## Which endpoint should I use?

| If you need...                                             | Use this endpoint                  |
| ---------------------------------------------------------- | ---------------------------------- |
| Current top holders for one token                          | `Token - Holder`                   |
| Holder balances for many wallets in one request            | `Token - Holder (Batch)`           |
| Supply distribution by holder percentage bands             | `Token - Holder Distribution`      |
| Holder summary and tagged-holder mix for one token         | `Token - Holder Profile`           |
| Paginated wallet positions for a token                     | `Token - Holder Positions`         |
| Holder-count trend over time                               | `Token - Holder Chart`             |
| Time series of holdings by holder tag                      | `Token - Tag Holdings Chart`       |
| Earliest buyers and whether they still hold or sold        | `Token - First Buyers`             |
| Aggregated trading activity from tagged wallets by bucket  | `Token - Wallet Tags Tracker`      |
| Exact tagged wallets active inside a tracker time bucket   | `Token - Wallet Tags Tracker Details` |

## Notes

- This folder is mixed, but many of the deepest holder-behavior endpoints are Solana-focused, especially the tagged-wallet and first-buyer surfaces.
- `Token - Holder` supports different holder views: default token-account mode and wallet-grouped mode when you need owner-level aggregation.
- Tagged-holder endpoints are best used together: `Token - Holder Profile` for the summary, `Token - Holder Positions` for wallet rows, and `Token - Wallet Tags Tracker` for time-series behavior.
- Distribution and holder-count endpoints are better for concentration and adoption analysis, while first-buyer and tag-tracker endpoints are better for launch forensics and insider behavior.
- Holder data changes with trading activity and transfers, so cache carefully and poll with discipline for dashboards that refresh frequently.

## Typical workflow

1. Start with `Token - Holder Profile` or `Token - Holder` to understand the current holder base.
2. Add `Token - Holder Distribution` and `Token - Holder Chart` to measure concentration and holder growth over time.
3. Use `Token - Holder Positions`, `Token - First Buyers`, and `Token - Wallet Tags Tracker` when you need to explain who accumulated, who sold, and which tagged cohorts drove the move.
