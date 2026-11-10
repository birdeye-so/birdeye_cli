import { defineWorkflow } from "../types.js";
import { planPriceSurge } from "../../price-surge/api.js";
import { surgeChains } from "../../price-surge/schema.js";

export default defineWorkflow({
  id: "skill-price-surge",
  title: "Price Surge Screen",
  category: "discover",
  family: "data-skills",
  subject: "none",
  purpose:
    "Find surging tokens within a market-cap band and screen liquidity, trading and optional security risks.",
  produces:
    "Ranked candidates, every exclusion reason, bounded advanced evidence, raw source data and CU usage. Unknown risk fields stay null.",
  source: "docs/workflows/price-surge.md",
  window: "windowDays",
  tokenPolicy: "unsupported",
  supportedChains: surgeChains,
  limitations: [
    "Arbitrum is unavailable because Token List V3 does not document it. Other upstream chains are outside this skill's implemented scope.",
    "Standard requests one page of 1–100 tokens for 50 CU. Advanced hydrates at most min(top, limit) first-pass survivors; exclusions are not backfilled. Unhydrated rows have no advanced risk assessment.",
    "Holder health is Solana-only in this implementation, even though the provider also documents Robinhood. Non-Solana runs omit holder profiles and Solana-only trader options.",
    "Security is opt-in in advanced mode. Developer/top-10 caps remain unevaluated without security; unknown authority, lock, tax or KOL evidence stays null, not a passed check.",
    "Trader metrics cover at most ten sampled wallets; 1m/5m screens use a 30m trader window. Holder-profile volume uses 1h. Profitability is not a market-wide win rate; a KOL holder count is not a KOL buyer count.",
  ],
  validate(input, issue) {
    if (Object.keys(input.stepOverrides).length)
      issue(
        "Price Surge uses fixed source contracts; set priceSurge inputs instead of step overrides.",
      );
  },
  // planCase delegates to the internal API so previews and execution share caps,
  // chain validation and costs. This callback also supports catalog inspection.
  plan({ input, add, notes }) {
    const plan = planPriceSurge(input.priceSurge ?? {});
    notes.push(...plan.notes);
    for (const step of plan.steps)
      add(step.id, step.operation, step.params, step.subjects, step.subjectKey);
  },
});
