---
title: "Rug Checker"
description: "Score a token across authority, mint and burn history, holder concentration, and sellability, on Solana and EVM"
---

A token can pass every surface glance, a clean name, a real logo, a live price, and still be built to trap your money. A rug checker exists to find what a price chart hides: a mint authority that can print more supply, a freeze authority that can lock your wallet, liquidity that looks deep but cannot actually be sold into.

This guide runs five independent checks against a token and folds the results into one risk score. None of the checks depend on another, so run them in parallel and treat any single hard fail as enough to flag the token.

<Card title="TL;DR">
  - Scan authority and contract risk with `token_security` and `token_creation_info`
  - Catch stealth mint and burn events
  - Measure holder concentration
  - Profile holder behavior for bundlers, snipers, and insiders
  - Confirm the token can actually be sold
</Card>

![Rug checker architecture built with Birdeye Data: five token security checks run in parallel into a combined risk score across Solana and EVM](https://blog-bds.birdeye.so/wp-content/uploads/2026/06/How-to-Build-a-Solana-Portfolio-Tracker-with-Birdeye-Data-Element-banners-4-1200x675.png)

<Warning>
  Coverage is not symmetric across chains. Mint and burn history, holder concentration, and holder behavior are Solana only. On EVM the scan leans on the security object and a sellability test. Each step below is labeled with the chains it actually supports.
</Warning>

All requests share the base URL `https://public-api.birdeye.so`, authenticate with the `X-API-KEY` header, and select the network with the `x-chain` header. That header matters more here than usual, since it decides whether `token_security` returns the Solana or the EVM schema.

<Note>
  Parameter names are not consistent across this scanner. The `defi` endpoints take the token as `address`, while `holder/v1` and `token/v1` endpoints take it as `token_address`. Sending the wrong one returns an invalid value error.
</Note>

## The five checks

<Steps>
  <Step title="Scan authority and contract risk">
    **Chains:** Solana and EVM

    **Endpoint:** [`GET /defi/token_security`](/data-api/security/get-defi-token-security), [`GET /defi/token_creation_info`](/data-api/creation-trending/get-defi-token-creation-info)

    This check does the most work, and behaves differently per chain. The `x-chain` header selects the response schema, so your parser has to branch.

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

    On Solana, read `ownerAddress` for mint authority, `mutableMetadata`, `freezeable` and `freezeAuthority`, `transferFeeEnable`, `isToken2022`, `creatorPercentage`, and `top10HolderPercent`. A `null` `ownerAddress` means the mint authority has been renounced and no new supply can be minted; a present address means it is still live. There is no honeypot flag on Solana, because the equivalent danger is a live freeze authority: an issuer who can freeze tokens can lock your position after you buy.

    On EVM, the same endpoint returns a different set: `isHoneypot`, `buyTax` and `sellTax`, `canTakeBackOwnership`, `hiddenOwner`, `isMintable`, and `lpHolders` with lock details. Field coverage varies by EVM chain, with Ethereum returning the fullest set, so check every field for null rather than assuming it is present.

    <Warning>
      Most fields in this response are nullable on Solana, including `freezeable`, `freezeAuthority`, and the transfer fee fields. A `null` value can mean the risk does not apply, not that the check failed, so null check every field before scoring it rather than treating `null` as missing data.
    </Warning>

    <Note>
      `token_creation_info` adds the creation transaction, the creator wallet, and the block time, which lets you flag tokens deployed minutes ago by a wallet with no history.
    </Note>
  </Step>
  <Step title="Catch stealth mint and burn events">
    **Chains:** Solana only

    **Endpoint:** [`GET /defi/v3/token/mint-burn-txs`](/data-api/transactions/get-defi-v3-token-mint-burn-txs)

    A static supply number hides a moving one. A project can mint quietly after launch or stage a fake burn that never leaves their control. This endpoint lists the actual mint and burn transactions so you see supply changing rather than trusting a snapshot.

    | Parameter | Required | Notes |
    | --- | --- | --- |
    | `address` | Yes | Token address |
    | `type` | Yes | `all` (default), `mint`, or `burn` |
    | `sort_by` | Yes | `block_time` (default and only value) |
    | `sort_type` | Yes | `desc` (default) or `asc` |
    | `limit` | No | Up to 100 |

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/v3/token/mint-burn-txs"
    params = {
        "address": "TOKEN_ADDRESS",
        "type": "all",
        "sort_by": "block_time",
        "sort_type": "desc",
        "limit": 100
    }
    headers = {
        "accept": "application/json",
        "x-chain": "solana",
        "X-API-KEY": "YOUR_API_KEY"
    }
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/v3/token/mint-burn-txs");
    url.search = new URLSearchParams({
      address: "TOKEN_ADDRESS",
      type: "all",
      sort_by: "block_time",
      sort_type: "desc",
      limit: "100"
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
      --url 'https://public-api.birdeye.so/defi/v3/token/mint-burn-txs?address=TOKEN_ADDRESS&type=all&sort_by=block_time&sort_type=desc&limit=100' \
      --header 'accept: application/json' \
      --header 'x-chain: solana' \
      --header 'X-API-KEY: YOUR_API_KEY'
    ```

    </CodeGroup>

    A burst of mint transactions after a quiet launch is a clear flag. So is a burn sent to an address the team still controls, which only looks like a burn.
  </Step>
  <Step title="Measure holder concentration">
    **Chains:** Solana only

    **Endpoint:** [`GET /defi/v3/token/holder`](/data-api/holder/get-defi-v3-token-holder), [`GET /holder/v1/distribution`](/data-api/holder/get-holder-v1-distribution)

    If a handful of wallets hold most of the supply, a coordinated sell can erase your position regardless of how clean the contract looks. The fastest signal is already in the Step 1 response, `top10HolderPercent` from `token_security`. For the full picture, pull the top holder list and the distribution stats.

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/holder/v1/distribution"
    params = {"token_address": "TOKEN_ADDRESS", "include_list": "true"}
    headers = {
        "accept": "application/json",
        "x-chain": "solana",
        "X-API-KEY": "YOUR_API_KEY"
    }
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/holder/v1/distribution");
    url.searchParams.set("token_address", "TOKEN_ADDRESS");
    url.searchParams.set("include_list", "true");
    
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
      --url 'https://public-api.birdeye.so/holder/v1/distribution?token_address=TOKEN_ADDRESS&include_list=true' \
      --header 'accept: application/json' \
      --header 'x-chain: solana' \
      --header 'X-API-KEY: YOUR_API_KEY'
    ```

    </CodeGroup>

    <Warning>
      This endpoint takes `token_address`, not `address`. Mixing up the two parameter names is the most common mistake across this scanner.
    </Warning>
  </Step>
  <Step title="Profile holder behavior">
    **Chains:** Solana only

    **Endpoint:** [`GET /token/v1/holder-profile`](/data-api/holder/get-token-v1-holder-profile)

    Concentration tells you how the supply is split. Behavior tags tell you who is holding it. This endpoint breaks the holder base into tags such as bundler, sniper, insider, dev, and smart\_trader, which exposes a launch that is mostly insiders and bundlers wearing different wallets.

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/token/v1/holder-profile"
    params = {"token_address": "TOKEN_ADDRESS"}
    headers = {
        "accept": "application/json",
        "x-chain": "solana",
        "X-API-KEY": "YOUR_API_KEY"
    }
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/token/v1/holder-profile");
    url.searchParams.set("token_address", "TOKEN_ADDRESS");
    
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
      --url 'https://public-api.birdeye.so/token/v1/holder-profile?token_address=TOKEN_ADDRESS' \
      --header 'accept: application/json' \
      --header 'x-chain: solana' \
      --header 'X-API-KEY: YOUR_API_KEY'
    ```

    </CodeGroup>

    <Note>
      The bundler tag is reliable only for tokens created from March 2026 onward, so treat it as absent for older tokens rather than as a clean signal. Confirm this endpoint is available on your package before depending on it, since it sits outside the core accessibility table. Treat this whole step as an enrichment layer, not a gate.
    </Note>
  </Step>
  <Step title="Confirm real sellability">
    **Chains:** Base for the dedicated endpoint, approximations elsewhere

    **Endpoint:** [`GET /defi/v3/token/exit-liquidity`](/data-api/stats/get-defi-v3-token-exit-liquidity) (Base), [`GET /defi/token_overview`](/data-api/stats/get-defi-token-overview) (Solana), `token_security` (other EVM)

    A token can clear every check above and still be impossible to exit, because the liquidity is fake, one sided, or about to be pulled. How you test this depends on the chain, and there is no single endpoint that covers all of them.

    <CodeGroup>

    ```python Python
    import requests
    
    url = "https://public-api.birdeye.so/defi/v3/token/exit-liquidity"
    params = {"address": "TOKEN_ADDRESS"}
    headers = {
        "accept": "application/json",
        "x-chain": "base",
        "X-API-KEY": "YOUR_API_KEY"
    }
    
    response = requests.get(url, params=params, headers=headers).json()
    ```

    ```typescript TypeScript
    const url = new URL("https://public-api.birdeye.so/defi/v3/token/exit-liquidity");
    url.searchParams.set("address", "TOKEN_ADDRESS");
    
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "x-chain": "base",
        "X-API-KEY": "YOUR_API_KEY"
      }
    }).then((res) => res.json());
    ```

    ```bash cURL
    curl --request GET \
      --url 'https://public-api.birdeye.so/defi/v3/token/exit-liquidity?address=TOKEN_ADDRESS' \
      --header 'accept: application/json' \
      --header 'x-chain: base' \
      --header 'X-API-KEY: YOUR_API_KEY'
    ```

    </CodeGroup>

    <Warning>
      This endpoint requires `x-chain: base` and returns a chain not supported error on anything else. On Solana, there is no exit liquidity endpoint, so approximate sellable depth from the `liquidity` field on `token_overview`, or price an actual swap through an external router. On other EVM chains, lean on `isHoneypot`, `buyTax`, and `sellTax` from the Step 1 security object.
    </Warning>
  </Step>
</Steps>

## Watch your credit budget

A scanner that fires five checks per token adds up fast, so track consumption from day one.

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
  If you scan on every page load, cache results for a short window so the same token is not rescanned on every view, and watch this endpoint to catch a runaway batch before it hits overage.
</Tip>

## Before you ship

- The `token_security` parser branches on `x-chain`, since Solana and EVM return different fields.
- `exit-liquidity` is only called with `x-chain: base`, and Solana falls back to `token_overview` liquidity.
- `token_address` is used for the `holder/v1` and `token/v1` calls, and `address` for the `defi` calls.
- `holder-profile` is treated as optional enrichment, not a required gate.
- Results are cached for a short window so a token is not rescanned on every page view.

## FAQ

<AccordionGroup>
  <Accordion title="Does this rug checker work the same on Solana and EVM?">
    No. Authority and contract risk from Step 1 works on both. Mint and burn history, holder concentration, and holder behavior are Solana only. On EVM the scan relies on the security object plus a sellability test, with exit liquidity available only on Base.
  </Accordion>

  <Accordion title="Why does token_security return different fields on Solana versus EVM?">
    The schema is chain specific and selected by the `x-chain` header. Solana returns mint and freeze authority, mutable metadata, and transfer fee fields. EVM returns honeypot, buy and sell tax, ownership, and LP lock fields. Branch your parser on chain rather than expecting one shape.
  </Accordion>

  <Accordion title="Is a single freeze authority really a rug signal on Solana?">
    It is one of the strongest signals available. A live freeze authority lets the issuer lock your tokens after purchase, which functions as a honeypot. Solana has no honeypot flag precisely because freeze authority covers that risk.
  </Accordion>
</AccordionGroup>

You now have a five check rug checker that scores a token before anyone trades it.
