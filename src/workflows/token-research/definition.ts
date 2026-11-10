import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  id: "token-research",
  title: "Token Research",
  category: "token",
  family: "legacy",
  subject: "token",
  description: "Overview, security and top holders",
  purpose:
    "Understand a token before deciding whether to investigate further. Check its market activity, security observations and holder concentration together.",
  produces:
    "Price, liquidity, activity and holder evidence; full depth adds pools and labeled holder groups.",
  source: "docs/workflows/workflow-token-research.md",
  window: "day",
  plan(context) {
    const { input: a, add } = context;
    const { token, security, pools } = fragments(context);
    const full = a.depth === "full";
    security();
    add("holders", "token.holders", { ...token, mode: "wallet", limit: 10 });
    if (full) pools();
  },
});
