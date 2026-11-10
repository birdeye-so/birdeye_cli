---
title: 2025.10.13 - Release Credits Usage
description: Added release note.
---

# 2025.10.13 - Release Credits Usage

Enhance visibility into account usage and improve trade query flexibility. This release introduces a new utility endpoint for tracking credit consumption and adds a tx_type filter to refine trader trade lookups.

## New Features

### New API to extract your current and past credits usage

#### [GET /utils/v1/credits](../data-api/search-utils/get-utils-v1-credits#/)

Retrieve compute units (CUs) usage of your account.

**Features:**

* Retrieve current CUs usage with remaining and overage values with cost for current cycle.
* Retrieve CUs usage in the past 1 year.

***

## Improvements

### Add filter `tx_type` to Trader - Trades Seek By Time API

#### [GET /trader/txs/seek_by_time](../data-api/transactions/get-trader-txs-seek-by-time#/)

Added tx_type filter to refine returned trades by transaction type.

**Features:**

* Default to `all` (returns all transaction types)
* Available transactions types are: all, swap, add and remove
