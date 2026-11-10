---
title: "Cross-DEX Price Scanner"
description: "List every pool a token trades on, normalize prices to USD, anchor against a consolidated mark, and confirm spreads before you trust them"
---

The same token rarely trades at the same price on every pool. A meme coin might sit on three or four pools across different DEXs at once, each with its own depth and its own buyers, and the price on a thin pool can drift well away from where the token actually trades in size. A cross-DEX price scanner catches that drift before you act on it.

<Card title="TL;DR">
  - List every pool a token trades on, ranked by liquidity
  - Price each pool in the same currency
  - Anchor against a consolidated price
  - Confirm the gap holds across several candles
</Card>

![Cross-DEX price scanner pipeline showing four endpoints from pool discovery to a confirmed spread](https://blog-bds.birdeye.so/wp-content/uploads/2026/07/How-to-Build-a-Reliable-Cross-DEX-Price-Scanner-in-4-Steps-1200x675.png)

All requests share the base URL `https://public-api.birdeye.so`, authenticate with the `X-API-KEY` header, and select the network with the `x-chain` header, defaulting to `solana`.

<Note>
  This is a price intelligence layer, not an automated arbitrage bot. It tells you where a token is priced correctly across its pools and where it has drifted. What you do with that, routing an order or refusing a stale quote, stays your call. Pair-level pricing is Solana only, so this scanner targets Solana.
</Note>

## The four stage pipeline

<Steps>
  <Step title="List every pool by liquidity">
    A token can sit on a single deep pool or be scattered across a dozen thin ones. The first call resolves the token into the venues actually worth watching.

    **Endpoint:** [`GET /defi/v2/markets`](/data-api/tokenmarket-list/get-defi-v2-markets)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/v2/markets"
    params = {"address": "TOKEN_ADDRESS", "sort_by": "liquidity", "sort_type": "desc", "limit": 20}
    headers = {"X-API-KEY": "YOUR_API_KEY", "x-chain": "solana"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/v2/markets");
    url.search = new URLSearchParams({
      address: "TOKEN_ADDRESS",
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
      --url 'https://public-api.birdeye.so/defi/v2/markets?address=TOKEN_ADDRESS&sort_by=liquidity&sort_type=desc&limit=20' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    </CodeGroup>

    <Warning>
      Each item's own `address` is the pool, not the token, which is the value you carry into the next stage. The `price` field commonly comes back null, so do not treat it as the price source.
    </Warning>

    <Tip>
      Price the top two or three pools by liquidity and stop there. A fourth or fifth pool rarely changes the spread that matters, since liquidity has usually dropped enough that the pool could not absorb a meaningful trade anyway.
    </Tip>
  </Step>
  <Step title="Normalize every pool to a USD price">
    A pool quoted in SOL and a pool quoted in USDC can show wildly different numbers for the same token. This stage prices every pool in dollars before any comparison happens.

    **Endpoint:** [`GET /defi/v3/pair/overview/single`](/data-api/stats/get-defi-v3-pair-overview-single)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/v3/pair/overview/single"
    params = {"address": "POOL_ADDRESS"}
    headers = {"X-API-KEY": "YOUR_API_KEY", "x-chain": "solana"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/v3/pair/overview/single");
    url.searchParams.set("address", "POOL_ADDRESS");
    
    const response = await fetch(url, {
      headers: { "X-API-KEY": "YOUR_API_KEY", "x-chain": "solana" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/pair/overview/single?address=POOL_ADDRESS' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    </CodeGroup>

    <Warning>
      `price` is the base token priced in the quote token, not a dollar figure. Multiply by the quote token's own USD price to get a comparable figure, inverting first if the token you are tracking sits in `quote` rather than `base`. `volume_24h` on this endpoint is already in USD, so use it directly for liquidity weighting. There is no multi pool version of this call below the Business package, so plan on one call per pool you watch.
    </Warning>

    <Tip>
      Weight the spread by liquidity so a thin pool's outlier quote does not dominate. A $$400,000 pool should carry roughly 20 times the weight of a $$20,000 pool when you decide which price to trust.
    </Tip>
  </Step>
  <Step title="Anchor against a consolidated price">
    A wide spread between two pools tells you they disagree, but not which one is wrong. This stage adds a third reference point built from activity across every pool.

    **Endpoint:** [`GET /defi/price`](/data-api/price-ohlcv/get-defi-price)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/price"
    params = {"address": "TOKEN_ADDRESS", "include_liquidity": "true"}
    headers = {"X-API-KEY": "YOUR_API_KEY", "x-chain": "solana"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/price");
    url.searchParams.set("address", "TOKEN_ADDRESS");
    url.searchParams.set("include_liquidity", "true");
    
    const response = await fetch(url, {
      headers: { "X-API-KEY": "YOUR_API_KEY", "x-chain": "solana" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/price?address=TOKEN_ADDRESS&include_liquidity=true' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    </CodeGroup>

    <Note>
      Measure each pool's percent deviation from this consolidated price, not from whichever pool happens to look cheapest. Use `check_liquidity` to exclude pools too thin to be trusted from the consolidated figure. The response can come back null for a token Birdeye Data does not yet track, so guard against treating a missing price as zero.
    </Note>
  </Step>
  <Step title="Confirm the gap holds">
    A pool can look mispriced for one ugly tick and then snap back a minute later. Before acting on a flagged spread, confirm it survives more than a single candle.

    **Endpoint:** [`GET /defi/v3/ohlcv/pair`](/data-api/price-ohlcv/get-defi-v3-ohlcv-pair)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/v3/ohlcv/pair"
    params = {"address": "POOL_ADDRESS", "type": "15m", "time_from": 1755000000, "time_to": 1755058900}
    headers = {"X-API-KEY": "YOUR_API_KEY", "x-chain": "solana"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/v3/ohlcv/pair");
    url.search = new URLSearchParams({
      address: "POOL_ADDRESS",
      type: "15m",
      time_from: "1755000000",
      time_to: "1755058900"
    }).toString();
    
    const response = await fetch(url, {
      headers: { "X-API-KEY": "YOUR_API_KEY", "x-chain": "solana" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/ohlcv/pair?address=POOL_ADDRESS&type=15m&time_from=1755000000&time_to=1755058900' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    </CodeGroup>

    <Warning>
      Treat a candle with `v` and `v_usd` near zero as untradable, not confirming evidence. A flat, low volume print is the most common source of a spread that looks real but is not. A 15 minute interval is usually the right middle ground, giving four readings inside an hour without drowning the check in short term noise.
    </Warning>
  </Step>
</Steps>

## Watch your credit budget

Pricing several pools per token across a watchlist adds up faster than a single token check does.

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
  Size the refresh interval to how fast the tokens you track actually move rather than defaulting to the tightest loop you can afford. Two pools per token at a 15 minute refresh costs meaningfully less than the same watchlist refreshed every few seconds.
</Tip>

## Before you ship

- The market list is sorted by `liquidity`, and pools too thin to fill a real trade are dropped.
- `price` on the pair overview endpoint is treated as base in quote, never as USD, until converted.
- Deviation is measured against the consolidated price from `/defi/price`, not against whichever pool looks cheapest.
- A flagged spread is confirmed across several candles before being treated as real.
- A candle with `v` and `v_usd` near zero is discarded as noise, not confirmation.

## FAQ

<AccordionGroup>
  <Accordion title="Is this an arbitrage bot?">
    No. It is a price intelligence layer that tells you where a token is priced correctly and where it has drifted, which is the input an arbitrage system would need, not the system itself. Real arbitrage on Solana is contested by fast automated traders, so treat this as a way to find the best price to trade at and to catch stale quotes.
  </Accordion>

  <Accordion title="Why is the price field on the pair overview endpoint not in USD?">
    A pool only knows the ratio between its two tokens, so `price` reports the base token in terms of the quote token, whatever that quote happens to be. Multiply by the quote token's own USD price to get a comparable figure, and invert first if the token you care about sits in `quote` rather than `base`.
  </Accordion>

  <Accordion title="What if a token only trades on one pool?">
    The scanner still runs, it just has nothing to compare against. With a single pool there is no spread to compute in Step 2, so lean on Step 3 instead: compare that pool's price against the consolidated mark to catch drift from fair value even without a second venue to triangulate against.
  </Accordion>
</AccordionGroup>

A pool that disagreed with the rest of the market on one tick has either confirmed itself as genuinely mispriced or quietly corrected, and now you know which before you act.
