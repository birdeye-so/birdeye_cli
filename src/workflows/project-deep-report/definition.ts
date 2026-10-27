import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  id: "project-deep-report",
  title: "Project Deep Report",
  category: "token",
  family: "legacy",
  subject: "token",
  description: "On-chain report with pools, cohorts and candles",
  purpose: "Build an on-chain evidence report about a token's market, ownership and price behavior.",
  produces: "Token and pool snapshots, holder groups, price candles and trading activity. Team, funding and social claims are outside this report.",
  source: "docs/workflows/workflow-project-deep-report.md",
  window: "day",
  plan(context) {
    const {input: a, add, notes} = context;
    const {token, security, pools} = fragments(context);
    security();
    add("holders", "token.holders", {...token, mode: "wallet", limit: 10});
    pools();
      add("candles", "market.ohlcv", {...token, time_from: a.from, time_to: a.to, type: "1H"});
      add("activity", "token.trade-data", token);
      notes.push("On-chain report only: team, funding, roadmap and social sentiment are not verified.");
  },
});
