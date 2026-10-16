---
title: Batch Token CU Cost
deprecated: false
hidden: false
metadata:
  robots: index
---
### Batch CU Cost

**Formula:**

> Batch CU Cost = N^exp × Base CU Cost

Where:

- **N**: Batch number.
- **exp**: Batch multiplier exponent.
  - **0.5** for **Blockchain API** endpoints.
  - **0.8** for **all other API groups**.
- **Base CU Cost**: The CU cost of requesting a single token using the corresponding multiple-token endpoint (different from the CU cost of the single-token endpoint).
- The **Batch CU Cost** is rounded up to the nearest whole number (0 decimal places).

### Examples

| API Name                | Endpoint                                 | Base CU Cost | exp | Max Batch Size |
| ----------------------- | ---------------------------------------- | -----------: | --: | -------------: |
| Token Multi Price       | `/defi/multi_price`                      |            3 | 0.8 |            100 |
| Account Detail Multiple | `/blockchain/v1/account/detail/multiple` |            5 | 0.5 |            100 |

#### Example 1: DeFi API

Request **N = 10** tokens using `/defi/multi_price`:

> Batch CU Cost = 10^0.8 × 3 = 18.93 → **19 CU**

#### Example 2: Blockchain API

Request **N = 100** accounts using `/blockchain/v1/account/detail/multiple`:

> Batch CU Cost = 100^0.5 × 5 = 10 × 5 = **50 CU**

**Notes**

- Using a batch endpoint is always more cost-efficient than making the equivalent number of single-endpoint requests.
- Users should consider purchasing a Business plan to access batch endpoints.
- The larger the batch size (**N**), the greater the effective discount. However, each endpoint has a maximum supported batch size (`n_max`), which must not be exceeded.

<br />

### `n_max` Table for Each API

| API Name                                                                                                       | Endpoint                                                                                                                                                       | Base CU cost | n_max (Max Tokens per Batch) |
| :------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------- | :--------------------------- |
| [Price (Multiple) GET & POST](../../../data-api/price-ohlcv/get-defi-multi-price#/)                        | `/defi/multi_price`                                                                                                                                            | 3            | 100                          |
| [Price - Volume (Multiple)](../../../data-api/price-ohlcv/post-defi-price-volume-multi#/)                  | `/defi/price_volume/multi`                                                                                                                                     | 5            | 50                           |
| [Token - Meta Data (Multiple)](../../../data-api/stats/get-defi-v3-token-meta-data-multiple#/)       | `/defi/v3/token/meta-data/multiple`                                                                                                                            | 3            | 50                           |
| [Token - Trade Data (Multiple)](../../../data-api/stats/get-defi-v3-token-trade-data-multiple#/)     | `/defi/v3/token/trade-data/multiple`                                                                                                                           | 10           | 20                           |
| [Token - Market Data (Multiple)](../../../data-api/stats/get-defi-v3-token-market-data-multiple#/)   | `/defi/v3/token/market-data/multiple`                                                                                                                          | 8           | 20                           |
| [Pair - Overview (Multiple)](../../../data-api/stats/get-defi-v3-pair-overview-multiple#/)           | `/defi/v3/pair/overview/multiple`                                                                                                                              | 15           | 20                           |
| [All time - Trades (Multiple)](../../../data-api/alltime-history/post-defi-v3-all-time-trades-multiple#/)      | `/defi/v3/all-time/trades/multiple`                                                                                                                            | 10           | 20                           |
| [Exit liquidity (Multiple)](../../../data-api/stats/get-defi-v3-token-exit-liquidity-multiple#/)     | `/defi/v3/token/exit-liquidity/multiple`                                                                                                                       | 15           | 50                           |
| [Price stats (Multiple)](../../../data-api/stats/post-defi-v3-price-stats-multiple#/)                | `/defi/v3/price/stats/multiple`                                                                                                                                | 5            | 20                           |
| [Wallet - PnL](../../../data-api/wallet-networth-pnl/get-wallet-v2-pnl#/)                                          | `/wallet/v2/pnl/multiple`                                                                                                                                      | 10           | 50                           |
| [Wallet - Tokens Balance](../../../data-api/balance-transfer/post-wallet-v2-token-balance)                      | `/wallet/v2/token-balance`                                                                                                                                     | 10           | 50                           |
| [Token - Latest liquidity](../../../data-api/price-ohlcv/post-defi-v3-liquidity-latest-token)              | [/defi/v3/liquidity/latest/token](https://public-api.birdeye.so/defi/v3/liquidity/latest/token "https://public-api.birdeye.so/defi/v3/liquidity/latest/token") | 5            | 100                          |
| [Wallet - PNL summary (multiple)](../../../data-api/wallet-networth-pnl/post-wallet-v2-net-worth-summary-multiple) | `/wallet/v2/net-worth-summary/multiple`                                                                                                                        | 20           | 100                          |
| [Token - Holder List (Batch)](../../../data-api/holder/post-token-v1-holder-batch#/)                  | `/token/v1/holder/batch`                                                                                                                                       | 30           | 500                          |
| [Wallet - First Tx Funded](../../../data-api/wallet-networth-pnl/post-wallet-v2-tx-first-funded)                   | /wallet/v2/tx/first-funded                                                                                                                                     | 40           | 50                           |
| [Wallet - Identity](../../../data-api/wallet-identity/post-identity-v1-multiple)                               | /identity/v1/multiple                                                                                                                                          | 40           | 100                          |

### `n_max` Table for Blockchain API

| API Name               | Endpoint                               | Base CU cost | n_max (Max Tokens per Batch) |
| :--------------------- | :------------------------------------- | :----------- | :--------------------------- |
| Account Detail Decoded | /blockchain/v1/account/detail/multiple | 5            | 100                          |
| Token Meta Data        | /blockchain/v1/token/metadata/multiple | 5            | 100                          |

<br />
