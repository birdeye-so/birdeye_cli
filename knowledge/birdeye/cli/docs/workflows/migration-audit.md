# Data Skills migration audit — 0.3.1

Reference: local `birdeye-data-skills`, commit `5dd7833a161e76ef2a3da74233af548a2eccb4d5`; API authority: local `bds-docs-mintlify/openapi/data/openapi_docs.json`. UI authority: reference `deploy/index.html`.

## Reproduction and confirmed defects

The reference `_be()` explicitly accepts a raw list from `/smart-money/v1/token/list` and data envelopes without `success`. The CLI required `success: true`. The original test fixture wrapped every response, so it could not detect the reported failure. Replacing only the smart-money fixture with a raw array reproduced `skill-smart-wallets` returning no sources and skipping token traders.

Reproduction command: `npx tsc -p tsconfig.test.json && node --test --test-name-pattern='all 11 skill recipes' .test-dist/tests/skills.test.js`. It failed before the fix and passed afterward.

The API parser now accepts smart-money's raw array, `{data: [...]}`, and success `true`/`1` envelopes, then validates the data array. Explicit failures, error objects, invalid JSON and unexpected shapes remain errors and retain uncertain CU. Invalid JSON is not retried as a network failure. Other endpoints do not inherit permissive raw-object handling.

PnL `unique_tokens` belongs at `data.summary.unique_tokens`, not `data.summary.counts.unique_tokens`. The previous synthetic fixture repeated this implementation mistake. The corrected field enables Wallet Score and Leaderboard with the documented response shape. Numeric zero and missing data remain distinct.

Additional corrections: V3 token discovery supports documented `symbols`; smart-money and token-trader metrics now have visible table columns; fast Smart Wallets produces an actual deduplicated shortlist; holdings pagination reads the root `pagination.total`; liquidity warnings use their own CU upper bound, not an OHLCV warning. UI displays reserved CU even when estimated completed CU is zero.

## Request and workflow audit

`tests/fixtures/skill-request-contracts.json` contains the query/body names, enums and limits copied from the official OpenAPI for all 19 endpoints used by these workflows, including native trending. Tests validate actual Runner requests against these independent contracts. Response fixtures are synthetic, following the source/docs; they are not captured live responses.

| Skill | Reviewed request chain | Regression coverage |
| --- | --- | --- |
| Token Trending | V3 list or native trending | Documented V3 sort/limit fields and data.items; source-specific input validation |
| Smart Wallets | Smart-money list → token traders → optional wallet summary/holdings/positions | Raw/list/data/success variants, selected contract → owner wallet, dedup, fast shortlist, deep execution |
| Token DD | Overview + security + money flow; optional holders/profile/liquidity | GET/POST methods, raw money-flow array, optional branches |
| Contract Due-Diligent | Overview + security + distribution + optional candles | Distribution body shape, candle window, skip-kline |
| RugCheck Audit | Overview + security + holders + profile + liquidity | Snapshot fields, resolution costs, dynamic budgets |
| Token Kline Pattern | OHLCV V3 range | Closed candles, at least eight candles, price/candle fields |
| Wallet Score | 30d/90d/24h summaries + positions + optional holdings/first-funded | Canonical unique_tokens, fixed scopes, formula inputs and score caps |
| Wallet Style | Summary + positions + optional first-funded/transactions | Matching duration/method, counts and documented PnL ratios |
| Wallet Analysis | Requested summaries + positions + optional holdings/funding/transactions | Each period, optional skips, GET/POST contracts |
| Smart Money Profile | 7d/30d summaries + positions + holdings/funding/trades/net-worth history | Actual wallet fields, time query, history payload |
| Smart Money Leaderboard | 7d/30d summary + positions per supplied wallet | Canonical unique_tokens, ranking, ties, dedup, missing data |

The reference Smart Wallets code also probes hyphenated trader paths and sends `time_range`/limits beyond the official documented API. Those are not copied blindly: the CLI uses documented `/defi/v2/tokens/top_traders`, `time_frame` for traders and `interval` for smart-money, smart-money limit ≤20 and trader limit ≤10. Cost estimates use official CLI catalog values (20 + 25 per token), not source hard-coded 10 CU guesses.

Safety/copyability claims and unsupported endpoints remain deliberately excluded as detailed in [the workflow mapping](birdeye-data-skills.md). Security workflows can be partial because honeypot simulation/LP-lock checks are not available from these steps; a partial security review is different from a failed HTTP request.

## UI and local access

The UI now follows the reference console: dark navy theme with light toggle, group filters, visible skill rail, central inputs and results, right run history, and UI/Plain/JSON result views. Purpose, editable API steps and CU remain. Detailed API narratives are behind Review API steps; estimates and validation errors remain visible. Both navigation rails use compact disclosures on mobile. Credentials stay in Settings/SQLite rather than browser storage. Unsupported multichain and Telegram execution controls from the reference are not advertised.

Local same-origin browser requests can establish a session on loopback automatically; remote/public-URL access and `--require-code` still require the terminal code. Host, Origin and Fetch Metadata checks prevent cross-origin automatic connection. Keys and local session authentication are separate; restarting does not need the user to re-enter saved keys.

The observed global installation was 0.2.0 and still used config.json. This workspace and its new tarball are 0.3.1; start with `node dist/index.js` or install the new tarball to avoid the stale binary. Settings and terminal now show the SQLite path.

## Validation limits

Automated tests use fake credentials and temporary databases. Live Birdeye DNS returned ENOTFOUND; the sandbox cannot bind TCP (EPERM) or launch Chrome. Therefore live endpoint behavior and final visual rendering have not been certified. README includes the exact offline/browser/live commands and bounded live CU test. No real API CU was spent during this audit.

Validation result: typecheck and production build passed; 67 automated tests passed. A React server-render check also verified leading, consecutive and trailing hyphens in AI history titles. The fresh design review resolved the three material source findings (title crash, long expanded API plans, mobile rail disclosures); its ship verdict is limited to source inspection, not rendered fidelity.
