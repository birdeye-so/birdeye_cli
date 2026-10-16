---
title: Perps Data API
hidden: false
---

# Perps Data API

The Perps Data API group covers perpetual-market token screens, liquidation context, open interest positioning, and wallet-level perp exposure.

Use this group when you need:

- perp token discovery and overview data
- open-position and liquidation-map context
- wallet-level perp exposure views
- fast derivatives analytics without mixing spot-market endpoints

## Which section should I start with?

| If you need... | Start here |
| --- | --- |
| Perp market overview, token lists, and token-side positioning | `Perps Token` |
| Wallet exposure, open positions, and wallet-level perp snapshots | `Perps Wallet` |

## Notes

- Perps endpoints are distinct from spot token analytics and should be modeled separately in dashboards and internal schemas.
- Use token-side endpoints for market structure, and wallet-side endpoints for participant attribution.
- Pair this group with spot `Price & OHLCV` only when you intentionally want cross-market context.

## Typical workflow

1. Start with `Perps Token` to identify the market and its positioning profile.
2. Move to `Perps Wallet` to inspect who is carrying exposure and how concentrated that exposure is.
3. Join with spot market or wallet intelligence data only when you need a wider cross-product view.
