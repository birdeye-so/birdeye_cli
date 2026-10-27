import { referencePolicy, referenceNote } from "../reference-policy.js";
import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  ...referencePolicy,
  planNotes: [referenceNote],
  id: "skill-contract-dd",
  title: "Contract DD",
  category: "token",
  family: "data-skills",
  subject: "token",
  purpose: "Review contract controls, ownership concentration and price behavior together.",
  produces: "Security checklist, holder distribution and optional candlestick analysis. Unknown controls stay unknown; price action cannot establish contract safety.",
  source: "docs/workflows/birdeye-data-skills.md",
  window: "windowDays",
  plan(context) {
    const {input: a, add, notes} = context;
    const {candles, security} = fragments(context);
    security();
    add("distribution", "token.holder-distribution", {token_address: a.address, mode: "top", top_n: 10, address_type: "wallet"});
    if (!a.skipKline) candles();
    notes.push("No Safe tier or composite safety score is produced: absent mint, honeypot or LP-lock evidence must not be treated as a passed check.");
  },
});
