import { referencePolicy, referenceNote } from "../reference-policy.js";
import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  ...referencePolicy,
  planNotes: [referenceNote],
  id: "skill-wallet-style",
  title: "Wallet Style",
  category: "wallet",
  family: "data-skills",
  subject: "wallet",
  purpose: "Describe how often a wallet trades and how profitable those trades were over a fixed period.",
  produces: "Frequency × PnL classification with sample size and per-token loss share. Transaction and first-funding evidence are optional.",
  source: "docs/workflows/birdeye-data-skills.md",
  window: "duration",
  validate(a, issue) {
    if (!["7d", "30d"].includes(a.duration)) issue("Wallet Style uses 7d or 30d");
  },
  plan(context) {
    const {input: a} = context;
    const {summary, details, funded, transactions} = fragments(context);
    summary("pnl", a.address, a.duration);
    if (!a.skipPositions) details("pnl-details", a.address);
    funded();
    transactions();
  },
});
