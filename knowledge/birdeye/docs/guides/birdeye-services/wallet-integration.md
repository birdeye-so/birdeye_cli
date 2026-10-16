---
description: "''"
title: Wallet Integration
excerpt: Instructions for Wallet Providers to Integrate Their Wallets into Birdeye
deprecated: false
hidden: false
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
# Key Concepts to Know

**Wallet Adapter:** This is an open-source library that provides components and APIs to integrate cryptocurrency wallets into blockchain applications (dApps). It simplifies the process for developers by allowing them to add wallet support to their applications without having to write code from scratch for each wallet.

**Connector (EVM)/Adapter (Solana)**: This refers to the specific code written for each wallet type according to the interface and conventions of the Wallet Adapter. Wallet providers must provide this code for Birdeye to integrate the wallet into our UI.

***

# How to Integrate a Wallet into Birdeye

## Wallets on Solana

### Using the [Solana Wallet Adapter](https://github.com/anza-xyz/wallet-adapter) library

* **Wallets with[Solana Wallet Standard](https://github.com/wallet-standard/wallet-standard) Implementation**: If your wallet has implemented the [Solana Wallet Standard](https://github.com/wallet-standard/wallet-standard) and the user has installed the wallet, the [Wallet Adapter](https://github.com/anza-xyz/wallet-adapter) will automatically detect and display your wallet in the "Connect Wallet" section. ***No additional integration work is required from your side.***
* **Wallets without[Solana Wallet Adapter](https://github.com/anza-xyz/wallet-adapter) Integration**: If your wallet has not integrated the Solana Wallet Adapter, you will need to **write an adapter** for the Solana Wallet Adapter to enable integration into Birdeye. Contact us after you have these details ready.

***

## Wallets on EVM Compatible Blockchains

For example: Ethererum, BNB SmartChain, Polygon, etc.

### Using the [wagmi (v1) library](https://wagmi.sh/):

\*\*Providing a [Connector\*\*](https://wagmi.sh/react/api/connectors): If your wallet wants to integrate into Birdeye, you need to provide a [Connector for wagmi (v1)](https://wagmi.sh/react/api/connectors) specific to your wallet. For example, to integrate Coinbase on EVM, use the Connector written by Coinbase for wagmi (v1).

*Note that EVM does not yet have a standard Wallet Standard like Solana or Sui.*

***

## Wallets on Sui

### Using the [wallet-kit library](https://github.com/suiet/wallet-kit):

**Wallets with Sui Wallet Standard Implementation**: Sui has its own Sui Wallet Standard. If your wallet has implemented the Sui Wallet Standard and the user has installed the wallet, the Wallet Adapter (wallet-kit) will automatically detect and display your wallet in the "Connect Wallet" section. ***No additional integration work is required from your side.***

***

By following these guidelines, you can efficiently integrate your cryptocurrency wallets into Birdeye, leveraging the standardized libraries and conventions provided by Wallet Adapters. If you have any questions or need further assistance, please contact our support team.
