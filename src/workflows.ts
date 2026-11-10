// Stable entrypoint for CLI, UI and integrations. Implementations live under workflows/.
export {
  caseKinds,
  legacyCaseKinds,
  workflowCatalog,
} from "./workflows/registry.js";
export { caseSchema, type CaseInput } from "./workflows/schema.js";
export { planCase, type CasePlan } from "./workflows/planner.js";
export { executePlan, dataRows, type Execution } from "./workflows/executor.js";
export type { Step } from "./workflows/types.js";
