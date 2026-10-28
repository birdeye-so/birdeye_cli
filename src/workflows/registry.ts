import workflow0 from "./token-research/definition.js";
import workflow1 from "./token-due-diligence/definition.js";
import workflow2 from "./project-deep-report/definition.js";
import workflow3 from "./wallet-analysis/definition.js";
import workflow4 from "./smart-money-profile/definition.js";
import workflow5 from "./risk-warning/definition.js";
import workflow6 from "./early-project-screening/definition.js";
import workflow7 from "./daily-brief/definition.js";
import workflow8 from "./market-opportunities/definition.js";
import workflow9 from "./market-shortlist/definition.js";
import workflow10 from "./wallet-exposure/definition.js";
import workflow11 from "./skill-token-dd-score/definition.js";
import workflow12 from "./skill-trending-list/definition.js";
import workflow13 from "./skill-smart-wallets/definition.js";
import workflow14 from "./skill-token-dd/definition.js";
import workflow15 from "./skill-contract-dd/definition.js";
import workflow16 from "./skill-rugcheck-audit/definition.js";
import workflow17 from "./skill-kline-pattern/definition.js";
import workflow18 from "./skill-wallet-score/definition.js";
import workflow19 from "./skill-wallet-style/definition.js";
import workflow20 from "./skill-wallet-analysis/definition.js";
import workflow21 from "./skill-smart-money-profile/definition.js";
import workflow22 from "./skill-smart-money-leaderboard/definition.js";
import type { WorkflowDefinition } from "./types.js";
import priceSurge from "./skill-price-surge/definition.js";

export const workflowDefinitions = [
  priceSurge,
  workflow0,
  workflow1,
  workflow2,
  workflow3,
  workflow4,
  workflow5,
  workflow6,
  workflow7,
  workflow8,
  workflow9,
  workflow10,
  workflow11,
  workflow12,
  workflow13,
  workflow14,
  workflow15,
  workflow16,
  workflow17,
  workflow18,
  workflow19,
  workflow20,
  workflow21,
  workflow22,
] as const;
export type WorkflowId = (typeof workflowDefinitions)[number]["id"];
export const caseKinds = workflowDefinitions.map(item => item.id) as [WorkflowId, ...WorkflowId[]];
const registry = new Map<string, WorkflowDefinition>();
for (const definition of workflowDefinitions) {
  if (registry.has(definition.id)) throw new Error(`Duplicate workflow ID: ${definition.id}`);
  registry.set(definition.id, definition);
}
export const findWorkflow = (id: string) => registry.get(id);
export function getWorkflow(id: string): WorkflowDefinition {
  const definition = registry.get(id);
  if (!definition) throw new Error(`Unknown workflow: ${id}`);
  return definition;
}
export const legacyCaseKinds = workflowDefinitions.filter(item => item.family === "legacy").map(item => item.id);
export const workflowCatalog = () => workflowDefinitions.map(({id: kind, title, category, family, subject, description, purpose, produces, source, supportedChains, limitations}) => ({
  kind, title, category, group: family === "legacy" ? "legacy" : category, family, subject, description: description ?? purpose, purpose, produces, source, supportedChains, limitations,
}));
