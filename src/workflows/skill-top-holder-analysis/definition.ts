import { defineWorkflow } from "../types.js";
import { tokenDataPolicy } from "../token-data.js";
export default defineWorkflow({
  ...tokenDataPolicy,
  id: "skill-top-holder-analysis",
  title: "Top Holder Analysis",
  purpose:
    "Inspect the largest holders of a Solana token and their share of supply. Use to investigate ownership concentration and labeled holder groups.",
  produces:
    "Top wallet holdings, provider-reported supply shares, top-1/top-10 concentration when covered, and optional cohort context.",
  guide: {
    input: "A Solana token address, top-n (10–50), and optional depth full.",
    exampleFlags: "--top-n 10",
    useCases: [
      "Find the largest holders and how much supply the top ten control.",
      "Add labeled cohort context when investigating concentrated ownership.",
    ],
    instructions:
      "Uses wallet-based holder distribution rather than token-account totals. --depth full adds holder-profile. Cohort shares can overlap and are not added; a label alone does not establish common ownership.",
  },
  limitations: [
    "One distribution page of 10–50 wallets. Top-10 is unavailable when fewer than ten valid, distinct rows are returned.",
    "Supply percentages use the distribution provider's denominator; token-account concentration from security is not relabeled as wallet concentration.",
  ],
  plan({ input: a, add }) {
    add("distribution", "token.holder-distribution", {
      token_address: a.address,
      mode: "top",
      address_type: "wallet",
      top_n: a.topN,
      include_list: true,
      limit: a.topN,
    });
    if (a.depth === "full")
      add("profile", "token.holder-profile", { token_address: a.address });
  },
});
