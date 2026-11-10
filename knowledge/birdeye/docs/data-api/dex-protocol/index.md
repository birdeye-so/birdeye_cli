---
title: DEX & Protocol
hidden: false
---

# DEX & Protocol

This group covers protocol-level and venue-level market diagnostics that sit above one token or one pool.

Use this group when you need:

- chain-wide market breadth and activity context
- DEX health snapshots at the blockchain level
- protocol or venue analytics to complement token-level monitoring
- macro market signals before drilling into specific assets

## Which endpoint should I use?

| If you need... | Use this endpoint |
| --- | --- |
| Blockchain-wide market activity metrics for one supported network | `Blockchain Market Metrics` |

## Notes

- This group is best used as a top-down context layer before token, pair, or transaction analysis.
- Pair it with `Stats & Market Data` and `Transactions` when you want to explain which tokens or pools are driving chain-level changes.
- Use conservative polling for dashboard summaries and broader market monitors.

## Typical workflow

1. Load `Blockchain Market Metrics` to understand the macro state of the selected chain.
2. Move into `Stats & Market Data` or `Token/Market List` to identify the assets behind that move.
3. Use `Transactions` or `Smart Money` when you need attribution at the wallet or trade level.
