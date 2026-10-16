---
title: "Dynamic Compute Unit Cost"
metadata:
  robots: "index"
next:
  pages:
    - slug: "compute-unit-cost"
      title: "Compute Unit Cost"
      type: "basic"
    - slug: "data-accessibility-by-packages"
      title: "Data Accessibility by Packages"
      type: "basic"
---

## OHLCV and Historical Price

The CU (compute unit) cost is dynamic based on the number of candles requested.

**💡 New CU Tiers**

| Candle Count Range | CU Cost |
| :-- | :-- |
| \<= 100 | 12 |
| 101 - 300 | 25 |
| Default | 35 |

<br />

## OHLCV v3 and OHLCV v3 - Pair

The CU (compute unit) cost is dynamic based on the number of candles requested, supporting up to 5000 candles.

**💡 New CU Tiers**

| Candle Count Range | CU Cost |
| :-- | :-- |
| \<= 100 | 12 |
| 101 - 300 | 25 |
| 301 - 1000 | 40 |
| 1001 - 2000 | 75 |
| 2001 - 5000 | 100 |
| Default | 40 |

<br />

## Recent txs

The CU (compute unit) cost is dynamic based on the number of transactions returned. This is an update from the previous fixed max of 100 transactions per request, now supporting up to 500 transactions.

**💡 New CU Tiers**

| Candle Count Range | CU Cost |
| :-- | :-- |
| \<= 100 | 12 |
| 101 - 300 | 30 |
| 301 - 500 | 50 |

ℹ️ Example:

- Requesting 90 transactions → 12 CU
- Requesting 250 transactions → 30 CU
- Requesting 490 transactions → 50 CU

This dynamic model offers flexibility while scaling with data needs. Please ensure your integration handles CU cost estimation accordingly.
