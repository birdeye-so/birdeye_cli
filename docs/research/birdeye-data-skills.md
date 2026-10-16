# Birdeye Data Skills source mapping

Reviewed 2026-10-12. Reference checkout: `/Users/toanlk/birdeye.so/bds-docs-mintlify/birdeye-data-skills`, commit `5dd7833a161e76ef2a3da74233af548a2eccb4d5`. The requested directory was first found inside the documentation checkout; the user subsequently cloned the same commit into `./birdeye-data-skills` in this CLI workspace. The GitHub README was also checked; detailed findings below come from the local source files, not README estimates. API contracts and CU prices come from the local BDS documentation and OpenAPI snapshot.

## Actual inventory and workflows

There are **11 analysis commands**, plus `history-list` and `history-render`. The README says 12 skills, but both the parser and UI registry contain 11. Preserve the existing CLI recipes and expose these as a distinct collection with source attribution. Source: [CLI parser](https://github.com/TheNang2710/birdeye-data-skills/blob/5dd7833a161e76ef2a3da74233af548a2eccb4d5/birdeye-screener/scripts/birdeye_cli.py#L2219), [UI registry](https://github.com/TheNang2710/birdeye-data-skills/blob/5dd7833a161e76ef2a3da74233af548a2eccb4d5/deploy/index.html#L184).

| Group | Skill | Source workflow / intended evidence |
|---|---|---|
| Discover | Trending List | V3 token list (default), or native trending; sort/filter by volume, trades, liquidity, capitalization, holders, creation platform. Drill into token DD. |
| Discover | Smart Wallets | Smart-money token list → top traders for selected tokens → deduplicate wallets → optional portfolio enrichment. Discovery is token-scoped; wallet-wide performance needs wallet PnL. |
| Token | Token DD | Overview with money-flow include → security → smart-money token-list join. Price/volume/buy-sell pressure, security and smart-trader participation. |
| Token | Contract DD | Overview → security → holder distribution → optional OHLCV. Three heuristic pillars: security, concentration, price behavior. |
| Token | RugCheck Audit | Token DD plus liquidity history, holder list and tagged holder cohorts. Source contains unsupported fallback paths; use only documented endpoints. |
| Token | Kline Pattern | OHLCV → validate/sort candles → six measurements → first-match pattern → explain score adjustments. |
| Wallet | Wallet Score | PnL summary → optionally 24h/90d summaries, token PnL details, first funding and portfolio. Alpha heuristic and separate copyability proxies. Latest execution does not call leaderboard despite old comments. |
| Wallet | Wallet Style | Summary + token PnL + optional transaction history and first funding. Trade frequency × realized ROI, with explicitly sampled holding observations. |
| Wallet | Wallet Analysis | PnL across 24h/7d/30d/90d/all + token details + current portfolio + optional first funding/transactions. |
| Wallet | Smart Money Profile | 7d/30d summaries, token details, portfolio, funding context, time-bounded trader swaps and net-worth chart. Source additionally estimates copy ROI; this is not execution-quality evidence. |
| Wallet | Smart Money Leaderboard | User supplies up to 10 wallets; each gets 7d summary + 30d summary + 30d details. Rank within that submitted cohort. |

Source execution functions: [trending/token DD](https://github.com/TheNang2710/birdeye-data-skills/blob/5dd7833a161e76ef2a3da74233af548a2eccb4d5/birdeye-screener/scripts/birdeye_cli.py#L380), [wallet execution and formulas](https://github.com/TheNang2710/birdeye-data-skills/blob/5dd7833a161e76ef2a3da74233af548a2eccb4d5/birdeye-screener/scripts/birdeye_cli.py#L4262), [smart-wallet discovery](https://github.com/TheNang2710/birdeye-data-skills/blob/5dd7833a161e76ef2a3da74233af548a2eccb4d5/birdeye-screener/scripts/birdeye_cli.py#L4882), [leaderboard](https://github.com/TheNang2710/birdeye-data-skills/blob/5dd7833a161e76ef2a3da74233af548a2eccb4d5/birdeye-screener/scripts/birdeye_cli.py#L7603).

## Documented API mapping

Existing wrappers already cover overview, security, holders, distribution, holder-profile, smart-money list, top traders, PnL summaries/details, trader swaps and OHLCV. Additional primitives below close the main workflow gaps. All recipes in this CLI remain Solana-scoped.

| Endpoint | CU from BDS | Wire contract / response |
|---|---:|---|
| `GET /defi/v3/token/list` | 50 | Required `sort_by`, `sort_type`; optional `platform_name`, liquidity/market-cap/holder/volume/trade filters; `limit` 1–100, `offset + limit <= 10000`. `data.items`, `has_next`. |
| `GET /defi/v3/liquidity/history/token` | dynamic | `address`, `resolution=1m\|4h\|1D`, integer `time`, `direction=back\|forward`, `count` 1–100. `data.items[].unix_time`, `liquidity_usd`; these are opening snapshots, not full OHLC. |
| `POST /wallet/v2/tx/first-funded` | `ceil(40*n^0.8)` | Body `wallets` (up to 50) and optional singular `token_address`. Response `data[wallet]` includes transaction/time/balance change. The example incorrectly spells `token_addresses`; follow schema/prose. |
| `GET /v1/wallet/tx_list` | 50 | `wallet`, `limit` 1–100, optional `before` transaction hash, `ui_amount_mode`. Solana rows in `data.solana`. Transactions/transfers are not automatically trades. |
| `GET /wallet/v2/current-net-worth` | 20 | `wallet`, `filter_value`, `sort_by=value`, required `sort_type`, `flags=[include_low_liquidity]`, `limit`, `offset`. `data.total_value`, `items`, top-level pagination. |
| `GET /wallet/v2/net-worth` | 50 | `wallet`, `count` 1–90, string `time`, `direction=back\|forward`, `type=1h\|1d`, required `sort_type`. `data.history[].timestamp/net_worth`. |
| `GET /wallet/v2/leaderboard` | 25 | Current OpenAPI supports `sort_by=total_value\|trade_count\|volume_usd\|realized_pnl\|unrealized_pnl`, `interval`, `pnl_method`, trade/volume/PnL bounds, `from_value>=100000`, `to_value>from_value`, `limit` 1–100, `offset<=10000`. Data is an array. Older prose only describes wealth ranking. |

V3 token-list volume/trade windows are `1m,5m,30m,1h,2h,4h,8h,24h,7d,30d`; **15m is not a valid sort suffix**. Do not blindly translate every source UI interval. Native trending has a different schema. Token top traders uses `/defi/v2/tokens/top_traders` with an underscore, not the source's hyphenated fallback.

Liquidity history pricing: base 20/50/200 for 1m/4h/1D, depth factor 1/2/3 for <=100/300/500 rows, lookback factor 1 below one day, 1.5 for 1–100 days, 3 beyond 100 days. Reserve a conservative bound when the billed lookback cannot be determined from the request. The current history schema caps rows at 100 despite the generic pricing table describing larger depths. OHLCV V3 costs 12/25/40/75/100 at <=100/300/1000/2000/5000 returned candles; source first tiers 25/30 are stale.

Primary contracts: [OpenAPI snapshot](../../../bds-docs-mintlify/openapi/data/openapi_docs.json), [CU table](../../../bds-docs-mintlify/resources/compute-unit-cost.mdx), [liquidity history](../../../bds-docs-mintlify/data-api/price-ohlcv/get-defi-v3-liquidity-history-token.mdx), [token list](../../../bds-docs-mintlify/data-api/tokenmarket-list/get-defi-v3-token-list.mdx), [first funded](../../../bds-docs-mintlify/data-api/wallet-networth-pnl/post-wallet-v2-tx-first-funded.mdx), [wallet PnL semantics](../../../bds-docs-mintlify/data-api/wallet-networth-pnl/get-wallet-v2-pnl-summary.mdx). Relative BDS links require the sibling documentation checkout.

## Formula findings

These are source heuristics, not Birdeye-provided scores or calibrated forecasts. Any adapted score must expose its version, inputs, missing fields and breakdown. Unknown data must remain unknown.

### Token and contract

Token DD source combines 0–10 components: `0.30*security + 0.25*smartMoney + 0.25*activity + 0.20*volume`. Components start at 5, then use developer/top-holder ownership, LP/honeypot flags, buy share, smart-trader counts/rank and price differences. It compares cumulative volumes across unequal windows without normalizing by elapsed time, so its volume score is not valid momentum evidence. Missing smart-money membership means absent from a limited list, not no smart-money participation. The source's suggested buy/sell labels should not become assertions of safety or return.

Contract DD module combines 0–100 pillars with weights safety 45%, holders 30%, price 25%. Source implementation uses tier boundaries 75/55/35, while its workflow doc says 80/60/40. It also treats missing mint authority as renounced, leaves unknown LP's displayed -5 unapplied, and initializes missing holder data near 90. These are defects to avoid. [Source module](https://github.com/TheNang2710/birdeye-data-skills/blob/5dd7833a161e76ef2a3da74233af548a2eccb4d5/birdeye-screener/scripts/modules/contract_dd.py).

### Kline

Actual module measures recent 9-vs-21-close mean (up above 1.003, down below .997), recent-vs-older five-close slope, mean `(high-low)/close` over 14 candles, drawdown from observed high, latest volume divided by the prior 20 volumes, and rise from observed low. It needs at least eight candles. Actual first-match patterns are vertical run-up, uptrend channel, breakdown, bounce off lows, distribution at highs, slow bleed, basing at lows, wide chop, bullish consolidation, bearish consolidation and sideways consolidation. Starting score is 50; pattern deltas and drawdown/volatility/volume adjustments are listed in the module. Its workflow doc lists different names and deltas. Use closed candles and identify observed-window extrema; these are not lifetime ATH/ATL. [Source module](https://github.com/TheNang2710/birdeye-data-skills/blob/5dd7833a161e76ef2a3da74233af548a2eccb4d5/birdeye-screener/scripts/modules/kline_pattern.py).

### Wallet score

Latest alpha formula is `0.35*profitability + 0.35*consistency + 0.20*quality + 0.10*activity`. Source comments retaining P40/C25/Q20/A15 describe an obsolete version.

- Profitability: effective ROI is the smaller of realized/invested and (realized+unrealized)/invested. Normalize -5%→0, +30%→100; take the larger of that and a logarithmic realized-profit scale ($100→0, $10M→100). Apply an extra unrealized-loss retention factor.
- Consistency: 20% normalized win rate (60% saturates), 40% recent30d-vs-previous60d trend, 25% profitable-position/diversification mix, 15% logarithmic trade-count confidence (300 saturates). Comparing windows requires exactly aligned 30d/90d summaries.
- Quality: 35% realized share of positive PnL, 35% one minus largest positive token PnL concentration, 30% investment-weighted booked-profit coverage of paper losses. No booked profit gives at most 50 on that last factor.
- Activity: 60% logarithmic volume scale + 40% logarithmic trade confidence; source applies up to 30% penalty above 300 trades.
- Caps: nonpositive recent realized PnL caps alpha at 39; nonpositive 90d realized at 49; recent positive but previous60d loss exceeding $100 caps at 69.

The optional copy score weights entry/profit/hold/feasibility/edge by 22/22/20/18/18. Source derives supposed early-entry market cap and holding time from high-return token counts and trade frequency. Those are **proxies**, not observed entries/holding duration or a copy-trading backtest. Source execution can stop after a summary if fewer than 20 trades or volume below $5,000. First funding and current portfolio enrich context, not the core alpha formula. [Compute implementation](https://github.com/TheNang2710/birdeye-data-skills/blob/5dd7833a161e76ef2a3da74233af548a2eccb4d5/birdeye-screener/scripts/birdeye_cli.py#L2893), [constants](https://github.com/TheNang2710/birdeye-data-skills/blob/5dd7833a161e76ef2a3da74233af548a2eccb4d5/birdeye-screener/scripts/modules/wallet_data.py).

### Wallet style and leaderboard

Style frequency: less than 1 trade/day, 1–<10, 10–50, above 50. Return uses realized PnL/invested. Source first checks ROI>50%, at least five tokens and either win rate>=50% or low loss share; then ROI>10%; then broad losses; then ±10% break-even; then negative PnL. The source loss bucket incorrectly uses -5% where commentary says -50%, and guesses fraction-vs-percent units by magnitude; preserve documented units instead. Transaction-based holding observations require matched buys/sells and explicitly sampled coverage. [Style computation](https://github.com/TheNang2710/birdeye-data-skills/blob/5dd7833a161e76ef2a3da74233af548a2eccb4d5/birdeye-screener/scripts/birdeye_cli.py#L5741).

Leaderboard intent: `0.4*winRate30d + 0.4*PnLPercentile + 0.1*tokenDiversity + 0.1*recentWinRateChange`, normalized within supplied wallets. Ties use average rank; equal-value min-max components are .5. **Source percentile code reverses PnL ordering**, rewarding lower profits. Correct the direction when implementing. Detail-list length is scanned coverage, not necessarily lifetime unique tokens. [Ranking implementation](https://github.com/TheNang2710/birdeye-data-skills/blob/5dd7833a161e76ef2a3da74233af548a2eccb4d5/birdeye-screener/scripts/birdeye_cli.py#L7565).

## UI adaptation

The reference console has Discover/Token/Wallet filters, a skill list, purpose text, relevant inputs, command-copy, format switching and cached history replay. Reuse that information architecture while retaining this CLI's authentication, budget reservations and server-side secrets. Show each skill's purpose, outputs, ordered API steps, editable validated parameters, dependencies, upper CU estimate and evidence limitations. Keep legacy workflows separately accessible. Do not reproduce unsupported support/resistance claims or store API keys in browser localStorage. A replay must clearly identify historical data and issue no new API requests. [Reference UI](https://github.com/TheNang2710/birdeye-data-skills/blob/5dd7833a161e76ef2a3da74233af548a2eccb4d5/deploy/index.html).
