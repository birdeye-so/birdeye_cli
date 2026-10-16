---
title: Alltime & History
deprecated: false
hidden: false
metadata:
  robots: index
---
# Alltime & History

The Alltime & History group focuses on long-horizon token trading activity rather than short-window price or holder snapshots.

Use this group when you need:
- cumulative trade statistics for one token
- the same all-time trade view for many tokens at once
- long-range leaderboard, ranking, or screening inputs

## Which endpoint should I use?

| If you need... | Use this endpoint |
| --- | --- |
| All-time or duration-bounded trade stats for one token | `All Time Trades (Single)` |
| The same trade stats for many tokens | `All Time Trades (Multiple)` |

## Notes

- These endpoints summarize trading activity across a selected duration such as `24h`, `7d`, `30d`, `90d`, or `all`.
- Use the single endpoint for one-token detail and the multiple endpoint for ranking, screening, or board-style comparisons.
- Keep `ui_amount_mode` consistent if you compare tokens that use Solana Token-2022 scaled UI amounts.
