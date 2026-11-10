/** Display projections only: keep provider units, scope and missing observations intact. */
export type Data = Record<string, any>;
export type Point = { time: number; value: number };
export const numeric = (v: unknown): number | null => {
  if (typeof v !== "number" && !(typeof v === "string" && v.trim()))
    return null;
  const value = Number(v);
  return Number.isFinite(value) ? value : null;
};
export const sourceRows = (source?: Data): Data[] => {
  const d = source?.data;
  const rows = Array.isArray(d) ? d : (d?.items ?? d?.tokens ?? d?.history);
  return Array.isArray(rows)
    ? rows.filter((r) => r && typeof r === "object")
    : [];
};
export const usableSources = (sources: Data[]) =>
  sources.filter((s) => !s.meta?.isError);
export const sourceFor = (sources: Data[], operation: string) =>
  usableSources(sources).find((s) => s.meta?.operation === operation);
export function timeSeries(
  source: Data | undefined,
  kind: "price" | "liquidity" | "worth",
): Point[] {
  if (!source) return [];
  const p = source.meta?.params ?? {};
  const size: Record<string, number> = {
    "1m": 60,
    "5m": 300,
    "15m": 900,
    "30m": 1800,
    "1H": 3600,
    "4H": 14400,
    "1D": 86400,
  };
  const samples = new Map<number, number>();
  for (const r of sourceRows(source)) {
    const rawTime = r.unix_time ?? r.timestamp ?? r.t;
    let t = numeric(rawTime);
    if (
      t === null &&
      typeof rawTime === "string" &&
      /^\d{4}-\d{2}-\d{2}T/.test(rawTime)
    ) {
      const parsed = Date.parse(rawTime);
      t = Number.isFinite(parsed) ? parsed / 1000 : null;
    }
    const v = numeric(
      kind === "price"
        ? r.c
        : kind === "liquidity"
          ? r.liquidity_usd
          : r.net_worth,
    );
    if (t === null || v === null || v < 0) continue;
    if (t > 1e12) t /= 1000;
    if (kind === "price") {
      const h = numeric(r.h),
        l = numeric(r.l),
        volume = numeric(r.v);
      if (
        !size[p.type] ||
        h === null ||
        l === null ||
        volume === null ||
        v <= 0 ||
        l <= 0 ||
        h < Math.max(l, v) ||
        v < l ||
        volume < 0
      )
        continue;
      if (
        t < p.time_from ||
        t + size[p.type] > Math.min(p.time_to, Date.now() / 1000)
      )
        continue;
    }
    samples.set(t, v);
  }
  return [...samples]
    .sort(([a], [b]) => a - b)
    .map(([time, value]) => ({ time, value }));
}
export function trendingRows(sources: Data[]) {
  const source =
    sourceFor(sources, "market.token-list") ??
    sourceFor(sources, "market.trending");
  const native = source?.meta?.operation === "market.trending";
  return sourceRows(source).map((r, i) => ({
    address: r.address,
    symbol: r.symbol ?? "Token",
    logo: r.logoURI ?? r.logo_uri,
    rank:
      numeric(r.rank) ?? (numeric(source?.meta?.params?.offset) ?? 0) + i + 1,
    price: numeric(r.price),
    liquidity: numeric(r.liquidity),
    volume: numeric(native ? r.volume24hUSD : r.volume_24h_usd),
    change: numeric(
      native ? r.price24hChangePercent : r.price_change_24h_percent,
    ),
    marketCap: numeric(r.market_cap),
  }));
}
export function pnlWindows(sources: Data[]) {
  return usableSources(sources)
    .filter((s) => s.meta?.operation === "portfolio.pnl-summary")
    .map((s) => {
      const d = s.data?.summary ?? {},
        counts = d.counts ?? {};
      const wins = numeric(counts.total_win),
        losses = numeric(counts.total_loss);
      return {
        id: s.meta.requestId,
        wallet: s.meta.params.wallet,
        period: s.meta.params.duration,
        method: s.meta.params.pnl_method,
        scope: s.meta.params.position_scope,
        realized: numeric(d.pnl?.realized_profit_usd),
        unrealized: numeric(d.pnl?.unrealized_usd),
        trades: numeric(counts.total_trade),
        wins,
        losses,
        winRate:
          wins !== null &&
          losses !== null &&
          wins >= 0 &&
          losses >= 0 &&
          wins + losses > 0
            ? (wins / (wins + losses)) * 100
            : null,
      };
    });
}
