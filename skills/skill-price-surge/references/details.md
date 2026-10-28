<!-- Generated from docs/workflows/price-surge.md; edit the source and run npm run skills:sync. -->

# Price Surge Screen

Find tokens whose price is rising within a market-cap band, apply auditable risk rules, and optionally enrich a bounded shortlist. The CLI, installed `skill-price-surge` instructions and HTTP endpoint use the same internal service. No AI provider is required.

## Install and first run

From a source checkout with Node.js 22.16 or newer:

```bash
npm ci
npm run build
npm pack
npm install --global ./birdeye-cli-0.4.0.tgz
birdeye-cli config init
npx skills add ./skills --skill skill-price-surge --global
```

Use the tarball filename printed by `npm pack`. The skill installer installs instructions; the CLI and API key are configured separately. Enter the API key in the local hidden prompt, never in a chat. For automation, use `BIRDEYE_API_KEY`. With a source build, replace `birdeye-cli` with `node dist/index.js`.

Preview without credentials, network requests or CU:

```bash
birdeye-cli price-surge --chain solana --interval 1h \
  --min-market-cap 50000 --max-market-cap 5000000 --estimate-cu
```

Run the standard screen, then optionally enrich the first three survivors:

```bash
birdeye-cli price-surge --min-market-cap 50000 --max-market-cap 5000000 \
  --max-cu 50 --format plain

birdeye-cli price-surge --mode advanced --with-security --top 3 \
  --min-market-cap 50000 --max-market-cap 5000000 \
  --max-dev-hold-pct 15 --max-top10-pct 60 --max-cu 320 --format ui
```

Example agent request: “Use skill-price-surge to find Solana tokens up at least 50% over one hour, with market caps from $50,000 to $5 million. Use advanced mode with security on at most three tokens and a 320-CU budget. Explain exclusions and missing evidence.”

`--format json` and `--format ui` return the versioned result envelope; `plain` and `table` show candidates and an Auto-filtered table. `--short` omits raw payloads from the printed result; the saved history retains them. `--format interface` opens the local interface with the prepared skill. The compatible case command accepts nested JSON:

```bash
birdeye-cli case skill-price-surge \
  --price-surge '{"chain":"base","mode":"advanced","top":2}' --estimate-cu
```

## Inputs

HTTP and programmatic inputs use snake_case; CLI flags use hyphens.

| Input | Default | Meaning |
| --- | --- | --- |
| `chain` | `solana` | `solana`, `bsc`, `base`, `ethereum`, `robinhood` |
| `interval` | `1h` | `1m`, `5m`, `30m`, `1h`, `2h`, `4h`, `8h`, `24h`, `7d`, `30d` |
| `mode` | `standard` | `standard` or `advanced` |
| `min_price_change` | 50 | Minimum price increase, percentage points |
| `min_market_cap`, `max_market_cap` | unset | Inclusive market-cap band in USD |
| `min_liquidity`, `max_liquidity` | 10000, unset | Liquidity band in USD |
| `min_volume` | 5000 | Minimum USD volume over the surge interval |
| `min_trade_count`, `min_holders` | unset | Minimum interval trades and holder count |
| `platform` | unset | Provider platform name, e.g. `pump.fun` |
| `sort_by` | `price_change` | `price_change`, `volume`, `market_cap`, `liquidity`, `trade_count`, `holder` |
| `sort_type` | `desc` | `asc` or `desc` |
| `limit`, `offset` | 10, 0 | One page, limit 1–100; offset + limit ≤10000 |
| `top` | 10 | Advanced hydration cap, 0–100, further capped by limit; 0 disables hydration |
| `with_security` | false | Advanced-only security call |
| `no_auto_filter` | false | Keep flagged rows; still calculate and report all risk flags |
| `no_holder_health` | false | Skip Solana holder-profile calls |
| `max_liq_mcap_ratio` | 0.005 | **Minimum** liquidity / market cap; legacy name retained from the spec |
| `max_trades_per_wallet` | 150 | Maximum 24h trades / unique wallets |
| `max_dev_hold_pct`, `max_top10_pct` | unset | Maximum supply shares in percent; require security evidence |
| `min_kol_buyers` | unset | Minimum observed KOL buyers within the fetched trader sample |

Inverted bands, invalid numbers, unknown parameters and unsupported chains fail before fetching. `with_security` in standard mode is rejected. Security-dependent caps without security are retained in the echoed parameters and explicitly described as unevaluated.

## Internal HTTP API

Start the existing local service:

```bash
birdeye-cli --format interface --bind 127.0.0.1:8787
```

The single aggregate endpoint is `POST /price-surge`. It accepts the inputs above plus `estimate_cu` (boolean, default false) and `max_cu` (nonnegative integer or null). A live request waits for the result and returns all collected data and computed metrics. It also saves the run in the existing history. The endpoint shares the local service's connection-code authentication, Host/Origin checks, session budget and single-active-run limit.

Authenticate using the code printed by the local server, then reuse the cookie:

```bash
curl -c /tmp/birdeye-session.cookies http://127.0.0.1:8787/api/connect \
  -H 'Content-Type: application/json' --data '{"code":"LOCAL_CONNECTION_CODE"}'

curl -b /tmp/birdeye-session.cookies http://127.0.0.1:8787/price-surge \
  -H 'Content-Type: application/json' \
  --data '{"chain":"solana","mode":"advanced","top":3,"with_security":true,"min_market_cap":50000,"max_market_cap":5000000,"max_cu":320}'
```

Add `"estimate_cu":true` to obtain a free plan from the same endpoint. No upstream endpoint selection is exposed by this aggregate API. The existing raw data commands remain available independently.

Success returns `{schemaVersion:1,data:{kind:"price-surge-v1",...},meta:{...}}`. Inspect `meta.coverage`: an upstream failure or exhausted budget produces `partial`, retaining completed evidence and describing unperformed calls in `data.missing`. HTTP 200 can therefore carry a partial result. Invalid requests return 400, missing sessions 401, denied origins 403 and concurrent runs 409. CLI partial runs exit with code 5. Retries reserve additional CU; a budget prevents sending any attempt that would exceed the cap. Cancelling the HTTP connection stops further work; sent requests can still consume CU.

For an in-process consumer, import `planPriceSurge` and `runPriceSurge` from `dist/price-surge/api.js`. Construct the existing `Runner` with a ledger and credentials, create a ledger run, then call `runPriceSurge(runner, runId, params, signal)`. The CLI calls this service in-process, so it does not require a background HTTP server.

## Filtering and evidence

The first pass uses the token-list fields. It excludes market cap above FDV ×1.01 (`stale_market_cap`), nonpositive liquidity (`no_liquidity`), zero holders despite interval trades (`zero_holders_with_trades`), thin liquidity (`thin_liquidity`), at least 20 buys and no sells in 24h (`honeypot_proxy`), and excessive trades per wallet (`wash_trade_proxy`). Positive trades with an explicitly zero wallet count also trigger the wash proxy; the undefined ratio stays null.

Advanced mode hydrates only the first `min(top, limit)` first-pass survivors, in provider order. It does not fetch replacement pages or backfill advanced exclusions. Explicit honeypot evidence, transfer fees of at least 90%, unlocked LP plus a live mint/freeze/metadata authority, and exceeded caller caps exclude rows. Transfer fees of at least 10%, creator holdings of at least 10%, and top-10 holdings of at least 50% add flags independently of caps. With `no_auto_filter`, these rows remain visible with `excluded:false`, risk flags and `exclusion_reasons`.

Security creator/top-10 fractions are multiplied by 100. Holder-profile supply percentages are already percentages. Missing LP-lock or authority fields do not prove renouncement or locking. LP lock uses explicit booleans or documented EVM `lpHolders`: a positive unlocked position yields false; locked positions must cover the full supply without duplicate addresses to yield true. Partial locked coverage stays unknown. Transfer fees use current, explicitly denominated basis points; undocumented fee schedules or EVM tax strings with unspecified units remain unknown. The service does not infer supply concentration from holder-profile data when security was not requested.

Trader enrichment requests ten wallets sorted by volume over the surge interval. For 1m/5m screens, it uses 30m, the shortest supported trader window, and records that difference. Profitable-wallet ratio is the percentage of unique sampled wallets with known positive total PnL; realized plus unrealized PnL is used only when both are available. It is not a market-wide win rate. KOL buyers require an observed KOL-like tag and a positive buy-trade count. No KOL-like tags means null, not zero. Holder tags never substitute for the buyer count. Holder-profile volume always uses 1h.

## Result and CU

`data.rows` contains the kept rows; `data.dropped` records each excluded address, symbol, reason and flags. Counts include `n_scanned`, `n_rows`, `n_excluded`, and `n_hydrated`. `n_hydrated` counts rows with at least one nonempty enrichment response, including partial hydration. Each row has `hydration_status` and `missing_fields`; unknown advanced values stay null. `data.params` echoes normalized inputs, `hydration_note` explains skipped/bounded work, and `sources` retains collected payloads with request IDs, retrieval times and endpoint parameters. `raw_response` preserves the complete token-list response. `meta.cu` contains actual local reservations, completed estimates and uncertain attempts, not a confirmed provider bill.

| Mode | Estimated CU before retries |
| --- | --- |
| Standard | 50 |
| Advanced, Solana | 50 + 60 × hydrated rows |
| Advanced, Solana, security enabled | 50 + 90 × hydrated rows |
| Advanced, holder health skipped or non-Solana | 50 + 30 × hydrated rows |
| Previous row, security enabled | 50 + 60 × hydrated rows |

Planning uses the maximum possible hydration count; actual requests can be fewer after exclusions or an empty page. `cu_breakdown` names each source step; ledger totals account for retries and uncertain billing.

## Official contracts checked 2026-10-28

- [Token List V3](https://data.birdeye.so/docs/data-api/tokenmarket-list/get-defi-v3-token-list): surge filters/sorts and market fields, 50 CU. Arbitrum from the product brief is absent from this endpoint's supported-chain list and is rejected locally.
- [Token Security](https://data.birdeye.so/docs/data-api/security/get-defi-token-security): chain-dependent security fields, 30 CU.
- [Token Top Traders](https://data.birdeye.so/docs/data-api/wallet-networth-pnl/get-defi-v2-tokens-top-traders): trader samples and PnL, 30 CU. Its wallet-tag filter does not include KOL, so the screen observes returned tags without requesting an undocumented KOL filter.
- [Holder Profile](https://data.birdeye.so/docs/data-api/holder/get-token-v1-holder-profile): cohort supply shares, 30 CU. Live documentation now includes Robinhood and a native KOL cohort; this screen retains the brief's Solana-only holder-health scope. A KOL holder count is not a KOL buyer count.

Results are research screens. A retained row, missing flag or unhydrated row does not establish token safety.
