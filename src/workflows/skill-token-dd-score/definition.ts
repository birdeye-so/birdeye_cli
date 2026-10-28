import { referencePolicy } from "../reference-policy.js";
import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";
import { AppError } from "../../shared.js";

export default defineWorkflow({
  ...referencePolicy,
  planNotes: ["Reconstructed from the supplied Token DD Score specification. Only documented Birdeye endpoints are used; CU follows this CLI's catalog. Pagination is bounded to one page per step. Scores are research heuristics, not trading instructions."],
  id: "skill-token-dd-score",
  title: "Token DD",
  category: "token",
  family: "data-skills",
  subject: "token",
  purpose: "Explain token due-diligence risk through security, holders, activity, liquidity and smart-money evidence.",
  produces: "Five scored pillars, coverage, drawdown gate and an auditable risk rating. Standard uses two calls; advanced uses seven. Saved evidence can be re-scored locally at zero CU.",
  source: "skills/token-duediligence/references/scoring.md",
  limitations: [
    "Standard uses overview/security only; advanced adds holder, flow and liquidity evidence. Scores from different modes or coverage are not comparable.",
    "Advanced distribution covers 10–50 top wallets, holders one page of up to 100, and liquidity 1–100 candles. Labeled cohorts can overlap; these samples are not the full holder population.",
    "Liquidity OHLC reserves a provisional 30 CU, not a verified billing upper bound. Missing checks are excluded from scored coverage and cannot establish safety.",
    "Only the default reconstructed scoring preset is implemented; canonical-mint/LST checks, pace and alternative presets are unavailable. Local re-scoring cannot fetch missing or wider-window evidence.",
  ],
  window: "windowDays",
  plan(context) {
    const {input: a, add, notes} = context;
    const {token, profile} = fragments(context);
    add("overview", "token.overview", {...token, includes: "money_flow", frames: ["1m","5m","15m","30m","1h","2h","4h","24h"]});
    add("security", "token.security", token);
    if (a.ddMode === "advanced") {
      add("distribution", "token.holder-distribution", {token_address:a.address, mode:"top", address_type:"wallet", top_n:a.topN, include_list:true, limit:a.topN, offset:0});
      profile();
      add("holders", "token.holders", {...token, mode:"wallet", get_holder_infos:true, limit:100});
      add("flow", "token.money-flow", {token_address:a.address, frames:["5m","1h","4h","24h"], wallet_tags:["smart_money","whales","kol"]});
      add("liquidity", "token.liquidity-ohlc", {...token, resolution:a.liqResolution, count:a.liqCandles, time:a.to});
    }
    notes.push("Reconstructed from the supplied Token DD Score specification, not original Python source. Default weights only; undefined pace, LST and canonical-mint checks are not invented. Scores across modes or different coverage are not comparable. OHLC pricing is provisional.");
  },
  finalize(a, steps) {
    const liquidity=steps.find(s=>s.id==="liquidity"),distribution=steps.find(s=>s.id==="distribution");
    if(liquidity){a.liqCandles=liquidity.params.count;a.liqResolution=liquidity.params.resolution;}
    if(distribution?.params.top_n!==undefined) {
      if(distribution.params.top_n<10||distribution.params.top_n>50)throw new AppError("INVALID_INPUT","Token DD Score supports top_n 10–50 within one holder page.");
      a.topN=distribution.params.top_n;
    }
  },
});
