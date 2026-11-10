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
  purpose:
    "Compare an explicit list of wallets using consistent PnL windows and accounting.",
  produces:
    "7d/30d performance and per-token evidence per wallet, ranked with higher PnL scoring higher. Missing metrics remain unranked.",
  source: "docs/workflows/birdeye-data-skills.md",
  limitations: [
    "Accepts 1–10 explicitly supplied Solana wallets, deduplicated before calls. This is a relative comparison of that list, not discovery of all top wallets.",
    "Ranking requires matching 7d/30d duration-only summaries and complete comparison metrics; missing inputs remain unranked. Per-token evidence is one page of up to 100 rows per wallet by default.",
    "Higher PnL improves relative rank, but the score is not absolute alpha or copy-trading ROI. Scores can change when the comparison set changes.",
  ],
  window: "windowDays",
  plan(context) {
    const { input: a } = context;
    const { summary, details } = fragments(context);
    a.wallets!.forEach((wallet, i) => {
      summary(`wallet-${i + 1}-7d`, wallet, "7d");
      summary(`wallet-${i + 1}-30d`, wallet, "30d");
      details(`wallet-${i + 1}-positions`, wallet);
    });
  },
});
