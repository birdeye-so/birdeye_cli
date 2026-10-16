---
title: Wallet Identity
hidden: false
---

# Wallet Identity

This group resolves human-readable identity signals for wallets, including labels, domains, and batch identity enrichment.

Use this group when you need:

- wallet labels for UI and analytics tables
- domain resolution for Solana wallets
- identity enrichment for many wallets at once
- cleaner attribution in wallet, holder, and trader workflows

## Which endpoint should I use?

| If you need... | Use this endpoint |
| --- | --- |
| Identity data for one wallet | `Wallet Identity - Single` |
| Identity data for many wallets | `Wallet Identity - Multiple` |
| Domains associated with one wallet | `Wallet Identity - Domains` |

## Notes

- Identity data is an enrichment layer, not a source-of-truth ownership proof.
- Use batch identity lookups when hydrating wallet lists, holder tables, leaderboard screens, or smart-money outputs.
- Domain data is especially useful on Solana-centric wallet experiences where readable naming matters.

## Typical workflow

1. Load wallet, holder, trader, or smart-money data first.
2. Call `Wallet Identity - Multiple` to enrich visible wallet addresses in one pass.
3. Use `Wallet Identity - Domains` when you want naming context or user-facing wallet resolution.
