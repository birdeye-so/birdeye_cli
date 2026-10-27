import { referencePolicy, referenceNote } from "../reference-policy.js";
import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  ...referencePolicy,
  planNotes: [referenceNote],
  id: "skill-wallet-analysis",
  title: "Wallet Analysis",
  category: "wallet",
  family: "data-skills",
  subject: "wallet",
  purpose: "Compare wallet PnL across several periods and inspect holdings, positions and recent activity.",
  produces: "Selected PnL windows, per-token PnL, optional holdings, transactions and first funding. Overlapping periods are not added together.",
  source: "docs/workflows/birdeye-data-skills.md",
  window: "duration",
  plan(context) {
    const {input: a} = context;
    const {summary, details, holdings, funded, transactions} = fragments(context);
    a.intervals.forEach(duration => summary(`pnl-${duration}`, a.address, duration));
    if (!a.skipPositions) details("pnl-details", a.address);
    if (!a.skipPortfolio) holdings("holdings", a.address);
    funded();
    transactions();
  },
});
