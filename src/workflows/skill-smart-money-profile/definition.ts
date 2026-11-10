import { referencePolicy, referenceNote } from "../reference-policy.js";
import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  ...referencePolicy,
  planNotes: [
    referenceNote,
    "By default, trades fetch one page before to; from is not a lower bound for this endpoint. The page may include older trades and is not complete window coverage.",
  ],
  id: "skill-smart-money-profile",
  title: "Smart Money Profile",
  category: "wallet",
  family: "data-skills",
  subject: "wallet",
  purpose:
    "Combine short and monthly performance with position, trade and net-worth history for one wallet.",
  produces:
    "7d/30d PnL, position details, holdings, swaps and net-worth snapshots. Balance changes include cash flows and are not trading ROI.",
  source: "docs/workflows/birdeye-data-skills.md",
  limitations: [
    "Profiles one supplied wallet using overlapping 7d/30d summaries. Position duration and the trade time cursor are separate inputs; do not merge incompatible scopes.",
    "Default positions, holdings and trades each cover at most 100 rows, and net-worth history requests 30 daily snapshots. Trades are swaps, not complete transfer history.",
    "Net-worth changes include deposits and withdrawals; neither those changes nor the smart-money label establish trading ROI or future returns. First funding is provenance only.",
  ],
  window: "duration",
  plan(context) {
    const { input: a, add } = context;
    const { summary, details, holdings, funded } = fragments(context);
    summary("pnl7", a.address, "7d");
    summary("pnl30", a.address, "30d");
    if (!a.skipPositions) details("pnl-details", a.address);
    if (!a.skipPortfolio) holdings("holdings", a.address);
    funded();
    if (!a.skipTransactions)
      add("trades", "portfolio.trades", {
        address: a.address,
        before_time: a.to,
        limit: 100,
      });
    add("net-worth-history", "portfolio.net-worth-history", {
      wallet: a.address,
      time: new Date(a.to! * 1000).toISOString().slice(0, 19).replace("T", " "),
      count: 30,
    });
  },
});
