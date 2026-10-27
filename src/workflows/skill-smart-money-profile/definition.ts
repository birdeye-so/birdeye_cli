import { referencePolicy, referenceNote } from "../reference-policy.js";
import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  ...referencePolicy,
  planNotes: [referenceNote],
  id: "skill-smart-money-profile",
  title: "Smart Money Profile",
  category: "wallet",
  family: "data-skills",
  subject: "wallet",
  purpose: "Combine short and monthly performance with position, trade and net-worth history for one wallet.",
  produces: "7d/30d PnL, position details, holdings, swaps and net-worth snapshots. Balance changes include cash flows and are not trading ROI.",
  source: "docs/workflows/birdeye-data-skills.md",
  window: "duration",
  plan(context) {
    const {input: a, add} = context;
    const {summary, details, holdings, funded} = fragments(context);
    summary("pnl7", a.address, "7d"); summary("pnl30", a.address, "30d");
    if (!a.skipPositions) details("pnl-details", a.address);
    if (!a.skipPortfolio) holdings("holdings", a.address);
    funded();
    if (!a.skipTransactions) add("trades", "portfolio.trades", {address: a.address, after_time: a.from, before_time: a.to, limit: 100});
    add("net-worth-history", "portfolio.net-worth-history", {wallet: a.address, time: String(a.to), count: 30});
  },
});
