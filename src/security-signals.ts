import { decimal, object, type Data } from "./shared.js";
import { dataRows } from "./workflows.js";
import type { Result } from "./runner.js";

// These projections reuse the Contract DD sources; they never request more data.
export function securityEvidenceSections(sources: Result[]): {
  title: string;
  columns: { key: string; label: string }[];
  rows: Data[];
}[] {
  const source = (operation: string) =>
    sources.find((s) => s.meta.operation === operation);
  const market = source("token.overview"),
    security = source("token.security"),
    holders = source("token.holder-distribution");
  const m = object(market?.data),
    s = object(security?.data);
  const nonnegative = (value: unknown) => {
    const n = decimal(value);
    return n?.gte(0) ? n : null;
  };
  const count = (value: unknown) => {
    const n = nonnegative(value);
    return n?.isInteger() ? n.toString() : null;
  };
  const numeric = (value: unknown) => nonnegative(value)?.toString() ?? null;
  const share = (value: unknown) => {
    const n = nonnegative(value);
    return n?.lte(1) ? n.times(100).toString() : null;
  };
  const percentage = (value: unknown) => {
    const n = nonnegative(value);
    return n?.lte(100) ? n.toString() : null;
  };
  const quotient = (a: unknown, b: unknown, multiplier = 1) => {
    const numerator = nonnegative(a),
      denominator = nonnegative(b);
    return numerator && denominator?.gt(0)
      ? numerator.div(denominator).times(multiplier).toString()
      : null;
  };
  const provenance = (evidence?: Result) => ({
    sourceId: evidence?.meta.requestId ?? null,
    asOf: evidence?.meta.retrievedAt ?? null,
  });
  const row = (
    key: string,
    label: string,
    value: unknown,
    unit: string,
    evidence: Result | undefined,
    basis = key,
  ): Data => ({ key, label, value, unit, basis, ...provenance(evidence) });
  const metricColumns = Object.entries({
    label: "Metric",
    value: "Observed",
    unit: "Unit",
    basis: "Basis",
    sourceId: "Source request",
    asOf: "Retrieved at",
  }).map(([key, label]) => ({ key, label }));
  const section = (title: string, rows: Data[]) => ({
    title,
    columns: metricColumns,
    rows,
  });
  const buy = nonnegative(m.vBuy24hUSD),
    sell = nonnegative(m.vSell24hUSD);
  const marketCap = m.marketCap ?? m.mc,
    capField = m.marketCap == null ? "mc" : "marketCap";
  const distribution = object(object(holders?.data).summary);
  const marketRows = [
    row("marketCap", "Market cap", numeric(marketCap), "USD", market, capField),
    row("fdv", "Fully diluted valuation", numeric(m.fdv), "USD", market),
    row("holder", "Holder count", count(m.holder), "count", market),
    row(
      "totalSupply",
      "Total supply",
      numeric(m.totalSupply),
      "tokens",
      market,
    ),
    row(
      "circulatingSupply",
      "Circulating supply",
      numeric(m.circulatingSupply),
      "tokens",
      market,
    ),
    row(
      "liquidityToMarketCap",
      "Liquidity / market cap",
      quotient(m.liquidity, marketCap, 100),
      "%",
      market,
      `liquidity ÷ ${capField} × 100`,
    ),
    row(
      "volumeToLiquidity",
      "24h volume / liquidity",
      quotient(m.v24hUSD, m.liquidity),
      "×",
      market,
      "v24hUSD ÷ liquidity; turnover, not executable depth",
    ),
    ...[
      ["trade24h", "Trades · 24h"],
      ["buy24h", "Buys · 24h"],
      ["sell24h", "Sells · 24h"],
      ["uniqueWallet24h", "Active wallets · 24h"],
    ].map(([key, label]) => row(key, label, count(m[key]), "count", market)),
    row("vBuy24hUSD", "Buy volume · 24h", numeric(m.vBuy24hUSD), "USD", market),
    row(
      "vSell24hUSD",
      "Sell volume · 24h",
      numeric(m.vSell24hUSD),
      "USD",
      market,
    ),
    row(
      "netBuy24hUSD",
      "Net buy volume · 24h",
      buy && sell ? buy.minus(sell).toString() : null,
      "USD",
      market,
      "vBuy24hUSD − vSell24hUSD; not capital inflow",
    ),
  ];
  const ownershipRows = [
    ...[
      ["top10HolderPercent", "Top-10 token accounts"],
      ["top10UserPercent", "Top-10 unique users"],
      ["creatorPercentage", "Creator share"],
      ["ownerPercentage", "Owner share"],
      ["metaplexUpdateAuthorityPercent", "Metadata authority share"],
    ].map(([key, label]) =>
      row(
        key,
        label,
        share(s[key]),
        "% of supply",
        security,
        `${key} × 100; provider-reported share`,
      ),
    ),
    ...[
      ["top10HolderBalance", "Top-10 account balance"],
      ["top10UserBalance", "Top-10 user balance"],
      ["creatorBalance", "Creator balance"],
      ["ownerBalance", "Owner balance"],
      ["metaplexUpdateAuthorityBalance", "Metadata authority balance"],
    ].map(([key, label]) =>
      row(key, label, numeric(s[key]), "tokens", security),
    ),
    row(
      "topWalletCount",
      "Top-holder segment · wallets",
      count(distribution.wallet_count),
      "count",
      holders,
      "summary.wallet_count; top_n=10, address_type=wallet",
    ),
    row(
      "topWalletHolding",
      "Top-holder segment · balance",
      numeric(distribution.total_holding),
      "tokens",
      holders,
      "summary.total_holding; top_n=10, address_type=wallet",
    ),
    row(
      "topWalletSupplyPct",
      "Top-holder segment · supply share",
      percentage(distribution.percent_of_supply),
      "% of supply",
      holders,
      "summary.percent_of_supply; already percent, top_n=10, address_type=wallet",
    ),
  ];
  const controls = [
    ["freezeable", "Freezeable"],
    ["mutableMetadata", "Mutable metadata"],
    ["transferFeeEnable", "Transfer fee enabled"],
    ["nonTransferable", "Non-transferable"],
    ["isToken2022", "Token-2022"],
    ["fakeToken", "Imitation token flag"],
    ["isTrueToken", "Canonical token flag"],
  ].map(([key, label]) =>
    row(
      key,
      label,
      typeof s[key] === "boolean" ? s[key] : null,
      "boolean",
      security,
      key === "fakeToken" || key === "isTrueToken"
        ? `${key}; provider heuristic, not a safety verdict`
        : key,
    ),
  );
  const authorities = [
    ["creatorAddress", "Creator address"],
    ["ownerAddress", "Owner address"],
    ["freezeAuthority", "Freeze authority"],
    ["metaplexUpdateAuthority", "Metadata update authority"],
  ].map(([key, label]) =>
    row(
      key,
      label,
      typeof s[key] === "string" && s[key].trim() ? s[key] : null,
      "address",
      security,
    ),
  );
  // Distribution reports percentages directly, unlike Security's 0–1 ratios.
  // Never divide wallet balances by a supply from another API.
  const holderRows = dataRows(holders?.data).map((h, i) => ({
    position: i + 1,
    address: typeof h.wallet === "string" ? h.wallet : null,
    amount: numeric(h.holding),
    supplySharePct: percentage(h.percent_of_supply),
    ...provenance(holders),
  }));
  return [
    section("Market depth & activity", marketRows),
    section("Ownership concentration", ownershipRows),
    section("Token control observations", controls),
    section("Authority addresses", authorities),
    {
      title: "Holder wallets · fetched page",
      columns: Object.entries({
        position: "Page position",
        address: "Wallet",
        amount: "Holding · tokens",
        supplySharePct: "Supply share · %",
        sourceId: "Source request",
        asOf: "Retrieved at",
      }).map(([key, label]) => ({ key, label })),
      rows: holderRows,
    },
  ];
}
