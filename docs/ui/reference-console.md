# Reference console direction

Scope: `web/main.tsx`, `web/style.css`, `web/skill-console.tsx`, `web/skill-settings.tsx`. Operate mode for one researcher on a local desktop or SSH tunnel, with a responsive mobile layout.

## Direction contract

THESIS: Match the user-selected `birdeye-data-skills/deploy/index.html` console: choose a skill, inspect its inputs/API steps and CU, run it, then review structured results and history.

CLI preview: a closed **CLI command** disclosure beside API steps exposes the equivalent `birdeye-cli case` command and a Copy button. It uses validated plan input, pinned from/to timestamps, step overrides and the current CU limit. Pending or invalid parameters hide the old command; missing required subjects never use a fabricated address. Demos expose `demo` commands directly from their form, with pinned timestamps once prepared. Imports expose `workflow imports run` after planning and require the same local imported definition/configuration. Commands use POSIX shell quoting and explicit JSON output; viewing/copying makes no data requests. Clipboard failure leaves the selectable command visible for manual copy.

OWN-WORLD: Source console's navy canvas/panels, blue active controls, muted blue-gray labels, green/amber/red status; compact system type and tabular data. No invented product claims or safety scores.

STORY: Group filters narrow a visible skill list. The center explains the selected skill and exposes parameters. Results have UI, plain and JSON views. History reopens existing runs without charging CU.

FIRST VIEWPORT: Compact header with Research/Usage/Settings, connection/storage status, group bar, then a 260px skill rail, fluid center form/results, and 240px history rail. Mobile stacks the rails as compact disclosures and keeps the form full width.

FORM: User-pinned reference console; no random direction or generated comp. The signature interaction is selecting a skill and seeing its bounded API plan/CU update without a paid request. Retain step editors, AI, auth, SQLite, export and stop-run controls. Reference palettes/layout take precedence over the earlier light workspace.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Validation: runtime network/DNS unavailable in the sandbox; use documented response fixtures and browser automation where allowed, disclose unverified live/browser behavior.
