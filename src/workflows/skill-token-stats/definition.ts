import {defineWorkflow} from "../types.js";
import {tokenDataPolicy} from "../token-data.js";
export default defineWorkflow({
  ...tokenDataPolicy, id: "skill-token-stats", title: "Token Stats", window: "rolling",
  purpose: "Summarize a Solana token's valuation, liquidity, holders and buying/selling activity. Use for a market snapshot across supported rolling windows.",
  produces: "A token snapshot plus per-window USD volume, price change, trades and active wallets, preserving units and missing fields.",
  guide: {input: "A Solana token address and stats-frames, default 1h,24h.", exampleFlags: "--stats-frames 1h,24h", useCases: ["Compare a token's last hour of activity with its last 24 hours.", "Check market cap, FDV and liquidity before choosing a deeper analysis."], instructions: "Overview supplies valuation and holders; trade-data supplies the requested rolling windows. These endpoints do not retrieve historical snapshots at --from/--to. Overlapping windows are shown separately."},
  limitations: ["Two current-data requests, not historical snapshot reconstruction. Windows overlap and must not be added together.", "Volume is reported in USD, token counts are separate, and market cap is not substituted with FDV when unavailable."],
  validate(a, issue) {if (a.from !== undefined || a.to !== undefined) issue("Token Stats uses rolling statsFrames, not historical from/to");},
  plan({input: a, add}) {add("overview", "token.overview", {address: a.address}); add("activity", "token.trade-data", {address: a.address, frames: a.statsFrames});},
});
