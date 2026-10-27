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
