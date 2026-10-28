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
  limitations: [
    "Supports 1m, 5m, 15m, 30m, 1H, 4H and 1D candles over a maximum 5000-interval request window. Intervals are case-sensitive; closed valid candles only, with at least eight required.",
    "Reports invalid candles and gaps; a missing volume baseline receives no volume adjustment. Observed support/resistance are sample extrema, not forecasts.",
    "The pattern score is a heuristic, not a backtest or prediction. OHLCV CU reserves the largest documented tier; actual billing may differ.",
  ],
  window: "windowDays",
  plan(context) {

    const {candles} = fragments(context);
    candles();
  },
});
