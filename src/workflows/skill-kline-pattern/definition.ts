import { referencePolicy, referenceNote } from "../reference-policy.js";
import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  ...referencePolicy,
  planNotes: [referenceNote],
  id: "skill-kline-pattern",
  title: "Kline Pattern",
  category: "token",
  family: "data-skills",
  subject: "token",
  purpose: "Classify observed candle behavior using the reference skill's trend, slope, volatility, drawdown, volume and recovery rules.",
  produces: "Pattern, heuristic score and supporting measurements from closed candles. Thin or invalid data produces an unavailable result.",
  source: "docs/workflows/birdeye-data-skills.md",
  window: "windowDays",
  plan(context) {

    const {candles} = fragments(context);
    candles();
  },
});
