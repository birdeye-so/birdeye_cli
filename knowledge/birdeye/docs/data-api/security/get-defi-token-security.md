---
title: "Token - Security"
description: "Retrieve security information of a specified token."
hidden: false
metadata:
  title: Birdeye Data API | Token - Security
  description: Retrieve security information of a specified token.
  keywords:
    - blockchain
    - data
    - crypto
    - trading
    - birdeye
    - defi
    - dex
  robots: index
openapi: "openapi/data/openapi_docs.json GET /defi/token_security"
---
<Tabs>
  <Tab title="Usage Note">
  <p><strong>Token-level security and risk context.</strong></p>
  <ul>
    <li>Use this endpoint when you need safety signals before listing, surfacing, or trading a token.</li>
    <li>Designed for token review and risk scoring, not price or holder analytics.</li>
  </ul>
</Tab>

  <Tab title="Accessibility">
  <ul>
    <li>Lite</li>
    <li>Starter</li>
    <li>Premium</li>
    <li>Business</li>
    <li>Enterprise</li>
  </ul>
</Tab>

  <Tab title="Chain Supported">
  <p><strong>All supported chains except Sui</strong></p>
</Tab>
</Tabs>

<Accordion title="Compute Unit ⚙️" icon="fa-gauge-high">
  <ul>
    <li>This endpoint consumes <code>25 CU</code> per request.</li>
  </ul>
</Accordion>

<Accordion title="Use Cases 💡" icon="fa-lightbulb">
  <ul>
    <li>Add safety context to token pages, scanners, and listing workflows.</li>
    <li>Flag risky tokens before bots, alerts, or trading automations react to them.</li>
    <li>Feed internal risk review or trust-scoring pipelines.</li>
  </ul>
</Accordion>

<Accordion title="How to Use 🛠️" icon="fa-book-open">
  <ul>
    <li>Set <code>x-chain</code> for a supported non-Sui network.</li>
    <li>Pass the token <code>address</code>.</li>
    <li>Combine the result with price, liquidity, and holder data for a fuller decision picture.</li>
  </ul>
</Accordion>

<Accordion title="Best Practices ✅" icon="fa-check-circle">
  <ul>
    <li>Treat security data as one input in a broader review, not a standalone trading signal.</li>
    <li>Run this endpoint early for newly discovered tokens before deeper downstream analysis.</li>
  </ul>
</Accordion>

<br />

## Resolved API contract

GET /defi/token_security

```json
{
  "tags": [
    "Security"
  ],
  "summary": "Token - Security",
  "description": "Retrieve security information of a specified token.",
  "parameters": [
    {
      "name": "x-chain",
      "description": "A chain name listed in supported networks except Sui.",
      "in": "header",
      "required": false,
      "schema": {
        "type": "string",
        "enum": [
          "solana",
          "ethereum",
          "bsc",
          "base",
          "robinhood",
          "arc",
          "mantle",
          "hyperevm",
          "arbitrum",
          "avalanche",
          "optimism",
          "polygon",
          "zksync",
          "monad",
          "aptos",
          "fogo",
          "megaeth"
        ],
        "default": "solana"
      }
    },
    {
      "name": "address",
      "description": "The address of the token contract.",
      "in": "query",
      "required": true,
      "schema": {
        "type": "string"
      },
      "examples": {
        "wsol": {
          "value": "So11111111111111111111111111111111111111112"
        },
        "solana": {
          "value": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
        },
        "ethereum": {
          "value": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce"
        },
        "solana_scaled_ui": {
          "value": "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh"
        }
      }
    }
  ],
  "responses": {
    "200": {
      "description": "JSON object containing a security information of a token",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "required": [
              "success",
              "data"
            ],
            "properties": {
              "success": {
                "type": "boolean",
                "description": "Whether the request succeeded."
              },
              "data": {
                "oneOf": [
                  {
                    "type": "object",
                    "description": "Security profile returned for Solana tokens, including creator, authority, concentration, and token-standard controls.",
                    "additionalProperties": true,
                    "properties": {
                      "creatorAddress": {
                        "type": "string",
                        "description": "Wallet or contract address identified as the token creator or deployer."
                      },
                      "creatorBalance": {
                        "type": [
                          "number",
                          "string",
                          "null"
                        ],
                        "description": "Current token balance held by the creator address."
                      },
                      "creatorPercentage": {
                        "type": [
                          "number",
                          "string",
                          "null"
                        ],
                        "description": "Share of total supply held by creatorAddress. Multiply by 100 if you need percent display."
                      },
                      "ownerAddress": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Current token owner or privileged owner address, when the token standard exposes one."
                      },
                      "ownerBalance": {
                        "type": [
                          "number",
                          "string",
                          "null"
                        ],
                        "description": "Current token balance held by ownerAddress."
                      },
                      "ownerPercentage": {
                        "type": [
                          "number",
                          "string",
                          "null"
                        ],
                        "description": "Share of total supply held by ownerAddress. Multiply by 100 if you need percent display."
                      },
                      "totalSupply": {
                        "type": [
                          "number",
                          "string",
                          "null"
                        ],
                        "description": "Current total token supply."
                      },
                      "creatorOwnerAddress": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Owner of the creator wallet when that relationship is known."
                      },
                      "ownerOfOwnerAddress": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Owner of ownerAddress when Birdeye can resolve a higher-level owner."
                      },
                      "creationTx": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Transaction signature that created the token or mint account."
                      },
                      "creationTime": {
                        "type": [
                          "integer",
                          "null"
                        ],
                        "description": "Unix timestamp in seconds when the token was created."
                      },
                      "creationSlot": {
                        "type": [
                          "integer",
                          "null"
                        ],
                        "description": "Solana slot when the token was created."
                      },
                      "mintTx": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Transaction signature for the mint or initial issuance event."
                      },
                      "mintTime": {
                        "type": [
                          "integer",
                          "null"
                        ],
                        "description": "Unix timestamp in seconds of the mint or issuance event."
                      },
                      "mintSlot": {
                        "type": [
                          "integer",
                          "null"
                        ],
                        "description": "Solana slot of the mint or issuance event."
                      },
                      "metaplexUpdateAuthority": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Metaplex update authority that can modify on-chain token metadata."
                      },
                      "metaplexOwnerUpdateAuthority": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Owner of the Metaplex update authority, when resolvable."
                      },
                      "metaplexUpdateAuthorityBalance": {
                        "type": [
                          "number",
                          "null"
                        ],
                        "description": "Current token balance held by the Metaplex update authority."
                      },
                      "metaplexUpdateAuthorityPercent": {
                        "type": [
                          "number",
                          "null"
                        ],
                        "description": "Share of total supply held by the Metaplex update authority. Multiply by 100 if you need percent display."
                      },
                      "mutableMetadata": {
                        "type": [
                          "boolean",
                          "null"
                        ],
                        "description": "Whether token metadata is still mutable."
                      },
                      "top10HolderBalance": {
                        "type": [
                          "number",
                          "null"
                        ],
                        "description": "Combined token balance held by the top 10 holder accounts."
                      },
                      "top10HolderPercent": {
                        "type": [
                          "number",
                          "null"
                        ],
                        "description": "Combined share of total supply held by the top 10 holder accounts."
                      },
                      "top10UserBalance": {
                        "type": [
                          "number",
                          "null"
                        ],
                        "description": "Combined token balance held by the top 10 unique users after deduplicating related holder accounts."
                      },
                      "top10UserPercent": {
                        "type": [
                          "number",
                          "null"
                        ],
                        "description": "Combined share of total supply held by the top 10 unique users."
                      },
                      "isTrueToken": {
                        "type": [
                          "boolean",
                          "null"
                        ],
                        "description": "Birdeye trust heuristic for whether the token is recognized as the intended or canonical asset."
                      },
                      "fakeToken": {
                        "type": [
                          "boolean",
                          "null"
                        ],
                        "description": "Birdeye heuristic flag for likely imitation or spoofed tokens."
                      },
                      "preMarketHolder": {
                        "type": "array",
                        "description": "List of pre-market or pre-launch holders when such attribution is available.",
                        "items": {
                          "type": "object",
                          "additionalProperties": true
                        }
                      },
                      "lockInfo": {
                        "type": [
                          "object",
                          "null"
                        ],
                        "description": "Lock metadata for the token or related pool when supported.",
                        "additionalProperties": true
                      },
                      "freezeable": {
                        "type": [
                          "boolean",
                          "null"
                        ],
                        "description": "Whether the token can be frozen by a privileged authority."
                      },
                      "freezeAuthority": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Authority address that can freeze token accounts on supported token standards."
                      },
                      "transferFeeEnable": {
                        "type": [
                          "boolean",
                          "null"
                        ],
                        "description": "Whether transfer fees are enabled for the token."
                      },
                      "transferFeeData": {
                        "type": [
                          "object",
                          "null"
                        ],
                        "description": "Transfer fee configuration object for supported token standards.",
                        "additionalProperties": true
                      },
                      "isToken2022": {
                        "type": [
                          "boolean",
                          "null"
                        ],
                        "description": "Whether this asset uses the Token-2022 program."
                      },
                      "nonTransferable": {
                        "type": [
                          "boolean",
                          "null"
                        ],
                        "description": "Whether the token is configured as non-transferable."
                      },
                      "jupStrictList": {
                        "type": [
                          "boolean",
                          "null"
                        ],
                        "description": "Whether the token appears on Jupiter's strict list."
                      }
                    }
                  },
                  {
                    "type": "object",
                    "description": "Security profile returned for EVM tokens, including trading restrictions, ownership controls, tax flags, and LP lock analysis.",
                    "additionalProperties": true,
                    "properties": {
                      "creatorAddress": {
                        "type": "string",
                        "description": "Wallet or contract address identified as the token creator or deployer."
                      },
                      "creatorBalance": {
                        "type": [
                          "number",
                          "string",
                          "null"
                        ],
                        "description": "Current token balance held by the creator address."
                      },
                      "creatorPercentage": {
                        "type": [
                          "number",
                          "string",
                          "null"
                        ],
                        "description": "Share of total supply held by creatorAddress. Multiply by 100 if you need percent display."
                      },
                      "ownerAddress": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Current token owner or privileged owner address, when the token standard exposes one."
                      },
                      "ownerBalance": {
                        "type": [
                          "number",
                          "string",
                          "null"
                        ],
                        "description": "Current token balance held by ownerAddress."
                      },
                      "ownerPercentage": {
                        "type": [
                          "number",
                          "string",
                          "null"
                        ],
                        "description": "Share of total supply held by ownerAddress. Multiply by 100 if you need percent display."
                      },
                      "totalSupply": {
                        "type": [
                          "number",
                          "string",
                          "null"
                        ],
                        "description": "Current total token supply."
                      },
                      "antiWhaleModifiable": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Flag indicating whether anti-whale restrictions can still be modified."
                      },
                      "buyTax": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Configured buy tax, usually expressed as a stringified numeric value."
                      },
                      "canTakeBackOwnership": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Flag indicating whether ownership can be reclaimed after renouncing or transferring it."
                      },
                      "cannotBuy": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Flag indicating whether buys are blocked under current contract rules."
                      },
                      "cannotSellAll": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Flag indicating whether users may be prevented from fully selling their holdings."
                      },
                      "externalCall": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Flag for whether the contract performs external calls that may affect trading behavior or risk."
                      },
                      "hiddenOwner": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Flag for whether hidden ownership or hidden privileged control is detected."
                      },
                      "holderCount": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Number of holder addresses tracked for the token."
                      },
                      "honeypotWithSameCreator": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Count of honeypot tokens previously linked to the same creator, when available."
                      },
                      "isAntiWhale": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Flag indicating anti-whale limits such as max wallet or max transaction rules."
                      },
                      "isBlacklisted": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Flag indicating blacklist logic exists or is currently active."
                      },
                      "isHoneypot": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Flag indicating honeypot behavior was detected."
                      },
                      "isInDex": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Flag indicating whether the token is currently trading on a decentralized exchange."
                      },
                      "isMintable": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Flag indicating the token supply can still be minted."
                      },
                      "isOpenSource": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Flag indicating verified or open-source contract code is available."
                      },
                      "isProxy": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Flag indicating the token contract uses a proxy pattern."
                      },
                      "isWhitelisted": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Flag indicating whitelist logic exists or can control who is allowed to trade."
                      },
                      "lpHolderCount": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Number of tracked LP holder addresses for the token's main liquidity pools."
                      },
                      "lpHolders": {
                        "type": "array",
                        "description": "Liquidity-provider holders and locker contracts associated with the token's LP supply.",
                        "items": {
                          "type": "object",
                          "additionalProperties": true,
                          "properties": {
                            "address": {
                              "type": "string",
                              "description": "LP holder or locker address."
                            },
                            "tag": {
                              "type": [
                                "string",
                                "null"
                              ],
                              "description": "Human-readable label for the LP holder, such as a locker provider name."
                            },
                            "value": {
                              "type": [
                                "number",
                                "string",
                                "null"
                              ],
                              "description": "Auxiliary valuation field when available from the underlying security provider."
                            },
                            "is_contract": {
                              "type": [
                                "integer",
                                "boolean",
                                "null"
                              ],
                              "description": "Whether the LP holder address is a contract."
                            },
                            "balance": {
                              "type": [
                                "number",
                                "string",
                                "null"
                              ],
                              "description": "LP token balance held by this address."
                            },
                            "percent": {
                              "type": [
                                "number",
                                "string",
                                "null"
                              ],
                              "description": "Share of LP total supply held by this address."
                            },
                            "NFT_list": {
                              "type": [
                                "array",
                                "null"
                              ],
                              "description": "Associated NFT positions when the locker or LP position is NFT-based.",
                              "items": {
                                "type": "object",
                                "additionalProperties": true
                              }
                            },
                            "is_locked": {
                              "type": [
                                "integer",
                                "boolean",
                                "null"
                              ],
                              "description": "Whether the LP position is currently locked or burned."
                            },
                            "locked_detail": {
                              "type": [
                                "array",
                                "null"
                              ],
                              "description": "Detailed lock tranches for this LP holder when available.",
                              "items": {
                                "type": "object",
                                "additionalProperties": true,
                                "properties": {
                                  "amount": {
                                    "type": [
                                      "number",
                                      "string",
                                      "null"
                                    ],
                                    "description": "Amount of LP tokens covered by this lock tranche."
                                  },
                                  "end_time": {
                                    "type": [
                                      "string",
                                      "null"
                                    ],
                                    "description": "ISO-8601 timestamp when this lock tranche unlocks."
                                  },
                                  "opt_time": {
                                    "type": [
                                      "string",
                                      "null"
                                    ],
                                    "description": "ISO-8601 timestamp when the lock operation was recorded."
                                  }
                                }
                              }
                            }
                          }
                        }
                      },
                      "lpTotalSupply": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Total LP token supply tracked for the token's primary liquidity pools."
                      },
                      "ownerChangeBalance": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Owner balance delta or owner-controlled balance metric from the security provider."
                      },
                      "personalSlippageModifiable": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Flag indicating per-wallet slippage rules can still be changed."
                      },
                      "sellTax": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Configured sell tax, usually expressed as a stringified numeric value."
                      },
                      "slippageModifiable": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Flag indicating trading slippage constraints can still be modified."
                      },
                      "tokenName": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Token name reported by the security provider."
                      },
                      "tokenSymbol": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Token symbol reported by the security provider."
                      },
                      "tradingCooldown": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Flag indicating whether cooldown rules exist between trades."
                      },
                      "transferPausable": {
                        "type": [
                          "string",
                          "null"
                        ],
                        "description": "Flag indicating token transfers can be paused by a privileged role."
                      }
                    }
                  }
                ],
                "description": "Token security profile. Returned shape depends on the chain family."
              }
            }
          },
          "examples": {
            "Solana": {
              "value": {
                "data": {
                  "creatorAddress": "9AhKqLR67hwapvG8SA2JFXaCshXc9nALJjpKaHZrsbkw",
                  "creatorOwnerAddress": null,
                  "ownerAddress": null,
                  "ownerOfOwnerAddress": null,
                  "creationTx": "2K5X6HT9QZ8dcApbWL6mzYw6WBDvL5vWndTpGrFkQuMfuStGTP5LxPNQnnn5v5KR2T6UD1zEXnfCdajzUfuCPZgS",
                  "creationTime": 1670531612,
                  "creationSlot": 165714665,
                  "mintTx": "44Jfxh3VFp6N2h3CLMGeHHxeexdtUnHRsvQ2QXF9h9JqHiBvjt2xCbJg7G443hPVvG4y5VP95iaiSRKuLVVcadCe",
                  "mintTime": 1683780182,
                  "mintSlot": 193273646,
                  "creatorBalance": 48343.76164,
                  "ownerBalance": null,
                  "ownerPercentage": null,
                  "creatorPercentage": 5.44198858929173e-10,
                  "metaplexUpdateAuthority": "9AhKqLR67hwapvG8SA2JFXaCshXc9nALJjpKaHZrsbkw",
                  "metaplexOwnerUpdateAuthority": null,
                  "metaplexUpdateAuthorityBalance": 48343.76164,
                  "metaplexUpdateAuthorityPercent": 5.44198858929173e-10,
                  "mutableMetadata": true,
                  "top10HolderBalance": 27020571907755.746,
                  "top10HolderPercent": 0.3041667404641445,
                  "top10UserBalance": 27020571907755.746,
                  "top10UserPercent": 0.3041667404641445,
                  "isTrueToken": null,
                  "fakeToken": null,
                  "totalSupply": 88834735403757.8,
                  "preMarketHolder": [],
                  "lockInfo": null,
                  "freezeable": null,
                  "freezeAuthority": null,
                  "transferFeeEnable": null,
                  "transferFeeData": null,
                  "isToken2022": false,
                  "nonTransferable": null,
                  "jupStrictList": true
                },
                "success": true
              }
            },
            "EVM": {
              "value": {
                "data": {
                  "antiWhaleModifiable": "1",
                  "buyTax": "0",
                  "canTakeBackOwnership": "1",
                  "cannotBuy": "0",
                  "cannotSellAll": "0",
                  "creatorAddress": "0xf103d2aba493749a402b7de11cf31f5844062b74",
                  "creatorBalance": "3808465770.234542109",
                  "creatorPercentage": "0.000000",
                  "externalCall": "0",
                  "hiddenOwner": "0",
                  "holderCount": "1878049",
                  "honeypotWithSameCreator": "9",
                  "isAntiWhale": "1",
                  "isBlacklisted": "0",
                  "isHoneypot": "0",
                  "isInDex": "1",
                  "isMintable": "0",
                  "isOpenSource": "1",
                  "isProxy": "0",
                  "isWhitelisted": "1",
                  "lpHolderCount": "1166",
                  "lpHolders": [
                    {
                      "address": "0x407993575c91ce7643a4d4ccacc9a98c36ee1bbe",
                      "tag": "PinkLock02",
                      "value": null,
                      "is_contract": 1,
                      "balance": "215866.727575831313305613",
                      "percent": "0.697982323890454407",
                      "NFT_list": null,
                      "is_locked": 1,
                      "locked_detail": [
                        {
                          "amount": "108702.712185185487786736",
                          "end_time": "2024-11-30T12:49:00+00:00",
                          "opt_time": "2023-11-01T23:07:06+00:00"
                        },
                        {
                          "amount": "107164.015390645825518877",
                          "end_time": "2024-11-30T23:06:00+00:00",
                          "opt_time": "2023-11-01T23:07:06+00:00"
                        }
                      ]
                    },
                    {
                      "address": "0x000000000000000000000000000000000000dead",
                      "tag": "",
                      "value": null,
                      "is_contract": 0,
                      "balance": "92623.746470095960966348",
                      "percent": "0.299489127086188853",
                      "NFT_list": null,
                      "is_locked": 1
                    }
                  ],
                  "lpTotalSupply": "309272.484685028715377955",
                  "ownerAddress": "0x0000000000000000000000000000000000000000",
                  "ownerBalance": "0",
                  "ownerChangeBalance": "0",
                  "ownerPercentage": "0.000000",
                  "personalSlippageModifiable": "0",
                  "sellTax": "0",
                  "slippageModifiable": "1",
                  "tokenName": "Baby Doge Coin",
                  "tokenSymbol": "BabyDoge",
                  "totalSupply": "420000000000000000",
                  "tradingCooldown": "0",
                  "transferPausable": "0"
                },
                "success": true
              }
            }
          }
        }
      }
    },
    "400": {
      "description": "Bad Request",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "success": {
                "type": "boolean"
              },
              "message": {
                "type": "string"
              }
            }
          },
          "example": {
            "success": false,
            "message": "Bad request"
          }
        }
      }
    },
    "401": {
      "description": "Unauthorized. API key is missing or invalid",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "success": {
                "type": "boolean"
              },
              "message": {
                "type": "string"
              }
            }
          },
          "example": {
            "success": false,
            "message": "Unauthorized"
          }
        }
      }
    },
    "403": {
      "description": "Forbidden. Request is blacklisted or not whitelisted",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "success": {
                "type": "boolean"
              },
              "message": {
                "type": "string"
              }
            }
          },
          "example": {
            "success": false,
            "message": "Access Denied"
          }
        }
      }
    },
    "429": {
      "description": "Too Many Requests. Rate limit reached",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "success": {
                "type": "boolean"
              },
              "message": {
                "type": "string"
              }
            }
          },
          "example": {
            "success": false,
            "message": "Too many requests"
          }
        }
      }
    },
    "500": {
      "description": "Internal Server Error",
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "success": {
                "type": "boolean"
              },
              "message": {
                "type": "string"
              }
            }
          },
          "example": {
            "success": false,
            "message": "Internal Server Error"
          }
        }
      }
    }
  },
  "operationId": "get-defi-token_security",
  "x-mint": {
    "href": "/data-api/security/get-defi-token-security"
  },
  "security": [
    {
      "apiKeyAuth": []
    }
  ],
  "servers": [
    {
      "url": "https://public-api.birdeye.so"
    }
  ]
}
```
