---
title: Wallet, Networth & PnL
deprecated: false
hidden: false
metadata:
  robots: index
---

# Wallet, Networth & PnL

This group covers wallet portfolio views, historical net worth, profit and loss, leaderboard-style wallet screens, and token-level wallet performance.

Use this group when you need:
- wallet portfolio snapshots
- current and historical net worth
- per-token or per-wallet PnL
- wallet-level ranking and first-funding provenance
- beta wallet portfolio and transaction history endpoints

## Which endpoint should I use?

| If you need... | Use this endpoint |
| --- | --- |
| Supported wallet networks | `Wallet Supported Networks` |
| Beta wallet holdings list | `Wallet Portfolio (Beta)` |
| Beta wallet transaction history | `Wallet - Transaction History (Beta)` |
| Current Solana wallet portfolio value | `Wallet - Portfolio (V2)` |
| Current Solana portfolio value for many wallets | `Wallet - Current Net Worth Summary (Multiple)` |
| Historical Solana net worth chart | `Wallet - Net Worth Chart` |
| Historical Solana net worth breakdown at one checkpoint | `Wallet - Net Worth Details` |
| Per-token wallet PnL | `Wallet - PnL (Per Token)` |
| Per-wallet PnL for one token | `Wallet - PnL (Per Wallet)` |
| Summary PnL for one wallet | `Wallet - PnL` |
| Realized PnL chart | `Wallet - PnL Chart` |
| Detailed wallet PnL breakdown | `Wallet - PnL Details` |
| Earliest funding transaction for wallets | `Wallet - First Tx Funded` |
| Earliest SOL funding source for one wallet | `Wallet - Funded By` |
| Wallet leaderboard by total value | `Wallet - Leaderboard` |
| Top traders for one token | `Token - Top traders` |
| Top trader gainers or losers | `Trader - Gainers/Losers` |

## Notes

- Many V2 wallet portfolio endpoints in this folder are Solana-only.
- `Wallet - Funded By` is a provenance endpoint for earliest SOL funding, not a substitute for full transfer history.
- PnL endpoints support more chains than net-worth endpoints, so check each page before integrating.
- `Wallet Portfolio (Beta)` and `Wallet - Transaction History (Beta)` are useful but older; prefer V2 portfolio and PnL endpoints where possible.
- Wallet APIs are best used with caching and polling discipline, especially for dashboards that repeatedly query the same addresses.

## Typical workflow

1. Start with `Wallet - Portfolio (V2)` or `Wallet - PnL` for a quick wallet overview.
2. Add `Wallet - Net Worth Chart` or `Wallet - PnL Chart` when you need time-series context.
3. Use `Wallet - PnL Details`, `Wallet - First Tx Funded`, `Wallet - Funded By`, or `Token - Top traders` for deeper attribution and research.
