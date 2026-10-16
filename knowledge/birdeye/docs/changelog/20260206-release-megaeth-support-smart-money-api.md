---
title: 2026.02.06 - Release MegaETH support & Smart Money API
description: Added release note.
---

# 2026.02.06 - Release MegaETH support & Smart Money API

Now support MegaETH APIs and WebSocket. New Smart Money endpoint!

BDS provides a complete suite of APIs and streaming endpoints for MegaETH, enabling developers to build dashboards, trading bots, explorers, analytics tools, and DeFi applications.

## New Features

### Smart Money - Token List

##### [GET /smart-money/v1/token/list](../data-api/smart-money/get-smart-money-v1-token-list)

**Features:**

* You now can retrieve a list of tokens followed by smart money flow.
* Currently support only Solana.
* `trader_style` gives you option to switch between all type of traders or based on risk appetites.
