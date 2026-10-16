---
description: "''"
title: Compute Unit Cost
excerpt: ''
deprecated: false
hidden: false
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
Compute units are a measure of the computational resources consumed by each API call. The pricing is based on the complexity and resource requirements of individual APIs.

| API Name                                                                                                                     | Endpoint                               | Cost (CUs)                                                                            |
| :--------------------------------------------------------------------------------------------------------------------------- | :------------------------------------- | :------------------------------------------------------------------------------------ |
| **Price & OHLCV**                                                                                                            |                                        |                                                                                       |
| [Price - Single](../../../data-api/price-ohlcv/get-defi-price#/)                                                         | /defi/price                            | 3                                                                                     |
| [Price - Multiple](../../../data-api/price-ohlcv/get-defi-multi-price#/)                                                 | /defi/multi_price                      | [See batch CU cost](https://docs.birdeye.so/docs/batch-token-cu-cost#/)               |
| [OHLCV V3](../../../data-api/price-ohlcv/get-defi-v3-ohlcv#/)                                                            | /defi/v3/ohlcv                         | [See our dynamic CU model ](https://docs.birdeye.so/docs/dynamic-cu-cost#/)           |
| [OHLCV V3 - Pair](../../../data-api/price-ohlcv/get-defi-v3-ohlcv-pair#/)                                                | /defi/v3/ohlcv/pair                    | [See our dynamic CU model ](https://docs.birdeye.so/docs/dynamic-cu-cost#/)           |
| [OHLCV - Base/Quote](../../../data-api/price-ohlcv/get-defi-ohlcv-base-quote#/)                                          | /defi/ohlcv/base_quote                 | See dynamic CU model                                                                    |
| [OHLCV](../../../data-api/price-ohlcv/get-defi-ohlcv#/)                                                                  | /defi/ohlcv                            | See dynamic CU model                                                                    |
| [OHLCV - Pair](../../../data-api/price-ohlcv/get-defi-ohlcv-pair#/)                                                      | /defi/ohlcv/pair                       | See dynamic CU model                                                                    |
| [Price - Historical](../../../data-api/price-ohlcv/get-defi-history-price#/)                                             | /defi/history_price                    | See dynamic CU model                                                                    |
| [Price - Historical by unix time](../../../data-api/price-ohlcv/get-defi-historical-price-unix#/)                        | /defi/historical_price_unix            | 6                                                                                     |
| [Price - Volume (Single)](../../../data-api/price-ohlcv/get-defi-price-volume-single#/)                                  | /defi/price_volume/single              | 5                                                                                     |
| [Price - Volume (Multiple)](../../../data-api/price-ohlcv/post-defi-price-volume-multi#/)                                | /defi/price_volume/multi               | [See batch CU cost](https://docs.birdeye.so/docs/batch-token-cu-cost#/)               |
| **Stats**                                                                                                                    |                                        |                                                                                       |
| [Token - Overview](../../../data-api/stats/get-defi-token-overview#/)                                              | /defi/token_overview                   | 20                                                                                    |
| [Token - Meta Data (Single)](../../../data-api/stats/get-defi-v3-token-meta-data-single#/)                         | /defi/v3/token/meta-data/single        | 3                                                                                     |
| [Token - Meta Data (Multiple)](../../../data-api/stats/get-defi-v3-token-meta-data-multiple#/)                     | /defi/v3/token/meta-data/multiple      | [See batch CU cost](https://docs.birdeye.so/docs/batch-token-cu-cost#/)               |
| [Token - Market Data (Single)](../../../data-api/stats/get-defi-v3-token-market-data#/)                            | /defi/v3/token/market-data             | 10                                                                                    |
| [Token -Market Data (Multiple)](../../../data-api/stats/get-defi-v3-token-market-data-multiple#/)                  | /defi/v3/token/market-data/multiple    | [See batch CU cost](https://docs.birdeye.so/docs/batch-token-cu-cost#/)               |
| [Token - Trade Data (Single)](../../../data-api/stats/get-defi-v3-token-trade-data-single#/)                       | /defi/v3/token/trade-data/single       | 12                                                                                    |
| [Token - Trade Data (Multiple)](../../../data-api/stats/get-defi-v3-token-trade-data-multiple#/)                   | /defi/v3/token/trade-data/multiple     | [See batch CU cost](https://docs.birdeye.so/docs/batch-token-cu-cost#/)               |
| [Token - Liquidity (Single)](../../../data-api/stats/get-defi-v3-token-exit-liquidity#/)                           | /defi/v3/token/exit-liquidity          | 15                                                                                    |
| [Token - Liquidity (Multiple)](../../../data-api/stats/get-defi-v3-token-exit-liquidity-multiple#/)                | /defi/v3/token/exit-liquidity/multiple | [See batch CU cost](https://docs.birdeye.so/docs/batch-token-cu-cost#/)               |
| [Pair - Overview - Single](../../../data-api/stats/get-defi-v3-pair-overview-single#/)                             | /defi/v3/pair/overview/single          | 15                                                                                    |
| [Pair - Overview - Multiple](../../../data-api/stats/get-defi-v3-pair-overview-multiple#/)                         | /defi/v3/pair/overview/multiple        | [See batch CU cost](https://docs.birdeye.so/docs/batch-token-cu-cost#/)               |
| [Price stats - Single](../../../data-api/stats/get-defi-v3-price-stats-single#/)                                   | /defi/v3/price/stats/single            | 8                                                                                     |
| [Price stats - Multiple](../../../data-api/stats/post-defi-v3-price-stats-multiple#/)                              | /defi/v3/price/stats/multiple          | [See batch CU cost](https://docs.birdeye.so/docs/batch-token-cu-cost#/)               |
| **Token/Market List**                                                                                                        |                                        |                                                                                       |
| [Token - List V3](../../../data-api/tokenmarket-list/get-defi-v3-token-list#/)                                                | /defi/v3/token/list                    | 60                                                                                    |
| [Token - List V3 (scroll)](../../../data-api/tokenmarket-list/get-defi-v3-token-list-scroll#/)                                | /defi/v3/token/list/scroll             | 400                                                                                   |
| [Token - List](../../../data-api/tokenmarket-list/get-defi-tokenlist#/)                                                       | /defi/tokenlist                        | 30                                                                                    |
| [Token - New Listing](../../../data-api/tokenmarket-list/get-defi-v2-tokens-new-listing#/)                                    | /defi/v2/tokens/new_listing            | 30                                                                                    |
| [Token - All Market List](../../../data-api/tokenmarket-list/get-defi-v2-markets#/)                                           | /defi/v2/markets                       | 30                                                                                    |
| **Transactions**                                                                                                             |                                        |                                                                                       |
| [Trades - Token (V3)](../../../data-api/transactions/get-defi-v3-token-txs#/)                                             | /defi/v3/token/txs                     | 15                                                                                    |
| [Trades - All (V3)](../../../data-api/transactions/get-defi-v3-txs#/)                                                     | /defi/v3/txs                           | 12                                                                                    |
| [Trades - Recent (V3)](../../../data-api/transactions/get-defi-v3-txs-recent#/)                                           | /defi/v3/txs/recent                    | [See our dynamic CU model ](https://docs.birdeye.so/docs/dynamic-cu-cost#/recent-txs) |
| [Trades - Token](../../../data-api/transactions/get-defi-txs-token#/)                                                     | /defi/txs/token                        | 10                                                                                    |
| [Trades - Pair](../../../data-api/transactions/get-defi-txs-pair#/)                                                       | /defi/txs/pair                         | 10                                                                                    |
| [Trades - Token Seek By Time](../../../data-api/transactions/get-defi-txs-token-seek-by-time#/)                           | /defi/txs/token/seek_by_time           | 10                                                                                    |
| [Trades - Pair Seek By Time](../../../data-api/transactions/get-defi-txs-pair-seek-by-time#/)                             | /defi/txs/pair/seek_by_time            | 10                                                                                    |
| [Trader - Trade Seek by Time](../../../data-api/transactions/get-trader-txs-seek-by-time#/)                               | /trader/txs/seek_by_time               | 10                                                                                    |
| [Trades - Token Filtered By Volume (V3)](../../../data-api/transactions/get-defi-v3-token-txs-by-volume)                  | /defi/v3/token/txs-by-volume           | 50                                                                                    |
| [Token - Mint/Burn](../../../data-api/transactions/get-defi-v3-token-mint-burn-txs#/)                                     | /defi/v3/token/mint-burn-txs           | 20                                                                                    |
| **Wallet, Networth & PnL**                                                                                                   |                                        |                                                                                       |
| [Wallet - Current Net Worth](../../../data-api/wallet-networth-pnl/get-wallet-v2-current-net-worth#/)                            | /wallet/v2/current-net-worth           | 30                                                                                    |
| [Wallet - Net Worth Chart](../../../data-api/wallet-networth-pnl/get-wallet-v2-net-worth)                                        | /wallet/v2/net-worth                   | 50                                                                                    |
| [Wallet - Current Net Worth Summary (Multiple)](../../../data-api/wallet-networth-pnl/post-wallet-v2-net-worth-summary-multiple) | /wallet/v2/net-worth-summary/multiple  | [See batch CU cost](https://docs.birdeye.so/docs/batch-token-cu-cost#/)               |
| [Wallet - Net Worth Details](../../../data-api/wallet-networth-pnl/get-wallet-v2-net-worth-details)                              | /wallet/v2/net-worth-details           | 40                                                                                    |
| [Wallet - PnL](../../../data-api/wallet-networth-pnl/get-wallet-v2-pnl-summary)                                                  | /wallet/v2/pnl/summary                 | 30                                                                                    |
| [Wallet - PnL Details](../../../data-api/wallet-networth-pnl/post-wallet-v2-pnl-details)                                         | /wallet/v2/pnl/details                 | 40                                                                                    |
| [Wallet - PnL (Per Wallet)](../../../data-api/wallet-networth-pnl/get-wallet-v2-pnl-multiple)                                    | /wallet/v2/pnl/multiple                | [See batch CU cost](https://docs.birdeye.so/docs/batch-token-cu-cost#/)               |
| [Wallet - First Tx Funded](../../../data-api/wallet-networth-pnl/post-wallet-v2-tx-first-funded)                                 | /wallet/v2/tx/first-funded             | [See batch CU cost](https://docs.birdeye.so/docs/batch-token-cu-cost#/)               |
| [Wallet - Funded By](../../../data-api/wallet-networth-pnl/get-wallet-v2-funded-by)                                              | /wallet/v2/funded-by                   | 30                                                                                    |
| [Token - Top traders](../../../data-api/wallet-networth-pnl/get-defi-v2-tokens-top-traders#/)                                    | /defi/v2/tokens/top_traders            | 35                                                                                    |
| [Trader - Gainer/Losers](../../../data-api/wallet-networth-pnl/get-trader-gainers-losers#/)                                      | /trader/gainers-losers                 | 30                                                                                    |
| [Wallet - Supported Networks](../../../data-api/wallet-networth-pnl/get-v1-wallet-list-supported-chain#/)                        | /v1/wallet/list_supported_chain        | 1                                                                                     |
| [Wallet Transaction History (Beta)](../../../data-api/wallet-networth-pnl/get-v1-wallet-tx-list#/)                               | /v1/wallet/tx_list                     | 60                                                                                    |
| [Wallet Portfolio (Beta)](../../../data-api/wallet-networth-pnl/get-v1-wallet-token-list)(Deprecated)                            | v1/wallet/token_list                   | 60                                                                                    |
| **Holder**                                                                                                                   |                                        |                                                                                       |
| [Token - Holder](../../../data-api/holder/get-defi-v3-token-holder#/)                                               | /defi/v3/token/holder                  | 35                                                                                    |
| [Token - Holder (Batch)](../../../data-api/holder/post-token-v1-holder-batch#/)                                     | /token/v1/holder/batch                 | [See batch CU cost](https://docs.birdeye.so/docs/batch-token-cu-cost#/)               |
| [Token - Holder Distribution](../../../data-api/holder/get-holder-v1-distribution)                                  | /holder/v1/distribution                | 35                                                                                    |
| [Token - Holder Profile](../../../data-api/holder/get-token-v1-holder-profile)                                      | /token/v1/holder-profile               | 35                                                                                    |
| [Token - Holder Positions](../../../data-api/holder/get-token-v1-holder-positions)                                  | /token/v1/holder-positions             | 40                                                                                    |
| [Token - Holder Chart](../../../data-api/holder/get-token-v1-holder-chart)                                          | /token/v1/holder/chart                 | 25                                                                                    |
| [Token - Wallet Tags Tracker](../../../data-api/holder/get-token-v1-wallet-tags-tracker)                            | /token/v1/wallet-tags-tracker          | 40                                                                                    |
| [Token - Wallet Tags Tracker Details](../../../data-api/holder/get-token-v1-wallet-tags-tracker-details)            | /token/v1/wallet-tags-tracker/details  | 40                                                                                    |
| **Liquidity**                                                                                                                |                                        |                                                                                       |
| [Liquidity Latest - Token](../../../data-api/price-ohlcv/post-defi-v3-liquidity-latest-token)                            | /defi/v3/liquidity/latest/token        | [See batch CU cost](https://docs.birdeye.so/docs/batch-token-cu-cost)                 |
| [Liquidity History - Token](../../../data-api/price-ohlcv/get-defi-v3-liquidity-history-token)                           | /defi/v3/liquidity/history/token       | [See CU cost](https://docs.birdeye.so/docs/multi-factor-cu-cost)                      |
| [Liquidity OHLC - Token](../../../data-api/price-ohlcv/get-defi-v3-liquidity-ohlc-token)                                 | /defi/v3/liquidity/ohlc/token          | [See CU cost](https://docs.birdeye.so/docs/multi-factor-cu-cost)                      |
| [Liquidity OHLC - Pair](../../../data-api/price-ohlcv/get-defi-v3-liquidity-ohlc-pair)                                   | /defi/v3/liquidity/ohlc/pair           | [See CU cost](https://docs.birdeye.so/docs/multi-factor-cu-cost)                      |
| **Balance & Transfer**                                                                                                       |                                        |                                                                                       |
| [Wallet - Balance Change](../../../data-api/balance-transfer/get-wallet-v2-balance-change#/)                                  | /wallet/v2/balance-change              | 10                                                                                    |
| [Wallet - Tokens Balance](../../../data-api/balance-transfer/get-v1-wallet-token-balance#/)                                   | /wallet/v2/token-balance               | [See batch CU cost](https://docs.birdeye.so/docs/batch-token-cu-cost#/)               |
| [Token - Transfer List](../../../data-api/balance-transfer/post-token-v1-transfer)                                            | token/v1/transfer                      | 10                                                                                    |
| [Token - Transfer Total](../../../data-api/balance-transfer/post-token-v1-transfer-total)                                     | token/v1/transfer/total                | 1                                                                                     |
| [Wallet - Transfer](../../../data-api/balance-transfer/post-wallet-v2-transfer)                                               | wallet/v2/transfer                     | 10                                                                                    |
| [Wallet - Transfer total](../../../data-api/balance-transfer/post-wallet-v2-transfer-total)                                   | wallet/v2/transfer/total               | 1                                                                                     |
| [Wallet - Token Balance (Beta)](../../../data-api/balance-transfer/get-v1-wallet-token-balance#/)                             | /v1/wallet/token_balance               | 5                                                                                     |
| [Wallet - Identity](../../../data-api/wallet-identity/get-identity-v1-single)                                                | /identity/v1/single                    | 40                                                                                    |
| [Wallet - Identity Domain](../../../data-api/wallet-identity/get-identity-v1-domains)                                        | /identity/v1/domains                   | 5                                                                                     |
| **Blockchain**                                                                                                               |                                        |                                                                                       |
| [Trades - Latest Block Number](../../../data-api/blockchain/get-defi-v3-txs-latest-block#/)                             | /defi/v3/txs/latest-block              | 1                                                                                     |
| [Supported networks](../../../data-api/blockchain/get-defi-networks#/)                                                  | /defi/networks                         | 1                                                                                     |
|                                                                                                                              | /blockchain/v1/account/detail          | 5                                                                                     |
|                                                                                                                              | /blockchain/v1/account/token-accounts  | 2                                                                                     |
|                                                                                                                              | /blockchain/v1/token/metadata          | 5                                                                                     |
|                                                                                                                              | /blockchain/v1/transaction/detail      | 10                                                                                    |
| **Creation & Trending**                                                                                                      |                                        |                                                                                       |
| [Token - Creation Info](../../../data-api/creation-trending/get-defi-token-creation-info#/)                                    | /defi/token_creation_info              | 40                                                                                    |
| [Token- Trending List](../../../data-api/creation-trending/get-defi-token-trending#/)                                          | /defi/token_trending                   | 30                                                                                    |
| **Meme**                                                                                                                     |                                        |                                                                                       |
| [Meme Token Detail - Single](../../../data-api/meme/get-defi-v3-token-meme-detail-single#/)                       | /defi/v3/token/meme/detail/single      | 20                                                                                    |
| [Meme Token - List](../../../data-api/meme/get-defi-v3-token-meme-list#/)                                         | /defi/v3/token/meme/list               | 40                                                                                    |
| **Security**                                                                                                                 |                                        |                                                                                       |
| [Token - Security](../../../data-api/security/get-defi-token-security#/)                                              | /defi/token_security                   | 25                                                                                    |
| **Smart Money**                                                                                                              |                                        |                                                                                       |
| [Smart Money - Token List](https://public-api.birdeye.so/smart-money/v1/token/list)                                          | /smart-money/v1/token/list             | 20                                                                                    |
| **Dex & Protocol**                                                                                                           |                                        |                                                                                       |
| [Market history](https://docs.birdeye.so/reference/get-defi-v3-market-history)                                               | /market/v1/blockchain-metrics          | 40                                                                                    |
| **Alltime & History**                                                                                                        |                                        |                                                                                       |
| [All Time Trades (Single)](../../../data-api/alltime-history/get-defi-v3-all-time-trades-single#/)                           | /defi/v3/all-time/trades/single        | 20                                                                                    |
| [All Time Trades (Multiple)](../../../data-api/alltime-history/post-defi-v3-all-time-trades-multiple#/)                      | /defi/v3/all-time/trades/multiple      | [See batch CU cost](https://docs.birdeye.so/docs/batch-token-cu-cost#/)               |
| **Search & Utils**                                                                                                           |                                        |                                                                                       |
| [Search - Token, Market Data](../../../data-api/search-utils/get-defi-v3-search#/)                                        | /defi/v3/search                        | 30                                                                                    |
| [Utils - Credits Usage of current account](../../../data-api/search-utils/get-utils-v1-credits)                           | /utils/v1/credits                      | 1                                                                                     |
| **Perps Data**                                                                                                               |                                        |                                                                                       |
| [Perps Token List](../../../perps-api/perps-token/get-perps-v1-token-list)                                              | /perps/v1/token/list                   | 10                                                                                    |
| [Perps Token Overview](../../../perps-api/perps-token/get-perps-v1-token-overview)                                      | /perps/v1/token/overview               | 5                                                                                     |
| [Perps Token Open Positions](../../../perps-api/perps-token/get-perps-v1-token-open-positions)                          | /perps/v1/token/open_positions         | 5                                                                                     |
| [Perps Token Liquidation Map](../../../perps-api/perps-token/get-perps-v1-token-liquidation-map)                        | /token/liquidation_map                 | 20                                                                                    |
| [Perps Wallet List](../../../perps-api/perps-wallet/get-perps-v1-wallet-list)                                            | /perps/v1/wallet/list                  | 10                                                                                    |
| [Perps Wallet Overview](../../../perps-api/perps-wallet/get-perps-v1-wallet-overview)                                    | /perps/v1/wallet/overview              | 5                                                                                     |
| [Perps Wallet Open Positions](../../../perps-api/perps-wallet/get-perps-v1-wallet-open-positions)                        | /perps/v1/wallet/open_positions        | 5                                                                                     |

<br />

## Websocket

<Table align={["left","left"]}>
  <thead>
    <tr>
      <th>
        Websocket
      </th>

      <th>
        Cost (CUPB - Compute Unit Per Byte)
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        [SUBSCRIBE_PRICE (OHLCV)](/websockets/subscribe-price-ohlcv)

        [SUBSCRIBE_BASE_QUOTE_PRICE](/websockets/base-quote-ohlcv)
      </td>

      <td>
        0.0015
      </td>
    </tr>

    <tr>
      <td>
        [SUBSCRIBE_TXS](/websockets/tokenpair-transactions)
      </td>

      <td>
        0.00015
      </td>
    </tr>

    <tr>
      <td>
        [SUBSCRIBE_TOKEN_NEW_LISTING](/websockets/new-token-listing)
      </td>

      <td>
        0.06
      </td>
    </tr>

    <tr>
      <td>
        [SUBSCRIBE_NEW_PAIR](/websockets/new-pair)
      </td>

      <td>
        0.05
      </td>
    </tr>

    <tr>
      <td>
        [SUBSCRIBE_LARGE_TRADE_TXS](/websockets/track-large-transactions)
      </td>

      <td>
        0.005
      </td>
    </tr>

    <tr>
      <td>
        [SUBSCRIBE_WALLET_TXS](/websockets/wallet-transactions)
      </td>

      <td>
        0.003
      </td>
    </tr>

    <tr>
      <td>
        [SUBSCRIBE_TOKEN_STATS](/websockets/token-stats)
      </td>

      <td>
        0.003
      </td>
    </tr>

    <tr>
      <td>
        [SUBCRIBE_MEME](../../../websockets/meme-stats)
      </td>

      <td>
        0.0015
      </td>
    </tr>

    <tr>
      <td>
        [SUBCRIBE_TRANSFER](../../../websockets/transfer)
      </td>

      <td>
        0.0002
      </td>
    </tr>
  </tbody>
</Table>

<br />

**Note**

- Compute costs are subject to change at any time without prior notice.

<br />
