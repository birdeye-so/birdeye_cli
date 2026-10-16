---
title: Price & OHLCV
deprecated: false
hidden: false
metadata:
  robots: index
---
# Price & OHLCV

The Price & OHLCV group covers real-time prices, batch price lookups, historical prices, candlestick data, price-volume snapshots, and liquidity time series.

It is the core market-data layer when you need:
- latest token prices
- multi-token pricing
- historical price lookups
- OHLCV candles for tokens, pairs, or base/quote markets
- compact price-plus-volume snapshots
- liquidity history and liquidity OHLC data

## Which endpoint should I use?

| If you need... | Use this endpoint |
| --- | --- |
| Latest price for one token | `Price` |
| Latest prices for many tokens | `Price - Multiple` |
| Historical price series for one token | `Price - Historical` |
| Historical price at one exact timestamp | `Price - Historical by unix time` |
| Token OHLCV candles (legacy) | `OHLCV` |
| Pair OHLCV candles (legacy) | `OHLCV - Pair` |
| Base/quote OHLCV candles across markets | `OHLCV - Base/Quote` |
| Token OHLCV candles with V3 intervals and no candle padding | `OHLCV V3` |
| Pair OHLCV candles with V3 intervals and no candle padding | `OHLCV V3 - Pair` |
| Current price plus volume for one token | `Price Volume - Single` |
| Current price plus volume for many tokens | `Price Volume - Multi` |
| Solana pool liquidity OHLC history | `Liquidity OHLC - Pair` |
| Solana token liquidity OHLC history | `Liquidity OHLC - Token` |
| Solana token liquidity history snapshots | `Liquidity History - Token` |
| Solana pair liquidity history snapshots | `Liquidity History - Pair` |
| Latest token liquidity snapshot for one or many Solana tokens | `Liquidity Latest - Token` |

## Notes

- Use `Price` or `Price - Multiple` for lightweight real-time pricing.
- Use `Price - Historical` when you need a time series, and `Historical by unix time` when you need one exact checkpoint.
- Prefer V3 OHLCV endpoints when you need finer intervals like `1s`, `15s`, or `30s`, or when you do not want padded empty candles.
- Use `Price Volume` endpoints when a compact price-plus-volume snapshot is enough and you do not need full OHLCV candles.
- Liquidity history and liquidity OHLC endpoints are separate from price candles and are most useful for execution-quality, market-depth, and LP analytics.
- Batch limits, interval support, and retention windows differ by endpoint, so check each page's `Usage Note` before building charting or backfill workflows.

## Typical workflow

1. Start with `Price` or `Price - Multiple` for the latest spot price.
2. Move to `Price - Historical` or `OHLCV` when you need charting or backtesting data.
3. Use `Price Volume` for lightweight market boards and watchlists.
4. Add liquidity history or liquidity OHLC when market depth matters as much as price.
