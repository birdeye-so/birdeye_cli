import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  id: "market-shortlist",
  title: "Market Shortlist",
  category: "discover",
  family: "legacy",
  subject: "none",
  description: "Enrich the first few trending tokens",
  purpose: "Quickly inspect the first few tokens in the provider's trending order.",
  produces: "A small trending list enriched with security and market snapshots. This recipe keeps provider order.",
  source: "docs/workflows/README.md",
  window: "day",
  defaultLimit: 5,
  plan(context) {
    const {input: a, add} = context;
    const {scope, enrich} = fragments(context);
    add("trending", "market.trending", {interval: a.interval, limit: a.limit});
    enrich(scope(["trending"], "token", a.limit, false));
  },
});
