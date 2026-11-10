import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  id: "market-opportunities",
  title: "Market Opportunities",
  category: "discover",
  family: "legacy",
  subject: "none",
  description: "Scan up to 50 tokens, then enrich a shortlist",
  purpose:
    "Scan trending tokens and prioritize a small research shortlist by observed 24h USD volume.",
  produces:
    "Deduplicated candidates with liquidity and security checks; full depth adds labeled money flow and holder groups. No trades are executed.",
  source: "docs/workflows/workflow-market-opportunities.md",
  window: "day",
  plan(context) {
    const { input: a, add } = context;
    const { scope, enrich } = fragments(context);
    const full = a.depth === "full";
    add("trending", "market.trending", {
      interval: a.interval,
      limit: a.scanLimit,
    });
    enrich(scope(["trending"], "token", a.limit, true));
    if (full) {
      const selected = scope(["trending"], "token", a.limit, true);
      add(
        "flow",
        "token.money-flow",
        { frames: ["24h"] },
        selected,
        "token_address",
      );
      add("profiles", "token.holder-profile", {}, selected, "token_address");
    }
  },
});
