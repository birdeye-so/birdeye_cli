import type { Result } from "./runner.js";
import { object, type Data } from "./shared.js";

const omit = new Set([
  "logoURI",
  "logo_uri",
  "logo",
  "extensions",
  "socials",
  "website",
  "description",
  "icon",
]);
const overviewFields = new Set([
  "address",
  "name",
  "symbol",
  "decimals",
  "price",
  "liquidity",
  "mc",
  "marketCap",
  "fdv",
  "totalSupply",
  "supply",
  "circulatingSupply",
  "holder",
  "priceChange24hPercent",
  "v24hUSD",
  "trade24h",
  "buy24h",
  "sell24h",
  "lastTradeUnixTime",
  "isScaledUiToken",
  "multiplier",
]);
function strip(value: any): any {
  if (Array.isArray(value)) return value.map(strip);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !omit.has(key))
        .map(([k, v]) => [k, strip(v)]),
    );
  return value;
}
export function project(result: Result, short = false): Result {
  if (!short) return result;
  let data = strip(result.data);
  if (result.meta.operation === "analysis" && Array.isArray(data?.sources))
    data = {
      ...data,
      sources: data.sources.map((s: Result) => {
        const compact = project(s, true);
        const truncatedPaths: string[] = [];
        const preview = (value: any, path = "data"): any => {
          if (Array.isArray(value)) {
            if (value.length > 5) truncatedPaths.push(path);
            return value.slice(0, 5).map((v, i) => preview(v, `${path}[${i}]`));
          }
          if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k,v]) => [k, preview(v, `${path}.${k}`)]));
          return value;
        };
        return { meta: compact.meta, data: preview(compact.data), ...(truncatedPaths.length ? {outputTruncation: {rowLimit: 5, truncatedPaths}} : {}) };
      }),
    };
  if (result.meta.operation === "token.overview" && data)
    data = Object.fromEntries(
      Object.entries(data).filter(([key]) => overviewFields.has(key)),
    );
  if (result.meta.operation === "market.ohlcv" && Array.isArray(data?.items)) {
    const columns = [
      ...new Set<string>(data.items.flatMap((row: Data) => Object.keys(row))),
    ];
    const { items, ...rest } = data;
    data = {
      ...rest,
      columns,
      rows: items.map((row: Data) => columns.map((k) => row[k] ?? null)),
    };
  }
  return { ...result, data };
}
export function render(value: unknown, format = "json", short = false) {
  const data =
    value && typeof value === "object" && "schemaVersion" in value
      ? project(value as Result, short)
      : value;
  if (format === "json")
    return JSON.stringify(data, null, short ? undefined : 2);
  const d = object(data);
  const body = d.data ?? data;
  const list = Array.isArray(body) ? body : (body?.items ?? body?.tokens);
  if (Array.isArray(list) && list.length && typeof list[0] === "object") {
    const keys = [
      ...new Set(list.flatMap((row) => Object.keys(object(row)))),
    ].slice(0, short ? 7 : 12);
    const rows = [keys, ...list.map((row) => keys.map((k) => cell(row[k])))];
    const widths = keys.map((_, i) =>
      Math.min(48, Math.max(...rows.map((row) => String(row[i] ?? "").length))),
    );
    return (
      rows
        .map((row) =>
          row
            .map((v, i) =>
              String(v ?? "")
                .slice(0, 48)
                .padEnd(widths[i]),
            )
            .join("  "),
        )
        .join("\n") + (d.meta ? "\n\n" + JSON.stringify(d.meta) : "")
    );
  }
  return JSON.stringify(data, null, 2);
}
function cell(value: any) {
  return typeof value === "object" ? JSON.stringify(value) : (value ?? "null");
}
