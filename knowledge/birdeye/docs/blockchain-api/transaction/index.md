---
title: Transaction
hidden: false
---

# Transaction

This section covers raw blockchain transaction detail for one transaction hash or signature.

Use this section when you need:

- decoded chain-level transaction detail
- exact state-change provenance
- forensic inspection of one transaction
- a lower-level transaction view than Birdeye trading endpoints

## Which endpoint should I use?

| If you need... | Use this endpoint |
| --- | --- |
| One raw transaction detail payload | `Blockchain - Transaction Detail` |

## Notes

- Use this section when you need the actual transaction and its chain context, not a market trade abstraction.
- This endpoint is useful for debugging, reconciliation, incident review, and on-chain forensics.
- Pair it with `Account` or `Token` when you need to explain what state existed before or after the transaction.

## Typical workflow

1. Start with `Blockchain - Transaction Detail` for the exact signature or hash you want to inspect.
2. Use `Account` or `Token` endpoints to add surrounding state context.
3. Join with Birdeye market endpoints only when you need to relate the transaction back to price or liquidity behavior.
