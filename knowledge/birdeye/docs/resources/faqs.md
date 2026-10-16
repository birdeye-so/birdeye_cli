---
title: "FAQs - Frequently asked questions"
icon: "messages-question"
---

## How far back do you have price/charts for SOL?

We have SOL price/charts data back to **2021-12-09**.

## What is Birdeye Data?

Birdeye Data provides APIs and WebSocket streams for developers, traders, and businesses to access detailed information on tokens, wallets, DEX trades, and more.

## How can I access the API?

You can access the API by signing up for an account and generating an API key from your dashboard. This key is required in the header of all your requests.

**Getting Your API Key**

1. Log in at [https://bds.birdeye.so/auth/sign-in](https://bds.birdeye.so/auth/sign-in)
2. Access the Security tab: In your Dashboard, look for a section labeled “Security”.
3. Generate API key: Within the Security section, generate an API key.
4. Configure key settings (optional): Add a name/description or adjust permissions (if available).
5. Generate the key: Click “Generate” or “Create”.
6. Copy the API key: Store it securely. You’ll use it to authenticate API requests.

## What data does the API provide?

Birdeye Data’s API gives you access to wallet activity, real-time token prices, historical price charts, trading volume, liquidity pools, swap transactions, and more.

## Which blockchains does Birdeye support?

Birdeye Data supports **180\+ DEXes** across major blockchains including **Solana**, **Ethereum**, **BNB Chain**, and others. This provides wide market coverage and real-time insights.

## How often is the data updated?

Data is updated in **real-time**, with **50M\+** trade events processed daily. This ensures you’re always working with the latest market information.

## Is there documentation available?

Yes. You can find complete API documentation, code examples, and endpoint references under the “API Documentation” section on the site.

## Can I use Birdeye for building trading bots?

Yes. The high-frequency and accurate data from Birdeye’s API is suitable for algorithmic trading bots, arbitrage tools, and analytics dashboards.

## How secure is my data with Birdeye?

Birdeye protects data through industry-standard encryption and secure API key authentication. We do not store sensitive information such as private keys or user passwords. Requests are authorized via securely generated API tokens.

## How do I contact support?

You can reach the team via the “Contact” section in the top menu of the website or by sending an email to the support team.

## What should I do if my card fails during payment?

If your card payment fails:

- Make sure your card has sufficient balance
- Confirm it’s enabled for international and online transactions
- Ensure the card is not expired

If issues persist, try a different card or contact your bank. You can also consider crypto payment options supported on the platform.

## How can I start using Birdeye’s APIs?

- Register for a Birdeye account
- Obtain API keys from your dashboard
- Choose a subscription plan that fits your needs
- Integrate the APIs into your application using the provided documentation

## What are the available subscription plans?

Birdeye offers several plans:

- **Standard**: Free, includes **30,000** Compute Units (CUs) per month
- **Lite**: **\$39/month**, includes **1.5M** CUs
- **Starter**: **\$99/month**, includes **5M** CUs
- **Premium**: **\$199/month**, includes **15M** CUs
- **Premium Plus**: **\$250/month**, includes **20M** CUs with WebSocket supported
- **Business**: **\$699/month**, includes **100M** CU with WebSocket supported and access to batch endpoints

## What payment methods are accepted?

Birdeye accepts payments via:

- **Fiat**: Major credit cards through Stripe
- **Cryptocurrency**: Payments in cryptocurrencies like USDC and USDT on supported networks such as Solana, Ethereum, and Polygon

## Is there a free trial available?

Yes. The **Standard** plan is free and allows users to explore the platform with **30,000 CUs per month**.

## Can I upgrade or downgrade my subscription?

Yes. You can change your subscription plan at any time through your account dashboard.

## What happens if I exceed my monthly CU limit?

If you exceed your plan’s CU limit, additional charges apply based on your subscription tier. For example, in the Starter plan, each additional **1M CUs** costs **\$23**.

## What kind of support does Birdeye offer?

Support varies by plan:

- **Standard**: Community support
- **Starter**: Email support
- **Premium**: Priority email support
- **Business**: Dedicated account manager and 24/7 support

## How do I authenticate with the BDS API?

Include your API key as:

- a query parameter: `api_key=YOUR_KEY`, or
- in the `x-api-key` header for each request

Some public endpoints do not require authentication, but most do.

## Can I filter tokens by custom criteria (like meme coins or low MC)?

Yes. Token List V3 supports filtering options such as market cap range, FDV range, liquidity, volume, price change (%), and chain.

## Is there a sandbox or testnet environment?

No. BDS operates entirely on mainnet data. For development, you can use free/public endpoints or a trial API key with limited rate limits.

## Is there rate limiting, and how can I avoid getting blocked?

Yes. BDS applies rate limits per plan (for example, Starter is about **~60 requests/min**, and Premium/Business have higher capacity). Avoid polling aggressively.

## Can I fetch multiple tokens’ market data in a single request?

Yes. Use Multi Token Trade Data (Premium\+), which lets you query trade stats for up to **100 tokens** in one call.

## How do I identify honeypot or scam tokens using BDS?

You can infer risk signals by looking for sudden liquidity changes, abnormal holder distribution, missing/unknown token metadata (e.g., no verified logo), very short token lifetime, unusually high slippage, or very low trade count.

## Does BDS API support localization or multi-currency?

No. All pricing and output are in USD and English by default. You can convert values on your backend if needed.

## Can I get alerts for new token listings or large trades?

Yes. If you are on **Premium Plus**, you can subscribe to WebSocket streams for token listings, price updates, and liquidity changes.

## Can I track cross-chain versions of the same token?

BDS treats tokens as chain-specific entities. There is no built-in canonical mapping, but you can normalize manually using symbol, name, or contract address patterns.

## How do I efficiently fetch market data for hundreds of tokens without hitting rate limits?

Use multi-token endpoints where available, cache responses, batch requests (bulk fetch intervals), and consider Business\+ for WebSocket access when you need real-time streaming.

## Can I track token holders over time to detect whales entering/exiting?

Yes. Use the `/token/holders` endpoint and store snapshots over time, then compare changes to detect whale movement.

## How do I detect a new token before it trends?

Use the WebSocket feed for new token listings, then filter by chain/liquidity/volume and apply your own heuristics/filters.

## Can I integrate BDS with my Telegram bot for real-time alerts?

Yes. Consume WebSocket feeds and pipe the stream into a bot using any Telegram bot framework.

## Is it possible to build a wallet dashboard with portfolio and PnL tracking using BDS?

Yes. Use `wallet/portfolio`, `token/price-chart`, and `token/holders` endpoints. You’ll need to track deposits/withdrawals on your backend to compute accurate PnL.

## Does BDS provide gas fee or transaction cost data?

No. BDS focuses on token price, trade, liquidity, and holders. Use chain RPCs or explorers for gas/fee data.

## How accurate is the volume and liquidity on new tokens?

BDS reflects confirmed on-chain DEX activity. Check whether the DEX is indexed and watch for spoofed liquidity patterns.

## How should I store token metadata (e.g., symbol, decimals, logo)?

Use `/defi/v3/token/meta-data` to fetch metadata and cache it locally. Refresh the cache when new tokens appear or when contracts/metadata change.

## Can I backtest trading strategies using BDS historical data?

Yes. Use `/token/price-chart` for OHLC data and `/token/trades` for trade history (if your plan allows).

## Can I embed Birdeye’s live data into a widget or frontend component?

Yes. Use the JSON responses in your frontend framework. Proxy API calls through your backend to avoid exposing API keys in the client.

## Does BDS support scaled UI amount?

Yes. BDS supports Scaled UI Amount (introduced in Solana’s Token-2022 standard).

## What values are supported for ui\_amount\_mode and what do they mean?

- `raw` (default): returns the on-chain integer amount (atomic units)
- `scaled`: returns the amount adjusted by decimals (e.g., 1.2345 tokens)
- `both`: returns both raw and scaled fields (scaled fields are prefixed with `scaled_`)

## What is the CU Carry-Over Policy?

Starting **July 1, 2025**, for prepaid subscriptions of **6 months or longer**, unused Compute Units (CUs) from any month are carried forward and available throughout the entire prepaid term (no monthly reset). Unused CUs expire at the end of the subscription term and do not carry into a new term.

## Who is eligible for carry-over?

Only customers on prepaid plans with a duration of at least **6 months** qualify. Monthly billed plans or plans shorter than 6 months are not eligible for carry-forward.

## What about shorter or monthly subscriptions?

Monthly or shorter-term subscriptions (under 6 months) do not carry over unused CUs; unused CUs are forfeited at the end of the month/term.

## How does it work in practice?

Imagine a 12-month prepaid plan offering 50M CUs/month = 600M CUs total. If you use only 30M in January, the remaining 570M remain available for later within that 12-month period. Once the term ends, any leftover CUs do not roll into the next period.

## Are there overage charges?

Within the prepaid term, there are no overage charges once the included CU quota is used; the plan simply ends or renews. Any excess usage beyond included CUs may require a renewal.

## Is this policy retroactive?

No. This policy is effective starting **July 1, 2025**. Prepaid terms started after that date qualify; earlier terms may follow prior conditions.

## Can I upgrade or downgrade and still carry over CUs?

Carry-over only applies to eligible prepaid plans. Upgrades, downgrades, or cancellations that end the subscription term do not transfer unused CUs; remaining CUs expire at the term’s conclusion.

## Who should I contact for Enterprise or custom terms?

If you have an Enterprise-level or custom agreement, contact your Birdeye account manager. Enterprise plans may have tailored carry-over terms or alternative arrangements.

## If I upgrade or downgrade, what changes?

- Upgrading: New package takes effect immediately; increased rate limits, compute units, and endpoint access become available instantly.
- Downgrading: Immediate reduction in limits and access; no prorated credit or CU carry-over applies.
- Canceling: Access continues until the billing cycle end; no refund and unused CUs are forfeited.
