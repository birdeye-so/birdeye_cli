---
title: "Smart Money Copy Trading"
description: "Find the tokens smart wallets are buying, verify the wallets behind the flow, score their full history, and monitor them for live moves"
---

Copying a profitable wallet sounds simple until you try to automate it. You need to know which tokens skilled wallets are actually buying, which specific wallets are driving that flow, whether those wallets have a real track record or just got lucky once, and when they enter or exit next. Guessing at any one of those turns a promising idea into a money loser.

<Card title="TL;DR">
  - Find the tokens smart money is buying
  - Identify the wallets driving that flow
  - Score each candidate wallet across its full history
  - Monitor trusted wallets for new moves
</Card>

![Smart money copy trading pipeline showing four endpoints from token discovery to live wallet monitoring](https://blog-bds.birdeye.so/wp-content/uploads/2026/07/How-to-Build-a-Profitable-Smart-Money-Copy-Trading-Signal-in-4-Steps-2-1200x675.png)

All requests share the base URL `https://public-api.birdeye.so`, authenticate with the `X-API-KEY` header, and select the network with `x-chain: solana`.

<Note>
  The signal this pipeline produces is: a wallet worth following just acted. Sizing, routing, and execution stay your own decision downstream of that signal.
</Note>

## The four stage pipeline

<Steps>
  <Step title="Find the tokens smart money is buying">
    Scanning every token on Solana is wasted effort when one endpoint already tells you which tokens skilled wallets are accumulating right now.

    **Endpoint:** [`GET /smart-money/v1/token/list`](/data-api/smart-money/get-smart-money-v1-token-list)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/smart-money/v1/token/list"
    params = {"sort_by": "net_flow", "trader_style": "all", "interval": "1d", "limit": 20}
    headers = {"X-API-KEY": "YOUR_API_KEY", "x-chain": "solana"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/smart-money/v1/token/list");
    url.search = new URLSearchParams({
      sort_by: "net_flow",
      trader_style: "all",
      interval: "1d",
      limit: "20"
    }).toString();
    
    const response = await fetch(url, {
      headers: { "X-API-KEY": "YOUR_API_KEY", "x-chain": "solana" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/smart-money/v1/token/list?sort_by=net_flow&trader_style=all&interval=1d&limit=20' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    </CodeGroup>

    <Tip>
      Sort by `net_flow` for tokens being bought hard right now, or `smart_traders_no` for broad agreement among many skilled wallets rather than a large position from a few. There is no volume sort here.
    </Tip>

    <Warning>
      Treat this list as a watchlist, not a recommendation. Read `volume_buy_usd` against `volume_sell_usd` to confirm the inflow is buying pressure and not churn before carrying a token forward.
    </Warning>
  </Step>
  <Step title="Identify the wallets driving the flow">
    A token level signal hides the wallets underneath it. This call drops from the token down to the individual traders moving it, sorted by realized profit so the wallets that actually booked gains sit at the top.

    **Endpoint:** [`GET /defi/v2/tokens/top_traders`](/data-api/wallet-networth-pnl/get-defi-v2-tokens-top-traders)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/v2/tokens/top_traders"
    params = {
        "address": "TOKEN_ADDRESS",
        "time_frame": "24h",
        "sort_by": "realized_pnl",
        "sort_type": "desc",
        "limit": 10
    }
    headers = {"X-API-KEY": "YOUR_API_KEY", "x-chain": "solana"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/v2/tokens/top_traders");
    url.search = new URLSearchParams({
      address: "TOKEN_ADDRESS",
      time_frame: "24h",
      sort_by: "realized_pnl",
      sort_type: "desc",
      limit: "10"
    }).toString();
    
    const response = await fetch(url, {
      headers: { "X-API-KEY": "YOUR_API_KEY", "x-chain": "solana" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v2/tokens/top_traders?address=TOKEN_ADDRESS&time_frame=24h&sort_by=realized_pnl&sort_type=desc&limit=10' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    </CodeGroup>

    <Warning>
      `address`, `time_frame`, `sort_by`, and `sort_type` are all required. Omitting any one returns a 400 error. This endpoint uses `address`, not `token_address`.
    </Warning>

    <Note>
      Each trader carries a `tags` array of `dev`, `bundler`, `sniper`, and `insider`. Treat a tag as a caution flag that lowers a wallet's priority, not proof of bad behavior. Aggregate volume is `volumeUsd`, while the buy and sell breakdowns are uppercase `volumeBuyUSD` and `volumeSellUSD`.
    </Note>
  </Step>
  <Step title="Score each candidate wallet">
    A wallet can look brilliant on a single token and be reckless everywhere else. Before letting a wallet into the signal set, pull its whole record in one call.

    **Endpoint:** [`POST /wallet/v2/pnl/details`](/data-api/wallet-networth-pnl/post-wallet-v2-pnl-details)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/wallet/v2/pnl/details"
    headers = {
        "X-API-KEY": "YOUR_API_KEY",
        "x-chain": "solana",
        "Content-Type": "application/json"
    }
    body = {
        "wallet": "WALLET_ADDRESS",
        "duration": "all",
        "position_scope": "cumulative",
        "limit": 100
    }
    
    response = requests.post(url, headers=headers, json=body).json()
    ```

    ```typescript TypeScript
    const response = await fetch("https://public-api.birdeye.so/wallet/v2/pnl/details", {
      method: "POST",
      headers: {
        "X-API-KEY": "YOUR_API_KEY",
        "x-chain": "solana",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        wallet: "WALLET_ADDRESS",
        duration: "all",
        position_scope: "cumulative",
        limit: 100
      })
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request POST \
      --url 'https://public-api.birdeye.so/wallet/v2/pnl/details' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana' \
      --header 'Content-Type: application/json' \
      --data '{"wallet":"WALLET_ADDRESS","duration":"all","position_scope":"cumulative","limit":100}'
    ```

    </CodeGroup>

    <Warning>
      For the trust gate this stage exists to run, set `duration` to `all` and `position_scope` to `cumulative`. The default, `duration_only`, scopes the win rate and profit to just the chosen window rather than the wallet's full history.
    </Warning>

    <Note>
      Read the win rate from `data.summary.counts.win_rate`. It arrives as a ratio between 0 and 1, so multiply by 100 to display it. Do not recompute it from `total_win` and `total_loss`, since the denominator counts every unique token the wallet touched, not just wins plus losses. `realized_profit_percent` already arrives as a percentage, so do not scale it again. `pricing.current_price` can be null for a token with no live price, so guard for that before any math.
    </Note>
  </Step>
  <Step title="Monitor trusted wallets for new moves">
    A trusted wallet is only useful while it is acting. This stage watches each wallet so the layer fires the moment one enters or exits a position.

    **Endpoint:** [`GET /trader/txs/seek_by_time`](/data-api/transactions/get-trader-txs-seek-by-time)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/trader/txs/seek_by_time"
    params = {"address": "WALLET_ADDRESS", "tx_type": "swap", "after_time": 1755058900, "limit": 100}
    headers = {"X-API-KEY": "YOUR_API_KEY", "x-chain": "solana"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/trader/txs/seek_by_time");
    url.search = new URLSearchParams({
      address: "WALLET_ADDRESS",
      tx_type: "swap",
      after_time: "1755058900",
      limit: "100"
    }).toString();
    
    const response = await fetch(url, {
      headers: { "X-API-KEY": "YOUR_API_KEY", "x-chain": "solana" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/trader/txs/seek_by_time?address=WALLET_ADDRESS&tx_type=swap&after_time=1755058900&limit=100' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    </CodeGroup>

    <Note>
      In the response, the trader wallet is `owner`, while the item level `address` is the pool, so do not confuse the two. Each trade splits into a `base` and a `quote` leg, each carrying a `type_swap` of `to` or `from`. The tracked token on `to` means the wallet bought, an entry; on `from` means the wallet sold, an exit.
    </Note>

    <Tip>
      A polling interval of two to five seconds per wallet catches most new fills without straining your credit budget. For push delivery instead of polling, the `SUBSCRIBE_WALLET_TXS` stream is available on higher plans.
    </Tip>
  </Step>
</Steps>

## Watch your credit budget

A monitoring layer that polls several wallets on a loop can consume credits faster than a one off script.

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
  Use the result to tune your polling interval and the number of wallets you watch, so coverage and cost stay in balance.
</Tip>

## Before you ship

- The token list is sorted by `net_flow` and treated as a watchlist, not a buy list.
- All required parameters are set on the top traders call so it never returns a 400 error.
- Behavior tags are applied as a soft risk filter, not a hard ban.
- Every wallet is scored with `duration=all` and `position_scope=cumulative`, with win rate read as a ratio.
- The trades endpoint is polled with `after_time`, deduped on the composite key.

## FAQ

<AccordionGroup>
  <Accordion title="What is smart money copy trading?">
    Mirroring the trades of wallets with a proven record of profitable activity. This pipeline handles finding those wallets, verifying them, and detecting their moves, while your own system decides how to act on the signal.
  </Accordion>

  <Accordion title="How do you avoid copying a wallet that just got lucky?">
    Score the wallet across its entire portfolio with the profit and loss endpoint rather than judging it on one token, using `duration=all` and `position_scope=cumulative` so the result is not quietly scoped to a recent window. A healthy win rate and real realized profit over the full history is far more reliable than a single large gain.
  </Accordion>

  <Accordion title="Can you get real time alerts instead of polling?">
    Yes. The wallet transactions stream delivers updates by push on higher plans, which removes polling entirely. On a Premium plan, a short polling loop on the trades endpoint achieves the same outcome over standard REST.
  </Accordion>
</AccordionGroup>

That closes the loop. A market wide question, who is smart money buying, becomes a precise and trustworthy event: a proven wallet just entered this token.
