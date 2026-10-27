import { referencePolicy, referenceNote } from "../reference-policy.js";
import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  ...referencePolicy,
  planNotes: [referenceNote],
  id: "skill-smart-money-leaderboard",
  title: "Smart Money Leaderboard",
  category: "wallet",
  family: "data-skills",
  subject: "wallets",
  purpose: "Compare an explicit list of wallets using consistent PnL windows and accounting.",
  produces: "7d/30d performance and per-token evidence per wallet, ranked with higher PnL scoring higher. Missing metrics remain unranked.",
  source: "docs/workflows/birdeye-data-skills.md",
  window: "windowDays",
  plan(context) {
    const {input: a} = context;
    const {summary, details} = fragments(context);
    a.wallets!.forEach((wallet, i) => {summary(`wallet-${i+1}-7d`, wallet, "7d"); summary(`wallet-${i+1}-30d`, wallet, "30d"); details(`wallet-${i+1}-positions`, wallet);});
  },
});
