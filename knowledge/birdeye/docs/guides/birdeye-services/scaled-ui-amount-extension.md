---
title: Scaled UI Amount Extension
excerpt: Under Development
deprecated: false
hidden: false
metadata:
  robots: index
---
# Overview

The Scaled UI Amount extension is a new feature introduced in the Solana Token 2022 Program. This extension allows token creators to give their assets stock-like behavior — supporting splits and visual adjustments in token quantity and price without actual on-chain transfers. Birdeye has added comprehensive support for this to ensure both transparency and usability while maintaining data accuracy and stability.

# 🧠 Core Concepts

## What Is Scaled UI Amount?

* Scaled UI Amount introduces "shares" as a unit derived from the base token amount via a multiplier.
* Think of it like a stock split — your wallet still holds the same economic value, but shows more tokens ("shares").
* Underlying asset: Consider the real token (on-chain) as the base asset.
* Derived asset: Shares, or the visual token amount, adjusted for display and user reference.

## 🔍 How Birdeye Handles Scaled UI Amount

### General Philosophy

* Birdeye treats Scaled tokens as derivatives of the base asset.
* We default to showing raw on-chain data to ensure consistency and accuracy.
* However, scaled metrics are displayed alongside to help users interpret data more intuitively.

## 📄 Token Detail Page Changes

### 1. Recent Trades Table

* ✅ Raw Mode (Default)
  * Amount: On-chain amount
  * Price: On-chain execution price
* 🆕 Scaled Mode (Toggle Option)
  * Amount: Amount \* Multiplier
  * Price: Price / Multiplier

*Users can switch between Raw and Scaled views using a toggle switch.*

### 2. Candlestick Chart

* ✅ Default: Uses raw price and raw amount for consistency with market data.
* 🆕 Toggle to Scaled Mode:
  * Prices and amounts shown as "shares"
  * Each data point is scaled using the current multiplier

### 3. Supply Stats

* Total Supply: Always shown in raw (base token) amount.
* Circulating Supply: Always shown in raw amount.

*This maintains alignment with on-chain explorers and official tokenomics.*

### 4. New Fields on Token Stats Panel

| Field                  | Description                                                                       |
| :--------------------- | :-------------------------------------------------------------------------------- |
| Shares per Token (SPT) | Also known as the multiplier, this indicates how many shares equal one raw token. |
| Share Price            | Computed as: `Raw Price / Multiplier`. This shows what each "share" would cost.   |

<br />

## 🧩 New “Extensions” Tab

This is a dedicated section to explain and visualize Scaled UI logic for tokens that support it.

### Included Components:

1. Price Comparison Chart
   * Shows both Raw Price and Scaled (Share) Price over time.
   * Helps users understand how scaling affects perception of value.
2. Multiplier History Chart
   * Interactive timeline of all multiplier updates.
   * Useful to trace events like stock-like splits or supply expansions.
3. Essential Info Panel

| Field                  | Description                                         |
| :--------------------- | :-------------------------------------------------- |
| Current Multiplier     | How much each raw token is multiplied to get shares |
| Last Updated           | Timestamp of most recent multiplier update          |
| UI Scaled Supply       | Total shares in circulation                         |
| Original Token Address | Links to on-chain explorer                          |
| Program Version        | Confirms if Token 2022 features are supported       |

<br />

# 🔚 Summary

|                   |                        |
| :---------------- | :--------------------- |
| Raw Token         | Scaled UI (Shares)     |
| On-chain reality  | UI-only transformation |
| Stable, auditable | User-friendly display  |
| Trading based     |                        |

<br />

Birdeye’s UI provides tools to toggle, analyze, and visualize both raw and scaled views so users can make informed decisions without losing touch with reality.