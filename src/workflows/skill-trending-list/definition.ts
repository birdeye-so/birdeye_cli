import { referencePolicy, referenceNote } from "../reference-policy.js";
import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  ...referencePolicy,
  planNotes: [referenceNote],
  id: "skill-trending-list",
  title: "Trending List",
  category: "discover",
  family: "data-skills",
  subject: "none",
  purpose: "Discover tokens by activity, liquidity or market size, optionally within a launch platform.",
  produces: "A ranked token page. Choose V3 token list or native trending; sorting options follow the selected API.",
  source: "docs/workflows/birdeye-data-skills.md",
  limitations: [
    "This skill remains Solana-only even though the underlying raw Token List V3 operation supports other chains.",
    "The default scan is one page of up to 50 tokens; per-step overrides remain bounded by the selected endpoint. Intervals are 1h, 4h or 24h. This ranking is not a market-wide scan or a risk screen.",
    "Platform filters require v3-list. Native trending permits volume, liquidity or rank; rank requires native trending. No per-token security or holder hydration is performed.",
  ],
  window: "windowDays",
  validate(a, issue) {
    if (a.listSource === "trending" && (a.platform || !["volume", "liquidity", "rank"].includes(a.sortBy))) issue("Native trending supports volume, liquidity or rank; platform requires v3-list");
    if (a.listSource === "v3-list" && a.sortBy === "rank") issue("rank requires the native trending source");
  },
  plan(context) {
    const {input: a, add} = context;
    if (a.listSource === "trending") add("trending", "market.trending", {interval: a.interval, sort_by: a.sortBy === "volume" ? "volumeUSD" : a.sortBy, sort_type: a.sortBy === "rank" ? "asc" : "desc", limit: a.scanLimit});
    else add("tokens", "market.token-list", {sort_by: a.sortBy === "volume" ? `volume_${a.interval}_usd` : a.sortBy === "trade_count" ? `trade_${a.interval}_count` : a.sortBy, limit: a.scanLimit, ...(a.platform ? {platform_name: a.platform} : {})});
  },
});
