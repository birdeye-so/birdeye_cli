import { z } from "zod";
import { workflowInputSchema } from "./input.js";
import { caseKinds, getWorkflow } from "./registry.js";

export const caseSchema = workflowInputSchema.extend({kind: z.enum(caseKinds)}).superRefine((p, ctx) => {
  const issue = (message: string) => ctx.addIssue({code: "custom", message});
  const definition = getWorkflow(p.kind);
  if (p.priceSurge && p.kind !== "skill-price-surge") issue("priceSurge inputs require skill-price-surge");
  definition.validate?.(p, issue);
  if (definition.subject === "wallets" && !p.wallets?.length) issue("Provide 1–10 wallet addresses");
  if (p.wallets && definition.subject !== "wallets") issue("wallets is only supported for skill-smart-money-leaderboard");
  if (definition.tokenPolicy === "per-step" && (p.excludeFreezeable || p.minLiquidity !== undefined || p.maxTop10Pct !== undefined)) issue("Reference skill recipes use per-step API filters; legacy screening policies do not apply");
  if ((["token", "wallet"].includes(definition.subject)) && !p.address) issue("This workflow requires a Solana address");
  if ((p.from === undefined) !== (p.to === undefined)) issue("Provide both from and to, or neither");
  if (p.from !== undefined && p.to !== undefined && p.from >= p.to) issue("from must precede to");
  if ((p.baselineLiquidity === undefined) !== (p.baselineTime === undefined)) issue("Provide both baselineLiquidity and baselineTime");
  const hasTokenPolicy = p.excludeFreezeable || p.minLiquidity !== undefined || p.maxTop10Pct !== undefined;
  if (hasTokenPolicy && (definition.tokenPolicy === "unsupported" || (definition.tokenPolicy === "full-depth" && p.depth !== "full"))) issue("Token screening criteria require a token workflow or wallet-analysis with full depth");
  if (p.baselineLiquidity !== undefined && !definition.liquidityBaseline) issue("A liquidity baseline is only supported for risk-warning");
  if (p.address && !["token", "wallet", "optional-wallet"].includes(definition.subject)) issue("This discovery workflow does not take an address");
});
export type CaseInput = z.infer<typeof caseSchema>;
