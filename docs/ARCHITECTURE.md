# Skills and execution

The public model has one resource: **skill**. There are 23 skills, each identified by its existing CLI case ID and described by its purpose, required input, result and usage commands. A multi-step capability is still one skill. See [the glossary](../CONTEXT.md).

## Ownership

| Concern | Canonical source |
| --- | --- |
| Skill metadata, validation, planning and selection rules | `src/workflows/<id>/definition.ts` |
| Registered IDs | `src/workflows/registry.ts` |
| Common CLI inputs and validation | `src/workflows/input.ts`, `schema.ts` |
| Step parameters, estimates and execution | `src/workflows/planner.ts`, `executor.ts` |
| Shared request fragments | `src/workflows/fragments.ts` |
| Provider contracts and request accounting | `src/catalog.ts`, `src/runner.ts` and their existing supporting modules |
| Deterministic scoring | `src/token-dd-*.ts`, `src/skill-metrics.ts` |
| Generated installable instructions | `skills/<id>/SKILL.md` |
| Public description/usage projection | `scripts/lib/skill-runtime.mjs` |
| Shared categories and guides | `catalog/resources.json` |
| Maintainer review of complex execution | `docs/SKILL_REVIEW.md` |

The internal `workflows/` path, `workflowCatalog` export, `case` CLI command and historical `skill-*` IDs remain for compatibility. They do not create a second public resource type. Existing integrations continue using the same CLI commands and inputs.

## Add or change a skill

1. Add `src/workflows/<id>/definition.ts` with `defineWorkflow`. Keep metadata and planning together. `purpose` describes when to use the skill; `produces` describes its result and limitations. Declare its subject, category and default observation window.
2. Register the definition once in `workflowDefinitions`. The catalog and generated `skills/<id>/` package derive from this registration. A unique skill ID is also its CLI case ID and counter key.
3. Use `validate` for skill-specific input rules, `plan` to add ordered steps, and `finalize` only when normalized overrides must update report inputs. Add new input primitives and CLI flags only when needed.
4. Each step has a unique ID. Selectors reference earlier steps and have a positive bounded count. Reuse fragments with identical request semantics; keep different scope/order/policies local to the definition. All steps share the runner, budget and cancellation signal.
5. Keep scoring in code. Instructions guide the agent to the executable implementation and explain interpretation; they do not duplicate formulas in executable scripts.
6. Run `npm run catalog:sync`. This generates the corresponding `SKILL.md`, public API/landing snapshots and the complex-skill review. Review the resulting diff and preserve the maintainer decisions outside the generated review block.
7. Run type checks and relevant tests. Verify default and optional modes, missing evidence, partial results and budget stopping when execution changes.

Generated instructions provide input guidance, offline preview, execution, expected result and evidence interpretation. Their CLI prerequisite is explicit. Detailed reference files are packaged locally when needed; standalone installation must resolve every local Markdown link.

The four earlier broad instruction packages remain available for existing installations, marked `legacy` in `skill.json`. They are excluded from the public catalog. They are compatibility artifacts, not an additional public skill category. New capabilities receive their own definition and generated package.

## Keep public descriptions small

The public projection contains `id`, `title`, `category`, `description` and `usage`. Usage contains input instructions, preview/run/install commands and expected result. The API adds `skill_id`, `view_count` and `download_count`.

The public catalog omits step graphs, operation names, skill/workflow relationships and internal execution estimates. Users can run the free preview command for the cost of their actual inputs. The existing demo remains a recorded example; it makes no live requests.

Complexity lives in the maintainer review, generated offline from the actual planner. It includes skills with at least four steps in any inspected mode, or a selector depending on earlier results. The report records order, fan-out, request/CU estimates and questions about overlapping capabilities. These are review notes, not approvals to change execution.

## Delivery and compatibility

`npm run skills:sync` regenerates instructions and local references; `npm run skills:check` checks them without writing. `npm run skills:review` updates only the generated review block. `npm run catalog:sync` refreshes all three plus the API and landing snapshots.

The API exposes only `/agent/api/skills` and its event routes. The landing page has one skill list and usage detail; historical `#workflow/<id>` links still open the same skill. The standalone API ships a generated snapshot and does not need the source checkout or landing app at runtime.

Existing `skill_stats` rows remain keyed by unchanged IDs. If a local build of the intermediate typed-counter implementation was used, migration consolidates those authoritative rows once without adding the already-copied legacy totals again. See [API deployment notes](../apps/skills-api/README.md).
