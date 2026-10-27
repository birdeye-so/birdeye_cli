import { referencePolicy, referenceNote } from "../reference-policy.js";
import { defineWorkflow, type Selection } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  ...referencePolicy,
  planNotes: [referenceNote],
  id: "skill-smart-wallets",
  title: "Smart Wallets",
  category: "discover",
  family: "data-skills",
  subject: "none",
  purpose: "Discover wallets trading tokens in Birdeye's smart-money list, then inspect a bounded wallet shortlist.",
  produces: "Token → top traders → deduplicated wallets. Standard adds PnL; deep adds holdings and per-token PnL. No overlapping token-level PnL is summed.",
  source: "docs/workflows/birdeye-data-skills.md",
  window: "windowDays",
  plan(context) {
    const {input: a, add, notes} = context;
    const {token, summary, details, holdings} = fragments(context);
    add("smart-tokens", "market.smart-money", {interval: "1d", limit: Math.min(20, a.scanLimit)});
    add("traders", "token.top-traders", {time_frame: "30d", limit: 10}, {from: ["smart-tokens"], kind: "token", take: a.limit!});
    const selected: Selection = {from: ["traders"], kind: "wallet", take: a.limit!};
    if (a.skillDepth !== "fast") summary("pnl", undefined, "30d", selected);
    if (a.skillDepth === "deep") {holdings("holdings", undefined, selected); details("pnl-details", undefined, selected);}
    notes.push("Wallets are deduplicated in provider order across selected token pages. Per-token top-trader totals are not a wallet-wide win rate or PnL.");
  },
});
