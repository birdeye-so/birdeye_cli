---
title: "Whale Transaction Tracker"
description: "Size a threshold from a token's own baseline, detect large trades, split buy and sell pressure, and poll for new prints as they land"
---

A token can move ten percent in a minute, and the candle alone never tells you why. Most of the time the real cause is a handful of large trades clearing a thin order book. A whale transaction tracker watches the trades themselves, so a six figure buy or a sudden wave of selling shows up the moment it happens, not after the move.

<Card title="TL;DR">
  - Read a token's normal trading stats so the threshold is not a guess
  - Pull only the trades that clear that threshold
  - Classify each print as a buy or a sell
  - Poll for new prints on a short loop so alerts fire near the moment a whale trade lands
</Card>

![Whale transaction tracker pipeline showing four stages from baseline volume to a live large trade alert](https://blog-bds.birdeye.so/wp-content/uploads/2026/07/How-to-Build-a-Powerful-Whale-Tracker-in-4-Steps-1-1200x675.png)

All requests share the base URL `https://public-api.birdeye.so`, authenticate with the `X-API-KEY` header, and select the network with `x-chain: solana`.

<Warning>
  The trades endpoint that drives detection, classification, and polling is Solana only, so this tracker targets Solana. The baseline endpoint in Step 1 supports other chains if you need aggregate stats elsewhere.
</Warning>

## The four stage pipeline

<Steps>
  <Step title="Size a threshold from the token's own baseline">
    A whale is relative. A $$20,000 trade is enormous on a token with $$50,000 of daily volume and barely noticeable on one with \$50 million, so the first call is not detection, it is context.

    **Endpoint:** [`GET /defi/v3/token/trade-data/single`](/data-api/stats/get-defi-v3-token-trade-data-single)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/v3/token/trade-data/single"
    params = {"address": "TOKEN_ADDRESS"}
    headers = {"X-API-KEY": "YOUR_API_KEY", "x-chain": "solana"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/v3/token/trade-data/single");
    url.searchParams.set("address", "TOKEN_ADDRESS");
    
    const response = await fetch(url, {
      headers: { "X-API-KEY": "YOUR_API_KEY", "x-chain": "solana" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/token/trade-data/single?address=TOKEN_ADDRESS' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    </CodeGroup>

    <Warning>
      This endpoint uses `address`, not `token_address`, the opposite of the endpoint in the next step. Size every threshold from the `_usd` fields, never the raw token quantity fields: `volume_buy_24h` is a token amount, while `volume_buy_24h_usd` is the dollar figure, and `buy_24h`/`sell_24h` are trade counts, not volume at all.
    </Warning>

    <Tip>
      A simple starting heuristic: set `min_volume` near 0.5 to 1 percent of `volume_1h_usd`, then tighten or loosen it based on how many alerts you actually act on. Revisit the number whenever volume shifts, since a fixed dollar figure quietly becomes too loose or too tight as the token's activity changes.
    </Tip>
  </Step>
  <Step title="Pull only the trades above that threshold">
    Most tokens generate thousands of small trades for every one that matters. Filtering for size up front means the tracker only ever looks at prints worth caring about.

    **Endpoint:** [`GET /defi/v3/token/txs-by-volume`](/data-api/transactions/get-defi-v3-token-txs-by-volume)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/v3/token/txs-by-volume"
    params = {
        "token_address": "TOKEN_ADDRESS",
        "volume_type": "usd",
        "min_volume": 10000,
        "sort_type": "desc",
        "limit": 100
    }
    headers = {"X-API-KEY": "YOUR_API_KEY", "x-chain": "solana"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/v3/token/txs-by-volume");
    url.search = new URLSearchParams({
      token_address: "TOKEN_ADDRESS",
      volume_type: "usd",
      min_volume: "10000",
      sort_type: "desc",
      limit: "100"
    }).toString();
    
    const response = await fetch(url, {
      headers: { "X-API-KEY": "YOUR_API_KEY", "x-chain": "solana" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/token/txs-by-volume?token_address=TOKEN_ADDRESS&volume_type=usd&min_volume=10000&sort_type=desc&limit=100' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    </CodeGroup>

    <Warning>
      `volume_type` has no default. A missing value returns a 400 error rather than falling back to a sensible choice. Read `volume_usd` for sizing, not the raw `volume` field, since its denomination is not fixed and sometimes reports the paired token's amount instead of the monitored token's.
    </Warning>
  </Step>
  <Step title="Classify each print as a buy or a sell">
    A whale buying and a whale selling look identical on a line chart but mean opposite things for where price goes next.

    This is the same endpoint as Step 2, used two ways. Either read each print's `side` field from a combined pull, or issue two calls with `tx_type=buy` and `tx_type=sell` to get each direction pre split.

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/token/txs-by-volume?token_address=TOKEN_ADDRESS&volume_type=usd&min_volume=10000&tx_type=buy&sort_type=desc&limit=100' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    <Note>
      The convention is relative to the token you query: a print labeled `buy` sits in the `to` leg with a positive `ui_change_amount`, and a `sell` sits in `from` with a negative amount. Query the specific token you are monitoring, not a quote token like SOL, or the labels stop reading correctly, since the trades returned would span every pair that token touches.
    </Note>

    <Tip>
      Sum `volume_usd` per direction over a rolling window to get net pressure rather than a raw trade count. A token can show ten buys and two sells and still be net negative if the two sells are large enough.
    </Tip>
  </Step>
  <Step title="Poll for new prints on a short loop">
    A whale tracker that only answers when asked is a research tool, not an alert system. This stage turns the same endpoint into a live feed.

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/token/txs-by-volume?token_address=TOKEN_ADDRESS&volume_type=usd&min_volume=10000&after_time=1755058900&sort_type=asc&limit=100' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    <Warning>
      Set `after_time` to the `block_unix_time` of the last print you handled, and dedupe on the composite key `tx_hash` plus `ins_index` plus `inner_ins_index`. One transaction can produce several trade legs sharing a single hash but differing by index, so deduping on `tx_hash` alone drops real legs rather than just true duplicates.
    </Warning>

    <Tip>
      A polling interval of two to five seconds catches most whale activity without straining your credit budget. Going much below roughly one second rarely buys meaningful extra warning, since a trade still has to confirm on chain before it shows up in the response.
    </Tip>
  </Step>
</Steps>

## Watch your credit budget

A whale tracker polling on a tight loop across several tokens can consume credits faster than a one off script.

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
  Use the result to tune your polling interval and the number of tokens you watch, so coverage and cost stay in balance.
</Tip>

## Before you ship

- Every threshold is sized from the `_usd` fields, never the raw token quantity fields.
- `volume_type=usd` is always set explicitly, since a missing value returns a 400 error.
- The specific token being monitored is queried, not a quote token like SOL, so buy and sell labels read correctly.
- `volume_usd` is summed per direction to get net pressure instead of counting trades.
- Dedupe runs on the composite key, not `tx_hash` alone, so multi leg transactions are not collapsed.

## FAQ

<AccordionGroup>
  <Accordion title="What counts as a whale trade?">
    There is no universal dollar figure, since a large trade on one token is routine on another. Set the threshold relative to the token's own baseline, using `volume_1h_usd` or `volume_24h_usd`, rather than a single number applied across every token you watch.
  </Accordion>

  <Accordion title="How do you tell a buy from a sell?">
    Read the print relative to the token you queried. The monitored token sitting in the `to` leg with a positive `ui_change_amount` is a buy, and the same token sitting in `from` with a negative amount is a sell. Query the specific token you care about rather than a quote token, or the labels stop reading correctly.
  </Accordion>

  <Accordion title="Can you look back at whale activity that already happened?">
    Yes, the same endpoint that powers live polling also answers a historical question. Set `before_time` and `after_time` to bound a past window instead of polling forward. This is useful for reviewing what drove a price move after the fact, or for backtesting a threshold before committing to it live.
  </Accordion>

  <Accordion title="Should one whale tracker watch several tokens at once?">
    Yes, by running the same four stages per token rather than building anything new. Keep each token's threshold tied to its own baseline instead of reusing one number across very different tokens, since a single fixed floor floods you with noise on a quiet token and misses everything on an active one.
  </Accordion>
</AccordionGroup>

That closes the loop. A market wide stream of activity becomes a precise event: a trade large enough to matter, on the token you are watching, with a direction attached.
