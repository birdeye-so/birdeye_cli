---
title: Compute Unit Cost (included Data Download)
deprecated: false
hidden: true
metadata:
  robots: index
---
# API

Compute units are a measure of the computational resources consumed by each API call. The pricing is based on the complexity and resource requirements of individual APIs.

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th style={{ textAlign: "left" }}>
        API Name
      </th>

      <th style={{ textAlign: "left" }}>
        Endpoint
      </th>

      <th style={{ textAlign: "left" }}>
        Cost (CUs)
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td style={{ textAlign: "left" }}>
        Supported networks
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/networks
      </td>

      <td style={{ textAlign: "left" }}>
        1
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Token Price
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/price
      </td>

      <td style={{ textAlign: "left" }}>
        10
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Price - Multiple
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/multi\_price
      </td>

      <td style={{ textAlign: "left" }}>
        50
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Price - Historical
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/history\_price
      </td>

      <td style={{ textAlign: "left" }}>
        40
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Price - Historical Unix
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/historical\_price\_unix
      </td>

      <td style={{ textAlign: "left" }}>
        5
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Price - Volume (Single)
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/price\_volume/single
      </td>

      <td style={{ textAlign: "left" }}>
        15
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Price - Volume (Multiple)
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/price\_volume/multi
      </td>

      <td style={{ textAlign: "left" }}>
        100
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Trades - Token
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/txs/token
        /defi/txs/token/seek\_by\_time
      </td>

      <td style={{ textAlign: "left" }}>
        10
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Trades - Pair
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/txs/pair
        /defi/txs/pair/seek\_by\_time
      </td>

      <td style={{ textAlign: "left" }}>
        10
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        OHLCV
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/ohlcv
      </td>

      <td style={{ textAlign: "left" }}>
        30
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        OHLCV - Pair
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/ohlcv/pair
      </td>

      <td style={{ textAlign: "left" }}>
        30
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        OHLCV - Base/Quote
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/ohlcv/base\_quote
      </td>

      <td style={{ textAlign: "left" }}>
        30
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Token - List
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/tokenlist
      </td>

      <td style={{ textAlign: "left" }}>
        30
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Token - List v2 (full list, no limit per call, only for business)
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/v2/tokens/all
      </td>

      <td style={{ textAlign: "left" }}>
        995
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Token - New Listing
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/v2/tokens/new\_listing
      </td>

      <td style={{ textAlign: "left" }}>
        80
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Token - Security
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/token\_security
      </td>

      <td style={{ textAlign: "left" }}>
        50
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Defi - Trending tokens
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/token\_trending
      </td>

      <td style={{ textAlign: "left" }}>
        50
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Token - Overview
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/token\_overview
      </td>

      <td style={{ textAlign: "left" }}>
        30
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Defi - Market List
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/v2/markets
      </td>

      <td style={{ textAlign: "left" }}>
        50
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Token - Creation Info
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/token\_creation\_info
      </td>

      <td style={{ textAlign: "left" }}>
        30
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Token - Top traders
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/v2/tokens/top\_traders
      </td>

      <td style={{ textAlign: "left" }}>
        30
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Token - Meta Data (Single)
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/v3/token/meta-data/single
      </td>

      <td style={{ textAlign: "left" }}>
        5
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Token - Meta Data (Multiple)
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/v3/token/meta-data/multiple
      </td>

      <td style={{ textAlign: "left" }}>
        80
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Token - Market Data
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/v3/token/market-data
      </td>

      <td style={{ textAlign: "left" }}>
        15
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Token - Trade Data (Single)
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/v3/token/trading-data/single
      </td>

      <td style={{ textAlign: "left" }}>
        15
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Token - Trade Data (Multiple)
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/v3/token/trading-data/multiple
      </td>

      <td style={{ textAlign: "left" }}>
        100
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Token - Holder List
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/v3/token/holder
      </td>

      <td style={{ textAlign: "left" }}>
        50
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Trader - Top Gainer Losers
      </td>

      <td style={{ textAlign: "left" }}>
        /trader/gainers-losers
      </td>

      <td style={{ textAlign: "left" }}>
        30
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Trader - Seek by Time
      </td>

      <td style={{ textAlign: "left" }}>
        [/trader/txs/seek\_by\_time](https://public-api.birdeye.so/trader/txs/seek_by_time)
      </td>

      <td style={{ textAlign: "left" }}>
        10
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Search
      </td>

      <td style={{ textAlign: "left" }}>
        /defi/v3/search
      </td>

      <td style={{ textAlign: "left" }}>
        100
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Pair - Overview - Single
      </td>

      <td style={{ textAlign: "left" }}>
        [/defi/v3/pair/overview/single](https://public-api.birdeye.so/defi/v3/pair/overview/single)
      </td>

      <td style={{ textAlign: "left" }}>
        20
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Pair - Overview - Multiple
      </td>

      <td style={{ textAlign: "left" }}>
        [/defi/v3/pair/overview/multiple](https://public-api.birdeye.so/defi/v3/pair/overview/multiple)
      </td>

      <td style={{ textAlign: "left" }}>
        100
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Supported Networks
      </td>

      <td style={{ textAlign: "left" }}>
        /v1/wallet/list\_supported\_chain
      </td>

      <td style={{ textAlign: "left" }}>
        1
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Wallet Portfolio
      </td>

      <td style={{ textAlign: "left" }}>
        /v1/wallet/token\_list
      </td>

      <td style={{ textAlign: "left" }}>
        100
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Wallet Portfolio - Multichain
      </td>

      <td style={{ textAlign: "left" }}>
        /v1/wallet/multichain\_token\_list
      </td>

      <td style={{ textAlign: "left" }}>
        200
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Wallet - Token Balance
      </td>

      <td style={{ textAlign: "left" }}>
        /v1/wallet/token\_balance
      </td>

      <td style={{ textAlign: "left" }}>
        5
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Wallet Transaction History
      </td>

      <td style={{ textAlign: "left" }}>
        /v1/wallet/tx\_list
      </td>

      <td style={{ textAlign: "left" }}>
        150
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Wallet Transaction History - Multichain
      </td>

      <td style={{ textAlign: "left" }}>
        /v1/wallet/multichain\_tx\_list
      </td>

      <td style={{ textAlign: "left" }}>
        300
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        Transaction Simulation
      </td>

      <td style={{ textAlign: "left" }}>
        /v1/wallet/simulate
      </td>

      <td style={{ textAlign: "left" }}>
        105
      </td>
    </tr>
  </tbody>
</Table>

# Websocket

| Websocket                  | Cost (CUPB - Compute Unit Per Byte) |
| :------------------------- | :---------------------------------- |
| ohlcv (price & base-quote) | 0.006                               |
| transactions               | 0.0008                              |
| newListing                 | 0.1                                 |
| newPair                    | 0.06                                |
| large trades               | 0.006                               |
| wallet txs                 | 0.006                               |

# Data Download

If you export and download historical data, Compute units are a measure of the computational resources consumed by each Rows in the CSV. file

| Data Download (CSV. File) - Data Type | Cost (CUPR - Compute Unit Per Row) |
| :------------------------------------ | :--------------------------------- |
| Trades                                | 0.2                                |
| Trending Tokens                       | 3.0                                |