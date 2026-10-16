---
title: "Solana Portfolio Tracker"
description: "Load holdings, net worth history, and PnL in one parallel batch, then lazy-load price sparklines without starving your rate limit"
---

A portfolio tracker is the feature users open first and refresh most, and it is also where most wallet apps quietly fall apart. They index transactions themselves, reconcile token accounts by hand, recompute cost basis on every load, and then discover none of it survives contact with a wallet holding 200 tokens.

<Card title="TL;DR">
  - Load holdings, net worth history, and PnL in one parallel batch
  - Keep all three inside the wallet endpoint rate limit
  - Lazy-load price sparklines on a separate, throttled budget
</Card>

![Solana portfolio tracker loading architecture with three parallel Birdeye wallet API calls](https://blog-bds.birdeye.so/wp-content/uploads/2026/06/Group-2147211427-1200x675.png)

All requests share the base URL `https://public-api.birdeye.so`, authenticate with the `X-API-KEY` header, and select the network with `x-chain: solana`.

<Warning>
  The three `/wallet/v2/` endpoints below sit in a beta rate limit group: 5 requests per second and 75 per minute, on every package tier, regardless of plan. `history_price` for sparklines is not in that group and counts against your normal account limit instead. Mixing the two budgets is the single biggest mistake in this build.
</Warning>

## Core data: three wallet calls in parallel

Load holdings, net worth history, and PnL together. All three sit comfortably under the wallet rate limit, and the response from each fills a different section of the same screen.

**Endpoint:** [`GET /wallet/v2/current-net-worth`](/data-api/wallet-networth-pnl/get-wallet-v2-current-net-worth), [`GET /wallet/v2/net-worth`](/data-api/wallet-networth-pnl/get-wallet-v2-net-worth), [`POST /wallet/v2/pnl/details`](/data-api/wallet-networth-pnl/post-wallet-v2-pnl-details)

```javascript
const BASE = "https://public-api.birdeye.so";
const HEADERS = { "X-API-KEY": process.env.BIRDEYE_API_KEY, "x-chain": "solana" };

async function loadPortfolio(wallet) {
  const [networth, chart, pnl] = await Promise.all([
    fetch(`${BASE}/wallet/v2/current-net-worth?wallet=${wallet}&sort_type=desc&limit=100`, { headers: HEADERS }),
    fetch(`${BASE}/wallet/v2/net-worth?wallet=${wallet}&count=30&type=1d&sort_type=asc`, { headers: HEADERS }),
    fetch(`${BASE}/wallet/v2/pnl/details`, {
      method: "POST",
      headers: { ...HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ wallet, duration: "30d", limit: 100 })
    })
  ]).then((rs) => Promise.all(rs.map((r) => r.json())));

  return {
    totalValue: networth.data.total_value,
    holdings: networth.data.items,
    history: chart.data.history,
    pnlSummary: pnl.data.summary,
    pnlPerToken: pnl.data.tokens
  };
}
```

<Note>
  Dust filtering is built into `current-net-worth`, do not do it client side. It excludes low liquidity tokens under \$100 by default, and `filter_value` sets a minimum USD value per position. The default `limit` is 20, too small for whale wallets, so set `limit=100` and check `pagination.total`.
</Note>

<Card title="Wallet PnL Tracker" icon="chart-line" href="/use-cases/portfolio-and-wallets/wallet-pnl-tracker">
  Full field breakdown for all three wallet endpoints, including the string versus number gotchas and where the win rate actually lives in the response.
</Card>

<Warning>
  `GET /wallet/v2/pnl` (the older PnL per token endpoint) is deprecated. It caps at 50 tokens per request versus 100 on `POST /wallet/v2/pnl/details`. Migrate now if any code still calls it.
</Warning>

## Lazy-load price sparklines

Sparklines are the small line charts next to each token row, and each one needs its own call, which is why this step runs on a separate budget from the core data.

**Endpoint:** [`GET /defi/history_price`](/data-api/price-ohlcv/get-defi-history-price)

```bash
curl --request GET \
  --url 'https://public-api.birdeye.so/defi/history_price?address=So11111111111111111111111111111111111111112&address_type=token&type=1H&time_from=1780963200&time_to=1781049600' \
  --header 'X-API-KEY: YOUR_API_KEY' \
  --header 'x-chain: solana'
```

<Warning>
  A wallet holding 40 tokens means 40 sparkline calls. Firing them all at once on a Lite plan, capped at 15 requests per second account wide, saturates that limit for several seconds and starves every other request your app makes, including the wallet calls that just loaded the rest of the screen.
</Warning>

<Tip>
  Fetch sparklines only for rows currently visible in the viewport, throttle the queue to a fraction of your package's requests per second, and cache results, since a 24 hour sparkline does not need refreshing more than every few minutes.
</Tip>

## Watch your credit budget

Portfolio trackers are refresh heavy by nature, so wire this in from day one.

**Endpoint:** [`GET /utils/v1/credits`](/data-api/search-utils/get-utils-v1-credits)

<CodeGroup>

```python Python
import requests

url = "https://public-api.birdeye.so/utils/v1/credits"
headers = {"X-API-KEY": "YOUR_API_KEY"}

response = requests.get(url, headers=headers).json()
```

```typescript TypeScript
const response = await fetch("https://public-api.birdeye.so/utils/v1/credits", {
  headers: { "X-API-KEY": "YOUR_API_KEY" }
}).then((res) => res.json());
```

```bash cURL
curl --request GET \
  --url 'https://public-api.birdeye.so/utils/v1/credits' \
  --header 'X-API-KEY: YOUR_API_KEY'
```

</CodeGroup>

<Tip>
  Poll hourly and widen the sparkline refresh interval automatically if remaining credits drop below a safe threshold, rather than letting the tracker run into a 429.
</Tip>

## Before you ship

- Core data loads through one `Promise.all` of exactly three wallet calls, nothing more.
- `limit=100` is set on `current-net-worth`, and `pagination.total` is checked for whale wallets.
- PnL goes through `POST /wallet/v2/pnl/details`, no code path references the deprecated `GET /wallet/v2/pnl`.
- Sparklines fetch only visible rows, throttled below the package's requests per second, with a few minutes of caching.
- Credit usage is observable, so degradation is controlled instead of a surprise 429.

## FAQ

<AccordionGroup>
  <Accordion title="What is the rate limit for the wallet endpoints?">
    All `/wallet/v2/` endpoints are in beta and limited to 5 requests per second and 75 per minute, on every package tier. Standard market data endpoints like `history_price` are not part of that group and instead count against your account level limit, which varies by package.
  </Accordion>

  <Accordion title="Does wallet PnL work on EVM chains?">
    Yes. `POST /wallet/v2/pnl/details` supports EVM networks through `x-chain`, including ethereum, base, bsc, arbitrum, polygon, and optimism. The holdings and net worth chart endpoints in this guide remain Solana only, so an EVM build would pair the PnL endpoint with a different holdings source.
  </Accordion>

  <Accordion title="Can I track multiple wallets at once?">
    Yes, on higher tiers. `POST /wallet/v2/net-worth-summary/multiple` returns net worth for up to 100 wallets in a single call, keeping batch jobs inside the wallet rate limit. Like most batch endpoints, it is available on Business and Enterprise packages only.
  </Accordion>
</AccordionGroup>

Paint the total value, holdings, chart, and PnL from one parallel batch, then stream sparklines in behind it. Users see a complete portfolio in one round trip, and the decorative layer fills in without ever touching the budget that loaded the rest.
