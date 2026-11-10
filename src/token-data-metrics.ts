import type { Result } from "./runner.js";
import type { CaseInput } from "./workflows/schema.js";
import { decimal, object, type Data } from "./shared.js";
import { securityControls } from "./security-controls.js";

const ids = new Set([
  "skill-launchpad-trending",
  "skill-token-security",
  "skill-token-stats",
  "skill-top-holder-analysis",
  "skill-top-trader-analysis",
  "skill-lp-analysis",
  "skill-smart-money-holders",
  "skill-kol-signal",
]);
const num = (v: unknown): number | null => {
  const d = decimal(v),
    n = d?.toNumber();
  return n !== undefined && Number.isFinite(n) ? n : null;
};
const nonnegative = (v: unknown) => {
  const n = num(v);
  return n !== null && n >= 0 ? n : null;
};
const pct = (v: unknown) => {
  const n = nonnegative(v);
  return n !== null && n <= 100 ? n : null;
};
const fractionPct = (v: unknown) => {
  const n = nonnegative(v);
  return n !== null && n <= 1 ? n * 100 : null;
};
const bool = (v: unknown): boolean | null =>
  typeof v === "boolean" ? v : null;
const text = (v: unknown): string | null =>
  typeof v === "string" && v.trim() ? v : null;
const list = (v: unknown): Data[] => (Array.isArray(v) ? v.map(object) : []);
const rows = (s?: Result): Data[] =>
  list(Array.isArray(s?.data) ? s?.data : (s?.data?.items ?? s?.data?.holders));
const total = (values: (number | null)[]) =>
  values.length && values.every((v) => v !== null)
    ? values.reduce<number>((a, b) => a + b!, 0)
    : null;
const difference = (a: unknown, b: unknown) => {
  const x = decimal(a),
    y = decimal(b);
  return x && y ? x.minus(y).toNumber() : null;
};
const table = (
  title: string,
  columns: Record<string, string>,
  data: Data[],
) => ({
  title,
  columns: Object.entries(columns).map(([key, label]) => ({ key, label })),
  rows: data,
});
const provenance = (s?: Result) => ({
  sourceId: s?.meta.requestId ?? null,
  retrievedAt: s?.meta.retrievedAt ?? null,
});

/** A finite report over fetched evidence. No paging, network calls or model arithmetic. */
export function tokenDataAnalysis(input: CaseInput, sources: Result[]) {
  if (!ids.has(input.kind)) return null;
  const find = (op: string) => sources.find((s) => s.meta.operation === op);
  const missing: string[] = [],
    tables: ReturnType<typeof table>[] = [];
  const summary: Data = {};
  const need = (name: string, value: unknown) => {
    if (value === null || value === undefined)
      missing.push(`${name} unavailable`);
  };
  const pagination = sources.map((s) => ({
    operation: s.meta.operation,
    ...provenance(s),
    limit: s.meta.params?.limit ?? s.meta.params?.count ?? null,
    offset: s.meta.params?.offset ?? 0,
    hasMore: bool(s.data?.has_more),
    nextTimeFrom: s.data?.next_time_from ?? null,
    nextCursor: s.data?.next_cursor ?? null,
  }));
  for (const p of pagination)
    if (p.hasMore === true)
      missing.push(`${p.operation}: more data exists beyond the fetched page`);

  if (input.kind === "skill-launchpad-trending") {
    const s = find("market.meme-list") ?? find("market.new-listings");
    const candidates = rows(s)
      .filter((r) => {
        if (input.stage !== "newly-listed") return true;
        const t =
          typeof r.liquidityAddedAt === "number"
            ? r.liquidityAddedAt
            : Date.parse(r.liquidityAddedAt) / 1000;
        return Number.isFinite(t) && t >= input.from! && t <= input.to!;
      })
      .map((r, i) => {
        const m = object(r.meme_info);
        return {
          rank: i + 1,
          address: text(r.address),
          symbol: text(r.symbol),
          priceUsd: nonnegative(r.price),
          marketCapUsd: nonnegative(r.market_cap),
          liquidityUsd: nonnegative(r.liquidity),
          volume24hUsd: nonnegative(r.volume_24h_usd),
          source: text(m.source),
          graduated: bool(m.graduated),
          progressPct: pct(m.progress_percent),
          createdAt: m.creation_time ?? null,
          graduatedAt: m.graduated_time ?? null,
          ...provenance(s),
        };
      });
    Object.assign(summary, {
      requestedStage: input.stage,
      ranking: s?.meta.params?.sort_by ?? "provider listing order",
      observedCandidates: candidates.length,
      fetchedRows: rows(s).length,
    });
    tables.push(
      table(
        "Launch candidates",
        {
          rank: "Rank",
          address: "Token",
          symbol: "Symbol",
          source: "Launchpad",
          liquidityUsd: "Liquidity · USD",
          volume24hUsd: "Volume · 24h USD",
          progressPct: "Progress · %",
          graduated: "Graduated",
          createdAt: "Created at",
        },
        candidates,
      ),
    );
    const detail = sources
      .filter((s) => s.meta.operation === "token.meme-detail")
      .map((s) => ({
        address: s.meta.params.address,
        ...object(s.data.meme_info ?? s.data),
        ...provenance(s),
      }));
    if (detail.length)
      tables.push(
        table(
          "Selected launch metadata",
          {
            address: "Token",
            source: "Launchpad",
            creator: "Creator",
            pool: "Pool",
            graduated: "Graduated",
            progress_percent: "Progress · %",
          },
          detail,
        ),
      );
    if (!s) missing.push("Launch feed unavailable");
  }

  if (input.kind === "skill-token-security") {
    const s = find("token.security"),
      d = object(s?.data);
    const controls = securityControls(s);
    const fee = object(d.transferFeeData),
      current = object(fee.currentTransferFee);
    const bps = nonnegative(
      fee.transferFeeBasisPoints ?? current.transferFeeBasisPoints,
    );
    const feePct =
      d.transferFeeEnable === false
        ? 0
        : bps !== null && bps <= 10000
          ? bps / 100
          : null;
    const checks = [
      ["Mint authority active", controls.mint.value, controls.mint.basis],
      ["Freeze authority active", controls.freeze.value, controls.freeze.basis],
      ["Mutable metadata", bool(d.mutableMetadata), "mutableMetadata"],
      ["Non-transferable", bool(d.nonTransferable), "nonTransferable"],
      [
        "Transfer fee · %",
        feePct,
        "Explicit current basis points / 100; opaque schedules remain unknown",
      ],
      [
        "Reported honeypot",
        bool(d.isHoneypot),
        "Provider flag only; no sale simulation",
      ],
      [
        "Reported LP locked",
        bool(d.lpLocked) ?? bool(object(d.lockInfo).isLocked),
        "Explicit provider lock boolean only",
      ],
      [
        "Creator supply · %",
        fractionPct(d.creatorPercentage),
        "creatorPercentage × 100",
      ],
      [
        "Top-10 token accounts · %",
        fractionPct(d.top10HolderPercent),
        "top10HolderPercent × 100; not unique wallets",
      ],
    ].map(([check, value, basis]) => ({
      check,
      value,
      basis,
      status: value === null ? "unknown" : "observed",
      ...provenance(s),
    }));
    for (const c of checks) need(String(c.check), c.value);
    summary.checksObserved = checks.filter((c) => c.value !== null).length;
    summary.checksUnknown = checks.length - summary.checksObserved;
    tables.push(
      table(
        "Security observations",
        {
          check: "Check",
          value: "Observed value",
          status: "Evidence",
          basis: "Interpretation",
        },
        checks,
      ),
    );
  }

  if (input.kind === "skill-token-stats") {
    const s = find("token.overview"),
      d = object(s?.data),
      activity = find("token.trade-data"),
      a = object(activity?.data);
    Object.assign(summary, {
      address: input.address,
      symbol: text(d.symbol),
      priceUsd: nonnegative(d.price),
      marketCapUsd: nonnegative(d.marketCap),
      fdvUsd: nonnegative(d.fdv),
      liquidityUsd: nonnegative(d.liquidity),
      holders: nonnegative(d.holder),
      ...provenance(s),
    });
    for (const key of ["priceUsd", "marketCapUsd", "liquidityUsd", "holders"])
      need(key, summary[key]);
    tables.push(
      table(
        "Token snapshot",
        { metric: "Metric", value: "Value", unit: "Unit" },
        [
          ["Price", summary.priceUsd, "USD"],
          ["Market cap", summary.marketCapUsd, "USD"],
          ["FDV", summary.fdvUsd, "USD"],
          ["Liquidity", summary.liquidityUsd, "USD"],
          ["Holders", summary.holders, "provider holder count"],
        ].map(([metric, value, unit]) => ({
          metric,
          value,
          unit,
          ...provenance(s),
        })),
      ),
    );
    const frames: string[] = activity?.meta.params?.frames ?? input.statsFrames;
    const stats = frames.map((frame) => ({
      frame,
      priceChangePct: num(a[`price_change_${frame}_percent`]),
      volumeUsd: nonnegative(a[`volume_${frame}_usd`]),
      buyUsd: nonnegative(a[`volume_buy_${frame}_usd`]),
      sellUsd: nonnegative(a[`volume_sell_${frame}_usd`]),
      trades: nonnegative(a[`trade_${frame}`]),
      activeWallets: nonnegative(a[`unique_wallet_${frame}`]),
      ...provenance(activity),
    }));
    for (const r of stats) {
      need(`${r.frame} volume`, r.volumeUsd);
      need(`${r.frame} trade count`, r.trades);
    }
    tables.push(
      table(
        "Rolling activity windows",
        {
          frame: "Window",
          priceChangePct: "Price change · %",
          volumeUsd: "Volume · USD",
          buyUsd: "Buy · USD",
          sellUsd: "Sell · USD",
          trades: "Trades",
          activeWallets: "Active wallets",
        },
        stats,
      ),
    );
  }

  if (input.kind === "skill-top-holder-analysis") {
    const s = find("token.holder-distribution"),
      p = s?.meta.params,
      segment = object(s?.data?.summary);
    const holders = rows(s).map((r, i) => ({
      rank: (p?.offset ?? 0) + i + 1,
      wallet: text(r.wallet),
      holding: decimal(r.holding)?.toString() ?? null,
      supplyPct: pct(r.percent_of_supply),
      ...provenance(s),
    }));
    const validTop =
      p?.mode === "top" &&
      p?.address_type === "wallet" &&
      p?.offset === 0 &&
      holders.every((r) => r.wallet) &&
      new Set(holders.map((r) => r.wallet)).size === holders.length;
    const top10 =
      validTop && holders.length >= 10
        ? total(holders.slice(0, 10).map((r) => r.supplyPct))
        : null;
    Object.assign(summary, {
      basis: p?.address_type ?? null,
      segmentSupplyPct: pct(segment.percent_of_supply),
      observedWallets: holders.length,
      top1SupplyPct: validTop ? (holders[0]?.supplyPct ?? null) : null,
      top10SupplyPct: top10 !== null && top10 <= 100 ? top10 : null,
    });
    need("top-10 wallet concentration", summary.top10SupplyPct);
    tables.push(
      table(
        "Holder wallets · fetched page",
        {
          rank: "Rank",
          wallet: "Wallet",
          holding: "Holding · tokens",
          supplyPct: "Supply share · %",
        },
        holders,
      ),
    );
    const profile = find("token.holder-profile");
    if (profile)
      tables.push(
        table(
          "Holder cohorts · can overlap",
          {
            tag: "Cohort",
            holder_count: "Holders",
            percent_of_supply: "Supply · %",
          },
          list(profile.data.tags),
        ),
      );
  }

  if (input.kind === "skill-top-trader-analysis") {
    const s = find("token.top-traders");
    const traders = rows(s).map((r, i) => ({
      rank: (s?.meta.params?.offset ?? 0) + i + 1,
      wallet: text(r.owner),
      buyUsd: nonnegative(r.volumeBuyUSD),
      sellUsd: nonnegative(r.volumeSellUSD),
      volumeUsd: nonnegative(r.volumeUsd),
      buyTrades: nonnegative(r.tradeBuy),
      sellTrades: nonnegative(r.tradeSell),
      realizedPnlUsd: num(r.realizedPnl),
      unrealizedPnlUsd: num(r.unrealizedPnl),
      holdingTokens: nonnegative(r.holdVolume),
      holdingUsd: nonnegative(r.holdVolumeUsd),
      labels: Array.isArray(r.tags) ? r.tags.join(", ") : null,
      ...provenance(s),
    }));
    Object.assign(summary, {
      window: s?.meta.params?.time_frame,
      ranking: s?.meta.params?.sort_by,
      observedTraders: traders.length,
      pnlScope: "this token only",
    });
    if (!s) missing.push("Trader source unavailable");
    tables.push(
      table(
        "Top traders · token-specific results",
        {
          rank: "Rank",
          wallet: "Wallet",
          volumeUsd: "Volume · USD",
          buyUsd: "Buy · USD",
          sellUsd: "Sell · USD",
          realizedPnlUsd: "Realized PnL · USD",
          unrealizedPnlUsd: "Unrealized PnL · USD",
          holdingUsd: "Current holding · USD",
        },
        traders,
      ),
    );
  }

  if (input.kind === "skill-lp-analysis") {
    const s = find("token.markets"),
      markets = rows(s),
      liquidity = total(markets.map((r) => nonnegative(r.liquidity)));
    const pools = markets.map((r) => ({
      address: text(r.address),
      dex: text(r.source),
      liquidityUsd: nonnegative(r.liquidity),
      pageSharePct:
        liquidity !== null && liquidity > 0 && nonnegative(r.liquidity) !== null
          ? (nonnegative(r.liquidity)! / liquidity) * 100
          : null,
      volume24hProvider: nonnegative(r.volume24h),
      ...provenance(s),
    }));
    Object.assign(summary, {
      observedPools: pools.length,
      providerTotalPools: nonnegative(s?.data?.total),
      observedLiquidityUsd: liquidity,
      shareBasis: "fetched pool page only",
    });
    need("observed pool liquidity", liquidity);
    tables.push(
      table(
        "Pool liquidity · fetched page",
        {
          address: "Pool",
          dex: "DEX",
          liquidityUsd: "Liquidity · USD",
          pageSharePct: "Fetched-page share · %",
          volume24hProvider: "volume24h · provider units",
        },
        pools,
      ),
    );
    tables.push(
      table(
        "Selected pair snapshots",
        {
          address: "Pool",
          liquidityUsd: "Liquidity · USD",
          volume24hUsd: "Volume · 24h USD",
          trades24h: "Trades · 24h",
        },
        sources
          .filter((s) => s.meta.operation === "market.pair-overview")
          .map((s) => ({
            address: s.meta.params.address,
            liquidityUsd: nonnegative(s.data.liquidity),
            volume24hUsd: nonnegative(s.data.volume_24h),
            trades24h: nonnegative(s.data.trade_24h),
            ...provenance(s),
          })),
      ),
    );
    if (input.depth === "full") {
      const history = find("token.liquidity-history");
      const series = rows(history)
        .map((r) => ({
          time: nonnegative(r.unix_time),
          liquidityUsd: nonnegative(r.liquidity_usd),
          exitLiquidityUsd: nonnegative(r.exit_liquidity_usd),
        }))
        .filter(
          (r) =>
            r.time !== null && r.time >= input.from! && r.time <= input.to!,
        )
        .sort((a, b) => a.time! - b.time!);
      const first = series[0]?.liquidityUsd,
        last = series.at(-1)?.liquidityUsd;
      summary.tokenLiquidityChangePct =
        series.length >= 2 && first != null && first > 0 && last != null
          ? (last / first - 1) * 100
          : null;
      need("token liquidity history change", summary.tokenLiquidityChangePct);
      tables.push(
        table(
          "Token aggregate liquidity history",
          {
            time: "Unix time",
            liquidityUsd: "Liquidity · USD",
            exitLiquidityUsd: "Exit liquidity · USD",
          },
          series.map((r) => ({ ...r, ...provenance(history) })),
        ),
      );
    }
  }

  if (input.kind === "skill-smart-money-holders") {
    const profile = find("token.holder-profile"),
      cohort = list(profile?.data?.tags).find((r) => r.tag === "smart_trader"),
      positions = find("token.holder-positions");
    const scopeOk =
      positions?.meta.params?.labels?.length === 1 &&
      positions.meta.params.labels[0] === "smart_trader";
    const positionsRows = scopeOk ? rows(positions) : [];
    if (positionsRows.some((r) => nonnegative(r.hold_amount) === null))
      missing.push(
        "Positions with unknown balances cannot be classified as current holders",
      );
    const holders = positionsRows
      .filter(
        (r) =>
          positions?.meta.params?.include_zero_balance ||
          (nonnegative(r.hold_amount) ?? 0) > 0,
      )
      .map((r) => ({
        wallet: text(r.wallet_address),
        holdingTokens: decimal(r.hold_amount)?.toString() ?? null,
        supplyPct: pct(r.percent_of_supply),
        positionPnlUsd: num(r.pnl),
        lifetimeBuyUsd: nonnegative(r.buy_volume_usd),
        lifetimeSellUsd: nonnegative(r.sell_volume_usd),
        firstTradeAt: r.first_trade_at ?? null,
        ...provenance(positions),
      }));
    Object.assign(summary, {
      cohort: "smart_trader",
      cohortHolders: nonnegative(cohort?.holder_count),
      cohortSupplyPct: pct(cohort?.percent_of_supply),
      observedPositions: holders.length,
      includeExited:
        positions?.meta.params?.include_zero_balance ?? input.includeExited,
    });
    need("smart_trader cohort", cohort);
    if (!scopeOk)
      missing.push("Position source is not scoped exclusively to smart_trader");
    tables.push(
      table(
        "Smart-trader positions · current holdings and lifetime activity",
        {
          wallet: "Wallet",
          holdingTokens: "Holding · tokens",
          supplyPct: "Supply · %",
          positionPnlUsd: "Position PnL · USD",
          lifetimeBuyUsd: "Lifetime buy · USD",
          lifetimeSellUsd: "Lifetime sell · USD",
        },
        holders,
      ),
    );
  }

  if (
    input.kind === "skill-kol-signal" ||
    (input.kind === "skill-smart-money-holders" && input.depth === "full")
  ) {
    const tag = input.kind === "skill-kol-signal" ? "kol" : "smart_trader";
    const s = find("token.tags-tracker"),
      requested = s?.meta.params?.tags;
    const scoped =
      Array.isArray(requested) &&
      requested.length === 1 &&
      requested[0] === tag;
    const group = object(object(s?.data?.groups).tags)[tag];
    const seen = new Set<number>();
    const buckets = list(scoped ? group : undefined)
      .flatMap((r) => {
        const time = nonnegative(r.unix_time);
        if (time === null || time < input.from! || time > input.to!) return [];
        if (seen.has(time)) {
          missing.push(`Duplicate ${tag} bucket at ${time}`);
          return [];
        }
        seen.add(time);
        return [
          {
            time,
            buyUsd: nonnegative(r.volume_buy_usd),
            sellUsd: nonnegative(r.volume_sell_usd),
            ...provenance(s),
          },
        ];
      })
      .sort((a, b) => a.time - b.time);
    if (!Array.isArray(group) || !scoped)
      missing.push(`${tag} timeline unavailable or incompatible source tags`);
    const buy = total(buckets.map((r) => r.buyUsd)),
      sell = total(buckets.map((r) => r.sellUsd)),
      net = difference(buy, sell);
    const signal =
      net === null
        ? "unknown"
        : buy === 0 && sell === 0
          ? "no-observed-activity"
          : net > input.signalThresholdUsd
            ? "buy-dominant"
            : net < -input.signalThresholdUsd
              ? "sell-dominant"
              : "balanced";
    Object.assign(summary, {
      cohort: tag,
      from: input.from,
      to: input.to,
      bucketFrame: s?.meta.params?.time_frame ?? input.trackerFrame,
      observedBuckets: buckets.length,
      buyUsd: buy,
      sellUsd: sell,
      netFlowUsd: net,
      observedSignal: signal,
      signalThresholdUsd: input.signalThresholdUsd,
      signalBasis: "USD buy minus sell in returned buckets only",
      timelineHasMore: bool(s?.data?.has_more),
    });
    need(`${tag} buy/sell totals`, net);
    tables.push(
      table(
        "Observed cohort activity buckets",
        {
          time: "Bucket start · Unix",
          buyUsd: "Buy · USD",
          sellUsd: "Sell · USD",
        },
        buckets,
      ),
    );
    const detail = find("token.tags-tracker-details");
    if (detail) {
      const dedup = new Set<string>(),
        wallets = new Set<string>();
      const details = rows(detail).flatMap((bucket) =>
        list(bucket.wallets).flatMap((w) => {
          const time = nonnegative(bucket.unix_time),
            wallet = text(w.wallet);
          if (
            !wallet ||
            time === null ||
            time < input.from! ||
            time > input.to! ||
            !Array.isArray(w.tags) ||
            !w.tags.includes(tag)
          )
            return [];
          const key = `${time}:${wallet}`;
          if (dedup.has(key)) return [];
          dedup.add(key);
          wallets.add(wallet);
          return [
            {
              time,
              wallet,
              buyUsd: nonnegative(w.volume_buy_usd),
              sellUsd: nonnegative(w.volume_sell_usd),
              buyWalletTransactions: nonnegative(w.tx_buy_count),
              sellWalletTransactions: nonnegative(w.tx_sell_count),
              ...provenance(detail),
            },
          ];
        }),
      );
      summary.observedUniqueWallets = wallets.size;
      summary.walletCountBasis =
        "unique addresses in fetched detail buckets; not the whole cohort";
      tables.push(
        table(
          "Sampled wallet activity · per bucket",
          {
            time: "Bucket start · Unix",
            wallet: "Wallet",
            buyUsd: "Buy · USD",
            sellUsd: "Sell · USD",
            buyWalletTransactions: "Buy wallet-transactions",
            sellWalletTransactions: "Sell wallet-transactions",
          },
          details,
        ),
      );
    }
  }

  return {
    formulaVersion: "token-data-v1",
    findings: [
      {
        kind: "token-data",
        skill: input.kind,
        summary,
        tables,
        pagination,
        missing: [...new Set(missing)],
        sourceIds: sources.map((s) => s.meta.requestId),
      },
    ],
  };
}
