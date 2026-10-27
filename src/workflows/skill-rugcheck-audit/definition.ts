import { referencePolicy, referenceNote } from "../reference-policy.js";
import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  ...referencePolicy,
  planNotes: [referenceNote],
  id: "skill-rugcheck-audit",
  title: "RugCheck Audit",
  category: "token",
  family: "data-skills",
  subject: "token",
  purpose: "Review contract, holder and actual liquidity-history evidence for potential risk.",
  produces: "Birdeye observations, holder groups and historical liquidity snapshots. This is not a RugCheck.org integration; unavailable honeypot/LP-lock checks are explicit.",
  source: "docs/workflows/birdeye-data-skills.md",
  window: "windowDays",
  plan(context) {
    const {notes} = context;
    const {security, holders, profile, liquidity} = fragments(context);
    security(); holders(); profile(); liquidity();
    notes.push("Liquidity history uses measured liquidity_usd snapshots. Price falls are never substituted for liquidity withdrawal; no undocumented risk-history endpoints are probed.");
  },
});
