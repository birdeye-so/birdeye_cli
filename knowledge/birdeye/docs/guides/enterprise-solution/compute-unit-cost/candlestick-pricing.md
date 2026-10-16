---
title: Candlestick Pricing
deprecated: false
hidden: true
metadata:
  robots: index
---
## Candlestick Data Pricing

### Base Pricing

* **Base Price per Candle**: `1 CU`

### Final Cost Formula

Total Cost = Base Price × ceil(N^0.8)

Where:

* `N` = actual number of candles returned
* `N_MAX = 1000` (maximum candles per request)

> **Note**: If `N` exceeds `N_MAX`, the request will be capped at `1000` candles.

### Example Calculation

**For N = 500 candles:**

500^0.8 ≈ 144.72\
Total Cost = ceil(144.72) = 145 CU