---
title: "Rate Limiting"
description: "Birdeye Data provides powerful APIs for accessing and analyzing data. To ensure fair usage and maintain system stability, Birdeye Data implements rate limiting."
metadata:
  robots: "index"
next:

---

# Per User Account Rate Limit

Birdeye Data applies a rate limit at the user account level. This rate limit dictates the total number of requests that can be made across all APIs associated with a user account within a specified time frame. Birdeye's data APIs are designed to cater to users with varying needs, and as such, we offer different tiers of access with corresponding rate limits. This page outlines the rate limits for each tier: Free, Premium, Business, and Enterprise. View details for each tiers below.

> 📘 Your Rate Limit is Per User Account
>
> It's important to note that the actual rate limit that is applied when you use Birdeye APIs is **PER ACCOUNT** rather than per individual API. This means that the rate limit applies to the total number of requests made across all APIs associated with your Birdeye Data Services account.

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        Tier
      </th>

      <th>
        API Endpoints Access
      </th>

      <th>
        Rate Limit per account (rps/ rpm

        *

        )
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        **Standard**
      </td>

      <td>
        Limited to 3 specific endpoints. [Details.](/guides/data-accessibility-by-packages)
      </td>

      <td>
        1 rps
      </td>
    </tr>

    <tr>
      <td>
        **Lite**
      </td>

      <td>
        Full set of all APIs available. [Details](/guides/data-accessibility-by-packages)
      </td>

      <td>
        15 rps
      </td>
    </tr>

    <tr>
      <td>
        **Starter**
      </td>

      <td>
        Full set of all APIs available. [Details](/guides/data-accessibility-by-packages)
      </td>

      <td>
        15 rps
      </td>
    </tr>

    <tr>
      <td>
        **Premium**
      </td>

      <td>
        Full set of all APIs available. [Details](/guides/data-accessibility-by-packages)
      </td>

      <td>
        50 rps/ 1000 rpm
      </td>
    </tr>

    <tr>
      <td>
        **Business**
      </td>

      <td>
        Full set of APIs available. [Details](/guides/data-accessibility-by-packages)\
        Websocket Access Available
      </td>

      <td>
        100 rps/ 1500 rpm
      </td>
    </tr>

    <tr>
      <td>
        **Enterprise**
      </td>

      <td>
        Tailored to the specific needs of the enterprise.
      </td>

      <td>
        Custom
      </td>
    </tr>
  </tbody>
</Table>

\*rps: requests per second

\*rpm: requests per minute

---

# Per API Rate Limit

| **API Name** | **API Endpoint** | **Rate Limit (rps)** |
| :-- | :-- | :-- |
| Price | `/defi/price` | 300 |
| Price - Multiple | `/defi/multi_price` | 300 |
| Price - Historical | `/defi/history_price` | 100 |
| Price - Historical by Unix Time | `/defi/historical_price_unix` | 100 |
| Trades - Token | `/defi/txs/token` | 100 |
| Trades - Pair | `/defi/txs/pair` | 100 |
| Trades - Token Seek By Time | `/defi/txs/token/seek_by_time` | 100 |
| Trades - Pair Seek By Time | `/defi/txs/pair/seek_by_time` | 100 |
| Trades - Token (V3) | `/defi/v3/token/txs` | 100 |
| OHLCV | `/defi/ohlcv` | 100 |
| OHLCV - Pair | `/defi/ohlcv/pair` | 100 |
| OHLCV - Base/Quote | `/defi/ohlcv/base_quote` | 300 |
| Price Volume - Single | `/defi/price_volume/single` | 300 |
| Price Volume - Multi | `/defi/price_volume/multi` | 300 |
| Pair - Overview (Single) | `/defi/v3/pair/overview/single` | 100 |
| Pair - Overview (Multiple) | `/defi/v3/pair/overview/multiple` | 100 |
| Trade v3 - All | `/defi/v3/txs` | 100 |
| Token - List (V1) | `/defi/tokenlist` | 150 |
| Token - Security | `/defi/token_security` | 150 |
| Token - Overview | `/defi/token_overview` | 300 |
| Token - Creation Token Info | `/defi/token_creation_info` | 100 |
| Token - Trending List | `/defi/token_trending` | 100 |
| Token - New Listing | `/defi/v2/tokens/new_listing` | 100 |
| Token - Top Traders | `/defi/v2/tokens/top_traders` | 300 |
| Token - All Market List | `/defi/v2/markets` | 100 |
| Token - Metadata (Single) | `/defi/v3/token/meta-data/single` | 300 |
| Token - Metadata (Multiple) | `/defi/v3/token/meta-data/multiple` | 300 |
| Token - Market Data | `/defi/v3/token/market-data` | 300 |
| Token - Market Data (Multiple) | `/defi/v3/token/market-data/multiple` | 300 |
| Token - Trade Data (Single) | `/defi/v3/token/trade-data/single` | 300 |
| Token - Trade Data (Multiple) | `/defi/v3/token/trade-data/multiple` | 300 |
| Token - Holder | `/defi/v3/token/holder` | 100 |
| Token - Mint/Burn | `/defi/v3/token/mint-burn-txs` | 100 |
| Token - List (V3) | `/defi/v3/token/list` | 100 |
| Token - List (V3) scroll | `/defi/v3/token/list/scroll` | 2 |
| Alltime - Trades (Single) | `/defi/v3/all-time/trades/single` | 300 |
| Alltime - Trades (Multiple) | `/defi/v3/all-time/trades/multiple` | 300 |
| Trader - Gainers/Losers | `/trader/gainers-losers` | 100 |
| Trader - Trades Seek By Time | `/trader/txs/seek_by_time` | 100 |
| Wallet Portfolio | `/v1/wallet/token_list` | 30 rps / 150 rpm |
| Wallet Transaction History | `/v1/wallet/tx_list` | 30 rps / 150 rpm |
| Wallet - Token Balance | `/v1/wallet/token_balance` | 30 rps / 150 rpm |
| Search | `/defi/v3/search` | 100 |
| Supported Networks | `/defi/networks` | 100 |
| Wallet Supported Networks | `/v1/wallet/list_supported_chain` | 30 rps / 150 rpm |
| Trade - Latest block number | `/defi/v3/txs/latest-block` | 100 |

For most APIs within Birdeye Data Services, a very high limit is applied and our clients can query as much as their user account rate limit allows. However there are some exceptions for the heavier APIs that have lower rate limit:

### **Wallet API Group**

It's important to note that endpoints belonging to the Wallet API group have a different rate limit due to their sensitive nature and potential for high-frequency updates. The rate limit for endpoints within the Wallet API group is set to **30 requests per minute (rpm)**. This stricter rate limit helps to mitigate excessive traffic and maintain optimal performance for these critical endpoints.

These endpoints include:

| No. | API | Description | Endpoint | Rate Limit (rpm) |
| :-- | :-- | :-- | :-- | :-- |
| 1 | List of Supported Chains | Provides a list of supported blockchains that are available for wallet integration through the Birdeye APIs. | [https://docs.birdeye.so/reference/get\_v1-wallet-list-supported-chain](../../../../data-api/wallet-networth-pnl/get-v1-wallet-list-supported-chain) | 30 |
| 2 | Wallet - Portfolio - Selected Chain | Access detailed information about a user's portfolio, including current holdings, transaction history, and performance metrics. | [https://docs.birdeye.so/reference/get\_v1-wallet-token-list](../../../../data-api/wallet-networth-pnl/get-v1-wallet-token-list) | 30 |
| 3 | Wallet - Portfolio - Multichain | Retrieve portfolio data across multiple blockchain networks, providing a comprehensive view of the user's assets. | [https://docs.birdeye.so/reference/get\_v1-wallet-multichain-token-list](https://docs.birdeye.so/reference/get_v1-wallet-multichain-token-list) | 30 |
| 4 | Wallet - Token Balance | Check wallet's balance of a specific token. | [https://docs.birdeye.so/reference/get\_v1-wallet-token-balance](../../../../data-api/balance-transfer/get-v1-wallet-token-balance) | 30 |
| 5 | Wallet - Transaction List - Selected Chain | Retrieve portfolio data of a wallet in a specific blockchain network, providing a comprehensive view of the user's assets. | [https://docs.birdeye.so/reference/get\_v1-wallet-tx-list](../../../../data-api/wallet-networth-pnl/get-v1-wallet-tx-list) | 30 |
| 6 | Wallet - Transaction List - Multichain | Access a consolidated transaction history that spans various blockchain networks, providing users with a comprehensive record of their multichain activities. | [https://docs.birdeye.so/reference/get\_v1-wallet-multichain-tx-list](https://docs.birdeye.so/reference/get_v1-wallet-multichain-tx-list) | 30 |
| 7 | Transaction Simulation | Retrieve a preview of transactions for users to check before they finalize and sign the transaction. | [https://docs.birdeye.so/reference/post\_v1-wallet-simulate](https://docs.birdeye.so/reference/post_v1-wallet-simulate) | 30 |

---

# Managing Rate Limits:

To ensure optimal performance and prevent exceeding your rate limit, consider the following best practices:

- **Monitor Usage:** Keep track of your API usage to stay within your allotted rate limit. Monitoring tools and dashboards can help you track usage patterns and identify any potential issues.
- **Prioritize Requests:** Prioritize your API requests based on their importance and frequency. Allocate resources efficiently to ensure critical operations are not hindered by rate limits.
- **Implement Backoff Strategies:** Implement backoff strategies to gracefully handle rate limit exceeded errors. This may include implementing exponential backoff or retry-after mechanisms to retry failed requests after a delay.
- **Upgrade Packages:** If you consistently find yourself hitting the rate limit of your current package, consider upgrading to a higher-tier package with a higher rate limit to accommodate your growing needs.

By understanding and effectively managing the rate limits associated with Birdeye Data Services packages, you can optimize your usage of our APIs and unlock the full potential of our data-driven solutions.

---

# Usage Guidelines

**API Key Requirement:** All tiers require an API key for authentication. [Details](/authentication)

**Rate Limit Enforcement:** Adhering to the specified rate limits is essential to ensure fair usage and optimal performance for all users.

**Upgrade Options:** Users interested in higher tiers with expanded features can upgrade their subscription through the Birdeye dashboard.

**Enterprise Customization:** Enterprises seeking specialized data access and rate limits can reach out to our sales team for personalized solutions.

# Need Assistance?

If you have any questions, encounter issues, or require assistance with rate limits or tier upgrades, please contact our sales team or support [HERE](https://docs.birdeye.so/docs/enterprise-contact). We are here to help you make the most out of Birdeye's data APIs! 🚀📊
