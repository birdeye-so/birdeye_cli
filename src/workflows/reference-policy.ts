// Shared constraints of the imported reference recipes; unrelated to agent package installation.
export const referencePolicy = {
  tokenPolicy: "per-step",
  maxCandleIntervals: 5000,
} as const;
export const referenceNote = "Adapted from TheNang2710/birdeye-data-skills. Only documented Birdeye endpoints are used; CU follows this CLI's catalog. Pagination is bounded to one page per step. Scores are research heuristics, not trading instructions.";
