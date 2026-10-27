import type { Operation } from "../catalog.js";
import type { Data } from "../shared.js";
import type { WorkflowInput } from "./input.js";

export type Selection = { from: string[]; take: number; kind: "token" | "wallet" | "pair"; sort?: boolean };
export type Step = { id: string; operation: Operation; params: Data; cost: number; subjects?: Selection; subjectKey?: string };
export type AddStep = (id: string, operation: Operation, params: Data, subjects?: Selection, subjectKey?: string) => void;
export type PlanContext = {input: WorkflowInput; add: AddStep; notes: string[]};
export type WorkflowDefinition = {
  id: string;
  title: string;
  category: "token" | "wallet" | "discover";
  family: "legacy" | "data-skills";
  subject: "token" | "wallet" | "wallets" | "optional-wallet" | "none";
  description?: string;
  purpose: string;
  produces: string;
  source: string;
  defaultLimit?: number;
  tokenPolicy?: "supported" | "full-depth" | "unsupported" | "per-step";
  liquidityBaseline?: boolean;
  planNotes?: readonly string[];
  maxCandleIntervals?: number;
  filterSubjects?: (rows: Data[], input: WorkflowInput) => Data[];
  window: "day" | "duration" | "windowDays";
  validate?: (input: WorkflowInput, issue: (message: string) => void) => void;
  plan: (context: PlanContext) => void;
  finalize?: (input: WorkflowInput, steps: Step[]) => void;
};
export function defineWorkflow<const Id extends string, const Family extends WorkflowDefinition["family"]>(definition: WorkflowDefinition & {id: Id; family: Family}) {
  return definition;
}
