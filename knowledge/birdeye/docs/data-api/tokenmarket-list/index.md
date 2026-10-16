---
title: Token/Market List
deprecated: false
hidden: false
metadata:
  robots: index
---

# Token/Market List

The Token/Market List group is the discovery layer for browsing tokens and markets before you drill into detailed stats, price, holder, or transaction endpoints.

Use this group when you need:
- token registries and token-directory style lists
- ranked token screens by liquidity, market cap, volume, holders, or recent activity
- large crawls of token universes with scroll pagination
- newly listed token discovery
- per-token market or pool lists

## Which endpoint should I use?

| If you need... | Use this endpoint |
| --- | --- |
| A simple token list with lightweight sorting | `Token - List (V1)` |
| A richer token screener with many filters and ranking fields | `Token - List (V3)` |
| Deep pagination over a large token universe | `Token - List (V3) Scroll` |
| Recently listed tokens | `Token - New listing` |
| Markets or pools for one token | `Token - All Market List` |

## Notes

- Use `Token - List (V1)` for simpler token-directory or registry style workflows.
- Use `Token - List (V3)` when you need screening, ranking, and min-threshold filters.
- Use `Token - List (V3) Scroll` only for large crawls or offline indexing; it is much heavier and has scroll-session rules.
- Use `Token - New listing` for launch monitoring and fresh-token discovery.
- Use `Token - All Market List` to fan out from a token into the venues or pools where it trades.

## Typical workflow

1. Start with `Token - New listing` or `Token - List (V3)` to discover candidates.
2. Use `Token - All Market List` to inspect where each token trades.
3. Enrich shortlisted tokens with price, stats, security, holder, or transaction endpoints.
