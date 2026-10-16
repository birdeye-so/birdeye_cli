# Saved research and AI chat

Operate-mode extension of [the reference console](reference-console.md); preserve its navy/light tokens, density and three-column layout.

User outcome: reopen research without new Birdeye requests, then ask AI to analyze the evidence and execute existing workflows to fill gaps. Saved reports remain available after restart. New research chats enable live data by default; users can switch to saved-only, and reopening a conversation restores its stored policy. AI tokens are disclosed separately.

The history rail lists saved runs with full date/time and loads older pages. Opening a row shows the original report, source times, inputs and original CU. A saved/incomplete/storage-error notice distinguishes durable results from incomplete checkpoints or unsaved session evidence. New run starts another context and does not delete history.

Each history row has a separate Delete action; Clear history removes all saved pages. An inline confirmation identifies the scope, irreversible deletion, retained CU/settings and possible copies in other runs. Confirm/Cancel use existing native button styles and danger color. Deletion is disabled during active runs, shows progress/errors, and restores focus afterward. Deleting the selected result clears its displayed data; a missing chat ancestor ends that branch without breaking remaining turns. SQLite tombstones prevent late checkpoints from recreating deleted runs.

Delete and Clear history triggers use icons only: a trash can per row and a list with an X for clearing history. Both retain descriptive accessible names, native tooltips and 32px targets. Confirmation actions keep explicit text labels.

The central Ask AI panel contains a conversation log, selected workflow and address, attached-data context with actual source timestamps, an explicit Allow new Birdeye requests checkbox, question composer and Send message/Stop controls. The agent receives validated workflow inputs and API-step edits and can execute that exact flow. Missing inputs remain explicit. Saved-only mode shows a zero effective CU budget; chat also works without a Birdeye key for local docs/public MCP, while REST calls still require a key. Documentation citations expose the consulted source IDs and official links. Long conversations scroll inside the center column; mobile retains the existing collapsible skill/history rails.

No new visual world, imagery, remote font or decorative motion. Use native controls, visible focus and existing semantic colors. Verification scope: source/type/integration tests; browser screenshots require a runtime that allows TCP listen and Chrome.
