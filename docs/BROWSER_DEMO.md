# Browser-only demo

Run the existing research interface with an independent workspace in each visitor's browser. Keys, reports and CU accounting are not sent to a Birdeye CLI server. The normal CLI/SQLite mode remains the default.

## Local preview

Requires Node >=22.16 for building/previewing; the deployed site needs no Node server.

```bash
npm ci
npm run build
node dist/index.js --format interface --storage browser --bind 127.0.0.1:8787
```

The preview serves static assets only and does not open configuration, history or usage SQLite databases. It accepts loopback binds. Select the skill, input and CU budget in the browser; automatic CLI input runs and shared session budgets are not supported in this mode.

For the existing SQLite workspace, omit `--storage browser` or use `--storage sqlite`.

## Deploy as a static website

```bash
npm run build:browser
# Publish the contents of dist/browser to an HTTPS static host.
```

Host this on a **dedicated origin**, separate from apps that run third-party scripts or accept user HTML. Paths on the same origin share the same browser security context. Do not embed the demo in an iframe. The output contains no keys, server routes, SQLite, analytics or remote scripts.

The generated `_headers` file sets security headers on hosts supporting that format. On other hosts, configure equivalent headers, especially `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff` and `Referrer-Policy: no-referrer`. HTML also includes a CSP meta tag. The default `connect-src` permits HTTPS providers and loopback development endpoints; narrow both policies to your chosen AI origin plus `https://public-api.birdeye.so` when hosting with a fixed provider. Inline styles are allowed for charts; inline scripts are blocked.

Static-host access logs can still contain visitor IP addresses and asset requests. No keys or research payloads are sent to the static host. Providers receive the credentials and request data needed to fulfill their API calls and may retain data under their own policies.

## User flow

1. Create an encrypted workspace with a password of at least 12 characters, or choose **Use temporary session**.
2. In **Settings**, enter a Birdeye key and an OpenAI-compatible endpoint, model and AI key. Responses and Chat Completions formats are supported.
3. Select **Save keys in encrypted browser workspace** to retain keys in the encrypted vault. Unchecked means session-only keys; previously saved keys remain. Temporary mode never persists keys or research.
4. Run skills, product demos or AI chat. All provider requests go directly from the browser. History, run inputs, evidence and CU are included in the encrypted workspace.
5. **Lock workspace** aborts active work, saves available evidence, clears the active session and requires the password again. Automatic locking occurs after 15 minutes without interaction or 1 minute in a hidden tab. Reload also requires unlock.
6. **Forget saved workspace** deletes the encrypted vault after explicit confirmation.

Only one tab can open the persistent workspace at a time (Web Locks). Temporary tabs are independent. Pending request reservations are saved before dispatch so interrupted runs retain uncertain CU accounting. Storage failure stops a request before dispatch; it never silently falls back to plaintext or server storage.

Browser mode includes local planning, all public skills, demos, usage accounting, history deletion, saved-data AI context and Token DD re-scoring. It does not load the CLI's local documentation index or enable MCP transport. Clearing history keeps CU records; forgetting the workspace removes both.

## Encryption and limits

The vault uses Web Crypto AES-256-GCM with a fresh 96-bit IV on every save. Its non-extractable key is derived from the user password using PBKDF2-HMAC-SHA-256 (600,000 iterations and a random 128-bit salt). IndexedDB stores only the version, salt, IV and authenticated ciphertext; passwords and decryption keys are never persisted. Key derivation and encryption happen on the visitor's device.

Encryption protects data at rest while locked. It does **not** protect unlocked credentials from XSS, compromised site JavaScript, malicious browser extensions, malware, or another app on the same origin. A strong password matters: a copied vault can be attacked offline. There is no password recovery. Clearing site storage or losing the browser profile loses the data. JSON exports contain research in plaintext; store those separately with care.

HTTPS (or localhost) and modern Web Crypto, IndexedDB and Web Locks support are required for persistent storage. Temporary mode needs no IndexedDB writes.

## Provider CORS

Both Birdeye and the chosen AI endpoint must allow browser requests from the demo origin, including their authentication headers. The tested Birdeye preflight permits `X-API-KEY` and `x-chain`; provider behavior may change. Select an AI endpoint that explicitly supports CORS for your website, including `Authorization` and `Content-Type`.

There is no secret-forwarding proxy, server fallback or CORS bypass. A blocked provider produces a connection/CORS error. The app never retries through another host. AI keys are not preserved when changing the configured provider origin unless the user explicitly enters a key for the new origin.

## Verification

```bash
npm run typecheck
npm test
npm run test:browser-storage
```

Browser tests use synthetic keys and intercepted provider responses. They check vault persistence, unlock failures, multi-tab exclusion, direct API requests, reload, temporary mode, deletion and desktop/mobile layout, with no paid API calls.
