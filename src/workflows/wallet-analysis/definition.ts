import { defineWorkflow, type Selection } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  tokenPolicy: "full-depth",
  id: "wallet-analysis",
  title: "Wallet Analysis",
  category: "wallet",
  family: "legacy",
  subject: "wallet",
  description: "Holdings, PnL and recent trades",
  purpose:
    "Understand what a wallet holds, how its positions performed and what it traded in the chosen period.",
  produces:
    "Observed holdings, PnL and a page of trades. Full depth adds per-token PnL and token screening.",
  source: "docs/workflows/workflow-wallet-analysis.md",
  window: "duration",
  planNotes: [
    "By default, trades fetch one page before to; from is not a lower bound for this endpoint. The page may include older trades and is not complete window coverage.",
  ],
  plan(context) {
    const { input: a, add } = context;
    const { scope, enrich } = fragments(context);
    const full = a.depth === "full";
    let subjects: Selection | undefined;
    if (!a.address) {
      add("wallets", "market.trader-ranking", {
        type: "30d",
        sort_by: "realized_pnl",
        limit: a.limit,
      });
      subjects = scope(["wallets"], "wallet");
    }
    const walletParams = a.address ? { wallet: a.address } : {};
    const pnl = {
      ...walletParams,
      duration: a.duration,
      pnl_method: a.pnlMethod,
      position_scope: "duration_only",
    };
    add(
      "holdings",
      "portfolio.holdings",
      { ...walletParams, limit: 100 },
      subjects,
      "wallet",
    );
    add("pnl", "portfolio.pnl-summary", pnl, subjects, "wallet");
    add(
      "trades",
      "portfolio.trades",
      {
        ...(a.address ? { address: a.address } : {}),
        before_time: a.to,
        limit: 100,
      },
      subjects,
    );
    if (full)
      add(
        "pnl-details",
        "portfolio.pnl-details",
        { ...pnl, limit: 100 },
        subjects,
        "wallet",
      );
    if (full) enrich(scope(["holdings"]));
  },
});
