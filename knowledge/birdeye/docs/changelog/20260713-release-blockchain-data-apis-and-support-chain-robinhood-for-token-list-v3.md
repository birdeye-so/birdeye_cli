---
title: 2026.07.13 - Release Blockchain Data APIs and  Support Chain Robinhood for Token List V3
description: Added release note.
---

# 2026.07.13 - Release Blockchain Data APIs and  Support Chain Robinhood for Token List V3

New Blockchain Data API endpoints for Solana accounts, tokens, and transactions, plus Robinhood chain support for Token List V3 APIs.

## Features

### Blockchain Data API

New Blockchain Data API endpoints for Solana:

- [GET /blockchain/v1/account/detail](../blockchain-api/account/get-blockchain-v1-account-detail)
- [POST /blockchain/v1/account/detail/multiple](../blockchain-api/account/post-blockchain-v1-account-detail-multiple)
- [GET /blockchain/v1/account/token-accounts](../blockchain-api/account/get-blockchain-v1-account-token-accounts)
- [GET /blockchain/v1/token/metadata](../blockchain-api/token/get-blockchain-v1-token-metadata)
- [POST /blockchain/v1/token/metadata/multiple](../blockchain-api/token/post-blockchain-v1-token-metadata-multiple)
- [GET /blockchain/v1/transaction/detail](../blockchain-api/transaction/get-blockchain-v1-transaction-detail)

These endpoints provide:

- Account detail lookup for a single Solana address
- Batch account detail lookup for up to 100 Solana addresses
- Token account lookup by owner address, with optional state and zero-balance filtering
- Token metadata lookup for a single Solana token mint
- Batch token metadata lookup for up to 100 Solana token mints
- Transaction detail lookup by Solana transaction signature

***

### Token - List (V3)

[GET /defi/v3/token/list](../data-api/tokenmarket-list/get-defi-v3-token-list)

- Add Robinhood chain support to Token List V3
- Enable `robinhood` as a supported `x-chain` value

***

### Token - List (V3) Scroll

[GET /defi/v3/token/list/scroll](../data-api/tokenmarket-list/get-defi-v3-token-list-scroll)

- Add Robinhood chain support to Token List V3 Scroll
- Enable `robinhood` as a supported `x-chain` value
