import { defineWorkflow, type Selection } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  tokenPolicy: "unsupported",
  id: "smart-money-profile",
  title: "Smart Money Profile",
  category: "wallet",
  family: "legacy",
  subject: "optional-wallet",
  description: "7d/30d wallet performance and activity",
  purpose: "Research a supplied wallet or discover traders by realized PnL, then compare performance across time windows.",
  produces: "Holdings, two PnL snapshots and recent trades per wallet. Provider performance is not a copy-trading return estimate.",
  source: "docs/workflows/workflow-smart-money-profile.md",
  window: "duration",
  planNotes: ["By default, trades fetch one page before to; from is not a lower bound for this endpoint. The page may include older trades and is not complete window coverage."],
  plan(context) {
    const {input: a, add, notes} = context;
    const {scope} = fragments(context);
    const full = a.depth === "full";
    let subjects: Selection | undefined;
    if (!a.address) {
      add("wallets", "market.trader-ranking", {type: "30d", sort_by: "realized_pnl", limit: a.limit});
      subjects = scope(["wallets"], "wallet");
    }
    const walletParams = a.address ? {wallet: a.address} : {};
    const pnl = {...walletParams, duration: a.duration, pnl_method: a.pnlMethod, position_scope: "duration_only"};
    add("holdings", "portfolio.holdings", {...walletParams, limit: 100}, subjects, "wallet");
      add("pnl7", "portfolio.pnl-summary", {...pnl, duration: "7d"}, subjects, "wallet");
      add("pnl30", "portfolio.pnl-summary", {...pnl, duration: "30d"}, subjects, "wallet");
      notes.push("PnL comparison windows may overlap; read each source's duration and accounting method. Copy-trade ROI is unavailable without execution assumptions and complete trade history.");
    add("trades", "portfolio.trades", {...(a.address ? {address: a.address} : {}), before_time: a.to, limit: 100}, subjects);
    if (full) add("pnl-details", "portfolio.pnl-details", {...pnl, limit: 100}, subjects, "wallet");
    
  },
});
