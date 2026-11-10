---
title: "Multi Factor Compute Unit Cost"
metadata:
  robots: "index"
---

This CU pricing model applies to the following endpoints:

| API | Endpoint |
| :-- | :-- |
| Liquidity OHLC - Pair | `/defi/v3/liquidity/ohlc/pair` |
| Liquidity OHLC - Token | `/defi/v3/liquidity/ohlc/token` |
| Liquidity History - Token | `/defi/v3/liquidity/history/token` |

<br />The CU (compute unit) cost is calculated dynamically based on three request parameters:

- **Resolution** – the requested candle interval.
- **Depth** – the number of candles requested (`limit`).
- **Lookback** – the historical time range implied by the request.

The calculation is performed **from the request parameters**, **not** from the actual number of records returned.

**💡 CU Formula**

```text
CU = Base CU (Resolution) × Depth Multiplier × Lookback Multiplier × Limit
```

where:

```text
lookback_days ≈ limit × resolution_in_days
```

### 1. Resolution Base CU

| Resolution | Description | Base CU |
| :-- | :-- | --: |
| \< 1H | High resolution | 20 |
| \< 1D | Intraday | 50 |
| ≥ 1D | Daily\+ | 2000 |

### 2. Depth Multiplier

| Candles per Request | Multiplier |
| :-- | --: |
| ≤ 100 | ×1 |
| 101 – 300 | ×2 |
| 301 – 500 | ×3 |

### 3. Lookback Multiplier

| Lookback Range | Description | Multiplier |
| :-- | :-- | --: |
| \< 1 day | Realtime / Intraday | ×1 |
| 1 – 100 days | Standard Historical | ×1.5 |
| \> 100 days | Deep Historical / Archive | ×3 |

ℹ️ **Examples**

### Example 1 — Realtime (no lookback multiplier)

Request:

- Resolution: **1m**
- Limit: **500**
- Lookback: **500 minutes (~0.35 day)**

Calculation:

```text
Base CU = 20
Depth Multiplier = ×3
Lookback Multiplier = ×1

CU = 20 × 3 × 1 = 60 CU
```

---

### Example 2 — Standard historical lookback

Request:

- Resolution: **1H**
- Limit: **240**
- Lookback: **240 hours (10 days)**

Calculation:

```text
Base CU = 50
Depth Multiplier = ×2
Lookback Multiplier = ×1.5

CU = 50 × 2 × 1.5 = 150 CU
```

---

### Example 3 — Deep historical archive

Request:

- Resolution: **1D**
- Limit: **365**
- Lookback: **365 days**

Calculation:

```text
Base CU = 200
Depth Multiplier = ×3
Lookback Multiplier = ×3

CU = 200 × 3 × 3 = 1,800 CU
```

---

### Example 4 — Large intraday historical query

Request:

- Resolution: **15m**
- Limit: **500**
- Lookback: **7,500 minutes (~5.2 days)**

Calculation:

```text
Base CU = 20
Depth Multiplier = ×3
Lookback Multiplier = ×1.5

CU = 20 × 3 × 1.5 = 90 CU
```

<br />