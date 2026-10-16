---
title: 2025.07.23 - Meme Token APIs, OHLCV Enhancements & CJK Search Fix
description: Added release note.
---

# 2025.07.23 - Meme Token APIs, OHLCV Enhancements & CJK Search Fix

## New Features

### OHLCV v3 API Enhancements

Added support for new parameters in the OHLCV v3 endpoints: `mode`, `outlier`, `padding`, `count_limit`, `inversion`

* [OHLCV v3](../data-api/price-ohlcv/get-defi-v3-ohlcv)
* [OHLCV v3 Pair](../data-api/price-ohlcv/get-defi-v3-ohlcv-pair)

### New Meme Token APIs

Introduced new endpoints for accessing meme token data (currently available for Solana):

* [Meme Token List](../data-api/meme/get-defi-v3-token-meme-list)
* [Meme Token Detail](../data-api/meme/get-defi-v3-token-meme-detail-single)

**Note: Meme token data is available starting from June 20, 2025.**

## Improvements

### Search Improvement for CJK Characters

Resolved an issue where single-character searches in Chinese, Japanese, and Korean (CJK) languages were not returning results.

* [Search Endpoint](../data-api/search-utils/get-defi-v3-search)
