# Contributing

Use [GitHub Issues](https://github.com/birdeye-so/birdeye_cli/issues) for reproducible bugs and focused feature proposals. For vulnerabilities, follow [SECURITY.md](SECURITY.md).

See [Skills and execution](docs/ARCHITECTURE.md) before adding a skill or catalog consumer.

## Local checks

```bash
npm ci
npm run typecheck
npm test
npm run build
npm run check:changelog
npm run check:public
npm run test:package
```

Use Node >=22.16.0. `npm test` builds production entrypoints through `pretest` before compiling/running the test suite. Tests must run from a clean checkout without API keys or sibling repositories. Keep test documents/fixtures in `tests/fixtures` or create them in a temporary directory. Do not add real credentials or live paid calls to the default test suite.

For browser coverage, install Chrome/Chromium and set `CHROME_PATH` to its executable if it is not at the default macOS Chrome path:

```bash
CHROME_PATH=/path/to/chrome npm run test:browser
CHROME_PATH=/path/to/chrome npm run test:demos:browser
```

These browser scripts use fixture providers. They are separate from the default CI matrix; record whether they ran when changing UI behavior.

## Every update needs a changelog entry

Update [CHANGELOG.md](CHANGELOG.md) in the same pull request as code, dependencies, documentation or CI changes. Add a concise entry under **Unreleased**, grouped under Added, Changed, Deprecated, Removed, Fixed or Security. Explain what users/maintainers can observe and any migration action. Do not dump commit messages or create a dated release section before release preparation.

CI compares the PR base or previous pushed commit with the current checkout and fails if repository changes do not include a changelog edit. A maintainer must configure the Check workflow's jobs as required branch checks to prevent bypass. Local validation:

```bash
npm run check:changelog
npm run check:changelog -- --base origin/main
```

The base comparison uses committed changes, matching CI; run it after making your local commit. The content check reads the working tree.

## Pull requests

Describe the problem, changed behavior and checks actually run. Update usage docs when commands, defaults, errors, costs or configuration change. Include regression coverage for behavior changes. Preserve JSON output, credential redaction and offline/no-charge planning. Keep unrelated formatting and generated snapshot changes separate from the requested change.

Before sharing logs, redact keys, provider credentials, connection codes, cookies and private research data. Release instructions are in [docs/RELEASING.md](docs/RELEASING.md).

Internal source documents, plans and research notes must stay in ignored local directories. Never force-add them, paste them into public guides, or include them in generated knowledge/catalog files. Run `npm run check:public` before submitting a PR.
