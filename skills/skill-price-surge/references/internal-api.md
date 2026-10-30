<!-- Generated from docs/workflows/internal-api.md; edit the source and run npm run skills:sync. -->

# Standalone research API

`birdeye-api` serves `POST /price-surge` and `POST /token-dd` in a separate process from the `birdeye-cli` web interface. Each request uses the caller's Birdeye API key to collect data, apply the existing research logic, and return evidence, computed results, missing checks and CU accounting. An AI provider is not required.

## Install and run

Requires Node.js >=22.16. From a source checkout:

```bash
npm ci
npm run build
npm run api:start -- --port 8788 --max-cu 320
```

For live data, the **client sends its own Birdeye key in `X-API-KEY` on every request**. The wrapper forwards that key to all upstream calls and retries within that request. Birdeye validates the key and charges the caller's account. No server Birdeye key or separate internal API token is required. The wrapper never falls back to `BIRDEYE_API_KEY` in its environment or credentials saved in CLI config. Offline estimates work without a key.

Keep the key in the client's local environment or secret configuration, outside agent conversations. Keys travel only in request headers, not JSON bodies or query parameters. Each live request creates a fresh runner for its key; the key is not printed or stored in run inputs, reports or configuration. CU accounting stores a credential fingerprint rather than the key.

The built entrypoint is `node dist/internal-api/index.js`. For source development, `npm run api:dev -- --port 8788` builds then starts it. To install the binaries globally:

```bash
npm pack
npm install --global ./birdeye-cli-0.4.0.tgz
birdeye-api --help
birdeye-api --port 8788 --max-cu 320
```

Use the tarball filename printed by `npm pack`; registry distribution is not configured. The package installs `birdeye-cli`, `birdeye-api` and `token-dd-score`.

The listener defaults to `127.0.0.1:8788`. `--host` and `--port` change the listener; `--port 0` selects a free port. `GET /health` is an unauthenticated liveness check, not a check of upstream credentials or subscription access. Use a TLS reverse proxy for remote access so the caller's key is encrypted in transit. Browser origins/CORS are disabled; this API is for server-to-server clients using `X-API-KEY`.

`--config-dir <path>` selects the SQLite CU/history directory, otherwise `BIRDEYE_CONFIG_DIR` or `~/.config/birdeye` applies. The default shares history with the CLI. Use a different directory for independent storage. The API does not read credentials from that directory. Changing a caller's key takes effect on their next request without restarting the service. Ctrl+C or SIGTERM cancels active work, saves available evidence and closes the service.

## Call the endpoints

Run these examples from the client terminal with the user's `BIRDEYE_API_KEY` configured locally. All research inputs go in a JSON body; credentials go in `X-API-KEY`. Unknown fields and unsupported chains are rejected before data requests. For a free estimate, both the key header and the client environment variable may be omitted.

```bash
# Free plan; remove estimate_cu to fetch data and consume CU.
curl http://127.0.0.1:8788/price-surge \
  -H "X-API-KEY: $BIRDEYE_API_KEY" \
  -H 'Content-Type: application/json' \
  --data '{"chain":"solana","mode":"advanced","with_security":true,"top":3,"min_market_cap":50000,"max_market_cap":5000000,"estimate_cu":true,"max_cu":320}'

curl http://127.0.0.1:8788/token-dd \
  -H "X-API-KEY: $BIRDEYE_API_KEY" \
  -H 'Content-Type: application/json' \
  --data '{"chain":"solana","address":"So11111111111111111111111111111111111111112","mode":"standard","estimate_cu":true,"max_cu":51}'
```

Shared controls: `estimate_cu` is a boolean, default false. A true value returns a plan without upstream requests or a saved run. `max_cu` is a nonnegative integer or null. Omitted/null means no caller cap. A server `--max-cu` ceiling always applies; a request can only lower it. Without either cap the run has no CU limit, but page/enrichment bounds still apply. Retries reserve additional CU. Estimates are local accounting, not confirmed provider charges.

### Price Surge

`POST /price-surge` accepts the same snake_case filters as the Price Surge workflow, including `chain`, `interval`, `mode`, market-cap/liquidity bands, `top`, `with_security` and risk caps. Standard uses one token-list page, estimated 50 CU. Advanced hydrates at most `min(top, limit)` first-pass survivors. With security and holder health, Solana costs up to `50 + 90 × top` CU before retries, further bounded by `limit`.

Supported chains: **solana, bsc, base, ethereum, robinhood**. Arbitrum is rejected because the current source Token List v3 contract does not list it. Holder-health enrichment is **Solana-only**. Trader enrichment uses one page of ten wallets; 1m/5m screens use a 30m trader window. Missing tags/security fields remain unknown. The screen does not backfill candidates after exclusions or scan the entire market.

### Token DD

`POST /token-dd` accepts:

| Field | Default | Allowed values |
| --- | --- | --- |
| `address` | required | Solana token address |
| `chain` | `solana` | **Solana only** |
| `mode` | `advanced` | `standard`, `advanced` |
| `top_n` | 50 | Integer 10–50, advanced holder-distribution page |
| `liq_resolution` | `15m` | `1m`, `5m`, `15m`, `30m`, `1h`, `4h`, `1D` |
| `liq_candles` | 96 | Integer 1–100, advanced liquidity history |

Standard fetches overview and security: two calls, 51 estimated CU. Advanced adds holder distribution, holder profile, one page of up to 100 holders, tagged money flow and liquidity OHLC: seven calls, **provisional 181 CU**. Liquidity OHLC uses a provisional 30-CU reservation, not a verified billing upper bound. Advanced parameters are validated but add no requests in standard mode.

Scores cover security, holders, activity, liquidity and smart money. Missing checks reduce coverage rather than count as passed checks. Samples are bounded, tags can overlap, and scores across modes/coverage are not comparable. Only the reconstructed default scoring preset is implemented. This endpoint does not accept arbitrary step overrides or re-score saved runs; use the existing CLI re-score command for saved evidence at zero CU.

## Responses and limits

A live request waits for its final JSON result. Both endpoints return `{schemaVersion:1,data:{...},meta:{...}}`. Price Surge uses `data.kind="price-surge-v1"`, with rows, exclusions, source payloads and the complete token-list `raw_response`. Token DD uses `data.kind="skill-token-dd-score"`; the scored report is in `data.skillAnalysis.findings`, with collected payloads in `data.sources`. Every report has `meta.runId`, `meta.cu`, coverage, timestamps and missing-evidence details.

HTTP 200 can carry `meta.coverage="partial"` after an upstream failure, exhausted budget or missing fields. Inspect it before interpreting the result. A fatal execution error returns `{error,run_id,result?}`, retaining the last checkpoint when available. Cancelling the client connection cancels further work; already sent requests can still consume CU. Runs/checkpoints are saved to `usage.sqlite` and can be inspected through `birdeye-cli history` using the same config directory.

| Status | Meaning |
| --- | --- |
| 400 | Invalid JSON, inputs, chain or query parameters |
| 401 | Live request has no `X-API-KEY`, or its header is malformed |
| 403 | Browser Origin rejected |
| 404 / 405 | Unknown route / wrong method |
| 409 | Another live run is active in this API process |
| 413 / 415 | Body exceeds 64 KiB / Content-Type is not application/json |
| 500 / 502 | Storage/internal failure / fatal research execution failure |
| 503 | Shutting down or cancelled run |

The wrapper checks that a live request supplies one nonempty key without whitespace, at most 4096 characters; it does not make an extra authentication call. An upstream rejection is recorded in the report's missing evidence (`AUTH_INVALID` or `ACCESS_DENIED`), usually as a partial HTTP 200 result. There is no fallback key. Free estimates do not validate upstream credentials.

One live run is allowed per API process; free estimates remain available while busy. There is no request queue, cross-process budget, automatic pagination, background monitoring or automatic retry of an entire workflow. Repeating a live POST creates a new paid run. Size/time limits apply while receiving request bodies; an accepted research request may take longer because of sequential upstream calls and retries.

## Code boundaries and migration

`src/internal-api/index.ts` owns startup, storage location and shutdown. `server.ts` owns HTTP, the request's key header and disconnects. `service.ts` owns request validation, execution lifecycle, budgets and persistence. Its `run(endpoint, input, {apiKey, signal})` accepts credentials separately from saved workflow inputs. The service calls the shared workflow/Price Surge/scoring code through a fresh `Runner` for each request; it does not import the CLI entrypoint or web interface.

The CLI and installed skills continue to call the same research logic in-process and need no HTTP server for terminal usage. For HTTP automation, use `birdeye-api` and the endpoints above. The web interface remains `birdeye-cli --format interface` on port 8787 with its own connection-code login; `/price-surge` has moved away from it and `/token-dd` is served only by the standalone API. Point clients to port 8788 and send the user's Birdeye key in `X-API-KEY`. Interface cookies and the former internal Bearer token do not supply an upstream key.

`apps/skills-api` remains the separate public skill catalog/statistics application. It does not execute these research endpoints.
