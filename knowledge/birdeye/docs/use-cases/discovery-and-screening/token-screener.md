---
title: "Token Screener"
description: "Discover trending tokens, bulk scan thousands per call with 40 plus filters, and refresh watchlists without one request per token"
---

Most token screeners fail at scale not because of the UI, but because of how they fetch data. They poll everything, enrich everything, and hit rate limits before they even reach 50 concurrent users.

This guide runs on one rule: only enrich tokens that survive discovery and filtering. `token_overview` is the heaviest call in the stack, and wasting it on tokens nobody selects is how a screener burns its credit budget without delivering value.

<Card title="TL;DR">
  - Discover an already ranked starting point from the trending feed
  - Bulk scan thousands of tokens per batch with server side filters
  - Enrich with a full snapshot only when a user selects a token
  - Batch refresh watchlist prices instead of looping single calls
</Card>

![Token screener architecture: background worker, cache, and user-facing app with Birdeye Data endpoints](https://blog-bds.birdeye.so/wp-content/uploads/2026/06/aHow-to-Build-a-Solana-Portfolio-Tracker-with-Birdeye-Data-Element-banners-1200x675.png)

All requests share the base URL `https://public-api.birdeye.so`, authenticate with the `X-API-KEY` header, and select the network with the `x-chain` header, for example `solana`, `ethereum`, `base`, `bsc`, or `arbitrum`.

## The four stage pipeline

<Steps>
  <Step title="Discover trending tokens">
    Computing what is trending yourself from raw trade data is a rabbit hole. This endpoint skips all of that with an already ranked list from real onchain activity. Control the sort field and the lookback window to match your use case.

    **Endpoint:** [`GET /defi/token_trending`](/data-api/creation-trending/get-defi-token-trending)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/token_trending"
    params = {"sort_by": "rank", "sort_type": "asc", "interval": "1h", "offset": 0, "limit": 50}
    headers = {
        "accept": "application/json",
        "x-chain": "solana",
        "X-API-KEY": "YOUR_API_KEY"
    }
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/token_trending");
    url.search = new URLSearchParams({
      sort_by: "rank",
      sort_type: "asc",
      interval: "1h",
      offset: "0",
      limit: "50"
    }).toString();
    
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "x-chain": "solana",
        "X-API-KEY": "YOUR_API_KEY"
      }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/token_trending?sort_by=rank&sort_type=asc&interval=1h&offset=0&limit=50' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana' \
      --header 'accept: application/json'
    ```

    </CodeGroup>

    <Note>
      Page size hard caps at 50 tokens, so paginate with `offset` for a deeper board. For momentum focused use cases, `interval=1h` surfaces breakout tokens far earlier than `24h`.
    </Note>
  </Step>
  <Step title="Filter thousands of tokens per batch">
    This is where the screener's efficiency is actually built. Instead of downloading a large token list and filtering client side, push filter logic to the server and get back only tokens that match, up to 5000 per batch with 40 plus filter parameters covering liquidity, valuation, holders, listing age, activity recency, volume, price momentum, and trade count.

    **Endpoint:** [`GET /defi/v3/token/list/scroll`](/data-api/tokenmarket-list/get-defi-v3-token-list-scroll)

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/token/list/scroll?sort_by=volume_24h_usd&sort_type=desc&min_liquidity=50000&min_holder=500&min_volume_24h_usd=100000&min_trade_24h_count=1000&limit=5000' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    <Warning>
      Both `sort_by` and `sort_type` are required. Omitting either returns a 400 error.
    </Warning>

    <Warning>
      This is a session model, not offset pagination. Omit `scroll_id` on the first request and send filters normally. The response includes `next_scroll_id`. On every follow up page, send only `scroll_id` and drop all filters, since the session already holds your query context server side. Only one active `scroll_id` is allowed per account, with a 30 second cooldown, and the session expires if 30 seconds pass with no follow up or if `items` comes back empty. Because of the one session per account limit, run the bulk scan as a single background worker writing to a shared cache, not one call per user request.
    </Warning>

    <Note>
      The scroll endpoint requires a Business or Enterprise package and covers Solana, Base, BSC, and Ethereum only. On other plans, [`GET /defi/v3/token/list`](/data-api/tokenmarket-list/get-defi-v3-token-list) exposes the same filter and sort parameters with standard offset and limit pagination at up to 100 tokens per call.
    </Note>
  </Step>
  <Step title="Enrich with a deep snapshot on selection">
    When a user selects a token, this is the one call to make. It returns price, liquidity, market cap, holder count, supply, and per timeframe metrics across up to eight windows by default.

    **Endpoint:** [`GET /defi/token_overview`](/data-api/stats/get-defi-token-overview)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/token_overview"
    params = {"address": "TOKEN_ADDRESS", "frames": "1h,4h,24h"}
    headers = {"X-API-KEY": "YOUR_API_KEY", "x-chain": "solana"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/token_overview");
    url.searchParams.set("address", "TOKEN_ADDRESS");
    url.searchParams.set("frames", "1h,4h,24h");
    
    const response = await fetch(url, {
      headers: { "X-API-KEY": "YOUR_API_KEY", "x-chain": "solana" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/token_overview?address=TOKEN_ADDRESS&frames=1h,4h,24h' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    </CodeGroup>

    <Tip>
      Narrow `frames` to only the timeframes your UI actually displays. Second and minute granularity only works on Solana, Base, BSC, and Ethereum, other chains are limited to fixed hour intervals.
    </Tip>
  </Step>
  <Step title="Batch refresh watchlist prices">
    Once users build watchlists, the refresh loop should not scale linearly with watchlist size. Batch up to 100 tokens in one call instead of looping single price requests.

    **Endpoint:** [`POST /defi/multi_price`](/data-api/price-ohlcv/post-defi-multi-price)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/multi_price"
    params = {"include_liquidity": "true"}
    headers = {
        "X-API-KEY": "YOUR_API_KEY",
        "x-chain": "solana",
        "content-type": "application/json"
    }
    body = {"list_address": "MINT_1,MINT_2,MINT_3"}
    
    response = requests.post(url, params=params, headers=headers, json=body).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/multi_price");
    url.searchParams.set("include_liquidity", "true");
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-API-KEY": "YOUR_API_KEY",
        "x-chain": "solana",
        "content-type": "application/json"
      },
      body: JSON.stringify({ list_address: "MINT_1,MINT_2,MINT_3" })
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request POST \
      --url 'https://public-api.birdeye.so/defi/multi_price?include_liquidity=true' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana' \
      --header 'content-type: application/json' \
      --data '{ "list_address": "MINT_1,MINT_2,MINT_3" }'
    ```

    </CodeGroup>

    <Warning>
      Tokens that are unknown or unsupported come back as `null` on their key rather than as an error. Guard each result before reading a price. On EVM chains, use checksummed addresses.
    </Warning>
  </Step>
</Steps>

## Watch your credit budget

Wire this into your monitoring stack from day one, so a runaway scan does not silently burn budget on an edge case.

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
  Poll hourly and alert if remaining credits drop below a safe threshold. Increase your refresh interval or pause the background scan worker automatically rather than letting it run into a 429.
</Tip>

## Before you ship

- Trending and scroll results write to a cache, the UI reads from the cache only.
- `token_overview` fires only on explicit user selection, never speculatively.
- Watchlist refresh always batches through `multi_price`, never loops single price calls.
- `null` responses from `multi_price` are handled explicitly, not assumed away.
- Only one worker per chain per account runs the scroll session, not one per user request.
- Credit usage is observable, so degradation is controlled instead of a surprise 429.

## FAQ

<AccordionGroup>
  <Accordion title="Does the scroll endpoint work on all chains?">
    No. Unlike most Birdeye Data endpoints, `GET /defi/v3/token/list/scroll` currently covers Solana, Base, BSC, and Ethereum only. For other chains, use `GET /defi/v3/token/list`, which has the same filter and sort parameters with standard offset and limit pagination at up to 100 tokens per call.
  </Accordion>

  <Accordion title="Can I run multiple background workers against the same API key?">
    Not with the scroll endpoint. The one active scroll session limit is enforced at the account level, not the key level. If two workers open concurrent scroll sessions, the second fails. Run one worker per chain per account, writing to a shared cache that all application instances read from.
  </Accordion>

  <Accordion title="What is a reasonable refresh interval for watchlists?">
    It depends on the use case, but 5 to 10 seconds per batch through `multi_price` is a reasonable starting point for a trading terminal. Monitor credit consumption and tune from there, and avoid refreshing tokens that are not visible in the current viewport.
  </Accordion>
</AccordionGroup>

That is a complete discover, filter, enrich, and refresh pipeline that holds up under load instead of burning credits on tokens nobody looks at.
