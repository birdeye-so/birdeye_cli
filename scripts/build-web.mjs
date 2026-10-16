import { build } from "esbuild";
import { mkdir, copyFile, chmod } from "node:fs/promises";
await mkdir("dist/web", { recursive: true });
await build({
  entryPoints: ["web/main.tsx"],
  bundle: true,
  outdir: "dist/web",
  minify: true,
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
});
await copyFile("web/index.html", "dist/web/index.html");
await chmod("dist/index.js", 0o755);
