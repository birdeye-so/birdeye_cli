import {defineWorkflow} from "../types.js";
import {tokenDataPolicy} from "../token-data.js";
export default defineWorkflow({
  ...tokenDataPolicy, id: "skill-lp-analysis", title: "Liquidity Pool Analysis",
  purpose: "Analyze a Solana token's liquidity pools, DEX activity and liquidity history. Use to locate thin liquidity or concentration across observed pools.",
  produces: "Pool liquidity and activity, shares within the fetched pool page, bounded pair details and optional token-level liquidity history.",
  guide: {input: "A Solana token address, scan-limit (capped at 20 pools), limit (1–5 pair details), and optional depth full.", exampleFlags: "--scan-limit 10 --limit 3", useCases: ["Identify which pools hold most of a token's observed liquidity.", "Compare current pool activity with token-level liquidity changes."], instructions: "Core reads pools and at most --limit pair overviews. Full adds token-level liquidity history over --from/--to (default one day), using 4h snapshots. Each historical response is bounded to 100 rows. This analyzes token pools, not a wallet's LP fees or yield."},
  limitations: ["Pool percentages are relative to the fetched page, not all market liquidity. Pair details cover at most five pools.", "Historical liquidity belongs to the token, not each pool. USD changes do not prove LP withdrawals; no slippage quote, LP APR or impermanent-loss calculation is provided."],
  plan({input: a, add}) {add("markets", "token.markets", {address: a.address, sort_by: "liquidity", sort_type: "desc", limit: Math.min(20, a.scanLimit)}); add("pairs", "market.pair-overview", {}, {from: ["markets"], kind: "pair", take: a.limit!}); if (a.depth === "full") add("liquidity", "token.liquidity-history", {address: a.address, resolution: "4h", time: a.to, count: Math.min(100, Math.ceil((a.to!-a.from!)/14400)+1)});},
});
