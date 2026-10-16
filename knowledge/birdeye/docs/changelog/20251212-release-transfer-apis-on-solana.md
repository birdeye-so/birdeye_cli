---
title: 2025.12.12 - Release transfer APIs on Solana
description: Added release note.
---

# 2025.12.12 - Release transfer APIs on Solana

Transfer APIs are now available for Solana

## New Features

### Token - Transfer List

#### [POST /token/v1/transfer](../data-api/balance-transfer/post-token-v1-transfer)

**Features:**

* Provide standardized transaction data of a token such as sender, receiver, amount, value, timestamp, and transaction hash with various filters
* Transfer data on Solana is available from epoch 257 (11/12/2021)
* Introduce pagination with `cursor` for efficient retrieval with no limit

### Token - Transfer total

#### [POST /token/v1/transfer/total](../data-api/balance-transfer/post-token-v1-transfer-total)

**Features:**

* Provide total number of token transfers with various filters
* Transfer data on Solana is available from epoch 257 (11/12/2021)

### Wallet - Transfer List

#### [POST /wallet/v2/transfer](../data-api/balance-transfer/post-wallet-v2-transfer)

**Features:**

* Provide standardized transaction data of a wallet such as sender, receiver, amount, value, timestamp, and transaction hash with various filters
* Transfer data on Solana is available from epoch 257 (11/12/2021)
* Introduce pagination with `cursor` for efficient retrieval with no limit

### Wallet - Transfer total

#### [POST /wallet/v2/transfer/total](../data-api/balance-transfer/post-wallet-v2-transfer-total)

**Features:**

* Provide total number of wallet transfers with various filters
* Transfer data on Solana is available from epoch 257 (11/12/2021)
