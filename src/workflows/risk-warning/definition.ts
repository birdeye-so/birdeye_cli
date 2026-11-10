import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  liquidityBaseline: true,
  id: "risk-warning",
  title: "Risk Warning",
  category: "token",
  family: "legacy",
  subject: "token",
  description: "Security and ownership review",
  purpose:
    "Review security and ownership observations that need attention before continuing token research.",
  produces:
    "A point-in-time risk checklist; full depth adds labeled positions and trading timelines. This is not a continuous alert service.",
  source: "docs/workflows/workflow-risk-warning.md",
  window: "day",
  plan(context) {
    const { input: a, add, notes } = context;
    const { token, liquidity } = fragments(context);
    const full = a.depth === "full";
    add("security", "token.security", token);
    add("overview", "token.overview", token);
    add("holders", "token.holders", { ...token, mode: "wallet", limit: 10 });
    notes.push(
      "Snapshot review, not continuous monitoring. A USD liquidity change is not evidence of a pool withdrawal.",
    );
    if (full) {
      add("profile", "token.holder-profile", { token_address: a.address });
      add("positions", "token.holder-positions", {
        token_address: a.address,
        labels: ["dev", "bundler", "insider", "sniper"],
        include_zero_balance: true,
      });
      add("timeline", "token.tags-tracker", {
        token_address: a.address,
        time_from: a.from,
        time_to: a.to,
      });
      add("timeline-wallets", "token.tags-tracker-details", {
        token_address: a.address,
        time_from: a.from,
        time_to: a.to,
      });
    }
  },
});
