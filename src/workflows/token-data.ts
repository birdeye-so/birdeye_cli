import type {PlanContext} from "./types.js";

export const tokenDataPolicy = {
  family: "data-skills" as const, subject: "token" as const, category: "token" as const,
  window: "day" as const, tokenPolicy: "per-step" as const,
  source: "docs/workflows/token-data-skills.md",
  fixedSources: true,
};

export function addCohortTimeline({input, add}: PlanContext, tag: "kol" | "smart_trader", details: boolean) {
  const params = {token_address: input.address, tags: [tag], time_from: input.from, time_to: input.to, time_frame: input.trackerFrame};
  add("timeline", "token.tags-tracker", {...params, include_tag_combinations: false});
  if (details) add("timeline-wallets", "token.tags-tracker-details", {...params, limit_wallet: input.scanLimit, limit_bucket: 100});
}

export const cohortLimits = [
  "Provider labels describe observed cohorts, not verified identities. Holdings are a snapshot; a position's lifetime buy/sell totals are not activity in the requested timeline window.",
  "Timeline totals cover returned buckets. Bucket wallet counts cannot be added as unique wallets; detail pages cap wallets per bucket and may have more pages. Unsupported tokens and absent cohorts stay unavailable.",
];
