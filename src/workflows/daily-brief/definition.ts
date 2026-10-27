import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  id: "daily-brief",
  title: "Daily Brief",
  category: "discover",
  family: "legacy",
  subject: "optional-wallet",
  description: "Rolling market summary and watchlist",
  purpose: "Prepare a market briefing from short and daily trending windows, then inspect a few selected tokens.",
  produces: "Trending samples and token checks; full depth adds chain activity, smart-money tokens and launches. An optional wallet adds holdings.",
  source: "docs/workflows/workflow-daily-brief.md",
  window: "day",
  defaultLimit: 2,
  plan(context) {
    const {input: a, add, notes} = context;
    const {scope, enrich} = fragments(context);
    const full = a.depth === "full";
    add("trending", "market.trending", {interval: "1h", limit: a.scanLimit});
      add("daily", "market.trending", {interval: "24h", limit: a.scanLimit});
      if (full) {
        add("chain", "market.chain-metrics", {time: a.to, count: 2});
        add("smart-tokens", "market.smart-money", {interval: "1d", limit: 20});
        add("launches", "market.meme-list", {min_creation_time: a.from, max_creation_time: a.to, limit: 20});
      }
      if (a.address) add("holdings", "portfolio.holdings", {wallet: a.address, limit: 100});
      notes.push("Trending windows are rolling samples, not historical rank changes or whole-market breadth.");
    enrich(scope(["trending", "daily"], "token", a.limit, true));
  },
});
