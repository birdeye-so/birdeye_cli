---
title: "Solana New Token Sniper"
description: "Detect new token launches, gate every hit for rug risk, rank momentum, and watch positions over REST or WebSocket"
---

New pools appear faster than a naive loop can poll, half of them are scams, and the feed that tells you a token exists says nothing about whether you can safely buy it. This guide builds the detection and gating layer for a Solana new token sniper, and works whether you have a WebSocket or not: streaming lowers latency, but every stage also runs on REST.

<Card title="TL;DR">
  - Detect new pools and listings over REST or WebSocket
  - Gate every hit for rug risk before it reaches a trade decision
  - Rank survivors by early volume and unique wallets
  - Watch open positions for whale prints and dumps
</Card>

<Warning>
  One rule drives the whole design: a freshly detected token never reaches the trade UI until it clears the security gate. Detection is the easy, noisy part. The gate is what stops you buying a honeypot.
</Warning>

![Reference architecture for a Solana New Token Sniper flowing one way from detection through a security gate to ranking and monitoring](https://blog-bds.birdeye.so/wp-content/uploads/2026/06/How-to-Build-a-Solana-Portfolio-1200x675.png)

All requests share the base URL `https://public-api.birdeye.so`, authenticate with the `X-API-KEY` header, and select the network with `x-chain: solana`.

<Note>
  Detection over REST and the security gate run from the Lite or Starter package up. The WebSocket variants are a Premium package upgrade for lower latency, not a requirement.
</Note>

## The four stage pipeline

<Steps>
  <Step title="Detect new token launches">
    Poll for new listings, or subscribe to a live stream if your package supports it. Track the newest `block_unix_time` you have already seen on REST, and treat anything newer as a fresh hit.

    **Endpoint:** [`GET /defi/v2/tokens/new_listing`](/data-api/tokenmarket-list/get-defi-v2-tokens-new-listing)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/v2/tokens/new_listing"
    params = {"limit": 20, "meme_platform_enabled": "true"}
    headers = {
        "accept": "application/json",
        "x-chain": "solana",
        "X-API-KEY": "YOUR_API_KEY"
    }
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/v2/tokens/new_listing");
    url.searchParams.set("limit", "20");
    url.searchParams.set("meme_platform_enabled", "true");
    
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
      --url 'https://public-api.birdeye.so/defi/v2/tokens/new_listing?limit=20&meme_platform_enabled=true' \
      --header 'accept: application/json' \
      --header 'x-chain: solana' \
      --header 'X-API-KEY: YOUR_API_KEY'
    ```

    </CodeGroup>

    On a Premium package, stream instead of poll for the lowest latency. Open one socket and subscribe to new pairs, new listings, or both.

    <CodeGroup>

    ```python Python
    import asyncio, json, websockets
    
    WS_URL = "wss://public-api.birdeye.so/socket/solana?x-api-key=YOUR_API_KEY"
    
    async def detect():
        async with websockets.connect(WS_URL, subprotocols=["echo-protocol"]) as ws:
            await ws.send(json.dumps({"type": "SUBSCRIBE_NEW_PAIR", "min_liquidity": 5000}))
            await ws.send(json.dumps({
                "type": "SUBSCRIBE_TOKEN_NEW_LISTING",
                "meme_platform_enabled": True,
                "min_liquidity": 5000
            }))
            async for message in ws:
                event = json.loads(message)
                if event.get("type") == "NEW_PAIR_DATA":
                    gate(event["data"]["base"]["address"])
    ```

    ```typescript TypeScript
    import WebSocket from "ws";
    
    const ws = new WebSocket(
      "wss://public-api.birdeye.so/socket/solana?x-api-key=YOUR_API_KEY",
      "echo-protocol"
    );
    
    ws.on("open", () => {
      ws.send(JSON.stringify({ type: "SUBSCRIBE_NEW_PAIR", min_liquidity: 5000 }));
      ws.send(JSON.stringify({
        type: "SUBSCRIBE_TOKEN_NEW_LISTING",
        meme_platform_enabled: true,
        min_liquidity: 5000
      }));
    });
    
    ws.on("message", (raw) => {
      const event = JSON.parse(raw.toString());
      if (event.type === "NEW_PAIR_DATA") {
        gate(event.data.base.address);
      }
    });
    ```

    </CodeGroup>

    <Warning>
      A `NEW_PAIR_DATA` event carries the pool sides, source, and transaction hash, but no risk data at all. `SUBSCRIBE_NEW_PAIR` does not deliver Openbook pairs, while `SUBSCRIBE_TOKEN_NEW_LISTING` has broader source coverage, so subscribe to both for full reach.
    </Warning>
  </Step>
  <Step title="Gate every hit for rug risk">
    A freshly detected token is safe to show only after it clears a security check. Read the mint and freeze authority, mutable metadata, liquidity, and holder concentration from `token_security`, `token_creation_info`, `token_overview`, and `holder/v1/distribution`.

    **Endpoint:** [`GET /defi/token_security`](/data-api/security/get-defi-token-security)

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/token_security?address=NEW_TOKEN_MINT' \
      --header 'accept: application/json' \
      --header 'x-chain: solana' \
      --header 'X-API-KEY: YOUR_API_KEY'
    ```

    <Note>
      Solana liquidity comes from the `liquidity` field on `token_overview`, not exit liquidity, since that endpoint is Base only. `holder/v1/distribution` takes the token as `token_address`, not `address`.
    </Note>

    <Card title="Rug Checker" icon="shield-check" href="/use-cases/risk-and-integrity/rug-checker">
      The full five check gate, including mint and burn history and holder behavior tags, with the exact field list per chain.
    </Card>
  </Step>
  <Step title="Rank survivors by early momentum">
    A single `token_overview` call returns price, liquidity, market cap, and per timeframe metrics including unique wallets and buy and sell volume. Request only the short frames you score on with the `frames` parameter to keep payloads small.

    To refresh a live candidate list without one request per token, batch up to 100 addresses through `multi_price`.

    **Endpoint:** [`POST /defi/multi_price`](/data-api/price-ohlcv/post-defi-multi-price)

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/multi_price"
    params = {"include_liquidity": "true"}
    headers = {
        "accept": "application/json",
        "x-chain": "solana",
        "content-type": "application/json",
        "X-API-KEY": "YOUR_API_KEY"
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
        accept: "application/json",
        "x-chain": "solana",
        "content-type": "application/json",
        "X-API-KEY": "YOUR_API_KEY"
      },
      body: JSON.stringify({ list_address: "MINT_1,MINT_2,MINT_3" })
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request POST \
      --url 'https://public-api.birdeye.so/defi/multi_price?include_liquidity=true' \
      --header 'accept: application/json' \
      --header 'x-chain: solana' \
      --header 'content-type: application/json' \
      --header 'X-API-KEY: YOUR_API_KEY' \
      --data '{ "list_address": "MINT_1,MINT_2,MINT_3" }'
    ```

    </CodeGroup>

    <Warning>
      Tokens that are unknown or unsupported come back as `null` on their key rather than as an error. Guard each result before reading a price. One refresh tick is one request, so cost stays flat as the watchlist grows.
    </Warning>
  </Step>
  <Step title="Watch positions for the dump">
    Once a token is on the watchlist, price movement and large trade alerts matter most. Poll the latest candles and trades filtered by volume on any paid tier from Lite or Starter up, or stream for the lowest latency on a Premium package.

    **Endpoint:** [`GET /defi/v3/token/txs-by-volume`](/data-api/transactions/get-defi-v3-token-txs-by-volume)

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/token/txs-by-volume?token_address=NEW_TOKEN_MINT&volume_type=usd&sort_type=desc&min_volume=5000' \
      --header 'accept: application/json' \
      --header 'x-chain: solana' \
      --header 'X-API-KEY: YOUR_API_KEY'
    ```

    <CardGroup cols={2}>
      <Card title="Whale Transaction Tracker" icon="fish" href="/use-cases/trading-signals-and-alerts/whale-tracker">
        Full whale detection pipeline, with buy and sell pressure split out.
      </Card>

      <Card title="Token Price Alert Monitor" icon="bell" href="/use-cases/trading-signals-and-alerts/token-price-alert-monitor">
        Absolute and percent alerts confirmed on a closed candle.
      </Card>
    </CardGroup>
  </Step>
</Steps>

## Watch your credit budget

Polling for detection and monitoring is credit hungry, so wire this in from day one.

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
  The response splits usage into REST `api` and WebSocket `ws`, plus `remaining` credits. Poll it hourly and widen your detection and monitor intervals automatically when remaining credits fall below a safe threshold, rather than hitting a 429 mid launch.
</Tip>

## Before you ship

- No detected token reaches the trade UI before it clears the security gate.
- Solana liquidity is read from `token_overview`, since `exit-liquidity` is Base only.
- `token_address` is used for `holder/v1/distribution`, and `address` for the `defi` endpoints.
- `null` results from `multi_price` are handled explicitly, not assumed away.
- Detection and monitor intervals back off automatically when credits run low.

## FAQ

<AccordionGroup>
  <Accordion title="Can I build this without a WebSocket?">
    Yes. Detection and monitoring both have REST paths. Detection runs on any paid tier, and the security gate and whale feed need the Lite or Starter package or higher. The WebSocket streams are a lower latency upgrade available from the Premium package up, not a requirement.
  </Accordion>

  <Accordion title="Does the new pair stream include meme launchpad tokens?">
    Set `meme_platform_enabled=true` on `new_listing` or on `SUBSCRIBE_TOKEN_NEW_LISTING` to include pump.fun and similar Solana launchpads. `SUBSCRIBE_NEW_PAIR` does not deliver Openbook pairs, so subscribe to new token listing as well for fuller coverage.
  </Accordion>

  <Accordion title="Why does the new pair event have no risk data?">
    Detection and risk are separate concerns by design. A `NEW_PAIR_DATA` event tells you a pool exists, not whether it is safe. Every hit must pass the security gate, which pulls token security, creation info, liquidity, and holder distribution before the token is shown.
  </Accordion>
</AccordionGroup>

That is a complete detect, gate, rank, and watch pipeline for catching new Solana launches.
