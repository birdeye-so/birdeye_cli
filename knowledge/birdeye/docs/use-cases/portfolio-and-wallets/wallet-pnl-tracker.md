---
title: "Wallet PnL Tracker"
description: "Snapshot net worth, plot the equity curve, compute realized and unrealized profit per token, and compare wallets on a single token"
---

A raw balance shows what a wallet holds right now, but it hides the cost paid to get there and ignores every trade already closed. A wallet PnL tracker answers the question a balance cannot: did this wallet make money, and on which tokens.

<Card title="TL;DR">
  - Snapshot net worth and plot the equity curve
  - Compute realized and unrealized profit and loss per token
  - Compare PnL across multiple wallets on a single token
</Card>

![Reference architecture for a wallet PnL tracker built on Birdeye Data wallet endpoints](https://blog-bds.birdeye.so/wp-content/uploads/2026/07/How-to-Build-a-Solana-Trading-Bot-Data-Layer-with-Birdeye-Data-In-Blog-Design1-1-1200x675.png)

All requests share the base URL `https://public-api.birdeye.so` and authenticate with the `X-API-KEY` header. The snapshot endpoints are Solana only. The PnL endpoints also support twelve EVM chains, selected with the `x-chain` header.

## The three stage pipeline

<Steps>
  <Step title="Snapshot net worth and plot the equity curve">
    The first screen shows two things: what the wallet is worth right now, and how that worth got there.

    **Endpoint:** [`GET /wallet/v2/current-net-worth`](/data-api/wallet-networth-pnl/get-wallet-v2-current-net-worth), [`GET /wallet/v2/net-worth`](/data-api/wallet-networth-pnl/get-wallet-v2-net-worth)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/wallet/v2/current-net-worth"
    params = {"wallet": "YOUR_WALLET", "sort_by": "value", "sort_type": "desc", "limit": 100}
    headers = {"X-API-KEY": "YOUR_API_KEY", "x-chain": "solana"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/wallet/v2/current-net-worth");
    url.search = new URLSearchParams({
      wallet: "YOUR_WALLET",
      sort_by: "value",
      sort_type: "desc",
      limit: "100"
    }).toString();
    
    const response = await fetch(url, {
      headers: { "X-API-KEY": "YOUR_API_KEY", "x-chain": "solana" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/wallet/v2/current-net-worth?wallet=YOUR_WALLET&sort_by=value&sort_type=desc&limit=100' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    </CodeGroup>

    <Warning>
      `total_value`, each holding's `value`, and `balance` come back as JSON strings, not numbers. Parse each to a number before any maths, or you concatenate text instead of summing. `balance` is the raw on chain amount while `amount` is already scaled down, so display `amount` rather than `balance` to avoid a holding inflated by a million times.
    </Warning>

    Add `net-worth` for the equity curve, which returns dated points with a precomputed change.

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/wallet/v2/net-worth?wallet=YOUR_WALLET&type=1d&count=30' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    <Note>
      `count` caps at 90 points. For a longer curve, set `time` to the oldest `timestamp` you already hold and keep `direction=back`, stitching pages onto the front of the series. Unlike `total_value` on the snapshot call, `net_worth` here is already a number, not a string.
    </Note>
  </Step>
  <Step title="Compute realized and unrealized PnL per token">
    This is the engine of the tracker. One POST call returns both the whole wallet summary and the token by token breakdown.

    **Endpoint:** [`POST /wallet/v2/pnl/details`](/data-api/wallet-networth-pnl/post-wallet-v2-pnl-details)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/wallet/v2/pnl/details"
    headers = {"X-API-KEY": "YOUR_API_KEY", "x-chain": "solana", "content-type": "application/json"}
    body = {"wallet": "YOUR_WALLET", "duration": "30d", "limit": 100}
    
    response = requests.post(url, headers=headers, json=body).json()
    ```

    ```typescript TypeScript
    const response = await fetch("https://public-api.birdeye.so/wallet/v2/pnl/details", {
      method: "POST",
      headers: {
        "X-API-KEY": "YOUR_API_KEY",
        "x-chain": "solana",
        "content-type": "application/json"
      },
      body: JSON.stringify({ wallet: "YOUR_WALLET", duration: "30d", limit: 100 })
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request POST \
      --url 'https://public-api.birdeye.so/wallet/v2/pnl/details' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana' \
      --header 'content-type: application/json' \
      --data '{"wallet":"YOUR_WALLET","duration":"30d","limit":100}'
    ```

    </CodeGroup>

    <Warning>
      Three things trip up almost everyone. The payload has no `success` field, so guarding on `response.success` rejects a valid response. Win rate is not at `summary.win_rate`, it lives at `summary.counts.win_rate`. And `pricing.current_price` can be `null` for a token no longer priced, so guard before any unrealized figure that depends on it.
    </Warning>

    <Note>
      Render the table from `pnl.realized_profit_usd`, `pnl.unrealized_usd`, `pnl.total_usd`, and `pnl.avg_profit_per_trade_usd` per token. The wallet header mirrors that shape at `summary.pnl.*` and `summary.unique_tokens`, so one call fills both sections.
    </Note>
  </Step>
  <Step title="Compare wallets on a single token">
    The final stage flips the question: of everyone holding this token, who is up. Pass one mint and a list of wallets to build a holder leaderboard.

    **Endpoint:** [`GET /wallet/v2/pnl/multiple`](/data-api/wallet-networth-pnl/get-wallet-v2-pnl-multiple)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/wallet/v2/pnl/multiple"
    params = {"token_address": "TOKEN_MINT", "wallets": "WALLET_A,WALLET_B,WALLET_C"}
    headers = {"X-API-KEY": "YOUR_API_KEY", "x-chain": "solana"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/wallet/v2/pnl/multiple");
    url.searchParams.set("token_address", "TOKEN_MINT");
    url.searchParams.set("wallets", "WALLET_A,WALLET_B,WALLET_C");
    
    const response = await fetch(url, {
      headers: { "X-API-KEY": "YOUR_API_KEY", "x-chain": "solana" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/wallet/v2/pnl/multiple?token_address=TOKEN_MINT&wallets=WALLET_A,WALLET_B,WALLET_C' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    </CodeGroup>

    <Warning>
      The parameter names flip from Step 2: here it is `token_address` (singular) and `wallets` (plural), while `pnl/details` takes `wallet` (singular) and an optional `token_addresses` array. Send the wrong pair and the call rejects the request.
    </Warning>

    <Warning>
      The results in `data.data` are an object keyed by wallet address, not an array. Use `Object.entries(data.data)` to get pairs, then sort by `pnl.total_usd` to rank holders. `wallets` caps at 50 addresses per call.
    </Warning>
  </Step>
</Steps>

## Watch your credit budget

A tracker that refreshes on every page view can run up calls quickly, and `pnl/details` is the heaviest call of the three.

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
  Cache the snapshot and PnL response for a wallet and serve it for a short window rather than recomputing on every keystroke or tab switch.
</Tip>

## Before you ship

- String fields `total_value`, `value`, and `balance` are parsed to numbers before maths.
- Holdings display `amount`, not the raw `balance`.
- `pnl/details` is read without a `success` guard, and win rate is taken from `summary.counts.win_rate`.
- `pnl/multiple` results are read with `Object.entries(data.data)`, then sorted by `pnl.total_usd`.
- Responses are cached per wallet, with credits monitored as usage grows.

## FAQ

<AccordionGroup>
  <Accordion title="Does the tracker work on EVM chains or only Solana?">
    The snapshot endpoints, `current-net-worth` and `net-worth`, are Solana only. The two PnL endpoints also support twelve EVM chains, selected with `x-chain`, so the PnL core travels beyond Solana even though the equity curve does not.
  </Accordion>

  <Accordion title="What is the difference between realized and unrealized PnL here?">
    Realized PnL is profit locked in on tokens the wallet has already sold, at `pnl.realized_profit_usd`. Unrealized PnL is the paper gain or loss on tokens still held, at `pnl.unrealized_usd`. `pnl.total_usd` combines both.
  </Accordion>

  <Accordion title="How often should the tracker refresh?">
    Net worth and PnL change only when the wallet trades or prices move, so refreshing every few seconds wastes calls. Cache each wallet's snapshot and PnL for a short window, refresh the equity curve less often than live price, and let the credits endpoint tell you when to widen those windows.
  </Accordion>
</AccordionGroup>

Net worth, an equity curve, per token PnL, and a multi wallet comparison: a raw balance turns into an actual track record.
