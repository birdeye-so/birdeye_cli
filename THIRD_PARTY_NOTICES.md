# Third-party content

The root MIT license covers this project's original code and documentation. It does not replace the rights or terms attached to upstream materials.

- `knowledge/birdeye/docs/` is a snapshot of Birdeye provider documentation and resolved API contracts. `knowledge/birdeye/manifest.json` records the upstream commit, source URLs and content hashes. Confirm authorization to redistribute this snapshot before public release; no separate upstream license is recorded in this repository.
- Workflow guides describe adaptations of GMGN and Birdeye Data Skills workflows. Source links and scope differences are recorded in `docs/workflows/migration-audit.md`. Referenced projects retain their own licenses.
- Private source documents and internal planning/research notes are excluded from the source tree, generated knowledge bundle and npm package.
- Runtime npm dependencies and bundled web dependencies retain their respective licenses. Review `package-lock.json` and dependency license notices for the exact versions in each release. esbuild preserves legal comments in its output by default; ship the complete `dist/web` directory.

This inventory records known sources; it is not confirmation that upstream redistribution rights have been cleared.
