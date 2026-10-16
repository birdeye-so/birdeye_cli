---
title: "Solana Liquidity Monitoring"
description: "Resolve a token to its deepest pool, track liquidity as OHLC candles, align it against price, and explain a collapse with security and supply data"
---

Liquidity is what lets a holder actually sell. When it leaves a pool, everyone behind it is trapped, and the first warning is the liquidity curve, not the price. This guide resolves a token to its deepest pool, streams that pool's liquidity as OHLC candles, aligns the series against price, and ties any collapse to security and supply data.

<Card title="TL;DR">
  - Resolve the token to its deepest pool
  - Pull that pool's liquidity as OHLC candles
  - Align liquidity against token price to spot divergence
  - Explain a collapse with security and supply data
</Card>

![Solana liquidity monitoring pipeline of Birdeye Data endpoints](http://blog-bds.birdeye.so/wp-content/uploads/2026/07/How-to-Build-a-Solana-Trading-Bot-Data-Layer-with-Birdeye-Data-In-Blog-Design1-3-1200x675.png)

All requests share the base URL `https://public-api.birdeye.so`, authenticate with the `X-API-KEY` header, and select the network with `x-chain: solana`.

<Warning>
  One detail runs through every step and trips up most first integrations. The `address` parameter means the token on some endpoints and the pool on others. Passing the wrong one returns the wrong data with no obvious error.
</Warning>

## The four stage pipeline

<Steps>
  <Step title="Resolve the token to its deepest pool">
    A token rarely lives in one pool. It trades across many, and most are too shallow to matter, so the first job is finding the one pool that actually holds the liquidity.

    **Endpoint:** [`GET /defi/v2/markets`](/data-api/tokenmarket-list/get-defi-v2-markets)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/v2/markets"
    params = {"address": "TOKEN_MINT", "sort_by": "liquidity", "sort_type": "desc", "limit": 20}
    headers = {"X-API-KEY": "YOUR_API_KEY", "x-chain": "solana"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/v2/markets");
    url.search = new URLSearchParams({
      address: "TOKEN_MINT",
      sort_by: "liquidity",
      sort_type: "desc",
      limit: "20"
    }).toString();
    
    const response = await fetch(url, {
      headers: { "X-API-KEY": "YOUR_API_KEY", "x-chain": "solana" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v2/markets?address=TOKEN_MINT&sort_by=liquidity&sort_type=desc&limit=20' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    </CodeGroup>

    <Warning>
      Here `address` is the token. Each result's own `address` is a pool, not the token. Keep using the token mint in Step 2 and the liquidity history comes back empty, since that endpoint is keyed by pool. Grab the pool `address` from the top item and hold onto it.
    </Warning>

    <Note>
      A token can list more than a thousand pools, so sorting by `liquidity` with `sort_type=desc` is not optional. The `source` field names the venue behind each pool.
    </Note>
  </Step>
  <Step title="Pull the pool's liquidity as OHLC candles">
    With the pool address in hand, watch its liquidity move. This returns liquidity as OHLC candles minute by minute, so a slow bleed and a one block rug both show up as a shape on a chart rather than a single number.

    **Endpoint:** [`GET /defi/v3/liquidity/ohlc/pair`](/data-api/price-ohlcv/get-defi-v3-liquidity-ohlc-pair)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/v3/liquidity/ohlc/pair"
    params = {"address": "PAIR_ADDRESS", "count": 100}
    headers = {"X-API-KEY": "YOUR_API_KEY", "x-chain": "solana"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/v3/liquidity/ohlc/pair");
    url.searchParams.set("address", "PAIR_ADDRESS");
    url.searchParams.set("count", "100");
    
    const response = await fetch(url, {
      headers: { "X-API-KEY": "YOUR_API_KEY", "x-chain": "solana" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/liquidity/ohlc/pair?address=PAIR_ADDRESS&count=100' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    </CodeGroup>

    <Warning>
      Here `address` is the pool from Step 1, not the token. Plot `open_liquidity_usd`, `high_liquidity_usd`, `low_liquidity_usd`, and `close_liquidity_usd`. There is no single `liquidity_usd` field.
    </Warning>

    <Tip>
      Read the balance fields, `open_base_balance` through `close_base_balance` and the matching quote fields, to separate a real drain from a price effect. If balances hold steady while `close_liquidity_usd` drops, that is a reprice, not a withdrawal. If balances fall with it, tokens actually left the pool.
    </Tip>

    <Note>
      One call returns at most 100 candles. For a longer window, page with `next_cursor` and `prev_cursor`, and stop when `has_more` is false.
    </Note>
  </Step>
  <Step title="Align liquidity against token price">
    Liquidity falling alongside price is ordinary selling. Liquidity vanishing while price holds, or dropping far faster than price, is the shape of a pull. To see that, overlay price candles on the liquidity series from Step 2.

    **Endpoint:** [`GET /defi/v3/ohlcv`](/data-api/price-ohlcv/get-defi-v3-ohlcv)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/v3/ohlcv"
    params = {"address": "TOKEN_MINT", "type": "15m", "time_from": 1726670000, "time_to": 1726675000}
    headers = {"X-API-KEY": "YOUR_API_KEY", "x-chain": "solana"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/v3/ohlcv");
    url.search = new URLSearchParams({
      address: "TOKEN_MINT",
      type: "15m",
      time_from: "1726670000",
      time_to: "1726675000"
    }).toString();
    
    const response = await fetch(url, {
      headers: { "X-API-KEY": "YOUR_API_KEY", "x-chain": "solana" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/ohlcv?address=TOKEN_MINT&type=15m&time_from=1726670000&time_to=1726675000' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    </CodeGroup>

    <Warning>
      Here `address` flips back to the token. Price candles use short field names, `c` for close, while liquidity candles use `close_liquidity_usd`. Join the two series on `unix_time` rather than assuming a shared shape.
    </Warning>

    <Tip>
      Set a threshold on the ratio: flag any candle where `close_liquidity_usd` drops past a percent you choose while price moves less than a smaller percent over the same `unix_time`. Tune both numbers to your tolerance for false alarms.
    </Tip>
  </Step>
  <Step title="Explain a collapse with security and supply data">
    An alert tells you liquidity left. It does not tell you whether the token was a trap from the start or whether supply was inflated on the way out.

    **Endpoint:** [`GET /defi/token_security`](/data-api/security/get-defi-token-security), [`GET /defi/v3/token/mint-burn-txs`](/data-api/transactions/get-defi-v3-token-mint-burn-txs)

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/token/mint-burn-txs?address=TOKEN_MINT&sort_by=block_time&sort_type=desc&type=all&limit=100' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    <Tip>
      Cross the timing of a large mint against the liquidity drop from Step 2. A stealth dilution lines up with the moment liquidity left. A fake burn shows the opposite tell: an announced burn with no matching row in the window, or a `ui_amount` far smaller than claimed.
    </Tip>

    <Card title="Rug Checker" icon="shield-check" href="/use-cases/risk-and-integrity/rug-checker">
      The full authority, concentration, and behavior check set, with the exact field list per chain.
    </Card>
  </Step>
</Steps>

## Watch your credit budget

Liquidity monitoring polls, and a tool watching many pools at once can run up calls fast.

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
  Poll the liquidity history and price on the same cadence so the two series stay aligned, and call the security and supply endpoints only when an alert fires rather than on every cycle. That keeps a wide watchlist affordable.
</Tip>

## Before you ship

- Every call sends `x-chain: solana` and an `X-API-KEY`.
- `address` is the token for `markets`, `ohlcv`, `token_security`, and `mint-burn-txs`, and the pool for `liquidity/ohlc/pair`.
- The liquidity series is plotted from `open_liquidity_usd` through `close_liquidity_usd`, not a `liquidity_usd` field.
- Liquidity and price candles are joined on `unix_time`, since their field names differ.
- Security and supply calls fire only on an alert, with credits monitored as pools are added.

## FAQ

<AccordionGroup>
  <Accordion title="Why does the address parameter mean different things on different endpoints?">
    Liquidity belongs to a pool, while price, security, and supply belong to a token. `liquidity/ohlc/pair` takes the pool address, while `markets`, `ohlcv`, `token_security`, and `mint-burn-txs` take the token mint. Carrying the wrong one between calls is the most common mistake in this pipeline.
  </Accordion>

  <Accordion title="Which field holds the pool's liquidity value?">
    The liquidity OHLC candles expose `open_liquidity_usd`, `high_liquidity_usd`, `low_liquidity_usd`, and `close_liquidity_usd`. There is no single `liquidity_usd` field.
  </Accordion>

  <Accordion title="How do I tell a rug from normal selling?">
    By the divergence between liquidity and price. Liquidity falling alongside price is ordinary selling, while liquidity vanishing as price holds, or dropping far faster than price, is the shape of a pull. The balance fields on each liquidity candle confirm whether tokens actually left the pool.
  </Accordion>
</AccordionGroup>

Resolve, watch, align, and explain: a liquidity collapse stops being a mystery and becomes an event you saw coming and can account for.
