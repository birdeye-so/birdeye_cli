---
title: Blockchain Data API
hidden: false
---

# Blockchain Data API

The Blockchain Data API group exposes lower-level chain data for accounts, token metadata, and raw transaction detail.

Use this group when you need:

- account-level on-chain state
- token-account inventories
- token metadata at the blockchain layer
- raw transaction detail without spot-market abstractions

## Which section should I start with?

| If you need... | Start here |
| --- | --- |
| Account-level balances and token-account state | `Account` |
| Token metadata at the chain layer | `Token` |
| Raw transaction detail by signature | `Transaction` |

## Notes

- This group is closer to the chain than Birdeye Data API market endpoints.
- Use these endpoints when you need state inspection and raw chain detail, not market summaries or aggregated trading analytics.
- Blockchain Data API is especially useful for infra tooling, forensic workflows, and internal state verification.

## Typical workflow

1. Start with `Account` to inspect wallet state or token-account inventories.
2. Use `Token` when you need chain-level token metadata for one or many mints.
3. Move to `Transaction` when you need the exact raw transaction that changed state.
