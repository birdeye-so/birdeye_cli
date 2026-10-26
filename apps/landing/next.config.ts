import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
const config: NextConfig = {
  turbopack: {root: fileURLToPath(new URL('.', import.meta.url))},
  outputFileTracingIncludes: {"/api/catalog": ["./public/catalog.json"], "/": ["./public/catalog.json"], "/embed": ["./public/catalog.json"]},
};
export default config;
