---
name: token-duediligence
description: Calculate or explain Birdeye Token Due-Diligent Score for a Solana token, including advanced liquidity and holder evidence, or re-score a saved run locally at zero CU.
---

Requires the separately installed `birdeye-cli` (Node.js >=22.16) and configured Birdeye credentials. Run the commands below from any directory; prefix `case`, `token`, `market`, `portfolio`, `cases`, `capabilities`, `workflow` and `usage` commands with `birdeye-cli`.

## Supported chains and limitations

Compatibility package for `skill-token-dd-score`. Both entrypoints support `solana` only, including saved-evidence re-scoring.

Standard and advanced scores are not comparable; missing checks reduce evidence coverage. Holder evidence and liquidity candles are bounded samples, and liquidity OHLC CU remains provisional. Only the default reconstructed scoring preset is implemented; canonical-mint/LST checks, pace and alternative presets remain unavailable. Local re-scoring cannot fetch additional evidence, and the result does not establish safety.

## Use

Use `birdeye-cli case skill-token-dd-score --address <mint>` or the Node.js entrypoint `token-dd-score <mint>`. Both use the same scorer and SQLite run store. API credentials come from CLI configuration or `BIRDEYE_API_KEY`.

Select standard for overview/security evidence or advanced for holder distribution, labeled cohorts, top holders, tagged money flow and liquidity candles. Preview with `--estimate-cu`; respect an explicit user budget with `--max-cu`. Advanced defaults to 15m × 96 liquidity candles and one 50-row distribution page. The estimate is 51 / provisional 181 CU before retries; OHLC pricing is unresolved in provider docs.

Return the score with its mode, coverage, observation times, gate and material missing checks. Values marked N/A were excluded from the weighted denominator. Standard and advanced scores are not comparable. Ratings are research risk labels; the score is reconstructed from the supplied specification, not an original upstream implementation or a trading recommendation.

For saved evidence use `token-dd-score --rescore <run-id-or-full-json-path>`; this creates a new zero-call SQLite run. `--mode`, `--top-n` and `--liq-candles` can change the local calculation. A wider window cannot fetch missing evidence. Preserve full exports for replay; use `--short` for summaries.

Read [scoring reference](references/scoring.md) when explaining formulas, verifying units, interpreting the reconstructed assumptions, choosing renderer flags or troubleshooting re-score. Only the default preset is defined; absent canonical-mint/LST checks remain N/A and pace/alternative presets are unsupported.
