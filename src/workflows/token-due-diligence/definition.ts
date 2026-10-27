import { defineWorkflow } from "../types.js";
import { fragments } from "../fragments.js";

export default defineWorkflow({
  id: "token-due-diligence",
  title: "Token Due Diligence",
  category: "token",
  family: "legacy",
  subject: "token",
  description: "Quick identity and security checklist",
  purpose: "Check a token's identity and the security fields that could rule it out of your research shortlist.",
  produces: "An identity and security checklist with missing checks made explicit. This is not a safety verdict.",
  source: "docs/workflows/workflow-token-due-diligence.md",
  window: "day",
  plan(context) {
    const {input: a} = context;
    const {security, pools} = fragments(context);
    security();
    if (a.depth === "full") pools();
  },
});
