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

Open a skill directly with `/<skill-id>`, for example `http://127.0.0.1:8787/skill-price-surge` or `/skill-kol-signal`. After opening or unlocking the browser workspace, the demo selects that skill without running provider requests. The same paths work through the public reverse proxy. Short IDs such as `/price-surge` redirect to the full ID; `/price-surge-screen`, `/skill-price-surge-screen`, `/prige-surge`, `/skill-prige-surge`, `/prige-surge-screen` and `/skill-prige-surge-screen` also redirect to `/skill-price-surge`. The Skills API uses the same aliases; its list, view and download responses return the canonical `skill_id`, `demo_path` and accepted `aliases`. Unknown skill paths return 404. Selecting a skill in the UI (including automatic selection when switching categories) updates the URL without reloading the workspace. Browser Back/Forward restores the selected skill, and reload opens the skill shown in the URL.

For the existing SQLite workspace, omit `--storage browser` or use `--storage sqlite`.

## Serve behind a public HTTPS reverse proxy

```bash
npm run build
node dist/index.js \
  --format interface \
  --storage browser \
  --bind 127.0.0.1:8787 \
  --public-url https://demo.example.com
```

An installed CLI uses the same flags with `birdeye-cli`. The public URL must be an HTTPS origin, without a path, query or credentials. It identifies the public site; it does not configure DNS or issue TLS certificates. The process stays bound to loopback and only serves static files. Keys and workspace data stay in each visitor's browser.

In your existing HTTPS Nginx server block, proxy the UI to this process:

```nginx
location / {
    proxy_pass http://127.0.0.1:8787;
    proxy_set_header Host $host;
}
```

Keep existing specific locations such as `/agent/` pointed at the Skills API service. Start that service with `npm run skills-api:start -- --demo-host https://demo.example.com/` so list/view/download return absolute `demo_url` values pointing at this demo. The UI process itself exposes no `/api` workspace endpoints. The proxy may preserve the configured public Host or use the loopback upstream Host. Arbitrary Host/Origin values are rejected; forwarded headers do not grant access. Use a dedicated origin when possible: other applications on the same origin can access its browser storage.

## Deploy as a static website

```bash
npm run build:browser
# Publish the contents of dist/browser to an HTTPS static host.
```

For direct skill links on a static host, configure a rewrite from each supported `/<skill-id>` to `/index.html`, and redirect trailing slashes to the path without a slash so relative JS/CSS assets resolve correctly. The built-in preview server handles these routes automatically.

Host this on a **dedicated origin**, separate from apps that run third-party scripts or accept user HTML. Paths on the same origin share the same browser security context. Do not embed the demo in an iframe. The output contains no keys, server routes, SQLite, analytics or remote scripts.

The generated `_headers` file sets security headers on hosts supporting that format. On other hosts, configure equivalent headers, especially `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff` and `Referrer-Policy: no-referrer`. HTML also includes a CSP meta tag. The default `connect-src` permits HTTPS providers and loopback development endpoints; narrow both policies to your chosen AI origin plus `https://public-api.birdeye.so` when hosting with a fixed provider. Inline styles are allowed for charts; inline scripts are blocked.

Static-host access logs can still contain visitor IP addresses and asset requests. No keys or research payloads are sent to the static host. Providers receive the credentials and request data needed to fulfill their API calls and may retain data under their own policies.

## User flow

1. Create an encrypted workspace with a password of at least 12 characters, or choose **Use temporary session**.
2. In **Settings**, enter a Birdeye key and an OpenAI-compatible endpoint, model and AI key. Responses and Chat Completions formats are supported. The model must support function calling: saving sends one small test request, and Settings and Ask AI warn when the model cannot call tools.
3. Select **Save keys in encrypted browser workspace** to retain keys in the encrypted vault. Unchecked means session-only keys; previously saved keys remain. Temporary mode never persists keys or research.
4. Run skills, product demos or AI chat. All provider requests go directly from the browser. History, run inputs, evidence and CU are included in the encrypted workspace.
5. **Lock workspace** aborts active work, saves available evidence, clears the active session and requires the password again. Automatic locking occurs after 15 minutes without interaction or 1 minute in a hidden tab. Reload also requires unlock.
6. **Forget saved workspace** deletes the encrypted vault after explicit confirmation.

Only one tab can open the persistent workspace at a time (Web Locks). Temporary tabs are independent. Pending request reservations are saved before dispatch so interrupted runs retain uncertain CU accounting. Storage failure stops a request before dispatch; it never silently falls back to plaintext or server storage.

Browser mode includes local planning, all public skills, demos, usage accounting, history deletion, saved-data AI context and Token Due-Diligence Score re-scoring. It does not load the CLI's local documentation index or enable MCP transport. Clearing history keeps CU records; forgetting the workspace removes both.

## Encryption and limits

The vault uses Web Crypto AES-256-GCM with a fresh 96-bit IV on every save. Its non-extractable key is derived from the user password using PBKDF2-HMAC-SHA-256 (600,000 iterations and a random 128-bit salt). IndexedDB stores only the version, salt, IV and authenticated ciphertext; passwords and decryption keys are never persisted. Key derivation and encryption happen on the visitor's device.

Encryption protects data at rest while locked. It does **not** protect unlocked credentials from XSS, compromised site JavaScript, malicious browser extensions, malware, or another app on the same origin. A strong password matters: a copied vault can be attacked offline. There is no password recovery. Clearing site storage or losing the browser profile loses the data. JSON exports contain research in plaintext; store those separately with care.

HTTPS (or localhost) and modern Web Crypto, IndexedDB and Web Locks support are required for persistent storage. Temporary mode needs no IndexedDB writes.

## Provider CORS

Both Birdeye and the chosen AI endpoint must allow browser requests from the demo origin, including their authentication headers. The tested Birdeye preflight permits `X-API-KEY` and `x-chain`; provider behavior may change. Select an AI endpoint that explicitly supports CORS for your website, including `Authorization` and `Content-Type`.

By default there is no secret-forwarding proxy, server fallback or CORS bypass. A blocked provider produces a connection/CORS error, and the app never retries through another host.

### AI relay for providers that block browsers

Some OpenAI-compatible providers answer API calls but reject the browser preflight. As of 2026-11-09, `api.z.ai` returns its `OPTIONS` response without any `Access-Control-Allow-*` header, so browsers block every call even though the same request works from a terminal. The built-in preview server can relay such hosts when the operator opts in:

```bash
node dist/index.js --format interface --storage browser --bind 127.0.0.1:8787 \\
  --public-url https://demo.example.com --ai-relay api.z.ai
```

`--ai-relay` takes comma-separated hostnames. For those hosts only, the browser sends AI requests to `/relay/<host>/…` on the demo origin and the server forwards them to `https://<host>/…`. The relay accepts only `POST` requests to paths ending in `/chat/completions` or `/responses` that pass the normal Host/Origin checks. It forwards only `Authorization` and `Content-Type`, follows no redirects, and limits bodies and responses to 4 MB and concurrency to 16. **The AI key and the conversation pass through the demo server.** They stay in memory for the request and are never logged or stored. Settings and the workspace bar say which hosts are relayed. Birdeye calls and other providers still go directly from the browser. Static hosts have no relay; use SQLite mode there, or a provider that allows CORS. AI keys are not preserved when changing the configured provider origin unless the user explicitly enters a key for the new origin.

## Verification

```bash
npm run typecheck
npm test
npm run test:browser-storage
```

Browser tests use synthetic keys and intercepted provider responses. They check vault persistence, unlock failures, multi-tab exclusion, direct API requests, reload, temporary mode, deletion and desktop/mobile layout, with no paid API calls.
