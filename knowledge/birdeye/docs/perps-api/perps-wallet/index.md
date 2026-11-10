---
title: Perps Wallet
hidden: false
---

# Perps Wallet

This section focuses on wallet-level derivatives exposure, open positions, and wallet overviews across supported perp markets.

Use this section when you need:

- wallet-level perp summaries
- open positions for one perp trader wallet
- wallet screening across perp markets
- participant-level attribution for derivatives flows
- historical trade fills and transfer activity

## Which endpoint should I use?

| If you need... | Use this endpoint |
| --- | --- |
| Search or rank supported perp wallets | `Perps Wallet List` |
| One wallet overview across perp activity | `Perps Wallet Overview` |
| Open positions for one perp wallet | `Perps Wallet Open Positions` |
| Historical executions for one perp wallet | `Perps Wallet Trade Fills` |
| Deposits, withdrawals, and transfer activity | `Perps Wallet Transfers` |

## Notes

- Use wallet perp endpoints when the question is about participants, not markets.
- Pair this section with `Perps Token` when you need both market structure and trader attribution.
- Wallet-side derivatives data is most valuable in research, risk monitoring, and concentration analysis workflows.

## Typical workflow

1. Start with `Perps Wallet List` to find relevant trader wallets.
2. Load `Perps Wallet Overview` for a fast exposure snapshot.
3. Drill into `Perps Wallet Open Positions` when you need the actual risk inventory.
4. Use `Perps Wallet Trade Fills` to review execution history and realized PnL.
5. Use `Perps Wallet Transfers` to explain funding and asset movements.
