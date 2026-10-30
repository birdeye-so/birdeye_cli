import {defineWorkflow} from "../types.js";
import {tokenDataPolicy} from "../token-data.js";

export default defineWorkflow({
  ...tokenDataPolicy, id: "skill-launchpad-trending", title: "Token Launchpad Trending", category: "discover", subject: "none", tokenPolicy: "supported",
  purpose: "Discover Solana launchpad tokens by trading activity, liquidity and launch stage. Use for newly created, near-graduation or graduated token shortlists.",
  produces: "A ranked launchpad page with launch stage, progress, market data and observation sources; full depth adds metadata for a bounded shortlist.",
  guide: {input: "Choose source, stage, scan-limit and launch-sort; near-graduation requires min-progress. No token address is needed.", exampleFlags: "--source pump_dot_fun --stage near-graduation --min-progress 80 --scan-limit 10",
    useCases: ["Find Pump.fun tokens nearing graduation, ranked by 24h USD volume.", "Compare newly created and graduated launchpad tokens without conflating creation with listing."],
    instructions: "Use --depth full --limit 3 only when detailed launch metadata is needed. --min-liquidity filters the launch feed. --from/--to select creation or graduation time; newly-listed uses listing time and requires source all. Ranking covers one page, not the whole market."},
  limitations: ["One launch page, up to 50 rows; newly-listed allows up to 20. Full enriches at most 1–5 tokens. No security score is inferred from launch progress.", "Newly listed, newly created and graduated are different events. Newly-listed keeps provider order; other stages use launch-sort. Source coverage is provider-specific."],
  validate(a, issue) {
    if (a.stage === "near-graduation" && a.minProgress === undefined) issue("near-graduation requires minProgress");
    if (a.stage === "newly-listed" && (a.source !== "all" || a.minLiquidity !== undefined)) issue("newly-listed requires source all and no minLiquidity; use newly-created for these filters");
    if (a.excludeFreezeable || a.maxTop10Pct !== undefined) issue("Launchpad discovery does not run security checks; use Token Security or Token DD");
  },
  filterSubjects(rows, a) {
    return a.stage === "newly-listed" ? rows.filter(r => {const t = typeof r.liquidityAddedAt === "number" ? r.liquidityAddedAt : Date.parse(r.liquidityAddedAt)/1000; return Number.isFinite(t) && t >= a.from! && t <= a.to!;}) : rows;
  },
  plan({input: a, add, notes}) {
    if (a.stage === "newly-listed") add("candidates", "market.new-listings", {time_to: a.to, limit: Math.min(a.scanLimit, 20)});
    else add("candidates", "market.meme-list", {source: a.source, limit: a.scanLimit, min_liquidity: a.minLiquidity, sort_by: a.launchSort,
      ...(a.stage === "graduated" ? {graduated: true, min_graduated_time: a.from, max_graduated_time: a.to}
        : {graduated: false, min_creation_time: a.from, max_creation_time: a.to, ...(a.stage === "near-graduation" ? {min_progress_percent: a.minProgress} : {})})});
    if (a.depth === "full") add("launch-detail", "token.meme-detail", {}, {from: ["candidates"], kind: "token", take: a.limit!});
    notes.push("Ranks describe the fetched launch page; newly-listed rows are additionally filtered by their liquidityAddedAt timestamp.");
  },
});
