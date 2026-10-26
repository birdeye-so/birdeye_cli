# Releasing

The supported distribution is a built `.tgz`. This process does not automatically publish to npm or change repository visibility.

## Version policy

Use [Semantic Versioning](https://semver.org/). Before 1.0, increment the minor version for breaking changes or features and the patch version for compatible fixes/documentation updates. Document breaking command, output, config and database changes explicitly. Never replace a released archive or reuse a release version.

`0.4.0` predates release tracking and has been reused by development commits. For the first tracked release, choose a new version (for example `0.4.1` if changes remain compatible), rather than presenting previous builds as identical.

## Prepare a release commit

1. Verify redistribution rights for bundled public content, scan the full Git history for private content, and enable required CI checks/private vulnerability reporting.
2. Move relevant Unreleased entries into `## [X.Y.Z] - YYYY-MM-DD` using the actual release date. Leave `## [Unreleased]` for future work. Include upgrade/migration notes, known limitations and breaking changes.
3. Run `npm version X.Y.Z --no-git-tag-version` to update `package.json` and `package-lock.json`. Update the literal version in `src/index.ts` and installation filenames in the English and Vietnamese guides. `check:changelog` verifies manifest/lock/CLI version agreement.
4. Run the commands below. The release check requires a dated changelog section matching the package version, an empty Unreleased section and a LICENSE.

```bash
npm ci
npm run typecheck
npm test
npm run check:changelog -- --release
npm run check:public -- --history
npm run test:package
npm audit --omit=dev
npm pack
```

Review the archive's file list and dependency notices. `npm pack` prints its filename and integrity hash. Verify the archive on each supported platform and record browser/live checks separately. A live Birdeye/AI/MCP smoke check incurs provider usage and should only use approved test accounts/budgets.

## Tag and distribute

After the release commit has passed required CI checks:

1. Create an annotated `vX.Y.Z` tag on that exact commit and push it.
2. Create a GitHub Release for that tag. Copy the matching changelog section into release notes, including install instructions, migration notes and known limitations.
3. Attach the `.tgz` built from that commit and a SHA-256 checksum. On macOS use `shasum -a 256 birdeye-cli-X.Y.Z.tgz`; on Linux use `sha256sum birdeye-cli-X.Y.Z.tgz`.
4. Download the attached tarball and repeat the documented install/version/estimate checks from a clean user directory before announcing it. Readers can use GitHub Watch → Custom → Releases to track future versions.

The Check workflow validates version/changelog alignment on `v*` tags. The repository still needs required branch checks and protected release tags configured by its maintainers. Git tags and GitHub Releases are intentional maintainer actions, not performed by the local validation scripts.

npm registry publication needs a separate decision about package ownership/name, publishing authentication and provenance. Do not advertise `npm install -g birdeye-cli` until that exact distribution is verified.

## Internal documents and Git history

Internal PDFs, plans, research notes, UI specifications and private design files stay local and are ignored by Git. `check:public` rejects tracked private paths; the package smoke test also rejects these paths in the actual tarball. CLI knowledge synchronization uses only public README, installation/usage guides, workflows and skills.

Run `npm run check:public -- --history` before making a repository public or creating a public release. It checks all locally available refs, so fetch remote branches/tags first. Removing private files in a new commit does not remove them from earlier commits. If this check fails, keep the repository private and perform a coordinated history cleanup or publish a fresh repository from the sanitized source tree. Do not upload a Git bundle or an old source archive. Rewriting a shared remote history requires maintainer coordination; this task does not perform a force-push.
