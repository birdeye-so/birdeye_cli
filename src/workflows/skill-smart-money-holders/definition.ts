import { defineWorkflow } from "../types.js";
import {
  tokenDataPolicy,
  cohortLimits,
  addCohortTimeline,
} from "../token-data.js";
export default defineWorkflow({
  ...tokenDataPolicy,
  id: "skill-smart-money-holders",
  title: "Smart Money Holder Analysis",
  category: "wallet",
  purpose:
    "Inspect Birdeye-labeled smart traders holding a Solana token. Use to examine their supply exposure and optionally their observed buying and selling over time.",
  produces:
    "Smart-trader cohort holdings and a bounded wallet-position page; full depth adds bucketed activity and sampled wallet evidence.",
  guide: {
    input:
      "A Solana token address, scan-limit (1–50 positions), optional include-exited and depth full.",
    exampleFlags: "--scan-limit 10",
    useCases: [
      "Find smart-trader wallets still holding a token and their supply exposure.",
      "Inspect a bounded activity window separately from current positions.",
    ],
    instructions:
      "The subject is a token, not a wallet. Core uses the smart_trader label and excludes zero-balance positions. --include-exited includes wallets that no longer hold the token. Full adds --from/--to and --tracker-frame activity; default one day in hourly buckets.",
  },
  limitations: cohortLimits,
  plan(context) {
    const { input: a, add } = context;
    add("profile", "token.holder-profile", { token_address: a.address });
    add("positions", "token.holder-positions", {
      token_address: a.address,
      labels: ["smart_trader"],
      include_zero_balance: a.includeExited,
      limit: a.scanLimit,
    });
    if (a.depth === "full") addCohortTimeline(context, "smart_trader", true);
  },
});
