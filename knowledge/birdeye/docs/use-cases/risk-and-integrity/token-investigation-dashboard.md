---
title: "Token Investigation Dashboard"
description: "Pull market stats, ownership, behavior tags, top traders, fee flow, and supply integrity for one token into a single screen"
---

A token investigation dashboard pulls everything you need to judge one Solana token into a single screen, so you stop opening six explorer tabs every time a new ticker lands in your feed. You paste one token address, and the dashboard answers the questions that matter: how big and liquid is it, who holds it, which behavior tags dominate the float, who trades it, how much fee flow it throws off, and whether its supply can still be tampered with.

<Card title="TL;DR">
  - Market snapshot and price chart for size and trajectory
  - Ownership concentration and behavior tags for who holds the float
  - Top traders for who moves it
  - Fee flow by venue for how much real value passes through
  - Supply authority and mint and burn history for structural integrity
</Card>

![Vertical reference architecture for a token investigation dashboard built on eight Birdeye Data endpoints](https://blog-bds.birdeye.so/wp-content/uploads/2026/07/How-to-Build-a-Solana-Trading-Bot-Data-Layer-with-Birdeye-Data-In-Blog-Design1-4-1200x675.png)

All requests share the base URL `https://public-api.birdeye.so`, authenticate with the `X-API-KEY` header, and select the network with `x-chain: solana`. The token is the unit of investigation here, not the wallet or the market: one address goes in, eight answers come back, and every call runs over REST since a dashboard reads on demand rather than streaming a feed nobody watches.

<Tip>
  The eight panels share only the token address as input and do not depend on each other, so fire all eight calls in parallel and render each panel as its response lands.
</Tip>

## The eight panels

<Steps>
  <Step title="Market snapshot">
    Every later judgment leans on this. A behavior tag means one thing on a token with 30 million dollars of liquidity and something very different on one with 3 thousand.

    **Endpoint:** [`GET /defi/token_overview`](/data-api/stats/get-defi-token-overview)

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/token_overview?address=YOUR_TOKEN' \
      --header 'x-api-key: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    <Warning>
      Casing is mixed inside one response. Most fields are camelCase, such as `marketCap` and `v24hUSD`, but `holder` and `global_fees_paid` are snake\_case. Map each field name exactly as spelled or those two read as `undefined`.
    </Warning>
  </Step>
  <Step title="Price chart">
    A price means nothing until you see the shape behind it.

    **Endpoint:** [`GET /defi/v3/ohlcv`](/data-api/price-ohlcv/get-defi-v3-ohlcv)

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/ohlcv?address=YOUR_TOKEN&type=1H&time_from=1726670000&time_to=1726700000' \
      --header 'x-api-key: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    <Warning>
      `type`, `time_from`, and `time_to` are all required. The endpoint has no default range, so a request missing any of them fails.
    </Warning>
  </Step>
  <Step title="Ownership concentration">
    A token where two wallets hold 60 percent of supply is one bad decision away from a dump, and nothing in price or volume warns you about it.

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/holder/v1/distribution?token_address=YOUR_TOKEN&mode=top&top_n=20&include_list=true' \
      --header 'x-api-key: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    <Note>
      Each wallet returns `percent_of_supply` already calculated, so the table needs no division. `limit` caps at 50.
    </Note>

    <Card title="Rug Checker" icon="shield-check" href="/use-cases/risk-and-integrity/rug-checker">
      Full concentration checks alongside authority, mint and burn, and behavior signals for a security score, not just a display panel.
    </Card>
  </Step>
  <Step title="Behavior tags">
    A wallet holding 10 percent of supply reads differently depending on who it is. This panel labels the holders, and it is what gives a dashboard its edge over a block explorer.

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/token/v1/holder-profile?token_address=YOUR_TOKEN' \
      --header 'x-api-key: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    <Warning>
      This path uses `token_address`, while the market overview call three panels up used `address`. Mixing them up is the most common reason this call returns nothing. The bundler tag is accurate only for tokens created from March 2026 onward.
    </Warning>
  </Step>
  <Step title="Top traders">
    Holding and trading are separate behaviors. A clean holder distribution can sit on a dead token, and a concentrated float can still trade with genuine volume.

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v2/tokens/top_traders?address=YOUR_TOKEN&time_frame=24h&sort_by=volume&sort_type=desc&limit=10' \
      --header 'x-api-key: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    <Warning>
      `sort_by` takes exact values only, `total_pnl`, `realized_pnl`, or `unrealized_pnl`, never a bare `pnl`. The volume total is `volumeUsd`, but the buy and sell splits are `volumeBuyUSD` and `volumeSellUSD`.
    </Warning>

    <Card title="Smart Money Copy Trading" icon="users" href="/use-cases/trading-signals-and-alerts/smart-money-copy-trading">
      Score a trader's full history before treating a high volume wallet as a signal.
    </Card>
  </Step>
  <Step title="Fee flow by venue">
    Every swap leaves a paper trail of fees, which is harder to hollow out than a volume figure. Breaking fees down by venue tells you where the token actually trades.

    **Endpoint:** [`GET /defi/v3/token/fee/single`](/data-api/global-fees-paid/get-defi-v3-token-fee-single)

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/token/fee/single?address=YOUR_TOKEN&interval=24h,alltime' \
      --header 'x-api-key: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    <Warning>
      Up to 3 timeframes in `interval` per call. One detail field is genuinely misspelled: `trading_platform_fee_amout_stablecoins`. Read it by that exact key, or the lookup returns nothing.
    </Warning>

    <Note>
      The response buckets fees by timeframe, then splits each bucket by fee type, network, priority, tips, platform, and provider, far richer than the single `global_fees_paid` figure on the overview call.
    </Note>
  </Step>
  <Step title="Supply authority">
    None of the panels above rule out a live mint authority that can print fresh supply tomorrow, or a freeze authority that can lock holders out of their own balances.

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/token_security?address=YOUR_TOKEN' \
      --header 'x-api-key: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    <Note>
      On Solana there is no `mintable` boolean. Mint authority is read from `ownerAddress`: `null` means renounced, an address means it is still live.
    </Note>

    <Card title="Rug Checker" icon="shield-check" href="/use-cases/risk-and-integrity/rug-checker">
      The full authority and contract risk check, with the field list per chain.
    </Card>
  </Step>
  <Step title="Mint and burn history">
    A renounced mint authority next to a clean burn history reads very differently from a live authority next to a recent stealth mint. This closes the loop with the supply event log.

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/token/mint-burn-txs?address=YOUR_TOKEN&sort_by=block_time&sort_type=desc&type=all&limit=100' \
      --header 'x-api-key: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    <Warning>
      `sort_by`, `sort_type`, and `type` are all required, with no default to fall back on.
    </Warning>
  </Step>
</Steps>

## Watch your credit budget

Every panel spends compute units, and a dashboard filling eight panels on each token open can burn through a budget faster than expected.

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
  Render remaining credits somewhere visible while you develop, so a runaway loop shows up as a falling number rather than a surprise suspension.
</Tip>

## Before you ship

- Market panel reads `holder` and `global_fees_paid` as snake\_case, everything else as camelCase.
- Ownership panel calls `distribution` with `mode=top` and `holder-profile` with `token_address`.
- Bundler tags carry a dated qualifier for tokens created before March 2026.
- Traders panel sorts by an exact `sort_by` value and maps `volumeUsd` against `volumeBuyUSD`.
- Fee panel reads the misspelled key verbatim and sends at most 3 intervals.
- Integrity panel reads the mint authority from `ownerAddress` and sends all three required parameters to `mint-burn-txs`.
- The `x-chain` header is `solana` on every call, since five of these endpoints are Solana only.

## FAQ

<AccordionGroup>
  <Accordion title="Why is the token investigation dashboard Solana only?">
    Five of the endpoints, holder distribution, holder profile, token fee, and mint and burn history, return data for Solana only. The market, chart, and top trader panels work across chains, so part of the dashboard can extend to EVM, but ownership, fee, and supply panels stay Solana bound.
  </Accordion>

  <Accordion title="How do you read mintability without a mintable field?">
    On Solana the security response has no `mintable` boolean. Read it from `ownerAddress`. A `null` value means the mint authority is renounced and supply is fixed. An address means the authority is still live and more supply can be minted.
  </Accordion>

  <Accordion title="Can you run all eight calls at once?">
    Yes. The panels share only the token address as input and do not depend on each other, so fire the calls in parallel and render each panel as its response arrives.
  </Accordion>
</AccordionGroup>

One address in, eight answers back: size, trajectory, ownership, behavior, traders, fee flow, and supply integrity, all in the time it takes to open a single screen.
