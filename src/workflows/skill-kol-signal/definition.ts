import {defineWorkflow} from "../types.js";
import {tokenDataPolicy, cohortLimits, addCohortTimeline} from "../token-data.js";
export default defineWorkflow({
  ...tokenDataPolicy, id: "skill-kol-signal", title: "KOL Buy/Sell Signal", category: "wallet",
  purpose: "Summarize observed buying and selling by Birdeye-labeled KOL wallets for a Solana token. Use to compare cohort buy/sell pressure within a bounded time window.",
  produces: "KOL buy/sell USD totals and net flow from returned buckets, an explained dominance label, and optional sampled wallet-level activity.",
  guide: {input: "A Solana token address, optional from/to timestamps, tracker-frame, signal-threshold-usd and depth full.", exampleFlags: "--depth full --tracker-frame 1h", useCases: ["See whether observed KOL buying or selling dominated over the last day.", "Investigate which sampled KOL wallets traded in a historical time window."], instructions: "Uses the KOL tracker for bounded historical buckets, rather than rolling money-flow or top-trader labels. Default is one day in hourly buckets. Full adds wallet details. Net USD above the threshold is buy-dominant, below its negative is sell-dominant; otherwise balanced. Missing buckets/cohort evidence stay unknown. This runs once and does not subscribe or send alerts."},
  limitations: [...cohortLimits, "Signal describes only returned KOL activity, not a recommendation or market-wide feed. Detail rows are time buckets, not individual transactions; no transaction hash is inferred."],
  plan(context) {addCohortTimeline(context, "kol", context.input.depth === "full");},
});
