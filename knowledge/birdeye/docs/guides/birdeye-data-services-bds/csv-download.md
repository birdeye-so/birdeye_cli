---
title: Data Download (CSV. File)
deprecated: false
hidden: true
metadata:
  robots: index
---
# Birdeye Historical Data Download Documentation

## Introduction

The [Data Download (CSV. File) service](https://bds.birdeye.so/csv) allows you to export and download the historical data (trades, trending tokens,...) for your own needs, such as backtesting your trading strategies, analyzing trading activity of other wallets, finding hot tokens,...

* Trades Data: Comprehensive trade history by tokens (or by specific token pairs/pools, or wallets) across [supported DEXs and networks](https://docs.birdeye.so/docs/data-coverage#/).
* Tokens Data: Trending tokens across [supported DEXs and networks](https://docs.birdeye.so/docs/data-coverage#/).

This service ensures users receive Birdeye's latest available data when downloading.

## How To Download The Data

You can access and use the service in many ways:

**Become PRO users at Birdeye.so**

* PRO users on [Birdeye.so](https://www.birdeye.so/) can download 100 CSV files/month. [Read more](https://docs.birdeye.so/docs/exclusive-features#/details).
* Connect your account and wallet; Access [Birdeye PRO](https://www.birdeye.so/pro) to upgrade your account.
* Visit [Find Trades](https://www.birdeye.so/find-trades) and click on Export CSV to download the Trades data
* Visit [Find Gems](https://www.birdeye.so/find-gems) and click on Export CSV to download the Trending Tokens data

**Convenient One-off Payment Order**

* If you are on the FREE package, you can pay with a credit card for each download.
* This method does not limit the number of downloads.
* Visit the [Birdeye Data Service Dashboard]() to download the data.

**Upgrade your package at Birdeye Data Services**

* Each package (Starter, Premium, Business, Enterprise) at Birdeye Data Services includes a set amount of available CUs and you can use this amount to download CSV. files.
* Payment by credit card is still applicable for users using upgraded packages.
* This method does not limit the number of downloads.
* Visit the [Birdeye Data Service Dashboard]() to download the data.

Learn more about the types of data that each package on the Birdeye Data Service can access in the session [Data Accessibility by Packages](/guides/data-accessibility-by-packages).

## Data Description

### Trades Data CSV. Schema

The CSV. file of the Trades data contains the following fields:

| Column name              | Data Type | Description                                                                                                     | Example                                                                                  |
| :----------------------- | :-------- | :-------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------- |
| network                  | String    | Name of the blockchain where the tokens are traded                                                              | Solana                                                                                   |
| tx\_hash                 | String    | A unique identifier representing the transaction hash for the trade on the blockchain.                          | 3c84aUaURDf6WysS2n3j7GP67zvW1a6b1wZUcQ54W1gp45K45TfKNBkk2ANZLXU5MZ7RmjgdtD6LUrkEsf36zvxZ |
| owner                    | String    | Address of wallet that made transaction                                                                         | BnwZvGydWCKzpRGAkeTKH73NVDfy38Dpj9nbpsbiw6tR                                             |
| pair\_address            | String    | Address of token pair/pool where the tokens are traded                                                          | 8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC                                             |
| unix\_time               | Integer   | Address of token pair/pool where the tokens are traded                                                          | 8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hXSEqdGC                                             |
| time                     | ISO8601   | The time the transaction was executed, displayed as exact date and time value                                   | 2024-12-25T17:05:06.000Z                                                                 |
| source                   | String    | Exchange where the tokens are traded                                                                            | marinade                                                                                 |
| platform                 | String    | The platform (DEX or DEX Aggregator) where the tokens are traded                                                | Jupiter                                                                                  |
| tx\_hash                 | String    | Transaction direction (swap/ mint\_add\_liquidity/ burn\_remove\_liquidity)                                     | swap                                                                                     |
| volume                   | Float     | The volume of the transaction in the amount of the token that are swapped from the other token (received token) | 15664.753347723                                                                          |
| volume\_usd              | Float     | The volume of the transaction in USD value                                                                      | 3849423.8753278400                                                                       |
| from\_address            | String    | Address of the token that are swapped to the other token (spent token)                                          | So11111111111111111111111111111111111111112                                              |
| from\_token\_price       | Float     | Price of the token that are swapped to the other token (spent token) in USD value                               | 196.80081162207800                                                                       |
| from\_symbol             | String    | Symbol of the token that are swapped to the other token (spent token)                                           | SOL                                                                                      |
| from\_decimals           | Integer   | Decimals of the token that are swapped to the other token (spent token)                                         | 9                                                                                        |
| from\_amount             | Integer   | Raw amount of the token that are swapped to the other token (spent token)                                       | 19560000000000                                                                           |
| from\_ui\_amount         | Float     | Display Amount of the token that are swapped to the other token (spent token)                                   | 19560                                                                                    |
| from\_ui\_change\_amount | Float     | The changed amount of the token that are swapped to the other token (spent token) in owner’s wallet             | -19560                                                                                   |
| to\_address              | String    | Address of the token that are swapped from the other token (received token)                                     | mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So                                              |
| to\_token\_price         | Float     | Price of the token that are swapped from the other token (received token) in USD value                          | 245.61106028492500                                                                       |
| to\_symbol               | String    | Symbol of the token that are swapped from the other token                                                       | mSOL                                                                                     |
| to\_decimals             | Integer   | Decimals of the token that are swapped from the other token (received token)                                    | 9                                                                                        |
| to\_amount               | Integer   | Raw amount of the token that are swapped from the other token (received token)                                  | 15664753347723                                                                           |
| to\_ui\_amount           | Float     | Display Amount of the token that are swapped from the other token (received token)                              | 15664.753347723                                                                          |
| to\_ui\_change\_amount   | Float     | The changed amount of the token that are swapped from the other token (received token) in owner’s wallet        | 15664.753347723                                                                          |

### Tokens Data CSV. Schema

The CSV. file of the Tokens data contains the following fields:

<Table align={["left","left","left","left"]}>
  <thead>
    <tr>
      <th style={{ textAlign: "left" }}>
        Column name
      </th>

      <th style={{ textAlign: "left" }}>
        Data Type
      </th>

      <th style={{ textAlign: "left" }}>
        Description
      </th>

      <th style={{ textAlign: "left" }}>
        Example
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td style={{ textAlign: "left" }}>
        network
      </td>

      <td style={{ textAlign: "left" }}>
        String
      </td>

      <td style={{ textAlign: "left" }}>
        Name of the blockchain where the tokens are traded
      </td>

      <td style={{ textAlign: "left" }}>
        Solana
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        address
      </td>

      <td style={{ textAlign: "left" }}>
        String
      </td>

      <td style={{ textAlign: "left" }}>
        Token address
      </td>

      <td style={{ textAlign: "left" }}>
        CtDyP6W1WZGyZedZLhgpVWkTzvxRtiedhikTdtLzpump
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        name
      </td>

      <td style={{ textAlign: "left" }}>
        String
      </td>

      <td style={{ textAlign: "left" }}>
        Token name
      </td>

      <td style={{ textAlign: "left" }}>
        Wrapped SOL
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        symbol
      </td>

      <td style={{ textAlign: "left" }}>
        String
      </td>

      <td style={{ textAlign: "left" }}>
        Token symbol
      </td>

      <td style={{ textAlign: "left" }}>
        SOL
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        decimals
      </td>

      <td style={{ textAlign: "left" }}>
        Integer
      </td>

      <td style={{ textAlign: "left" }}>
        Token decimals
      </td>

      <td style={{ textAlign: "left" }}>
        9
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        price
      </td>

      <td style={{ textAlign: "left" }}>
        Float
      </td>

      <td style={{ textAlign: "left" }}>
        Token price
      </td>

      <td style={{ textAlign: "left" }}>
        196.80081162207800
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        marketcap
      </td>

      <td style={{ textAlign: "left" }}>
        Float
      </td>

      <td style={{ textAlign: "left" }}>
        Market Cap of the token
        Market Cap = Current Price x Circulating Supply
      </td>

      <td style={{ textAlign: "left" }}>
        97895925573.30739200
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        fdv
      </td>

      <td style={{ textAlign: "left" }}>
        Float
      </td>

      <td style={{ textAlign: "left" }}>
        Fully Diluted Valuation (FDV) of the token
        FDV = Current Price x Total Supply
      </td>

      <td style={{ textAlign: "left" }}>
        119669518247.60936932
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        liquidity
      </td>

      <td style={{ textAlign: "left" }}>
        Float
      </td>

      <td style={{ textAlign: "left" }}>
        Total liquidity (TVL) of all available markets (pools) that had trades in the last 24 hours
      </td>

      <td style={{ textAlign: "left" }}>
        20072476.635493800
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        holders
      </td>

      <td style={{ textAlign: "left" }}>
        Integer
      </td>

      <td style={{ textAlign: "left" }}>
        Number of token holders (wallets)
      </td>

      <td style={{ textAlign: "left" }}>
        144078
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        creation\_time
      </td>

      <td style={{ textAlign: "left" }}>
        Integer
      </td>

      <td style={{ textAlign: "left" }}>
        The time the token was created, displayed as a Unix value
      </td>

      <td style={{ textAlign: "left" }}>
        1734587263
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        last\_trade\_unix\_time
      </td>

      <td style={{ textAlign: "left" }}>
        Integer
      </td>

      <td style={{ textAlign: "left" }}>
        The time the token’s last transaction was executed, displayed as a Unix value
      </td>

      <td style={{ textAlign: "left" }}>
        1734599162
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        market\_count
      </td>

      <td style={{ textAlign: "left" }}>
        Integer
      </td>

      <td style={{ textAlign: "left" }}>
        Number of available token pairs (pools) that have had trades in the last 24 hours
      </td>

      <td style={{ textAlign: "left" }}>
        70
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        trend\_ranking\_24h
      </td>

      <td style={{ textAlign: "left" }}>
        Integer
      </td>

      <td style={{ textAlign: "left" }}>
        Token trending ranking in 24 hours following Birdeye
      </td>

      <td style={{ textAlign: "left" }}>
        1
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        volume\_\[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        Float
      </td>

      <td style={{ textAlign: "left" }}>
        Transaction volume in token amount in \[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        2377031.8643522200
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        volume\_\[timeframe]\_change\_percent
      </td>

      <td style={{ textAlign: "left" }}>
        Float
      </td>

      <td style={{ textAlign: "left" }}>
        Transaction volume in USD value in \[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        33.26848295414160
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        volume\_buy\_\[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        Float
      </td>

      <td style={{ textAlign: "left" }}>
        Transaction buy volume in token amount in \[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        1167603.947695730
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        volume\_buy\_\[timeframe]\_usd
      </td>

      <td style={{ textAlign: "left" }}>
        Float
      </td>

      <td style={{ textAlign: "left" }}>
        Transaction buy volume in USD value in \[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        619467.8385441090
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        volume\_buy\_\[timeframe]\_change\_percent
      </td>

      <td style={{ textAlign: "left" }}>
        Float
      </td>

      <td style={{ textAlign: "left" }}>
        Change in transaction buy volume (%) in \[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        35.76616419369290
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        volume\_sell\_\[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        Float
      </td>

      <td style={{ textAlign: "left" }}>
        Transaction sell volume in token amount in \[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        1209427.9166564900
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        volume\_sell\_\[timeframe]\_usd
      </td>

      <td style={{ textAlign: "left" }}>
        Float
      </td>

      <td style={{ textAlign: "left" }}>
        Transaction sell volume in USD value in \[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        523328.0612769950
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        volume\_sell\_\[timeframe]\_change\_percent
      </td>

      <td style={{ textAlign: "left" }}>
        Float
      </td>

      <td style={{ textAlign: "left" }}>
        Change in transaction sell volume (%) in \[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        30.94284134002670
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        price\_change\_\[timeframe]\_percent
      </td>

      <td style={{ textAlign: "left" }}>
        Float
      </td>

      <td style={{ textAlign: "left" }}>
        Token price change (%) in \[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        -1.0447289244932200
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        trade\_\[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        Integer
      </td>

      <td style={{ textAlign: "left" }}>
        Number of token transaction in \[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        1899
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        trade\_\[timeframe]\_change\_percent
      </td>

      <td style={{ textAlign: "left" }}>
        Float
      </td>

      <td style={{ textAlign: "left" }}>
        Change in the number of token transaction (%) in \[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        29.801777170198200
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        buy\_\[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        Integer
      </td>

      <td style={{ textAlign: "left" }}>
        Number of token buy transaction in \[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        817
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        buy\_\[timeframe]\_change\_percent
      </td>

      <td style={{ textAlign: "left" }}>
        Float
      </td>

      <td style={{ textAlign: "left" }}>
        Change in the number of token buy transaction (%) in \[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        -4.107981220657280
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        sell\_\[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        Integer
      </td>

      <td style={{ textAlign: "left" }}>
        Number of token sell transaction in \[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        1082
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        sell\_\[timeframe]\_change\_percent
      </td>

      <td style={{ textAlign: "left" }}>
        Float
      </td>

      <td style={{ textAlign: "left" }}>
        Change in number of token sell transaction (%) in \[timeframe]
      </td>

      <td style={{ textAlign: "left" }}>
        77.08674304418990
      </td>
    </tr>
  </tbody>
</Table>

### Usage Notes

Formats: The CSV files are UTF-8 encoded and adhere to standard CSV formatting with commas as delimiters.

Decimal mark: . (dot)

Time Zones: All timestamps are in UTC.

Data Accuracy: The data reflects the latest state of our database at the time of download.

## Pricing

The price is calculated based on the number of rows of each exported/downloaded CSV. file.

* Find out the detailed prices (in CUs) of data types in the session [Compute Unit Cost](/guides/what-is-compute-unit-cost).
* Prices in USD will be converted from equivalent Price in CUs based on the rules and formulas in the session [Pricing](https://docs.birdeye.so/docs/pricing#/).

**Payment**

When using Additional (Overage) CUs, you will be charged at your package’s Cost per 1M additional CUs rate.

* If your payment method is credit cards, the payment will be automatically deducted from your card balance when:
  * The Overage CU limit is reached.
  * The package is renewed (if Overage CUs were partially used).
* If your payment method is crypto, the payment will be automatically deducted from your prepaid credit.

Learn more about the package’s Cost per 1M additional CUs rate in session [Pricing](https://docs.birdeye.so/docs/pricing#/) and Additional CUs charging in session [Overage Charge rule](https://docs.birdeye.so/docs/overage-charge-rule#/).

**Pricing Transparency**

* Before downloading a CSV file, you will see the total CU cost, the remaining CUs in their package. Beside, you can check your usage of Additional (Overage) CUs in the [Birdeye Data Services Dashboard](https://bds.birdeye.so/user/overview).
* Birdeye Data Services will show you the details of the payment sources that will be used to pay for the service (Available CUs amount, Additional CUs amount, and your automatically payment) and ask you to review and agree to these before making payment.

If you have additional questions about pricing, Overage CUs, or payment methods, please contact us via [bds@birdye.so](mailto:bds@birdye.so).
