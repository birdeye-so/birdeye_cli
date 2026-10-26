import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
if (basePath && !/^\/(?:[A-Za-z0-9_-]+)(?:\/[A-Za-z0-9_-]+)*$/.test(basePath)) {
  throw new Error('NEXT_PUBLIC_BASE_PATH must be empty or a path such as /landing, without a trailing slash.');
}
const config: NextConfig = {
  basePath,
  turbopack: {root: fileURLToPath(new URL('.', import.meta.url))},
  outputFileTracingIncludes: {"/api/catalog": ["./public/catalog.json"], "/": ["./public/catalog.json"], "/embed": ["./public/catalog.json"]},
};
export default config;
