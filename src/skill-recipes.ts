// Compatibility names for the historical data-skills workflow family, not installable skills.
import { workflowDefinitions, getWorkflow } from "./workflows/registry.js";
import type { CaseInput } from "./workflows/schema.js";
import type { AddStep } from "./workflows/types.js";
type ReferenceWorkflowId = Extract<(typeof workflowDefinitions)[number], {family: "data-skills"}>["id"];
export const skillKinds = workflowDefinitions.filter(item => item.family === "data-skills").map(item => item.id) as ReferenceWorkflowId[];
export const skillInfo = Object.fromEntries(skillKinds.map(id => {
  const item = getWorkflow(id);
  return [id, {title: item.title, group: item.category, subject: item.subject, purpose: item.purpose, produces: item.produces}];
})) as Record<ReferenceWorkflowId, {title: string; group: string; subject: string; purpose: string; produces: string}>;
export const isSkill = (kind: string): kind is ReferenceWorkflowId => Object.hasOwn(skillInfo, kind);
export function addSkillSteps(input: CaseInput, add: AddStep, notes: string[]) {
  const definition = getWorkflow(input.kind);
  notes.push(...(definition.planNotes ?? []));
  definition.plan({input, add, notes});
}
