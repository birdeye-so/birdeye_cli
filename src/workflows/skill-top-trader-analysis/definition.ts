import { defineWorkflow } from "../types.js";
import { tokenDataPolicy } from "../token-data.js";
export default defineWorkflow({
  ...tokenDataPolicy,
  id: "skill-top-trader-analysis",
  title: "Top Trader Analysis",
  window: "rolling",
  purpose:
    "Rank a Solana token's traders by USD volume, trade count, PnL or remaining holdings. Use to inspect which wallets drove activity in a chosen window.",
  produces:
    "A ranked trader page with buys, sells, token-specific realized/unrealized PnL, current holding fields and source-defined window.",
  guide: {
    input:
      "A Solana token address, trader-window and trader-sort. Up to ten traders per request.",
    exampleFlags:
      "--trader-window 24h --trader-sort realized_pnl --scan-limit 10",
    useCases: [
      "Find the most profitable traders of one token over 24h.",
      "Compare active traders with wallets that still hold a position.",
    ],
    instructions:
      "Use trader-sort volume_usd for USD activity, realized_pnl for realized results, or hold_volume for current holdings. The window is the provider's relative trader window; --from/--to are not supported. PnL covers this token, not the whole wallet.",
  },
  limitations: [
    "One page of at most ten traders; scan-limit is capped at ten. Ranking and PnL apply to this token and the requested provider window.",
    "Current holdings do not prove purchases in the window. Missing PnL/holding fields remain unknown; highest volume does not imply trading skill.",
  ],
  validate(a, issue) {
    if (a.from !== undefined || a.to !== undefined)
      issue("Top Traders uses traderWindow, not historical from/to");
  },
  plan({ input: a, add }) {
    add("traders", "token.top-traders", {
      address: a.address,
      time_frame: a.traderWindow,
      sort_by: a.traderSort,
      sort_type: "desc",
      limit: Math.min(10, a.scanLimit),
    });
  },
});
