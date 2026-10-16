---
title: "Build the Data Layer for a Solana Trading Bot"
description: "Build the full five stage data layer for a Solana trading bot, from discovery to holder profiling, with Birdeye Data"
---

A profitable strategy is useless if your bot discovers pools too late, enters rugs, or reacts seconds after the market has already moved. In practice, most failures happen in the data layer long before the trading logic runs.

This guide wires five Birdeye Data stages into one pipeline: discover, gate, screen, monitor, and profile. Each stage gates the next, so a token only earns deeper, more expensive analysis after it survives the cheaper checks upstream.

<Card title="TL;DR">
  - Stream new pools and listings
  - Reject anything that fails the security gate
  - Rank survivors by momentum
  - Watch open positions live for whales and price moves
  - Profile holders and smart money wallets, then feed signals back into screening
  - Set a credit degradation order before you ever run low
</Card>

![Reference architecture showing the five stage Solana trading bot data pipeline built with Birdeye Data](https://blog-bds.birdeye.so/wp-content/uploads/2026/06/How-to-Build-a-Solana-Trading-Bot-Data-Layer-with-Birdeye-Data-In-Blog-Design2-1200x675.png)

The rest of this guide walks through the architecture from left to right, following each stage from discovery to the profiling feedback loop.

REST calls share the base URL `https://public-api.birdeye.so`, with the `X-API-KEY` and `x-chain` headers (defaults to `solana`). The WebSocket connects at `wss://public-api.birdeye.so/socket/solana`, with the API key passed as a query parameter.

<Note>
  Discovery and live position monitoring benefit most from the WebSocket, available from the Premium package up. Every stage also has a REST path that runs on any paid tier, so the pipeline works end to end regardless of package.
</Note>

## The five stage pipeline

<Steps>
  <Step title="Discover new pools and listings">
    New tokens on Solana launch every few seconds, so detection belongs on a stream rather than a polling loop.

    **WebSocket events:** [New Pair](/websockets/new-pair), [New Token Listing](/websockets/new-token-listing)

    <CodeGroup>

    ```python Python
    import asyncio, json, websockets
    
    WS_URL = "wss://public-api.birdeye.so/socket/solana?x-api-key=YOUR_API_KEY"
    
    async def discover():
        async with websockets.connect(WS_URL, subprotocols=["echo-protocol"]) as ws:
            await ws.send(json.dumps({"type": "SUBSCRIBE_NEW_PAIR"}))
            await ws.send(json.dumps({
                "type": "SUBSCRIBE_TOKEN_NEW_LISTING",
                "meme_platform_enabled": True,
                "min_liquidity": 1000
            }))
            async for message in ws:
                event = json.loads(message)
                if event.get("type") == "NEW_PAIR_DATA":
                    queue_candidate(event["data"]["base"]["address"])
                elif event.get("type") == "TOKEN_NEW_LISTING_DATA":
                    queue_candidate(event["data"]["address"])
    
    asyncio.run(discover())
    ```

    ```typescript TypeScript
    import WebSocket from "ws";
    
    const ws = new WebSocket(
      "wss://public-api.birdeye.so/socket/solana?x-api-key=YOUR_API_KEY",
      "echo-protocol"
    );
    
    ws.on("open", () => {
      ws.send(JSON.stringify({ type: "SUBSCRIBE_NEW_PAIR" }));
      ws.send(JSON.stringify({
        type: "SUBSCRIBE_TOKEN_NEW_LISTING",
        meme_platform_enabled: true,
        min_liquidity: 1000
      }));
    });
    
    ws.on("message", (raw) => {
      const event = JSON.parse(raw.toString());
      if (event.type === "NEW_PAIR_DATA") {
        queueCandidate(event.data.base.address);
      } else if (event.type === "TOKEN_NEW_LISTING_DATA") {
        queueCandidate(event.data.address);
      }
    });
    ```

    </CodeGroup>

    <Warning>
      Do not queue the pool address. For `NEW_PAIR_DATA`, the new token sits at `data.base.address`, while `data.address` is the pool itself. Using the wrong field sends pool addresses into the security gate instead of tokens.
    </Warning>

    Discovery stops at the queue. It never places trades directly because most candidates will fail the next gate.

    <Card title="Solana New Token Sniper" icon="radar" href="/use-cases/discovery-and-screening/new-token-sniper">
      Full detect, gate, rank, and watch pipeline for new launches, including the REST backfill path for lower tiers.
    </Card>
  </Step>
  <Step title="Gate every token for rug risk">
    A token can look healthy on a chart while dangerous controls or concentrated ownership sit underneath it. Run the checks in parallel and reject on any hard fail.

    **Endpoint:** [`GET /defi/token_security`](/data-api/security/get-defi-token-security)

    <Warning>
      Tokens that fail this stage must never reach the trading logic.
    </Warning>

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/token_security"
    params = {"address": "TOKEN_ADDRESS"}
    headers = {
        "accept": "application/json",
        "x-chain": "solana",
        "X-API-KEY": "YOUR_API_KEY"
    }
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/token_security");
    url.searchParams.set("address", "TOKEN_ADDRESS");
    
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
      --url 'https://public-api.birdeye.so/defi/token_security?address=TOKEN_ADDRESS' \
      --header 'accept: application/json' \
      --header 'x-chain: solana' \
      --header 'X-API-KEY: YOUR_API_KEY'
    ```

    </CodeGroup>

    A minimal rule set for the gate:

    | Field | Reject when | Why |
    | --- | --- | --- |
    | `freezeable` | `true` | Your token account can be frozen mid trade, Solana has no honeypot flag because this covers the same risk |
    | `mutableMetadata` | `true` | Name and logo can be swapped after launch |
    | `transferFeeEnable` | `true` | An on transfer fee eats into every trade |
    | `top10HolderPercent` | above 0.30 | Too concentrated to exit safely |

    <Note>
      Field coverage differs by chain because `x-chain` selects the response schema. Solana returns the fields above, while EVM returns a different set that includes `isHoneypot`, `buyTax`, and `sellTax`. Branch your parser by chain instead of assuming one response shape.
    </Note>

    Pair the security check with a liquidity floor from [`GET /defi/token_overview`](/data-api/stats/get-defi-token-overview). A token can pass every security rule and still have no real exit.

    <Card title="Rug Checker" icon="shield-check" href="/use-cases/risk-and-integrity/rug-checker">
      All five checks in full, including mint and burn history, holder behavior tags, and sellability across Solana and EVM.
    </Card>
  </Step>
  <Step title="Screen survivors by momentum">
    Clearing the gate removes obvious risks, but it does not make a token profitable. The survivors now need to be ranked by liquidity, volume, trading activity, and momentum.

    **Endpoint:** [`GET /defi/v3/token/list`](/data-api/tokenmarket-list/get-defi-v3-token-list)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/v3/token/list"
    params = {
        "sort_by": "volume_24h_change_percent",
        "sort_type": "desc",
        "min_liquidity": 50000,
        "min_holder": 500,
        "min_volume_24h_usd": 100000,
        "min_trade_24h_count": 1000,
        "limit": 100
    }
    headers = {"X-API-KEY": "YOUR_API_KEY", "x-chain": "solana"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/v3/token/list");
    url.search = new URLSearchParams({
      sort_by: "volume_24h_change_percent",
      sort_type: "desc",
      min_liquidity: "50000",
      min_holder: "500",
      min_volume_24h_usd: "100000",
      min_trade_24h_count: "1000",
      limit: "100"
    }).toString();
    
    const response = await fetch(url, {
      headers: { "X-API-KEY": "YOUR_API_KEY", "x-chain": "solana" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/token/list?sort_by=volume_24h_change_percent&sort_type=desc&min_liquidity=50000&min_holder=500&min_volume_24h_usd=100000&min_trade_24h_count=1000&limit=100' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    </CodeGroup>

    <Warning>
      Both `sort_by` and `sort_type` are required. Omitting either parameter returns a 400 error.
    </Warning>

    Every filter runs server side, so the ranking logic reads directly from one response with no per token follow up call.

    <Card title="Token Screener" icon="filter" href="/use-cases/discovery-and-screening/token-screener">
      Bulk scanning up to 5000 tokens per call with 40 plus filters, plus the trending feed for a faster read on breakout tokens.
    </Card>
  </Step>
  <Step title="Monitor open positions live">
    Once a trade is open, that position no longer depends on broad market discovery or screening. Its data requirements shift from market coverage to execution speed and maximum freshness.

    <Note>
      Open position monitoring is a streaming workload, not a polling workload.
    </Note>

    **WebSocket events:** [Track Large Transactions](/websockets/track-large-transactions), [Token/Pair OHLCV](/websockets/subscribe-price-ohlcv)

    <CodeGroup>

    ```python Python
    await ws.send(json.dumps({
        "type": "SUBSCRIBE_PRICE",
        "data": {
            "queryType": "simple",
            "chartType": "1m",
            "address": TOKEN_ADDRESS,
            "currency": "usd"
        }
    }))
    
    await ws.send(json.dumps({
        "type": "SUBSCRIBE_LARGE_TRADE_TXS",
        "min_volume": 10000
    }))
    ```

    ```typescript TypeScript
    ws.send(JSON.stringify({
      type: "SUBSCRIBE_PRICE",
      data: {
        queryType: "simple",
        chartType: "1m",
        address: TOKEN_ADDRESS,
        currency: "usd"
      }
    }));
    
    ws.send(JSON.stringify({
      type: "SUBSCRIBE_LARGE_TRADE_TXS",
      min_volume: 10000
    }));
    ```

    </CodeGroup>

    `SUBSCRIBE_PRICE` drives stop-loss and take-profit logic without polling. `SUBSCRIBE_LARGE_TRADE_TXS` acts as the whale alarm: set a minimum volume and the socket only pushes trades above it.

    <Warning>
      [`POST /defi/multi_price`](/data-api/price-ohlcv/post-defi-multi-price) supports up to 100 addresses per call, but unknown tokens can return `null`. Handle that value explicitly instead of assuming every address has a price.
    </Warning>

    <CardGroup cols={2}>
      <Card title="Whale Transaction Tracker" icon="fish" href="/use-cases/trading-signals-and-alerts/whale-tracker">
        The REST alternative for large trade detection, with buy and sell pressure split out.
      </Card>

      <Card title="Token Price Alert Monitor" icon="bell" href="/use-cases/trading-signals-and-alerts/token-price-alert-monitor">
        Absolute and percent alerts confirmed on a closed candle, to keep wicks from firing false signals.
      </Card>
    </CardGroup>
  </Step>
  <Step title="Profile holders and track smart money">
    Charts cannot show who owns a token or whether the wallets that matter are buying or selling. The final stage adds that ownership and smart money context.

    **Endpoint:** [`GET /smart-money/v1/token/list`](/data-api/smart-money/get-smart-money-v1-token-list)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/smart-money/v1/token/list"
    params = {
        "sort_by": "net_flow",
        "sort_type": "desc",
        "interval": "1d",
        "trader_style": "all"
    }
    headers = {"X-API-KEY": "YOUR_API_KEY", "x-chain": "solana"}
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/smart-money/v1/token/list");
    url.search = new URLSearchParams({
      sort_by: "net_flow",
      sort_type: "desc",
      interval: "1d",
      trader_style: "all"
    }).toString();
    
    const response = await fetch(url, {
      headers: { "X-API-KEY": "YOUR_API_KEY", "x-chain": "solana" }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/smart-money/v1/token/list?sort_by=net_flow&sort_type=desc&interval=1d&trader_style=all' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    </CodeGroup>

    This flips the usual question. Instead of asking who trades a given token, it asks what historically profitable wallets are trading right now.

    <Tip>
      Feed these wallet signals back into screening. The next pass can rank candidates by both market momentum and smart money activity.
    </Tip>

    <CardGroup cols={2}>
      <Card title="Token Investigation Dashboard" icon="magnifying-glass" href="/use-cases/risk-and-integrity/token-investigation-dashboard">
        Ownership concentration and behavior tags in one view.
      </Card>

      <Card title="Smart Money Copy Trading" icon="users" href="/use-cases/trading-signals-and-alerts/smart-money-copy-trading">
        Verify a wallet's full track record before following it.
      </Card>
    </CardGroup>
  </Step>
</Steps>

## Watch your credit budget

Different stages consume credits at different rates. Expose this in your monitoring so the bot can degrade gracefully before the budget is exhausted.

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
  When credits run low, slow down screening first, stretch holder profiling second, and protect position monitoring until last. A stop-loss cannot wait for a budget check, but a screening pass can.
</Tip>

## Before you ship

- Discovery only writes to the queue, no trades fire from the socket consumer.
- Every candidate passes `token_security` and a liquidity floor before screening or entry logic sees it.
- Screening uses server side filters, no client side filtering of bulk downloads.
- Stop-loss and whale reaction logic run off the WebSocket, never off a REST polling loop.
- `null` responses from `multi_price` are handled explicitly, not assumed away.
- Credit usage is observable, with a defined degradation order that protects position monitoring.

## FAQ

<AccordionGroup>
  <Accordion title="What package do I need to run this pipeline?">
    The WebSocket stages, Discover and Monitor, require a Premium package or higher. On lower tiers, replace them with REST polling of new listings and multi price at a slower cadence. The REST gate and screening stages run from Lite or Starter and above, and the scroll variant of token list requires Business or Enterprise. Full details live on the [Data Accessibility by Packages](/guides/data-accessibility-by-packages) page.
  </Accordion>

  <Accordion title="What does the holder endpoint actually tell me?">
    `GET /defi/v3/token/holder` returns the holder list and how much each wallet currently holds, which is what cap table concentration math needs. For a summarized view beyond the raw list, pair it with `GET /token/v1/holder-profile`, available on Solana only, from Starter packages and above.
  </Accordion>

  <Accordion title="Why run discovery on WebSocket instead of polling the new listing endpoint?">
    Latency and cost. New Solana tokens launch every few seconds, so a polling loop is either too slow to be competitive or too frequent to be affordable. The WebSocket pushes new pair and new listing events the moment they occur on chain, while the REST endpoint is reserved for backfill after restarts or reconnects.
  </Accordion>

  <Accordion title="How do I keep credit consumption under control as the bot scales?">
    Gate aggressively and degrade in a defined order. Cheap stages, discovery and the security gate, reject most tokens before expensive stages like screening and profiling ever run on them. Monitor `GET /utils/v1/credits`, and when the budget runs low, slow down screening and profiling first while keeping live position monitoring untouched.
  </Accordion>
</AccordionGroup>

A trading strategy only performs as well as the data feeding it. By separating discovery, risk gating, screening, execution, and profiling into independent stages, the pipeline stays scalable, observable, and easy to evolve as your strategy changes.
