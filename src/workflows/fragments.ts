import type { PlanContext, Selection } from "./types.js";

export function fragments({ input: a, add }: PlanContext) {
  const token = { address: a.address };
  const candles = () =>
    add("candles", "market.ohlcv", {
      ...token,
      type: a.resolution,
      time_from: a.from,
      time_to: a.to,
    });
  const security = () => {
    add("overview", "token.overview", token);
    add("security", "token.security", token);
  };
  const holders = () =>
    add("holders", "token.holders", { ...token, mode: "wallet", limit: 20 });
  const profile = () =>
    add("profile", "token.holder-profile", { token_address: a.address });
  const liquidity = () =>
    add("liquidity", "token.liquidity-history", {
      ...token,
      resolution: "4h",
      time: a.to,
      count: Math.min(100, Math.ceil((a.to! - a.from!) / 14400)),
    });
  const summary = (
    id: string,
    wallet: string | undefined,
    duration: string,
    subjects?: Selection | undefined,
  ) =>
    add(
      id,
      "portfolio.pnl-summary",
      {
        ...(wallet ? { wallet } : {}),
        duration,
        pnl_method: a.pnlMethod,
        position_scope: "duration_only",
      },
      subjects,
      "wallet",
    );
  const details = (
    id: string,
    wallet: string | undefined,
    subjects?: Selection | undefined,
  ) =>
    add(
      id,
      "portfolio.pnl-details",
      {
        ...(wallet ? { wallet } : {}),
        duration: a.duration,
        pnl_method: a.pnlMethod,
        position_scope: "duration_only",
        limit: 100,
      },
      subjects,
      "wallet",
    );
  const holdings = (
    id: string,
    wallet: string | undefined,
    subjects?: Selection | undefined,
  ) =>
    add(
      id,
      "portfolio.holdings",
      { ...(wallet ? { wallet } : {}), limit: 100 },
      subjects,
      "wallet",
    );
  const funded = () => {
    if (!a.skipFirstFunded)
      add("first-funded", "portfolio.first-funded", { wallet: a.address });
  };
  const transactions = () => {
    if (!a.skipTransactions)
      add("transactions", "portfolio.transactions", {
        wallet: a.address,
        limit: 100,
      });
  };
  const scope = (
    from: string[],
    kind: Selection["kind"] = "token",
    take = a.limit!,
    sort = false,
  ): Selection => ({ from, kind, take, sort });
  const enrich = (subjects: Selection, withProfile = false) => {
    add("security", "token.security", {}, subjects);
    add("overview", "token.overview", {}, subjects);
    if (withProfile)
      add("profiles", "token.holder-profile", {}, subjects, "token_address");
  };
  const pools = () => {
    add("markets", "token.markets", { ...token, limit: 10 });
    add("pair", "market.pair-overview", {}, scope(["markets"], "pair", 1));
    add("profile", "token.holder-profile", { token_address: a.address });
  };
  return {
    token,
    candles,
    security,
    holders,
    profile,
    liquidity,
    summary,
    details,
    holdings,
    funded,
    transactions,
    scope,
    enrich,
    pools,
  };
}
