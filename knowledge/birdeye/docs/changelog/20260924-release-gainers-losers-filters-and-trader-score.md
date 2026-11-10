---
title: 2026.09.24 - Gainers/Losers Trader Score
description: Added trader-score ranking to the Trader - Gainers/Losers API.
---

# 2026.09.24 - Gainers/Losers Trader Score

The **Trader - Gainers/Losers** API now supports ranking eligible traders by an overall trader score.

## What's New

* Use `sort_by=trader_score` to rank eligible traders using an overall score from `0` to `100`.
* Trader-score ranked responses include a `score` field.

The trader score reflects profitability, consistency, trading quality, and activity relative to other eligible traders. Higher scores indicate stronger overall trading performance.

## API Reference

[Trader - Gainers/Losers](../data-api/wallet-networth-pnl/get-trader-gainers-losers)

```text
GET /trader/gainers-losers
```
