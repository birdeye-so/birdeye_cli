import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  id: "early-project-screening",
  title: "Early Project Screening",
  category: "discover",
  family: "legacy",
  subject: "none",
  description: "Launchpad discovery and candidate screening",
  purpose:
    "Find tokens at a chosen launch stage and screen a bounded shortlist for liquidity, security and holder-group evidence.",
  produces:
    "Launch candidates, selection reasons and per-token checks. Newly listed and newly created describe different events.",
  source: "docs/workflows/workflow-early-project-screening.md",
  window: "day",
  validate(a, issue) {
    if (a.stage === "near-graduation" && a.minProgress === undefined)
      issue("near-graduation requires an explicit minProgress threshold");
    if (a.stage === "newly-listed" && a.source !== "all")
      issue(
        "newly-listed does not support a venue filter; use newly-created with source instead",
      );
  },
  filterSubjects(rows, input) {
    if (input.stage !== "newly-listed") return rows;
    return rows.filter((row) => {
      const time =
        typeof row.liquidityAddedAt === "number"
          ? row.liquidityAddedAt
          : Date.parse(row.liquidityAddedAt) / 1000;
      return Number.isFinite(time) && time >= input.from! && time <= input.to!;
    });
  },
  plan(context) {
    const { input: a, add } = context;
    const { scope, enrich } = fragments(context);
    if (a.stage === "newly-listed")
      add("candidates", "market.new-listings", {
        time_to: a.to,
        limit: Math.min(a.scanLimit, 20),
      });
    else
      add("candidates", "market.meme-list", {
        source: a.source,
        limit: a.scanLimit,
        min_liquidity: a.minLiquidity,
        ...(a.stage === "graduated"
          ? {
              graduated: true,
              min_graduated_time: a.from,
              max_graduated_time: a.to,
              sort_by: "graduated_time",
            }
          : a.stage === "near-graduation"
            ? {
                graduated: false,
                min_progress_percent: a.minProgress,
                min_creation_time: a.from,
                max_creation_time: a.to,
                sort_by: "progress_percent",
              }
            : {
                min_creation_time: a.from,
                max_creation_time: a.to,
                sort_by: "creation_time",
              }),
      });
    enrich(scope(["candidates"]), true);
  },
});
