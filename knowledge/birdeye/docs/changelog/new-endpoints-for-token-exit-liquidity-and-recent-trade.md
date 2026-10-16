---
title: 2025.06.20 - New Endpoints for Token Exit Liquidity and Recent Trades
description: Added release note.
---

# 2025.06.20 - New Endpoints for Token Exit Liquidity and Recent Trades

**🟢 Token Exit Liquidity**

You can now track Token Exit Liquidity on the **Base** network using our latest API endpoints. This update makes it easier to monitor how easily a token can be exited.

🔗 New endpoints available for both single and batch queries

* [Single](../data-api/stats/get-defi-v3-token-exit-liquidity): `/defi/v3/token/exit-liquidity`
* [Multiple](../data-api/stats/get-defi-v3-token-exit-liquidity-multiple#/): `/defi/v3/token/exit-liquidity/multiple`

**🟢 Recent Trades is live for All Chains**

You can now programmatically view Recent Trades on all of our supported chain. This new endpoint retrieves a real-time feed of recent token trades, swaps, and liquidity events across multiple DeFi protocols.

* [Recent trade endpoint](../data-api/transactions/get-defi-v3-txs-recent#/)
