---
name: skill-token-security
description: "Check a Solana token’s contract risks — mint and freeze authority, mutable metadata, transfer fees and creator holding, plus provider-reported honeypot and LP-lock flags — with each check marked observed or unknown."
---

<!-- Generated from src/workflows/skill-token-security/definition.ts and catalog/skill-content.json; run npm run skills:sync. -->

# Token Security Check

Requires the separately installed birdeye-cli (Node.js >=22.16) and configured Birdeye credentials.

## When to use

Check a Solana token’s contract risks — mint and freeze authority, mutable metadata, transfer fees and creator holding, plus provider-reported honeypot and LP-lock flags — with each check marked observed or unknown.

## Input

A Solana token address.

## Use

Install birdeye-cli and configure your Birdeye API key. Replace placeholders with your inputs, preview the cost, then run with your chosen budget using --max-cu. Runs one security request. Treat reported flags as provider observations. On Solana, explicit null ownerAddress/freezeAuthority means the authority is inactive; missing or malformed authority remains unknown. Other null evidence stays unknown. This does not audit source code, simulate a sale or independently verify LP locks.

Use cases:
- Quick rug check before trading; filtering out unsafe tokens early in a pipeline.

Preview without API calls:

```bash
birdeye-cli case skill-token-security --address <SOLANA_ADDRESS> --short --estimate-cu
```

Run after confirming the input and budget:

```bash
birdeye-cli case skill-token-security --address <SOLANA_ADDRESS> --short --max-cu <CU_BUDGET>
```

Use `birdeye-cli case skill-token-security --help` for optional flags. Run from any directory.

## Result

Security observations with authority evidence, transfer-fee fields, provider-reported honeypot/LP status where available, and unknown checks.

Report sources, observation times, missing evidence and CU usage. Preserve unknown values; distinguish incomplete evidence from a passed check. These results support research, not automatic trading.

## Supported chains and limitations

Supported chains in this CLI: `solana`. Broader upstream API support does not enable additional chains for this skill.

- Fields the provider doesn't report show as unknown
- Honeypot and LP lock are provider-reported, not verified
- No overall safety score or verdict

### Execution notes

- Security payloads vary by token; absent fields remain unknown. No composite safety score or automatic trading verdict is produced.
- Provider-reported honeypot and LP-lock values are not independent simulation or lock verification. Transfer fees are interpreted only with explicit units.

Live requests require a Birdeye key with access to every requested endpoint; coverage may be incomplete. Plans fetch bounded pages, not complete populations. CU estimates exclude retries and are not confirmed billing. Skills perform research, not trading, continuous monitoring or copy-trade backtesting.

Read [the API and usage reference](references/details.md) to choose evidence depth, understand units and distinguish rolling snapshots from historical activity.
