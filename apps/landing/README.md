# Birdeye landing & documentation

Standalone Next.js app with a portable React documentation component. Uses a green accent on neutral charcoal surfaces, following the user’s correction to the landing design. The supplied Claude artifact could not be read, so its exact color values and visual fidelity remain unverified. See [LINKS_TO_UPDATE.md](LINKS_TO_UPDATE.md) for the handoff list.

## Design system

The landing has its own palette in `components/birdeye-docs/birdeye-docs.module.css`; do not inherit the CLI console’s blue theme. All interactive colors, focus states, selected fills, code links and status colors use semantic CSS tokens scoped to the portable component.

| Role | Token | Value |
| --- | --- | --- |
| Canvas / surface / raised | `--canvas`, `--surface`, `--raised` | `#0A0A0A`, `#141414`, `#1C1C1C` |
| Primary / secondary text | `--ink`, `--muted` | `#F5F5F5`, `#A3A3A3` |
| Dividers | `--line` | `#303030` |
| Primary action, links, active tabs, icons | `--accent` | `#22C55E` |
| Primary hover / keyboard focus | `--accent-hover`, `--focus` | `#4ADE80` |
| Text on primary buttons | `--on-accent` | `#052E16` |
| Selected category / success background | `--soft`, `--success-bg` | `#102B1A` |
| Success / warning | `--success`, `--warning` | `#4ADE80`, `#F5C365` |
| Secondary hover | `--surface-hover` | `#262626` |

The user confirmed green as the intended accent. `#22C55E` is the current implementation value, **not an extracted artifact value**. Replace the tokens if an artifact export provides a different green. The page-shell canvas in `app/page.css` matches `--canvas`; the copied component owns its own background. Typography, layout, content and behavior are unchanged by this palette correction.

## Run

From the repository root (Node.js 22.16+):

```bash
npm ci
npm run landing:install
npm run landing:dev
```

Open http://localhost:3001. This starts Next.js and a source watcher. The existing CLI UI is a separate app.

Production:

```bash
npm run landing:build
npm run landing:start
```

The app is independently runnable: copy `apps/landing`, then run `npm ci && npm run build && npm start` inside it. Its generated JSON is included; the CLI source is only needed to regenerate that JSON.

## Content and updates

- **Edit presentation:** [`catalog.config.json`](catalog.config.json) owns site copy and featured skill overrides. Shared categories/documents live in `catalog/resources.json`; installable packages are discovered from `skills/*/SKILL.md` plus `skill.json`; each skill owns metadata in `src/workflows/<id>/definition.ts`.
- **Installation documentation:** the `documents` list includes `docs/INSTALLATION.md` and `docs/USAGE.md`. Edit those source guides to update the website. “Install with npm” opens the installation guide from the landing or embedded sidebar; the quickstart section includes global npm installation, configuration and running `birdeye-cli`. npm registry distribution is not available yet, so the supported install command uses the provided `.tgz`.
- **Edit content:** `skills/**/SKILL.md`, `docs/workflows/**/*.md`, `src/workflows/*/definition.ts`, `src/workflow-guides.ts` and the CLI catalog remain the source of truth. Registering a skill generates its installable instructions and adds it to the website.
- **Generated delivery format:** [`public/catalog.json`](public/catalog.json) contains categories, skills, descriptions, usage instructions and Markdown documents. It is self-contained for copying/deploying elsewhere. Do not hand-edit this generated file when using the source watcher.
- Run `npm run catalog:sync` after skill edits to refresh both API and landing snapshots, or `npm run landing:sync` for landing-only edits and commit the resulting JSON. `npm run landing:dev` watches sources every second; a valid update usually appears in open pages within six seconds. This is polling, not WebSocket push.
- The client polls `/api/catalog` every five seconds and on focus, with ETags. Hidden tabs pause polling. Failed/invalid updates preserve the last valid client snapshot, display a reconnecting message and retry. Direct links, filters and the selected document stay intact.
- Configuration errors stop generation; the last valid JSON remains in place. Builds run sync first and fail rather than publish invalid metadata.

### Update a running deployment without rebuilding

The API reads JSON on each request and sends `Cache-Control: no-store`. It hashes content itself, so a changed JSON body is detected even when its supplied revision was not changed.

Choose one delivery method:

1. **Writable Node host:** atomically replace `public/catalog.json`, or set the server-only `CATALOG_PATH` to an absolute mounted file path. Run `npm run landing:watch` where the CLI source is edited to regenerate the file continuously. `landing:start` alone does not watch CLI source.
2. **Read-only/serverless host:** set server-only `CATALOG_URL` to a publicly accessible or infrastructure-authenticated HTTPS endpoint returning the generated catalog. Update that JSON through CI or your content service; the Next.js app proxies and validates it on every poll. No browser CORS setup is needed for this server-side fetch. The remote URL must return the catalog directly, not an HTML repository page.
3. **Bundled snapshot:** deploy the generated JSON with the app. On immutable hosting this requires a redeploy whenever the bundled JSON changes.

`CATALOG_URL` takes precedence over `CATALOG_PATH`. Neither accepts visitor input. No API key or live Birdeye data is needed to render the site. The site previews commands; it never executes them.

## Embed with an iframe

`/embed` renders the docs library without the marketing hero/navigation. Use your deployed origin:

```html
<iframe
  src="https://YOUR_DOCS_HOST/embed"
  title="Birdeye CLI documentation"
  width="100%"
  height="900"
  style="border: 0; border-radius: 12px"
  loading="lazy"
  allow="clipboard-write"
></iframe>
```

The iframe scrolls independently. Your host must allow the docs origin in `frame-src`; the docs hosting layer must permit your embedding origins in `frame-ancestors` and must not add `X-Frame-Options: DENY` or `SAMEORIGIN` for cross-origin embeds. Clipboard copying needs HTTPS/localhost and browser support; failure displays a manual-copy hint.

## Copy the React component into another app

Copy `components/birdeye-docs/` (including the CSS module), then install:

```bash
npm install react react-dom lucide-react react-markdown remark-gfm zod
```

The component imports no Next.js APIs. The target bundler must support CSS Modules. Its styles and tokens are scoped to its root. Import in a Next.js App Router page or any React app:

```tsx
import { BirdeyeDocs, catalogSchema } from './components/birdeye-docs';
import snapshot from './catalog.json';

export default function Docs() {
  return <BirdeyeDocs
    initialCatalog={catalogSchema.parse(snapshot)}
    catalogUrl="/api/catalog"
    refreshInterval={5000}
    embedded
  />;
}
```

Copy `app/api/catalog/route.ts` plus `lib/catalog.ts` and adjust relative imports, or supply your own endpoint with the same JSON format. With a cross-origin client endpoint, allow CORS including `If-None-Match`, and compute/change `revision` when content changes. With `catalogUrl={null}`, the component renders a fixed `initialCatalog` snapshot and does not fetch.

The component uses URL hashes (`#skill/<id>` (old `#workflow/<id>` links still resolve), `#document/<encoded-path>`). Use the iframe integration if the host already owns hash routing. Use a single component instance per page. The original guide Markdown is rendered safely without executing HTML/MDX; bundled relative links open within the docs. Unbundled source links display as references rather than broken website routes.

## Checks

```bash
npm run landing:typecheck
npm run test:landing
npm run landing:build
npm run test:landing:browser
```

Browser checks use installed Chrome (override `CHROME_PATH`) and an isolated production server on port 3107 (`LANDING_TEST_PORT` to change). They cover search/filtering, deep links, clipboard, Markdown links, embedding, desktop/mobile overflow, JSON changes without reload, invalid JSON recovery, ETags and browser errors. They make no paid API calls.

Next.js behavior references: [route handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route) and [deployment file tracing](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).

## Interactive HTML demo

Visitors do not need a Birdeye API key, account, or a running CLI on port 8787. Real responses are saved in `public/demo-snapshots.json` and bundled into the player at build time. The skill buttons and progress animation only replay this data locally. Deploy the generated assets without Birdeye credentials; only the separate, explicit capture script uses a key to refresh the snapshot. The standalone HTML works offline, including evidence downloads.

The landing includes a chapter-based walkthrough at `/#demo` for the real PUMP token and the supplied wallet. Each 48-second story follows six steps: choose a workflow, preview the budget, replay evidence collection, read key results, inspect selected evidence, and revisit the result. It provides Play/Pause, restart, chapter navigation, a seekable timeline, playback speed and UI preview / CLI transcript views. It pauses when hidden or offscreen; it never autoplays. Playback types the address, advances through recorded requests, and reveals selected metrics and rows. Pause, seek and chapter navigation are available. Reduced-motion preferences disable decorative animation.

Commands and budget estimates come from the plans used to capture the real responses in `public/demo-snapshots.json`. The player never executes commands or calls Birdeye. The token story uses the captured Project Deep Report; the wallet story uses Wallet Analysis. Budgets match the displayed run. The main view shows four key metrics, three pool/holding rows and relevant checks; raw data remains in the evidence download. Unknown security fields remain unknown, and PnL windows are never summed. This deliverable is interactive HTML, not an MP4.

- `components/birdeye-docs/demo-player.tsx`: portable React player.
- `components/birdeye-docs/demo-script.ts`: scenario data, captions and chapter sequence.
- `public/demo-script.json`: exported script for all scenarios; the player can also download the selected scenario.
- `public/demo.html`: self-contained HTML with inline JS/CSS and real snapshot data; opens from disk offline and can be hosted independently.
- `demo/standalone.tsx`: standalone React entrypoint.

Rebuild the offline exports after changing scripts, player styles or snapshots:

```bash
npm run landing:demo
```

`npm run landing:build` also generates the exports. Captured demos retain their original plans even if the live workflow catalog changes. Downloaded HTML/JSON files are fixed snapshots and need this regeneration. The development server reloads player source through Next.js.

To explicitly refresh the real snapshots (paid API requests using the configured Birdeye key), run `npm run build && node scripts/capture-landing-demo.mjs`, then regenerate the exports. Normal builds never fetch data. Failed refreshes do not replace the existing snapshot.

Embed only the walkthrough:

```html
<iframe
  src="https://YOUR_DOCS_HOST/demo.html"
  title="Birdeye CLI interactive demo"
  width="100%"
  height="1100"
  style="border: 0"
  loading="lazy"
></iframe>
```

Or copy the component folder and render `<DemoPlayer scripts={buildDemoScripts(catalog.workflows)} />` within the same scoped theme root used by `BirdeyeDocs`. Pass `standalone` to hide the HTML-download link when hosting the player without `/demo.html`.

## Hosting under a path, such as `/landing`

Set `NEXT_PUBLIC_BASE_PATH` before starting development or building production:

```bash
# Development (still binds only to 127.0.0.1:3001)
NEXT_PUBLIC_BASE_PATH=/landing npm run landing:dev

# Production
NEXT_PUBLIC_BASE_PATH=/landing npm run landing:build
NEXT_PUBLIC_BASE_PATH=/landing npm run landing:start
```

Open `/landing` on your public host. Next.js CSS/JS, catalog polling, `/landing/embed`, and `/landing/demo.html` use this prefix. Leave the variable unset to serve at `/`. Use a leading slash and no trailing slash; nested paths such as `/tools/landing` are supported. This is a build-time setting: changing it for production requires rebuilding, not just restarting.

For Nginx, preserve the prefix when forwarding to the localhost server:

```nginx
location /landing {
    # No trailing slash here: forward /landing/... unchanged.
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

Remove any upstream rewrite that strips `/landing`. A prefix-stripping proxy and a Next.js build configured for `/landing` do not match. No Birdeye API key is needed on the landing host.

Regression check after building with the desired prefix:

```bash
NEXT_PUBLIC_BASE_PATH=/landing node tests/landing-base-path-browser.mjs
```
