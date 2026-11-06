<!-- Generated from skills/token-duediligence/references/scoring.md; edit the source and run npm run skills:sync. -->

# Token Due-Diligent Score · Node.js reconstruction

Implementation: the CLI scoring module, version `token-dd-reconstructed-v1`. Entrypoint: the installed `token-dd-score` command. Requires Node >=22.16 and a built CLI. No Python runtime or duplicated scoring implementation.

This reconstructs the user-supplied Skill #24 specification. No original Python source was available. The current CLI supports Solana; other chains fail preflight. The implementation does not claim skipped-endpoint refunds or cross-chain comparability.

## Run and render

```bash
npm ci
npm run build
token-dd-score --help

# Offline plan; no API key or paid request
token-dd-score So11111111111111111111111111111111111111112 --mode advanced --estimate-cu --format json

# Live evidence; uses saved CLI configuration or BIRDEYE_API_KEY
token-dd-score So11111111111111111111111111111111111111112 --mode advanced --format plain --explain
birdeye-cli case skill-token-dd-score --address So11111111111111111111111111111111111111112 --dd-mode standard --format json

# Launch the UI with this workflow selected
birdeye-cli case skill-token-dd-score --address So11111111111111111111111111111111111111112 --format interface --bind 127.0.0.1:8787
```

| Entrypoint option | Meaning |
|---|---|
| `[address]` | Solana mint; omit when re-scoring |
| `--mode standard\|advanced` | Default advanced; CLI equivalent `--dd-mode` |
| `--top-n 10..50` | One distribution page, default 50; sub-scores use top1/3/10 and display top5 |
| `--liq-resolution` | `1m,5m,15m,30m,1h,4h,1D`, default `15m` |
| `--liq-candles 1..100` | Default 96; stability needs at least 8 valid observations per series |
| `--weights-preset default` | Explicit default only; other preset weights were not supplied |
| `--explain` | Add individual rules to plain output; JSON always includes rules/inputs |
| `--format` | `plain` (default), `telegram`, `ui`, `json`, `raw-json`, `interface` |
| `--short` | Compact summary; full evidence still saved to SQLite |
| `--rescore` | Saved run ID, full JSON file, or `base64:<encoded full JSON>`; maximum 32 MiB |
| `--estimate-cu` | Offline plan |
| `--max-cu` | Optional estimated-CU budget; default unlimited, zero blocks live calls |
| `--chain` | `solana` only |
| `--config-dir` | Directory containing CLI configuration and `usage.sqlite` |
| `--bind`, `--public-url` | Interface address and proxy browser origin; require format interface |

`ui`, `json` and `raw-json` emit the full machine-readable result; the web UI consumes its `data.skillAnalysis.findings[0]`. CU is in that report's `meta`, preserving valid JSON. Plain/Telegram print the ⚡ CU footer. Telegram renders locally and sends no message. Partial evidence exits 5 on live runs while still returning/saving the report; failed requests use the CLI's normal error codes. A successful local re-score exits 0 and retains explicit coverage/missing checks.

## API pipeline and CU

| Step | Operation / endpoint | Estimated CU |
|---|---|---:|
| Overview | `token.overview`: `/defi/token_overview?includes=money_flow`, frames 1m,5m,15m,30m,1h,2h,4h,24h | 21 (18 + 3) |
| Security | `token.security`: `/defi/token_security` | 30 |
| Distribution | `token.holder-distribution`: `/holder/v1/distribution`, wallet/top, include_list, offset 0 | 30 |
| Cohorts | `token.holder-profile`: `/token/v1/holder-profile`, 1h | 30 |
| Top holders | `token.holders`: `/defi/v3/token/holder`, wallet, get_holder_infos, limit 100 | 30 |
| Tagged flow | `token.money-flow`: POST `/defi/v3/token/money-flow`, smart_money/whales/kol, 5m/1h/4h/24h | 10 |
| Liquidity OHLC | `token.liquidity-ohlc`: `/defi/v3/liquidity/ohlc/token`, back, 15m, 96 | 30 provisional |

Standard stops after security: 2 calls / 51 CU. Advanced: 7 calls / provisional 181 CU. Step edits are validated and shown in the UI command preview. Pages are bounded, with no hidden pagination. Retries are additional attempts.

Pricing discrepancy: the supplied specification says OHLC costs 30 CU, while current provider pricing prose still describes resolution-dependent pricing. The schema supports all seven resolutions above. The CLI exposes 30 as **provisional**, with no verified upper bound. A CU budget bounds these local reservations, not the provider's bill. Authoritative inputs checked: [overview](https://data.birdeye.so/docs/data-api/stats/get-defi-token-overview), [liquidity OHLC](https://data.birdeye.so/docs/data-api/price-ohlcv/get-defi-v3-liquidity-ohlc-token), and local `bds-docs-mintlify/openapi/data/openapi_docs.json` / `resources/compute-unit-cost.mdx` on 2026-10-22.

`meta.cu_breakdown` has `base`, `list`, `advanced_security`, `risk_history`, `refunded_rollback`. Completed-attempt estimates, including retries, populate the first three; the last two stay zero. `cu_estimated_total` and `cu_reserved_total` distinguish completed estimates from outstanding/uncertain reservations. `cu_billed_total` stays null because no per-run provider bill is available. Source result CU totals are cumulative and must not be summed.

## Units, coverage and reconstruction choices

- `creatorPercentage` and `top10HolderPercent` are fractions: multiply by 100 once. Distribution/profile `percent_of_supply` and overview `*ChangePercent` are already percentages. Numeric zero is valid; absent, malformed, empty and boolean numeric inputs are unavailable.
- Explicit null authority means renounced. An absent `ownerAddress` or `freezeAuthority` is unknown. Creator dump requires holding, mint/freeze and metadata evidence; missing required inputs drop that signal.
- A missing signal loses its weight. The pillar score is the weighted mean of available signals; coverage is their weight divided by the declared pillar weight. Inner blends also re-normalize available inputs. Security weights sum to 0.90 in the supplied document; this is preserved rather than inventing an extra 0.10.
- No supplied LST list/canonical mint map: `not_lst` and `not_fake` stay N/A. No supplied pace formula or strict-liquidity/security-first weights: these switches are unsupported. `--pace` fails argument validation.
- `exit_floor` was undefined: v1 uses `min(exit) / max(exit) × 100`. The rule is exposed in the result/UI.
- Flow agreement was ambiguous: v1 compares each observed net-flow sign to `sign(weighted score − 50)`. Buy transaction ratio uses 24h; overlapping windows are never added. Holder-profile volume ratio uses the endpoint's 1h window. Untagged overview flow is never assigned to smart money/whales/KOLs.
- Holder rows use one percent scale and one descending sort. Offset/percent/token-account pages do not establish top-wallet concentration. Missing rows do not become zero shares; top10 requires ten valid rows. Duplicate wallet rows and sums above 100% invalidate that list. Cohort tags may overlap: dev+sniper+bundler is a risk heuristic, not a deduplicated supply statistic.
- Liquidity series use sorted, timestamp-deduplicated observations at/before the request anchor; incomplete current candles may be present. Statistics use actual fetched samples and the reported span includes gaps. No fabricated 24h window, missing candles or inferred pool withdrawals.
- The gate formula takes precedence over the inconsistent example table: at 50% exit drawdown it yields `1 − .15 × smooth(.6) = .9028`, not .940. The supplied 45% liquidity / 30% exit example correctly yields .950.

## Scoring reference

`smooth(x,lo,hi)` means `t²(3−2t)`, `t=clamp((x−lo)/(hi−lo),0,1)`. Log ramps apply this in log10 space; zero magnitude scores zero on an increasing log ramp. Scores stay 0–100; intermediate values are not rounded.

| Pillar | Signals and weights |
|---|---|
| Security | mint .20; freeze .18; metadata .08; LP lock .14; creator dump .20; not-freezable .05; LST .03 N/A; canonical identity .02 N/A |
| Holders | top1 .23 inverse 10–95%; top3 .15 inverse 20–98%; top10 .17 inverse 20–100%; base .20 log10 1.7–3.7; cohort risk .10 inverse 5–35%; sniper count .15 inverse 5–20 |
| Activity | engagement .40; buy pressure .10; momentum .30; drawdown .20 |
| Liquidity | depth .30; stability .25; valuation .20; trend .15; pairs .10 |
| Smart money | presence .25; flow .30; quality .20; whales .15; KOL .10 |

Creator dump is `100 × (1 − smooth(creator%,5,30) × (.6 + .4 × authorities/3))`. Metadata immutable scores 100, mutable 40; explicit authority/LP flags use the supplied 0/100 rules. `isHoneypot === true` forces Security and FINAL to zero/F, even with missing other data.

Engagement averages ramps: log trades20–15000, vol/liquidity .01–3, vol/marketCap .00751–1.6202, wallets3–353. Buy pressure uses frames5m/1h/4h/24h with .15/.25/.25/.35 weights and linear `clamp((buy_ratio−.43)/.24)`; optional 10% tilt uses smooth net24h/vol24h from −.10 to .15.

Momentum uses 15m/1h/4h/24h weights .10/.20/.30/.40. Frame tone averages price .30×tanh(pct/35), volume .35×tanh(pct/90), wallets .25×tanh(pct/60), liquidity .10×tanh(pct/40). Score is 50+50×tone. Drawdown is inverse worst smooth give-back of 24h−1h,24h−4h,4h−1h over12–65%, or 1h sell-off15–60%.

Liquidity depth blends .45 log liquidity1500–800000 and .55 log exit1000–400000. Stability blends .35 inverse liquidity swing10–60%, .40 inverse exit swing10–60%, .25 exit floor20–90%. Valuation blends .45 inverse log mcap/liquidity20–500 and .55 inverse log mcap/exit40–1000. Trend is `50+50×tanh(relative liquidity change/.30)`; pairs ramps1–5. Statistics expose current/first/min/max/median/mean/population std/std%/swing/from-peak/trend/sample count.

Smart presence averages smart-trader count0–25 and share0–8%. Flow blends .55 smart flow(−5%,+12%) and .45 linear 24h buy transaction ratio(.40–.75). Quality blends .55 smart share0–10% and .45 cohort buy-volume ratio(.45–.75). Whales averages count0–20/share0–12%/flow(−8%,+8%); KOL averages count0–40/share0–8%/flow(−5%,+6%). Cohort flow is net-tag-USD/total-market-frame-volume across5m/1h/4h/24h weighted .15/.25/.25/.35: `50+(weighted smooth score−50)×(.75+.25×agreement)`.

Composition uses Solana default weights `.17/.28/.20/.25/.10`, derived from the supplied `.23/.25/.20/.22/.10` plus shifts `−.06/+ .03/0/+ .03/0`. Standard removes smart money. Drop unavailable pillars, normalize remaining weights, then sum `pillar_points` to `base`. Gate is `1−max(.10×smooth(liq-from-peak%,20,70), .15×smooth(exit-from-peak%,20,70))`; no OHLC means neutral1. FINAL=base×gate. All missing yields null, not zero/F.

Bands: A+≥95, A≥85, B+≥80, B≥70, C+≥65, C≥55, D≥40, E≥20, F<20. Labels follow the supplied document, including HOT/STRONG; they are risk labels and do not establish a buy/sell action.

## Cache and local replay

Full results and raw endpoint sources live in the existing `usage.sqlite` saved-run table alongside configuration/history. This replaces the proposed `~/.cache/birdeye-skills-runs/` filesystem layout with the app's existing storage. Deleting history removes those replay inputs. Retrieve the run ID from `meta.runId` or History.

```bash
token-dd-score --rescore <run-id> --mode standard --format plain
token-dd-score --rescore ./full-export.json --liq-candles 32 --explain
birdeye-cli case skill-token-dd-score --rescore <run-id> --dd-mode standard --short
```

Re-score creates a separate SQLite run with zero requests and zero CU, keeps source IDs/timestamps/raw payloads, and reports original cost separately in `meta.rescore.sourceCu`. It does not require an API key. Supported edits: mode, topN, latest candle count. Resolution, subject and API parameter changes require new evidence. Increasing count beyond fetched data yields fewer observed rows/candles; missing checks stay N/A. Full JSON exports work; short summaries are rejected for replay. The UI uses authenticated `POST /api/rescore` with `runId` and these optional edits.

## Verification

```bash
npm run typecheck
npm run build
npx tsc -p tsconfig.test.json
node --test .test-dist/tests/token-dd-score.test.js .test-dist/tests/token-dd-interface.test.js tests/token-dd-ui.test.mjs
npm test
```

Tests use synthetic API responses, not fabricated live reports: numeric examples, null/unit handling, bad holder scopes, OHLC ordering/sample size, tag separation, planned costs, SQLite replay, authenticated HTTP replay, Node entrypoint and UI rendering. Live provider entitlement/response availability still depends on the user's API plan.
