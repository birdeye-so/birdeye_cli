---
title: 2026.07.15 - Expand EVM Chains Support for Smart Money Token List API
description: Added release note.
---

# 2026.07.15 - Expand EVM Chains Support for Smart Money Token List API

New update for the Smart Money Token List API, expanding support from Solana to EVM chains supported.

## Features

### Smart Money - Token List

[GET /smart-money/v1/token/list](../data-api/smart-money/get-smart-money-v1-token-list)

- Expand Smart Money Token List support from Solana to EVM chains
- Enable EVM usage through the `x-chain` header on supported wallet PnL networks
- Keep the existing Smart Money filters and sorting options, including `interval`, `trader_style`, `sort_by`, `sort_type`, `offset`, and `limit`
- Return smart money token results segmented by trader style and risk appetite across supported chains
