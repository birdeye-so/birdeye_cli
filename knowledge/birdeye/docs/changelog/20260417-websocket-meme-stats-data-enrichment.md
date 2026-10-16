---
title: 2026.04.17 - WebSocket Meme Stats Data Enrichment
description: Added release note.
---

# 2026.04.17 - WebSocket Meme Stats Data Enrichment

**Websocket MEME_STATS payload updated with richer market/holder/tag engine analytics**

[Websocket MEME_STATS](../websockets/meme-stats)



* Expanded meme_stats payload with multi-timeframe trading stats
  * `buy*`, `sell*`, `volume*`, `volume*_change_percent`...
* Added holder distribution metrics
  * `holder`, `top10_holder_percentage`
* Added tag/risk indicators
  * `sniper_count`, `bundler_count`, `insider_count`, `dev_count`
  * `sniper_held_percentage`, `bundler_held_percentage`, `insider_held_percentage`, `dev_held_percentage`
