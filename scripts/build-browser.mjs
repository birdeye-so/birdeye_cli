import { build } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
const destination = process.argv[2] || "dist/browser";
await mkdir(destination, { recursive: true });
const replacements = new Map([
  [resolve("web/api.ts"), resolve("web/browser/api.ts")],
  [resolve("web/storage-gate.tsx"), resolve("web/browser/gate.tsx")],
  [resolve("src/config.ts"), resolve("web/browser/config.ts")],
]);
const result = await build({
  entryPoints: ["web/main.tsx"],
  bundle: true,
  outdir: destination,
  minify: true,
  jsx: "automatic",
  platform: "browser",
  metafile: true,
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [
    {
      name: "browser-storage",
      setup(build) {
        build.onResolve({ filter: /^\.\.?\// }, (args) => {
          const path = resolve(args.resolveDir, args.path);
          for (const candidate of [
            path,
            path + ".ts",
            path + ".tsx",
            path.replace(/\.js$/, ".ts"),
          ]) {
            if (replacements.has(candidate))
              return { path: replacements.get(candidate) };
          }
        });
      },
    },
  ],
});
if (
  Object.keys(result.metafile.inputs).some((file) =>
    /src\/(ledger|run-store|config|interface\/server)\.ts$/.test(file),
  )
)
  throw new Error("Server persistence leaked into browser bundle.");
let html = await readFile("web/index.html", "utf8");
html = html
  .replace('href="/main.css"', 'href="./main.css"')
  .replace('src="/main.js"', 'src="./main.js"');
const csp =
  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src https: http://localhost:* http://127.0.0.1:*; img-src 'self' data:; object-src 'none'; base-uri 'none'; form-action 'none'";
html = html.replace(
  '<meta charset="UTF-8" />',
  `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />\n    <meta name="referrer" content="no-referrer" />`,
);
await writeFile(destination + "/index.html", html);
await writeFile(
  destination + "/_headers",
  `/*\n  Content-Security-Policy: ${csp}; frame-ancestors 'none'\n  Referrer-Policy: no-referrer\n  X-Content-Type-Options: nosniff\n  Cache-Control: no-store\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n`,
);
console.log(
  `Static browser demo: ${destination} (no server, SQLite, telemetry or credentials bundled)`,
);
