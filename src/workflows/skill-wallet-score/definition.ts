import { referencePolicy, referenceNote } from "../reference-policy.js";
import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  ...referencePolicy,
  planNotes: [referenceNote],
  id: "skill-wallet-score",
  title: "Wallet Score",
  category: "wallet",
  family: "data-skills",
  subject: "wallet",
  purpose: "Assess a wallet's profitability, consistency, position quality and activity from matching PnL windows.",
  produces: "A versioned alpha heuristic with component breakdown and missing-data checks. Scores use fetched positions and are not a copy-trading return forecast.",
  source: "docs/workflows/birdeye-data-skills.md",
  window: "duration",
  validate(a, issue) {
    if (a.duration !== "30d") issue("Wallet Score alpha requires a 30d position scope");
  },
  plan(context) {
    const {input: a, notes} = context;
    const {summary, details, holdings, funded} = fragments(context);
    summary("pnl30", a.address, "30d"); summary("pnl90", a.address, "90d"); summary("pnl24", a.address, "24h");
    if (!a.skipPositions) details("pnl-details", a.address);
    if (!a.skipPortfolio) holdings("holdings", a.address);
    funded();
    notes.push("Alpha uses fixed 30d/90d windows and a 30d position page. Editing these scopes makes the alpha comparison unavailable. First funding measures provenance, not proven wallet age.");
  },
});
