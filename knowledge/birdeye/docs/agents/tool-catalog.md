---
title: "Tool Catalog"
description: "Match your task to the right Birdeye MCP endpoint"
---

This catalog lists the endpoints confirmed in Birdeye's MCP documentation. Birdeye MCP exposes tools mapped to the full REST API, so this list will grow. Cross-check against the [API Reference](https://docs.birdeye.so/reference) if you don't see the endpoint you need.

Picking the wrong endpoint wastes a call. Match your task to the right one below.

| You need | Call this | Reference |
| --- | --- | --- |
| Supported networks | `GET /defi/networks` | [get-defi-networks](https://docs.birdeye.so/reference/get-defi-networks) |
| Current token price | `GET /defi/price` | [get-defi-price](https://docs.birdeye.so/reference/get-defi-price) |
| Historical price (line) | `GET /defi/history_price` | [get-defi-historical\_price\_unix](https://docs.birdeye.so/reference/get-defi-historical_price_unix) |
| OHLCV candles (token) | `GET /defi/v3/ohlcv` | [get-defi-v3-ohlcv](https://docs.birdeye.so/reference/get-defi-v3-ohlcv) |
| Token stats / overview | `GET /defi/token_overview` | [get-defi-token\_overview](https://docs.birdeye.so/reference/get-defi-token_overview) |
| Token trades (v3) | `GET /defi/v3/token/txs` | [get-defi-v3-token-txs](https://docs.birdeye.so/reference/get-defi-v3-token-txs) |
| Trending tokens | `GET /defi/token_trending` | [get-defi-token\_trending](https://docs.birdeye.so/reference/get-defi-token_trending) |
| Meme token list | `GET /defi/v3/token/meme/list` | [get-defi-v3-token-meme-list](https://docs.birdeye.so/reference/get-defi-v3-token-meme-list) |
| Smart money token list | `GET /smart-money/v1/token/list` | [get-smart-money-v1-token-list](https://docs.birdeye.so/reference/get-smart-money-v1-token-list) |
| Token security / risk | `GET /defi/token_security` | [get-defi-token\_security](https://docs.birdeye.so/reference/get-defi-token_security) |
| Holder distribution | `GET /holder/v1/distribution` | [get-holder-v1-distribution](https://docs.birdeye.so/reference/get-holder-v1-distribution) |
| Token transfer list | `POST /token/v1/transfer` | [post-token-v1-transfer](https://docs.birdeye.so/reference/post-token-v1-transfer) |
| Wallet current net worth | `GET /wallet/v2/current-net-worth` | [get-wallet-v2-current-net-worth](https://docs.birdeye.so/reference/get-wallet-v2-current-net-worth) |
| Wallet net worth chart | `GET /wallet/v2/net-worth` | [get-wallet-v2-net-worth](https://docs.birdeye.so/reference/get-wallet-v2-net-worth) |
| Wallet PnL summary | `GET /wallet/v2/pnl/summary` | [get-wallet-v2-pnl-summary](https://docs.birdeye.so/reference/get-wallet-v2-pnl-summary) |
| Wallet tx history (beta) | `GET /v1/wallet/tx_list` | [get-v1-wallet-tx\_list](https://docs.birdeye.so/reference/get-v1-wallet-tx_list) |
| Search (token / market) | `GET /defi/v3/search` | [get-defi-v3-search](https://docs.birdeye.so/reference/get-defi-v3-search) |

<Tip>
  Every endpoint on this page is also directly callable as a REST API, with or without MCP. See [Birdeye MCP](/agents/birdeye-mcp) to connect an agent, or the [API Reference](https://docs.birdeye.so/reference) to call these endpoints yourself.
</Tip>

## Watch your credit budget

Compute unit cost per call through MCP was not documented in the source material for this page. Confirm actual CU cost with the team before publishing, and link the [Compute Unit Cost](/resources/compute-unit-cost) page here once confirmed.
