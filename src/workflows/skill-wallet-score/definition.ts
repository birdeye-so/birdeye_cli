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
  purpose:
    "Assess a wallet's profitability, consistency, position quality and activity from matching PnL windows.",
  produces:
    "A versioned alpha heuristic with component breakdown and missing-data checks. Scores use fetched positions and are not a copy-trading return forecast.",
  source: "docs/workflows/birdeye-data-skills.md",
  limitations: [
    "Alpha requires matching 30d/90d duration-only PnL and a 30d position page using the same accounting method. Other duration inputs are rejected; incompatible overrides or skipped/missing positions make the score unavailable.",
    "Positions and holdings are one page of up to 100 each by default, not the full portfolio. The 24h summary is additional context, not a replacement for the required scoring windows.",
    "First funding is provenance, not proven wallet age. The alpha score is a research heuristic, not expected copy-trading ROI; provider history can be incomplete.",
  ],
  window: "duration",
  validate(a, issue) {
    if (a.duration !== "30d")
      issue("Wallet Score alpha requires a 30d position scope");
  },
  plan(context) {
    const { input: a, notes } = context;
    const { summary, details, holdings, funded } = fragments(context);
    summary("pnl30", a.address, "30d");
    summary("pnl90", a.address, "90d");
    summary("pnl24", a.address, "24h");
    if (!a.skipPositions) details("pnl-details", a.address);
    if (!a.skipPortfolio) holdings("holdings", a.address);
    funded();
    notes.push(
      "Alpha uses fixed 30d/90d windows and a 30d position page. Editing these scopes makes the alpha comparison unavailable. First funding measures provenance, not proven wallet age.",
    );
  },
});
