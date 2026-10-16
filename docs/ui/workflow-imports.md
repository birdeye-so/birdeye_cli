# Workflow imports

Operate-mode extension of the existing reference console. Preserve its system type, navy/light palette, native controls and history rail.

Imports is a top-level workspace tab. The first form accepts a public GitHub URL or uploaded/pasted Markdown/JSON. The source filename matters for reviewed named adapters. Imports remain in SQLite after restart; importing and planning spend no Birdeye CU or AI tokens.

Choose a saved import to see purpose, provenance hash, source-command mapping and explicit migration differences. Known GMGN and Birdeye Data Skills documents use bounded reviewed recipes. Arbitrary Markdown exposes endpoint candidates only. Version 1 JSON defines registered API steps, parameters and bounded dependencies. Never present a candidate endpoint as an executed step.

Executable steps expose endpoint links, purpose, CU and JSON parameter editors. Runtime inputs and step edits invalidate the prepared plan; Preview mapping & CU must succeed with required addresses before Run becomes available. The CU budget remains editable. Run uses the existing active-run controls/results/history, with imported source provenance in the saved result.

The shared address field is disabled when steps use fixed addresses or earlier results. Each step distinguishes workflow-bound subjects from editable fixed parameters, and dependency text identifies the upstream steps and provider ordering. Accepted API parameters remain inside a native disclosure. Review-only documents show an explicit notice and no run controls.

No decorative assets or new tokens. The form and review use the existing controls, disclosure, notice, spacing and theme vocabulary. Source-command mapping starts expanded; provenance and executable-step detail start collapsed. Estimated CU and the request bound remain outside those disclosures. Native controls expose loading/disabled/error states; code/provenance wraps within the center column. Imports uses the existing utility layout, with History beside the content on wide screens and below it at the existing 950px breakpoint.

Documentation evidence: inspected `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, `web/workflow-imports.tsx`, its integration in `web/main.tsx`, and the shared/import-specific rules in `web/style.css`. The implementation handoff reports all 109 tests, typecheck and build passing; this documentation pass did not rerun them. The review disposition remains **recapture** because EPERM prevented browser capture. Rendered appearance, responsive fit and contrast are not approved by these source checks.

Global design records are preserved. Their navigation examples predate Imports and their validation count records the earlier 67-test handoff; this surface record supplies the extension context without replacing the incumbent visual system.
