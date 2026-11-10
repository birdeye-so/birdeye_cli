---
title: "Wash Trading Detector"
description: "Stack five independent signals, volume ratios, wallet concentration, cadence, churn, and behavior tags, into one wash trading suspicion score"
---

A token can show 10 million dollars of daily volume and still be hollow, because the same small cluster of wallets keeps passing supply back and forth to make the token look busy. No single signal proves wash trading on its own. Real tokens sometimes trade in tight clusters, and manipulated tokens sometimes look clean on one axis. This detector stacks five independent signals into one suspicion score, so a token that trips several at once is the one worth flagging.

<Card title="TL;DR">
  - Baseline volume against liquidity, trade count, and wallet count
  - Trace every trade to its wallet to find concentration
  - Check trade cadence down to 5 second resolution
  - Spot churn in the top traders
  - Cross check behavior tags on the float
</Card>

![Wash trading detector pipeline showing five signals from token address to a wash suspicion score](https://blog-bds.birdeye.so/wp-content/uploads/2026/07/How-to-Build-a-Wash-Trading-Detector_-5-Proven-Signals-In-Blog-Design-1200x675.png)

All requests share the base URL `https://public-api.birdeye.so`, authenticate with the `X-API-KEY` header, and select the network with `x-chain: solana`.

<Warning>
  Every call below runs over REST since the detector scores a token on demand. No signal here is a verdict by itself, only the combined score across all five is.
</Warning>

## The five signals

<Steps>
  <Step title="Baseline volume against wallets">
    Genuine volume spreads across many wallets and stays in some proportion to liquidity. Fake volume does not. This is the cheapest signal, so it filters obvious cases before you spend credits on trade level analysis.

    **Endpoint:** [`GET /defi/token_overview`](/data-api/stats/get-defi-token-overview)

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/token_overview?address=YOUR_TOKEN' \
      --header 'x-api-key: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    <Tip>
      Three ratios raise a flag: volume more than roughly 50 times liquidity, a high trade count against a low unique wallet count, and buy volume sitting almost exactly on sell volume. Read all three together, any one alone is weak.
    </Tip>

    <Warning>
      Casing is mixed. Most fields are camelCase, such as `v24hUSD` and `uniqueWallet24h`, but `holder` and `global_fees_paid` are snake\_case.
    </Warning>
  </Step>
  <Step title="Trace every trade to its wallet">
    Ratios raise suspicion but cannot name a wallet. Group trades by owner to see how few wallets actually produce the volume.

    **Endpoint:** [`GET /defi/v3/token/txs-by-volume`](/data-api/transactions/get-defi-v3-token-txs-by-volume)

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/token/txs-by-volume?token_address=YOUR_TOKEN&volume_type=usd&sort_type=desc&limit=100' \
      --header 'x-api-key: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    <Warning>
      This path uses `token_address`, breaking the usual `/defi/` convention. A single swap can appear across more than one instruction, so deduplicate on the composite key `tx_hash` plus `ins_index` plus `inner_ins_index`, or you overcount trades and inflate the volume you are trying to audit.
    </Warning>
  </Step>
  <Step title="Check cadence down to 5 seconds">
    Wash bots trade on a timer. That regularity is invisible at hourly resolution and obvious at the resolution of seconds.

    **Endpoint:** [`GET /defi/v3/token/trade-data/single`](/data-api/stats/get-defi-v3-token-trade-data-single)

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/token/trade-data/single?address=YOUR_TOKEN&frames=1m,5m' \
      --header 'x-api-key: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    <Warning>
      This path uses `address`, not `token_address` like the previous step, even though both live under `/defi/v3/token/`. Custom frames down to 5 seconds only work on Solana, Base, BSC, and Ethereum. An even spread of trades and volume across every frame with a flat unique wallet count is the mechanical signature of a bot.
    </Warning>
  </Step>
  <Step title="Spot churn in the top traders">
    A wallet that buys and sells nearly equal volume is not investing, it is churning capital to print volume.

    **Endpoint:** [`GET /defi/v2/tokens/top_traders`](/data-api/wallet-networth-pnl/get-defi-v2-tokens-top-traders)

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v2/tokens/top_traders?address=YOUR_TOKEN&time_frame=24h&sort_by=volume&sort_type=desc&limit=10' \
      --header 'x-api-key: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    <Tip>
      A genuine investor shows a lopsided buy and sell split. A wallet within a few percent of even is the one to flag. Each item also carries a `tags` array, feeding directly into the next signal.
    </Tip>
  </Step>
  <Step title="Cross check behavior tags on the float">
    Whoever runs a wash operation usually holds the token too, and those wallets tend to already carry a behavior tag from how they acquired it.

    **Endpoint:** [`GET /token/v1/holder-profile`](/data-api/holder/get-token-v1-holder-profile)

    ```bash
    curl --request GET \
      --url 'https://public-api.birdeye.so/token/v1/holder-profile?token_address=YOUR_TOKEN' \
      --header 'x-api-key: YOUR_API_KEY' \
      --header 'x-chain: solana'
    ```

    <Warning>
      When bundler or sniper wallets hold a large share of supply on a token that already tripped the earlier signals, the case gets much stronger. The bundler tag is accurate only for tokens created from March 2026 onward.
    </Warning>
  </Step>
</Steps>

## Rule out the innocent explanations

Before you act on a high score, rule out the legitimate patterns that trip the same signals. Skipping this is how a detector earns a reputation for crying wolf.

- **Market makers** produce exactly the profile the churn signal looks for, since they quote both sides continuously. The tell is consistency across time rather than a burst: a market maker runs the same way all day, while a wash operation usually clusters around a listing or a marketing push.
- **Arbitrage bots** fire on a schedule because they poll for price gaps on a schedule. Check the `source` field: arbitrage spans two pools by definition, while wash trading usually cycles inside one.
- **Fresh tokens** set off almost every signal at once, few holders, thin liquidity, a high trade to wallet ratio. Weight signals lighter inside the first day of trading, or screen new tokens under a separate rule.
- **Low float** distorts concentration in the same direction, since a handful of wallets naturally account for most trading when only a small share of supply circulates. Measure concentration against circulating supply where the data allows.

## Turn five signals into one wash score

No signal is a verdict, so the detector's real job is combining them. A practical starting scheme gives one point per flag: volume more than roughly 50 times liquidity, a trade count mapping to only a small fraction as many unique wallets, buy and sell volume within a few percent of each other, a single owner driving more than a fifth of traced volume after dedup, and bundler or sniper wallets holding a large share of the float.

<Tip>
  A token at four or five points earns a hard look. A token at one point is usually noise. Calibrate the thresholds against tokens you already trust and tokens you know were manipulated, sliding each cutoff until the clean set scores low and the manipulated set scores high.
</Tip>

## Watch your credit budget

Scoring one token spends five calls, and screening a long watchlist adds up fast.

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
  Log the per signal breakdown next to the total score, not just the number. When you act on a flag, the breakdown tells you which pattern tripped it, which is what lets you sharpen thresholds over time.
</Tip>

## Before you ship

- Baseline reads `v24hUSD` and `uniqueWallet24h` as camelCase and compares volume against liquidity.
- Wallet trace calls `txs-by-volume` with `token_address` and deduplicates on the composite key.
- Cadence calls `trade-data/single` with `address`, and only trusts 5 second frames on Solana, Base, BSC, and Ethereum.
- Churn reads `volumeBuyUSD` against `volumeSellUSD`, mapped apart from `volumeUsd`.
- Tag overlap calls `holder-profile` with `token_address` and weights the bundler tag lighter on tokens created before March 2026.
- No single signal is treated as proof, only the stacked score.

## FAQ

<AccordionGroup>
  <Accordion title="Can one signal confirm wash trading?">
    No. Every signal has innocent explanations on its own. The detector works by combining volume ratios, wallet concentration, cadence, churn, and tag overlap, so a token that trips several at once is the one to flag.
  </Accordion>

  <Accordion title="How do you avoid overcounting trades?">
    A single swap can appear across more than one instruction row. Deduplicate on the composite key `tx_hash` plus `ins_index` plus `inner_ins_index`, unique per real trade, before counting wallets or volume.
  </Accordion>

  <Accordion title="How often should you rescore a token?">
    Wash patterns shift, so a token that scores clean today can be manipulated next week. Rescore on the cadence your credit budget allows, and always rescore right before acting on a token's volume rather than trusting a stale result.
  </Accordion>
</AccordionGroup>

Five independent signals, stacked into one score, turn a headline volume number nobody trusts into a suspicion rating you can actually screen a watchlist by.
