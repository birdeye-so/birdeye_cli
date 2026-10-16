---
title: Perps Token
hidden: false
---

# Perps Token

This section covers perp-market token discovery, token overviews, liquidation maps, and token-level open-position context.

Use this section when you need:

- supported perp trading tokens
- token-level perp market snapshots
- open-position concentration by token
- liquidation-map context for derivatives monitoring

## Which endpoint should I use?

| If you need... | Use this endpoint |
| --- | --- |
| Supported perp tokens | `Perps Token List` |
| One token overview for a perp market | `Perps Token Overview` |
| Open positions for one perp token | `Perps Token Open Positions` |
| Liquidation map context for one perp token | `Perps Token Liquidation Map` |

## Notes

- Use this section for market-level perp analysis, not wallet attribution.
- `Open Positions` and `Liquidation Map` are the fastest way to move from price action into derivatives positioning context.
- Pair these endpoints with wallet-side perp views when you need to identify who is carrying the risk.

## Typical workflow

1. Start with `Perps Token List` to find supported perp markets.
2. Use `Perps Token Overview` to inspect high-level market state.
3. Add `Perps Token Open Positions` and `Perps Token Liquidation Map` when you need deeper positioning and liquidation-risk analysis.
