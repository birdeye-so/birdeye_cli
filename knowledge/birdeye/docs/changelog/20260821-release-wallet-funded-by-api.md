---
title: 2026.08.21 - Release API Wallet - Funded By
description: Added release note.
---

# 2026.08.21 - Release API Wallet - Funded By

A new wallet intelligence endpoint is now available to identify the earliest known SOL funding source for a Solana wallet.

**Wallet - Funded By**

[GET /wallet/v2/funded-by](../data-api/wallet-networth-pnl/get-wallet-v2-funded-by)

This endpoint helps trace wallet provenance and answer questions such as:

- who first funded this wallet
- when that funding happened
- how much SOL was transferred
- which transaction created that funding link

### Features

- Retrieve the earliest native SOL funders of a wallet
- Return funding transaction details for provenance and attribution
- Support wallet source-of-funds analysis for trader and holder research
- Parse supported instruction patterns including `transfer`, balance-changing `createAccount`, `createAccountWithSeed`, `UnwrapLamports`, and `WithdrawExcessLamports`
- Support Lite API access or higher

### Parameters

| Parameter | Type   | Required | Default | Description                    |
| --------- | ------ | -------- | ------- | ------------------------------ |
| `x-chain` | string | No       | solana  | Chain header. Solana only.     |
| `wallet`  | string | Yes      | -       | Solana wallet address to trace |

### Response

The response returns the earliest known SOL funding record for the requested wallet and can include:

- `funders` — one or more funder wallets associated with the earliest qualifying SOL funding event
- `funders[].funder` — wallet address that funded the target wallet
- `funders[].funder_name` — human-readable label for the funder wallet when available
- `token_address` — native token mint address for the funding asset
- `token_decimals` — decimals used by the funding asset
- `block_number` — Solana slot where the funding transaction occurred
- `unix_time` — Unix timestamp of the funding transaction
- `amount` — raw SOL funding amount transferred in the transaction
- `tx_hash` — transaction signature of the earliest qualifying funding event

### Use cases

- Trace the origin wallet behind a trader, sniper, or whale wallet
- Group wallets by common funding source
- Add provenance context to wallet, holder, or top-trader investigations
- Support compliance, risk, and forensic workflows that need source-of-funds attribution
