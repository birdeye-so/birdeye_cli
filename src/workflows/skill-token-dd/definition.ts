import { referencePolicy, referenceNote } from "../reference-policy.js";
import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  ...referencePolicy,
  planNotes: [referenceNote],
  id: "skill-token-dd",
  title: "Token DD",
  category: "token",
  family: "data-skills",
  subject: "token",
  purpose: "Check market activity, security and smart-money context before taking a token further in research.",
  produces: "Security observations, activity and labeled money flow. Optional holder list, holder groups and historical liquidity add evidence. No automatic buy recommendation.",
  source: "docs/workflows/birdeye-data-skills.md",
  window: "windowDays",
  plan(context) {
    const {input: a, add, notes} = context;
    const {security, holders, profile, liquidity} = fragments(context);
    security();
    add("flow", "token.money-flow", {token_address: a.address, frames: ["24h"], wallet_tags: ["smart_money"]});
    if (a.include.includes("list")) holders();
    if (a.include.includes("advanced_security")) profile();
    if (a.include.includes("risk_history")) liquidity();
    notes.push("The reference SEC/SMKT/ACT/VOL composite is not emitted: money-flow scopes and missing security observations cannot establish a comparable safety score.");
  },
});
