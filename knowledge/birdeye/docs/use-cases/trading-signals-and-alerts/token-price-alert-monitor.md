---
title: "Token Price Alert Monitor"
description: "Poll a watchlist cheaply, check absolute and percent thresholds, and confirm every move on a closed candle before it fires"
---

A token price alert monitor watches a list of tokens and fires when one crosses a level you care about, so you find out about a move while you can still act on it. The hard part is not reading a price. It is doing it cheaply across a whole watchlist, and firing on a real move rather than a momentary wick that reverts a second later.

<Card title="TL;DR">
  - Poll the whole watchlist in one cheap batch call
  - Drill into exact thresholds only for tokens near a level
  - Confirm the move on a closed candle before firing
</Card>

![Token price alert monitor pipeline showing three endpoints from a watchlist poll to a fired alert](https://blog-bds.birdeye.so/wp-content/uploads/2026/07/How-to-Build-a-Token-Price-Alert-Monitor_-3-Fast-Steps-In-Blog-1-1200x675.png)

All requests share the base URL `https://public-api.birdeye.so`, authenticate with the `X-API-KEY` header, and select the network with the `x-chain` header, defaulting to `solana`.

<Note>
  This design runs entirely over REST polling. Birdeye Data offers a WebSocket price feed, but on the Premium tier it sits behind a Business upgrade, so tiered polling, a cheap batch scan plus targeted drill downs, keeps cost low without needing the socket.
</Note>

## The three stage loop

<Steps>
  <Step title="Poll the watchlist in one call">
    You do not want a separate request per token when a watchlist can run to dozens of names. One batch call keeps every loop cheap.

    **Endpoint:** [`GET /defi/multi_price`](/data-api/price-ohlcv/get-defi-multi-price)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/multi_price"
    params = {"list_address": "TOKEN_A,TOKEN_B,TOKEN_C"}
    headers = {"x-api-key": "YOUR_API_KEY", "x-chain": "solana"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/multi_price");
    url.searchParams.set("list_address", "TOKEN_A,TOKEN_B,TOKEN_C");
    
    const response = await fetch(url, {
      headers: { "x-api-key": "YOUR_API_KEY", "x-chain": "solana" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/multi_price?list_address=TOKEN_A,TOKEN_B,TOKEN_C' \
      --header 'x-api-key: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    </CodeGroup>

    <Warning>
      The price field is `value`, not `price`. Up to 100 addresses per call, so a longer watchlist splits into batches of 100. The response also carries `priceChange24h`, enough to drive a simple 24 hour alert on its own without a second request.
    </Warning>
  </Step>
  <Step title="Check absolute and percent thresholds">
    When a token from the poll looks close to a level, drill in for the exact numbers that decide whether to fire.

    **Endpoint:** [`GET /defi/v3/price/stats/single`](/data-api/stats/get-defi-v3-price-stats-single)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/v3/price/stats/single"
    params = {"address": "TOKEN_A", "list_timeframe": "1h,24h"}
    headers = {"x-api-key": "YOUR_API_KEY", "x-chain": "solana"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/v3/price/stats/single");
    url.searchParams.set("address", "TOKEN_A");
    url.searchParams.set("list_timeframe", "1h,24h");
    
    const response = await fetch(url, {
      headers: { "x-api-key": "YOUR_API_KEY", "x-chain": "solana" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/price/stats/single?address=TOKEN_A&list_timeframe=1h,24h' \
      --header 'x-api-key: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    </CodeGroup>

    <Warning>
      The casing flips here. The batch poll returns camelCase like `priceChange24h`, but this endpoint is snake\_case, so the field is `price_change_percent`. Values sit one level deep, in a `data` array per address that itself holds a `data` array per timeframe.
    </Warning>
  </Step>
  <Step title="Confirm the move on a closed candle">
    A threshold check on a live price fires on wicks, brief spikes that snap back within the same candle. Confirming on a closed candle removes them, and the same call doubles as a custom baseline.

    **Endpoint:** [`GET /defi/v3/ohlcv`](/data-api/price-ohlcv/get-defi-v3-ohlcv)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/v3/ohlcv"
    params = {"address": "TOKEN_A", "type": "15m", "time_from": 1726670000, "time_to": 1726700000}
    headers = {"x-api-key": "YOUR_API_KEY", "x-chain": "solana"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/v3/ohlcv");
    url.search = new URLSearchParams({
      address: "TOKEN_A",
      type: "15m",
      time_from: "1726670000",
      time_to: "1726700000"
    }).toString();
    
    const response = await fetch(url, {
      headers: { "x-api-key": "YOUR_API_KEY", "x-chain": "solana" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/ohlcv?address=TOKEN_A&type=15m&time_from=1726670000&time_to=1726700000' \
      --header 'x-api-key: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    </CodeGroup>

    <Warning>
      The most recent item in the series is often the current, still forming candle, and its close is not final. Check `unix_time` against the interval to confirm a candle has actually closed before reading its `c` value.
    </Warning>

    <Tip>
      For a custom baseline the fixed timeframes cannot answer, such as how far since you added a token yesterday afternoon, set `time_from` to that reference moment and read the close of the first candle in the series. No extra endpoint needed.
    </Tip>
  </Step>
</Steps>

## Choose your alert types

Three alert types cover almost every case, and each maps to one call above:

- **Absolute price alert**: fires on a fixed price target. Read `price` from the stats call, or `value` from the batch poll. The cheapest alert, since the batch poll alone can drive it.
- **Percent move alert**: fires on a relative change over a window. Read `price_change_percent` for that timeframe, precomputed so you never store a prior price yourself.
- **Custom baseline alert**: fires on a move since a reference point the fixed windows do not cover. Point `time_from` on the candle call at that moment.

<Note>
  Debounce is what separates a usable monitor from an unusable one. A token sitting above a threshold trips it on every loop, so track an alert state per token, fire once on the crossing, and reset only when the price falls back through the level.
</Note>

## Watch your credit budget

A monitor runs forever, so its cost compounds. A watchlist of 100 tokens polled once a minute is 1,440 batch calls a day before any drill down calls stack on top.

**Endpoint:** [`GET /utils/v1/credits`](/data-api/search-utils/get-utils-v1-credits)

<CodeGroup>

```python Python
import requests

url = "https://public-api.birdeye.so/utils/v1/credits"
headers = {"x-api-key": "YOUR_API_KEY"}

response = requests.get(url, headers=headers).json()
```

```typescript TypeScript
const response = await fetch("https://public-api.birdeye.so/utils/v1/credits", {
  headers: { "x-api-key": "YOUR_API_KEY" }
}).then((res) => res.json());
```

```bash cURL
curl --request GET \
  --url 'https://public-api.birdeye.so/utils/v1/credits' \
  --header 'x-api-key: YOUR_API_KEY'
```

</CodeGroup>

<Tip>
  Log the balance every loop while tuning the polling interval, so a too tight interval shows up as a falling balance rather than a suspended key.
</Tip>

## Survive the gaps in a polling loop

A monitor that only works when every request succeeds will not survive its first bad night.

- **Retry transient failures.** One missed poll is normal, several in a row means a token could cross a threshold and cross back before you notice. Retry with a short backoff and log the gap rather than pretending the loop ran clean.
- **Guard against stale prices.** The batch response carries `updateUnixTime` per token. A thinly traded token can hand back a price minutes old. Compare it against the current time and skip any token older than your alert window.
- **Persist debounce state.** If the alert state only lives in memory, a restart wipes it, and every token already above threshold fires all over again. Persist state next to the watchlist and treat the first loop after a restart as a rebuild, not a normal pass.
- **Keep the host clock synced.** Every candle boundary and custom baseline comes down to a Unix timestamp comparison, so a drifting clock asks for a candle that has not closed yet.

## Before you ship

- The batch poll reads `value`, not `price`, and splits watchlists longer than 100 into batches.
- The stats call reads snake\_case `price_change_percent` from the nested `data` array.
- The candle confirmation reads the last closed candle, checked by `unix_time`, not the forming one.
- Every alert is debounced by per token state so it fires once per crossing.
- `updateUnixTime` is checked before trusting a price as fresh.
- Debounce state is persisted so a restart does not refire every open alert.

## FAQ

<AccordionGroup>
  <Accordion title="Why poll over REST instead of using a WebSocket?">
    Birdeye Data offers a WebSocket price feed, but on the Premium tier it sits behind a Business upgrade. Tiered polling, a cheap batch scan plus targeted drill downs, keeps cost low enough that the socket is not needed for most watchlists.
  </Accordion>

  <Accordion title="How do you avoid false alerts?">
    Every threshold break is confirmed on a closed candle. A live price can spike and revert within a single candle, so the monitor reads the close of the last completed candle and fires only if that confirmed value clears the threshold.
  </Accordion>

  <Accordion title="How do you stop the same alert firing repeatedly?">
    Track an alert state per token. Fire once when the price crosses the level, mark the token alerted, and clear that state only when the price falls back through the level.
  </Accordion>
</AccordionGroup>

Three calls, tiered by cost, turn a watchlist into a monitor that fires on real moves and stays quiet on the rest.
