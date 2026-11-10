# Birdeye research

Birdeye presents research capabilities as skills. Users choose a skill by its purpose and follow its usage instructions.

## Language

**Skill**:
A named research capability with a description, required inputs and instructions for obtaining a result. A skill may perform one step or several dependent steps.
_Avoid_: Workflow, recipe or agent skill as separate public resource types.

**Step**:
One data-gathering action within a skill. Its inputs may depend on evidence collected by earlier steps.

**CU estimate**:
The estimated compute cost for a skill's selected inputs and options, excluding retries. It is distinct from the provider's confirmed billed usage.
