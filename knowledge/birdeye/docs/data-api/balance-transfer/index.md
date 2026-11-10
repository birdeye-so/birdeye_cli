---
title: Balance & Transfer
deprecated: false
hidden: false
metadata:
  robots: index
---
# Balance & Transfer

The Balance & Transfer group covers wallet token balances, wallet balance changes, token transfer history, and wallet transfer history on Solana.

Use this group when you need:
- current wallet balances for one token or many tokens
- token movement history at the wallet or token level
- transfer counts without pulling full transfer rows
- balance-delta timelines for wallet activity review

## Which endpoint should I use?

| If you need... | Use this endpoint |
| --- | --- |
| Current balance of one token in one wallet | `Wallet - Token Balance (Beta)` |
| Current balances of many Solana tokens in one wallet | `Wallet - Tokens Balance` |
| Balance change history for one wallet | `Wallet - Balance Change` |
| Transfer history for one token | `Token - Transfer List` |
| Transfer count summary for one token | `Token - Transfer Total` |
| Transfer history for one wallet | `Wallet - Transfer` |
| Transfer count summary for one wallet | `Wallet - Transfer Total` |

## Notes

- All endpoints in this group are Solana-only.
- `ui_amount_mode` refers to Solana Token-2022 scaled UI amount handling, not UI presentation.
- Transfer list endpoints use cursor-based pagination; total endpoints return only aggregate counts.
- Use wallet-level endpoints when you already know the wallet, and token-level endpoints when you need flow across all wallets for one mint.

## Typical workflow

1. Start with `Wallet - Token Balance (Beta)` or `Wallet - Tokens Balance` for current exposure.
2. Move to `Wallet - Balance Change` to understand how balances evolved.
3. Use `Wallet - Transfer` or `Token - Transfer List` when you need the exact transfer events behind those changes.
4. Use `Transfer Total` endpoints for cheap counts before loading the full transfer list.
