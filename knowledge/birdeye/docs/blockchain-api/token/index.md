---
title: Token
hidden: false
---

# Token

This section covers chain-level token metadata lookups for one or many token addresses.

Use this section when you need:

- raw token metadata for one token
- batch token metadata enrichment
- chain-layer token identity outside market-data endpoints
- metadata backfills for infra or indexing workflows

## Which endpoint should I use?

| If you need... | Use this endpoint |
| --- | --- |
| Metadata for one token | `Blockchain - Token Metadata` |
| Metadata for many tokens | `Blockchain - Multiple Token Metadata` |

## Notes

- Use this section when you need token identity at the blockchain layer rather than Birdeye market context.
- Batch metadata lookups are useful for explorers, indexers, wallet tooling, and metadata hydration jobs.
- Combine these endpoints with `Account` when you need both ownership state and token identity.

## Typical workflow

1. Start with `Blockchain - Token Metadata` for one token lookup.
2. Move to `Blockchain - Multiple Token Metadata` when hydrating many token rows at once.
3. Join the result with account or transaction detail when metadata alone is not enough.
