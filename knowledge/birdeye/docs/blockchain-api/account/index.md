---
title: Account
hidden: false
---

# Account

This section covers wallet and account state at the blockchain layer, including token accounts and batch account-detail lookups.

Use this section when you need:

- raw account state for one wallet
- token accounts owned by a wallet
- batch account-detail lookups
- infra-friendly account inspection instead of market abstractions

## Which endpoint should I use?

| If you need... | Use this endpoint |
| --- | --- |
| One account detail snapshot | `Blockchain - Account Detail` |
| Account details for many wallets | `Blockchain - Multiple Account Details` |
| Token accounts owned by one wallet | `Blockchain - Token Accounts` |

## Notes

- Use this section when you care about account state and ownership, not token price or market activity.
- Batch account-detail lookups are useful for infra jobs, wallet inspection, and state backfills.
- Token-account inventory is especially useful for Solana-native balance tooling and ownership analysis.

## Typical workflow

1. Load `Blockchain - Account Detail` for a base wallet snapshot.
2. Add `Blockchain - Token Accounts` when you need token inventory under that wallet.
3. Use `Blockchain - Multiple Account Details` for monitoring or batch enrichment jobs.
