import { referencePolicy, referenceNote } from "../reference-policy.js";
import { defineWorkflow, type Selection } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  ...referencePolicy,
  planNotes: [referenceNote],
  id: "skill-smart-wallets",
  title: "Smart Wallets",
  category: "discover",
  family: "data-skills",
  subject: "none",
  purpose:
    "Discover wallets trading tokens in Birdeye's smart-money list, then inspect a bounded wallet shortlist.",
  produces:
    "Token → top traders → deduplicated wallets. Standard adds PnL; deep adds holdings and per-token PnL. No overlapping token-level PnL is summed.",
  source: "docs/workflows/birdeye-data-skills.md",
  limitations: [
    "Default discovery takes at most 20 smart-money tokens from a 1d page, then ten 30d top traders for each of 1–5 selected tokens. It deduplicates at most 1–5 wallets in provider order; this is not a complete wallet leaderboard.",
    "Fast mode has no wallet-wide PnL evidence; standard adds 30d PnL and deep adds holdings and a per-token PnL page. Token-scoped trader PnL cannot be summed into wallet-wide PnL or win rate.",
    "Provider labels may be incomplete and do not establish future performance. Holdings and positions are paginated samples; no copy-trade return is calculated.",
  ],
  window: "windowDays",
  plan(context) {
    const { input: a, add, notes } = context;
    const { token, summary, details, holdings } = fragments(context);
    add("smart-tokens", "market.smart-money", {
      interval: "1d",
      limit: Math.min(20, a.scanLimit),
    });
    add(
      "traders",
      "token.top-traders",
      { time_frame: "30d", limit: 10 },
      { from: ["smart-tokens"], kind: "token", take: a.limit! },
    );
    const selected: Selection = {
      from: ["traders"],
      kind: "wallet",
      take: a.limit!,
    };
    if (a.skillDepth !== "fast") summary("pnl", undefined, "30d", selected);
    if (a.skillDepth === "deep") {
      holdings("holdings", undefined, selected);
      details("pnl-details", undefined, selected);
    }
    notes.push(
      "Wallets are deduplicated in provider order across selected token pages. Per-token top-trader totals are not a wallet-wide win rate or PnL.",
    );
  },
});
