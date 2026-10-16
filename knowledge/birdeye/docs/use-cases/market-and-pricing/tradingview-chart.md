---
title: "Solana TradingView Chart"
description: "Resolve a token, seed the viewport with up to 5000 candles, backfill history on scroll, and keep the live bar fresh over REST or WebSocket"
---

Most Solana charts break at the data layer, not the UI. The candlestick widget renders fine, but candles arrive out of order, history stops loading when the user scrolls back, and the last bar freezes because the live feed quietly dropped. The hard part of a TradingView integration is the feed, not the chart.

<Card title="TL;DR">
  - Resolve a symbol or address to a canonical token or pool
  - Seed the visible viewport with up to 5000 candles
  - Backfill older history only when the user scrolls back
  - Keep the last candle live over REST or WebSocket
  - Optionally overlay liquidity under the price
</Card>

![Reference architecture for a Solana TradingView Chart API: resolve, seed, backfill, and live candle layers](http://blog-bds.birdeye.so/wp-content/uploads/2026/06/How-to-Build-a-Solana-Portfolio-Tracker-with-Birdeye-Data-Element-banners-1-1-1200x675.png)

All requests share the base URL `https://public-api.birdeye.so`, authenticate with the `X-API-KEY` header, and select the network with `x-chain: solana`.

<Note>
  The trick behind the whole design is fetching only what is on screen: stream or poll the visible candle, and pull older history only when the user scrolls back. That keeps credit usage flat as chart traffic grows. Birdeye publishes an official TradingView datafeed example at [github.com/birdeye-so/tradingview-example-js-api](https://github.com/birdeye-so/tradingview-example-js-api), and the approach below matches it.
</Note>

## The five stage pipeline

<Steps>
  <Step title="Resolve a token or pair">
    When a user types a symbol or pastes a mint, you need a canonical address before requesting anything else. Search returns token results and market results in one call.

    **Endpoint:** [`GET /defi/v3/search`](/data-api/search-utils/get-defi-v3-search), [`GET /defi/v3/price/stats/single`](/data-api/stats/get-defi-v3-price-stats-single)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/v3/search"
    params = {
        "chain": "solana",
        "keyword": "BONK",
        "target": "token",
        "search_by": "symbol",
        "search_mode": "exact",
        "sort_by": "volume_24h_usd",
        "sort_type": "desc",
        "limit": 20
    }
    headers = {"accept": "application/json", "x-chain": "solana", "X-API-KEY": "YOUR_API_KEY"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/v3/search");
    url.search = new URLSearchParams({
      chain: "solana",
      keyword: "BONK",
      target: "token",
      search_by: "symbol",
      search_mode: "exact",
      sort_by: "volume_24h_usd",
      sort_type: "desc",
      limit: "20"
    }).toString();
    
    const response = await fetch(url, {
      headers: { accept: "application/json", "x-chain": "solana", "X-API-KEY": "YOUR_API_KEY" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/search?chain=solana&keyword=BONK&target=token&search_by=symbol&search_mode=exact&sort_by=volume_24h_usd&sort_type=desc&limit=20' \
      --header 'accept: application/json' \
      --header 'x-chain: solana' \
      --header 'X-API-KEY: YOUR_API_KEY'
    ```

    </CodeGroup>

    <Warning>
      `sort_by` and `sort_type` are both required. The response groups results by `type`, so read `data.items[]`, find the group where `type` is `token`, and take `result[0].address`. Market groups carry the pool address for pool level OHLCV and the liquidity overlay later.
    </Warning>

    <Note>
      For the toolbar, `price/stats/single` returns price, percent change, and high and low in one call. On Solana the payload is a direct array under `data`, while EVM nests it under `data.items`, so branch your parser if you extend to EVM.
    </Note>
  </Step>
  <Step title="Seed the viewport with up to 5000 candles">
    The first paint should fill the visible viewport in one request.

    **Endpoint:** [`GET /defi/v3/ohlcv`](/data-api/price-ohlcv/get-defi-v3-ohlcv)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/v3/ohlcv"
    params = {
        "address": "TOKEN_ADDRESS",
        "type": "15m",
        "currency": "usd",
        "time_from": 1726700000,
        "time_to": 1726704000,
        "mode": "range",
        "padding": "false"
    }
    headers = {"accept": "application/json", "x-chain": "solana", "X-API-KEY": "YOUR_API_KEY"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/v3/ohlcv");
    url.search = new URLSearchParams({
      address: "TOKEN_ADDRESS",
      type: "15m",
      currency: "usd",
      time_from: "1726700000",
      time_to: "1726704000",
      mode: "range",
      padding: "false"
    }).toString();
    
    const response = await fetch(url, {
      headers: { accept: "application/json", "x-chain": "solana", "X-API-KEY": "YOUR_API_KEY" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/ohlcv?address=TOKEN_ADDRESS&type=15m&currency=usd&time_from=1726700000&time_to=1726704000&mode=range&padding=false' \
      --header 'accept: application/json' \
      --header 'x-chain: solana' \
      --header 'X-API-KEY: YOUR_API_KEY'
    ```

    </CodeGroup>

    <Note>
      Each item in `data.items[]` carries `o`, `h`, `l`, `c`, `v`, `v_usd`, and `unix_time`, mapping one to one onto a TradingView bar object. To chart a specific pool instead of an aggregated token, call `/defi/v3/ohlcv/pair` with the pool address, which drops `currency` and adds `inversion` to flip base and quote.
    </Note>
  </Step>
  <Step title="Backfill history on scroll back">
    When the user pans left, request an older window by shifting `time_from` and `time_to` to the period just before your earliest loaded candle, keeping the same `type` so the series stays continuous.

    **Endpoint:** [`GET /defi/history_price`](/data-api/price-ohlcv/get-defi-history-price)

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/history_price?address=TOKEN_ADDRESS&address_type=token&type=15m&time_from=1726600000&time_to=1726700000' \
      --header 'accept: application/json' \
      --header 'x-chain: solana' \
      --header 'X-API-KEY: YOUR_API_KEY'
    ```

    <Tip>
      For very long ranges where a candle by candle load is wasteful, fall back to `history_price`, which returns a lightweight line series of `unixTime` and `value` points instead of full OHLCV.
    </Tip>

    <Warning>
      Second level candles have limited retention: `1s` for 2 weeks, `15s` and `30s` for 3 months. Cap second level intervals to recent ranges in your UI, or backfill requests come back empty.
    </Warning>
  </Step>
  <Step title="Keep the last candle live">
    This is the layer that makes the chart feel real time, and the one place where your package tier changes the implementation.

    **Endpoint:** [`GET /defi/v3/ohlcv`](/data-api/price-ohlcv/get-defi-v3-ohlcv) (any paid tier), `SUBSCRIBE_PRICE` (Premium and up)

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/ohlcv?address=TOKEN_ADDRESS&type=1m&currency=usd&mode=count&count_limit=2&time_to=1726704000' \
      --header 'accept: application/json' \
      --header 'x-chain: solana' \
      --header 'X-API-KEY: YOUR_API_KEY'
    ```

    <Note>
      A poll interval close to the candle interval is usually enough. For a `1m` chart, polling every few seconds keeps the forming bar fresh without wasting credits. This works on every paid tier with no WebSocket.
    </Note>

    For the lowest latency live bar on a Premium package and up, open one socket and subscribe to the price stream instead.

    ```python
    import asyncio, json, websockets
    
    WS_URL = "wss://public-api.birdeye.so/socket/solana?x-api-key=YOUR_API_KEY"
    
    async def stream_live_candle():
        async with websockets.connect(WS_URL, subprotocols=["echo-protocol"]) as ws:
            await ws.send(json.dumps({
                "type": "SUBSCRIBE_PRICE",
                "data": {
                    "queryType": "simple",
                    "chartType": "1m",
                    "address": "TOKEN_ADDRESS",
                    "currency": "usd",
                    "mode": "raw"
                }
            }))
            async for message in ws:
                event = json.loads(message)
                if event.get("type") == "PRICE_DATA":
                    update_last_candle(event["data"])
    ```

    <Warning>
      Sending a new `SUBSCRIBE_PRICE` overwrites the previous one. To follow several tokens, send a single `complex` query with all of them, up to 100, and resend the full list whenever it changes. Implement ping pong so the connection is not dropped on idle network, and backfill missed candles over REST on reconnect.
    </Warning>
  </Step>
  <Step title="Add a liquidity overlay">
    Most charts stop at price. A liquidity ribbon under the candles is a feature competitors rarely expose, and it is one call.

    **Endpoint:** [`GET /defi/v3/liquidity/ohlc/pair`](/data-api/price-ohlcv/get-defi-v3-liquidity-ohlc-pair)

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/liquidity/ohlc/pair?address=PAIR_ADDRESS&time=1726704000&direction=back&count=100' \
      --header 'accept: application/json' \
      --header 'x-chain: solana' \
      --header 'X-API-KEY: YOUR_API_KEY'
    ```

    <Note>
      Solana only, up to 100 records per request, anchored at a `time` timestamp and paged by `direction` rather than a `time_from`/`time_to` range. Set `direction=back` to page older candles and `direction=forward` to move toward the present.
    </Note>
  </Step>
</Steps>

## Watch your credit budget

If you poll for the live layer, wire this in from day one so a tight interval does not quietly burn your budget.

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
  Poll hourly and widen your live poll interval automatically if remaining credits drop below a safe threshold, rather than running into a 429 mid session.
</Tip>

## Before you ship

- The history call uses `padding=false` so the chart does not invent flat candles.
- Backfill keeps the same `type`, and second level intervals are capped to their retention windows.
- The live layer degrades gracefully: REST poll on any tier, WebSocket from Premium up.
- The price stats parser branches on chain if you target EVM later.
- Credit usage is observable so a tight poll interval cannot surprise you with a 429.

## FAQ

<AccordionGroup>
  <Accordion title="Do I need a WebSocket to make the chart live?">
    No. REST polling of the latest OHLCV candle keeps the chart live on every paid tier and is the primary path. WebSocket streaming is a lower latency option available from the Premium package up.
  </Accordion>

  <Accordion title="How do I chart a specific pool instead of the token?">
    Use `/defi/v3/ohlcv/pair` with the pool address, and set `inversion` if you need to flip base and quote.
  </Accordion>

  <Accordion title="Why are my older second level candles empty?">
    They fell outside the retention window. `1s` is kept for 2 weeks, `15s` and `30s` for 3 months. Switch to `1m` or higher for ranges beyond those limits.
  </Accordion>
</AccordionGroup>

Paint the visible viewport first, attach the live layer last, and backfill only when the user scrolls. That order is what keeps a Solana chart fast and its credit cost flat as traffic grows.
